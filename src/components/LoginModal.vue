<script setup lang="ts">
import { ref, reactive, watch, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useUserStore } from '@/store'

// 引入微信 JS SDK
const wxScript = document.createElement('script')
wxScript.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
document.head.appendChild(wxScript)

// Props
const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'loginSuccess', phone: string): void
}>()

// 弹窗显示状态 (使用本地ref，初始值从props获取)
const isModalOpen = ref(props.modelValue)

// 监听props变化
watch(() => props.modelValue, (val) => {
  isModalOpen.value = val
  if (val) {
    // 如果是微信登录模式且已同意协议，立即刷新二维码
    if (authMode.value === 'wechat' && agreedToTerms.value) {
      getWechatQrcode()
    }
  }
})

// 登录模式: 'phone' | 'wechat'
const authMode = ref<'phone' | 'wechat'>('phone')

// 手机号登录/注册标签
const phoneTab = ref<'login' | 'register'>('login')

// 表单数据
const loginForm = reactive({
  phone: '',
  code: ''
})

const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  password2: ''
})

// 验证码按钮状态
const getCodeBtnState = reactive({
  loading: false,
  text: '获取验证码',
  disabled: false,
  countdown: 0
})

const getRegisterCodeBtnState = reactive({
  loading: false,
  text: '获取验证码',
  disabled: false,
  countdown: 0
})

// 微信扫码登录相关状态
const wechatState = ref('')
const wechatScanStatus = ref<'waiting' | 'scanned' | 'authorized'>('waiting')
const wechatPollingTimer = ref<number | null>(null)
const wechatQrRefreshTimer = ref<number | null>(null)

// 协议勾选
const agreedToTerms = ref(true)

// 微信扫码登录 - 获取二维码
const qrcodeContainerRef = ref<HTMLElement | null>(null)

// 监听协议勾选，从不同意变为同意时刷新二维码
watch(agreedToTerms, (newVal, oldVal) => {
  if (newVal && !oldVal && authMode.value === 'wechat') {
    getWechatQrcode()
  }
})

async function getWechatQrcode() {
  try {
    const res: any = await api.getWechatQrcode()
    if (res && res.state) {
      wechatState.value = res.state
      wechatScanStatus.value = 'waiting'

      // 等待 WxLogin 脚本加载完成后创建二维码
      const checkWxLogin = setInterval(() => {
        if ((window as any).WxLogin) {
          clearInterval(checkWxLogin)
          // 清空容器
          if (qrcodeContainerRef.value) {
            qrcodeContainerRef.value.innerHTML = ''
            // 创建二维码
            const style = `
              .impowerBox .title { display:none }
              .impowerBox .info { color: #666 }
              .impowerBox .qrcode { width: 200px !important;  border: 0 }
              .impowerBox .status { display:none !important }
            `
            new (window as any).WxLogin({
              self_redirect: true, // 关键：回调在当前iframe内完成，不跳转主页面
              id: 'wechat-qrcode-container',
              outerHeight: '100',
              appid: res.appid,
              scope: 'snsapi_login',
              redirect_uri: res.redirect_uri,
              state: res.state,
              style: 'black',
              href: `data:text/css;base64,${btoa(style)}`
            });

            const wxIframe = < HTMLIFrameElement > document.querySelector('#wechat-qrcode-container iframe');
            if (wxIframe) {
              // 2. 设置 iframe 高度（核心）
              wxIframe.style.height = '250px'; // 改为你想要的高度（如 220px/280px）
              // 3. 配套设置（避免滚动条/变形）
              wxIframe.style.width = '300px';
              wxIframe.style.border = 'none';
              wxIframe.scrolling = 'no'; // 禁止滚动
            }
          }
          // 开始轮询检查扫码状态
          startWechatPolling()
          // 每60秒刷新一次二维码
          startQrRefreshTimer()
        }
      }, 100)
    }
  } catch (error) {
    console.error('获取微信二维码失败:', error)
  }
}

// 启动二维码刷新定时器
function startQrRefreshTimer() {
  stopQrRefreshTimer()
  wechatQrRefreshTimer.value = window.setInterval(() => {
    if (authMode.value === 'wechat' && wechatScanStatus.value === 'waiting') {
      getWechatQrcode()
    }
  }, 60000)
}

