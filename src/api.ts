/**
 * API 接口封装
 * 基于后台 routes/api.php 路由生成
 */
import request from '@/utils/request'

// ==================== 公开接口 ====================

/**
 * 认证模块
 */
// 发送短信验证码
export const sendSmsCode = (data: { phone: string, type:string }) => request.post('/v1/auth/send-sms', data)
// 验证码登录
export const loginByCode = (data: { phone: string; code: string }) => request.post('/v1/auth/login/code', data)
// 密码登录
export const loginByPassword = (data: { phone: string; password: string }) => request.post('/v1/auth/login/password', data)
// 注册
export const register = (data: { phone: string; code: string; password: string; name: string }) => request.post('/v1/auth/register', data)
// 微信登录
export const wechatLogin = (data: { code: string }) => request.post('/v1/auth/wechat', data)
// 获取微信扫码二维码
export const getWechatQrcode = () => request.post('/v1/auth/wechat/qrcode')
// 检查微信扫码状态
export const checkWechatScan = (data: { state: string }) => request.post('/v1/auth/wechat/check', data)
// 微信手机号授权登录
export const wechatPhoneLogin = (data: { phone: string; code: string; state?: string }) => request.post('/v1/auth/wechat/phone', data)

/**
 * Banner 模块
 */
export const bannerList = () => request.post('/v1/banner')

/**
 * 套餐模块
 */
// 套餐列表
export const planList = (params?: object) => request.post('/v1/plans', params)
// 热门套餐
export const planHot = (params?: object) => request.post('/v1/plans/hot', params)
// 套餐详情
export const planDetail = (id: number, data?: object) => request.post(`/v1/plans/${id}`, data)

/**
 * 资讯模块
 */
// 资讯列表
export const newsList = (params?: object) => request.post<{ data?: any[], total?: number }>('/v1/news', params)
// 热门资讯
export const newsHot = (params?: object) => request.post<any[]>('/v1/news/hot', params)
// 最新资讯
export const newsLatest = (params?: object) => request.post<any[]>('/v1/news/latest', params)
//获取资讯标签
export const newsTags = (params?: object) => request.post<any[]>('/v1/news/tags', params)
// 资讯详情
export const newsDetail = (id: number, data?: object) => request.post(`/v1/news/${id}`, data)

/**
 * 成功案例模块
 */
//行业标签
export const allIndustry = (params?: object) => request.post('/v1/cases/industry', params)
// 案例列表
export const caseList = (params?: object) => request.post('/v1/cases', params)
// 案例详情
export const caseDetail = (id: number, data?: object) => request.post(`/v1/cases/${id}`, data)

/**
 * 题库模块
 */
// 题库列表
export const questionBankList = (params?: object) => request.post('/v1/question-banks', params)
// 题库分类
export const questionBankCategories = () => request.post('/v1/question-banks/categories')
// 题目详情
export const questionBankDetail = (id: number, data?: object) => request.post(`/v1/question-banks/${id}`, data)

/**
 * 配置模块
 */
// 基本配置
export const settingsIndex = () => request.post('/v1/settings') as Promise<{ news_tags?: string[] }>
// 微信配置
export const settingsWechat = () => request.post('/v1/settings/wechat')
// 短信配置
export const settingsSms = () => request.post('/v1/settings/sms')
// 支付配置
export const settingsPayment = () => request.post('/v1/settings/payment')
// OSS配置
export const settingsOss = () => request.post('/v1/settings/oss')

/**
 * 协议模块
 */
// 获取协议内容
export const getAgreement = (type: string) => request.post('/v1/agreement/show', { type })

/**
 * 岗位模块
 */
// 获取岗位列表
export const getJobList = (params: object) => request.post('/v1/jobs/list', params)
// 获取岗位详情
export const getJobDetail = (id: number) => request.post('/v1/jobs/detail', { id })
// 获取筛选选项
export const getFilterOptions = () => request.post('/v1/jobs/filter-options')

/**
 * 企业直推模块
 */
// 获取企业直推岗位列表
export const getRecommendJobList = (params: object) => request.post('/v1/recommend-jobs/list', params)
// 获取企业直推岗位详情
export const getRecommendJobDetail = (id: number) => request.post('/v1/recommend-jobs/detail', { id })

/**
 * 城市模块
 */
