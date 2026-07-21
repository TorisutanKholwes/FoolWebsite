import * as React from "react";
import { InfoButtonProps } from "./types.ts";
import Button from "./button/Button.tsx";
import { usePopup } from "../hook/usePopup.tsx";

const InfoButton: React.FC<InfoButtonProps> = ( { infoText, exclamation = false, children, ...props } ) => {

    const { showPopup, hidePopup } = usePopup()

    return <Button onMouseEnter={() => showPopup(infoText, null, exclamation)} onMouseLeave={hidePopup} {...props}>{children}</Button>
}

export default InfoButton