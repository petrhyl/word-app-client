<template>
    <PageWrapper>
        <PageTitle title="New Password" description="Type the new password to be used for logging&nbsp;in" />
        <ChangePasswordForm
            v-if="!isChanged"
            :isLoading="isLoading"
            :isError="isError"
            :errorMessage="errorMessage"
            :is-forgotten="true"
            @on-submit-forgotten="handleSubmit"
            @on-valid-state="handleValidState"
        />
        <PrimaryCard v-else>
            <p class="success-message">Your password has been changed successfully</p>
            <p class="text-center">You can loggin now with new password</p>
            <div class="nav">
                <AppButton type="link" :button-style="'primary'" :route="{ name: ROUTE_NAMES.login }">Log in</AppButton>
            </div>
        </PrimaryCard>
    </PageWrapper>
</template>

<script setup lang="ts">
import ChangePasswordForm from "@/components/forms/ChangePasswordForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { ResetPasswordRequest } from "@/types/requests"
import { ref } from "vue"

const props = defineProps<{
    code: string
}>()

const { callApi } = useCallApi()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isChanged = ref(false)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(password: string) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<ResetPasswordRequest, { message: string }>({
        method: "PUT",
        endpoint: "/user/reset-password",
        body: { password, verificationKey: props.code }
    })

    if (response.isError) {
        isError.value = true
    } else {
        isChanged.value = true
    }

    isLoading.value = false
}
</script>

<style lang="css" scoped>
.nav {
    display: flex;
    justify-content: center;
}
</style>
