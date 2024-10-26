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
            <p class="text-center">Password has been changed</p>
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
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import useUserAuth from "@/composables/useUserAuth"
import { ROUTE_NAMES } from "@/router"
import { ChangePasswordRequest } from "@/types/requests"
import { AuthResponse } from "@/types/responses"
import { FaceSmileIcon } from "@heroicons/vue/24/solid"
import { ref } from "vue"


const { callApi } = useCallApi()
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

    console.log(data)

    isLoading.value = true

    const response = await callApi<ChangePasswordRequest, { auth: AuthResponse }>({
        method: "PUT",
        endpoint: "/user/change-password",
        body: data
    })

    if (response.isError) {
        isError.value = true

        if (response.errorType === ErrorResponseType.UNPROCESSABLE_ENTITY) {
            errorMessage.value = "Invalid user's current password"
        }

        isLoading.value = false

        return
    }

    setTokens(
        response.data!.auth.token.accessToken,
        response.data!.auth.token.accessTokenExpiresIn,
        response.data!.auth.token.refreshToken,
        response.data!.auth.token.refreshTokenExpireIn
    )

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
