<template>
	<div>
		<el-row v-if="mode == '2'">
			<el-col>
				<el-row type="flex" class="row-bg" justify="center">
					<el-col :span="6">
						<el-button @click="showHandler" type="primary">
							{{ clktext }}
						</el-button>
					</el-col>
				</el-row>
			</el-col>
		</el-row>

		<el-row :class="{ 'form-block': boxShadow }">
			<el-row v-if="mode == '1'">
				<el-col class="ne-title" :span="24">
					<p class="left">
						<span>{{ title }}</span>
					</p>

					<!-- <div class="right ne-operation" @click="showHandler">
						<a id="moreMes" class="ne-tab-toggle" :class="{ hover: ishow || nsrIsShow }">{{ (ishow || nsrIsShow ? "隐藏" : "显示") + clktext }}</a>
					</div> -->
					<slot name="more-button"></slot>
				</el-col>
			</el-row>
			<el-col :span="24">
				<slot :fold="ishow"></slot>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import "@/styles/variables.scss";
export default {
	name: "FoldPanel",
	props: {
		mode: {
			type: String,
			default: "1",
		},

		formRef: {
			type: String,
			default: "form",
		},
		formRule: {
			type: Object,
			default: () => {
				return {};
			},
		},
		formModel: {
			type: Object,
			default: () => {
				return {};
			},
		},
		boxShadow: {
			type: Boolean,
			default: true,
		},
		clktext: {
			type: String,
			default: "",
		},
		title: {
			type: String,
			default: "",
		},
		textName: {
			type: String,
			default: "",
		},
		nsrIsShow: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			ishow: true,
		};
	},
	methods: {
		showHandler() {
			this.ishow = !this.ishow;
			this.$emit("nsrShow", this.ishow);
		},
		setVisible(val) {
			this.ishow = val;
		},
	},
};
</script>

<style lang="scss" scoped>
.left {
	span {
		font-size: $fontSize_v2;
		font-weight: 600;
		position: relative;
		color: $textColor1;
		padding-left: 0.08rem;
		&::before {
			content: "";
			display: inline-block;
			position: absolute;
			left: 0;
			top: 9%;
			height: 78%;
			border-left: 0.03rem solid #f56d39;
		}
	}
}
</style>
