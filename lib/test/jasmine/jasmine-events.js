describe("Cellula.Event", function () {

    var e1,e2,e3,e4,
        util = Cellula._util;
    var sc, sc2, sc3, sc4;
    var count = 0;
    beforeEach(function () {
        count++;
        e1 = new Cellula.Events();
        e2 = new Cellula.Events();
        e3 = new Cellula.Events();
        e4 = new Cellula.Events();

        spyOn(e1, 'receiver');
        spyOn(e2, 'receiver');
        spyOn(e3, 'receiver');
        spyOn(e4, 'receiver');


        SomeClass = new Cellula.Class('SomeClass'+count, {
            key:'keykey',           // string
            num:5,                  // number
            flag:true,              // boolean
            prop:{a:'a'},           // object
            arr:[2,3,4],            // array
            unProp:undefined,       // undefined
            _apis:{
                'func':'func',
                'func2':'func2',
                'custom':function(){
                    return this.__cid__;
                }
            },
            func:function(){        // function
                return 'func';
            },
            func2:function(){        // function
                return 'func2';
            },
            func3:function(){        // function
                return 'func3';
            }
        }, 'NEW').extend(Cellula.Events);

        sc = new SomeClass;
        sc2 = new SomeClass;
        sc3 = new SomeClass;
        sc4 = new SomeClass;

        spyOn(sc, 'func').andReturn('func');
        spyOn(sc2, 'func').andReturn('func');
        spyOn(sc3, 'func').andReturn('func');
        spyOn(sc4, 'func').andReturn('func');

        spyOn(sc, 'func2').andReturn('func2');
        spyOn(sc2, 'func2').andReturn('func2');
        spyOn(sc3, 'func2').andReturn('func2');
        spyOn(sc4, 'func2').andReturn('func2');

        spyOn(sc, 'func3');
        spyOn(sc2, 'func3');
        spyOn(sc3, 'func3');
        spyOn(sc4, 'func3');
    });

    describe('Events:__cid__', function () {
        it("__cid__", function () {
//            expect(e1.__cid__).toBe('cellula_Events_instance_1');
//            expect(e2.__cid__).toBe('cellula_Events_instance_2');
        });
    });

    describe('Events:_check', function () {
        it("_check", function () {
            expect(e1._check(e2)).toBe(true);
        });
    });

    describe('Events:register', function () {
        it("register `string` type parameter without {multiple:false}", function () {
            e1.register('CHANGED',e2);
            e1.register('CHANGED',e2);
            expect(e1._getMapping()['CHANGED'][0]).toBe(e2);
            expect(e1._getMapping()['CHANGED'][1]).toBe(e2);

            e2.register('CHANGED',e1);
            e2.register('CHANGED',e1);
            expect(e2._getMapping()['CHANGED'][0]).toBe(e1);
            expect(e2._getMapping()['CHANGED'][1]).toBe(e1);
        });

        it("register `string` type parameter with {multiple:false}", function () {
            e1.register('CHANGED',e2);
            e1.register('CHANGED',e2,{multiple:false});
            expect(e1._getMapping()['CHANGED'][0]).toBe(e2);
            expect(e1._getMapping()['CHANGED'][1]).toBe(undefined);

            e2.register('CHANGED',e1);
            e2.register('CHANGED',e1,{multiple:false});
            expect(e2._getMapping()['CHANGED'][0]).toBe(e1);
            expect(e2._getMapping()['CHANGED'][1]).toBe(undefined);
        });

        it("register `array` type parameter without {multiple:false}", function () {
            e1.register(['CHANGED','CLEARED'],e2);
            e1.register(['CHANGED','CLEARED'],e2);
            expect(e1._getMapping()['CHANGED'][0]).toBe(e2);
            expect(e1._getMapping()['CHANGED'][1]).toBe(e2);
            expect(e1._getMapping()['CLEARED'][0]).toBe(e2);
            expect(e1._getMapping()['CLEARED'][1]).toBe(e2);

            e2.register(['CHANGED','CLEARED'],e1);
            e2.register(['CHANGED','CLEARED'],e1);
            expect(e2._getMapping()['CHANGED'][0]).toBe(e1);
            expect(e2._getMapping()['CHANGED'][1]).toBe(e1);
            expect(e2._getMapping()['CLEARED'][0]).toBe(e1);
            expect(e2._getMapping()['CLEARED'][1]).toBe(e1);
        });

        it("register `array` type parameter with {multiple:false}", function () {
            e1.register(['CHANGED','CLEARED'],e2);
            e1.register(['CHANGED','CLEARED'],e2,{multiple:false});
            expect(e1._getMapping()['CHANGED'][0]).toBe(e2);
            expect(e1._getMapping()['CHANGED'][1]).toBe(undefined);
            expect(e1._getMapping()['CLEARED'][0]).toBe(e2);
            expect(e1._getMapping()['CLEARED'][1]).toBe(undefined);

            e2.register(['CHANGED','CLEARED'],e1);
            e2.register(['CHANGED','CLEARED'],e1,{multiple:false});
            expect(e2._getMapping()['CHANGED'][0]).toBe(e1);
            expect(e2._getMapping()['CHANGED'][1]).toBe(undefined);
            expect(e2._getMapping()['CLEARED'][0]).toBe(e1);
            expect(e2._getMapping()['CLEARED'][1]).toBe(undefined);
        });

        it("register `context` as a follower", function () {
            e1.register(e2);
            e1.register(e3);
            expect(e1.getFollowers()[e2.__cid__]).toBe(e2);
            expect(e1.getFollowers()[e3.__cid__]).toBe(e3);
        });

        it("register - wrong parameter", function () {

        });
    });

    describe('Events:emit', function () {
        it("emit : CHANGED event", function () {
            var evt = {name:'CHANGED',target:e1};
            e1.register('CHANGED',e2);
            e1.register('CHANGED',e3);
            e1.register('CHANGED',e4);
            expect(e1.emit('CHANGED')).toBe(undefined);

            expect(e2.receiver).toHaveBeenCalled();
            expect(e2.receiver).toHaveBeenCalledWith(evt);

            expect(e3.receiver).toHaveBeenCalled();
            expect(e3.receiver).toHaveBeenCalledWith(evt);

            expect(e4.receiver).toHaveBeenCalled();
            expect(e4.receiver).toHaveBeenCalledWith(evt);
        });

        it("emit : followers", function () {
            e1.register(e2);
            e1.register(e3);
            e1.register('CHANGED',e4);
            var evt = {name:'CHANGED',target:e1};

            e1.emit('CHANGED');

            expect(e2.receiver).toHaveBeenCalled();
            expect(e2.receiver).toHaveBeenCalledWith(evt);

            expect(e3.receiver).toHaveBeenCalled();
            expect(e3.receiver).toHaveBeenCalledWith(evt);
        });
    });

    describe('Events:cancel', function () {
        it("cancel a context as removing a follower", function () {
            e1.register(e2);
            e1.register(e3);

            e1.cancel(e2);
            expect(e1.getFollowers()[e2.__cid__]).toBe(undefined);
            e1.cancel(e3);
            expect(e1.getFollowers()[e3.__cid__]).toBe(undefined);
        });

        it("cancel an event with context", function () {
            e1.register('CHANGED', e2);
            e1.register('CHANGED', e3);

            e1.cancel('CHANGED', e2);
            expect(e1._getMapping()['CHANGED']).not.toContain(e2);
            e1.cancel('CHANGED', e3);
            expect(e1._getMapping()['CHANGED']).not.toContain(e3);

            e1.emit('CHANGED');
            expect(e2.receiver).not.toHaveBeenCalled();
            expect(e3.receiver).not.toHaveBeenCalled();
        });

        it("cancel an event without context", function () {
            e1.register('CHANGED', e2);
            e1.register('CHANGED', e3);

            e1.cancel('CHANGED');

            expect(e1._getMapping()['CHANGED']).toBe(undefined);

            e1.emit('CHANGED');
            expect(e2.receiver).not.toHaveBeenCalled();
            expect(e3.receiver).not.toHaveBeenCalled();
        });
    });

    describe("Events:follow - to watch an object's activities", function () {
        it("follow a target with events", function () {
            e2.follow(e1, 'CHANGED');
            e3.follow(e1, 'CLEARED');
            e4.follow(e1,['CHANGED','CLEARED']);
            var evt_CHANGE = {name:'CHANGED',target:e1};
            var evt_CLEAR = {name:'CLEARED',target:e1};

            e1.emit('CHANGED');

            expect(e2.receiver).toHaveBeenCalledWith(evt_CHANGE);
            expect(e4.receiver).toHaveBeenCalledWith(evt_CHANGE);
            expect(e3.receiver).not.toHaveBeenCalledWith(evt_CHANGE);

            e1.emit('CLEARED');

            expect(e3.receiver).toHaveBeenCalledWith(evt_CLEAR);
            expect(e4.receiver).toHaveBeenCalledWith(evt_CLEAR);
            expect(e2.receiver).not.toHaveBeenCalledWith(evt_CLEAR);
        });

        it("follow a target without events", function () {
            e2.follow(e1);
            e3.follow(e1);
            e4.follow(e1, ['CHANGED','CLEARED']);
            var evt_CHANGE = {name:'CHANGED',target:e1};
            var evt_CLEAR = {name:'CLEARED',target:e1};

            e1.emit('CHANGED');

            expect(e2.receiver).toHaveBeenCalledWith(evt_CHANGE);
            expect(e3.receiver).toHaveBeenCalledWith(evt_CHANGE);
            expect(e4.receiver).toHaveBeenCalledWith(evt_CHANGE);

            e1.emit('CLEARED');

            expect(e2.receiver).toHaveBeenCalledWith(evt_CLEAR);
            expect(e3.receiver).toHaveBeenCalledWith(evt_CLEAR);
            expect(e4.receiver).toHaveBeenCalledWith(evt_CLEAR);
        });
    });

    describe("Events:unfollow - to stop watching an object's activities", function () {
        it("unfollow a target with events", function () {
            e2.follow(e1, 'CHANGED');
            e3.follow(e1, 'CLEARED');
            e4.follow(e1, ['CHANGED','CLEARED','RESET','SAVED']);
            var evt_CHANGE = {name:'CHANGED',target:e1};
            var evt_CLEAR = {name:'CLEARED',target:e1};

            e2.unfollow(e1, 'CHANGED');
            e4.unfollow(e1, 'CHANGED');
            e1.emit('CHANGED');

            expect(e2.receiver).not.toHaveBeenCalledWith(evt_CHANGE);
            expect(e4.receiver).not.toHaveBeenCalledWith(evt_CHANGE);

            e3.unfollow(e1, 'CLEARED');
            e4.unfollow(e1, 'CLEARED');
            e1.emit('CLEARED');

            expect(e3.receiver).not.toHaveBeenCalledWith(evt_CLEAR);
            expect(e4.receiver).not.toHaveBeenCalledWith(evt_CLEAR);

            e4.unfollow(e1, ['RESET','SAVED']);
            e1.emit('RESET');
            expect(e4.receiver).not.toHaveBeenCalled();
            e1.emit('SAVED');
            expect(e4.receiver).not.toHaveBeenCalled();
        });

        it("unfollow a target without events", function () {
            e2.follow(e1);
            e3.follow(e1, 'CHANGED');
            e4.follow(e1, ['CHANGED','CLEARED']);
            var evt_CHANGE = {name:'CHANGED',target:e1};
            var evt_CLEAR = {name:'CLEARED',target:e1};

            e2.unfollow(e1);
            e3.unfollow(e1);
            e4.unfollow(e1);
            e1.emit('CHANGED');

            expect(e2.receiver).not.toHaveBeenCalledWith(evt_CHANGE);
            expect(e3.receiver).toHaveBeenCalledWith(evt_CHANGE);
            expect(e4.receiver).toHaveBeenCalledWith(evt_CHANGE);

            //?? expect(e3.receiver).not.toHaveBeenCalledWith(evt_CHANGE);
            //?? expect(e4.receiver).not.toHaveBeenCalledWith(evt_CHANGE);
        });
    });


    describe('Events:registerApi', function () {
        it("registerApi `string` type parameter without `alias`", function () {
            expect(sc._getApiList()['func']).toBeUndefined();
            sc.registerApi('func', sc2);
            expect(sc._getApiList()['func'].head.context).toBe(sc2);
            expect(sc._getApiList()['func'].head.func).toBe(sc2.func);

            expect(sc._getApiList()['custom']).toBeUndefined();
            sc.registerApi('custom', sc2);
            expect(sc._getApiList()['custom'].head.context).toBe(sc2);
            expect(sc._getApiList()['custom'].head.func).toBe(sc2._apis.custom);

            expect(sc._getApiList()['func3']).toBeUndefined();
            sc.registerApi('func3', sc2);
            expect(sc._getApiList()['func3']).toBeUndefined();



            expect(sc2._getApiList()['func']).toBeUndefined();
            sc2.registerApi('func', sc);
            expect(sc2._getApiList()['func'].head.context).toBe(sc);
            expect(sc2._getApiList()['func'].head.func).toBe(sc.func);

            expect(sc2._getApiList()['custom']).toBeUndefined();
            sc2.registerApi('custom', sc);
            expect(sc2._getApiList()['custom'].head.context).toBe(sc);
            expect(sc2._getApiList()['custom'].head.func).toBe(sc._apis.custom);
        });

        it("registerApi `string` type parameter with `alias`", function () {
            expect(sc3._getApiList()['func']).toBeUndefined();
            expect(sc3._getApiList()['call_func']).toBeUndefined();
            sc3.registerApi('func', sc4, 'call_func');
            expect(sc3._getApiList()['func'].head.context).toBe(sc4);
            expect(sc3._getApiList()['func'].head.func).toBe(sc4.func);
            expect(sc3._getApiList()['call_func'].head.context).toBe(sc4);
            expect(sc3._getApiList()['call_func'].head.func).toBe(sc4.func);

            sc3.registerApi('custom', sc4, 'func');
            expect(sc3._getApiList()['func'].head.next.context).toBe(sc4);
            expect(sc3._getApiList()['func'].head.next.func).toBe(sc4._apis.custom);
            expect(sc3._getApiList()['func'].tail.context).toBe(sc4);
            expect(sc3._getApiList()['func'].tail.func).toBe(sc4._apis.custom);


            expect(sc4._getApiList()['func']).toBeUndefined();
            expect(sc4._getApiList()['call_func']).toBeUndefined();
            sc4.registerApi('func', sc3, 'call_func');
            expect(sc4._getApiList()['func'].head.context).toBe(sc3);
            expect(sc4._getApiList()['func'].head.func).toBe(sc3.func);
            expect(sc4._getApiList()['call_func'].head.context).toBe(sc3);
            expect(sc4._getApiList()['call_func'].head.func).toBe(sc3.func);

            sc4.registerApi('custom', sc3, 'func');
            expect(sc4._getApiList()['func'].head.next.context).toBe(sc3);
            expect(sc4._getApiList()['func'].head.next.func).toBe(sc3._apis.custom);
            expect(sc4._getApiList()['func'].tail.context).toBe(sc3);
            expect(sc4._getApiList()['func'].tail.func).toBe(sc3._apis.custom);
        });

        it("registerApi `array` type parameter without `alias`", function () {
            expect(sc._getApiList()['func']).toBeUndefined();
            expect(sc._getApiList()['custom']).toBeUndefined();
            expect(sc._getApiList()['func3']).toBeUndefined();

            sc.registerApi(['func','func3','custom'], sc2);

            expect(sc._getApiList()['func'].head.context).toBe(sc2);
            expect(sc._getApiList()['func'].head.func).toBe(sc2.func);
            expect(sc._getApiList()['custom'].head.context).toBe(sc2);
            expect(sc._getApiList()['custom'].head.func).toBe(sc2._apis.custom);
            expect(sc._getApiList()['func3']).toBeUndefined();
        });

        it("registerApi `array` type parameter with `alias`", function () {
            expect(sc3._getApiList()['func']).toBeUndefined();
            expect(sc3._getApiList()['func3']).toBeUndefined();
            expect(sc3._getApiList()['custom']).toBeUndefined();
            expect(sc3._getApiList()['call_func']).toBeUndefined();

            sc3.registerApi(['func','func3','custom'], sc4, 'call_func');

            expect(sc3._getApiList()['func'].head.context).toBe(sc4);
            expect(sc3._getApiList()['func'].head.func).toBe(sc4.func);
            expect(sc3._getApiList()['custom'].head.context).toBe(sc4);
            expect(sc3._getApiList()['custom'].head.func).toBe(sc4._apis.custom);
            expect(sc3._getApiList()['func3']).toBeUndefined();

            expect(sc3._getApiList()['call_func'].head.context).toBe(sc4);
            expect(sc3._getApiList()['call_func'].head.func).toBe(sc4.func);
            expect(sc3._getApiList()['call_func'].head.next.context).toBe(sc4);
            expect(sc3._getApiList()['call_func'].head.next.func).toBe(sc4._apis.custom);

            expect(sc3._getApiList()['call_func'].head.next.next).toBeNull();
        });

        it("registerApi - wrong parameter", function () {

        });
    });

    describe('Events:applyApi', function () {
        it("applyApi - apiName", function () {
            var ret;
            sc.registerApi(['func','func2','func3','custom'], sc2, 'sc2Func');

            ret = sc.applyApi('func');
            expect(sc2.func).toHaveBeenCalled();
            expect(ret[0]).toEqual('func');

            ret = sc.applyApi('sc2Func');
            expect(sc2.func).toHaveBeenCalled();
            expect(ret[0]).toEqual('func');

            ret = sc.applyApi('func2');
            expect(ret[0]).toEqual('func2');

            ret = sc.applyApi('func3');
            expect(sc2.func3).not.toHaveBeenCalled();

            ret = sc.applyApi('custom');
            expect(ret[0]).toEqual(sc2.__cid__);

            sc.registerApi('custom',sc2,'func');
            ret = sc.applyApi('func');
            expect(ret).toEqual(['func',sc2.__cid__]);
        });

        it("applyApi - apiName:KeyWords", function () {
            var ret;
            sc.registerApi(['func','func2','func3','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','func3','custom'], sc3, 'sc3Func');

            ret = sc.applyApi('func:instance_2');
            expect(sc2.func).toHaveBeenCalled();
            expect(sc3.func).not.toHaveBeenCalled();
            expect(ret).toEqual(['func']);

            ret = sc.applyApi('func');
            expect(sc2.func).toHaveBeenCalled();
            expect(sc3.func).toHaveBeenCalled();
            expect(ret).toEqual(['func','func']);
        });

        it("applyApi - wrong parameter", function () {
        });
    });

    describe('Events:removeApi', function () {
        it("applyApi - removeApi - `string`", function () {
            var ret;
            sc.registerApi(['func','func2','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','custom'], sc3, 'sc3Func');
            sc.registerApi(['func','func2','custom'], sc4, 'sc4Func');

            sc.removeApi('func',sc2);
            sc.removeApi('func',sc4);
            ret = sc.applyApi('func');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(sc3.func).toHaveBeenCalled();
            expect(sc4.func).not.toHaveBeenCalled();
            expect(ret).toEqual(['func']);
        });

        it("applyApi - removeApi - `array`", function () {
            var ret;
            sc.registerApi(['func','func2','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','custom'], sc3, 'sc3Func');
            sc.registerApi(['func','func2','custom'], sc4, 'sc4Func');

            sc.removeApi(['func','func2'], sc2);
            sc.removeApi(['func','func2'], sc4);
            ret = sc.applyApi('func');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(sc3.func).toHaveBeenCalled();
            expect(sc4.func).not.toHaveBeenCalled();
            expect(ret).toEqual(['func']);

            ret = sc.applyApi('func2');
            expect(sc4.func2).not.toHaveBeenCalled();
            expect(sc3.func2).toHaveBeenCalled();
            expect(sc2.func2).not.toHaveBeenCalled();
            expect(ret).toEqual(['func2']);
        });

        it("applyApi - removeApi - `without context`", function () {
            var ret;
            sc.registerApi(['func','func2','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','custom'], sc3, 'sc3Func');
            sc.registerApi(['func','func2','custom'], sc4, 'sc4Func');

            sc.removeApi('func');
            sc.removeApi(['custom','func2']);
            ret = sc.applyApi('func');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(sc3.func).not.toHaveBeenCalled();
            expect(sc4.func).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('func2');
            expect(sc2.func2).not.toHaveBeenCalled();
            expect(sc3.func2).not.toHaveBeenCalled();
            expect(sc4.func2).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('custom');
            expect(ret).toEqual([]);

            ret = sc.applyApi('sc2Func');
            expect(sc2.func).toHaveBeenCalled();
            expect(sc2.func2).toHaveBeenCalled();
            expect(ret).toEqual(['func','func2',sc2.__cid__]);
        });

        it("applyApi - removeApi - `all`", function () {
            var ret;
            sc.registerApi(['func','func2','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','custom'], sc3, 'sc3Func');
            sc.registerApi(['func','func2','custom'], sc4, 'sc4Func');

            sc.removeApi('all');
            ret = sc.applyApi('func');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(sc3.func).not.toHaveBeenCalled();
            expect(sc4.func).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('func2');
            expect(sc4.func2).not.toHaveBeenCalled();
            expect(sc3.func2).not.toHaveBeenCalled();
            expect(sc2.func2).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('custom');
            expect(ret).toEqual([]);

            ret = sc.applyApi('sc2Func');
            expect(ret).toEqual([]);
            ret = sc.applyApi('sc3Func');
            expect(ret).toEqual([]);
            ret = sc.applyApi('sc4Func');
            expect(ret).toEqual([]);

            expect(sc._getApiList()).toEqual({});
        });

        it("applyApi - removeApi - `remove context`", function () {
            var ret;
            sc.registerApi(['func','func2','custom'], sc2, 'sc2Func');
            sc.registerApi(['func','func2','custom'], sc3, 'sc3Func');

            sc.removeApi(sc2);

            ret = sc.applyApi('func:instance_2');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('func2:instance_2');
            expect(sc2.func2).not.toHaveBeenCalled();
            expect(ret).toEqual([]);

            ret = sc.applyApi('custom:instance_2');
            expect(ret).toEqual([]);

            ret = sc.applyApi('sc2Func:instance_2');
            expect(ret).toEqual([]);


            ret = sc.applyApi('func');
            expect(sc2.func).not.toHaveBeenCalled();
            expect(sc3.func).toHaveBeenCalled();
            expect(ret).toEqual(['func']);

            ret = sc.applyApi('func2');
            expect(sc2.func2).not.toHaveBeenCalled();
            expect(sc3.func2).toHaveBeenCalled();
            expect(ret).toEqual(['func2']);

            ret = sc.applyApi('custom');
            expect(ret).toEqual([sc3.__cid__]);
        });

        it("removeApi - wrong parameter", function () {
        });
    });


/*
    describe('extend Events', function () {

        var Test,t1,t2,t3;

        beforeEach(function(){
            Test = new Cellula.Class('Test',{}).extend(Cellula.Events);
            t1 = new Test();
            t2 = new Test();
            t3 = new Test();

            spyOn(t1, 'receiver');
            spyOn(t2, 'receiver');
            spyOn(t3, 'receiver');
        });

        it("register `string` type parameter without {multiple:false}", function () {
            t1.register('CHANGED',t2);
            t1.register('CHANGED',t2);

            expect(t1._getMapping()['CHANGED'][0]).toBe(t2);
            expect(t1._getMapping()['CHANGED'][1]).toBe(t2);

            t2.register('CHANGED',t1);
            t2.register('CHANGED',t1);
            expect(t2._getMapping()['CHANGED'][0]).toBe(t1);
            expect(t2._getMapping()['CHANGED'][1]).toBe(t1);
        });

        it("register `string` type parameter with {multiple:false}", function () {
            t1.register('CHANGED',t2);
            t1.register('CHANGED',t2,{multiple:false});
            expect(t1._getMapping()['CHANGED'][0]).toBe(t2);
            expect(t1._getMapping()['CHANGED'][1]).toBe(undefined);

            t2.register('CHANGED',t1);
            t2.register('CHANGED',t1,{multiple:false});
            expect(t2._getMapping()['CHANGED'][0]).toBe(t1);
            expect(t2._getMapping()['CHANGED'][1]).toBe(undefined);
        });

        it("register `array` type parameter without {multiple:false}", function () {
            t1.register(['CHANGED','CLEARED'],t2);
            t1.register(['CHANGED','CLEARED'],t2);
            expect(t1._getMapping()['CHANGED'][0]).toBe(t2);
            expect(t1._getMapping()['CHANGED'][1]).toBe(t2);
            expect(t1._getMapping()['CLEARED'][0]).toBe(t2);
            expect(t1._getMapping()['CLEARED'][1]).toBe(t2);

            t2.register(['CHANGED','CLEARED'],t1);
            t2.register(['CHANGED','CLEARED'],t1);
            expect(t2._getMapping()['CHANGED'][0]).toBe(t1);
            expect(t2._getMapping()['CHANGED'][1]).toBe(t1);
            expect(t2._getMapping()['CLEARED'][0]).toBe(t1);
            expect(t2._getMapping()['CLEARED'][1]).toBe(t1);
        });

        it("register `array` type parameter with {multiple:false}", function () {
            t1.register(['CHANGED','CLEARED'],t2);
            t1.register(['CHANGED','CLEARED'],t2,{multiple:false});
            expect(t1._getMapping()['CHANGED'][0]).toBe(t2);
            expect(t1._getMapping()['CHANGED'][1]).toBe(undefined);
            expect(t1._getMapping()['CLEARED'][0]).toBe(t2);
            expect(t1._getMapping()['CLEARED'][1]).toBe(undefined);

            t2.register(['CHANGED','CLEARED'],t1);
            t2.register(['CHANGED','CLEARED'],t1,{multiple:false});
            expect(t2._getMapping()['CHANGED'][0]).toBe(t1);
            expect(t2._getMapping()['CHANGED'][1]).toBe(undefined);
            expect(t2._getMapping()['CLEARED'][0]).toBe(t1);
            expect(t2._getMapping()['CLEARED'][1]).toBe(undefined);
        });

        it("register `context` as a follower", function () {
            t1.register(t2);
            t1.register(t3);
            expect(t1.getFollowers()[t2.__cid__]).toBe(t2);
            expect(t1.getFollowers()[t3.__cid__]).toBe(t3);
        });

    });
*/
});