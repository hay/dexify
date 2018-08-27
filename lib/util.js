const pathlib = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const ROOT = pathlib.dirname(require.main.filename);

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function readTemplate(path) {
    const file = readLibFile(path);
    return handlebars.compile(file);
}

function readLibFile(path) {
    const realPath = pathlib.resolve(ROOT, path);
    return readFile(realPath);
}

function writeFile(path, data) {
    fs.writeFileSync(path, data);
}

module.exports = { readFile, readTemplate, readLibFile, writeFile };