<template>
  <div>
    <!-- 老代码 -->
    <!-- <el-row>
			<el-col v-for="(struct, indexAB) in structData.dataStruct" :span="24" class="line" :key="indexAB">
				<el-row>
					<el-col :span="24" class="line">
						<h4 class="ne-inen-title">标题</h4>
						<PPMForm :structData="struct" :formData="formData"></PPMForm>
					</el-col>
				</el-row>
			</el-col>
		</el-row> -->
    <!-- 新代码 -->
    <el-col
      v-for="(struct, indexAB) in structData.dataStruct"
      :span="24"
      class="line"
      :key="indexAB"
      :id="struct.structId"
    >
      <el-row v-if="onoff(struct.structName, '$')">
        <el-col :span="10">
          <h4 class="ppm-label">{{ title(struct.structName, "$") }}</h4>
        </el-col>
      </el-row>
      <el-divider
        class="ppm-divider"
        v-if="onoff(struct.structName, '$')"
      ></el-divider>
      <!-- 判断第一个子结构是不是还是一个结构类型,如果是不要加上阴影,让子结构本身进行分割 -->
      <!-- <div :class="{ 'ppm-form-shadow-box': struct.attrs[0]['components'] }"> -->
      <PPMForm
        :structData="struct"
        :formData="formData"
        :ruleData="ruleData"
        :optionsList="optionsList"
        :folded="folded"
        @handleEvent="elEventHander"
        @actEvent="actEventHander"
        @ctrlfold="ctrlfold"
        @getPluginValue="getPluginValue"
        @getInputGridValue="getInputGridValue"
      ></PPMForm>
      <!-- </div> -->
    </el-col>
  </div>
</template>

<script>
import ppmstructmixin from "../utils/mixin";
export default {
  name: "PPMDataPanel",
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
      folded: true,
      proName: "",
    };
  },
  components: {
    PPMForm: () => import("./ppmForm"),
  },
  created() {
    this.proName = sessionStorage.getItem("proName") || "PPMForm";
  },
  methods: {
    nsrShow(value) {
      this.folded = value;
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
