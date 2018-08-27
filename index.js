#!/usr/bin/env node
const fs = require('fs');
const pathlib = require('path');
const globby = require('globby');
const marked = require('marked');

const pkg = fs.readFileSync('./package.json', 'utf-8');
const pkgData = JSON.parse(pkg);

const Parser = require('argparse').ArgumentParser;

const parser = new Parser({
    description : pkgData.description
});

parser.addArgument('path', { help : 'Path to file(s)'});

async function main(args) {
    const paths = await globby(args.path);

    paths.forEach((path) => {
        let html;
        const parsedPath = pathlib.parse(path);
        const ext = parsedPath.ext.slice(1);

        if (ext === 'md') {
            const text = fs.readFileSync(path, 'utf-8');
            html = marked(text);
        }

        if (html) {
            delete parsedPath.base;
            parsedPath.ext = '.html';
            const htmlPath = pathlib.format(parsedPath);
            fs.writeFileSync(htmlPath, html);
        }
    });
}

const args = parser.parseArgs();
main(args);