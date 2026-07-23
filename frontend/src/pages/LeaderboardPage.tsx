import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    ApiResponse,
    MessagesWithUsernameResponse,
    MessageWithUsername
} from "../api/types.ts";
import { useApi } from "../hook/useApi.tsx";

import styles from "../styles/pages/LeaderboardPage.module.scss"

export default function LeaderboardPage() {

    const navigate = useNavigate();
    const { api } = useApi()

    const [messages, setMessages] = useState<MessageWithUsername[]>([]);

    useEffect(() => {
        fetchMessages()
    }, []);

    const fetchMessages = async () => {
        const response = await api.get("/messages/best")
        if (response.ok && response.status === 200) {
            const formatResponse = (await response.json()) as ApiResponse<MessagesWithUsernameResponse>
            setMessages(formatResponse.content)
        }
    }

    const handleRefresh = async () => {
        setMessages([])
        await fetchMessages()
    }

    return (
        <div className={styles.leaderboardPage}>
            <h1 className={`${styles.title} orange`}>Priority Cases</h1>
            <div className={styles.leaderboardDiv}>
                {messages.map((message, index) => {
                    return (
                        <div className={styles.messageElement} key={message.id}>
                            <p className={`${styles.messagePlace} ${index === 0 ? styles.firstPlace : index === 1 ? styles.secondPlace : index === 2 ? styles.thirdPlace : ''}`}>#{index+1}</p>
                            <div className={styles.messageContent}>
                                <p className={styles.messageParagraph}>&lt;{message.username}&gt; {message.message}</p>
                                <p className={styles.responseParagraph}>&lt;F.O.O.L. Agent&gt; {message.response}</p>
                            </div>
                            <p className={styles.messageScore}>Score: {message.upvote - message.downvote}</p>
                        </div>
                    )
                })}
            </div>
            <div className={styles.leaderboardButtons}>
                <Button onClick={handleRefresh}>Refresh</Button>
                <Button onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )
}