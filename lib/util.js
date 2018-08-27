const fs = require('fs');
const handlebars = require('handlebars');

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function readTemplate(path) {
    const file = readFile(path);
    return handlebars.compile(file);
}

function readJsonFile(path) {
    const file = readFile(path);
    return JSON.parse(file);
}

function writeFile(path, data) {
    fs.writeFileSync(path, data);
}

module.exports = { readFile, readTemplate, readJsonFile, writeFile };