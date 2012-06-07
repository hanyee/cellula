(function(){
    /** 批量给按钮注册事件, 将链接的outline, input的outline去掉  */
    var buttons = $$(".ui-button");
    A(buttons).each(function(button){
        var buttonClassName = button.attr("className"), buttonType = "", buttonInputs = $$("input,button", button);
        buttonClassName.replace(/ui-button-(\w+)/ig, function(className, type){buttonType = type;});
        E.on(button, "mouseover", function(){
            if(!button.hasClass("ui-button-" + buttonType + "-disabled")){
                button.addClass("ui-button-" + buttonType + "-hover");
            }
        });
        E.on(button, "mouseout", function(){
            if(!button.hasClass("ui-button-" + buttonType + "-disabled")){
                button.removeClass("ui-button-" + buttonType + "-hover");
            }
        });
        if(button.attr("tagName") == "A"){
            E.on(button, "focus", function(){
                button.node.blur();
            })
        }
        A(buttonInputs).each(function(buttonInupt){
            E.on(buttonInupt, "focus", function(){
                buttonInupt.node.blur();
            })
        });
    });
})();