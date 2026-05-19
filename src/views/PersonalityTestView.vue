<template>
  <div class="personality-page">
    <!-- Page Header -->
    <PageHeader
      title="职业性格测试"
      description="发现你的独特优势，找到最适合你的赛道"
      bgImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
      height="450px"
    />

    <!-- Intro Content -->
    <div class="test-intro">
      <div class="container">
        <!-- Background Image Banner -->
        <div class="intro-banner">
          <div class="banner-content">
            <h3>科学测评，精准匹配</h3>
            <p>你是否曾经在职业选择时感到迷茫？是否好奇为什么有些工作让你如鱼得水，而另一些却让你疲惫不堪？职业性格测试能帮你找到答案。我们的专业测评工具，基于成熟的心理学理论和大量职场数据开发，能帮助你。</p>
          </div>
        </div>

        <!-- Features Row -->
        <div class="intro-features-row">
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon :size="28"><Clock /></el-icon>
            </div>
            <div class="feature-content">
              <h4>深度了解自己</h4>
              <p>识别你的优势与核心驱动力</p>
              <p>发现你未察觉的潜能与盲点</p>
              <p>理解你的决策风格与沟通偏好</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <div class="feature-content">
              <h4>精准匹配职业</h4>
              <p>获得个性化职业方向建议</p>
              <p>看到与你性格匹配的成功案例</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon :size="28"><TrendCharts /></el-icon>
            </div>
            <div class="feature-content">
              <h4>规划成长路径</h4>
              <p>获得针对性的能力提升建议</p>
              <p>了解如何在工作环境中发挥最大价值</p>
            </div>
          </div>
        </div>

        <!-- Highlights Row -->
        <div class="intro-highlights-row">
          <div class="highlight-card">
            <h4>测试亮点</h4>
            <ul>
              <li>
                <el-icon><Check /></el-icon>
                科学可靠：基于各大经典理论优化，专为中国职场设计
              </li>
              <li>
                <el-icon><Check /></el-icon>
                后续支持：可预约顾问深度解读，规划专属行动方案
              </li>
            </ul>
          </div>
          <div class="highlight-card">
            <h4>适合人群</h4>
            <ul>
              <li>
                <el-icon><Check /></el-icon>
                求职/转行中的探索者
              </li>
              <li>
                <el-icon><Check /></el-icon>
                对当前职业发展感到困惑的人群
              </li>
              <li>
                <el-icon><Check /></el-icon>
                任何想要深入了解自己与工作关系的人
              </li>
            </ul>
          </div>
        </div>

        <div class="test-header">
          <h2>职业行为六大模式类型</h2>
          <p>校园招聘&社会招聘通用</p>
        </div>
        <div class="type-table-wrapper">
          <table class="type-table">
            <thead>
              <tr>
                <th>模式类型</th>
                <th>核心特征</th>
                <th>思考方式</th>
                <th>决策依据</th>
                <th>压力下的表现</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pattern in behaviorPatterns" :key="pattern.type">
                <td><strong>{{ pattern.type }}</strong></td>
                <td>{{ pattern.coreFeature }}</td>
                <td>{{ pattern.thinking }}</td>
                <td>{{ pattern.decision }}</td>
                <td>{{ pattern.pressure }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Test Type Selection - Prominent Cards -->
        <section class="test-type-section">
          <div class="section-title-wrapper">
            <h3>选择测试类型</h3>
            <p>根据你的实际情况选择合适的测试版本。测试结束后，您可以选择预约15分钟免费报告解读。</p>
          </div>
          <div class="type-cards-container">
            <div class="type-card" @click="startTest('campus')">
              <div class="type-card-image campus-img"></div>
              <div class="type-card-content">
                <h4>校招版</h4>
                <p class="subtitle">适合应届毕业生</p>
                <span class="question-badge">
                  <el-icon><Clock /></el-icon>
                  50道题
                </span>
              </div>
              <div class="arrow-icon">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
            <div class="type-card" @click="startTest('social')">
              <div class="type-card-image social-img"></div>
              <div class="type-card-content">
                <h4>社招版</h4>
                <p class="subtitle">适合职场人士</p>
                <span class="question-badge">
                  <el-icon><Clock /></el-icon>
                  50道题
                </span>
              </div>
              <div class="arrow-icon">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </section>

        <!-- 测试题区域 -->
        <div v-if="currentPhase === 'testing'" class="test-questions">
          <div class="questions-header">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <p><span>{{ currentQuestion + 1 }}</span> / <span>{{ totalQuestions }}</span></p>
          </div>
          <div class="questions-container">
            <div class="question-item">
              <span class="question-number">第 {{ currentQuestion + 1 }} 题</span>
              <p class="question-text">{{ currentQuestionData.text }}</p>
              <div class="options-list">
                <label
                  v-for="(option, idx) in currentQuestionData.options"
                  :key="idx"
                  class="option-item"
                  :class="{ selected: answers[currentQuestion + 1] === idx }"
                >
                  <input
                    type="radio"
                    :name="'question_' + (currentQuestion + 1)"
                    :value="idx"
                    @change="selectAnswer(idx)"
                    :checked="answers[currentQuestion + 1] === idx"
                  >
                  <span class="option-radio"></span>
                  <span class="option-text">{{ option }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="questions-nav">
            <button class="btn btn-secondary" @click="prevQuestion" :disabled="currentQuestion === 0">
              <el-icon><ArrowLeft /></el-icon>
              上一题
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Content -->
    <HrQrModal v-model:visible="hrQrModalVisible" :title="qrTip" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Clock,
  User,
  TrendCharts,
  Check,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import HrQrModal from '@/components/common/HrQrModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'

// HR二维码弹窗
const hrQrModalVisible = ref(false)
const qrTip = ref('')

const showHrQrModal = () => {
  qrTip.value = '扫码添加HR微信，为您解答测试结果'
  hrQrModalVisible.value = true
}

// 测试阶段: 'intro' | 'testing' | 'result'
const currentPhase = ref<'intro' | 'testing' | 'result'>('intro')

// 测试类型: 'campus' | 'social'
const testType = ref<'campus' | 'social'>('campus')

// 六大职业行为模式
const behaviorPatterns = [
  {
    type: '战略家 (Strategist)',
    coreFeature: '前瞻性、分析力、关注宏观格局。善于洞察趋势、制定长期规划、进行系统性思考。',
    thinking: '"我们未来要去哪里？"',
    decision: '数据、逻辑与可能性',
    pressure: '可能过度思考、行动迟缓、显得不接地气'
  },
  {
    type: '创新者 (Innovator)',
    coreFeature: '创造力、灵感、关注新可能性。善于提出颠覆性想法、打破常规、解决模糊问题。',
    thinking: '"为什么不能换一种方式？"',
    decision: '直觉、灵感与用户体验',
    pressure: '可能想法多变、缺乏耐心、忽视细节'
  },
  {
    type: '协调者 (Coordinator)',
    coreFeature: '人际敏感、协作、关注团队和谐。善于沟通、化解冲突、建立信任、凝聚人心。',
    thinking: '"我们如何能更好地一起工作？"',
    decision: '团队共识与氛围',
    pressure: '可能回避必要冲突、难以做出强硬决定'
  },
  {
    type: '执行者 (Implementer)',
    coreFeature: '务实、高效、关注任务完成。善于将计划转化为行动、专注细节、确保结果交付。',
    thinking: '"下一步的具体行动是什么？"',
    decision: '计划、流程与时效性',
    pressure: '可能缺乏灵活性、抗拒临时变更'
  },
  {
    type: '专家 (Specialist)',
    coreFeature: '深度钻研、精准、关注专业精通。善于攻克技术难题、优化解决方案、追求卓越。',
    thinking: '"如何能把这件事做到极致？"',
    decision: '专业标准与技术可行性',
    pressure: '可能钻牛角尖、沟通成本高、视野狭窄'
  },
  {
    type: '守护者 (Guardian)',
    coreFeature: '稳定性、责任感、关注秩序与规则。善于维护流程、控制风险、确保组织稳定运行。',
    thinking: '"如何确保万无一失？"',
    decision: '规则、先例与风险评估',
    pressure: '可能过于保守、抗拒变化、流程至上'
  }
]

// 校招测试题目
const campusQuestions = [
  { id: 1, text: "小组作业中，你更倾向于?", options: ["C（协调者）", "X（专家）", "G（守护者）", "I（创新者）"] },
  { id: 2, text: "选择实习岗位时，你更看重?", options: ["X（专家）", "S（战略家）", "C,X（协调者/专家）", "E（执行者）"] },
  { id: 3, text: "面对期末论文deadline，你会?", options: ["E,G（执行者/守护者）", "X（专家）", "C（协调者）", "S（战略家）"] },
  { id: 4, text: "你希望未来的职业初期，能获得?", options: ["G（守护者）", "E（执行者）", "C（协调者）", "S（战略家）"] },
  { id: 5, text: "参加校园招聘会时，你会如何准备?", options: ["S（战略家）", "E（执行者）", "C（协调者）", "X（专家）"] },
  { id: 6, text: "面对不同行业的工作机会，你会优先考虑?", options: ["S（战略家）", "E（执行者）", "I（创新者）", "G（守护者）"] },
  { id: 7, text: "当小组意见出现分歧时，你通常会?", options: ["C（协调者）", "S,X（战略家/专家）", "C,G（协调者/守护者）", "E（执行者）"] },
  { id: 8, text: "你更倾向于哪种工作模式?", options: ["G（守护者）", "I（创新者）", "C,E（协调者/执行者）", "I,E（创新者/执行者）"] },
  { id: 9, text: "课后复习时，你更习惯?", options: ["C（协调者）", "X,G（专家/守护者）", "E,X（执行者/专家）", "X（专家）"] },
  { id: 10, text: "选择职业时，你会更关注企业的哪方面?", options: ["C,I（协调者/创新者）", "G（守护者）", "S（战略家）", "X,G（专家/守护者）"] },
  { id: 11, text: "接到一项陌生的课程任务，你会?", options: ["I,X（创新者/专家）", "I,E（创新者/执行者）", "C,X（协调者/专家）", "S,E（战略家/执行者）"] },
  { id: 12, text: "你希望未来工作中，同事之间的关系是?", options: ["C（协调者）", "X（专家）", "C（协调者）", "E,C（执行者/协调者）"] },
  { id: 13, text: "当考试成绩不理想时，你会?", options: ["S,E（战略家/执行者）", "C,X（协调者/专家）", "E（执行者）", "X,C（专家/协调者）"] },
  { id: 14, text: "面对工作中的困难，你更希望得到?", options: ["S,X（战略家/专家）", "C（协调者）", "I,E（创新者/执行者）", "X,G（专家/守护者）"] },
  { id: 15, text: "参与校园社团活动时，你更倾向于担任?", options: ["C,E（协调者/执行者）", "E（执行者）", "I（创新者）", "C（协调者）"] },
  { id: 16, text: "你更倾向于从事哪种类型的工作?", options: ["I（创新者）", "X,S（专家/战略家）", "C（协调者）", "E,G（执行者/守护者）"] },
  { id: 17, text: "课余时间，你更愿意?", options: ["C（协调者）", "X,I（专家/创新者）", "C（协调者）", "E,C（执行者/协调者）"] },
  { id: 18, text: "职业发展中，你最看重的是?", options: ["S（战略家）", "X（专家）", "G（守护者）", "I,E（创新者/执行者）"] },
  { id: 19, text: "面对不确定的课程项目要求，你会?", options: ["G,X（守护者/专家）", "I,E（创新者/执行者）", "C（协调者）", "S,X（战略家/专家）"] },
  { id: 20, text: "你更愿意在哪个规模的企业工作?", options: ["G（守护者）", "S,G（战略家/守护者）", "I,E（创新者/执行者）", "I,S（创新者/战略家）"] },
  { id: 21, text: "当需要在短时间内完成多项作业时，你会?", options: ["S,E（战略家/执行者）", "E,X（执行者/专家）", "C,E（协调者/执行者）", "E,G（执行者/守护者）"] },
  { id: 22, text: "当面临职业选择时，你会优先听从谁的建议?", options: ["S,X（战略家/专家）", "C（协调者）", "I（创新者）", "S,G（战略家/守护者）"] },
  { id: 23, text: "与同学合作完成报告时，你会更关注?", options: ["S（战略家）", "X,G（专家/守护者）", "C（协调者）", "I（创新者）"] },
  { id: 24, text: "你希望工作能给你带来什么?", options: ["I（创新者）", "S,C（战略家/协调者）", "G（守护者）", "X,E（专家/执行者）"] },
  { id: 25, text: "参加校园演讲比赛，你会如何准备?", options: ["E,G（执行者/守护者）", "S（战略家）", "C（协调者）", "S,G（战略家/守护者）"] },
  { id: 26, text: "你更倾向于哪种工作节奏?", options: ["E（执行者）", "X,G（专家/守护者）", "G,C（守护者/协调者）", "I,S（创新者/战略家）"] },
  { id: 27, text: "当同学向你请教问题时，你会?", options: ["C,X（协调者/专家）", "E（执行者）", "S,X（战略家/专家）", "X（专家）"] },
  { id: 28, text: "选择职业时，你会考虑工作地点的哪些因素?", options: ["S（战略家）", "G（守护者）", "G（守护者）", "C,G（协调者/守护者）"] },
  { id: 29, text: "规划寒暑假生活时，你会更倾向于?", options: ["S,E（战略家/执行者）", "I（创新者）", "C（协调者）", "E（执行者）"] },
  { id: 30, text: "你希望工作中的领导是哪种风格?", options: ["C,S（协调者/战略家）", "S,E（战略家/执行者）", "C（协调者）", "I,X（创新者/专家）"] },
  { id: 31, text: "面对需要公开表达的任务，你会?", options: ["I,E（创新者/执行者）", "G,E（守护者/执行者）", "C（协调者）", "G,X（守护者/专家）"] },
  { id: 32, text: "职业发展中，你能接受的最大挑战是?", options: ["E（执行者）", "E,C（执行者/协调者）", "G（守护者）", "X,I（专家/创新者）"] },
  { id: 33, text: "当团队任务进度落后时，你会?", options: ["E（执行者）", "S,E（战略家/执行者）", "C（协调者）", "G,E（守护者/执行者）"] },
  { id: 34, text: "你更倾向于从事能产生什么影响的工作?", options: ["C,I（协调者/创新者）", "S,E（战略家/执行者）", "X（专家）", "I（创新者）"] },
  { id: 35, text: "学习新软件时，你会?", options: ["E,G（执行者/守护者）", "S,X（战略家/专家）", "C,X（协调者/专家）", "I,X（创新者/专家）"] },
  { id: 36, text: "你希望工作中获得的反馈方式是?", options: ["S,G（战略家/守护者）", "E（执行者）", "C（协调者）", "X,E（专家/执行者）"] },
  { id: 37, text: "当同时收到两个感兴趣的校园活动邀请时，你会?", options: ["S（战略家）", "E,X（执行者/专家）", "C（协调者）", "I,E（创新者/执行者）"] },
  { id: 38, text: "选择职业时，你会考虑工作的哪些稳定性因素?", options: ["G（守护者）", "G（守护者）", "X,G（专家/守护者）", "G（守护者）"] },
  { id: 39, text: "完成一项重要的课程项目后，你会?", options: ["S,E（战略家/执行者）", "C,I（协调者/创新者）", "G（守护者）", "X,E（专家/执行者）"] },
  { id: 40, text: "你更倾向于通过哪种方式实现职业晋升?", options: ["E（执行者）", "X（专家）", "C,S（协调者/战略家）", "S,C（战略家/协调者）"] },
  { id: 41, text: "面对他人的批评意见，你会?", options: ["X,E（专家/执行者）", "C（协调者）", "G（守护者）", "S,X（战略家/专家）"] },
  { id: 42, text: "参与小组调研项目时，你更愿意负责?", options: ["E,I（执行者/创新者）", "X,S（专家/战略家）", "X,G（专家/守护者）", "C,E（协调者/执行者）"] },
  { id: 43, text: "当需要学习一门难度较高的专业课时，你会?", options: ["S,X（战略家/专家）", "E,G（执行者/守护者）", "C,X（协调者/专家）", "X,I（专家/创新者）"] },
  { id: 44, text: "课余时间做兼职时，你更看重?", options: ["X,S（专家/战略家）", "E（执行者）", "I,G（创新者/守护者）", "C（协调者）"] },
  { id: 45, text: "当计划被突发情况打乱时，你会?", options: ["S,E（战略家/执行者）", "I,E（创新者/执行者）", "C（协调者）", "G（守护者）"] },
  { id: 46, text: "参加校园辩论赛时，你更适合担任?", options: ["S（战略家）", "X,E（专家/执行者）", "I,C（创新者/协调者）", "S,I（战略家/创新者）"] },
  { id: 47, text: "当需要向老师提交一份创意方案时，你会?", options: ["I（创新者）", "E,G（执行者/守护者）", "X,G（专家/守护者）", "I,X（创新者/专家）"] },
  { id: 48, text: "和同学相处时，你更倾向于?", options: ["C（协调者）", "X,G（专家/守护者）", "C（协调者）", "C,E（协调者/执行者）"] },
  { id: 49, text: "面对需要长期坚持的学习任务，你会?", options: ["S,E（战略家/执行者）", "C,E（协调者/执行者）", "S,X（战略家/专家）", "E（执行者）"] },
  { id: 50, text: "当在学习中遇到瓶颈时，你会?", options: ["I,X（创新者/专家）", "G,X（守护者/专家）", "C,X（协调者/专家）", "X,S（专家/战略家）"] }
]

// 社招测试题目
const socialQuestions = [
  { id: 1, text: "团队项目中，你更倾向于？", options: ["S,E（战略家/执行者）", "E,G（执行者/守护者）", "C（协调者）", "I,S（创新者/战略家）"] },
  { id: 2, text: "考虑换工作时，你更看重以下哪一点？", options: ["S（战略家）", "S,G（战略家/守护者）", "X,C（专家/协调者）", "I,E（创新者/执行者）"] },
  { id: 3, text: "面对紧急工作任务，你会？", options: ["E,S（执行者/战略家）", "S,X（战略家/专家）", "C,E（协调者/执行者）", "E,G（执行者/守护者）"] },
  { id: 4, text: "你希望当前职业阶段能获得什么？", options: ["S（战略家）", "S,G（战略家/守护者）", "X,C（专家/协调者）", "I,E（创新者/执行者）"] },
  { id: 5, text: "参加行业研讨会时，你会如何准备？", options: ["S,X（战略家/专家）", "C,S（协调者/战略家）", "X,E（专家/执行者）", "S,E（战略家/执行者）"] },
  { id: 6, text: "面对不同行业的工作机会，你会优先考虑？", options: ["S（战略家）", "E（执行者）", "X,G（专家/守护者）", "G（守护者）"] },
  { id: 7, text: "当团队意见不一致时，你通常会？", options: ["C,S（协调者/战略家）", "S,X（战略家/专家）", "C,G（协调者/守护者）", "E,G（执行者/守护者）"] },
  { id: 8, text: "你更倾向于哪种工作模式？", options: ["G（守护者）", "I,E（创新者/执行者）", "C,E（协调者/执行者）", "I,X（创新者/专家）"] },
  { id: 9, text: "下班后自我提升时，你更习惯？", options: ["X,G（专家/守护者）", "X,S（专家/战略家）", "C,X（协调者/专家）", "I,E（创新者/执行者）"] },
  { id: 10, text: "选择新公司时，你会更关注企业的哪方面？", options: ["S（战略家）", "E,G（执行者/守护者）", "S,G（战略家/守护者）", "X,S（专家/战略家）"] },
  { id: 11, text: "接到一项跨部门协作的陌生任务，你会？", options: ["C,S（协调者/战略家）", "I,E（创新者/执行者）", "C,X（协调者/专家）", "S,G（战略家/守护者）"] },
  { id: 12, text: "你希望工作中，团队的协作模式是？", options: ["E,S（执行者/战略家）", "X,G（专家/守护者）", "C,X（协调者/专家）", "E,I（执行者/创新者）"] },
  { id: 13, text: "当工作业绩未达预期时，你会？", options: ["S,X（战略家/专家）", "C,S（协调者/战略家）", "E（执行者）", "X,C（专家/协调者）"] },
  { id: 14, text: "面对工作中的重大难题，你更希望得到？", options: ["S,X（战略家/专家）", "C,E（协调者/执行者）", "X,S（专家/战略家）", "I,E（创新者/执行者）"] },
  { id: 15, text: "参与公司项目时，你更倾向于担任？", options: ["S,E（战略家/执行者）", "E,G（执行者/守护者）", "I,S（创新者/战略家）", "C,G（协调者/守护者）"] },
  { id: 16, text: "你更倾向于从事哪种类型的工作？", options: ["S（战略家）", "X（专家）", "S,C（战略家/协调者）", "C,E（协调者/执行者）"] },
  { id: 17, text: "周末休息时，你更愿意？", options: ["C,S（协调者/战略家）", "X,S（专家/战略家）", "C,G（协调者/守护者）", "I,G（创新者/守护者）"] },
  { id: 18, text: "职业发展中，你最看重的是？", options: ["S,C（战略家/协调者）", "X（专家）", "I,G（创新者/守护者）", "I,C（创新者/协调者）"] },
  { id: 19, text: "面对模糊的工作需求，你会？", options: ["G,X（守护者/专家）", "E,G（执行者/守护者）", "C,X（协调者/专家）", "S,X（战略家/专家）"] },
  { id: 20, text: "你更愿意在哪个发展阶段的企业工作？", options: ["G（守护者）", "I,E（创新者/执行者）", "X,E（专家/执行者）", "I,S（创新者/战略家）"] },
  { id: 21, text: "当需要同时处理多项工作任务时，你会？", options: ["S,E（战略家/执行者）", "S,X（战略家/专家）", "I,E（创新者/执行者）", "E（执行者）"] },
  { id: 22, text: "当面临职业转型时，你会优先听从谁的建议？", options: ["S,X（战略家/专家）", "C,G（协调者/守护者）", "I,E（创新者/执行者）", "S,G（战略家/守护者）"] },
  { id: 23, text: "与同事合作完成项目时，你会更关注？", options: ["S,E（战略家/执行者）", "X,G（专家/守护者）", "C,E（协调者/执行者）", "I,S（创新者/战略家）"] },
  { id: 24, text: "你希望工作能给你带来什么核心价值？", options: ["X,I（专家/创新者）", "C,S（协调者/战略家）", "G,E（守护者/执行者）", "I,E（创新者/执行者）"] },
  { id: 25, text: "准备向客户做项目汇报时，你会如何准备？", options: ["E,G（执行者/守护者）", "X,S（专家/战略家）", "C（协调者）", "S,G（战略家/守护者）"] },
  { id: 26, text: "你更倾向于哪种工作节奏？", options: ["E（执行者）", "G,X（守护者/专家）", "I,E（创新者/执行者）", "I,G（创新者/守护者）"] },
  { id: 27, text: "当同事向你请教工作问题时，你会？", options: ["X,C（专家/协调者）", "E（执行者）", "S,X（战略家/专家）", "X（专家）"] },
  { id: 28, text: "选择工作地点时，你会考虑哪些关键因素？", options: ["S（战略家）", "G,E（守护者/执行者）", "G（守护者）", "S（战略家）"] },
  { id: 29, text: "规划年度工作目标时，你更倾向于？", options: ["S,E（战略家/执行者）", "I,G（创新者/守护者）", "I,E（创新者/执行者）", "X,E（专家/执行者）"] },
  { id: 30, text: "你更希望直属领导是哪种管理风格？", options: ["I,X（创新者/专家）", "X,C（专家/协调者）", "S,E（战略家/执行者）", "C,G（协调者/守护者）"] },
  { id: 31, text: "面对需要公开演讲的场合，你会？", options: ["I,E（创新者/执行者）", "G,E（守护者/执行者）", "C（协调者）", "X,G（专家/守护者）"] },
  { id: 32, text: "职业发展中，你能接受的最大挑战是？", options: ["E,C（执行者/协调者）", "E,S（执行者/战略家）", "X,I（专家/创新者）", "C,S（协调者/战略家）"] },
  { id: 33, text: "当项目进度落后于计划时，你会？", options: ["E（执行者）", "S,E（战略家/执行者）", "C（协调者）", "C,G（协调者/守护者）"] },
  { id: 34, text: "你更倾向于从事能产生什么价值的工作？", options: ["S,E（战略家/执行者）", "X,I（专家/创新者）", "C,I（协调者/创新者）", "I,X（创新者/专家）"] },
  { id: 35, text: "学习新的工作工具时，你会？", options: ["E,X（执行者/专家）", "S,X（战略家/专家）", "C,X（协调者/专家）", "I,X（创新者/专家）"] },
  { id: 36, text: "你希望工作中获得的反馈机制是？", options: ["S,G（战略家/守护者）", "E,X（执行者/专家）", "C（协调者）", "X,E（专家/执行者）"] },
  { id: 37, text: "当同时收到两个重要的工作邀请时，你会？", options: ["S（战略家）", "X,E（专家/执行者）", "C,G（协调者/守护者）", "I,E（创新者/执行者）"] },
  { id: 38, text: "选择职业时，你会考虑哪些长期稳定性因素？", options: ["X（专家）", "S,G（战略家/守护者）", "G（守护者）", "X,I（专家/创新者）"] },
  { id: 39, text: "完成一项重要项目后，你会？", options: ["S,X（战略家/专家）", "C,E（协调者/执行者）", "G（守护者）", "X,S（专家/战略家）"] },
  { id: 40, text: "你更倾向于通过哪种方式实现职业突破？", options: ["X（专家）", "I,S（创新者/战略家）", "S,C（战略家/协调者）", "I,E（创新者/执行者）"] },
  { id: 41, text: "面对领导的批评意见，你会？", options: ["X,E（专家/执行者）", "C（协调者）", "G（守护者）", "S,X（战略家/专家）"] },
  { id: 42, text: "参与跨部门调研项目时，你更愿意负责？", options: ["C,E（协调者/执行者）", "X,S（专家/战略家）", "S,X（专家/战略家）", "C,S（协调者/战略家）"] },
  { id: 43, text: "当需要接手一项自己不熟悉的业务时，你会？", options: ["X,S（专家/战略家）", "C,X（协调者/专家）", "E,G（执行者/守护者）", "S,E（战略家/执行者）"] },
  { id: 44, text: "选择跳槽时，你更看重新公司的哪一点？", options: ["S（战略家）", "E（执行者）", "G（守护者）", "S,X（战略家/专家）"] },
  { id: 45, text: "当工作计划被突发情况打乱时，你会？", options: ["S,E（战略家/执行者）", "E,I（执行者/创新者）", "C,E（协调者/执行者）", "S,G（战略家/守护者）"] },
  { id: 46, text: "参加行业谈判时，你更适合担任？", options: ["S,C（战略家/协调者）", "X,E（专家/执行者）", "G,X（守护者/专家）", "C（协调者）"] },
  { id: 47, text: "当需要向客户提交一份合作方案时，你会？", options: ["I（创新者）", "E,G（执行者/守护者）", "X,C（专家/协调者）", "S,X（战略家/专家）"] },
  { id: 48, text: "和同事相处时，你更倾向于？", options: ["E,X（执行者/专家）", "X,G（专家/守护者）", "C,E（协调者/执行者）", "C,G（协调者/守护者）"] },
  { id: 49, text: "面对需要长期推进的重点项目，你会？", options: ["S,E（战略家/执行者）", "C,E（协调者/执行者）", "S,X（战略家/专家）", "C,S（协调者/战略家）"] },
  { id: 50, text: "当在工作中遇到技术瓶颈时，你会？", options: ["X,E（专家/执行者）", "G,E（守护者/执行者）", "X,C（专家/协调者）", "I,C（创新者/协调者）"] }
]

const currentQuestion = ref(0)
const answers = ref<Record<number, number>>({})

// 获取当前测试类型的题目
const currentQuestions = computed(() => {
  return testType.value === 'campus' ? campusQuestions : socialQuestions
})

const totalQuestions = computed(() => currentQuestions.value.length)

function startTest(type: 'campus' | 'social') {
  testType.value = type
  currentPhase.value = 'testing'
  currentQuestion.value = 0
  answers.value = {}
}

function selectAnswer(optionIndex: number) {
  answers.value[currentQuestion.value + 1] = optionIndex

  // 延迟200ms后自动跳到下一题
  setTimeout(() => {
    if (currentQuestion.value < currentQuestions.value.length - 1) {
      currentQuestion.value++
    } else {
      completeTest()
    }
  }, 200)
}

function prevQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}

function completeTest() {
  // 停留在最后一道题，弹出二维码
  currentQuestion.value = currentQuestions.value.length - 1
  showHrQrModal()
}

const progress = computed(() => {
  return (currentQuestion.value + 1) / currentQuestions.value.length * 100
})

const currentQuestionData = computed(() => {
  return currentQuestions.value[currentQuestion.value]
})
</script>


<style scoped>
  @import "@/assets/styles/PersonalityTestView.css";
</style>
