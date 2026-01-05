<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSoundManager } from '../composables/useSoundManager'

const props = defineProps({
  selected: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change', 'surpriseSelected'])

const gameStore = useGameStore()
const { playClick } = useSoundManager()

// 惊喜图片的特殊处理
const surpriseImageId = 6
const clickCount = ref(0)
const lastClickTime = ref(0)
const showSurprise = ref(false)

// 过滤掉惊喜图片的可用图片列表
const filteredImages = computed(() => {
  return gameStore.availableImages.filter(image => image.id !== surpriseImageId)
})

// 获取惊喜图片信息
const surpriseImage = computed(() => {
  return gameStore.availableImages.find(image => image.id === surpriseImageId)
})

// 处理惊喜图片位置的点击
function handleSurpriseClick() {
  const now = Date.now()

  // 检查是否在2秒内连续点击
  if (now - lastClickTime.value < 2000) {
    clickCount.value++
  } else {
    clickCount.value = 1
  }

  lastClickTime.value = now

  // 播放特殊音效
  playClick()

  // 如果连续点击了5次
  if (clickCount.value >= 5) {
    showSurprise.value = true
    emit('surpriseSelected')
    clickCount.value = 0
  }
}

// 普通图片选择
function selectImage(imageId) {
  playClick() // 播放点击音效
  emit('change', imageId)
}
</script>

<template>
  <div>
    <label class="block text-white/80 text-base font-medium mb-4">
      选择图片
    </label>
    <div class="grid grid-cols-3 gap-3">
      <!-- 普通图片 -->
      <button
        v-for="image in filteredImages"
        :key="image.id"
        @click="selectImage(image.id)"
        class="relative aspect-square rounded-lg overflow-hidden transition-all duration-200"
        :class="selected === image.id
          ? 'ring-3 ring-purple-500 scale-105 shadow-lg'
          : 'ring-1 ring-white/20 hover:ring-white/40 hover:scale-102'"
      >
        <img
          :src="image.url"
          :alt="image.name"
          class="w-full h-full object-cover"
        />
        <!-- 选中标记 -->
        <div
          v-if="selected === image.id"
          class="absolute inset-0 bg-purple-500/30 flex items-center justify-center"
        >
          <svg class="w-9 h-9 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <!-- 图片名称 -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
          <span class="text-sm text-white/90">{{ image.name }}</span>
        </div>
      </button>

      <!-- 惊喜图片位置（默认透明不可见，触发后显示内容） -->
      <button
        @click="handleSurpriseClick"
        class="relative aspect-square rounded-lg overflow-hidden transition-all duration-200"
        :class="selected === surpriseImageId
          ? 'ring-3 ring-purple-500 scale-105 shadow-lg opacity-100'
          : 'ring-1 ring-white/20 hover:ring-white/40 hover:scale-102 opacity-0'"
      >
        <!-- 触发后显示惊喜图片 -->
        <img
          v-if="showSurprise"
          :src="surpriseImage.url"
          :alt="surpriseImage.name"
          class="w-full h-full object-cover"
        />

        <!-- 选中标记 -->
        <div
          v-if="selected === surpriseImageId && showSurprise"
          class="absolute inset-0 bg-purple-500/30 flex items-center justify-center"
        >
          <svg class="w-9 h-9 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>

        <!-- 图片名称（仅触发后显示） -->
        <div v-if="showSurprise" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
          <span class="text-sm text-white/90">{{ surpriseImage.name }}</span>
        </div>

        <!-- 点击提示（仅在触发过程中显示） -->
        <div v-if="!showSurprise && clickCount > 0" class="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
          <span class="text-white font-bold text-base bg-purple-600 px-3 py-2 rounded-full">
            {{ clickCount }}/5
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
