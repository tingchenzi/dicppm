<template>
  <el-radio-group
    v-model="currval"
    :disabled="component.disabled || this.disableds == true ? true : false"
    @change="$listeners.change($event)"
  >
    <el-radio
      v-for="item in options"
      :key="item.attrValue"
      :label="item.attrValue"
      :disabled="item.disabled"
    >{{ item.attrValueName }}</el-radio>
  </el-radio-group>
</template>

<script>
import store from "@/_MUlTIPAGES/orders/store";
import http from "@/utils/http";
export default {
  name: "DynRadio",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Number],
    component: {
      type: Object,
      default: () => {
        return {};
      }
    },
    disableds: {
      type: Boolean,
      default: () => {
        return false;
      }
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
      options: []
    };
  },
  computed: {
    currval: {
      get: function() {
        return this.value;
      },
      set: function(newValue) {
        this.$emit("input", newValue);
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
        });
      }
      this.options = options;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ne-line .el-form-item__content,
.column-center,
.el-radio-group {
  height: 0.34rem;
  align-items: center;
}
</style>
