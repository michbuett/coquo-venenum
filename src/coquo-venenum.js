module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');

    /**
     * @class Formula
     */
    var Formula = function (base) {
        var orgCtor = base.constructor;

        this.Ctor = function () {
            orgCtor.call(this);
        };

        this.Ctor.prototype = Object.create(base);
    };

    Formula.prototype.brew = function brew(cfg) {
        return override(new this.Ctor(), cfg);
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
     * @return Formula The new and extended potion formula
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
     * @return Formula the wrapper formula
     */
    return function coquoVenenum(base) {
        return new Formula(base);
    };
}());
