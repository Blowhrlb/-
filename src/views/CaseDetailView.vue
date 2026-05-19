<template>
  <div class="case-detail-page" v-cloak>
    <!-- 案例详情内容 -->
    <section class="case-detail-section">
      <!-- 案例头部 -->
      <PageHeader
        title=""
        description=""
        :bgImage="coverImage"
        height="450px"
      />

      <div class="container">
        <!-- 案例头部信息 -->
        <div class="case-detail-header">
          <div class="case-info-card">
            <!-- 左侧头像 -->
            <div class="case-avatar">
              <img src="@/assets/images/peroson.png" alt="头像">
            </div>
            <!-- 右侧内容 -->
            <div class="case-info-content">
              <div class="case-meta">
                <span class="meta-item">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {{ caseDetail.name }}
                </span>
                <span class="meta-item">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  {{ caseDetail.position }}
                </span>
              </div>
              <div class="case-title">
                <h1>{{ caseDetail.info }}</h1>
              </div>
              <div class="case-tags">
                <span v-for="tag in caseDetail.tags" :key="tag" class="tag" :class="{ 'tag-primary': tag === caseDetail.tags[0] }">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 案例正文 -->
        <div class="case-detail-content">
          <!-- 左侧内容区 -->
          <div class="case-main-content">
            <!-- 经验总结 -->
            <div class="content-block">
              <div class="experience-tips">
                <div class="tip-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div class="tip-content">
                  <p>{{ caseDetail.description }}</p>
                </div>
              </div>
            </div>
            <!-- 背景与挑战 -->
            <div class="content-block" v-html="caseDetail.content"></div>

          </div>

          <!-- 右侧侧边栏 -->
          <CaseSidebar
            :relatedCases="caseDetail.relatedCases"
            source="person"
            @consult="showHrQrModal"
          />
        </div>

        <!-- 上下篇导航 -->
        <div class="article-nav">
          <RouterLink :to="`/case-detail?id=${prev?.id}`" class="nav-prev" :class="{ disabled: !prev?.id }">
            <span class="nav-label">{{ !prev?.id ? '没有了' : `上一篇：${prev?.info}` }}</span>
          </RouterLink>
          <RouterLink :to="`/case-detail?id=${next?.id}`" class="nav-next" :class="{ disabled: !next?.id }">
            <span class="nav-label">下一篇：{{ !next?.id ? '没有了' : next?.info }} </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <FloatingMenu />
    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUpdated } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import HrQrModal from '@/components/common/HrQrModal.vue'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
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
  return id ? Number(id) : 1
})

// 案例详情数据
const caseDetail = ref({
  id: 0,
  name: '',
  position: '',
  info: '',
  tags: [],
  description: '',
  content: '',
  cover_image: '',
  relatedCases: [] as any[],
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
async function getCompanyCases() {
  loading.value = true
  try {
    const res:any = await api.caseDetail(caseId.value, {'type': 'personal'});
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
    getCompanyCases();
  }
})

onMounted(() => {
  console.log('案例详情页面mounted', caseId.value);

  getCompanyCases();
})
</script>

<style scoped>
  @import "@/assets/styles/CaseDetailView.css";
</style>
