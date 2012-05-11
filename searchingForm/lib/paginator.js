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
        number: {}
    },
    paginate : function(){
        console.log('paginate');
        this.save();
        console.log(this.getData());

        this.applyInterface('search', this.getData());

    },
    getDefault : function(){
        return this.pageDefault;
    },
    init : function(cfg){
        this.initCfg(cfg);

        this.bindAll('changeSize', 'paginate');

        this.registerEvents();
    },
    changeSize : function(){
        this.save();
        console.log('change');
        console.log(this.getData());
        // TODO:
        // mix this.getData() && this.pageDefault.number
        //this.applyInterface('search', mixed data);
    }
}).inherits(SearchModuleBase);
