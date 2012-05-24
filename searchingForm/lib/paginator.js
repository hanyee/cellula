/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-5-11
 * Time: 下午2:06
 * To change this template use File | Settings | File Templates.
 */

var Paginator = new Class('Paginator', {
    pageDefault : {
        size : {},
        number: {},
        page : {
            first : 1,
            last : null,
            prev : null,
            next : null,
            totalItems : null,
            totalPages : null,
            current : null,
            currentArray : null
        }
    },
    typeEnum : {
        first : '\\bfirst\\b',
        last : '\\blast\\b',
        prev : '\\bprev\\b',
        next : '\\bnext\\b',
        goto : '\\bgoto\\b'
        //current : '\\bcurrent\\b'
        //number : '(\\D*)(\\d+)(\\D*)'
    },
    getOperationType : function(name){
        for(var n in this.typeEnum){
            if(new RegExp(this.typeEnum[n]).test(name)) return n;
        }
    },
    calcNumber : function(t){
        var type = this.getOperationType(t.className), c = parseInt(this.getData('page')['current']), l = this.getData('page')['totalPages'];
        if(type === undefined){
            return /(\D*)(\d+)(\D*)/.exec(t.innerHTML)[2]; // ? /(\D*)(\d+)(\D*)/.exec(t.innerHTML)[2] : this.get('number').getValue()[0];
        }
        // if(type === 'first') return 1;
        if(type === 'last') return l;
        if(type === 'prev') return c - 1;
        if(type === 'next') return c + 1;

        return 1;
    },
    operate : function(ct){
        var t = {}, number = this.get('number');
        if(number){
            t[UtilTools.getFirstPropName(number.getValue())] = this.calcNumber(ct);
            number.set({value : t});console.log(number);
        }
    },
    paginate : function(e){
        console.log('paginate');

        if(this.getOperationType(e.currentTarget.className) === 'goto'){
            if(this.save.apply(this, arguments) === undefined){
                return this.applyInterface('doSearch', this.getData());
            }
        }else{ console.log('not goto');
            this.operate(e.currentTarget);
            return this.applyInterface('doSearch', this.getData());
        }
    },
    getDefault : function(){
        return this.pageDefault;
    },

    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('changeSize', 'paginate');

        this.registerEvents();
    },
    changeSize : function(e){
        this.save('size');
        console.log('change');
        // TODO:
        // mix this.getData() && this.pageDefault.number
        this.applyInterface('doSearch', UT.mix(this.getData(),this.pageDefault.number));
    }
}).inherits(SearchModuleBase);
