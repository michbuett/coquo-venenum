module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');

    /**
     * @class Formula
     */
    var Formula = function (base, onInitScrips, onDisposeScripts) {
        var orgCtor = base.constructor;

        this.onInitScrips = onInitScrips || [];
        this.onDisposeScripts = onDisposeScripts || [];

        this.Ctor = function (args) {
            orgCtor.apply(this, args);

            each(onInitScrips, function (fn) {
                fn.call(this);
            }, this);
        };

        this.Ctor.prototype = base;
    };

    /**
     *
     * @param {Object} [cfg]
     * @param {Array} [args]
     * @return {Formula}
     */
    Formula.prototype.brew = function brew(cfg, args) {
        return override(new this.Ctor(args), cfg);
    };

    /**
     * @param {Object} fn
     * @return {Formula}
     */
    Formula.prototype.onInit = function onInit(fn) {
        return new Formula(this.Ctor.prototype, this.onInitScrips.concat(fn), this.onDisposeScripts);
    };

    /**
     * Allows overriding methods and properties of an current base object.
     * For example:
     * <pre><code>
     * var newFormula = formula.extend({
     *   foo: function () { ... },
     *   ...
     * });
     * </code></pre>
     * @function
     *
     * @param {Object} overrides The set of new methods and attributes
     * @return {Formula} The new and extended potion formula
     */
    Formula.prototype.extend = function (overrides) {
        return new Formula(this.brew(overrides));
    };

    /** @private */
    function override(base, overrides) {
        each(overrides, function (prop, key) {
            base[key] = prop;
        });

        return base;
    }

    /**
     * Wrapps the give value in a potion formula to allow further magic
     *
     * @param {Object} base The original basic prototype
     * @return {Formula} the wrapper formula
     */
    return function coquoVenenum(base) {
        if (base === null || typeof base !== 'object') {
            throw 'Base hast be an object, "' + base + '" given';
        }

        return new Formula(Object.create(base));
    };
}());
