/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */
var PaginatorAlipay = new Class('PaginatorAlipay', {
    hideClass : 'fn-hide',
    pageDefault:{
        number : {number:1},
        size : {size:10},
        sizeDefault : 5,
        sizeOptions : [10,20,30]
    },
    init : function(cfg){
        this._initCfg(cfg);
        this.rootNode = this.getNode('ui-paging');
        this._bindAll('changeSize', 'paginate');
console.log(this.rootNode);
        //this.render();
    }
}).inherits(Paginator);