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
            //var formData = this.getFormData();
            // TODO:
            // next
            //return;

            //this.applyInterface('getDefault', this.search);
            this.applyInterface('getData', this.search, 'sizePerPageStr');

        }
    },
    search : function(pageData){
        // TODO:
        // mix data
        var data = UtilTools.mix(this.getFormData(),pageData);
        console.log('search');
        //console.log(pageData);
        console.log(data);
    }

}).inherits(SearchModuleBase);

var Paginator = new Class('Paginator', {
    pageDefault : {
        size : {},
        number: {},
        page : {
            first : 1,
            last : null,
            prev : null,
            next : null,
            totalItems : null,
            totalPages : null,
            current : null,
            currentArray : null
        }
    },
    typeEnum : {
        first : '\\bfirst\\b',
        last : '\\blast\\b',
        prev : '\\bprev\\b',
        next : '\\bnext\\b'
        //current : '\\bcurrent\\b'
        //number : '(\\D*)(\\d+)(\\D*)'
    },
    getOperationType : function(name){
        for(var n in this.typeEnum){
            if(new RegExp(this.typeEnum[n]).test(name)) return n;
        }
    },
    calcNumber : function(t){
        var type = this.getOperationType(t.className), c = parseInt(this.getData('page')['current']), l = this.getData('page')['totalPages'];

        console.log(t.className);
        console.log(type);
        console.log(c);

        if(type === undefined){
            return /(\D*)(\d+)(\D*)/.exec(t.innerHTML)[2];
        }
        // if(type === 'first') return 1;
        if(type === 'last') return l;
        if(type === 'prev') return c - 1;
        if(type === 'next') return c + 1;

        return 1;
    },
    paginate : function(e){
        console.log('paginate');
        this.save();

        //console.log(this.calcNumber(e.currentTarget));
        this.get('number').set({value : {number : this.calcNumber(e.currentTarget)}});

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
    changeSize : function(e){
        this.save();
        console.log('change');
        //console.log(this.getData());
        //console.log(this.getData('number'));
        //console.log(this.getData('sizePerPageStr'));
        // TODO:
        // mix this.getData() && this.pageDefault.number
        this.applyInterface('search', UT.mix(this.getData(),this.pageDefault.number));
    }
}).inherits(SearchModuleBase);

var QueryElement = new Class('QueryElement',{
    key : '',
    //value : '',
    data : {},
    //previous : null,
    errHandler : function(){},
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
        /*
        return this.prepareData(function(cfg){
            if(typeof cfg === 'object'){
                for(var n in cfg){
                    this.data[n] = cfg[n];
                }
                this.value = this.data.value ? this.data.value : this.value;
            }
        }, cfg);
        */

        if(UtilTools.isObject(cfg)){
            var t = {};
            // var t = UtilTools.mix(this);
            t.data = UtilTools.mix({}, this.data, cfg);

            var ret = this.validate.call(t);

            if (ret !== undefined) { // validate method should not return anything if there's no validate error
                // throw 'QueryElement was failed to be constructed caused by '+ret;
                this.errHandler(ret);
                return false;
            }
            this.data = t.data;
            this.isValidated = true;
            return true;
        }
    },
    setData : function(){},
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
                this[n] = cfg[n] ? cfg[n] : this[n];
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

var UtilTools = UtilTools || {};

UtilTools.isObject = function(obj){
    return /\bObject\b/.test(Object.prototype.toString.call(obj));
};

UtilTools.isArray = function(obj){
    return /\bArray\b/.test(Object.prototype.toString.call(obj));
};

UtilTools.copy = function(obj){
    /*
    var r = {};
    if(UtilTools.isObject(obj)){
        if(UtilTools.isObject(arguments[1])){

        }else{

        }
    }
    if(UtilTools.isObject(obj)){
        t = obj;
    }
    return t;
    */


    if (!UtilTools.isObject(obj)) return obj;
    return UtilTools.isArray(obj) ? obj.slice() : UtilTools.mix({},obj);
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

var UT = UtilTools;