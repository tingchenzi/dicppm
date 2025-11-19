<template>
  <div>
    <el-form-item
      :label="component.attrName"
      :id="component.attrId"
      prop="100013695.value"
      :rules="rules.validEnlarge"
      v-show="formData['100013695'].isshow"
    >
      <el-button-group style="display: flex">
        <template>
          <el-input
            v-model="formData['100013695'].value"
            readonly
            class="hide"
          ></el-input>
          <devperson-grid
            v-for="(item, index) in list"
            :key="index"
            @click="setIndex(index)"
            :index="index"
            :component="component"
            :formKey="index == '0' ? '1688-141000468' : '1689-141000468'"
            v-model="item.value"
            @getrow="getrow"
            :formData="formData"
          />
        </template>
        <el-col :span="4" style="display: flex">
          <el-button
            :type="addType"
            icon="el-icon-plus"
            class="ppm-icon-plus"
            :disabled="addDisabled || formData['100013695'].disabled == 'add'"
            @click="add"
          ></el-button>
          <el-button
            :type="reduceType"
            icon="el-icon-minus"
            class="ppm-icon-plus"
            :disabled="
              reduceDisabled || formData['100013695'].disabled == 'del'
            "
            @click="reduce"
          ></el-button>
        </el-col>
      </el-button-group>
    </el-form-item>
  </div>
</template>

<script>
import mixinstype20 from "../mixins/mixinstype20";
import devpersonGrid from "./devperson-grid.vue";
import { deepClone, deepAssign } from "../../utils/clone";
import config from "./config";
export default {
  name: "EnlargeGrid",
  mixins: [mixinstype20],
  components: {
    devpersonGrid,
  },
  data() {
    return {
      index: 0,
      config: {},
      addDisabled: false,
      reduceDisabled: false,
      addType: "primary",
      reduceType: "primary",
      rules: {
        validEnlarge: [
          {
            required: false,
            message: "发展人不能为空",
            validator: this.validEmpty,
          },
        ],
      },
    };
  },
  created() {
    this.config = deepClone(config);
    deepAssign(this.formData, this.config);
    this.$watch(
      () => this.formData["100013695"].required.includes("empty"),
      (newVal, oldVal) => {
        this.rules.validEnlarge[0].required = newVal;
      }
    );
  },
  computed: {
    list() {
      let data = this.formData["100013695"];
      let values = data.value.split(",");
      let texts = data.text.split(",");
      let arr = [];
      for (let i = 0; i < values.length; i++) {
        arr.push({ value: values[i], text: texts[i] });
      }
      if (arr.length == 2) {
        this.addDisabled = true;
        this.addType = "info";
        this.reduceDisabled = false;
        this.reduceType = "primary";
      }
      if (arr.length == 1) {
        this.reduceDisabled = true;
        this.reduceType = "info";
        this.addDisabled = false;
        this.addType = "primary";
        //清空第二发展人的值
        this.formData["1689-141000467"].value = "";
        this.formData["1689-141000468"].value = "";
        this.formData["1689-142003036"].value = "";
        this.formData["1689-142003037"].value = "";
        this.formData["1689-10000012860"].value = "";
      }
      return arr;
    },
  },
  methods: {
    validEmpty(rule, value, callback) {
      if (rule.required && this.formData["1688-141000468"].value == "") {
        return callback(rule.message);
      } else {
        callback();
      }
    },
    // 添加元件
    add() {
      let data = this.formData["100013695"];
      let values = data.value.split(",");
      values.length++;
      data.value = values.join(",");
      let texts = data.text.split(",");
      texts.length++;
      data.text = texts.join(",");
    },
    // 删除元件
    reduce() {
      let data = this.formData["100013695"];
      let values = data.value.split(",");
      values.length--;
      data.value = values.join(",");
      let texts = data.text.split(",");
      texts.length--;
      data.text = texts.join(",");
    },
    getrow(row, index) {
      let arr = [...this.list];
      let values = [],
        texts = [];
      for (let i = 0; i < arr.length; i++) {
        if (i == index) {
          arr[i].value = row.salesCode;
          arr[i].text = row.staffName;
        }
        values.push(arr[i].value);
        texts.push(arr[i].text);
      }
      this.formData["100013695"].value = values.join(",");
      this.formData["100013695"].text = texts.join(",");
      this.$emit("getPluginValue", { row, index }, "100013695"); //事件扩展
      this.getPluginValue({ row, index }, "100013695"); //本地调用
    },
    getPluginValue(obj, key) {
      if (key == "100013695") {
        //发展人信息
        if (obj.index == "0") {
          //第一发展人
          this.formData["1688-141000467"].value = obj.row.channelNbr; //渠道编码
          this.formData["1688-141000468"].value = obj.row.salesCode; //发展人标识
          this.formData["1688-142003036"].value = obj.row.staffName; //发展人姓名
          this.formData["1688-142003037"].value = obj.row.regionId; //发展人归属地
          this.formData["1688-10000012860"].value = obj.row.operatorsNbr; //发展人经营主体编码
        }
        if (obj.index == "1") {
          //第二发展人
          this.formData["1689-141000467"].value = obj.row.channelNbr; //渠道编码
          this.formData["1689-141000468"].value = obj.row.salesCode; //发展人标识
          this.formData["1689-142003036"].value = obj.row.staffName; //发展人姓名
          this.formData["1689-142003037"].value = obj.row.regionId; //发展人归属地
          this.formData["1689-10000012860"].value = obj.row.operatorsNbr; //发展人经营主体编码
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.hide {
  z-index: 0;
  visibility: hidden;
  width: 1px;
}
</style>
