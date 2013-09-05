/**
 * @fileOverview Cellula Framework's core class constructor definition.
 * @description: an outstanding javascript oop class constructor
 * @namespace: Cellula
 * @author: @hanyee
 */

(function(global){
    global = global || this;

    // for reflection
    var __UNIQUE_CLASS_SET__ = {}, __COUNTER__ = 0;

    global.Class = function(className, classStruct){
        "use strict";
        __COUNTER__ ++;
        var CLASS_NAME = 'Class_' + __COUNTER__;
        var idCounter = 0, __ancestor__ = '', _args = arguments, instanceSet = {};
        var toString = Object.prototype.toString, objTest = /\bObject\b/, arrTest = /\bArray\b/;

        var _class = function(){
            if(!this.constructor.__initializing__){
                this.__cid__ = 'cellula_'+ this._class() + '_instance_' + ++idCounter;

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

                // add to set
                instanceSet[this.__cid__] = this;

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

        if(!_args[0]) _args[0] = CLASS_NAME;
        _class.prototype = objTest.test(toString.call(_args[0])) ? _args[0] : (_args[1] && objTest.test(toString.call(_args[1])) ? _args[1] : {} );
        _class.prototype.constructor = prototype.constructor;

        if(typeof _args[0] === 'string') CLASS_NAME = _args[0];

        var _getClass = function(){return CLASS_NAME;};
        _class.prototype._class = _getClass;
        _class.prototype.__getAncestor__ = function(){return __ancestor__;};// 定义parent的 __base__ 属性，遍历parent的 __base__ 属性
        _class.prototype.__setAncestor__ = function(b){ __ancestor__ = b;};
        __ancestor__ = CLASS_NAME;

        if(!__UNIQUE_CLASS_SET__[CLASS_NAME]) __UNIQUE_CLASS_SET__[CLASS_NAME] = _class;
        else throw new Error('Duplicated Class!');

        _class.inherits = function(parent){

            if(typeof parent === 'function' && parent.prototype._class && parent.prototype._class.toString() === _getClass.toString()){
//            if(typeof parent === 'function'){
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
            if(typeof func === 'function') { // copy extend attributes
                var proto = this.prototype, ex = new func, n;
                for (n in ex) proto[n] = n in proto ? proto[n] : ex[n];
            }
            return this;
        };

        _class.info = function(){
            return {name: CLASS_NAME, count: idCounter, instances: instanceSet, ancestor:'', parent:''};
        };

        return _class;
    };

    global.Class.classFromString = function(nameStr){
        if(typeof nameStr === 'string' && __UNIQUE_CLASS_SET__[nameStr]) return __UNIQUE_CLASS_SET__[nameStr];
    };

    global.Class.getInfo = function(nameStr){
        if(typeof nameStr === 'string' && __UNIQUE_CLASS_SET__[nameStr]) return __UNIQUE_CLASS_SET__[nameStr].info();
    };

    this.Class = global.Class;

})(Cellula);
