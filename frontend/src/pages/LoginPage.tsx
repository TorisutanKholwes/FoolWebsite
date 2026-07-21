import Input from "../components/input/Input.tsx";
import Button from "../components/button/Button.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import { useEffect, useState } from "react";
import { useApi } from "../hook/useApi.tsx";
import { ApiResponse, AuthResponse, ErrorResponse } from "../api/types.ts";
import { useNavigate } from "react-router";

import styles from "../styles/pages/LoginRegisterPage.module.scss"

export default function LoginPage() {

    const { showPanel } = usePanel()
    const { api, login } = useApi()
    const navigate = useNavigate();
    const { isAuthenticated, apiOnline, loading } = useApi()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (loading) return
        if (isAuthenticated && apiOnline === "ONLINE") {
            navigate("/")
        }
    }, [loading])

    const checkInput = (): boolean => {
        if (username.trim() === "") {
            return false;
        }
        return password.trim() !== "";
    }

    const handleLogin = async () => {
        if (!checkInput()) {
            showPanel("Please fill in all fields.", PanelType.WARNING, "Input error")
            return
        }
        const response = await api.post("/auth/login/", { username, password });
        if (response.status === 200)  {
            const formatResponse = (await response.json()) as ApiResponse<AuthResponse>
            login(formatResponse.token)
            navigate("/")
        } else {
            const formatResponse = (await response.json()) as ApiResponse<ErrorResponse>
            showPanel(formatResponse.error || "Failing to login.", PanelType.ERROR, "Login error")
        }
    }

    return <div className={styles.loginPage}>
        <div className={styles.headerDiv}>
            <h1 className={`${styles.title} orange`}>Login</h1>
            <div className={styles.descDiv}>
                <h2>If you don't have an account, please <span onClick={() => navigate("/register")} className={`${styles.changePage} orange`}>register</span>.</h2>
            </div>
        </div>
        <div className={styles.inputDiv}>
            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles.buttonDiv}>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={() => showPanel("Just remember it ?", PanelType.ERROR, "Password forgotten")}>Forgot your password ?</Button>
            <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
    </div>
}