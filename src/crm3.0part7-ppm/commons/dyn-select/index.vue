  <template>
  <div class="vselect">
    <template v-if="!isSpecial">
      <el-select
        v-if="isSelect"
        filterable
        :title="lableName"
        v-model="currval"
        placeholder="请选择"
        :style="component.property"
        :disabled="disabled"
        :allow-create="allowCreate"
        @change="localChange($event)"
        @visible-change="$listeners['visible-change']($event)"
        @remove-tag="$listeners['remove-tag']($event)"
        @clear="$listeners.clear($event)"
        @focus="$listeners.focus($event)"
        @blur="$listeners.blur($event)"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.attrValue"
          :label="item.attrValueName"
          :value="item.attrValue"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
    </template>
    <template v-else>
      <el-select
        filterable
        :title="lableName"
        v-model="currval"
        placeholder="请选择"
        :style="component.property"
        :disabled="disabled"
        @change="localChange($event)"
        @visible-change="$listeners['visible-change']($event)"
        @remove-tag="$listeners['remove-tag']($event)"
        @clear="$listeners.clear($event)"
        @focus="$listeners.focus($event)"
        @blur="$listeners.blur($event)"
        :id="id"
      >
        <el-option
          v-for="item in initOptions"
          :key="item.attrValue"
          :label="item.attrValueName"
          :value="item.attrValue"
          :disabled="item.disabled"
        ></el-option>
        <el-option v-if="showMore" label="。。。" value="more"></el-option>
      </el-select>
    </template>
    <div v-if="actionValue[0] == 'text'" class="suffix-1">
      {{ formData[componentKey].cValue }}
    </div>
    <el-button
      v-if="actionValue[0] == 'button'"
      type="plain"
      size="medium"
      style="margin-left: 10px; cursor: pointer"
      @click="$listeners.click($event)"
      >{{ actionValue[2] }}</el-button
    >
    <el-tooltip
      effect="light"
      placement="right-start"
      v-if="formData[componentKey].actionValue[0] == 'tips'"
      style="position: absolute; margin-left: 10px; top: 5px"
    >
      <div slot="content">
        <div v-html="formData[componentKey].actionValue[1]"></div>
      </div>
      <i class="el-icon-question" />
    </el-tooltip>
  </div>
</template>

