<template>
    <div class="primary-card">
        <slot></slot>
    </div>
</template>

<style scoped>
.primary-card{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background-color: var(--secondary-bg-color);
    border-radius: var(--border-radius);
    border: 2px solid var(--form-border-color);
    box-shadow: var(--shadow);
    padding: 1.5rem;
}
</style>