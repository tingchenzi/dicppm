<template>
  <div class="ppm-box ppm-core-wrap" style="box-shadow: none">
    <el-form
      ref="ppmRef"
      :model="formData"
      :rules="ruleData.rules"
      label-width="100px"
    >
      <template v-for="(struct, index) in pageData">
        <!-- 0:基础模版 -->
        <template v-if="struct.formStruct">
          <PPMForm
            :structData="struct.formStruct"
            :formData="formData"
            :optionsList="optionsList"
            :ruleData="ruleData"
            :key="index"
            @handleEvent="elEventHander"
            @actEvent="actEventHander"
            @ctrlfold="ctrlfold"
            @getPluginValue="getPluginValue"
            @getInputGridValue="getInputGridValue"
          ></PPMForm>
        </template>
      </template>
    </el-form>
    <!-- 插入一个段非ppm配置的表单元素 2022/2/17 by yf -->
    <slot name="custFormItem"></slot>
    <slot name="footer" v-if="isBtnShow">
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <template v-if="!managerBd">
          <el-button v-if="isBackBtnShow" @click="goback">{{
            btnTextLF
          }}</el-button>
          <el-button
            :disabled="disabled"
            type="primary"
            v-prevent-re-click="handleSumbit"
          >
            {{ btnTextRg }}
          </el-button>
          <el-button
            v-if="btnTextZc"
            type="warning"
            v-prevent-re-click="handleZcSumbit"
          >
            {{ btnTextZc }}
          </el-button>
        </template>
        <template v-else>
          <el-button
            v-if="managerBd"
            type="primary"
            v-prevent-re-click="handleZcSumbit"
            >送售前支撑经理补单</el-button
          >
        </template>
      </el-row>
    </slot>
    <!---公共弹窗，用于ppm页面中插入弹窗-->
    <vdialog
      v-if="dialogData && dialogData.showWorkDialog"
      :dialogData="dialogData"
      @saveClick="saveClick"
      @eventClick="eventClick"
    ></vdialog>
  </div>
</template>

<script>
import "@/crm3.0part7-ppm/styles/index.css";
import { mapMutations } from "vuex";
import ValidateMap from "../utils/validate-map";
import vdialog from "@/components/public/vdialog";

