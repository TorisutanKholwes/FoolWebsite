import styles from "../styles/pages/LoginRegisterPage.module.scss"
import Input from "../components/input/Input.tsx";
import Button from "../components/button/Button.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useApi } from "../hook/useApi.tsx";

export default function RegisterPage() {

    const navigate = useNavigate()
    const { isAuthenticated, apiOnline, loading } = useApi()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        if (loading) return
        if (isAuthenticated && apiOnline === "ONLINE") {
            navigate("/")
        }
    }, [loading])

    return (
        <div className={styles.registerPage}>
            <div className={styles.headerDiv}>
                <h1 className={`${styles.title} orange`}>Register</h1>
                <div className={styles.descDiv}>
                    <h2>If you already have an account, please <span onClick={() => navigate("/login")} className={`${styles.changePage} orange`}>log in</span>.</h2>
                </div>
            </div>
            <div className={styles.inputDiv}>
                <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </div>
            <div className={styles.buttonDiv}>
                <Button className={styles.bigPadding}>Register</Button>
                <Button className={styles.bigPadding} onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )

}