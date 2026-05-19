<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useUserStore } from '@/store'
import PaginationPage from '@/components/common/PageModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import HrQrModal from '@/components/common/HrQrModal.vue'

// 头像上传相关
const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarLoading = ref(false)

function triggerAvatarUpload() {
  avatarInputRef.value?.click()
}
//上传头像
async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小 (最大2MB)
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }

  avatarLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res: any = await api.uploadImage(formData)
    // 解析响应格式：{ status, data: { success, file_path, file_url } }
    // file_url 是完整URL，优先使用
    let avatarUrl = res.data?.file_url || res.file_url
    // 如果没有完整URL，则使用 file_path
    if (!avatarUrl || !avatarUrl.startsWith('http')) {
      avatarUrl = res.data?.file_path || res.file_path
    }

    if (avatarUrl) {
      // 调用更新用户信息接口
      await api.updateUser({ avatar: avatarUrl })
      // 更新本地用户信息
      userStore.setUser({ ...userInfo.value, avatar: avatarUrl })
      ElMessage.success('头像更新成功')
    }
  } catch (error: any) {
    console.error('头像上传失败:', error)
    ElMessage.error(error.message || '头像上传失败')
  } finally {
    avatarLoading.value = false
    // 清空 input 以便重复选择同一文件
    target.value = ''
  }
}

// 用户名编辑相关
const isEditingName = ref(false)
const editedName = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

function startEditName() {
  editedName.value = userInfo.value?.name || ''
  isEditingName.value = true
  // 下一次 DOM 更新后聚焦输入框
  setTimeout(() => {
    nameInputRef.value?.focus()
  }, 0)
}

async function saveName() {
  const name = editedName.value.trim()

  // 验证用户名
  if (!name) {
    ElMessage.error('用户名不能为空')
    return
  }

  // 限制8个汉字
  const chineseChars = name.replace(/[^\u4e00-\u9fa5]/g, '')
  if (chineseChars.length > 8) {
    ElMessage.error('用户名最多8个汉字')
    return
  }

  try {
    await api.updateUser({ name })
    // 更新本地用户信息
    userStore.setUser({ ...userInfo.value, name })
    isEditingName.value = false
    ElMessage.success('用户名更新成功')
  } catch (error: any) {
    console.error('用户名更新失败:', error)
    ElMessage.error(error.message || '用户名更新失败')
  }
}

function handleNameBlur() {
  // 失去焦点时保存
  if (isEditingName.value) {
    saveName()
  }
}

function handleNameKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveName()
  } else if (event.key === 'Escape') {
    isEditingName.value = false
  }
}

// Header 背景图
const headerBackgrounds = [
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&q=80',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80'
]

const router = useRouter()
const userStore = useUserStore()

interface Order {
  id: number
  plan_name: string
  amount: number
  payment_status: number
  status: number
  expired_at: string | null
  created_at: string
  remaining_seconds?: number
  pan_recruitment_type: string
  plan_type: string
}

interface PaymentMethod {
  type: string
  name: string
  url: string
}

