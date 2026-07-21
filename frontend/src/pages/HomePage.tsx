import { useApi } from "../hook/useApi.tsx";
import { ApiResponse, ApiStatus, User } from "../api/types.ts";
import { useEffect, useState } from "react";

import styles from "../styles/pages/HomePage.module.scss"
import InfoButton from "../components/InfoButton.tsx";
import { useNavigate } from "react-router";
import { usePopup } from "../hook/usePopup.tsx";

export default function HomePage() {

    const { isAuthenticated, api, apiOnline, logout } = useApi()
    const navigate = useNavigate();
    const { hidePopup } = usePopup();

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
            const data = (await response.json()) as ApiResponse<User>
            setUser(data)
        }
    }

    const goTo = (where: string) => {
        if (!user) {
            alert("TODO: Change that but you're still not connected")
            return
        }
        move(where)
    }

    const move = (where: string) => {
        hidePopup()
        navigate(where)
    }

    return <div className={ styles.page }>
        <header className={styles.header}>
            <h1>F.O.O.L.</h1>
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
                        <InfoButton infoText={"If you want to leave us, click here"} onClick={() => logout()}>Logout</InfoButton>
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
            <p className={styles.loggedAs}>Currently logged as {user.name}</p>
        )}
    </div>
}