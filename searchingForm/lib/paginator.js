/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-5-11
 * Time: 下午2:06
 * To change this template use File | Settings | File Templates.
 */

var Paginator = new Class('Paginator', {
    pageDefault : {
        /**
         *
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
         */
    },
    sizeDefault : 5,
    pageTpl : '',
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
        var type = this.getOperationType(t.className), c = parseInt(this.getData('page')['current']), l = parseInt(this.getData('page')['totalPages']);
        if(type === undefined){
            return /(\D*)(\d+)(\D*)/.exec(t.innerHTML) ? /(\D*)(\d+)(\D*)/.exec(t.innerHTML)[2] : undefined;
        }
        // if(type === 'first') return 1;
        if(type === 'last') return l;
        if(type === 'prev') return c - 1 > 1 ? c - 1 : 1;
        if(type === 'next') return c + 1 < l ? c + 1 : l;

        return 1;
    },
    operate : function(ct){
        var t = {}, number = this.get('number'), gotoNum = this.calcNumber(ct);
        if(number && gotoNum){
            t[UtilTools.getFirstPropName(number.getProp('value'))] = gotoNum;
            number.set({value : t});
            return true;
        }
    },
    paginate : function(e){
        if(e && e.preventDefault){
            e.preventDefault();
        }
        console.log('paginate');

        if(this.getOperationType(e.currentTarget.className) === 'goto'){
            if(this.save.apply(this, arguments) === undefined){
                return this.applyInterface('doSearch', this.getData());
            }
        }else{
            if(this.operate(e.currentTarget)){
                return this.applyInterface('doSearch', this.getData());
            }
        }
    },
    getDefault : function(){
        return this.pageDefault;
    },
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('changeSize', 'paginate');

        this.render();
    },
    changeSize : function(e){
        this.save('size');
        console.log('change');
        // TODO:
        // mix this.getData() && this.pageDefault.number
        this.applyInterface('doSearch', UT.mix(this.getData(),this.pageDefault.number));
    },
    getRootNode : function(rootStyle){
        var nodesArray = document.getElementsByClassName(rootStyle);
        if(nodesArray.length > 1 && document.getElementById(this.root)) return document.getElementById(this.root);
        if(nodesArray.length === 1) return nodesArray[0];

        throw new Error('root id undefined or more paginators!');
    },
    render : function(){
        //this.save('page');

        var root = this.getRootNode('ui-paging'),
            current = parseInt(this.get('page').getProp('value').current),
            total = this.get('page').getProp('value').totalItems,
            sv = this.get('size').getProp('value'),
            pds = this.pageDefault.size,
            size = UtilTools.isEmptyObject(sv) ? pds[UtilTools.getFirstPropName(pds)] : sv[UtilTools.getFirstPropName(sv)],
            m = total % size,
            pages = (total-m) / size + (m > 0 ? 1 : 0),
            sd = this.sizeDefault,
            half = (sd-1)/2;
            this.get('page').set({value:{totalPages : pages}});

        var tplCfg = {
            totalItems : total,
            startItem : (current-1)*size+1,
            endItem : current*size,
            totalPages : pages,
            totalShow : pages > sd ? (pages-half > current?true:false) : false,
            ellipsis : pages > sd ? (pages-half-1 > current?true:false) : false,
            items : [
                //{num:5,currentClass:false}
            ],
            current : current
        };

        for (var i = 1,l = (pages > sd ? sd : pages), h = half; i <= l; i++) {
            var num = 1;
            if(pages > sd){
                if(current >half && current <= pages-half) num = current - h, h--;
                if(current > pages-half) num = pages - sd + i;
                if(current <= half) num = i;
            }else{
                num = i;
            }

            tplCfg.items.push({num:num, currentClass:current === num ? true : false});
        }

        root.innerHTML = UtilTools.parseTpl(this.pageTpl, tplCfg);
        this.registerEvents();
    }
}).inherits(SearchModuleBase);
