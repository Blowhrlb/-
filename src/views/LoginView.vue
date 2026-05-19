<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">吹</span>
          <span class="logo-text">春风求职</span>
        </RouterLink>
      </div>

      <div class="login-card">
        <div class="tab-switch">
          <button
            class="tab-btn"
            :class="{ active: currentTab === 'login' }"
            @click="currentTab = 'login'"
          >
            登录
          </button>
          <button
            class="tab-btn"
            :class="{ active: currentTab === 'register' }"
            @click="currentTab = 'register'"
          >
            注册
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">手机号</label>
            <div class="phone-input">
              <span class="country-code">+86</span>
              <input type="tel" class="form-control" v-model="loginForm.phone" placeholder="请输入手机号">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码 / 验证码</label>
            <input type="password" class="form-control" v-model="loginForm.password" placeholder="请输入密码">
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox">
              <span>记住我</span>
            </label>
            <RouterLink to="/forgot-password" class="forgot-link">忘记密码？</RouterLink>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg">
            登录
          </button>

          <div class="divider">
            <span>其他登录方式</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-btn wechat">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
              </svg>
              微信登录
            </button>
          </div>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">姓名</label>
            <input type="text" class="form-control" v-model="registerForm.name" placeholder="请输入您的姓名">
          </div>

          <div class="form-group">
            <label class="form-label">手机号</label>
            <div class="phone-input">
              <span class="country-code">+86</span>
              <input type="tel" class="form-control" v-model="registerForm.phone" placeholder="请输入手机号">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">验证码</label>
            <div class="code-input">
              <input type="text" class="form-control" v-model="registerForm.code" placeholder="请输入验证码">
              <button type="button" class="send-code-btn" @click="sendCode">获取验证码</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">设置密码</label>
            <input type="password" class="form-control" v-model="registerForm.password" placeholder="请设置6-20位密码">
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input type="password" class="form-control" v-model="registerForm.confirmPassword" placeholder="请再次输入密码">
          </div>

          <label class="agree-terms">
            <input type="checkbox" v-model="agreeTerms">
            <span>我已阅读并同意 <RouterLink to="/terms">用户协议</RouterLink> 和 <RouterLink to="/privacy">隐私政策</RouterLink></span>
          </label>

          <button type="submit" class="btn btn-primary btn-block btn-lg">
            注册
          </button>
        </form>
      </div>

      <p class="login-footer">
        登录或注册即代表同意 <RouterLink to="/terms">用户协议</RouterLink> 和 <RouterLink to="/privacy">隐私政策</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const currentTab = ref<'login' | 'register'>('login')
const loginForm = ref({
  phone: '',
  code: '',
  password: ''
})
const registerForm = ref({
  name: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})
const agreeTerms = ref(false)

function sendCode() {
  alert('验证码已发送')
}

function handleLogin() {
  if (!loginForm.value.phone || (!loginForm.value.code && !loginForm.value.password)) {
    alert('请填写完整信息')
    return
  }
  alert('登录成功')
}

function handleRegister() {
  if (!registerForm.value.name || !registerForm.value.phone || !registerForm.value.code || !registerForm.value.password) {
    alert('请填写完整信息')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次密码不一致')
    return
  }
  if (!agreeTerms.value) {
    alert('请同意用户协议')
    return
  }
  alert('注册成功')
}
</script>


<style scoped>
  @import "@/assets/styles/loginView.css";
</style>
