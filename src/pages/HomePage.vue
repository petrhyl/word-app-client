<template>
    <PageWrapper>
        <ModalWindow :show="isAutoLoggedOut" @click-close-button="handleCloseLoggedoutModal">
            <h3>You have been automatically logged out.</h3>
            <p class="auto-loggedout-text">
                Please go to log-in page by clicking on the button below and log in again.
            </p>
            <AppButton :style="'primary'" type="link" :route="{ name: ROUTE_NAMES.login }">Log in</AppButton>
        </ModalWindow>
        <h1 class="welcome-message">Welcome to application for practising your foreign language vocabulary</h1>
        <div v-if="!user?.id" class="prompt-container">
            <p>Please log in or sign up to start practising</p>
            <UnloggedUserNav css-class="auth-buttons-container" />
        </div>
        <div v-else class="prompt-container">
            <p>You can start practising now</p>
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
import useUserAuth from "@/composables/useAppUser"
import { ROUTE_NAMES } from "@/router"
import { onBeforeMount, ref } from "vue"

const { nullifyTokens, isRefreshTokenExpired, user } = useUserAuth()

const isAutoLoggedOut = ref(false)

function handleCloseLoggedoutModal() {
    isAutoLoggedOut.value = false
}

function resolveLoginExpiration() {
    if (isRefreshTokenExpired()) {
        isAutoLoggedOut.value = true
        nullifyTokens()
    }
}

onBeforeMount(() => {
    resolveLoginExpiration()
})
</script>

<style lang="css" scoped>
.auto-loggedout-text {
    text-align: center;
}

.prompt-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2rem;
    flex-grow: 1;
    padding-bottom: 5%;
}

.prompt-container p {
    text-align: center;
    font-size: 1.25rem;
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
