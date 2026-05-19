<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <section class="hero-slider">
      <div class="slider-container">
        <div class="slider-track">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="slide"
            :class="{ active: currentSlide === index }"
            @click="openUrl(slide.url)"
          >
            <img v-if="slide.img" :src="slide.img" :alt="slide.title" class="slide-image"/>
            <div class="floating-particles">
              <div v-for="i in 8" :key="i" class="particle"></div>
            </div>
            <div class="slide-content">
              <h1 v-html="slide.title"></h1>
              <p v-html="slide.subtitle"></p>
              <div class="slide-stats">
                <div v-for="stat in slide.stats" :key="stat.label" class="stat-item">
                  <div class="stat-number">{{ stat.number }}<span>{{ stat.suffix }}</span></div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="slider-btn prev" @click="prevSlide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="slider-btn next" @click="nextSlide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        <div class="slider-dots">
          <span
            v-for="(_, index) in slides"
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </section>

    <!-- 搜索框 -->
    <section class="search-section">
      <div class="container">
        <div class="search-box">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="搜索公司或者职位..."
            class="search-input"
            @keydown.enter="handleSearch"
          >
          <button class="btn btn-primary search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>
    </section>

    <!-- 求职方案 -->
    <section class="recruitment-section">
      <div class="container">
        <div class="section-title">
          <h2 v-show="recruitmentType === 'campus'">为什么要选择启航Pro计划</h2>
          <h2 v-show="recruitmentType === 'social'">为什么选择我们的求职跃升Pro计划？</h2>
        </div>

        <!-- 主切换：校招/社招 -->
        <div class="recruitment-type-tabs">
          <button
            class="recruit-tab"
            :class="{ active: recruitmentType === 'campus' }"
            @click="recruitmentType = 'campus'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            校园招聘
          </button>
          <button
            class="recruit-tab"
            :class="{ active: recruitmentType === 'social' }"
            @click="recruitmentType = 'social'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            社会招聘
          </button>
        </div>

        <!-- 副标签 -->
        <div class="sub-tags" v-if="recruitmentType === 'campus'">
          <div class="sub-tags-label">你可能会遇到这些问题</div>
          <div class="sub-tags-list">
            <span v-for="tag in campusSubTags" :key="tag" class="sub-tag"><span class="sub-tag-text">{{ tag }}</span></span>
          </div>
          <div class="intro-description campus-intro">
            <p>求职是一场系统的战役，不能只靠临场发挥。从自我认知、赛道选择，到每一步的关键决策，都需要专业的策略与全程的陪伴。</p>
            <p>这正是「启航计划」存在的意义。我们不止步于技巧培训，更致力于为你构建清晰的职业地图，并提供从规划到拿Offer的全程深度陪跑。我们精心准备了以下方案：</p>
          </div>
        </div>
        <div class="sub-tags" v-else>
          <div class="sub-tags-label">您的求职难题，我们系统解决</div>
          <div class="sub-tags-list">
            <span v-for="tag in socialSubTags" :key="tag" class="sub-tag"><span class="sub-tag-text">{{ tag }}</span></span>
          </div>
        </div>

        <!-- 校园招聘内容 -->
        <div class="recruitment-content" v-show="recruitmentType === 'campus'">
          
          <div class="plans-tabs">
            <button
              class="plan-tab"
              :class="{ active: planSubType === 'classic' }"
              @click="planSubType = 'classic'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              经典陪跑系列
            </button>
            <button
              class="plan-tab"
              :class="{ active: planSubType === 'guarantee' }"
              @click="planSubType = 'guarantee'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              保障上岸系列
            </button>
          </div>
          <div class="plans-grid">
            <div class="plan-card" v-for="(plan, index) in campusPlans[planSubType]" :key="index">
              <div class="plan-badge" :class="{ hot: plan.isHot }">{{ plan.badge }}</div>
              <div class="plan-header">
                <h3>{{ plan.title }}</h3>
                <p>{{ plan.subtitle }}</p>
              </div>
              <div class="plan-suit">
                <!-- <span class="suit-label">适合：</span> -->
                <span class="suit-text">{{ plan.suit }}</span>
              </div>
              <div class="plan-price">
                <span class="price">¥{{ plan.price }}</span>
                <span class="period">¥{{ plan.originalPrice }}</span>
              </div>
              <ul class="plan-features">
                <li v-for="feature in plan.features" :key="feature">
                  <span class="icon">✓</span> {{ feature }}
                </li>
              </ul>
              <p v-if="plan.note" class="plan-note">{{ plan.note }}</p>
              <button class="btn btn-outline btn-block plan-btn" @click="showPlanDetail(plan.title, plan.price, plan.id)">
                立即咨询
              </button>
            </div>
          </div>
        </div>

        <!-- 社会招聘内容 -->
        <div class="recruitment-content" v-show="recruitmentType === 'social'">
          <div class="intro-description social-intro">
            <p>求职是一场战役，需要战略和全程支援。我们提供从定位、攻坚到收官的完整系统支持，以及结果保障的风险共担模式，为您护航。</p>
          </div>
          <div class="plans-tabs">
            <button
              class="plan-tab"
              :class="{ active: socialPlanSubType === 'classic' }"
              @click="socialPlanSubType = 'classic'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              经典陪跑系列
            </button>
            <button
              class="plan-tab"
              :class="{ active: socialPlanSubType === 'guarantee' }"
              @click="socialPlanSubType = 'guarantee'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              保障上岸系列
            </button>
          </div>
          <div class="plans-grid">
            <div
              v-for="(plan, index) in socialPlans[socialPlanSubType]"
              :key="index"
              class="plan-card"
            >
              <div class="plan-badge" :class="{ hot: plan.isHot }">{{ plan.badge }}</div>
              <div class="plan-header">
                <h3>{{ plan.title }}</h3>
                <p>{{ plan.subtitle }}</p>
              </div>
              <div class="plan-suit">
                <span class="suit-label">适合：</span>
                <span class="suit-text">{{ plan.suit }}</span>
              </div>
              <div class="plan-price">
                <span class="price">¥{{ plan.price }}</span>
                <span class="period">¥{{ plan.originalPrice }}</span>
              </div>
              <ul class="plan-features">
                <li v-for="feature in plan.features" :key="feature">
                  <span class="icon">✓</span> {{ feature }}
                </li>
              </ul>
              <p v-if="plan.note" class="plan-note">{{ plan.note }}</p>
              <button class="btn btn-outline btn-block plan-btn" @click="showPlanDetail(plan.title, plan.price, plan.id)">
                立即咨询
              </button>
            </div>
          </div>
        </div>

        <div class="plans-more">
          <RouterLink to="/plans" class="btn btn-primary btn-lg">查看更多套餐 ›</RouterLink>
        </div>
      </div>
    </section>

    <!-- 服务优势 -->
    <section ref="advantagesSectionRef" class="advantages-section">
      <div class="container">
        <div class="section-title">
          <!-- <span class="subtitle">我们的优势</span> -->
          <h2 style="color: #ffffff;">专业服务，助你求职成功</h2>
        </div>
        <div class="advantages-wrapper">
          <div class="advantages-row">
            <div v-for="(item, index) in advantages.slice(0, 4)" :key="index" class="advantage-card" :class="{ 'advantage-card-visible': index < visibleAdvantagesCount }">
              <div class="advantage-image">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="advantage-info">
                <h3>{{ item.title }}</h3>
                <span class="advantage-subtitle">{{ item.subtitle }}</span>
                <ul class="advantage-list">
                  <li v-for="feature in item.features" :key="feature">
                    <span class="check">✓ {{ feature }} </span> 
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="advantages-row">
            <div v-for="(item, index) in advantages.slice(4, 7)" :key="index" class="advantage-card" :class="{ 'advantage-card-visible': (index + 4) < visibleAdvantagesCount }">
              <div class="advantage-image">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="advantage-info">
                <h3>{{ item.title }}</h3>
                <span class="advantage-subtitle">{{ item.subtitle }}</span>
                <ul class="advantage-list">
                  <li v-for="feature in item.features" :key="feature">
                    <span class="check">✓ {{ feature }} </span> 
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务流程 -->
    <!-- <section ref="processSectionRef" class="process-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">服务流程</span>
          <h2>专业陪跑，步步为营</h2>
        </div>
        <div class="wave-process">
          <svg class="wave-line" viewBox="0 0 1400 120" preserveAspectRatio="none">
            <path
              class="wave-path"
              :class="{ 'wave-animate': visibleNodeCount > 0 }"
              d="M0,80 Q175,0 350,60 T700,60 T1050,60 T1400,60"
              fill="none"
              stroke="url(#waveGradient)"
              stroke-width="3"
              :style="{ '--progress': visibleNodeCount / 8 }"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#6bb142"/>
                <stop offset="100%" style="stop-color:#7c3aed"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="wave-nodes">
            <div
              v-for="(node, index) in processNodes"
              :key="node.num"
              class="wave-node"
              :class="{
                'node-top1': index === 0,
                'node-bottom': index === 1 || index === 7,
                'node-top3': index === 2,
                'node-bottom4': index === 3,
                'node-top5': index === 4,
                'node-top6': index === 5,
                'node-top7': index === 6,
                'node-visible': index < visibleNodeCount
              }"
            >
              <div class="node-card">
                <span v-if="index < visibleNodeCount" class="node-num">{{ node.num }}</span>
                <h4 v-if="index < visibleNodeCount">{{ node.title }}</h4>
                <p v-if="index < visibleNodeCount" v-html="node.desc"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- 7V1陪跑服务 -->
    <!-- <section ref="v7SectionRef" class="v7-section">
      <div class="container">
        <div class="section-title">
          <h2>智囊团全流程护航，你的身后有一群人</h2>
        </div>
        <div class="v7-grid">
          <div v-for="(service, index) in v7Services" :key="index" class="v7-card" :class="{ 'v7-card-visible': index < visibleV7Count }">
            <div class="v7-card-header">
              <div class="v7-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h4>{{ service.title }}</h4>
            </div>
            <div class="v7-card-body">
              <p>{{ service.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- 9大行业 -->
    <section ref="industriesSectionRef" class="industries-section">
      <div class="container">
        <div class="section-title">
          <!-- <span class="subtitle">覆盖9大行业</span> -->
          <h2 style="color: #ffffff;">专业求职服务，涵盖主流行业</h2>
        </div>
        <p class="industries-desc">
          我们的求职服务涵盖九大行业，致力于为各行业求职者提供优质求职辅导服务，
          也为各大企业输送符合标准的优质人才，用专业链接人才与企业，搭建人才与企业之间的桥梁。
        </p>
        <div class="industries-ring">
          <div class="industry-particles">
            <div v-for="i in 10" :key="i" class="particle"></div>
          </div>
          <div class="industry-lines">
            <svg width="100%" height="100%">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgba(59,130,246,0.8);"/>
                  <stop offset="50%" style="stop-color:rgba(59,130,246,0.3);"/>
                  <stop offset="100%" style="stop-color:rgba(59,130,246,0.8);"/>
                </linearGradient>
                <linearGradient id="lineGradV" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:rgba(59,130,246,0.8);"/>
                  <stop offset="50%" style="stop-color:rgba(59,130,246,0.3);"/>
                  <stop offset="100%" style="stop-color:rgba(59,130,246,0.8);"/>
                </linearGradient>
              </defs>
              <line v-for="(line, index) in industryLines" :key="index" :class="{ 'conn-line-visible': index < visibleIndustryLines }" x1="50%" y1="50%" :x2="line.x2" :y2="line.y2" stroke="rgba(37, 99, 235, 0.6)" stroke-width="1.5" class="conn-line" style="stroke-dasharray: none;"/>
            </svg>
          </div>
          <div class="industries-center">
            <div class="center-core">
              <span class="center-core-num">9</span>
              <span class="center-core-text">大行业</span>
            </div>
          </div>
          <div class="industry-items">
            <div
              v-for="(industry, index) in industries"
              :key="index"
              class="industry-card"
              :class="[`industry-card-${index + 1}`, { 'industry-card-visible': index < visibleIndustryCards }]"
            >
              <div class="industry-card-inner">
                <div class="industry-card-icon" :style="{ background: industry.color + '15' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ color: industry.color }">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div class="industry-card-content">
                  <h4>{{ industry.name }}</h4>
                  <p>{{ industry.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门职位 -->
    <section class="hot-jobs-section">
      <div class="container">
        <div class="section-title">
          <!-- <span class="subtitle">热门职位</span> -->
          <h2>精选职位，等你来投</h2>
        </div>
        <div class="hot-jobs-grid">
          <div v-for="(job, index) in hotJobs" :key="index" class="job-card">
            <div class="title">
              <div class="job-logo" :style="{ background: job.color }">
                <span>{{ job.logo }}</span>
              </div>
              <div class="job-info">
                <div class="job-header">
                  <h4>{{ job.position }}</h4>
                  <p class="job-company">{{ job.company }}</p>
                </div>
                
                <p class="job-salary">{{ job.salary }}</p>
              </div>
            </div>
            <div class="job-tags">
              <span v-for="tag in job.tags" :key="tag" class="tag" :class="{ 'tag-primary': tag === '远程', 'tag-success': tag === '全职' }">{{ tag }}</span>
            </div>
            <span class="job-time">{{ job.time }}</span>
          </div>
        </div>
        <div class="hot-jobs-more">
          <RouterLink to="/enterprise-direct" class="btn btn-primary btn-lg">寻找理想职位 ›</RouterLink>
        </div>
      </div>
    </section>

    <!-- 合作伙伴 -->
    <section class="partners-section">
      <div class="container">
        <div class="partners-title">
          <!-- <span class="subtitle">合作伙伴</span> -->
          <h2>与我们合作的企业</h2>
        </div>
        <!-- 第一行：从左向右滚动 -->
        <div class="partners-slider">
          <div class="partners-track">
            <div v-for="(partner, index) in [...partnersRow1, ...partnersRow1]" :key="'r1-'+index" class="partner-item" @click="openUrl(partner.url)">
              <img :src="partner.logo" :alt="partner.name || '合作伙伴'">
            </div>
          </div>
        </div>
        <!-- 第二行：从右向左滚动 -->
        <div class="partners-slider reverse">
          <div class="partners-track">
            <div v-for="(partner, index) in [...partnersRow2, ...partnersRow2]" :key="'r2-'+index" class="partner-item" @click="openUrl(partner.url)">
              <img :src="partner.logo" :alt="partner.name || '合作伙伴'">
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 套餐弹窗 -->
  <PlanModal v-model:modelValue="modalVisible" ref="planModalRef" @submit="handlePlanSubmit" />

  <!-- 支付弹窗 -->
  <PaymentModal
      :show="showPaymentModal"
      :order="{ id: pendingOrderId, amount: pendingOrderAmount }"
      @close="closePaymentModal"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PlanModal from '@/components/PlanModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import api from '@/api'
import { Location } from '@element-plus/icons-vue'

// Modal ref
const planModalRef = ref<InstanceType<typeof PlanModal> | null>(null)
const modalVisible = ref(false)

// 流程区域 ref
const processSectionRef = ref<HTMLElement | null>(null)

// 7V1服务区域 ref
const v7SectionRef = ref<HTMLElement | null>(null)

// 优势区域 ref
const advantagesSectionRef = ref<HTMLElement | null>(null)

// 行业区域 ref
const industriesSectionRef = ref<HTMLElement | null>(null)

// 支付弹窗相关
const showPaymentModal = ref(false)
const pendingOrderId = ref<number>(0)
const pendingOrderAmount = ref<number>(0)

// 轮播图数据
interface Slide {
  title: string
  subtitle: string
  img: string
  url?: string
  stats: { number: string; suffix: string; label: string }[]
}

const slides = ref<Slide[]>([
  {
    title: '',
    subtitle: '',
    img: '',
    url: '',
    stats: [
      // { number: '5000', suffix: '+', label: '成功学员' },
      // { number: '98', suffix: '%', label: '满意度' },
      // { number: '100', suffix: '+', label: '合作企业' }
    ]
  },
  {
    title: '',
    subtitle: '',
    img: '',
    url: '',
    stats: [
      // { number: '2000', suffix: '+', label: '校招offer' },
      // { number: '95', suffix: '%', label: '入职率' },
      // { number: '50', suffix: '+', label: '名企合作' }
    ]
  },
  {
    title: '',
    subtitle: '',
    img: '',
    url: '',
    stats: [
      // { number: '3000', suffix: '+', label: '社招offer' },
      // { number: '35', suffix: '%', label: '平均涨幅' },
      // { number: '28', suffix: '天', label: '最快入职' }
    ]
  }
])

const currentSlide = ref(0)
let slideInterval: number | null = null

// 合作伙伴数据
interface Partner {
  id: number
  name: string
  logo: string
  url: string
}
const partners = ref<Partner[]>([])

// 计算属性：将合作伙伴数组分成两行
const partnersRow1 = computed(() => partners.value.slice(0, 8))
const partnersRow2 = computed(() => partners.value.slice(8, 16))

// 默认统计数据
const defaultStats: Record<string, { number: string; suffix: string; label: string }[]> = {
  // '启航': [
  //   { number: '5000', suffix: '+', label: '成功学员' },
  //   { number: '98', suffix: '%', label: '满意度' },
  //   { number: '100', suffix: '+', label: '合作企业' }
  // ],
  // '校园': [
  //   { number: '2000', suffix: '+', label: '校招offer' },
  //   { number: '95', suffix: '%', label: '入职率' },
  //   { number: '50', suffix: '+', label: '名企合作' }
  // ],
  // '职场': [
  //   { number: '3000', suffix: '+', label: '社招offer' },
  //   { number: '35', suffix: '%', label: '平均涨幅' },
  //   { number: '28', suffix: '天', label: '最快入职' }
  // ]
}

// 根据标题获取匹配的统计数据
function getStatsByTitle(title: string) {
  const keys = Object.keys(defaultStats)
  for (const key of keys) {
    if (title.includes(key)) {
      return defaultStats[key]
    }
  }
  return defaultStats['启航']
}

// 获取轮播图数据
async function fetchBanners() {
  try {
    const banners = await api.bannerList()
    if (banners && banners.length > 0) {
      slides.value = banners.map((banner: any) => ({
        title: banner.title || '',
        subtitle: banner.mark || '',
        img: banner.image || '',
        url: banner.url || '',
        stats: getStatsByTitle(banner.title || '')
      }))
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

function goToSlide(index: number) {
  currentSlide.value = index
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
  //获取套餐数据
  getCampusPlans('campus');
  getCampusPlans('social');
  //获取轮播图
  fetchBanners();

  //获取热门职位（企业直推）
  fetchHotJobs();

  //获取合作伙伴
  fetchPartners();

  // 监听流程区域进入视口
  nextTick(() => {
    if (processSectionRef.value) {
      processObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startNodeAnimation()
              processObserver?.disconnect()
            }
          })
        },
        { threshold: 0.3 }
      )
      processObserver.observe(processSectionRef.value)
    }

    // 监听7V1区域进入视口
    if (v7SectionRef.value) {
      v7Observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startV7Animation()
              v7Observer?.disconnect()
            }
          })
        },
        { threshold: 0.2 }
      )
      v7Observer.observe(v7SectionRef.value)
    }

    // 监听优势区域进入视口
    if (advantagesSectionRef.value) {
      advantagesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAdvantagesAnimation()
              advantagesObserver?.disconnect()
            }
          })
        },
        { threshold: 0.2 }
      )
      advantagesObserver.observe(advantagesSectionRef.value)
    }

    // 监听行业区域进入视口
    if (industriesSectionRef.value) {
      industriesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startIndustriesAnimation()
              industriesObserver?.disconnect()
            }
          })
        },
        { threshold: 0.2 }
      )
      industriesObserver.observe(industriesSectionRef.value)
    }
  })
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
  if (nodeAnimationTimer) clearInterval(nodeAnimationTimer)
  if (processObserver) processObserver.disconnect()
  if (v7Observer) v7Observer.disconnect()
  if (advantagesObserver) advantagesObserver.disconnect()
  if (industriesObserver) industriesObserver.disconnect()
})

