/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-5-21
 * Time: 下午2:00
 * To change this template use File | Settings | File Templates.
 */

var UtilTools = UtilTools || {};

UtilTools.isObject = function(obj){
    return /\bObject\b/.test(Object.prototype.toString.call(obj));
};

UtilTools.isArray = function(obj){
    return /\bArray\b/.test(Object.prototype.toString.call(obj));
};

UtilTools.isEmptyObject = function( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
};

UtilTools.copy = function(obj){
    if (!this.isObject(obj)) return obj;
    return this.isArray(obj) ? obj.slice() : this.mix({},obj);
};

UtilTools.mix = function(){
    var ret = arguments[0] || {};
    for(var i=1, l=arguments.length; i<l; i++){
        var t = arguments[i];
        if(typeof t === 'object'){ // if Array is not allowed --> UtilTools.isObject(t)
            for(var n in t){
                ret[n] = t[n];
            }
        }
    }
    return ret;
};

UtilTools.deepMix = function(){
    var ret = arguments[0] || {};
    for(var i=1, l=arguments.length; i<l; i++){
        var t = arguments[i];
        if(typeof t === 'object'){ // if Array is not allowed --> UtilTools.isObject(t)
            for(var n in t){
                typeof ret[n] === 'object' && typeof t[n] === 'object' ? ret[n] = this.deepMix({}, ret[n], t[n]) : ret[n] = t[n];
            }
        }
    }
    return ret;
};

UtilTools.getFirstPropName = function(obj){
    if(this.isObject(obj)){
        for(var name in obj){
            return name;
        }
    }
};

UtilTools.makeTpl = function(tpl, data) {
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

UtilTools.parseTpl = function(tpl, data) {
    var newTpl = tpl;
    for (var n in data) {
        var regHead = new RegExp("(\\$\\-\\{#" + n + "\\})", "g"),
            regTail = new RegExp("(\\$\\-\\{/" + n + "\\})", "g"),
            reg = new RegExp("(\\$\\-\\{#" + n + "\\})(.*)(\\$\\-\\{/" + n + "\\})", "g");

        if(data[n] === false){
            newTpl = newTpl.replace(reg, '');
        }else if(this.isArray(data[n])){
            var t = reg.exec(tpl)[2],
                s = '',
                d = data[n];

            for(var i=0; i<d.length; i++){
                s += this.parseTpl(t, d[i]);
            }
            newTpl = newTpl.replace(reg, s);
        }else{
            newTpl = newTpl.replace(regHead, '').replace(regTail, '');
        }
    }

    return this.makeTpl(newTpl, data);
};

var UT = UtilTools;
