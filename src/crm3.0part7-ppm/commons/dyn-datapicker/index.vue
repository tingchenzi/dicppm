<template>
  <div style="display: inline-block; width: 100%">
    <el-date-picker
      :style="component.property"
      :readonly="component.readonly ? true : false"
      :disabled="disabled"
      v-model="currval"
      :type="dataType"
      placeholder="选择日期"
      :format="format"
      :value-format="format"
      :picker-options="this.formData[this.componentKey].dateLimit || ''"
      @change="$listeners.change($event)"
      @focus="$listeners.focus($event)"
      @blur="$listeners.blur($event)"
    ></el-date-picker>

    <div
      v-if="formData[componentKey].actionValue[0] == 'text'"
      class="suffix-1"
    >
      <div
        style="line-height: 1.2"
        v-html="
          formData[componentKey].cValue || formData[componentKey].actionValue[1]
        "
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DynDatapicker",
  props: {
    attrId: [String, Number],
    productId: [String, Number],
    value: [String, Number],
    component: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
    },
    formKey: {
      type: String,
    },
  },
  created() {
    //日期插件跟时间插件切换  20220801
    if (this.component) {
      if (this.component.actionValue == "datetime") {
        this.dataType = "datetime";
        this.format = "yyyy-MM-dd HH:mm:ss";
      }
      if (this.component.disabled) {
        this.formData[this.componentKey].disabled = true;
      }
    }
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
  },
  data() {
    return {
      format: "yyyy-MM-dd",
      dataType: "date",
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
    disabled() {
      return this.formData[this.componentKey].disabled;
    },
    currval: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.formData[this.componentKey].value = newValue;
        this.$emit("input", newValue);
      },
    },
    actionValue() {
      if (this.component.actionValue) {
        let action = this.component.actionValue.split("|");
        this.$set(this.formData[this.componentKey], "actionValue", action); //cjj改公共小问号 2025年1月
        return action;
      }
      return [];
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
