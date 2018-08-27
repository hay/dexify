#!/usr/bin/env node
const { readLibFile } = require('./lib/util.js');
const Dexify = require('./lib/dexify.js');

const pkg = JSON.parse(readLibFile('./package.json'));

const Parser = require('argparse').ArgumentParser;

const parser = new Parser({
    description : pkg.description,
    prog : pkg.name
});

parser.addArgument('path', { help : 'Path to file(s)'});
parser.addArgument(['-t', '--template'], {
    defaultValue : './template/template.html',
    help : 'Path to the Handlebars template file (defaults to built-in template)'
});
parser.addArgument(['-v', '--verbose'], {
    action : 'storeTrue',
    dest : 'debug',
    help : 'Print debug information'
});

// Check if we have got any arguments, otherwise print help
if (process.argv.length == 2) {
    parser.printHelp();
} else {
    const args = parser.parseArgs();
    const dexify = new Dexify(args);
    dexify.run();
}