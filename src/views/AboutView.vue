<template>
  <div class="about-page">
    <!-- Banner Section -->
    <PageHeader
      title="关于我们"
      description="职业成长陪跑专家"
      :bgImages="bannerBackgrounds"
      height="450px"
    />

    <!-- About Section -->
    <section class="section about-section">
      <div>
        <div class="section-header">
          <h2>公司简介</h2>
          <p>品牌故事与定位</p>
        </div>
        <div class="about-card">
            <div class="about-us">
              <p>
                在充满变数与机遇的当代职场，信息过载与路径模糊成为了职业发展的最大阻力。求职者与职场人往往陷入一种困境：拥有海量资讯，却难以拼凑出清晰的求职路径；渴望快速成长，却只能在碎片化的尝试中缓慢前行。问题的核心，并非资源匮乏，而在于缺乏一套系统性的专业导航、一份坚定的长期陪伴，以及一个真正以“人”的成功为中心的解决方案。
              </p>
              <p>
                春风求职（BreezeUp Career）正是为破解这一困境而生。我们不仅是一家全流程求职陪跑机构，更是一个职业成长生态的构建者与终身职业伙伴。我们的创立，源于一个坚定信念：真正的职业成功，是个人潜能与市场机遇在正确方法论引导下的精准契合。因此，我们融合顶尖企业的人才战略视角与深度个人发展咨询，致力于为每一位前行者绘制可执行、可预见、可持续的职业发展蓝图。
              </p>
              <p>
                我们专注于大学生从校园到职场的惊险一跃，与职场人在生涯中期的关键转折。我们深刻理解，对于初出茅庐的毕业生，核心任务是整合为清晰有力的职业身份，在竞争中赢得高价值的起点；而对于寻求突破的职场人，目标则是系统性盘活过往积淀，突破瓶颈，实现面向未来的价值跃迁。为此，我们提供的不再是孤立的一纸简历或一次模拟，而是一场贯穿始终的深度陪跑。
              </p>
              <p>
                这场陪跑始于一次深度的诊断与规划。我们与您一同拨开迷雾，不仅定位到岗位，更定位到您未来三至五年最具优势的成长赛道。在求职资产的锻造阶段，我们以企业招聘官的视角，重构您的简历与面试策略，使其成为精准传递价值的利器，确保您在每一个环节都展现出超越期望的匹配度。当机会来临时，我们则成为您最理性的后盾，在薪酬谈判与最终抉择中权衡利弊，守护您的核心权益。直至您成功入职，我们的陪伴仍会延续，助力您平稳度过适应期，奠定在新环境中的发展基础。
              </p>
              <p>
                让我们携手，不仅赢得一份满意的邀约，更赢得一条清晰、自信且充满掌控感的职业道路。
              </p>
            </div>
          </div>
      </div>

      <div class="container">
        
        <div class="about-content">
          <div class="mission-vision">
            <div class="mv-item">
              <div class="mv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h4>我们的使命</h4>
              <p>{{ aboutData.mission }}</p>
            </div>
            <div class="mv-item">
              <div class="mv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h4>我们的愿景</h4>
              <p>{{ aboutData.vision }}</p>
            </div>
          </div>

          <div class="values-content">
            <h3>我们的行为基石</h3>
            <div class="values-grid">
              <div v-for="(value, index) in aboutData.values" :key="value.title" class="value-item">
                <div class="value-number">{{ String(index + 1).padStart(2, '0') }}</div>
                <h4>{{ value.title }}</h4>
                <p>{{ value.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantage Section -->
    <section class="section advantage-section">
      <div class="container">
        <div class="section-header">
          <h2>为何选择我们</h2>
          <p>核心优势与差异化</p>
        </div>
        <div class="advantage-intro">
          <p>在春风求职，我们坚信实力必须可衡量、结果必须可感知。以下是我们持续为学员创造价值的数据见证。</p>
        </div>
        <div class="advantage-blocks">
          <div v-for="advantage in advantages" :key="advantage.title" class="advantage-block">
            <h3>{{ advantage.title }}</h3>
            <p class="block-subtitle">{{ advantage.subtitle }}</p>
            <div class="advantage-detail">
              <div v-for="item in advantage.items" :key="item.label" class="detail-item">
                <span class="detail-number">{{ item.number }}</span>
                <span class="detail-label">{{ item.label }}</span>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Section -->
    <section class="section brand-section">
      <div class="container">
        <div class="section-header">
          <h2>我们的资本基石</h2>
          <p>品牌展示</p>
        </div>
        <div class="brand-blocks">
          <div class="brand-block">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>资本市场的强力认可</h3>
            <div class="milestone">
              <h4>{{ brandData.milestones.title }}</h4>
              <p>{{ brandData.milestones.desc }}</p>
              <ul class="milestone-list">
                <li v-for="item in brandData.milestones.items" :key="item.label">
                  <strong>{{ item.label }}：</strong>{{ item.value }}
                </li>
              </ul>
            </div>
          </div>
          <div class="brand-block">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3>行业生态的深度共建</h3>
            <p>通过构建庞大的合作生态，我们确保了岗位资源的真实、优质与海量，为学员就业搭建了广阔平台。</p>
            <div class="brand-stats">
              <div v-for="stat in brandData.stats" :key="stat.label" class="stat-item">
                <span class="stat-number">{{ stat.number }}</span>
                <span class="stat-label">{{ stat.label }}</span>
                <p>{{ stat.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Guarantee Section -->
    <section class="section guarantee-section">
      <div class="container">
        <div class="section-header">
          <h2>我们的承诺</h2>
          <p>服务保障与品质</p>
        </div>
        <div class="guarantee-content">
          <div v-for="guarantee in guarantees" :key="guarantee.title" class="guarantee-card">
            <div class="guarantee-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="guarantee.icon"/>
              </svg>
            </div>
            <h3>{{ guarantee.title }}</h3>
            <p>{{ guarantee.desc }}</p>
          </div>
        </div>

        <div class="contact-info">
          <h3>联系我们</h3>
          <div class="contact-details">
            <p><strong>客服热线：</strong>{{ contactInfo.phone }}</p>
            <p><strong>商务合作：</strong>{{ contactInfo.email }}</p>
            <p><strong>公司地址：</strong>{{ contactInfo.address }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'

// Banner 轮播图数据
const bannerBackgrounds = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80'
]

// 关于数据
const aboutData = {
  mission: '赋能求职者，连接未来，通过专业服务提升职业发展成功率。',
  vision: '成为最受求职者信赖的职业成长伙伴。',
  values: [
    { title: '客户为先', desc: '以客户需求为导向，以服务质量为目标。' },
    { title: '专业至上', desc: '持续学习，精益求精，以专业能力实现卓越成果。' },
    { title: '诚信尽责', desc: '诚实守信，言行一致，对工作结果负责到底。' },
    { title: '向前一步', desc: '敢为向前，破局担当，同心向前，务实求效。' },
    { title: '创新求变', desc: '拥抱变化，敢于尝试，不断优化服务与流程。' }
  ]
}

const advantages = [
  {
    title: '资源壁垒',
    subtitle: '用广度和深度构建求职护城河',
    items: [
      { number: '6000+', label: '企业直推通道', desc: '我们与国央企、世界五百强、上市及外资等近万家优质企业建立长期人才推荐合作，覆盖主流高潜行业。' },
      { number: '45%', label: '投递效率提升', desc: '通过专业渠道与精准内推，学员平均投递响应率比自主投递提升45%。' },
      { number: '独家', label: '认证资源', desc: '与阿里巴巴、亚马逊AWS等头部企业达成官方认证合作。' },
      { number: '18%', label: '薪资涨幅中位数', desc: '在互联网、科技等热门领域，学员通过我们的服务实现薪资涨幅中位数达18%。' }
    ]
  },
  {
    title: '效率革命',
    subtitle: '重新定义求职周期',
    items: [
      { number: '2.1', label: '个月平均转型周期', desc: '对于寻求转行的职场人，我们通过精准定位与强化训练，将平均转型周期缩短至2.1个月。' },
      { number: '78%', label: '1年内职级晋升率', desc: '78%的社招学员在入职后1年内实现了职级晋升，验证了我们"职业发展陪跑"的长线价值。' }
    ]
  }
]

const brandData = {
  milestones: {
    title: 'A轮融资里程碑',
    desc: '春风求职以卓越的服务模式与增长潜力，赢得了顶尖投资机构的战略投资。',
    items: [
      { label: '融资事件', value: '成功完成A轮融资' },
      { label: '融资规模', value: '2000万元' },
      { label: '投资方', value: '由知名机构领投' },
      { label: '战略意义', value: '此轮融资将用于导师团队扩建、企业资源库扩容与技术系统升级。' }
    ]
  },
  stats: [
    { number: '5200+', label: '合作企业', desc: '携手人力资源协会，整合5200+企业资源。' },
    { number: '8968', label: '月度活跃招聘岗位', desc: '平台月度活跃招聘岗位8968个，覆盖全国106个城市。' },
    { number: '12000+', label: '学员成功就业', desc: '已累计帮助12000+学员成功就业。' }
  ]
}

const guarantees = [
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: '保Offer结果导向',
    desc: '以学员最终拿到心仪Offer为目标，提供全流程服务保障。'
  },
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: '专业导师团队',
    desc: '均由资深HR、猎头、行业专家组成，拥有丰富的求职辅导经验。'
  },
  {
    icon: 'M12 6v6l4 2M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
    title: '全程陪伴',
    desc: '从职业规划到入职辅导，全程陪伴，及时响应学员需求。'
  }
]

const contactInfo = {
  phone: '400-888-8888',
  email: 'business@blowhr.com',
  address: '北京市朝阳区建国路88号'
}
</script>

<style scoped>
  @import "@/assets/styles/aboutView.css";
</style>
