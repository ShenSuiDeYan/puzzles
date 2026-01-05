<script setup>
import { useSoundManager } from '../composables/useSoundManager'

const { playClick } = useSoundManager()

const props = defineProps({
  isGameActive: {
    type: Boolean,
    default: false
  },
  isGameCompleted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['start', 'reset', 'pause'])

// 播放点击音效
function handleClick() {
  playClick()
}

// 开始游戏处理
function handleStart() {
  handleClick()
  emit('start')
}

// 暂停/继续处理
function handlePause() {
  handleClick()
  emit('pause')
}

// 重置游戏处理
function handleReset() {
  handleClick()
  emit('reset')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 开始/切换游戏按钮 -->
    <button
      @click="handleStart"
      class="w-full py-5 rounded-xl font-bold text-xl transition-all duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
    >
      {{ isGameActive || isGameCompleted ? '切换拼图' : '开始游戏' }}
    </button>

    <!-- 游戏进行中的控制按钮 -->
    <div v-if="isGameActive || isGameCompleted" class="grid grid-cols-2 gap-4">
      <!-- 暂停/继续按钮 -->
      <button
        v-if="!isGameCompleted"
        @click="handlePause"
        class="py-4 rounded-xl font-medium transition-all duration-200 text-lg"
        :class="isGameActive
          ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
          : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'"
      >
        <div class="flex items-center justify-center gap-2">
          <svg v-if="isGameActive" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ isGameActive ? '暂停' : '继续' }}
        </div>
      </button>

      <!-- 重置按钮 -->
      <button
        @click="handleReset"
        class="py-4 rounded-xl font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-200 text-lg"
        :class="{ 'col-span-2': isGameCompleted }"
      >
        <div class="flex items-center justify-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          重新开始
        </div>
      </button>
    </div>

    <!-- 提示信息 -->
    <p class="text-center text-white/50 text-base">
      <template v-if="!isGameActive && !isGameCompleted">
        选择配置后点击开始游戏
      </template>
      <template v-else-if="isGameActive">
        点击相邻的拼图块进行移动
      </template>
      <template v-else>
        恭喜完成！试试其他难度吧
      </template>
    </p>
  </div>
</template>

<style scoped>
</style>
