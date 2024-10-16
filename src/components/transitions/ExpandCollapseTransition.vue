<template>
    <Transition name="expand-collapse" mode="out-in">
        <slot></slot>
    </Transition>
</template>

<style scoped>
.expand-collapse-enter-active {
    animation: drop-up 0.17s;
}

.expand-collapse-leave-active {
    animation: drop-up 0.17s reverse;
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
