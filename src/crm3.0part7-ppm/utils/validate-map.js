const validMap = {
    empty: function (str, trigger) {
        //非空
        return { name: 'empty', required: true, validator: validOrder.validEmpty, message: `${str}值不能为空` };
    },
    email: function (str, trigger) {
        //邮件
        return { name: 'email', validator: validOrder.validEmail, message: `${str}请输入正确的邮箱格式`, trigger };
    },
    number: function (str, trigger) {
        //数字
        return { name: 'number', validator: validOrder.validNumber, message: `${str}必须为数字格式`, trigger };
    },
    intFloat: function (str, trigger) {
        // 验证整数和小数
        return { name: 'intFloat', validator: validOrder.validIntFloat, message: `${str}必须为数字格式`, trigger };
    },
    integer: function (str, trigger) {
        //整数
        return { name: 'integer', validator: validOrder.validInteger, message: `${str}要求为整数格式`, trigger };
    },
    pinteger: function (str, trigger) {
        //正整数
        return { name: 'pinteger', validator: validOrder.validPinteger, message: `${str}要求为正整数格式`, trigger };
    },
    pintegerAnd0: function (str, trigger) {
        //正整数
        return { name: 'pinteger', validator: validOrder.validPintegerand0, message: `${str}要求为正整数格式`, trigger };
    },
    pintegerAnd1: function (str, trigger) {
        //大于等于1的正整数格式正整数
        return { name: 'pinteger', validator: validOrder.validPinteger1, message: `${str}要求为大于等于1的正整数格式`, trigger };
    },
    pintegerLimit30: function (str, trigger) {
        //大于等于1的正整数格式正整数
        return { name: 'pinteger', validator: validOrder.validPintegerLimit30, trigger };
    },
    pintegerLimit15: function (str, trigger) {
        //大于等于1的正整数格式正整数
        return { name: 'pinteger', validator: validOrder.validPintegerLimit15, trigger };
    },
    pinteger1To10: function (str, trigger) {
        //1~10之间的正整数
        return { name: 'pinteger1To10', validator: validOrder.validPinteger1To10, message: `${str}只能填写1~10之间的正整数`, trigger };
    },
    phone: function (str, trigger) {
        //电话(固话)网上自己找的
        return { name: 'phone', validator: validOrder.validPhone, message: `${str}格式错误,请填写正确号码`, trigger };
    },
    mobile: function (str, trigger) {
        //手机号码
        return { name: 'mobile', validator: validOrder.validMobile, message: `${str}格式错误,请填写正确手机号码`, trigger };
    },
    dxPhone: function (str, trigger) {
        //手机号或者固话
        return { name: 'mobile', validator: validOrder.validDxMobile, trigger };
    },
    otnphone: function (str, trigger) {
        //OTN手机号或者固话
        return { name: 'otnphone', validator: validOrder.validotnMobile, trigger };
    },

    custMobile: function (str, trigger) {
        //手机号码
        return { name: 'custMobile', validator: validOrder.validCustMobile, message: `${str}格式错误,请填写正确手机号码`, trigger };
    },
    double: function (str, trigger) {
        //小数
        return { name: 'double', validator: validOrder.validDouble, message: `${str}要求为小数格式`, trigger };
    },
    doubleTwo: function (str, trigger) {
        //小数
        return { name: 'double', validator: validOrder.validDoubleTwo, message: `${str}要求为数字,最多保留两位小数`, trigger };
    },
    towDecDouble: function (str, trigger) {
        //小数
        return { name: 'towDecDouble', validator: validOrder.validTowDecDouble, message: `${str}应为不能超过2位小数的正数`, trigger };
    },
    oneDecDouble: function (str, trigger) {
        //小数
        return { name: 'oneDecDouble', validator: validOrder.validOneDecDouble, message: `${str}应为不能超过1位小数的正数`, trigger };
    },
    towLittleNumber: function (str, trigger) {
        //两位小数
        return { name: 'towLittleNumber', validator: validOrder.validTowLittleNumber, message: `${str}应为不能超过2位小数的数值`, trigger };
    },
    littleNumber: function (str, trigger) {
        //数字或者小数
        return { name: 'littleNumber', validator: validOrder.validLittleNumber, message: `${str}应为数值`, trigger };
    },
    fourDecDouble: function (str, trigger) {
        //4为小数的正实数
        return { name: 'fourDecDouble', validator: validOrder.validFourDecDouble, message: `${str}应为不能超过4位小数的正数`, trigger };
    },
    //5G双域快网新产品-lb 2023年11月20日add
    fourZeroDecDouble: function (str, trigger) {
        //4为小数的正实数
        return { name: 'fourDecDouble', validator: validOrder.validZeroFourDouble, message: `${str}应为0或不能超过4位小数的正数`, trigger };
    },
    fourDouble: function (str, trigger) {
        //4为小数的数字
        return { name: 'fourDouble', validator: validOrder.validFourDouble, message: `${str}应为不能超过4位小数的正数或负数`, trigger };
    },
    english: function (str, trigger) {
        //英文
        return { name: 'english', validator: validOrder.validEnglish, message: `${str}要求为纯英文字母`, trigger };
    },
    chinese: function (str, trigger) {
        //中文
        return { name: 'chinese', validator: validOrder.validChinese, message: `${str}请填写中文格式`, trigger };
    },
    qq: function (str, trigger) {
        //QQ号码
        return { name: 'qq', validator: validOrder.validQQ, message: `${str}请填写正确的QQ号码`, trigger };
    },
    zip: function (str, trigger) {
        //邮编
        return { name: 'zip', validator: validOrder.validZip, message: `${str}请填写正确的邮编格式`, trigger };
    },
    IPTlength: function (str, trigger) {
        //长度
        return { name: 'IPTlength', validator: validOrder.validIPTlength, message: `${str}字数请在20字以内`, trigger };
    },
    StringLength1000: function (str, trigger) {
        //长度不超过1000个字符
        return { name: 'StringLength1000', validator: validOrder.validStringLength1000, message: `${str}字数请在1000字以内`, trigger };
    },
    StringLength50: function (str, trigger) {
        //长度不超过50个字符
        return { name: 'StringLength50', validator: validOrder.validStringLength50, message: `${str}请在50字符以内`, trigger };
    },
    StringLength32: function (str, trigger) {
        //长度不超过32个字符
        return { name: 'StringLength32', validator: validOrder.validStringLength32, message: `${str}请在32字符以内`, trigger };
    },
    StringLength40: function (str, trigger) {
        //长度不超过40个字符
        return { name: 'StringLength40', validator: validOrder.validStringLength40, message: `${str}请在40字符以内`, trigger };
    },
    StringLength200: function (str, trigger) {
        //长度不超过50个字符
        return { name: 'StringLength200', validator: validOrder.validStringLength200, message: `${str}请在200字符以内`, trigger };
    },
    //云专网优化BGPlb
    StringLength80: function (str, trigger) {
        //长度不超过80个字符
        return { name: 'StringLength80', validator: validOrder.validStringLength80, message: `${str}请在80字符以内`, trigger };
    },
    StringLength600: function (str, trigger) {
        //长度不超过600个字符
        return { name: 'StringLength600', validator: validOrder.validStringLength600, message: `${str}请在600字符以内`, trigger };
    },
    StringLength9000: function (str, trigger) {
        //长度不超过9000个字符
        return { name: 'StringLength9000', validator: validOrder.validStringLength9000, message: `${str}请在9000字符以内`, trigger };
    },
    iPAddreess: function (str, trigger) {
        //IP地址校验
        return { name: 'iPAddreess', validator: validOrder.validIPAddreess, message: `${str}IP地址输入不正确,正确格式为：0.0.0.0 `, trigger };
    },
    moreIPAddreess: function (str, trigger) {
        //多个IP地址校验
        return { name: 'iPAddreess', validator: validOrder.validMoreIPAddreess, trigger };
    },
    negaNumber: function (str, trigger) {
        //非负数
        return { name: 'iPAddreess', validator: validOrder.validNegaNumber, message: `${str}值要求为非负数`, trigger };
    },
    exceedTime: function (str, trigger) {
        //日期不能小于当天时间
        return { name: 'exceedTime', validator: validOrder.validExceedTime, message: `${str}必须大于等于当前日期` };
    },
    SpecialCharacter: function (str, trigger) {
        //非空格字符组成的字符串，数字，大写字母，小写字母，特殊字符至少有 两种
        return { name: 'SpecialCharacter', validator: validOrder.validCharacter, message: `${str}数字，大写字母，小写字母，特殊字符至少有两种` };
    },
    segment: function (str, trigger) {
        //客户侧网段
        return { name: 'segment', validator: validOrder.validSegment, message: `${str}格式输入有误` };
    },
    mask: function (str, trigger) {
        //掩码
        return { name: 'mask', validator: validOrder.validMask, trigger };
    },
    mask1: function (str, trigger) {
        //掩码
        return { name: 'mask', validator: validOrder.validMask1, trigger };
    },
    mask30: function (str, trigger) {
        //掩码
        return { name: 'mask30', validator: validOrder.validMask30, trigger };
    },
    //IP虚拟专网IP互联地址字段子网掩码放开29位校验lb
    mask30Or29: function (str, trigger) {
        //掩码
        return { name: 'mask30', validator: validOrder.validMask30Or29, trigger };
    },
    //境外互联网校验Ip
    maskjw: function (str, trigger) {
        return { name: 'maskjw', validator: validOrder.validMaskjw, trigger };
    },

    Num: function (str, trigger) {
        //1~32正整数
        return { name: 'Num', validator: validOrder.validNum, message: `${str}应为1~32的正整数` };
    },
    patrn: function (str, trigger) {
        //校验特殊字符
        return { name: 'patrn', validator: validOrder.validPatrn, message: `${str}必须有特殊字符` };
    },

    Multiplier: function (str, trigger) {
        //校验Multiplier输入范围
        return { name: 'Multiplier', validator: validOrder.validMultiplier, message: `${str}范围为3~50` };
    },

    twentyLetterNum: function (str, trigger) {
        //只能输入4-10个字符，只能填写小写字母、数字。 add by wubin 2021-11-22
        return { name: 'twentyLetterNum', validator: validOrder.validLetterNum, message: `${str}只能输入4-10个字符，只能填写小写字母、数字。` };
    },
    phoneLimit: function (str, trigger) {
        //14103、10649、14104、149号段限制。 add by wubin 2021-11-26
        return { name: 'phoneLimit', validator: validOrder.validPhoneLimit, message: `物用场景请输入数字为14103、10649、14104、149开头的号段,149号段为11位,其余为13位长。` };
    },
    AtoZ: function (str, trigger) {
        //A-Z大写字母
        return { name: 'AtoZ', validator: validOrder.validAtoZ, message: '请输入一个大写字母A-Z表示' };
    },
    Number100: function (str, trigger) {
        //1到100之间
        return { name: 'Number100', validator: validOrder.validNumber100, message: '请输入0-100之间的任意实数', trigger };
    },

    Number11: function (str, trigger) {
        //1到100之间
        return { name: 'Number100', validator: validOrder.validNbrele, message: '请输11位数字', trigger };
    },
    telNbr: function (str, trigger) {
        //接入号码校验
        return { name: 'Number100', validator: validOrder.validTelNbr, message: '接入电话号码输入有误，请重新输入', trigger };
    },
    percentage: function (str, trigger) {
        //整数百分数校验
        return { name: 'percentage', validator: validOrder.percentage, message: '请输入整数百分比形式', trigger };
    },
    percent100: function (str, trigger) {
        //百分比  0-100正整数
        return { name: 'percentage', validator: validOrder.validPercent100, message: '请输入0-100之间的整数', trigger };
    },
    actual100: function (str, trigger) {
        //0-100之间的实数，可保留两位小数
        return { name: 'actual100', validator: validOrder.actual100, message: '请输入0-100之间的正数，可保留两位小数', trigger };
    },
    //限制月租费一次费一口价和优惠率不能同时录入lb220812 增加一个优惠率校验2023年5月29日
    ratio4: function (str, trigger) {
        //0-100之间的数，可保留4位小数
        return { name: 'actual100', validator: validOrder.validRatio4, message: '请输入0-100之间的数，可保留4位小数', trigger };
    },

    amount20000: function (str, trigger) {
        //idc 产品变更流程中限制一次一次费不能超过20000
        return { name: 'actual100', validator: validOrder.validAmount20000, message: '请输入小于等于20000的数值', trigger };
    },
    negativeNumberAndActual100: function (str, trigger) {
        //0-100之间的实数，可保留两位小数
        return { name: 'negativeNumberAndActual100', validator: validOrder.negativeNumberAndActual100, message: '请输入小于等于100的数字，可保留两位小数', trigger };
    },
};
export default validMap;

