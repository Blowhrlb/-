<template>
  <div class="question-bank-page">
    <!-- Page Header -->
    <PageHeader
      title="精选题库"
      description="海量名企题库，考前刷题心不慌；大厂面经资源，过面有迹可循！"
      bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
      height="450px"
    />

    <!-- Main Content -->
    <section class="question-content">
      <div class="container">
        <!-- 行业分类 -->
        <div class="category-bar">
          <div class="category-scroll">
            <button
              v-for="cat in categories"
              :key="cat.id"
              :class="['category-btn', { active: selectedCategory === cat.id || (cat.id === 'all' && selectedCategory === 'all') }]"
              @click="selectCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- 题库卡片网格 -->
        <div class="question-grid">
          <div
            v-for="bank in questionBanks"
            :key="bank.id"
            class="question-card"
          >
            <!-- 分类标签 - 左侧 -->
            <span v-if="bank.category" class="card-category">{{ bank.category }}</span>
            <!-- 热门标签 - 右侧 -->
            <span v-if="bank.badge" class="card-badge" :class="bank.badge === '热门' ? 'hot' : ''">
              {{ bank.badge }}
            </span>
            <!-- 大图区域 -->
            <div class="card-image" :style="getCardImageStyle(bank)">
              <!-- <el-icon :size="56"><component :is="iconMap[bank.icon] || Monitor" /></el-icon> -->
            </div>
            <div class="card-content">
              <h3>{{ bank.title }}</h3>
              <p>{{ bank.description }}</p>
              <span class="learn-count">{{ bank.learn_count }}人学习</span>
              <button class="card-btn" @click="showHrQrModal()">免费领取</button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > pageSize">
          <span class="disabled">&#8249;</span>
          <template v-for="page in Math.ceil(total / pageSize)" :key="page">
            <span class="active" v-if="currentPage === page">{{ page }}</span>
            <a v-else href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </template>
          <a href="#" @click.prevent="goToPage(currentPage + 1)">&#8250;</a>
        </div>
      </div>
    </section>

    <!-- 行业资料 -->
    <section class="materials-section">
      <div class="container">
        <div class="section-title">
          <h2>求职拼的就是信息差和手速</h2>
        </div>
        <p class="materials-desc">
          春风求职辅导团队搜集行业全新"内幕"，精心梳理多项求职指导手册，
          助力你在求职路上快人一步，高效斩获心仪Offer!
        </p>
        <div class="materials-grid">
          <div v-for="(material, index) in materials" :key="material.id" class="material-card">
            <!-- 大图区域 -->
            <div class="material-image">
              <h4>{{ material.title }}</h4>
            </div>
            <div class="material-content">
              <!-- <el-icon :size="32"><Files /></el-icon> -->
              <p>{{ material.description }}</p>
            </div>
            <button class="btn btn-primary" @click="showHrQrModal()">免费领取</button>
          </div>
        </div>
      </div>
    </section>

    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Monitor,
  Connection,
  Wallet,
  Money,
  Cpu,
  Lightning,
  Grid,
  User,
  Document,
  Files,
  Reading,
  Ticket,
  Present,
  Box
} from '@element-plus/icons-vue'
import HrQrModal from '@/components/common/HrQrModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import api from '@/api'

// 图标映射
const iconMap: Record<string, any> = {
  computer: Monitor,
  internet: Connection,
  bank: Wallet,
  finance: Money,
  machine: Cpu,
  electric: Lightning,
  electronics: Grid,
  material: Box,
  hr: User
}

// 资料图标映射
const materialIconMap: Record<string, any> = {
  default: Document
}

// 题库卡片渐变背景
const bankGradients: Record<string, string> = {
  computer: 'linear-gradient(135deg, #6bb142 0%, #568e34 100%)',
  internet: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
  bank: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  finance: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  machine: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  electric: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
  electronics: 'linear-gradient(135deg, #8fca6f 0%, #6bb142 100%)',
  material: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  hr: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
}

function getBankGradient(icon: string): string {
  return bankGradients[icon] || bankGradients.computer
}

function getCardImageStyle(bank: any): Record<string, string> {
  // 优先使用封面图
  if (bank.image) {
    return {
      background: `url(${bank.image}) center/cover no-repeat`
    }
  }
  // 其次使用背景色
  if (bank.bg_color) {
    return {
      background: bank.bg_color
    }
  }
  // 默认使用渐变
  return {
    background: getBankGradient(bank.icon)
  }
}

// HR二维码弹窗
const hrQrModalVisible = ref(false)
const qrTip = ref('')

const showHrQrModal = () => {
  qrTip.value = '扫码添加HR微信，获取最新资料'
  hrQrModalVisible.value = true
}

// 题库分类
const categories = ref<any[]>([])

// 题库卡片数据
const questionBanks = ref<any[]>([])

// 行业资料数据
const materials = ref([
  {
    id: 1,
    title: '《各城市"小而美"企业推荐名单》',
    description: '收录各城市优质但不卷的好企业'
  },
  {
    id: 2,
    title: '《2025行业薪酬白皮书》',
    description: '各行业各岗位薪酬水平大公开'
  },
  {
    id: 3,
    title: '《2025求职选岗白皮书》',
    description: '帮你找到最适合的岗位方向'
  },
  {
    id: 4,
    title: '《不同专业技能汇总和就业前景》',
    description: '你的专业能从事哪些高薪岗位'
  }
])

const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

/**
 * 获取分类列表
 */
async function fetchCategories() {
  try {
    const res: any = await api.questionBankCategories()
    if (res) {
      // 添加"全部"选项在最前面
      categories.value = [{ id: 'all', name: '全部' }, ...res]
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取题库列表
 */
async function fetchQuestionBanks() {
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value
    }

    if (selectedCategory.value && selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }
    const res: any = await api.questionBankList(params)
    if (res && res.data) {
      questionBanks.value = res.data || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error(error)
  }
}

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId
  currentPage.value = 1
  fetchQuestionBanks()
}

function goToPage(page: number) {
  if (page >= 1 && Math.ceil(total.value / pageSize.value) >= page) {
    currentPage.value = page
    fetchQuestionBanks()
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchQuestionBanks()
})
</script>

<style scoped>
  @import "@/assets/styles/QuestionBankView.css";
</style>
