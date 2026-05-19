<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { useUserStore } from '@/store'
import logoImg from '@/assets/images/logo.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)

// 用户手机号
const userPhone = computed(() => (userStore.user as any)?.phone || '')

// 获取登录状态
function checkLoginState() {
  userStore?.user
  if (userStore.token && !userStore?.user) {
    fetchUserInfo();
  }
}

// 获取用户信息
async function fetchUserInfo() {
  try {
    const res:any = await api.userInfo();
    userStore.setUser(res)
  } catch (error) {
    // 如果获取失败，可能是token过期
    // userStore.logout()
  }
}

// 格式化手机号
function formatPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7, 11)
}

// 点击手机号跳转到订单页面（如果有订单）
async function goToOrders() {
  console.log('goToOrders called, isLoggedIn:', userStore.isLoggedIn, 'token:', userStore.token)
  if (!userStore.isLoggedIn) {
    openLoginModal()
    return
  }

  try {
    const res: any = await api.orderList({ page: 1 })
    const hasOrder = res.data && res.data.length > 0

    if (hasOrder) {
      router.push('/orders')
    } else {
      // 没有订单，给出提示
      alert('您当前还没有订单')
    }
  } catch (error: any) {
    console.error('检查订单失败:', error)
    console.error('Error response:', error.response)
    alert('获取订单信息失败，请稍后重试')
  }
}

// 打开登录弹窗事件
const emit = defineEmits<{
  (e: 'openLoginModal'): void
}>()

function openLoginModal() {
  emit('openLoginModal')
}

// 退出登录
async function logout() {
  try {
    await api.logout()
  } catch (error) {
    // 忽略退出接口错误
  }
  userStore.logout()
  router.push('/')
}

const navItems = [
  { name: '首页', path: '/' },
  { name: '求职题库', path: '/question-bank' },
  { name: '性格测试', path: '/personality-test' },
  { name: '网申资源', path: '/application-resources' },
  { name: '企业直推', path: '/enterprise-direct' },
  { name: '企业背调', path: '/company-check' },
  { name: '候选人评估', path: '/candidate-assessment' }
]

const dropdownItems = [
  { name: '求职服务', path: '/personal-cases' },
  { name: '企业服务', path: '/company-cases' }
]

// 关闭移动端菜单
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 点击导航链接后关闭菜单
function handleNavClick() {
  closeMobileMenu()
}

// 切换下拉菜单
function toggleDropdown(e: Event) {
  e.preventDefault()
  isDropdownOpen.value = !isDropdownOpen.value
}

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkLoginState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 暴露登录状态给父组件
defineExpose({
  checkLoginState
})
</script>

<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <div class="header-inner">
        <RouterLink to="/" class="logo">
          <img class="logo-icon" :src="logoImg">
          <span class="logo-text">春风求职</span>
        </RouterLink>

        <!-- 移动端菜单遮罩层 -->
        <div v-if="isMobileMenuOpen" class="nav-overlay" @click="closeMobileMenu"></div>

        <nav class="nav-menu" :class="{ 'nav-open': isMobileMenuOpen }">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActive(item.path) }"
            @click="handleNavClick"
          >
            {{ item.name }}
          </RouterLink>

          <!-- 成功案例下拉菜单 -->
          <div class="nav-dropdown" :class="{ active: isDropdownOpen }" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
            <a href="javascript:;" class="nav-link dropdown-toggle" :class="{ active: isActive('/personal-cases') || isActive('/company-cases') }" @click="toggleDropdown">
              成功案例
            </a>
            <div class="dropdown-menu" :style="{ display: isDropdownOpen ? 'block' : '' }">
              <RouterLink
                v-for="item in dropdownItems"
                :key="item.path"
                :to="item.path"
                class="dropdown-item"
                @click="handleNavClick"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <RouterLink to="/news" class="nav-link" :class="{ active: isActive('/news') }" @click="handleNavClick">就业资讯</RouterLink>
          <RouterLink to="/about" class="nav-link" :class="{ active: isActive('/about') }" @click="handleNavClick">关于我们</RouterLink>
        
        </nav>
        
        <div class="myInfo">
          <div class="header-actions">
            <template v-if="userStore.isLoggedIn">
              <div class="user-info">
                <button class="user-phone" @click="goToOrders">{{ formatPhone(userPhone) }}</button>
                <button class="btn btn-outline" @click="logout">退出</button>
              </div>
            </template>
            <template v-else>
              <button class="btn btn-login" @click="openLoginModal">登录/注册</button>
            </template>
          </div>

          <button class="mobile-toggle" :class="{ 'is-active': isMobileMenuOpen }" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  transition: all 0.3s ease;
  /* height: 72px; */
}

