<template>
    <PageWrapper>
        <PageTitle :title="getTitle" :description="getDescription" />
        <FadeTransition>
            <SignupForm
                v-if="!isRegistered"
                :is-loading="isLoading"
                :is-error="isError"
                :error-message="errorMessage"
                @on-submit="handleSubmit"
                @on-valid-state="handleValidState"
            />
            <PrimaryCard v-else>
                <p class="success-message">Your account has been created successfully</p>
                <p class="text-center">
                    To log in, please verify your email address by clicking on the link in the email we have sent you.
                </p>
                <p class="text-center small">It could take a few minutes to receive the verification e-mail.</p>
                <p v-if="isSent" class="text-center">You can resend verification e-mail in {{ counter }} seconds</p>
                <div v-else class="resend-link">
                    <AppButton :type="'button'" :button-style="'link'" @click-button="resendEmail">
                        Resend verification e-mail
                    </AppButton>
                </div>
            </PrimaryCard>
        </FadeTransition>
        <div class="flex-col-center">
            <p class="text-center">Or log in to your account</p>
            <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.login }">
                Log In
            </AppButton>
        </div>
    </PageWrapper>
</template>

<script setup lang="ts">
import SignupForm from "@/components/forms/SignupForm.vue"
import FadeTransition from "@/components/transitions/FadeTransition.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi, { ErrorResponseType } from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { useUserStore } from "@/store/user/userStore"
import { SendVerificationEmailRequest, UserRegistration } from "@/types/requests"
import { computed, ref } from "vue"

const SECONDS_TO_RESEND = 60

const { register } = useUserStore()
const { callApi } = useCallApi()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isRegistered = ref(false)
const counter = ref(SECONDS_TO_RESEND)
const isSent = ref(false)
const userEmail = ref<string | null>(null)

const getTitle = computed(() => (isRegistered.value ? "Account created" : "Account registration"))
const getDescription = computed(() =>
    isRegistered.value ? "Thank you for signing up." : "Sign up to be able to create your own vocabulary to practice."
)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

function startDecreaseCounter() {
    isSent.value = true

    const interval = setInterval(() => {
        counter.value--

        if (counter.value === 0) {
            clearInterval(interval)
            counter.value = SECONDS_TO_RESEND
            isSent.value = false
        }
    }, 1000)
}

async function handleSubmit(data: UserRegistration) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    userEmail.value = data.email

    const response = await register(data)

    isError.value = response.isError

    errorMessage.value = response.errorType === ErrorResponseType.BAD_REQUEST ? "E-mail is already taken" : null

    if (!response.isError && response.data !== null) {
        isRegistered.value = true
        window.scrollTo(0, 0)
        startDecreaseCounter()
    }

    isLoading.value = false
}

async function resendEmail() {
    startDecreaseCounter()

    const response = await callApi<SendVerificationEmailRequest, { message: string }>({
        method: "POST",
        endpoint: "/user/send",
        body: {
            email: userEmail.value!
        }
    })

    if (response.isError) {
        console.error(response.error || "Failed to resend verification email")
    }
}
</script>

<style lang="css" scoped>
.small {
    color: var(--secondary-font-color);
}

.flex-col-center {
    row-gap: 1rem;
}

.resend-link {
    display: flex;
    justify-content: center;
}
</style>
