<template>
  <div>
    <div @click="component.editable || formData[formKey].reserve1 ? '' : clickHandler()" class="clickBtn fontClass">
      <!-- 注意:格式化时,:style后一定要使用单引号 -->
      <el-input
        :title="this.value"
        v-model="formData[formKey].text"
        :readonly="!component.editable && !formData[formKey].reserve1"
        :style="component.property"
        @input="InputVal"
        @change="inputText"
        :disabled="
          (component ? component.disabled : formData[formKey].disabled) ||
          formData[formKey].disabled == true
            ? true
            : false
        "
      >
        <template slot="append">
          <a @click="clickHandler()" href="javascript:;" style="font-size: 20px; padding: 0 20px">
            <i class="el-icon-more"></i>
          </a>
        </template>
      </el-input>
    </div>
    <el-dialog
      :title="config.title"
      :visible.sync="show"
      :withHeader="false"
      class="m-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-container v-loading="loading">
        <el-main>
          <el-row v-if="!loading">
            <el-col v-if="config.dataType == 'LIST'">
              <slot-grid
                ref="xtable"
                v-bind="$attrs"
                v-on="$listeners"
                :config="config"
                @clickcell="clickCellHandler"
                @findlist="load"
              ></slot-grid>
            </el-col>
            <el-col v-if="config.dataType == 'TREE'">
              <slot-tree
                ref="xtree"
                v-bind="$attrs"
                v-on="$listeners"
                :config="config"
                :attrId="component.attrId||''"
                @clickcell="clickCellHandler"
                @findlist="load"
              ></slot-tree>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../utils/http";
