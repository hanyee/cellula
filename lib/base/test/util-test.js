TestCase("utilTest", {
    "test isArray": function() {
        assertTrue("arguments is not a array!",!Cellula._util.isArray(arguments));
        assertTrue("[1,2,3] is a array!",Cellula._util.isArray([1,2,3]));
        assertTrue("[] is a array!",Cellula._util.isArray([]));
    },
    "test isObject": function() {
        assertTrue("arguments is not a object!",!Cellula._util.isObject(arguments));
        assertTrue("array is not a object!",!Cellula._util.isObject([1, 2, 3]));
        assertTrue("functions is not a object",!Cellula._util.isObject(function () {}));
        assertTrue("String() is not a object",!Cellula._util.isObject(new String('string')));
        assertTrue("boolean is not a object",!Cellula._util.isObject(true));
        assertTrue("number is not a object",!Cellula._util.isObject(12));
        assertTrue("string is not a object",!Cellula._util.isObject('string'));
        assertTrue("undefined is not a object",!Cellula._util.isObject(undefined));
        assertTrue("null is not a object",!Cellula._util.isObject(null));
        //jstestdriver.console.log("=========================");
    },

    //ok(_.isObject(arguments), 'the arguments object is object');
    //ok(_.isObject($('html')[0]), 'and DOM element');

    //TODO

    "test isFunction": function() {
        assertTrue("arrays is not a functions",!Cellula._util.isFunction([1, 2, 3]));
        assertTrue("strings is not a functions",!Cellula._util.isFunction('moe'));
        assertTrue("function is!",Cellula._util.isFunction(Cellula._util.isFunction));
        //jstestdriver.console.log("=========================");
    },

    "test isArguments": function() {
        var args = (function(){ return arguments; })(1, 2, 3);
        assertTrue("the arguments object is an arguments object!",Cellula._util.isArguments(args));
        assertTrue("a string is not an arguments object!",!Cellula._util.isArguments('string'));
        assertTrue("a function is not an arguments object!",!Cellula._util.isArguments(Cellula._util.isArguments));
        assertTrue("but not when it\'s converted into an array!",!Cellula._util.isArguments(Cellula._util.toArray(args)));
        assertTrue("a vanilla arrays is not an arguments object!",!Cellula._util.isArguments([1,2,3]));

        //TODO
        //ok(_.isArguments(iArguments), 'even from another frame');
    },

/*
 test("isArguments", function() {
 var args = (function(){ return arguments; })(1, 2, 3);
 ok(!_.isArguments('string'), 'a string is not an arguments object');
 ok(!_.isArguments(_.isArguments), 'a function is not an arguments object');
 ok(_.isArguments(args), 'but the arguments object is an arguments object');
 ok(!_.isArguments(_.toArray(args)), 'but not when it\'s converted into an array');
 ok(!_.isArguments([1,2,3]), 'and not vanilla arrays.');
 ok(_.isArguments(iArguments), 'even from another frame');
 });
*/
    "test isEmpty": function() {
        assertTrue("[1] is not empty!",!Cellula._util.isEmpty([1]));
        assertTrue("[] is empty!",Cellula._util.isEmpty([]));
        assertTrue("{one : 1} is not empty!",!Cellula._util.isEmpty({one : 1}));
        assertTrue("{} is not empty!",Cellula._util.isEmpty({}));
        assertTrue("new RegExp('') is not empty!",Cellula._util.isEmpty(new RegExp('')));
        assertTrue("null is empty!",Cellula._util.isEmpty(null));
        assertTrue("undefined is empty!",Cellula._util.isEmpty());
        assertTrue("the empty string is empty!",Cellula._util.isEmpty(''));
        assertTrue("strings is not empty!",!Cellula._util.isEmpty('moe'));

        var obj = {one : 1};
        delete obj.one;
        assertTrue("deleting all the keys from an object empties it!",Cellula._util.isEmpty(obj));
    },


    "test each": function() {
        Cellula._util.each([1, 2, 3], function(num, i) {
            assertEquals('each iterators provide value and iteration count', num, i + 1);
        });

        var answers = [];
        Cellula._util.each([1, 2, 3], function(num){ answers.push(num * this.multiplier);}, {multiplier : 5});
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

        //XXX
        answer = null;
        Cellula._util.each([1, 2, 3], function(num, index, arr){ if (Cellula._util.has(arr, num)) answer = true; }); //has === include???
        assertTrue( 'can reference the original collection from inside the iterator', answer);

        answers = 0;
        Cellula._util.each(null, function(){ ++answers; });
        assertEquals('handles a null properly', answers, 0);
    }

    /*test("each", function() {











    });*/
});
