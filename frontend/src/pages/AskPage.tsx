import Input from "../components/input/Input.tsx";
import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { MessageObject, PanelType } from "../utils/types.ts";
import { usePanel } from "../hook/usePanel.tsx";
import { useApi } from "../hook/useApi.tsx";
import { ApiResponse, AskResponse, MessagesResponse, User } from "../api/types.ts";
import * as React from "react";
import { AUTHOR_MESSAGE_COLOR, RESPONSE_MESSAGE_COLOR } from "../utils/utils.ts";
import { usePopup } from "../hook/usePopup.tsx";
import { useUser } from "../hook/useUser.tsx";

import styles from "../styles/pages/AskPage.module.scss"

export default function AskPage() {

    const navigate = useNavigate();
    const { showPanel } = usePanel()
    const { showPopup, hidePopup } = usePopup()
    const { api, isAuthenticated } = useApi()
    const { user } = useUser()

    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<MessageObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const messageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        fetchMessages()
    }, [])

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async (u?: User) => {
        const response = await api.get("/messages/me")
        if (response.ok && response.status === 200) {
            const formatResponse = (await response.json()) as ApiResponse<MessagesResponse>
            formatResponse.content = formatResponse.content.reverse()
            for (const message of formatResponse.content) {
                addMessage(message.message, true, u);
                addMessage(message.response, false, u);
            }
        } else {
            showPopup("Error while fetching your messages", true)
            setTimeout(() => {
                hidePopup()
            }, 3000)
        }
    }

    const addMessage = (message: string, self: boolean, u?: User) => {
        const realUser = u ? u : user
        const newMessage: MessageObject = {
            content: message,
            author: self ? `You (${realUser?.name})` : 'F.O.O.L. Agent',
            color: self ? AUTHOR_MESSAGE_COLOR : RESPONSE_MESSAGE_COLOR,
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
                <div ref={messageContainerRef} className={styles.messages}>
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