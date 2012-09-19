/**
 * @fileOverview SearchingScene's form module definition based on Cellula.
 * @description: defines form module
 * @namespace: Cellula
 * @version: 0.3.1
 * @author: @hanyee
 */

(function(cellula){
    var util = cellula._util;
    this.SearchingForm = new cellula.Class('SearchingForm', {
        validateAll : false,
        init : function(cfg){
            this._super(cfg);
            this._bindAll('search','doSearch','dataDispatch');
            this.render();
            //this.disable(true);
            //this.registerEvents();
        },
        disable : function(){},
        getData : function(){// returns all elements' data
            var t = {};
            util.each(this.collection.get(), function(v){
                t = util.mix(t, v.get());
            });

            return t;
        },
        doSearch : function(e){
            // TODO:
            // to deal with different framework's events handler
            var pageDefault, cll, size, sv, sizeData, postData, isEvent = false;
            if(e && e.preventDefault){
                e.preventDefault();
                isEvent = true;
            }

            if ((isEvent || (!isEvent && !e) ) && this.collection.save()) { // trigger by event // direct operation
                pageDefault = this.applyInterface('getDefault');
                cll = this.applyInterface('getCollection');
                cll.save('size');
                size = cll.get('size');
                sizeData = size.get();
                sv = util.values(sizeData)[0];

                postData = util.mix(this.getData(), util.isEmpty(sv) ? pageDefault.size : sizeData, pageDefault.number || {});
            } else {
                if (!isEvent && e) { // triggered by paginator
                    console.log(e);
                    postData = util.mix({}, this.getData(), e);
                }
            }
            console.log(postData);
            if (postData) this.search(postData);


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
            console.log('done');

        }

    }).inherits(cellula.Cell);
})(Cellula);

