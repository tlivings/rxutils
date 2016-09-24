'use strict';

const Test = require('tape');
const NetstringSubject = require('../lib/netstringsubject');
const EchoStream = require('./fixtures/echostream');

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
