/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-4-28
 * Time: 下午4:31
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
    getData : function(){
        var data = {};
        for(var n in this.collection){
            data[this.collection[n].key] = this.collection[n].getValue();
        }
        return data;
    },
    registerEvents:function(){}
});

var SearchingForm = new Class('SearchingForm', {
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('search','doSearch');

        this.registerEvents();
    },
    getFormData : function(){
        return this.getData();
    },
    doSearch : function(e){
        // TODO:
        // to deal with different framework's events handler
        if(e){
            e.preventDefault();
        }

        //this.save();
        if(this.save.apply(this, arguments) === undefined){
            var formData = this.getFormData();
            // TODO:
            // next


            //return;
        }

        this.applyInterface('getDefault', this.search);




    },
    search : function(pageData){
        // TODO:
        // mix data
        console.log('search');
        console.log(pageData);
    }

}).inherits(SearchModuleBase);

var Paginator = new Class('Paginator', {
    pageDefault : {
        size : {},
        number: {}
    },
    paginate : function(){
        console.log('paginate');
        this.save();
        console.log(this.getData());

        this.applyInterface('search', this.getData());

    },
    getDefault : function(){
        return this.pageDefault;
    },
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('changeSize', 'paginate');

        this.registerEvents();
    },
    changeSize : function(){
        this.save();
        console.log('change');
        console.log(this.getData());
        // TODO:
        // mix this.getData() && this.pageDefault.number
        //this.applyInterface('search', mixed data);
    }
}).inherits(SearchModuleBase);


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
    init : function (cfg) {
        if (typeof cfg === 'object') {
            for (var n in this) {
                this[n] = cfg[n] ? cfg[n] : this[n];
            }
        }
        this.setData();
        //this.prepareData(this.setData);
    }
});

var ElementFactory = function (typeClass, elements) {
    if (typeof elements === 'object' && typeof typeClass === 'function' && typeClass.prototype.__className__) {
        var elArray = [];
        for (var n in elements) {
            var t = new typeClass(elements[n]);
            t.isValidated ? elArray.push(t) : delete t;
        }
        return elArray;
    } else {
        throw 'can not parse elements!';
    }
};
