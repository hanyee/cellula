var util = Cellula._util;
var newClass = Cellula.Class.create('Cell', {
    key:1,
    foo:function (a) {
        alert(a);
    }
});
var newClassInstance = new newClass();

//unitTest
describe("Util Test", function () {

    it("util.isArray", function () {
        var result = util.isArray('a')
        expect(result).toEqual(false);
        result = util.isArray([1, 2])
        expect(result).toEqual(true);
        result = util.isArray([
            {a:1, b:2},
            {c:3, d:4}
        ])
        expect(result).toEqual(true);
        result = util.isArray({a:[1, 2, 3]})
        expect(result).toEqual(false);
    });

    it("util.isObject", function () {
        var result = util.isObject('a')
        expect(result).toEqual(false);
        result = util.isObject([1, 2])
        expect(result).toEqual(false);
        result = util.isObject([
            {a:1, b:2},
            {c:3, d:4}
        ])
        expect(result).toEqual(false);
        result = util.isObject({a:[1, 2, 3]})
        expect(result).toEqual(true);
        result = util.isObject({})
        expect(result).toEqual(true);
        result = util.isObject(null)
        expect(result).toEqual(false);
        result = util.isObject(undefined)
        expect(result).toEqual(false);

        result = util.isObject(newClass)
        expect(result).toEqual(false);
        result = util.isObject(new newClass());
        expect(result).toEqual(true);


    });


    it("util.isString", function () {
        var result = util.isString('a')
        expect(result).toEqual(true);
        result = util.isString(null)
        expect(result).toEqual(false);
        result = util.isString(undefined)
        expect(result).toEqual(false);

    });


    it("util.isFunction", function () {
        var result = util.isFunction('a')
        expect(result).toEqual(false);
        result = util.isFunction({})
        expect(result).toEqual(false);
        result = util.isFunction(null)
        expect(result).toEqual(false);
        result = util.isFunction(function () {
        })
        expect(result).toEqual(true);
        var a = function () {
        };
        result = util.isFunction(a)
        expect(result).toEqual(true);
        result = util.isFunction(newClassInstance.foo)
        expect(result).toEqual(true);
    });


    it("util.isClass", function () {
        var result = util.isClass(newClass);
        expect(result).toEqual(true);
    });


    it("util.has", function () {
        var result = util.has(newClassInstance, 'key')
        expect(result).toEqual(false);
        result = util.has({a:'a', b:'b'}, 'a');
        expect(result).toEqual(true);
        result = util.has({a:'a', b:'b'}, 'b');
        expect(result).toEqual(true);
    });

    it("util.isEmpty", function () {
        var a = {};
        var result = util.isEmpty(a)
        expect(result).toEqual(true);
        var b = {a:1};
        result = util.isEmpty(b)
        expect(result).toEqual(false);
        var c = newClassInstance;
        result = util.isEmpty(c)
        expect(result).toEqual(false);
    });

    //util.each
    it("util.each", function () {
        //function (obj, fn, context, breaker)
        util.each(newClassInstance, function (item, index) {
            //test context
            expect(this.a).toEqual(1);
            expect(item).toEqual(newClassInstance[index]);
        }, {a:1, b:2, c:3})
    });

    //util.map
    it("util.map", function () {
        //function (obj, fn, context, breaker)
        util.map(newClassInstance, function (item, index) {
            //test context
            expect(this.a).toEqual(1);
            expect(item).toEqual(newClassInstance[index]);
        }, {a:1, b:2, c:3})
    });

    //util.map
    it("util.keys & values", function () {
        var keys = util.keys(newClassInstance);
        var values = util.values(newClassInstance);
        util.each(keys, function (item, index) {
            expect(newClassInstance[keys[index]]).toEqual(values[index]);
        })
    });
    //util.mix
    it("util.mix", function () {
        var a = newClassInstance;
        var b = {a:1, b:2, c:a, d:{aa:1}};
        util.mix(a, b);
        b.a = 222;
        expect(a.a).toEqual(1);
        a.key = 4;
        expect(b.c.key).toEqual(4);
        b.d.aa = 4;
        expect(a.d.aa).toEqual(4);
    });
    iit("util.deepMix", function () {
        var a = newClassInstance;
        var b = {a:1, b:2, d:{aa:1}};
        util.deepMix(a, b);
        expect(a.a).toEqual(1);
        b.d.aa = 4;
        expect(a.d.aa).toEqual(4);
    });


});