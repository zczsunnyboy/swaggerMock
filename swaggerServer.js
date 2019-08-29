'use strict'

const { join } = require('path');
const axios = require('axios');
const swaggerParserMock = require('swagger-parser-mock');
const { devApiOptions, loginOptions, swaggerMockFile, swaggerOptions, diffOptions, proxyHost } = require('./config');
const { toFirstUpperCase, toHump } = require('./utils');
const { set, get, createDir } = require('./utils/storage');
const { diffJosn } = require('./utils/diff');
const { loginApi } = require('./http');

const syncSwagger = {
    swaggerApiObj: {},
    init({ url, outputPath, blacklist }) {
        this.url = url;
        this.outputPath = outputPath;
        this.blacklist = blacklist;
        setInterval(() => this.startServe(), swaggerOptions.restartTime)
    },

    startServe() {
        axios.get(devApiOptions.url).then(async res => {
            const json = JSON.stringify(res.data);
            try {
                // get old swagger json
                const swaggerMockDir = join(__dirname, swaggerMockFile);
                const oldSwagger = await ger(swaggerMockDir, 'a+');
                const oldSwaggerJson = oldSwagger.toString();
                // call the login interface according to the switch
                if (loginOptions.turnOn) this.startLogin();
                // diff old and new
                if (oldSwaggerJson !== json) {
                    // collect difference
                    if (diffOptions.turnOn) {
                        const differenceDoc = diffJosn(oldSwaggerJson ? JSON.parse(oldSwaggerJson) : {}, JSON.parse(json), diffOptions.blackList)
                        const diffFile = join(__dirname, diffOptions.file);
                        await set(diffFile, differenceDoc);
                        console.log(`[checkout diff]: add Mock JSON: ${diffFile}`)
                    }
                }
                // set new swagger json
                await set(swaggerMockDir, json);
                console.log(`[add mock json]: ${swaggerMockDir}`)
                this.parse()
            } catch(err) {
                console.log(err)
            }
        })
    },

    async startLogin() {
        await loginApi(loginOptions)
    },

    async parse() {
        try {
            const { paths } = await swaggerParserMock(this.url);
            if (swaggerOptions.turnOn) await this.traverse(paths);
            if (devApiOptions.turnOn) this.generateApi(this.swaggerApiObj) 
        } catch(err) {
            console.log(err)
        }
    },

    // 遍历api paths信息
    traverse(paths) {
        for (let path in paths) {
            if (devApiOptions.turnOn) this.dealwithData(path, paths[path])

            if (this.blackList.includes(path)) {
               continue 
            }

            for (let method in paths[path]) {
                const pathInfo = paths[path][method]

                if (!pathInfo['responses']['200']) {
                    continue
                }

                this.generateMock(path, method, pathInfo)
            }
        }
    },

    // 处理paths数据
    dealwithData(key, path) {
        Object.keys(path).forEach(item => {
            const devApi = key.replace(proxyHost, '').split('/');
            devApi.shift()
            if (devApi[devApi.length-1].indexOf('{') > -1) devApi.splice(devApi.length-1, 1, 'code')

            const devApiPath = devApi.shift()

            if (!devApiOptions.blackList.includes(devApiPath)) {
                const devApilast = devApi.map(itemchild => toHump(toFirstUpperCase(itemchild))).join('') + toFirstUpperCase(item)

                if (!this.swaggerApiObj.hasOwnProperty(devApiPath)) this.swaggerApiObj[devApiPath] = {}

                this.swaggerApiObj[devApiPath][devApilast] = [];
                this.swaggerApiObj[devApiPath][devApilast].push({key, path})
            }
        })
    },

    async generateMock(path, method, pathInfo) {
        const outputPath = join(__dirname, this.outputPath, path);
        const { summary, responses: { 200: responseOK } } = pathInfo;

        try {
            const example = responseOK['example'];
            // 生成目录
            await createDir(outputPath);
            // 生成文件内容
            const template = this.getTemplateMock({ summary, example, method, path })
            // 生成文件
            const EditPath = join(outputPath, `${method}.js`)

            await set(EditPath, template);

            console.log(`[add Mock api dir]: ${EditPath}`)
        } catch(err) {
            console.log(err)
        }
    },

    getTemplateMock({ summary, example, method, path }) {
        return (
            `
/**
 * ${summary}
 * /
 
 const Mock = require('mockjs');
 
 module.exports = app => {
     app.${method}('${path.replace(/\{([^}]*)\}/g, ":$1")}', (req, res) => {
        res.json(Mock.mock(${example}))
     })
 }`
        )
    },

    async generateApi(obj) {
        const objLength = Object.keys(obj).length;
        let count = 1, strarr = [];

        for (let path in obj) {
            const content = obj[path];
            const outputPath = (devApiOptions.configFiles && join(devApiOptions.configFiles, path)) || join(__dirname, devApiOptions.defaultFiles, path)
            const outputPathApi = devApiOptions.configFiles || join(__dirname, devApiOptions.defaultFiles);

            try {
                // 生成目录
                await createDir(outputPath);
                // 生成文件内容
                const template = this.getTemplateApi(path, content);
                strarr.push(path);
                // 生成文件
                const EditPath = join(outputPath, 'index.js');
                const EditPathApi = join(outputPathApi, 'index.js');
                await set(EditPath, template);

                if (count++ === objLength) {
                    const str = this.getTemplatehttpApi(strarr);
                    await set(EditPathApi, str)
                }

                console.log(`[add Api json file]: ${EditPath}`)
            } catch(err) {
                console.log(err)
            }
        }
    },

    getTemplateApi(path, content) {
        const countLength = Object.keys(content).length;
        let str = '', count = 1;

        for (let item in content) {
            const pathco = content[item];
            for (let itemName in pathco) {
                const url = pathco[itemName]['key'];
                const content = pathco[itemName]['path'];
                for (let itempath in content) {
                    const childco = content[itempath];
                    const { summary } = childco;

                    if (count === 1) str = `
/**
 * ${path}
 * /
 
 export default {`
                    str += `
    // ${summary}
    [\`${path}${item}\`]: {
        url: '${url}',
        type: '${itempath}'
    },`

                    if (count++ === countLength) {
                        str += '}';
                        return str
                    }
                }
            }
        }
    },

    getTemplatehttpApi(paths) {
        const objLength = paths.length;
        let count = 1, str = '';

        paths.forEach(item => str += `
import ${toHump(toFirstUpperCase(item))} from './${item}';`);
        
        str += '\n';

        paths.forEach(item => {
            if (count === 1) str += `
export const API = Object.freeze({`;
            str += `
    ...${toHump(toFirstUpperCase(item))}`
            if (count++ === objLength) str += `
})`
        })

        return str
    }
}

module.exports = syncSwagger
