const fs = require('fs');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(mkdirp);

// 读取
const get = async (key, flag = 'w+') => await readFile(key, { flag });

// 存储
const set = async (key, json, flag = 'w+') => await writeFile(key, json, { flag });

// 清除内容
const clear = async (key, flag = 'w+') => await writeFile(key, '', { flag });

// 删除
const remove = async key => await unlink(key);

// 生成目录
const createDir = async key => await mkdir(key);

module.exports = {
    get,
    set,
    clear,
    remove,
    createDir
}