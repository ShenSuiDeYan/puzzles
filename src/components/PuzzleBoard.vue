<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSoundManager } from '../composables/useSoundManager'

const gameStore = useGameStore()
const { playClick } = useSoundManager()

// 计算拼图块大小
const tileSize = computed(() => {
  const baseSize = 600 // 拼图区域基础大小（增大）
  return baseSize / gameStore.gridSize
})

// 计算背景位置
function getTileStyle(tile) {
  if (tile.isEmpty) return {}

  const size = gameStore.gridSize
  const baseSize = 600 // 拼图区域基础大小
  const tileSize = baseSize / size

  const correctRow = Math.floor(tile.correctIndex / size)
  const correctCol = tile.correctIndex % size

  return {
    backgroundImage: `url(${gameStore.currentImageUrl})`,
    backgroundSize: `${baseSize}px ${baseSize}px`, // 固定背景大小，确保图片完整显示
    backgroundPosition: `-${correctCol * tileSize}px -${correctRow * tileSize}px`, // 使用像素精确定位
    backgroundRepeat: 'no-repeat'
  }
}

// 获取拼图块位置
function getTilePosition(currentIndex) {
  const size = gameStore.gridSize
  const row = Math.floor(currentIndex / size)
  const col = currentIndex % size
  
  return {
    transform: `translate(${col * 100}%, ${row * 100}%)`
  }
}

// 点击拼图块
function handleTileClick(tile) {
  if (!tile.isEmpty) {
    // 播放点击音效
    playClick()
    gameStore.onTileClick(tile.currentIndex)
  }
}

// 检查是否可以移动（与空白块相邻）
function canMove(tile) {
  if (tile.isEmpty || !gameStore.isGameActive || gameStore.isGameCompleted) return false
  return gameStore.isAdjacent(tile.currentIndex, gameStore.emptyIndex)
}
</script>

<template>
  <div class="puzzle-container">
    <!-- 游戏未开始提示 -->
    <div
      v-if="!gameStore.isGameActive && !gameStore.isGameCompleted && gameStore.tiles.length === 0"
      class="w-[600px] h-[600px] rounded-2xl bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 flex items-center justify-center"
    >
      <div class="text-center px-8">
        <div class="text-6xl mb-5">🧩</div>
        <p class="text-white/80 text-xl">选择难度和图片</p>
        <p class="text-white/60 text-base mt-2">然后点击"开始游戏"</p>
      </div>
    </div>

    <!-- 拼图画布 -->
    <div
      v-else
      class="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
    >
      <!-- 原图预览按钮 -->
      <div class="absolute -top-4 -right-4 z-10">
        <div class="group relative">
          <button class="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
          <!-- 原图预览弹出层 -->
          <div class="absolute right-0 top-full mt-2 hidden group-hover:block">
            <div class="bg-black/90 rounded-lg p-3 shadow-xl max-w-sm">
              <div class="flex justify-center">
                <img
                  :src="gameStore.currentImageUrl"
                  alt="原图"
                  class="max-w-full max-h-80 object-contain rounded-lg"
                  style="max-width: 320px; max-height: 320px;"
                />
              </div>
              <p class="text-center text-white/60 text-sm mt-2">原图预览</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 拼图网格 -->
      <div
        class="relative overflow-hidden rounded-lg"
        :style="{
          width: '600px',
          height: '600px'
        }"
      >
        <div
          v-for="tile in gameStore.tiles"
          :key="tile.id"
          class="absolute transition-all duration-200 ease-out cursor-pointer"
          :class="{
            'opacity-0': tile.isEmpty,
            'hover:z-10 hover:scale-105': canMove(tile),
            'ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent': canMove(tile)
          }"
          :style="{
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            ...getTilePosition(tile.currentIndex),
            ...getTileStyle(tile)
          }"
          @click="handleTileClick(tile)"
        >
        </div>
      </div>

      <!-- 暂停遮罩 -->
      <div
        v-if="gameStore.tiles.length > 0 && !gameStore.isGameActive && !gameStore.isGameCompleted"
        class="absolute inset-4 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-5xl mb-3">⏸️</div>
          <p class="text-white text-xl">游戏暂停</p>
          <button
            @click="gameStore.togglePause()"
            class="mt-5 px-6 py-3 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors text-lg"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.puzzle-container {
  perspective: 1000px;
}
</style>
