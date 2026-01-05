<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function startGame() {
  router.push('/game')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center" style="background-image: url('/images/background-image.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 bg-black/20"></div>
    
    <!-- 主内容 -->
    <div class="relative z-10 text-center px-6 max-w-6xl mx-auto">
      <!-- 标题 -->
      <div class="mb-12">
        <h1 class="text-7xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-6">
          拼图游戏
        </h1>
        <p class="text-2xl md:text-3xl text-gray-300 font-medium">
          挑战你的思维，完成精美拼图
        </p>
      </div>

      <!-- 游戏特性 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
          <div class="text-5xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-white mb-3">多种难度</h3>
          <p class="text-gray-400 text-base">3x3 / 4x4 / 5x5 自由选择</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
          <div class="text-5xl mb-4">🖼️</div>
          <h3 class="text-xl font-semibold text-white mb-3">精美图片</h3>
          <p class="text-gray-400 text-base">多种风景图片可供选择</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-xl font-semibold text-white mb-3">记录追踪</h3>
          <p class="text-gray-400 text-base">保存你的最佳成绩</p>
        </div>
      </div>

      <!-- 开始按钮 -->
      <button
        @click="startGame"
        class="group relative px-16 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-2xl font-bold text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
      >
        <span class="relative z-10">开始游戏</span>
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <!-- 提示文字 -->
      <p class="mt-12 text-gray-500 text-lg">
        点击开始，选择难度和图片即可游戏
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
