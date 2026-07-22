import { useEffect, useState } from "react";
import { ApiResponse, User, UserResponse } from "../api/types.ts";
import { useApi } from "../hook/useApi.tsx";
import Button from "../components/button/Button.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";

import styles from "../styles/pages/ProfilePage.module.scss"
import { useNavigate } from "react-router";

export default function ProfilePage() {

    const { isAuthenticated, api, logout } = useApi()
    const { showPanel } = usePanel()
    const navigate = useNavigate()

    const [user, setUser] = useState<User>();


    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        fetchUser()
    }, [])

    const fetchUser = async () => {
        const response = await api.get("/auth/me")
        if (response.ok && response.status === 200) {
            const data = (await response.json()) as ApiResponse<UserResponse>
            setUser(data.user)
        } else if (isAuthenticated) {
            logout()
        }
    }

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