function Tab(a, b, c){
    this.focus = null;
    this.currentIndex = 0;
    this.config = c || {};
    this.activeTriggerClass = this.config.activeTriggerClass || "current";
    this.activeTriggerHoverClass = this.config.activeTriggerHoverClass || "current";
    this.activeViewClass = this.config.activeViewClass || "current";
    this.triggerEvent = this.config.triggerEvent || "onmouseover";
    this.items = this.getItems(a, this.config.ITag = this.config.ITag || "LI");
    this.contents = this.getItems(b, this.config.CTag || "DIV");
    this.onSwitch = this.config.onSwitch || function(){};
    this.sameClick = this.config.sameClick || function(){};
    this.create();
};
Tab.prototype = {
    $: function(a, b){
        a = typeof(a) == "string" ? document.getElementById(a) : a;
        return b ? a.getElementsByTagName(b) : a;
    },
    getItems: function(a, b){
        var p = this.$(a), contents = [];
        for (var i = 0, len = p.childNodes.length; i < len; i++) {
            var cNode = p.childNodes[i];
            if (cNode.nodeType == 1 && cNode.tagName.toLowerCase() == b.toLowerCase()) {
                contents.push(cNode);
            }
        }
        return contents;
    },
    create: function(){
        var _this = this;
        for (var i = 0, len = this.items.length; i < len; i++) {
            this.items[i].bc = this.contents[i];
            this.items[i].index = i;
            if(this.triggerEvent !== "onmouseover"){
                this.items[i]["onmouseover"] = function(e){
                    if(!_this.hasClass(this, _this.activeTriggerHoverClass) && !_this.hasClass(this, _this.activeTriggerClass)){
                        _this.addClass(this, _this.activeTriggerHoverClass);
                    }
                };
                this.items[i]["onmouseout"] = function(e){
                    if(_this.hasClass(this, _this.activeTriggerHoverClass)){
                        _this.removeClass(this, _this.activeTriggerHoverClass);
                    }
                };
            }
            this.items[i][this.triggerEvent] = function(e){
                if(_this.config.ITag.toLowerCase() == "a"){
                    var e = e || window.event;
                    if(e.preventDefault){
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }

                if(this.index === _this.currentIndex){
                    if(_this.focus && _this.hasClass(_this.focus, _this.activeTriggerClass)){
                        _this.sameClick.call(_this);
                    } else {
                        _this.setFocus(this.index);
                    }
                } else {
                    _this.setFocus(this.index);
                }
            };
        }
        if(this.config.defaultShow){
            this.setFocus(0);
        }
    },
    hasClass: function(o, c_name){
        return !c_name || (' ' + o.className + ' ').indexOf(' ' + c_name + ' ') != -1;
    },
    addClass: function(o, c_name){
        if (!this.hasClass(o, c_name)) {
            var nc = o.className.replace(/^\s+|\s+$/g, "").split(" ");
            nc.push(c_name);
            o.className = nc.join(" ");
        }
    },
    removeClass: function(o, c_name){
        var classNames = o.className.split(" ");
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] == c_name) {
                classNames.splice(i, 1);
            }
        }
        o.className = classNames.join(" ");
    },
    show: function(o, state){
        if (state == "none") {
            this.removeClass(o, this.activeTriggerClass);
            this.removeClass(o.bc, this.activeViewClass);
        }
        else {
            this.addClass(o, this.activeTriggerClass);
            this.addClass(o.bc, this.activeViewClass);
        }
    },
    lastIndex: function(){
        return this.items.length - 1;
    },
    setFocus: function(index){
        this.currentIndex = (index < 0 ? (this.items.length - 1) : index) % this.items.length;
        var current_item = this.items[this.currentIndex];
        if (this.focus && current_item !== this.focus) {
            this.show(this.focus, "none");
        }
        this.focus = current_item;
        this.show(this.focus);
        if (this.onSwitch) {
            this.onSwitch.call(this);
        }
    }
}