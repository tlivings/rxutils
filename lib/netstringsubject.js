'use strict';

const Rx = require('rxjs');


class NetstringSubject extends Rx.Observable {
    constructor(stream) {
        super((observer) => {
            const netstrings = (chunk, reading) => {
                const strings = [];

                while (chunk !== null) {
                    let cursor = 0;

                    //find the size
                    for (var i = 0; i < chunk.length; i++) {
                        const c = chunk[i];

                        //skip commas and move cursor forward
                        if (c === 0x2c) {
                            cursor++;
                            continue;
                        }

                        //search for colon
                        if (c === 0x3a) {
                            //read size
                            const size = parseInt(chunk.slice(cursor, i).toString());
                            const offset = i + 1;

                            //if size is greater than cursor read
                            if (reading && size > chunk.length - offset) {
                                //read more!
                                const next = this.stream.read((size + offset) - chunk.length);
                                //add new stuff
                                chunk = Buffer.concat([chunk, next]);
                                //kick stream
                                this.stream.read(0);
                            }

                            i = cursor = offset + size + 1;

                            const data = chunk.slice(offset, cursor - 1);

                            strings.push(...netstrings(data));
                        }
                    }

                    if (!reading) {
                        break;
                    }

                    chunk = this.stream.read();
                }

                return strings.length ? strings : [chunk];
            }

            const onReadable = () => {
                for (const string of netstrings(this.stream.read(), true)) {
                    observer.next(string);
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
        const buffer = Buffer.isBuffer(x) ? x : new Buffer(x); 

        this.stream.write(Buffer.concat([new Buffer(buffer.length + ':'), buffer, new Buffer(',')]));
    }

    error(e) {
        this.stream.emit(e);
    }

    complete() {
        this.stream.end();
    }
}

module.exports = NetstringSubject;