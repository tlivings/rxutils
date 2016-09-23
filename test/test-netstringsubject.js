'use strict';

const Test = require('tape');
const NetstringSubject = require('../lib/netstringsubject');
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

Test.only('test netstring stream subject', (t) => {

    t.test('plan', (t) => {
        t.plan(3);

        const subject = new NetstringSubject(new EchoStream());

        subject.subscribe(
            (x) => {
                console.log(x.toString());
                t.ok(x, 'received value.');
            }
        );

        subject.next('hello world!');
        subject.next('4:good,4:bye!');
        subject.complete();

    });

});
