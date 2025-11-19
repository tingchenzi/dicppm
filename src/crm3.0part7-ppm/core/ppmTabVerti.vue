<template>
  <!-- <div class="product-info-box ne-bg-box">
		<div class="info-panel-box"> -->
  <el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
    <el-tab-pane
      v-for="(struct, index) in structData.tabStruct"
      :key="index"
      :label="struct.structName"
      :name="struct.structId + '-' + struct.structName"
    >
      <template v-if="struct.url !== undefined && struct.url != ''"> </template>
      <template v-else>
        <PPMForm
          :structData="struct"
          :formData="formData"
          :ruleData="ruleData"
          :optionsList="optionsList"
          @handleEvent="elEventHander"
          @actEvent="actEventHander"
          @ctrlfold="ctrlfold"
          @getPluginValue="getPluginValue"
          @getInputGridValue="getInputGridValue"
        >
        </PPMForm>
      </template>
    </el-tab-pane>
  </el-tabs>
  <!-- </div>
	</div> -->
</template>

<script>
export default {
  name: "PPMTabVerti",
  props: {
    formData: {
      type: Object,
    },
    ruleData: {
      type: Object,
    },
    structData: {
      type: Object,
    },
    optionsList: {
      type: [Object, String],
    },
  },
  data() {
    return {
      //标签方向:top头部,right右边,bottom底部,left左边
      tabPosition: "left",
      activeName: "",
      proName: "",
    };
  },
  components: {
    PPMForm: () => import("./ppmForm"),
    //rentList: () => import("./rentList"),
  },
  created() {
    this.load();
    this.proName = sessionStorage.getItem("proName") || "PPMForm";
  },
  mounted() {
    if (
      this.structData.tabStruct !== undefined &&
      this.structData.tabStruct.length >= 1
    ) {
      this.activeName =
        this.structData.tabStruct[0].structId +
        "-" +
        this.structData.tabStruct[0].structName;
    }
  },
  methods: {
    load() {
      //验证规则匹配
      if (
        this.structData.tabStruct != null &&
        this.structData.tabStruct.length > 0
      ) {
        this.structData.tabStruct.forEach((tab) => {
          if (tab.covertName !== undefined && tab.covertName != "") {
            //tab.covertName作为属性调用后台接口，返回tabName,给tab.structName赋值
          }
        });
      }
      //
    },
    /**
     * 用于内部使用了ppform，循环时将传递出去
     */
    elEventHander(data) {
      const { handlerName, params } = data;
      if (handlerName) {
        this.$emit("handleEvent", data);
      }
    },
    actEventHander(data) {
      const { handlerName1, params1 } = data;
      if (handlerName1) {
        this.$emit("actEvent", data);
      }
    },
    ctrlfold(fold, id) {
      this.$emit("ctrlfold", fold, id);
    },

    getPluginValue(obj) {
      this.$emit("getPluginValue", obj);
    },
    getInputGridValue(obj) {
      this.$emit("getInputGridValue", obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-info-box {
  min-height: 90vh;
  .pro-title {
    width: calc(100% - 0.4rem);
    margin: 0 auto;
    border-bottom: 0.01rem solid $color_DDD;

    .left {
      border-bottom: 0.02rem solid #f56f3c;
      color: $textColor1;
      margin: 0;
      padding-bottom: 0.1rem;
      font-size: $fontSize_v3;
    }

    .right {
      color: $textColor3;
    }
  }

  .button-p-box {
    width: 100%;
    margin-top: 0.1rem;
    padding: 0 0.2rem;
    button {
      border-radius: 0.05rem;
      margin-right: 0.03rem;
    }

    .button-or-b {
      border: 1px solid #f56f3c;
      background-color: #ffe0e0;
      color: #f56f3c;

      &:hover {
        background-color: rgba(245, 111, 60, 0.72);
        color: #fff;
      }
    }
  }

  .zc-info {
    width: calc(100% - 0.4rem);
    margin: 0.1rem auto 0 auto;
    padding: 0.11rem;
    background-color: rgba(221, 221, 221, 0.2);
    margin-top: 0.1rem;

    p {
      color: $textColor2;
      font-size: $fontSize_info;
      width: 33.3333%;
      margin: 0;

      span {
        display: inline-block;
        min-width: 0.6rem;
        text-align: center;
      }

      &:nth-child(1) {
      }

      &:nth-child(2) {
        width: 33.3333%;
        text-align: center;
      }

      &:last-child {
        width: 20%;
      }

      .icon {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-right: 0.05rem;

        &.line-icon {
          background-image: url("~@/assets/imgs/order/line-echart.png");
        }

        &.huilv-icon {
          background-image: url("~@/assets/imgs/order/huilv.png");
        }

        &.laidan-icon {
          background-image: url("~@/assets/imgs/order/zeng.png");
        }
      }
    }
  }
  .info-panel-box {
  }
  ::v-deep .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0px;
  }
  ::v-deep .el-tabs--left .el-tabs__item.is-left {
    background-color: #f9f9f9;
    color: $textColor3;
    //-webkit-box-shadow: -2px 0 3px 0 rgb(221 221 221 / 50%) !important;
    //box-shadow: -2px 0 3px 0 rgb(221 221 221 / 50%) !important;
    border: 0.01rem solid rgba(221, 221, 221, 0.5);
    border-bottom: none;
    padding: 0.2rem 0.4rem;
    margin-left: 0.2rem;
    &:hover,
    &.is-active {
      color: #fff;
      background: #0152d9;
      -webkit-box-shadow: -2px 0 3px 0 rgba(221, 221, 221, 0.5) !important;
      box-shadow: -2px 0 3px 0 rgba(221, 221, 221, 0.5) !important;
    }
    &.is-active {
      //position: relative;
      //right: -.01rem;
      border-right: none;
    }
    &:last-child {
      border-bottom: 0.01rem solid rgba(221, 221, 221, 0.5);
    }
  }
  ::v-deep .el-tabs--left .el-tabs__active-bar.is-left,
  ::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after {
    top: 0.02rem;
    left: 0.2rem;
    right: auto;
    background-color: $orange;
    width: 0.03rem;
  }
  ::v-deep .el-tabs__item {
    height: auto;
    line-height: normal;
    font-size: $fontSize_v1;
    font-weight: 500;
    color: #303133;
    position: relative;
  }
  ::v-deep .el-tabs--left .el-tabs__header.is-left {
    margin-top: 0.2rem;
  }
  ::v-deep .el-tabs__content {
    border: 1px solid rgba(221, 221, 221, 0.5);
    min-height: 4rem;
    -webkit-box-shadow: rgba(233, 234, 238, 0.7) 0px 0px 15px;
    -moz-box-shadow: rgba(233, 234, 238, 0.7) 0px 0px 15px;
    box-shadow: rgba(233, 234, 238, 0.7) 0px 0px 15px;
    margin: 0.2rem 0.2rem 0.2rem 0;
  }
}
</style>
