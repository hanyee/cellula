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
        init : function(){
            util.each(util.toArray(arguments), function(v,i,o){
                console.log(this);
                console.log(i);
                console.log(v);
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
        pop : function(){

        },
        get : function(key){ // returns all elements by default, key is optional,

        },
        save : function(){// saves all elements by default, key1, key2, key3 is optional,

        }
    });
})(Cellula);
