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

const ornamentPositions = ref<Record<string, Pos>>({})

const TREE_BOUNDS = {
  minY: 30,
  maxY: 68,
}

const MIN_DISTANCE = 8.3

function getTreeBoundsForY(y: number) {
  // 트리 삼각형의 대략적인 세로 범위
  const topY = 30
  const bottomY = 68

  // y를 0~1 사이 비율로 변환 (위 0, 아래 1)
  const t = Math.min(Math.max((y - topY) / (bottomY - topY), 0), 1)

  // 위쪽에서는 폭이 아주 좁고, 아래로 갈수록 넓어지게
  const minHalfWidth = 4 // 꼭대기 근처 반쪽 폭
  const maxHalfWidth = 24 // 아래쪽 반쪽 폭 (전체 폭 약 48)

  const halfWidth = minHalfWidth + t * (maxHalfWidth - minHalfWidth)

  const centerX = 50 // 트리 중앙
  const minX = centerX - halfWidth
  const maxX = centerX + halfWidth

  return { minX, maxX }
}

function randomPosition(): Pos {
  const y = TREE_BOUNDS.minY + Math.random() * (TREE_BOUNDS.maxY - TREE_BOUNDS.minY)

  const { minX, maxX } = getTreeBoundsForY(y)
  const x = minX + Math.random() * (maxX - minX)

  return { x, y }
}

function isTooClose(candidate: Pos, existing: Pos[]): boolean {
  return existing.some((pos) => {
    const dx = pos.x - candidate.x
    const dy = pos.y - candidate.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < MIN_DISTANCE
  })
}

function getPositionFor(cardId: string): Pos {
  const currentMap = ornamentPositions.value
  if (currentMap[cardId]) return currentMap[cardId]

  const existing = Object.values(currentMap)
  let candidate: Pos = randomPosition()

  for (let i = 0; i < 30; i++) {
    if (!isTooClose(candidate, existing)) break
    candidate = randomPosition()
  }

  currentMap[cardId] = candidate
  return candidate
}

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
  await cardsStore.createCard(payload)
  showCreateModal.value = false
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
