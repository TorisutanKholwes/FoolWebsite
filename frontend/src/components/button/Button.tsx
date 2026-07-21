import * as React from "react";
import { ButtonProps } from "../types.ts";

import style from "./style.module.scss"

const Button: React.FC<ButtonProps> = ( { className = "", children, ...props }) => {
    const classes = [
        style.btn,
        className
    ].filter(Boolean).join(" ")

    return <button className={classes} {...props}>{children}</button>;
}

export default Button