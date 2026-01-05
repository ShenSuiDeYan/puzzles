// 视频音频管理工具
import { ref } from 'vue'

// 视频音频状态
const isVideoAudioMuted = ref(false)
const isVideoPlaying = ref(true)

// 切换视频音频静音
function toggleVideoAudioMute() {
  isVideoAudioMuted.value = !isVideoAudioMuted.value
  // 这个状态将在GameBackground组件中使用
  return isVideoAudioMuted.value
}

// 获取视频音频静音状态
function getVideoAudioMuteStatus() {
  return isVideoAudioMuted.value
}

// 设置视频音频静音状态
function setVideoAudioMute(muted) {
  isVideoAudioMuted.value = muted
}

// 设置视频播放状态
function setVideoPlaying(playing) {
  isVideoPlaying.value = playing
}

// 获取视频播放状态
function getVideoPlayingStatus() {
  return isVideoPlaying.value
}

export function useVideoAudioManager() {
  return {
    isVideoAudioMuted,
    isVideoPlaying,
    toggleVideoAudioMute,
    getVideoAudioMuteStatus,
    setVideoAudioMute,
    setVideoPlaying,
    getVideoPlayingStatus
  }
}
