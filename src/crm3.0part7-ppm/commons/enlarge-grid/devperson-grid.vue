<template>
  <div>
    <div @click="clickHandler" class="clickBtn">
      <!-- 注意:格式化时,:style后一定要使用单引号 -->
      <el-input
        v-model="currentValue"
        readonly
        :style="component.property"
        :disabled="disabled"
      >
        <template slot="append">
          <a href="javascript:;" style="font-size: 20px">
            <i class="el-icon-more"></i>
          </a>
        </template>
      </el-input>
    </div>
    <el-dialog
      :title="config.title"
      :visible.sync="show"
      :withHeader="false"
      width="70%"
      class="m-dialog"
      append-to-body
    >
      <el-container>
        <el-main v-loading="loading">
          <el-row>
            <el-col>
              <devperson-table
                v-if="!loading"
                v-bind="$attrs"
                v-on="$listeners"
                :config="config"
                @clickcell="clickCellHandler"
                @findlist="load"
                @formSelectChange="formSelectChange"
              ></devperson-table>
              <div class="empty" v-else></div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VXETable);
import devpersonTable from "./devperson-table.vue";
import { mapState } from "vuex";
import OrderService from "@/api/order/OrderService";
export default {
  name: "DevpersonGrid",
  components: {
    devpersonTable,
  },
  props: {
    // ...Input,
    value: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sqlCode: {
      type: String,
      default: "findCust",
    },
    index: {
      type: Number,
    },
    component: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formKey: {
      type: String,
    },
  },
  created() {
    this.paramCode = "";
    this.tableBase();
    // 详情时component.disabled的值为disabled
    if (this.component.disabled) {
      this.formData[this.formKey].disabled = true;
    }
  },
  data() {
    return {
      show: false,
      config: {
        //默认值使用空结构,为了代码中不报错
        title: "发展人",
        dataType: "LIST", //LIST:列表，TREE 树
        tableForm: {
          items: [],
          data: {
            name: "",
          },
        },
        tableColumn: [],
        returnColumn: [],
        tableData: [],
        pageInfo: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          rowCount: 0,
        },
      },
      echoKey: "",
      submitKey: "",
      loading: false,
      paramCode: "",
    };
  },
  computed: {
    currentValue: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    ...mapState("user", ["user"]),
    disabled() {
      return this.formData[this.formKey].disabled;
    },
  },
  methods: {
    tableBase() {
      this.config.tableColumn = [
        {
          field: "salesCode",
          slots: null,
          title: "销售员编码",
          treeNode: null,
          width: null,
        },
        {
          field: "staffName",
          slots: null,
          title: "销售员姓名 ",
          treeNode: null,
          width: null,
        },
        {
          field: "mobilePhone",
          slots: null,
          title: "联系手机",
          treeNode: null,
          width: null,
        },
        {
          field: "regionName",
          slots: null,
          title: "区域",
          treeNode: null,
          width: null,
        },
        {
          field: "statusCd",
          slots: null,
          title: "状态",
          treeNode: null,
          width: null,
        },
        {
          field: "statusDate",
          slots: null,
          title: "状态时间",
          treeNode: null,
          width: null,
        },
        {
          field: "channelNbr",
          slots: null,
          title: "渠道视图编码",
          treeNode: null,
          width: null,
        },
        {
          field: "operatorsNbr",
          slots: null,
          title: "经营主体编码",
          treeNode: null,
          width: null,
        },
      ];
      this.config.tableForm = {
        data: {
          // CHANNEL_NBR: "",
          // OPERATORS_NBR: "",
          province: "",
          localNet: "",
          salesCode: "",
          staffName: "",
          mobilePhone: "",
          operatorsNbr: "",
        },
        items: [
          {
            field: "province",
            title: "省份",
            itemRender: { name: "$select", options: [] },
            disabled: false,
          },
          {
            field: "localNet",
            title: "本地网",
            itemRender: { name: "$select", options: [] },
          },
          {
            field: "salesCode",
            title: "销售员编码",
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入销售员编码" },
            },
          },
          {
            field: "staffName",
            title: "销售员姓名",
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入销售员姓名" },
            },
          },
          {
            field: "mobilePhone",
            title: "联系手机",
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入联系手机" },
            },
          },
        ],
      };
      // 反选数据
      this.submitKey = this.config.tableColumn[0].field;
      this.echoKey = this.config.tableColumn[1].field;
    },
    async load(filerData = {}, page) {
      const hint = this.queryHint(filerData);
      if (hint) {
        return;
      }
      if (page) {
        this.config.pageInfo.currentPage = Number(page);
      }
      //如果传回的本地网存在就传本地网，否则传省份，都不存在就传//空
      if (filerData.localNet) {
        this.paramCode = filerData.localNet;
      } else if (filerData.province) {
        this.paramCode = filerData.province;
      }
      this.loading = true;
      const params = {
        REGION_CODE: this.paramCode,
        curPage: this.config.pageInfo.currentPage,
        size: this.config.pageInfo.pageSize,
        ...filerData,
      };
      let res = await OrderService.devpersonList(params);
      if (res.code == 200) {
        const { meta } = res;
        this.config.tableData =
          meta.returnJson instanceof Array ? meta.returnJson : [];
        this.config.pageInfo.total = Number(meta.totalCnt) || 0;
        //如果只有一条数据且salesCode不存在  说明是一条报错数据
        if (
          this.config.tableData.length === 1 &&
          !this.config.tableData[0].salesCode
        ) {
          this.config.tableData = [];
        }
        //转换状态数和日期值
        if (this.config.tableData.length > 0) {
          this.config.tableData.forEach((item) => {
            // item.statusCd = item.statusCd == 1000 ? "有效" : "无效";
            let day = new Date(item.statusDate);
            item.statusDate =
              day == "Invalid Date"
                ? ""
                : day.toLocaleDateString().replace(/\//g, "-");
          });
        }
      }
      this.loading = false;
    },

    async clickHandler() {
      this.tableBase();
      this.show = true;
      this.loading = true;
      await this.getProvince();
      await this.getShengByRegoinId();
      /**当已经有值时，打开弹框先搜索已有的值 2021/9/28 by yf*/
      if (this.currentValue) {
        this.config.tableForm.data.salesCode = this.currentValue;
      }
      await this.load(this.config.tableForm.data);
      this.loading = false;
    },

    clickCellHandler(row) {
      /** @Description: disabled时能打开弹框，但是不能选择数据
       * @author: yuanfei
       * @Date: 2022/09/01
      */
      if (this.disabled) {
        return;
      }
      this.show = false;
      this.$emit("input", row[this.echoKey], {
        index: this.index,
        echoKey: row[this.echoKey],
        submitKey: row[this.submitKey],
      });
      this.$emit("getrow", row, this.index);
    },
    // form表单中select切换
    formSelectChange(data, field) {
      if (field == "province") {
        this.getLocalNet(data.value);
      }
    },

    async getOptions() {
      const params = { REGION_CODE: this.user.regionCode };
      let res = await OrderService.devpersonFilterChannel(params);
      if (res.code == 200) {
        const { meta } = res;
        this.config.tableForm.items[0].itemRender.options = meta.channelNbr.map(
          (item) => {
            return { value: item.CODE, label: item.NAME };
          }
        );
        this.config.tableForm.items[1].itemRender.options = meta.operNbr.map(
          (item) => {
            return { value: item.CODE, label: item.NAME };
          }
        );
      } else {
        this.$message.error("获取渠道和经营主体列表接口异常");
      }
    },
    //省份接口
    async getProvince() {
      const params = {
        interFaceType: "ORDER",
        sqlId: 2021071403,
        paramStr: `regionCode:${this.user.regionCode}`,
      };
      let res = await OrderService.devpersonFilterProvince(params);
      if (res.code == 200) {
        const {
          meta: { resCode, resList },
        } = res;
        if (resCode == "0") {
          this.config.tableForm.items[0].itemRender.options =
            resList.executeSqlResps.map((item) => {
              return { label: item.text, value: item.value };
            });
        }
      } else {
        this.$message.error("获取省份接口异常");
      }
    },
    //本地网
    async getLocalNet(provinceCode) {
      const params = {
        interFaceType: "ORDER",
        sqlId: 2021071404,
        paramStr: `regionCode:${provinceCode}`,
      };
      let res = await OrderService.devpersonFilterProvince(params);
      if (res.code == 200) {
        const {
          meta: { resCode, resList },
        } = res;
        if (resCode == "0") {
          this.config.tableForm.items[1].itemRender.options =
            resList.executeSqlResps.map((item) => {
              return { label: item.text, value: item.value };
            });
        }
      } else {
        this.$message.error("获取本地网接口异常");
      }
    },
    //增加查询条件提示
    queryHint(filterForm) {
      let requiredKeys = ["salesCode", "staffName", "mobilePhone"];
      const res = requiredKeys.every((key) => {
        return !filterForm[key];
      });
      if (res) {
        this.$message.warning(
          "销售员编码/销售员姓名/联系手机请至少输入一项查询"
        );
      }
      return res;
    },
    //根据当前登录人获取省份code
    async getShengByRegoinId() {
      //取出省份下拉中的proviceLocIds集合
      const proviceLocIds = [];
      const _options = this.config.tableForm.items[0].itemRender.options;
      _options.forEach((item) => {
        //去掉澳门 香港 国际区域 只查询大陆内的省份
        if (/^8/.test(item.value)) {
          proviceLocIds.push(item.value);
        }
      });
      let shengParams = {
        regionId: this.user.regionId,
        regionType: this.user.regionType,
      };
      try {
        let { meta } = await OrderService.getRegionCodeList(shengParams);
        const regionNbr = meta.proArr[0].regionNbr;
        if (regionNbr && proviceLocIds.includes(regionNbr)) {
          this.config.tableForm.data.province = meta.proArr[0].regionNbr;
          this.config.tableForm.items[0].disabled = true;
          await this.getLocalNet(meta.proArr[0].regionNbr);
        }
      } catch {
        console.info("发展人插件根据登录人查询省份接口异常");
      }
    },
    outclickHandler() {
      if (this.component.editable) {
        return;
      }
      this.clickHandler();
    },
  },
};
</script>

<style lang="scss" scoped>
.clickBtn {
  ::v-deep .el-input-group--append .el-input__inner,
  .el-input-group__prepend {
    cursor: pointer;
  }
}
.empty {
  width: 100%;
  height: 40px;
}
</style>
