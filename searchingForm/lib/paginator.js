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
        var root = this.getRootNode('ui-paging'),
            current = this.get('page').getProp('value').current,
            total = this.get('page').getProp('value').totalItems,
            sv = this.get('size').getProp('value'),
            pds = this.pageDefault.size,
            size = UtilTools.isEmptyObject(sv) ? pds[UtilTools.getFirstPropName(pds)] : sv[UtilTools.getFirstPropName(sv)],
            m = total % size,
            pages = (total-m) / size + (m > 0 ? 1 : 0);

        var tpl = '<a class="ui-paging-prev" href="#">上一页</a>'

            +'<a class="ui-paging-item" href="#"><span>1</span></a>'
            +'<a class="ui-paging-item ui-paging-current" href="#"><span>2</span></a>'
            +'<span class="ui-paging-ellipsis">...</span>'
            +'<a class="ui-paging-item" href="#"><span>$-{totalPages}</span></a>'
            +'<a class="ui-paging-next" href="#">下一页</a>'
            +'<span class="ui-paging-info fn-ml0"><span class="ui-paging-bold">2/1024</span>页</span>'
            +'<span class="ui-paging-info ui-paging-which">'
            +'<input id="J_pageNumber" type="text" value="" name="some_name">'
            +'</span>'
            +'<a href="#" class="ui-paging-info ui-paging-goto"><span>跳转</span></a>';

        root.innerHTML = UtilTools.MakeTpl(tpl, {totalPages:pages});
        this.registerEvents();
    }
}).inherits(SearchModuleBase);
