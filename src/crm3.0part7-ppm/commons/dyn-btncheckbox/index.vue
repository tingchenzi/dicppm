<template>
  <div style="display: inline-block; line-height: 30px">
    <el-checkbox-group
      v-model="newVal"
      size="small"
      :disabled="
        (component ? component.disabled : formData[formKey].disabled) ||
        formData[formKey].disabled == true
          ? true
          : false
      "
      @change="$listeners.change($event)"
    >
      <el-checkbox-button
        v-for="item in selectOptions"
        :key="item.attrValue"
        :label="item.attrValue"
        :disabled="item.disabled"
      >{{ item.attrValueName }}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
import http from "@/utils/http";
import store from "@/_MUlTIPAGES/orders/store";
export default {
  name: "DynBtncheckbox",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Array, Boolean],
    component: {
      type: Object
    },
    formData: {
      type: Object
    },
    formKey: {
      type: String
    },
    optionsList: {
      type: Object
    }
  },
  created() {
    this.getAttrValueList();
  },
  data() {
    return {
      newVal: []
    };
  },
  computed: {
    thisVal() {
      if (this.component) {
        return this.formData[
          this.component.pageTempStructId + "-" + this.component.attrId
        ].value;
      } else {
        return this.formData[this.formKey].value;
      }
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
    }
  },
  watch: {
    thisVal: {
      handler(val) {
        if (typeof val == "string") {
          if (val == "") {
            this.newVal = [];
          } else {
            this.newVal = val.split(",");
          }
        }
      },
      immediate: true,
      deep: true
    },
    newVal: {
      handler(val) {
        if (val instanceof Array) {
          if (this.component) {
            this.formData[
              this.component.pageTempStructId + "-" + this.component.attrId
            ].value = val.toString();
          } else {
            this.formData[this.formKey].value = val.toString();
          }
        }
      },
      deep: true
    },
    selectOptions: {
      handler(val) {
        val.forEach(item => {
          item["disabled"] = false;
          if (item?.statusCd == "1100") {
            item["disabled"] = true;
          }
        });
      }
    }
  },
  methods: {
    async getAttrValueList() {
      let options = [];
      if (!this.optionsList || !this.optionsList[this.attrId]) {
        let res = await http({
          url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryAttrValueList`,
          params: { attrId: this.attrId, productId: this.productId },
          method: "GET"
        });
        if (res.code == 200) {
          options = res.meta.attrValueList;
        }
      } else {
        let params = {
          attrId: this.attrId,
          productId: this.productId
        };
        setTimeout(() => {
          store.commit("http/setQryAttrValueList", params);
        }, 0);
        options = JSON.parse(JSON.stringify(this.optionsList[this.attrId]));
      }
      if (options) {
        options.forEach(item => {
          item["disabled"] = false;
          if (item?.statusCd == "1100") {
            item["disabled"] = true;
          }
        });
      }
      this.formData[this.componentKey].options = options;
    }
    // async getAttrValueList() {
    //   let res = await http({
    //     url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryAttrValueList`,
    //     params: { attrId: this.attrId, productId: this.productId },
    //     method: "GET"
    //   });
    //   if (res.code == 200) {
    //     let options = res.meta.attrValueList;
    //     options.forEach(item => {
    //       item["disabled"] = false;
    //     });
    //     this.formData[this.componentKey].options = options;
    //   } else {
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.el-checkbox-group {
  white-space: normal;
}

::v-deep .el-checkbox-button__inner {
  margin-left: -1px;
  border-left: 1px solid #dcdfe6;
}
</style>

