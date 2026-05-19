// 通用类型定义

// 用户相关
export interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  created_at: string
}

export interface LoginParams {
  phone: string
  code?: string
  password?: string
}

// 套餐相关
export interface Plan {
  id: number
  type: string
  level: string
  name: string
  price: string
  original_price: string
  badge: string
  hot: boolean
  description: string
  suitable: string
  features: string[]
}

// 资讯相关
export interface News {
  id: number
  title: string
  summary: string
  content: string
  cover_image?: string
  category: string
  views: number
  created_at: string
  updated_at: string
}

// 成功案例
export interface SuccessCase {
  id: number
  title: string
  name: string
  avatar?: string
  before_company?: string
  after_company: string
  position: string
  salary_before?: string
  salary_after: string
  content: string
  type: 'personal' | 'company'
  created_at: string
}

// 企业
export interface Company {
  id: number
  name: string
  logo?: string
  industry: string
  scale: string
  description: string
  address: string
}

// 职位
export interface Job {
  id: number
  title: string
  company: string
  company_logo?: string
  salary: string
  location: string
  requirements: string[]
  tags: string[]
  created_at: string
}

// 题库题目
export interface Question {
  id: number
  category: string
  type: 'choice' | 'multiple' | 'fill' | 'essay'
  question: string
  options?: string[]
  answer: string | string[]
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
}

// 性格测试题目
export interface PersonalityQuestion {
  id: number
  question: string
  options: {
    text: string
    type: string
  }[]
}

// 通用API响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页数据
export interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// 上传文件
export interface UploadResult {
  url: string
  path: string
  filename: string
}

// 支付相关
export interface PaymentParams {
  plan_id: number
  amount: string
  method: 'alipay' | 'wechat' | 'bank'
}

// 套餐报名
export interface PlanApplication {
  name: string
  id_card: string
  phone: string
  school: string
  major: string
  education: string
  salary_expectation: string
  current_city: string
  experience: string
  plan_id: number
}
