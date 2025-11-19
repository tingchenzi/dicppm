<template>
	<div class="slot-table">
		<vxe-grid 
		:seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
		:pager-config="tablePage" 
		:form-config="tableForm" 
		:data="tableData" 
		:columns="tableColumn" 
		max-height="500" 
		border highlight-hover-row 
		@cell-click="cellClickEvent" 
		row-class-name="my-row" 
		@form-submit="findList" 
		@page-change="handlePageChange"
		/>
	</div>
</template>

<script>
import common from "@/utils/common";
export default {
    name: "SlotGrid",
    props:{
        config:{
            type:Object,
            default:{}
        }
    },
    data() {
        return {
            tableForm: null,
            tableData: null,
            tableColumn: null,
            tablePage: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                align: "center",
                layouts: [  "PrevPage", "Number", "NextPage", "FullJump", "Total"],
                perfect: true,
            },
        };
    },
    created() {
        if (this.config) {
            this.tableForm = this.config.tableForm;
            this.tableData = this.config.tableData;
            if(this.tableData){
                this.tableData.forEach((item) => {
                    if(item.custName){
                        item.custName  = common.encryStr(item.custName);
                    }
                });
            }
            this.tableColumn = this.config.tableColumn;
            this.tablePage.total = Number(this.config.pageInfo.rowCount)
            this.tablePage.currentPage = Number(this.config.pageInfo.pageIndex)
            this.tablePage.pageSize = Number(this.config.pageInfo.pageSize)
        }
    },
    methods: {
        /**
         * 查找表格数据
         */
        async findList() {
            const pageInfo = {
                pageIndex: 1 
            }
            this.$emit("findlist", this.tableForm.data,pageInfo);
        },

        /**
         * 单击单元格触发
         */
        cellClickEvent() {
            this.$emit("clickcell", arguments[0].row);
        },

        handlePageChange ({ currentPage, pageSize }) {
            this.tablePage.currentPage = currentPage
            this.tablePage.pageSize = pageSize
            const pageInfo = {
                pageIndex: this.tablePage.currentPage 
            }
            this.$emit("findlist", this.tableForm.data,pageInfo);
        }
    },
};
</script>

<style lang="scss" scoped>
.slot-table {
	::v-deep .myrow {
		cursor: pointer;
	}
}
</style>