export const validOrder = {
    validEmpty: function (rule, value, callback) {
        if (value === '' || value == undefined || value == null) {
            return callback(new Error('${str}为必填项,值不能为空'))
        } else {
            if (value == 'http://' || value == 'https://') {//http为5g产品http-select插件提供
                return callback(new Error('${str}为必填项,值不能为空'))
            } else {
                callback()
            }
        }
    },
    validEmail: function (rule, value, callback) {
        const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}请输入正确的邮箱格式'));
            } else {
                callback();

            }
        }
    },
    validNumber: function (rule, value, callback) {
        const reg = /^[0-9]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}必须为数字格式'));
            } else {
                callback();

            }
        }
    },
    validIntFloat: function (rule, value, callback) {
        const reg = /^[]?(?!0\d)\d+(\.\d+)?$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}必须为数字格式'));
            } else {
                callback();

            }
        }
    },
    validInteger: function (rule, value, callback) {
        const reg = /^[-\+]?\d+$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为整数格式'));
            } else {
                callback();

            }
        }
    },
    validPinteger: function (rule, value, callback) {
        const reg = /^[1-9]{1}[\d]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为正整数格式'));
            } else {
                callback();

            }
        }
    },
    validPintegerand0: function (rule, value, callback) {
        const reg = /^[0-9]{1}[\d]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为正整数格式'));
            } else {
                callback();

            }
        }
    },
    validPinteger1: function (rule, value, callback) {
        const reg = /^[1-9]{1}[\d]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为大于等于1的正整数格式'));
            } else {
                callback();

            }
        }
    },
    validPintegerLimit30: function (rule, value, callback) {
        const reg = /^[1-9]{1}[\d]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('请输入正整数格式'));
            } else {
                if (value > 30) {
                    callback(new Error('请输入不大于30的正整数'));
                } else {
                    callback();
                }
            }
        }
    },
    validPintegerLimit15: function (rule, value, callback) {
        const reg = /^[1-9]{1}[\d]*$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('请输入正整数格式'));
            } else {
                if (value > 15) {
                    callback(new Error('请输入不大于15的正整数'));
                } else {
                    callback();
                }
            }
        }
    },
    validPinteger1To10: function (rule, value, callback) {
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            // 验证是否为1~10之间的正整数
            const numValue = Number(value);
            if (isNaN(numValue) || numValue < 1 || numValue > 10 || !Number.isInteger(numValue)) {
                callback(new Error('只能填写1~10之间的正整数'));
            } else {
                callback();
            }
        }
    },
    validPhone: function (rule, value, callback) {
        const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}格式错误,请填写正确号码'));
            } else {
                callback();

            }
        }
    },
    validMobile: function (rule, value, callback) {
        const reg = /^((\(\d{3}\))|(\d{3}\-))?1[356789]\d{9}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}格式错误,请填写正确手机号码'));
            } else {
                callback();

            }
        }
    },
    validDxMobile: function (rule, value, callback) {
        const tel = /^(13[0-9]|14[1457]|15[0-3,5-9]|16[6]|17[0145678]|18[0-9]|19[89])\d{8}$/;
        const reg = /^((0\d{2,3}))(\d{7,8})$/;
        let flag = false;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if (tel.test(value)) {
                flag = true;
            } else if (reg.test(value)) {
                flag = true;
            }
            if (!flag) {
                callback(new Error('请填写正确的手机号或固定电话!'));
            } else {
                callback();

            }
        }
    },
    validotnMobile: function (rule, value, callback) {
        const tel = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
        const reg = /^((\d{3,4}\-)|)\d{7,8}$/;
        let flag = false;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if (tel.test(value)) {
                flag = true;
            } else if (reg.test(value)) {
                flag = true;
            }
            if (!flag) {
                callback(new Error('请填写11位的手机号或区号-号码的固话号;'));
            } else {
                callback();

            }
        }
    },
    validCustMobile: function (rule, value, callback) {
        //const reg = /^(13[0-9]|14[1457]|15[0-3,5-9]|16[6]|17[0145678]|18[0-9]|19[89])\d{8}$/;
        const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}格式错误,请填写正确手机号码'));

            } else {
                callback();

            }
        }
    },
    validDouble: function (rule, value, callback) {
        const reg = /^[-]?(([1-9][\d]+)|((([1-9][\d]+)|0)(\.\d+)))$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为小数格式'));

            } else {
                callback();

            }
        }
    },
    validDoubleTwo: function (rule, value, callback) {
        const reg = /^(\d+)(.\d{0,2})?$/;
        if (value.includes(".")) {
            let value1 = value.split(".");
            if (value1[0] == "" || value == undefined || value == null) {
                callback(new Error('${str}要求为小数格式,保留两位'));
            }
        }
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            let num = Number(value.slice(0, value.length - 1))
            if ((!reg.test(num)) && value != '') {
                callback(new Error('${str}要求为小数格式,保留两位'));

            } else {
                callback();

            }
        }
    },
    validEnglish: function (rule, value, callback) {
        const reg = /^[A-Za-z]+$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}要求为纯英文字母'));

            } else {
                callback();

            }
        }
    },
    validChinese: function (rule, value, callback) {
        const reg = /[\u4e00-\u9fa5]/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}请填写中文格式'));

            } else {
                callback();

            }
        }
    },
    validQQ: function (rule, value, callback) {
        const reg = /^[1-9]\d{4,8}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}请填写正确的QQ号码'));

            } else {
                callback();

            }
        }
    },
    validZip: function (rule, value, callback) {
        const reg = /^[1-9]\d{5}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}请填写正确的邮编格式'));

            } else {
                callback();

            }
        }
    },
    validIPTlength: function (rule, value, callback) {
        const reg = /^\d{1,20}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在20字以内'));

            } else {
                callback();

            }
        }
    },
    validStringLength1000: function (rule, value, callback) {
        const reg = /^.{1,1000}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在1000字以内'));

            } else {
                callback();

            }
        }
    },
    validStringLength32: function (rule, value, callback) {
        const reg = /^.{1,32}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在32字以内'));

            } else {
                callback();

            }
        }
    },
    validStringLength40: function (rule, value, callback) {
        const reg = /^.{1,40}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在40字以内'));
            } else {
                callback();
            }
        }
    },
    validStringLength50: function (rule, value, callback) {
        const reg = /^.{1,50}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在50字以内'));

            } else {
                callback();

            }
        }
    },
    validStringLength200: function (rule, value, callback) {
        const reg = /^.{1,200}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在200字以内'));

            } else {
                callback();

            }
        }
    },
    //云专网优化BGPlb
    validStringLength80: function (rule, value, callback) {
        const reg = /^.{1,80}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在80字以内'));

            } else {
                callback();

            }
        }
    },
    validStringLength600: function (rule, value, callback) {
        const reg = /^[^\\]{0,600}$$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在600字以内'));

            } else {
                callback();

            }
        }
    },

    validStringLength9000: function (rule, value, callback) {
        const reg = /^[^\\]{0,9000}$$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}字数请在9000字以内'));

            } else {
                callback();

            }
        }
    },

    validIPAddreess: function (rule, value, callback) {
        const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}IP地址输入不正确'));

            } else {
                callback();

            }
        }
    },
    validMoreIPAddreess: function (rule, value, callback) {
        const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            let arr = value.split(";");
            let flag = true, num = 0;
            for (let index = 0; index < arr.length; index++) {
                if (arr[index] != "" && !reg.test(arr[index])) {
                    flag = false;
                    num = index + 1;
                    break;
                }
            }
            if ((!flag)) {
                callback(new Error(`第 ${num} 个IP地址输入不正确`));
            } else {
                callback();
            }
        }
    },
    validNegaNumber: function (rule, value, callback) {
        const reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}值要求为非负数'));

            } else {
                callback();

            }
        }
    },
    validExceedTime: function (rule, value, callback) {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        let dateStr = year + "-" + month + "-" + day + " 00:00:00";
        const now = new Date(dateStr).getTime() //当前-时间
        const _value = new Date(value).getTime() //页面传值-时间
        if (value == '' || _value < now) {
            return callback(new Error('${str}必须大于等于当前日期'))
        } else {
            callback()
        }
    },
    validCharacter: function (rule, value, callback) {
        const reg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}数字，大写字母，小写字母，特殊字符至少有两种'));

            } else {
                callback();
            }
        }
    },
    validSegment: function (rule, value, callback) {
        const reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))).){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}格式输入有误'));

            } else {
                callback();
            }
        }
    },
    validMask: function (rule, value, callback) {
        const reg1 = /^([1-9]|[1-2][0-9]|3[0-2])$/;
        const reg2 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        value = value.split("/")
        if (value == '' || value == undefined || value == null) {
            callback();
        } else if (value.length > 2) {
            callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
        } else {
            if (!reg2.test(value[0])) {
                callback(new Error('正确格式为：0.0.0.0/1'));
            }
            if (!value[1] && !reg1.test(value[1])) {
                callback(new Error('正确格式为：0.0.0.0/1'));
            }
            if (parseInt(value[1]) > 32 || parseInt(value[1]) < 1) {
                callback(new Error('掩码必须为1-32的整数'));
            } else {
                callback();
            }
        }
    },
    validMask1: function (rule, value, callback) {
        const reg2 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        value = value.split("/")
        if (value == '' || value == undefined || value == null) {
            callback();
        } else if (value.length > 2) {
            callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
        } else {
            if (!reg2.test(value[0])) {
                callback(new Error('正确格式为：0.0.0.0/1'));
            }
            if (!value[1] && value[1] != "") {
                callback(new Error('正确格式为：0.0.0.0/1'));
            } else {
                callback();
            }
        }
    },
    validMask30: function (rule, value, callback) {
        const reg2 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        value = value.split("/")
        if (value == '' || value == undefined || value == null) {
            callback();
        } else if (value.length > 2) {
            callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
        } else {
            if (!reg2.test(value[0])) {
                callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
            }
            if (parseInt(value[1]) != 30) {
                callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
            } else {
                callback();
            }
        }
    },
    //IP虚拟专网IP互联地址字段子网掩码放开29位校验lb
    validMask30Or29: function (rule, value, callback) {
        const reg2 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        value = value.split("/")
        if (value == '' || value == undefined || value == null) {
            callback();
        } else if (value.length > 2) {
            callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
        } else {
            if (!reg2.test(value[0])) {
                callback(new Error('正确格式示例: 0.0.0.0/30 请重新输入！'));
            }
            if (!(parseInt(value[1]) == 30 || parseInt(value[1]) == 29)) {
                callback(new Error('正确格式示例: 0.0.0.0/30或者0.0.0.0/29 请重新输入！'));
            } else {
                callback();
            }
        }
    },

    validMaskjw: function (rule, value, callback) {
        const reg2 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        }
        var lst = value.split(";");
        for (var i = 0; i < lst.length; i++) {
            var ip = lst[i];
            var zeym = ip.split("/");
            if (zeym.length != 2) {
                callback(new Error('正确格式示例：0.0.0.0/X,多个以;分隔,请重新输入'));
            } else {
                if (!reg2.test(zeym[0])) {
                    callback(new Error('您输入IP地址格式不正确，正确格式示例：0.0.0.0/X,请重新输入'));
                } else {
                    callback();
                }
            }
        }
    },

    validTowDecDouble: function (rule, value, callback) {
        const reg = /^\d{1,10}[\.]\d{1,2}$|^\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为不能超过2位小数的正数'));

            } else {
                callback();

            }
        }
    },
    validOneDecDouble: function (rule, value, callback) {
        const reg = /^(0|\d{0,10})[\.]\d{1}$|^(0|\d{1,10})$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为不能超过1位小数的正数'));

            } else {
                callback();

            }
        }
    },
    validTowLittleNumber: function (rule, value, callback) {
        const reg = /^[-]?\d{1,10}[\.]\d{1,2}$|^[-]?\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为不能超过2位小数的数'));

            } else {
                callback();

            }
        }
    },
    validLittleNumber: function (rule, value, callback) {
        const reg = /^[-]?\d{1,10}[\.]\d+$|^[-]?\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为数值'));

            } else {
                callback();

            }
        }
    },
    validFourDecDouble: function (rule, value, callback) {
        const reg = /^\d{1,10}[\.]\d{1,4}$|^\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为不能超过4位小数的正数'));
            } else {
                callback();

            }
        }
    },

    //5G双域快网新产品-lb 2023年11月20日add
    validZeroFourDouble: function (rule, value, callback) {
        const reg = /^\d{0,10}[\.]\d{1,4}$|^\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为0或不能超过4位小数的正数'));
            } else {
                callback();

            }
        }
    },
    validFourDouble: function (rule, value, callback) {
        const reg = /^-{0,1}\d{1,10}[\.]\d{1,4}$|^\d{1,10}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为不能超过4位小数正数或负数'));
            } else {
                callback();

            }
        }
    },
    validNum: function (rule, value, callback) {
        const reg = /^([1-9]|[1-2][0-9]|3[0-2])$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}应为1~32的正整数'));

            } else {
                callback();

            }
        }
    },
    validPatrn: function (rule, value, callback) {
        const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            if ((!reg.test(value)) && value != '') {
                callback(new Error('${str}必须有特殊字符'));

            } else {
                callback();

            }
        }
    },

    validMultiplier: function (rule, value, callback) {
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
            let intValue = parseInt(value)
            if (intValue < 3 || intValue > 50) {
                callback(new Error('${str}的范围为3~50'));
            } else {
                callback();
            }
        }
    },

    validLetterNum: function (rule, value, callback) {
        let reg5g = RegExp(/5gzx/);
        if((reg5g.test(value))){
            callback();
        }
        const reg = /^[a-z0-9]{4,10}$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('${str}只能输入4-10个字符，只能填写小写字母、数字。'));
        } else {
            callback();
        }
    },
    validPhoneLimit: function (rule, value, callback) {
        //物用卡：限制可选号段，填写接入号码必须是14103、10649、14104、149号段开头的，149号段为11位、其余为13位长
        const reg = /^(14103|10649|14104|149)[0-9]{8}$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('物用场景请输入数字为14103、10649、14104、149开头的号段,149号段为11位、其余为13位长。'));
        } else {
            callback();
        }
    },
    validAtoZ: function (rule, value, callback) {
        const reg = /^[A-Z]$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入一个大写字母A-Z表示'));
        } else {
            callback();
        }
    },
    validNumber100: function (rule, value, callback) {
        const reg = /^(\d?\d(\.\d*)?|100)$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入0-100之间的任意实数'));
        } else {
            callback();
        }
    },

    validNbrele: function (rule, value, callback) {
        if (value.length != 11) {
            callback(new Error('请输入11位数字'));
        } else {
            callback();
        }
    },
    //接入号码校验
    validTelNbr: function (rule, value, callback) {
        if (value == '') {
            callback();
        }
        let reg = /^[1-9][0-9]{4,14}$/;
        if (!reg.test(value)) {
            callback(new Error('接入电话号码输入有误，请重新输入'));
        } else {
            callback();
        }
    },
    //整数百分数校验
    percentage: function (rule, value, callback) {
        if (value == '') {
            callback();
        }
        let reg = /^(100|[1-9]?\d)%$/;
        if (!reg.test(value)) {
            callback(new Error('请输入整数百分比形式'));
        } else {
            callback();
        }
    },
    //0-100 整数
    validPercent100: function (rule, value, callback) {
        let reg = /^([0-9]|[0-9]{2}|100)$/;
        if (value == '') {
            callback();
        }
        if (!reg.test(value)) {
            callback(new Error('请输入0-100之间的整数！'));
        } else {
            callback();
        }
    },
    actual100: function (rule, value, callback) {
        let reg = /^(100)$|^((\d|[1-9]\d)(\.\d{1,2})?)$/;
        if (value == '') {
            callback();
        }
        if (!reg.test(value)) {
            callback(new Error('请输入0-100之间的正数，可保留两位小数'));
        } else {
            callback();
        }
    },

    negativeNumberAndActual100: function (rule, value, callback) {
        let reg = /^-?(0|([1-9][0-9]*))(\.[\d]{1,2})?$/
        if (value == '') {
            callback();
        }
        if ((reg.test(value) && value > 100) || !reg.test(value)) {
            callback(new Error('请输入小于等于100的数字，可保留两位小数'));
        } else {
            callback();
        }
    },

    //限制月租费一次费一口价和优惠率不能同时录入lb220812 增加一个优惠率校验2023年5月29日
    validRatio4: function (rule, value, callback) {
        // if(value == '') {
        // 	callback();
        // }
        // let reg = /^0|100$|^[0](\.\d{1,4})$|^([1-9][0-9]*(\.\d{1,4})?)$/
        let reg = /^0|100$|(^[1-9][0-9]?(\.\d{1,4})?)$/
        if (!reg.test(value)) {
            callback(new Error('请输入0-100之间的数，可保留4位小数'));
        } else {
            callback();
        }
    },

    // 费用不大于20000
    validAmount20000(rule, value, callback) {
        if (!value) callback();
        if (value > 20000) {
            callback(new Error('请输入小于等于20000的数值'));
        } else {
            callback();
        }
    }

}

