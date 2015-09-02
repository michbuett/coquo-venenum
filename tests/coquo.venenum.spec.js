/* global window */
describe('coquo-venenum', function () {
    'use strict';

    var coquoVenenum = typeof require === 'function' ? require('../src/coquo-venenum') : window.coquoVenenum;

    it('can create brew-able potions', function () {
        // prepare
        var base = {};

        // execute
        var potion = coquoVenenum(base);

        // verify
        expect(typeof potion).toBe('object');
        expect(typeof potion.brew).toBe('function');
    });

    describe('brew', function () {
        var base = {};
        var potion = coquoVenenum(base);

        it('preserves the prototype chain', function () {
            // prepare
            // execute
            var obj = potion.brew();

            // verify
            expect(base.isPrototypeOf(obj)).toBeTruthy();
        });

        it('allows to override instance properties', function () {
            // prepare
            // execute
            var obj = potion.brew({
                foo: 'foo',
                bar: 'bar',
                baz: 'baz',
            });

            // verify
            expect(obj.foo).toBe('foo');
            expect(obj.bar).toBe('bar');
            expect(obj.baz).toBe('baz');
        });
    });

    describe('extend', function () {
        var potion = coquoVenenum({
            foo: 'foo',
            bar: 'bar',
        });

        it('allows to add/override properties and methods', function () {
            // prepare
            // execute
            var obj = potion.extend({
                foo: 'foo_sub',
                bar: 'bar_sub',
                baz: 'baz',
            }).brew();

            // verify
            expect(obj.foo).toBe('foo_sub');
            expect(obj.bar).toBe('bar_sub');
            expect(obj.baz).toBe('baz');
        });

        it('', function () {
        });
    });
});
