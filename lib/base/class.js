/**
 * @fileOverview Cellula Framework's core class constructor definition.
 * @description: an outstanding javascript oop class constructor
 * @namespace: Cellula
 * @version: 0.3.2
 * @author: @hanyee
 */

(function(global){
    global = global || this;
    global.Class = function(){
        "use strict";
        var idCounter = 0;
        var __ancestor__ = '';
        var nativeBind = Function.prototype.bind, slice = Array.prototype.slice;
        var _class = function(){
            if(!this.constructor.__initializing__){
                //this.__cid__ = this.__className__ + '_instance_' + parseInt((new Date()).getTime()+Math.random()*1e13).toString(16);

                this.__cid__ = this.__className__ + '_instance_' + ++idCounter;

                var _ifl = {};

                this.registerInterface = function(interfaceName, context){
                    context = context || this;

                    if(context[interfaceName]){
                        // if the same key registered, make it a linked list
                        var node = {interfaceNode : {interfaceFunc : context[interfaceName], context : context}, next : null};
                        //_ifl[interfaceName] ? _ifl[interfaceName].next = node : _ifl[interfaceName] = node;
                        if(!_ifl[interfaceName]){ _ifl[interfaceName] = node;}
                        else{
                            var t = _ifl[interfaceName];
                            while (t.next) { t = t.next }
                            t.next = node;
                        }

                    }else{
                        throw new Error('the registered method does not exist!');
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
                        if(!baseClass || (baseClass && _itf.interfaceNode.context.__className__ === baseClass)){
                            _ret = _itf.interfaceNode.interfaceFunc.apply(_itf.interfaceNode.context || this, args);
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
                            if(node.interfaceNode.context == context){
                                if(node == pre) {_ifl[interfaceName] = node.next; return;}
                                pre.next = node.next;
                                return;
                            }
                            pre = node;
                            node = node.next;
                        }
                    }
                };


                // A module that can be mixed in to *any object* in order to provide it with
                // custom events. You may bind with `on` or remove with `off` callback functions
                // to an event; `trigger`-ing an event fires all callbacks in succession.
                //
                //     var object = new SomeClass;
                //     object.on('expand', function(){ alert('expanded'); });
                //     object.trigger('expand');
                //

                // Regular expression used to split event strings
                var eventSplitter = /\s+/;

                // Bind one or more space separated events, `events`, to a `callback`
                // function. Passing `"all"` will bind the callback to all events fired.
                this.on = function (events, callback, context) {
                    var calls, event, list;
                    if (!callback) return this;

                    events = events.split(eventSplitter);
                    calls = this._callbacks || (this._callbacks = {});

                    while (event = events.shift()) {
                        list = calls[event] || (calls[event] = []);
                        list.push(callback, context); // list.push(callback, context || this);
                    }

                    return this;
                };

                // Remove one or many callbacks. If `context` is null, removes all callbacks
                // with that function. If `callback` is null, removes all callbacks for the
                // event. If `events` is null, removes all bound callbacks for all events.
                this.off = function (events, callback, context) {
                    var event, calls, list, i, key, keys = [];

                    // No events, or removing *all* events.
                    if (!(calls = this._callbacks)) return this;
                    if (!(events || callback || context)) {
                        delete this._callbacks;
                        return this;
                    }

                    for (key in calls) if (calls.hasOwnProperty(key)) keys[keys.length] = key;

                    events = events ? events.split(eventSplitter) : keys;

                    // Loop through the callback list, splicing where appropriate.
                    while (event = events.shift()) {
                        if (!(list = calls[event]) || !(callback || context)) {
                            delete calls[event];
                            continue;
                        }

                        for (i = list.length - 2; i >= 0; i -= 2) {
                            if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                                list.splice(i, 2);
                            }
                        }
                    }

                    return this;
                };

                // Trigger one or many events, firing all bound callbacks. Callbacks are
                // passed the same arguments as `trigger` is, apart from the event name
                // (unless you're listening on `"all"`, which will cause your callback to
                // receive the true name of the event as the first argument).
                this.trigger = function (events) {
                    var event, calls, list, i, length, args, all, rest;
                    if (!(calls = this._callbacks)) return this;

                    rest = [];
                    events = events.split(eventSplitter);

                    // Fill up `rest` with the callback arguments.  Since we're only copying
                    // the tail of `arguments`, a loop is much faster than Array#slice.
                    for (i = 1, length = arguments.length; i < length; i++) {
                        rest[i - 1] = arguments[i];
                    }

                    // For each event, walk through the list of callbacks twice, first to
                    // trigger the event, then to trigger any `"all"` callbacks.
                    while (event = events.shift()) {
                        // Copy callback lists to prevent modification.
                        if (all = calls.all) all = all.slice();
                        if (list = calls[event]) list = list.slice();

                        // Execute event callbacks.
                        if (list) {
                            for (i = 0, length = list.length; i < length; i += 2) {
                                list[i].apply(list[i + 1] || this, rest); //list[i].apply(list[i + 1], rest);
                            }
                        }

                        // Execute "all" callbacks.
                        if (all) {
                            args = [event].concat(rest);
                            for (i = 0, length = all.length; i < length; i += 2) {
                                all[i].apply(all[i + 1] || this, args); // all[i].apply(all[i + 1], args);
                            }
                        }
                    }
                    return this;
                };


                if(this.init){
                    return this.init.apply(this, arguments);
                    // TODO:
                    // afterInit :
                }

            }else{
                delete this.constructor.__initializing__;
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

        _class.prototype.__getAncestor__ = function(){return __ancestor__;};// 定义parent的 __base__ 属性，遍历parent的 __base__ 属性
        _class.prototype.__setAncestor__ = function(b){ __ancestor__ = b;};
        __ancestor__ = _class.prototype.__className__;

        _class.inherits = function(parent){
            if(typeof parent === 'function' && parent.prototype.__className__){

                // Instantiate a base class (but only create the instance,
                // don't run the init constructor)
                //parent.prototype.__initializing__ = true;
                parent.__initializing__ = true;

                var _super = parent.prototype, proto = new parent(), prop = this.prototype;

                prop.__setAncestor__(proto.__getAncestor__()); // set Ancestor Class name

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

                this.prototype.constructor = this;

                for(var t in parent){
                    if(!this[t]) this[t] = parent[t];
                }

            }else{
                // TODO:
                throw new Error('parent class type error!');
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
