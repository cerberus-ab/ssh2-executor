'use strict';

const argv = require('optimist').argv;
const Executor = require('../ssh2exe');

Executor.run(argv, [
    'whoami',
    'hostname'

], (results, t) => {
    console.log(/^administrator\s?/.test(results[0]) && /^SuperMachine\s?/.test(results[1]));
    console.log(`Execution Time ${t.end - t.beg} ms`);

});