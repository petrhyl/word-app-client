<template>
    <div class="primary-card">
        <slot></slot>
    </div>
</template>

<style scoped>
.primary-card{
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: var(--secondary-bg-color);
    border-radius: var(--border-radius);
    border: var(--card-border);
    box-shadow: var(--shadow);
    padding: 1.5rem;
}
</style>