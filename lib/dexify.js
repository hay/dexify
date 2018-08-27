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
        this.log(`Transforming files in path '${this.args.path}'`);
    }

    log(str) {
        if (this.args.debug) {
            console.log(str);
        }
    }

    async run() {
        const paths = await globby(this.args.path);
        paths.forEach(p => this.transform(p));
    }

    transform(path) {
        let transformer;
        const parsedPath = pathlib.parse(path);
        const ext = parsedPath.ext.slice(1).toLowerCase();

        // Skip HTML files
        if (ext === 'html') {
            return;
        }

        this.log(`Transforming '${path}'`)

        if (ext in transformers) {
            transformer = transformers[ext];
            this.log(`This is a '${ext}' file, transforming...`);
        } else {
            this.log(`No transformer for file type '${ext}'`);
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

        this.log(`Saved as '${htmlPath}'`)
    }
}

module.exports = Dexify;