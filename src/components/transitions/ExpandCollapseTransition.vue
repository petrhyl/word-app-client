<template>
    <Transition name="expandcollapse" type="animation" mode="out-in">
        <slot></slot>
    </Transition>
</template>

<style scoped>
.expandcollapse-enter-active {
    transform-origin: top;
    animation: expand-collapse 170ms;
}

.expandcollapse-leave-active {
    transform-origin: top;
    animation: expand-collapse 170ms reverse;
}

@keyframes expand-collapse {
    0% {
        transform: scaleY(0);
        opacity: 0;
    }
    100% {
        transform: scaleY(1);
        opacity: 1;
    }
}
</style>
