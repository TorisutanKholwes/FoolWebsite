import * as React from "react";
import { InfoPanelProps } from "../types.ts";
import { PanelType } from "../../utils/types.ts";
import Button from "../button/Button.tsx";

import cheh from "../../assets/images/cheh.jpg"
import warn from "../../assets/images/warn.jpg"
import yes from "../../assets/images/yes.jpg"

import styles from "./style.module.scss"

const InfoPanel: React.FC<InfoPanelProps> = ( { message, title = '', type, onClose } ) => {

    const imageUrl = type === PanelType.INFO ? yes : type === PanelType.WARNING ? warn : type === PanelType.ERROR ? cheh : ""

    return <div className={styles.backdrop}>
        <div className={styles.panel}>
            <div className={styles.imageDiv}>
                <img src={imageUrl} alt={"image"} />
            </div>
            <div className={styles.textDiv}>
                {title !== '' && (
                    <h2 className={styles.textTitle}>{title}</h2>
                )}
                <p className={styles.message}>{message}</p>
                <Button onClick={onClose}>Validate</Button>
            </div>
        </div>
        </div>
}

export default InfoPanel