<script>
import http from "@/utils/http";
import store from "@/_MUlTIPAGES/orders/store";
export default {
  name: "DynSelect",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Number],
    addEmptyList: {
      // 下拉是否需要添加空项 lvxx
      type: [Boolean],
      default: () => {
        return false;
      },
    },
    component: {
      type: [Object, String],
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
    },
    optionsList: {
      type: Object,
    },
    formKey: {
      type: String,
    },
  },
  created() {
    if (!this.formData[this.componentKey].actionValue) {
      this.$set(this.formData[this.componentKey], "actionValue", []);
    }
    if (this.component.actionValue) {
      let actionValue = this.component.actionValue.split("|");
      //text
      if (actionValue[0] == "text") {
        this.$set(this.formData[this.componentKey], "cValue", actionValue[1]);
      }
    }
    this.getAttrValueList();
    if (this.component.disabled) {
      this.formData[this.componentKey].disabled = true;
    }
  },
  data() {
    return {
      options: [],
      lableName: "",
      showMore: true,
      productArr: [
        "80007005",
        "80007006",
        "80007007",
        "80007008",
        "80007009",
        "80007010",
        "80007043",
        "80030460",
        "80008007",
        "80008002",
        "80020160",
        "80030445",
      ],
      initOptions: [
        {
          attrValueSort: 1,
          attrValue: "80050019001",
          attrValueName: "月末(按月出账)",
          disabled: false,
        },
        {
          attrValueSort: 2,
          attrValue: "80050019005",
          attrValueName: "季末",
          disabled: false,
        },
        {
          attrValueSort: 3,
          attrValue: "80050019011",
          attrValueName: "半年(6,12月收费)",
          disabled: false,
        },
        {
          attrValueSort: 4,
          attrValue: "80050019013",
          attrValueName: "全年(11月收本年度费)",
          disabled: false,
        },
        {
          attrValueSort: 5,
          attrValue: "80050019014",
          attrValueName: "全年(10月收本年度费)",
          disabled: false,
        },
        {
          attrValueSort: 6,
          attrValue: "80050019015",
          attrValueName: "全年(12月收本年度费)",
          disabled: false,
        },
        // {
        //   attrValueSort: 7,
        //   attrValue: "80050019028",
        //   attrValueName: "预收合同月",
        //   disabled: false,
        // },
        {
          attrValueSort: 8,
          attrValue: "80050019004",
          attrValueName: "季首",
          disabled: false,
        },
      ],
      isSelect: false,
    };
  },
  computed: {
    //特殊产品productArr的收费周期标识 2022/7/26 by yf
    isSpecial() {
      const ppmCondition =
        JSON.parse(sessionStorage.getItem("ppmCondition")) || {};
      const _productId = ppmCondition.productId + "";
      if (this.productArr.includes(_productId) && this.attrId == "100010009") {
        return true;
        //otn精品专线 attrId == '100013131'
      } else if (_productId == "80030445" && this.attrId == "100013131") {
        return true;
      }
      return false;
    },
    componentKey() {
      if (this.component) {
        return this.component.pageTempStructId + "-" + this.component.attrId;
      } else {
        return this.formKey;
      }
    },
    selectOptions() {
      return this.formData[this.componentKey].options;
    },
    currval: {
      get: function () {
        this.selblur(this.value);
        return this.value;
      },
      set: function (newValue) {
        this.formData[this.componentKey].value = newValue;
        this.$emit("input", newValue);
      },
    },
    disabled() {
      return this.formData[this.componentKey].disabled;
    },
    id() {
      return `fees${this.attrId}`;
    },
    elemtobj() {
      return this.formData[this.componentKey];
    },
    actionValue() {
      if (this.component.actionValue) {
        let action = this.component.actionValue.split("|");
        this.$set(this.formData[this.componentKey], "actionValue", action);
        return action;
      }
      return [];
    },
    allowCreate() {
      let flag = false;
      if (this.component.actionValue) {
        if (this.component.actionValue.includes("allowCreate")) {
          flag = true;
        }
      }
      return flag;
    },
  },
  watch: {
    /** @Description: 监听值 收费周期如果有回显值，且值不在initOptions中，需要展示全部拉下选项
     * @author: yuanfei
     * @Date: 2022/09/01
     */
    "elemtobj.value": {
      handler(val) {
        if (!this.isSpecial || !this.options.length || !this.showMore) {
          return;
        }
        const initAttrValues = this.initOptions.map((item) => item.attrValue);
        if (val && !initAttrValues.includes(val)) {
          this.showMore = false;
          this.initOptions = this.options;
        }
      },
    },
    selectOptions: {
      handler(val) {
        val.forEach((item) => {
          this.$set(item, "disabled", false);
          if (item?.statusCd == "1100") {
            this.$set(item, "disabled", true);
          }
        });
      },
    },
  },
  methods: {
    async getAttrValueList() {
      let options = [];
      if (!this.optionsList || !this.optionsList[this.attrId]) {
        let res = await http({
          url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryAttrValueList`,
          params: {
            attrId: this.attrId,
            productId: this.productId,
            actionValue: this.component.actionValue,
          },
          method: "GET",
          headers: {
            nodebounce: true,
          },
        });
        if (res.code == 200) {
          options = res.meta.attrValueList;
        }
      } else {
        let params = {
          attrId: this.attrId,
          productId: this.productId,
        };
        setTimeout(() => {
          store.commit("http/setQryAttrValueList", params);
        }, 0);
        options = JSON.parse(JSON.stringify(this.optionsList[this.attrId]));
      }
      if (options) {
        options.forEach((item) => {
          item["disabled"] = false;
          if (item?.statusCd == "1100") {
            item["disabled"] = true;
          }
        });
        if (this.addEmptyList) {
          options.unshift({ attrValue: "", attrValueName: "" });
        }
      }

      /*
       *@Description: productArr内产品收费周期的处理
       *@author: yuanfei
       *@Date: 2022/08/24
       */
      if (this.isSpecial) {
        const initAttrValues = this.initOptions.map((item) => item.attrValue);
        const _options = options.filter((item) => {
          const _attrValue = item.attrValue.toString();
          if (!initAttrValues.includes(_attrValue)) {
            return item;
          }
        });
        //保证initOptions在前且顺序不变
        this.options = [...this.initOptions, ..._options];
        //如果已经有回显值,且值不在常用initOptions中则展示全部拉下选项
        const val = this.formData[this.componentKey].value;
        if (val && !initAttrValues.includes(val)) {
          this.showMore = false;
          this.initOptions = this.options;
        }
      } else {
        this.options = options;
      }
      /*
       *@Description: 需求要求所有产品收费周期全年（7月收跨年度费）attrValue = 80050019008 选项不能选
       *@author: yuanfei
       *@Date: 2022/08/24
       */
      if (this.attrId == "100010009" || this.attrId == "100013131") {
        this.options.find((item) => {
          if (item.attrValue == "80050019008") {
            item["disabled"] = true;
          }
        });
      }
      this.formData[this.componentKey].options = this.options;
      this.isSelect = true;
    },
    selblur(val) {
      if (
        this.formData[this.componentKey].options instanceof Array &&
        this.formData[this.componentKey].options.length > 0
      ) {
        let options = this.formData[this.componentKey].options.find(
          (item) => item.attrValue === val
        );
        this.lableName = val && options ? options.attrValueName : "";
      }
    },
    localChange($event) {
      this.$listeners.change($event);
      if ($event == "more") {
        this.initOptions = this.options;
        this.$nextTick(() => {
          document.querySelector(`#${this.id}`).click();
          this.showMore = false;
          this.currval = "";
        });
      }
      // 如果选择的为“预收合同月”，则提示  2023/2/9 by yuanfei
      // 集团登录的用户vip机房编码js页面有校验，要排除提示  2023/4/7 by yuanfei
      const ppmCondition =
        JSON.parse(sessionStorage.getItem("ppmCondition")) || {};
      const productId = ppmCondition.productId + "";
      const userInfo =
        JSON.parse(sessionStorage.getItem("crm3-userinfo")) || {};
      const orgId = userInfo.orgId;
      if (
        $event == "80050019028" &&
        !(productId == "80008072" && orgId == "1944640")
      ) {
        this.$message({
          dangerouslyUseHTMLString: true,
          type: "info",
          message:
            '<p style="line-height:200%">预收合同月：根据起租日期和预收月数进行费用预收。</p>' +
            "<p>例：预收月数为12，起租日期为2023.2.1，202302账期出账为2023.2.1-2024.1.31，12个月的费用。</p>",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vselect {
  display: inline-block;
  width: 100%;
}
.el-select {
  width: 100%;
}
.suffix-1 {
  margin-left: 10px;
  display: inline-block;
  color: #999;
  font-size: 13px;
}
</style>
