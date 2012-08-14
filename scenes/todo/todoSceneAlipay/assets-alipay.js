/**
 * Created by JetBrains WebStorm.
 * User: hanyee
 * Date: 12-7-5
 * Time: 下午4:12
 * To change this template use File | Settings | File Templates.
 */

var todoSceneAssets = todoSceneAssets || {};

todoSceneAssets.todoItemTpl = '<li id="$-{id}" class="number">'
    + '<div class="number-cnt">'
    + '<input id="$-{mobileNumber}" name="$-{mobileNumber}" class="mi-input mi-input-bigdigital fn-hide" type="text" value="" />'
    + '<span id="$-{mobileLabel}" class="phone-number fn-view"></span>'
    + '<span class="mi-form-text label">话费余额少于:</span>'
    + '<select id="$-{accountBalance}" name="$-{accountBalance}" class="fn-edit fm-data-minValue" >'
    + '<option value="20" selected>20.00元</option>'
    + '<option value="30">30.00元</option>'
    + '<option value="50">50.00元</option>'
    + '</select>'
    + '<span class="mi-form-text label">自动充值:</span>'
    + '<select id="$-{charges}" name="$-{charges}" class="fn-edit fm-data-amountValue" >'
    + '<option value="50" selected>50.00元</option>'
    + '<option value="100">100.00元</option>'
    + '<option value="300">300.00元</option>'
    + '</select>'
    + '<span class="mi-form-link">'
    + '<a href="javascript:;" class="mi-input-del" >删除</a>'
    + '</span>'
    + '</div>'
    + '<div class="mi-form-explain"></div>'
    + '</li>'
