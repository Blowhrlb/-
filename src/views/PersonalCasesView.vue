<template>
  <div class="personal-cases-page">
    <!-- 页面标题 -->
    <PageHeader
      title="成功案例 | 学员案例"
      description="真实故事，见证改变"
      bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
      height="450px"
    />

    <!-- 求职者案例 -->
    <section class="cases-section">
      <div class="container">
        <!-- 行业筛选 -->
        <div class="industry-filter">
          <span class="filter-label">按行业筛选：</span>
          <div class="filter-buttons">
            <button
              v-for="industry in industries"
              class="filter-btn"
              :class="{ active: selectedIndustry === industry }"
              @click="selectIndustry(industry)"
            >
              {{ industry }}
            </button>
          </div>
        </div>

        <!-- 求职案例 -->
        <div class="cases-grid">
          <RouterLink
            v-for="caseItem in filteredCases"
            :key="caseItem.id"
            :to="`/case-detail?id=${caseItem?.id}`"
            class="case-card"
          >
            <div class="case-image">
              <el-image v-if="caseItem.cover_image" :src="caseItem.cover_image" alt="案例图片" fit="cover" lazy>
              </el-image>
              <div v-else class="image-slot">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 160v704h704V160zm-32-64h768a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32V128a32 32 0 0 1 32-32"></path><path fill="currentColor" d="M384 288q64 0 64 64t-64 64q-64 0-64-64t64-64M185.408 876.992l-50.816-38.912L350.72 556.032a96 96 0 0 1 134.592-17.856l1.856 1.472 122.88 99.136a32 32 0 0 0 44.992-4.864l216-269.888 49.92 39.936-215.808 269.824-.256.32a96 96 0 0 1-135.04 14.464l-122.88-99.072-.64-.512a32 32 0 0 0-44.8 5.952z"></path></svg>
              </div>
            </div>
            <div class="case-content">
              <h3>{{ caseItem.name }} | {{ caseItem.info }}</h3>
              <p class="case-desc">{{ caseItem.description }}</p>
              <div class="detail">
                <div class="case-tags">
                  <span v-for="tag in caseItem.tags" :key="tag" class="tag" :class="{ 'tag-primary': tag === caseItem.tags[0] }">{{ tag }}</span>
                </div>
                <span class="case-link">查看详情 ›</span>
              </div>
            </div>
          </RouterLink>
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
import LoginModal from '@/components/LoginModal.vue'
import PaginationPage from '@/components/common/PageModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import api from '@/api'


const route = useRoute()

// 加载状态
const loading = ref(false);
onMounted(() => {
  getIndustry();
  getCases();
})

// 登录弹窗
const loginModalVisible = ref(false)

const handleOpenLoginModal = () => {
  loginModalVisible.value = true
}
// 行业筛选
const industries = ref([])
async function getIndustry() {
  loading.value = true
  try {
    const res:any = await api.allIndustry();
    if (res) {
      industries.value = res;
    } else {
      console.log('no data')
    }
  } catch (error) {
    console.log('no data', error)
  } finally {
    loading.value = false
  }
}


const currentPage = ref(1);
const PaginationData = ref({});

async function changePage(page: number) {
  currentPage.value = page
  getCases();
}
/**
 * 获取案例
 */
async function getCases() {
  loading.value = true
  try {
    let params = { 
      page: currentPage.value, 
      per_page: 10,
      type: 'personal',
      industry: selectedIndustry.value
    };
    const res:any = await api.caseList(params);
    if (res.data && res.data.length > 0) {
      PaginationData.value = res.pagination;
      cases.value = res.data;
    } else {
      console.log('no data')
    }
  } catch (error) {
    console.log('no data', error)
  } finally {
    loading.value = false
  }
}

const selectedIndustry = ref('全部')

function selectIndustry(industry: string) {
  selectedIndustry.value = industry
}

// 求职者案例数据
interface CaseItem {
  industry?: string
  [key: string]: any
}
const cases = ref<CaseItem[]>([])

// 筛选后的案例
const filteredCases = computed(() => {
  if (selectedIndustry.value === '全部') {
    return cases.value
  }
  return cases.value.filter(item => item.industry?.includes(selectedIndustry.value))
})
</script>


<style scoped>
  @import "@/assets/styles/PersonalCasesView.css";
</style>
