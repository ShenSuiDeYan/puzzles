<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useRouter } from 'vue-router'
import { useSoundManager } from '../composables/useSoundManager'

const gameStore = useGameStore()
const router = useRouter()
const { isMuted, toggleMute, playClick } = useSoundManager()

const isBackgroundVideoPlaying = ref(true)

function goHome() {
  router.push('/')
}

// 播放点击音效并切换全局静音
function handleMuteToggle() {
  playClick()
  toggleMute()
}

// 切换背景视频播放状态
function toggleBackgroundVideo() {
  playClick()
  isBackgroundVideoPlaying.value = !isBackgroundVideoPlaying.value
  
  // 发送自定义事件给背景视频组件
  const event = new CustomEvent('toggleBackgroundVideo', { 
    detail: { playing: isBackgroundVideoPlaying.value }
  })
  window.dispatchEvent(event)
}

onMounted(() => {
  // 监听背景视频组件发送的状态更新
  window.addEventListener('backgroundVideoState', (event) => {
    isBackgroundVideoPlaying.value = event.detail.playing
  })
})
</script>

<template>
  <header class="relative z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
    <div class="container mx-auto px-6 py-5">
      <div class="flex items-center justify-between">
        <!-- 左侧：返回按钮和标题 -->
        <div class="flex items-center gap-5">
          <button
            @click="goHome"
            class="p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="返回首页"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-white">拼图游戏</h1>
        </div>
        
        <!-- 中间：游戏状态信息 -->
        <div class="flex items-center gap-8">
          <!-- 计时器 -->
          <div class="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-mono text-xl text-white min-w-[80px] text-center">
              {{ gameStore.formatTime(gameStore.elapsedTime) }}
            </span>
          </div>
          
          <!-- 步数 -->
          <div class="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span class="font-mono text-xl text-white min-w-[50px] text-center">
              {{ gameStore.moveCount }}
            </span>
            <span class="text-white/60 text-base">步</span>
          </div>
          
          <!-- 最佳记录 -->
          <div 
            v-if="gameStore.currentBestRecord"
            class="flex items-center gap-3 bg-yellow-500/20 rounded-xl px-5 py-3"
          >
            <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="text-white/80 text-base">
              {{ gameStore.formatTime(gameStore.currentBestRecord.bestTime) }} / {{ gameStore.currentBestRecord.leastMoves }}步
            </span>
          </div>
        </div>
        
        <!-- 右侧：游戏音效控制和难度标签 -->
        <div class="flex items-center gap-5">
          <!-- 背景视频控制按钮 -->
          <button
            @click="toggleBackgroundVideo"
            class="p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            :title="isBackgroundVideoPlaying ? '暂停背景视频' : '播放背景视频'"
          >
            <svg v-if="isBackgroundVideoPlaying" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          <!-- 游戏音效控制按钮 -->
          <button
            @click="handleMuteToggle"
            class="p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="切换游戏音效"
          >
            <svg v-if="!isMuted" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </button>
          
          <span 
            v-if="gameStore.isGameActive"
            class="px-4 py-2 rounded-full text-base font-medium"
            :class="{
              'bg-green-500/30 text-green-300': gameStore.currentDifficulty === 'easy',
              'bg-yellow-500/30 text-yellow-300': gameStore.currentDifficulty === 'medium',
              'bg-orange-500/30 text-orange-300': gameStore.currentDifficulty === 'hard',
              'bg-red-500/30 text-red-300': gameStore.currentDifficulty === 'expert',
              'bg-purple-500/30 text-purple-300': gameStore.currentDifficulty === 'master'
            }"
          >
            {{ gameStore.difficultyConfig[gameStore.currentDifficulty]?.label }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
