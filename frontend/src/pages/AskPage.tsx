import Input from "../components/input/Input.tsx";
import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { MessageObject, PanelType } from "../utils/types.ts";
import { usePanel } from "../hook/usePanel.tsx";
import { useApi } from "../hook/useApi.tsx";
import { ApiResponse, AskResponse, User, UserResponse } from "../api/types.ts";

import styles from "../styles/pages/AskPage.module.scss"
import * as React from "react";

export default function AskPage() {

    const navigate = useNavigate();
    const { showPanel } = usePanel()
    const { api, isAuthenticated, logout } = useApi()

    const [user, setUser] = useState<User | null>(null)
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<MessageObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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

    const addMessage = (message: string, self: boolean) => {
        const newMessage: MessageObject = {
            content: message,
            author: self ? `You (${user?.name})` : 'F.O.O.L. Agent',
            color: self ? "green" : "red",
        }
        setMessages(prev => [...prev, newMessage]);
    }

    const handleAsk = async () => {
        if (loading) {
            return;
        }
        if (content.trim() === "") {
            showPanel("You need to enter a question before submit", PanelType.WARNING)
            return;
        }
        let message = content.trim()
        addMessage(message, true);
        setContent("")
        setLoading(true)
        const response = await api.post("/messages/ask", { message: message })
        if (response.ok && response.status === 200) {
            const formatResponse = (await response.json()) as ApiResponse<AskResponse>;
            addMessage(formatResponse.message, false);
            setLoading(false)
        }
    }

    const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            await handleAsk()
        }
    }

    return (
        <div className={styles.askPage}>
            <h1 className={`${styles.title} orange`}>Submit a form</h1>
            <div className={styles.askContainer}>
                <div className={styles.messages}>
                    {messages.map((message, index) => {
                        return (
                            <div key={index}>
                                <p className={styles.messageText}><span style={{ color: `${message.color}` }}>&lt;{message.author}&gt;</span> {message.content}</p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.inputContainer}>
                    <Input className={styles.askInput} type="text"
                           value={content} onChange={(e) => setContent(e.target.value)}
                           placeholder="Your question here..."
                           onKeyDown={handleOnKeyDown}
                    />
                    <Button className={styles.submit} onClick={handleAsk}>Submit</Button>
                </div>
            </div>
            <Button className={styles.backButton} onClick={() => navigate("/")}>Go back</Button>
        </div>
    )
}