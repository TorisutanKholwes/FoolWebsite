import Button from "../components/button/Button"
import { useNavigate } from "react-router";

import clowez from "../assets/images/clowez.jpg"
import burnier from "../assets/images/burnier.png"
import delaporte from "../assets/images/delaporte.jpg"

import styles from "../styles/pages/SocialPage.module.scss"

export default function SocialPage() {

    const navigate = useNavigate()

    const openWebsite = (url: string) => {
        window.open(url, "_blank");
    }

    return (
        <div className={styles.socialPage}>
            <h1 className={`${styles.title} orange`}>Social</h1>
            <div className={styles.elements}>
                <div className={styles.element}>
                    <p>Alexis Burnier</p>
                    <img className={styles.profilePicture} src={burnier} alt="Alexis Burnier" />
                    <div className={styles.buttons}>
                        <Button onClick={() => openWebsite("https://www.linkedin.com/in/burnier-alexis/")}>Linkedin</Button>
                    </div>
                </div>
                <div className={styles.element}>
                    <p>Tristan Clowez</p>
                    <img className={styles.profilePicture} src={clowez} alt="Tristan Clowez" />
                    <div className={styles.buttons}>
                        <Button onClick={() => openWebsite("https://www.linkedin.com/in/tristanclowez/")}>Linkedin</Button>
                        <Button onClick={() => openWebsite("https://github.com/TorisutanKholwes")}>Github</Button>
                    </div>
                </div>
                <div className={styles.element}>
                    <p>Corentin Delaporte</p>
                    <img className={styles.profilePicture} src={delaporte} alt="Corentin Delaporte" />
                    <div className={styles.buttons}>
                        <Button onClick={() => openWebsite("https://www.linkedin.com/in/corentindelaporte/")}>Linkedin</Button>
                    </div>
                </div>
            </div>
            <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
    )
}