'use strict';

const Test = require('tape');
const ObjectEntriesObservable = require('../lib/objectentriesobservable');

Test('test duplex stream subject', (t) => {

    t.test('plan', (t) => {
        t.plan(2);

        const object = {
            a: 1,
            b: 2
        };

        const observable = new ObjectEntriesObservable(object);

        observable.subscribe(
            (x) => {
                t.ok(x, 'received value.');
            }
        );
    });

});
