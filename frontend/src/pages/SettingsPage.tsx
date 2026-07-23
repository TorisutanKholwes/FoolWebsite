import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import { useState } from "react";
import { useSound } from "../hook/useSound.tsx";

import styles from "../styles/pages/SettingsPage.module.scss"

export default function SettingsPage() {

    const navigate = useNavigate();
    const { showPanel } = usePanel()
    const { play, stop } = useSound()

    const [rememberPassword, setRememberPassword] = useState<boolean>(localStorage.getItem("remember") === "true");
    const [sound, setSound] = useState<boolean>(localStorage.getItem("sound") === "true");

    const handleUseless = () => {
        showPanel("I know this looks like Minecraft but it's a website", PanelType.ERROR, "Useless feature")
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
                    <Button onClick={handleSoundClick}>{sound ? 'Disable' : 'Enable'} musics and sounds</Button>
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