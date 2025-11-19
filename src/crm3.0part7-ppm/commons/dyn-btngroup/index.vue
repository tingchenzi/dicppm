<template>
  <el-radio-group
    v-model="currval"
    :disabled="
      (component ? component.disabled : formData[formKey].disabled) ||
      formData[formKey].disabled == true
        ? true
        : false
    "
    @change="$listeners.change($event)"
  >
    <el-radio-button
      v-for="item in selectOptions"
      :key="item.attrValue"
      :label="item.attrValue"
      :disabled="item.disabled"
      >{{ item.attrValueName }}</el-radio-button
    >
  </el-radio-group>
</template>

<script>
import store from "@/_MUlTIPAGES/orders/store";
import http from "@/utils/http";
export default {
  name: "DynBtngroup",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Number],
    component: {
      type: Object,
    },
    formData: {
      type: Object,
    },
    formKey: {
      type: String,
    },
    optionsList: {
      type: Object,
    },
  },
  created() {
    this.getAttrValueList(this.productId);
  },
  watch: {
    productId(val) {
      //动态更新产品ID，下拉值发生变化
      this.getAttrValueList(val);
    },
  },
  data() {
    return {};
  },
  computed: {
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
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  watch: {
    selectOptions: {
      handler(val) {
        val.forEach((item) => {
          item["disabled"] = false;
          if (item?.statusCd == "1100") {
            item["disabled"] = true;
          }
        });
      },
    },
  },
  methods: {
  async getAttrValueList(productId) {
      let options = [];
      if(!this.optionsList || !this.optionsList[this.attrId]){
      let res = await http({
        url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryAttrValueList`,
        params: { attrId: this.attrId, productId: productId },
        method: "GET",
      });
      if (res.code == 200) {
         options = res.meta.attrValueList;
      }
      }else{
        let params= {
            attrId: this.attrId,
            productId: this.productId,
          };
          store.commit('http/setQryAttrValueList',params)
         options = JSON.parse(JSON.stringify(this.optionsList[this.attrId]));
      }
      if(options){
        options.forEach((item) => {
          item["disabled"] = false;
          if(item?.statusCd=="1100"){
            item["disabled"] = true;
          }  
        });
      }
        this.options = options;
        this.formData[this.componentKey].options = this.options;
      
    },
  },
};
</script>
