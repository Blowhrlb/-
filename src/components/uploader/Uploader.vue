<script setup lang="ts">
import { ref } from 'vue'
import { fileUpload } from '@/api'
import { useUserStore } from '@/store'

// 组件属性
const props = defineProps<{
  accept?: string
  maxSize?: number // MB
  multiple?: boolean
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'success', files: Array<{ url: string; fileName: string; originalName: string }>): void
  (e: 'error', error: string): void
  (e: 'progress', progress: number): void
}>()

// 响应式状态
const isDragover = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const selectedFiles = ref<File[]>([])
const uploadedResults = ref<Array<{ url: string; fileName: string; originalName: string }>>([])
const errorMessage = ref('')

// 默认配置
const defaultAccept = '.xlsx,.xls,.csv,.doc,.docx,.pdf,.png,.jpg,.jpeg'
const defaultMaxSize = 10

// 获取接受的文件类型
const acceptTypes = computed(() => props.accept || defaultAccept)

// 获取最大文件大小(MB)
const maxSizeMB = computed(() => props.maxSize || defaultMaxSize)

// 验证文件
function validateFile(file: File): string | null {
  // 检查文件大小
  const maxBytes = maxSizeMB.value * 1024 * 1024
  if (file.size > maxBytes) {
    return `文件大小不能超过 ${maxSizeMB.value}MB`
  }
  return null
}

// 处理拖拽
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (!isUploading.value) {
    isDragover.value = true
  }
}

function handleDragLeave() {
  isDragover.value = false
}

// 处理文件拖放
function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragover.value = false

  if (isUploading.value) return

  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

// 处理文件选择
function handleFileSelect(e: Event) {
  if (isUploading.value) return

  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)

  // 重置 input 以便可以再次选择相同文件
  target.value = ''
}

// 处理文件
function processFiles(files: File[]) {
  errorMessage.value = ''
  selectedFiles.value = []
  uploadedResults.value = []

  // 过滤并验证文件
  const validFiles: File[] = []
  for (const file of files) {
    const error = validateFile(file)
    if (error) {
      errorMessage.value = error
      return
    }
    validFiles.push(file)
  }

  if (validFiles.length === 0) return

  selectedFiles.value = props.multiple ? validFiles : [validFiles[0]]

  // 如果是多选但只选了一个，或者设置了自动上传
  // 这里先选择文件，等待用户点击上传按钮
}

// 开始上传
async function startUpload() {
  if (selectedFiles.value.length === 0) return

  isUploading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''

  // 获取用户信息
  const userStore = useUserStore()
  const userId = (userStore.user as any)?.id || 0

  try {
    const files = selectedFiles.value
    const total = files.length
    let completed = 0

    for (const file of files) {
      // 验证文件名：必须是.xlsx扩展名，且以"批量候选人信息导入模板"开头
      const fileName = file.name
      const validPrefix = '批量候选人信息导入'

      // 检查文件大小不能超过10MB
      const maxBytes = maxSizeMB.value * 1024 * 1024
      if (file.size > maxBytes) {
        errorMessage.value = `文件 "${fileName}" 大小不能超过 ${maxSizeMB.value}MB`
        emit('error', errorMessage.value)
        isUploading.value = false
        return
      }

      // 检查扩展名
      if (!fileName.toLowerCase().endsWith('.xlsx')) {
        errorMessage.value = `文件 "${fileName}" 必须是 .xlsx 格式`
        emit('error', errorMessage.value)
        isUploading.value = false
        return
      }

      // 检查文件名开头
      if (!fileName.startsWith(validPrefix)) {
        errorMessage.value = `文件 "${fileName}" 必须以"${validPrefix}"开头`
        emit('error', errorMessage.value)
        isUploading.value = false
        return
      }

      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)
      // 传递用户ID
      if (userId) {
        formData.append('user_id', userId)
      }
      // 调用后端上传接口
      const res = await fileUpload(formData)
      uploadedResults.value.push({
        url: res.file_url,
        fileName: res.file_name || file.name,
        originalName: res.original_name || file.name
      })

      completed++
      // 计算进度
      const currentProgress = (completed / total) * 100
      uploadProgress.value = currentProgress
      emit('progress', currentProgress)
    }

    // 上传完成
    emit('success', uploadedResults.value)
    selectedFiles.value = []
  } catch (error: any) {
    console.error('上传失败：', error)
    errorMessage.value = error.message || '上传失败，请重试'
    emit('error', error.message || '上传失败')
  } finally {
    isUploading.value = false
  }
}

