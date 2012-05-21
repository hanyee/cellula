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
    initCfg : function(cfg){
        if (typeof cfg === 'object') {
            for (var n in this) {
                this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
    },
    save : function(){
        for(var n in this.collection){
            var r = this.collection[n].setData.apply(this.collection[n], arguments);
            // TODO:
            // validateAll ?
            if(!r) return r;
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

