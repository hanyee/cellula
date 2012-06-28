/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */
var PaginatorAlipay = new Class('PaginatorAlipay', {
    hideClass : 'fn-hide',
    init : function(cfg){
        this.initCfg(cfg);
        this.rootNode = this.getNode('ui-paging');
        this.bindAll('changeSize', 'paginate');

        //this.render();
    }
}).inherits(Paginator);