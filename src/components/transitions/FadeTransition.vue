<template>
    <Transition mode="out-in">
        <slot></slot>
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.175s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>