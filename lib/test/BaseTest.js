var _ = Cellula._util;

TestCase("BaseTest", {
    "test util isArray": function() {
        assertFalse(_.isArray({}));
        assertFalse(_.isArray('a'));
        assertFalse(_.isArray(123));
        assertFalse(_.isArray(null));
        assertFalse(_.isArray(undefined));
        assertTrue(_.isArray([]));
        assertTrue(_.isArray(new Array));
        assertTrue(_.isArray([1,2]));
    },
    "test util isObject": function() {
        assertTrue(_.isObject({}));
        assertTrue(_.isObject([]));
    }
});

var newClass = Cellula.Class.create('Cell',{
    key:1,
    foo:function(a){
        alert(a);
    }
})
var newClassInstance = new newClass();

//unitTest
describe("Util Test", function() {

    it("util.mix", function() {
        var a = newClassInstance;
        var b = {a:1,b:2,c:a,d:{aa:1}};
        _.mix(a,b);
        b.a=222;
        expect(a.a).toEqual(1);
        a.key =4;
        expect(b.c.key).toEqual(4);
        b.d.aa=4;
        expect(a.d.aa).toEqual(3);
    });

});
