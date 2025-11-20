<template>
  <div class="w-full flex flex-col items-center gap-4 pb-10">
    <section class="w-full flex justify-center">
      <TreeCanvas :ornaments="ornaments" @select-card="openCardDetail" />
    </section>

    <section class="actions-section">
      <button
        class="mt-6 px-5 py-2 rounded-xl bg-white/80 text-slate-700 border border-slate-200 shadow-sm hover:bg-white hover:-translate-y-0.5 transition transform"
        @click="openCreateModal"
      >
        카드 작성
      </button>
    </section>

    <!-- 카드 작성 모달 -->
    <CardModal v-if="showCreateModal" title="카드 작성하기" @close="closeCreateModal">
      <CardForm @submit="handleCreateCard" @cancel="closeCreateModal" />
    </CardModal>

    <!-- 카드 상세 모달 -->
    <CardModal v-if="selectedCard" title="카드 보기" @close="closeCardDetail">
      <div>
        <p><strong>To:</strong> {{ selectedCard.toName }}</p>
        <p><strong>From:</strong> {{ selectedCard.fromName }}</p>
        <p class="message">{{ selectedCard.message }}</p>
      </div>
    </CardModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TreeCanvas from '@/components/TreeCanvas.vue'
import CardModal from '@/components/CardModal.vue'
import CardForm from '@/components/CardForm.vue'
import { useCardsStore, type Card } from '@/stores/cards'

const cardsStore = useCardsStore()

type Pos = { x: number; y: number }

const showCreateModal = ref(false)
const selectedCard = ref<Card | null>(null)

const ornamentPositions = ref<Record<number, Pos>>({})

const TREE_BOUNDS = {
  minY: 10,
  maxY: 62,
}

const MIN_DISTANCE = 8 // 퍼센트 기준 최소 거리 (값 키우면 더 넓게 퍼짐)

// 트리 영역 맞춰서
// y 위치(%)에 따라 허용되는 x 범위(%)를 다르게 주기
function getTreeBoundsForY(y: number) {
  // 🎯 꼭대기 작은 삼각형
  if (y < 24) {
    // 맨 위는 너무 옆으로 안 가게 살짝만
    return { minX: 46, maxX: 54 }
  }

  // 🎯 위쪽 가지
  if (y < 36) {
    // 기존보다 양쪽으로 더 넓게
    return { minX: 40, maxX: 60 }
  }

  // 🎯 가운데 가지
  if (y < 50) {
    // 빨간 표시한 부분까지 가도록 폭 확장
    return { minX: 34, maxX: 66 }
  }

  // 🎯 아래 가지
  if (y < 72) {
    // 거의 트리 가장자리까지 허용
    return { minX: 28, maxX: 72 }
  }

  // 🎯 줄기 근처 (혹시 더 내려갈 경우)
  return { minX: 44, maxX: 56 }
}


/** 임의 위치 하나 생성 */
function randomPosition(): Pos {
  // 1) y 먼저 랜덤으로 뽑고
  const y = TREE_BOUNDS.minY + Math.random() * (TREE_BOUNDS.maxY - TREE_BOUNDS.minY)

  // 2) 그 y에 맞는 x 범위를 가져와서
  const { minX, maxX } = getTreeBoundsForY(y)

  // 3) 그 안에서만 x 랜덤 생성
  const x = minX + Math.random() * (maxX - minX)

  return { x, y }
}

/** 기존 오너먼트들과 너무 가까운지 검사 */
function isTooClose(candidate: Pos, existing: Pos[]): boolean {
  return existing.some((pos) => {
    const dx = pos.x - candidate.x
    const dy = pos.y - candidate.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < MIN_DISTANCE
  })
}

/** 카드 id에 대한 위치가 없으면 생성해서 저장 */
function getPositionFor(cardId: number): Pos {
  const currentMap = ornamentPositions.value
  if (currentMap[cardId]) return currentMap[cardId]

  const existing = Object.values(currentMap)
  let candidate: Pos = randomPosition()

  // 최대 30번 정도 시도해서 겹치지 않는 자리 찾기
  for (let i = 0; i < 30; i++) {
    if (!isTooClose(candidate, existing)) break
    candidate = randomPosition()
  }

  currentMap[cardId] = candidate
  return candidate
}

/** 💡 화면에 뿌릴 ornaments */
const ornaments = computed(() => {
  return cardsStore.cards.map((card) => {
    const pos = getPositionFor(card.id)
    return {
      id: card.id,
      x: pos.x,
      y: pos.y,
      card,
    }
  })
})

function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openCardDetail(card: Card) {
  selectedCard.value = card
}

function closeCardDetail() {
  selectedCard.value = null
}

async function handleCreateCard(payload: { toName: string; fromName: string; message: string }) {
  const newCard = await cardsStore.createCard(payload)
  showCreateModal.value = false
  // selectedCard.value = newCard
}

onMounted(() => {
  cardsStore.fetchCards()
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.tree-section {
  width: 100%;
  max-width: 400px;
}

.actions-section {
  margin-top: 8px;
}
</style>
