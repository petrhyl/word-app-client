<template>
  <TopBar />
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import TopBar from '@/components/single/TopBar.vue';
import { useAuthStore } from './store/user/authStore';
import { ROUTE_NAMES } from './router';
import { HOME_PAGE_QUERIES } from './utils/constants';

const router = useRouter();
const { isRefreshTokenExpired } = useAuthStore();

router.beforeEach((_to, _from, next) => {
  if (isRefreshTokenExpired()) {
    next({ name: ROUTE_NAMES.home, query: HOME_PAGE_QUERIES.autoLoggedOut });
    return;
  }
  next();
});
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
