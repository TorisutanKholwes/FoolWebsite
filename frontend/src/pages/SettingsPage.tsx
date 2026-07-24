import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import * as React from "react";
import { useState } from "react";
import { useSound } from "../hook/useSound.tsx";
import { getRandomInt } from "../utils/utils.ts";

import styles from "../styles/pages/SettingsPage.module.scss"

export default function SettingsPage() {

    const navigate = useNavigate();
    const { showPanel, ask } = usePanel()
    const { play, stop, volume, setVolume } = useSound()

    const [rememberPassword, setRememberPassword] = useState<boolean>(localStorage.getItem("remember") === "true");
    const [sound, setSound] = useState<boolean>(localStorage.getItem("sound") === "true");

    const handleUseless = () => {
        showPanel("I know this looks like Minecraft but it's a website", PanelType.ERROR, "Useless feature")
    }

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!sound) {
            return;
        }
        e.preventDefault();
        const radix = getRandomInt(2, 16)
        ask(`Your volume is ${volume}. Enter the volume in base ${radix}:`, PanelType.INFO, (value) => changeVolume(value, radix))
    }

    const changeVolume = (value: string, radix: number) => {

        const isValid = (str: string) => {
            const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            str = str.toUpperCase();

            return [...str].every(c => chars.indexOf(c) >= 0 && chars.indexOf(c) < radix);
        }

        if (!value) {
            return;
        }
        if (!isValid(value)) {
            showPanel(`Invalid input. Please enter a valid number in base ${radix}.`, PanelType.ERROR, "Invalid input")
            return;
        }
        const volume = parseInt(value, radix)
        if (isNaN(volume) || volume < 0 || volume > 100) {
            showPanel("Invalid volume. Please enter a number between 0 and 100.", PanelType.ERROR, "Invalid volume")
            return
        }
        showPanel(`Volume set to ${volume}%`, PanelType.INFO, "Volume changed")
        setVolume(volume)
    }

    const handleSoundClick = () => {
        const newSound = !sound
        setSound(newSound)
        if (newSound) {
            play()
        } else {
            stop()
        }
        localStorage.setItem("sound", newSound.toString());
    }

    const handleRememberClick = () => {
        const newRemember = !rememberPassword;
        setRememberPassword(newRemember);
        localStorage.setItem("remember", newRemember.toString());
    }

    return (
        <div className={styles.settingsPage}>
            <h1 className={`${styles.title} orange`}>Settings</h1>
            <div className={styles.buttonsContainer}>
                <div className={styles.useful}>
                    <Button onContextMenu={handleContextMenu} onClick={handleSoundClick}>{sound ? 'Disable' : 'Enable'} musics and sounds</Button>
                    <Button onClick={handleRememberClick}>Remember Password: {rememberPassword ? "Yes" : "No"}</Button>
                </div>
                <div className={styles.useless}>
                    <Button onClick={handleUseless}>Skin customisation</Button>
                    <Button onClick={handleUseless}>Video Settings</Button>
                    <Button onClick={handleUseless}>Controls</Button>
                    <Button onClick={handleUseless}>Language</Button>
                    <Button onClick={handleUseless}>Chat Settings</Button>
                    <Button onClick={handleUseless}>Resources packs</Button>
                </div>
                <Button className={styles.goBack} onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )
}