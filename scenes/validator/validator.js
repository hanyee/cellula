(function(c){
    var validatorRules = {
        /**
         * 设置电子邮件校验规则
         * @private
         */
        email:/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        /**
         * 设置电话号码校验规则
         * @private
         */
        cnPhone:/^(\d{3,4}-)\d{7,8}(-\d{1,6})?$/,
        /**
         * 设置手机号码校验规则
         * @private
         */
        mobile:/^1[3458]\d{9}$/,
        cnMobile:/^1\d{10}$/, //for Compatible
        /**
         * 设置日期校验规则
         * @private
         */
        date:/^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/,
        /**
         * 设置字符型校验规则
         * @private
         */
        string:/\d$/,
        /**
         * 设置整数型校验规则
         * @private
         */
        integer:/^[1-9][0-9]*$/,
        /**
         * 设置数值型校验规则
         * @private
         */
        number:/^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/,
        /**
         * 手机校验码
         * @private
         */
        sms:/^[0-9]{6}$/,
        /**
         * 设置数值型校验规则
         * @private
         */
        numberWithZero:/^[0-9]+$/,
        /**
         * 金额
         * @private
         */
        money:/^\d+(\.\d{0,2})?$/,
        /**
         * 设置英文校验规则，检测是否只有英文
         * @private
         */
        alpha:/^[a-zA-Z]+$/,
        /**
         * 检测字符串中是否含有英文字母或者数字
         * @private
         */
        alphaNum:/^[a-zA-Z0-9_]+$/,
        /**
         * 支持字母数字-_
         * @private
         */
        betaNum:/^[a-zA-Z0-9-_]+$/,
        /**
         * 身份证
         * @private
         */
        cnID:/^\d{15}$|^\d{17}[0-9a-zA-Z]$/,
        /**
         * 设置url校验规则
         * @private
         */
        urls:/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        /**
         * url 不带http或者https
         */
        url:/^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        /**
         * 设置中文校验规则
         */
        chinese:/^[\u2E80-\uFE4F]+$/,
        /**
         * 设置邮政编码校验规则
         */
        postal:/^[0-9]{6}$/,
        /**
         * 月历
         */
        mutiYYYMM:/(20[0-1][0-9]((0[1-9])|(1[0-2]))[\,]?)+$/,
        /**
         * 银行账户名类型
         */
        bankName:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
        /**
         * 支付宝账户真实姓名
         */
        name:/^([\u4e00-\u9fa5|A-Z|\s]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5|A-Z|\s]|\u3007)+$/,
        realName:/^([\u4e00-\u9fa5|a-zA-Z|\s]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5|a-zA-Z|\s]|\u3007)+$/
    };

    var util = c._util, Class = c.Class;
    //var EL = c.Element;
    var EL = new Class('EL', {
        init:function(conf){
            this._super(conf);
            // `validate` aop
            if(util.isFunction(this.before)) util.aspect(this).before('validate', this.before, this);
        },
        save:function(input){
            // value : [input1,input2...]
            return input ? this.set({value:[input]}) : this.set({value:this.get('inputs')});
        },
        before:undefined,
        validate:function(data){
            function validate(rule, item){
                return util.isFunction(rule) ? rule(item) : (rule && rule.test(item.input.value));
            }
            var items = data.value, desc = data.desc;
            if(util.isArray(items)){
                var rules = this.get('rules'), isValid;
                util.each(items, function(val){
                    isValid = false;
                    var value = val.input.value || val.input.checked;
                    util.each(val.rules, function(rule){
                        if( (!val.required && util.isEmpty(util.trim(value))) || validate(rules[rule], val) ) isValid = true;
                        else desc = val.desc;
                    });

                    if(!isValid) return util.breaker;
                }, null, util.breaker);
            } else isValid = true;

            util.log(isValid);
            return isValid ? undefined : desc;
        }
    }).inherits(c.Element);

    // dom config "required" "blur" "[rule types]"
    var Validator = new Class('Validator', {
        conf:{
            itemClass:'ui-form-item',
            itemError:'ui-form-item-error',
            hide:'fn-hide',
            explain:'ui-form-explain',
            attribute:'data-validator',
            rules:validatorRules
        },
        items:{},
        blurItems:{},
        form:undefined,
        init:function(conf){
            var _conf = {};
            // id - string
            if(util.isString(conf)) _conf.key = conf;

            if(util.isObject(conf)) _conf = conf;

            if(util.isEmpty(_conf)) return util.error('Validator initialization failed!');

            // conf
            if(util.isObject(_conf.conf)) {
                if(util.isObject(_conf.conf.rules)) util.mix(this.conf.rules, _conf.conf.rules) && (delete _conf.conf.rules);
                util.mix(this.conf, _conf.conf);
            }
            delete _conf.conf;

            // items
            var itemsConf = _conf.items;
            delete _conf.items;

            this._super(_conf);

            // get form node
            if(this.rootNode.tagName === 'FORM') this.form = this.rootNode;
            else this.form = this.rootNode.getElementsByTagName('form')[0];
            if(! (this.form && this.form.getElementsByTagName)) throw new Error('validator configuration error!');

            // create elements
            this._createElements(util.getElementsByClassName(this.conf.itemClass, this.form), itemsConf);

            this._bindAll('submit');
            this.registerEvents();
        },
        addItem:function(item){
            if(!item) return;
            if(!util.isArray(item) && !util.isNodeList(item)) item = [item];
            this._createElements(item);
            this.bindBlur();
            return this;
        },
        _parseDomConf:function(conf, options){
            // key word is[required, blur, desc]
            var confItem;
            while(confItem = conf.shift()){
                if(/^desc:/.test(confItem)) {
                    options.desc = confItem.split(':')[1] || options.desc;
                    continue;
                }
                if(/^default:/.test(confItem)) {
                    console.log(options);
                    options.default = confItem.split(':')[1] || options.default;
                    continue;
                }
                switch (confItem){
                    case 'required':
                        options.required = true;
                        break;
                    case 'blur':
                        options.blur = true;
                        break;
                    default : // rules to validate  this.conf.rules
                        if(this.conf.rules[confItem]) options.rules[confItem] = confItem;
                }
            }
        },
        _createElements:function(items, itemsConf){
            function createOption (){
                return {required:null, blur:null, rules:{}, desc:'', default:'' ,list:null}; // input
            }
            if(!util.isArray(items)) items = util.toArrayByLen(items);
            util.each(items, function(v){
                // v is an item
                var attrValue = this.conf.attribute, conf = util.trim(v.getAttribute(attrValue)), inputs = [], _this = this, _blurItems = [], key, opt;
                var options = createOption(), explain;
                // read dom conf info
                if(conf && (conf = conf.split(' '))){
                    this._parseDomConf(conf, options);

                    util.each(['input','select'], function(tag){
                        // read input nodes' config to override the parent's
                        var itemNodes = util.toArrayByLen(v.getElementsByTagName(tag));
                        itemNodes.length && (inputs = util.map(itemNodes, function(itemNode){
                            var innerConf = util.trim(itemNode.getAttribute(attrValue));
                            var itemOption;
                            if(innerConf && (innerConf = innerConf.split(' '))){
                                itemOption = util.copy(options);
                                itemOption.rules = util.copy(options.rules);
                                _this._parseDomConf(innerConf, itemOption);
                                itemOption.input = itemNode;
                            }
                            itemOption = itemOption || util.mix({input:itemNode}, options);
                            // put blur required to blur list
                            itemOption.blur && _blurItems.push(itemOption);
                            return itemOption;
                        }));
                    });

                    // assign list
                    util.each(inputs, function(val){ val.list = inputs;});

                    // create element
                    key = v.id || (inputs[0] ? (inputs[0].input.id || inputs[0].input.name) : null);
                    explain = util.getElementsByClassName(this.conf.explain, v)[0];
                    opt = {key : key, _data:{
                        item:v,
                        inputs:inputs,
                        explain:explain,
                        rules:this.conf.rules,
                        default:options.default || (explain ? explain.innerHTML : ' '),
                        desc:options.desc || ' '  // read parent config by default
                    }};

                    // runtime conf
                    if(itemsConf && itemsConf[key]){
                        util.each(['validate','before'], function(name){
                            if(util.isFunction(itemsConf[key][name])) opt[name] = itemsConf[key][name];
                        });
                    }

                    var e = new EL(opt);

                    if(this.items[key]) throw new Error('duplicated item keys!');
                    this.items[key] = e;

                    // put blur required to blur list
                    _blurItems.length && (this.blurItems[key] = _blurItems);

                    util.log(this.items);
                }
            }, this);
        },
        //beforeValidate beforeItemValidate
        submit:function(e){
            // prevent form submit
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            var isValid = true;

            util.each(this.items, function(v){
                var inputs = v.get('inputs');
                isValid = this.validate(v.key) && isValid;
                // stop or continue to validate the rest?
                // if(!isValid) return util.breaker;
            }, this, util.breaker);

            if(isValid && this.define() === undefined) this.form.submit();
        },
        config:function(conf){
            // TODO: conf.rules to be mixed
            if(util.isObject(conf)) this.conf = util.mix(this.conf, conf);
            return this;
        },
        bindBlur:function(){
            var _this = this;
            util.each(this.blurItems, function(arr, key){
                util.each(arr, function (val) {
                    val.input.onblur = function () { _this.validate(key, val);};
                });
            });
            // clear list
            this.blurItems = {};
        },
        registerEvents:function(){
            // handle form submit event
            this.form.onsubmit = this.submit;

            //if(this.form.addEventListener) this.form.addEventListener('submit', this.submit, true);
            // IE
            //if(this.form.attachEvent) this.form.attachEvent('onsubmit', this.submit);

            // handle elements

            // blur
            this.bindBlur();
        },
        define:function(){
            alert('im define');
            //return true;
        },
        //clear:function(item){},
        validate:function(key, input){
            var isValid, ret, item = this.items[key],
                itemDom = item.get('item'), explain = item.get('explain'),
                defaultDesc = item.get('default'), itemError=this.conf.itemError;
                //hide = this.conf.hide,

            // clear
            util.removeClass(itemDom, itemError);
            explain.innerHTML = defaultDesc;
            //util.addClass(explain, hide);

            if((ret = item.save(input)) != item){
                // showExplain
                util.addClass(itemDom, itemError);
                explain.innerHTML = ret || defaultDesc || explain.innerHTML;
                //util.removeClass(explain, hide);
            } else isValid = true;

            return isValid;
        }
    }).inherits(Cellula.Cell);

    c.Validator = Validator;


    // auto config
    __cellula_validator_forms__ = [];
    util.each(util.toArrayByLen(document.getElementsByTagName('form')), function(v){
        var conf = util.trim(v.getAttribute('data-validator'));
        if(v.id && conf && /auto/.test(conf)) __cellula_validator_forms__.push(new Validator(v.id));
    });

})(Cellula);