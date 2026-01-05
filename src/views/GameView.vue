<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSoundManager } from '../composables/useSoundManager'
import GameBackground from '../components/GameBackground.vue'
import GameHeader from '../components/GameHeader.vue'
import PuzzleBoard from '../components/PuzzleBoard.vue'
import GameControlPanel from '../components/GameControlPanel.vue'

const gameStore = useGameStore()
const { initSounds } = useSoundManager()

onMounted(() => {
  // 初始化音效
  initSounds()
  // 加载最佳记录
  gameStore.loadBestRecords()
})

onUnmounted(() => {
  // 清理计时器（如果有）
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 背景视频组件 -->
    <GameBackground />
    
    <!-- 主内容区域 -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- 顶部状态栏 -->
      <GameHeader />
      
      <!-- 游戏主区域 -->
      <div class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 p-6 lg:p-10">
        <!-- 拼图画布 -->
        <div class="flex-shrink-0">
          <PuzzleBoard />
        </div>

        <!-- 控制面板 -->
        <div class="w-full lg:w-96">
          <GameControlPanel />
        </div>
      </div>
    </div>

    <!-- 游戏完成弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="gameStore.isGameCompleted"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div class="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-10 max-w-lg mx-4 border border-purple-500/30 shadow-2xl">
            <div class="text-center">
              <div class="text-7xl mb-6">🎉</div>
              <h2 class="text-4xl font-bold text-white mb-6">恭喜完成！</h2>

              <div class="bg-white/10 rounded-2xl p-6 mb-8 space-y-4">
                <div class="flex justify-between text-gray-300 text-lg">
                  <span>用时</span>
                  <span class="font-mono text-white text-xl">{{ gameStore.formatTime(gameStore.elapsedTime) }}</span>
                </div>
                <div class="flex justify-between text-gray-300 text-lg">
                  <span>步数</span>
                  <span class="font-mono text-white text-xl">{{ gameStore.moveCount }} 步</span>
                </div>
                <div v-if="gameStore.currentBestRecord" class="border-t border-white/20 pt-4">
                  <div class="flex justify-between text-gray-400 text-base">
                    <span>最佳记录</span>
                    <span class="font-mono text-green-400">
                      {{ gameStore.formatTime(gameStore.currentBestRecord.bestTime) }} / {{ gameStore.currentBestRecord.leastMoves }}步
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex gap-5 justify-center">
                <button
                  @click="gameStore.resetGame()"
                  class="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  再来一局
                </button>
                <router-link
                  to="/"
                  class="px-8 py-4 bg-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/30 transition-colors"
                >
                  返回首页
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
