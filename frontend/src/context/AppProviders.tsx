import * as React from "react";
import { ProvidersProps } from "./types.ts";
import { ApiProvider } from "./ApiContext.tsx";
import { PopupProvider } from "./PopupContext.tsx";

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
    return <ApiProvider>
        <PopupProvider>
            {children}
        </PopupProvider>
    </ApiProvider>
}