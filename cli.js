#!/usr/bin/env node

const chalk = require('chalk');
const mdlinks  = require('./index.js');
const path = process.argv[2];

console.log(chalk.cyan(`

███╗░░░███╗██████╗░░░░░░░██╗░░░░░██╗███╗░░██╗██╗░░██╗░██████╗
████╗░████║██╔══██╗░░░░░░██║░░░░░██║████╗░██║██║░██╔╝██╔════╝
██╔████╔██║██║░░██║█████╗██║░░░░░██║██╔██╗██║█████═╝░╚█████╗░
██║╚██╔╝██║██║░░██║╚════╝██║░░░░░██║██║╚████║██╔═██╗░░╚═══██╗
██║░╚═╝░██║██████╔╝░░░░░░███████╗██║██║░╚███║██║░╚██╗██████╔╝
╚═╝░░░░░╚═╝╚═════╝░░░░░░░╚══════╝╚═╝╚═╝░░╚══╝╚═╝░░╚═╝╚═════╝░

`));

const options = process.argv;
const validate = options.includes('--v') || options.includes('--validate') ? true : false;
const stats = options.includes('--s') || options.includes('--stats') ? true : false;

mdlinks(path, {validate: validate, stats: stats})
    .then(resp => console.log(resp))
    .catch(err => console.log(err))
