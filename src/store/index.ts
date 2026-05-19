import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<Object>(JSON.parse(localStorage.getItem('user') || '{}'))
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(userInfo: object) {
    user.value = {...userInfo}
    localStorage.setItem('user', JSON.stringify(userInfo))
  }
  /**
   * 退出登录
   */
  function logout() {
    user.value = {};
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user')
  }

  function initUser() {
    // TODO: 调用API获取用户信息
    if (token.value) {
      // fetchUserInfo()
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    setToken,
    setUser,
    logout,
    initUser
  }
})

export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])

  function addItem(item: any) {
    items.value.push(item)
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
  }

  function clear() {
    items.value = []
  }

  return { items, addItem, removeItem, clear }
})
