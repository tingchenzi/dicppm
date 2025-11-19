<template>
  <div class="slot-table">
    <vxe-grid
      border
      highlight-hover-row
      max-height="500"
      row-id="accountUnitCode"
      @cell-dblclick="cellClickEvent"
      :row-class-name="setRowClassName"
      ref="xTree"
      :form-config="tableForm"
      :data="tableData"
      :columns="tableColumn"
      @form-submit="findList"
      :tree-config="{
        children: 'children',
        iconOpen: 'el-icon-remove',
        iconClose: 'el-icon-circle-plus',
        expandRowKeys: defaultExpandKeys,
        reserve: true,
        toggleMethod: toggleMethod,
      }"
    >
      >
      <template v-slot:accountUnitCode="{ row }">
        <div>
          <template v-if="row.children && row.children.length">
            <i
              class="tree-node-icon"
              :class="
                $refs.xTree.isTreeExpandByRow(row)
                  ? 'el-icon-folder-opened'
                  : 'el-icon-folder'
              "
            ></i>
          </template>
          <template v-else>
            <i class="tree-node-icon el-icon-document"></i>
          </template>
          <span>{{ row.accountUnitCode }}</span>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
export default {
  name: "SlotTree",
  data() {
    return {
      tableForm: null,
      tableData: null,
      tableColumn: null,
      defaultExpandKeys: ["DXJT0000"], //默认展开节点，暂时用于收款单位写死，后期视情况优化
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    attrId: {
      type: String,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    "config.tableData": function (newVal) {
      this.tableData = newVal;
    },
    "config.tableForm": function (newVal) {
      this.config.tableForm = newVal;
    },
  },
  mounted() {
    this.getConfigInfo();
    // if (this.$attrs.config) {
    // 	this.tableForm = this.$attrs.config.tableForm;
    // 	this.tableData = this.$attrs.config.tableData;
    // 	this.tableColumn = this.$attrs.config.tableColumn;
    // 	// // let oldCulmn = this.tableColumn.shift();
    // 	// //
    // 	// // this.tableColumn.unshift({ type: "seq", width: "5%" });
    // 	// Object.assign(this.tableColumn[0], {
    // 	// 	slots: { default: "accountUnitCode" },
    // 	// 	title: "单位编码",
    // 	// 	width: "25%",
    // 	// 	treeNode: true,
    // 	// });
    // 	// delete this.tableColumn[1].field;
    // }
  },
  methods: {
    getConfigInfo() {
      if (this.config) {
        this.tableForm = this.config.tableForm;
        this.tableData = this.config.tableData;
        this.tableColumn = this.config.tableColumn;
      }
    },
    toggleMethod(obj) {
      //IDC相关产品的数据中心管理单位，云堤产品的业务发起地与其他产品隔离开，可以选择“宁夏省电信公司”
      if (
        obj.row.statusCd == "1200" &&
        !["142002194", "100014255"].includes(this.attrId)
      ) {
        return false;
      }
      return true;
    },
    /**
     * 查找表格数据
     */
    async findList() {
      this.$emit("findlist", this.tableForm.data);
    },

    //设置行样式
    setRowClassName(data) {
      if (
        data.row?.statusCd == "1200" &&
        !["142002194", "100014255"].includes(this.attrId)
      ) {
        return "myrow row-disabled";
      } else {
        return "myrow";
      }
    },

    /**
     * 单击击单元格触发
     */
    cellClickEvent(event) {
      if (
        event.row?.statusCd == "1200" &&
        !["142002194", "100014255"].includes(this.attrId)
      )
        return;
      this.$emit("clickcell", event.row);
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-table {
  ::v-deep .myrow {
    cursor: pointer;
  }
  ::v-deep .row-disabled {
    background-color: #f5f7fa;
    color: #c0c4cc;
    border-color: #dfe4ed;
    cursor: not-allowed;
  }
}
</style>
