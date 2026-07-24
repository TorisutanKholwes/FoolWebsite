import { FC, useState } from "react";
import { InfoPanelProps } from "../types.ts";
import styles from "../infopanel/style.module.scss";
import Button from "../button/Button.tsx";

import cheh from "../../assets/images/cheh.jpg"
import warn from "../../assets/images/warn.jpg"
import yes from "../../assets/images/yes.jpg"
import { PanelType } from "../../utils/types.ts";
import Input from "../input/Input.tsx";
import { useSound } from "../../hook/useSound.tsx";

const AskPanel: FC<InfoPanelProps> = ( { message, title = '', type, onClose } ) => {

    const [inputValue, setInputValue] = useState<string>("")

    const imageUrl = type === PanelType.INFO ? yes : type === PanelType.WARNING ? warn : type === PanelType.ERROR ? cheh : ""

    const { playing, currentPlaying } = useSound()

    const messageContent = playing && currentPlaying.name === "Lava Chicken" ? "LLa-la-la-lava ch-ch-ch-chicken\nSteve's Lava Chicken, yeah, it's tasty as hell" : message

    return <div className={styles.backdrop}>
        <div className={styles.panel}>
            <div className={styles.imageDiv}>
                <img src={imageUrl} alt={"image"} />
            </div>
            <div className={styles.textDiv}>
                {title !== '' && (
                    <h2 className={styles.textTitle}>{title}</h2>
                )}
                <p className={styles.message}>{messageContent}</p>
                <Input className={styles.askInput} type="text" placeholder="Response" onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
                <Button onClick={() => onClose ? onClose(inputValue) : null}>Validate</Button>
            </div>
        </div>
    </div>
}

export default AskPanel