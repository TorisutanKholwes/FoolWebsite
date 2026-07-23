import { useEffect } from "react";
import { useApi } from "../hook/useApi.tsx";
import Button from "../components/button/Button.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import { useNavigate } from "react-router";
import { useUser } from "../hook/useUser.tsx";

import styles from "../styles/pages/ProfilePage.module.scss"

export default function ProfilePage() {

    const { isAuthenticated } = useApi()
    const { showPanel } = usePanel()
    const { user } = useUser()

    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
    }, [])

    return (
        <div className={styles.profilePage}>
            <h1 className={`${styles.pageTitle} orange`}>Profile information</h1>
            <div className={styles.profileInfo}>
                <p>Your name: {user?.name}</p>
                <p>Creation date : {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
                <div className={styles.passwordDiv}>
                    <p className={styles.passwordText}>Your password : ••••••••</p>
                    <Button className={styles.passwordInput} onClick={() => showPanel("Did you really think it was going to work?", PanelType.ERROR)}>Show the password</Button>
                </div>
            </div>
            <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
    )
}