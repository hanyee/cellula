/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-4-28
 * Time: 下午4:31
 * To change this template use File | Settings | File Templates.
 */

var SearchingForm = new Class('SearchingForm', {
    root : null,
    collection : null,
    validateAll : false,
    init : function(cfg){
        if (typeof cfg === 'object') {
            for (var n in this) {
                this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
        //this.root = root;
        //this.collection = collection;
        //this.search = this.bind(this.search,this);

        this.bindAll('search');

        this.registerEvents();
    },
    save : function(){
        for(var n in this.collection){
            var r = this.collection[n].setData();
            // TODO:
            // validateAll ?
            if(!r) return r;
        }
    },
    getFormData : function(){
        var data = {};
        for(var n in this.collection){
            //this.collection[n].setData();
            data[this.collection[n].key] = this.collection[n].getValue();
        }
        return data;
    },
    registerEvents:function(){},
    search : function(e){
        //this.save();
        if(this.save() === undefined){
            var formData = this.getFormData();
            // TODO:
            // next


            return;
        }
        if(e){
            e.preventDefault();
        }
        console.log(this);
        console.log(formData);
    }

});

var QueryElement = new Class('QueryElement',{
    key : '',
    value : '',
    data : {},
    previous : null,
    errHandler : function(){},
    prepareData : function(fn){
        // TODO:
        // this.previous = this;
        //this.setData();
        fn.apply(this, Array.prototype.slice.call(arguments,1));
        var ret = this.validate();

        if (ret !== undefined) { // validate method should not return anything if there's no validate error
            // throw 'QueryElement was failed to be constructed caused by '+ret;
            // this.rollback
            //this.value = this.previous.value;
            //this.data = this.previous.data;
            this.errHandler(ret);
            return false;
        }
        this.isValidated = true;
        return true;
    },
    set : function(cfg){
        return this.prepareData(function(cfg){
            if(typeof cfg === 'object'){
                for(var n in cfg){
                    this.data[n] = cfg[n];
                }
                this.value = this.data.value ? this.data.value : this.value;
            }
        }, cfg);
    },
    setData : function(){},
    getValue : function(){
        return this.value;
    },
    getProp : function(name){
        return this.data[name];
    },
    validate : function(){},
    init:function (cfg) {
        if (typeof cfg === 'object') {
            for (var n in this) {
                this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
        this.setData();
        //this.prepareData(this.setData);
    }
});

//var QueryElementFactory = new Class('QueryElementFactory',{
//    makeElement : function(elements){
var QueryElementFactory = function(elements){
        if(typeof elements === 'object'){
            var elArray = [];
            for(var n in elements){
                var t = new QueryElement(elements[n]);
                //for(var nn in t){
                //    t[nn] = elements[n][nn]?elements[n][nn]:t[nn];
                //}
                t.isValidated ? elArray.push(t) : delete t;
            }
            return elArray;
        }else{
            throw 'can not parse elements!';
        }
    };
//});