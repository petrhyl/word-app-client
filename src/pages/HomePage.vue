<template>
    <PageWrapper>
        <div class="logged-out" v-if="isAutoLoggedOut">
            <p>You have been automatically logged out. Please log in again.</p>
        </div>
    </PageWrapper>
</template>


<script setup lang="ts">
import PageWrapper from '@/components/ui/pages/PageWrapper.vue';
import { HOME_PAGE_QUERY_KEY_VALUE } from '@/utils/constants';
import { ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const route = useRoute();

const isAutoLoggedOut = ref(false);

onBeforeRouteUpdate(()=>{
    if(route.query && route.query[HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.key] === HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.value){
        isAutoLoggedOut.value = true;
    }
})
</script>

<style lang="css" scoped>
.logged-out {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2rem;
}
</style>