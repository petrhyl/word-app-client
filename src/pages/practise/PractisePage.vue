<template>
    <PageWrapper>
        <PageTitle
            title="Practise Setting"
            description="Firstly, choose settings of vocabulary you&nbsp;want to practise"
        />
        <PractiseSettingForm
            v-if="areLanguagesLoaded && userLanguagesOptions.length > 0"
            :amounts="wordAmountOptions"
            :languages="userLanguagesOptions"
            :is-loading="false"
            @on-submit="handleSubmit"
        />
        <PrimaryCard v-else-if="isError">
            <h3 class="text-center">Error</h3>
            <p class="text-center">An error occurred while loading your languages</p>
        </PrimaryCard>
        <PrimaryCard v-else-if="areLanguagesLoaded">
            <p class="text-center">You don't have any languages to practise</p>
            <p class="text-center">Let's create a new vocabulary language first</p>
            <AppButton :type="'link'" :button-style="'primary'" :route="{ name: ROUTE_NAMES.createLanguage }"
                >New language</AppButton
            >
        </PrimaryCard>
        <PrimaryCard v-else>
            <div class="loading-container">
                <LoadingSpinner spinner-width-height="3rem" />
            </div>
        </PrimaryCard>
    </PageWrapper>
</template>

<script setup lang="ts">
import { SelectionOptionProps } from "@/components/forms/elements/FormElementProps"
import PractiseSettingForm from "@/components/forms/PractiseSettingForm.vue"
import AppButton from "@/components/ui/button/AppButton.vue"
import LoadingSpinner from "@/components/ui/button/LoadingSpinner.vue"
import PrimaryCard from "@/components/ui/card/PrimaryCard.vue"
import PageTitle from "@/components/ui/page/PageTitle.vue"
import PageWrapper from "@/components/ui/page/PageWrapper.vue"
import useCallApi from "@/composables/useCallApi"
import { ROUTE_NAMES } from "@/router"
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
const isError = ref(false)

function handleSubmit(data: ExerciseQueryParams) {
    router.push({
        name: ROUTE_NAMES.practiseRunning,
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
        isError.value = true
    }

    areLanguagesLoaded.value = true
})
</script>

<style lang="css" scoped>
.loading-container {
    height: 5rem;
    min-width: 30vw;
    display: flex;
    justify-content: center;
    padding-top: 1.25rem;
}
</style>