.header-scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  margin: 8px auto;
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.active {
  color: var(--primary-color);
}

/* 下拉菜单 */
.nav-dropdown {
  position: relative;
  display: flex;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-toggle::after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid currentColor;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.nav-dropdown:hover .dropdown-toggle::after {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  min-width: 160px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--bg-tertiary);
  color: var(--primary-color);
}

.myInfo{
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-phone {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.user-phone:hover {
  /* background: rgba(107, 177, 66, 0.1); */
  color: #6bb142;
}

.btn-outline {
  padding: 8px 16px;
  font-size: 13px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: #6bb142;
  color: #ffffff;
}

.btn-login {
  position: relative;
  padding: 12px 28px;
  background: linear-gradient(135deg, #6bb142 0%, #568e34 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(107, 177, 66, 0.25);
  overflow: hidden;
  min-width: 100px;
  min-height: 44px;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(107, 177, 66, 0.35);
  background: linear-gradient(135deg, #568e34 0%, #6bb142 100%);
}

.btn-login:hover::before {
  opacity: 1;
}

.btn-login:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(107, 177, 66, 0.25);
}

.btn-login:focus-visible {
  outline: 2px solid #6bb142;
  outline-offset: 2px;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
}

.mobile-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-toggle.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle.is-active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 1024px) {
  .header {
    z-index: 1000;
    position: sticky;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }

  .header:hover {
    background: rgba(255, 255, 255, 0.95);
  }

  /* 移动端菜单遮罩层 */
  .nav-overlay {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .nav-menu {
    position: fixed;
    top: 72px;
    left: 0;
    width: 280px;
    max-width: 85vw;
    height: calc(100vh - 72px);
    background: #ffffff;
    flex-direction: column;
    padding: 20px;
    gap: 4px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    z-index: 1000;
  }

  .nav-menu.nav-open {
    transform: translateX(0);
  }

  .nav-link {
    width: 100%;
    padding: 14px 16px;
    font-size: 14px;
    background: var(--bg-tertiary);
    margin-bottom: 4px;
    border-radius: 8px;
  }

  .nav-dropdown {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .dropdown-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 14px 16px;
    background: var(--bg-tertiary);
    margin-bottom: 4px;
    border-radius: 8px;
  }

  .dropdown-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid currentColor;
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.active {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    border: none;
    padding: 0 0 0 20px;
    display: none;
    background: transparent;
    min-width: auto;
    z-index: 1001;
  }

  .nav-dropdown.active .dropdown-menu {
    display: block;
  }

  .dropdown-item {
    padding: 12px 16px;
    color: var(--text-primary);
    background: #f1f5f9;
    margin: 4px 0;
    border-radius: 8px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-actions .btn-login {
    padding: 10px 16px;
    font-size: 14px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-radius: 8px;
    min-width: auto;
    min-height: auto;
    box-shadow: none;
  }

  .header-actions .btn-login:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
    transform: none;
  }

  .header-actions .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
  }

  .header-actions .user-phone {
    font-size: 14px;
    color: var(--text-primary);
    background: transparent;
    border: none;
    padding: 0;
  }

  .header-actions .btn-outline {
    padding: 8px 12px;
    font-size: 13px;
  }

  .mobile-toggle {
    display: flex;
  }

}
</style>
