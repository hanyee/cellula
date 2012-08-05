/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */
(function(util){

    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        unshift = ArrayProto.unshift,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use are declared here.
    var nativeForEach = ArrayProto.forEach,
        nativeMap = ArrayProto.map,
        nativeReduce = ArrayProto.reduce,
        nativeReduceRight = ArrayProto.reduceRight,
        nativeFilter = ArrayProto.filter,
        nativeEvery = ArrayProto.every,
        nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind;

    var breaker = util.breaker = 'breaker';

    var isArray = util.isArray = function(obj){
        if(nativeIsArray) return nativeIsArray(obj);
        return toString.call(obj) === '[object Array]';
    };

    var has = util.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    // Retrieve the names of an object's properties.
      // Delegates to **ECMAScript 5**'s native `Object.keys`
      _.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
      };

    var each = util.each = function (obj, fn, context) {
        if (!obj) return;
        if (nativeForEach && nativeForEach === obj.forEach) {
            obj.forEach(fn, context);
        } else if (isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (fn.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)) {
                    if (fn.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };


    util.isObject = function(obj){
        return obj === null ? false : /\bObject\b/.test(Object.prototype.toString.call(obj));
    };

    util.isArray = function(obj){
        return /\bArray\b/.test(Object.prototype.toString.call(obj));
    };

    util.isEmptyObject = function( obj ) {
        if (this.isObject(obj)) {
            for (var name in obj) {
                return false;
            }
            return true;
        }else{
            throw new Error('object type error!');
        }
    };

    util.copy = function(obj){
        if (!this.isObject(obj)) return obj;
        return this.isArray(obj) ? obj.slice() : this.mix({},obj);
    };

    util.mix = function(){
        var ret = arguments[0] || {};
        for(var i=1, l=arguments.length; i<l; i++){
            var t = arguments[i];
            if(typeof t === 'object'){ // if Array is not allowed --> util.isObject(t)
                for(var n in t){
                    ret[n] = t[n];
                }
            }
        }
        return ret;
    };

    util.deepMix = function(){
        var ret = arguments[0] || {};
        for(var i=1, l=arguments.length; i<l; i++){
            var t = arguments[i];
            if(typeof t === 'object'){ // if Array is not allowed --> util.isObject(t)
                for(var n in t){
                    typeof ret[n] === 'object' && typeof t[n] === 'object' ? ret[n] = this.deepMix({}, ret[n], t[n]) : ret[n] = t[n];
                }
            }
        }
        return ret;
    };

    util.getFirstPropName = function(obj){
        if(this.isObject(obj)){
            for(var name in obj){
                return name;
            }
        }
    };

    util.makeTpl = function(tpl, data) {
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

    util.parseTpl = function(tpl, data) {
        var newTpl = tpl, tagReg = new RegExp("\\$\\-\\{#(.*)\\}");
/*
        for (var n in data) {
            var regHead = new RegExp("(\\$\\-\\{#" + n + "\\})", "g"),
                regTail = new RegExp("(\\$\\-\\{/" + n + "\\})", "g"),
                reg = new RegExp("(\\$\\-\\{#" + n + "\\})(.*)(\\$\\-\\{/" + n + "\\})", "g");

            if(data[n] === false){
                newTpl = newTpl.replace(reg, '');
            }else if(this.isArray(data[n])){
                var r = reg.exec(tpl);
                if(r){
                    var t = r[2],
                        s = '',
                        d = data[n];

                    for(var i=0; i<d.length; i++){
                        s += this.parseTpl(t, d[i]);
                    }
                    newTpl = newTpl.replace(reg, s);
                }
            }else{
                newTpl = newTpl.replace(regHead, '').replace(regTail, '');
            }
        }
*/
        function parse(prop){
            var regHead = new RegExp("(\\$\\-\\{#" + prop + "\\})", "g"),
                regTail = new RegExp("(\\$\\-\\{/" + prop + "\\})", "g"),
                reg = new RegExp("(\\$\\-\\{#" + prop + "\\})(.*)(\\$\\-\\{/" + prop + "\\})", "g");

            if(data[prop] === false || !data[prop]){
                newTpl = newTpl.replace(reg, '');
            }else if(this.isArray(data[prop])){
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

        return this.makeTpl(newTpl, data);
    };

    util.addClass = function(node, className){
        if(node){
            if(node.className === '') {node.className = className;return;}
            if(!new RegExp('('+className+')').test(node.className)) node.className = node.className + ' ' + className;
        }
    };

    util.removeClass = function(node, className){
        if(node && node.className){
            var reg = new RegExp('(\\s'+className+')');
            if(reg.test(node.className)) {node.className = node.className.replace(reg, ''); return ;}
            reg = new RegExp('(' + className + ')');
            if(reg.test(node.className)) node.className = node.className.replace(reg, '');
        }
    };

    util.getElementsByClassName = function(searchClass, node, tag) {
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
})(Cellula._util);
