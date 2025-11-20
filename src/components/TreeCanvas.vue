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

/* 공통 눈 스타일 */
.snow {
  position: absolute;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  opacity: 0.9;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
  animation-name: snow-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* 레이어 1 */
.snow-1 {
  top: -80px;
  left: 0;
  animation-duration: 8s;
  animation-delay: 0s;
  box-shadow:
    10px -60px white,
    40px -25px white,
    70px -5px white,
    100px -45px white,
    130px -15px white,
    160px -35px white,
    190px -10px white,
    220px -50px white,
    250px -20px white;
}

/* 레이어 2 */
.snow-2 {
  top: -90px;
  left: 15px;
  animation-duration: 9s;
  animation-delay: 1s;
  box-shadow:
    5px -40px white,
    35px -10px white,
    65px -55px white,
    95px -20px white,
    125px -70px white,
    155px -30px white,
    185px -5px white,
    215px -45px white,
    245px -15px white;
}

/* 레이어 3 */
.snow-3 {
  top: -100px;
  left: 30px;
  animation-duration: 10s;
  animation-delay: 2s;
  box-shadow:
    0px -75px white,
    30px -35px white,
    60px -5px white,
    90px -50px white,
    120px -25px white,
    150px -65px white,
    180px -15px white,
    210px -40px white,
    240px -10px white;
}

/* 레이어 4 */
.snow-4 {
  top: -85px;
  left: 5px;
  animation-duration: 8.5s;
  animation-delay: 0.5s;
  box-shadow:
    20px -55px white,
    50px -15px white,
    80px -40px white,
    110px -5px white,
    140px -60px white,
    170px -25px white,
    200px -70px white,
    230px -20px white;
}

/* 레이어 5 */
.snow-5 {
  top: -95px;
  left: 25px;
  animation-duration: 9.5s;
  animation-delay: 1.5s;
  box-shadow:
    15px -65px white,
    45px -30px white,
    75px -10px white,
    105px -55px white,
    135px -20px white,
    165px -75px white,
    195px -35px white,
    225px -5px white;
}

/* 레이어 6 */
.snow-6 {
  top: -105px;
  left: 35px;
  animation-duration: 11s;
  animation-delay: 3s;
  box-shadow:
    10px -50px white,
    40px -80px white,
    70px -25px white,
    100px -60px white,
    130px -15px white,
    160px -45px white,
    190px -5px white,
    220px -70px white;
}

@keyframes snow-fall {
  0% {
    transform: translateY(-60px);
  }
  100% {
    transform: translateY(420px);
  }
}
</style>
