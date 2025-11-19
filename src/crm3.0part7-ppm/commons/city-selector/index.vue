<template>
  <el-col :span="span" style="padding: 0px">
    <el-form-item
      class="ne-line"
      :label="component.attrName || cityName"
      :prop="getProp"
      v-show="formData[key].isshow"
      :required="formData[key].required.split(',').includes('empty')"
    >
      <el-input v-show="false" v-model="formData[key].value" />
      <el-select
        :disabled="isSelect || disabled.split(',').includes('county')"
        v-if="address.hasOwnProperty('country')"
        filterable
        v-model="address.country"
        placeholder="国家"
        class="ne-select-s"
        style="width: 100%"
        @change="selectChange"
      >
        <el-option
          v-for="item in countries"
          :key="item.locId"
          :label="item.locName"
          :value="item.locId"
        >
        </el-option>
      </el-select>
      <el-select
        :disabled="disabled.split(',').includes('province')"
        v-if="address.hasOwnProperty('provice')"
        filterable
        v-model="address.provice"
        placeholder="省"
        class="ne-select-s"
        style="width: 100%"
        @change="selectChange"
      >
        <el-option
          v-for="item in provices"
          :key="item.locId"
          :label="item.locName"
          :value="item.locId"
        >
        </el-option>
      </el-select>
      <el-select
        :disabled="disabled.split(',').includes('city')"
        v-if="address.hasOwnProperty('city')"
        filterable
        v-model="address.city"
        placeholder="市"
        class="ne-select-s"
        style="width: 100%"
        @change="selectChange"
      >
        <el-option
          v-for="item in citys"
          :key="item.locId"
          :label="item.locName"
          :value="item.locId"
        >
        </el-option>
      </el-select>
      <el-select
        :disabled="disabled.split(',').includes('area')"
        v-if="address.hasOwnProperty('area')"
        filterable
        v-model="address.area"
        placeholder="县"
        class="ne-select-s"
        style="width: 100%"
        @change="selectChange"
      >
        <el-option
          v-for="item in areas"
          :key="item.locId"
          :label="item.locName"
          :value="item.locId"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script>
