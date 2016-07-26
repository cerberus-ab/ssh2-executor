'use strict';

const _ = require('lodash');
const Client = require('ssh2').Client;

// connection defaults
let defaults = {
    host: '127.0.0.1',
    port: 22,
    username: 'administrator',
    password: null
};

class Executor {
    /**
     * Executor class static method run
     *
     * @static
     * @method Executor.run
     * @param {object} settings
     * @param {Array} commands
     * @param {function} reduce Arguments: {Array} results, {object} timing
     */
    static run(settings, commands, reduce) {
        if (!commands.length) throw new Error('nothing to execute');

        let conn = new Client(),
            results = [],
            count = 0,
            begTime = +new Date;

        conn
            .on('ready', () => {
                _.each(commands, (cmd, i) => {
                    results[i] = '';

                    conn.exec(cmd, function(err, stream) {
                        if (err) throw err;

                        stream
                            .on('close', (code, signal) => {
                                if (++count == commands.length) conn.end();
                            })
                            .on('data', (data) => { results[i] += data; })
                            .stderr.on('data', (data) => { results[i] += data; });
                        });
                    });
                })
            .on('error', (err) => { throw err; })
            .on('end', () => { reduce(results, { beg: begTime, end: +new Date }); })
            .connect(_.extend({}, defaults, _.pick(settings, _.keys(defaults))));
        }
    }

module.exports = Executor;