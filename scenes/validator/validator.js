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
    var EL = new Class('EL',{
        save:function(){
            return this.set({value : util.map(this.get('inputs'), function(val){ return val.input.value;})});
        },
        validate:function(data){
            if(util.isArray(data.value)){
                var rules = this.get('rules'), isValid, items = data.inputs;
                util.each(items, function(val){
                    isValid = false;
                    var itemRules = val.rules, value = val.input.value;
                    util.each(itemRules, function(rule){
                        if((!data.required && util.isEmpty(value)) || rules[rule] && rules[rule].test(value)) isValid = true;
                    });

                    if(!isValid) return util.breaker;
                },null,util.breaker);
            } else isValid = true;

            console.log(isValid);
            return isValid?undefined:data.desc;
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

            // configuration - object
            // {key:'',conf:{},items:{}}
            if(util.isObject(conf)) _conf = conf;

            this._super(_conf);

            // get form node
            if(this.rootNode.tagName === 'FORM') this.form = this.rootNode;
            else this.form = this.rootNode.getElementsByTagName('form')[0];
            if(! (this.form && this.form.getElementsByTagName)) throw new Error('validator configuration error!');

            // create elements
            if(util.isEmpty(_conf.rules)){
                this.createElements(util.getElementsByClassName(this.conf.itemClass, this.form));
            }else{}

            this._bindAll('submit');

            this.registerEvents();
        },
        createElements:function(items){ // nodeType || nodeName
            util.each(util.slice.call(items), function(v, i){
                var conf = util.trim(v.getAttribute('data-validator')), confItem, inputs = [], explain, required, blur, desc = '', rules = [], _this = this;

                // read dom conf info
                if(conf && (conf = conf.split(' '))){
                    while(confItem = conf.shift()){
                        if(/^desc:/.test(confItem)) {
                            desc = confItem.split(':')[1] || desc;
                            break;
                        }
                        switch (confItem){
                            case 'required':
                                required = true;
                                break;
                            case 'blur':
                                blur = true;
                                break;
                            default : // rules to validate
                                rules.push(confItem);
                        }
                    }

                    util.each(['input','select'], function(tag){
                        // read input node's config to override the parent's
                        var items = util.slice.call(v.getElementsByTagName(tag));
                        items.length && (inputs = util.map(items, function(val){
                            var innerConf = util.trim(val.getAttribute('data-validator'));
                            if(innerConf && (innerConf = innerConf.split(' '))) rules = innerConf;
                            return {input:val,rules:rules};
                        }));
                    });

                    // create element
                    var e = new EL({key:inputs[0] ? inputs[0].input.id : null})
                        .set({item:v, inputs:inputs, explain:util.getElementsByClassName(this.conf.explain, v)[0], required:required, blur:blur, rules:this.conf.rules, desc:desc});

                    this.items[e.key] = e;

                    // put blur required to blur list
                    blur && (this.blurItems[e.key] = e);
                    console.log(this.items);
                }
            }, this);
        },
        submit:function(e){
            // prevent form submit
            e.preventDefault();
            var isValid = true;

            util.each(this.items, function(v){
                var inputs = v.get('inputs');
                isValid = this.validate(v) && isValid;
                // stop or continue to validate the rest?
                // if(!isValid) return util.breaker;
            }, this, util.breaker);

            if(isValid && this.define() == undefined) this.form.submit();

        },
        config:function(conf){
            if(util.isObject(conf)) this.conf = util.mix(this.conf, conf);
            return this;
        },
        registerEvents:function(){
            var _this = this;
            // handle form submit event
            this.form.onsubmit = this.submit;
            //this.form.addEventListener('onsubmit',this.submit,false);

            // handle elements

            // blur
            util.each(this.blurItems, function(v){
                var inputs = v.get('inputs');
                util.each(inputs, function (val) {
                    val.input.onblur = function () { _this.validate(v);};
                });
            });


        },
        define:function(){
            alert('im define');
            //return true;
        },
        clear:function(item){},
        showExplain:function(){},
        validate:function(item){
            var isValid, itemDom = item.get('item'), explain = item.get('explain'), hide = this.conf.hide, itemError=this.conf.itemError;
            // clear
            //explain.innerHTML = '';
            util.removeClass(itemDom, itemError);
            util.addClass(explain, hide);

            if(item.save() != item){
                // showExplain
                util.addClass(itemDom, itemError);
                explain.innerHTML = item.get('desc') || explain.innerHTML;
                util.removeClass(explain, hide);
            } else isValid = true;

            return isValid;
        }
    }).inherits(Cellula.Cell);

    c.Validator = Validator;

    var forms = util.slice.call(document.getElementsByTagName('form'));
    __cellula_validator_forms__ = [];
    util.each(forms, function(v){
        var conf = util.trim(v.getAttribute('data-validator'));
        if(v.id && conf && /auto/.test(conf)) __cellula_validator_forms__.push(new Validator(v.id));
    });

})(Cellula);
