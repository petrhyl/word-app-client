<script setup lang="ts">
import { ROUTE_NAMES } from '@/router';
</script>

<template>
    <div>
        <h1>Error</h1>
        <p>We are sorry.</p>
        <p>An error accured on the page. Try it somewhere else.</p>
        <RouterLink :to="{ name: ROUTE_NAMES.home }">Go to home page</RouterLink>
    </div>
</template>