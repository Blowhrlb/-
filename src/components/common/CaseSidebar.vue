<template>
  <aside class="case-sidebar">
    <!-- 服务信息 -->
    <div class="sidebar-card service-card" v-if="source == 'person'">
      <div class="service-header">
        <h3>相关服务</h3>
        <RouterLink to="/service" class="icon-link">
          <svg t="1773302246806" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4795" width="30" height="30"><path d="M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m45.32419 560.761904h-68.534857v73.142857h68.534857v-73.142857z m-4.047238-362.008381c-44.27581-8.97219-92.233143-3.120762-126.268952 33.328762C396.629333 362.22781 390.095238 388.047238 390.095238 445.001143h68.266667v-16.579048c0.316952-29.232762 5.241905-59.367619 47.957333-67.779047a68.998095 68.998095 0 0 1 60.367238 15.506285c15.213714 14.652952 15.555048 47.835429-9.020952 64.365715l-38.473143 25.6-4.315429 2.852571c-19.18781 13.336381-26.087619 28.379429-26.087619 49.883429V609.52381h68.534857v-65.731048c0-14.09219 6.729143-27.355429 24.722286-38.863238 17.968762-11.483429 68.120381-34.718476 68.120381-96.134095 0-61.391238-52.638476-103.594667-96.889905-112.518096z" p-id="4796" fill="#3461FF"></path></svg>
        </RouterLink>
      </div>
      <div class="service-list">
        <el-timeline type="left">
          <el-timeline-item
            v-for="(activity, index) in serviceFlow"
            :key="index"
            :title="activity.title"
            :hollow="true"
            size="large"
            type="primary"
            :placement="activity.placement"
            :direction="activity.direction"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 咨询按钮 -->
    <div class="sidebar-card consult-card">
      <h3>预约咨询 {{ source }}</h3>
      <p>想了解更多求职服务？立即咨询我们</p>
      <button class="btn btn-primary btn-block" @click="handleConsult">立即咨询</button>
    </div>

    <!-- 相关案例 -->
    <div class="sidebar-card related-cases">
      <h3>相关案例</h3>
      <div class="related-list">
        <RouterLink
          v-for="item in relatedCases"
          :key="item.id"
          :to="`/case-detail?id=${item.id}`"
          class="related-item"
        >
          <div class="related-image">
            <img :src="item.cover_image || defaultImage" alt="案例">
          </div>
          <div class="related-info">
            <h4>{{ item.title }}</h4>
            <span>{{ item.company }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 服务流程
const serviceFlow = [
  {
    title: '1ssfas',
    content: '报名加入',
    placement: 'bottom',
    direction: 'left',
  },
  {
    title: '2',
    content: '进行职业规划',
    placement: 'bottom',
    direction: 'right',
  },
  {
    title: '3',
    content: '开展简历优化',
    placement: 'bottom',
    direction: 'left',
  },
  {
    title: '4',
    content: '接受面试辅导',
    placement: 'bottom',
    direction: 'right',
  },
  {
    title: '5',
    content: '享受简历代投服务',
    placement: 'bottom',
    direction: 'left',
  },
  {
    title: '6',
    content: '获取网申资源',
    placement: 'bottom',
    direction: 'right',
  },
  {
    title: '7',
    content: '参与名企直推',
    placement: 'bottom',
    direction: 'left',
  },
  {
    title: '8',
    content: '获得谈薪辅导',
    placement: 'bottom',
    direction: 'right',
  },
  {
    title: '9',
    content: '进行Offer/合同避雷指导',
    placement: 'bottom',
    direction: 'left',
  },
  {
    title: '10',
    content: '接受入职辅导',
    placement: 'bottom',
    direction: 'right',
  }
]

interface CaseItem {
  id: number
  title: string
  company: string
  cover_image?: string,

}

interface Props {
  relatedCases?: CaseItem[],
  source?: string
}

const props = withDefaults(defineProps<Props>(), {
  relatedCases: () => [],
  source: ''
})

const emit = defineEmits<{
  consult: []
}>()

const defaultImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 60%27%3E%3Crect width=%27100%27 height=%2760%27 fill=%27%23f0f4f8%27/%3E%3C/svg%3E'

function handleConsult() {
  emit('consult')
}
</script>

<style scoped>
@import "@/assets/styles/components/CaseSidebar.css";
</style>
