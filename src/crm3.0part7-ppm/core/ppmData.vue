<template>
  <div>
    <anchor-menu>
      <el-col
        v-for="(struct, indexAB) in structData.dataStruct"
        :span="24"
        class="line"
        :key="indexAB"
        :id="struct.structId"
      >
        <el-row>
          <el-col :span="2">
            <h4 class="ppm-label" v-if="onoff(struct.structName, '$')">
              {{ title(struct.structName, "$") }}
            </h4>
          </el-col>
          <el-col
            :span="onoff(struct.structName, '$') ? 22 : 24"
            style="text-align: right; margin-top: -10px"
          >
            <el-button
              icon="el-icon-s-unfold"
              @click="ctrlfold(struct.structId)"
              >{{ folded ? "收起" : "展开"
              }}{{ title(struct.structName, "$") }}</el-button
            >
          </el-col>
        </el-row>
        <el-divider class="ppm-divider"></el-divider>
        <div>
          <PPMForm
            v-fold="folded"
            :structData="struct"
            :formData="formData"
            :ruleData="ruleData"
            :optionsList="optionsList"
            ref="getForm"
            @handleEvent="elEventHander"
            @actEvent="actEventHander"
            @ctrlfold="ctrlfold"
            @getPluginValue="getPluginValue"
            @getInputGridValue="getInputGridValue"
          ></PPMForm>
        </div>
      </el-col>
    </anchor-menu>
  </div>
</template>

<script>
import ppmstructmixin from "../utils/mixin";
export default {
  name: "PPMData",
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
      folded: false,
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
    ctrlfold(id) {
      this.folded = !this.folded;
      // let ele = this.$refs.getForm;
      //
      //
      //
      // this.addFold(ele[0].$el, this.folded);
      this.$emit("ctrlfold", this.folded, id);
      console.log(this.folded, id);
    },

    // getChildrens(ele, list) {
    //   var children = ele.children;
    //   for (var i = 0; i < children.length; i++) {
    //     var child = children[i];
    //     if (child.dataset.ctrl == 1) {
    //       list.push(child);
    //     }
    //     this.getChildrens(child, list);
    //   }
    // },

    // addFold(el, fold) {
    //   let list = [];
    //   this.getChildrens(el, list);
    //   list.forEach((node) => {
    //     if (fold) {
    //       node.style = "display:block";
    //     } else {
    //       node.style = "display:none";
    //     }
    //   });
    // },

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

    // ctrlfold(fold, id) {
    //   this.$emit("ctrlfold", fold, id);
    // },

    getPluginValue(obj) {
      this.$emit("getPluginValue", obj);
    },
    getInputGridValue(obj) {
      this.$emit("getInputGridValue", obj);
    },
  },
};
</script>
