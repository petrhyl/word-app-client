<template>
    <div class="form-card">
        <slot></slot>
    </div>
</template>

<style scoped>
.form-card {
    display: flex;
    width: 96%;
    max-width: 480px;
    padding: 1rem;
    border-radius: 5px;
    border: 2px solid #82828244;
}
</style>