// 求职类型切换
const recruitmentType = ref<'campus' | 'social'>('campus')
const campusSubTags = ['如何找到适合自己的好工作？', '秋招/春招时间线规划', '专业与岗位匹配', '让HR记住的简历', '国央企面试准备', '网申资源获取', '与HR沟通技巧', '面试表达与谈薪', '合同法律避雷']
const socialSubTags = ['如何找到真正匹配我的职业方向？', '简历如何3秒内抓住HR注意力？', '面试如何清晰展现优势谈理想薪资？', '如何有效避坑Offer和入职协议？', '网申资源在哪里找？', '该怎么和HR沟通？', '合同协议等法律文件避雷']

// 方案子分类
const planSubType = ref<'classic' | 'guarantee'>('classic')
const socialPlanSubType = ref<'classic' | 'guarantee'>('classic')

// 校园招聘套餐
const campusPlans = ref<any>({})
// 社会招聘套餐
const socialPlans = ref<any>({})
/**
 * 获取套餐数据
 * @param type 
 */
async function getCampusPlans(type: 'campus' |'social') {
  try {
    let params = {
      type: type
    }
    const res: any = await api.planHot(params)
    if (res) {
      if (type === 'campus') {
        campusPlans.value = res;
      } else {
        socialPlans.value = res;
      }
      
    }
  } catch (error) {
    console.error(error)
  }
}

