/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-7-4
 * Time: 下午3:43
 * To change this template use File | Settings | File Templates.
 */

var QueryElementAlipay = new Class('QueryElementAlipay', {
    value : '{}',
    errHandler : function(msg){
        alert(msg);
    },
    setData : function(){
        return this.set(new Function("return {value : " + this.value + "}").call(this));
    }
}).inherits(Cellula.Element);
