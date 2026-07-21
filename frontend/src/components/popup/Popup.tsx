import * as React from "react";
import { PopupProps } from "../types.ts";

import styles from "./style.module.scss"

const Popup: React.FC<PopupProps> = ({ text, imageLeft = "", exclamation = false }) =>  {
    return (
        <div className={styles.popup}>
            <div className={styles.division}>
                <div className={styles.image}>
                    {imageLeft ? (
                        <img src={imageLeft} alt="image" />
                    ) : (
                        <p className={styles.mark}>{exclamation ? "!" : "?"}</p>
                    )}
                </div>
                <div className={styles.text}>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}

export default Popup