// 移除文件
function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

// 清空所有
function clearAll() {
  selectedFiles.value = []
  uploadedResults.value = []
  errorMessage.value = ''
  uploadProgress.value = 0
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

import { computed } from 'vue'
</script>

<template>
  <div class="oss-uploader">
    <!-- 上传区域 -->
    <div
      class="upload-area"
      :class="{
        'dragover': isDragover,
        'uploading': isUploading,
        'has-file': selectedFiles.length > 0
      }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- 空状态 -->
      <template v-if="selectedFiles.length === 0">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p class="upload-text">
          将文件拖拽到此处，或
          <label for="ossFileInput" class="upload-link">点击选择文件</label>
        </p>
        <p class="upload-hint">
          支持 {{ acceptTypes }}，单个文件不超过 {{ maxSizeMB }}MB
        </p>
        <input
          type="file"
          id="ossFileInput"
          :accept="acceptTypes"
          :multiple="multiple"
          hidden
          @change="handleFileSelect"
        >
      </template>

      <!-- 已选择文件 -->
      <template v-if="selectedFiles.length > 0 && !isUploading">
        <div class="file-list">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="file-item"
          >
            <div class="file-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <button class="file-remove" @click="removeFile(index)" v-if="multiple || selectedFiles.length > 1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="upload-actions">
          <button class="btn btn-outline btn-sm" @click="clearAll">重新选择</button>
          <button class="btn btn-primary" @click="startUpload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:8px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            上传到云端
          </button>
        </div>
      </template>

      <!-- 上传中 -->
      <template v-if="isUploading">
        <div class="upload-progress">
          <div class="progress-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="progress-info">
            <span class="progress-text">正在上传到云端...</span>
            <div class="progress-bar-wrapper">
              <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span class="progress-percent">{{ Math.round(uploadProgress) }}%</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      {{ errorMessage }}
    </div>

    <!-- 已上传文件列表 -->
    <div v-if="uploadedResults.length > 0" class="uploaded-list">
      <div class="upload-success">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span class="success-text">上传成功，请稍后查看评估结果。</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oss-uploader {
  width: 100%;
}

.upload-area {
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover,
.upload-area.dragover {
  border-color: #6bb142;
  background: rgba(37, 99, 235, 0.03);
}

.upload-area.uploading {
  border-color: #10b981;
  background: #f0fdf4;
  cursor: default;
}

.upload-area.has-file {
  border-color: #10b981;
  border-style: solid;
  padding: 24px;
  background: #fff;
}

.upload-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon svg {
  width: 36px;
  height: 36px;
  color: #6bb142;
}

.upload-text {
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 8px;
}

.upload-link {
  color: #6bb142;
  cursor: pointer;
  font-weight: 500;
}

.upload-link:hover {
  text-decoration: underline;
}

.upload-hint {
  font-size: 13px;
  color: #64748b;
}

/* 文件列表 */
.file-list {
  text-align: left;
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon svg {
  width: 20px;
  height: 20px;
  color: #059669;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #64748b;
}

.file-remove {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.file-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.file-remove svg {
  width: 16px;
  height: 16px;
}

/* 上传按钮 */
.upload-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: #6bb142;
  color: white;
}

.btn-primary:hover {
  background: #568e34;
}

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #6bb142;
  color: #6bb142;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

/* 上传进度 */
.upload-progress {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.progress-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

.progress-icon svg {
  width: 24px;
  height: 24px;
  color: #10b981;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.progress-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-text {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.progress-bar-wrapper {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.2s ease;
}

.progress-percent {
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 已上传列表 */
.uploaded-list {
  margin-top: 20px;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 12px;
  border: 1px solid #10b981;
}

.upload-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.success-icon {
  width: 32px;
  height: 32px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 18px;
  height: 18px;
  color: #10b981;
}

.success-text {
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
}
</style>
