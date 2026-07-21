import { useNavigate } from "react-router";
import Button from "../components/button/Button.tsx";

import styles from "../styles/pages/Page404.module.scss"

export default function Page404() {

    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <h1>404 - Page not found</h1>
            <p>The page you are looking for does not exist.</p>
            <Button className={styles.homeButton} onClick={() => navigate("/")}>Return to home</Button>
        </div>
    )
}