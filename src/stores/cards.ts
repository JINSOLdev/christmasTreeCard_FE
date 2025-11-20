import { defineStore } from 'pinia'

export type OrnamentType = 'GIFT' | 'RIBBON' | 'BELL' | 'SNOW' | 'HEART' | 'DOLL'

export interface Card {
  id: number
  toName: string
  fromName: string
  message: string
  ornamentType: OrnamentType // 🔹 새 필드
}

interface CardsState {
  cards: Card[]
  isLoading: boolean
}

const ORNAMENT_TYPES: OrnamentType[] = ['GIFT', 'RIBBON', 'BELL', 'SNOW', 'HEART', 'DOLL']

export const useCardsStore = defineStore('cards', {
  state: (): CardsState => ({
    cards: [],
    isLoading: false,
  }),

  actions: {
    async fetchCards() {
      this.isLoading = true
      try {
        // TODO: 실제 API 연동 시 서버에서 ornamentType까지 받아오기
        this.cards = [
          {
            id: 1,
            toName: 'Santa',
            fromName: 'Emma',
            message: 'Merry Christmas! 🎄',
            ornamentType: 'DOLL',
          },
        ]
      } finally {
        this.isLoading = false
      }
    },

    async createCard(payload: { toName: string; fromName: string; message: string }) {
      // 지금은 프론트에서 랜덤으로 선택
      const ornamentType = ORNAMENT_TYPES[Math.floor(Math.random() * ORNAMENT_TYPES.length)]

      const newCard: Card = {
        id: Date.now(),
        ornamentType,
        ...payload,
      }

      // TODO: 나중에 여기서 실제 POST /cards 호출하고 응답 값 사용
      this.cards.push(newCard)
      return newCard
    },
  },
})
