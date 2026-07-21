import * as React from "react";
import { EmptyFunction, PanelType } from "../utils/types.ts";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type InfoButtonProps = ButtonProps & {
    infoText: string;
    exclamation?: boolean;
}

export type InfoPanelProps = {
    message: string;
    title?: string;
    type: PanelType;
    onClose?: EmptyFunction
}

export type PopupProps = {
    text: string;
    imageLeft?: string | null;
    exclamation?: boolean;
    duration?: number;
}