export default {
	props: {
		component: {
			type: Object,
			default: () => {
				return {};
			},
		},
		formData: {
			type: Object,
		},
		ruleData: {
			type: Object,
		},
		actionValue: {
			type: String,
			default: "",
		},
		span: {
			type: Number || String,
			default: 24,
		},
	},
	computed: {
		// 选项弹框使用需要配置页面时以 "插件名|SQLcode" 的形式配置 (如:发展人那个动态弹框)
		sqlCode() {
			return this.actionValue.split("|")[1] || "findCust";
		},
		// 城市插件时,需要配置页面时以 "插件名|级别()" 的形式配置 (如:接入城市)
		cityLevel() {
			return this.actionValue.split("|")[1] || "country";
		},
	},
};
