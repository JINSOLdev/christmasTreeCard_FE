<template>
  <div class="card-list-page">
    <h2>모든 카드 모아보기 🎁</h2>
    <p>따뜻한 메세지들을 한 화면에서 볼 수 있어요.</p>

    <button @click="goHome">트리로 돌아가기</button>

    <div v-if="cardsStore.isLoading">불러오는 중...</div>

    <div v-else class="card-grid">
      <article
        v-for="card in cardsStore.cards"
        :key="card.id"
        class="card-item"
        @click="openCardDetail(card)"
      >
        <p class="to">To. {{ card.toName }}</p>
        <p class="from">From. {{ card.fromName }}</p>
        <p class="preview">
          {{ card.message }}
        </p>
      </article>
    </div>

    <CardModal v-if="selectedCard" title="카드 보기" @close="selectedCard = null">
      <div>
        <p><strong>To:</strong> {{ selectedCard.toName }}</p>
        <p><strong>From:</strong> {{ selectedCard.fromName }}</p>
        <p class="message">{{ selectedCard.message }}</p>
      </div>
    </CardModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCardsStore, type Card } from '@/stores/cards'
import CardModal from '@/components/CardModal.vue'

const router = useRouter()
const cardsStore = useCardsStore()

const selectedCard = ref<Card | null>(null)

function goHome() {
  router.push({ name: 'home' })
}

function openCardDetail(card: Card) {
  selectedCard.value = card
}

onMounted(() => {
  if (!cardsStore.cards.length) {
    cardsStore.fetchCards()
  }
})
</script>

<style scoped>
.card-list-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.card-item {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}
</style>