export default {
  name: "PPMPage",
  props: {
    tempId: {
      type: Number,
      default: undefined,
    },
    formData: {
      type: Object,
    },
    pageData: {
      type: Array,
    },
    params: {
      type: Object,
    },
    isBtnShow: {
      type: Boolean,
      default: true,
    },
    isBackBtnShow: {
      type: Boolean,
      default: true,
    },
    btnTextLF: {
      type: String,
      default: "返回",
    },
    btnTextRg: {
      type: String,
      default: "保存",
    },
    btnTextZc: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    optionsList: {
      type: [Object, String],
    },
    managerBd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ruleData: {
        ppm: null,
        rules: {},
      },
      pageModel: [],
      paramModel: {},
      cacheRules: null,
      dialogData: null,
    };
  },
  components: {
    PPMForm: () => import("./ppmForm"),
    vdialog,
  },

  mounted() {
    this.ruleData.ppm = this;
  },
  beforeDestroy() {
    sessionStorage.removeItem("proName");
    //重置对options处理的vuex的状态
    this.resetQryAttrValueList();
    //重置拓展插件的vuex的状态
    this.resetPlugin();
    //ppm页面中老的写法增加了定时器后面没有替代干净 在此要清除所有定时器 by yuanfei  2023/4/21
    clearTimeout();
  },
  methods: {
    ...mapMutations("app", ["SET_PPM_REF"]),
    ...mapMutations("http", ["resetQryAttrValueList"]),
    ...mapMutations("ppmPlugin", ["resetPlugin"]),

    /**
     * 动态设置验证规则 add by cjj 20210816
     * 传值为对象：
     * attrName: "订单要求完成日期", //属性名
     * formkey: "10461405-100010082", //属性唯一id
     * reqName: "empty,email", //校验名。例：empty为非空校验，email为邮件校验，多条验证以，分割开。具填参照公共规则validate-map.js
     * reqStatus: true, //校验状态，true为增加，false为删除
     * trigger: "blur", //['blur', 'change']多触发器：trigger 可设为数组，如 ['blur', 'change']
     */
    SetRequired(obj) {
      // 前置检查：表单数据不存在则直接返回
      if (!this.formData[obj.formkey]) {
        return;
      }

      const rules = this.ruleData.rules;
      const ruleKey = `${obj.formkey}.value`;
      const reqNameArr = obj.reqName.split(",").map((name) => name.trim());
      const formField = this.formData[obj.formkey];
      let required = formField.required ? formField.required.split(",") : [];

      // 确保规则数组存在
      if (!rules[ruleKey]) {
        rules[ruleKey] = [];
      }

      const currentRules = rules[ruleKey];
      const ruleNames = currentRules.map((rule) => rule.name);

      // 处理每个验证规则
      reqNameArr.forEach((reqName) => {
        // 检查验证规则是否存在
        if (!ValidateMap[reqName]) {
          console.warn(`验证规则 "${reqName}" 不存在于 ValidateMap 中`);
          return;
        }

        const ruleExists = ruleNames.includes(reqName);
        const requiredExists = required.includes(reqName);

        if (obj.reqStatus) {
          // 添加规则
          if (!ruleExists) {
            try {
              // 创建并添加验证规则
              const newRule = ValidateMap[reqName](obj.attrName, ['blur', 'change']);
              if (newRule) {
                currentRules.push(newRule);
                ruleNames.push(reqName);

                // 更新 required 数组
                if (!requiredExists) {
                  required.push(reqName);
                }
              }
            } catch (error) {
              console.error(`添加验证规则 "${reqName}" 时出错:`, error);
            }
          }
        } else {
          // 删除规则
          if (ruleExists) {
            // 从规则数组中移除
            const index = currentRules.findIndex((rule) => rule.name === reqName);
            if (index > -1) {
              currentRules.splice(index, 1);
              ruleNames.splice(index, 1);
            }

            // 更新 required 数组
            if (requiredExists) {
              required = required.filter((item) => item !== reqName);
            }
          }
        }
      });

      // 统一更新 formData 的 required 字段
      formField.required = required.length > 0 ? required.toString() : "";
    },

    /**  2021/10/14 by yf
     * 保存前，有些变更页面需要做一些特殊处理，增加保存前的回调beforeSave,可以在规则混入文件中定义,
     * 该方法需要返回值，返回值为true时才会进行下面的保存操作。
     * 有些页面的保存方法甚至需要重写，增加自定义保存方法customSave，可以在规则混入文件中定义。
     * 将原有的originSumbit作为默认的保存方法。
     * 受理页面的钩子函执行顺序：beforeSave->validate(ruler的校验)->afterValidated->save
     **/
    originSumbit() {
      let orderFlag = true;
      if (typeof this.$parent.validOrderInfo != "undefined") {
        orderFlag = this.$parent.validOrderInfo(); //单产品增加订单项信息规则校验  add by cjj 20220401
      }
      if (typeof this.$listeners.validOrderInfo != "undefined") {
        orderFlag = this.$listeners.validOrderInfo(); //多产品增加订单项信息规则校验  add by cjj 20220629
      }
      this.$refs["ppmRef"].validate(async (valid, object) => {
        if (valid) {
          /* 增加一个校验之后的钩子函数 afterValidated 2021/10/25 by yf*/
          if (!orderFlag) {
            return false;
          }
          //afterValidated逻辑处理
          if (
            this.afterValidated &&
            typeof this.afterValidated === "function"
          ) {
            const res = await this.afterValidated();
            if (!res) {
              return false;
            }
          }
          //customSave的逻辑处理，在规则js中定义并需要返回值
          if (this.customSave && typeof this.customSave === "function") {
            const res1 = await this.customSave();
            if (!res1) {
              return false;
            }
            this.$emit("on-sumbit", "customSave");
          } else {
            this.$emit("on-sumbit", "1"); //'1'-保存；'2'-暂存
          }
        } else {
          this.$store.commit("combination/setCombinBtn", ""); //清除多产品受理按钮选择状态 add by cjj  20220119
          let result = Object.values(object);
          this.$message({
            message: result[0][0].message,
            type: "error",
            offset: 60,
          });
        }
      });
    },

    async validLoad() {
      //ppm规则验证，其他主页面自定义提交事件引用,如明细 add by cjj 20210815
      let flag = "1";
      // 2021/12/30 by yf 将beforeSave 调整到validate之前 与受理页面的钩子函数一致：beforeSave->validate(ruler的校验)->afterValidated->save
      if (this.beforeSave && typeof this.beforeSave === "function") {
        const beforeRes = await this.beforeSave();
        if (!beforeRes) {
          flag = "2";
          return flag;
        }
      }
      this.$refs["ppmRef"].validate((valid, object) => {
        if (valid) {
          flag = "1";
        } else {
          let result = Object.values(object);
          this.$message({
            message: result[0][0].message,
            type: "error",
            offset: 60,
          });
          // this.$notify.error({
          //   title: "校验失败",
          //   message: result[0][0].message,
          // });
          flag = "2";
        }
      });
      if (flag == "2") {
        return flag;
      }
      if (this.afterValidated && typeof this.afterValidated === "function") {
        const res = await this.afterValidated();
        if (!res) {
          flag = "2";
          return flag;
        }
      }
      if (this.customSave && typeof this.customSave === "function") {
        await this.customSave();
        flag = "2";
        return flag;
      }
      return flag;
    },

    preview() {
      this.$emit("preview", this.paramModel);
    },
    goback() {
      this.$emit("goback", this.paramModel);
    },
    /**
     * PPMForm动态绑定的方法，根据根据配置需求在被混入文件中定义
     */
    elEventHander(data) {
      const { handlerName, params } = data;
      if (handlerName) {
        this[handlerName](params);
      }
    },
    actEventHander(data) {
      console.log(data);
      const { handlerName1, params1 } = data;
      console.log(handlerName1, params1);
      if (handlerName1) {
        this[handlerName1](params1);
      }
    },
    /**
     * PPMForm上静态绑定的方法，在被混入的文件中可对这些方法重写
     */
    ctrlfold() {},
    getPluginValue() {},
    getInputGridValue() {},

    async handleSumbit() {
      if (this.beforeSave && typeof this.beforeSave === "function") {
        const beforeRes = await this.beforeSave();
        if (!beforeRes) {
          this.$store.commit("combination/setCombinBtn", ""); //清除多产品受理按钮选择状态 add by cjj  20220119
          return false;
        }
      }
      await this.originSumbit();
    },
    /*暂存 2021/12/6 by yf*/
    async handleZcSumbit() {
      if (this.beforeSave && typeof this.beforeSave === "function") {
        const beforeRes = await this.beforeSave();
        if (!beforeRes) {
          return false;
        }
      }
      if (this.afterValidated && typeof this.afterValidated === "function") {
        const res = await this.afterValidated();
        if (!res) {
          return false;
        }
      }
      this.$emit("on-sumbit", "2"); //'1'-保存；'2'-暂存
    },

    saveClick(data) {},
    eventClick(obj) {},
  },
};
</script>