// 停止二维码刷新定时器
function stopQrRefreshTimer() {
  if (wechatQrRefreshTimer.value) {
    clearInterval(wechatQrRefreshTimer.value)
    wechatQrRefreshTimer.value = null
  }
}

// 启动轮询
function startWechatPolling() {
  stopWechatPolling()
  wechatPollingTimer.value = window.setInterval(() => {
    checkWechatScanStatus()
  }, 2000)
}

// 停止轮询
function stopWechatPolling() {
  if (wechatPollingTimer.value) {
    clearInterval(wechatPollingTimer.value)
    wechatPollingTimer.value = null
  }
  // 同时停止二维码刷新定时器
  stopQrRefreshTimer()
}

const userStore = useUserStore();
const userPhone = ref('');
// 检查微信扫码状态
async function checkWechatScanStatus() {
  if (!wechatState.value) return

  try {
    const res: any = await api.checkWechatScan({ state: wechatState.value })
    // console.log('checkWechatScan response:', res)
    if (res) {
      const userInfo = res.user_info || {}
      // console.log('userInfo:', userInfo, 'status:', res.status)

      // 如果有用户信息且包含手机号和token，说明已绑定，直接登录
      if (userInfo && userInfo.user?.phone && userInfo.token) {
        // console.log('Setting token:', userInfo.token)
        wechatScanStatus.value = 'scanned'
        userPhone.value = userInfo.user.phone
        userStore.setToken(userInfo.token)
        userStore.setUser(userInfo.user)
        // console.log('Token set, userStore.token:', userStore.token)

        emit('loginSuccess', userInfo.user.phone || '')
        stopWechatPolling()
        setTimeout(() => {
          closeModal()
        }, 500)
        return
      }

      // 只有当status为scanned且没有绑定手机号时，才显示绑定界面
      // status为waiting时表示还未扫码，不需要处理
      if (res.status === 'scanned') {
        wechatScanStatus.value = 'scanned'
        stopWechatPolling()
      }
    }
  } catch (error) {
    console.error('检查扫码状态失败:', error)
  }
}

// 微信手机号授权登录
async function handleWechatPhoneLogin() {
  // 验证协议勾选
  if (!agreedToTerms.value) {
    return
  }

  if (!loginForm.phone) {
    loginText.value.errorPhone = '请输入手机号'
    return
  }

  if (!validatePhone(loginForm.phone)) {
    loginText.value.errorPhone = '请输入正确的手机号'
    return
  }

  if (!loginForm.code || loginForm.code.length !== 6) {
    loginText.value.errorCode = '请输入6位验证码'
    return
  }

  try {
    const res: any = await api.wechatPhoneLogin({
      phone: loginForm.phone,
      code: loginForm.code,
      state: wechatState.value
    })
    if (res && res.token) {
      // console.log('微信手机号登录成功', res)
      const userStore = useUserStore()
      userStore.setToken(res.token)
      userStore.setUser(res.user)

      setTimeout(() => {
          closeModal()
          emit('loginSuccess', res.user.phone || '')
        }, 2000)
    }else{
      // ElMessage.error('登录失败，请重试')
      loginText.value.errorCode = res || '登录失败，请重试';
    }
  } catch (error: any) {
    console.error('微信手机号登录失败:', error)
    loginText.value.errorCode = error;
  }
}

// 组件卸载时停止轮询
onUnmounted(() => {
  stopWechatPolling()
})

// 关闭弹窗
function closeModal() {
  isModalOpen.value = false
  emit('update:modelValue', false)
  resetForms()
  stopWechatPolling()
}

// 重置表单
function resetForms() {
  loginText.value.errorCode = ''
  loginText.value.errorPhone = ''

  loginForm.phone = ''
  loginForm.code = ''
  registerForm.phone = ''
  registerForm.code = ''
  registerForm.password = ''
  registerForm.password2 = ''
  phoneTab.value = 'login'

  // 重置登录模式为手机号
  authMode.value = 'phone'

  // 重置微信扫码状态
  wechatState.value = ''
  wechatScanStatus.value = 'waiting'

  // 重置协议复选框
  agreedToTerms.value = true
}

// 切换手机号登录/注册标签
function switchPhoneTab(tab: 'login' | 'register') {
  phoneTab.value = tab
}

