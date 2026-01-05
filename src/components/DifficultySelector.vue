<script setup>
import { useGameStore } from '../stores/gameStore'
import { useSoundManager } from '../composables/useSoundManager'

const props = defineProps({
  selected: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change'])

const gameStore = useGameStore()
const { playClick } = useSoundManager()

function selectDifficulty(difficulty) {
  playClick() // 播放点击音效
  emit('change', difficulty)
}
</script>

<template>
  <div>
    <label class="block text-white/80 text-base font-medium mb-4">
      选择难度
    </label>
    <div class="grid grid-cols-5 gap-3">
      <button
        v-for="(_, key) in gameStore.difficultyConfig"
        :key="key"
        @click="selectDifficulty(key)"
        class="py-4 px-3 rounded-lg text-base font-medium transition-all duration-200"
        :class="selected === key
          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'"
      >
        <div class="text-center">
          <div class="font-bold text-lg">{{
            key === 'easy' ? '简单' :
            key === 'medium' ? '中等' :
            key === 'hard' ? '困难' :
            key === 'expert' ? '专家' : '大师'
          }}</div>
          <div class="text-sm opacity-70 mt-1">{{ gameStore.difficultyConfig[key].gridSize }}x{{ gameStore.difficultyConfig[key].gridSize }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
