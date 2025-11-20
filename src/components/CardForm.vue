<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">To</label>
      <input
        v-model="form.toName"
        required
        class="w-full rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="받는 사람 이름"
      />
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">From</label>
      <input
        v-model="form.fromName"
        required
        class="w-full rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="보내는 사람 이름"
      />
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Message</label>
      <textarea
        v-model="form.message"
        required
        rows="4"
        class="w-full rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="따뜻한 크리스마스 메시지를 적어주세요 ✨"
      />
    </div>

    <div class="flex justify-end gap-2 pt-1">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-3 py-1.5 rounded-xl text-xs bg-white/80 text-slate-600 border border-slate-200 hover:bg-white"
      >
        취소
      </button>
      <button
        type="submit"
        class="px-3 py-1.5 rounded-xl text-xs bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
      >
        등록하기
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emits = defineEmits<{
  (e: 'submit', payload: { toName: string; fromName: string; message: string }): void
  (e: 'cancel'): void
}>()

const form = reactive({
  toName: '',
  fromName: '',
  message: '',
})

function onSubmit() {
  emits('submit', { ...form })
  form.toName = ''
  form.fromName = ''
  form.message = ''
}
</script>
