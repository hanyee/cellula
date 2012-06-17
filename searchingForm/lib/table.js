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
    tableTpl : '',
    getRootNode : function(rootStyle){
        return this._super(rootStyle, 'data tables');
    },
    init : function(cfg){
        this.initCfg(cfg);
        this.registerEvents();
    },
    prepareTplConfig : function(data){
        var tpl = '',
            rows = data.rows;
        if(UtilTools.isArray(rows)){
        }
        return tpl;
    },
    render : function(data){
        var root = this.getRootNode('ui-table'),
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
}).inherits(SearchModuleBase);
