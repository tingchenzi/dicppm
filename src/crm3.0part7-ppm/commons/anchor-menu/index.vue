<template>
	<el-row>
		<el-col :span="items.length ? 21 : 24">
			<slot></slot>
		</el-col>
		<!-- 右侧锚点菜单 -->
		<el-col :span="3" style="height:100%" v-if="items.length > 0">
			<ul class="ppm-side-nav">
				<li href="" class="ppm-side-item active">业务信息</li>
				<li href="" class="ppm-side-item">自费信息</li>
			</ul>
		</el-col>
	</el-row>
</template>

<script>
export default {
	name: "AnchorMenu",
	props: {
		items: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
};
</script>

<style></style>
