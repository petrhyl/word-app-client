<template>
    <PageTitle title="Create Language" description="Here you can create new language for your vocabulary to practise" />
    <CreateLanguageForm
        v-if="allowedLanguages.length > 0"
        :is-error="isError"
        :is-loading="isLoading"
        :error-message="null"
        :allowed-languages="allowedLanguages"
        @on-submit="handleSubmit"
        @on-valid-state="handleValidState"
    />
    <PrimaryCard v-else>
        <div class="loading-container">
            <LoadingSpinner spinner-width-height="3rem" />
        </div>
    </PrimaryCard>
</template>

<script setup lang="ts">
import CreateLanguageForm from "@/components/forms/CreateLanguageForm.vue"
import LoadingSpinner from "@/components/ui/button/LoadingSpinner.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import useCallApi from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
import { AppLanguage, UserVocabularyLanguage } from "@/types/models"
import { LanguageResponse } from "@/types/responses"
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

const { callApi } = useCallApi()
const router = useRouter()

const allowedLanguages = ref<AppLanguage[]>([])
const isLoading = ref(false)
const isError = ref(false)

async function handleSubmit(data: AppLanguage) {
    if (isLoading.value) {
        return
    }

    isLoading.value = true

    const response = await callApi<null, { language: UserVocabularyLanguage }>({
        method: "POST",
        endpoint: `/languages/${data.code}`
    })

    if (response.isError) {
        isError.value = true
        isLoading.value = false

        return
    }

    router.push({ name: ROUTE_NAMES.addVocabulary })
}

function handleValidState() {
    isError.value = false
}

onBeforeMount(async () => {
    const response = await callApi<null, LanguageResponse>({ method: "GET", endpoint: "/languages/allowed" })
    if (!response.isError) {
        allowedLanguages.value = response.data!.languages
    }
})
</script>
