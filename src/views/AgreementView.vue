<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

// 侧边栏导航项
const navItems = [
  { path: '/terms', label: '用户协议', name: 'terms' },
  { path: '/privacy', label: '隐私协议', name: 'privacy' },
  { path: '/service', label: '服务介绍', name: 'service' }
]

// 判断当前激活的导航项
const activeNav = computed(() => {
  const path = route.path
  if (path === '/terms') return 'terms'
  if (path === '/privacy') return 'privacy'
  if (path === '/service') return 'service'
  return 'terms'
})

// 协议类型
const agreementType = computed(() => {
  if (route.path === '/terms') return 'terms'
  if (route.path === '/privacy') return 'privacy'
  if (route.path === '/service') return 'service'
  return 'terms'
})

// 数据状态
const loading = ref(true)
const agreementData = ref<{
  title: string
  content: string
  updated_at: string
} | null>(null)

// 简单缓存
const CACHE_KEY = 'agreement_cache_'
const CACHE_TIME = 5 * 60 * 1000 // 5分钟

// 获取缓存
function getCache(type: string) {
  try {
    const cache = localStorage.getItem(CACHE_KEY + type)
    if (cache) {
      const { data, timestamp } = JSON.parse(cache)
      if (Date.now() - timestamp < CACHE_TIME) {
        return data
      }
    }
  } catch (e) {
    console.error('读取缓存失败:', e)
  }
  return null
}

// 设置缓存
function setCache(type: string, data: any) {
  try {
    localStorage.setItem(CACHE_KEY + type, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.error('设置缓存失败:', e)
  }
}

// 获取协议内容
async function fetchAgreement() {
  loading.value = true

  // 先尝试从缓存获取
  const cached = getCache(agreementType.value)
  if (cached) {
    agreementData.value = cached
    loading.value = false

    // 后台静默刷新
    fetchFromApi()
    return
  }

  await fetchFromApi()
}

// 从API获取
async function fetchFromApi() {
  try {
    const res: any = await api.getAgreement(agreementType.value)
    if (res && res.title) {
      agreementData.value = {
        title: res.title,
        content: res.content,
        updated_at: res.updated_at
      }
      // 存入缓存
      setCache(agreementType.value, agreementData.value)
    }
  } catch (error) {
    console.error('获取协议失败:', error)
  } finally {
    loading.value = false
  }
}

// 路由变化时重新获取
watch(agreementType, () => {
  fetchAgreement()
})

onMounted(() => {
  fetchAgreement()
})
</script>

<template>
  <div class="agreement-page">
    <div class="agreement-container">
      <!-- 左侧导航栏 -->
      <aside class="agreement-sidebar">
        <nav class="sidebar-nav">
          <div
            v-for="item in navItems"
            :key="item.name"
            class="nav-item"
            :class="{ active: activeNav === item.name }"
            @click="router.push(item.path)"
          >
            {{ item.label }}
          </div>
        </nav>
      </aside>

      <!-- 右侧内容区 -->
      <main class="agreement-main">
        <!-- Loading 状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 协议内容 -->
        <template v-else-if="agreementData">
          <div class="agreement-header">
            <h1>{{ agreementData.title }}</h1>
            <p class="last-update">最后更新：{{ agreementData.updated_at || '未知' }}</p>
          </div>

          <div class="agreement-content">
            <div v-html="agreementData.content"></div>
          </div>
        </template>

        <!-- 空状态 -->
        <div v-else class="empty-container">
          <p>暂无协议内容......</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.agreement-page {
  min-height: 100vh;
  width: 100%;
  background: #f8fafc;
}

.agreement-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  overflow: hidden;
}

/* 左侧导航栏 */
.agreement-sidebar {
  flex-shrink: 0;
  width: 200px;
}

.sidebar-nav {
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  position: sticky;
}

.nav-item {
  padding: 14px 20px;
  font-size: 15px;
  color: #64748b;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #6bb142;
}

.nav-item.active {
  background: linear-gradient(135deg, #6bb142 0%, #568e34 100%);
  color: #fff;
  font-weight: 500;
}

/* 右侧内容区 */
.agreement-main {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  min-width: 0;
}

/* Loading 状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.empty-container .back-link {
  margin-top: 20px;
}

.agreement-header {
  color: #000000;
  padding: 40px;
  text-align: center;
}

.agreement-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
}

.last-update {
  font-size: 14px;
  opacity: 0.85;
}

.agreement-content {
  line-height: 1.8;
  color: #333;
  font-size: 15px;
}

.agreement-content p {
  margin-bottom: 16px;
  text-align: justify;
}

.agreement-content .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-top: 24px;
  margin-bottom: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .agreement-container {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .agreement-sidebar {
    width: 100%;
  }

  .sidebar-nav {
    display: flex;
    padding: 4px;
    position: static;
  }

  .nav-item {
    flex: 1;
    text-align: center;
    padding: 12px 10px;
    font-size: 14px;
  }

  .agreement-main {
    padding: 24px;
  }

  .agreement-header {
    padding: 20px;
  }

  .agreement-header h1 {
    font-size: 20px;
  }
}
</style>
