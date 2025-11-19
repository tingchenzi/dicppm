<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col
        :span="12"
        :style="indexAB % 2 == 1 ? [marginLeft] : []"
        class="line"
        v-for="(struct, indexAB) in structData.dataStruct"
        :key="indexAB"
      >
        <h4
          class="ppm-style-title"
          :class="{
            'ppm-green-title': indexAB % 2 == 0,
            'ppm-orange-title': indexAB % 2 == 1,
          }"
        >
          {{ struct.structName }}
        </h4>
        <el-col style="padding-top: 10px">
          <PPMForm
            :structData="struct"
            :formData="formData"
            :ruleData="ruleData"
            :optionsList="optionsList"
            @handleEvent="elEventHander"
            @actEvent="actEventHander"
            @ctrlfold="ctrlfold"
            @getPluginValue="getPluginValue"
            @getInputGridValue="getInputGridValue"
          ></PPMForm>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ppmstructmixin from "../utils/mixin";
export default {
  name: "PPMDataWeak",
  mixins: [ppmstructmixin],
  props: {
    formData: {
      type: Object,
    },
    ruleData: {
      type: Object,
    },
    optionsList: {
      type: [Object, String],
    },
    structData: {
      type: Object,
    },
    spanNum: {
      type: Number,
      default: 24,
    },
  },
  data() {
    return {
      marginLeft: {
        marginLeft: "20px",
      },
      lineClass: {},
      proName: "",
    };
  },
  components: {
    PPMForm: () => import("./ppmForm"),
  },
  created() {
    this.proName = sessionStorage.getItem("proName") || "PPMForm";
  },
  mounted() {},
  methods: {
    /**
     * 用于内部使用了ppform，循环时将传递出去
     */
    elEventHander(data) {
      const { handlerName, params } = data;
      if (handlerName) {
        this.$emit("handleEvent", data);
      }
    },
    actEventHander(data) {
      const { handlerName1, params1 } = data;
      if (handlerName1) {
        this.$emit("actEvent", data);
      }
    },
    ctrlfold(fold, id) {
      this.$emit("ctrlfold", fold, id);
    },

    getPluginValue(obj) {
      this.$emit("getPluginValue", obj);
    },
    getInputGridValue(obj) {
      this.$emit("getInputGridValue", obj);
    },
  },
};
</script>

<style></style>
