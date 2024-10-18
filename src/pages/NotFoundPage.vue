<template>
    <PageWrapper>
        <PageTitle title="Not found" description="Sorry, the page you are looking for does not exist." />
        <div><span>Return to <AppButton :type="'link'" :style="'link'" :route="{name: ROUTE_NAMES.home}">Home page</AppButton></span></div>
    </PageWrapper>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/button/AppButton.vue';
import PageTitle from '@/components/ui/page/PageTitle.vue';
import PageWrapper from '@/components/ui/page/PageWrapper.vue';
import { ROUTE_NAMES } from '@/router';
</script>