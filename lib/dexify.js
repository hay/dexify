const { readFile, readTemplate, writeFile } = require('./util.js');
const pathlib = require('path');
const globby = require('globby');
const marked = require('marked');

const transformers = {
    md(str) {
        return marked(str);
    }
};

class Dexify {
    constructor(args) {
        this.args = args;
        this.template = readTemplate(this.args.template);
    }

    async run() {
        const paths = await globby(this.args.path);
        paths.forEach(p => this.transform(p));
    }

    transform(path) {
        let transformer;
        const parsedPath = pathlib.parse(path);
        const ext = parsedPath.ext.slice(1);

        if (ext in transformers) {
            transformer = transformers[ext];
        } else {
            return;
        }

        const text = readFile(path);
        const htmlContent = transformer(text);

        delete parsedPath.base;
        parsedPath.ext = '.html';
        const htmlPath = pathlib.format(parsedPath);

        const html = this.template({
            content : htmlContent
        });

        writeFile(htmlPath, html);
    }
}

module.exports = Dexify;