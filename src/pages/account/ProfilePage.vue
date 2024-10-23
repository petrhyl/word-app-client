<template>
    <PageTitle title="Your Account" description="Here you can view your account details" />
    <div class="details-container">
        <div class="detail-item">
            <div class="detail-label">Username</div>
            <div class="detail-value">{{ user?.name }}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">E-mail</div>
            <div class="detail-value">{{ user?.email }}</div>
        </div>
    </div>
    <div class="account-nav-container">
        <div class="nav-title">
            <h2>Account Navigation</h2>
        </div>
        <div class="account-nav">
            <AppButton type="link" button-style="primary" :route="{ name: ROUTE_NAMES.vocabularyStats }"
                >View Stats</AppButton
            >
            <AppButton type="link"  buttonStyle="primary" :route="{ name: ROUTE_NAMES.practise }">
                Start Practise
            </AppButton>
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.addVocabulary }"
                >Add Vocabulary</AppButton
            >
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.createLanguage }"
                >New Language</AppButton
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useUserAuth from "@/composables/useUserAuth"
import { ROUTE_NAMES } from "@/router"

const { user } = useUserAuth()
</script>

<style scoped>
.details-container {
    display: flex;
    flex-direction: column;
    row-gap: 1.25rem;
    padding-top: 1rem;
}

.detail-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    column-gap: 2.5rem;
}

.detail-label {
    font-family: var(--title-font);
    color: var(--secondary-font-color);
}

.account-nav-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2rem;
}

.account-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding-top: 1.5rem;
}

@media screen and (max-width: 980px) {
    .account-nav {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }    
}
</style>
