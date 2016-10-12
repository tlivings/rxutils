'use strict';

const Test = require('tape');
const DuplexStreamSubject = require('../lib/duplexstreamsubject');
const EchoStream = require('./fixtures/echostream');

Test.only('test duplex stream subject', (t) => {

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
