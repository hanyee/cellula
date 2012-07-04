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




(function(util, Class, Element){
    this.ElementAlipay = new Class('ElementAlipay', {
        isValidated : true,
        silent : true,
        elementData : {},
        setData : function (data) {
            var t = {};
            data = data || this.elementData;

            t[this.key] = document.getElementById(data[this.key]) ? document.getElementById(data[this.key]).value : '';
            return this.set({value : t});
        }
    }).inherits(Element);
})(Cellula._util, Cellula.Class, Cellula.Element);





(function(util, Class){
    this.ToDoItemAlipay = new Class('ToDoItemAlipay', {
        init : function(cfg){
            this.initCfg(cfg);
            //this.rootNode = this.getNode(this.root);

            this.render();


            this.registerEvents();
        },
        registerEvents : function(data){
            $(this.rootNode).bind('mouseover',function(e){
                $(this).addClass('number-hover');
            });
            $(this.rootNode).bind('mouseout',function(e){
                $(this).removeClass('number-hover');
            });
        },
        render : function(){
            var nodeId = this.__cid__.substring(this.__cid__.lastIndexOf('_')+1,this.__cid__.length);
            var data = {
                id : nodeId,
                mobileNumber : 'mobileNumber_' + nodeId,
                accountBalance : 'accountBalance_' + nodeId,
                charges : 'charges' + nodeId
            };



            var div = document.createElement('div');
            div.innerHTML = util.parseTpl(this.itemTpl, data);

            this.rootNode = this.getNode(this.root, div, 'li');
            //return div;



            this.collection = ElementAlipay.factory([{
                key : 'mobileNumber',
                elementData : data
            },{
                key : 'accountBalance',
                elementData : data
            },{
                key : 'charges',
                elementData : data
            }]);

            console.log(this.get('accountBalance'));
            console.log(this.get('charges'));
            console.log(this.get('mobileNumber'));
        }

    }).inherits(ToDoItem);
})(Cellula._util, Cellula.Class);
