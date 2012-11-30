TestCase("utilTest", {
    /*
    *   map each toArray 分为一组
    * */
    // 原生map是数组的新方法，因此，只做数组的测试用例
    "test map": function () {
        var doubled = Cellula._util.map([1, 2, 3], function(num) { return num * 2; });
        assertEquals('doubled numbers', doubled.join(', '), '2, 4, 6');

        var tripled = Cellula._util.map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier : 3});
        assertEquals('tripled numbers with context', tripled.join(', '), '3, 6, 9');

        var ifnull = Cellula._util.map(null, function(){});
        assertTrue('handles a null properly', Cellula._util.isArray(ifnull) && ifnull.length === 0);

        //TODO 类数组的DOM元素也可以使用map 在underscore里
        /*
        if (document.querySelectorAll) {
            var ids = _.map(document.querySelectorAll('#map-test *'), function(n){ return n.id; });
            deepEqual(ids, ['id1', 'id2'], 'Can use collection methods on NodeLists.');
        }
        var ids = _.map($('#map-test').children(), function(n){ return n.id; });
        deepEqual(ids, ['id1', 'id2'], 'Can use collection methods on jQuery Array-likes.');

        var ids = _.map(document.images, function(n){ return n.id; });
        ok(ids[0] == 'chart_image', 'can use collection methods on HTMLCollections');
        */
    },
    "test each": function() {
        Cellula._util.each([1, 2, 3], function(num, i) {
            assertEquals('each iterators provide value and iteration count', num, i + 1);
        });

        var answers = [];
        Cellula._util.each([1, 2, 3], function(num){ answers.push(num * this.multiplier); }, {multiplier : 5});
        assertEquals('context object property accessed', answers.join(', '), '5, 10, 15');

        answers = [];
        Cellula._util.each([1, 2, 3], function(num){ answers.push(num); });
        assertEquals('aliased as "forEach"', answers.join(', '), '1, 2, 3');

        answers = [];
        var obj = {one : 1, two : 2, three : 3};
        obj.constructor.prototype.four = 4;
        Cellula._util.each(obj, function(value, key){ answers.push(key); });
        assertEquals('iterating over objects works, and ignores the object prototype.', answers.join(", "), 'one, two, three');
        delete obj.constructor.prototype.four;

        answers = 0;
        Cellula._util.each(null, function(){ ++answers; });
        assertEquals('handles a null properly', answers, 0);

        //TODO underscore中有include方法，cellula没有对应的方法，这个用例先hold
        /*
        answer = null;
        Cellula._util.each([1, 2, 3], function(num, index, arr){ if (Cellula._util.has(arr, num)) answer = true; }); //has === include???
        assertTrue( 'can reference the original collection from inside the iterator', answer);
        */
    },
    "test toArray": function() {
        assertTrue('arguments object is not an array', !Cellula._util.isArray(arguments));

        assertTrue('arguments object converted into array', Cellula._util.isArray(Cellula._util.toArray(arguments)));

        var a = [1,2,3];
        assertTrue('array is cloned', Cellula._util.toArray(a) !== a);
        assertEquals('cloned array contains same elements', Cellula._util.toArray(a).join(', '), '1, 2, 3');

        var numbers = Cellula._util.toArray({one : 1, two : 2, three : 3});
        assertEquals('object flattened into array', numbers.join(', '), '1, 2, 3');
    },

    /*
    * bind自己为一组
    * */

    "test bind": function() {
        var context = {name : 'moe'};
        var func = function(arg) { return "name: " + (this.name || arg); };
        var bound = Cellula._util.bind(func, context);
        assertEquals('can bind a function to a context', bound(), 'name: moe');

        bound = Cellula._util.bind(func, null, 'curly');
        assertEquals('can bind without specifying a context', bound(), 'name: curly');

        /*func = function(salutation, name) { return salutation + ': ' + name; };
        func = Cellula._util.bind(func, this, 'hello');
        assertEquals('the function was partially applied in advance', func('moe'), 'hello: moe');

        var func = Cellula._util.bind(func, this, 'curly');
        assertEquals('the function was completely applied in advance', func(), 'hello: curly');

        var func = function(salutation, firstname, lastname) { return salutation + ': ' + firstname + ' ' + lastname; };
        func = Cellula._util.bind(func, this, 'hello', 'moe', 'curly');
        assertEquals('the function was partially applied in advance and can accept multiple arguments', func(), 'hello: moe curly');

        func = function(context, message) { assertEquals(this, context, message); };
        Cellula._util.bind('can bind a function to `0`', func, 0, 0)();
        Cellula._util.bind('can bind a function to an empty string', func, '', '')();
        Cellula._util.bind('can bind a function to `false`', func, false, false)();

        // These tests are only meaningful when using a browser without a native bind function
        // To test this with a modern browser, set underscore's nativeBind to undefined
        var F = function () { return this; };
        var Boundf = Cellula._util.bind(F, {hello: "moe curly"});
        assertEquals("function should not be bound to the context, to comply with ECMAScript 5", new Boundf().hello, undefined);
        assertEquals("When called without the new operator, it's OK to be bound to the context", Boundf().hello, "moe curly");*/
    },

    /*
    * keys、values、
    * isEmpty、isArray、isObject、isFunction、isArguments、isEmptyObject、
    * getFirstProName、isInstanceOfClass、has、copy
    * 作为一个维度
    * */
    "test keys": function() {
        assertEquals('can extract the keys from an object', Cellula._util.keys({one:1, two:2}).join(', '),'one, two');

        // the test above is not safe because it relies on for-in enumeration order
        var a = []; a[1] = 0;
        //XXX #95是什么问题？
        assertEquals('is not fooled by sparse arrays; see issue #95', Cellula._util.keys(a).join(', '), '1');

        assertException('throws an error for `null` values', function(){ Cellula._util.keys(null); }, new TypeError);
        assertException('throws an error for `undefined` values', function() { Cellula._util.keys(void 0); }, new TypeError);
        assertException('throws an error for number primitives', function() { Cellula._util.keys(1); }, new TypeError);
        assertException('throws an error for string primitives', function() { Cellula._util.keys('a'); }, new TypeError);
        assertException('throws an error for boolean primitives', function() { Cellula._util.keys(true); }, new TypeError);
    },

    "test values": function() {
        assertEquals('can extract the values from an object', Cellula._util.values({one:1, two: 2}).join(', '), '1, 2');
        assertEquals('... even when one of them is "length"', Cellula._util.values({one:1, two: 2, length: 3}).join(', '), '1, 2, 3');
    },

    "test isEmpty": function() {
        assertTrue("[1] is not empty",!Cellula._util.isEmpty([1]));
        assertTrue("[] is empty",Cellula._util.isEmpty([]));
        assertTrue("{one : 1} is not empty",!Cellula._util.isEmpty({one : 1}));
        assertTrue("{} is empty",Cellula._util.isEmpty({}));
        assertTrue("new RegExp('') is empty",Cellula._util.isEmpty(new RegExp('')));
        assertTrue("null is empty",Cellula._util.isEmpty(null));
        assertTrue("undefined is empty",Cellula._util.isEmpty());
        assertTrue("the empty string is empty",Cellula._util.isEmpty(''));
        assertTrue("strings is not empty",!Cellula._util.isEmpty('moe'));

        var obj = {one : 1};
        delete obj.one;
        assertTrue("deleting all the keys from an object empties it",Cellula._util.isEmpty(obj));
    },

    "test isArray": function() {
        assertTrue("arguments is not a array",!Cellula._util.isArray(arguments));
        assertTrue("[1,2,3] is a array",Cellula._util.isArray([1,2,3]));
        assertTrue("[] is alse a array",Cellula._util.isArray([]));
    },

    "test isObject": function() {
        assertTrue("{one: 1} is a object",Cellula._util.isObject({one: 1}));
        assertTrue("arguments is not a object",!Cellula._util.isObject(arguments));
        assertTrue("array is not a object",!Cellula._util.isObject([1, 2, 3]));
        assertTrue("functions is not a object",!Cellula._util.isObject(function () {}));
        assertTrue("String() is not a object",!Cellula._util.isObject(new String('string')));
        assertTrue("boolean is not a object",!Cellula._util.isObject(true));
        assertTrue("number is not a object",!Cellula._util.isObject(12));
        assertTrue("string is not a object",!Cellula._util.isObject('string'));
        assertTrue("undefined is not a object",!Cellula._util.isObject(undefined));
        assertTrue("null is not a object",!Cellula._util.isObject(null));
        //TODO DOM
        //ok(_.isObject($('html')[0]), 'and DOM element');
        //jstestdriver.console.log("=========================");
    },

    "test isFunction": function() {
        assertTrue("arrays is not a function",!Cellula._util.isFunction([1, 2, 3]));
        assertTrue("strings is not a function",!Cellula._util.isFunction('moe'));
        assertTrue("isFunction is a function",Cellula._util.isFunction(Cellula._util.isFunction));
    },

    "test isArguments": function() {
        var args = (function(){ return arguments; })(1, 2, 3);
        assertTrue("the arguments object is an arguments object",Cellula._util.isArguments(args));
        assertTrue("but not when it\'s converted into an array",!Cellula._util.isArguments(Cellula._util.toArray(args)));
        assertTrue("a string is not an arguments object",!Cellula._util.isArguments('string'));
        assertTrue("a function is not an arguments object",!Cellula._util.isArguments(Cellula._util.isArguments));
        assertTrue("a vanilla arrays is not an arguments object",!Cellula._util.isArguments([1,2,3]));
        //TODO iArguments from another frame
        //ok(_.isArguments(iArguments), 'even from another frame');
    },
