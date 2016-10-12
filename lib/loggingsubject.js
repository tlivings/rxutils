'use strict';

const PassThrough = require('stream').PassThrough;
const DuplexStreamSubject = require('./duplexstreamsubject');
const Callermodule = require('callermodule');

class LoggingSubject extends DuplexStreamSubject {
    constructor(name = '') {
        super(new PassThrough());

        this.source = Callermodule().name;
    }

    next(x) {
        const timestamp = new Date();
        const data = Object.assign(x, { timestamp, name });
        super.next(data);
    }
}

module.exports = LoggingSubject;
