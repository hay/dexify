#!/usr/bin/env node
const { readJsonFile } = require('./lib/util.js');
const Dexify = require('./lib/dexify.js');

const pkg = readJsonFile('./package.json');

const Parser = require('argparse').ArgumentParser;

const parser = new Parser({
    description : pkg.description
});

parser.addArgument('path', { help : 'Path to file(s)'});
parser.addArgument(['-t', '--template'], {
    defaultValue : './template/template.html',
    help : 'Path to the Handlebars template file'
})

const args = parser.parseArgs();
const dexify = new Dexify(args);
dexify.run();