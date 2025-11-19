<template>
    <el-form-item label="新合同号"  prop="10461176-100010037.value"  :required="formData['10461176-100010037'].required.split(',').includes('empty')">
        <div @click="clickHandler" class="clickBtn">
            <el-input v-model="contactCd" readonly :disabled="config['10461176-100010037'].disabeld">
                <template slot="append">
                    <a href="javascript:;" style="font-size: 20px">
                        <i class="el-icon-more"></i>
                    </a>
                </template>
            </el-input>
        </div>
        <div>
            <el-dialog
                    append-to-body
                    ref="mydialog"
                    title="合同编号选项"
                    :visible.sync="show"
                    :withHeader="false"
                    class="m-dialog"
                    :close-on-click-modal="false"
                    @close="closeDialog"
            >
                <div class="slot-table">
                    <vxe-grid
                            ref="slotTable"
                            max-height="500"
                            border
                            highlight-hover-row
                            :form-config="tableForm"
                            :data="tableData"
                            :columns="tableColumn"
                            @cell-click="cellClickEvent"
                            @form-submit="findList"
                    >
                    </vxe-grid>
                    <!--highlight-hover-row:高亮当前行
                        :form-config : 表单配置文件
                        :data : 表格数据
                        :columns : 列配置
                        @form-submit ： 只对 form-config 配置时有效，表单提交时会触发该事件
                        @cell-click：表格单击事件-->
                </div>
            </el-dialog>
        </div>
    </el-form-item>
</template>

