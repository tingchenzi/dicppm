<template>
  <div class="ppm-box">
    <el-row>
      <el-col :span="2"><h4 class="ppm-label">收藏模板</h4></el-col>
      <el-col :span="22">
        <div v-loading="loading">
          <el-button
            icon="el-icon-star-on"
            class="ppm-collect-btn"
            :class="templ.active ? 'active' : ''"
            v-for="templ in list"
            :key="templ.templateId"
            @click="active(templ)"
            >{{ templ.templateName }}</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrderService from "@/api/order/OrderService.js";
import { mapMutations, mapState } from "vuex";
export default {
  name: "CollectTmpl",
  data() {
    return {
      list: [],
      activeId: "",
      loading: false,
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("collect", ["saveChange"]),
  },
  watch: {
    saveChange() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  beforeDestroy(){
     this.setActiveTemplateId(null);
     this.setActiveTemplateName(null)
  },
  methods: {
    ...mapMutations("collect", ["setActiveTemplateId",'setActiveTemplateName']),
    async getList() {
      const { staffId } = this.user;
      const { productId } = JSON.parse(sessionStorage.getItem("ppmCondition"));
      const params = {
        contentJson: "",
        createDate: "",
        createStaff: staffId,
        prodId: productId,
        remark: "",
        statusCd: "",
        templateId: "",
        templateName: "",
        updateDate: "",
        updateStaff: 0,
      };
      this.loading = true;
      try {
        const { code, meta } = await OrderService.orderTemplateList(params);
        if (code == 200) {
          const showList = meta.slice(0, 5);
          showList.forEach((item) => {
            item.active = false;
          });
          this.list = showList;
          if (this.activeId) { 
            this.list.find((item) => {
              if (item.templateId == this.activeId) {
                item.active = true;
              }
            });
          }
        }
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    active(templ) {
      if (templ.templateId == this.activeId) {
        return;
      }
      if (this.activeId) {
        this.list.find((item) => {
          if (item.templateId == this.activeId) {
            item.active = false;
          }
        });
      }
      templ.active = true;
      this.activeId = templ.templateId;
      this.setActiveTemplateId(this.activeId);
      this.setActiveTemplateName(templ.templateName)
    },
  },
};
</script>
