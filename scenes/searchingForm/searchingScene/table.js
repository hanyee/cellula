/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午2:55
 * To change this template use File | Settings | File Templates.
 */
(function(cellula){
    var util = cellula._util;
    this.DataTable = new cellula.Class('DataTable', {
        tableTpl : {head : null, body : null},
        tips : {
            noResult : null,
            error : null
        },
        tipNodes : {},
        initTip : function(){
            for(var n in this.tips){
                this.tipNodes[n] = this.getNode(this.tips[n]);
            }
        },
        init : function(cfg){
            this._super(cfg);
            this.initTip();
            //this.registerEvents();
        },
        prepareTplConfig : function(data){},
        error : function(){
            this.show(false);
            util.removeClass(this.tipNodes.error, this.hideClass);
        },
        showNoResult : function(){
            this.show(false);
            this.applyInterface('error');
            util.removeClass(this.tipNodes.noResult, this.hideClass);
        },
        render : function(data){
            util.addClass(this.tipNodes.error, this.hideClass);
            util.addClass(this.tipNodes.noResult, this.hideClass);
            var root = this.rootNode;

            if(data.dataTable.rows.length === 0){
                //this.show(false);
                //this.applyInterface('error');
                //util.removeClass(this.tipNodes.noResult, this.hideClass);
                this.showNoResult();
                return ;
            }
            data = data.dataTable;
            var table = root.getElementsByTagName('table')[0],
                thead = table.getElementsByTagName('thead')[0],
                tbody = table.getElementsByTagName('tbody')[0],
                tpl = '';

            if(thead) table.removeChild(thead);
            if(tbody) table.removeChild(tbody);

            var div = document.createElement('div');
            div.innerHTML = '<table><thead>' + util.parseTpl(this.tableTpl.head, data) + '</thead></table>';
            thead = div.getElementsByTagName('thead')[0];
            table.appendChild(thead);

            div.innerHTML = '<table><tbody>' + util.parseTpl(this.tableTpl.body, data) + '</tbody></table>';
            tbody = div.getElementsByTagName('tbody')[0];
            table.appendChild(tbody);

            //util.removeClass(root, this.hideClass);
            this.show(true);

            this.registerEvents();
        }

    }).inherits(cellula.Cell);
})(Cellula);
