describe("Cellula.Class", function () {
    var SomeClass, SubClassA, SubClassB;

    beforeEach(function () {
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
        });

        SubClassA = new Cellula.Class('SubClassA').inherits(SomeClass);
        SubClassB = new Cellula.Class('SubClassB').inherits(SomeClass);

        sc = new SomeClass,
        a = new SubClassA,
        b = new SubClassB;
    });

    describe('string attribute', function () {
        it("origin key", function () {
            expect(sc.key).toBe('keykey');
            expect(a.key).toBe('keykey');
            expect(b.key).toBe('keykey');
        });

        it("parent key changed", function () {
            sc.key = 'sc';
            expect(sc.key).toBe('sc');
            expect(a.key).toBe('keykey');
            expect(b.key).toBe('keykey');
        });

        it("child key changed", function () {
            a.key = 'aaa';
            expect(sc.key).toBe('keykey');
            expect(a.key).toBe('aaa');
            expect(b.key).toBe('keykey');

            b.key = 'bbb';
            expect(sc.key).toBe('keykey');
            expect(a.key).toBe('aaa');
            expect(b.key).toBe('bbb');
        });
    });

    describe('number attribute', function () {
        it("origin num", function () {
            expect(sc.num).toBe(5);
            expect(a.num).toBe(5);
            expect(b.num).toBe(5);
        });

        it("parent key changed", function () {
            sc.num = 6;
            expect(sc.num).toBe(6);
            expect(a.num).toBe(5);
            expect(b.num).toBe(5);
        });

        it("child key changed", function () {
            a.num = 7;
            expect(sc.num).toBe(5);
            expect(a.num).toBe(7);
            expect(b.num).toBe(5);

            b.num = 8;
            expect(sc.num).toBe(5);
            expect(a.num).toBe(7);
            expect(b.num).toBe(8);
        });
    });

    describe('boolean attribute', function () {
        it("origin flag", function () {
            expect(sc.flag).toBe(true);
            expect(a.flag).toBe(true);
            expect(b.flag).toBe(true);
        });

        it("parent key changed", function () {
            sc.flag = false;
            expect(sc.flag).toBe(false);
            expect(a.flag).toBe(true);
            expect(b.flag).toBe(true);
        });

        it("child key changed", function () {
            a.flag = false;
            expect(sc.flag).toBe(true);
            expect(a.flag).toBe(false);
            expect(b.flag).toBe(true);

            b.flag = false;
            expect(sc.flag).toBe(true);
            expect(a.flag).toBe(false);
            expect(b.flag).toBe(false);
        });
    });

    describe('object attribute', function () {
        it("origin prop", function () {
            expect(sc.prop).toEqual({a:'a'});
            expect(a.prop).toEqual({a:'a'});
            expect(b.prop).toEqual({a:'a'});
        });

        it("parent key changed - change object property", function () {
            sc.prop.a = 'sc';
            expect(sc.prop).toEqual({a:'sc'});
            expect(a.prop).toEqual({a:'a'});
            expect(b.prop).toEqual({a:'a'});
        });

        it("parent key changed - change whole object", function () {
            sc.prop = {a:'sc'};
            expect(sc.prop).toEqual({a:'sc'});
            expect(a.prop).toEqual({a:'a'});
            expect(b.prop).toEqual({a:'a'});
        });

        it("child key changed - change object property", function () {
            a.prop.a = 'aa';
            expect(sc.prop).toEqual({a:'a'});
            expect(a.prop).toEqual({a:'aa'});
            expect(b.prop).toEqual({a:'a'});

            b.prop.a = 'bb';
            expect(sc.prop).toEqual({a:'a'});
            expect(a.prop).toEqual({a:'aa'});
            expect(b.prop).toEqual({a:'bb'});
        });

        it("child key changed - change whole object", function () {
            a.prop = {a:'aa'};
            expect(sc.prop).toEqual({a:'a'});
            expect(a.prop).toEqual({a:'aa'});
            expect(b.prop).toEqual({a:'a'});

            b.prop = {a:'bb'};
            expect(sc.prop).toEqual({a:'a'});
            expect(a.prop).toEqual({a:'aa'});
            expect(b.prop).toEqual({a:'bb'});
        });
    });

    describe('array attribute', function () {
        it("origin arr", function () {
            expect(sc.arr).toEqual([2,3,4]);
            expect(a.arr).toEqual([2,3,4]);
            expect(b.arr).toEqual([2,3,4]);
        });

        it("parent key changed - change property in array", function () {
            sc.arr.push('sc');
            expect(sc.arr).toEqual([2,3,4,'sc']);
            expect(a.arr).toEqual([2,3,4]);
            expect(b.arr).toEqual([2,3,4]);
        });

        it("parent key changed - change whole array", function () {
            sc.arr = ['sc'];
            expect(sc.arr).toEqual(['sc']);
            expect(a.arr).toEqual([2,3,4]);
            expect(b.arr).toEqual([2,3,4]);
        });

        it("child key changed - change property in array", function () {
            a.arr.push('aa');
            expect(sc.arr).toEqual([2,3,4]);
            expect(a.arr).toEqual([2,3,4,'aa']);
            expect(b.arr).toEqual([2,3,4]);

            b.arr.push('bb');
            expect(sc.arr).toEqual([2,3,4]);
            expect(a.arr).toEqual([2,3,4,'aa']);
            expect(b.arr).toEqual([2,3,4,'bb']);
        });

        it("child key changed - change whole array", function () {
            a.arr = ['aa'];
            expect(sc.arr).toEqual([2,3,4]);
            expect(a.arr).toEqual(['aa']);
            expect(b.arr).toEqual([2,3,4]);

            b.arr = ['bb'];
            expect(sc.arr).toEqual([2,3,4]);
            expect(a.arr).toEqual(['aa']);
            expect(b.arr).toEqual(['bb']);
        });
    });

    describe('undefined attribute', function () {
        it("origin unProp", function () {
            expect(sc.unProp).toBe(undefined);
            expect(a.unProp).toBe(undefined);
            expect(b.unProp).toBe(undefined);
        });

        it("parent unProp changed", function () {
            sc.unProp = 'sc';
            expect(sc.unProp).toBe('sc');
            expect(a.unProp).toBe(undefined);
            expect(b.unProp).toBe(undefined);
        });

        it("child unProp changed", function () {
            a.unProp = 'aaa';
            expect(sc.unProp).toBe(undefined);
            expect(a.unProp).toBe('aaa');
            expect(b.unProp).toBe(undefined);

            b.unProp = 'bbb';
            expect(sc.unProp).toBe(undefined);
            expect(a.unProp).toBe('aaa');
            expect(b.unProp).toBe('bbb');
        });
    });

    describe('function attribute', function () {
        it("origin func", function () {
            expect(sc.func()).toBe('func');
            expect(a.func()).toBe('func');
            expect(b.func()).toBe('func');
        });

        it("parent func changed", function () {
            sc.func = function(){return 'sc'};
            expect(sc.func()).toBe('sc');
            expect(a.func()).toBe('func');
            expect(b.func()).toBe('func');
        });

        it("child func changed", function () {
            a.func = function(){return 'aaa'};
            expect(sc.func()).toBe('func');
            expect(a.func()).toBe('aaa');
            expect(b.func()).toBe('func');

            b.func = function(){return 'bbb'};
            expect(sc.func()).toBe('func');
            expect(a.func()).toBe('aaa');
            expect(b.func()).toBe('bbb');
        });
    });
});