// 切换登录方式
function toggleAuthMode() {
  authMode.value = authMode.value === 'phone' ? 'wechat' : 'phone'
  if (authMode.value === 'wechat') {
    // 切换到微信登录时获取二维码
    getWechatQrcode()
  } else {
    // 切换到手机号登录时停止轮询
    stopWechatPolling()
  }
}

// 手机号验证
function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 发送验证码
async function sendCode(phone: string, btnState: typeof getCodeBtnState) {
  // 检查是否正在发送中
  if (btnState.loading) {
    return false
  }
  // 检查是否在倒计时中
  if (btnState.disabled) {
    return false
  }

  if (!validatePhone(phone)) {
    loginText.value.errorPhone = '请输入正确的手机号'
    return false
  }

  btnState.loading = true
  btnState.text = '发送中...'

  try {
    //发送短信接口
    const res: any = await api.sendSmsCode({phone, type: 'login'})
    console.log('发送验证码', res)

    // 检查返回结果是否成功（后端成功时返回data，即验证码）
    if (!res || !res.code) {
      btnState.loading = false
      btnState.text = '获取验证码'
      ElMessage.error('发送失败，请重试')
      return false
    }

    btnState.loading = false
    btnState.disabled = true
    btnState.countdown = 60

    const timer = setInterval(() => {
      btnState.countdown--
      btnState.text = `${btnState.countdown}秒后重发`
      if (btnState.countdown <= 0) {
        clearInterval(timer)
        btnState.disabled = false
        btnState.text = '获取验证码'
      }
    }, 1000)

    return true
  } catch (error) {
    // 发送失败，重置按钮状态
    btnState.loading = false
    btnState.text = '获取验证码'
    ElMessage.error('发送失败，请重试')
    return false
  }
}

function handleGetCode() {
  sendCode(loginForm.phone, getCodeBtnState)
}

function handleGetRegisterCode() {
  sendCode(registerForm.phone, getRegisterCodeBtnState)
}
//提示文字
const loginText = ref({
  'errorPhone': '',
  'errorCode': '',
});
/**
 * 清除错误提示
 * @param field 
 */
function clearError(field: string) {
  if (field === 'errorPhone') {
    loginText.value.errorPhone = ''
  }else{
    loginText.value.errorCode = ''
  }

}

// 查看协议 - 跳转到协议页面
const router = useRouter()

function viewAgreement(type: 'terms' | 'privacy') {
  //关闭登录页面
  closeModal();
  let toUrl = type === 'terms' ? '/terms' : '/privacy';
  // 跳转到协议页面,新打开浏览器标签
  window.open(toUrl, '_blank');
}


// 处理登录
async function handleLogin() {
  // 验证协议勾选
  if (!agreedToTerms.value) {
    return
  }

  if (!validatePhone(loginForm.phone)) {
    loginText.value.errorPhone = '请输入正确的手机号'
    return
  }

  if (!loginForm.code || loginForm.code.length !== 6) {
    loginText.value.errorCode = '请输入6位验证码'
    return
  }

  // 调用登录接口
  const params = {
    phone: loginForm.phone,
    code: loginForm.code
  }
  const res: any = await api.loginByCode(params)
  if (typeof res === 'object') {
    if (res.token) {
      userStore.setToken(res.token)
      userStore.setUser(res.user);
      setTimeout(() => {
        closeModal();
        emit('loginSuccess', loginForm.phone)
      }, 1000);
    }else{
      console.log('登录失败', res)
    }
  }else{
    loginText.value.errorCode = res
  }

}


// 处理注册
function handleRegister() {
  if (!validatePhone(registerForm.phone)) {
    alert('请输入正确的手机号')
    return
  }

  if (!registerForm.code || registerForm.code.length !== 6) {
    alert('请输入6位验证码')
    return
  }

  if (!registerForm.password || registerForm.password.length < 6 || registerForm.password.length > 20) {
    alert('请设置6-20位密码')
    return
  }

  if (registerForm.password !== registerForm.password2) {
    alert('两次密码不一致')
    return
  }

  // 注册成功
  closeModal()
  alert('注册成功，已自动登录')
}

// 格式化手机号
function formatPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7, 11)
}

