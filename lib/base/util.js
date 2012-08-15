/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
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
 /*
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    var reduce = util.reduce = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function (value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value, index, list);
            }
        });
        if (!initial) throw new TypeError('Reduce of empty array with no initial value');
        return memo;
    };

    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    var reduceRight = util.reduceRight = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
        }
        var reversed = _.toArray(obj).reverse();
        if (context && !initial) iterator = _.bind(iterator, context);
        return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
    };


    var bind = util.bind = function (func, obj) { // deprecated
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    };
    */

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
