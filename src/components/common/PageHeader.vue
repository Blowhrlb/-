<template>
  <section
    class="page-header"
    :class="{ 'has-carousel': isCarousel }"
    :style="headerStyle"
  >
    <!-- Carousel Slides (only show when multiple images) -->
    <div v-if="isCarousel" class="header-carousel">
      <div v-for="(bg, index) in bgImages" :key="index" class="carousel-slide"
        :class="{ active: currentSlide === index }"
      >
        <el-image :src="bg" :height="height" :preview-src-list="bgImages" class="header-bg" fit="cover"></el-image>
      </div>
    </div>

    <!-- Single Background Image -->
    <!-- <div v-else class="header-bg" :style="{ backgroundImage: `url(${bgImages[0]})` }"></div> -->
    <div v-else>
      <el-image
        class="header-bg"
        :src="bgImages[0]"
        :height="height"
        :preview-src-list="bgImages"
        fit="cover"
      ></el-image>
    </div>

    <!-- Overlay -->
    <div class="header-overlay"></div>

    <!-- Content -->
    <div class="container">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>

    <!-- Carousel Dots (only show in carousel mode) -->
    <div v-if="isCarousel" class="carousel-dots">
      <span
        v-for="(bg, index) in bgImages"
        :key="index"
        class="dot"
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      ></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  title: string
  description?: string
  bgImage?: string
  bgImages?: string[]
  height?: string
  autoRotateInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  bgImage: '',
  bgImages: () => [],
  height: '400px',
  autoRotateInterval: 5000
})

// Determine if carousel mode (multiple images)
const isCarousel = computed(() => {
  return props.bgImages.length > 1
})

// Use bgImage if single image provided, otherwise use bgImages
const bgImages = computed(() => {
  if (props.bgImage) {
    return [props.bgImage]
  }
  return props.bgImages
})

// Current slide index
const currentSlide = ref(0)
let slideInterval: number | null = null

// Auto rotation
const startAutoRotate = () => {
  if (isCarousel.value && bgImages.value.length > 1) {
    slideInterval = window.setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % bgImages.value.length
    }, props.autoRotateInterval)
  }
}

const stopAutoRotate = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// Dynamic style for height
const headerStyle = computed(() => {
  return {
    height: props.height
  }
})

onMounted(() => {
  startAutoRotate()
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<style scoped>
@import "@/assets/styles/components/PageHeader.css";
</style>