// 暴露打开弹窗的方法
function openModal() {
  isModalOpen.value = true
  emit('update:modelValue', true)
}

defineExpose({ openModal })
</script>

<template>
  <Teleport to="body">
    <!-- 登录弹窗 -->
    <div v-if="isModalOpen" class="modal-overlay active">
      <div class="modal" style="width: 350px;" @click.stop>
        <div class="modal-header">
          <span class="auth-mode-icon" @click="toggleAuthMode" title="切换登录方式">
            <svg v-if="authMode === 'phone'" class="qr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <!-- 微信二维码登录 -->
          <div v-if="authMode === 'wechat'" class="auth-content">
            <!-- 等待扫码状态 -->
            <div v-if="wechatScanStatus === 'waiting'" class="qrcode-container">
              <!-- 没有同意协议 -->
              <template v-if="agreedToTerms">
                <div v-if="!wechatState" class="qrcode-loading">加载中...</div>
                <div v-else id="wechat-qrcode-container" ref="qrcodeContainerRef" class="qrcode-box"></div>
              </template>
              <template v-else>
                <div class="qrcode-loading">
                  <p class="agreement-reminder">请阅读并同意协议</p>
                </div>
              </template>

              <!-- 协议复选框 -->
              <div class="agreement-checkboxes">
                <label class="agreement-checkbox">
                  <input type="checkbox" v-model="agreedToTerms" checked>
                  <span>我已阅读并同意</span>
                  <a href="javascript:;" @click.stop="viewAgreement('terms')">《用户服务协议》</a>
                  <a href="javascript:;" @click.stop="viewAgreement('privacy')">《隐私协议》</a>
                </label>
              </div>
              <p>请用微信扫码登录</p>
            </div>

            <!-- 已扫码，等待手机号授权 -->
            <div v-else-if="wechatScanStatus === 'scanned' && !userPhone" class="qrcode-container">
              <div class="scanned-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:48px;height:48px;color:#10b981;">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>已扫码，请输入手机号绑定登录</p>
              </div>
              <div class="form-group">
                <label class="form-label">手机号</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="请输入手机号"
                  v-model="loginForm.phone"
                  @input="clearError('errorPhone')"
                >
              </div>
              <div v-if="loginText.errorPhone" class="form-error-text">{{ loginText.errorPhone }}</div>
              <div class="form-group">
                <label class="form-label">验证码</label>
                <div class="code-input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="请输入验证码"
                    v-model="loginForm.code"
                    @input="clearError('errorCode')"
                  >
                  <button
                    class="btn btn-secondary get-code-btn"
                    :disabled="getCodeBtnState.disabled"
                    @click="handleGetCode"
                  >{{ getCodeBtnState.text }}</button>
                </div>
              </div>
              <div v-if="loginText.errorCode" class="form-error-text">{{ loginText.errorCode }}</div>
              <button class="btn btn-primary btn-block" @click="handleWechatPhoneLogin">登录</button>
            </div>
          </div>

          <!-- 手机号登录 -->
          <div v-else class="auth-content">
            <!-- <div class="auth-tabs">
              <button
                class="auth-tab"
                :class="{ active: phoneTab === 'login' }"
                @click="switchPhoneTab('login')"
              >登录</button>
              <button
                class="auth-tab"
                :class="{ active: phoneTab === 'register' }"
                @click="switchPhoneTab('register')"
              >注册</button>
            </div> -->

            <!-- 登录表单 -->
            <div v-show="phoneTab === 'login'" id="phoneLoginForm">
              <div class="form-group">
                <label class="form-label">手机号</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="请输入手机号"
                  v-model="loginForm.phone"
                  @input="clearError('errorPhone')"
                >
              </div>
              <div v-if="loginText.errorPhone" class="form-error-text">{{ loginText.errorPhone }}</div>

              <div class="form-group">
                <label class="form-label">验证码</label>
                <div class="code-input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="请输入验证码"
                    v-model="loginForm.code"
                    @input="clearError('errorCode')"
                  >
                  <button
                    class="btn btn-secondary get-code-btn"
                    :disabled="getCodeBtnState.disabled"
                    @click="handleGetCode"
                  >{{ getCodeBtnState.text }}</button>
                </div>
                <div v-if="loginText.errorCode" class="form-error-text">{{ loginText.errorCode }}</div>
              </div>
              <!-- 协议复选框 -->
              <div class="agreement-checkboxes">
                <label class="agreement-checkbox">
                  <input type="checkbox" v-model="agreedToTerms" checked>
                  <span>我已阅读并同意</span>
                  <a href="javascript:;" @click.stop="viewAgreement('terms')">《用户服务协议》</a>
                  <a href="javascript:;" @click.stop="viewAgreement('privacy')">《隐私协议》</a>
                </label>
                <p v-if="!agreedToTerms" class="agreement-reminder">请阅读并同意上述协议</p>
              </div>
              <button class="btn btn-primary btn-block" @click="handleLogin">登录</button>
            </div>

            <!-- 注册表单 -->
            <!-- <div v-show="phoneTab === 'register'" id="phoneRegisterForm">
              <div class="form-group">
                <label class="form-label">手机号</label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="请输入手机号"
                  v-model="registerForm.phone"
                >
              </div>
              <div class="form-group">
                <label class="form-label">验证码</label>
                <div class="code-input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="请输入验证码"
                    v-model="registerForm.code"
                  >
                  <button
                    class="btn btn-secondary get-code-btn"
                    :disabled="getRegisterCodeBtnState.disabled"
                    @click="handleGetRegisterCode"
                  >{{ getRegisterCodeBtnState.text }}</button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">设置密码</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="请设置6-20位密码"
                  v-model="registerForm.password"
                >
              </div>
              <div class="form-group">
                <label class="form-label">确认密码</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="请再次输入密码"
                  v-model="registerForm.password2"
                >
              </div>
              <button class="btn btn-primary btn-block" @click="handleRegister">注册</button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
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
  width: 100%;
  max-width: 350px;
  transform: scale(0.95) translateY(20px);
  transition: all 0.3s ease;
}

