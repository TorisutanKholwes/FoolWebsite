import * as React from "react";
import ApiClient from "../api/client.ts";
import { EmptyFunction, PanelType } from "../utils/types.ts";
import { ApiStatus, User } from "../api/types.ts";

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
    showPanel: (message: string, type: PanelType, title?: string|null) => void,
    ask: (message: string, type: PanelType, fallback: (value: string) => void, title?: string|null) => void,
}

export type SoundContextType = {
    playing: boolean,
    paused: boolean,
    pause: EmptyFunction,
    resume: EmptyFunction,
    currentPlaying: { name: string, author: string, image: string },
    play: EmptyFunction,
    stop: EmptyFunction,
    nextSong: EmptyFunction,
    prevSong: EmptyFunction,
    volume: number,
    setVolume: (volume: number) => void,
}

export type UserContextType = {
    user: User | null,
    setUser: (user: User) => void,
    auth: EmptyFunction,
    reset: EmptyFunction
}

export interface ProvidersProps {
    children: React.ReactNode
}