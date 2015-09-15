module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var delegate = require('deligare');

    /**
     * @class Formula
     */
    var Formula = function (cfg) {
        var orgCtor = cfg.base.constructor;
        var init = delegate(each, [cfg.onBrewScripts, callFn]);

        /**
         * A list of callback functions which should be called
         * when brewing a new potion
         *
         * @name onBrewScripts
         * @memberOf Formula
         * @type Array
         * @property
         * @private
         */
        this.onBrewScripts = cfg.onBrewScripts;

        /**
         * A list of callback functions which should be called
         * when disposing the potion
         *
         * @name onDisposeScripts
         * @memberOf Formula
         * @type Array
         * @property
         * @private
         */
        this.onDisposeScripts = cfg.onDisposeScripts;

        this.Ctor = function (args) {
            orgCtor.apply(this, args);
            init(this);
        };
        this.Ctor.prototype = cfg.base;
    };

    /**
     * Creates a new instance of the formula's prototype
     *
     * @param {Object|Function} [overrides] Optional. A set of properties/overrides
     *      for the new instance
     * @param {Array} [args] Optional. An array with constructor arguments
     * @return {Object} The potion (i.e. the new instance of the formula's prototype)
     */
    Formula.prototype.brew = function brew(overrides, args) {
        var potion = new this.Ctor(args);
        var foreignProps = Object.keys(overrides || {});
        var onDispose = delegate(each, [this.onDisposeScripts, callFn]);

        if (typeof overrides === 'function') {
            overrides = overrides(this.Ctor.prototype);
        }

        potion.dispose = createDisposeFn(foreignProps, onDispose);
        potion = override(potion, overrides);

        return potion;
    };

    /**
     * Adds a callback functions which should be called
     * when brewing a new potion. The function is executed
     * in the context of the new object
     *
     * @param {Object} fn The callback function
     * @return {Formula} The new formula
     */
    Formula.prototype.whenBrewed = function whenBrewed(fn) {
        return new Formula({
            base: this.Ctor.prototype,
            onBrewScripts: this.onBrewScripts.concat(fn),
            onDisposeScripts: this.onDisposeScripts,
        });
    };


    /**
     * Adds a callback functions which should be called
     * when when disposing the potion. The function is
     * executed in the context of the disposed object
     *
     * @param {Object} fn The callback function
     * @return {Formula} The new formula
     */
    Formula.prototype.whenDisposed = function whenDisposed(fn) {
        return new Formula({
            base: this.Ctor.prototype,
            onBrewScripts: this.onBrewScripts,
            onDisposeScripts: this.onDisposeScripts.concat(fn),
        });
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
        if (typeof overrides === 'function') {
            overrides = overrides(this.Ctor.prototype);
        }

        return new Formula({
            base: override(Object.create(this.Ctor.prototype), overrides),
            onBrewScripts: this.onBrewScripts,
            onDisposeScripts: this.onDisposeScripts,
        });
    };

    ///////////////////////////////////////////////////////////////////////////
    // PRIVATE HELPER

    /** @private */
    function override(base, overrides) {
        each(overrides, function (prop, key) {
            base[key] = prop;
        });

        return base;
    }

    /** @private */
    function callFn(fn) {
        /* jshint validthis: true */
        fn.call(this);
        /* jshint validthis: false */
    }

    /** @private */
    function createDisposeFn(foreignProps, onDispose) {
        return function dispose() {
            onDispose(this);

            each(foreignProps, function (prop) {
                this[prop] = null;
            }, this);

            for (var key in this) {
                if (this[key] && typeof this[key] === 'object') {
                    if (typeof this[key].dispose === 'function') {
                        this[key].dispose();
                    }

                    this[key] = null;
                }
            }
        };
    }

    /**
     * Wraps the give value in a potion formula to allow further magic
     *
     * @param {Object} base The original basic prototype
     * @return {Formula} the wrapper formula
     */
    return function coquoVenenum(base) {
        if (base === null || typeof base !== 'object') {
            throw 'Base hast be an object, "' + base + '" given';
        }

        return new Formula({
            base: Object.create(base),
            onBrewScripts: [],
            onDisposeScripts: [],
        });
    };
}());
