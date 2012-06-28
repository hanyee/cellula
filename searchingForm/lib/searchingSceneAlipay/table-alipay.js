/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
var DataTableAlipay = new Class('DataTableAlipay', {
    hideClass : 'fn-hide',
    tips : {
        noResult : 'ui-notice-warn',
        error : 'ui-notice-error'
    },
    init : function(cfg){
        this.initCfg(cfg);
        this.rootNode = this.getNode('ui-table');
        this.initTip();
        this.registerEvents();
    }
}).inherits(DataTable);