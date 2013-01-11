describe("Cellula.Element", function () {
    var el;
    beforeEach(function () {
        el = new Cellula.Element({_data:{
            prop:'origin prop',
            objProp:{origin:'origin'},
            arrProp:['origin']
        }});

        el.set({
            prop:'some prop',
            objProp:{a:'b'},
            arrProp:[1, 3, 5]
        });
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
            expect(el._data).toEqual({prop:'some prop'});
            //expect(el.get('prop')).toBe('some prop');
        });

        it("Element.init", function () {
            var ret = 'invalid get method!';
            el.init({key:'uniqueElKey', _data:{prop:'some prop 1'}, get:function(){return ret;}});

            expect(el.key).toBe('uniqueElKey');
            //expect(el.get('prop')).toBe('some prop');
            expect(el._data).toEqual({
                prop:'some prop 1',
                objProp:{a:'b',origin:'origin'},
                arrProp:[1,3,5]
            });

            // invalid when `Function` type attribute passed in
            expect(el.get()).not.toBe(ret);
        });

    });

    describe('get', function () {
        it("get the given attribute", function () {
            expect(el.get('prop')).toBe('some prop');
            expect(el.get('objProp')).toEqual({a:'b',origin:'origin'});
            expect(el.get('arrProp')).toEqual([1,3,5]);
        });

        it("get the specific attributes with the given props in an array", function () {
            expect(el.get(['prop','objProp','arrProp'])).toEqual(['some prop',{a:'b',origin:'origin'},[1,3,5]]);
        });

        it("get all attributes", function () {
            expect(el.get()).toEqual({ prop : 'some prop', objProp : {a:'b',origin:'origin'}, arrProp : [ 1, 3, 5 ] } );
        });
    });

    describe('getPrevious', function () {

        it("get the given previous attribute", function () {
            expect(el.getPrevious('prop')).toBe('origin prop');
            expect(el.getPrevious('objProp')).toEqual({origin:'origin'});
            expect(el.getPrevious('arrProp')).toEqual(['origin']);
        });

        it("get the specific previous attributes with the given props in an array", function () {
            expect(el.getPrevious(['prop','objProp','arrProp'])).toEqual(['origin prop',{origin:'origin'},['origin']]);
        });

        it("get all previous attributes", function () {
            expect(el.getPrevious()).toEqual({ prop : 'origin prop', objProp : {origin:'origin'}, arrProp : ['origin'] } );
        });
    });

    describe('set', function () {
        it("set key,value", function () {
            el.set('prop','prop changed');
            expect(el.get('prop')).toBe('prop changed');
        });

        it("set {key:value}", function () {
            el.set({'objProp':{objProp:'objProp'}});
            expect(el.get('objProp')).toEqual({a:'b',origin:'origin',objProp:'objProp'});
        });

        it("set key,value with opt `off`", function () {
            el.set({'objProp':{objProp:'objProp'}});
            expect(el.get('objProp')).toEqual({a:'b',origin:'origin',objProp:'objProp'});
        });

        it("set {key:value} with opt `off` ", function () {
            el.set({'objProp':{objProp:'objProp'}});
            expect(el.get('objProp')).toEqual({a:'b',origin:'origin',objProp:'objProp'});
        });
    });

    describe('has', function () {
        it("has an attribute", function () {
            expect(el.has('prop')).toBe(true);
            expect(el.has('objProp')).toBe(true);
            expect(el.has('arrProp')).toBe(true);
            expect(el.has('not exist')).toBe(false);
        });
    });

    describe('reset', function () {
        it("initializing", function () {
            // TODO
            //var el = new Cellula.Element();
            //expect(el.key).toBe('Element_instance_1');
        });
    });

    describe('destroy', function () {
        it("initializing", function () {
            var el = new Cellula.Element();
            //expect(el.key).toBe('Element_instance_1');
        });
    });

    describe('storage', function () {
        it("localStorage for Element -- storage.toStorage", function () {
            // string
            localStorage.clear();
            el.storage.toStorage('prop');
            el.storage.toStorage('objProp');
            el.storage.toStorage('arrProp');
            expect(localStorage.getItem('prop')).toBe('some prop');
            expect(localStorage.getItem('objProp')).toBe('{"origin":"origin","a":"b"}');
            expect(localStorage.getItem('arrProp')).toBe('[1,3,5]');

            // all
            localStorage.clear();
            el.storage.toStorage();
            expect(localStorage.getItem('prop')).toBe('some prop');
            expect(localStorage.getItem('objProp')).toBe('{"origin":"origin","a":"b"}');
            expect(localStorage.getItem('arrProp')).toBe('[1,3,5]');

            // array
            localStorage.clear();
            el.storage.toStorage(['prop','objProp','arrProp']);
            expect(localStorage.getItem('prop')).toBe('some prop');
            expect(localStorage.getItem('objProp')).toBe('{"origin":"origin","a":"b"}');
            expect(localStorage.getItem('arrProp')).toBe('[1,3,5]');
        });

        it("localStorage for Element -- storage.get", function () {
            localStorage.clear();
            el.storage.toStorage();
            expect(el.storage.get('prop')).toBe('some prop');
            expect(el.storage.get('objProp')).toBe('{"origin":"origin","a":"b"}');
            expect(el.storage.get('arrProp')).toBe('[1,3,5]');

            expect(el.storage.get('aaa')).toBe(undefined);

            localStorage.setItem('bbb','bbb');
            expect(localStorage.getItem('bbb')).toBe('bbb');
            expect(el.storage.get('bbb')).toBe(undefined);
        });
    });
});