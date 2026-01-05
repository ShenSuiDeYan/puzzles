// 音效管理工具
import { ref } from 'vue'

// 音效实例
const sounds = {
  click: null,
  move: null,
  clearance: null
}

// 是否静音
const isMuted = ref(false)

// 初始化音效
function initSounds() {
  sounds.click = new Audio('/sound/click.mp3')
  sounds.move = new Audio('/sound/move.mp3')
  sounds.clearance = new Audio('/sound/clearance.mp3')
  
  // 预加载
  Object.values(sounds).forEach(sound => {
    if (sound) {
      sound.load()
      sound.volume = 0.5
    }
  })
}

// 播放点击音效
function playClick() {
  if (!isMuted.value && sounds.click) {
    sounds.click.currentTime = 0
    sounds.click.play().catch(() => {})
  }
}

// 播放移动音效
function playMove() {
  if (!isMuted.value && sounds.move) {
    sounds.move.currentTime = 0
    sounds.move.play().catch(() => {})
  }
}

// 播放通关音效
function playClearance() {
  if (!isMuted.value && sounds.clearance) {
    sounds.clearance.currentTime = 0
    sounds.clearance.play().catch(() => {})
  }
}

// 切换静音
function toggleMute() {
  isMuted.value = !isMuted.value
}

// 设置音量
function setVolume(volume) {
  Object.values(sounds).forEach(sound => {
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume))
    }
  })
}

// 获取静音状态
function getMuteStatus() {
  return isMuted.value
}

export function useSoundManager() {
  return {
    isMuted,
    initSounds,
    playClick,
    playMove,
    playClearance,
    toggleMute,
    setVolume,
    getMuteStatus
  }
}
