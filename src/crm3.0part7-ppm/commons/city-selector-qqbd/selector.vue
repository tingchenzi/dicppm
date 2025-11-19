<template>
	<!-- <el-form-item class="ne-line" :label="cityName" :prop="getProp"> -->
	<div style="display:flex">
		<el-select v-if="address.hasOwnProperty('country')" filterable v-model="address.country" placeholder="国家" class="ne-select-s" style="width: 100%" @change="selectCounty">
			<el-option v-for="item in countries" :key="item.locId" :label="item.locName" :value="item.locId"> </el-option>
		</el-select>
		<el-select v-if="address.hasOwnProperty('provice')" filterable v-model="address.provice" placeholder="省" class="ne-select-s" style="width: 100%" @change="selectProvice">
			<el-option v-for="item in provices" :key="item.locId" :label="item.locName" :value="item.locId"> </el-option>
		</el-select>
		<el-select v-if="address.hasOwnProperty('city')" filterable v-model="address.city" placeholder="市" class="ne-select-s" style="width: 100%" @change="selectCity">
			<el-option v-for="item in citys" :key="item.locId" :label="item.locName" :value="item.locId"> </el-option>
		</el-select>
		<el-select v-if="address.hasOwnProperty('area')" filterable v-model="address.area" placeholder="县" class="ne-select-s" style="width: 100%" @change="selectArea">
			<el-option v-for="item in areas" :key="item.locId" :label="item.locName" :value="item.locId"> </el-option>
		</el-select>
	</div>
	<!-- </el-form-item> -->
</template>

<script>
import http from "../../utils/http";
export default {
	props: {
		cityName: {
			type: String,
			default: () => {
				return "";
			},
		},
		address: {
			type: Object,
			default: () => {
				// 26068 中国
				return { country: "", provice: "", city: "", area: "" };
			},
		},
		value: [String, Number],
	},

	data() {
		return {
			param: {
				qryType: "", //查询下级的级别  COUNTRY国家 PROVIENCE 省  CITY 市  县
				preLocId: "", //当前选择的 ,上一个组织的locId
				preRegionId: "", //暂时默认不填。当前选择的,preLocId和preRegionId选一个传或都传,上一个组织的RegionId，
			},
			countries: [],
			provices: [],
			citys: [],
			areas: [],
		};
	},
	created() {
		this.initContry();
		this.selectCounty();
	},
	computed: {
		currval: {
			get: function() {
				return this.value;
			},
			set: function(newValue) {

				let addr = newValue ? newValue : [];
				this.$emit("input", addr.reverse()[0]);
			},
		},
	},
	methods: {
		initContry() {
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
				}
			});
		},
		selectCounty(val) {
			//选择国家
			if (val) {
				//选择情况下触发事件清空值，初始化赋值不清空
				this.address.provice = "";
				this.address.city = "";
				this.address.area = "";
			}
			this.provices = [];
			this.citys = [];
			this.areas = [];
			//渲染省列表
			this.param.qryType = "PROVIENCE";
			this.param.preLocId = this.address.country;
			this.getCity(this.param).then((result) => {
				if (result.code == 200) {
					this.provices = result.meta.cityList;
				}
			});
			this.currval = this.address;
			this.$emit("selected", this.address);
		},

		selectProvice(val) {
			//选择省
			if (val) {
				//选择情况下触发事件清空值，初始化赋值不清空
				this.address.city = "";
				this.address.area = "";
			}
			this.citys = [];
			this.areas = [];
			//渲染市列表
			this.param.qryType = "CITY";
			this.param.preLocId = this.address.provice;
			this.getCity(this.param).then((result) => {
				if (result.code == 200) {
					this.citys = result.meta.cityList;
				}
			});
			this.currval = this.address;
			this.$emit("selected", this.address);
		},

		selectCity(val) {
			//选择城市
			if (val) {
				//选择情况下触发事件清空值，初始化赋值不清空
				this.address.area = "";
			}
			this.areas = [];
			//渲染区域列表
			this.param.qryType = "CITY";
			this.param.preLocId = this.address.city;
			this.getCity(this.param).then((result) => {
				if (result.code == 200) {
					this.areas = result.meta.cityList;
				}
			});
			this.currval = this.address;
			this.$emit("selected", this.address);
		},

		selectArea() {
			//选择区域
			this.$emit("selected", this.address);
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
