<template>
    <PageTitle title="Change Password" description="Here you can change your password" />
    <ChangePasswordForm
        v-if="!isChanged"
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
        @on-valid-state="handleValidState"
        @on-submit-change="handleSubmit"
    />
    <PrimaryCard v-else>
        <div class="flex-col-center">
            <p class="success-message">Password has been changed</p>
            <FaceSmileIcon class="state-icon" />
            <p class="text-center">Continue to:</p>
            <div class="nav">
                <AppButton type="link" button-style="primary" :route="{ name: ROUTE_NAMES.profile }">Profile</AppButton>
                <AppButton type="link" button-style="secondary" :route="{ name: ROUTE_NAMES.home }"
                    >Home Page</AppButton
                >
            </div>
        </div>
    </PrimaryCard>
</template>

<script setup lang="ts">
import ChangePasswordForm from "@/components/forms/ChangePasswordForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useUserAuth from "@/composables/useUserAuth"
import ApiAccessor, { ErrorResponseType } from "@/data/ApiAccessor"
import { ROUTE_NAMES } from "@/router"
import { ChangePasswordRequest } from "@/types/requests"
import { AuthResponse } from "@/types/responses"
import { FaceSmileIcon } from "@heroicons/vue/24/solid"
import { ref } from "vue"


const callApi = ApiAccessor.callApi
const { setTokens } = useUserAuth()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isChanged = ref(false)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(data: ChangePasswordRequest) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<ChangePasswordRequest, { auth: AuthResponse }>({
        method: "PUT",
        endpoint: "/user/change-password",
        body: data
    })

    if (response.isError) {
        isError.value = true

        if (response.errorType === ErrorResponseType.BAD_REQUEST) {
            errorMessage.value = "Invalid user's current password"
        }

        isLoading.value = false

        return
    }

    if (response.data?.auth.authToken) {        
        setTokens(response.data.auth.authToken)
    }

    isChanged.value = true
    isLoading.value = false
}
</script>

<style lang="css" scoped>
.flex-col-center {
    padding: 1rem 0;
    gap: 2rem;
}

.state-icon {
    width: 3rem;
    height: 3rem;
    margin: 0.25rem auto;
    color: var(--success-color);
}

.nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}
</style>
