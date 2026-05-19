<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api'

const showBackToTop = ref(false)

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function openWechat() {
  alert('扫码添加微信客服')
}

function openWelfare() {
  alert('领取求职福利')
}


const qrcode = ref('')
const phone = ref('')
const loading = ref(true)
/**
 * 获取推荐销售信息
 */
async function fetchRecommendSale() {
  try {
    loading.value = true
    const res = await api.getRecommendSale()
    qrcode.value = res.qrcode || ''
    phone.value = res.phone || ''
  } catch (error) {
    console.error('获取推荐销售信息失败:', error)
    qrcode.value = ''
    phone.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  fetchRecommendSale();
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="floating-menu">
    <div class="floating-item" @click="openWechat" title="微信咨询">
      <svg viewBox="0 0 24 24" fill="currentColor" stroke-width="1.5">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.024-.12-.04-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.006-.033zm-2.634 2.588c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
      </svg>
      <div class="floating-tip">
        <img class="img" :src="qrcode" alt=""></img>
        <span class="tip">微信咨询</span>
      </div>
    </div>

    <div class="floating-item" @click="openWelfare" title="领取福利">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
      </svg>
      <div class="floating-tip">
        <img class="img" :src="qrcode" alt=""></img>
        <span class="tip">领取福利</span>
      </div>
    </div>

    <div class="floating-item" @click="scrollToTop" v-if="showBackToTop" title="回到顶部">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
      <span class="floating-tip">回到顶部</span>
    </div>
  </div>
</template>

<style scoped>
.floating-menu {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-primary);
}

.floating-item {
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  /* border-radius: 50%; */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.floating-item:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(37, 99, 235, 0.25);
}

.floating-item:hover svg {
  /* color: var(--primary-color); */
  /* color: #3461FF; */
}

.floating-item svg {
  width: 40px;
  height: 40px;
  /* color: var(--text-secondary); */
  color: var(--el-color-success);
  transition: color 0.2s ease;
}

.floating-tip {
  position: absolute;
  right: 75px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 14px;
  background: var(--text-primary);
  color: white;
  font-size: 13px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  text-align: center;
}

.floating-tip::before {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: var(--text-primary);
}

.floating-tip .img{
  width: 120px;
  height: 120px;
  opacity: 1;
  max-width: 120px;
}

.floating-item:hover .floating-tip {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 768px) {
  .floating-tip {
    right: 50px;
  }
  .floating-menu {
    right: 12px;
    bottom: 20px;
  }

  .floating-item {
    width: 42px;
    height: 42px;
  }

  .floating-item svg {
    width: 18px;
    height: 18px;
  }

  .floating-tip .img{
    width: 80px;
    height: 80px;
    opacity: 1;
    max-width: 80px;
  }
}
</style>
