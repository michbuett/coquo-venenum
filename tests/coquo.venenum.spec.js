/* global window */
describe('coquo-venenum', function () {
    'use strict';

    var coquoVenenum = typeof require === 'function' ? require('../src/coquo-venenum') : window.coquoVenenum;

    it('can create brew-able potions', function () {
        // prepare
        var base = {};

        // execute
        var potion = coquoVenenum(base);
        var obj = potion.brew();

        // verify
        expect(typeof potion).toBe('object');
        expect(typeof potion.brew).toBe('function');
        expect(base.isPrototypeOf(obj)).toBeTruthy();
    });
});
