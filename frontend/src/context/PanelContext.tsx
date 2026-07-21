import * as React from "react";
import { PanelContextType, ProvidersProps } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { PanelType } from "../utils/types.ts";
import InfoPanel from "../components/infopanel/InfoPanel.tsx";

const PanelContext = React.createContext<PanelContextType>({
    showPanel: newEmptyFunction()
})

const PanelProvider: React.FC<ProvidersProps> = ( { children } ) => {

    const [message, setMessage] = React.useState<string | null>(null);
    const [type, setType] = React.useState<PanelType | null>(null);
    const [title, setTitle] = React.useState<string | null>(null);

    const showPanel = (message: string, type: PanelType, title?: string|null) => {
        setMessage(message);
        setType(type);
        setTitle(title || null);
    }

    const onClose = () => {
        setMessage(null);
        setType(null);
        setTitle(null);
    }

    return <PanelContext.Provider value={{ showPanel }}>
        {children}
        { message && <InfoPanel message={message} type={type!} title={title!} onClose={onClose} /> }
    </PanelContext.Provider>
}

export { PanelProvider, PanelContext }