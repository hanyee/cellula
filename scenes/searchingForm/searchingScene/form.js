/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:55
 * To change this template use File | Settings | File Templates.
 */
(function(cellula){
    var util = cellula._util;
    this.SearchingForm = new cellula.Class('SearchingForm', {
        validateAll : false,
        init : function(cfg){
            this._super(cfg);
            this._bindAll('search','doSearch','dataDispatch');
            this.render();

            //this.registerEvents();
        },
        doSearch : function(e){
            // TODO:
            // to deal with different framework's events handler
            var pageDefault, size, postData, isEvent = false;
            if(e && e.preventDefault){
                e.preventDefault();
                isEvent = true;
            }
            //if(this.save.apply(this, isEvent?arguments:[]) === undefined){
            //    if(isEvent || (!isEvent && !e)){ // trigger by event // direct operation
            //if(){
                if((isEvent || (!isEvent && !e) ) && this.save.apply(this, isEvent?arguments:[]) === undefined){ // trigger by event // direct operation
                    pageDefault = this.applyInterface('getDefault');
                    //size = this.applyInterface('getData', 'size');
                    size = this.applyInterface('getSavedData', 'size');
                    postData = util.mix(this.getData(), util.isEmptyObject(size) || !size[util.getFirstPropName(size)] ? (pageDefault.size?pageDefault.size:size) : size, pageDefault.number?pageDefault.number:{});
                }else{
                    if(e){ // triggered by paginator
                        postData = util.mix({},this.getData(), e);
                    }
                }
                if(postData) this.search(postData);

            //}
        },
        search : function(data){
            //console.log('search');
            //console.log(data);
            //this.customSearch.call(this, data);
        },
        dataDispatch : function(data){  // for ajax
            /**
             * data struct
             * {
             *     dataTable:{
             *         rows : [{...},{...}...]
             *     },
             *     paging:{
             *         size:{...},
             *         number:{...},
             *         page:{...} // see paginator.pageDefault
             *     }
             * }
             */
            //TODD:
            // data validate

            // data stuct error
            if(!data.dataTable || !data.dataTable.rows || !data.paging || !data.paging.page){ //!(data.paging.size || data.paging.page || data.paging.number)
                this.applyInterface('error');
                return ;
            }

            // TODO:
            // no result





            // to table
            //this.applyInterface('DataTableAlipay.render',data.dataTable);

            // to paginator
            //this.applyInterface('PaginatorAlipay.render',data.paging);

            this.applyInterface('render', data);

        }

    }).inherits(cellula.Cell);
})(Cellula);

