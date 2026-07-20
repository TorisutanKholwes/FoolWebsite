import * as React from "react";
import { ProvidersProps } from "./types.ts";
import { ApiProvider } from "./ApiContext.tsx";

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
    return <ApiProvider>
        {children}
    </ApiProvider>
}