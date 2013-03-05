describe("Cellula.Event", function () {

    var e1,e2,e3,e4,
        util = Cellula._util;
    var sc, sc2, sc3, sc4;
    beforeEach(function () {
        e1 = new Cellula.Events();
        e2 = new Cellula.Events();
        e3 = new Cellula.Events();
        e4 = new Cellula.Events();

        spyOn(e1, 'receiver');
        spyOn(e2, 'receiver');
        spyOn(e3, 'receiver');
        spyOn(e4, 'receiver');


        SomeClass = new Cellula.Class('SomeClass', {
            key:'keykey',           // string
            num:5,                  // number
            flag:true,              // boolean
            prop:{a:'a'},           // object
            arr:[2,3,4],            // array
            unProp:undefined,       // undefined
            func:function(){        // function
                return 'func';
            }
        },'NEW');

        sc = new SomeClass;
        sc2 = new SomeClass;
        sc3 = new SomeClass;
        sc4 = new SomeClass;

        util.mix(sc,e1);
        util.mix(sc2,e2);
        util.mix(sc3,e3);
        util.mix(sc4,e4);
    });

    describe('Events:__cid__', function () {
        it("__cid__", function () {
            //expect(e1.__cid__).toBe('cellula_Event_instance_1');
            //expect(e2.__cid__).toBe('cellula_Event_instance_2');
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




    describe('Events:Mix to Class', function () {
        it("register CHANGED", function () {
            sc.register('CHANGED',sc2);
            expect(sc._getMapping()['CHANGED'][0]).toBe(sc2);
        });

        it("register CHANGED", function () {
            sc2.register('CHANGED',sc);
            expect(sc2._getMapping()['CHANGED'][0]).toBe(sc);
        });

        it("emit : CHANGED", function () {
            sc.register('CHANGED',sc2);
            sc.register('CHANGED',sc3);
            sc.register('CHANGED',sc4);
            expect(sc.emit('CHANGED')).toBe(undefined);

            expect(sc2.receiver).toHaveBeenCalled();
            expect(sc2.receiver).toHaveBeenCalledWith({name:'CHANGED',target:sc});

            expect(sc3.receiver).toHaveBeenCalled();
            expect(sc3.receiver).toHaveBeenCalledWith({name:'CHANGED',target:sc});

            expect(sc4.receiver).toHaveBeenCalled();
            expect(sc4.receiver).toHaveBeenCalledWith({name:'CHANGED',target:sc});
        });
    });



    describe('inherit Events', function () {

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

});