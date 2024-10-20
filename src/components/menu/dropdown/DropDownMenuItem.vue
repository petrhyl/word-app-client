<template>
    <li class="dropdown-menu-item" @click="handleClick">
        <slot></slot>
    </li>
</template>

<script setup lang="ts">
import { inject } from "vue"
import { dropDownMenuInjectionKey } from "./DropDownMenuProvider"

const { closeMenu } = inject(dropDownMenuInjectionKey, {
    closeMenu: () => {}
})

function handleClick() {
    closeMenu()
}
</script>
