<template>
    <FormCard>
        <form @submit.prevent="handleSubmit">
            
        </form>
    </FormCard>
</template>

<script setup lang="ts">
import { UserLogin } from '@/types/requests';
import FormCard from '../ui/form/FormCard.vue';
import { ref } from 'vue';


const props = defineProps<{
    isLoading: boolean
}>()

const emits = defineEmits<{
    onSubmit: [data: UserLogin]
}>()

const isSubmitted = ref(false)

function handleSubmit() {
    if (props.isLoading) {
        return
    }
    
    isSubmitted.value = true
}
</script>

<style lang="css" scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>