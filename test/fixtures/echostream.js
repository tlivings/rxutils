'use strict';

const PassThrough = require('stream').PassThrough;

class EchoStream extends PassThrough {
    constructor(options) {
        super(options);
    }
}

module.exports = EchoStream;
