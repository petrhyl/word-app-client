<template>
    <nav>
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
                <DropDownMenuItem v-if="isStartVisible" class="user-menu-item">
                    <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.practise }"
                        >Start Practise</AppButton
                    >
                </DropDownMenuItem>
                <DropDownMenuItem class="user-menu-item">
                    <AppButton :type="'link'" :buttonStyle="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary }"
                        >Add Vocabulary</AppButton
                    >
                </DropDownMenuItem>
                <div class="delimeter"><div></div></div>
                <DropDownMenuItem class="user-menu-item">
                    <AppButton :type="'button'" :buttonStyle="'secondary'" @click-button="handleLogout"
                        >Log Out</AppButton
                    >
                </DropDownMenuItem>
            </template>
        </DropDownMenu>
        <div class="user-responsive-menu">
            <AppButton :type="'link'" :buttonStyle="'primary'" :route="{ name: ROUTE_NAMES.profile }"
                >Profile</AppButton
            >
            <AppButton
                v-if="isStartVisible"
                :type="'link'"
                :buttonStyle="'primary'"
                :route="{ name: ROUTE_NAMES.practise }"
                >Start Practise</AppButton
            >
            <AppButton :type="'link'" :buttonStyle="'secondary'" :route="{ name: ROUTE_NAMES.addVocabulary }"
                >Add Vocabulary</AppButton
            >
            <div class="delimeter"><div></div></div>
            <AppButton :type="'button'" :buttonStyle="'secondary'" @click-button="handleLogout">Log Out</AppButton>
        </div>
    </nav>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/button/AppButton.vue"
import DropDownMenu from "@/components/menu/dropdown/DropDownMenu.vue"
import { ROUTE_NAMES } from "@/router"
import useUserAuth from "@/composables/useUserAuth"
import DropDownMenuItem from "./dropdown/DropDownMenuItem.vue"
import { computed } from "vue"
import { useRouter } from "vue-router"

const { user, logout } = useUserAuth()
const router = useRouter()

const isStartVisible = computed(() => {
    return router.currentRoute.value.name !== ROUTE_NAMES.practiseRunning
})

const getUserName = computed(() => {
    let username = user.value?.name

    if (username && username?.length > 10) {
        return username.slice(0, 10) + "..."
    }

    return username
})

function handleLogout() {
    logout()
    router.push({ name: ROUTE_NAMES.home })
}
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
