/**
 * @fileOverview Cellula Framework's element definition.
 * @description: defines element
 * @namespace: Cellula
 * @author: @hanyee
 */

(function(cellula){
    var util = cellula._util,
        msg = cellula.Message,
        code = msg.Element = {
            CHANGED:'Element.CHANGED',
            ERROR:'Element.ERROR',
            VALIDATE_FAILED:'Element.VALIDATE_FAILED'
        };

    cellula.Element = new cellula.Class('Element', {
        key : '',
        _data : {},
        //_isValidated : false,
        //silent : false,
        _previous : {},
        storage:{
            // localStorage
            toStorage:function (prop) { // save _data's attributes to localStorage
                var storage, __self__ = this.__self__;
                if (storage = window.localStorage) {
                    if (!window.JSON) window.JSON = util.JSON;
                    function iterator(v, i) {
                        storage.setItem(i, typeof v !== 'object' ? v : JSON.stringify(v));
                    }

                    // all
                    if (!prop) return util.each(__self__._data, iterator);

                    // string
                    // util.isString(prop) && this.has(prop)
                    if (__self__.has(prop)) return iterator(__self__.get(prop), prop);

                    // array
                    if (util.isArray(prop)) {
                        return util.each(prop, function (v) {
                            if (this.has(v)) iterator(this.get(v), v);
                        }, __self__);
                    }
                } else {
                    // log.warn `localStorage is not supported`
                }
            },
            //set:function (prop) { },
            get:function (prop) { // returns all values in Storage object
                var _cached = {}, storage, __self__ = this.__self__;
                if (storage = window.localStorage) {
                    util.each(__self__._data, function (v, i) {
                        if (i in storage) _cached[i] = storage[i];
                    });
                    return __self__.__get__(_cached, prop);
                }
            }
        },
        _setup:function(cfg){
            this.storage.__self__ = this;
            if (util.isObject(cfg)){
                for(var n in cfg ){
                    n in this && cfg.hasOwnProperty(n) && !util.isFunction(cfg[n]) && (this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n])
                }
            }
        },
        init : function (cfg) {
            this._setup(cfg);
            if(!this.key) this.key = this.__cid__;
            //if(cfg && !(cfg.silent || this.silent)) this.save();
        },
        set : function(key, value, opt){
            //if(!util.isObject(cfg['value'])) throw 'data structure error!';

            if(!key) throw new Error('data structure error!');
            var attrs, ret = -1;

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
            //attrs = util.mix({}, this._data, attrs);
            ret = this.validate(attrs, this);
            if (ret !== undefined) {
                // validate method should not return anything if there's no error
                //this.errHandler(ret);
                // trigger error message
                this.trigger('error');
                // this.applyInterface();
                return false;
            }
            // data backup
            this._previous = util.mix({},this._data);
            //this._data = util.mix({}, attrs);
            this._data = attrs;
            //this._isValidated = true;
            return true;
        },
        has:function(key){
            return this._data.hasOwnProperty(key);
        },
        reset : function(obj, opt){ // empty the _data attribute by default when no arguments detected
            if(!obj) return (this._previous = util.mix({},this._data)) && (this._data = {});

            if(util.isObject(obj)) {
                var attrs = util.mix({}, obj),
                    ret = this.validate(attrs, this);

                if (ret !== undefined) {
                    // validate method should not return anything if there's no error
                    // trigger error message
                    this.trigger('error');
                    // this.applyInterface();
                    return false;
                }

                this._previous = util.mix({},this._data);
                //this._data = util.mix({}, attrs);
                this._data = attrs;
                return true;
            }

            return false;
        },
        removeAttribute:function(){},
        save : function(){
            //return this.set(new Function("return {value : " + this.value + "}").call(this));
        },
        destroy : function(){
            return this.applyInterface('Collection.remove', this.key);
        },
        //errHandler : function(msg){}, // deprecated
        validate : function(data, el){},
        __get__:function (data, prop) { // returns all elements by default, prop is optional,
            // returns all elements by default
            if (!prop) return util.mix({}, data);

            // returns the specific element with the given prop, if element is not exist returns undefiend
            if (util.isString(prop)) return data[prop];

            // returns the specific elements with the given props in an array
            if (util.isArray(prop)) {
                return util.map(prop, function (v) { return data[v];});
            }
        },
        getPrevious:function (prop) { // returns all elements by default, prop is optional,
            return this.__get__(this._previous, prop);
        },
        get:function (prop) { // returns all elements by default, prop is optional,
            return this.__get__(this._data, prop);
        }
    });
})(Cellula);