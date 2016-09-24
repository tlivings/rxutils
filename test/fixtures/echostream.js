'use strict';

const DuplexStream = require('stream').Duplex;

class EchoStream extends DuplexStream {
    constructor(options) {
        super(options);

        this._pending = [];
    }

    _read() {
        while (this._pending.length > 0) {
            this.push(this._pending.shift());
        }
    }

    _write(data, enc, callback) {
        this._pending.push(data);

        callback();
    }
}

module.exports = EchoStream;