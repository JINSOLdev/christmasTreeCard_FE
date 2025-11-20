<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="pt-4 pb-3 text-center">
      <h1
        class="text-2xl md:text-3xl font-semibold text-slate-800 flex items-center justify-center gap-2"
      >
        <span>🎄</span>
        <span>Merry Christmas</span>
        <span>🧸</span>
      </h1>
      <p class="mt-1 text-sm text-slate-600">따뜻한 메시지로 트리를 함께 채워주세요.</p>

      <nav class="mt-3 flex gap-4 justify-center text-sm">
        <RouterLink
          to="/"
          class="text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
        >
          트리 보기
        </RouterLink>
        <RouterLink
          to="/cards"
          class="text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
        >
          카드 모아보기
        </RouterLink>
      </nav>
    </header>

    <main class="flex-1 p-4 flex justify-center">
      <RouterView />
    </main>
  </div>
</template>