import mixinstype20 from "../mixins/mixinstype20";
import http from "../../utils/http";
// import ValidateMap from "../../utils/validate-map";
// import Selector from "./selector.vue";
import { mapState } from "vuex";
export default {
  name: "CitySelector",
  mixins: [mixinstype20],
  data() {
    return {
      countries: [],
      provices: [],
      citys: [],
      areas: [],
      formId: "",
      param: {
        qryType: "", //查询下级的级别  COUNTRY国家 PROVIENCE 省  CITY 市  县
        preLocId: "", //当前选择的 ,上一个组织的locId
        preRegionId: "", //暂时默认不填。当前选择的,preLocId和preRegionId选一个传或都传,上一个组织的RegionId，
      },
      collect: true,
    };
  },
  props: {
    cityName: {
      type: String,
      default: () => {
        return "城市";
      },
    },
    isSelect: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    value: [String, Number],

    component: {
      type: Object,
      default: () => {
        return {};
      },
    },

    address: {
      type: Object,
      default: () => {
        return {
          country: 26068,
          provice: "",
          proviceCode: "",
          city: "",
          isCityopt: true,
          area: "",
          countryName: "中国",
          proviceName: "",
          cityName: "",
          areaName: "",
          disabled: "",
          reserve1: "",
        };
      },
    },
  },

  created() {
    // this.formData[this.key].value = this.currval;
    this.$set(this.formData[this.key], "options", [this.address]);
    this.initContry();
    this.selectCounty();
  },
  computed: {
    getProp() {
      let prop =
        this.component.pageTempStructId +
        "-" +
        this.component.attrId +
        ".value";
      return prop;
    },
    key() {
      return this.component.pageTempStructId + "-" + this.component.attrId;
    },
    disabled() {
      let formDisabled =
        this.formData[this.key].disabled || this.address.disabled;
      if (typeof formDisabled == "boolean") {
        if (formDisabled === true) {
          formDisabled = "county,province,city,area";
        } else {
          formDisabled = "";
        }
      }
      return formDisabled;
    },
    reserve1: {
      get() {
        return this.formData[this.key] ? this.formData[this.key].reserve1 : "";
      },
      set() {},
    },
    reserve2: {
      get() {
        return this.formData[this.key] ? this.formData[this.key].reserve2 : "";
      },
      set() {},
    },
    /**
     * 引入选择收藏模板标记
     */
    ...mapState("collect", ["activeTemplateId"]),
  },

  watch: {
    /**
     * activeTemplateId
     */
    activeTemplateId() {
      //模板收藏标识
      this.collect = true;
    },

    "address.country": {
      async handler(val) {
        if (val != "") {
          this.selectCounty(val);
        } else {
          this.provices = [];
          this.citys = [];
          this.areas = [];
          this.address.country = "";
          this.onSelected(this.address);
          let obj = {
            address: this.address,
            key: this.key,
          };
          //解决immediate初始化空值触发报错
          if (this.formData[this.key]?.options !== undefined) {
            this.$emit("getPluginValue", obj);
          }
        }
      },
      deep: true,
      immediate: true,
    },

    "address.provice": {
      async handler(val) {
        if (val != "") {
          this.selectProvice(val);
        } else {
          this.citys = [];
          this.areas = [];
          this.address.provice = "";
          this.onSelected(this.address);
          let obj = {
            address: this.address,
            key: this.key,
          };
          //解决immediate初始化空值触发报错
          if (this.formData[this.key]?.options !== undefined) {
            this.$emit("getPluginValue", obj);
          }
        }
      },
      deep: true,
      immediate: true,
    },

    "address.city": {
      async handler(val) {
        if (val != "") {
          this.selectCity(val);
        } else {
          this.areas = [];
          this.address.city = "";
          this.onSelected(this.address);
          let obj = {
            address: this.address,
            key: this.key,
          };
          if (this.formData[this.key]?.options !== undefined) {
            this.$emit("getPluginValue", obj);
          }
        }
      },
      deep: true,
      immediate: true,
    },

    "address.area": {
      async handler(val) {
        if (val != "") {
          this.selectArea(val);
        } else {
          this.address.area = "";
          this.onSelected(this.address);
          let obj = {
            address: this.address,
            key: this.key,
          };
          if (this.formData[this.key]?.options !== undefined) {
            this.$emit("getPluginValue", obj);
          }
        }
      },
      deep: true,
      immediate: true,
    },
    reserve1: {
      handler(val) {
        this.reserve1 = val;
        if (this.reserve1 && this.reserve1.flag) {
          if (this.reserve1.value.length > 0) {
            this.selectVal(this.reserve1, this.reserve1.name);
          } else {
            //还原城市信息
            this.initContry("1");
            this.selectCounty(this.address.country, "1");
            if (this.address.provice) {
              this.selectProvice(this.address.provice, "1");
            }
          }
        }
      },
      deep: true,
    },
    reserve2: {
      handler(val) {
        //判断为某些省份或者城市时，不请求下一级下拉值
        this.reserve2 = val;
      },
      deep: true,
    },
  },
  // components: { Selector },
  methods: {
    selectVal(obj, name) {
      if (obj && obj.name == name) {
        if (obj.flag == "save") {
          if (
            name == "provices" &&
            obj.parent &&
            obj.parent.indexOf(this.address.country) > -1
          ) {
            return;
          } else if (
            name == "citys" &&
            obj.parent &&
            this.address.provice != obj.parent
          ) {
            return;
          }
          //保留某些想要的城市下拉值
          this[obj.name].forEach((item, index) => {
            if (obj["value"].indexOf(item.locId.toString()) == -1) {
              this[obj.name].splice(index, 1);
              return this.selectVal(obj, name);
            }
          });
        } else if (obj.flag == "add") {
          //新增某些城市的下拉框值(全球波道需求)
          if (obj.deleteAll && obj.deleteAll == 1) {
            this[obj.name].splice(1, this[obj.name].length);
          }
          obj["value"].forEach((item, index) => {
            this[obj.name].push(item);
          });
        } else {
          //删除掉某些不想要的城市下拉值
          this[obj.name].forEach((item, index) => {
            if (obj["value"].indexOf(item.locId.toString()) != -1) {
              this[obj.name].splice(index, 1);
              return this.selectVal(obj, name);
            }
          });
        }
      }
      if (obj && obj.children) {
        return this.selectVal(obj.children, obj.children.name);
      }
    },
    selectChange() {
      this.collect = false;
      this.$store.commit("ppmPlugin/setSiteSelect", false);
    },
    initContry(flag) {
      this.param.qryType = "COUNTRY";
      this.param.preLocId = this.address.country;
      this.getCity(this.param).then((result) => {
        if (result.code == 200) {
          this.countries = result.meta.cityList;
          this.countries.forEach((item) => {
            if (item.locId == this.param.preLocId) {
              this.address.country = item.locId;
            }
          });
          this.selectVal(this.reserve1, "countries");
        }
      });
      let obj = {
        address: this.address,
        key: this.key,
      };
      //chengxiang  flag存在  不需要走导出事件
      if (!flag) {
        this.$emit("getPluginValue", obj);
      }
    },
    async selectCounty(val, flag) {
      //选择国家
      this.provices = [];
      this.citys = [];
      this.areas = [];
      //获取国家名
      this.countries.forEach((item) => {
        if (item.locId == val) {
          this.address.countryName = item.locName;
        }
      });
      //渲染省列表
      this.param.qryType = "PROVIENCE";
      this.param.preLocId = this.address.country;
      await this.getCity(this.param).then((result) => {
        if (result.code == 200) {
          result.meta.cityList.unshift({
            areaCode: "",
            regionId: "",
            locName: "",
            locId: "",
          });
          this.provices = result.meta.cityList;
          this.selectVal(this.reserve1, "provices");
        }
      });
      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (this.provices.length == 0 || !this.collect) {
          this.address.provice = "";
          this.address.city = "";
          this.address.area = "";
          this.address.proviceName = "";
          this.address.proviceCode = "";
          this.address.cityName = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }

      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key,
      };
      //chengxiang  flag存在  不需要走导出事件
      if (!flag) {
        this.$emit("getPluginValue", obj);
      }
    },

    async selectProvice(val, flag) {
      //选择省
      this.citys = [];
      this.areas = [];
      //获取省名
      this.provices.forEach((item) => {
        if (item.locId == val) {
          this.address.proviceName = item.locName;
          this.address.proviceCode = item.regionId;
        }
      });
      //渲染市列表
      this.param.qryType = "CITY";
      this.param.preLocId = val;
      await this.getCity(this.param).then((result) => {
        if (result.code == 200) {
          result.meta.cityList.unshift({
            areaCode: "",
            regionId: "",
            locName: "",
            locId: "",
          });
          this.citys = result.meta.cityList;
          this.selectVal(this.reserve1, "citys");
        }
      });

      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (this.citys.length == 0 || !this.collect) {
          if (this.address.hasOwnProperty("city")) {
            this.address.city = "";
            this.address.cityName = "";
          }
          if (this.address.hasOwnProperty("area")) {
            this.address.area = "";
            this.address.areaName = "";
          }
          this.collect = true;
        }
      }

      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key,
      };
      //chengxiang  flag存在  不需要走导出事件
      if (!flag) {
        this.$emit("getPluginValue", obj);
      }
      if (val == 27528 && this.address.isCityopt) {
        //跟需求确认只保留北京限制   20211104 add by cjj
        this.citys = [];
      }
    },

    async selectCity(val) {
      //选择城市
      this.areas = [];
      //获取城市名
      this.citys.forEach((item) => {
        if (item.locId == val) {
          this.address.cityName = item.locName;
        }
      });
      //渲染区域列表
      this.param.qryType = "CITY";
      this.param.preLocId = val;
      await this.getCity(this.param).then((result) => {
        if (result.code == 200) {
          result.meta.cityList.unshift({
            areaCode: "",
            regionId: "",
            locName: "",
            locId: "",
          });
          if (this.reserve2 && this.reserve2.includes(val)) {
          } else {
            this.areas = result.meta.cityList;
          }
          this.selectVal(this.reserve1, "areas");
        }
      });
      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (this.areas.length == 0 || !this.collect) {
          if (this.address.hasOwnProperty("area")) {
            this.address.area = "";
            this.address.areaName = "";
          }
          this.collect = true;
        }
      }
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
    },

    selectArea(val) {
      //获取区域名
      this.areas.forEach((item) => {
        if (item.locId == val) {
          this.address.areaName = item.locName;
        }
      });
      //选择区域
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
    },

    onSelected(address) {
      //
      let result,
        { country, provice, city, area } = address;
      if (area) result = area;
      else if (city) result = city;
      else if (provice) result = provice;
      else if (country) result = country;
      else result = "";
      this.formData[this.key].value = result;
    },

    async getCity(params) {
      let res = await http({
        url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryCityList`,
        data: params,
        method: "GET",
      });
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
.ne-select-s ::v-deep .el-input__inner {
  height: 0.34rem !important;
}
</style>
