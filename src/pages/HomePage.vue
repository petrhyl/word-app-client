<template>
    <PageWrapper>
        <ModalWindow :show="isAutoLoggedOut">
            <h3>You have been automatically logged out.</h3>
            <p>Please go to log-in page by clicking on the button below and log in again.</p>
            <AppButton :style="'primary'" type="link" :route="{ name: ROUTE_NAMES.login }">Log in</AppButton>
        </ModalWindow>
        <h1 class="welcome-message">Welcome to application for practising your foreign language vocabulary</h1>
        <div v-if="!user?.id" class="prompt-container">
            <h3>Please log in or sign up to start practising</h3>
            <UnloggedUserNav css-class="auth-buttons-container" />
        </div>
        <div v-else>
            <h3>You can start practising now</h3>
            <div>
                <AppButton :style="'primary'" type="link" :route="{ name: ROUTE_NAMES.practise }">
                    Start Exercise
                </AppButton>
            </div>
        </div>
        <div class="application-description">
            <h2>Introduction</h2>
            <div class="horizont-line"></div>
            <p>
                The exercises in the application are designed to provide you with your vocabulary words in an order
                based on how many times you have guessed the word correctly or incorrectly. First,&nbsp;you are given
                the words you have correctly guessed the least number of times and those you haven't practiced for a
                longer period of time.
            </p>
            <div class="horizont-line"></div>
        </div>
    </PageWrapper>
</template>

<script setup lang="ts">
import UnloggedUserNav from "@/components/nav/UnloggedUserNav.vue"
import ModalWindow from "@/components/single/ModalWindow.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { ROUTE_NAMES } from "@/router"
import { useUserStore } from "@/store/user/userStore"
import { HOME_PAGE_QUERY_KEY_VALUE } from "@/utils/constants"
import { ref } from "vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"

const route = useRoute()
const { user } = useUserStore()

const isAutoLoggedOut = ref(false)

onBeforeRouteUpdate(() => {
    if (
        route.query &&
        route.query[HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.key] === HOME_PAGE_QUERY_KEY_VALUE.autoLoggedOut.value
    ) {
        isAutoLoggedOut.value = true
    }
})
</script>

<style lang="css" scoped>
.prompt-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2rem;
    flex-grow: 1;
    padding-bottom: 5%;
}

.prompt-container h3 {
    text-align: center;
}

.welcome-message {
    text-align: center;
}

:deep(.auth-buttons-container) {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
}

.application-description {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    padding-bottom: 2rem;
}

.application-description p {
    line-height: 1.5rem;
    text-align: justify;
}

.horizont-line {
    width: 50%;
    height: 2px;
    border-radius: 1px;
    background-color: var(--form-border-color);
}

@media screen and (max-width: 980px) {
    .welcome-message {
        font-size: 1.75rem;
    }

    .application-description {
        padding-bottom: 1rem;
    }
}

@media screen and (max-height: 600px) {
    .prompt-container {
        padding-bottom: 1rem;
    }
}
</style>
