<!-- src/pages/Home.vue -->
<template>
  <div class="home">
    <section class="tree-section">
      <TreeCanvas :ornaments="ornaments" @select-card="openCardDetail" />
    </section>

    <section class="actions-section">
      <button @click="openCreateModal">카드 작성하기</button>
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

const showCreateModal = ref(false)
const selectedCard = ref<Card | null>(null)

const ornamentPositions = [
  { x: 50, y: 28 }, // 꼭대기 별 근처
  { x: 40, y: 38 }, // 위쪽 왼쪽 가지
  { x: 60, y: 39 }, // 위쪽 오른쪽 가지
  { x: 35, y: 50 }, // 중간 왼쪽 가지
  { x: 65, y: 51 }, // 중간 오른쪽 가지
  { x: 30, y: 63 }, // 아래 왼쪽 가지
  { x: 70, y: 64 }, // 아래 오른쪽 가지
  { x: 50, y: 72 }, // 줄기 바로 위
]

const ornaments = computed(() => {
  return cardsStore.cards.map((card, index) => {
    const pos = ornamentPositions[index % ornamentPositions.length]
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
