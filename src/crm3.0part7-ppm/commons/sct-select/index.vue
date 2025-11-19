<template>
  <el-row>
    <el-col :span="24">
      <el-radio-group v-model="currval" :disabled="disabled" @change="$listeners.change($event)">
        <el-radio-button
          v-for="(item, index) in formData[componentKey].options.slice(0, 3)"
          :key="index"
          :label="item.attrValue"
          :disabled="item.disabled"
        >{{ item.attrValueName }}</el-radio-button>
        <el-select
          filterable
          v-model="currval"
          style="width: 200px"
          placeholder="请选择"
          :disabled="disabled"
          @change="$listeners.change($event)"
          @visible-change="$listeners['visible-change']($event)"
          @remove-tag="$listeners['remove-tag']($event)"
          @clear="$listeners.clear($event)"
          @focus="$listeners.focus($event)"
          @blur="$listeners.blur($event)"
        >
          <el-option label value></el-option>
          <el-option
            v-for="(item, index) in formData[componentKey].options"
            :key="index"
            :label="item.attrValueName"
            :value="item.attrValue"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-radio-group>
    </el-col>
  </el-row>
</template>

<script>
import http from "../../utils/http";
import store from "@/_MUlTIPAGES/orders/store";
export default {
  name: "SctSelect",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Number],
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
    if (this.component && this.component.disabled) {
      this.formData[this.componentKey].disabled = true;
    }
    this.getAttrValueList();
  },
  data() {
    return {
      options: []
    };
  },
  computed: {
    componentKey() {
      if (this.component) {
        return this.component.pageTempStructId + "-" + this.component.attrId;
      } else {
        return this.formKey;
      }
    },
    currval: {
      get: function() {
        return this.value;
      },
      set: function(newValue) {
        this.$emit("input", newValue);
      }
    },
    disabled() {
      return this.formData[this.componentKey].disabled;
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
      options.forEach(item => {
        item["disabled"] = false;
      });
      this.formData[this.componentKey].options = options;
    }

    // doEmit(value) {
    // 	this.$emit("change", value);
    // },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
  margin-left: -1px;
}

::v-deep .el-input__icon {
  line-height: 30px;
}
</style>
