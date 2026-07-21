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
    const [exclamation, setExclamation] = useState<boolean>(false);
    const [animated, setAnimated] = useState<boolean>(true);

    const showPopup = (message: string, exclamation?: boolean, animated?: boolean) => {
        setMessage(message)
        setExclamation(exclamation || false)
        setAnimated(animated || true);
    }

    const hidePopup = () => {
        setMessage(null)
        setExclamation(false)
        setAnimated(false)
    }

    return <PopupContext.Provider value={{ showPopup, hidePopup }}>
        {children}
        {message && <Popup text={message} animated={animated} exclamation={exclamation} /> }
    </PopupContext.Provider>
}

export { PopupProvider, PopupContext}