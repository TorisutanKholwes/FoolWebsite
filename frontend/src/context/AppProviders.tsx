import * as React from "react";
import { ProvidersProps } from "./types.ts";
import { ApiProvider } from "./ApiContext.tsx";
import { PopupProvider } from "./PopupContext.tsx";
import { PanelProvider } from "./PanelContext.tsx";
import { SoundProvider } from "./SoundContext.tsx";
import { UserProvider } from "./UserContext.tsx";

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
    return <ApiProvider>
        <PopupProvider>
            <PanelProvider>
                <SoundProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </SoundProvider>
            </PanelProvider>
        </PopupProvider>
    </ApiProvider>
}