.modal-overlay.active .modal {
  transform: scale(1) translateY(0);
}

.modal-header {
  padding: 20px 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.auth-mode-icon {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.auth-mode-icon:hover {
  background: #f1f5f9;
}

.auth-mode-icon svg {
  width: 24px;
  height: 24px;
  color: #6bb142;
}

.modal-close {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
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
  padding: 0 28px 28px;
}

/* Auth content */
.auth-content {
  text-align: center;
}

.qrcode-container {
  padding: 20px 0;
}

.qrcode-container p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.qrcode-box {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

#wechat-qrcode-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  /* transform: scale(0.82); */
}

.qrcode-loading {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.scanned-success {
  padding: 20px 0;
  text-align: center;
}

.scanned-success p {
  margin-top: 12px;
  color: #10b981;
  font-weight: 500;
}

/* Auth tabs */
.auth-tabs {
  display: flex;
  gap: 8px;
  margin: 24px auto;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
}

.auth-tab {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-tab.active {
  background: #fff;
  color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Form styles */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
  text-align: left;
  margin-top: 15px;
}

.form-error-text {
  color: #ef4444;
  font-size: 12px;
  margin-left: 8px;
  text-align: left;
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

.code-input-group {
  display: flex;
  gap: 10px;
}

.code-input-group .form-control {
  flex: 1;
}

.get-code-btn {
  padding: 10px 16px;
  font-size: 13px;
  white-space: nowrap;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.get-code-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.get-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: #6bb142;
  color: white;
}

.btn-primary:hover {
  background: #568e34;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-block {
  width: 100%;
}

@media (max-width: 480px) {
  .modal {
    max-width: calc(100vw - 32px);
  }

  .modal-header,
  .modal-body {
    padding-left: 20px;
    padding-right: 20px;
  }
}

/* 协议复选框 */
.agreement-checkboxes {
  text-align: left;
  margin-bottom: 16px;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  margin-bottom: 8px;
}

.agreement-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #6bb142;
  cursor: pointer;
}

.agreement-checkbox a {
  color: #6bb142;
  text-decoration: none;
}

.agreement-checkbox a:hover {
  text-decoration: underline;
}

.agreement-reminder {
  color: #ef4444 !important;
  font-size: 12px !important;
  margin: 8px 0 0 0 !important;
  text-align: left !important;
  text-align: left;
}

</style>
