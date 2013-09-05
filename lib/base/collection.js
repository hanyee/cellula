/**
 * @fileOverview Cellula Framework's collection definition.
 * @description: it could be a collection of either elements or cells
 * @namespace: Cellula
 * @author: @hanyee
 */

(function(cellula){
    var util = cellula._util;
    cellula.Collection = new cellula.Class('Collection', {
        type : cellula.Element, //undefined,
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
                t.registerInterface('remove', this);
                //if(t._isValidated){
                    this._elements[t.key] = t;
                    this._index.push(t.key);
                //}else{
                //    delete t;
                //}
            }
        },
        init : function(cfg, els){
            //if(!util.isInstanceOfClass(this.type)) throw new TypeError('"type" is invalid!');

            this._initCfg(cfg);

            if (util.isArray(els)) {
                util.each(els, function (obj) {
                    this._elConfig(obj);
                }, this);
            } else this._elConfig(els);

        },
        // getHash : toJSON ???
        reverse : function(){
            this._index.reverse();
            return this;
        },
        size:function(){
            return this._index.length;
        },
        add:function (el, toIndex) {
            toIndex = parseInt(toIndex);
            if(isNaN(toIndex)) return this.push(el);

            if (el instanceof this.type) {
                this._elements[el.key] = el;

                if(toIndex <= 0) return this._index.unshift(el.key);
                if(toIndex >= this._index.length) return this._index.push(el.key);

                var t = this._index.concat([]),
                    s = t.splice(toIndex);
                t.push(el.key);
                this._index = t.concat(s);
            }
            return this._index.length;
        },
        remove : function(el){// key,el,  cid(deprecated, cause key is always asigned)
            if(el){
                // key
                if(util.isString(el)) {
                    delete this._elements[el];
                    util.each(this._index, function(v, i){
                        if(v == el) this._index.splice(i,1);
                    }, this);
                }

                // el
                if (el instanceof this.type) {
                    delete this._elements[el.key];
                    util.each(this._index, function (v, i) {
                        if (v == el.key) this._index.splice(i,1);
                    }, this);
                }
            }
            return this;
        },
        shift : function(){},
        push : function(el){
            if (el instanceof this.type) {
                this._elements[el.key] = el;
                return this._index.push(el.key);
            }
        },
        pop : function () {
            var key = this._index.pop(),
                el = this._elements[key];
            delete this._elements[key];
            return el;
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
                    if(util.isString(v)) t.push(this._elements[v]);
                }, this);
                return t;
            }
        },
        save : function(key){
            var els = this._elements, ret, i, l, n;
            if(this.type.prototype.__getAncestor__() === 'Cell') {
                // if cell apply cell.collecton.save
                if(util.isString(key)) return els[key] && els[key].collection ? els[key].collection.save() : false;

                if(util.isArray(key)){
                    for(i=0, l=key.length; i<l;i++){
                        ret = els[key[i]] && els[key[i]].collection ? els[key[i]].collection.save() : false;
                        if(!ret) return ret;
                    }
                }

                // key === undefined?
                if(!key) {
                    for(n in els){
                        ret = els[n] && els[n].collection ? els[n].collection.save() : false;
                        if(!ret) return ret;
                    }
                }

                return true;
            }

            if(this.type.prototype.__getAncestor__() === 'Element') {
                // if element
                // saves all elements by default, or [key1, key2, key3...] is optional,
                // apply element's save method,if no error returns true

                if(util.isString(key)) return els[key] ? (els[key].save()): false;
                if(util.isArray(key)){
                    for(i=0, l=key.length; i<l;i++){
                        ret = els[key[i]]? els[key[i]].save() : false;
                        if(!ret) return ret;
                    }
                }

                // key === undefined?
                if(!key) {
                    for(n in els){
                        ret = els[n]?els[n].save() : false;
                        if(!ret) return ret;
                    }
                }

                return true;
            }

            return false;
        }
    });
})(Cellula);