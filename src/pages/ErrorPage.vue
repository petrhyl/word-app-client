<template>
    <PageWrapper>
        <h1>Error</h1>
        <p class="sorry-text">We are sorry.<br />An error accured on the page. Please, try it later.</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <span class="home-page-link">
            Go to
            <AppButton :type="'link'" :buttonStyle="'link'" :route="{ name: ROUTE_NAMES.home }">home page</AppButton>
        </span>
    </PageWrapper>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { ERROR_ROUTE_ERRORS, ROUTE_NAMES } from "@/router"
import { onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const errorMessage = ref<string | null>(null)

onBeforeMount(() => {
    if (!route.query.error) {
        return
    }

    if (route.query.error === ERROR_ROUTE_ERRORS.invalidIdParam) {
        errorMessage.value = "You passed an invalid URL parameter"
    }

    if (route.query.error === ERROR_ROUTE_ERRORS.dataFetchingError) {
        errorMessage.value = "An error occurred while getting data from the server"
    }
})
</script>

<style lang="css" scoped>
.sorry-text {
    font-size: 1.25rem;
    text-align: center;
}
</style>
