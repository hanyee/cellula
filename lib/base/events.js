/**
 * @fileOverview Cellula Framework's event definition.
 * @description: defines the Event Object
 * @namespace: Cellula
 * @author: @hanyee
 */


(function (cellula) {
    var util = cellula._util,
        idCounter = 0,
        idFlag = 'cellula_Event_instance_',
        reg = new RegExp('^'+idFlag+'\\d+$');

    function _check(obj){
        return reg.test(obj.__id__);
    }
    function removeMultiple(){}

    function Events (){
        var list = {},// name:[]
            followers;
        this._check = _check;
        this.__id__ = idFlag+ ++idCounter;

        this.follow = function(who, name){
            if(!_check(who)) return 'Not Support!'; // log.warn
            who.getFollowers().push();

        };
        this.unfollow = function(){};
        this.receiver = function(){}; // unique response interface

        this.register = function(events, context, opt){
            // string
            if(util.isString(events)){
                list[events] = list[events] || [];
                list[events].push(context);

                // multiple:false
                if(opt && opt['multiple'] == false ){
                    var l = list[events].length, temp = list[events].slice(0,l-1);
                    util.each(temp,function(v){
                        if(v === context){
                            list[events].pop();
                            return util.breaker;
                        }
                    }, null, util.breaker);
                }
            }


            // array
            // TODO

        };
        this.cancel = function(){};
        this.emit = function(events){
            var follower, package = {};
            // all

            // string
            if(util.isString(events)){
                package['name'] = events;

                while(follower = list[events].shift()){
                    package['target'] = this;
                    follower.receiver(package);
                }
            }


            // array

        };
        this.getFollowers = function(){
            return list;
        };
    }

    cellula.Events = Events;

})(Cellula);