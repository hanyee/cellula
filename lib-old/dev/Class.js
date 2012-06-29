/**
 * User: hanyee
 * Date: 2012-4-17
 * Time: 17:41
 * To change this template use File | Settings | File Templates.
 */

(function(){
    this.Class = function(){
        "use strict";

        var nativeBind = Function.prototype.bind, slice = Array.prototype.slice;
        var _class = function(){
            //console.log(this.__initializing__);
            if(!this.__initializing__){
                //console.log(this.__className__+ '---' +this.constructor.prototype.__count__);

                //this.__count__ = this.constructor.prototype.__count__ = this.constructor.prototype.__count__ || 1;
                //this.__cid__ = this.__className__ + '_instance_' + this.__count__;
                //this.constructor.prototype.__count__++;

                //console.log(this.__count__);
                //console.log(this.constructor.prototype.__count__);

                this.__cid__ = this.__className__ + '_instance_' + parseInt((new Date()).getTime()+Math.random()*1e13).toString(16);

                this.bind = function(func, obj) {
                    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                    var args = slice.call(arguments, 2);
                    return function() {
                        return func.apply(obj, args.concat(slice.call(arguments)));
                    };
                };

                /*
                // Bind all of an object's methods to that object. Useful for ensuring that
                // all callbacks defined on an object belong to it.
                this.bindAll = function(obj) {
                    var funcs = slice.call(arguments, 1);
                    if (funcs.length == 0) return;
                    for(var n in funcs){
                        obj[n] = this.bind(obj[n], obj);
                    }
                    return obj;
                };
                */

                this.bindAll = function() {
                    for(var n = 0; n<arguments.length;n++){
                        this[arguments[n]] = this.bind(this[arguments[n]], this);
                    }
                    return this;
                };


                var _ifl = {};

                this.registerInterface = function(interfaceName, context){
                    context = context || this;

                    if(context[interfaceName]){
                        // TODO:
                        // if the same key registered, make it a linked list
                        var node = {interface : {interfaceFunc : context[interfaceName], context : context}, next : null};
                        _ifl[interfaceName] ? _ifl[interfaceName].next = node : _ifl[interfaceName] = node;
                        /*
                        if(_ifl[interfaceName]){
                            _ifl[interfaceName].next = node;
                        }else{
                            _ifl[interfaceName] = node;
                        }*/
                    }else{
                        throw 'the registered method does not exist!';
                    }
                };

                this.applyInterface = function(interfaceName){
                    interfaceName = interfaceName || '';
                    var _ret,
                        args = slice.call(arguments, 1),
                        itfa = interfaceName.split('.'),
                        l = itfa.length,
                        baseClass = l > 1 ? itfa[l-2] : null,
                        //namespace,
                        _itf = _ifl[itfa[l-1]];

                    //args = slice.call(arguments, 1);

                    while(_itf){
                        if(!baseClass || (baseClass && _itf.interface.context.__className__ === baseClass)){
                            _ret = _itf.interface.interfaceFunc.apply(_itf.interface.context || this, args);
                        }
                        _itf = _itf.next;
                        args.push(_ret);
                    }
                    return _ret;

                    /*
                    var _itf, _ret, args, applyBackFlag = false, applyBack = arguments[1];
                    if(_ifl[interfaceName]){
                        _itf = _ifl[interfaceName].interface;
                        if(typeof applyBack === 'function'){
                            args = slice.call(arguments, 2);
                            applyBackFlag = true;

                            //_ret = _itf.interfaceFunc.apply(_itf.context || this, Array.prototype.slice.call(arguments, 2));
                            //return applyBack.call(this, _ret);
                        }else{
                            args = slice.call(arguments, 1);
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
                        throw 'the method ' + interfaceName + ' is not registered';
                    }
                    */
                };

                this.removeInterface = function(interfaceName, context){
                    if(_ifl[interfaceName] && context === undefined) delete _ifl[interfaceName];
                    if(_ifl[interfaceName] && context){
                        var pre =_ifl[interfaceName], node = pre;
                        while(node){
                            if(node.interface.context == context){
                                if(node == pre) {_ifl[interfaceName] = node.next; return;}
                                pre.next = node.next;
                                return;
                            }
                            pre = node;
                            node = node.next;
                        }
                    }
                };

                if(this.init){
                    return this.init.apply(this,arguments);
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
        _class.prototype.constructor = prototype.constructor;
        //_class.prototype.__className__ = typeof _args[0] === 'string' ? _args[0] : 'unnamed';
        //_class.prototype.__namespace__; // for further architecture design

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

    this.Class.create = function(){
        return this.apply(this, arguments);
    };

})();