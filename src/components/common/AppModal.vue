<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  visible: boolean
  title?: string
  width?: string
  closeOnClickOverlay?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}>()

function close() {
  emit('update:visible', false)
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    console.log('modal show', val)
    // document.body.style.overflow = 'hidden'
    document.body.style.overflow = ''
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay active" @click="close">
      <div
        class="modal"
        :style="{ maxWidth: width || '500px' }"
        @click.stop
      >
        <div v-if="title" class="modal-header">
          <h3>{{ title }}</h3>
          <button class="modal-close" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* 全局样式 - 用于 Teleport 到 body 的元素 */
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 999999 !important;
}

.modal {
  background: #ffffff !important;
  border-radius: 16px !important;
  width: 100% !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.modal-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 20px 24px !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.modal-header h3 {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #1e293b !important;
  margin: 0 !important;
}

.modal-close {
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 24px !important;
  color: #64748b !important;
  border-radius: 50% !important;
  background: none !important;
  border: none !important;
  cursor: pointer !important;
}

.modal-close:hover {
  background: #f1f5f9 !important;
  color: #1e293b !important;
}

.modal-body {
  padding: 24px !important;
  max-height: 70vh !important;
  overflow-y: auto !important;
}

.modal-body::-webkit-scrollbar {
  display: none !important;
}

</style>
