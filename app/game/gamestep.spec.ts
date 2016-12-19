import '../core/tests.ts';
import {chai} from '../core/tests';

import {GameStep} from './gamestep'

var expect = chai.expect;

describe('Unit tests for GameStep class', () => {

    describe('test constructor', () => {

        it('"done" flag to be false', (done) => {
            expect(new GameStep({ mangled: 'zpaiz', unmangled: 'pizza' }).done).to.equal(false);
            done();
        });

        it('"maxScore" should be 3', (done) => {
            expect(new GameStep({ mangled: 'zpaiz', unmangled: 'pizza' }).maxScore).to.equal(3);
            done();
        });

        it('"maxScore" should be 2', (done) => {
            expect(new GameStep({ mangled: 'ilmk', unmangled: 'milk' }).maxScore).to.equal(2);
            done();
        });

        // todo: implement the rest of the TCs
    });

});
