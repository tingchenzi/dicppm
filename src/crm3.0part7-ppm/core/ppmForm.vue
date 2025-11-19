<template>
  <div>
    <template v-if="structData.url !== undefined && structData.url != ''">
      <!-- <component
                      :is="structData.url"
                      :formDate="formData"
      />-->
    </template>
    <template else>
      <template
        v-if="structData.attrs !== undefined && structData.attrs.length > 0"
      >
        <el-row
          :gutter="10"
          v-for="(attr, index) in structData.attrs"
          :key="index"
        >
          <template
            v-if="attr.dataStruct !== undefined && attr.dataStruct.length > 0"
          >
            <el-col :span="24" class="line">
              <template v-if="attr.dataStruct[0].structType == '4'">
                <!-- 数据分组(弱布局) -->
                <PPMDataWeak
                  :folded="$attrs.folded"
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  :id="attr.dataStruct[0].structId"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                />
              </template>
              <template v-else-if="attr.dataStruct[0].structType == '5'">
                <!-- 数据分组(强布局) -->
                <PPMDataHeavy
                  :folded="$attrs.folded"
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                />
              </template>
              <template v-else-if="attr.dataStruct[0].structType == '2'">
                <!-- 用做展开收起的数据分组 -->
                <PPMData
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  :id="attr.dataStruct[0].structId"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                />
              </template>
              <template v-else-if="attr.dataStruct[0].structType == '8'">
                <!-- 数据分组(面板)的组件 -->
                <PPMDataPanel
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                />
              </template>
            </el-col>
          </template>
          <template
            v-if="attr.tabStruct !== undefined && attr.tabStruct.length > 0"
          >
            <el-col :span="24" class="line">
              <template v-if="attr.tabStruct[0].structType == '6'">
                <PPMTabHori
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                ></PPMTabHori>
              </template>
              <template v-else-if="attr.tabStruct[0].structType == '7'">
                <PPMTabVerti
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                ></PPMTabVerti>
              </template>
              <template v-else>
                <PPMTab
                  :structData="attr"
                  :formData="formData"
                  :ruleData="ruleData"
                  :optionsList="optionsList"
                  @handleEvent="elEventHander"
                  @actEvent="actEventHander"
                  @ctrlfold="ctrlfold"
                  @getPluginValue="getPluginValue"
                  @getInputGridValue="getInputGridValue"
                ></PPMTab>
              </template>
            </el-col>
          </template>
          <template
            v-if="attr.components !== undefined && attr.components.length > 0"
          >
            <el-col
              v-for="(component, componentIndex) in attr.components"
              :span="component.col.span"
              class="line"
              v-show="showDiv(component.isDisplay)"
              v-bind:data-ctrl="component.isDisplay"
              :key="componentIndex"
            >
              <template v-if="component.attrTypeCd !== '20'">
                <template v-for="(value, key) in formData">
                  <template
                    v-if="
                      key ===
                      component.pageTempStructId + '-' + component.attrId
                    "
                  >
                    <!-- 校验入口: -->
                    <el-form-item
                      :key="key"
                      :label="component.attrName"
                      :id="key"
                      :prop="key + '.value'"
                      v-show="formData[key].isshow"
                      :required="
                        formData[key].required.split(',').includes('empty')
                      "
                    >
                      <!-- 普通文本框  -->
                      <template v-if="component.attrTypeCd === '1'">
                        <dyn-input
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          :component="component"
                          :formData="formData"
                          :vtype="'text'"
                          @change="GetEvent(component, 'change', $event)"
                          @clear="GetEvent(component, 'clear', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                          @input="GetEvent(component, 'input', $event)"
                          @click="GetEvent(component, 'click', $event, 1)"
                          @actEvent="actEventHander"
                        ></dyn-input>
                      </template>
                      <!-- 2:select 普通下拉 -->
                      <template
                        v-if="component.attrTypeCd === '2' && optionsList"
                      >
                        <dyn-select
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :component="component"
                          :optionsList="optionsList"
                          :formData="formData"
                          :formKey="key"
                          @change="GetEvent(component, 'change', $event)"
                          @visible-change="
                            GetEvent(component, 'visible-change', $event)
                          "
                          @remove-tag="
                            GetEvent(component, 'remove-tag', $event)
                          "
                          @clear="GetEvent(component, 'clear', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                          @click="GetEvent(component, 'click', $event, 1)"
                        ></dyn-select>
                      </template>
                      <!--43,快捷下拉  -->
                      <template
                        v-if="component.attrTypeCd === '43' && optionsList"
                      >
                        <sct-select
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :optionsList="optionsList"
                          :component="component"
                          :formData="formData"
                          :formKey="key"
                          @change="GetEvent(component, 'change', $event)"
                          @visible-change="
                            GetEvent(component, 'visible-change', $event)
                          "
                          @remove-tag="
                            GetEvent(component, 'remove-tag', $event)
                          "
                          @clear="GetEvent(component, 'clear', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                        ></sct-select>
                      </template>
                      <!-- 12:横向按钮组单选(自适应) -->
                      <template
                        v-if="component.attrTypeCd === '41' && optionsList"
                      >
                        <dyn-btngroup
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :component="component"
                          :optionsList="optionsList"
                          :formData="formData"
                          :formKey="key"
                          @change="GetEvent(component, 'change', $event)"
                        ></dyn-btngroup>
                      </template>
                      <!-- 3:textarea 文本域 -->
                      <template v-if="component.attrTypeCd === '3'">
                        <dyn-input
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          :component="component"
                          :formData="formData"
                          :vtype="'textarea'"
                          @change="GetEvent(component, 'change', $event)"
                          @clear="GetEvent(component, 'clear', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                          @input="GetEvent(component, 'input', $event)"
                        ></dyn-input>
                      </template>
                      <!-- 4:password 密码-->
                      <template v-if="component.attrTypeCd === '4'">
                        <el-input
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          type="password"
                          :readonly="component.readonly ? true : false"
                          :disabled="
                            component.disabled || formData[key].disabled == true
                              ? true
                              : false
                          "
                          @change="GetEvent(component, 'change', $event)"
                          @clear="GetEvent(component, 'clear', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                          @input="GetEvent(component, 'input', $event)"
                        ></el-input>
                      </template>
                      <!-- 5:radio 单选-->
                      <template
                        v-if="component.attrTypeCd === '5' && optionsList"
                      >
                        <dyn-radio
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :optionsList="optionsList"
                          :component="component"
                          :disableds="formData[key].disabled"
                          @change="GetEvent(component, 'change', $event)"
                        ></dyn-radio>
                      </template>
                      <!-- 6:横向按钮组复选-->
                      <template
                        v-if="component.attrTypeCd === '6' && optionsList"
                      >
                        <dyn-btncheckbox
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :optionsList="optionsList"
                          :component="component"
                          :formData="formData"
                          :formKey="key"
                          @change="GetEvent(component, 'change', $event)"
                        ></dyn-btncheckbox>
                      </template>
                      <!-- 40:日期控件 -->
                      <template v-if="component.attrTypeCd === '40'">
                        <dyn-datapicker
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          @input="validfield(key + '.value')"
                          :productId="structData.productId"
                          :attrId="component.attrId"
                          :component="component"
                          :formData="formData"
                          :formKey="key"
                          @change="GetEvent(component, 'change', $event)"
                          @focus="GetEvent(component, 'focus', $event)"
                          @blur="GetEvent(component, 'blur', $event)"
                        ></dyn-datapicker>
                      </template>
                      <!-- 50:进步器 -->
                      <!-- <template v-if="component.attrTypeCd === '1'">
                        <dyn-input-number
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          :component="component"
                          :formData="formData"
                          @change="GetEvent(component, 'change', $event)"
                        ></dyn-input-number>
                      </template> -->
                      <!-- 8:hidden 隐藏域-->
                      <template v-if="component.attrTypeCd === '8'">
                        <el-input
                          v-model="formData[key].value"
                          type="hidden"
                        ></el-input>
                      </template>
                      <!-- 10:点击按钮-->
                      <!-- <template v-if="component.attrTypeCd === '10'">
                          <dyn-button
                          v-model="formData[key].value"
                          v-show="formData[key].isshow"
                          :component="component"
                          :formData="formData"
                          @click="GetEvent(component, 'click', $event)"
                          @actEvent="actEventHander"
                        ></dyn-button>
                      </template> -->
                      <!-- 42:选项弹框(tree/list) -->
                      <template v-if="component.attrTypeCd === '42'">
                        <input-grid
                          :component="component"
                          :formData="formData"
                          :formKey="key"
                          v-model="formData[key].text"
                          v-show="formData[key].isshow"
                          :sqlCode="component.actionValue"
                          @getrow="
                            (val) => {
                              formData[key].value = val;
                              validfield(key + '.value');
                            }
                          "
                          @getInputGridValue="getInputGridValue"
                        />
                      </template>
                      <!-- 每个元素后面都可支持tips -->
                      <template v-if="component.tips && formData[key].isshow">
                        <span
                          v-if="
                            component.tips.split('|').length > 0 &&
                            component.tips.split('|')[0] == 'text'
                          "
                          style="
                            position: absolute;
                            width: 100%;
                            line-height: 34px;
                            color: red;
                          "
                        >
                          {{
                            formData[key].reserve1 ||
                            component.tips.split("|")[1]
                          }}
                        </span>
                        <el-tooltip
                          v-else
                          effect="light"
                          placement="right-start"
                        >
                          <div slot="content">
                            <div
                              v-html="formData[key].reserve1 || component.tips"
                            ></div>
                          </div>
                          <i class="el-icon-question" />
                        </el-tooltip>
                      </template>
                    </el-form-item>
                  </template>
                </template>
              </template>
              <template v-else>
                <div
                  style="display: inline-block; position: relative; width: 100%"
                >
                  <!-- 7:label -->
                  <template v-if="component.attrTypeCd === '7'"></template>
                  <!-- 10:button -->
                  <template v-if="component.attrTypeCd === '10'">
                    <!-- <component :is="component.actionValue" :formData="formData" /> -->
                  </template>
                  <!-- 20:plugin 有的插件需要传递参数,使用|把组件名称和参数分割-->
                  <template v-if="component.attrTypeCd === '20'">
                    <component
                      :is="pluginSubPath(component.actionValue)"
                      :config="dialogInputConfig(component.actionValue)"
                      :formData="formData"
                      :ruleData="ruleData"
                      :actionValue="component.actionValue"
                      :component="component"
                      @getPluginValue="getPluginValue"
                      @actEvent="actEventHander"
                    />
                  </template>
                  <!-- 每个元素后面都可支持tips -->
                  <template
                    v-if="
                      component.tips &&
                      formData[
                        component.pageTempStructId + '-' + component.attrId
                      ].isshow
                    "
                  >
                    <span
                      v-if="
                        component.tips.split('|').length > 0 &&
                        component.tips.split('|')[0] == 'text'
                      "
                      style="
                        position: absolute;
                        width: 100%;
                        line-height: 34px;
                        color: red;
                      "
                    >
                      {{
                        formData[
                          component.pageTempStructId + "-" + component.attrId
                        ].reserve1 || component.tips.split("|")[1]
                      }}
                    </span>
                    <el-tooltip v-else effect="light" placement="right-start">
                      <div slot="content">
                        <div
                          v-html="
                            formData[
                              component.pageTempStructId +
                                '-' +
                                component.attrId
                            ].reserve1 || component.tips
                          "
                        ></div>
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </template>
                  <!-- 30:lable -->
                  <template v-if="component.attrTypeCd === '30'">
                    {{ component.attrName }}
                    <label
                      :class="component.props['class']"
                      :style="component.props['style']"
                      >{{ component.defaultValue }}</label
                    >
                  </template>
                </div>
              </template>
            </el-col>
          </template>
        </el-row>
      </template>
    </template>
  </div>
