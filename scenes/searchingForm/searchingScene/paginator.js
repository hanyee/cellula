/**
 * @fileOverview SearchingScene's paging module definition based on Cellula.
 * @description: defines paginator module
 * @namespace: Cellula
 * @version: 0.3.1
 * @author: @hanyee
 */

(function(cellula){
    var util = cellula._util;
    this.Paginator = new cellula.Class('Paginator', {
        pageDefault : {
            /**
             *
             size : {},
             number: {},
             page : {
                 first : 1, // optional
                 last : null, // optional
                 prev : null, // optional
                 next : null, // optional
                 totalItems : null,
                 totalPages : null, // optional
                 current : null,
                 currentArray : null // optional
             },
             sizeDefault : 5,
             sizeOptions : []
             */
        },
        // sizeDefault : 5,  // deprecated
        pageTpl : '',
        typeEnum : {
            'first' : '\\bfirst\\b',
            'last' : '\\blast\\b',
            'prev' : '\\bprev\\b',
            'next' : '\\bnext\\b',
            'goto' : '\\bgoto\\b'
            //'current' : '\\bcurrent\\b'
            //'number' : '(\\D*)(\\d+)(\\D*)'
        },
        init:function (cfg) {
            this._super(cfg);
            this._bindAll('changeSize', 'paginate');

            //this.render();
        },
        getOperationType : function(name){
            for(var n in this.typeEnum){
                if(new RegExp(this.typeEnum[n]).test(name)) return n;
            }
        },
        calcNumber : function(t){
            var type = this.getOperationType(t.className), p = this.collection.get('page'), c = parseInt(p.get('current')), l = parseInt(p.get('totalPages'));
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
            var number = this.collection.get('number'), gotoNum = this.calcNumber(ct);
            if(number && gotoNum){
                return number.set(util.keys(number.get())[0], gotoNum);
            }
            return false;
        },

        operate2 : function (ct) {
            //if(this.getOperationType(ct.className) === 'goto')
            var number = this.collection.get('number'), gotoNum = this.calcNumber(ct);
            if (number && gotoNum) {
                return number.set(util.keys(number.get())[0], gotoNum);
            }
            return false;
        },

        paginate : function(e){
            if(e && e.preventDefault){
                e.preventDefault();
            }
            //console.log('paginate');
            var cll = this.collection;
            if(this.getOperationType(e.currentTarget.className) === 'goto'){console.log('goto')
                if(cll.save('number')){
                    var size = cll.get('size'),
                        sv = util.values(size.get())[0],
                        number = cll.get('number');
                    if (util.isEmpty(sv)) size.set(this.pageDefault.size); //size.save(); ?
                    return this.applyInterface('doSearch', util.mix({}, size.get(), number.get())); // this.getData();
                }
            }else{
                if(this.operate(e.currentTarget)){
                    var size = cll.get('size'),
                        sv = util.values(size.get())[0],
                        number = cll.get('number');
                    if(util.isEmpty(sv)) size.set(this.pageDefault.size); //size.save(); ?
                    return this.applyInterface('doSearch', util.mix({}, size.get(), number.get()) ); // this.getData();
                }
            }
/*
            if(this.getOperationType(e.currentTarget.className) === 'goto') if(!cll.save('number')) return false;

            if(!this.operate(e.currentTarget)) return false;

            var size = cll.get('size'),
                sv = util.values(size.get())[0],
                number = cll.get('number');
            if (util.isEmpty(sv)) size.set(this.pageDefault.size); //size.save(); ?
            return this.applyInterface('doSearch', util.mix({}, size.get(), number.get())); // this.getData();

*/


        },
        getDefault : function(){
            return this.pageDefault;
        },
        changeSize : function(e){
            var size = this.collection.get('size');
            size.save();
            console.log('change');
            return this.applyInterface('doSearch', util.mix({}, size.get(), this.pageDefault.number));
        },
        prepareTplConfig : function(data){
            var pageEl = this.collection.get('page');
            if(data && data.page) pageEl.set(data.page);

            var current = parseInt(pageEl.get('current')),
                total = parseInt(pageEl.get('totalItems')),
                pds = this.pageDefault.size,
                sv = util.values(this.collection.get('size').get())[0],
                size = parseInt(util.isEmpty(sv) ? util.values(pds)[0] : sv),
                m = total % size,
                pages = (total-m) / size + (m > 0 ? 1 : 0),
                sd = this.pageDefault.sizeDefault,
                half = (sd-1)/2,
                tplCfg;

            if(current < 1) current = 1;
            if(current > pages) current = pages;

            pageEl.set({totalPages : pages});

            tplCfg = {
                size : size,
                pre : current !== 1,
                next : current !== pages,
                options : [],
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

            if(util.isArray(this.pageDefault.sizeOptions)){
                for(var i = 0, op = this.pageDefault.sizeOptions; i<op.length; i++){
                    tplCfg.options.push({num : op[i], selected : size === op[i]});
                }
            }

            return tplCfg;
        },
        error :function(){
            this.show(false);
        },
        render : function(data){
            data = data.paging;
            var root = this.rootNode;
            root.innerHTML = util.parseTpl(this.pageTpl, this.prepareTplConfig(data));
            util.removeClass(root, this.hideClass);

            this.registerEvents();
        }

    }).inherits(cellula.Cell);
})(Cellula);