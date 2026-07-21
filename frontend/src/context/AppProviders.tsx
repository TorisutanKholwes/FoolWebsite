import * as React from "react";
import { ProvidersProps } from "./types.ts";
import { ApiProvider } from "./ApiContext.tsx";
import { PopupProvider } from "./PopupContext.tsx";
import { PanelProvider } from "./PanelContext.tsx";

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
    return <ApiProvider>
        <PopupProvider>
            <PanelProvider>
                {children}
            </PanelProvider>
        </PopupProvider>
    </ApiProvider>
}