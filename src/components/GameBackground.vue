<script setup>
import { ref, onMounted, watch } from 'vue'

const videoRef = ref(null)
const isVideoPlaying = ref(true)
const isVideoAudioMuted = ref(false)

function toggleVideo() {
  if (videoRef.value) {
    if (isVideoPlaying.value) {
      // 当前正在播放，需要暂停
      videoRef.value.pause()
      isVideoPlaying.value = false
    } else {
      // 当前已暂停，需要播放
      videoRef.value.play().then(() => {
        isVideoPlaying.value = true
      }).catch(e => {
        console.log('Play failed:', e)
      })
    }
  }
  // 发送状态更新事件
  sendVideoState()
}

function toggleAudio() {
  isVideoAudioMuted.value = !isVideoAudioMuted.value
  if (videoRef.value) {
    videoRef.value.muted = isVideoAudioMuted.value
  }
  
  // 确保更新后的静音状态立即生效
  if (!isVideoAudioMuted.value && videoRef.value.paused) {
    // 如果取消静音且视频已暂停，需要重新播放以应用音频设置
    videoRef.value.play().catch(e => {
      console.log('Audio unmute play failed:', e)
    })
  }
}

// 发送视频状态给其他组件
function sendVideoState() {
  const event = new CustomEvent('backgroundVideoState', {
    detail: { playing: isVideoPlaying.value }
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  // 自动播放视频（在某些浏览器中可能需要用户交互）
  if (videoRef.value) {
    videoRef.value.muted = false // 默认不禁音
    videoRef.value.play().then(() => {
      isVideoPlaying.value = true
      sendVideoState()
    }).catch(e => {
      console.log('Autoplay prevented:', e)
    })
  }
  
  // 监听来自其他组件的视频控制事件
  window.addEventListener('toggleBackgroundVideo', (event) => {
    if (event.detail.playing !== isVideoPlaying.value) {
      toggleVideo()
    }
  })
})

// 监听音频静音状态变化，同步到视频元素
watch(isVideoAudioMuted, (newMuted) => {
  if (videoRef.value) {
    videoRef.value.muted = newMuted
  }
})

// 监听视频播放状态变化，同步到视频元素
watch(isVideoPlaying, (newPlaying) => {
  if (videoRef.value) {
    if (newPlaying && videoRef.value.paused) {
      videoRef.value.play().catch(e => {
        console.log('Play prevented:', e)
      })
    } else if (!newPlaying && !videoRef.value.paused) {
      videoRef.value.pause()
    }
  }
  // 发送状态更新事件
  sendVideoState()
})
</script>

<template>
  <div class="fixed inset-0 z-0">
    <!-- 视频背景 -->
    <video
      ref="videoRef"
      class="w-full h-full object-cover"
      loop
      playsinline
      :muted="isVideoAudioMuted"
    >
      <source src="/video/background-video.mp4" type="video/mp4" />
    </video>
    
    <!-- 暗色遮罩层 -->
    <div class="absolute inset-0 bg-black/50"></div>
    
    <!-- 渐变遮罩 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
    


    <!-- 备用渐变背景 -->
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
  </div>
</template>

<style scoped>
</style>
