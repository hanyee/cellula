function Select(conf){
    this.config = conf || {};
    this.defaultWidth = this.config.width || 200;
    this.defaultText = this.config.defaultText || "";
    this.size = this.config.size || 10;
    this.itemHeight = this.config.itemHeight || 30;
    this.scrollBarWidth = 17;
    this.isOverFlow = false;
    this.timer = null;
    this.items = [];
    this.attrs = conf.attrs || [];
    this.tipAttr = conf.tipAttr || "";
    this.currentItem = null;
    this.borderWidth = this.config.borderWidth || 1;
    this.isDisabled = this.config.disabled || false;
    this.disabledClass = this.config.disabledClass ? " " + this.config.disabledClass : "";
    this.DOMClass = "ui-select" + (this.config.skin ? " " + this.config.skin : "") + (this.isDisabled ? this.disabledClass : "");
    var root = this;
    this.$ = function(a, b){
        a = typeof(a) == "string" ? document.getElementById(a) : a;
        return b ? a.getElementsByTagName(b) : a;
    };
    this.stopEvent = function(e){
        e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
        else {
            e.cancelBubble = true;
            e.returnValue = false;
        }
    };
    this.getDOM = function(tagName, attr){
        var o = document.createElement(tagName);
        if (attr && typeof attr == "object") {
            for (var key in attr) {
                if (key.toLowerCase() == "classname") {
                    o.className = attr[key];
                }
                else 
                    if (key.toLowerCase() == "text") {
                        o.innerHTML = attr[key];
                    }
                    else 
                        if (key.toLowerCase() == "attrs") {
                            for (var a in attr[key]) {
                                o.setAttribute(a, attr[key][a]);
                            }
                        }
                        else {
                            o.setAttribute(key, attr[key]);
                        }
            }
        }
        return o;
    };
    this.clearTimer = function(){
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    };
    
    this.setTimer = function(){
        this.timer = setTimeout(function(){
            root.toggle("none", "ui-select-value");
            root.clearValueEvent();
        }, this.config.delay_time || 500);
    };
    
    this.clearValueEvent = function(){
        if (this.value.onmouseout) {
            this.value.onmouseout = null;
        }
        if (this.value.onmouseover) {
            this.value.onmouseover = null;
        }
    };
    
    this.toggle = function(a, b){
        if(this.userList){
            this.userList.style.display = a;
        } else {
            this.list.style.display = a;
        }
        this.iframe.style.display = a;
        this.value.className = b;
    };
    
    this.setCurrent = function(o){
        if (root.currentItem && root.currentItem !== o) {
            root.currentItem.removeAttribute("is_current");
            if(root.currentItem.className.indexOf("ui-select-item-spliter") !== -1){
                root.currentItem.className = "ui-select-item-spliter";
            } else {
                root.currentItem.className = "";
            }
        }
        if (typeof o == "object") {
            root.currentItem = o;
        } else { 
            if (typeof o == "number") {
                root.currentItem = this.items[Math.max(0, Math.min(this.items.length - 1, o))];
            } else { 
                if (typeof o == "string") {
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].getAttribute("val") == o) {
                            root.currentItem = this.items[i];
                            break;
                        }
                    }
                }
            }
        }
        root.currentItem.setAttribute("is_current", "true");
        if(root.currentItem.className.indexOf("ui-select-item-spliter") !== -1){
            root.currentItem.className = "ui-select-item-spliter ui-select-item-current";
        } else {
            root.currentItem.className = "ui-select-item-current";
        }
        root.value.innerHTML = root.currentItem.innerHTML;
        if (root.tipAttr) {
            var tipText = root.currentItem.getAttribute(root.tipAttr);
            if (tipText) {
                root.value.setAttribute("title", tipText);
            }
            else {
                root.value.removeAttribute("title");
            }
        }
        
        for (var index in this.items) {
            if (root.currentItem == this.items[index]) {
                this.select.options.selectedIndex = index;
            }
        }
    };
    this.setLabel = function(_text){
        this.value.innerHTML = this.processValue ? this.processValue(_text) : _text;
    };
    
    this.add = function(item_conf, updateToSelect){
        var item = this.getDOM("li", item_conf), intCurrentWidth = this.isOverFlow ? ((this.config.width || this.defaultWidth) - 12 - (this.borderWidth * 2) - this.scrollBarWidth) : (this.config.width || this.defaultWidth) - 12 - (this.borderWidth * 2);
        item.style.width = intCurrentWidth + "px";
        item.style.height = this.itemHeight + "px";
        item.style.lineHeight = this.itemHeight + "px";
        this.items.push(item);
        this.list.appendChild(item);
        item.onmouseover = function(){
            root.clearTimer();
            if(this.className.indexOf("ui-select-item-spliter") !== -1){
                this.className = "ui-select-item-spliter ui-select-item-current";
            } else {
                this.className = "ui-select-item-current";
            }
        };
        item.onmouseout = function(){
            root.setTimer();
            if (root.currentItem) {
                if (root.currentItem !== this) {
                    if(this.className.indexOf("ui-select-item-spliter") !== -1){
                        this.className = "ui-select-item-spliter";
                    } else {
                        this.className = "";
                    }
                }
            }
            else {
                if(this.className.indexOf("ui-select-item-spliter") !== -1){
                    this.className = "ui-select-item-spliter";
                } else {
                    this.className = "";
                }
            }
        };
        item.onclick = function(e){
            root.clearTimer();
            root.toggle("none", "ui-select-value");
            root.clearValueEvent();
            root.stopEvent(e);
            if (root.currentItem) {

                if (root.currentItem !== this) {
                    root.setCurrent(this);
                    if (root.onChange) {
                        root.onChange.call(root);
                    }
                }
            }
            else {
                root.setCurrent(this);
                if (root.onChange) {
                    root.onChange.call(root);
                }
            }
            document.onclick = null;
        };
        if (updateToSelect) {
            var option = new Option(item_conf.text, item_conf.val);
            if (item_conf.attrs) {
                for (var attr in item_conf.attrs) {
                    option.setAttribute(attr, item_conf.attrs[attr]);
                }
            }
            this.select.appendChild(option);
        }
    };
    
    this.empty = function(){
        while (this.items.length) {
            var item = this.items.splice(0, 1);
            item.onmouseover = item.onmouseout = item.onclick = null;
            this.list.removeChild(this.list.firstChild);
        }
        while (this.select.firstChild) {
            this.select.removeChild(this.select.firstChild);
        }
        this.setLabel(this.defaultText);
        this.isOverFlow = false;
    };
    
    this.getValue = function(){
        if (this.currentItem) {
            return this.currentItem.getAttribute("val");
        } else {
            return null;
        }
    };
    this.getTipAttribute = function(o){
        if (this.tipAttr) {
            return o.getAttribute(this.tipAttr);
        }
        return null;
    };
    this.autoSize = function(arrData){
        if(arrData.length && arrData.length > this.size){
            this.isOverFlow = true;
        } else {
            this.isOverFlow = false;
            this.list.style.height = "auto";
        }
    };
    
    this.prepare = function(select){
        var opts = select.options, attrsLen = this.attrs.length;
        if(opts.length > this.size){
            this.isOverFlow = true;
            this.list.style.height = (this.itemHeight + 1) * this.size + "px";
            this.list.style.overflow = "auto";
        }
        for (var i = 0, l = opts.length; i < l; i++) {
            var nData = {
                val: opts[i].value,
                text: opts[i].text,
                className:i%2 === 1 ? "ui-select-item-spliter" : ""
            };
            if (attrsLen) {
                var attr = {}, tipText;
                for (var j = 0; j < attrsLen; j++) {
                    var nAttr = opts[i].getAttribute(this.attrs[j]);
                    if (nAttr) {
                        attr[this.attrs[j]] = nAttr;
                    }
                }
                tipText = this.getTipAttribute(opts[i]);
                if (tipText) {
                    attr['title'] = tipText;
                }
                nData['attrs'] = attr;
            }
            this.add(nData);
            if (opts[i].selected) {
                this.setCurrent(this.items[i]);
            }
        }
        if (this.config.defaultValue != null) {
            this.setCurrent(this.config.defaultValue);
        }
    };
    
    this.apply = function(select){
        if (typeof select == "string") {
            select = this.$(select);
        }
        this.select = select;
        this.prepare(this.select);
        this.select.parentNode.insertBefore(this.dom, this.select);
        this.select.style.display = "none";
        return this;
    };
    this.enabled = function(){
        this.isDisabled = false;
        this.dom.className = this.dom.className.replace(new RegExp(this.disabledClass, "ig"), "");
    };
    this.disabled = function(){
        this.isDisabled = true;
        this.dom.className = this.DOMClass;
    };
    this.addUserList = function(_userList){
        if(_userList && _userList.nodeType == 1){
            this.userList = _userList;
        }
        if(this.userList){
            this.dom.appendChild(this.userList);
        }
    };
    this.removeUserList = function(){
        if(this.userList){
            this.dom.removeChild(this.userList);
        }
    };
    this.hide = function(){
        this.toggle("none", "ui-select-value");
        this.clearTimer();
    };
    
    this.dom = this.getDOM("div", {
        className: this.DOMClass
    });
    this.iframe = this.getDOM("iframe", {src:"javascript:''", frameBorder:"0", scrolling:"no",className:"ui-select-iframe"});
    this.dom.style.zIndex = this.config.zIndex || 1;
    this.value = this.getDOM("div", {
        className: "ui-select-value",
        text: this.defaultText
    });
    this.list = this.getDOM("ul", {
        className: "ui-select-cnt fn-clear"
    });
    this.dom.style.width = this.value.style.width = this.list.style.width = (this.config.width || this.defaultWidth) - this.borderWidth * 2 + "px";
    this.iframe.style.width = parseInt(this.dom.style.width) + 2 + "px";
    this.list.style.left = (-1 * this.borderWidth) + "px";
    if(this.config.height){
        var _height = this.config.height;
        this.dom.style.height = this.dom.style.lineHeight = this.value.style.height = this.value.style.lineHeight = _height + "px";
        if(this.config.overlay){
            this.list.style.top = _height + "px";
        } else {
            this.list.style.top = _height + this.borderWidth + "px";
        }
    }

    this.dom.onmouseover = function(){
        root.clearTimer();
    };

    this.dom.onmouseout = function(e){
        var e = window.event || e, out = e.relatedTarget || e.toElement;
        while(out && out !== this){
            out = out.parentNode;
            if(!out){
                root.clearTimer();
                root.setTimer();
            }
        }
    };
    
    this.value.onclick = function(e){
        root.clearTimer();
        root.stopEvent(e);
        if(!root.isDisabled){
            var userList = root.list;
            if(root.userList){
                userList = root.userList;
                root.userList.style.display = root.userList.style.display == "block" ? "none" : "block";
            } else {
                root.list.style.display = root.list.style.display == "block" ? "none" : "block";
            }
            if(userList.style.display == "block"){
                root.iframe.style.height = userList.offsetHeight + "px";
                root.iframe.style.display = "block";
            } else {
                root.iframe.style.display = "none";
            }

            document.onclick = function(e){
                root.hide();
            }
            if (Select.current && Select.current !== root) {
                Select.current.toggle("none", "ui-select-value");
                Select.current.clearTimer();
            }
            Select.current = root;
            if (root.onShow) {
                root.onShow.call(root);
            }
        }
    };
    
    this.dom.appendChild(this.value);
    if(this.config.hideList && this.config.hideList === true){
        
    } else {
        var userList = this.list;
        if(this.config.useLayer){
            this.userList = (this.config.list && this.config.list.nodeType == 1) ? this.config.list : null;
            if(this.userList){
                userList = this.userList;
                this.addUserList();
            }
        } else {
            this.dom.appendChild(this.list);
        }
        this.dom.insertBefore(this.iframe, userList);
    }
}