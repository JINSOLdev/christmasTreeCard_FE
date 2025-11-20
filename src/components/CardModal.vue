<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="close">✕</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emits('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  max-width: 400px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  margin-top: 16px;
  text-align: right;
}
</style>
