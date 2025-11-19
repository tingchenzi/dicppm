<template>
  <el-row>
    <el-form-item :required="required"   style="width: 100%">
      <el-input v-show="false" v-model="formDataValue" />
      <el-col :span="8"> 
        <el-select  
          :disabled="isSelect || disabled.split(',').includes('county')"
          v-if="address.hasOwnProperty('country')"
          filterable
          v-model="address.country"
          placeholder="国家"
          class="ne-select-s"
          style="width: 100%"
          @change="selectChange('country')"
        >
          <el-option
            v-for="item in countries"
            :key="item.locId"
            :label="item.locName"
            :value="item.locId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="7">
        <el-select
          :disabled="disabled.split(',').includes('province')"
          v-if="address.hasOwnProperty('provice')"
          filterable
          v-model="address.provice"
          placeholder="省"
          class="ne-select-s"
          style="width: 100%"
          @change="selectChange('provice')"
        >
          <el-option
            v-for="item in provices"
            :key="item.locId"
            :label="item.locName"
            :value="item.locId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="7">
        <el-select
          :disabled="disabled.split(',').includes('city')"
          v-if="address.hasOwnProperty('city')"
          filterable
          v-model="address.city"
          placeholder="市"
          class="ne-select-s"
          style="width: 100%"
          @change="selectChange('city')"
        >
          <el-option
            v-for="item in citys"
            :key="item.locId"
            :label="item.locName"
            :value="item.locId"
          ></el-option>
        </el-select>
      </el-col>
    </el-form-item>
  </el-row>
</template>

