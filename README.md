# ssh2-executor
Execute one or more commands on the target machine by ssh2 and reduce results.

### Installation
Install ssh2-executor using npm:
```
$ npm install ssh2-executor --save-dev
```

### Usage
```
const Executor = require('ssh2-executor');
Executor.run({object} argv, {Array} commands, {function} reduce);
```
* `argv` {object} SSH2 connection options:
    * `host` {string} Default: localhost
    * `port` {number} Default: 22
    * `username` {string} Default: administrator
    * `password` {string} Default: null
* `commands` {Array} Commands to execute
* `reduce` {function} Reduce function takes next parameters:
    * `resutls` {Array} Result outputs according to commands
    * `timing` {object} total beg, end ms

### Example
Execute `whoami` and `hostname` commands on the target machine, compare with the expected values and out boolean answer:
```javascript
'use strict';
const argv = require('optimist').argv;
const Executor = require('ssh2-executor');

Executor.run(argv, [
    'whoami',
    'hostname'

], (results, t) => {
    console.log(/^administrator\s?/.test(results[0]) && /^SuperMachine\s?/.test(results[1]));
    console.log(`Execution Time ${t.end - t.beg} ms`);
});
```
Output:
```
true
Execution Time 923 ms
```
