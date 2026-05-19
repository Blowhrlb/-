<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import api from '@/api'

const qrcode = ref('')

async function fetchQrcode() {
  try {
    const res = await api.getRecommendSale()
    qrcode.value = res.qrcode || ''
  } catch (error) {
    console.error('获取二维码失败:', error)
    qrcode.value = ''
  }
}

onMounted(() => {
  fetchQrcode()
})
</script>

<template>
  <footer class="footer">
    <!-- Background Effects -->
    <div class="bg-effects">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink to="/" class="logo">
            <img class="logo-icon" src="/src/assets/images/logo.png" />
            <span class="logo-text">春风求职</span>
          </RouterLink>
          <p>春风求职（BreezeUp Career）是一家以求职者成功为核心的职业成长咨询与陪跑机构。</p>
          <div class="footer-qrcode">
            <img v-if="qrcode" :src="qrcode" alt="微信公众号" />
            <span v-else>扫码咨询</span>
          </div>
        </div>

        <div class="footer-links">
          <h4>快速链接</h4>
          <ul>
            <li><RouterLink to="/">首页</RouterLink></li>
            <li><RouterLink to="/question-bank">求职题库</RouterLink></li>
            <li><RouterLink to="/personality-test">性格测试</RouterLink></li>
            <li><RouterLink to="/application-resources">网申资源</RouterLink></li>
          </ul>
        </div>

        <div class="footer-links">
          <h4>服务项目</h4>
          <ul>
            <li><RouterLink to="/company-check">企业背调</RouterLink></li>
            <li><RouterLink to="/candidate-assessment">候选人评估</RouterLink></li>
            <li><RouterLink to="/success-cases">成功案例</RouterLink></li>
            <li><RouterLink to="/news">就业资讯</RouterLink></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>联系我们</h4>
          <p>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            400-888-8888
          </p>
          <p>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            contact@blowhr.com
          </p>
          <p>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            北京市朝阳区建国路88号
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 春风求职 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #1a1a2e;
  color: white;
  padding: clamp(60px, 8vw, 90px) 0 0;
  position: relative;
  overflow: hidden;
}

.container {
  position: relative;
  z-index: 1;
}

/* Background Effects */
.bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #6bb142 0%, #8b5cf6 100%);
  top: -150px;
  right: -100px;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #8fca6f 0%, #6bb142 100%);
  bottom: -50px;
  left: -50px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-brand .logo-icon {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.footer-brand .logo-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.footer-brand p {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 20px;
}

.footer-qrcode {
  width: 100px;
  height: 100px;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}

.footer-qrcode img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.footer-qrcode span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links h4,
.footer-contact h4 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
}

.footer-links ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links li {
  margin-bottom: 0;
}

.footer-links a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-contact svg {
  width: 18px;
  height: 18px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.footer-bottom {
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 40px 0 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
