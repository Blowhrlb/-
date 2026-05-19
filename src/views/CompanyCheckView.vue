<template>
  <div class="company-check-page">
    <!-- 页面标题 -->
    <PageHeader
      title="企业背调"
      description="深度洞察，助你明智抉择，降低职业风险"
      bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      height="450px"
    />

    <!-- 介绍内容 -->
    <section class="intro-section">
      <div class="container">
        <p class="intro-desc">
          在职场关键决策面前，一份全面、客观的背景信息，是你避免"入坑"、抓住机遇的有力保障。
          春风求职为你提供专业、严谨的企业背景调查服务，让你在求职、跳槽或合作前，看清企业的"真实面貌"。
        </p>
        <div class="concerns">
          <h3>您是否曾有以下担忧？</h3>
          <div class="concerns-grid">
            <div class="concern-item">
              <div class="concern-icon">?</div>
              <p>面试时公司描绘的蓝图美好，入职后才发现落差巨大？</p>
            </div>
            <div class="concern-item">
              <div class="concern-icon">?</div>
              <p>担心新公司的财务状况不稳，有欠薪或裁员风险？</p>
            </div>
            <div class="concern-item">
              <div class="concern-icon">?</div>
              <p>想了解团队真实工作氛围、领导风格，而非官方说辞？</p>
            </div>
            <div class="concern-item">
              <div class="concern-icon">?</div>
              <p>对创业公司或新兴行业的长期稳定性心存疑虑？</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 查询表单 -->
    <section class="query-section">
      <div class="container">
        <div class="query-card">
          <h3>立即查询</h3>
          <p>提交您的查询需求，我们将为您深入调查目标企业</p>
          <div class="query-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">企业全称
                  <span class="required">*</span>
                  <span v-if="formErrors.companyName" class="form-error">{{ formErrors.companyName }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="请输入企业全称"
                  v-model="companyName"
                  @input="clearError('companyName')"
                >
                
              </div>
              <div class="form-group">
                <label class="form-label">企业所在地
                  <span class="required">*</span>
                  <span v-if="formErrors.companyLocation" class="form-error">{{ formErrors.companyLocation }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="如：北京市"
                  v-model="companyLocation"
                  @input="clearError('companyLocation')"
                >
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">想要了解的问题及方向 
                <span class="required">*</span>
                <span v-if="formErrors.companyQuestions" class="form-error">{{ formErrors.companyQuestions }}</span>
              </label>
              <textarea
                class="form-control"
                rows="4"
                placeholder="如：薪资水平、晋升机制、人员规模、加班情况等"
                v-model="companyQuestions"
                @input="clearError('companyQuestions')"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">您的姓名
                  <span class="required">*</span>
                  <span v-if="formErrors.userName" class="form-error">{{ formErrors.userName }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="请输入姓名"
                  v-model="userName"
                  @input="clearError('userName')"
                >
              </div>
              <div class="form-group">
                <label class="form-label">联系电话
                  <span class="required">*</span>
                  <span v-if="formErrors.userPhone" class="form-error">{{ formErrors.userPhone }}</span>
                </label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="请输入手机号"
                  v-model="userPhone"
                  @input="clearError('userPhone')"
                >
              </div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" @click="submitQuery">
              提交查询需求
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务内容 -->
    <section class="services-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">我们提供</span>
          <h2>我们呈现的，不止是公开信息</h2>
        </div>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <h3>1. 深度基本面分析</h3>
            <ul>
              <li>工商与法律风险：股权结构、法律诉讼、行政处罚、经营异常记录</li>
              <li>经营与财务健康度：融资历史、业务规模变化、招聘趋势分析、公开财报解读</li>
              <li>市场声誉扫描：主流媒体报道、行业评价、重大业务动态</li>
            </ul>
          </div>
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>2. 职场口碑与文化洞察</h3>
            <ul>
              <li>内部体验透视：基于可溯源的匿名渠道，了解薪资结构、加班文化、晋升路径</li>
              <li>管理层背景调查：核心创始人与高管的职业履历与行业风评</li>
              <li>员工待遇与体验感：企业均薪、福利待遇等</li>
            </ul>
          </div>
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <h3>3. 定制化专项调查</h3>
            <ul>
              <li>针对特定岗位或部门，进行更聚焦的团队稳定性与业绩压力调查</li>
              <li>竞对对比分析，帮你看清目标公司在行业中的真实位置与优势劣势</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 背调原则 -->
    <section class="principles-section">
      <div class="container">
        <div class="principles-grid">
          <div class="principle-card">
            <div class="principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h4>客观中立</h4>
            <p>提供基于事实与多方信源的分析</p>
          </div>
          <div class="principle-card">
            <div class="principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M9 15l2 2 4-4"/>
              </svg>
            </div>
            <h4>深度结合</h4>
            <p>调查结果可与你的职业性格测试报告联动</p>
          </div>
          <div class="principle-card">
            <div class="principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h4>严格保密</h4>
            <p>全程保障您的个人信息与咨询隐私</p>
          </div>
        </div>
        <div class="principles-note">
          <h3>企业背调的服务价值</h3>
          <div class="value-grid">
            <div class="value-item">
              <h5>对求职者</h5>
              <p>规避风险公司，选择与自己价值观和发展规划相匹配的平台，提升入职后的稳定性与幸福感</p>
            </div>
            <div class="value-item">
              <h5>对职场人</h5>
              <p>在内部转岗或接受新任命前，全面了解新部门情况，做出最优决定</p>
            </div>
            <div class="value-item">
              <h5>对创业者/合作方</h5>
              <p>在关键合作或入职前，深入了解合作伙伴或意向公司的真实底色</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FloatingMenu />

    <!-- 查询历史弹窗 -->
    <AppModal v-model:visible="historyModalVisible" title="查询历史" @close="closeHistoryModal">
      <div class="history-modal-content">
        <p>暂无查询历史</p>
      </div>
    </AppModal>

    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
import AppModal from '@/components/common/AppModal.vue'
import LoginModal from '@/components/LoginModal.vue'
import HrQrModal from '@/components/common/HrQrModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { companyCheckSubmit } from '@/api'

// 查询表单
const companyName = ref('')
const companyLocation = ref('')
const companyQuestions = ref('')
const userName = ref('')
const userPhone = ref('')

// 表单错误提示
const formErrors = ref({
  companyName: '',
  companyLocation: '',
  companyQuestions: '',
  userName: '',
  userPhone: ''
})

// 清除错误提示
function clearError(field: 'companyName' | 'companyLocation' | 'companyQuestions' | 'userName' | 'userPhone') {
  formErrors.value[field] = ''
}

// 表单提交
const submitQuery = async () => {
  // 验证必填项
  let hasError = false

  if (!companyName.value.trim()) {
    formErrors.value.companyName = '请输入企业全称'
    hasError = true
  }
  if (!companyLocation.value.trim()) {
    formErrors.value.companyLocation = '请输入企业所在地'
    hasError = true
  }
  if (!companyQuestions.value.trim()) {
    formErrors.value.companyQuestions = '请输入想要了解的问题'
    hasError = true
  }
  if (!userName.value.trim()) {
    formErrors.value.userName = '请输入姓名'
    hasError = true
  }
  if (!userPhone.value.trim()) {
    formErrors.value.userPhone = '请输入联系电话'
    hasError = true
  } else if (!/^1[3-9]\d{9}$/.test(userPhone.value.trim())) {
    formErrors.value.userPhone = '请输入正确的手机号'
    hasError = true
  }

  if (hasError) {
    return
  }

  try {
    await companyCheckSubmit({
      company_name: companyName.value.trim(),
      company_location: companyLocation.value.trim(),
      questions: companyQuestions.value.trim(),
      user_name: userName.value.trim(),
      user_phone: userPhone.value.trim()
    })
    // 提交成功后弹出二维码弹窗
    showHrQrModal()
    // 重置表单
    companyName.value = ''
    companyLocation.value = ''
    companyQuestions.value = ''
    userName.value = ''
    userPhone.value = ''
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// HR二维码弹窗
const hrQrModalVisible = ref(false)
const qrTip = ref('')

const showHrQrModal = () => {
  qrTip.value = '扫码添加HR微信，了解企业信息'
  hrQrModalVisible.value = true
}

// 查询历史弹窗
const historyModalVisible = ref(false)

// 登录弹窗
const loginModalVisible = ref(false)

const showHistoryModal = () => {
  historyModalVisible.value = true
}

const closeHistoryModal = () => {
  historyModalVisible.value = false
}

const handleOpenLoginModal = () => {
  loginModalVisible.value = true
}
</script>

<style scoped>
  @import "@/assets/styles/CompanyCheckView.css";
</style>