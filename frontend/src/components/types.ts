import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type InfoButtonProps = ButtonProps & {
    infoText: string;
    exclamation?: boolean;
}

export type PopupProps = {
    text: string;
    imageLeft?: string | null;
    exclamation?: boolean;
    duration?: number;
}