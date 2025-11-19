<template>
  <el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
    <el-tab-pane
      v-for="(struct, index) in structData.tabStruct"
      :key="index"
      :label="struct.structName"
      :name="struct.structId + '-' + struct.structName"
    >
      <!-- <template v-if="struct.url !== undefined && struct.url != ''">
			</template>
			<template v-else> -->
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
      >
      </PPMForm>
      <!-- </template> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "PPMTabHori",
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
  },
  data() {
    return {
      //标签方向:top头部,right右边,bottom底部,left左边
      tabPosition: "top",
      activeName: "",
      proName: "",
    };
  },
  components: {
    PPMForm: () => import("./ppmForm"),
    //rentList: () => import("./rentList"),
  },
  created() {
    this.load();
    this.proName = sessionStorage.getItem("proName") || "PPMForm";
  },
  mounted() {
    if (
      this.structData.tabStruct !== undefined &&
      this.structData.tabStruct.length >= 1
    ) {
      this.activeName =
        this.structData.tabStruct[0].structId +
        "-" +
        this.structData.tabStruct[0].structName;
    }
  },
  methods: {
    load() {
      //验证规则匹配
      if (
        this.structData.tabStruct != null &&
        this.structData.tabStruct.length > 0
      ) {
        this.structData.tabStruct.forEach((tab) => {
          if (tab.covertName !== undefined && tab.covertName != "") {
            //tab.covertName作为属性调用后台接口，返回tabName,给tab.structName赋值
          }
        });
      }
      //
    },
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
