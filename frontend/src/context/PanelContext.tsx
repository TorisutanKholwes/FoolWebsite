import * as React from "react";
import { PanelContextType, ProvidersProps } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { PanelType } from "../utils/types.ts";
import InfoPanel from "../components/infopanel/InfoPanel.tsx";
import AskPanel from "../components/askpanel/AskPanel.tsx";

const PanelContext = React.createContext<PanelContextType>({
    showPanel: newEmptyFunction(),
    ask: newEmptyFunction()
})

const PanelProvider: React.FC<ProvidersProps> = ( { children } ) => {

    const [message, setMessage] = React.useState<string | null>(null);
    const [type, setType] = React.useState<PanelType | null>(null);
    const [title, setTitle] = React.useState<string | null>(null);
    const [fallback, setFallback] = React.useState<(value: string) => void>(() => newEmptyFunction());
    const [isAsk, setIsAsk] = React.useState(false);

    const showPanel = (message: string, type: PanelType, title?: string|null) => {
        setMessage(message);
        setType(type);
        setTitle(title || null);
        setIsAsk(false);
    }

    const ask = (message: string, type: PanelType, fallback: (value: string) => void, title?: string|null) => {
        setMessage(message);
        setType(type);
        setTitle(title || null);
        setFallback(() => fallback);
        setIsAsk(true)
    }

    const onClose = (value?: string) => {
        setMessage(null);
        setType(null);
        setTitle(null);
        fallback(value || '')
        setFallback(() => newEmptyFunction());
    }

    return <PanelContext.Provider value={{ showPanel, ask }}>
        {children}
        { (message && !isAsk)  && <InfoPanel message={message} type={type!} title={title!} onClose={onClose} /> }
        { (message && isAsk) && <AskPanel message={message} type={type!} title={title!} onClose={onClose} /> }
    </PanelContext.Provider>
}

export { PanelProvider, PanelContext }