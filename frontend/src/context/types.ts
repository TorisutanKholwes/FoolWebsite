import * as React from "react";
import ApiClient from "../api/client.ts";
import { EmptyFunction } from "../utils/types.ts";
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
    showPopup: (message: string, imageLeft?: string|null, exclamation?: boolean) => void
    hidePopup: EmptyFunction
}

export interface ProvidersProps {
    children: React.ReactNode
}