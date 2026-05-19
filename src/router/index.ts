import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于我们' }
  },
  {
    path: '/plans',
    name: 'plans',
    component: () => import('@/views/PlansView.vue'),
    meta: { title: '求职套餐' }
  },
  {
    path: '/question-bank',
    name: 'question-bank',
    component: () => import('@/views/QuestionBankView.vue'),
    meta: { title: '求职题库' }
  },
  {
    path: '/personality-test',
    name: 'personality-test',
    component: () => import('@/views/PersonalityTestView.vue'),
    meta: { title: '性格测试' }
  },
  {
    path: '/application-resources',
    name: 'application-resources',
    component: () => import('@/views/ApplicationResourcesView.vue'),
    meta: { title: '网申资源' }
  },
  {
    path: '/enterprise-direct',
    name: 'enterprise-direct',
    component: () => import('@/views/EnterpriseDirectView.vue'),
    meta: { title: '企业直推' }
  },
  {
    path: '/company-check',
    name: 'company-check',
    component: () => import('@/views/CompanyCheckView.vue'),
    meta: { title: '企业背调' }
  },
  {
    path: '/candidate-assessment',
    name: 'candidate-assessment',
    component: () => import('@/views/CandidateAssessmentView.vue'),
    meta: { title: '候选人评估' }
  },
  {
    path: '/batch-assessment',
    name: 'batch-assessment',
    component: () => import('@/views/BatchAssessmentView.vue'),
    meta: { title: '批量评估' }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/NewsView.vue'),
    meta: { title: '就业资讯' }
  },
  {
    path: '/news/:id',
    name: 'news-detail',
    component: () => import('@/views/NewsDetailView.vue'),
    meta: { title: '资讯详情' }
  },
  {
    path: '/personal-cases',
    name: 'personal-cases',
    component: () => import('@/views/PersonalCasesView.vue'),
    meta: { title: '求职者案例' }
  },
  {
    path: '/company-cases',
    name: 'company-cases',
    component: () => import('@/views/CompanyCasesView.vue'),
    meta: { title: '企业服务案例' }
  },
  {
    path: '/case-detail',
    name: 'case-detail',
    component: () => import('@/views/CaseDetailView.vue'),
    meta: { title: '案例详情' }
  },
  {
    path: '/company-case-detail',
    name: 'company-case-detail',
    component: () => import('@/views/CompanyCaseDetailView.vue'),
    meta: { title: '企业服务案例' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录注册' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/AgreementView.vue'),
    meta: { title: '用户服务协议' }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/AgreementView.vue'),
    meta: { title: '隐私协议' }
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/views/AgreementView.vue'),
    meta: { title: '服务介绍' }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { title: '我的订单' }
  },
  {
    path: '/payment-success',
    name: 'payment-success',
    component: () => import('@/views/PaymentSuccessView.vue'),
    meta: { title: '支付成功' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '页面'} - 春风求职`
  next()
})

export default router
