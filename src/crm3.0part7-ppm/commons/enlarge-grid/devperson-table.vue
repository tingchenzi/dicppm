<template>
  <div class="slot-table">
    <vxe-grid    
      :data="tableData"
      :columns="tableColumn"
      max-height="500"
      border
      highlight-hover-row
      @cell-dblclick="cellClickEvent"
      @page-change="handlePageChange"
      row-class-name="my-row"
    >
      <!--使用 form 插槽-->
      <template v-slot:form>
        <vxe-form :data="tableForm.data" @submit="findList" title-width="100" title-align="right">
          <vxe-form-item
            v-for="item in tableForm.items"
            :title="item.title"
            :field="item.field"
            :key="item.field"
          >
            <template v-slot>
              <vxe-input
                v-if="item.itemRender.name == '$input'"
                v-model="tableForm.data[item.field]"
                placeholder="请输入"
              ></vxe-input>
              <vxe-select
                v-if="item.itemRender.name == '$select'"
                v-model="tableForm.data[item.field]"
                placeholder="请选择"
                @change="selectChange($event,item.field)"
                clearable
                :disabled="item.disabled"
              >
                <vxe-option
                  v-for="op in item.itemRender.options"
                  :key="op.label"
                  :value="op.value"
                  :label="op.label"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item>
            <template v-slot>
              <vxe-button status="primary" type="submit">查询</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: "DevpersonTable",
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
        layouts: [
          "PrevJump",
          "PrevPage",
          "Number",
          "NextPage",
          "NextJump",
          "FullJump",
          "Total",
        ],
        perfect: true,
      },
    };
  },
  created() {
    if (this.$attrs.config) {
      this.tableForm = this.$attrs.config.tableForm;
      this.tableData = this.$attrs.config.tableData;
      this.tableColumn = this.$attrs.config.tableColumn;
      this.tablePage = Object.assign(
        this.tablePage,
        this.$attrs.config.pageInfo
      );
    }
  },
  watch:{
	  //对异步的options请求进行监听
     '$attrs.config.tableForm.items':{
		 handler(){
			this.tableForm = this.$attrs.config.tableForm
		 },
         deep:true
	 }
  },
  methods: {
    /**
     * 查找表格数据
     */
    async findList() {
      this.$emit("findlist", this.tableForm.data, 1);
    },

    /**
     * 单击单元格触发
     */
    cellClickEvent() {
      this.$emit("clickcell", arguments[0].row);
    },
    //翻页
    handlePageChange({ currentPage }) {
      this.tablePage.currentPage = currentPage;
      this.$emit("findlist", this.tableForm.data, this.tablePage.currentPage);
    },
    selectChange($event,field) {
      this.$emit("formSelectChange",$event,field);
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-table {
  ::v-deep .myrow {
    cursor: pointer;
  }
  min-height: 300px;
}
</style>
