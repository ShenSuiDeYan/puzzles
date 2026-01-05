import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSoundManager } from '../composables/useSoundManager'

const { playClick, playMove, playClearance } = useSoundManager()

export const useGameStore = defineStore('game', () => {
  // 难度配置映射
  const difficultyConfig = {
    easy: { gridSize: 3, label: '简单 (3x3)' },
    medium: { gridSize: 4, label: '中等 (4x4)' },
    hard: { gridSize: 5, label: '困难 (5x5)' },
    expert: { gridSize: 6, label: '专家 (6x6)' },
    master: { gridSize: 7, label: '大师 (7x7)' }
  }

  // 可用图片列表
  const availableImages = ref([
    { id: 1, name: '简单', url: '/images/level/easy.png' },
    { id: 2, name: '中等', url: '/images/level/normal.png' },
    { id: 3, name: '困难', url: '/images/level/hard.png' },
    { id: 4, name: '专家', url: '/images/level/formidable.png' },
    { id: 5, name: '大师', url: '/images/level/legend.png' },
    { id: 6, name: '惊喜', url: '/images/level/surprise.png' }
  ])

  // 当前游戏配置
  const currentDifficulty = ref('easy')
  const currentImageId = ref(1)
  
  // 计算属性：当前网格大小
  const gridSize = computed(() => difficultyConfig[currentDifficulty.value].gridSize)
  
  // 当前图片URL
  const currentImageUrl = computed(() => {
    const img = availableImages.value.find(i => i.id === currentImageId.value)
    return img ? img.url : availableImages.value[0].url
  })

  // 游戏进行状态
  const tiles = ref([])
  const emptyIndex = ref(null)
  const isGameActive = ref(false)
  const isGameCompleted = ref(false)

  // 游戏数据
  const elapsedTime = ref(0)
  const moveCount = ref(0)
  const timerInterval = ref(null)

  // 最佳记录 (从 localStorage 初始化)
  const bestRecords = ref({})

  // 当前记录Key
  const currentRecordKey = computed(() => `${currentImageId.value}-${currentDifficulty.value}`)
  
  // 当前最佳记录
  const currentBestRecord = computed(() => bestRecords.value[currentRecordKey.value] || null)

  // 初始化从 localStorage 读取记录
  function loadBestRecords() {
    try {
      const saved = localStorage.getItem('puzzleBestRecords')
      if (saved) {
        bestRecords.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load best records:', e)
    }
  }

  // 保存记录到 localStorage
  function saveBestRecords() {
    try {
      localStorage.setItem('puzzleBestRecords', JSON.stringify(bestRecords.value))
    } catch (e) {
      console.error('Failed to save best records:', e)
    }
  }

  // 检查并更新最佳记录
  function updateBestRecord() {
    const key = currentRecordKey.value
    const current = bestRecords.value[key]
    
    if (!current || 
        elapsedTime.value < current.bestTime || 
        (elapsedTime.value === current.bestTime && moveCount.value < current.leastMoves)) {
      bestRecords.value[key] = {
        bestTime: elapsedTime.value,
        leastMoves: moveCount.value
      }
      saveBestRecords()
      return true
    }
    return false
  }

  // 启动计时器
  function startTimer() {
    stopTimer()
    timerInterval.value = setInterval(() => {
      if (isGameActive.value && !isGameCompleted.value) {
        elapsedTime.value++
      }
    }, 1000)
  }

  // 停止计时器
  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  // 检查是否相邻
  function isAdjacent(index1, index2) {
    const size = gridSize.value
    const row1 = Math.floor(index1 / size)
    const col1 = index1 % size
    const row2 = Math.floor(index2 / size)
    const col2 = index2 % size
    
    return (Math.abs(row1 - row2) + Math.abs(col1 - col2)) === 1
  }

  // 检查游戏是否完成
  function checkCompletion() {
    for (let i = 0; i < tiles.value.length; i++) {
      if (tiles.value[i].correctIndex !== tiles.value[i].currentIndex) {
        return false
      }
    }
    return true
  }

  // 生成可解的拼图
  function generateSolvablePuzzle() {
    const size = gridSize.value
    const totalTiles = size * size
    
    // 创建拼图块数组
    const newTiles = []
    for (let i = 0; i < totalTiles - 1; i++) {
      newTiles.push({
        id: i,
        correctIndex: i,
        currentIndex: i,
        isEmpty: false
      })
    }
    // 添加空白块
    newTiles.push({
      id: totalTiles - 1,
      correctIndex: totalTiles - 1,
      currentIndex: totalTiles - 1,
      isEmpty: true
    })

    // 打乱拼图 (通过模拟合法移动确保可解)
    let emptyIdx = totalTiles - 1
    const shuffleMoves = totalTiles * 20 // 打乱次数
    
    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = getNeighbors(emptyIdx, size)
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
      
      // 交换
      const emptyTile = newTiles.find(t => t.currentIndex === emptyIdx)
      const neighborTile = newTiles.find(t => t.currentIndex === randomNeighbor)
      
      emptyTile.currentIndex = randomNeighbor
      neighborTile.currentIndex = emptyIdx
      emptyIdx = randomNeighbor
    }

    tiles.value = newTiles
    emptyIndex.value = emptyIdx
  }

  // 获取邻居索引
  function getNeighbors(index, size) {
    const neighbors = []
    const row = Math.floor(index / size)
    const col = index % size
    
    if (row > 0) neighbors.push(index - size) // 上
    if (row < size - 1) neighbors.push(index + size) // 下
    if (col > 0) neighbors.push(index - 1) // 左
    if (col < size - 1) neighbors.push(index + 1) // 右
    
    return neighbors
  }

  // 初始化游戏
  function initGame(difficulty = 'easy', imageId = 1) {
    // 重置状态
    stopTimer()
    isGameCompleted.value = false
    moveCount.value = 0
    elapsedTime.value = 0
    
    // 播放点击音效
    playClick()
    
    // 更新配置
    currentDifficulty.value = difficulty
    currentImageId.value = imageId
    
    // 生成拼图
    generateSolvablePuzzle()
    
    // 加载最佳记录
    loadBestRecords()
    
    // 启动游戏
    isGameActive.value = true
    startTimer()
  }

  // 切换拼图
  function switchPuzzle(newDifficulty, newImageId) {
    initGame(newDifficulty, newImageId)
  }

  // 点击拼图块
  function onTileClick(clickedIndex) {
    if (!isGameActive.value || isGameCompleted.value) return
    
    if (isAdjacent(clickedIndex, emptyIndex.value)) {
      // 播放移动音效
      playMove()
      
      // 找到被点击的块和空白块
      const clickedTile = tiles.value.find(t => t.currentIndex === clickedIndex)
      const emptyTile = tiles.value.find(t => t.isEmpty)
      
      // 交换位置
      clickedTile.currentIndex = emptyIndex.value
      emptyTile.currentIndex = clickedIndex
      
      // 更新空白位置
      emptyIndex.value = clickedIndex
      
      // 增加步数
      moveCount.value++
      
      // 检查是否完成
      if (checkCompletion()) {
        isGameCompleted.value = true
        isGameActive.value = false
        stopTimer()
        updateBestRecord()
        // 播放通关音效
        playClearance()
      }
    } else {
      // 播放点击音效（无效移动）
      playClick()
    }
  }

  // 重置当前游戏
  function resetGame() {
    initGame(currentDifficulty.value, currentImageId.value)
  }

  // 暂停/继续游戏
  function togglePause() {
    if (isGameCompleted.value) return
    isGameActive.value = !isGameActive.value
  }

  // 格式化时间显示
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    // 配置
    difficultyConfig,
    availableImages,
    currentDifficulty,
    currentImageId,
    gridSize,
    currentImageUrl,
    
    // 游戏状态
    tiles,
    emptyIndex,
    isGameActive,
    isGameCompleted,
    
    // 游戏数据
    elapsedTime,
    moveCount,
    bestRecords,
    currentBestRecord,
    currentRecordKey,
    
    // 方法
    loadBestRecords,
    initGame,
    switchPuzzle,
    onTileClick,
    resetGame,
    togglePause,
    formatTime,
    isAdjacent
  }
})
