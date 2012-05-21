/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-4-28
 * Time: 下午4:31
 * To change this template use File | Settings | File Templates.
 */

var SearchingForm = new Class('SearchingForm', {
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('search','doSearch');

        this.registerEvents();

    },
    setDefault : function(d){
        this.pageDefault = d;
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

            //this.applyInterface('getDefault', this.search);

            this.applyInterface('getDefault', this.setDefault);
            this.applyInterface('getData', this.search, 'size');
        }
    },
    search : function(pageData){
        // TODO:
        // mix data
        if(!pageData[UtilTools.getFirstPropName(this.pageDefault.number)]){
            pageData = UtilTools.mix(pageData, this.pageDefault.number);
        }
        var data = UtilTools.mix(this.getFormData(),pageData);
        console.log('search');
        //console.log(pageData);
        console.log(data);
        this.customSearch.call(this, data);
    },
    customSearch : function(){}
}).inherits(SearchModuleBase);
