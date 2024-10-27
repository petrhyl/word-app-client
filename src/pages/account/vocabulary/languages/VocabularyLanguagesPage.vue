<template>
    <PageTitle
        title="Languages of your vocabularies"
        description="Here you can view all the languages in which you can practice your vocabulary"
    />
    <LoadingCard v-if="isLoading" />
    <PrimaryCard v-else-if="languages.length === 0 && !isLoading">
        <p class="text-center">You have not created any languages to your vocabulary yet.</p>
    </PrimaryCard>
    <LanguageList v-else :languages="languages" @delete-language="handleDelete" />
    <ModalWindow :show="isConfirmingFormOpen" @click-close-button="isConfirmingFormOpen = false">
        <p class="delete-prompt text-center">Are you sure you want to delete {{ getDeletingLanguageName }} language?</p>
        <p class="text-center">The entire vocabulary of this language will be deleted</p>
        <div class="button-group">
            <AppButton type="button" button-style="danger" @click-button="submitDelete" :is-submitting="isDeleting"
                >Delete</AppButton
            >
            <AppButton type="button" button-style="secondary" @click-button="isConfirmingFormOpen = false"
                >Cancel</AppButton
            >
        </div>
    </ModalWindow>
</template>

<script setup lang="ts">
import ModalWindow from "@/components/single/ModalWindow.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import LanguageList from "@/components/vocabulary/LanguageList.vue"
import useCallApi from "@/composables/useCallApi"
import { ERROR_ROUTE_ERRORS } from "@/router"
import { UserVocabularyLanguage } from "@/types/models"
import { UserVocabularyLanguagesResponse } from "@/types/responses"
import { computed, onBeforeMount, ref } from "vue"

const { callApi } = useCallApi()

const isLoading = ref(true)
const isDeleting = ref(false)
const isError = ref(false)
const languages = ref<UserVocabularyLanguage[]>([])
const idToDelete = ref<number | null>(null)
const isConfirmingFormOpen = ref(false)

const getDeletingLanguageName = computed(() => {
    return languages.value.find(lang => lang.id === idToDelete.value)?.name
})

function handleDelete(id: number) {
    idToDelete.value = id

    isConfirmingFormOpen.value = true
}

async function submitDelete() {
    if (isDeleting.value || !idToDelete.value) {
        return
    }

    isDeleting.value = true

    const response = await callApi<null, null>({
        method: "DELETE",
        endpoint: `/languages/${idToDelete.value}`
    })

    if (response.isError) {
        isError.value = true
    } else {
        languages.value = languages.value.filter(language => language.id !== idToDelete.value)
        isConfirmingFormOpen.value = false
    }

    isDeleting.value = false
}

onBeforeMount(async () => {
    const response = await callApi<null, UserVocabularyLanguagesResponse>({
        method: "GET",
        endpoint: "/languages/user"
    })

    if (response.isError) {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    languages.value = response.data?.languages || []
    isLoading.value = false
})
</script>

<style lang="css" scoped>
.delete-prompt {
    color: var(--warning-color);
    font-size: 1.25rem;
    font-weight: 600;
}

.button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}
</style>
