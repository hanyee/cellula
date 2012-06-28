/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-18
 * Time: 下午3:13
 * To change this template use File | Settings | File Templates.
 */

var SearchingFormAlipay = new Class('SearchingFormAlipay', {}).inherits(SearchingForm);

var DataTableAlipay = new Class('DataTableAlipay', {
    tips : {
        noResult : null,
        error : null
    },
    tableTpl : '',
    init : function(cfg){
        this.initCfg(cfg);
        this.registerEvents();
    },
    render : function(data){
        data = data.dataTable;
        var root = this.getNode('ui-table'),
            table = root.getElementsByTagName('table')[0],
            tbody = table.getElementsByTagName('tbody')[0],
            tpl = '';
        if(tbody) table.removeChild(tbody);

        if(UtilTools.isEmptyObject(data)){
            UtilTools.addClass(root, this.hideClass);
        }else{
            var div = document.createElement('div');
            div.innerHTML = '<table><tbody>'+UtilTools.parseTpl(this.tableTpl, data)+'</tbody></table>';
            tbody = div.getElementsByTagName('tbody')[0];
            table.appendChild(tbody);
            this.registerEvents();
            UtilTools.removeClass(root, this.hideClass);
        }
    }
}).inherits(DataTable);


var PaginatorAlipay = new Class('PaginatorAlipay', {
    sizeDefault : 5,
    pageTpl : '',
    typeEnum : {
        first : '\\bfirst\\b',
        last : '\\blast\\b',
        prev : '\\bprev\\b',
        next : '\\bnext\\b',
        goto : '\\bgoto\\b'
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
        //console.log('paginate');

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
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('changeSize', 'paginate');

        //this.render();
    },

    prepareTplConfig : function(data){
        var pageEl = this.get('page');

        if(data && data.page) pageEl.set({value : data.page});

        var current = parseInt(pageEl.getProp('value').current),
            total = parseInt(pageEl.getProp('value').totalItems),
            sv = this.get('size').getProp('value'),
            pds = this.pageDefault.size,
            size = parseInt(UtilTools.isEmptyObject(sv) ? pds[UtilTools.getFirstPropName(pds)] : sv[UtilTools.getFirstPropName(sv)]),
            m = total % size,
            pages = (total-m) / size + (m > 0 ? 1 : 0),
            sd = this.sizeDefault,
            half = (sd-1)/2,
            tplCfg;

        //this.save('page');
        pageEl.set({value : {totalPages : pages}});

        tplCfg = {
            totalItems : total,
            startItem : (current-1)*size+1,
            endItem : current*size>total?total:current*size,
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

        return tplCfg;
    },
    render : function(data){
        data = data.paging;
        var root = this.getNode('ui-paging');

        if(UtilTools.isEmptyObject(data)){
            UtilTools.addClass(root, this.hideClass);
        }else{
            root.innerHTML = UtilTools.parseTpl(this.pageTpl, this.prepareTplConfig(data));
            this.registerEvents();
            UtilTools.removeClass(root, this.hideClass);
        }
    }
}).inherits(Paginator);

var searchingSceneAssets = {};
searchingSceneAssets.pagingTplStyles = [
    '<a class="ui-paging-prev" href="#">上一页</a>'
    +'$-{#items}<a class="ui-paging-item$-{#currentClass} ui-paging-current$-{/currentClass}" href="#"><span>$-{num}</span></a>$-{/items}'
    +'$-{#ellipsis}<span class="ui-paging-ellipsis">...</span>$-{/ellipsis}'
    +'$-{#totalShow}<a class="ui-paging-item" href="#"><span>$-{totalPages}</span></a>$-{/totalShow}'
    +'<a class="ui-paging-next" href="#">下一页</a>'
    +'<span class="ui-paging-info fn-ml0"><span class="ui-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
    +'<span class="ui-paging-info ui-paging-which">'
    +'<input id="J_pageNumber" type="text" value="" name="some_name">'
    +'</span>'
    +'<a href="#" class="ui-paging-info ui-paging-goto"><span>跳转</span></a>',

    '<a class="ui-paging-prev" href="#">上一页</a>'
    +'<span class="ui-paging-info">第<span class="ui-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
    +'<a class="ui-paging-next" href="#">下一页</a>',

    '<a class="ui-paging-first" href="#">首页</a>'
    +'<a class="ui-paging-prev" href="#">上一页</a>'
    +'<span class="ui-paging-info">$-{startItem} - $-{endItem}条，共$-{totalItems}条</span>'
    +'<a class="ui-paging-next" href="#">下一页</a>'
    +'<a class="ui-paging-last" href="#">尾页</a>'
];

searchingSceneAssets.tableTplStyles = [
    '$-{#rows}<tr$-{#spliter} class="ui-table-spliter"$-{/spliter}>'
     +'$-{#items}<td>$-{content}</td>$-{/items}'
     +'</tr>$-{/rows}'
];



