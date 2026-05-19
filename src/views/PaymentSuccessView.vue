<template>
  <div class="payment-success-page">
    <section class="success-section">
      <div class="container">
        <div class="success-card">
          <!-- 成功图标 -->
          <div v-if="isSuccess" class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <!-- 失败图标 -->
          <div v-else class="success-icon error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <h2>{{ isSuccess ? '支付成功' : '支付失败' }}</h2>
          <p class="success-message">
            {{ isSuccess ? '感谢您的购买！我们已收到您的付款。' : '支付失败。' }}
            <span class="contact-link" @click="showHrQrModal = true">请联系我们</span>
          </p>

          <div class="action-buttons">
            <button class="btn btn-primary" @click="goToOrders">查看订单</button>
            <button class="btn btn-outline" @click="goToHome">返回首页</button>
          </div>
        </div>
      </div>
    </section>

    <!-- HR二维码弹窗 -->
    <HrQrModal :visible="showHrQrModal" @update:visible="showHrQrModal = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HrQrModal from '@/components/common/HrQrModal.vue'

const router = useRouter()
const route = useRoute()

const showHrQrModal = ref(false)

// 判断是否支付成功
const isSuccess = computed(() => {
  const pay = route.query.pay as string
  return pay === 'success'
})

function goToOrders() {
  router.push('/orders')
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
@import "@/assets/styles/PaymentSuccess.css";

.contact-link {
  color: #10b981;
  cursor: pointer;
  text-decoration: underline;
}

.contact-link:hover {
  color: #059669;
}
</style>
