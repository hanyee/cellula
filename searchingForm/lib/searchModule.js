/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-5-21
 * Time: 下午1:58
 * To change this template use File | Settings | File Templates.
 */

var SearchModuleBase = new Class('SearchModuleBase' ,{
    root : null,
    collection : null,
    validateAll : false,
    hideClass : 'fn-hide',
    getNode : function(rootStyle, tip){
        var nodesArray = UtilTools.getElementsByClassName(rootStyle, document, 'div'); //document.getElementsByClassName(rootStyle);
        if(nodesArray.length > 1 && document.getElementById(this.root)) return document.getElementById(this.root);
        if(nodesArray.length === 1) return nodesArray[0];
        tip = tip || '';
        throw new Error('root id undefined or more ' + tip + '!');
    },
    initCfg : function(cfg){
        if (typeof cfg === 'object') {
            for (var n in this) {
                //this[n] = cfg[n] ? cfg[n] : this[n];
                UtilTools.isObject(this[n]) && UtilTools.isObject(cfg[n]) ? this[n] = UtilTools.deepMix({},this[n],cfg[n]): this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
    },
    save:function () { // save the specified element
        var c = this.collection, o = arguments[0];
        if (typeof o === 'string') return c[o] ? c[o].setData.call(c[o]) : undefined;

        for (var n in this.collection) {
            var r = this.collection[n].setData.apply(this.collection[n], arguments);
            // TODO:
            // validateAll ?
            if (!r) return r;
        }
    },
    get : function(){
        if(arguments.length === 0){
            return this.collection;
        }
        return this.collection[arguments[0]];
    },
    getData : function(){
        var data = {}, l = arguments.length;
        if(l === 0){
            for(var n in this.collection){
                //data[this.collection[n].key] = this.collection[n].getValue();
                data = UtilTools.mix(data, this.collection[n].data.value);
            }
        }else{
            for(var i=0; i<l; i++ ){
                data = UtilTools.mix(data, this.collection[arguments[i]].data.value);
            }
        }
        return data;
    },
    registerEvents:function(){}
});

