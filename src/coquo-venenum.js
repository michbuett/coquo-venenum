module.exports = (function () {
    'use strict';

    /**
     * @class Potion
     */
    var Potion = function (wrapped) {
        this.wrapped = wrapped;
    };

    Potion.prototype.brew = function brew(cfg) {
        return Object.create(this.wrapped);
    };

    /**
     * Wrapps the give value in a potion to allow further magic
     *
     * @param {Object} wrapped The original basic prototype
     * @return Potion the wrapper potion
     */
    return function coquoVenenum(wrapped) {
        return new Potion(wrapped);
    };
}());
