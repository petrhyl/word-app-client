<template>
    <div class="form-card">
        <slot></slot>
    </div>
</template>

<style scoped>
.form-card {
    display: flex;
    width: 100%;
    max-width: 480px;
    padding: 1.5rem;
    border-radius: 5px;
    border: 2px solid #82828244;
}

@media screen and (max-width: 980px) {
    .form-card {
        padding: 1.25rem;
    }
}
</style>