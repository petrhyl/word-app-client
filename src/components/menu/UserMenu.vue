<template>
    <DropDownMenu class="user-drop-down-menu">
        <template #button>
            <AppButton :type="'button'" :buttonStyle="'ternary'">
                {{ getUserName }}
            </AppButton>
        </template>
        <template #items>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.profile }"
                    >Profile</AppButton
                >
            </DropDownMenuItem>
            <div class="delimeter"><div></div></div>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.practice }"
                    >Start Practice</AppButton
                >
            </DropDownMenuItem>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.languagesStats }"
                    >Language Stats</AppButton
                >
            </DropDownMenuItem>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'link'" :buttonStyle="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary }"
                    >Add Vocabulary</AppButton
                >
            </DropDownMenuItem>
            <div class="delimeter"><div></div></div>
            <DropDownMenuItem class="user-menu-item">
                <AppButton :type="'button'" :buttonStyle="'secondary'" @click-button="handleLogout">Log Out</AppButton>
            </DropDownMenuItem>
        </template>
    </DropDownMenu>
    <nav class="user-responsive-menu" id="user-nav-menu">
        <div class="user-name-container">
            <p>{{ getUserName }}</p>
        </div>
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.profile }">Profile</AppButton>
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.home }"> Home </AppButton>
        <div class="delimeter"><div></div></div>
        <AppButton
            :type="'link'"
            :buttonStyle="'primary'"
            :route="{ name: ROUTE_NAMES.practice }"
            >Start Practice</AppButton
        >
        <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.languagesStats }"
            >Language Stats</AppButton
        >
        <AppButton :type="'link'" :buttonStyle="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary }"
            >Add Vocabulary</AppButton
        >
        <div class="delimeter"><div></div></div>
        <AppButton :type="'button'" :buttonStyle="'secondary'" @click-button="handleLogout">Log Out</AppButton>
    </nav>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import DropDownMenu from "@/components/menu/dropdown/DropDownMenu.vue"
import { ROUTE_NAMES } from "@/router"
import useUserAuth from "@/composables/useUserAuth"
import DropDownMenuItem from "./dropdown/DropDownMenuItem.vue"
import { computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
    closeMenu: () => void
}>()

const { user, logout } = useUserAuth()
const router = useRouter()

const getUserName = computed(() => {
    let username = user.value?.name

    if (username && username?.length > 15) {
        return username.slice(0, 14) + "..."
    }

    return username
})

function handleLogout() {
    logout()
    router.replace({ name: ROUTE_NAMES.home })
}

onMounted(() => {
    for (const el of document.querySelector("#user-nav-menu")?.children || []) {
        if (el.tagName === "A" || el.tagName === "BUTTON") {
            el.addEventListener("click", props.closeMenu)
        }
    }
})

onUnmounted(() => {
    for (const el of document.querySelector("#user-nav-menu")?.children || []) {
        if (el.tagName === "A" || el.tagName === "BUTTON") {
            el.removeEventListener("click", props.closeMenu)
        }
    }
})
</script>

<style lang="css" scoped>
.user-drop-down-menu {
    display: flex;
}

.user-responsive-menu {
    display: none;
}

.user-menu-item {
    min-width: 250px;
}

.delimeter {
    display: flex;
    justify-content: center;
    padding: 0.25rem 0;
}

.user-name-container {
    display: flex;
    justify-content: center;
    font-weight: 600;
}

.delimeter > div {
    height: 2px;
    width: 90%;
    background-color: var(--primary-font-color);
}

@media screen and (max-width: 980px) {
    .user-drop-down-menu {
        display: none;
    }

    .user-responsive-menu {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
}
</style>
