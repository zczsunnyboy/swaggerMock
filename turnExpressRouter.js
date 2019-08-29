const fs = require('fs');
const { join } = require('path');
const { swaggerOptions } = require('./config');
const { createDir } = require('./utils/storage');
const outputPath = join(__dirname, swaggerOptions.outputPath);

const resolveRoute = (path, app) => {
    const files = fs.readdirSync(path);

    files.forEach(item => {
        const getPath = join(path, item);
        const getStats = fs.statSync(getPath);

        if (getStats.isDirectory()) resolveRoute(getPath, app);
        
        if (getStats.isFile()) require(getPath)(app)
    })
}

module.exports = async (path, app) => {
    await createDir(outputPath);

    resolveRoute(join(__dirname, path), app)
}