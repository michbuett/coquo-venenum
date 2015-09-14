/* global window */
describe('coquo-venenum', function () {
    'use strict';

    var coquoVenenum = typeof require === 'function' ? require('../src/coquo-venenum') : window.coquoVenenum;

    it('can create brew-able potions', function () {
        // prepare
        var base = {};

        // execute
        var formula = coquoVenenum(base);

        // verify
        expect(typeof formula).toBe('object');
        expect(typeof formula.brew).toBe('function');
    });

    it('throws an error when creating a formula from non object', function () {
        expect(function () { coquoVenenum(null); }).toThrow('Base hast be an object, "null" given');
        expect(function () { coquoVenenum(); }).toThrow('Base hast be an object, "undefined" given');
        expect(function () { coquoVenenum(1); }).toThrow('Base hast be an object, "1" given');
        expect(function () { coquoVenenum('foo'); }).toThrow('Base hast be an object, "foo" given');
    });

    describe('brew', function () {
        var base = {};
        var formula = coquoVenenum(base);

        it('preserves the prototype chain', function () {
            // prepare
            // execute
            var obj = formula.brew();

            // verify
            expect(base.isPrototypeOf(obj)).toBeTruthy();
        });

        it('allows to override instance properties', function () {
            // prepare
            // execute
            var obj = formula.brew({
                foo: 'foo',
                bar: 'bar',
                baz: 'baz',
            });

            // verify
            expect(obj.foo).toBe('foo');
            expect(obj.bar).toBe('bar');
            expect(obj.baz).toBe('baz');
        });

        it('allows to pass arguments to the original constructor if neccessary', function () {
            // prepare
            var ctor = jasmine.createSpy();
            var formula = coquoVenenum({
                constructor: ctor,
            });

            // execute
            formula.brew(null, ['arg1', 'arg2', 'arg3']);

            // verfiy
            expect(ctor).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
        });
    });

    describe('extend', function () {
        var formula = coquoVenenum({
            foo: 'foo',
            bar: 'bar',
        });

        it('allows to add/override properties and methods', function () {
            // prepare
            // execute
            var obj = formula.extend({
                foo: 'foo_sub',
                bar: 'bar_sub',
                baz: 'baz',
            }).brew();

            // verify
            expect(obj.foo).toBe('foo_sub');
            expect(obj.bar).toBe('bar_sub');
            expect(obj.baz).toBe('baz');
        });

        it('preserves the prototype chain', function () {
            // prepare
            var base = {};

            // execute
            var sub = coquoVenenum(base).extend().extend().extend().brew();

            // verify
            expect(base.isPrototypeOf(sub)).toBeTruthy();
        });

        it('does not modify the extended potion formula', function () {
            var sub = formula.extend({
                baz: 'baz',
            });

            // verify
            expect(sub).not.toBe(formula);
            expect(formula.brew().baz).toBe(undefined);
            expect(sub.brew().baz).toBe('baz');
        });
    });

    describe('whenBrewed', function () {
        it('allows register one or more callbacks on brewing', function () {
            // prepare
            var onInitSpy1 = jasmine.createSpy('onInit1');
            var onInitSpy2 = jasmine.createSpy('onInit2');

            // execute
            coquoVenenum({})
                .whenBrewed(onInitSpy1)
                .whenBrewed(onInitSpy2)
                .brew();

            // verify
            expect(onInitSpy1).toHaveBeenCalled();
            expect(onInitSpy2).toHaveBeenCalled();
        });

        it('exectutes the the callback in the currect context', function () {
            // prepare
            var onInitSpy = jasmine.createSpy('onInit');

            // execute
            var potion = coquoVenenum({}).whenBrewed(onInitSpy).brew();

            // verify
            expect(onInitSpy.calls.mostRecent().object).toBe(potion);
        });

        it('preserves the prototype chain', function () {
            // prepare
            var base = {};

            // execute
            var sub = coquoVenenum(base).whenBrewed(function () {
                this.foo = 'bar';
            }).brew();

            // verify
            expect(base.isPrototypeOf(sub)).toBeTruthy();
            expect(sub.foo).toBe('bar');
        });
    });

    describe('dispose', function () {
        it('brewed potions can be disposed', function () {
            var potion = coquoVenenum({}).brew();

            expect(typeof potion.dispose).toBe('function');

            expect(function () {
                potion.dispose();
            }).not.toThrow();
        });

        it('clears object references', function () {
            // prepare
            var potion = coquoVenenum({
                foo: {},
                text: 'some text'
            }).extend({
                bar: []
            }).extend({
                baz: {},
            }).brew({
                ping: {},
                pong: []
            });

            // execute
            potion.dispose();

            // verify
            expect(potion.foo).toBeFalsy();
            expect(potion.bar).toBeFalsy();
            expect(potion.baz).toBeFalsy();
            expect(potion.ping).toBeFalsy();
            expect(potion.pong).toBeFalsy();
            expect(potion.text).toBe('some text');
        });

        it('also disposes children', function () {
            // prepare
            var dispose1 = jasmine.createSpy('dispose spy #1');
            var dispose2 = jasmine.createSpy('dispose spy #2');
            var potion = coquoVenenum({
                foo: {
                    dispose: dispose1,
                },
            }).brew({
                bar: {
                    dispose: dispose2,
                },
            });

            // execute
            potion.dispose();

            // verify
            expect(potion.foo).toBeFalsy();
            expect(potion.bar).toBeFalsy();
            expect(dispose1).toHaveBeenCalled();
            expect(dispose2).not.toHaveBeenCalled();
        });
    });
});
