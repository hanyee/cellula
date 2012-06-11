/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-4-28
 * Time: 下午4:46
 * To change this template use File | Settings | File Templates.
 */

var DataTable = new Class('DataTable', {
    tips : {
        noResult : null,
        error : null
    },
    getRootNode : function(rootStyle){
        return this._super(rootStyle, 'data tables');
    },
    init : function(){

        this.registerEvents();
    },
    render : function(){
        var root = this.getRootNode('ui-table');
        var table = root.getElementsByTagName('table');

    }
}).inherits(SearchModuleBase);
