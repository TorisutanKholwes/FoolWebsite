import { useApi } from "../hook/useApi.tsx";
import { ApiStatus } from "../api/types.ts";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import InfoButton from "../components/InfoButton.tsx";
import { useNavigate } from "react-router";
import { usePopup } from "../hook/usePopup.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import { useUser } from "../hook/useUser.tsx";
import { useSound } from "../hook/useSound.tsx";

import snowgolem from "../assets/images/snowgolem.png"

import styles from "../styles/pages/HomePage.module.scss"

export default function HomePage() {

    const { isAuthenticated, apiOnline, logout } = useApi()
    const navigate = useNavigate();
    const { hidePopup } = usePopup();
    const { showPanel } = usePanel()

    const { user, reset } = useUser()
    const { paused, playing, pause, resume, currentPlaying, nextSong, prevSong } = useSound()

    const [musicEnable, setMusicEnabled] = useState(false);
    const [musicFocused, setMusicFocused] = useState(false);

    const olafRef  = useRef<HTMLDivElement|null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem("sound") === "true" || !localStorage.getItem("sound")) {
            setMusicEnabled(true)
        }
    }, [playing, currentPlaying]);

    const goTo = (where: string) => {
        if (!user) {
            showPanel("You need to login before accessing this page", PanelType.ERROR, "Login required")
            return
        }
        move(where)
    }

    const move = (where: string, needApi: boolean = true) => {
        if (needApi && apiOnline !== ApiStatus.ONLINE) {
            showPanel("Sorry, you can't access this resources because the office is close", PanelType.WARNING, "Office closed")
            return
        }
        hidePopup()
        navigate(where)
    }

    const disconnect = () =>  {
        logout()
        reset()
        window.location.reload()
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { clientX, clientY } = e;

        const isBetween = (curr: number, pos: number, gap: number) => {
            if (curr >= pos - gap && curr <= pos + gap) {
                return true;
            }
            return false;
        }

        if (isBetween(clientX, 25, 25) && isBetween(clientY, Math.round(window.innerHeight / 2), 75)) {
            if (olafRef.current) {
                olafRef.current.classList.add(styles.active);
            }
        } else if (olafRef.current && olafRef.current.classList.contains(styles.active)) {
            olafRef.current.classList.remove(styles.active);
        }
    }

    return <div onMouseMove={handleMouseMove} className={ styles.page }>
        <header className={styles.header}>
            <div className={styles.titleDiv}>
                <h1 className={styles.title} onClick={() => showPanel("You're the fool", PanelType.INFO)}>F.O.O.L.</h1>
                <span className={styles.splash}>Don't be too smart</span>
            </div>
            <h2 className="orange">Federal Office Of Obvious Logic</h2>
        </header>
        <div className={styles.boxed}>
            <p>This office exists to document, with all the necessary administrative rigor, what has been evident from the very beginning.</p>
            <p className="orange">{apiOnline == ApiStatus.ONLINE ? "This office is open and ready to serve you." : "This office is currently closed. Please try again later."}</p>
        </div>
        <div className={styles.buttonsContainer}>
            <InfoButton className={styles.smallButton} onClick={() => move("/settings", false)} infoText={"Options"}>Options</InfoButton>
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
            <InfoButton className={styles.smallButton} onClick={() => move("/social", false)} infoText={"Social"}>Social</InfoButton>
        </div>
        <div ref={olafRef} className={styles.olaf}>
            <div className={styles.olafTextDiv}>
                <p className={styles.olafName}>Ilyess</p>
            </div>
            <img src={snowgolem} alt="Snow Golem" />
        </div>
        { user && (
            <p onClick={() => showPanel("What did you expect to see by clicking here ?", PanelType.WARNING)} className={styles.loggedAs}>Currently logged as {user.name}</p>
        )}
        { musicEnable && (
            <div className={`${styles.musicDiv} ${musicFocused ? styles.focused : ''}`} onMouseEnter={() => setMusicFocused(true)} onMouseLeave={() => setMusicFocused(false)}>
                { musicFocused ? (
                    <>
                        <img className={styles.bigImagePlaying} src={currentPlaying.image} alt="Music Playing Image" />
                        <div className={styles.musicInformation}>
                            <div className={styles.musicNames}>
                                <p>{currentPlaying.name} - {currentPlaying.author}</p>
                            </div>
                            <div className={styles.buttonsContainer}>
                                <p onClick={prevSong}>⏮</p>
                                <p onClick={paused  ? resume : pause}>{!paused ? '⏸' : '►'}</p>
                                <p onClick={nextSong}>⏭</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <img className={styles.miniImagePlaying} src={currentPlaying.image} alt="Music Playing Image" />
                    </>
                )}
            </div>
        ) }
    </div>
}