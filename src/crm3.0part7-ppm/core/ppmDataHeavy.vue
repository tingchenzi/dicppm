<template>
  <div>
    <!-- 老代码 -->
    <!-- <el-row
      :class="structData.dataStruct.length > 1 ? 'ne-col2-gutter-15' : ''"
    >
      <el-col
        v-for="(struct, indexAB) in structData.dataStruct"
        :span="structData.dataStruct.length > 1 ? 12 : 24"
        class="line"
        :key="indexAB"
      >
        <el-row>
          <el-col :span="24" class="line">
            <h4 class="ne-inen-title">
              <span>{{ struct.structName }}</span>
            </h4>
          </el-col>
          <PPMForm :folded="$attrs.folded" :structData="struct" :formData="formData"></PPMForm>
        </el-row>
      </el-col>
    </el-row> -->
    <el-row type="flex" justify="space-between">
      <el-col
        :span="12"
        :style="indexAB % 2 == 1 ? [marginLeft] : []"
        class="ppm-box-group"
        v-for="(struct, indexAB) in structData.dataStruct"
        :key="indexAB"
        :id="struct.structId"
      >
        <h5 class="ppm-title" v-if="onoff(struct.structName, '$')">
          {{ title(struct.structName, "$") }}
        </h5>
        <PPMForm
          :folded="$attrs.folded"
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
    </el-row>
  </div>
</template>

<script>
import ppmstructmixin from "../utils/mixin";
export default {
  name: "PPMDataHeavy",
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