const orders = ref<Order[]>([])
const allOrders = ref<Order[]>([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const perPage = ref(20)

// 当前选中的分类: all-全部, pending-待支付, paid-已支付, expired-过期
const activeCategory = ref('all')

// 当前选中的订单（用于支付）
const selectedOrder = ref<Order | null>(null)
const showPaymentModal = ref(false)
const hrQrModalVisible = ref(false)

// HR二维码弹窗
function showHrQrModal() {
  hrQrModalVisible.value = true
}

// 分类订单数量
const orderCounts = computed(() => {
  return {
    all: allOrders.value.length,
    pending: allOrders.value.filter(o => o.payment_status === 0 && o.status === 1 && (o.remaining_seconds || 0) > 0).length,
    paid: allOrders.value.filter(o => o.payment_status === 1).length,
    expired: allOrders.value.filter(o => o.payment_status === 0 && (o.status === 0 || !o.remaining_seconds || o.remaining_seconds <= 0)).length
  }
})

// 根据分类过滤订单
const filteredOrders = computed(() => {
  if (activeCategory.value === 'all') {
    return allOrders.value
  } else if (activeCategory.value === 'pending') {
    return allOrders.value.filter(o => o.payment_status === 0 && o.status === 1 && (o.remaining_seconds || 0) > 0)
  } else if (activeCategory.value === 'paid') {
    return allOrders.value.filter(o => o.payment_status === 1)
  } else if (activeCategory.value === 'expired') {
    return allOrders.value.filter(o => o.payment_status === 0 && (o.status === 0 || !o.remaining_seconds || o.remaining_seconds <= 0))
  }
  return allOrders.value
})

// 切换分类
function switchCategory(category: string) {
  activeCategory.value = category
}

// 倒计时定时器
let countdownTimer: number | null = null

// 用户信息
const userInfo = computed(() => userStore.user as any)

// 支付状态映射
const paymentStatusMap: Record<number, { text: string; class: string; icon: string }> = {
  0: { text: '待支付', class: 'status-pending', icon: 'clock' },
  1: { text: '已支付', class: 'status-paid', icon: 'check' },
  2: { text: '支付失败', class: 'status-failed', icon: 'x' }
}

// 获取订单列表
async function fetchOrders() {
  loading.value = true
  try {
    const res: any = await api.orderList({ page: currentPage.value })
    // 转换 payment_status 为数字类型
    const processedOrders = (res.data || []).map((order: any) => ({
      ...order,
      pan_recruitment_type: order.pan_recruitment_type || 0,
      plan_type: order.plan_type || 0,
      payment_status: Number(order.payment_status),
      status: Number(order.status),
      amount: Number(order.amount)
    }))
    // 保存所有订单
    allOrders.value = processedOrders
    orders.value = processedOrders
    total.value = res.total
    perPage.value = res.per_page

    totalPages.value = Math.ceil(res.total / res.per_page);
    console.log('totalPagestotalPages', res.total, res.per_page, totalPages.value)

    // 启动倒计时
    startCountdown()
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取用户信息
async function fetchUserInfo() {
  if (userStore.token && !userStore.user) {
    try {
      const res: any = await api.userInfo()
      userStore.setUser(res)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
}

// 倒计时格式化
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '已过期'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 更新所有订单的倒计时
function startCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  countdownTimer = window.setInterval(() => {
    orders.value.forEach(order => {
      if (order.payment_status === 0 && order.remaining_seconds && order.remaining_seconds > 0) {
        order.remaining_seconds--
      }
    })
  }, 1000)
}

// 获取支付链接
async function getPaymentLink(order: Order) {
  console.log('点击支付按钮，订单ID:', order.id)
  selectedOrder.value = order
  showPaymentModal.value = true
}

// 关闭支付弹窗
function closePaymentModal() {
  showPaymentModal.value = false
  selectedOrder.value = null
}

// 删除订单
const deleteLoading = ref<number | null>(null)
async function deleteOrder(order: Order) {
  if (!confirm('确定要删除该订单吗？')) return

  deleteLoading.value = order.id
  try {
    await api.orderDelete(order.id)
    // 从列表中移除
    orders.value = orders.value.filter(o => o.id !== order.id)
    allOrders.value = allOrders.value.filter(o => o.id !== order.id)
    ElMessage.success('订单删除成功')
  } catch (error: any) {
    console.error('删除订单失败:', error)
    ElMessage.error(error.message || '删除订单失败')
  } finally {
    deleteLoading.value = null
  }
}

// 格式化手机号
function formatPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7, 11)
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 分页
const totalPages = ref(0);
// 分页数据，用于 PageModal 组件
const paginationData = computed(() => ({
  current_page: currentPage.value,
  last_page: totalPages.value,
  total: total.value,
  per_page: perPage.value
}))

// 处理分页变化
function handlePageChange(page: number) {
  currentPage.value = page
  fetchOrders()
}

onMounted(() => {
  fetchUserInfo()
  fetchOrders()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <div class="orders-page">
    <!-- Page Header -->
    <PageHeader
      title="我的订单"
      description="查看和管理您的套餐订单，未支付的订单可以在这里查看详情和支付"
      :bgImages="headerBackgrounds"
      height="450px"
    />

    <div class="container">
      <!-- Main Content: Left Sidebar + Right Orders -->
      <div class="main-layout">
        <!-- Left Sidebar: User Info -->
        <div class="sidebar">
          <div class="user-card">
            <div class="user-avatar" @click="triggerAvatarUpload" :class="{ 'is-loading': avatarLoading }">
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              >
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="头像">
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <div class="avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div class="user-details">
              <h3 v-if="!isEditingName" class="user-name-wrapper">
                <span class="user-name">{{ userInfo?.name || '用户' }}</span>
                <svg class="edit-icon" @click.stop="startEditName" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </h3>
              <input
                v-else
                ref="nameInputRef"
                v-model="editedName"
                class="name-input"
                placeholder="请输入用户名"
                maxlength="8"
                @blur="handleNameBlur"
                @keydown="handleNameKeydown"
              >
              <p class="user-phone">{{ formatPhone(userInfo?.phone || '') }}</p>
            </div>
          </div>

          <div class="user-menu">
            <div class="menu-item" :class="{ active: activeCategory === 'all' }" @click="switchCategory('all')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              <span>全部订单</span>
              <span class="menu-badge" v-if="orderCounts.all > 0">{{ orderCounts.all }}</span>
            </div>
            <div class="menu-item" :class="{ active: activeCategory === 'pending' }" @click="switchCategory('pending')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>待支付</span>
              <span class="menu-badge" v-if="orderCounts.pending > 0">{{ orderCounts.pending }}</span>
            </div>
            <div class="menu-item" :class="{ active: activeCategory === 'paid' }" @click="switchCategory('paid')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              <span>已支付</span>
              <span class="menu-badge paid" v-if="orderCounts.paid > 0">{{ orderCounts.paid }}</span>
            </div>
            <div class="menu-item" :class="{ active: activeCategory === 'expired' }" @click="switchCategory('expired')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>已过期</span>
              <span class="menu-badge expired" v-if="orderCounts.expired > 0">{{ orderCounts.expired }}</span>
            </div>
          </div>
        </div>

        <!-- Right Content: Orders List -->
        <div class="orders-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="skeleton-list">
              <div v-for="i in 3" :key="i" class="skeleton-card">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text short"></div>
              </div>
            </div>
          </div>

          <!-- Orders List -->
          <div v-else-if="orders.length > 0" class="orders-list">
            <TransitionGroup name="order-card" tag="div" class="cards-container">
              <div
                v-for="order in filteredOrders"
                :key="order.id"
                class="order-card"
                :class="{ 'is-pending': order.payment_status === 0 }"
              >
                <!-- Card Header -->
                <div class="card-header">
                  <div class="order-id-badge">
                    <span class="badge-dot"></span>
                    订单ID {{ order.id }}
                  </div>
                  
                  <div class="status-badge">
                    <div class="header-actions">
                      <el-icon class="delete-icon" @click.stop="deleteOrder(order)" :loading="deleteLoading === order.id">
                        <Delete />
                      </el-icon>
                    </div>

                    <div class="ord-status" :class="paymentStatusMap[order.payment_status]?.class">
                      <svg v-if="paymentStatusMap[order.payment_status]?.icon === 'clock'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <svg v-else-if="paymentStatusMap[order.payment_status]?.icon === 'check'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      {{ paymentStatusMap[order.payment_status]?.text }}
                    </div>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="card-body">
                  <div class="order-info-grid">
                    <!-- 第1行：套餐名称 | 订单金额 -->
                    <div class="info-row">
                      <div class="info-left">
                        <span class="info-label">套餐名称</span>
                        <span class="info-value">{{ order?.pan_recruitment_type === 'campus' ? '校园招聘' : '社招招聘' }}
                          <svg t="1772204979815" class="icon" viewBox="0 0 1229 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4802" width="20" height="10"><path d="M1214.397 443.016L790.485 15.008a50.788 50.788 0 0 0-72.29 0.205 51.607 51.607 0 0 0-4.3 68.092l344.76 348.14H51.097A51.402 51.402 0 0 0 0.002 483.256c0 28.466 22.936 51.505 50.992 51.505h1007.559L705.498 891.092a53.245 53.245 0 0 0 8.499 61.846 50.48 50.48 0 0 0 36.247 14.745 57.34 57.34 0 0 0 40.855-17.407l28.261-28.363 77.615-78.332 14.642-14.54 302.677-305.748a51.197 51.197 0 0 0 14.336-39.217v-2.048a51.197 51.197 0 0 0-14.336-39.012z" fill="#A6ACBB" p-id="4803"></path></svg>
                          {{ order?.plan_type == 'classic' ? '经典系列' : '保障系列' }}
                          <svg t="1772204979815" class="icon" viewBox="0 0 1229 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4802" width="20" height="10"><path d="M1214.397 443.016L790.485 15.008a50.788 50.788 0 0 0-72.29 0.205 51.607 51.607 0 0 0-4.3 68.092l344.76 348.14H51.097A51.402 51.402 0 0 0 0.002 483.256c0 28.466 22.936 51.505 50.992 51.505h1007.559L705.498 891.092a53.245 53.245 0 0 0 8.499 61.846 50.48 50.48 0 0 0 36.247 14.745 57.34 57.34 0 0 0 40.855-17.407l28.261-28.363 77.615-78.332 14.642-14.54 302.677-305.748a51.197 51.197 0 0 0 14.336-39.217v-2.048a51.197 51.197 0 0 0-14.336-39.012z" fill="#A6ACBB" p-id="4803"></path></svg>
                          {{ order.plan_name || '-' }}
                        </span>
                      </div>
                      <div class="info-right">
                        <span class="info-label">订单金额</span>
                        <span class="info-value amount">¥{{ formatAmount(order.amount) }}</span>
                      </div>
                    </div>

                    <!-- 第2行：创建时间 | 过期时间 -->
                    <div class="info-row">
                      <div class="info-left">
                        <span class="info-label">创建时间</span>
                        <span class="info-value">{{ formatDate(order.created_at) }}</span>
                      </div>
                      <div class="info-right">
                        <span class="info-label">过期时间</span>
                        <span class="info-value" :class="{ 'text-danger': order.payment_status === 0 && (!order.remaining_seconds || order.remaining_seconds <= 0) }">
                          {{ order.expired_at ? formatDate(order.expired_at) : '' }}
                        </span>
                      </div>
                    </div>

                    <!-- 第3行：剩余支付时间 | 联系我 -->
                    <div class="info-row" v-if="order.payment_status === 0">
                      <div class="info-left">
                        <span class="info-label">剩余支付时间</span>
                        <span class="countdown-timer" :class="{ 'timer-danger': !order.remaining_seconds || order.remaining_seconds <= 0 }">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align: -2px; margin-right: 4px;">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {{ formatCountdown(order.remaining_seconds || 0) }}
                        </span>
                      </div>
                      <div class="info-right">
                        <span class="contact-btn" @click="showHrQrModal">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          联系我
                        </span>
                      </div>
                    </div>

                    <!-- 已支付状态 -->
                    <div class="info-row" v-else>
                      <div class="info-left">
                        <span class="info-label">支付状态</span>
                        <span class="info-value" style="color: var(--success)">✓ 已完成支付</span>
                      </div>
                      <div class="info-right"></div>
                    </div>
                  </div>
                </div>

                <!-- Card Footer -->
                <div class="card-footer" v-if="order.remaining_seconds && order.status === 1">
                  <div class="footer-left">
                    <span v-if="order.payment_status === 1" class="paid-hint">
                      感谢您的信任
                    </span>
                    <span v-if="(order.payment_status === 0 || order.payment_status === 2) && order.status === 1" class="pending-hint">
                      请尽快完成支付，订单即将过期
                    </span>
                  </div>
                  <div class="footer-right">
                    <button
                      v-if="order.payment_status === 0 && order.status === 1"
                      class="btn-pay"
                      @click="getPaymentLink(order)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      立即支付
                    </button>
                    <span v-else-if="order.payment_status === 1" class="paid-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      已完成
                    </span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
                <path d="M70 90 L90 110 L130 70" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
              </svg>
            </div>
            <h3>暂无订单</h3>
            <p>您还没有任何订单记录<br/>快去选择心仪的套餐吧</p>
            <router-link to="/plans" class="btn-browse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              立即选购
            </router-link>
          </div>

          <!-- Pagination -->
          <!-- <PaginationPage
            source="orders"
            :PaginationData="paginationData"
            @change="handlePageChange"
          /> -->
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      :show="showPaymentModal"
      :order="selectedOrder"
      @close="closePaymentModal"
    />

    <!-- HR二维码弹窗 -->
    <HrQrModal v-model:visible="hrQrModalVisible" title="扫码联系我" />
  </div>
</template>

<style scoped>
/* ==================== CSS Variables ==================== */
.orders-page {
  --primary: #6bb142;
  --primary-dark: #568e34;
  --primary-light: #8fca6f;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --border-color: #e2e8f0;
  --border-light: #f1f5f9;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== Page Layout ==================== */
.orders-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

/* Background Effects */
.bg-effects {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.container {
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* ==================== Page Header ==================== */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg), 0 0 40px rgba(37, 99, 235, 0.3);
}

.header-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.header-text h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.header-text p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

/* ==================== Main Layout ==================== */
.main-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

/* ==================== Sidebar ==================== */
.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.user-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
}

.user-avatar {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.user-avatar svg {
  width: 36px;
  height: 36px;
  color: white;
}

.user-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.user-phone {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 用户名编辑 */
.user-name-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.edit-icon:hover {
  color: var(--primary);
}

.name-input {
  width: 100%;
  padding: 4px 8px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--primary);
  border-radius: 4px;
  outline: none;
  background: #fff;
}

/* 头像上传 */
.user-avatar {
  position: relative;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar .avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay svg {
  width: 24px;
  height: 24px;
  color: white;
}

.user-avatar.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.user-menu {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.menu-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.menu-item.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: var(--primary);
  border-left: 3px solid var(--primary);
}

.menu-item svg {
  width: 20px;
  height: 20px;
}

.menu-item span {
  font-size: 15px;
  font-weight: 500;
}

.menu-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: var(--primary);
  border-radius: 10px;
  margin-left: auto;
}

.menu-badge.paid {
  background: var(--success);
}

.menu-badge.expired {
  background: var(--danger);
}

/* ==================== Orders Content ==================== */
.orders-content {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 28px;
  position: relative;
}

/* ==================== Loading State ==================== */
.loading-state {
  padding: 20px 0;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 24px;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  height: 20px;
  margin-bottom: 12px;
}

.skeleton-title { width: 40%; height: 24px; }
.skeleton-text { width: 80%; }
.skeleton-text.short { width: 50%; margin-bottom: 0; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ==================== Orders List ==================== */
.orders-list {
  position: relative;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: var(--transition);
}

.order-card:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(37, 99, 235, 0.1);
}

.order-card.is-pending {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 50%);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
}

.order-id-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-icon {
  cursor: pointer;
  color: var(--text-muted);
  font-size: 18px;
  transition: color 0.2s ease;
}

.delete-icon:hover {
  color: #f56c6c;
}

.status-badge svg {
  width: 14px;
  height: 14px;
}

.ord-status{
  padding: 5px 12px;
  border-radius: 26px;
}
.status-pending { color: var(--warning); background: #fef3c7; }
.status-paid { color: var(--success); background: #d1fae5; }
.status-failed { color: var(--danger); background: #fee2e2; }

/* Card Body */
.card-body {
  padding: 20px;
}

/* 信息网格 - 每行两列 */
.order-info-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 每行：左右两列 */
.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.info-row:last-child {
  border-bottom: none;
}

.info-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
}

.info-value.amount {
  font-size: 22px;
  font-weight: 800;
  color: #f59e0b;
}

.info-value.text-danger {
  color: var(--danger);
}

.countdown-timer {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.countdown-timer.timer-danger {
  color: var(--danger);
}

/* 移动端 */
@media (max-width: 768px) {
  .order-info-grid {
    gap: 10px;
  }
  .info-row {
    padding: 8px 0;
  }
  .info-value.amount {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .order-info-grid {
    gap: 8px;
  }
  .info-value.amount {
    font-size: 16px;
  }
  .contact-btn {
    font-size: 13px;
    padding: 5px 12px;
  }
}

/* 联系按钮 */
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  animation: bounce 1.5s ease-in-out infinite;
  white-space: nowrap;
  padding: 6px 16px;
  border: 2px solid #667eea;
  border-radius: 20px;
  transition: all 0.2s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.contact-btn:hover {
  color: #fff;
  background: #667eea;
  animation: none;
}

/* 扫码联系小按钮 */
.contact-mini-btn {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  padding: 6px 14px;
  border: 1.5px solid #667eea;
  border-radius: 16px;
  background: transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.contact-mini-btn:hover {
  background: #667eea;
  color: #fff;
}

/* Countdown */
.countdown-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--warning);
  font-family: 'Courier New', monospace;
}

.countdown-timer svg {
  width: 20px;
  height: 20px;
}

.countdown-timer.timer-danger {
  color: var(--danger);
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
}

.footer-left {
  font-size: 13px;
}

.pending-hint { color: var(--warning); }
.paid-hint { color: var(--success); }

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-pay {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
}

.btn-pay svg {
  width: 18px;
  height: 18px;
}

.paid-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #d1fae5;
  color: var(--success);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
}

.paid-badge svg {
  width: 16px;
  height: 16px;
}

/* ==================== Empty State ==================== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-illustration {
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
  color: var(--text-muted);
}

.empty-illustration svg { width: 100%; height: 100%; }

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.6;
}

.btn-browse {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  color: white;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(37, 99, 235, 0.3);
}

.btn-browse:hover {
  transform: translateY(-2px);
}

.btn-browse svg { width: 18px; height: 18px; }

/* ==================== Pagination ==================== */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--bg-primary);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.page-btn:disabled {
  color: var(--text-muted);
  border-color: var(--border-color);
  cursor: not-allowed;
}

.page-btn svg { width: 16px; height: 16px; }

.page-dots {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 14px;
}

.page-current {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.page-separator { color: var(--text-muted); }
.page-total { color: var(--text-secondary); }

/* ==================== Payment Modal ==================== */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.payment-modal {
  background: white;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 420px;
  box-shadow: var(--shadow-xl);
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: none;
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
}

.payment-loading {
  text-align: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.payment-loading p {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.payment-amount-display {
  text-align: center;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.payment-amount-display .label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.payment-amount-display .amount {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.payment-option svg {
  width: 28px;
  height: 28px;
}

.payment-option.alipay {
  color: #1677ff;
}

.payment-option.alipay:hover {
  border-color: #1677ff;
  background: rgba(22, 119, 255, 0.05);
}

.payment-option.wechat {
  color: #07c160;
}

.payment-option.wechat:hover {
  border-color: #07c160;
  background: rgba(7, 193, 96, 0.05);
}

.payment-option.bank {
  color: #6bb142;
}

.payment-option.bank:hover {
  border-color: #6bb142;
  background: rgba(37, 99, 235, 0.05);
}

/* ==================== Transitions ==================== */
.order-card-enter-active,
.order-card-leave-active {
  transition: all 0.4s ease;
}

.order-card-enter-from { opacity: 0; transform: translateY(20px); }
.order-card-leave-to { opacity: 0; transform: translateX(-20px); }

/* ==================== Responsive ==================== */
@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
    display: block;
  }

  .sidebar {
    position: static;
  }

  .user-card {
    margin-bottom: 16px;
  }

  .user-menu {
    display: flex;
    flex-wrap: wrap;
  }

  .menu-item {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .menu-item.active {
    border-left: none;
    border-bottom: 3px solid var(--primary);
  }
}

@media (max-width: 768px) {
  .header-content { gap: 14px; }

  .header-icon {
    width: 52px;
    height: 52px;
  }

  .header-icon svg { width: 26px; height: 26px; }

  .header-text h1 { font-size: 24px; }

  .orders-content { padding: 16px; }

  .info-col.text-right {
    align-items: flex-start;
  }

  .card-footer { flex-direction: column; gap: 12px; }

  .footer-right { width: 100%; }

  .btn-pay { width: 100%; justify-content: center; }

  /* 移动端菜单样式 - 隐藏滚动条但保持滚动功能 */
  .user-menu {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 8px;
    padding: 8px;
    margin: 5px auto;
    scrollbar-width: none; /* Firefox */
  }

  /* 隐藏 Chrome/Safari 滚动条 */
  .user-menu::-webkit-scrollbar {
    display: none;
  }

  .menu-item {
    flex: 0 0 auto;
    padding: 10px 12px;
    font-size: 12px;
    min-width: auto;
    justify-content: center;
  }

  .menu-item svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .menu-item span {
    font-size: 12px;
  }

  .menu-badge {
    font-size: 10px;
    padding: 2px 6px;
    margin-left: 4px;
  }
}
</style>
