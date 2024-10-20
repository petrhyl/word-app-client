<template>
    <div class="page-wrapper">
        <slot></slot>
    </div>
</template>

<style lang="css" scoped>
.page-wrapper {
    width: 100%;
    max-width: 780px;
    height: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    padding: 3.5rem 1.25rem 2rem 1.25rem;  
    row-gap: 2rem;  
}

@media screen and (max-width: 980px) {
    .page-wrapper {
        padding-top: 2.5rem;
    }
}
</style>
