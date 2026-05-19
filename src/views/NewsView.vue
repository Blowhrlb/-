<template>
  <div class="news-page">
    <!-- Page Header -->
    <PageHeader
      title="就业资讯"
      description="最新求职动态，助你把握职场机遇"
      :bgImages="headerBackgrounds"
      height="450px"
    />

    <!-- News Section -->
    <section class="news-section">
      <div class="container">
        <div class="news-layout">
          <!-- 左侧边栏 -->
          <aside class="news-sidebar">
            <div class="sidebar-section">
              <h3>热门资讯</h3>
              <ul class="hot-list">
                <li v-for="item in hotNews" :key="item.id">
                  <RouterLink :to="`/news/${item.id}`">
                    <span class="hot-tag">热</span>
                    {{ item.title }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div class="sidebar-section">
              <h3>最新资讯</h3>
              <ul class="latest-list">
                <li v-for="item in latestNews" :key="item.id">
                  <RouterLink :to="`/news/${item.id}`">
                    <span class="date">{{ item.date }}</span>
                    {{ item.title }}
                  </RouterLink>
                </li>
              </ul>
            </div>

            <div class="sidebar-section">
              <h3>资讯标签</h3>
              <div class="tag-cloud">
                <a v-for="tag in newsTags" :key="tag" @click.stop="selectedTag(tag)" class="tag-btn">{{ tag }}</a>
              </div>
            </div>
          </aside>

          <!-- 右侧资讯列表 -->
          <main class="news-main">
            <div class="news-list">
              <RouterLink v-for="news in newsList" :key="news.id" :to="`/news/${news.id}`" class="news-item-link">
                <article class="news-item">
                  <div class="news-image">
                    <el-image v-if="news.cover_image" :src="news.cover_image" alt="资讯图片" fit="cover" lazy>
                    </el-image>
                    <div v-else class="image-slot">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 160v704h704V160zm-32-64h768a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32V128a32 32 0 0 1 32-32"></path><path fill="currentColor" d="M384 288q64 0 64 64t-64 64q-64 0-64-64t64-64M185.408 876.992l-50.816-38.912L350.72 556.032a96 96 0 0 1 134.592-17.856l1.856 1.472 122.88 99.136a32 32 0 0 0 44.992-4.864l216-269.888 49.92 39.936-215.808 269.824-.256.32a96 96 0 0 1-135.04 14.464l-122.88-99.072-.64-.512a32 32 0 0 0-44.8 5.952z"></path></svg>
                    </div>
                  </div>
                  <div class="news-content">
                    <div class="news-meta">
                      <span class="news-source">{{ news.source }}</span>
                      <span class="news-time">{{ news.time }}</span>
                    </div>
                    <h3>{{ news.title }}</h3>
                    <p class="news-desc">{{ news.desc }}</p>
                    <div class="news-tags">
                      <span v-for="tag in news.tags" :key="tag" class="tag" :class="{ 'tag-primary': tag === news.tags[0] }">{{ tag }}</span>
                    </div>
                    <span class="read-more">查看详情 ›</span>
                  </div>
                </article>
              </RouterLink>
            </div>

            <!-- 分页组件 -->
          <PaginationPage v-model:PaginationData="PaginationData" :loading="loading" source="news" @change="changePage"></PaginationPage>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PaginationPage from '@/components/common/PageModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import api from '@/api'

// Header 轮播图数据
const headerBackgrounds = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80'
]

// 加载状态
const loading = ref(false)

// 数据
const hotNews = ref(<any[]>([]))
const latestNews = ref<any[]>([])
const newsTags = ref<any[]>([])
const newsList = ref<any[]>([])


// 分页
const currentPage = ref(1)
const pageSize = 10

// 获取热门资讯
async function fetchHotNews() {
  try {
    const res:any = await api.newsHot({ limit: 5 })
    hotNews.value = res || []
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取最新资讯
 */
async function fetchLatestNews() {
  try {
    const res:any = await api.newsLatest({ limit: 5 })
    latestNews.value = res || []
  } catch (error) {
    console.error(error)
  }
}

// 获取资讯标签
async function fetchNewsTags() {
  try {
    const res:any = await api.newsTags()
    if (res) {
      newsTags.value = res || []
    }
  } catch (error) {
    console.error(error)
  }
}

async function selectedTag(tag: string) {
  console.log(tag)
  await fetchNewsList(tag)
}
/**
 * 下一页
 * @param page 
 */
async function changePage(page: number) {
  currentPage.value = page;
  await fetchNewsList();
}

const PaginationData = ref({});
// 获取资讯列表
async function fetchNewsList(tag:string = '') {
  loading.value = true
  try {
    let res:any = [];
    const params:any = {
        page: currentPage.value,
        limit: pageSize
      }
    if (tag) {
      params.tag = tag
    }
    res = await api.newsList(params)
    console.log(res)
    if (res && res.data) {
      newsList.value = res.data
      PaginationData.value = res.pagination;
    } else {
      console.log(res)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchHotNews(),
    fetchLatestNews(),
    fetchNewsTags(),
    fetchNewsList()
  ])
})
</script>

<style scoped>
  @import "@/assets/styles/NewsView.css";
</style>
