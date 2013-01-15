describe("Cellula.Event", function () {

    var e1,e2;
    beforeEach(function () {
        e1 = new Cellula.Events();
        e2 = new Cellula.Events();
    });

    describe('Events:__id__', function () {
        it("__id__", function () {
            expect(e1.__id__).toBe('cellula_Event_instance_1');
            expect(e2.__id__).toBe('cellula_Event_instance_2');
            console.log(e1.__id__);
        });
    });

    describe('Events:_check', function () {
        it("_check", function () {
            expect(e1._check(e2)).toBe(true);
        });
    });
});