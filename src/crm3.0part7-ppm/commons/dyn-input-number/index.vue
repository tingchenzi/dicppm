<!--计数器、进步器  add by cjj 20240618-->
<template>
  <el-form-item
    :label="component.attrName"
    :prop="key + '.value'"
    style="position: relative; display: inline-block"
  >
    <el-input-number
      v-model="formData[key].value"
      :disabled="disabled"
      @change="GetEvent(component, 'change', $event)"
      :step="form.step"
      :min="form.min"
      :max="form.max"
      :step-strictly="form.strictly"
      :precision="form.precision"
      :controls-position="form.position"
      :label="form.label"
    ></el-input-number>
  </el-form-item>
</template>

<script>
export default {
  name: "dynInputNumber",
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
        step: 1, //步长 Number
        min: null, //最小值 Number
        max: "", //最大值 Number
        strictly: false, //属性接受一个Boolean。如果这个属性被设置为true，则只能输入步数的倍数。
        precision: 0, //可以控制数值精度，接收一个 Number。值必须是一个非负整数，并且不能小于 step 的小数位数
        label: "",
        position: "", //控制按钮位置
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
        return this.component.actionValue.split("|");
      } else {
        return [];
      }
    },
  },

  created() {
    this.$set(this.formData[this.key], "attr", this.form);
    if (this.component.disabled) {
      this.formData[this.key].disabled = true;
    }

    //dynInputNumber|step=2|min=5|max=30|strictly=0|precision=2|label=111|position=right
    if (this.actionValue.length > 0) {
      this.actionValue.forEach((item) => {
        let pronames = Object.keys(this.form);
        let arr = item.split("=");
        if (pronames.includes(arr[0])) {
          if (["label", "position", "strictly"].includes(arr[0])) {
            if (arr[0] == "strictly") {
              this.form.strictly = Boolean(Number(arr[1]));
            } else {
              this.form[arr[0]] = arr[1];
            }
          } else {
            this.form[arr[0]] = Number(arr[1]);
          }
        }
      });
    }
  },
  methods: {
    GetEvent(component, event, $event) {
      if (component.action) {
        if (component.action[0] == event) {
          const strArr = component.action[1].split("|");
          const handlerName1 = strArr[0];
          const params1 = strArr[1] ? strArr[1] : $event;
          this.$emit("actEvent", { handlerName1, params1 });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 150px;
  line-height: 32px;
}

::v-deep .el-input-number__increase {
  width: 34px;
}
::v-deep .el-input-number__decrease {
  width: 34px;
}
.is-controls-right {
  ::v-deep .el-input-number__increase {
    line-height: 16px;
  }
  ::v-deep .el-input-number__decrease {
    line-height: 14px;
  }
}
</style>
