<template>
    <PageWrapper>
        <PageTitle title="Reset Password" description="We will send you verification e-mail to create a new password" />
        <ForgetPasswordForm
            v-if="!isSent"
            :isLoading="isLoading"
            :isError="isError"
            :errorMessage="errorMessage"
            @on-submit="handleSubmit"
            @on-valid-state="handleValidState"
        />
        <PrimaryCard v-else>
            <p class="text-center">We have sent you an e-mail to reset your password</p>
            <p class="text-center">Please check your inbox</p>
            <p class="text-center small">It may take a few minutes</p>
        </PrimaryCard>
    </PageWrapper>
</template>

<script setup lang="ts">
import ForgetPasswordForm from "@/components/forms/ForgetPasswordForm.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import { ForgetPasswordRequest } from "@/types/requests"
import { ref } from "vue"

const { callApi } = useCallApi()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isSent = ref(false)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(data: ForgetPasswordRequest) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<ForgetPasswordRequest, null>({
        method: "POST",
        endpoint: "/user/forget-password",
        body: data
    })

    if (response.isError) {
        if (response.errorType === ErrorResponseType.INTERNAL_SERVER_ERROR) {
            isError.value = true
        }

        console.error("error while sending e-mail to reset password")

        isLoading.value = false

        return
    }

    isSent.value = true
    isLoading.value = false

    setTimeout(() => {
        isSent.value = false
    }, 10000)
}
</script>

<style lang="css" scoped>
.small {
    font-size: 0.8rem;
    color: var(--secondary-font-color);
}
</style>
