/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-25
 * Time: 下午10:06
 * To change this template use File | Settings | File Templates.
 */

(function (cellula) {
    var util = cellula._util,
        nativeBind = Function.prototype.bind,
        slice = Array.prototype.slice;

    cellula.Cell = new cellula.Class('Cell', {
        key : undefined,
        rootNode : undefined,
        collection : undefined,
        //hideClass : '',

        // Bind all of an object's methods to that object. Useful for ensuring that
        // all callbacks defined on an object belong to it.
        _bindAll:function () {
            for (var n = 0; n < arguments.length; n++) {
                this[arguments[n]] = util.bind(this[arguments[n]], this);
            }

            return this;
        },
        _initCfg : function(cfg){
            if (util.isObject(cfg)) {
                for (var n in this) {
                    if(cfg.hasOwnProperty(n)){
                        this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                    }
                }
            }
        },
        init:function (cfg) {
            this._initCfg(cfg);
            this.rootNode = this.getRoot();
        },


        save : function () { // save the specified element
            var c = this.collection, o = arguments[0];
            if (typeof o === 'string') return c[o] ? (c[o].setData.call(c[o])?undefined:false) : false;

            for (var n in this.collection) {
                var r = this.collection[n].setData.apply(this.collection[n], arguments);
                // TODO:
                // validateAll ?
                if (!r) return r;
            }
        },
        get : function(){
            if(arguments.length === 0){
                return this.collection;
            }
            return this.collection[arguments[0]];
        },
        getData : function(){
            var data = {}, l = arguments.length;
            if(l === 0){
                for(var n in this.collection){
                    //data[this.collection[n].key] = this.collection[n].getValue();
                    //data = util.mix(data, this.collection[n].data.value);
                    data = util.mix(data, this.collection[n].getProp('value'));
                }
            }else{
                for(var i=0; i<l; i++ ){
                    //data = util.mix(data, this.collection[arguments[i]].data.value);
                    data = util.mix(data, this.collection[arguments[i]].getProp('value'));
                }
            }
            return data;
        },
        getSavedData : function(){
            var l = arguments.length;
            if(l === 0){
                this.save();
                return this.getData();
            }else{
                for(var i=0; i<l; i++ ){
                    this.save(arguments[i]);
                }
                return this.getData.apply(this, arguments);
            }
        },


        getCollection : function(){
            return this.collection;
        },
        getNode : function(root, target, tag){// id || unique style
            root = root || '';
            target = target || document;
            tag = tag || 'div';
            var node = document.getElementById(root);
            if(node) return node;
            var nodesArray = util.getElementsByClassName(root, target, tag);
            if(nodesArray.length === 1) return nodesArray[0];

            //throw new Error('root id, unique style class undefined or more document nodes have unique style class!');
        },
        getRoot : function(){
            return this.rootNode ? this.rootNode : this.getNode(this.key);
        },
        show : function(flag){
            if(!this.rootNode) this.rootNode = this.getRoot();
            if(flag) return util.removeClass(this.rootNode, this.hideClass);
            util.addClass(this.rootNode, this.hideClass);
        },
        error : function(){},
        render : function(){
            this.registerEvents();
        },
        registerEvents:function(){}
    });

})(Cellula);
