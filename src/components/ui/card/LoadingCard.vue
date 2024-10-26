<template>
    <PrimaryCard>
        <div class="loading-container flex-col-center">
            <LoadingSpinner spinner-width-height="3rem" />
        </div>
    </PrimaryCard>
</template>

<script setup lang="ts">
import LoadingSpinner from "../button/LoadingSpinner.vue"
import PrimaryCard from "./PrimaryCard.vue"
</script>

<style scoped>
.loading-container {
    height: 5rem;
    min-width: 30vw;
    justify-content: center;
}

@media screen and (max-width: 980px) {
    .loading-container {
        min-width: 68vw;
    }    
}
</style>
