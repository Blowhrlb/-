<template>
  <div class="application-resources-page">

    <!-- 页面标题 -->
    <PageHeader
      title="终结&quot;岗位信息焦虑&quot;"
      description="春风求职，你的全网网申信息中枢"
      :bgImage="bannerImg"
      height="450px"
    />

    <!-- 介绍内容 -->
    <section class="intro-section">
      <div class="container">
        <p class="intro-desc">
          你是否曾在各个招聘网站反复切换，却仍怕错过关键机会？在春风求职，我们替你完成了99%的信息搜集与整理工作。
          我们的网申资源库不是简单的链接汇总，而是经过深度加工、带有"求职情报"的智能资源中心。
        </p>
        <div class="pain-points">
          <h3>解决你的三大痛点</h3>
          <div class="pain-grid">
            <div class="pain-card">
              <div class="pain-number">痛点一</div>
              <h4>信息碎片化，搜索成本高</h4>
              <div class="solution">
                <strong>我们替你：</strong>每日监控300+企业官网、50+招聘平台
              </div>
              <div class="result">
                <strong>你能得到：</strong>结构化、分类清晰的完整岗位视图
              </div>
              <div class="outcome">
                <strong>结果：</strong>搜索时间从每天2小时降至10分钟
              </div>
            </div>
            <div class="pain-card">
              <div class="pain-number">痛点二</div>
              <h4>投递后无反馈，流程不透明</h4>
              <div class="solution">
                <strong>我们提供：</strong>企业平均反馈时间数据
              </div>
              <div class="result">
                <strong>你能做到：</strong>合理安排期待，规划下一步准备
              </div>
              <div class="outcome">
                <strong>结果：</strong>告别焦虑等待，掌握求职主动权
              </div>
            </div>
            <div class="pain-card">
              <div class="pain-number">痛点三</div>
              <h4>隐藏机会难发现</h4>
              <div class="solution">
                <strong>我们挖掘：</strong>企业官网"职业页面"未置顶岗位
              </div>
              <div class="result">
                <strong>你能获得：</strong>那些未被广泛宣传的优质机会
              </div>
              <div class="outcome">
                <strong>结果：</strong>竞争更小，成功率更高的选择路径
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 筛选区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <div class="filter-group filter-search">
            <label>搜索</label>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索职位/城市/公司..."
              class="search-input"
            />
          </div>
          <div class="filter-group">
            <label>城市</label>
            <div class="city-input-wrapper">
              <input
                type="text"
                v-model="filterCityName"
                placeholder="点击选择城市"
                class="city-input"
                readonly
                @click="openCitySelect"
              />
              <span v-if="filterCity" class="clear-city" @click="clearCity">×</span>
            </div>
          </div>
          <div class="filter-group">
            <label>岗位类型</label>
            <div class="searchable-select">
              <input
                type="text"
                v-model="positionSearchKeyword"
                @focus="openPositionDropdown"
                @blur="handlePositionBlur"
                @keydown.escape="positionDropdownOpen = false"
                placeholder="搜索岗位类型..."
                class="search-input"
              />
              <div class="dropdown-options" v-if="positionDropdownOpen">
                <div
                  class="dropdown-option"
                  :class="{ active: filterPosition === '' }"
                  @mousedown.prevent="selectPosition('')"
                >
                  全部岗位
                </div>
                <div
                  v-for="pos in filteredPositions"
                  :key="pos.value"
                  class="dropdown-option"
                  :class="{ active: filterPosition === pos.value }"
                  @mousedown.prevent="selectPosition(pos.value, pos.label)"
                >
                  {{ pos.label }}
                </div>
                <div v-if="filteredPositions.length === 0" class="dropdown-empty">
                  未找到岗位
                </div>
              </div>
            </div>
            <input type="hidden" v-model="filterPosition" />
          </div>
          <div class="filter-group">
            <label>行业</label>
            <select v-model="filterIndustry">
              <option value="">全部行业</option>
              <option v-for="ind in filterOptions.industries" :key="ind.value" :value="ind.value">
                {{ ind.label }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label>适合人群</label>
            <select v-model="filterAudience">
              <option value="">全部</option>
              <option v-for="aud in filterOptions.audiences" :key="aud.value" :value="aud.value">
                {{ aud.label }}
              </option>
            </select>
          </div>
          <button class="btn btn-secondary" @click="resetFilters">重置</button>
        </div>
      </div>
    </section>

    <!-- 岗位列表 -->
    <section class="jobs-section">
      <div class="container">
        <div class="jobs-grid">
          <div v-for="job in jobList" :key="job.id" class="job-item">
            <div class="job-content">
              <div class="job-top">
                <div class="job-logo">
                  <img v-if="job.logoUrl" :src="job.logoUrl" :alt="job.company" />
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                    <rect width="40" height="40" :fill="job.logoColor" rx="8"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">
                      {{ job.logoText }}
                    </text>
                  </svg>
                </div>
                <div class="job-main">
                  <div class="job-title-row">
                    <h4>{{ job.title }}</h4>
                    <span class="job-salary">{{ job.salary }}</span>
                  </div>
                  <p class="company">{{ job.company }}</p>
                </div>
                <div class="job-first-tag">
                  <span class="tag">{{ job.location }}</span>
                </div>
              </div>
              <div class="job-tags">
                <span class="tag">{{ job.position }}</span>
                <span class="tag">{{ job.industry }}</span>
                <span class="tag">{{ job.audienceText }}</span>
              </div>
              <div class="job-footer">
                <span v-if="job.address" class="job-address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ job.address }}
                </span>
                <span v-if="job.remarks" class="job-remarks">{{ job.remarks }}</span>
              </div>
            </div>
            <button class="btn" @click="showHrQrModal(job)">立即申请</button>
          </div>

          
        </div>

        <!-- 空状态 -->
        <div v-if="jobList.length === 0 && !loading" class="empty-state">
          <p>暂无符合条件的岗位</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <p>加载中...</p>
        </div>

        <!-- 分页 -->
        <PaginationPage v-if="!loading" v-model:PaginationData="paginationData" :source="filterSource" @change="handlePageChange"></PaginationPage>
      </div>
    </section>

    <FloatingMenu />

    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginModalVisible" />

    <!-- 城市选择弹窗 -->
    <CitySelect v-model:visible="citySelectVisible" @select="handleCitySelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
import LoginModal from '@/components/LoginModal.vue'
import PaginationPage from '@/components/common/PageModal.vue'
import HrQrModal from '@/components/common/HrQrModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CitySelect from '@/components/common/CitySelect.vue'
import { getJobList, getFilterOptions } from '@/api'
import bannerImg from '@/assets/images/app_resources_header_bg.png'
// 获取路由参数
const route = useRoute()

// 筛选条件
const filterCity = ref('')
const filterCityName = ref('')
const filterPosition = ref('')
const filterIndustry = ref('')
const filterAudience = ref('')
const filterSource = ref('')
const searchKeyword = ref('')

// 岗位搜索
const positionSearchKeyword = ref('')
const positionDropdownOpen = ref(false)
const selectedPositionLabel = ref('')

// 筛选选项
const filterOptions = reactive({
  cities: [] as Array<{ value: string; label: string }>,
  positions: [] as Array<{ value: string; label: string; path?: string }>,
  industries: [] as Array<{ value: string; label: string }>,
  audiences: [
    { value: 'fresh', label: '应届生' },
    { value: 'social', label: '社招' },
    { value: 'intern', label: '实习生' }
  ]
})

// 岗位数据
const jobList = ref<Array<{
  id: number
  title: string
  company: string
  location: string
  salary: string
  position: string
  industry: string
  audience: string
  audienceText: string
  companyType: string
  address: string
  logoUrl: string
  logoColor: string
  logoText: string
  remarks: string
}>>([])

// 分页数据
const paginationData = ref({
  total: 0,
  page: 1,
  pageSize: 12,
  last_page: 1,
  current_page: 1
})

// 加载状态
const loading = ref(false)

// HR二维码弹窗
const hrQrModalVisible = ref(false)
const qrTip = ref('')

const showHrQrModal = (job?: any) => {
  if (job) {
    qrTip.value = `${job.company} - ${job.title}`
  } else {
    qrTip.value = '扫码添加HR微信，获取职位信息'
  }
  hrQrModalVisible.value = true
}

// 登录弹窗
const loginModalVisible = ref(false)

// 城市选择弹窗
const citySelectVisible = ref(false)

const openCitySelect = () => {
  citySelectVisible.value = true
}

const handleCitySelect = (city: { value: string; label: string }) => {
  filterCity.value = city.value
  filterCityName.value = city.label
  citySelectVisible.value = false
  filterSource.value = Date.now().toString()
  fetchJobList()
}

const clearCity = () => {
  filterCity.value = ''
  filterCityName.value = ''
  filterSource.value = Date.now().toString()
  fetchJobList()
}

// 岗位搜索过滤
import { computed } from 'vue'

const filteredPositions = computed(() => {
  if (!positionSearchKeyword.value) {
    return filterOptions.positions
  }
  const keyword = positionSearchKeyword.value.toLowerCase()
  return filterOptions.positions.filter(pos =>
    pos.label.toLowerCase().includes(keyword) ||
    (pos.path && pos.path.toLowerCase().includes(keyword))
  )
})

const openPositionDropdown = () => {
  positionSearchKeyword.value = ''
  positionDropdownOpen.value = true
}

const selectPosition = (id: string, label?: string) => {
  filterPosition.value = id
  selectedPositionLabel.value = label || ''
  positionSearchKeyword.value = label || ''
  positionDropdownOpen.value = false
  filterSource.value = Date.now().toString()
  fetchJobList()
}

const handlePositionBlur = () => {
  setTimeout(() => {
    positionDropdownOpen.value = false
    // 恢复搜索框显示当前选中值
    if (filterPosition.value) {
      const selected = filterOptions.positions.find(p => p.value === filterPosition.value)
      if (selected) {
        positionSearchKeyword.value = selected.label
      }
    } else {
      positionSearchKeyword.value = ''
    }
  }, 200)
}

// 获取筛选选项
const fetchFilterOptions = async () => {
  try {
    const res = await getFilterOptions()
    if (res.cities) filterOptions.cities = res.cities
    if (res.positions) filterOptions.positions = res.positions
    if (res.industries) filterOptions.industries = res.industries
    if (res.audiences) filterOptions.audiences = res.audiences
  } catch (error) {
    console.error('获取筛选选项失败:', error)
  }
}

// 获取岗位列表
const fetchJobList = async () => {
  loading.value = true
  jobList.value = []
  try {
    const res = await getJobList({
      page: paginationData.value.current_page,
      pageSize: paginationData.value.pageSize,
      city: filterCity.value,
      position_type_id: filterPosition.value,
      industry: filterIndustry.value,
      audience: filterAudience.value,
      keyword: searchKeyword.value
    });
    jobList.value = res.data || []
    paginationData.value = res.pagination || {}

  } catch (error) {
    jobList.value = []
  } finally {
    loading.value = false
  }
}

// 分页切换
const handlePageChange = (page: number) => {
  paginationData.value.current_page = page
  fetchJobList()
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  filterCity.value = ''
  filterCityName.value = ''
  filterPosition.value = ''
  filterIndustry.value = ''
  filterAudience.value = ''
  positionSearchKeyword.value = ''
  selectedPositionLabel.value = ''
  filterSource.value = Date.now().toString()
  fetchJobList()
}

// 监听筛选条件变化，自动搜索
watch([filterCity, filterPosition, filterIndustry, filterAudience], () => {
  filterSource.value = Date.now().toString()
  fetchJobList()
})

// 监听搜索关键词变化
watch(searchKeyword, () => {
  filterSource.value = Date.now().toString()
  fetchJobList()
})

// 初始化
onMounted(() => {
  // 获取URL中的搜索关键词
  const keyword = route.query.keyword as string
  if (keyword) {
    searchKeyword.value = keyword
    // 可以根据关键词设置筛选条件
  }
  fetchFilterOptions()
  fetchJobList()
})
</script>


<style scoped>
  @import "@/assets/styles/ApplicationResourcesView.css";

  .job-remarks {
    margin-top: 8px;
    font-size: 12px;
    color: #64748b;
    line-height: 1.4;
  }

  .empty-state,
  .loading-state {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }

  .job-logo img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  .city-input-wrapper {
    position: relative;
    width: 100%;
  }

  .city-input {
    width: 100%;
    padding: 8px 30px 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    background: #fff;
    box-sizing: border-box;
  }

  .city-input:focus {
    outline: none;
    border-color: #409eff;
  }

  .clear-city {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    background: #c0c4cc;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }

  .clear-city:hover {
    background: #909399;
  }

  /* 岗位搜索下拉框 */
  .searchable-select {
    position: relative;
    width: 100%;
  }

  .searchable-select .search-input {
    width: 100%;
    padding: 8.91px 12px;
    border: 1px solid var(--tech-border);
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    cursor: pointer;
  }

  .searchable-select .search-input:focus {
    outline: none;
    border-color: var(--el-color-primary);
  }

  .dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid var(--tech-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 240px;
    overflow-y: auto;
    z-index: 100;
    margin-top: 4px;
  }

  .dropdown-option {
    padding: 10px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .dropdown-option:hover {
    background: #f5f7fa;
  }

  .dropdown-option.active {
    background: #ecf5ff;
    color: var(--el-color-primary);
  }

  .dropdown-empty {
    padding: 16px 12px;
    text-align: center;
    color: #909399;
    font-size: 13px;
  }
</style>
