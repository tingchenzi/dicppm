//ppm规则公用方法文件
import OrderService from "@/api/order/OrderService.js";
const commonMethod = {

    async safeTip(_this){ //加保密提示-lb 2025年4月 add 方法
        //注意返回结果，为了调用时简化代码，确认返回false；取消返回true
        let noPass = true;//校验不通过
        let msg =' <span style="color: red;">保密提醒：严禁违规传输涉密及敏感信息文件</span>';
        await _this.$confirm( msg, "提示", {
                  confirmButtonText: "确定",
                  showCancelButton: false,
                  dangerouslyUseHTMLString: true,
                  type: "warn",
                  center: true,
                }).then(() => {
          // 用户点击了确认按钮
          console.log('用户确认');
          noPass = false;
        })
        .catch(() => {
          // 用户点击了取消按钮
          console.log('用户取消');
          noPass = true;
        });
        console.log("noPass---:",noPass)
        return noPass;
    },

    //M,G转换为K
    switchVal(val) {
        if (val.indexOf("K") != -1) {
            return Number(val.slice(0, val.length - 1));
        } else if (val.indexOf("M") != -1) {
            return Number(val.slice(0, val.length - 1)) * 1024;
        } else if (val.indexOf("G") != -1) {
            return Number(val.slice(0, val.length - 1)) * 1024 * 1024;
        } else {
            return 0;
        }
    },

    //M,G转换为K
    switchValBy1000(val) {
        if (val.indexOf("K") != -1) {
            return Number(val.slice(0, val.length - 1));
        } else if (val.indexOf("M") != -1) {
            return Number(val.slice(0, val.length - 1)) * 1000;
        } else if (val.indexOf("G") != -1) {
            return Number(val.slice(0, val.length - 1)) * 1000 * 1000;
        } else {
            return 0;
        }
    },
    //根据速率id匹配速率值
    speedValue(_this, id) {
        return _this.formData[id].value
            ? _this.formData[id].options.find(
                (ele) => ele.attrValue === _this.formData[id].value
            ).attrValueName
            : "";
    },
    //城市校验
    cityValid(_this, val, name) {
        let orderSourceId = JSON.parse(sessionStorage.getItem("FormModel")).orderSourceId;;
        let validFlag = true;
        //境内限制
        if (val.country == '26068') {
            if (val.provice == '') {
                _this.$confirm(name + "：省份不能为空！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                validFlag = false;
                return
            }
            //mod  天津必须选择区县
            if (val.provice != 25991 && val.provice != 26264 && val.provice != 27528 && val.provice != 26177 && val.provice != 24976 && val.city == '') {
                if (val.provice == 25878) {
                    _this.$confirm(name + "：天津必须选择到区县！", "提示", {
                        confirmButtonText: "关闭",
                        showCancelButton: false,
                        type: 'warning',
                        center: true,
                    })
                    validFlag = false;
                    return
                } else {
                    _this.$confirm(name + "：市不能为空！", "提示", {
                        confirmButtonText: "关闭",
                        showCancelButton: false,
                        type: 'warning',
                        center: true,
                    })
                    validFlag = false;
                    return
                }

            }

            if (val.provice == 25996 && val.area == '') {
                _this.$confirm(name + "：浙江必须选择到区县！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return validFlag = false;
            }
        } else {
            //境外限制
            //A端业务:CE国家为非中国时，cE省份必填;
            //B端业务:CE国家为非中国时，可只选到国家;
            if (orderSourceId == '10000' && val.provice == '') {
                _this.$confirm(name + "：省份不能为空！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                validFlag = false;
                return
            }
        }
        return validFlag
    },
    //ip地址校验(余数算法，相邻地址)
    validIPAdress(_this, id) {
        let attrID = id.split('-')[0];
        let ceV4 = _this.formData[attrID + '-100000516'].value;
        let peV4 = _this.formData[attrID + '-100000517'].value;
        if (ceV4 && ceV4 != "" && peV4 && peV4 != "") {
            var ceV = ceV4.split('/');
            var peV = peV4.split('/');
            var ceip = ceV[0].split('.');
            var peip = peV[0].split('.');
            if (ceV[1] != peV[1]) {
                //掩码是否一致 chengxiang
                _this.$message.warning("CE端口互联IP地址和CN2_PE端口互联IP地址掩码请保持一致")
                _this.formData[id].value = ''
            } else {
                if (ceV[1] == "29") {
                    debugger
                    //如果是29位掩码，CE地址和PE地址满足从8n+1到8n+6其中任意两个的规则，pe地址和CE地址不能相同(ipv4) chengxiang
                    let a = parseInt(ceip[3]) % 8, b = parseInt(peip[3]) % 8;
                    if (0 < a && a < 7 && 0 < b && b < 7 && a != b) {
                        if ((parseInt(ceip[3]) - parseInt(peip[3]) > 6 || parseInt(ceip[3]) - parseInt(peip[3]) < -6)) {
                            _this.$message.warning("输入的IP地址不合法，当子掩码29时，CE端口互联IP地址和CN2_PE端口互联IP地址一定是一对相邻地址")
                            _this.formData[id].value = ''
                        }
                    } else {
                        _this.$message.warning("输入的IP地址不合法，当子掩码29时，CE端口互联IP地址和CN2_PE端口互联IP地址必须满足余数算法")
                        _this.formData[id].value = ''
                    }
                } else {
                    //如果是30位掩码，CE地址和PE地址满足4n+1、4n+2的规则，无顺序对应关系  chengxiang
                    if (!((parseInt(ceip[3]) % 4 == 1 && parseInt(peip[3]) % 4 == 2) || (parseInt(ceip[3]) % 4 == 2 && parseInt(peip[3]) % 4 == 1))) {
                        _this.$message.warning("输入的IP地址不合法，当子掩码30时，CE端口互联IP地址和CN2_PE端口互联IP地址必须满足余数算法")
                        _this.formData[id].value = ''
                    } else {
                        if (!(parseInt(ceip[3]) - parseInt(peip[3]) == 1 || parseInt(ceip[3]) - parseInt(peip[3]) == -1)) {
                            _this.$message.warning("输入的IP地址不合法，当子掩码30时，CE端口互联IP地址和CN2_PE端口互联IP地址一定是一对相邻地址")
                            _this.formData[id].value = ''
                        }
                    }
                }
            }
        }
    },
    //ip地址校验(余数算法，相邻地址)
    validIPAdressNNI(_this, id1, id2, flag) {
        let ceV4 = _this.formData[id1].value;
        let peV4 = _this.formData[id2].value;
        if (ceV4 && ceV4 != "" && peV4 && peV4 != "") {
            var ceV = ceV4.split('/');
            var peV = peV4.split('/');
            var ceip = ceV[0].split('.');
            var peip = peV[0].split('.');
            //如果是30位掩码，CE地址和PE地址满足4n+1、4n+2的规则，无顺序对应关系  chengxiang
            if (!((parseInt(ceip[3]) % 4 == 1 && parseInt(peip[3]) % 4 == 2) || (parseInt(ceip[3]) % 4 == 2 && parseInt(peip[3]) % 4 == 1))) {
                let msg = "";
                if (flag == 1) {
                    msg = "输入的IP地址不合法，两端ASBR互联IP地址必须满足余数算法"
                } else {
                    msg = "输入的IP地址不合法，OPTIONA方式跨域互联地址网段必须满足余数算法"
                }
                _this.$message.warning(msg);
                _this.formData[id1].value = ''
            } else {
                if (!(parseInt(ceip[3]) - parseInt(peip[3]) == 1 || parseInt(ceip[3]) - parseInt(peip[3]) == -1)) {
                    let msg = "";
                    if (flag == 1) {
                        msg = "输入的IP地址不合法，两端ASBR互联IP地址一定是一对相邻地址"
                    } else {
                        msg = "输入的IP地址不合法，OPTIONA方式跨域互联地址网段一定是一对相邻地址"
                    }
                    _this.$message.warning(msg)
                    _this.formData[id1].value = ''
                }
            }
        }
    },
    //ip地址校验(余数算法，相邻地址)
    validIPAdressVpn(_this, id) {
        let attrID = id.split('-')[0];
        let ceV4 = _this.formData[attrID + '-100000516'].value;
        let peV4 = _this.formData[attrID + '-100000517'].value;
        if (ceV4 && ceV4 != "" && peV4 && peV4 != "") {
            var ceV = ceV4.split('/');
            var peV = peV4.split('/');
            var ceip = ceV[0].split('.');
            var peip = peV[0].split('.');
            //IP虚拟专网IP互联地址字段子网掩码放开29位校验lb
            // if ((ceV[1] == "30" && peV[1] == "30")||(ceV[1] == "29" && peV[1] == "29")) {
            if ((ceV[1] == "29" || ceV[1] == "30") && (peV[1] == "29" || peV[1] == "30")) {
                if (!((parseInt(ceip[3]) % 4 == 1 && parseInt(peip[3]) % 4 == 2) || (parseInt(ceip[3]) % 4 == 2 && parseInt(peip[3]) % 4 == 1))) {
                    _this.$message.warning("输入的IP地址不合法，当子掩码为29或30时，客户侧互联和云侧互联地址必须满足余数算法")
                    _this.formData[id].value = ''
                } else
                    if (!(parseInt(ceip[3]) - parseInt(peip[3]) == 1 || parseInt(ceip[3]) - parseInt(peip[3]) == -1)) {
                        _this.$message.warning("输入的IP地址不合法，当子掩码为29或30时，客户侧互联和云侧互联地址一定是一对相邻地址")
                        _this.formData[id].value = ''
                    }

            }

        }
    },
    //ipv4用户LAN网段地址/子网掩码校验
    validLanAdress(_this, val, id) {
        if (val == '') return
        const reg1 = /^([1-9]|[1-2][0-9]|3[0-2])$/;
        const reg2 =
            /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        let arrList = val.split(";");
        if (arrList.length > 20) {
            _this.$message.warning("请选择路由协议BGP进行受理下单，或将静态路有聚合到20条以内")
            _this.formData[id].value = "";
            return
        }
        for (let index = 0; index < arrList.length; index++) {
            let ip = arrList[index];
            let zeym = ip.split("/");
            let inIPLst = zeym[0].split('.');
            let net = "";
            if (zeym.length != 2) {
                _this.$message.warning("您输入IP地址格式不正确，正确格式示例：0.0.0.0/1,多个以';'分隔，请重新输入")
                _this.formData[id].value = "";
                return;
            }
            if (zeym == "" || zeym == undefined || zeym == null) {
                return;
            } else {
                if (!reg2.test(zeym[0])) {
                    _this.$message.warning("您输入IP地址格式不正确，正确格式示例：0.0.0.0/1,多个以';'分隔，请重新输入")
                    _this.formData[id].value = "";
                    return;
                } else if (!reg1.test(zeym[1]) && zeym[1] != 0) {
                    _this.$message.warning("掩码必须为0-32的整数")
                    _this.formData[id].value = "";
                    return;
                }
            }
            for (var j = 0; j < 32; j++) {
                if (j < zeym[1]) {
                    net += "1";
                } else {
                    net += "0";
                }
            }
            let netNbr1 = inIPLst[0] & parseInt(net.substring(0, 8), 2);
            let netNbr2 = inIPLst[1] & parseInt(net.substring(8, 16), 2);
            let netNbr3 = inIPLst[2] & parseInt(net.substring(16, 24), 2);
            let netNbr4 = inIPLst[3] & parseInt(net.substring(24, 32), 2);
            // if (32 < zjwN && zjwN < 0) {
            //     templateValid.showMsg(obj, "输入的第" + (i + 1) + "个IP地址子网掩码只能输入[0-32]，请检查", 2, false);
            // }
            if (netNbr1 != inIPLst[0] || netNbr2 != inIPLst[1] || netNbr3 != inIPLst[2] || netNbr4 != inIPLst[3]) {
                _this.$message.warning("输入的第" + (index + 1) + "个IP地址不可用，请重新输入")
                _this.formData[id].value = "";
            }
        }
    },
    //校验AS号是否合法
    async validAs(_this, val, id) {
        if (val != "") {  //改用接口校验   houbin add 2023-01-10
            let param = {
                customerAds: val,
            };
            console.log("校验客户AS号入参:", param);
            const result = await OrderService.checkCustAs(param);
            console.log("校验客户AS号返回:", result);
            if (result.code == 200) {
                let flag = result.meta.flag || "";
                if (flag == "YES") {
                    console.log("客户AS号校验通过");
                } else {
                    _this.$message.warning("请输入有效的客户AS号！");
                    _this.formData[id].value = "";
                }
            } else {
                _this.$message.warning("校验接口调用异常!");
                _this.formData[id].value = "";
            }
        }
        // if (val == '') return
        // let asSplit = val.split(".");
        // var as = asSplit[0] * 1;
        // if (asSplit.length != 2) {
        //     if (as < 1 || as > 4294967295) {
        //         _this.$message.warning("输入的不符合格式或超出范围！")
        //         _this.formData[id].value = "";
        //     }
        // } else {
        //     var asTwo = asSplit[1] * 1;
        //     if (as < 1 || as > 65535) {
        //         _this.$message.warning("输入的不符合格式或超出范围！")
        //         _this.formData[id].value = "";
        //     }
        //     if (asTwo < 0 || asTwo > 65535) {
        //         _this.$message.warning("输入的不符合格式或超出范围！")
        //         _this.formData[id].value = "";
        //     }
        // }
    },

    //ipv6 CE、pe端口互联IPv6地址
    validIpv6Adress(_this, id) {
        let val = _this.formData[id].value;
        if (val == '') return
        let str = "\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*\/[1-9]{1}\\d{0,3}$"
        var reg = new RegExp('^' + str + '$');
        var rtn = reg.test(val);
        if (!rtn) {
            _this.$message.warning("您输入的IPV6地址不合法，正确格式示例：0000:1000:2000:0030:0004:6789:5abc:CDDF/1234 请重新输入！");
            _this.formData[id].value = '';
        }
    },
    //ip地址校验(余数算法，相邻地址)(完善方法)
    validIPAdressAll(_this, id1, id2) {
        let ceV4 = _this.formData[id1].value;
        let peV4 = _this.formData[id2].value;
        if (ceV4 && ceV4 != "" && peV4 && peV4 != "") {
            var ceV = ceV4.split('/');
            var peV = peV4.split('/');
            var ceip = ceV[0].split('.');
            var peip = peV[0].split('.');
            //IP虚拟专网IP互联地址字段子网掩码放开29位校验lb
            // if ((ceV[1] == "30" && peV[1] == "30")||(ceV[1] == "29" && peV[1] == "29")) {
            if ((ceV[1] == "29" || ceV[1] == "30") && (peV[1] == "29" || peV[1] == "30")) {
                if (!((parseInt(ceip[3]) % 4 == 1 && parseInt(peip[3]) % 4 == 2) || (parseInt(ceip[3]) % 4 == 2 && parseInt(peip[3]) % 4 == 1))) {
                    _this.$message.warning("输入的IP地址不合法，当子掩码为29或30时，客户侧互联和云侧互联地址必须满足余数算法")
                    _this.formData[id1].value = ''
                } else
                    if (!(parseInt(ceip[3]) - parseInt(peip[3]) == 1 || parseInt(ceip[3]) - parseInt(peip[3]) == -1)) {
                        _this.$message.warning("输入的IP地址不合法，当子掩码为29或30时，客户侧互联和云侧互联地址一定是一对相邻地址")
                        _this.formData[id1].value = ''
                    }

            }

        }
    },
    //校验海外公司不可选
    validSourceId(_this, val, key) {
        // 24135  非洲中东区域
        // 24136  亚太分部
        // 3307   中国电信欧洲公司(ICT)
        // 3284   中国电信美国公司(ICT)
        // 3285   中国电信(香港)国际有限公司(ICT)
        // 3216   中国电信美国公司
        // 3234   中国电信(香港)国际有限公司
        // 3316   中国电信欧洲公司
        let arrSourId = ["3234", "3216", "3316", "24135", "24136", "3307", "3284", "3285"]
        if (arrSourId.includes(val)) {
            _this.$message.warning("不能选择海外公司");
            _this.formData[key].value = "";
            return;
        }
    },
    //qos模式选择百分比，qos等级相加应为100%
    validQosPercent(_this, id) {
        let validFlag = true;
        let qosPercent =
            Number(_this.formData[id + '-100011749'].value.slice(0, _this.formData[id + '-100011749'].value.length - 1))
            + Number(_this.formData[id + '-100011747'].value.slice(0, _this.formData[id + '-100011747'].value.length - 1))
            + Number(_this.formData[id + '-100011593'].value.slice(0, _this.formData[id + '-100011593'].value.length - 1))
            + Number(_this.formData[id + '-100011597'].value.slice(0, _this.formData[id + '-100011597'].value.length - 1))
            + Number(_this.formData[id + '-100011595'].value.slice(0, _this.formData[id + '-100011595'].value.length - 1))
            + Number(_this.formData[id + '-142000818'].value.slice(0, _this.formData[id + '-142000818'].value.length - 1))
        if (qosPercent != 100) {
            _this.$confirm("Qos等级模式选择百分比，Qos等级之和必须为100%!", "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: 'warning',
                center: true,
            })
            validFlag = false
        }
        return validFlag
    },
    //qos模式选择百分比，qos等级相加应为100%  不包含BE速率
    validQosPercent_B(_this, id) {
        let validFlag = true;
        let qosPercent =
            Number(_this.formData[id + '-100011749'].value.slice(0, _this.formData[id + '-100011749'].value.length - 1))
            + Number(_this.formData[id + '-100011747'].value.slice(0, _this.formData[id + '-100011747'].value.length - 1))
            + Number(_this.formData[id + '-100011593'].value.slice(0, _this.formData[id + '-100011593'].value.length - 1))
            + Number(_this.formData[id + '-100011597'].value.slice(0, _this.formData[id + '-100011597'].value.length - 1))
            + Number(_this.formData[id + '-100011595'].value.slice(0, _this.formData[id + '-100011595'].value.length - 1))
        if (qosPercent != 100) {
            _this.$confirm("Qos等级模式选择百分比，Qos等级之和必须为100%!", "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: 'warning',
                center: true,
            })
            validFlag = false
        }
        return validFlag
    },
    //上行，下行速率，带宽校验
    validSpeed(_this, val, key) {
        let validFlag = true;
        if (val == '') return;
        let speedVal = val.slice(0, val.length - 1);
        if (val.includes('K')) {
            if (speedVal != '64' && speedVal != '128' && speedVal != '256' && speedVal != '512') {
                _this.$message.warning("单位选择K的时候只能添64K、128K、256K、512K !")
                _this.formData[key].value = ''
            }
            validFlag = false
        } else if (val.includes('M')) {
            const reg = /^[1-9]{1}[\d]*$/;
            if ((!reg.test(speedVal)) || speedVal < 1 || speedVal > 1024) {
                _this.$message.warning("单位选择M的时候请输入1到1024之间的整数(包含1和1024) !")
                _this.formData[key].value = ''
            }
            validFlag = false
        } else if (val.includes('G')) {
            var reg = /^[+-]?(([1-9]\d*)|0)?\.\d$/
            if (!reg.test(speedVal) || speedVal < 1) {
                _this.$message.warning("单位选择G的时候 请输入大于1.0的数字(带一位小数) !")
                _this.formData[key].value = ''
            }
            validFlag = false
        }
        return validFlag
    },
    //qos模式改变，修改单位
    changeSpeed(_this, val, id) {
        if (val == '') return;
        if (val == "30310002") {
            _this.formData[id + "-100011749"].isshow = "B"
            _this.formData[id + "-100011747"].isshow = "B"
            _this.formData[id + "-100011593"].isshow = "B"
            _this.formData[id + "-100011597"].isshow = "B"
            _this.formData[id + "-100011595"].isshow = "B"
            _this.formData[id + "-142000818"].isshow = "B"
        }
    },
    //接入电路速率要大于等于同一接入号下的pe速率之和
    floatAdd(arg1, arg2, arg3, arg4, arg5, arg6) {
        let r1, r2, r3, r4, r5, r6, m;
        let Num = 0;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        try { r3 = arg3.toString().split(".")[1].length } catch (e) { r3 = 0 }
        try { r4 = arg4.toString().split(".")[1].length } catch (e) { r4 = 0 }
        try { r5 = arg5.toString().split(".")[1].length } catch (e) { r5 = 0 }
        try { r6 = arg6.toString().split(".")[1].length } catch (e) { r6 = 0 }
        m = Math.pow(10, Math.max(r1, r2, r3, r4, r5, r6));
        if (arg1) {
            Num = Num + this.split(arg1) * m
        }
        if (arg2) {
            Num = Num + this.split(arg2) * m
        }
        if (arg3) {
            Num = Num + this.split(arg3) * m
        }
        if (arg4) {
            Num = Num + this.split(arg4) * m
        }
        if (arg5) {
            Num = Num + this.split(arg5) * m
        }
        if (arg6) {
            Num = Num + this.split(arg6) * m
        }
        return Num / m
    },
    split(val) {
        let result = 0;
        if (val.indexOf('K') != -1) {
            result = val.slice(0, val.length - 1)
        } else if (val.indexOf('M') != -1) {
            result = val.slice(0, val.length - 1) * 1024
        } else if (val.indexOf('G') != -1) {
            result = val.slice(0, val.length - 1) * 1024 * 1024
        }
        return result;
    },
    //接入电路速率要大于等于同一接入号下的pe速率之和
    floatAddBy1000(arg1, arg2, arg3, arg4, arg5, arg6) {
        let r1, r2, r3, r4, r5, r6, m;
        let Num = 0;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        try { r3 = arg3.toString().split(".")[1].length } catch (e) { r3 = 0 }
        try { r4 = arg4.toString().split(".")[1].length } catch (e) { r4 = 0 }
        try { r5 = arg5.toString().split(".")[1].length } catch (e) { r5 = 0 }
        try { r6 = arg6.toString().split(".")[1].length } catch (e) { r6 = 0 }
        m = Math.pow(10, Math.max(r1, r2, r3, r4, r5, r6));
        if (arg1) {
            Num = Num + this.splitBy1000(arg1) * m
        }
        if (arg2) {
            Num = Num + this.splitBy1000(arg2) * m
        }
        if (arg3) {
            Num = Num + this.splitBy1000(arg3) * m
        }
        if (arg4) {
            Num = Num + this.splitBy1000(arg4) * m
        }
        if (arg5) {
            Num = Num + this.splitBy1000(arg5) * m
        }
        if (arg6) {
            Num = Num + this.splitBy1000(arg6) * m
        }
        return Num / m
    },
    splitBy1000(val) {
        let result = 0;
        if (val.indexOf('K') != -1) {
            result = val.slice(0, val.length - 1)
        } else if (val.indexOf('M') != -1) {
            result = val.slice(0, val.length - 1) * 1000
        } else if (val.indexOf('G') != -1) {
            result = val.slice(0, val.length - 1) * 1000 * 1000
        }
        return result;
    },
    //转换时间戳
    switchTime(_this, id, flag) {
        //flag  有值代表当前属性值没有时分秒
        if (_this.formData[id].value) {
            let strtime = flag
                ? _this.formData[id].value + " 24:00:00"
                : _this.formData[id].value;
            let date = new Date(strtime.replace(/-/g, "/"));
            return date.getTime();
        } else {
            return 0;
        }
    },
    //割接开始时间与割接结束时间比较 id1代表割接开始时间  id2代表割接结束时间  id3代表要清空值的id
    compareTime(_this, id1, id2, id3) {
        if (_this.formData[id1].value && _this.formData[id2].value) {
            if (_this.formData[id1].value >= _this.formData[id2].value) {
                _this.$message.warning("割接开始时间应小于割接结束时间！");
                _this.formData[id3].value = "";
            }
        }
    },
    //割接开始时间和结束时间要同时填写
    chooseTime(_this, id1, id2) {
        if ((_this.formData[id1].value &&
            !_this.formData[id2].value) ||
            (!_this.formData[id1].value &&
                _this.formData[id2].value)) {
            _this.$confirm("割接开始时间、割接结束时间要同时填写！", "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: "warning",
                center: true,
            });
            return false;
        }
        return true;
    },
    //割接时间要小于要求完成时间
    colCompareTime(_this, id1, id2, id3) {
        let stime = commonMethod.switchTime(_this, id1);
        let etime = commonMethod.switchTime(_this, id2);
        let time = commonMethod.switchTime(_this, id3, '1');
        if (time <= stime) {
            _this.$confirm("割接开始时间要小于要求完成时间！", "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: "warning",
                center: true,
            });
            return false;
        } else if (time <= etime) {
            _this.$confirm("割接结束时间要小于要求完成时间！", "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: "warning",
                center: true,
            });
            return false;
        }
        return true;
    },
    //城市校验-中继产品
    async zjCityValid(_this, zjType, soure, val, name) {
        // zjType  中继类型
        // soure  A或Z端运营商值
        // val  城市信息
        // name 提示
        let orderSourceId = JSON.parse(sessionStorage.getItem("FormModel")).orderSourceId;
        let productId = JSON.parse(sessionStorage.getItem("ppmCondition")).productId;
        let cityList = [25991, 26264, 27528, 26177, 24976, 25878, 26176];//北京、上海、天津、重庆、香港、台湾、澳门
        let locationId = "";
        //境内限制
        if (val.country == '26068') {
            if (val.provice == '') {
                _this.$confirm(name + "：省份不能为空！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return false
            }
            if (cityList.indexOf(val.provice) > -1) {
                if (val.provice == 25991 && val.city) {
                    locationId = val.city;
                } else {
                    locationId = val.provice;
                }
            } else {
                locationId = val.city
            }
            if (!locationId) {
                _this.$confirm(name + "：市不能为空！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return false
            }
            if (productId == "80007048" || productId == "80007049" || productId == "80007050" || productId == "80007051") {
                let cityCount = await this.findAcceptCity(_this, productId, locationId);
                if (orderSourceId == '10000') {
                    if (cityCount.length <= 0 && name == "A端城市") {
                        _this.$confirm(name + "：不符合城市选择规则，请重新选择!", "提示", {
                            confirmButtonText: "关闭",
                            showCancelButton: false,
                            type: 'warning',
                            center: true,
                        })
                        return false;
                    }
                    else if (cityCount.length <= 0 && name == "Z端城市" && zjType != "30950002") {
                        _this.$confirm(name + "：不符合城市选择规则，请重新选择!", "提示", {
                            confirmButtonText: "关闭",
                            showCancelButton: false,
                            type: 'warning',
                            center: true,
                        })
                        return false;
                    }
                }
            }
            if (soure == '10000' && (val.provice == 24976 || val.provice == 26177 || val.provice == 26176)) {
                // 台湾  澳门  香港
                _this.$confirm(name + "：市为香港、澳门、台湾，A端运营商不能选择中国电信！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return false;
            }
        } else {
            //境外限制
            //A端业务:CE国家为非中国时，cE省份必填;
            //B端业务:CE国家为非中国时，可只选到国家;
            if (orderSourceId == '10000' && val.provice == '') {
                _this.$confirm(name + "：省份不能为空！", "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return false
            }
            if (productId == "80007048" || productId == "80007049" || productId == "80007050" || productId == "80007051") {
                if (val.provice) {
                    locationId = val.provice;
                } else {
                    locationId = val.country;
                }
                let cityCount = await this.findAcceptCity(_this, productId, locationId);
                if (orderSourceId == '10000') {
                    if (cityCount.length <= 0 && name == "A端城市") {
                        _this.$confirm(name + "：不符合城市选择规则，请重新选择!", "提示", {
                            confirmButtonText: "关闭",
                            showCancelButton: false,
                            type: 'warning',
                            center: true,
                        })
                        return false;
                    }
                    else if (cityCount.length <= 0 && name == "Z端城市" && zjType != "30950002") {
                        _this.$confirm(name + "：不符合城市选择规则，请重新选择!", "提示", {
                            confirmButtonText: "关闭",
                            showCancelButton: false,
                            type: 'warning',
                            center: true,
                        })
                        return false;
                    }
                }
            }
            if (soure == '10000') {
                let msg = "";
                if (name == "A端城市") {
                    msg = "：为境外点，A端运营商不能选择中国电信！"
                } else {
                    msg = "：为境外点，Z端运营商不能选择中国电信！"
                }
                _this.$confirm(name + msg, "提示", {
                    confirmButtonText: "关闭",
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                })
                return false
            }
        }
        return true
    },
    //查找当前城市是否可用
    async findAcceptCity(_this, productId, locationId) {
        let pamars = {
            interFaceType: "ORDER",
            sqlId: 202208100001,
            paramStr: "locationId:" + locationId + ";productId:" + productId
        };
        const result = await OrderService.executeSql(pamars);
        if (result.code == 200) {
            if (result.meta.resList && result.meta.resList.executeSqlResps.length > 0) {
                return result.meta.resList.executeSqlResps
            } else {
                return []
            }
        } else {
            _this.$message.error("城市查询失败！");
            return []
        }
    },
    //转换时间戳 day 天数 flag 1加 2减
    switchTimeDay(value, day, flag) {
        if (value) {
            let date = new Date(value.replace(/-/g, "/"));
            if (flag == 1) {
                return date.getTime() + 1000 * 60 * 60 * 24 * day
            } else if (flag == 2) {
                return date.getTime() - 1000 * 60 * 60 * 24 * day
            } else {
                return date.getTime()
            }
        } else {
            return 0;
        }
    },
    //计算2个日期之间相差的天数  //sDate1和sDate2是2017-09-25格式
    dateDiff(sDate1, sDate2) {
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]) //转换为9-25-2017格式  
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2])
        iDays = (oDate2.getTime() - oDate1.getTime()) / (1000 * 60 * 60 * 24);
        return iDays
    },
    //当前日期的下一年减一
    nextYear() {
        let time = new Date();
        let year = time.getFullYear() + 1;
        let month = time.getMonth() + 1;
        let day = time.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day > 1) {
            day = day - 1;
        } else {
            month = month - 1;
            if (month < 10) {
                month = "0" + month;
            }
            if (month == 0) {
                month = 12;
            }
            day = new Date(year, month, 0).getDate();
        }
        return year + "-" + month + "-" + day;
    },
    //业务销售省回显
    async getUniName(_this, key) {
        if (!_this.formData[key].value) return;
        let params = {
            interFaceType: "ORDER",
            sqlId: 20230307001,
            paramStr: "accountUnitCode:" + _this.formData[key].value,
        };
        const result = await OrderService.executeSql(params);
        if (result.code == "200") {
            if (result.meta.resList.executeSqlResps.length > 0) {
                _this.formData[key].text = result.meta.resList.executeSqlResps[0].accountUnitName
            }
        }
    },
    //idc非新装和补点 限制一次费不能超过20000
    idcAcctItemLimit(_this) {
        for (let key in _this.formData) {
            let item = _this.formData[key];
            if (item.tableName == "ACCT_ITEM" && item.colId == 'amount') {
                _this.SetRequired({
                    attrName: "",
                    formkey: key,
                    reqName: "amount20000",
                    reqStatus: true,
                });
            }
        }
    },
    /**
     * chengxiang   add   2023.4.4 
     * 需求描述：需求单发起的需求单送审前明细，订单发起的订单送审前明细可修改装机地址（只能同城市改变地址）
     * 统一地址库选址产品：mstp(80008007) ipran(80020160) sdh(80008002) 云专网3.0(540098330) 互联网专线(540100333)  政企lan(80008048)
     *                   ip虚拟专网产品-普通点(80007005) IP虚拟专网-189/190VPN(80007006) IP虚拟专网-MULTI-VRF(80007007)
     *                   ip虚拟专网产品-NNI(80007008)   IP虚拟专网-X站点(80007009)       IP虚拟专网-内部vpn电路(80030460)
     * gis选址产品：otn精品专线
     * data 获取新装明细信息  structId1甲端结构id  structId2乙端结构id  zycStructId资源池结构id（资源池显示时地址不可修改）
    */
    addressDesc(_this, data, structId1, structId2, zycStructId) {
        let ppmCondition = JSON.parse(sessionStorage.getItem("ppmCondition"));
        let changeRow = JSON.parse(sessionStorage.getItem("changeRow"));
        let indexCode = [];//城市code
        if (structId1) {
            _this.formData[structId1 + "-100010640"].disabled = "county,province,city,area";
            //资源池展示有值时   装机地址禁用
            if (zycStructId && _this.formData[zycStructId + "-142001052"].isshow && _this.formData[zycStructId + "-142001052"].value) {
                _this.formData[structId1 + "-100013021"].disabled = true;
            }
        }
        if (structId2) {
            _this.formData[structId2 + "-100010640"].disabled = "county,province,city,area";
            //资源池展示有值时   装机地址禁用
            if (zycStructId && _this.formData[zycStructId + "-142001052"].isshow && _this.formData[zycStructId + "-142001052"].value) {
                _this.formData[structId2 + "-100013021"].disabled = true;
            }
        }
        // 送审前明细  禁用城市  只能通过选址
        data.ORD_PROD_INST.forEach(item => {
            if (structId1 && !structId2 && item.roleCd == 0) {//0端
                indexCode = item.indexCode ? item.indexCode.split("_") : [];
                _this.formData[structId1 + "-100010640"].options[0].country = indexCode[1] ? Number(indexCode[1]) : "";
                _this.formData[structId1 + "-100010640"].options[0].provice = indexCode[2] ? Number(indexCode[2]) : "";
                _this.formData[structId1 + "-100010640"].options[0].city = indexCode[3] ? Number(indexCode[3]) : "";
                _this.formData[structId1 + "-100010640"].options[0].area = indexCode[4] ? Number(indexCode[4]) : "";
                //内部vpn增加批量导入电路开通-lb 条件增加非内部vpn产品 80030460!=ppmCondition.productId 2023年8月24日edit
                if (indexCode[1] == 26068 && indexCode[2] != 26177 && indexCode[2] != 24976 && indexCode[2] != 26176 && 80030460 != ppmCondition.productId) {
                    //中国并且非港澳台选址不可手动修改
                    _this.formData[structId1 + "-100013021"].dateLimit = "readonly";
                }
            } else {//100端和200端
                if (item.roleCd == 100) {
                    indexCode = item.indexCode ? item.indexCode.split("_") : [];
                    _this.formData[structId1 + "-100010640"].options[0].country = indexCode[1] ? Number(indexCode[1]) : "";
                    _this.formData[structId1 + "-100010640"].options[0].provice = indexCode[2] ? Number(indexCode[2]) : "";
                    _this.formData[structId1 + "-100010640"].options[0].city = indexCode[3] ? Number(indexCode[3]) : "";
                    _this.formData[structId1 + "-100010640"].options[0].area = indexCode[4] ? Number(indexCode[4]) : "";
                    if (indexCode[1] == 26068 && indexCode[2] != 26177 && indexCode[2] != 24976 && indexCode[2] != 26176) {
                        //中国并且非港澳台选址不可手动修改
                        _this.formData[structId1 + "-100013021"].dateLimit = "readonly";
                    }
                } else if (item.roleCd == 200) {
                    indexCode = item.indexCode ? item.indexCode.split("_") : [];
                    _this.formData[structId2 + "-100010640"].options[0].country = indexCode[1] ? Number(indexCode[1]) : "";
                    _this.formData[structId2 + "-100010640"].options[0].provice = indexCode[2] ? Number(indexCode[2]) : "";
                    _this.formData[structId2 + "-100010640"].options[0].city = indexCode[3] ? Number(indexCode[3]) : "";
                    _this.formData[structId2 + "-100010640"].options[0].area = indexCode[4] ? Number(indexCode[4]) : "";
                    if (indexCode[1] == 26068 && indexCode[2] != 26177 && indexCode[2] != 24976 && indexCode[2] != 26176) {
                        //中国并且非港澳台选址不可手动修改
                        _this.formData[structId2 + "-100013021"].dateLimit = "readonly";
                    }
                }
            }
        });
        if (!"4010100000,4040700001,4041000000,4040098061".includes(changeRow.serviceOfferId)) {
            //非新装、补点、补录或地址变更
            if (structId1) {
                _this.formData[structId1 + "-100013021"].disabled = true;
            }
            if (structId2) {
                _this.formData[structId2 + "-100013021"].disabled = true;
            }
        } else {
            //地址变更   双端产品只能变更 地址改变的那一端
            if (changeRow.serviceOfferId == "4041000000") {
                data.ORDER_ITEM_ATTR_MODIFY.forEach(item => {
                    if (item.attrValueCd == "OTN_ADDRESS_DESC" && item.oldAttrValue !== item.attrValue) {
                        if (item.roleCd == 100) {
                            //乙端禁用
                            _this.formData[structId2 + "-100013021"].disabled = true;
                        } else if (item.roleCd == 200) {
                            //甲端禁用
                            _this.formData[structId1 + "-100013021"].disabled = true;
                        }
                    }
                })
            }
        }
        if (
            (ppmCondition.optionId == 310 && changeRow.handleStateCd == "50030002") ||
            (ppmCondition.optionId == 312 && changeRow.handleStateCd == "50030003")
        ) { }
        else {
            if (structId1) {
                _this.formData[structId1 + "-100013021"].disabled = true;
            }
            if (structId2) {
                _this.formData[structId2 + "-100013021"].disabled = true;
            }
        }
    },
    //资源预占天数字段限制 新装补点限制30  资源续占变更限制15天
    zyyzLimit(_this, num) {
        for (let key in _this.formData) {
            let item = _this.formData[key];
            if (item.colId == '100013675') {
                _this.SetRequired({
                    attrName: "",
                    formkey: key,
                    reqName: "pintegerLimit" + num,
                    reqStatus: true,
                });
                let ele = document.getElementById(key).getElementsByTagName("input")[0];
                ele.addEventListener("blur", () => {
                    if (_this.formData[key].oldValue != _this.formData[key].value) {
                        _this.$message({
                            message: "资源预占时间到期后如果尚未转订，系统会自动停开单据、释放资源。",
                            type: "info",
                        });
                    }
                });
                break;
            }
        }
    },
    /**
     * chengxiang   add   2023.8.1 
     * 需求描述：集团发起的国内业务  收款单位改变   委托收款单位原来有值的情况下自动默认并提示  委托收款单位可修改
     * 特殊：国际费用收款单位不做处理，仍按当前规则
     * 产品：MSTP、SDH、IPRAN、IP虚拟专网（IP虚拟专网-普通点、IP虚拟专网189/190VPN、IP虚拟专网MULTI-VRF）互联网专线、政企宽带LAN；
     * 实参：eleType--电路类型  id1--收款单位id  id2--委托收款单位id   id1,id2为数组表示批量选择收款单位
    */
   async autoConOrg(_this, eleType, id1, id2) {
        let changeRow = JSON.parse(sessionStorage.getItem("changeRow"));//当前单子销售品信息
        let staff = changeRow.createStaff;
        //查询当前登陆人所属部门 
        let param = {
            interFaceType: "ORDER",
            sqlId: "20240119001",
            paramStr: "staffId:" + staff,
          };
          let ret = await OrderService.executeSql(param);
          let indexCode =  '';
          if (
            ret.meta.resList.executeSqlResps.length > 0 &&
            ret.meta.resList &&
            ret.meta.resList.executeSqlResps
          ) {
            indexCode =  ret.meta.resList.executeSqlResps[0].indexCode;
          }

          let departmentId =  indexCode.substr(indexCode.lastIndexOf("_") +1,indexCode.length+1);
         // ZQXQGL-20250107374820 集团CRM系统B端业务国际部人员录入JT开头流水号订单收款单位限制 集团公司国际部 委托收费单位不跟着收费单位一起变
        if (departmentId !="1947362" && eleType && changeRow.createOrgId == "1944640" && "9006001,9006002,9006005".includes(eleType)) {
            // "9006001,9006002,9006005"  本地电路 省内电路  省际电路
            // 集团发起的国内业务
            if (Array.isArray(id1)) {
                let flag = false;//批量时，委托收款单位原来是否有值  true 有值  false 无值
                //为数组代表批量选择收款单位（IP虚拟专网、MSTP、SDH 账务变更）
                id1.forEach((keyS, index) => {
                    let keyW = id2[index];//相对应的委托单位id
                    if (_this.formData[keyW].value) {//原来如果有值 委托收款单位才去默认
                        flag = true;
                        _this.formData[keyW].value = _this.formData[keyS].value;//委托收款单位  默认收款单位值
                        _this.formData[keyW].text = _this.formData[keyS].text;//委托收款单位  默认收款单位名称
                    }
                })
                if (flag) {
                    _this.$message.info(`此条电路或此批电路中，委托收款单位已同时变更为 “${_this.formData[id1[0]].text}”，请注意收款单位与委托收款单位关系是否准确`);
                }
            } else {
                if (_this.formData[id2].value) {//原来如果有值  委托收款单位才去默认
                    _this.formData[id2].value = _this.formData[id1].value;//委托收款单位  默认收款单位值
                    _this.formData[id2].text = _this.formData[id1].text;//委托收款单位  默认收款单位名称
                    _this.$message.info(`此条电路或此批电路中，委托收款单位已同时变更为 “${_this.formData[id2].text}”，请注意收款单位与委托收款单位关系是否准确`);
                }
            }
        }
    },
    /**
     * chengxiang   add  2023.8.31
     * 需求描述：otn产品受理开通时，支持点到多点时，填写多VLAN，最多不多于5个，用英文逗号隔开
     * 特殊：是否标准化场景：“否”，点到多点场景下，甲乙端VLAN时隙号支持输入5个1-4096间整数，用英文逗号隔开
     *      是否标准化场景：“是”，点到多点场景下，甲乙端VLAN时隙号仅支持输入1-4096的整数
     * 产品：otn精品专线
     * 实参：val：VLAN值  id:需要清空的属性id  flag：1-是标准化场景  2-不是标准化场景
    */
    validNumber(_this, id, val, flag) {
        //校验汇聚VLAN序号/时隙号值
        if (!val) return;//为空不进行校验
        let reg = /^[1-9]{1}[\d]*$/;//正整数校验正则
        if (flag == 2) {
            //标准化场景选择否  校验多个
            let lock = false; //为true则表示规则不通过要提示并清空
            let valArr = val.split(",");
            if (valArr.length > 5) {
                //数量超过5个
                lock = true;
            } else {
                for (let index = 0; index < valArr.length; index++) {
                    const item = valArr[index];
                    if (!reg.test(item) || Number(item) > 4096) {
                        //循环校验不符合正整数和必须小于4096的规则 跳出循环
                        lock = true;
                        break
                    }
                }
                if (!lock) {
                    //以上校验通过 则判断值是否有重复
                    let arr = valArr.sort((a, b) => {
                        return a - b
                    })//从小到大排序
                    for (let index = 0; index < arr.length; index++) {
                        if (arr[index] == arr[index + 1]) {
                            //有重复值 跳出循环
                            lock = true;
                            break
                        }
                    }
                }
            }
            if (lock) {
                _this.$message.warning({
                    message: "是否标准化场景为“否”时，支持填写1~5个VLAN/时隙号，每个号在1~4096范围内且为整数，不可重复，英文逗号隔开！",
                    showClose: true,
                });
                _this.formData[id].value = "";
            }
        } else {
            ////标准化场景选择是 校验单个
            if (!reg.test(val) || Number(val) > 4096) {
                //循环校验不符合正整数和必须小于4096的规则
                _this.$message.warning({
                    message: "是否标准化场景为“是”时，仅支持填写1个VLAN/时隙号，每个号在1-4096范围内且为整数，如想输入多个号，请修改是否标准化场景字段为否！",
                    showClose: true,
                });
                _this.formData[id].value = "";
            }
        }
    },


    //增加集团IDC价格审批环节-lb 2025年7月-----------开始-------------
    //查询客户名称 //增加集团IDC价格审批环节-lb 2025年7月 add方法 注意上个方法后的逗号要加
    async qryCustName(custId){
        let params = {
            interFaceType: "CUST",
            sqlId: "2021102601",
            paramStr: 'custId:' + custId,
        }
        let result = await OrderService.executeSql(params);
        if (result.meta.resList.executeSqlResp && result.meta.resList.executeSqlResp.length > 0) {
            return result.meta.resList.executeSqlResp[0].custName;
        }
        return "";
  
      },
  
      //增加集团IDC价格审批环节-lb 2025年5月 add方法 天翼云业务类型
      //客户名称包含“天翼云”的客户，并且月租费每月小于100元时 天翼云业务类型 必填 此方法用于机架出租 批量修改订单、需求单 3个页面
      async tianyiCloudTypeShow(_this,isInit) {
  
        let CTOInfos = _this.$parent.CTOInfo;
        console.log("tianyiCloudTypeShow---CTOInfos:",CTOInfos)
        let custId = CTOInfos[0].custId;
  
        let reqFlag = false; //是否必填标记
        //如果符合下面条件，展示必填
        let custName = await this.qryCustName(custId);
        console.log("tianyiCloudTypeShow---客户名称:",custName)
  
        if(custName.includes("天翼云")){ //forTest
            let fee = _this.o[100011340].value; //租用费
            let unit = _this.o[100010191].value; //租用费单位
        
            let sum = 100;
            if(unit == '30560001'){
                sum = sum * 1;
            }else if(unit == '30560002'){
                sum = sum * 3;
            }else if(unit == '30560003'){
                sum = sum * 6;
            }else if(unit == '30560004'){
                sum = sum * 12;
            }
            console.log("--fee:",fee)
            console.log("--sum:",sum)
            if(fee && unit && fee<sum ){ //相当于每月小于100
                console.log("tianyiCloudTypeShow---必填:")
                reqFlag = true;
            }
        }
  
        if(reqFlag){
            _this.o[100000001664].isshow = true;
            _this.o[100000001664].disabled = false; //可改
            _this.changeIntegrantCom([_this.k[100000001664]]);//必填
        }else{
            console.log("tianyiCloudTypeShow---非必填:")
            _this.o[100000001664].isshow = false;
            _this.o[100000001664].disabled = true; //不可改
            _this.changeUnIntegrantCom([_this.k[100000001664]]);//非必填
            if(!isInit) {
                _this.o[100000001664].value = ''; //非初始化清空值
                //为了保证批量修改需求单订单页面能清空
                if(CTOInfos.length>0 && !_this.o[100000001664].oldValue){
                    _this.o[100000001664].oldValue = " ";//要给个占位符号 空格 ，避免保存前拼装报文拼不进去
                }
            }
            
        }
    },


    //增加集团IDC价格审批环节-lb 2025年7月 add方法 天翼云业务类型
    //客户名称包含“天翼云”的客户，并且月租费每月小于100元时 天翼云业务类型 必填 此方法用于互联网带宽出租 批量修改订单、需求单 3个页面
    async tianyiCloudTypeShow2(_this,isInit) {
        
        let CTOInfos = _this.$parent.CTOInfo;
        console.log("tianyiCloudTypeShow2---isInit:",isInit)
        console.log("tianyiCloudTypeShow2---CTOInfos:",CTOInfos)
        let custId = CTOInfos[0].custId;
        if(CTOInfos.length>1){
            //批量处理不走下面逻辑
            return;
        }

        // //如果符合下面条件，展示必填
        // console.log("custId-----:",custId)
        let custName = await this.qryCustName(custId);
        // console.log("tianyiCloudTypeShow2---客户名称:",custName)
  
        if(custName.includes("天翼云")){ //forTest
            // ①接入类型为“互联网动态速率独享端口接入服务、互联网动态速率独享端口区域访问服务”时
            // 1)阶梯计费类型为“无”，且保底单价小于4.17元/M/月
            // 2)阶梯计费类型为“区间计费、阶梯计费”，任意一个区间的单价小于4.17元/M/月
            // 3)阶梯计费类型为“最优计费”，任意一个区间的单价小于此费用，以下图为例：用100000元/10000M，300000元/20000M，计算出所有区间单价，和4.17元/M/月比较，任意一个区间的单价小于4.17元/M/月
            let accessType = _this.o[100010968].value; //接入类型
            let stepCharge = _this.o[142000813].value; //阶梯计费类型
            let floorPrice = _this.o[100010866].value; //保底单价(元/M)

            let floorSpeed =  _this.o[100010767].value;
            if(isInit){
                floorSpeed = _this.o[100010767].value.replace("M", ""); //初始化特殊处理
            }

            //还需要 流量区间插件 this.flowInterval 、保底速率 this.speed
            let rentFee = _this.o[100012004].value; //租用费
            let rentUnit = _this.o[100010191].value; //租用费单位
            //流量区间
            let flowInterval = _this.flowInterval;
            if(isInit){
                flowInterval = _this.o[142001025].value;
            }
            await this.tianyiCloudTypeShow3(_this,isInit,custId,accessType,stepCharge,floorPrice,floorSpeed,rentFee,rentUnit,flowInterval);

        }


    },

    //增加集团IDC价格审批环节-lb 2025年7月
    //客户名称包含“天翼云”的客户，并且月租费每月小于100元时 天翼云业务类型 必填 此方法用于互联网带宽出租 批量修改订单、需求单 3个页面
    async tianyiCloudTypeShow3(_this,isInit,custId,accessType,stepCharge,floorPrice,floorSpeed,rentFee,rentUnit,flowInterval) {
        console.log("tianyiCloudTypeShow3---isInit:"+isInit+"accessType:"+accessType+";stepCharge:"+stepCharge+";floorPrice:"+floorPrice+";floorSpeed:"+floorSpeed+";rentFee:"+rentFee+";rentUnit:"+rentUnit);
        // let CTOInfos = _this.$parent.CTOInfo;
        // console.log("tianyiCloudTypeShow---CTOInfos:",CTOInfos)
        // let custId = CTOInfos[0].custId;

        // let accessType = _this.o[100010968].value; //接入类型
        // let stepCharge = _this.o[142000813].value; //阶梯计费类型
        // let floorPrice = _this.o[100010866].value; //保底单价(元/M)
        //还需要 流量区间插件 this.flowInterval 、保底速率 this.speed
  
        let reqFlag = false; //是否必填标记
        //如果符合下面条件，展示必填
        let custName = await this.qryCustName(custId);
        console.log("tianyiCloudTypeShow3---客户名称:",custName)
  
        if(custName.includes("天翼云")){ //forTest
            // ①接入类型为“互联网动态速率独享端口接入服务、互联网动态速率独享端口区域访问服务”时
            // 1)阶梯计费类型为“无”，且保底单价小于4.17元/M/月
            // 2)阶梯计费类型为“区间计费、阶梯计费”，任意一个区间的单价小于4.17元/M/月
            // 3)阶梯计费类型为“最优计费”，任意一个区间的单价小于此费用，以下图为例：用100000元/10000M，300000元/20000M，计算出所有区间单价，和4.17元/M/月比较，任意一个区间的单价小于4.17元/M/月
                //获取流量区间值
                // let flowInterval = _this.flowInterval;
                // if(isInit){
                //     flowInterval = _this.o[142001025].value;
                // }
            if(accessType == 31610004 || accessType == 31610005){
                if(stepCharge == 13113001){ //阶梯计费类型为“无”
                if(floorPrice && floorPrice < 4.17 ){ //和需求婷姐沟通，这种情况 默认就是 每月
                    reqFlag = true;
                }
                }else if(stepCharge == 13113002 || stepCharge == 13113003){ //区间计费、阶梯计费
                    
                    console.log("qj---------:",flowInterval)
                    if(Array.isArray(flowInterval)){
                        for (let i = 0; i < flowInterval.length; i++) {
                            let e1 = flowInterval[i];
                            let e = e1; //明细初始化时，这些插件值要特殊处理
                            if(e1.FLOWRATE_PRICE){
                                let obj = {};
                                obj.attchSeq = e1.ATTCH_SEQ;
                                obj.flowrateMin = e1.FLOWRATE_MIN;
                                obj.flowrateMax = e1.FLOWRATE_MAX;
                                obj.flowrateUnit = e1.FLOWRATE_UNIT;
                                obj.flowratePrice = e1.FLOWRATE_PRICE;
                                obj.flowKelidu = e1.FLOW_KELIDU;
                                obj.flowChaoePrice = e1.FLOW_CHAOE_PRICE;
                                obj.flowJichuyuezuPrice = e1.FLOW_JICHUYUEZU_PRICE;
                                e = obj;//都转为小写最后比较
                            }
    
                            if(e.flowratePrice && e.flowratePrice < 4.17){
                                reqFlag = true;
                                break;
                            }
                        }
                    }
                }else if(stepCharge == 13113004){ //最优计费
                    if(Array.isArray(flowInterval)){
                        for (let i = 0; i < flowInterval.length; i++) {
                            let e1 = flowInterval[i];
                            console.log("e1----:",e1)
                            let e = e1;
                            if(e1.FLOWRATE_PRICE || e1.FLOW_JICHUYUEZU_PRICE){
                                let obj = {};
                                obj.attchSeq = e1.ATTCH_SEQ;
                                obj.flowrateMin = e1.FLOWRATE_MIN;
                                obj.flowrateMax = e1.FLOWRATE_MAX;
                                obj.flowrateUnit = e1.FLOWRATE_UNIT;
                                obj.flowratePrice = e1.FLOWRATE_PRICE;
                                obj.flowKelidu = e1.FLOW_KELIDU;
                                obj.flowChaoePrice = e1.FLOW_CHAOE_PRICE;
                                obj.flowJichuyuezuPrice = e1.FLOW_JICHUYUEZU_PRICE;
                                e = obj;//都转为小写最后比较
                            }

                            if(e.flowJichuyuezuPrice && e.flowrateMax){
                                let u = 1; //单位倍率 M 1  G 1024
                                if(e.flowrateUnit == 20){
                                    u = 1024;
                                }
                                if(e.flowJichuyuezuPrice/e.flowrateMax/u < 4.17){
                                    reqFlag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }else if(accessType){//接入类型为其他时
                
                let fee = rentFee; //租用费
                let unit = rentUnit; //租用费单位

                console.log("floorSpeed--------", floorSpeed);
                if (floorSpeed.indexOf("G") != -1) {
                    floorSpeed = Number(floorSpeed.slice(0, floorSpeed.length - 1)) * 1024 + "";
                } else if (floorSpeed.indexOf("M") != -1) {
                    floorSpeed = Number(floorSpeed.slice(0, floorSpeed.length - 1)) + "";
                }

                if(fee && unit && floorSpeed){
                    let sum = 4.17;
                    if(unit == '30560001'){
                        sum = sum * 1;
                    }else if(unit == '30560002'){
                        sum = sum * 3;
                    }else if(unit == '30560003'){
                        sum = sum * 6;
                    }else if(unit == '30560004'){
                        sum = sum * 12;
                    }else{
                        return; //单位没有直接返回
                    }
                    console.log("tianyiCloudTypeShow---fee:",fee)
                    console.log("tianyiCloudTypeShow---unit:",unit)
                    if( fee/floorSpeed <sum){ //费用除以速率 和 sum比 相当于每M每月小于4.17
                        reqFlag = true;
                    }
                }
                
            }
            
        }
    
        if(reqFlag){
            _this.o[100000001664].isshow = true;
            _this.o[100000001664].disabled = false; //可改
            _this.changeIntegrantCom([_this.k[100000001664]]);//必填
            console.log("tianyiCloudTypeShow---必填")
            if(!_this.o[100000001664].value){
                return "请选择 天翼云业务类型！"
            }
            
        }else{
            _this.o[100000001664].disabled = true; //不可改
            _this.changeUnIntegrantCom([_this.k[100000001664]]);//非必填
            if(!isInit) {
                _this.o[100000001664].value = ''; //非初始化清空值
                //为了保证批量修改需求单订单页面能清空
                if(!_this.o[100000001664].oldValue){
                    _this.o[100000001664].oldValue = " "; //要给个占位符号 空格 ，避免保存前拼装报文拼不进去
                }
            }
            _this.o[100000001664].isshow = false;
            console.log("tianyiCloudTypeShow---非必填:")
        }
        return "";
    },



    //根据custId、订单项想id集合、属性Id集合查询属性值 //增加集团IDC价格审批环节-lb 2025年7月
    async qryAttrOrd(custId,orderItemIdList,attrIdList) {
        // console.log("this.row----:",this.row) 上一步勾选的订单项信息列表
        //查询过程属性
        let params = {
            interFaceType: "ORDER",
            sqlId: 20240731002,
            // paramStr: "orderItemIdList:" + this.row.orderItemId + ";custId:" + this.row.custId + ";attrIdList:100000581,142002916,141000252,100000554",
            paramStr: "orderItemIdList:" + orderItemIdList + ";custId:" + custId + ";attrIdList:"+attrIdList,
        };
        console.log("qryAttrOrd--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryAttrOrd--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResps.length > 0) {
                let list = result.meta.resList.executeSqlResps;
                console.log("qryAttrOrd--list:", list)
                return list;
            }
        }
        return "";
    },

     //根据custId、订单项想id集合、属性Id集合查询属性值 //增加集团IDC价格审批环节-lb 2025年7月
     async qryAttrInst(custId,offerInstIdList,attrIdList) {
        // console.log("this.row----:",this.row) 上一步勾选的订单项信息列表
        //查询过程属性
        let params = {
            interFaceType: "CUST",
            sqlId: 20240731001,
            paramStr: "offerInstIdList:" + offerInstIdList + ";custId:" + custId + ";attrIdList:"+attrIdList,
        };
        console.log("qryAttrInst--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryAttrInst--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResp.length > 0) {
                let list = result.meta.resList.executeSqlResp;
                console.log("qryAttrInst--list:", list)
                return list;
            }
        }
        return "";
    },

    //根据custId、orderItemIdList、账目项iD 查询月租费 //增加集团IDC价格审批环节-lb 2025年7月
    async qryFeeInfo(custId,orderItemIdList,acctItemTypeId) {
        //查询过程属性
        let params = {
            interFaceType: "ORDER",
            sqlId: 20250714001,
            paramStr: "orderItemIdList:" + orderItemIdList + ";custId:" + custId + ";acctItemTypeId:"+acctItemTypeId,
        };
        console.log("qryFeeInfo--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFeeInfo--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResps.length > 0) {
                let list = result.meta.resList.executeSqlResps;
                console.log("qryFeeInfo--list:", list)
                return list;
            }
        }
        return "";
    },

    //根据custId、offerInstIdList、账目项iD 查询月租费 //增加集团IDC价格审批环节-lb 2025年7月
    async qryFeeInfoInst(custId,offerInstIdList,acctItemTypeId) {
        //查询过程属性
        let params = {
            interFaceType: "CUST",
            sqlId: 20250716001,
            paramStr: "offerInstIdList:" + offerInstIdList + ";custId:" + custId + ";acctItemTypeId:"+acctItemTypeId,
        };
        console.log("qryFeeInfoInst--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFeeInfoInst--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResp.length > 0) {
                let list = result.meta.resList.executeSqlResp;
                console.log("qryFeeInfoInst--list:", list)
                return list;
            }
        }
        return "";
    },

    //根据custId、orderItemIdList、attrId 查询FEE_ATTR //增加集团IDC价格审批环节-lb 2025年7月
    async qryFeeAttr(custId,orderItemIdList,attrId) {
        //查询过程属性
        let params = {
            interFaceType: "ORDER",
            sqlId: 20250714002,
            paramStr: "orderItemIdList:" + orderItemIdList + ";custId:" + custId + ";attrId:"+attrId,
        };
        console.log("qryFeeAttr--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFeeAttr--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResps.length > 0) {
                let list = result.meta.resList.executeSqlResps;
                console.log("qryFeeAttr--list:", list)
                return list;
            }
        }
        return "";
    },

    //根据custId、offerInstIdList、attrId 查询FEE_ATTR //增加集团IDC价格审批环节-lb 2025年7月
    async qryFeeAttrInst(custId,offerInstIdList,attrId) {
        //查询过程属性
        let params = {
            interFaceType: "CUST",
            sqlId: 20250716002,
            paramStr: "offerInstIdList:" + offerInstIdList + ";custId:" + custId + ";attrId:"+attrId,
        };
        console.log("qryFeeAttr--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFeeAttr--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResp.length > 0) {
                let list = result.meta.resList.executeSqlResp;
                console.log("qryFeeAttr--list:", list)
                return list;
            }
        }
        return "";
    },


    //根据custId、procIdList查询价格区间ORD_PROD_FLOWRATE_INTERVAL //增加集团IDC价格审批环节-lb 2025年7月
    async qryFlowrateInterval(custId,procIdList) {
        //查询过程属性
        let params = {
            interFaceType: "ORDER",
            sqlId: 20250714003,
            paramStr: "procIdList:" + procIdList + ";custId:" + custId ,
        };
        console.log("qryFlowrateInterval--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFlowrateInterval--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResps.length > 0) {
                let list = result.meta.resList.executeSqlResps;
                console.log("qryFlowrateInterval--list:", list)
                return list;
            }
        }
        return "";
    },

    //根据custId、prodIdList查询价格区间ORD_PROD_FLOWRATE_INTERVAL //增加集团IDC价格审批环节-lb 2025年7月
    async qryFlowrateIntervalInst(custId,prodIdList) {
        //查询过程属性
        let params = {
            interFaceType: "CUST",
            sqlId: 20250716003,
            paramStr: "prodIdList:" + prodIdList + ";custId:" + custId ,
        };
        console.log("qryFlowrateIntervalInst--请求:", params);
        const result = await OrderService.executeSql(params);
        console.log("qryFlowrateIntervalInst--返回:", result);
        if (result.code == 200) {
            if (result.meta.resList.executeSqlResp.length > 0) {
                let list = result.meta.resList.executeSqlResp;
                console.log("qryFlowrateIntervalInst--list:", list)
                return list;
            }
        }
        return "";
    },

    //两个对象比较属性是否相同 //增加集团IDC价格审批环节-lb 2025年7月
    objEqual(objA, objB) {
        // 检查是否为同一个对象引用
        if (objA === objB) return true;

        // 检查是否都是对象（排除 null）
        if (typeof objA !== 'object' || objA === null || 
            typeof objB !== 'object' || objB === null) {
            return false;
        }

        // 获取所有属性名
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        // 检查属性数量是否相同
        if (keysA.length !== keysB.length) return false;

        // 递归比较每个属性
        return keysA.every(key => {
            // 检查属性是否都存在
            if (!objB.hasOwnProperty(key)) return false;
            
            // 递归比较属性值
            return this.objEqual(objA[key], objB[key]);
        });
    },
    // 示例
    // console.log(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })); // true
    // console.log(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })); // false
    // console.log(deepEqual({ a: [1, 2] }, { a: [1, 2] }));     // true

    //批量时，控制 天翼云业务类型 字段清空或者必填方法 //增加集团IDC价格审批环节-lb 2025年7月 add 互联网带宽出租批量修改订单需求单使用
    //6个属性才能控制新加的属性是否展示，批量时，页面上有就用页面上的，没有查询原单，查询原单的属性属性比较，必须一致才能提交保存
    //【注意：这个方法只能放到beforeSave方法中，不能放到customSave】
    async batchContrlTyy(_this){
        let msg = "";
        let CTOInfos = _this.$parent.CTOInfo;
        console.log("batchContrlTyy---CTOInfos:",CTOInfos)
        let custId = "";
        let orderItemIdArr = "";
        if(CTOInfos instanceof Array){ //批量选中的订单项数组
            custId = CTOInfos[0].custId;
            orderItemIdArr = CTOInfos.map(item => item.orderItemId);
        }else{
            custId = CTOInfos.custId;
            orderItemIdArr = [CTOInfos.orderItemId];
        }
        let custName = await this.qryCustName(custId);
        console.log("batchContrlTyy---客户名称2:",custName)
        //客户名称没有天翼云不走
        if(!custName.includes("天翼云")){
          return ""; //forTest
        }
        
        //首先查询当前选中的所有单子的  接入类型、阶梯计费类型、保底单价(元/M)、流量区间（流量区间还是个集合多条）、保底速率、租用费，租用费单位
        let idArr = "100010968,142000813,100010866,100010767".split(",");
        let nameDic = {
          "100010968":"接入类型",
          "142000813":"阶梯计费类型",
          "100010866":"保底单价",
          "100010767":"保底速率",
        };
        
        let pageObj = {};
        //页面上没有回显值的相关属性
        let difIds = [];
        //页面上有回显值的属性用页面上的值，没有的先给空值
        for (let i = 0; i < idArr.length; i++) {
          const e = idArr[i];
          if(!_this.o[e] || !_this.o[e].value){
            difIds.push(e);
            pageObj[e] = "";
          }else{
            pageObj[e] = _this.o[e].value;
          }
        }
         //然后排除当前页面上 上面这些属性 有值的属性，剩余的属性比较，必须一致才能提交保存
        let accessType = pageObj[100010968]; //接入类型
        let stepCharge = pageObj[142000813]; //阶梯计费类型
        let floorPrice = pageObj[100010866]; //保底单价(元/M)
        let floorSpeed = pageObj[100010767]; //保底速率

        let rentFee =  _this.o[100012004]?_this.o[100012004].value:""; //租用费
        let rentUnit = _this.o[100010191]?_this.o[100010191].value:""; //租用费单位
        let flowInterval = _this.o[142001025]?_this.o[142001025].value:""; //流量区间

        //如果页面上这些相关属性都是空，那么不操作直接返回
        console.log("accessType:"+accessType+";stepCharge:"+stepCharge+";floorPrice:"+floorPrice+";floorSpeed:"+floorSpeed+";rentFee:"+rentFee+";rentUnit:"+rentUnit)
        console.log("flowInterval:",flowInterval);
        if(!(accessType||stepCharge||floorPrice||floorSpeed||rentFee||rentUnit||flowInterval)){
          console.log("batchContrlTyy--相关属性全是空，退出")
          return "";
        }
  
        let oneObj = {};
        let tempSet = "";
        //如果页面上的相关属性没有值，那就查询原单值
        let list =  await this.qryAttrOrd(custId,orderItemIdArr.join(","),difIds.join(","));
        //取出proc属性并去重 这个应该是全部的
        let procIdArr = Array.from(new Set(list.map(item => item.PROC_PROD_INST_ID))); 
        console.log("procIdArr--:",procIdArr)
        
        //比较当前页面为空的原单值是否都一致
        for (let i = 0; i < difIds.length; i++) {
          const ele = difIds[i];
          let vArr = list.filter(item => ele == item.ATTR_ID); //取出指定属性的 数据行
          vArr = vArr.map( item => item.ATTR_VALUE); //从数据行中取出值ATTR_VALUE组成数组
          oneObj[ele] = vArr[0];
          tempSet = new Set(vArr);
          console.log("--vArr --tempSet-:",tempSet)
          if(tempSet.size>1){
            msg = nameDic[ele]+'属性不一致，不允许批量变更';
            //说明值不一致
            return msg; //forTest
          }
        }
  
        //如果都一致，再随便取一条  把 当前页面上没有的属性赋值为原单值
        accessType = accessType?accessType:oneObj['100010968'];
        stepCharge = stepCharge?stepCharge:oneObj['142000813'];
        floorPrice = floorPrice?floorPrice:oneObj['100010866'];
        floorSpeed = floorSpeed?floorSpeed:oneObj['100010767'];
        console.log("rentFee---:",rentFee)
  
        //如果页面上租用费没有填，查询原单的
        if(!rentFee){
          //查询租用费、单位 判断是否一致
          let feeList =  await this.qryFeeInfo(custId,orderItemIdArr.join(","),'3001000');
          let feeArr = feeList.map(item => item.AMOUNT);
          console.log("feeArr---:",feeArr)
          tempSet = new Set(feeArr);
          if(tempSet.size>1){
            msg = "租用费不一致，不允许批量变更";
            //说明值不一致
            return msg;
          }
          rentFee = feeArr[0];//租用费赋值
        }
  
        if(!rentUnit){
          let unitList =  await this.qryFeeAttr(custId,orderItemIdArr.join(","),'100010191');
          let unitArr = unitList.map(item => item.ATTR_VALUE);
          console.log("unitArr---:",unitArr)
          tempSet = new Set(unitArr);
          if(tempSet.size>1){
            //说明值不一致
            msg = "租用费单位不一致，不允许批量变更";
            return msg;
          }
          rentUnit = unitArr[0];
        }
        
        //如果页面上流量区间没有填
        if(!flowInterval){
          //查询流量区间 判断是否一致
          let qjList =  await this.qryFlowrateInterval(custId,procIdArr.join(","));
          console.log("区间返回--：",qjList)
          let qjArr = [];
          //根据procId分成多个数组oneQjArr 加入到大数组 qjArr
          console.log("procIdArr--:",procIdArr)
          for (let i = 0; i < procIdArr.length; i++) {
            const procId = procIdArr[i];
            let oneQjArr = [];
            for (let j = 0; j < qjList.length; j++) {
              const e = qjList[j];
              if(e.PROC_PROD_INST_ID == procId){
               oneQjArr.push(e);
              }
            }
            qjArr.push(oneQjArr);
          }
          console.log("全部区间--：",qjArr)  //是一个二维数组
          //取第一个
          let lastArr = qjArr[0];
          //比较两个二数组是否属性一致
          msg = "流量区间不一致，不允许批量变更";
          for (let i = 0; i < qjArr.length; i++) {
            let curArr = qjArr[i];
            console.log("curArr--：",curArr)
            if(i>0){
              //比较两个数组是否属性相同
              if(lastArr.length != curArr.length){
                 return msg;
              }
              for (let j = 0; j < curArr.length; j++) {
                const item = curArr[j];
                console.log("curr-item-"+j,item)
                console.log("last-item-"+j,lastArr[j])
                let flag = this.objEqual(item,lastArr[j]);
                if(!flag){
                  return msg;
                }
              }
            }
            lastArr = curArr; //重新赋值为上一个
          }
  
          //都校验通过，拼接参数
          for (let i = 0; i < lastArr.length; i++) {
            const val = lastArr[i];
            let obj = {};
            obj.attchSeq = val.ATTCH_SEQ;
            obj.flowrateMin = val.FLOWRATE_MIN;
            obj.flowrateMax = val.FLOWRATE_MAX;
            obj.flowrateUnit = val.FLOWRATE_UNIT;
            obj.flowratePrice = val.FLOWRATE_PRICE;
            obj.flowKelidu = val.FLOW_KELIDU;
            obj.flowChaoePrice = val.FLOW_CHAOE_PRICE;
            obj.flowJichuyuezuPrice = val.FLOW_JICHUYUEZU_PRICE;
            flowInterval.push(obj); //变量赋值
          }
        }
       
        return await this.tianyiCloudTypeShow3(_this,"",custId,accessType,stepCharge,floorPrice,floorSpeed,rentFee,rentUnit,flowInterval);
    },
    //增加集团IDC价格审批环节-lb 2025年7月-----------结束-------------



};
export default commonMethod;

