/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-4-19
 * Time: 下午7:55
 * To change this template use File | Settings | File Templates.
 */

var E = new Class('E',{
    interfaceReg : function(interfaceName, context){
        var _ifl = this._interfaceList || (this._interfaceList = {});
        if(context[interfaceName]){
            //_ifl[interfaceName] = {interfaceFunc:context[interfaceName], context:context};

            // TODD:
            // if the same key registered, make it a linked list
            _ifl[interfaceName] = {interface : {interfaceFunc:context[interfaceName], context:context}, next : {}};
        }else{
            throw 'the registered method does not exist!';
        }
    },
    applyInterface : function(interfaceName, applyBack, context){
        var _ifl = this._interfaceList, _itf, _ret;
        if(_ifl[interfaceName]){
            _itf = _ifl[interfaceName].interface;
            _ret = _itf.interfaceFunc.apply(_itf.context || this, Array.prototype.slice.call(arguments,2));
            if(applyBack){
                applyBack.call(this, _ret);
            }

        }else{}
        //var ret = _ifl[interfaceName].interface.interfaceFunc.apply(_ifl[interfaceName].interface.context || this, Array.prototype.slice.call(arguments,2) );

    }
});