// 获取城市列表
export const getCityList = () => request.post('/v1/regions/cities')

/**
 * 企业认证模块
 */
// 提交企业认证
export const companyCheckSubmit = (data: object) => request.post('/v1/company-check', data)

/**
 * 合作伙伴模块
 */
// 获取合作伙伴列表
export const partnersList = (params?: object) => request.post('/v1/partners', params)


/**
 * HR销售人员模块
 */
// 获取销售人员列表
export const getSaleList = () => request.post('/v1/salespersons')
// 推荐HR
export const getRecommendSale = () => request.post('/v1/salespersons/recommend')
// 获取销售人员详情
export const getSaleDetail = (id: number, data?: object) => request.post(`/v1/salespersons/${id}`, data)
// 客户增长
export const getclientIncrement = (id: number, data?: object) => request.post(`/v1/salespersons/${id}/client-increment`, data)


/**
 * 文件上传模块
 */
// 上传文件
export const fileUpload = (data: FormData) => request.post('/v1/file/upload', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
// 上传图片
export const uploadImage = (data: FormData) => request.post('/v1/file/upload-image', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
// 下载文件
export const fileDownload = (data: { path: string }) => request.post('/v1/file/download', data, { responseType: 'blob' })

// ==================== 需要认证的接口 ====================

/**
 * 用户模块
 */
// 获取当前用户信息
export const userInfo = () => request.post('/v1/user')
// 更新用户信息
export const updateUser = (data: object) => request.post('/v1/updateUser', data)
// 退出登录
export const logout = () => request.post('/v1/logout')

/**
 * 套餐申请模块
 */
// 创建申请
export const applicationCreate = (data: object) => request.post('/v1/applications/apply', data)
// 申请列表
export const applicationList = (params?: object) => request.post('/v1/applications', params)
// 申请详情
export const applicationDetail = (id: number, data?: object) => request.post(`/v1/applications/${id}`, data)

/**
 * 候选人评估模块
 */
// 获取候选人评估列表
export const candidateAssessmentList = (params?: object) => request.post('/v1/candidate-assessments', params)

/**
 * 订单模块
 */
// 订单列表
export const orderList = (params?: object) => request.post('/v1/orders', params)
// 订单详情
export const orderDetail = (id: number, data?: object) => request.post(`/v1/orders/${id}`, data)
// 订单支付
export const orderPayment = (id: number, data?: object) => request.post(`/v1/orders/${id}/payment`, data)
// 删除订单
export const orderDelete = (id: number) => request.post(`/v1/orders/${id}/delete`)
// 查询订单状态
export const queryOrder = (outTradeNo: string) => request.get(`/v1/orders/query`, { params: { out_trade_no: outTradeNo } })

// ==================== 组合导出 ====================

export default {
  // 认证
  sendSmsCode,
  loginByCode,
  loginByPassword,
  register,
  wechatLogin,
  getWechatQrcode,
  checkWechatScan,
  wechatPhoneLogin,
  // Banner
  bannerList,
  // 套餐
  planList,
  planHot,
  planDetail,
  // 资讯
  newsList,
  newsHot,
  newsLatest,
  newsDetail,
  newsTags,
  // 成功案例
  allIndustry,
  caseList,
  caseDetail,
  // 题库
  questionBankList,
  questionBankCategories,
  questionBankDetail,
  // 配置
  settingsIndex,
  settingsWechat,
  settingsSms,
  settingsPayment,
  settingsOss,
  // 文件
  fileUpload,
  uploadImage,
  fileDownload,
  // 用户
  userInfo,
  updateUser,
  logout,
  // 申请
  applicationCreate,
  applicationList,
  applicationDetail,
  // 订单
  orderList,
  orderDetail,
  orderPayment,
  orderDelete,
  queryOrder,
  // 候选人评估
  candidateAssessmentList,

  // 岗位模块
  getJobList,
  getJobDetail,
  getFilterOptions,
  // 企业直推模块
  getRecommendJobList,
  getRecommendJobDetail,
  // 城市模块
  getCityList,
  // 企业认证模块
  companyCheckSubmit,
  // 合作伙伴模块
  partnersList,
  // 销售人员模块
  getSaleList,
  getRecommendSale,
  getSaleDetail,
  // 协议
  getAgreement
}
