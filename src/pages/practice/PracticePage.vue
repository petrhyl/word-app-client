<template>
    <PageWrapper>
        <PageTitle
            title="Practice Setting"
            description="Firstly, choose settings of vocabulary you&nbsp;want to practice"
        />
        <PractiseSettingForm
            v-if="areLanguagesLoaded && userLanguagesOptions.length > 0"
            :amounts="wordAmountOptions"
            :languages="userLanguagesOptions"
            :is-loading="false"
            @on-submit="handleSubmit"
        />
        <PrimaryCard v-else-if="areLanguagesLoaded">
            <p class="text-center">You don't have any languages to practice</p>
            <p class="text-center">Let's create a new vocabulary language first</p>
            <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.createLanguage }"
                >New language</AppButton
            >
        </PrimaryCard>
        <LoadingCard v-else />
    </PageWrapper>
</template>

<script setup lang="ts">
import { SelectionOptionProps } from "@/components/forms/elements/FormElementProps"
import PractiseSettingForm from "@/components/forms/PracticeSettingForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingCard from "@/components/ui/card/LoadingCard.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi from "@/composables/useCallApi"
import { ERROR_ROUTE_ERRORS, ROUTE_NAMES } from "@/router"
import { ExerciseQueryParams } from "@/types/requests"
import { UserVocabularyLanguagesResponse } from "@/types/responses"
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

const { callApi } = useCallApi()
const router = useRouter()

const wordAmountOptions: SelectionOptionProps[] = [
    { value: "5", label: "5 words" },
    { value: "10", label: "10 words" },
    { value: "15", label: "15 words" },
    { value: "20", label: "20 words" },
    { value: "30", label: "30 words" },
    { value: "50", label: "50 words" }
]

const userLanguagesOptions = ref<SelectionOptionProps[]>([])

const areLanguagesLoaded = ref(false)

function handleSubmit(data: ExerciseQueryParams) {
    router.push({
        name: ROUTE_NAMES.practiceRunning,
        query: { langId: data.langId.toString(), limit: data.limit.toString() }
    })
}

onBeforeMount(async () => {
    const result = await callApi<null, UserVocabularyLanguagesResponse>({ method: "GET", endpoint: "/languages/user" })

    if (!result.isError) {
        userLanguagesOptions.value = result.data!.languages.map(lang => ({
            value: lang.id.toString(),
            label: lang.name
        }))
    } else {
        throw new Error(ERROR_ROUTE_ERRORS.dataFetchingError)
    }

    areLanguagesLoaded.value = true
})
</script>