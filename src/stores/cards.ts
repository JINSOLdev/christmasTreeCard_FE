import { defineStore } from 'pinia'

export type OrnamentType = 'GIFT' | 'RIBBON' | 'BELL' | 'SNOW' | 'HEART' | 'DOLL'

export interface Card {
  id: string
  toName: string
  fromName: string
  message: string
  templateType: string
  createdAt?: string
  ornamentType?: OrnamentType | null
  // 필요하면 여기에 posX, posY 도 추가 가능
  // posX?: number
  // posY?: number
}

interface CardsState {
  cards: Card[]
  isLoading: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const useCardsStore = defineStore('cards', {
  state: (): CardsState => ({
    cards: [],
    isLoading: false,
  }),

  actions: {
    // 카드 목록 불러오기 (GET /api/cards)
    async fetchCards() {
      this.isLoading = true
      try {
        const res = await fetch(`${API_BASE_URL}/api/cards`)
        if (!res.ok) {
          throw new Error('카드 목록 조회에 실패했어요.')
        }

        const data = await res.json()

        this.cards = data.map(
          (item: any): Card => ({
            id: item.id,
            toName: item.toName,
            fromName: item.fromName,
            message: item.message,
            templateType: item.templateType,
            createdAt: item.createdAt,
            ornamentType: item.ornamentType ?? null,
            // posX: item.posX,
            // posY: item.posY,
          }),
        )
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    // 카드 생성 (POST /api/cards)
    async createCard(payload: { toName: string; fromName: string; message: string }) {
      this.isLoading = true
      try {
        const body = {
          ...payload,
          templateType: 'CLASSIC',
        }

        const res = await fetch(`${API_BASE_URL}/api/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          throw new Error('카드 생성에 실패했어요.')
        }

        /**
         * 현재 BE POST /api/cards 응답이 { cardId, ornamentId, position: { x, posY }}
         * 그런데 이걸로 프론트에서 카드 전체를 만들기엔 정보가 부족하니까 일단 성공만 확인하고 목록을 다시 불러오는 방식으로 하는게 좋을 것 같으
         */
        await this.fetchCards()

        // 필요하면 응답 값 반환
        const result = await res.json()
        return result
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
