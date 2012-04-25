/**
 * User: hanyee
 * Date: 2012-4-17
 * Time: 17:41
 * To change this template use File | Settings | File Templates.
 */

(function(){
    this.Class = function(){
        "use strict";

        var _class = function(){
            //console.log(this.__initializing__);
            if(!this.__initializing__){
                if(this.init){
                    this.init.apply(this,arguments);
                }
                //console.log(this.__className__+ '---' +this.constructor.prototype.__count__);

                //this.__count__ = this.constructor.prototype.__count__ = this.constructor.prototype.__count__ || 1;
                //this.__cid__ = this.__className__ + '_instance_' + this.__count__;
                //this.constructor.prototype.__count__++;

                //console.log(this.__count__);
                //console.log(this.constructor.prototype.__count__);

                this.__cid__ = this.__className__ + '_instance_' + parseInt((new Date()).getTime()+Math.random()*1e13).toString(16);

                var _ifl = {};

                this.interfaceReg = function(interfaceName, context){
                    //var _ifl = this._interfaceList || (this._interfaceList = {});
                    if(context[interfaceName]){
                        // TODO:
                        // if the same key registered, make it a linked list
                        _ifl[interfaceName] = {interface : {interfaceFunc : context[interfaceName], context : context}, next : {}};
                    }else{
                        throw 'the registered method does not exist!';
                    }
                };

                this.applyInterface = function(interfaceName){
                    // TODO:
                    // 2nd argument
                    var _itf, _ret, args, applyBackFlag = false, applyBack = arguments[1];

                    if(_ifl[interfaceName]){
                        _itf = _ifl[interfaceName].interface;
                        if(typeof applyBack === 'function'){
                            args = Array.prototype.slice.call(arguments, 2);
                            applyBackFlag = true;

                            //_ret = _itf.interfaceFunc.apply(_itf.context || this, Array.prototype.slice.call(arguments, 2));
                            //return applyBack.call(this, _ret);
                        }else{
                            args = Array.prototype.slice.call(arguments, 1);
                            //_ret = _itf.interfaceFunc.apply(_itf.context || this, Array.prototype.slice.call(arguments, 1));
                            //return _ret;
                        }
                        _ret = _itf.interfaceFunc.apply(_itf.context || this, args);

                        return applyBackFlag ? applyBack.call(this, _ret) : _ret;
                        //if(applyBack){
                        //    applyBack.call(this, _ret);
                       // }
                    }else{
                        // TODO:
                    }
                }

            }else{
                delete this.constructor.prototype.__initializing__;
                //console.log('after');
                //console.log(this.__initializing__);
                //console.log(this);
            }
        };

        // another way to define fnTest for browsers like firefox that the 'toString' method do not suppot to out put the commented line.
        // fnTest = /xyz/.test(function () {
        //     //xyz;
        // }) ? /\b_super\b/ : /.*/;

        var toString = Object.prototype.toString, objTest = /\bObject\b/, _args = arguments, prototype = _class.prototype, fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/ ;

        //_class.prototype = typeof _args[0] === 'object'? _args[0] : (typeof _args[1] === 'object' ? _args[1] : {}); //prototype;
        _class.prototype = objTest.test(toString.call(_args[0])) ? _args[0] : ( objTest.test(toString.call(_args[1])) ? _args[1] : {} );
        _class.prototype.__className__ = typeof _args[0] === 'string' ? _args[0] : 'unnamed';
        _class.prototype.constructor = prototype.constructor;


        //_class.prototype = typeof _args[0] === 'object'? _args[0] : {}; //prototype;
        //_class.prototype.constructor = prototype.constructor;
        //_class.prototype.__className__ = _args[1] || 'unnamed';

        _class.inherits = function(parent){
            if(typeof parent === 'function' && parent.prototype.__className__){

                // Instantiate a base class (but only create the instance,
                // don't run the init constructor)
                parent.prototype.__initializing__ = true;

                var _super = parent.prototype, proto = new parent(), prop = this.prototype;

                for(var name in prop){
                    /*
                     console.log(name);
                     console.log(typeof prop[name] === "function");
                     console.log(typeof _super[name] === "function");
                     console.log(fnTest.test(prop[name]));
                     console.log(prop[name].toString());
                     console.log(_super[name].toString());
                     console.log('------end----')
                     */
                    proto[name] = name !== 'constructor' && typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name]) ?
                        (function(name,fn){
                            return function() {
                                var tmp = this._super;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this._super = _super[name];

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this._super = tmp;

                                return ret;
                            };
                        })(name, prop[name]) : prop[name];

                }

                this.prototype = proto;
                //this.prototype.constructor = prop.constructor;

                //console.log(this.prototype);
                //console.log(_super  );
            }else{
                // TODO:
                throw 'parent class type error!';
            }

            return this;
        };


        return _class;
    };

})();