<template>
  <div class="candidate-assessment-page">
    <!-- Page Header -->
    <PageHeader
      title="候选人综合评估"
      description="深度洞察，助你明智抉择，降低职业风险"
      :bgImage="bannerImg"
      height="450px"
    />

    <!-- Intro Section -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text">
            <h2>专业、高效、可靠的候选人背景调查服务</h2>
            <p class="intro-desc">
              高质量的面试，始于精准的候选人初筛。本板块通过智能系统，快速评估海量简历，
              并生成直观的候选人适配报告，精准标识潜在风险。使HR能迅速聚焦于高潜力的候选人，
              并带着清晰的目标进行深度沟通。
            </p>
            <p class="intro-desc">
              我们致力于将繁琐的筛选工作自动化，从而让招聘团队聚焦于识别顶尖人才，
              也让优秀候选人获得更高效、更匹配的职业机会。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages Section -->
    <section class="advantages-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">我们的服务优势</span>
          <h2>用数字，见证改变</h2>
        </div>
        <div class="advantages-grid">
          <div v-for="adv in advantages" :key="adv.id" class="advantage-card">
            <div class="advantage-icon">
              <svg v-if="adv.icon === 'chart'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <svg v-else-if="adv.icon === 'shield'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="advantage-number">
              <span class="number" :data-target="adv.target">0</span>
              <span class="unit">{{ adv.unit }}</span>
            </div>
            <h3>{{ adv.title }}</h3>
            <p>{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="container">
        <h3 class="section-subtitle">专业服务</h3>
        <div class="services-grid">
          <div v-for="(service, index) in services" :key="index" class="service-item">
            <div class="service-icon">
              <svg v-if="service.icon === 'education'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <svg v-else-if="service.icon === 'work'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <svg v-else-if="service.icon === 'qualification'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <svg v-else-if="service.icon === 'record'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4>{{ service.title }}</h4>
          </div>
        </div>
        <div class="action-area">
          <button class="btn btn-primary btn-lg" @click="goToBatchAssessment">批量综合评估</button>
        </div>
      </div>
    </section>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
      <div class="modal" style="max-width: 700px;">
        <div class="modal-header">
          <h3>批量候选人评估</h3>
          <button class="modal-close" @click="closeUploadModal">&times;</button>
        </div>
        <div class="modal-body" style="text-align: center;">
          <div class="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h4 style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">批量候选人评估已升级</h4>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.8;">
            新版批量评估页面提供更完善的功能：<br>
            模板下载、使用指南、操作流程介绍、<br>
            评估结果分页展示、筛选导出等
          </p>
          <button class="btn btn-primary btn-lg" style="margin-bottom: 16px;" @click="goToBatchAssessment">
            前往新版批量评估
          </button>
          <p style="font-size: 12px; color: #94a3b8;">点击上方按钮开始使用</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'
import bannerImg from '@/assets/images/candidate-assessment-banner.png'

const userStore = useUserStore()
const advantages = [
  {
    id: 'efficiency',
    icon: 'chart',
    target: 100,
    unit: '倍',
    title: '效率提升',
    desc: '简历日处理能力大幅提升，帮HR把好筛选的第一关！'
  },
  {
    id: 'risk',
    icon: 'shield',
    target: 95,
    unit: '%',
    title: '风险识别率',
    desc: '关键风险精准预警，清晰建议选人更准！'
  }
]

// 专业服务数据
const services = [
  {
    icon: 'education',
    title: '学历验证'
  },
  {
    icon: 'work',
    title: '工作经历验证'
  },
  {
    icon: 'qualification',
    title: '职业资格验证'
  },
  {
    icon: 'record',
    title: '不良记录验证'
  }
]

const router = useRouter()
const showUploadModal = ref(false)

function openUploadModal() {
  showUploadModal.value = true
}

function closeUploadModal() {
  showUploadModal.value = false
}

function goToBatchAssessment() {
  // 检查是否登录
  if (!userStore.isLoggedIn) {
    // 未登录，弹出登录框
    window.dispatchEvent(new CustomEvent('open-login-modal'))
    return
  }
  // 已登录，直接跳转
  router.push('/batch-assessment')
}

// 数字动画
function animateNumber(element: HTMLElement, target: number) {
  const duration = 2000
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(start + (target - start) * easeOut)

    element.textContent = current.toString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

// 初始化数字动画
function initNumberAnimation() {
  const numbers = document.querySelectorAll('.number')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt((entry.target as HTMLElement).dataset.target || '0')
        animateNumber(entry.target as HTMLElement, target)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  numbers.forEach(num => observer.observe(num))
}

onMounted(() => {
  nextTick(() => {
    initNumberAnimation()
  })
})
</script>

<style scoped>
  @import "@/assets/styles/CandidateAssessmentView.css";
</style>