<script>
import mixinstype20 from "../mixins/mixinstype20";
import OrderService from "@/api/order/OrderService.js";
import http from "../../utils/http";
// import ValidateMap from "../../utils/validate-map";
// import Selector from "./selector.vue";
import { mapState } from "vuex";
export default {
  name: "CitySelectorQqbd",
  mixins: [mixinstype20, OrderService],
  data() {
    return {
      formDataValue: "",
      required: true,
      disabled: "county,province,city,area",
      countries: [],
      provices: [],
      citys: [],
      areas: [],
      cityList: [],
      formId: "",
      param: {
        qryType: "", //查询下级的级别  COUNTRY国家 PROVIENCE 省  CITY 市  县
        preLocId: "", //当前选择的 ,上一个组织的locId
        preRegionId: "" //暂时默认不填。当前选择的,preLocId和preRegionId选一个传或都传,上一个组织的RegionId，
      },
      collect: true
    };
  },
  props: {
    cityName: {
      type: String,
      default: () => {
        return "城市";
      }
    },

    isSelect: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    attrValue: [String, Number],
    value: [String, Number],
    cityDisabled: {
      type: String,
      default: () => {
        return "1";
      }
    },
    component: {
      type: Object,
      default: () => {
        return {};
      }
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
          reserve1: ""
        };
      }
    }
  },

  created() {
    this.formDataValue = this.value;
    // this.$set(this.formData[this.key], "options", [this.address]);
    this.initContry();
    this.selectCounty();
  },
  computed: {
    getProp() {
      // let prop =
      //   this.component.pageTempStructId +
      //   "-" +
      //   this.component.attrId +
      //   ".value";
      // return prop;
    },
    key() {
      return this.component.pageTempStructId;
    },
    // disabled() {
    //   let formDisabled = true;
    //     // this.formData[this.key].disabled || this.address.disabled;
    //   if (typeof formDisabled == "boolean") {
    //     formDisabled = "";
    //   }
    //   return formDisabled;
    // },
    reserve1: {
      get() {
        // return this.value ? this.value : "";
      },
      set() {}
    },

    thisVal: {
      get() {
        return this.value ? this.value : "";
      },
      set() {}
    },
    /**
     * 引入选择收藏模板标记
     */
    ...mapState("collect", ["activeTemplateId"])
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
        }
      },
      deep: true,
      immediate: true
    },

    "address.provice": {
      async handler(val) {
        if (val != "") {
          this.selectProvice(val);
        } else {
          this.changProviceVal(val);
        }
      },
      deep: true,
      immediate: true
    },

    "address.city": {
      async handler(val) {
        if (val != "") {
          this.selectCity(val);
        } else {
          this.changCityVal(val);
        }
      },
      deep: true,
      immediate: true
    },

    reserve1: {
      handler(val) {
        this.reserve1 = val;
        if (this.reserve1) {
          if (this.reserve1 != "26068") {
            this.selectVal(this.reserve1, this.reserve1);
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
      deep: true
    },

    thisVal: {
      async handler(val) {
        if (val) {
          if (val == "26068") {
            this.address.country = val;
            this.address.provice = "";
            this.initContry("1");
          } else {
            let indexCode = await this.getIndexCode(val);
            let locIds = indexCode.split("_");
            if (indexCode.indexOf("26068") > -1) {
              this.address.country = 26068;
              this.address.provice = val;
              if (this.disabled != "county,province,city,area") {
                  this.disabled = "city";
              }              
              // this.initContry("1");
            } else {
             this.address.provice ="";
             this.address.city ="";
              if (locIds.length >= 2) {
                this.address.country = parseInt(locIds[1]);
              }
              if (locIds.length >= 3) {
                this.address.provice = parseInt(locIds[2]);
              }
              if (locIds.length >= 4) {
                this.address.city = parseInt(locIds[3]);
              }
            }
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.getCitySelect(this.value);
    }, 3000);
  },
  // components: { Selector },
  methods: {
    async getIndexCode(locId) {
      let indexCode = "";
      let params = {
        interFaceType: "ORDER",
        sqlId: 20220225001,
        paramStr: "locId:" + locId
      };
      let result = await OrderService.executeSql(params);
      if (
        result.code == 200 &&
        result.meta &&
        result.meta.resList &&
        result.meta.resList.executeSqlResps &&
        result.meta.resList.executeSqlResps.length > 0
      ) {
        indexCode = result.meta.resList.executeSqlResps[0].text;
      }
      return indexCode;
    },
    async changProviceVal(val) {
      this.citys = [];
      this.areas = [];
      this.address.provice = val;
      this.address.city = "";
      this.onSelected(this.address);

      let obj = {
        address: this.address,
        key: this.key
      };
      this.$emit("getPluginValue", obj);
    },
    async changCityVal(val) {
      this.areas = [];
      this.address.city = "";
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key
      };
      this.$emit("getPluginValue", obj);
    },
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
    selectChange(type) {
      if (type == "country") {
        this.address.provice = " ";
        this.address.city = "";
      }
      if (type == "provice") {
        this.address.city = "";
      }
      if (this.address.provice==26068) {
          if (this.disabled != "county,province,city,area") {
            this.disabled = "city";
          } 
        }
      this.collect = false;
      this.$store.commit("ppmPlugin/setSiteSelect", false);
    },
    async initContry(flag) {
      let param = {};
      this.disabled = this.cityDisabled;
      this.formDataValue = this.value;
      param.qryType = "COUNTRY";
      param.preLocId = this.address.country;
      let countrys = await sessionStorage.getItem("countres");
      let result = null;
      if (countrys) {
        result = JSON.parse(countrys);
      } else {
        result = await this.getCity(param);
        let countrys = sessionStorage.setItem(
          "countres",
          JSON.stringify(result)
        );
      }
      if (result.code == 200) {
        this.countries = result.meta.cityList;
        this.countries.forEach(item => {
          if (item.locId == this.param.preLocId) {
            this.address.country = item.locId;
          }
        });
        this.selectVal(this.reserve1, "countries");
      }
      let obj = {
        address: this.address,
        key: this.key
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
      this.formDataValue = val;
      //获取国家名
      this.countries.forEach(item => {
        if (item.locId == val) {
          this.address.countryName = item.locName;
        }
      });
      //渲染省列表
      this.param.qryType = "PROVIENCE";
      this.param.preLocId = this.address.country;
      if (this.param.preLocId == "26068") {
        let cityList;
        if (this.cityList && this.cityList.length > 0) {
          cityList = this.cityList;
        } else {
          cityList = await this.getAttrInfo(9);
          this.cityList=cityList;
        }
        cityList.forEach(item => {
          item.locName = item.attrValueName;
          item.locId = item.attrValue;
        });
        this.provices = cityList;
        this.selectVal(this.reserve1, "provices");
        if (this.disabled != "county,province,city,area") {
          this.disabled = "city";
        }
      } else {
        await this.getCity(this.param).then(result => {
          if (result.code == 200) {
            result.meta.cityList.unshift({
              areaCode: "",
              regionId: "",
              locName: "",
              locId: ""
            });
            this.provices = result.meta.cityList;
            this.selectVal(this.reserve1, "provices");
          }
          if (this.disabled != "county,province,city,area") {
            this.disabled = "";
          }
        });
      }
      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (!this.collect) {
          this.address.provice = "";
          this.address.city = "";
          // this.address.area = "";
          this.address.proviceName = "";
          this.address.cityName = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key
      };
      //chengxiang  flag存在  不需要走导出事件
      if (!flag) {
        this.$emit("getPluginValue", obj);
      }
    },

    async getAttrInfo(typeFlag) {
      if (typeFlag != "") {
        let params = {
          interFaceType: "ORDER",
          sqlId: 202210140001,
          paramStr: "typeFlag:" + typeFlag
        };
        const result = await OrderService.executeSql(params);
        if (result.code == 200) {
          if (result.meta.resList.executeSqlResps.length > 0) {
            let cityList = result.meta.resList.executeSqlResps;
            return [...cityList];
          }
        }
      }
      return null;
    },

    async selectProvice(val, flag) {
      //选择省
      this.citys = [];
      this.formDataValue = val;
      this.areas = [];
      //获取省名
      this.provices.forEach(item => {
        if (item.locId == val) {
          this.address.proviceName = item.locName;
        }
      });
      //渲染市列表
      this.param.qryType = "CITY";
      this.param.preLocId = val;
      await this.getCity(this.param).then(result => {
        if (result.code == 200) {
          result.meta.cityList.unshift({
            areaCode: "",
            regionId: "",
            locName: "",
            locId: ""
          });
          this.citys = result.meta.cityList;
          this.selectVal(this.reserve1, "citys");
        }
      });

      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (this.citys.length == 0 || !this.collect) {
          this.address.city = "";
          // this.address.area = "";
          this.address.cityName = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }

      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key
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
      this.citys.forEach(item => {
        if (item.locId == val) {
          this.address.cityName = item.locName;
        }
      });
      //渲染区域列表
      this.param.qryType = "CITY";
      this.param.preLocId = val;
      await this.getCity(this.param).then(result => {
        if (result.code == 200) {
          result.meta.cityList.unshift({
            areaCode: "",
            regionId: "",
            locName: "",
            locId: ""
          });
          this.areas = result.meta.cityList;
          this.selectVal(this.reserve1, "areas");
        }
      });
      if (val) {
        //选择情况下触发事件清空值，初始化赋值不清空
        if (this.areas.length == 0 || !this.collect) {
          this.address.area = "";
          this.address.areaName = "";
          this.collect = true;
        }
      }
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key
      };
      this.$emit("getPluginValue", obj);
    },

    selectArea(val) {
      //获取区域名
      this.areas.forEach(item => {
        if (item.locId == val) {
          this.address.areaName = item.locName;
        }
      });
      //选择区域
      this.onSelected(this.address);
      let obj = {
        address: this.address,
        key: this.key
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
      // this.formDataValue = result;
      if (result && result != "26068") {
        this.$emit("input", result);
      }
      // let obj = {
      //   address: this.address,
      //   key: this.key
      // };
      // this.$emit("getPluginValue",obj);
    },
    async getCitySelect(val) {
      if (val) {
        if (val == "26068") {
          this.address.country = val;
          this.address.provice = "";
          this.initContry("1");
        } else {
          let indexCode = await this.getIndexCode(val);
          let locIds = indexCode.split("_");
          if (indexCode.indexOf("26068") > -1) {
            this.address.country = 26068;
            this.address.provice = val;
            // this.initContry("1");
          } else {
             this.address.provice ="";
             this.address.city ="";
            if (locIds.length >= 2) {
              this.address.country = parseInt(locIds[1]);
            }
            if (locIds.length >= 3) {
              this.address.provice = parseInt(locIds[2]);
            }
            if (locIds.length >= 4) {
              this.address.city = parseInt(locIds[3]);
            }
          }
        }
      }
    },

    async getCity(params) {
      let params1 = JSON.parse(JSON.stringify(params));
      let res = await http({
        url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryCityList`,
        data: params1,
        method: "GET"
      });
      return res;
    }
  }
};
</script>




<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
