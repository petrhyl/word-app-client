<template>
    <PageWrapper>
        <PageTitle :title="getTitle" :description="getDescription" />
        <SignupForm
            v-if="!isRegistered"
            :is-loading="isLoading"
            :is-error="isError"
            :error-message="errorMessage"
            @on-submit="handleSubmit"
            @on-valid-state="handleValidState"
        />
        <PrimaryCard v-else>
            <p class="registered-thanks">Your account was created successfully</p>
            <p class="registered-message">
                To log in, please verify your email address by clicking on the link in the email we sent you.
            </p>
            <p>It could take a few minutes to receive the verification e-mail.</p>
        </PrimaryCard>
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
import AppButton from "@/components/ui/button/AppButton.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { ErrorResponseType } from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { useUserStore } from "@/store/user/userStore"
import { UserRegistration } from "@/types/requests"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

const { register } = useUserStore()
const router = useRouter()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)
const isRegistered = ref(false)

const getTitle = computed(() => (isRegistered.value ? "Account created" : "Account registration"))
const getDescription = computed(() =>
    isRegistered.value ? "Thank you for signing up." : "Sign up to be able to create your own vocabulary to practice."
)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(data: UserRegistration) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await register(data)

    isError.value = response.isError

    errorMessage.value =
        response.errorType === ErrorResponseType.UNPROCESSABLE_ENTITY ? "E-mail is already taken" : null
    isLoading.value = false

    if (!response.isError && response.data !== null) {
        isRegistered.value = true
        window.scrollY = 0
        setTimeout(() => {
            router.push({ name: ROUTE_NAMES.home })
        }, 10000)
    }
}
</script>

<style lang="css" scoped>
.registered-thanks {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--success-color);
}

.registered-message {
    text-align: center;
}

.flex-col-center {
    row-gap: 1rem;
}
</style>
