<template>
  <div style="display: inline-block; width: 100%">
    <el-input
      :title="formData[key].value"
      v-model="formData[key].value"
      :style="component.property"
      :disabled="disabled"
      :type="vtype"
      :readonly="component.readonly ? true : false"
      :maxlength="form.maxlength"
      :minlength="form.minlength"
      show-word-limit
      @change="$listeners.change($event)"
      @clear="$listeners.clear($event)"
      @focus="$listeners.focus($event)"
      @blur="$listeners.blur($event)"
      @input="$listeners.input($event)"
    >
      <template slot="append" v-if="formData[key].actionValue[0] == 'more'">
        <a @click="getSelect" href="javascript:;" style="font-size: 20px">
          <i class="el-icon-more"></i>
        </a>
      </template>
    </el-input>

    <el-button
      v-if="formData[key].actionValue[0] == 'button'"
      type="plain"
      size="medium"
      style="margin-left: 10px; cursor: pointer"
      @click="getSelect"
      >{{ formData[key].actionValue[2] }}</el-button
    >

    <el-select
      class="suffix"
      v-model="formData[key].cValue"
      v-if="actionValue[0] == 'select'"
      :disabled="formData[key].cDisabled"
      @change="getSelect"
    >
      <el-option
        v-for="(item, index) in formData[key].options"
        :key="index"
        :label="item.lable"
        :value="item.value"
      ></el-option>
    </el-select>

    <div
      v-if="formData[key].actionValue[0] == 'text'"
      class="suffix-1"
      @click="getSelect"
      style="line-height: 1.2; position: relative; z-index: 2"
      v-html="
        formData[key].cValue ||
        formData[key].actionValue[2] ||
        formData[key].actionValue[1]
      "
    ></div>

    <el-input
      class="suffix"
      v-if="actionValue[0] == 'input'"
      v-model="formData[key].cValue"
      :disabled="formData[key].cDisabled"
      @change="getSelect"
    ></el-input>
    <!-- cjj改公共小问号 2025年1月 -->
    <el-tooltip
      effect="light"
      placement="right-start"
      v-if="formData[key].actionValue[0] == 'tips'"
      style="position: absolute; margin-left: 10px; top: 5px"
    >
      <div slot="content">
        <div v-html="formData[key].actionValue[1]"></div>
      </div>
      <i class="el-icon-question" />
    </el-tooltip>
    <!-- chengxiang客户名称脱敏小眼睛 2025年2月 -->
    <el-popover
      placement="bottom"
      title=""
      width="300"
      v-if="formData[key].actionValue[0] == 'views'"
      trigger="hover"
      content=""
    >
      <div>
        {{ formData[key].actionValue[1] }}
      </div>
      <el-button class="iconClass" slot="reference">
        <i class="el-icon-view"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "DynInput",
  props: {
    component: {
      type: [Object, String],
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
    },
    vtype: {
      type: String,
      default: "text",
    },
  },
  data() {
    return {
      options: [],
      lableName: "",
      form: {
        maxlength: "",
        minlength: "",
      },
    };
  },
  computed: {
    key() {
      return this.component.pageTempStructId + "-" + this.component.attrId;
    },
    disabled() {
      return this.formData[this.key].disabled;
    },
    actionValue() {
      if (this.component.actionValue) {
        let action = this.component.actionValue.split("|");
        this.$set(this.formData[this.key], "actionValue", action); //cjj改公共小问号 2025年1月
        return action;
      }
      return [];
    },
  },

  created() {
    this.$set(this.formData[this.key], "attr", this.form);
    if (!this.formData[this.key].actionValue) {
      this.$set(this.formData[this.key], "actionValue", []); //cjj改公共小问号 2025年1月
    }
    if (this.component.disabled) {
      this.formData[this.key].disabled = true;
    }
    if (
      //页面用户名默认限制40个字符
      this.formData[this.key].colId == "contactName" &&
      this.formData[this.key].tableName == "ORDER_CONTACT_INFO" &&
      !this.component.clearLimit
    ) {
      this.form.maxlength = 40;
    }
 
    if (this.component.actionValue) {
      let actionValue = this.component.actionValue.split("|");
      //下拉框
      if (actionValue[0] == "select") {
        this.$set(this.formData[this.key], "options", []);
        this.$set(this.formData[this.key], "cValue", "");
        this.$set(this.formData[this.key], "cDisabled", false);
        if (actionValue[2]) {
          this.formData[this.key].cValue = actionValue[2];
        }
      }
      //text
      if (actionValue[0] == "text") {
        this.$set(this.formData[this.key], "cValue", actionValue[1]);
      }
      //input框
      if (actionValue[0] == "input") {
        this.$set(this.formData[this.key], "cValue", actionValue[2]);
        this.$set(this.formData[this.key], "cDisabled", false);
      }
    }
  },
  methods: {
    getSelect() {
      let actionValues = this.formData[this.key].actionValue;
      if (actionValues.length < 2) return;
      let actEvent = actionValues[1].split("=");
      const strArr1 = actEvent[1].split(",");
      const handlerName1 = strArr1[0];
      const params1 = strArr1[1] || "";
      this.$emit("actEvent", { handlerName1, params1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.suffix {
  width: 80px;
  margin-left: 10px;
}
.suffix-1 {
  margin-left: 10px;
  display: inline;
  color: #999;
  font-size: 13px;
  vertical-align: middle;
}
.iconClass {
  border: none;
  background-color: transparent;
  i {
    font-size: 16px;
    color: rgb(12, 27, 226);
  }
}
</style>
