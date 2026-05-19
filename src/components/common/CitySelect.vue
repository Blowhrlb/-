<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from './AppModal.vue'
import { getCityList } from '@/api'

interface City {
  value: string
  label: string
  pinyin: string
  pinyin_prefix: string
  province_id: number
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', city: City): void
}>()

const searchKeyword = ref('')
const cityList = ref<City[]>([])
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// 按字母分组的城市
const groupedCities = computed(() => {
  const groups: Record<string, City[]> = {}
  const keyword = searchKeyword.value.toLowerCase().trim()

  // 如果有搜索关键词,过滤城市
  let filtered = cityList.value
  if (keyword) {
    filtered = cityList.value.filter(city => {
      // 匹配城市名
      if (city.label.toLowerCase().includes(keyword)) return true
      // 匹配拼音全拼
      if (city.pinyin.toLowerCase().includes(keyword)) return true
      // 匹配拼音首字母
      if (city.pinyin_prefix.toLowerCase().includes(keyword)) return true
      return false
    })
  }

  // 按首字母分组
  filtered.forEach(city => {
    const letter = city.pinyin_prefix.charAt(0).toUpperCase()
    if (!groups[letter]) {
      groups[letter] = []
    }
    groups[letter].push(city)
  })

  // 转换为排序后的数组
  return Object.keys(groups)
    .sort()
    .map(letter => ({
      letter,
      cities: groups[letter]
    }))
})

// 热门城市(取前10个)
const hotCities = computed(() => cityList.value.slice(0, 10))

// 高亮匹配的字符
function highlightMatch(text: string, keyword: string) {
  if (!keyword) return text
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const index = lowerText.indexOf(lowerKeyword)
  if (index === -1) return text

  return text.substring(0, index) +
    `<mark>${text.substring(index, index + keyword.length)}</mark>` +
    text.substring(index + keyword.length)
}

function selectCity(city: City) {
  emit('select', city)
  emit('update:visible', false)
  searchKeyword.value = ''
}

function handleClose() {
  emit('update:visible', false)
  searchKeyword.value = ''
}

// 监听弹窗打开,聚焦输入框
watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  }
})

// 获取城市列表
async function fetchCities() {
  loading.value = true
  try {
    const res = await getCityList()
    cityList.value = res || []
  } catch (error) {
    console.error('获取城市列表失败:', error)
    cityList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCities()
})
</script>

<template>
  <AppModal
    :visible="visible"
    title="选择城市"
    width="auto"
    @update:visible="handleClose"
  >
    <div class="city-select">
      <!-- 搜索框 -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref="inputRef"
          v-model="searchKeyword"
          type="text"
          placeholder="输入城市名或拼音首字母搜索..."
          class="search-input"
        />
        <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">×</button>
      </div>

      <!-- 热门城市 -->
      <div v-if="!searchKeyword" class="hot-cities">
        <div class="section-title">热门城市</div>
        <div class="hot-list">
          <span
            v-for="city in hotCities"
            :key="city.value"
            class="hot-item"
            @click="selectCity(city)"
          >
            {{ city.label }}
          </span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>

      <!-- 城市列表 -->
      <div v-else-if="groupedCities.length > 0" class="city-list">
        <div
          v-for="group in groupedCities"
          :key="group.letter"
          class="city-group"
        >
          <div class="letter-tag">{{ group.letter }}</div>
          <div class="city-items">
            <span
              v-for="city in group.cities"
              :key="city.value"
              class="city-item"
              @click="selectCity(city)"
              v-html="highlightMatch(city.label, searchKeyword)"
            />
          </div>
        </div>
      </div>

      <!-- 无结果 -->
      <div v-else class="empty-state">
        <span>未找到匹配的城市</span>
      </div>
    </div>
  </AppModal>
</template>

<style scoped>
.city-select {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 20px;
}


/* 搜索框 */
.search-box {
  position: relative;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 38px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  height: 40px;
}

.search-input:focus {
  border-color: #6bb142;
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #c0c4cc;
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: #909399;
}

/* 热门城市 */
.hot-cities {
  margin-bottom: 20px;
}

.section-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 500;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-item {
  padding: 6px 14px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-item:hover {
  background: #6bb142;
  color: #fff;
}

/* 城市列表 */
.city-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.city-list::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.city-group {
  margin-bottom: 16px;
}

.letter-tag {
  position: sticky;
  top: 0;
  background: #f8fafc;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6bb142;
  margin-bottom: 8px;
}

.city-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 8px;
}

.city-item {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.city-item:hover {
  background: #6bb142;
  color: #fff;
  border-color: #6bb142;
}

.city-item :deep(mark) {
  background: #fbbf24;
  color: #000;
  padding: 0 2px;
  border-radius: 2px;
}

/* 状态 */
.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #94a3b8;
  font-size: 14px;
}
</style>
