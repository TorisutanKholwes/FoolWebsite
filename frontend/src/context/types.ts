import * as React from "react";
import ApiClient from "../api/client.ts";
import { EmptyFunction, PanelType } from "../utils/types.ts";
import { ApiStatus } from "../api/types.ts";

export type ApiContextType = {
    api: ApiClient,
    login: (token: string) => void,
    logout: EmptyFunction,
    token: string | null,
    isAuthenticated: boolean,
    apiOnline: ApiStatus,
    loading: boolean
}

export type PopupContextType = {
    showPopup: (message: string, exclamation?: boolean, animated?: boolean) => void
    hidePopup: EmptyFunction
}

export type PanelContextType = {
    showPanel: (message: string, type: PanelType, title?: string|null) => void
}

export interface ProvidersProps {
    children: React.ReactNode
}