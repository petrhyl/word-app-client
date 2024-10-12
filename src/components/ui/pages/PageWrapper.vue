<template>
    <div class="page-wrapper">
        <slot></slot>
    </div>
</template>

<style lang="css" scoped>
.page-wrapper {
    height: 100%;
    width: 100%;
    max-width: 980px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 5rem;  
    row-gap: 2rem;  
}
</style>
