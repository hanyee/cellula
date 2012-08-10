/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-26
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */
(function(cellula){
    var util = cellula._util;
    cellula.Nucleus = new cellula.Class('Nucleus', {
        key : '',
        _data : {},
        _isValidated : false,
        silent : false,
        // TODO:
        //previous : null,
        _initCfg : function (cfg) {
            if (util.isObject(cfg)) {
                for (var n in this) {
                    if (cfg.hasOwnProperty(n)) {
                        this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                    }
                }
            }
        },
        errHandler : function(msg){},
        reset : function(){},
        validate : function(data, el){},
        _validate : function(data, el){
            return this.validate(data, el);
        },
        init : function (cfg) {
            this._initCfg(cfg);
            if(!(cfg.silent || this.silent)) this.doSet();
        },
        set : function(key, value, opt){
            //if(!util.isObject(cfg['value'])) throw 'data structure error!';

            if(!key) throw new Error('data structure error!');
            var attrs, ret;

            // Handle both "key", "value" and {key: value} -style arguments.
            if (util.isObject(key)) {
                attrs = key;
                opt = value;
            }
            if(util.isString(key)){
                attrs = {};
                attrs[key] = value;
            }

            attrs = util.deepMix({}, this._data, attrs);
            ret = this._validate(attrs, this);
            if (ret !== undefined) {
                // validate method should not return anything if there's no error
                this.errHandler(ret);
                return false;
            }
            this._data = util.mix({}, attrs);
            this._isValidated = true;
            return true;
        },
        doSet : function(){
            //return this.set(new Function("return {value : " + this.value + "}").call(this));
        },
        get : function (prop) { // returns all elements by default, prop is optional,
            // returns all elements by default
            if (!prop) return util.mix({}, this._data);

            // returns the specific element with the given prop, if element is not exist returns undefiend
            if (util.isString(prop)) return this._data[prop];

            // returns the specific elements with the given props in an array
            if (util.isArray(prop)) {
                var t = [];
                util.each(prop, function (v) {
                    t.push(this._data[v]);
                }, this);
                return t;
            }
        },
        getValue : function(){
            //return this.value;
            return this._data.value;
        },
        getProp : function(name){
            return this._data[name];
        }
    });
})(Cellula);