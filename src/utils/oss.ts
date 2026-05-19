/**
 * 阿里云OSS上传工具函数
 */

// OSS配置
const OSS_CONFIG = {
  accessKeyId: 'YOUR_OSS_ACCESS_KEY_ID',
  accessKeySecret: 'YOUR_OSS_ACCESS_KEY_SECRET',
  endpoint: 'oss-cn-beijing.aliyuncs.com',
  bucket: 'chuifeng',
  domain: 'http://chuifeng.oss-cn-beijing.aliyuncs.com'
}

// 生成随机文件名
export function generateFileName(originalName: string): string {
  const ext = originalName.substring(originalName.lastIndexOf('.'))
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `uploads/${timestamp}-${random}${ext}`
}

// 获取OSS完整URL
export function getOssUrl(fileName: string): string {
  return `${OSS_CONFIG.domain}/${fileName}`
}

// 上传文件到OSS（使用表单上传方式）
export async function uploadToOss(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; fileName: string }> {
  const fileName = generateFileName(file.name)

  // 获取签名
  const signature = await getSignature(fileName, file.type)

  // 构建表单数据
  const formData = new FormData()
  formData.append('key', fileName)
  formData.append('OSSAccessKeyId', OSS_CONFIG.accessKeyId)
  formData.append('policy', signature.policy)
  formData.append('signature', signature.signature)
  formData.append('success_action_status', '200')
  formData.append('file', file)

  // 上传文件
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100)
        onProgress(progress)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve({
          url: getOssUrl(fileName),
          fileName: fileName
        })
      } else {
        reject(new Error('上传失败'))
      }
    }

    xhr.onerror = () => reject(new Error('网络错误'))

    xhr.open('POST', `https://${OSS_CONFIG.bucket}.${OSS_CONFIG.endpoint}`)
    xhr.send(formData)
  })
}

// 获取签名信息（需要后端接口，这里使用前端计算方式）
async function getSignature(fileName: string, contentType: string): Promise<{
  policy: string
  signature: string
}> {
  const date = new Date()
  date.setHours(date.getHours() + 1)

  const policyText = JSON.stringify({
    expiration: date.toISOString(),
    conditions: [
      { bucket: OSS_CONFIG.bucket },
      ['starts-with', '$key', fileName.substring(0, fileName.lastIndexOf('/') + 1)],
      { 'content-type': contentType },
      ['content-length-range', 0, 104857600] // 100MB
    ]
  })

  const policy = btoa(policyText)
  const signature = await calculateSignature(policy)

  return { policy, signature }
}

// 计算签名
async function calculateSignature(policy: string): Promise<string> {
  const crypto = await import('crypto-js')
  return crypto.HmacSHA1(policy, OSS_CONFIG.accessKeySecret).toString(crypto.enc.Base64)
}

// 上传多个文件
export async function uploadMultipleToOss(
  files: File[],
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<Array<{ url: string; fileName: string }>> {
  const results: Array<{ url: string; fileName: string }> = []

  for (let i = 0; i < files.length; i++) {
    const result = await uploadToOss(files[i], (progress) => {
      if (onProgress) {
        const totalProgress = ((i + progress / 100) / files.length) * 100
        onProgress(totalProgress, i + 1, files.length)
      }
    })
    results.push(result)
  }

  return results
}
