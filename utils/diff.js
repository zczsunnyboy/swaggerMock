const { getDate } = require('./index');

let difference = '';
let count = 1;

const diffChild = part => {
    difference += `
build time: ${getDate(new Date())}, today modify ${count++} times!`;

    for (let key of part) {
        const { type, content } = key;
        if (type === 'add') {
            difference += `
新增字段: ${JSON.stringify(content)} \n`
        } else if (type === 'delete') {
            difference += `
删除字段: ${JSON.stringify(content)} \n`
        } else {
            difference += `
修改字段: 从 ${JSON.stringify(content[0])} 改为 ${JSON.stringify(content[1])} \n`
        }
    }

    difference += `
    
    `;

    return difference
}

const diffKey = (oldname, newname, diffArr, blacklist) => {
    for (let item in oldname) {
        const oldPart = oldname[item];
        const newPart = newname[item];

        if (oldPart && !newPart) {
            diffArr.push({
                type: 'delete',
                content: { [item]: oldPart }
            })
        } else if (oldPart && newPart && JSON.stringify(oldPart) !== JSON.stringify(newPart)) {
            if (blacklist && blacklist.includes(item)) {
                continue
            }
            if (typeof newPart === 'object' && typeof oldPart === 'object') {
                diffKey(oldPart, newPart, diffArr, blacklist);
            }
            diffArr.push({
                type: 'modify',
                content: [
                    { [item]: oldPart },
                    { [item]: newPart }
                ]
            })
        }
    }
    for (let item in newname) {
        const oldPart = oldname[item];
        const newPart = newname[item];
        if (!oldPart && newPart) {
            diffArr.push({
                type: 'add',
                content: { [item]: newPart }
            })
        }
    }
}

const diffJosn = (oldfile, newfile, blacklist) => {
    const differencearr = [];
    diffKey(oldfile, newfile, differencearr, blacklist);

    return diffChild(differencearr)
}

module.exports = {
    diffJosn
}