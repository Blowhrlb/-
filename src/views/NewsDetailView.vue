<template>
  <div class="news-detail-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
      </div>
    </section>

    <!-- Main Content -->
    <section class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Article Section -->
          <article class="article">
            <header class="article-header">
              <h1>{{ newsDetail.title }}</h1>
              <div class="article-meta">
                <span class="category">{{ newsDetail.source }}</span>
                <span class="time">{{ newsDetail.created_at }}</span>
                <span class="views">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ newsDetail.views }}次阅读
                </span>
              </div>
            </header>

            <div class="tags">
              <span v-for="tag in newsDetail.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="article-body" v-html="newsDetail.content"></div>

            <!-- <footer class="article-footer">
              
              <div class="actions">
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  收藏
                </button>
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  分享
                </button>
              </div>
            </footer> -->
          </article>

          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Hot News -->
            <div class="sidebar-section hot-news">
              <h3 class="sidebar-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2c.5 0 1 .2 1.4.5l5.5 4.5c.4.3.6.8.6 1.3V20a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V8.3c0-.5.2-1 .6-1.3l5.5-4.5c.4-.3.9-.5 1.4-.5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                热门资讯
              </h3>
              <ul class="news-list">
                <li v-for="(news, index) in hotNews" :key="news.id">
                  <RouterLink :to="`/news/${news.id}`" :key="news.id" class="news-item">
                    <span class="rank" :class="{ 'top': index < 3 }">{{ index + 1 }}</span>
                    <span class="title">{{ news.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </div>

            <!-- Latest News -->
            <div class="sidebar-section latest-news">
              <h3 class="sidebar-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                最新资讯
              </h3>
              <ul class="news-list">
                <li v-for="news in latestNews" :key="news.id">
                  <RouterLink :to="`/news/${news.id}`" :key="news.id" class="news-item">
                    <span class="dot"></span>
                    <span class="title">{{ news.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <div class="nav-item prev" :class="{ disabled: !prevArticle.id }">
            <span class="label">上一条：</span>
            <RouterLink v-if="prevArticle.id" :to="`/news/${prevArticle.id}`">
              {{ prevArticle.title }}
            </RouterLink>
            <span v-else class="no-link">没有了</span>
          </div>
          <div class="nav-item next" :class="{ disabled: !nextArticle.id }">
            <span class="label">下一条：</span>
            <RouterLink v-if="nextArticle.id" :to="`/news/${nextArticle.id}`">
              {{ nextArticle.title }}
            </RouterLink>
            <span v-else class="no-link">没有了</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '@/api'

const route = useRoute()
const newsId = ref(0)

// 新闻详情
const newsDetail = ref<any>({
  id: 0,
  title: '',
  source: '',
  time: '',
  views: 0,
  content: '',
  tags: []
})

const relatedNews = ref<any[]>([])
const hotNews = ref<any[]>([])
const latestNews = ref<any[]>([])
const prevArticle = ref<any>({ id: 0, title: '' })
const nextArticle = ref<any>({ id: 0, title: '' })

/**
 * 获取资讯详情
 * @param id
 */
async function fetchNewsDetail(id: number) {
  try {
    const res: any = await api.newsDetail(id)
    if (res) {
      newsDetail.value = res
      // 从返回数据中获取上一条下一条
      prevArticle.value = res.prev || { id: 0, title: '' }
      nextArticle.value = res.next || { id: 0, title: '' }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取热门资讯
 */
async function fetchHotNews() {
  try {
    const res: any = await api.newsHot({ limit: 5 })
    if (res) {
      hotNews.value = res
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取最新资讯
 */
async function fetchLatestNews() {
  try {
    const res: any = await api.newsLatest({ limit: 5 })
    if (res) {
      latestNews.value = res
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  newsId.value = Number(route.params.id) || 1
  await fetchNewsDetail(newsId.value)
  await fetchHotNews()
  await fetchLatestNews()
})

// 监听路由参数变化，重新获取数据
watch(() => route.params.id, (newId) => {
  const id = Number(newId) || 1
  if (id !== newsId.value) {
    newsId.value = id
    fetchNewsDetail(id)
  }
})

</script>

<style scoped>
  @import "@/assets/styles/NewsDetailView.css";
</style>
