import * as React from "react";
import { PopupProps } from "../types.ts";

import styles from "./style.module.scss"

const Popup: React.FC<PopupProps> = ({ text, exclamation = false, animated = true }) =>  {
    const classes = [styles.popup]
    if (animated) {
        classes.push(styles.animated)
    }
    const classStr = classes.filter(Boolean).join(" ")

    return (
        <div className={classStr}>
            <div className={styles.division}>
                <div className={styles.image}>
                    <p className={styles.mark}>{exclamation ? "!" : "?"}</p>
                </div>
                <div className={styles.text}>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}

export default Popup