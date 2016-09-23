'use strict';

const Rx = require('rxjs');

class DuplexStreamSubject extends Rx.Observable {
    constructor(stream) {
        super((observer) => {
            const onReadable = () => {
                let chunk;

                while ((chunk = this.stream.read()) !== null) {
                    observer.next(chunk);
                }
            };

            const onEnd = () => {
                observer.complete();
            };

            const onError = (error) => {
                observer.error(error);
            };

            this.stream.on('readable', onReadable);
            this.stream.on('error', onError);
            this.stream.on('end', onEnd);

            return () => {
                this.stream.removeListener('readable', onReadable);
                this.stream.removeListener('end', onEnd);
                this.stream.removeListener('error', onError);
            };
        });

        this.stream = stream;
    }

    next(x) {
        this.stream.write(x);
    }

    error(e) {
        this.stream.emit(e);
    }

    complete() {
        this.stream.end();
    }
}

module.exports = DuplexStreamSubject;