// 服务优势数据
const advantages = ref([
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    title: '职业规划',
    subtitle: 'Career Planning',
    features: ['职业评估', '行业分析', '岗位解析']
  },
  {
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=450&fit=crop',
    title: '简历重构',
    subtitle: 'Resume Reconstruction',
    features: ['经历挖掘', '简历优化', '简历更迭']
  },
  {
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=450&fit=crop',
    title: '面试辅导',
    subtitle: 'Interview Coaching',
    features: ['岗位拆解', '针对性面试', '面试复盘', '笔面题库']
  },
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop',
    title: '网申资源',
    subtitle: 'Online Application Resources',
    features: ['资源聚拢', '投递指南', '个性推荐']
  },
  {
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop',
    title: '简历代投',
    subtitle: 'Resume Delivery Service',
    features: ['平台任选', '沟通跟进', '专业投递']
  },
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop',
    title: '指导就业',
    subtitle: 'Employment Guidance',
    features: ['全程陪跑', '专业建议', '企业背调', '合同避雷', '心理疏导']
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop',
    title: '职前辅导',
    subtitle: 'Pre-employment Coaching',
    features: ['Offer 抉择', '入职辅导', '入职规划']
  }
  
])

// 7V1服务
const v7Services = ref([
  {
    title: '职业规划导师',
    desc: '负责"定方向"。深度剖析你的背景与优势，明确职业方向，交付一份清晰的《三大梯队求职战略地图》，解决"往哪投"的根本问题。'
  },
  {
    title: '简历优化老师',
    desc: '负责"敲门砖"。以HR与名企导师的视角，重构你的经历与价值叙事，确保简历筛选通过率与面试邀约率显著提升，解决"如何被看到"的问题。'
  },
  {
    title: '面试赋能老师',
    desc: '负责"闯关术"。进行全真模拟面试，拆解目标公司必考题型与行为逻辑，针对性提升临场表现与应答策略，确保你现场表现超越大多数竞争者。'
  },
  {
    title: '指导就业老师',
    desc: '负责"做决策"。在你获得多个Offer或面临选择时，提供薪酬谈判辅导、职位对比分析（公司前景、团队、发展等），帮助你做出最优决策。'
  },
  {
    title: '简历代投老师',
    desc: '负责"提效率"。根据既定策略，高效帮你完成在各大招聘平台的目标岗位投递，并进行沟通跟进。解放你的时间，并确保投递动作无遗漏。'
  },
  {
    title: '网申资源导师',
    desc: '负责"拓渠道"。根据专业经验及策略，帮你梳理你的目标岗位资源，并进行网申投递。'
  },
  {
    title: '质量监督员',
    desc: '全程跟进监督服务流程与细节，确保每一项服务承诺落地，保障你的体验与最终成果。'
  }
])

