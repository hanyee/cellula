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
    getFormData : function(){
        return this.getData();
    },
    doSearch : function(e){
        // TODO:
        // to deal with different framework's events handler
        var pageDefault, size, postData, isEvent = false;
        if(e && e.preventDefault){
            e.preventDefault();
            isEvent = true;
        }

        if(this.save.apply(this, isEvent?arguments:[]) === undefined){
            if(isEvent || (!isEvent && !e)){ // trigger by event // direct operation
                pageDefault = this.applyInterface('getDefault');
                size = this.applyInterface('getData', 'size');
                postData = UtilTools.mix(this.getFormData(), UtilTools.isEmptyObject(size)?pageDefault.size?pageDefault.size:size:size, pageDefault.number?pageDefault.number:{});
            }else{
                if(e){ // triggered by paginator
                    postData = UtilTools.mix({},this.getFormData(), e);
                }
            }

            console.log('dosearch');
            //console.log(postData);
            this.search.call(this, postData);

            // paginating

        }
    },
    search : function(data){
        console.log('search');
        console.log(data);
        //this.customSearch.call(this, data);
    },
    customSearch : function(){} // Deprecated
}).inherits(SearchModuleBase);