<script>
    import OrderService from "@/api/order/OrderService.js";
    import mixinstype20 from "../mixins/mixinstype20";
    import validMap from "../../utils/validate-map";
    import { mapState } from "vuex";
    export default {
        mixins: [mixinstype20],
        name: "ContractChange",
        props: {
            value: {
                type: String,
                default: "",
            },
            text: {
                type: String,
            },
            component: {
                type: Object,
                default: () => {
                    return {};
                },
            },
        },
        data() {
            return {
                config: {
                    "10461176-100010037": {
                        colType: "C",
                        id: "100010037",
                        text: "",
                        colId: "contactCd",
                        value: "",
                        disabeld:false,
                        fieldId: "contactCd",
                        tableName: "CUSTOMER_ORDER",
                        required: ''
                    },
                    "10461176-142003017": {
                        colType: "C",
                        id: "142003017",
                        text: "",
                        colId: "contactName",
                        value: "",
                        fieldId: "contactName",
                        tableName: "CUSTOMER_ORDER",
                    },
                    "10461176-100010038": {
                        colType: "C",
                        id: "100010038",
                        text: "",
                        colId: "contactId",
                        value: "",
                        fieldId: "contactId",
                        tableName: "CUSTOMER_ORDER",
                    },
                    "10461176-142002138": {
                        colType: "C",
                        id: "142002138",
                        text: "",
                        colId: "contractNumberType",
                        value: "",
                        fieldId: "contractNumberType",
                        tableName: "CUSTOMER_ORDER",
                    },
                },
           
                show: false,
                loading: false,
                tableData: [],
                tableColumn: [
                    {field: "contractcode", title: "合同编号", width: "50%"},
                    {field: "contractname", title: "合同名称", width: "50%"},
                ],
                tableForm: {
                    items: [
                        {
                            field: "contractcode",
                            title: "合同编号：",
                            itemRender: {
                                name: "input",
                                attrs: {placeholder: ""},
                            },
                        },
                        {
                            field: "contractname",
                            title: "合同名称：",
                            itemRender: {
                                name: "input",
                                attrs: {placeholder: ""},
                            },
                        },
                        {
                            itemRender: {
                                name: "$button",
                                props: {content: "查询", type: "submit", status: "primary"},
                            },
                        },
                    ],
                    data: {
                        contractcode: "",
                        contractname: "",
                    }, //这个data一定要加，否则无法获取查询参数
                },
            };
        },
        computed: {
            key(){
                let key='';
                // if(this.component?.pageTempStructId){      
                //     key=this.component.pageTempStructId + "-" + this.component.attrId;
                // }else{
                    key='10461176-100010037';
                // }
                return key;
            },
            contactCd(){
                return this.formData[this.key].value;
            },
            ...mapState("orders", ["orderPosInfo"]),
        },
        created() {
            this.ruler={"10461176-100010037.value": [{required: false, message: "合同号不能为空"}]},
            Object.assign(this.ruleData.rules, this.ruler);
            console.log("ruler",this.ruleData.rules)
            Object.assign(this.formData, this.config);
            
            console.log("formData",this.formData);
            this.setydbg()
        },
        mounted() {
            this.loadContactCdOptions();
            this.setydbg(); // 云堤继续变更时回显原合同号
        },
        methods: {
            /**
             * 单机输入框触发
             */
            clickHandler() {
                if(this.config['10461176-100010037'].disabeld == true){
                    return 
                }
                this.show = true;
                //数据被更新了，Vue.nextTick 就会触发, 将回调延迟到下次 DOM 更新循环之后执行
                this.$nextTick(() => {
                    this.loadContactCdOptions();
                })
            },
            /**
             * 单击单元格触发
             */
            cellClickEvent() {
                this.show = false;
                this.formData[this.key].value = arguments[0].row.contractcode;
                this.formData['10461176-100010037'].value = arguments[0].row.contractcode;
                this.formData['10461176-142003017'].value = arguments[0].row.contractname;
                this.formData['10461176-100010038'].value = arguments[0].row.contractid;
                this.formData['10461176-142002138'].value =arguments[0].row.contracttype;
                 for (let i in this.formData) {
                        if (this.formData[i].colId == 'PROJECT_ID') {//项目编码
                             this.formData[i].value =arguments[0].row.itemcode
                        }
                        if (this.formData[i].colId == 'PROJECT_ NAME') {//项目名称
                            this.formData[i].value =arguments[0].row.itemname
                        }
                    }
                let obj = { value: arguments[0], key: '10461176-100010037',pluginsObj:this};
                this.$emit("getPluginValue", obj);
                

            },
            // 云堤继续变更时回显原合同号  -- add by lzy
            setydbg(){
                let FormModel = JSON.parse(sessionStorage.getItem('FormModel'));
            let ppmCondition = JSON.parse(sessionStorage.getItem("ppmCondition"));
            if(FormModel && ppmCondition.productId == "80008039" && ppmCondition.serviceOfferId == "5010300062"){
                    // 云堤的继续变更时，展示原变更的合同号
                    this.contactCd = JSON.parse(sessionStorage.getItem("FormModel")).contractCd;
            }else if (FormModel && ppmCondition.productId == "80008048" && ppmCondition.serviceOfferId == "5010300062"){
                   // 政企宽带LAN的继续变更时，展示原变更的合同号 
                    this.contactCd = JSON.parse(sessionStorage.getItem("FormModel")).contractCd;
            }
            },
            /**
             * 查找表格数据
             */
            async findList() {
                this.loadContactCdOptions()
            },

            /**
             * 弹窗关闭表单重置
             */
            closeDialog() {
                this.tableForm.data.contractcode = "";
                this.tableForm.data.contractname = "";
            },

            /**
             * 合同编码回传
             */
            getRowContactCdHandler(row) {
                this.FormModel.contactName = row.contractname;
                this.FormModel.contactCd = row.contractcode;
                this.FormModel.contactid = row.contractid;
            },

            /**
             * 合同编码请求
             */
            async loadContactCdOptions() {
                let booleanType = (this.tableForm.data.contractcode !== "" || this.tableForm.data.contractname !== "") ? 1 : 0;
                let obj = {
                    requestObject: {
                        contractJson: {
                            contractcode: this.tableForm.data.contractcode.trim(),
                            contractname: this.tableForm.data.contractname.trim(),
                            itemcode: "",
                            itemname: "",
                            type: booleanType,
                            page: {pageNo: 1, pageSize: 10,},
                        },
                    },
                };
                let res = await OrderService.qryContractList(obj);
                this.tableData = [] ;
                if (res.meta.length > 0 && res.code == 200) {
                    let contractArray =  res.meta ;
                    let custom = this.orderPosInfo.custMsg ;
                    // console.log('custom---:',custom)
                    //bug11600合同变更非测试客户不允许选测试合同-lb  测试又提bug说又要加限制 2024年4月8日
                    if(custom.oldPartyCode == "1000030741120000"){
                        // this.tableData = res.meta || [];
                        //改为测试客户只能选择测试合同lb 2021年11月25日16:18:13
                        for(let i = 0 ; i < contractArray.length ; i++){
                            if(contractArray[i].contractcode == "JXXYJTYHTBH000CSY" ){
                                this.tableData.push(contractArray[i])
                            }
                        }
                    }else{
                        for(let i = 0 ; i < contractArray.length ; i++){
                            if(contractArray[i].contractcode != "JXXYJTYHTBH000CSY" ){
                                this.tableData.push(contractArray[i])
                            }
                        }
                    }
                    //合同变更改为不限制测试合同lb 根据需求变更优化2021年11月29日15:16:02
                    // this.tableData = contractArray;

                }
                this.setydbg()
            },
        },
    };
</script>

<style lang="scss" scoped>
    .clickBtn {
        ::v-deep .el-input-group--append .el-input__inner, .el-input-group__prepend {
            cursor: pointer;
        }
    }

    .slot-table {
        ::v-deep .myrow {
            cursor: pointer;
        }
    }
</style>
