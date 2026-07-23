import * as React from "react";
import { ModalProps } from "../types.ts";

import styles from "./style.module.scss"
import Button from "../button/Button.tsx";

const Modal: React.FC<ModalProps> = ( { children, onClose } ) => {

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {children}
                <Button onClick={onClose}>Close</Button>
            </div>
        </div>
    )

}

export default Modal