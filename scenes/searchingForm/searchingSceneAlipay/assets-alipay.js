/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */
var searchingSceneAssets = searchingSceneAssets || {};
searchingSceneAssets.pagingTplStyles = [
    '<a class="mi-paging-prev" href="#">上一页</a>'
        +'$-{#items}<a class="mi-paging-item$-{#currentClass} mi-paging-current$-{/currentClass}" href="#"><span>$-{num}</span></a>$-{/items}'
        +'$-{#ellipsis}<span class="mi-paging-ellipsis">...</span>$-{/ellipsis}'
        +'$-{#totalShow}<a class="mi-paging-item" href="#"><span>$-{totalPages}</span></a>$-{/totalShow}'
        +'<a class="mi-paging-next" href="#">下一页</a>'
        +'<span class="mi-paging-info fn-ml0"><span class="mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
        +'<span class="mi-paging-info mi-paging-which">'
        +'<input id="J_pageNumber" type="text" value="" name="pageNumber">'
        +'</span>'
        +'<a href="#" class="mi-paging-info mi-paging-goto"><span>跳转</span></a>',

    '<a class="mi-paging-prev" href="#">上一页</a>'
        +'<span class="mi-paging-info">第<span class="mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
        +'<a class="mi-paging-next" href="#">下一页</a>',

    '<a class="mi-paging-first" href="#">首页</a>'
        +'<a class="mi-paging-prev" href="#">上一页</a>'
        +'<span class="mi-paging-info">$-{startItem} - $-{endItem}条，共$-{totalItems}条</span>'
        +'<a class="mi-paging-next" href="#">下一页</a>'
        +'<a class="mi-paging-last" href="#">尾页</a>',

    '<div class="mi-paging fn-right">'
        +'<a class="mi-paging-prev" href="#">上一页</a>'
        +'$-{#items}<a class="mi-paging-item$-{#currentClass} mi-paging-current$-{/currentClass}" href="#"><span>$-{num}</span></a>$-{/items}'
        +'$-{#ellipsis}<span class="mi-paging-ellipsis">...</span>$-{/ellipsis}'
        +'$-{#totalShow}<a class="mi-paging-item" href="#"><span>$-{totalPages}</span></a>$-{/totalShow}'
        +'<a class="mi-paging-next" href="#">下一页</a>'
        +'<span class="mi-paging-info fn-ml0"><span class="mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
        +'<span class="mi-paging-info mi-paging-which"><input id="J_number" type="text" value="" name="number"></span>'
        +'<a href="#" class="mi-paging-info mi-paging-goto"><span>跳转</span></a>'
    +'</div>'
    +'<div class="page-info-box">'
        +'共$-{totalItems}条记录，共$-{totalPages}页，当前显示$-{startItem}-$-{endItem}条，每页'
        +'<select name="size" id="J_size">'
            +'$-{#options}<option $-{#selected}selected $-{/selected}value="$-{num}">$-{num}条</option>$-{/options}'
        +'</select>'
    +'</div>',

    '<div class="mi-paging fn-right">'
        +'$-{#pre}<a class="mi-paging-prev" href="#">上一页</a>$-{/pre}'
        +'<span class="mi-paging-info">第<span class="mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
        +'$-{#next}<a class="mi-paging-next" href="#">下一页</a>$-{/next}'
        +'<span class="mi-paging-info fn-ml0"><span class="mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>'
        +'<span class="mi-paging-info mi-paging-which"><input id="J_number" type="text" value="" name="number"></span>'
        +'<a href="#" class="mi-paging-info mi-paging-goto"><span>跳转</span></a>'
    +'</div>'
    + '<div class="page-info-box">'
        + '共$-{totalItems}条记录，共$-{totalPages}页，当前显示$-{startItem}-$-{endItem}条，每页'
        + '<select name="size" id="J_size">'
        + '$-{#options}<option $-{#selected}selected $-{/selected}value="$-{num}">$-{num}条</option>$-{/options}'
        + '</select>'
    + '</div>'
];

searchingSceneAssets.tableTplStyles = [
    '$-{#rows}<tr$-{#spliter} class="mi-table-spliter"$-{/spliter}>'
        +'$-{#items}<td$-{#red} class="red"$-{/red}>'
        +'$-{content}'
        +'$-{#operate}'
        +'$-{#detail}<a href="$-{detailUrl}">$-{detail}</a>$-{/detail}'
        +'$-{#refund}  <a href="$-{refundUrl}">$-{refund}</a>$-{/refund}</a>'
        +'$-{/operate}'
        +'</td>$-{/items}'
        +'</tr>$-{/rows}',
        //+'$-{#operate}<td>$-{#detail}<a href="$-{detailUrl}">$-{detail}</a>$-{/detail}$-{#refund}  <a href="$-{refundUrl}">$-{refund}</a>$-{/refund}</td>$-{/operate}'
    '<tr>$-{#head}<th>$-{content}</th>$-{/head}</tr>',

    '$-{#rows}<tr>' +
        '<td class="ft-right">$-{title}</td>' +
        '<td>$-{content}</td>' +
        '</tr>$-{/rows}'
];
