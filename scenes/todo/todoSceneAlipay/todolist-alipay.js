/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-7-1
 * Time: 上午1:02
 * To change this template use File | Settings | File Templates.
 */
(function(util, Class){
    this.ToDoListAlipay = new Class('ToDoListAlipay', {
        addItemNode : null,
        collection : {},
        add : function(){
            var todoList = this,
                item = new ToDoItemAlipay({
                root : 'number',
                itemTpl : todoSceneAssets.todoItemTpl,
                registerEvents : function(data){
                    $(this.rootNode).bind('mouseover',function(e){
                        $(this).addClass('number-hover');
                    });
                    $(this.rootNode).bind('mouseout',function(e){
                        $(this).removeClass('number-hover');
                    });

                    $(this.getNode('mi-input-del',this.rootNode)).bind('click', this.delete);

                    this.get('mobileLabel').node.bind('click',this.edit);
                    this.get('mobileNumber').node.bind('blur',this.close);

                    this.registerInterface('remove', todoList);
                }
            });

            this.addToCollection(item);

        },
        addToCollection : function(item){
            //it.save();
            //this.getNode('J_item_container').appendChild(it.rootNode);

            if(!this.collection[item.__cid__]){

                this.collection.length = this.collection.length || 0;
                if(this.collection.length > 4) return this.error('做多只能添加 5 个号码！');

                this.rootNode.appendChild(item.rootNode);
                this.collection[item.__cid__] = item;
                this.collection.length += 1;
            }
        },
        error :function(msg){
            alert(msg);
        },
        remove : function(item){
            if(item) return this.rootNode.removeChild(item);
            throw new Error('invalid item node!');
        },
        registerEvents :function(){
            this.addItemNode.bind('click', this.add);
        },
        init : function(cfg){
            this.initCfg(cfg);
            this.rootNode = this.getRoot();
            this.bindAll('add','remove');

            this.registerEvents();
        }

    }).inherits(ToDoList);
})(Cellula._util, Cellula.Class);




(function(util, Class, Element){
    this.ElementAlipay = new Class('ElementAlipay', {
        isValidated : true,
        silent : true,
        node : null,
        elementData : {},
        setData : function (data) {
            data = data || this.elementData;
            var t = {}, node = document.getElementById(data[this.key]);

            t[this.key] = node ? (node.value ? node.value : node.innerHTML) : '';
            return this.set({value : t});
        }
    }).inherits(Element);
})(Cellula._util, Cellula.Class, Cellula.Element);





(function(util, Class){
    this.ToDoItemAlipay = new Class('ToDoItemAlipay', {
        hideClass : 'fn-hide',
        init : function(cfg){
            this.initCfg(cfg);
            //this.rootNode = this.getNode(this.root);
            this.bindAll('delete','edit','close');
            var data = this.getElementCfg();

            this.render(data);

            this.registerEvents(data);
        },

        edit : function(){
            console.log('editing');
            var mobileLabel = this.get('mobileLabel'),
                mobileNumber = this.get('mobileNumber');
            mobileLabel.node.addClass(this.hideClass);
            mobileNumber.node.removeClass(this.hideClass).focus();
            //mobileNumber.focus();
        },
        close : function(){
            var mobileLabel = this.get('mobileLabel'),
                mobileNumber = this.get('mobileNumber'),
                t = {};
            t[mobileNumber.key] = mobileNumber.node.val();
            if(mobileNumber.set({value : t})){
                mobileLabel.node.html(t[mobileNumber.key]);

                mobileNumber.node.addClass(this.hideClass);
                mobileLabel.node.removeClass(this.hideClass);
                console.log('closed');
            }

        },
        delete : function(){
            this.applyInterface('remove',this.rootNode);
            this.removeInterface('remove');
            console.log('delete');
        },
        getElementCfg : function(){
            var nodeId = this.__cid__.substring(this.__cid__.lastIndexOf('_')+1,this.__cid__.length);
            return {
                id : nodeId,
                mobileNumber : 'mobileNumber_' + nodeId,
                mobileLabel : 'mobileLabel_' + nodeId,
                accountBalance : 'accountBalance_' + nodeId,
                charges : 'charges_' + nodeId
            };
        },
        makeElements : function(data){
            this.collection = ElementAlipay.factory([{
                key : 'mobileNumber',
                node : $(this.rootNode).find('#'+data.mobileNumber),
                validate :function(data){
                    //this.reset();
                    if(data.value.mobileNumber !== '' && ! /^1[3,4,5,8]\d{9}$/g.test(data.value.mobileNumber)){

                        return 'moblile number error!';
                    }
                },
                reset : function(){
                    var t = this.node.parent().next(),
                        p = this.node.parent().parent();
                    p.removeClass('mi-form-item-error');
                    t.html('');
                },
                errHandler : function(msg){
                    var t = this.node.parent().next(),
                        p = this.node.parent().parent();
                    p.addClass('mi-form-item-error');
                    t.html(msg);

                },
                elementData : data
            },{
                key : 'mobileLabel',
                node : $(this.rootNode).find('#'+data.mobileLabel),
                elementData : data
            },{
                key : 'accountBalance',
                elementData : data
            },{
                key : 'charges',
                elementData : data
            }]);

            //console.log(this.get('accountBalance'));
            //console.log(this.get('charges'));
            //console.log(this.get('mobileNumber'));
            //console.log(this.get('mobileLabel'));
        },
        render : function(data){
            var div = document.createElement('div');

            div.innerHTML = util.parseTpl(this.itemTpl, data);

            this.rootNode = this.getNode(this.root, div, 'li');

            this.makeElements(data);

            return this.rootNode;

        }

    }).inherits(ToDoItem);
})(Cellula._util, Cellula.Class);
