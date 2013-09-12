/**
 * @fileOverview Cellula Framework's message definition.
 * @description: defines message
 * @namespace: Cellula
 * @author: @hanyee
 */

(function (cellula) {
    var util = cellula._util;
    var Message = new cellula.Class('Message', {
        broadcast:function(){},
        observe:function(){},
        stopObserve:function(){}
    }).extend(cellula.Events);

    cellula.Message = new Message;

})(Cellula);