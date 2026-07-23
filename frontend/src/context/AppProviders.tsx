import * as React from "react";
import { ProvidersProps } from "./types.ts";
import { ApiProvider } from "./ApiContext.tsx";
import { PopupProvider } from "./PopupContext.tsx";
import { PanelProvider } from "./PanelContext.tsx";
import { SoundProvider } from "./SoundContext.tsx";

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
    return <ApiProvider>
        <PopupProvider>
            <PanelProvider>
                <SoundProvider>
                    {children}
                </SoundProvider>
            </PanelProvider>
        </PopupProvider>
    </ApiProvider>
}