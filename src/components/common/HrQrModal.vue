<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from './AppModal.vue'
import api from '@/api';

const props = defineProps<{
  visible: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const qrcode = ref('')
const phone = ref('')
const loading = ref(true)

function handleVisibleChange(value: boolean) {
  emit('update:visible', value)
}
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

watch(() => props.visible, (val) => {
  if (val) {
    fetchRecommendSale()
  }
})
</script>

<template>
  <AppModal
    :visible="visible"
    @update:visible="handleVisibleChange"
    title=""
    width="300px"
  >
    <div class="hr-qr-modal-content">
      <div class="qr-container">
        <div class="qr-code">
          <img v-if="qrcode" :src="qrcode" alt="微信二维码" />
          <div v-else class="qr-placeholder">暂无二维码</div>
        </div>
        <p class="qr-tip">{{ title || '扫码添加微信' }}</p>
      </div>
      <div class="contact-info" v-if="phone">
        <p>或电话联系您的专属HR</p>
        <a :href="`tel:${phone}`" class="phone">{{ phone }}</a>
      </div>
    </div>
  </AppModal>
</template>


<style scoped>
.hr-qr-modal-content {
  text-align: center;
  padding: 10px 0;
}

.qr-container {
  margin-bottom: 24px;
}

.qr-code {
  width: 180px;
  height: 180px;
  margin: 0 auto 16px;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
  background: #f8fafc;
}

.qr-tip {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 8px;
}

.contact-info {
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.contact-info p {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.contact-info .phone {
  font-size: 20px;
  font-weight: 600;
  color: #6bb142;
  margin-bottom: 0;
}
</style>
