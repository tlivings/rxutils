'use strict';

const Test = require('tape');
const DuplexStreamSubject = require('../lib/duplexstreamsubject');
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

Test('test duplex stream subject', (t) => {

    t.test('plan', (t) => {
        t.plan(1);

        const subject = new DuplexStreamSubject(new EchoStream());

        subject.subscribe(
            (x) => {
                t.ok(x, 'received value.');
            }
        );

        subject.next('data');
        subject.complete();
    });

});