// 行业连线数据
const industryLines = [
  { x2: "50%", y2: "16%" },   // 互联网 - top: 6%
  { x2: "86%", y2: "24%" },   // 制造 - top: 15%, right: 8%
  { x2: "94%", y2: "48%" },   // 新能源 - top: 42%, right: 2%
  { x2: "86%", y2: "66%" },   // 人工智能 - bottom: 22%, right: 8%
  { x2: "72%", y2: "88%" },   // 电气 - bottom: 4%, right: 22%
  { x2: "28%", y2: "88%" },   // 物流 - bottom: 4%, left: 22%
  { x2: "14%", y2: "66%" },   // 计算机 - bottom: 22%, left: 8%
  { x2: "14%", y2: "45%" },   // 硬件 - top: 42%, left: 2%
  { x2: "14%", y2: "22%" },   // 金融 - top: 15%, left: 8%
]

// 行业数据
const industries = ref([
  { name: '互联网行业', desc: '产品/技术/运营多岗位', color: '#6bb142' },
  { name: '制造业', desc: '生产/质量/供应链', color: '#8fca6f' },
  { name: '新能源行业', desc: '光伏/储能/电动车', color: '#10b981' },
  { name: '人工智能与数据', desc: '算法/ML/大数据', color: '#7c3aed' },
  { name: '电气', desc: '电力/自动化/控制', color: '#f59e0b' },
  { name: '物流与供应链', desc: '仓储/运输/采购', color: '#ef4444' },
  { name: '计算机', desc: '软件/硬件/开发', color: '#ec4899' },
  { name: '硬件与半导体', desc: '芯片/嵌入式/IC', color: '#6366f1' },
  { name: '金融财会', desc: '银行/证券/审计', color: '#14b8a6' }
])

