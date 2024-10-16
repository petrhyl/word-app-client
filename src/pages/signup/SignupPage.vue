<template>
    <PageWrapper>
        <h1>Create your account</h1>
        <p class="description">Sign up to be able to create your own vocabulary to practise.</p>
        <SignupForm :is-loading="isLoading" :is-error="isError" @on-submit="handleSubmit" />
    </PageWrapper>
</template>

<script setup lang="ts">
import SignupForm from "@/components/forms/SignupForm.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import { useUserStore } from "@/store/user/userStore"
import { UserRegistration } from "@/types/requests"
import { ref } from "vue"

const { register } = useUserStore()

const isLoading = ref(false)
const isError = ref(false)

async function handleSubmit(data: UserRegistration) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const result = await register(data)

    isError.value = !result
    isLoading.value = false
}
</script>


<style lang="css" scoped>
.description{
    text-align: center;
}
</style>