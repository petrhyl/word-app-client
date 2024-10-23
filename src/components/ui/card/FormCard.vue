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
    border-radius: var(--border-radius);
    border: var(--card-border);
    box-shadow: var(--shadow);
}

@media screen and (max-width: 980px) {
    .form-card {
        padding: 1.25rem;
    }
}
</style>