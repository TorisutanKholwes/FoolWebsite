import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { FC, useEffect, useState } from "react";
import {
    ApiResponse,
    MessageWithUsername,
    MessageWithUsernameResponse
} from "../api/types.ts";
import { useApi } from "../hook/useApi.tsx";

import styles from "../styles/pages/VotePage.module.scss"
import { usePopup } from "../hook/usePopup.tsx";

const MessageComponents: FC<{message: MessageWithUsername}> = ({ message }) => {

    const { showPopup, hidePopup } = usePopup()

    const score = message.upvote - message.downvote
    return <div onMouseEnter={() => showPopup(`Message send the ${message.datetime}`)} onMouseLeave={hidePopup} className={styles.messageComponent}>
        <div>
            <p className={styles.authorMessage}>&lt;{message.username}&gt; {message.message}</p>
            <p className={styles.responseMessage}>&lt;F.O.O.L. Agent&gt; {message.response}</p>
        </div>
        <div className={styles.voteBtnDiv}>
            <Button className={styles.voteButton}>▲</Button>
            <p>{score}</p>
            <Button className={styles.voteButton}>▼</Button>
        </div>
    </div>
}

export default function VotePage() {

    const navigate = useNavigate()
    const { api } = useApi()

    const options = ["Most recents", "Top of the day", "Top of the week"];

    const [selectedOption, setSelectedOption] = useState<number>(0);
    const [messages, setMessages] = useState<MessageWithUsername[]>([]);

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleOptionChange = async (i: number) => {
        setSelectedOption(i)
        await fetchMessages()
    }

    const fetchMessages = async () => {
        const keys = ['recent', 'daily', 'weekly']
        const response = await api.get(`/messages?limit=4&offset=0&filter=${keys[selectedOption]}`)
        if (response.ok && response.status === 200) {
            const formatResponse = (await response.json()) as ApiResponse<MessageWithUsernameResponse>
            formatResponse.content = formatResponse.content.slice(0, 4)
            setMessages(formatResponse.content)
        }
    }

    return (
        <div className={styles.votePage}>
            <h1 className={`${styles.title} orange`}>Report Archive</h1>
            <div>
                <ul className={styles.options}>
                    {options.map((option, i) => (
                        <li
                            onClick={() => handleOptionChange(i)}
                            className={`${styles.option} ${selectedOption === i ? styles.selected : ""}`}
                            key={i}>
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.voteContainer}>
                {messages.map((message, i) => (
                    <MessageComponents message={message} key={i} />
                ))}
            </div>
            <div className={styles.btnDiv}>
                <Button onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )

}