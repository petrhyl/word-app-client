<template>
    <PageWrapper>
        <PageTitle
            title="Reset Password"
            description="We will send you verification e-mail to reset your&nbsp;password"
        />
        <ForgetPasswordForm
            v-if="!isSent"
            :isLoading="isLoading"
            :isError="isError"
            :errorMessage="errorMessage"
            @on-submit="handleSubmit"
            @on-valid-state="handleValidState"
        />
        <PrimaryCard v-else>
            <p class="success-message">We have sent you an e-mail to reset your password</p>
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
        if (response.errorType === ErrorResponseType.FORBIDDEN) {
            errorMessage.value = "Your e-mail address is not verified yet"
        } else if (response.errorType === ErrorResponseType.NOT_FOUND) {
            errorMessage.value = "User with provided e-mail was not found"
        } else {
            errorMessage.value = "Something went wrong, please try again later"
        }

        isError.value = true
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
