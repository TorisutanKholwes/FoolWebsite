import * as React from "react";
import { PopupContextType, ProvidersProps } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { useState } from "react";
import Popup from "../components/popup/Popup.tsx";

const PopupContext = React.createContext<PopupContextType>({
    showPopup: newEmptyFunction(),
    hidePopup: newEmptyFunction(),
})

const PopupProvider: React.FC<ProvidersProps> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [imageLeft, setImageLeft] = useState<string | null>(null);
    const [exclamation, setExclamation] = useState<boolean>(false);

    const showPopup = (message: string, imageLeft?: string|null, exclamation?: boolean) => {
        setMessage(message)
        setImageLeft(imageLeft || null)
        setExclamation(exclamation || false)
    }

    const hidePopup = () => {
        setImageLeft(null);
        setMessage(null)
        setExclamation(false)
    }

    return <PopupContext.Provider value={{ showPopup, hidePopup }}>
        {children}
        {message && <Popup text={message} imageLeft={imageLeft} exclamation={exclamation} /> }
    </PopupContext.Provider>
}

export { PopupProvider, PopupContext}