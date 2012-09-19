define(function(require, exports, module){

    /**
     * @fileOverview Cellula Framework's namespace definition.
     * @description: defines util,class,cell,element,collection
     * @version: 0.3.2
     * @author: @hanyee
     */

    var Cellula = {_cellula : Cellula};

    Cellula.version = '0.3.2';

    Cellula._util = {};

    Cellula.Class = undefined;

    Cellula.Cell = undefined;

    Cellula.Element = undefined;

    Cellula.Collection = undefined;


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


    /**
     * @fileOverview Cellula Framework's core utility library definition.
     * @description: a utility library for Cellula that provides a lot of the functional programming support
     * @namespace: Cellula
     * @author: @hanyee
     */
    (function(util, classCtor){

        var ArrayProto = Array.prototype,
            ObjProto = Object.prototype,
            FuncProto = Function.prototype;

        // Create quick reference variables for speed access to core prototypes.
        var slice = util.slice = ArrayProto.slice,
            //push = ArrayProto.push,
            //unshift = ArrayProto.unshift,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;

        // All ES 5 native function implementations that we hope to use are declared here.
        var nativeForEach = ArrayProto.forEach,
            nativeMap = ArrayProto.map,
            nativeReduce = ArrayProto.reduce,
            nativeReduceRight = ArrayProto.reduceRight,
            //nativeFilter = ArrayProto.filter,
            //nativeEvery = ArrayProto.every,
            //nativeSome = ArrayProto.some,
            //nativeIndexOf = ArrayProto.indexOf,
            //nativeLastIndexOf = ArrayProto.lastIndexOf,
            nativeIsArray = Array.isArray,
            nativeKeys = Object.keys,
            nativeBind = FuncProto.bind;

        var breaker = util.breaker = 'breaker is used to break a loop';

        var isArray = util.isArray = function(obj){
            if(nativeIsArray) return nativeIsArray(obj);
            return toString.call(obj) === '[object Array]';
            //return /\bArray\b/.test(toString.call(obj));
        };

        var isObject = util.isObject = function (obj) {
            //return obj === Object(obj);
            //return obj === null ? false : /\bObject\b/.test(toString.call(obj));
            return obj === null ? false : toString.call(obj) === '[object Object]';
        };
        var isString = util.isString = function (obj) {
            return toString.call(obj) === '[object String]';
            //return /\bString\b/.test(toString.call(obj));
        };

        var isFunction = util.isFunction = function (obj) {
            return toString.call(obj) === '[object Function]';
            //return /\bFunction\b/.test(toString.call(obj));
        };

        var isArguments = util.isArguments = function (obj) {
            return toString.call(obj) === '[object Arguments]';
            //return /\bArguments\b/.test(toString.call(obj));
        };

        var isClass = util.isClass = function(func){
            return isFunction(func) && func.toString() === classCtor().toString();
        };


        var has = util.has = function(obj, key) {
            return hasOwnProperty.call(obj, key);
        };

        var isEmpty = util.isEmpty = function (obj, isEnum) { // isEnum is a flag that be used to judge enumerable properties of an object
            if (!obj) return true;
            if (isArray(obj) || isString(obj)) return obj.length === 0;
            for (var key in obj) {
                if (isEnum){
                    if(has(obj, key)) return false;
                }else {
                    return false;
                }
            }
            return true;
        };

        var iterator = util.iterator = function(v){return v};

        // There is no guarantee that for...in will return the indexes in any particular order
        // and it will return all enumerable properties,
        // including those with non–integer names and those that are inherited.
        var each = util.each = function (obj, fn, context, breaker) {
            if (!obj) return;
            if (breaker != null) {
                for (var key in obj) {
                    if (isObject(obj) && has(obj, key) || isArray(obj) && key in obj) { // || obj === Object(obj)
                        if (fn.call(context, obj[key], key, obj) === breaker) return key;
                    }
                }
            } else {
                if (nativeForEach && nativeForEach === obj.forEach) {
                    obj.forEach(fn, context);
                } else {
                    for (var key in obj) {
                        if (isObject(obj) && has(obj, key) || isArray(obj) && key in obj) {
                            fn.call(context, obj[key], key, obj);
                        }
                    }
                }
            }
        };


        // Return the results of applying the iterator to each element.
        // Delegates to ES 5 's native 'map' if available.
        var map = util.map = function (obj, fn, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && nativeMap === obj.map) return obj.map(fn, context);
            each(obj, function (value, index, list) {
                results[results.length] = fn.call(context, value, index, list);
            });
            return results;
        };

        // Retrieve the names of an object's properties.
        // Delegates to ES 5 's native 'Object.keys'
        var keys = util.keys = function (obj) {
            if(nativeKeys) return nativeKeys(obj);
            if (obj !== Object(obj)) throw new TypeError('Invalid object');

            var keys = [];
            for (var key in obj) if (has(obj, key)) keys[keys.length] = key;
            return keys;

            //return map(obj, iterator);
        };

        // Retrieve the values of an object's properties.
        var values = util.values = function (obj) {
            return map(obj, iterator);
        };

        var emptyFunc = util.emptyFunc = function(){};

        var bind = util.bind = function (func, context) {
            var bound, args;
            if (nativeBind && nativeBind === func.bind) return nativeBind.call(func, context);
            if (!isFunction(func)) throw new TypeError;
            args = slice.call(arguments, 2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, slice.call(arguments));
                emptyFunc.prototype = func.prototype;
                var self = new emptyFunc;
                var result = func.apply(self, slice.call(arguments));
                if (Object(result) === result) return result;
                return self;
            };
        };

        // Safely convert anything iterable into a real, live array.
        var toArray = util.toArray = function (obj) {
            if (!obj) return [];
            if (isArray(obj) || isArguments(obj)) return slice.call(obj); // return a new array, not obj itself
            if (obj.toArray && isFunction(obj.toArray)) return obj.toArray();
            return values(obj);
        };

        // deprecated
        var isEmptyObject = util.isEmptyObject = function (obj) {
            if (isObject(obj)) {
                for (var name in obj) {
                    return false;
                }
                return true;
            } else {
                throw new Error('object type error!');
            }
        };

        var mix = util.mix = function(){
            var ret = arguments[0] || {};
            for(var i=1, l=arguments.length; i<l; i++){
                var t = arguments[i];
                if(isObject(t) || isArray(t)){ // if Array is not allowed --> isObject(t)
                    for(var n in t){
                        ret[n] = t[n];
                    }
                }
            }
            return ret;
        };

        var deepMix = util.deepMix = function(){
            var ret = arguments[0] || {};
            for(var i=1, l=arguments.length; i<l; i++){
                var t = arguments[i];
                if(isObject(t) || isArray(t)){ // if Array is not allowed --> util.isObject(t)
                    for(var n in t){
                        //typeof ret[n] === 'object' && typeof t[n] === 'object' ? ret[n] = this.deepMix({}, ret[n], t[n]) : ret[n] = t[n];
                        ret[n] = (isObject(ret[n]) || isArray(ret[n])) && (isObject(t[n]) || isArray(t[n])) ? deepMix({}, ret[n], t[n]) : t[n];
                    }
                }
            }
            return ret;
        };

        var copy = util.copy = function(obj){
            if (!isObject(obj)) return obj;
            return isArray(obj) ? obj.slice() : mix({}, obj);
        };

        // deprecated
        var getFirstPropName = util.getFirstPropName = function(obj){
            if(isObject(obj)){
                for(var name in obj){
                    return name;
                }
            }
        };

        var makeTpl = util.makeTpl = function(tpl, data) {
            var newTpl = tpl;
            for (n in data) {
                var reg = new RegExp("(\\$\\-\\{" + n + "\\})", "g");
                newTpl = newTpl.replace(reg, data[n]);
            }
            // replace extra placeholders with '' || if there's no matching data for it
            var r = new RegExp("(\\$\\-\\{[/#a-zA-Z0-9]+\\})", "g");
            newTpl = newTpl.replace(r, "");

            return newTpl;
        };

        var parseTpl = util.parseTpl = function(tpl, data) {
            var newTpl = tpl, tagReg = new RegExp("\\$\\-\\{#(.*)\\}");

            function parse(prop){
                var regHead = new RegExp("(\\$\\-\\{#" + prop + "\\})", "g"),
                    regTail = new RegExp("(\\$\\-\\{/" + prop + "\\})", "g"),
                    reg = new RegExp("(\\$\\-\\{#" + prop + "\\})(.*)(\\$\\-\\{/" + prop + "\\})", "g");

                if(data[prop] === false || !data[prop]){
                    newTpl = newTpl.replace(reg, '');
                }else if(isArray(data[prop])){
                    var r = reg.exec(tpl);
                    if(r){
                        var t = r[2],
                            s = '',
                            d = data[prop];

                        for(var i=0; i<d.length; i++){
                            s += this.parseTpl.call(this, t, d[i]);
                        }
                        newTpl = newTpl.replace(reg, s);
                    }
                }else{
                    newTpl = newTpl.replace(regHead, '').replace(regTail, '');
                }
                return newTpl;
            }

            for (var n in data) {
                //newTpl = parse.call(this, n, newTpl);
                parse.call(this, n);
            }

            while(tagReg.test(newTpl)){
                var p = tagReg.exec(newTpl)[1];
                p = p.substring(0, p.indexOf('}')); // to be strict
                parse.call(this, p);
            }

            return makeTpl(newTpl, data);
        };

        var addClass = util.addClass = function(node, className){
            if(node){
                if(node.className === '') {node.className = className;return;}
                if(!new RegExp('('+className+')').test(node.className)) node.className = node.className + ' ' + className;
            }
        };

        var removeClass = util.removeClass = function(node, className){
            if(node && node.className){
                var reg = new RegExp('(\\s'+className+')');
                if(reg.test(node.className)) {node.className = node.className.replace(reg, ''); return ;}
                reg = new RegExp('(' + className + ')');
                if(reg.test(node.className)) node.className = node.className.replace(reg, '');
            }
        };

        var getElementsByClassName = util.getElementsByClassName = function(searchClass, node, tag) {
            node = node || document;
            if(node.getElementsByClassName){
                return  node.getElementsByClassName(searchClass);
            }else{
                tag = tag || '*';
                var returnElements = [],
                    els = node.getElementsByTagName(tag), //var els =  (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag);
                    i = els.length,
                    reg = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
                while(--i >= 0){
                    if (reg.test(els[i].className) ) {
                        returnElements.push(els[i]);
                    }
                }
                return returnElements;
            }
        };
    })(Cellula._util, Cellula.Class);


    /**
     * @fileOverview Cellula Framework's cell definition.
     * @description: defines cell
     * @namespace: Cellula
     * @author: @hanyee
     */

    (function (cellula) {
        var util = cellula._util,
            nativeBind = Function.prototype.bind,
            slice = Array.prototype.slice;

        cellula.Cell = new cellula.Class('Cell', {
            key : undefined,
            rootNode : undefined,
            collection : undefined,
            _rootClass : 'Cell',

            // Bind all of an object's methods to that object. Useful for ensuring that
            // all callbacks defined on an object belong to it.
            _bindAll:function () {
                for (var n = 0; n < arguments.length; n++) {
                    this[arguments[n]] = util.bind(this[arguments[n]], this);
                }

                return this;
            },
            _initCfg : function(cfg){
                if (util.isObject(cfg)) {
                    for (var n in this) {
                        if(cfg.hasOwnProperty(n)){
                            this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                        }
                    }
                }
            },
            init:function (cfg) {
                this._initCfg(cfg);
                this.rootNode = this.getRoot();
            },
            getCollection : function(){
                return this.collection;
            },
            getNode : function(root, target, tag){// id || unique style
                root = root || '';
                target = target || document;
                tag = tag || 'div';
                var node = document.getElementById(root);
                if(node) return node;
                var nodesArray = util.getElementsByClassName(root, target, tag);
                if(nodesArray.length === 1) return nodesArray[0];

                //throw new Error('root id, unique style class undefined or more document nodes have unique style class!');
            },
            getRoot : function(){
                return this.rootNode ? this.rootNode : this.getNode(this.key);
            },
            show : function(flag, node){
                if(!this.rootNode) this.rootNode = this.getRoot();
                node = node || this.rootNode;
                if(flag) return util.removeClass(node, this.hideClass);
                util.addClass(node, this.hideClass);
            },
            error : function(){},
            render : function(){
                this.registerEvents();
            },
            registerEvents:function(){}
        });

    })(Cellula);


    /**
    * @fileOverview Cellula Framework's element definition.
    * @description: defines element
    * @namespace: Cellula
    * @author: @hanyee
    */

    (function(cellula){
       var util = cellula._util;

       cellula.Element = new cellula.Class('Element', {
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
               if(!this.key) this.key = this.__cid__;
               if(cfg && !(cfg.silent || this.silent)) this.save();
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
           save : function(){
               //return this.set(new Function("return {value : " + this.value + "}").call(this));
           },
           destroy : function(){
               return this.applyInterface('Collection.remove', this.key);
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


    /**
    * @fileOverview Cellula Framework's collection definition.
    * @description: it could be a collection of either elements or cells
    * @namespace: Cellula
    * @author: @hanyee
    */

    (function(cellula){
       var util = cellula._util;
       cellula.Collection = new cellula.Class('Collection', {
           type : undefined,
           _index : [], // [{key:'key',cid:'cid'}...]
           _elements : {}, //{key:'key',el:element}
           _initCfg:function (cfg) {
               if (util.isObject(cfg)) {
                   for (var n in this) {
                       if (cfg.hasOwnProperty(n)) {
                           this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                       }
                   }
               }
           },
           _elConfig : function(obj){
               if(util.isObject(obj)){
                   var t = new this.type(obj);
                   t.registerInterface('remove', this);
                   //if(t._isValidated){
                       this._elements[t.key] = t;
                       this._index.push(t.key);
                   //}else{
                   //    delete t;
                   //}
               }
           },
           init : function(cfg, els){
               //this._initCfg({_index : [], _elements : {}});
               //if(!util.isInstanceOfClass(this.type)) throw new TypeError('"type" is invalid!');
               /*
               util.each(util.slice.call(arguments), function(v){
                   if(util.isArray(v)){
                       util.each(v, function(obj){
                           this._elConfig(obj);
                       }, this);
                   }else this._elConfig(v);

               }, this);
               */
               this._initCfg(cfg);

               if (util.isArray(els)) {
                   util.each(els, function (obj) {
                       this._elConfig(obj);
                   }, this);
               } else this._elConfig(els);

           },
           // getHash : toJSON ???
           reverse : function(){
               return this._index.reverse();
           },
           add : function(el, toIndex){

           },
           remove : function(el){// key,el,  cid(deprecated, cause key is always asigned)
               if(el){
                   // key
                   if(util.isString(el)) {
                       delete this._elements[el];
                       util.each(this._index, function(v, i){
                           if(v == el) this._index.splice(i,1);
                       }, this);
                   }

                   // el
                   if (el instanceof this.type) {
                       delete this._elements[el.key];
                       util.each(this._index, function (v, i) {
                           if (v == el.key) this._index.splice(i,1);
                       }, this);
                   }
               }
           },
           push : function(el){

           },
           pop : function(a){

           },
           get : function(key){ // returns all elements by default, key is optional,
               // returns all elements by default
               // key === undefined ?
               if(!key) return util.values(util.mix({}, this._elements));

               // returns the specific element with the given key, if element is not exist returns undefiend
               if(util.isString(key)) return this._elements[key];

               // returns the specific elements with the given keys in an array
               if(util.isArray(key)){
                   var t = [];
                   util.each(key,function(v){
                       if(util.isString(v)) t.push(this._elements[v]);
                   }, this);
                   return t;
               }
           },
           save : function(key){
               var els = this._elements, ret, i, l, n;
               if(this.type.prototype.__getAncestor__() === 'Cell') {
                   // if cell apply cell.collecton.save
                   if(util.isString(key)) return els[key] && els[key].collection ? els[key].collection.save() : false;

                   if(util.isArray(key)){
                       for(i=0, l=key.length; i<l;i++){
                           ret = els[key[i]] && els[key[i]].collection ? els[key[i]].collection.save() : false;
                           if(!ret) return ret;
                       }
                   }

                   // key === undefined?
                   if(!key) {
                       for(n in els){
                           ret = els[n] && els[n].collection ? els[n].collection.save() : false;
                           if(!ret) return ret;
                       }
                   }

                   return true;
               }

               if(this.type.prototype.__getAncestor__() === 'Element') {
                   // if element
                   // saves all elements by default, or [key1, key2, key3...] is optional,
                   // apply element's save method,if no error returns true

                   if(util.isString(key)) return els[key] ? (els[key].save()): false;
                   if(util.isArray(key)){
                       for(i=0, l=key.length; i<l;i++){
                           ret = els[key[i]]? els[key[i]].save() : false;
                           if(!ret) return ret;
                       }
                   }

                   // key === undefined?
                   if(!key) {
                       for(n in els){
                           ret = els[n]?els[n].save() : false;
                           if(!ret) return ret;
                       }
                   }

                   return true;
               }

               return false;
           }
       });
   })(Cellula);




    return Cellula;
});