<template>
  <Header>

  </Header>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/single/Header.vue';
</script>

<style lang="css" scoped>
main {
  min-height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--primary-bg-color);
}
</style>
