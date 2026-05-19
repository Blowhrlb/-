<script setup lang="ts">
import api from '@/api'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { ElDialog } from 'element-plus'

const router = useRouter()

// 禁用自动继承非props属性，避免Teleport导致的警告
defineOptions({
  inheritAttrs: false
})

interface PaymentMethod {
  type: string
  name: string
  url?: string
  html?: string
}

const paymentMethods = ref([
  {type: 'alipay', name: '支付宝支付'},
  {type: 'wechat', name: '微信支付'},
  // {type: 'bank', name: '银行卡支付'}
]);

// 微信二维码相关
const showWechatQr = ref(false)
const wechatQrUrl = ref('')
const wechatOrderNo = ref('')
const wechatPollingTimer = ref<number | null>(null)

const props = defineProps<{
  show: boolean
  order: {
    id: number
    amount: number
    plan_name?: string
  } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'pay', url: string): void
}>()

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

// 跳转支付
async function goToPayment(method: string) {
  try {
    const res: any = await api.orderPayment(props.order?.id || 0, {method: method})
    console.log('支付信息返回:', method, res)

    const paymentData = res.payment_methods?.[0]
    if (!paymentData) {
      alert('获取支付信息失败')
      return
    }

    // 支付宝支付
    if (method === 'alipay') {
      // 如果有 HTML 内容（支付宝SDK v3.x返回的表单），直接渲染并提交
      if (paymentData.html) {
        const div = document.createElement('div')
        div.innerHTML = paymentData.html
        document.body.appendChild(div)
        const form = div.querySelector('form')
        if (form) {
          form.submit()
        }
      }
    }

    // 微信支付 - 生成二维码并在Dialog中显示
    if (method === 'wechat') {
      if (paymentData.url) {
        // 生成二维码
        wechatQrUrl.value = await QRCode.toDataURL(paymentData.url, {
          width: 200,
          margin: 2
        })
        wechatOrderNo.value = paymentData.out_trade_no || ''

        // 显示微信支付Dialog（不需要关闭当前弹窗，Dialog会显示在顶层）
        showWechatQr.value = true

        // 启动自动轮询检测支付状态
        startWechatPolling()
      } else {
        alert('支付链接不可用，请稍后重试')
      }
    }

    // 银行卡支付
    if (method === 'bank') {
      if (paymentData.url) {
        window.location.href = paymentData.url
      }
    }
  } catch (error) {
    console.error('获取支付链接失败:', error)
    alert('获取支付链接失败，请稍后重试')
  }

}

function closeModal() {
  emit('close')
  stopWechatPolling()
}

// 启动微信支付状态轮询
function startWechatPolling() {
  stopWechatPolling()
  wechatPollingTimer.value = window.setInterval(async () => {
    if (!wechatOrderNo.value) {
      stopWechatPolling()
      return
    }

    try {
      const res: any = await api.queryOrder(wechatOrderNo.value)
      if (res.trade_state === 'SUCCESS') {
        // 支付成功，停止轮询并跳转
        stopWechatPolling()
        showWechatQr.value = false
        closeModal()
        router.push({
          path: '/payment-success',
          query: { pay: 'success', out_trade_no: wechatOrderNo.value }
        })
      }
    } catch (error) {
      console.error('轮询查询订单状态失败:', error)
    }
  }, 2000)
}

// 停止微信支付状态轮询
function stopWechatPolling() {
  if (wechatPollingTimer.value) {
    clearInterval(wechatPollingTimer.value)
    wechatPollingTimer.value = null
  }
}

// 检查支付状态并跳转
async function checkPaymentStatus() {
  if (!wechatOrderNo.value) {
    alert('订单号不存在')
    return
  }

  try {
    // 查询订单状态
    const res: any = await api.queryOrder(wechatOrderNo.value)
    if (res.trade_state === 'SUCCESS') {
      // 支付成功，跳转到成功页面
      stopWechatPolling()
      showWechatQr.value = false
      closeModal()
      router.push({
        path: '/payment-success',
        query: { pay: 'success', out_trade_no: wechatOrderNo.value }
      })
    } else {
      alert('支付未完成，请继续支付')
    }
  } catch (error) {
    console.error('查询订单状态失败:', error)
    alert('查询失败，请稍后重试')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="payment-modal-overlay" @click.self="closeModal">
      <div class="payment-modal">
        <div class="modal-header">
          <h3>选择支付方式</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="payment-methods">
            <div class="payment-amount-display">
              <span class="label">支付金额</span>
              <span class="amount">¥{{ order?.amount ? formatAmount(order.amount) : '0.00' }}</span>
            </div>
            <div class="payment-options">
              <button
                v-for="method in paymentMethods"
                :key="method.type"
                class="payment-option"
                :class="method.type"
                @click="goToPayment(method.type)"
              >

                <div v-if="method.type === 'alipay'">
                  <img style="width: 28px;height: 28px;" src="../../assets/images/zf/zfb_icon.png" alt="">
                </div>
                <div v-if="method.type === 'wechat'">
                  <img style="width: 28px;height: 28px;" src="../../assets/images/zf/wx_icon.png" alt="">
                </div>

                <!-- 支付宝图标 -->
                <!-- <svg v-if="method.type === 'alipay'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg> -->
                <!-- 微信支付图标 -->
                <!-- <svg v-else-if="method.type === 'wechat'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.024-.12-.04-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.006-.033z"/>
                </svg> -->
                <!-- 银行卡图标 -->
                <!-- <svg v-else-if="method.type === 'bank'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg> -->
                <!-- 默认图标 -->
                <!-- <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg> -->
                <span>{{ method.name }}</span>
              </button>
            </div>
          </div>

          <!-- 微信支付二维码 - 使用Element Plus Dialog -->
          <ElDialog
            v-model="showWechatQr"
            title="微信支付"
            width="320px"
            :close-on-click-modal="false"
            :show-close="true"
          >
            <div class="wechat-qr-container">
              <div class="wechat-qr-title">请使用微信扫码支付</div>
              <img v-if="wechatQrUrl" :src="wechatQrUrl" alt="微信支付二维码" class="wechat-qr">
              <div v-if="wechatOrderNo" class="wechat-order-no">订单号: {{ wechatOrderNo }}</div>
              <div class="wechat-tip">支付完成后请点击下方按钮查看结果</div>
              <button class="btn-check-status" @click="checkPaymentStatus">我已支付完成</button>
            </div>
          </ElDialog>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #6bb142;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.payment-amount-display {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 20px;
}

.payment-amount-display .label {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.payment-amount-display .amount {
  font-size: 32px;
  font-weight: 700;
  color: #6bb142;
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
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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

/* 微信二维码样式 */
.wechat-qr-container {
  text-align: center;
  padding: 20px;
}

.wechat-qr-title {
  font-size: 16px;
  color: #07c160;
  margin-bottom: 16px;
  font-weight: 500;
}

.wechat-qr {
  width: 200px;
  height: 200px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin: auto;
}

.wechat-order-no {
  font-size: 12px;
  color: #999;
  margin-top: 12px;
}

.wechat-tip {
  font-size: 14px;
  color: #666;
  margin-top: 16px;
}

.btn-check-status{
  color: #07c160;
}

.btn-back {
  margin-top: 16px;
  padding: 8px 20px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: #e5e5e5;
}
</style>
