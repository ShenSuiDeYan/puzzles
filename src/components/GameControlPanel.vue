<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSoundManager } from '../composables/useSoundManager'
import DifficultySelector from './DifficultySelector.vue'
import ImageSelector from './ImageSelector.vue'
import ActionButtons from './ActionButtons.vue'

const gameStore = useGameStore()
const { playClick } = useSoundManager()

// 本地选择状态
const selectedDifficulty = ref('easy')
const selectedImageId = ref(1)

// 标记是否选择了惊喜图片
const isSurpriseSelected = ref(false)

// 开始/切换游戏
function handleStartGame() {
  playClick() // 播放点击音效
  
  // 如果选择了惊喜图片但未选择难度，则随机选择一个难度
  if (isSurpriseSelected.value && selectedDifficulty.value === 'easy') {
    const difficultyKeys = Object.keys(gameStore.difficultyConfig)
    const randomDifficulty = difficultyKeys[Math.floor(Math.random() * difficultyKeys.length)]
    selectedDifficulty.value = randomDifficulty
  }
  
  gameStore.switchPuzzle(selectedDifficulty.value, selectedImageId.value)
  
  // 重置惊喜选择状态
  isSurpriseSelected.value = false
}

// 更新难度选择
function onDifficultyChange(difficulty) {
  selectedDifficulty.value = difficulty
  
  // 如果已经选择了惊喜图片，且用户选择了难度，则立即开始游戏
  if (isSurpriseSelected.value) {
    handleStartGame()
  }
}

// 更新图片选择
function onImageChange(imageId) {
  selectedImageId.value = imageId
  // 普通图片：重置惊喜选择状态
  isSurpriseSelected.value = false
}

// 处理惊喜图片被选中事件
function onSurpriseSelected() {
  isSurpriseSelected.value = true
  selectedImageId.value = 6

  // 如果已经选择了难度且不是默认的 easy，则立即开始游戏
  // 如果是 easy，则让用户先选择难度或点击开始按钮
  if (selectedDifficulty.value !== 'easy') {
    handleStartGame()
  }
}
</script>

<template>
  <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
    <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
      <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      游戏设置
    </h2>

    <div class="space-y-8">
      <!-- 难度选择器 -->
      <DifficultySelector
        :selected="selectedDifficulty"
        @change="onDifficultyChange"
      />

      <!-- 图片选择器 -->
      <ImageSelector
        :selected="selectedImageId"
        @change="onImageChange"
        @surprise-selected="onSurpriseSelected"
      />

      <!-- 分隔线 -->
      <div class="border-t border-white/20"></div>

      <!-- 操作按钮 -->
      <ActionButtons
        :is-game-active="gameStore.isGameActive"
        :is-game-completed="gameStore.isGameCompleted"
        @start="handleStartGame"
        @reset="gameStore.resetGame()"
        @pause="gameStore.togglePause()"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
