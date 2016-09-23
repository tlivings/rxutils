'use strict';

const Rx = require('rxjs');

class ObjectEntriesObservable extends Rx.Observable {
    constructor(object) {
        super((observer) => {
            const keys = Object.keys(object);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = object[key];

                observer.next({ [key]: value });
            }

            observer.complete();
        });
    }
}

module.exports = ObjectEntriesObservable;