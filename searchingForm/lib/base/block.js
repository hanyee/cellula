/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-25
 * Time: 下午10:06
 * To change this template use File | Settings | File Templates.
 */

(function (cellula) {
    var util = cellula._util,
        nativeBind = Function.prototype.bind,
        slice = Array.prototype.slice;
    cellula.Block = new cellula.Class('Block', {
        root : null,
        collection : null,
        bind:function (func, obj) {
            if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            var args = slice.call(arguments, 2);
            return function () {
                return func.apply(obj, args.concat(slice.call(arguments)));
            };
        },

        // Bind all of an object's methods to that object. Useful for ensuring that
        // all callbacks defined on an object belong to it.
        bindAll:function () {
            for (var n = 0; n < arguments.length; n++) {
                this[arguments[n]] = this.bind(this[arguments[n]], this);
            }
            return this;
        },
        init : function(){},
        initCfg : function(cfg){
            if (typeof cfg === 'object') {
                for (var n in this) {
                    //this[n] = cfg[n] ? cfg[n] : this[n];
                    util.isObject(this[n]) && util.isObject(cfg[n]) ? this[n] = util.deepMix({}, this[n], cfg[n]) : this[n] = cfg[n] ? cfg[n] : this[n];
                    // TODO:
                    //this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({},this[n],cfg[n]) : cfg[n] ? cfg[n] : this[n];

                }
            }
        },
        save:function () { // save the specified element
            var c = this.collection, o = arguments[0];
            if (typeof o === 'string') return c[o] ? c[o].setData.call(c[o]) : undefined;

            for (var n in this.collection) {
                var r = this.collection[n].setData.apply(this.collection[n], arguments);
                // TODO:
                // validateAll ?
                if (!r) return r;
            }
        },
        get : function(){
            if(arguments.length === 0){
                return this.collection;
            }
            return this.collection[arguments[0]];
        },
        getData : function(){
            var data = {}, l = arguments.length;
            if(l === 0){
                for(var n in this.collection){
                    //data[this.collection[n].key] = this.collection[n].getValue();
                    data = util.mix(data, this.collection[n].data.value);
                }
            }else{
                for(var i=0; i<l; i++ ){
                    data = util.mix(data, this.collection[arguments[i]].data.value);
                }
            }
            return data;
        },
        getRootNode : function(root, tip){// id || unique style
            tip = tip || this.__className__;
            root = root || '';
            var node = document.getElementById(root);
            if(node) return node;
            var nodesArray = util.getElementsByClassName(root, document, 'div'); //document.getElementsByClassName(root);
            //if(nodesArray.length > 1 && document.getElementById(this.root)) return document.getElementById(this.root);
            if(nodesArray.length === 1) return nodesArray[0];

            throw new Error('root id, unique style class undefined or more ' + tip + 's have unique style class!');
        },
        registerEvents:function(){}
    });

})(Cellula);
