import { useApi } from "../hook/useApi.tsx";
import { ApiResponse, ApiStatus, User, UserResponse } from "../api/types.ts";
import { useEffect, useState } from "react";
import InfoButton from "../components/InfoButton.tsx";
import { useNavigate } from "react-router";
import { usePopup } from "../hook/usePopup.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";

import styles from "../styles/pages/HomePage.module.scss"

export default function HomePage() {

    const { isAuthenticated, api, apiOnline, logout } = useApi()
    const navigate = useNavigate();
    const { hidePopup } = usePopup();
    const { showPanel } = usePanel()

    const [user, setUser] = useState<User | null>(null)

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

    const goTo = (where: string) => {
        if (!user) {
            showPanel("You need to login before accessing this page", PanelType.ERROR, "Login required")
            return
        }
        move(where)
    }

    const move = (where: string) => {
        if (apiOnline !== ApiStatus.ONLINE) {
            showPanel("Sorry, you can't access this resources because the office is close", PanelType.WARNING, "Office closed")
            return
        }
        hidePopup()
        navigate(where)
    }

    const disconnect = () =>  {
        logout()
        window.location.reload()
    }

    return <div className={ styles.page }>
        <header className={styles.header}>
            <h1 onClick={() => showPanel("You're the fool", PanelType.INFO)}>F.O.O.L.</h1>
            <h2 className="orange">Federal Office Of Obvious Logic</h2>
        </header>
        <div className={styles.boxed}>
            <p>This office exists to document, with all the necessary administrative rigor, what has been evident from the very beginning.</p>
            <p className="orange">{apiOnline == ApiStatus.ONLINE ? "This office is open and ready to serve you." : "This office is currently closed. Please try again later."}</p>
        </div>
        <div className={styles.buttons}>
            <InfoButton onClick={() => goTo("/asker")} infoText={"The place where you can ask questions"}>Submit a form</InfoButton>
            <InfoButton onClick={() => goTo("/vote")} infoText={"The place where you can upvote or downvote other people questions"}>Report Archive</InfoButton>
            <InfoButton onClick={() => goTo("/leaderboard")} infoText={"A top of the most upvoted questions"}>Priority Cases</InfoButton>
            <div className={styles.flexButton}>
                { user ? (
                    <>
                        <InfoButton onClick={() => goTo("/profile")} infoText={"The place where you can see all your beautiful personal information"}>Profile information</InfoButton>
                        <InfoButton infoText={"If you want to leave us, click here"} onClick={disconnect}>Logout</InfoButton>
                    </>
                ) : (
                    <>
                        <InfoButton onClick={() => move("/register")} infoText={"A regular register button just like all other websites"}>Register</InfoButton>
                        <InfoButton onClick={() => move("/login")} infoText={"A regular login button just like all other websites"}>Login</InfoButton>
                    </>
                )}
            </div>
        </div>
        { user && (
            <p onClick={() => showPanel("What did you expect to see by clicking here ?", PanelType.WARNING)} className={styles.loggedAs}>Currently logged as {user.name}</p>
        )}
    </div>
}