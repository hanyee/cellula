/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-26
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */
(function(cellula){
    var util = cellula._util;
    cellula.Element = new cellula.Class('Element', {
        key : '',
        value : '{}',
        data : {value:{}},
        //previous : null,
        errHandler : function(msg){
            alert(msg);
        },
        validate : function(){},
        init : function (cfg) {
            if (typeof cfg === 'object') {
                for (var n in this) {
                    //this[n] = cfg[n] ? cfg[n] : this[n];
                    util.isObject(this[n]) && util.isObject(cfg[n]) ? this[n] = util.deepMix({}, this[n], cfg[n]) : this[n] = cfg[n] ? cfg[n] : this[n];
                    // TODO:
                    //this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({},this[n],cfg[n]) : cfg[n] ? cfg[n] : this[n];
                }
            }
            this.setData();
        },
        set : function(cfg){
            if(!util.isObject(cfg['value'])) throw 'data structure error!';
            if(util.isObject(cfg)){
                var t = {};
                //t.data = util.mix({}, this.data, cfg);
                t.data = util.deepMix({}, this.data, cfg);
                var ret = this.validate.call(t);
                if (ret !== undefined) {
                    // validate method should not return anything if there's no validate error
                    // throw 'QueryElement was failed to be constructed caused by '+ret;
                    this.errHandler(ret);
                    return false;
                }
                this.data = util.mix({},t.data);
                this.isValidated = true;
                return true;
            }
        },
        setData : function(){
            return this.set(new Function("return {value : " + this.value + "}").call(this));
        },
        getValue : function(){
            //return this.value;
            return this.data.value;
        },
        getProp : function(name){
            return this.data[name];
        }
        /*
        ,factory : function (elements) {
            if (typeof elements === 'object') {
                var els = {};
                for (var n in elements) {
                    var t = new this.constructor(elements[n]);
                    t.isValidated ? els[t.key] = t : delete t;
                }
                return els;
            } else {
                throw 'can not parse elements!';
            }
        }
*/
    });

    cellula.Element.factory = function (elements) {
        if (typeof elements === 'object') {
            var els = {};
            for (var n in elements) {
                var t = new this(elements[n]);
                t.isValidated ? els[t.key] = t : delete t;
            }
            return els;

        } else {
            throw 'can not parse elements!';
        }
    };
})(Cellula);