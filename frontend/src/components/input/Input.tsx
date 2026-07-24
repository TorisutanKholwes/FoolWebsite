import * as React from "react";
import { InputProps } from "../types.ts";
import { useRef, useState } from "react";

import styles from './style.module.scss'

const Input: React.FC<InputProps> = ( { className, type, placeholder, ...props } ) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const classes = [styles.inputDiv, className].filter(Boolean).join(" ");
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const passwordClasses = [styles.showPassword, showPassword ? styles.showActive : styles.hideActive, inputRef.current!.value.length > 24 ? styles.moveEye : ""].filter(Boolean).join(" ");

    const handleClick = () => {
        setShowPassword(!showPassword);
    }

    const inputElement = (
        <input
            ref={inputRef}
            className={styles.input}
            placeholder={placeholder}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            {...props}
            autoComplete="off"
            aria-autocomplete="none"
            data-lpignore="true"
            data-form-type="other"
        />
    );

    return <div className={classes}>
        <div className={styles.inputWrapper}>
            {inputElement}
            { isPassword && <button onClick={handleClick} className={passwordClasses} />}
        </div>
    </div>
}

export default Input