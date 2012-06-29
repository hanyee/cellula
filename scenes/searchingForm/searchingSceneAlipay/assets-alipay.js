/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-6-27
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */
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