// import { Input } from "element-ui";
import Vue from "vue";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VXETable);
import SlotTree from "./slotTree.vue";
import SlotGrid from "./slotGrid.vue";
import { mapState, mapActions } from "vuex";
import CustOrderService from "@/api/order/CustOrderService";
export default {
  name: "InputGrid",

  components: {
    SlotGrid,
    SlotTree
  },

  props: {
    // ...Input,
    value: {
      type: String,
      default: ""
    },
    sqlCode: {
      type: String,
      default: "findCust"
    },
    index: {
      type: Number
    },
    component: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formData: {
      type: Object
    },
    formKey: {
      type: String
    }
  },

  data() {
    return {
      show: false,
      disabled: false,
      config: {
        //默认值使用空结构,为了代码中不报错
        title: "标题",
        dataType: "LIST", //LIST:列表，TREE 树
        tableForm: {
          items: [],
          data: {
            name: ""
          }
        },
        tableColumn: [],
        returnColumn: [],
        tableData: [],
        pageInfo: {
          pageIndex: "1",
          pageSize: "10",
          pageCount: "0",
          rowCount: 0
        }
      },
      echoKey: "",
      submitKey: "",
      cTableData: [], //保存树形结构第一次请求的数据，用于再次打开回显
      loading: false,
      inFlag:false
    };
  },

  computed: {
    ...mapState("user", ["user"]),
    ...mapState("orders", ["orderPosInfo"]),
    custId() {
      //客户id
      let formkey = "";
      for (let key in this.formData) {
        if (key.split("-")[1] == "100010088") {//客户名称
          formkey = this.formData[key].value;
        }
      }
      return formkey;
    },
  },

  created() {
    this.load();
  },

  methods: {
    async load(filerData, pageInfo) {
      this.inFlag = false;;
      let querys = [];
      if (JSON.parse(sessionStorage.getItem("ppmCondition")) && 
          JSON.parse(sessionStorage.getItem("ppmCondition")).serviceOfferId == "5010300091"
      ) {  //如果是发起局变更查询发起局时放开状态时1100的数据
          querys.push("inFlag:1");
          this.inFlag = true;
      }
      if (filerData) {
        //处理过滤查询
        const keys = Object.keys(filerData);
        keys.forEach((key, index) => {
          if (index == 0) return; //接口在生成配置时不得不带回一个冗余字段name,在这里去掉
          querys.push(`${key}:${filerData[key]}`);
        });
        if (pageInfo) {
          this.config.pageInfo.pageIndex = pageInfo.pageIndex;
        } else {
          this.config.pageInfo.pageIndex = 1;
        }
      }
      //收款单位新增缓存 避免重复查询
      let findJSDWCondition = JSON.parse(sessionStorage.getItem("findJSDWCondition"));
      let res=null;
      if((this.sqlCode=="findJSDW|accountUnitType:50520001" && !findJSDWCondition )||querys.length != 0||this.sqlCode!="findJSDW|accountUnitType:50520001"){
      //对sqlCode传参做数据处理
      let sqlCodes = this.sqlCode.split(",");
      if (sqlCodes.length > 1) {
        let sqlArr = sqlCodes[1].split(";");
        sqlArr.forEach(item => {
          if (item.includes("=")) {
            let itemA = item.split("=")[0],
              itemB = this.user[item.split("=")[1]];
            item = itemA + ":" + itemB;
          }
          querys.push(item.replace('"', ""));
        });
      }
      if(sqlCodes[0]){
        let arr = sqlCodes[0].split("|");
        for(let i=0;i<arr.length;i++){
          let item = arr[i];
          if (item.includes("=")) {
            let itemA = item.split("=")[0];
            if(itemA == "custId"){
              arr[i]="custId:" + this.custId
            }
          }
        }
        sqlCodes[0]=arr.join("|")
      }

      this.loading = true;
       res = await http({
        url: `${
          process.env.VUE_APP_CTX_PPM_QUERY
        }/ppm-query-server/qryConfigListDefPage`,
        data: {
          sqlCode: sqlCodes[0],
          param: querys.join(";"),
          pageInfo: {
            pageIndex: this.config.pageInfo.pageIndex,
            pageSize: this.config.pageInfo.pageSize
          }
        },
        method: "POST"
      });
       if (res.code == 200&&this.sqlCode=="findJSDW|accountUnitType:50520001" && querys.length == 0 ) {
         //如果是收款单位则保存缓存
         sessionStorage.setItem("findJSDWCondition",JSON.stringify(res));
        }
      }else{
        this.loading = true;
        res=findJSDWCondition;
        //解决收款单位不自动展开问题
        await setTimeout(() => {
        }, 100);
      }
      if (res&&res.code == 200) {
        this.config = res.meta;
        if(this.inFlag == true){
             this.config.title = "发起局";
        }
        if (this.config.dataType == "TREE") {
          if (this.config.tableData.length == 24) {
            let t22 = this.config.tableData[22];
            this.config.tableData = [t22];
            this.cTableData = this.config.tableData;
          } else if (this.config.tableData.length == 23) {
            let t21 = this.config.tableData[21];
            this.config.tableData = [t21];
            this.cTableData = this.config.tableData;
          }
        }
        if (
          this.config.returnColumn &&
          this.config.returnColumn instanceof Array &&
          this.config.returnColumn.length > 1
        ) {
          this.submitKey = this.config.returnColumn[0]["field"].trim();
          this.echoKey = this.config.returnColumn[1]["field"].trim();
          this.config.pageInfo.pageSize = 10;
        } else {
          throw new Error("接口qryConfigListDefPage返回null");
        }
      }
      this.loading = false;
    },

    clickHandler() {
      if (this.component.disabled || this.formData[this.formKey].disabled)
        return;
      this.show = true;
      //chengxiang  edit 解决再次打开收款单位不能展开
      this.load();
    },

    clickCellHandler(row) {
      // let arg = {};
      // arg[this.echoKey] = row[this.echoKey];
      // arg[this.submitKey] = row[this.submitKey];
      let formKey =
        this.component.pageTempStructId + "-" + this.component.attrId;
      //chengxiang   add  2022.3.2   收款单位不能选择 福建电信公司
      let orgArr = ["CON_CHARGE_ORG_CODE","CHARGE_ORG_CODE","SERV_BACK_ORG_ID","SETTLE_ORG_ID"];
      let attrIdArr = ["100013695","142003017"];//批量选择收款单位判断 没法每一个账务变更都加判断  暂时这样写
      if(this.component && (orgArr.indexOf(this.component.attrCd) > -1 || attrIdArr.indexOf(this.component.attrId) > -1)){
         if(row.accountUnitCode == "DXFJ0000"){
            this.$confirm('因福建省公司没有业务营收账务，故收款单位不允许选择“福建省电信公司”，请选择各市电信公司！', "提示", {
              confirmButtonText: "关闭",
              showCancelButton: false,
              type: "warning",
              center: true,
            });
            return
         }
        //集团公司国际部
        
        //ZQXQGL-20250107374820 集团CRM系统B端业务国际部人员录入JT开头流水号订单收款单位限制
        if(this.user.departmentId == "1947362"){
          let custNumber =  "11111111111";//JSON.parse(sessionStorage.getItem("FormModel")).custNumber;
           let custId =  "1111111111";
          let custIds = ["4221506","4176096","4053908","4176105","4068571","4053296","52395727859","100000016121","4221496","4050076","4053891","4221497","4050753","4179777"];

          let custNumbers = ["1000000106270000","1000031671560000","1000000003790000","1000000020490000","1000000020530000","1000000117750000","1000000118690000","1000000120880000","1000000003730000","1000000003980000","1000000025120000","1000000025130000","1000000358670000","1000000003730000","1000100241210000","1000000020490000"];
          if(this.orderPosInfo.custMsg != null ){
            custNumber = this.orderPosInfo.custMsg.custNumber;
          }else if(sessionStorage.getItem( "changeRow")!=null){
            let changeRow = JSON.parse(sessionStorage.getItem( "changeRow"));
            custId = changeRow.custId;
          }
          else{
            let batchEditOrderCache = JSON.parse(sessionStorage.getItem( "batchEditOrderCache"));
            custId = batchEditOrderCache.custId;
          }
          
          let jwdwCodes = ["DXGJ0000","DXHK0000","DXFZ0000","DXGJB000","DXYT0000","DXMG0000","DXEU0000","DXJT0000"];
          if(this.component && this.component.attrCd=="CHARGE_ORG_CODE" &&  ( custNumbers.indexOf(custNumber) >-1 || custIds.indexOf(custId) > -1) && row.accountUnitCode !="DXGJ0000" ){
              this.$confirm('该客户收款单位只能选择【中国电信国际有限公司】！', "提示", {
                confirmButtonText: "关闭",
                showCancelButton: false,
                type: "warning",
                center: true,
              });
              return;
            }

          if(this.component && this.component.attrCd=="CHARGE_ORG_CODE" &&   jwdwCodes.indexOf(row.accountUnitCode) < 0 ){
            this.$confirm('集团公司国际部收款单位只能选择【中国电信国际有限公司|中国电信(香港)国际有限公司|中国电信非洲中东公司|中国电信股份有限公司国际业务事业部|中国电信国际有限公司|中国电信美国公司|中国电信欧洲公司|集团公司】！', "提示", {
              confirmButtonText: "关闭",
              showCancelButton: false,
              type: "warning",
              center: true,
            });
            return;
           
          }
          
               
         
          if(this.component.attrCd=="CON_CHARGE_ORG_CODE" && row.accountUnitCode !="DXJT0000"){
              this.$confirm('集团公司国际部委托收款单位只能选择【集团公司】！', "提示", {
              confirmButtonText: "关闭",
              showCancelButton: false,
              type: "warning",
              center: true,
            });
            return;
          }

          
        }
      }
      this.show = false;
      this.formData[formKey].value = row[this.submitKey];
      this.$emit("input", row[this.echoKey], {
        index: this.index,
        echoKey: row[this.echoKey],
        submitKey: row[this.submitKey]
      });
      this.$emit("getrow", row[this.submitKey], {
        index: this.index,
        echoKey: row[this.echoKey],
        submitKey: row[this.submitKey]
      });

      let obj = { data: row, key: formKey };
      this.$emit("getInputGridValue", obj);
    },

    //手动输入触发非空校验，change事件会重新给value赋值 add by cjj 20220511
    InputVal(val){
      this.formData[this.formKey].value=val;
    },

    //input输入事件 创建用户名事件
    async inputText(val) {
      if (val !== ""){
         let result = await CustOrderService.qryAZCustId({ custName: val,staffId:this.user.staffId});
          if (result.code == 200) {
          if (result.meta.resultCode == 0) {
            this.formData[this.formKey].value = result.meta.custId;
          } else {
            this.formData[this.formKey].text = "";
            this.formData[this.formKey].value = "";
            this.$alert("创建客户失败", "提示", { type: "warning" });
          }
        }
      }else{
         this.formData[this.formKey].value = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.clickBtn {
  ::v-deep .el-input-group--append .el-input__inner,
  .el-input-group__prepend {
    cursor: pointer;
  }
}
.fontClass ::v-deep .el-input-group__append {
  padding: 0;
}
.el-container {
  min-height: 80px;
}
</style>