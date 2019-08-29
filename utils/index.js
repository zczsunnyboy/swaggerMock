const { join, dirname } = require('path');
const { get, set } = require('./storage');
const { userOptions } = require('./../config');

// 首字符大写
const toFirstUpperCase = str => str.charAt(0).toUpperCase() + str.slice(1);

// 下划线转换驼峰
const toHump = str => str.replace(/\_(\w)/g, (all, letter) => letter.toUpperCase());

// 驼峰转换下划线
const toLine = str => str.replace(/([A-Z])/g, "_$1").toLowerCase();

// 获取文件目录
const fileDir = file => dirname(__dirname) + file;
const fileJoin = (...file) => join(__dirname, ...file)

// 判断是否登录
const isLogin = () => get(fileDir(userOptions.file));

// 登录后写入文件
const loginWrite = json => set(fileDir(userOptions.file), JSON.stringify(json));

// time formart
const getDate = d => {
    const change = t => {
        if (t < 10) {
            return '0' + t
        } else {
            return t
        }
    }

    const year = d.getFullYear();
    const month = change(d.getMonth() + 1);
    const day = change(d.getDate());
    const hour = change(d.getHours());
    const minute = change(d.getMinutes());
    const second = change(d.getSeconds());

    return `${year}-${month}-${day}-${hour}:${minute}:${second}`
}

module.exports = {
    toFirstUpperCase,
    toHump,
    toLine,
    fileDir,
    fileJoin,
    isLogin,
    loginWrite,
    getDate
}