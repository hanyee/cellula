/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-26
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */

(function(global){
    global = global || this;
    global.Class = function(){
        "use strict";

        var nativeBind = Function.prototype.bind, slice = Array.prototype.slice;
        var _class = function(){

            if(!this.__initializing__){

                this.__cid__ = this.__className__ + '_instance_' + parseInt((new Date()).getTime()+Math.random()*1e13).toString(16);

                var _ifl = {};

                this.registerInterface = function(interfaceName, context){
                    context = context || this;

                    if(context[interfaceName]){
                        // TODO:
                        // if the same key registered, make it a linked list
                        var node = {interface : {interfaceFunc : context[interfaceName], context : context}, next : null};
                        _ifl[interfaceName] ? _ifl[interfaceName].next = node : _ifl[interfaceName] = node;

                    }else{
                        throw 'the registered method does not exist!';
                        //console.log(interfaceName);
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

                    while(_itf){
                        if(!baseClass || (baseClass && _itf.interface.context.__className__ === baseClass)){
                            _ret = _itf.interface.interfaceFunc.apply(_itf.interface.context || this, args);
                        }
                        _itf = _itf.next;
                        args.push(_ret);
                    }
                    return _ret;
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
                    return this.init.apply(this, arguments);
                    // TODO:
                    // afterInit :
                }

            }else{
                delete this.constructor.prototype.__initializing__;
            }
        };

        // another way to define fnTest for browsers like firefox that the 'toString' method do not suppot to out put the commented line.
        // fnTest = /xyz/.test(function () {
        //     //xyz;
        // }) ? /\b_super\b/ : /.*/;

        var toString = Object.prototype.toString, objTest = /\bObject\b/, _args = arguments, prototype = _class.prototype, fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/ ;

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

        _class.inherits = function(parent){
            if(typeof parent === 'function' && parent.prototype.__className__){

                // Instantiate a base class (but only create the instance,
                // don't run the init constructor)
                parent.prototype.__initializing__ = true;

                var _super = parent.prototype, proto = new parent(), prop = this.prototype;

                for(var name in prop){
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

                for(var t in parent.prototype.constructor){
                    if(!this.prototype.constructor[t]) this.prototype.constructor[t] = parent.prototype.constructor[t];
                }

            }else{
                // TODO:
                throw 'parent class type error!';
            }

            return this;
        };

        return _class;
    };

    global.Class.create = function(){
        return this.apply(this, arguments);
    };

    this.Class = global.Class;

})(Cellula);