// 流程节点
const processNodes = ref([
  { num: 1, title: '报名加入', desc: '填写求职信息<br>匹配专属顾问' },
  { num: 2, title: '职业规划', desc: '深度评估<br>明确目标与方向' },
  { num: 3, title: '简历优化', desc: '打造HR眼中的<br>完美简历' },
  { num: 4, title: '面试辅导', desc: '模拟训练<br>提升面试通过率' },
  { num: 5, title: '简历代投', desc: '精准投递<br>效率倍增' },
  { num: 6, title: '谈薪指导', desc: '掌握技巧<br>拿到理想薪资' },
  { num: 7, title: 'Offer/合同避雷', desc: '专业审核<br>保障权益' },
  { num: 8, title: '入职辅导', desc: '顺利入职<br>快速融入' }
])

// 流程节点动画
const visibleNodeCount = ref(0)
let nodeAnimationTimer: any = null
let processObserver: IntersectionObserver | null = null
const isProcessAnimated = ref(false)

function startNodeAnimation() {
  if (isProcessAnimated.value) return
  isProcessAnimated.value = true
  visibleNodeCount.value = 0
  let count = 0
  nodeAnimationTimer = setInterval(() => {
    count++
    visibleNodeCount.value = count
    if (count >= 8) {
      clearInterval(nodeAnimationTimer)
    }
  }, 350)
}

