<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FloatingMenu from '@/components/layout/FloatingMenu.vue'
import LoginModal from '@/components/LoginModal.vue'

const route = useRoute()

// 需要隐藏 Header 和 Footer 的路由
const hideLayoutRoutes = ['terms', 'privacy', 'other']

// 根据当前路由判断是否显示 Header 和 Footer
const showLayout = computed(() => {
  return true;//!hideLayoutRoutes.includes(route.name as string)
})

const loginModalRef = ref<InstanceType<typeof LoginModal> | null>(null)
const headerRef = ref<InstanceType<typeof AppHeader> | null>(null)

function openLoginModal() {
  loginModalRef.value?.openModal()
}

function handleLoginSuccess() {
  // 登录成功后刷新 Header 的登录状态
  headerRef.value?.checkLoginState()
}

// 监听请求拦截器中触发的登录弹窗事件
function handleShowLoginModal() {
  openLoginModal()
}

// 监听套餐弹窗触发的登录弹窗事件
function handleOpenLoginModal() {
  openLoginModal()
}

onMounted(() => {
  window.addEventListener('show-login-modal', handleShowLoginModal)
  window.addEventListener('open-login-modal', handleOpenLoginModal)
})

onUnmounted(() => {
  window.removeEventListener('show-login-modal', handleShowLoginModal)
  window.removeEventListener('open-login-modal', handleOpenLoginModal)
})
</script>

<template>
  <div class="app" v-cloak>
    <AppHeader v-if="showLayout" ref="headerRef" @openLoginModal="openLoginModal" />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter v-if="showLayout" />
    <FloatingMenu />
    <LoginModal ref="loginModalRef" @loginSuccess="handleLoginSuccess" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

[v-cloak] {
  display: none;
}
</style>
