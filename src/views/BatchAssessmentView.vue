<template>
  <div class="batch-assessment-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>批量候选人评估</h1>
        <p>批量上传候选人信息，快速获取综合评估报告</p>
      </div>
    </section>

    <!-- 主要内容区 -->
    <section class="main-section">
      <div class="container">
        <!-- HR操作流程 -->
        <div class="process-section">
          <div class="section-title">
            <h3>HR操作流程</h3>
          </div>
          <div class="process-steps">
            <div v-for="(step, index) in steps" :key="index" class="step">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h5>{{ step.title }}</h5>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用指南 -->
        <div class="template-guide-section">
          <div class="guide-header">
            <h3>《批量候选人信息导入模板》使用指南</h3>
          </div>
          <div class="guide-content">
            <div class="guide-item">
              <h4>• 文件信息</h4>
              <p>文件名：批量候选人信息导入模板.xlsx</p>
              <p>用途：用于批量上传候选人信息至系统进行自动评估。</p>
              <p class="warning">重要提示：请勿修改本模板的列标题（表头）及其顺序，否则可能导致系统无法识别。</p>
            </div>
            <div class="guide-item">
              <h4>• 填写规范</h4>
              <ol>
                <li>所有单元格请勿使用合并单元格。</li>
                <li>上传的Excel文件名必须以“批量候选人信息导入+日期”格式。例如：批量候选人信息导入2026-01-12.xlsx。</li>
                <li>上传文件名中的日期请统一使用 YYYY-MM-DD 格式，例如 2023-10-27</li>
              </ol>
            </div>
            <div class="guide-item">
              <h4>• 模板内容预览</h4>
              <div class="template-preview">
                <table>
                  <thead>
                    <tr>
                      <th v-for="header in templateHeaders" :key="header">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in templateRows" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- 上传区域 -->
        <div class="upload-section">
          <div class="section-title">
            <h2>上传候选人信息</h2>
            <p>请下载模板并按要求填写后拖拽上传</p>
          </div>

          <div class="file-upload-area">
            <Uploader
              accept=".xlsx,.xls"
              :max-size="10"
              :multiple="true"
              @success="handleUploadSuccess"
              @error="handleUploadError"
              @progress="handleUploadProgress"
            />

            <!-- 下载模板链接 -->
            <p class="template-link">
              还没模板？<a href="javascript:void(0)" @click="downloadTemplate">下载模板文件</a>
            </p>
          </div>
        </div>

        <!-- 推荐的候选人列表 -->
        <div class="recommended-section">
          <div class="section-title">
            <h2>推荐的候选人</h2>
            <p>根据评估结果为您推荐最合适的候选人</p>
          </div>

          <!-- 搜索筛选区域 -->
          <div class="filter-bar">
            <div class="filter-group">
              <label>姓名</label>
              <input type="text" class="form-control" placeholder="请输入姓名" v-model="filterName">
            </div>
            <div class="filter-group">
              <label>学历</label>
              <select class="form-control" v-model="filterEducation">
                <option value="">全部</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
            <div class="filter-group">
              <label>职位</label>
              <input type="text" class="form-control" placeholder="请输入职位" v-model="filterPosition">
            </div>
            <div class="filter-group">
              <label>招聘建议</label>
              <select class="form-control" v-model="filterSuggestion">
                <option value="">全部</option>
                <option value="S">优先面试</option>
                <option value="A">正常面试</option>
                <option value="B">考虑面试</option>
                <option value="C">暂不面试</option>
              </select>
            </div>
            <div class="filter-actions">
              <button class="btn btn-primary" @click="filterCandidates">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                搜索
              </button>
              <button class="btn btn-primary" @click="exportRecommended">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:8px;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                导出全部候选人
              </button>
            </div>
          </div>

          <!-- 候选人列表 -->
          <div class="candidate-table-wrapper">
            <table class="candidate-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>姓名</th>
                  <th>年龄</th>
                  <th>学历</th>
                  <th>应聘职位</th>
                  <th>综合评级</th>
                  <th>招聘建议</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(candidate, index) in filteredCandidates" :key="candidate.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ candidate.name }}</td>
                  <td>{{ candidate.age }}</td>
                  <td>{{ candidate.education }}</td>
                  <td>{{ candidate.position }}</td>
                  <td>
                    <span class="score-badge" :class="getScoreClass(candidate.rating)">
                      {{ candidate.rating }}
                    </span>
                  </td>
                  <td>{{ candidate.suggestion }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页 -->
          <PaginationPage :PaginationData="paginationData" @change="handlePageChange"></PaginationPage>
          <!-- 无数据提示 -->
          <!-- <div class="no-data" v-else-if="recommendedCandidates.length === 0">
            <p>暂无候选人数据，请先上传候选人信息文件</p>
          </div> -->
        </div>
      </div>
    </section>

    <!-- 详情弹窗 -->
    <AppModal v-model:visible="detailModalVisible" title="候选人评估详情" width="600px" @close="closeDetailModal">
      <div v-if="selectedCandidate" class="score-detail">
        <div class="score-circle" :class="getScoreClass(selectedCandidate.rating)">
          {{ selectedCandidate.rating }}
        </div>
        <h4>{{ selectedCandidate.name }}</h4>
        <p>{{ selectedCandidate.position }} | {{ selectedCandidate.education }}</p>
      </div>
    </AppModal>

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import LoginModal from '@/components/LoginModal.vue'
import Uploader from '@/components/uploader/Uploader.vue'
import PaginationPage from '@/components/common/PageModal.vue'
import { candidateAssessmentList } from '@/api'

// 步骤数据
const steps = [
  { title: '下载模板', desc: '点击上方"下载模板"按钮，获取标准Excel模板文件' },
  { title: '填写信息', desc: '按照上述规范，将候选人信息逐一填写到模板中' },
  { title: '保存文件', desc: '填写完成后，保存为 .xlsx 格式' },
  { title: '上传文件', desc: '将填写好的表格文件拖拽或点击上传到系统' },
  { title: '获取报告', desc: '系统自动评估后，生成候选人综合评估报告' }
]

// 模板预览数据
const templateHeaders = ['序号', '姓名', '年龄', '手机号码', '意向岗位', '薪资范围', '最高学历', '综合等级', '招聘建议']
const templateRows = [
  ['1', '张三', '28', '13800138000', '产品经理', '20K-30K', '本科', 'A', '正常面试'],
  ['2', '李四', '32', '13900139000', '技术总监', '40K-60K', '硕士', 'S', '优先面试']
]

// 推荐候选人数据
const recommendedCandidates = ref<Array<{
  id: number
  name: string
  age: number | null
  education: string
  position: string
  rating: string
  suggestion: string
}>>([])

// 分页数据
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

// 分页组件数据
const paginationData = ref({
  current_page: 1,
  last_page: 0,
  total: 0
})

// 加载候选人数据
async function loadCandidates() {
  try {
    const res = await candidateAssessmentList({
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
      name: filterName.value,
      education: filterEducation.value,
      position: filterPosition.value,
      rating: filterSuggestion.value
    })
    if (res && res.list) {
      recommendedCandidates.value = res.list
      handleExportUrl.value = res.url;
      pagination.value = {
        page: res.page,
        pageSize: res.page_size,
        total: res.total,
        totalPages: res.total_pages
      }
      paginationData.value = {
        current_page: res.page,
        last_page: res.total_pages,
        total: res.total
      }
    }
  } catch (error) {
    console.error('加载候选人数据失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadCandidates()
})

// 文件上传相关状态
const uploadedFiles = ref<Array<{ url: string; fileName: string; originalName: string }>>([])
const isUploadComplete = ref(false)

function handleUploadSuccess(files: Array<{ url: string; fileName: string; originalName: string }>) {
  uploadedFiles.value = files
  isUploadComplete.value = true
  console.log('上传成功的文件:', files)
}

function handleUploadError(error: string) {
  console.error('上传失败:', error)
  alert('上传失败：' + error)
}

function handleUploadProgress(progress: number) {
  console.log('上传进度:', progress + '%')
}
/**
 * 下载模版文件
 */
function downloadTemplate() {
  // 下载模板文件
  const templatePath = '/uploads/批量候选人信息导入模板.xlsx'
  const link = document.createElement('a')
  link.href = templatePath
  link.download = '批量候选人信息导入模板.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 筛选相关
const filterName = ref('')
const filterEducation = ref('')
const filterPosition = ref('')
const filterSuggestion = ref('')

const filteredCandidates = computed(() => {
  return recommendedCandidates.value.filter(candidate => {
    const matchName = !filterName.value || candidate.name.includes(filterName.value)
    const matchEducation = !filterEducation.value || candidate.education === filterEducation.value
    const matchPosition = !filterPosition.value || candidate.position.includes(filterPosition.value)
    const matchSuggestion = !filterSuggestion.value || candidate.rating === filterSuggestion.value
    return matchName && matchEducation && matchPosition && matchSuggestion
  })
})

// 筛选候选人
function filterCandidates() {
  pagination.value.page = 1
  loadCandidates()
}

// 切换分页
function handlePageChange(page: number) {
  pagination.value.page = page
  loadCandidates()
}

const handleExportUrl = ref('');
// 导出推荐候选人
function exportRecommended() {
  if (handleExportUrl.value != '') {
    window.open(handleExportUrl.value)
  }else{
    alert('暂无数据，请先上传候选人信息文件')
  }
}

// 详情弹窗
const detailModalVisible = ref(false)
const selectedCandidate = ref<typeof recommendedCandidates.value[0] | null>(null)

function showDetail(candidate: typeof recommendedCandidates.value[0]) {
  selectedCandidate.value = candidate
  detailModalVisible.value = true
}

function closeDetailModal() {
  detailModalVisible.value = false
}

// 评分等级样式
function getScoreClass(rating: string) {
  switch (rating) {
    case 'S': return 'score-a-plus'
    case 'A': return 'score-a'
    case 'B': return 'score-b'
    case 'C': return 'score-c'
    default: return ''
  }
}

// 登录弹窗
const loginModalVisible = ref(false)

const handleOpenLoginModal = () => {
  loginModalVisible.value = true
}
</script>

<style scoped>
  @import "@/assets/styles/BatchAssessmentView.css";
</style>