</template>
<script>
import ValidateMap from "../utils/validate-map";
import { mapState, mapMutations } from "vuex";
export default {
  name: "ppmForm",
  props: {
    formData: {
      type: Object,
    },
    optionsList: {
      type: [Object, String],
    },
    ruleData: {
      type: Object,
      default: () => {
        return {
          ppm: {},
          rules: {},
        };
      },
    },
    structData: {
      type: Object,
    },
    spanNum: {
      type: Number,
      default: 24,
    },
    isHide: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState("orders", ["orderPosInfo"]),
    ...mapState("user", ["user"]),
  },
  data() {
    return {
      sugar: {
        width: "400px",
      },
    };
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  components: {
    PPMTab: () => import("./ppmTab"),
    PPMData: () => import("./ppmData"),
  },
  async created() {
    await this.load();
  },
  mounted() {
    this.ppmRenderCounter();
  },
  methods: {
    ...mapMutations("ppmRender", ["ppmRenderCounter"]),
    validfield(prop) {
      let ppm = this.ruleData["ppm"];
      ppm.$refs.ppmRef.validateField(prop);
    },
    async load() {
      //验证规则匹配
      if (this.structData.attrs != null && this.structData.attrs.length > 0) {
        await this.structData.attrs.forEach((attr) => {
          if (attr.components != undefined && attr.components.length > 0) {
            attr.components.forEach((component) => {
              //formdata的验证规则跟pagemoda同步，20210816 add by cjj
              if (
                this.formData[
                  component.pageTempStructId + "-" + component.attrId
                ]
              ) {
                this.formData[
                  component.pageTempStructId + "-" + component.attrId
                ]["required"] = component.validRule || "";
              }
              //202010816
              if (
                component.validRule != null &&
                component.validRule.length != 0
              ) {
                let validKeys = component.validRule.split(",");
                let propKey =
                  component.pageTempStructId +
                  "-" +
                  component.attrId +
                  ".value";
                let rules = [];
                this.ruleData["rules"][propKey] = rules;
                for (let i = 0; i < validKeys.length; i++) {
                  rules.push(
                    ValidateMap[validKeys[i].trim()](
                      component.attrName,
                      component.attrTypeCd == "5" ||
                        component.attrTypeCd == "41"
                        ? "change"
                        : "blur"
                    )
                  );
                }
              }
            });
          }
        });
      }
    },
    pluginSubPath(path) {
      const arr = path.split("|");
      return arr[0];
    },

    /**
     * 获取校验规则
     */
    getRulers(validRule, attrName) {
      const rules = [];
      let strs = validRule.split(",");
      for (let i = 0; i < strs.length; i++) {
        if (strs[i]) {
          rules.push(ValidateMap[strs[i]](attrName));
        }
      }
      return rules;
    },

    /**
     * 获取自定义的样式配置
     */
    getStyles(component) {
      let { property } = { ...component };
      let styles = {};
      if (property && typeof property == "object") {
        styles = property;
      }
      return styles;
    },

    // /**
    //  * 事件转换 add by cjj
    //  */
    // GetEvent(component, event, $event) {
    //   if (component.action) {
    //     if (component.action[0] == event) {
    //       return this.Newstring(component.action[1], $event);
    //     }
    //   }
    // },

    // Newstring(str, $event) {
    //   let strArr = str.split("|");

    //   return this[strArr[0]](strArr[1] ? strArr[1] : $event);
    // },

    /**
     * 重写GetEvent方法，将值传递到到ppform之外
     * flag=1 组件中插件绑定的方法   flag不存在  组件本身绑定的方法
     */
    GetEvent(component, event, $event, flag) {
      if (component.action) {
        if (component.action[0] == event) {
          const strArr = component.action[1].split("|");
          const handlerName = strArr[0];
          const params = strArr[1] ? strArr[1] : $event;
          this.$emit("handleEvent", { handlerName, params });
        }
      }
      if (flag && component.actionValue) {
        let actionValues = component.actionValue.split("|");
        if (actionValues[1]) {
          let actEvent = actionValues[1].split("=");
          if (actEvent[0] == event) {
            const strArr1 = actEvent[1].split(",");
            const handlerName1 = strArr1[0];
            const params1 = strArr1[1] ? strArr1[1] : $event;
            this.$emit("actEvent", { handlerName1, params1 });
          }
        }
      }
    },

    /**
     * 新建方法作用于ppmForm组件模板上应用的组件上，内部使用了ppform，循环时将传递出去
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
    /**
     * 初始化组件隐藏
     */
    showDiv(isDisplay) {
      if (isDisplay == "1") {
        return false;
      } else {
        return true;
      }
    },

    /**
     *  根据component的参数动态返回dialog-input需要的绑定参数
     */
    dialogInputConfig(val) {
      const configName = val.split("|")[1];
      if (!configName) {
        return {};
      }
      return {};
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

<style scoped>
/* .el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 190px;
} */
.line {
  position: relative;
}
.el-icon-question {
  position: absolute;
  margin-left: 10px;
  top: 5px;
}

::v-deep .el-form-item__content {
  white-space: nowrap;
}
</style>
