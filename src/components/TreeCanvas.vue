<template>
  <div class="tree-canvas">
    <div class="sky">
      <div class="snow snow-1"></div>
      <div class="snow snow-2"></div>
      <div class="snow snow-3"></div>
      <div class="snow snow-4"></div>
      <div class="snow snow-5"></div>
      <div class="snow snow-6"></div>

      <!-- 트리 이미지 -->
      <div class="tree-wrapper">
        <img src="../assets/tree.png" class="tree-image" />

        <!-- 오너먼트들 (트리 위에 달림) -->
        <OrnamentItem
          v-for="ornament in ornaments"
          :key="ornament.id"
          :x="ornament.x"
          :y="ornament.y"
          :card="ornament.card"
          @click="onClickOrnament(ornament.card)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrnamentItem from './OrnamentItem.vue'
import type { Card } from '@/stores/cards'

type Ornament = {
  id: string
  x: number
  y: number
  card: Card
}

const props = defineProps<{
  ornaments: Ornament[]
}>()

const emit = defineEmits<{
  (e: 'select-card', card: Card): void
}>()

function onClickOrnament(card: Card) {
  emit('select-card', card)
}
</script>

<style scoped>
.tree-canvas {
  display: flex;
  justify-content: center;
  width: 100%;
}

.sky {
  position: relative;
  width: 320px;
  height: 440px;
  border-radius: 40px;
  background: linear-gradient(to bottom, #fee9d6, #cfe6ff);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

/* 트리 */
.tree-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tree-image {
  width: 100%;
  pointer-events: none;
  user-select: none;
}

/* 눈 효과 등 기존 스타일 그대로 */
.snow {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(white 1.5px, transparent 1.5px);
  opacity: 0.8;
  animation: snow-fall 12s linear infinite;
}

.snow-2 {
  animation-duration: 16s;
  opacity: 0.6;
}

.snow-3 {
  animation-duration: 20s;
  opacity: 0.5;
}

@keyframes snow-fall {
  0% {
    transform: translateY(-40px);
  }
  100% {
    transform: translateY(40px);
  }
}
</style>
