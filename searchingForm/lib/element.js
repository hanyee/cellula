/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-5-21
 * Time: 下午2:01
 * To change this template use File | Settings | File Templates.
 */

var QueryElement = new Class('QueryElement',{
    key : '',
    value : '{}',
    data : {value:{}},
    //previous : null,
    errHandler : function(msg){
        alert(msg);
    },
    prepareData : function(fn){ // Deprecated
        // TODO:
        // this.previous = this;
        // this.setData();
        fn.apply(this, Array.prototype.slice.call(arguments,1));
        var ret = this.validate();

        if (ret !== undefined) { // validate method should not return anything if there's no validate error
            // throw 'QueryElement was failed to be constructed caused by '+ret;
            // this.rollback
            // this.value = this.previous.value;
            // this.data = this.previous.data;
            this.errHandler(ret);
            return false;
        }
        this.isValidated = true;
        return true;
    },
    set : function(cfg){
        if(!UtilTools.isObject(cfg['value'])) throw 'data structure error!';
        if(UtilTools.isObject(cfg)){
            var t = {};
            //t.data = UtilTools.mix({}, this.data, cfg);
            t.data = UtilTools.deepMix({}, this.data, cfg);
            var ret = this.validate.call(t);
            if (ret !== undefined) { // validate method should not return anything if there's no validate error
                // throw 'QueryElement was failed to be constructed caused by '+ret;
                this.errHandler(ret);
                return false;
            }
            this.data = UtilTools.mix({},t.data);
            this.isValidated = true;
            return true;
        }
    },
    setData : function(){
        //return this.value ? this.set(new Function("return {value : " + this.value + "}").call(this)) : true;
        return this.set(new Function("return {value : " + this.value + "}").call(this));
    },
    getValue : function(){
        //return this.value;
        return this.data.value;
    },
    getProp : function(name){
        return this.data[name];
    },
    validate : function(){},
    init : function (cfg) {
        if (typeof cfg === 'object') {
            for (var n in this) {
                //this[n] = cfg[n] ? cfg[n] : this[n];
                UtilTools.isObject(this[n]) && UtilTools.isObject(cfg[n]) ? this[n] = UtilTools.deepMix({},this[n],cfg[n]): this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
        this.setData();
        //this.prepareData(this.setData);
    }
});

var ElementFactory = function (typeClass, elements) {
    if (typeof elements === 'object' && typeof typeClass === 'function' && typeClass.prototype.__className__) {
        //var elArray = [];
        var elArray = {};
        for (var n in elements) {
            var t = new typeClass(elements[n]);
            //t.isValidated ? elArray.push(t) : delete t;
            t.isValidated ? elArray[t.key] = t : delete t;
        }
        return elArray;
    } else {
        throw 'can not parse elements!';
    }
};
