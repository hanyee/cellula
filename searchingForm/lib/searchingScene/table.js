/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:55
 * To change this template use File | Settings | File Templates.
 */
(function(util){
    this.DataTable = new Class('DataTable', {
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
            if(util.isArray(rows)){
            }
            return tpl;
        },
        render : function(data){
            data = data.dataTable;
            var root = this.getRootNode('ui-table'),
                table = root.getElementsByTagName('table')[0],
                tbody = table.getElementsByTagName('tbody')[0],
                tpl = '';
            if(tbody) table.removeChild(tbody);

            if(util.isEmptyObject(data)){
                util.addClass(root, this.hideClass);
            }else{
                var div = document.createElement('div');
                div.innerHTML = '<table><tbody>'+util.parseTpl(this.tableTpl, data)+'</tbody></table>';
                tbody = div.getElementsByTagName('tbody')[0];
                table.appendChild(tbody);
                this.registerEvents();
                util.removeClass(root, this.hideClass);
            }
        }

    }).inherits(Cellula.Block);
})(Cellula._util);
