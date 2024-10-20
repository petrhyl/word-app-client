import { InjectionKey } from "vue";

export interface DropDownMenuProvider {
    closeMenu(): void
}

export const dropDownMenuInjectionKey = Symbol() as InjectionKey<DropDownMenuProvider>