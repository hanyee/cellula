/**
 * Created with JetBrains WebStorm.
 * User: hanyee
 * Date: 12-8-5
 * Time: 下午8:41
 * To change this template use File | Settings | File Templates.
 */

(function(cellula){
    var util = cellula._util;
    cellula.Collection = new cellula.Class('Collection', {
        type : undefined,
        _index : [], // [{key:'key',cid:'cid'}...]
        _elements : {}, //{key:'key',el:element}
        _initCfg:function (cfg) {
            if (util.isObject(cfg)) {
                for (var n in this) {
                    if (cfg.hasOwnProperty(n)) {
                        this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                    }
                }
            }
        },
        _elConfig : function(obj){
            if(util.isObject(obj)){
                var t = new this.type(obj);
                if(t._isValidated){
                    this._elements[t.key] = t;
                    this._index.push(t.key);
                }else{
                    delete t;
                }
            }
        },
        init : function(){
            this._initCfg({_index : [], _elements : {}});
            //if(!util.isInstanceOfClass(this.type)) throw new TypeError('"type" is invalid!');

            util.each(util.slice.call(arguments), function(v){
                if(util.isArray(v)){
                    util.each(v, function(obj){
                        this._elConfig(obj);
                    }, this);
                }else if (util.isObject(v)){
                    this._elConfig(v);
                }
            }, this);

        },
        reverse : function(){
            return this._index.reverse();
        },
        add : function(el, toIndex){

        },
        remove : function(el){// key,el,cid

        },
        push : function(el){

        },
        pop : function(a){
            console.log(a);
            alert(a);
        },
        get : function(key){ // returns all elements by default, key is optional,
            // returns all elements by default
            // key === undefined ?
            if(!key) return util.values(util.mix({}, this._elements));

            // returns the specific element with the given key, if element is not exist returns undefiend
            if(util.isString(key)) return this._elements[key];

            // returns the specific elements with the given keys in an array
            if(util.isArray(key)){
                var t = [];
                util.each(key,function(v){
                    t.push(this._elements[v]);
                }, this);
                return t;
            }
        },
        save : function(key){ // just for element
            // if cell apply cell.collecton.save

            // if element
            // saves all elements by default, or [key1, key2, key3...] is optional,
            // apply element's doSet method,if no error returns true
            var els = this._elements, ret, i, l, n;
            if(util.isString(key)) return els[key] ? (els[key].doSet()): false;
            if(util.isArray(key)){
                for(i=0, l=key.length; i<l;i++){
                    ret = els[key[i]].doSet();
                    if(!ret) return ret;
                }
            }

            // key === undefined?
            if(!key) {
                for(n in els){
                    ret = els[n].doSet();
                    if(!ret) return ret;
                }
            }

            return true;
        }
    });
})(Cellula);
