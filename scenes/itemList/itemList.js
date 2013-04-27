(function(c){
    var util = c._util, Class = c.Class, Cll = c.Collection;

    var Item = new Class('Item', {
        conf:{},
        editNode:undefined,
        delNode:undefined,
        init:function(conf, data){
            this._super(conf);
            this.rootNode = this.rootNode || this.create(data);
            this.editNode = util.getElementsByClassName(this.conf.edit, this.rootNode)[0];
            this.delNode = util.getElementsByClassName(this.conf.del, this.rootNode)[0];

            if(!this.key) this.key = this.__cid__;
            this._bindAll('edit','remove');
            this.registerEvents();
        },
        registerEvents:function(){
            this.editNode && (this.editNode.onclick = this.edit);
            this.delNode && (this.delNode.onclick = this.remove);
        },
        create:function(data){
            // should return the item dom node
            // this.rootNode = makeSth();
            // return this.rootNode
        },
        edit:function(e){
            //e = e || window.event;
            //util.log('edit '+this.__cid__);
            //this.emit('Item:EDIT');
        },
        remove:function(e){}
    }).inherits(c.Cell);

    var ItemList = new Class('ItemList' ,{
        listNode:undefined,
        itemType:undefined,
        addNode:undefined,
        conf:{
            item:'item',
            add:'item-add',
            edit:'item-edit',
            del:'item-del',
            attribute:'data-itemlist',
            listNode:'listNode'
        },
        collection:undefined,
        init:function(conf){
            var _conf = {};
            // string
            if(util.isString(conf)) _conf.key = conf;
            // obj
            if(util.isObject(conf)) _conf = conf;  //util.mix(_conf, conf);

            if(util.isEmpty(_conf)) return;

            this._super(_conf);

            this._parseDomConf(this.rootNode);

            this.listNode = document.getElementById(this.conf.listNode);

            this.collection = new Cll({type:this.itemType});

            this._createItems(this.conf);

            this.addNode = document.getElementById(this.conf.add) || util.getElementsByClassName(this.conf.add, this.rootNode)[0];

            this._bindAll('add');

            this.registerEvents();
        },
        registerEvents:function(){
            this.addNode && (this.addNode.onclick = this.add);
        },
        _parseDomConf:function(node){   // [item], [edit], [del], [add]
            if(!node || node.nodeType !== 1 ) return;
            var domConf = util.trim(node.getAttribute(this.conf.attribute));

            if(domConf && (domConf = domConf.split(' ')) ){

                var confItem;
                while(confItem = domConf.shift()){
                    if(/:/.test(confItem)) {
                        confItem = confItem.split(':');
                        if(this.conf[confItem[0]]) this.conf[confItem[0]] = confItem[1];
                    }
                }
            }
        },
        _createItems:function(conf){
            if(!util.isObject(conf)) return;
            var itemNodes = util.getElementsByClassName(conf.item, this.rootNode), itemNode;

            util.each(util.toArrayByLen(itemNodes), function(v){
                itemNode = new this.itemType({rootNode:v, conf:this.conf});
                this.addItem(itemNode);
            }, this);
        },
        add:function(data){
            var node = this.addItem(data).rootNode;
            node && node.nodeType === 1 && this.listNode.appendChild(node);
        },
        addItem:function(item){
            if(!item) item = new this.itemType({conf:this.conf});

            // param item is item's data
            if(!item.__cid__) item = new this.itemType({conf:this.conf}, item);

            if((!this.listNode) && item.rootNode.nodeType === 1) this.listNode = item.rootNode.parentNode;
            this.follow(item);
            this.collection.push(item);
            return item;
        },
        render:function(data){},
        removeItem:function(item){
            this.collection.remove(item);
            this.listNode.removeChild(item.rootNode);
        },
        receiver:function(e){
            if(!e) return;
            var targ = e.target, evt = e.name.split(':')[1];
            switch (evt){
                case 'REMOVE':
                    this.removeItem(targ);
                    break;
            }
            util.log(e);
        },
        delItem:function(){}
    }).inherits(c.Cell);



    c.ItemList = ItemList;
    c.Item = Item;
})(Cellula);