// 7V1卡片动画
const visibleV7Count = ref(0)
const isV7Animated = ref(false)
let v7Observer: IntersectionObserver | null = null

function startV7Animation() {
  if (isV7Animated.value) return
  isV7Animated.value = true
  visibleV7Count.value = 0
  let count = 0
  const v7Timer = setInterval(() => {
    count++
    visibleV7Count.value = count
    if (count >= 7) {
      clearInterval(v7Timer)
    }
  }, 150)
}

// 优势卡片动画
const visibleAdvantagesCount = ref(0)
const isAdvantagesAnimated = ref(false)
let advantagesObserver: IntersectionObserver | null = null

function startAdvantagesAnimation() {
  if (isAdvantagesAnimated.value) return
  isAdvantagesAnimated.value = true
  visibleAdvantagesCount.value = 0
  let count = 0
  const advTimer = setInterval(() => {
    count++
    visibleAdvantagesCount.value = count
    if (count >= 7) {
      clearInterval(advTimer)
    }
  }, 150)
}
// 行业连线动画
const visibleIndustryLines = ref(0)
const visibleIndustryCards = ref(0)
const isIndustriesAnimated = ref(false)
let industriesObserver: IntersectionObserver | null = null

function startIndustriesAnimation() {
  if (isIndustriesAnimated.value) return
  isIndustriesAnimated.value = true
  // 每条线画完后立即显示对应的卡片
  let count = 0
  const timer = setInterval(() => {
    count++
    visibleIndustryLines.value = count
    visibleIndustryCards.value = count  // 线显示后立即显示对应卡片
    if (count >= 9) {
      clearInterval(timer)
    }
  }, 200)  // 每200ms显示一条线和对应卡片
}

