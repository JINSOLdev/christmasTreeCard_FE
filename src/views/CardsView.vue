<!-- src/views/CardsView.vue -->
<template>
  <div class="w-full flex flex-col items-center pb-10">
    <section class="w-full max-w-5xl px-4 mt-4">
      <!-- 헤더 영역 -->
      <header class="flex flex-col gap-1 mb-4">
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <span>🎄</span>
            <span>카드 모아보기</span>
          </h2>
          <span class="text-xs text-slate-500"> 총 {{ totalCount }}장 </span>
        </div>
        <p class="text-xs text-slate-500">트리에 걸린 모든 메시지를 한눈에 모아볼 수 있어요.</p>
      </header>

      <!-- 컨트롤 바 -->
      <div
        class="mb-4 flex flex-col gap-3 rounded-2xl bg-white/80 border border-amber-100 px-4 py-3 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between"
      >
        <!-- 검색 -->
        <div class="flex-1">
          <input
            v-model="search"
            type="text"
            placeholder="이름이나 메시지로 검색해보세요"
            class="w-full rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <!-- 정렬 + 필터 -->
        <div class="flex flex-wrap items-center gap-2 md:ml-4 md:justify-end">
          <select
            v-model="sortMode"
            class="rounded-xl border border-slate-200 bg-white/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>

          <div class="flex items-center gap-1 text-xs">
            <button
              v-for="type in filterOptions"
              :key="type"
              type="button"
              class="rounded-full px-2.5 py-1 border text-[11px] transition"
              :class="
                ornamentFilter === type
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'
              "
              @click="ornamentFilter = type"
            >
              <span>{{ getFilterEmoji(type) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 리스트 영역 -->
      <section v-if="filteredCards.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="card in filteredCards"
          :key="card.id"
          class="rounded-3xl bg-white/90 border border-amber-100 shadow-sm px-4 py-3 cursor-pointer hover:-translate-y-1 hover:shadow-md transition"
          @click="openCardDetail(card)"
        >
          <header class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-[#fef9c3] flex items-center justify-center text-lg shadow-sm"
              >
                {{ getEmojiFromType(card.ornamentType) }}
              </div>
              <div class="text-xs text-slate-500">
                <div>
                  To. <span class="font-medium text-slate-700">{{ card.toName }}</span>
                </div>
                <div>
                  From. <span class="font-medium text-slate-700">{{ card.fromName }}</span>
                </div>
              </div>
            </div>
            <span class="text-[10px] text-slate-400">
              {{ (card.createdAt as any)?.slice?.(0, 10) }}
            </span>
          </header>

          <p class="text-xs text-slate-700 leading-relaxed line-clamp-3">
            {{ card.message }}
          </p>
        </article>
      </section>

      <!-- empty state -->
      <section
        v-else
        class="mt-8 flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/70 border border-dashed border-amber-200 px-6 py-10 text-center text-sm text-slate-500"
      >
        <div class="text-3xl mb-1">💌</div>
        <p class="font-medium text-slate-700">아직 등록된 카드가 없어요.</p>
        <p class="text-xs text-slate-500">
          트리 화면에서 첫 카드를 작성해 따뜻한 메시지로 트리를 채워보세요!
        </p>
      </section>
    </section>

    <!-- 카드 상세 모달 재사용 -->
    <CardModal v-if="selectedCard" title="카드 보기" @close="closeCardDetail">
      <div class="space-y-3 text-sm text-slate-700">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full bg-[#fef9c3] flex items-center justify-center text-lg shadow-sm"
          >
            {{ getEmojiFromType(selectedCard!.ornamentType) }}
          </div>
          <div class="text-xs text-slate-500">
            <div>
              To. <span class="font-semibold text-slate-800">{{ selectedCard!.toName }}</span>
            </div>
            <div>
              From. <span class="font-semibold text-slate-800">{{ selectedCard!.fromName }}</span>
            </div>
          </div>
        </div>
        <p class="whitespace-pre-line leading-relaxed">
          {{ selectedCard!.message }}
        </p>
      </div>
    </CardModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCardsStore, type Card, type OrnamentType } from '@/stores/cards'
import CardModal from '@/components/CardModal.vue'

const cardsStore = useCardsStore()

const search = ref('')
const sortMode = ref<'latest' | 'oldest'>('latest')

// 카드 모아보기에서 쓰는 필터 타입 (소문자)
const filterOptions = ['all', 'gift', 'ribbon', 'bell', 'snow', 'heart', 'doll'] as const
type OrnamentFilter = (typeof filterOptions)[number]

const ornamentFilter = ref<OrnamentFilter>('all')

const selectedCard = ref<Card | null>(null)

// 실제 카드의 ornamentType(enum, 대문자) -> 이모지
const ornamentEmojiByType: Record<OrnamentType, string> = {
  GIFT: '🎁',
  RIBBON: '🎀',
  BELL: '🔔',
  SNOW: '❄️',
  HEART: '♥️',
  DOLL: '🧸',
}

// 필터 버튼(소문자) -> 이모지
const filterEmojiMap: Partial<Record<OrnamentFilter, string>> = {
  gift: '🎁',
  ribbon: '🎀',
  bell: '🔔',
  snow: '❄️',
  heart: '♥️',
  doll: '🧸',
}

// 필터 버튼(소문자) -> 실제 enum 값(대문자)
const filterToTypeMap: Partial<Record<OrnamentFilter, OrnamentType>> = {
  gift: 'GIFT',
  ribbon: 'RIBBON',
  bell: 'BELL',
  snow: 'SNOW',
  heart: 'HEART',
  doll: 'DOLL',
}

// 카드에서 사용할 이모지
function getEmojiFromType(type?: OrnamentType | null): string {
  if (!type) return ornamentEmojiByType.GIFT
  return ornamentEmojiByType[type] ?? ornamentEmojiByType.GIFT
}

// 필터 버튼에 표시할 이모지
function getFilterEmoji(type: OrnamentFilter): string {
  if (type === 'all') return '전체'
  return filterEmojiMap[type] ?? '❓'
}

// 카드 숫자
const totalCount = computed(() => cardsStore.cards.length)

// 검색 + 필터 + 정렬 적용된 리스트
const filteredCards = computed(() => {
  let list = [...cardsStore.cards]

  // 1. 검색 (toName, fromName, message에 포함)
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((card) => {
      const text = `${card.toName ?? ''} ${card.fromName ?? ''} ${card.message ?? ''}`.toLowerCase()
      return text.includes(q)
    })
  }

  // 2. 오너먼트 타입 필터
  if (ornamentFilter.value !== 'all') {
    const targetType = filterToTypeMap[ornamentFilter.value]
    if (targetType) {
      list = list.filter((card) => card.ornamentType === targetType)
    }
  }

  // 3. 정렬
  list.sort((a, b) => {
    const aKey = (a.createdAt ?? a.id) as any
    const bKey = (b.createdAt ?? b.id) as any
    if (sortMode.value === 'latest') {
      return aKey > bKey ? -1 : 1
    }
    return aKey < bKey ? -1 : 1
  })

  return list
})

// 카드 클릭 > 상세 모달
function openCardDetail(card: Card) {
  selectedCard.value = card
}

function closeCardDetail() {
  selectedCard.value = null
}

onMounted(() => {
  if (!cardsStore.cards.length) {
    cardsStore.fetchCards()
  }
})
</script>
