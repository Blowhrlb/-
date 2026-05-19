<template>
  <div class="company-case-detail-page">
    <!-- Page Header -->
    <PageHeader
        title=""
        description=""
        :bgImage="coverImage"
        height="450px"
      />
    <!-- Main Content -->
    <section class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 左侧：案例详情 -->
          <article class="case-detail">
            <div class="case-head">
              <div class="case-header">
                <h1>{{ caseDetail.info }}</h1>
                <p class="company">{{ caseDetail.after_company }}</p>
              </div>

              <div class="case-stats">
                <div v-for="industry in caseDetail.industry" class="stat-item">
                  <span class="stat-value">{{ industry }}</span>
                </div>
              </div>

              <div class="result-banner" v-for="tag in caseDetail.tags">
                <span>{{ tag }}</span>
              </div>
            </div>

            <div class="case-body" v-html="caseDetail.content"></div>
          </article>

          <!-- 右侧侧边栏 -->
          <CaseSidebar
            :relatedCases="caseDetail.relatedCases"
            @consult="showHrQrModal"
          />
        </div>

        <!-- 上下篇导航 -->
        <div class="article-nav">
          <RouterLink :to="`/company-case-detail?id=${prev?.id}`" class="nav-prev" :class="{ disabled: !prev?.id }">
            <span class="nav-label">{{ !prev?.id ? '没有了' : `上一篇：${prev?.info}` }}</span>
          </RouterLink>
          <RouterLink :to="`/company-case-detail?id=${next?.id}`" class="nav-next" :class="{ disabled: !next?.id }">
            <span class="nav-label">下一篇：{{ !next?.id ? '没有了' : next?.info }} </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import HrQrModal from '@/components/common/HrQrModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CaseSidebar from '@/components/common/CaseSidebar.vue'
import api from '@/api'


const route = useRoute()

// HR二维码弹窗
const hrQrModalVisible = ref(false)
const qrTip = ref('')
const showHrQrModal = () => {
  qrTip.value = '扫码添加HR微信，获取最新资料'
  hrQrModalVisible.value = true
}

// 获取案例ID
const caseId = computed(() => {
  const id = route.query.id
  return id ? Number(id) : 101
})

// 企业案例详情
const caseDetail = ref({
  id: 101,
  info: '',
  after_company: '',
  content: '',
  industry: [],
  tags: [],
  relatedCases: [] as any[]
})

// 默认案例背景图
const defaultCoverImage = 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1920&h=600&fit=crop'

// 获取背景图（有图片时用图片，没有时用默认图）
const coverImage = computed(() => {
  // return caseDetail.value.cover_image || defaultCoverImage
  return defaultCoverImage
})

const prev = ref({
  id: 0,
  info: ''
});
const next = ref({
  id: 0,
  info: ''
});

const loading = ref(false);

/**
 * 获取企业案例详情
 */
async function getCompanyCasesDt() {
  loading.value = true
  try {
    const res:any = await api.caseDetail(caseId.value, {'type': 'company'});
    if (res) {
      console.log('data', res);
      caseDetail.value = res.detail;
      prev.value = res.prev;
      next.value = res.next;
    } else {
      console.log('no data')
    }
  } catch (error) {
    console.log('no data', error)
  } finally {
    loading.value = false
  }
}

onUpdated(() => {
  console.log('案例详情页面updated', caseId.value);
  if (caseId.value !== caseDetail.value.id) {
    console.log('案例ID发生变化，重新获取案例详情');
    getCompanyCasesDt();
  }
})

onMounted(() => {
  console.log('案例详情页面mounted', caseId.value);

  getCompanyCasesDt();
})

</script>


<style scoped>
  @import "@/assets/styles/CompanyCaseDetailView.css";
</style>