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
            <div class="start-practice-container">
                <div class="start-practice-wrapper">
                    <AppButton type="link" buttonStyle="primary" :route="{ name: ROUTE_NAMES.practice }">
                        Start Practice
                    </AppButton>
                </div>
            </div>
            <AppButton type="link" button-style="primary" :route="{ name: ROUTE_NAMES.languagesStats }"
                >Language Stats</AppButton
            >
            <AppButton type="link" button-style="primary" :route="{ name: ROUTE_NAMES.vocabularyLanguages }"
                >Languages</AppButton
            >
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.addVocabulary }"
                >Add Vocabulary</AppButton
            >
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.createLanguage }"
                >New Language</AppButton
            >
        </div>
    </div>
    <div class="account-nav-container">
        <div class="nav-title">
            <h2>Account Actions</h2>
        </div>
        <div class="account-nav">
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.changePassword }"
                >Change Password</AppButton
            >
            <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.updateUser }"
                >Update Profile</AppButton
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

.start-practice-container {
    display: flex;
    justify-content: center;
    grid-column: span 2;
}

@media screen and (max-width: 980px) {
    .details-container {
        row-gap: 1rem;
        padding-top: 0;
    }

    .account-nav-container {
        padding-top: 1rem;
    }

    .account-nav {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }

    .start-practice-container {
        grid-column: span 1;
    }

    .start-practice-wrapper {
        width: 100%;
    }
}
</style>
