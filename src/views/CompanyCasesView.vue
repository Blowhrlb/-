<template>
  <div class="company-cases-page">
    <!-- 页面标题 -->
    <PageHeader
      title="成功案例 | 企业服务案例"
      description="真实故事，见证改变"
      bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=600&fit=crop"
      height="450px"
    />

    <!-- 企业服务案例 -->
    <section class="cases-section">
      <div class="container">
        <div class="company-cases-grid">
          <div v-for="caseItem in companyCases" :key="caseItem.id" class="company-case-card">
            <h3>{{ caseItem.info }}</h3>
            <p>{{ caseItem.description ? caseItem.description : '暂无描述' }}</p>
            <div class="company-case-details">
              <div class="company-case-tags">
                <span v-for="tag in caseItem.tags" :key="tag" class="case-tag">{{ tag }}</span>
              </div>
              <RouterLink :to="`/company-case-detail?id=${caseItem.id}`" class="btn btn-outline btn-sm">查看详情</RouterLink>
            </div>
          </div>
        </div>

        <!-- 分页组件 -->
        <PaginationPage v-model:PaginationData="PaginationData" :loading="loading" source="personal-cases" @change="changePage"></PaginationPage>
      </div>
    </section>
    <FloatingMenu />

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginModalVisible" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
import LoginModal from '@/components/LoginModal.vue'
import PaginationPage from '@/components/common/PageModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import api from '@/api'

// 登录弹窗
const loginModalVisible = ref(false)

const handleOpenLoginModal = () => {
  loginModalVisible.value = true
}

// 企业服务案例数据
interface companyCase {
  [key: string]: any
}
const companyCases = ref<companyCase[]>([])
const currentPage = ref(1)
const loading = ref(false)
const PaginationData = ref({});
/**
 * 获取案例
 */
async function getCompanyCases() {
  loading.value = true
  try {
    let params = { 
      page: currentPage.value, 
      per_page: 10,
      type: 'company',
      industry: ''
    };
    const res:any = await api.caseList(params);
    if (res.data && res.data.length > 0) {
      PaginationData.value = res.pagination;
      companyCases.value = res.data;
    } else {
      console.log('no data')
    }
  } catch (error) {
    console.log('no data', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCompanyCases();
})

function changePage(page: number) {
  currentPage.value = page;
  getCompanyCases();
}

</script>


<style scoped>
  @import "@/assets/styles/CompanyCasesView.css";
</style>