/*
    "test isInstanceOfClass": function() {
        //TODO isInstanceOfClass api why
        var CC = function() {};
        var cc = {};
        assertTrue('CC is cc\' Class',Cellula._util.isInstanceOfClass(CC));
    },
*/
    "test has": function() {
        var cc = {one: 1};
        cc.constructor.prototype.two = 2;

        assertTrue("one is cc\'s own property", Cellula._util.has(cc,'one'));
        assertTrue("two is not cc\'s own property", !Cellula._util.has(cc,'two'));

        delete  cc.constructor.prototype.two;
    },
    "test copy": function() {
        //TODO copy
        //依赖于mix，先写mix的
    },

    /*
    *  Utility
    */
    "test makeTpl": function() {

    },
    "test parseTpl": function() {

    },

    "test mix": function() {
        //XXX mix的用法
        var receiver = {},
            supplier1 = {a:1, b: 2, c: {d: 3}},
            supplier2 = {c: {e: 4}},
            //supplier3 = ['A','B','C'],
            supplier4 = {
                myReverse: function(string) {
                    return string.split('').reverse().join('');
                }
            };
        ret = Cellula._util.mix({}, supplier4);
        assertEquals('myReverse function has mixed in to ret', ret.myReverse('panacea'), 'aecanap');

        ret = Cellula._util.mix(receiver, supplier1, supplier2);
        assertTrue('ret object does\'t has the prop ret.c.d', !ret.c.d);
        assertEquals('ret object has the prop ret.c.e', ret.c.e, 4);

        //ret = Cellula._util.mix(ret, supplier3);
        //assertEquals('the elements of Array is mixed in to ret', ret[0], 'A');
    },
    "test deepMix": function() {
        //XXX deepMix的用法
        var receiver = {},
            supplier1 = {a:1, b: 2, c: {d: 3}},
            supplier2 = {c: {e: 4}},
            ret = Cellula._util.deepMix(receiver, supplier1, supplier2);

        assertEquals('ret object has the prop ret.c.d', ret.c.d, 3);
        assertEquals('ret object has the prop ret.c.e', ret.c.e, 4);
    }


});
