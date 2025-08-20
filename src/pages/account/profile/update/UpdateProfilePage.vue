<template>
    <PageTitle title="Update Profile" description="Here you can update your name" />
    <UpdateUserForm
        :is-loading="isLoading"
        :is-error="isError"
        :error-message="errorMessage"
        :previous-username="user?.name || ''"
        @on-submit="handleSubmit"
        @on-valid-state="handleValidState"
    />
</template>

<script setup lang="ts">
import UpdateUserForm from "@/components/forms/UpdateUserForm.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useUserAuth from "@/composables/useUserAuth"
import ApiAccessor from "@/data/ApiAccessor"
import { ROUTE_NAMES } from "@/router"
import { UpdateUserRequest } from "@/types/requests"
import { UserResponse } from "@/types/responses"
import { ref } from "vue"
import { useRouter } from "vue-router"

const callApi = ApiAccessor.callApi
const { user, setUser } = useUserAuth()
const router = useRouter()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref<string | null>(null)

function handleValidState() {
    errorMessage.value = null
    isError.value = false
}

async function handleSubmit(data: UpdateUserRequest) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<UpdateUserRequest, UserResponse>({
        endpoint: "/user",
        method: "PUT",
        body: data
    })

    if (response.error) {
        isError.value = true
        isLoading.value = false

        return
    }

    if (response.data?.user) {
        setUser(response.data.user)
    }

    router.push({ name: ROUTE_NAMES.profile })
}
</script>
