<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/api'
import { useUserStore } from '@/store'

// Props
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: { formData: PlanFormData; orderId: number; amount: string | number }): void
}>()

// Modal state
const activeModal = ref<'plan' | null>(null)

// Form data
const formData = reactive<PlanFormData>({
  name: '',
  idCard: '',
  phone: '',
  school: '',
  major: '',
  education: '',
  position: '',
  salary: '',
  city: '',
  currentCity: '',
  experience: '',
  interviewCity: ''
})

// Plan info
const currentPlan = ref<{ title: string; price: string; id: number }>({ title: '', price: '', id: 0 })

// Open/close methods
function openPlanModal(planTitle: string, price: string, planId:number = 0) {
  //检查是否登录，未登录则弹出登录框
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    activeModal.value = null
    emit('update:modelValue', false)

    openLoginModal();
    return;
  }
  currentPlan.value = { title: planTitle, price, id: planId }
  activeModal.value = 'plan'
  emit('update:modelValue', true)
}

function closeAllModals() {
  activeModal.value = null
  emit('update:modelValue', false)
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.idCard = ''
  formData.phone = ''
  formData.school = ''
  formData.major = ''
  formData.education = ''
  formData.position = ''
  formData.salary = ''
  formData.city = ''
  formData.currentCity = ''
  formData.experience = ''
  formData.interviewCity = ''
  // Clear all errors
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Form errors
const errors = reactive<Record<string, string>>({})

// Clear error when user starts typing
function clearError(field: string) {
  if (errors[field]) {
    errors[field] = ''
  }
}

function validateForm(): boolean {
  const newErrors: Record<string, string> = {}

  if (!formData.name) {
    newErrors.name = '请输入姓名'
  }
  if (!formData.idCard) {
    newErrors.idCard = '请输入身份证号'
  }
  if (!formData.phone) {
    newErrors.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    newErrors.phone = '请输入正确的手机号码'
  }
  if (!formData.school) {
    newErrors.school = '请输入毕业院校'
  }
  if (!formData.major) {
    newErrors.major = '请输入专业'
  }
  if (!formData.education) {
    newErrors.education = '请选择学历'
  }
  if (!formData.salary) {
    newErrors.salary = '请输入期望薪资'
  }
  if (!formData.currentCity) {
    newErrors.currentCity = '请输入目前所在城市'
  }
  if (!formData.experience) {
    newErrors.experience = '请选择是否有工作经验'
  }

  // Update errors
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}
/**
 * 提交表单
 */
async function submitPlanForm() {
  if (!validateForm()) return
  try {
    // 调用接口创建申请订单
    const data = {
      plan_id: currentPlan.value.id,
      plan_name: currentPlan.value.title,
      plan_price: currentPlan.value.price,
      name: formData.name,
      id_card: formData.idCard,
      phone: formData.phone,
      school: formData.school,
      major: formData.major,
      education: formData.education,
      position: formData.position,
      salary: formData.salary,
      city: formData.city,
      current_city: formData.currentCity,
      experience: formData.experience,
      interview_city: formData.interviewCity
    }
    const res: any = await api.applicationCreate(data)
    if (res) {
      // 创建成功，发送提交事件（包含订单ID）
      emit('submit', {
        formData,
        orderId: res.application_id || res.id || 0,
        amount: res.amount || currentPlan.value.price
      })
      closeAllModals()
    }
  } catch (error) {
    console.error('创建申请失败:', error)
    alert('提交失败，请稍后重试')
  }
}

//登录弹窗
function openLoginModal() {
  window.dispatchEvent(new CustomEvent('open-login-modal'))
}
// Expose openPlanModal to parent
defineExpose({ openPlanModal })
</script>

<template>
  <Teleport to="body" v-if="modelValue">
    <!-- 套餐详情弹窗 -->
    <div v-if="activeModal === 'plan'" class="modal-overlay active">
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h3>{{ currentPlan.title }} - 套餐申请</h3>
          <button class="modal-close" @click="closeAllModals">&times;</button>
        </div>
        <div class="modal-body">
          <div class="plan-detail-form">
            <p class="form-intro">为了更好地帮您匹配岗位进行求职，请您动动手指填写你的个性化求职信息：</p>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  姓名 <span class="required">*</span>
                  <span v-if="errors.name" class="form-error-inline">{{ errors.name }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.name" placeholder="请输入姓名" @input="clearError('name')">
              </div>
              <div class="form-group">
                <label class="form-label">
                  身份证号 <span class="required">*</span>
                  <span v-if="errors.idCard" class="form-error-inline">{{ errors.idCard }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.idCard" placeholder="请输入身份证号" @input="clearError('idCard')">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  手机号 <span class="required">*</span>
                  <span v-if="errors.phone" class="form-error-inline">{{ errors.phone }}</span>
                </label>
                <input type="tel" class="form-control" v-model="formData.phone" placeholder="请输入手机号" @input="clearError('phone')">
              </div>
              <div class="form-group">
                <label class="form-label">
                  毕业院校 <span class="required">*</span>
                  <span v-if="errors.school" class="form-error-inline">{{ errors.school }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.school" placeholder="请输入毕业院校" @input="clearError('school')">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  专业 <span class="required">*</span>
                  <span v-if="errors.major" class="form-error-inline">{{ errors.major }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.major" placeholder="请输入专业" @input="clearError('major')">
              </div>
              <div class="form-group">
                <label class="form-label">
                  学历 <span class="required">*</span>
                  <span v-if="errors.education" class="form-error-inline">{{ errors.education }}</span>
                </label>
                <select class="form-control" v-model="formData.education" @change="clearError('education')">
                  <option value="">请选择学历</option>
                  <option value="大专">大专</option>
                  <option value="本科">本科</option>
                  <option value="硕士">硕士</option>
                  <option value="博士">博士</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">期望岗位 (可选1-2个)</label>
                <input type="text" class="form-control" v-model="formData.position" placeholder="请输入期望岗位">
              </div>
              <div class="form-group">
                <label class="form-label">
                  期望薪资 <span class="required">*</span>
                  <span v-if="errors.salary" class="form-error-inline">{{ errors.salary }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.salary" placeholder="如：15K-20K" @input="clearError('salary')">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">就业城市 (可选1-3个)</label>
                <input type="text" class="form-control" v-model="formData.city" placeholder="请输入就业城市">
              </div>
              <div class="form-group">
                <label class="form-label">
                  目前所在城市 <span class="required">*</span>
                  <span v-if="errors.currentCity" class="form-error-inline">{{ errors.currentCity }}</span>
                </label>
                <input type="text" class="form-control" v-model="formData.currentCity" placeholder="请输入目前所在城市" @input="clearError('currentCity')">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  是否有工作经验 <span class="required">*</span>
                  <span v-if="errors.experience" class="form-error-inline">{{ errors.experience }}</span>
                </label>
                <select class="form-control" v-model="formData.experience" @change="clearError('experience')">
                  <option value="">请选择</option>
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">可参加线下面试的城市</label>
                <input type="text" class="form-control" v-model="formData.interviewCity" placeholder="请输入城市">
              </div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" @click="submitPlanForm">填写完毕，立即支付</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export interface PlanFormData {
  name: string
  idCard: string
  phone: string
  school: string
  major: string
  education: string
  position: string
  salary: string
  city: string
  currentCity: string
  experience: string
  interviewCity: string
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  max-width: min(90vw, 560px);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95) translateY(20px);
  transition: all 0.3s ease;
}

.modal-overlay.active .modal {
  transform: scale(1) translateY(0);
  margin: auto 20px;
}

.modal-header {
  padding: 20px 28px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #64748b;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 24px 28px;
}

/* Form styles */
.form-intro {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-label .required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #6bb142;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-control::placeholder {
  color: #94a3b8;
}

select.form-control {
  cursor: pointer;
}

.form-error-inline {
  color: #ef4444;
  font-size: 12px;
  margin-left: 8px;
}

/* Payment styles */
.payment-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 16px;
  color: #64748b;
}

.payment-amount .amount {
  font-size: 32px;
  font-weight: 700;
  color: #f59e0b;
}

.payment-methods {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.payment-method {
  flex: 1;
  cursor: pointer;
}

.payment-method input {
  display: none;
}

.method-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.method-content svg {
  width: 28px;
  height: 28px;
  color: #64748b;
}

.method-content span {
  font-size: 14px;
  color: #64748b;
}

.payment-method input:checked + .method-content {
  border-color: #6bb142;
  background: rgba(37, 99, 235, 0.05);
}

.payment-method input:checked + .method-content svg {
  color: #6bb142;
}

.payment-method input:checked + .method-content span {
  color: #6bb142;
}

.payment-tip {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin-top: 16px;
  margin-bottom: 0;
}

/* Payment result */
.payment-result {
  text-align: center;
  padding: 20px 0;
}

.payment-result.success .result-icon {
  color: #10b981;
}

.result-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #ef4444;
}

.result-icon svg {
  width: 100%;
  height: 100%;
}

.payment-result p {
  font-size: 16px;
  color: #0f172a;
  margin: 0;
}

/* QR code */
.qrcode-container {
  text-align: center;
  padding: 20px 0;
}

.qrcode-container .qrcode {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 12px;
}

.qrcode-container p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .payment-methods {
    flex-direction: column;
    gap: 12px;
  }

  /* 隐藏移动端滚动条 */
  .modal {
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* 隐藏滚动条 */
  .modal::-webkit-scrollbar {
    display: none;
  }

  .modal {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
}
</style>
