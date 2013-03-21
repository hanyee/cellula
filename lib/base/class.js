/**
 * @fileOverview Cellula Framework's core class constructor definition.
 * @description: an outstanding javascript oop class constructor
 * @namespace: Cellula
 * @author: @hanyee
 */

(function(global){
    global = global || this;
    global.Class = function(){
        "use strict";
        var idCounter = 0, __ancestor__ = '', _args = arguments, extend = [];
        var slice = Array.prototype.slice, toString = Object.prototype.toString, objTest = /\bObject\b/, arrTest = /\bArray\b/;

        var _class = function(){
            if(!this.constructor.__initializing__){
                // copy extend attributes
                var ii, ex, n, l = extend.length;
                if(l){
                    for(ii=0; ii<l; ii++){
                        ex = new extend[ii];
                        for(n in ex) this[n] = n in this ? this[n] : ex[n];
                    }
                }

                this.__cid__ = 'cellula_'+ this.__className__ + '_instance_' + ++idCounter;

                // create a new proto
                var isNew = _args[2] || _args[1];
                if(isNew === 'NEW'){
                    var tmp, p, q;
                    for(p in this){
                        // object
                        if(objTest.test(toString.call(this[p]))){
                            tmp = {}; // limited for hasOwnProperty?
                            for(q in this[p]){ tmp[q] = this[p][q]; }
                            this[p] = tmp;
                        }
                        // array
                        if(arrTest.test(toString.call(this[p]))) this[p] = this[p].slice();
                    }
                }

                if(this.init){
                    return this.init.apply(this, arguments);
                    // TODO:
                    // afterInit :
                }

            }
        };

        // another way to define fnTest for browsers like firefox that the 'toString' method do not suppot to out put the commented line.
        // fnTest = /xyz/.test(function () {
        //     //xyz;
        // }) ? /\b_super\b/ : /.*/;

        var prototype = _class.prototype, fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/ ;

        _class.prototype = objTest.test(toString.call(_args[0])) ? _args[0] : ( objTest.test(toString.call(_args[1])) ? _args[1] : {} );
        _class.prototype.constructor = prototype.constructor;

        if(typeof _args[0] === 'string'){
            var li = _args[0].lastIndexOf('.');
            if(li !== -1){
                _class.prototype.__className__ = _args[0].substring(li+1, _args[0].length);
                _class.prototype.__namespace__ = _args[0].substring(0, li);
            }else{
                _class.prototype.__className__ = _args[0];
                _class.prototype.__namespace__ = 'unnamed';
            }
        }else{_class.prototype.__className__ = 'unnamed';}

        _class.prototype.__getAncestor__ = function(){return __ancestor__;};// 定义parent的 __base__ 属性，遍历parent的 __base__ 属性
        _class.prototype.__setAncestor__ = function(b){ __ancestor__ = b;};
        __ancestor__ = _class.prototype.__className__;

        _class.inherits = function(parent){
            //if(typeof parent === 'function' && parent.prototype.__className__){ // to provide particular Class identity flag instedaof `__className__`
            if(typeof parent === 'function'){
                // Instantiate a base class (but only create the instance, don't run the init constructor)
                parent.__initializing__ = true;

                var _super = parent.prototype, proto = new parent(), prop = this.prototype;

                prop.__setAncestor__(proto.__getAncestor__ && proto.__getAncestor__() || __ancestor__); // set Ancestor Class name

                for(var name in prop){
                    proto[name] = name !== 'constructor' && typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name]) ?
                        (function(name,fn){
                            return function() {
                                var tmp = this._super;
                                this._super = _super[name];
                                var ret = fn.apply(this, arguments);
                                tmp ? (this._super = tmp) : (delete this._super);

                                return ret;
                            };
                        })(name, prop[name]) : prop[name];

                }
                this.prototype = proto;
                this.prototype.constructor = this;
                delete parent.__initializing__;

                for(var t in parent){
                    if(!this[t]) this[t] = parent[t];
                }

            } else throw new Error('parent class type error!');

            return this;
        };

        _class.extend = function(func){ // func should be a `function`
            if(typeof func === 'function') extend.push(func);
            return this;
        };

        return _class;
    };

    this.Class = global.Class;

})(Cellula);
