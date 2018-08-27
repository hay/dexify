const { readFile, readTemplate, writeFile } = require('./util.js');
const pathlib = require('path');
const globby = require('globby');
const marked = require('marked');

class Dexify {
    constructor(args) {
        this.args = args;
        this.template = readTemplate(this.args.template);
    }

    async run() {
        const paths = await globby(this.args.path);

        paths.forEach((path) => {
            let htmlContent;
            const parsedPath = pathlib.parse(path);
            const ext = parsedPath.ext.slice(1);

            if (ext === 'md') {
                const text = readFile(path, 'utf-8');
                htmlContent= marked(text);
            }

            if (htmlContent) {
                delete parsedPath.base;
                parsedPath.ext = '.html';
                const htmlPath = pathlib.format(parsedPath);

                const html = this.template({
                    content : htmlContent
                });

                writeFile(htmlPath, html);
            }
        });
    }
}

module.exports = Dexify;