/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-7-1
 * Time: 上午1:02
 * To change this template use File | Settings | File Templates.
 */
(function(util, Class){
    this.ToDoListAlipay = new Class('ToDoListAlipay', {

        init : function(cfg){
            this.initCfg(cfg);
            this.rootNode = this.getRoot();

        }

    }).inherits(ToDoList);
})(Cellula._util, Cellula.Class);

(function(util, Class){
    this.ToDoItemAlipay = new Class('ToDoItemAlipay', {

        init : function(cfg){
            this.initCfg(cfg);
            //this.rootNode = this.getNode(this.root);

            this.render();


            this.registerEvents();
        },
        registerEvents : function(){

        },
        render : function(){
            var data = {
                id : this.__cid__,
                mobileNumber : 'mobileNumber_' + '0',
                accountBalance : 'accountBalance_' + '0',
                charges : 'charges' + '0'
            };
            var div = document.createElement('div');
            div.innerHTML = util.parseTpl(this.itemTpl, data);
            console.log(div);
            console.log(this.itemTpl);
            this.rootNode = this.getNode(this.root,'',div,'li');
            //return div;
        }

    }).inherits(ToDoItem);
})(Cellula._util, Cellula.Class);
