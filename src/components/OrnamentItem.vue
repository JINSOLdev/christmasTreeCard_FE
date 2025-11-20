<template>
  <button class="ornament" :style="styleObject" @click="$emit('click')">
    {{ emoji }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/stores/cards'
import type { OrnamentType } from '@/stores/cards'

const props = defineProps<{
  x: number
  y: number
  card: Card
}>()

// ornamentType -> 이모지 매핑
const emojiByType: Record<OrnamentType, string> = {
  GIFT: '🎁',
  RIBBON: '🎀',
  BELL: '🔔',
  SNOW: '❄️',
  HEART: '♥️',
}

const emoji = computed(() => {
  // 혹시 ornamentType이 없으면 기본값 🎁
  return emojiByType[props.card.ornamentType] ?? '🎁'
})

// 위치는 그대로 % 기준
const styleObject = computed(() => ({
  position: 'absolute',
  left: `${props.x}%`,
  top: `${props.y}%`,
  transform: 'translate(-50%, -50%)',
}))
</script>

<style scoped>
.ornament {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #fef3c7;
  box-shadow: 0 3px 6px rgba(15, 23, 42, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  /* 기본: 둥둥 떠다니기 */
  animation: float 4s ease-in-out infinite;
  transition: transform 0.2s ease;
}

/* hover: 살짝 커지고 흔들 */
.ornament:hover {
  animation: wiggle 0.7s ease-in-out infinite;
  transform: translate(-50%, -50%) scale(1.12);
}

@keyframes float {
  0% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-4px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
}

@keyframes wiggle {
  0%,
  100% {
    transform: translate(-50%, -50%) rotate(-6deg) scale(1.12);
  }
  50% {
    transform: translate(-50%, -50%) rotate(6deg) scale(1.12);
  }
}
</style>
