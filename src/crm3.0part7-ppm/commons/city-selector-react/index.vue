<template>
  <el-col :span="span">
    <el-form-item
      v-loading="loading"
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
import { mapState } from "vuex";
import OrderService from "@/api/order/OrderService.js";
export default {
  name: "CitySelectorReact",
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
      loading: false,
    };
  },
  props: {
    cityData: {
      type: Array,
      default: () => {
        return [];
      },
    },
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
    this.$set(this.formData[this.key], "options", [this.address]);
    if (this.cityData.length == 0) {
      this.initContry();
    } else {
      this.cityData.forEach((item) => {
        if (item.locId == this.address.country) {
          this.address.countryName = item.locName;
          let province = item.province ?? [];
          //第一行插一行空白
          if (province.length > 0) {
            if (province[0].locId != "") {
              province.unshift({
                areaCode: "",
                regionId: "",
                locName: "",
                locId: "",
              });
            }
          }
          this.provices = province;
        }
      });
    }
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
        formDisabled = "";
      }
      return formDisabled;
    },
    reserve1: {
      get() {
        return this.formData[this.key] ? this.formData[this.key].reserve1 : "";
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
      handler(val) {
        if (val != "") {
          this.selectCounty(val);
        } else {
          this.provices = [];
          this.citys = [];
          this.areas = [];
          this.address.provice = "";
          this.address.city = "";
          this.address.area = "";
          this.onSelected(this.address);
          if (this.collect) return;
          let obj = {
            address: this.address,
            key: this.key,
          };
          this.$emit("getPluginValue", obj);
        }
      },
      deep: true,
      immediate: true,
    },

    "address.provice": {
      handler(val) {
        if (val != "") {
          this.selectProvice(val);
        } else {
          this.citys = [];
          this.areas = [];
          this.address.city = "";
          this.address.area = "";
          this.onSelected(this.address);
          if (this.collect) return;
          let obj = {
            address: this.address,
            key: this.key,
          };
          this.$emit("getPluginValue", obj);
        }
      },
      deep: true,
      immediate: true,
    },

    "address.city": {
      handler(val) {
        if (val != "") {
          this.selectCity(val);
        } else {
          this.areas = [];
          this.address.area = "";
          this.onSelected(this.address);
          if (this.collect) return;
          let obj = {
            address: this.address,
            key: this.key,
          };
          this.$emit("getPluginValue", obj);
        }
      },
      deep: true,
      immediate: true,
    },

    "address.area": {
      handler(val) {
        if (val != "") {
          this.selectArea(val);
        } else {
          this.onSelected(this.address);
          if (this.collect) return;
          let obj = {
            address: this.address,
            key: this.key,
          };
          this.$emit("getPluginValue", obj);
        }
      },
      deep: true,
      immediate: true,
    },
    reserve1: {
      handler(val) {
        this.reserve1 = val;
      },
    },
  },

  methods: {
    selectChange() {
      this.collect = false;
      this.$store.commit("ppmPlugin/setSiteSelect", false);
    },
    //数据初始化
    async initContry() {
      this.loading = true;
      let res = await OrderService.qryAllCityInfo();
      this.loading = false;
      if (res.code == 200) {
        this.countries = res.meta;
        this.selectCounty(this.address.country);
      }
    },
    //国家选择事件
    selectCounty(val) {
      this.provices = [];
      this.citys = [];
      this.areas = [];
      //当传入城市有数据时，避免导入重复请求接口
      if (this.cityData.length > 0) {
        this.countries = this.cityData;
      }
      //渲染省列表
      this.countries.forEach((item) => {
        if (item.locId == val) {
          this.address.countryName = item.locName;
          let province = item.province ?? [];
          //第一行插一行空白
          if (province.length > 0) {
            if (province[0].locId != "") {
              province.unshift({
                areaCode: "",
                regionId: "",
                locName: "",
                locId: "",
              });
            }
          }
          this.provices = province;
          this.selectVal(this.reserve1, "provices");
        }
      });
      //选择情况下触发事件清空值，初始化赋值不清空
      if (val) {
        if (this.provices.length == 0 || !this.collect) {
          this.address.provice = "";
          this.address.city = "";
          this.address.area = "";
          this.address.proviceName = "";
          this.address.cityName = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }
      this.onSelected(this.address); //保存数据赋值
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
    },
    //省选择事件
    selectProvice(val) {
      //选择省
      this.citys = [];
      this.areas = [];
      //渲染市列表
      this.provices.forEach((item) => {
        if (item.locId == val) {
          this.address.proviceName = item.locName;
          let city = item.city ?? [];
          if (city.length > 0) {
            if (city[0].locId != "") {
              city.unshift({
                areaCode: "",
                regionId: "",
                locName: "",
                locId: "",
              });
            }
          }
          this.citys = city;
          this.selectVal(this.reserve1, "citys");
        }
      });
      //选择情况下触发事件清空值，初始化赋值不清空
      if (val) {
        if (this.citys.length == 0 || !this.collect) {
          this.address.city = "";
          this.address.area = "";
          this.address.cityName = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }
      this.onSelected(this.address); //保存数据赋值
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
      if (val == 27528 && this.address.isCityopt) {
        //跟需求确认只保留北京限制   20211104 add by cjj
        this.citys = [];
      }
    },
    //市选择事件
    selectCity(val) {
      this.areas = [];
      //渲染区域列表
      this.citys.forEach((item) => {
        if (item.locId == val) {
          this.address.cityName = item.locName;
          let area = item.area ?? [];
          if (area.length > 0) {
            if (area[0].locId != "") {
              area.unshift({
                areaCode: "",
                regionId: "",
                locName: "",
                locId: "",
              });
            }
          }

          this.areas = area;
          this.selectVal(this.reserve1, "areas");
        }
      });
      //选择情况下触发事件清空值，初始化赋值不清空
      if (val) {
        if (this.areas.length == 0 || !this.collect) {
          this.address.area = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }
      this.onSelected(this.address); //保存数据赋值
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
    },
    //区域选择事件
    selectArea(val) {
      this.areas.forEach((item) => {
        if (item.locId == val) {
          this.address.areaName = item.locName;
        }
      });
      this.onSelected(this.address); //保存数据赋值
      let obj = {
        address: this.address,
        key: this.key,
      };
      this.$emit("getPluginValue", obj);
    },

    //保存数据赋值
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

    //删除掉某些不想要的城市下拉值
    selectVal(obj, name) {
      if (obj && obj.name == name) {
        this[obj.name].forEach((item, index) => {
          if (obj["value"].indexOf(item.locId.toString()) != -1) {
            this[obj.name].splice(index, 1);
            return this.selectVal(obj, name);
          }
        });
      }
    },
  },
};
</script>
