/**
 * @fileOverview Cellula Framework's event definition.
 * @description: defines the Event Object
 * @namespace: Cellula
 * @author: @hanyee
 */

(function (cellula) {
    var util = cellula._util,
        idCounter = 0,
        idFlagHead = 'cellula_',
        idFlagTail = '_instance_',
        reg = new RegExp('^'+idFlagHead+'.*'+idFlagTail+'\\d+$');

    function _check(obj){
        return obj && reg.test(obj.__cid__);
    }
    function removeMultiple(){}

    function Events (){
        this.__cid__ = idFlagHead+ 'Events' + idFlagTail+ ++idCounter;
        var list = {},// name:[]
            followers = {};
        this._check = _check;
        this._getMapping = function(){
            return util.copy(list);
        };
        this.getFollowers = function(){
            return followers;
        };

        this.follow = function(whom, events, opt) { // just ensure that target's any activity would make the follower known
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

        this.register = function(events, context, opt){ // opt - multiple:false
            // all - register all events
            // TODO: with follow
            if(_check(events)) return followers[events.__cid__] = events;

            if(!_check(context)) return 'Not Support!'; // log.warn

            // string
            if(util.isString(events)) events = [events];

            // array
            if(util.isArray(events)){
                util.each(events, function(v){
                    var arr = list[v] = list[v] || [];
                    arr.push(context);

                    // opt - multiple:false
                    if(opt && opt['multiple'] == false ){
                        var l = arr.length, i;
                        for(i=0; i<l-1; i++){
                            if(arr[i] === context ){
                                arr.pop();
                                break;
                            }
                        }
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
                while((event = events.shift())){
                    package = {'target':this,'name':event};
                    other = util.copy(followers);
                    if (calls = list[event]) {
                        while(follower = calls.shift()){
                            follower.receiver.apply(follower, [package].concat(args));
                            delete other[follower.__cid__];
                        }
                    }

                    util.each(other, function(v){ v.receiver.apply(v, [package].concat(args)); });
                }
            }
        };

        this.receiver = function(){}; // unique response interface


        this._apis = {};// {apiname:'funcname' || function}
        var _ifl = {};
        var uniqueMapping = {};//{name:[]...} for detect multiple cases
        this._getApiList = function(){
            return util.copy(_ifl);
        };

        function makeNode(func, context){
            return {func:func, context:context, next:null};
        }
        function makeLinkedList(head){
            return {head:head, tail:head, push:function(node){
                if(!this.head) (this.head = node) && (this.tail = node);
                else (this.tail.next = node) && (this.tail = node);
                return this;
            }
        }}

        this.registerApi = function (name, context, alias) { // @type name could be `string` or `array`, alias should be `string`
            // if(!this._apis) return util.warn('invalid instance!');
            if(!context) return util.warn('invalid parameter!');
            if(alias && !util.isString(alias)) return util.warn('invalid parameter!');

            if(!util.isArray(name)) name = [name];

            util.each(name, function (v) {
                if (util.isString(v)) {
                    var all = alias ? [v, alias] : [v], func = context._apis[v];
                    if (util.isString(context._apis[v])) func = context[v];

                    if (util.isFunction(func)) {
                        util.each(all, function (val) {
                            var node = makeNode(func, context);
                            if (!_ifl[val]) _ifl[val] = makeLinkedList(node);
                            else _ifl[val].push(node);
                        });
                    } else util.warn('the ' + v + ' method does not exist in context\'s api list!');

                } else return util.warn('invalid parameter!');
            }, this);
        };

        this.applyApi = function (name) { // @type `string`, `apiName`, `apiName:KeyWords`
            if(!name || !util.isString(name)) return util.warn('invalid parameter!');

            var itr, ret = [], sp = ':', names = name.split(sp), val = names[0], key = names[1], head = _ifl[val],
                args = util.slice.call(arguments, 1);

            if(head){
                itr = head.head;
                while(itr){
                    if(!key) {
                        ret.push(itr.func.apply(itr.context, args)) && (itr = itr.next);
                        continue;
                    }
                    if (itr.context.__cid__.indexOf(key) > -1) ret.push(itr.func.apply(itr.context, args));

                    itr = itr.next;
                }
            }
            return ret;
        };

        this.removeApi = function (name, context) { // `name` or `alias` string @type
            if(!name) return util.warn('invalid parameter!');
            if(util.isString(name)) name = [name];
            if(!util.isArray(name)) return util.warn('invalid parameter!');

            // pass `all` to clear the list
            if(name[0] === 'all') return _ifl = {};

            if(!context) util.each(name, function(v){ delete _ifl[v]; });
            else{
                util.each(name, function(v){
                    if(_ifl[v]){
                        var itr, pre;
                        itr = pre = _ifl[v].head;
                        while(itr){
                            if(itr.context == context){
                                if(itr == pre) {
                                    _ifl[v].head = itr.next;
                                } else pre.next = itr.next;
                            } else pre = itr;

                            itr = itr.next;
                        }
                    }
                });
            }
        };
    }

    cellula.Events = Events;

})(Cellula);