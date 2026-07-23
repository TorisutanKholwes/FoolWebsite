import * as React from "react";
import { useEffect, useState } from "react";
import Input from "../components/input/Input.tsx";
import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { useApi } from "../hook/useApi.tsx";
import { usePopup } from "../hook/usePopup.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";
import { ApiResponse, AuthResponse, ErrorResponse } from "../api/types.ts";
import { useUser } from "../hook/useUser.tsx";

import styles from "../styles/pages/LoginRegisterPage.module.scss"

export default function RegisterPage() {

    const navigate = useNavigate()
    const { api, isAuthenticated, apiOnline, loading, login } = useApi()
    const { showPopup, hidePopup } = usePopup()
    const { showPanel } = usePanel()
    const { auth } = useUser()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        if (loading) return
        if (isAuthenticated && apiOnline === "ONLINE") {
            navigate("/")
        }
    }, [loading])

    const checkSum = (password: string): number => {
        let sum = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password[i];
            if (!isNaN(parseInt(char))) {
                sum += parseInt(char);
            }
        }
        return sum;
    }

    const checkModulo = (password: string): number => {
        let sum = 0;
        const modulo = 4
        for (let i = 0; i < password.length; i++) {
            sum += password.charCodeAt(i);
        }
        return sum % modulo;
    }

    const removeCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        showPanel("Copy and paste is cheating !", PanelType.WARNING)
    }

    const checkPassword = (password: string, animated: boolean = false, checking: boolean = false): boolean => {
        let popupMessage;
        let good = false
        if (!/[a-z]/.test(password)) {
            popupMessage = "You must include at least one lowercase letter in your password.";
        } else if (!/[A-Z]/.test(password)) {
            popupMessage = "You must include at least one uppercase letter in your password.";
        } else if (!/[0-9]/.test(password)) {
            popupMessage = "You must include at least one number in your password.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            popupMessage = "You must include at least one special character in your password.";
        } else if (checkSum(password) != 24) {
            popupMessage = "The sum of the numbers in your password must be 24.";
        } else if (!password.includes(username)) {
            popupMessage = "You must include your username in your password.";
        } else if (checkModulo(password) !== 0) {
            let currentModulo = checkModulo(password)
            popupMessage = `The sum of the ascii character of your password must be modulo 4. Current modulo : ${currentModulo}`
        } else if (password.length < 14) {
            popupMessage = `Your password must be at least 14 characters long.`;
        } else {
            popupMessage = "Bravo! Your password is strong.";
            good = true
        }
        if (!checking) {
            hidePopup()
            showPopup(popupMessage, true, animated)
        }
        return good;
    }

    const handleFocus = () => {
        checkPassword(password, true)
    }

    const handleBlur = () => {
        hidePopup()
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        checkPassword(newPassword, false)
    }

    const handleRegister = async () => {
        if (!checkPassword(password, false, true)) {
            showPanel("Your password does not meet the requirements.", PanelType.WARNING, "Password requirements")
            return
        }
        if (password !== passwordConfirm) {
            showPanel("Passwords do not match.", PanelType.WARNING, "Password mismatch")
            return
        }
        const response = await api.post("/auth/register", { username, password })
        if (!response.ok || response.status !== 200) {
            const formatResponse = (await response.json()) as ApiResponse<ErrorResponse>
            showPanel(formatResponse.error || "Failing to register.", PanelType.ERROR, "Registration error")
            return
        }
        const formatResponse = (await response.json()) as ApiResponse<AuthResponse>
        login(formatResponse.token)
        auth()
        navigate("/")
    }

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
                <Input
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    type="password" placeholder="Password"
                    value={password} onChange={handlePasswordChange}
                    onCopy={removeCopyPaste}
                    onCut={removeCopyPaste}
                    onPaste={removeCopyPaste}
                />
                <Input
                    type="password" placeholder="Confirm password"
                    value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                    onCopy={removeCopyPaste}
                    onCut={removeCopyPaste}
                    onPaste={removeCopyPaste}
                />
            </div>
            <div className={styles.buttonDiv}>
                <Button onClick={handleRegister} className={styles.bigPadding}>Register</Button>
                <Button className={styles.bigPadding} onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )

}