<template>
    <PageWrapper>
        <PageTitle title="E-mail verification" :description="getDescription" />
        <PrimaryCard>
            <div v-if="isLoading" class="verification-state">
                <p>Please wait until we verify your e-mail address.</p>
                <LoadingSpinner :strip-color="'#14f9ff'" :spinner-width-height="'2.75rem'" :circle-width="6" />
            </div>
            <div v-if="!isLoading && !isKeyValid" class="verification-state">
                <p>Verification key is invalid or has been already used.</p>
                <FaceFrownIcon class="invalid-state-icon" />
            </div>
            <div v-if="!isLoading && isKeyValid" class="verification-state">
                <p>Your e-mail address was successfully verified.</p>
                <FaceSmileIcon class="success-state-icon" />
                <p>Now you can log in to your account.</p>
                <div class="login-button">
                    <AppButton :type="'link'" :style="'primary'" :route="{ name: ROUTE_NAMES.login }">Log in</AppButton>
                </div>
            </div>
        </PrimaryCard>
    </PageWrapper>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingSpinner from "@/components/ui/button/LoadingSpinner.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/vue/24/solid"
import { computed, onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { callApi } = useCallApi()

const isKeyValid = ref(false)
const isLoading = ref(true)

const getDescription = computed(() => {
    if (isLoading.value) {
        return "Please wait while we verify your account."
    }

    return "Here is your account verification result."
})

onBeforeMount(async () => {
    const key = route.params.token
    if (!key) {
        isKeyValid.value = false
        isLoading.value = false

        return
    }

    const response = await callApi<null, { message: string }>({ method: "POST", endpoint: `/user/verification/${key}` })

    isKeyValid.value = !response.isError
    isLoading.value = false
})
</script>

<style lang="css" scoped>
.verification-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem 0;
}

.verification-state p {
    text-align: center;
}

.success-state-icon {
    color: var(--success-color);
}

.invalid-state-icon {
    color: var(--warning-color);
}

.success-state-icon,
.invalid-state-icon {
    width: 3rem;
    height: 3rem;
}

.login-button-container {
    display: flex;
    justify-content: center;
}
</style>
