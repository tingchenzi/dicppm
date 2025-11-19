<template>
  <div style="display: inline-block; width: 100%">
    <el-button
      :type="type"
      :style="component.property"
      :disabled="disabled"
      @click="$listeners.click($event)"
      style="cursor: pointer"
      >{{ formData[key].value || component.attrName }}</el-button
    >
  </div>
</template>

<script>
export default {
  name: "DynButton",
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
      type: "primary", //primary / success / warning / danger / info / text
    };
  },
  computed: {
    key() {
      return this.component.pageTempStructId + "-" + this.component.attrId;
    },
    disabled() {
      return Boolean(
        this.component.disabled || this.formData[this.key]?.disabled
      );
    },
    actionValue() {
      if (this.component.actionValue) {
        let action = this.component.actionValue.split("|");
        this.$set(this.formData[this.key], "actionValue", action);
        return action;
      }
      return [];
    },
  },

  created() {
    if (!this.formData[this.key].actionValue) {
      this.$set(this.formData[this.key], "actionValue", []);
    }
  },
  methods: {
  
  },
};
</script>

<style lang="scss" scoped>

</style>
