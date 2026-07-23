import * as React from "react";
import { EmptyFunction, PanelType } from "../utils/types.ts";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

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
    exclamation?: boolean;
    animated?: boolean;
}

export type ModalProps = {
    children: React.ReactNode;
    onClose: EmptyFunction
}