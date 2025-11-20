<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/35" @click.self="close">
    <div
      class="w-full max-w-sm rounded-3xl bg-[#fef9c3]/95 shadow-xl px-5 py-4 border border-white/70"
    >
      <header class="flex items-center justify-between mb-3">
        <h2 class="text-base font-semibold text-[#78350f] flex items-center gap-1">
          <span>🎄</span>
          <span>{{ title }}</span>
        </h2>
        <button
          class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-600 text-xs flex items-center justify-center shadow"
          @click="close"
        >
          ✕
        </button>
      </header>

      <section class="mb-3 text-sm text-slate-700">
        <slot />
      </section>

      <footer class="flex justify-end gap-2">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>()
const emits = defineEmits<{ (e: 'close'): void }>()

const close = () => emits('close')
</script>
