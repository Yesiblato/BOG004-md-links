#!/usr/bin/env nodo

const mdlinks = require('./index.js');

const path = process.argv[2];
const options = process.argv;

const validate = options.includes('--v') || options.includes('--validate') ? '--v' : '';
const stats = options.includes('--s') || options.includes('--stats') ? '--s' : '';

mdlinks(path, {validate, stats});