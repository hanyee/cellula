describe("Cellula.Element", function () {

    var el;

    beforeEach(function () {
        el = new Cellula.Element({_data:{
            prop:'some prop',
            objProp:{a:'b'},
            arrProp:[1,3,5]
        }});
    });

    describe('null key attribute', function () {
        it("Element.key", function () {
            // should be `__cid__`
            expect(el.key).toBe(el.__cid__);
            // if el is the first instance
            expect(el.key).toBe('Element_instance_1');
        });
    });

    describe('init will setup attributes when creating an instance', function () {
        it("new Element()", function () {
            el = new Cellula.Element({key:'uniqueElKey', _data:{prop:'some prop'}});

            expect(el.key).toBe('uniqueElKey');
            expect(el.get('prop')).toBe('some prop');
        });

        it("Element.init", function () {
            var ret = 'invalid get method!';
            el.init({key:'uniqueElKey', _data:{prop:'some prop'}, get:function(){return ret;}});

            expect(el.key).toBe('uniqueElKey');
            expect(el.get('prop')).toBe('some prop');

            // invalid when `Function` type attribute passed in
            expect(el.get()).not.toBe(ret);
        });

    });

    describe('get', function () {
        it("get the given attribute", function () {
            expect(el.get('prop')).toBe('some prop');
            expect(el.get('objProp')).toEqual({a:'b'});
            expect(el.get('arrProp')).toEqual([1,3,5]);
        });

        it("get the specific attributes with the given props in an array", function () {
            expect(el.get(['prop','objProp','arrProp'])).toEqual(['some prop',{a:'b'},[1,3,5]]);
        });

        it("get all attributes", function () {
            expect(el.get()).toEqual({ prop : 'some prop', objProp : { a : 'b' }, arrProp : [ 1, 3, 5 ] } );
        });
    });

    describe('set', function () {
        it("initializing", function () {
            var el = new Cellula.Element();
            //expect(el.key).toBe('Element_instance_1');
        });
    });

    describe('destroy', function () {
        it("initializing", function () {
            var el = new Cellula.Element();
            //expect(el.key).toBe('Element_instance_1');
        });
    });
});