// 热门职位 - 从企业直推API获取
interface HotJob {
  company: string
  logo: string
  color: string
  position: string
  tags: string[]
  salary: string
  time: string
  id?: number
}
const hotJobs = ref<HotJob[]>([])

const fetchHotJobs = async () => {
  try {
    const res = await api.getRecommendJobList({ page: 1, pageSize: 8 })
    hotJobs.value = (res.data || []).map((job: any) => ({
      id: job.id,
      company: job.company,
      logo: job.logoText || job.company?.charAt(0) || '岗',
      color: job.logoColor || '#4F46E5',
      position: job.position || job.title,
      tags: [job.location, job.position, job.industry, job.audienceText].filter(Boolean),
      salary: job.salary || '-',
      time: job.created_at ? formatTimeAgo(job.created_at) : ''
    }))
  } catch (error) {
    hotJobs.value = []
  }
}

// 获取合作伙伴
const fetchPartners = async () => {
  try {
    const res = await api.partnersList()
    partners.value = (res.data || res) || []
  } catch (error) {
    partners.value = []
  }
}

// 格式化时间戳为相对时间
const formatTimeAgo = (dateStr: string): string => {
  if (!dateStr) return ''

  // 将 MySQL datetime 格式转换为 Date 对象
  const date = new Date(dateStr.replace(' ', 'T'))
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  // 判断是否是同一天
  const isToday = now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()

  if (isToday) return '今天'
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days === 2) return '2天前'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return dateStr
}

// 搜索
const searchKeyword = ref('')
const router = useRouter()

function handleSearch() {
  if (!searchKeyword.value.trim()) {
    return // 输入为空时不搜索
  }
  router.push({
    path: '/application-resources',
    query: { keyword: searchKeyword.value.trim() }
  })
}

// 显示套餐详情
function showPlanDetail(planTitle: string, price: string, id:number) {
  if (planModalRef.value) {
    planModalRef.value.openPlanModal(planTitle, price, id)
  }
}

// PlanModal 提交成功后调用支付
async function handlePlanSubmit(data: { formData: any; orderId: number; amount: string | number }) {
  // 保存订单信息
  pendingOrderId.value = data.orderId
  pendingOrderAmount.value = Number(data.amount)

  // 关闭套餐详情弹窗
  modalVisible.value = false;
  /// 显示支付弹窗
  showPaymentModal.value = true
}

// 关闭支付弹窗
function closePaymentModal() {
  showPaymentModal.value = false
}

//跳转到外部url
function openUrl(url: string) {
  window.open(url)
}

</script>


<style scoped>
  @import "@/assets/styles/HomeView.css";

</style>
