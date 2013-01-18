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
        return obj && reg.test(obj.__cid__);
    }
    function removeMultiple(){}

    function Events (){
        var list = {},// name:[]
            followers = {};
        this._check = _check;
        this._getMapping = function(){
            return util.copy(list);
        };
        this.__cid__ = idFlag+ ++idCounter;




        this.follow = function(whom, events){ // just ensure that target's any activity would make the follower known
            if(!_check(whom)) return 'Not Support!'; // log.warn

            // all - follow all events
            if(!events) return whom.register(this); // {multiple:false}

            // string - follow the specific event
            // array - follow an array of specific events
            whom.register(events, this);

            //whom.getFollowers().push();

        };

        this.unfollow = function(whom, events){
            if(!_check(whom)) return 'Not Support!'; // log.warn

            // all - follow all events
            // TODO: delete all events mappings with this follower ???
            if(!events) return whom.cancel(this);

            // string - follow the specific event
            // array - follow an array of specific events
            whom.cancel(events, this);
        };

        this.receiver = function(){}; // unique response interface

        this.register = function(events, context, opt){
            // all - register all events
            // TODO: with follow
            if(_check(events)) return followers[events.__cid__] = events;

            if(!_check(context)) return 'Not Support!'; // log.warn

            // string
            if(util.isString(events))  events = [events];

            // array
            if(util.isArray(events)){
                util.each(events, function(v){
                    list[v] = list[v] || [];
                    list[v].push(context);

                    // opt - multiple:false
                    if(opt && opt['multiple'] == false ){
                        var l = list[v].length, temp = list[v].slice(0,l-1);
                        util.each(temp, function(val){
                            if(val === context){
                                list[v].pop();
                                return util.breaker;
                            }
                        }, null, util.breaker);
                    }
                });
            }
        };

        this.cancel = function(events, context){
            // all - cancel all events of a specific context (follower)
            // TODO: with unfollow
            if(_check(events)) return delete followers[events.__cid__];

            // all clear mapping list
            if(!events) return list = {};

            // events without context
            if(!context){
                // events without context - string
                if(util.isString(events)) events = [events];

                // events without context - array
                if(util.isArray(events)) return util.each(events, function(v){ delete list[v]; });  // a while loop could be better
            }

            // events with context
            // string
            if(util.isString(events)) events = [events];

            // array
            if(util.isArray(events)){
                var l, i, ret, temp;
                util.each(events, function(v){
                    temp = list[v]; ret = [];
                    for(i=0, l=temp.length; i<l; i++){ // a loop is much faster
                        if(temp[i] !== context) ret.push(temp[i]);
                    }
                    list[v] = ret;
                });
            }
        };

        this.emit = function(events){
            var follower, other, calls, event, package, args = util.slice.call(arguments, 1, arguments.length); // slice could be optimized
            // all
            if(!events) events = util.keys(list);

            // string
            if(util.isString(events)) events = [events];

            // array
            if(util.isArray(events)){
                while((event = events.shift()) && (calls = list[event])){
                    package = {'target':this,'name':event};
                    other = util.copy(followers);
                    while(follower = calls.shift()){
                        follower.receiver.apply(follower, [package].concat(args));
                        delete other[follower.__cid__];
                    }
                    util.each(other, function(v){ v.receiver.apply(v, [package].concat(args)); });
                }
            }
        };

        this.getFollowers = function(){
            return followers;
        };
    }

    cellula.Events = Events;

})(Cellula);