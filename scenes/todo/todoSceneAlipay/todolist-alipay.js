/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-7-1
 * Time: 上午1:02
 * To change this template use File | Settings | File Templates.
 */
(function(util, Class){
    this.ToDoListAlipay = new Class('ToDoListAlipay', {
        init : function(){
            this.initCfg(cfg);
            this.rootNode = this.getNode('ui-paging');

        }

    }).inherits(ToDoList);
})(Cellula._util, Cellula.Class);
