<template>
  <form class="card-form" @submit.prevent="onSubmit">
    <label>
      To
      <input v-model="form.toName" required />
    </label>

    <label>
      From
      <input v-model="form.fromName" required />
    </label>

    <label>
      Message
      <textarea v-model="form.message" rows="4" required />
    </label>

    <!-- 나중에 템플릿 선택 영역 추가 가능 -->
    <!--
    <div class="template-list">
      템플릿 리스트...
    </div>
    -->

    <div class="actions">
      <button type="button" @click="$emit('cancel')">취소</button>
      <button type="submit">등록하기</button>
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

  // 필요하면 여기서 초기화
  form.toName = ''
  form.fromName = ''
  form.message = ''
}
</script>

<style scoped>
.card-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
