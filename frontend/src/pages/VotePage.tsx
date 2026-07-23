import Button from "../components/button/Button.tsx";
import { useNavigate } from "react-router";
import { FC, useEffect, useState } from "react";
import {
    ApiResponse,
    ErrorResponse,
    FilledVoteResponse, MessagesWithUsernameResponse,
    MessageWithUsername,
} from "../api/types.ts";
import { useApi } from "../hook/useApi.tsx";
import { usePopup } from "../hook/usePopup.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";

import styles from "../styles/pages/VotePage.module.scss"


const MessageComponents: FC<{message: MessageWithUsername}> = ({ message }) => {

    const { showPopup, hidePopup } = usePopup()
    const { showPanel } = usePanel()
    const { api } = useApi()

    const [upVote, setUpVote] = useState(false)
    const [downVote, setDownVote] = useState(false)
    const [score, setScore] = useState(message.upvote - message.downvote)
    const [loading, setLoading] = useState(false)

    const fetchVote = async () => {
        const response = await api.get(`/votes/${message.id}`)
        if (!response.ok || response.status !== 200) {
            return
        }
        const formatResponse = (await response.json()) as ApiResponse<FilledVoteResponse>
        if (formatResponse.vote.type === "upvote") {
            setUpVote(true)
        } else if (formatResponse.vote.type === "downvote") {
            setDownVote(true)
        }
    }

    useEffect(() => {
        setLoading(true)
        setUpVote(false)
        setDownVote(false)
        setScore(message.upvote - message.downvote)
        fetchVote().then(() => {
            setLoading(false)
        })
    }, [message.id]);

    const handleUpvote = async () => {
        if (downVote) {
            showPanel("Please remove your downvote before upvoting.", PanelType.ERROR)
            return
        }
        await handleVote('upvote', upVote, setUpVote)
    }

    const handleDownvote = async () => {
        if (upVote) {
            showPanel("Please remove your upvote before downvoting.", PanelType.ERROR)
            return
        }
        await handleVote('downvote', downVote, setDownVote)
    }

    const handleVote = async (type: string, curr: boolean, setter: (value: boolean) => void) => {
        if (loading) {
            return
        }
        let response: Response;
        if (curr) {
            response = await api.delete(`/votes/${message.id}`)
        } else {
            response = await api.post("/votes/", { id: String(message.id), type } )
        }
        if (response.ok && (response.status === 200 || response.status === 201)) {
            setter(!curr)
        } else {
            const formatMessage = (await response.json()) as ApiResponse<ErrorResponse>
            showPanel(formatMessage.error, PanelType.WARNING)
            return
        }
        if (type === 'upvote') {
            setScore(!curr ? score + 1 : score - 1)
        } else if (type === 'downvote') {
            setScore(!curr ? score - 1 : score + 1)
        }
    }

    return <div onMouseEnter={() => showPopup(`Upvote count : ${message.upvote} | Downvote count : ${message.downvote}`)} onMouseLeave={hidePopup} className={styles.messageComponent}>
        <div>
            <p className={styles.authorMessage}>&lt;{message.username}&gt; {message.message}</p>
            <p className={styles.responseMessage}>&lt;F.O.O.L. Agent&gt; {message.response}</p>
        </div>
        <div className={styles.voteBtnDiv}>
            <Button onClick={handleUpvote} className={`${styles.voteButton} ${upVote ? styles.voteButtonActive : ''}`}>▲</Button>
            <p>{score}</p>
            <Button onClick={handleDownvote} className={`${styles.voteButton} ${downVote ? styles.voteButtonActive : ''}`}>▼</Button>
        </div>
    </div>
}

export default function VotePage() {

    const navigate = useNavigate()
    const { api } = useApi()

    const options = ["Most recents", "Top of the day", "Top of the week"];

    const [selectedOption, setSelectedOption] = useState<number>(0);
    const [messages, setMessages] = useState<MessageWithUsername[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchMessages().then(() => {
            setLoading(false)
        })
    }, [])

    const handleOptionChange = async (i: number) => {
        if (loading) {
            return
        }
        setSelectedOption(i)
        setLoading(true)
        setMessages([])
        await fetchMessages(i)
        setLoading(false)
    }

    const fetchMessages = async (index: number = -1) => {
        const limit = 42;
        const keys = ['recent', 'daily', 'weekly']
        if (index === -1) {
            index = selectedOption
        }
        const response = await api.get(`/messages?limit=${limit}&offset=0&filter=${keys[index]}`)
        if (response.ok && response.status === 200) {
            const formatResponse = (await response.json()) as ApiResponse<MessagesWithUsernameResponse>
            formatResponse.content = formatResponse.content.slice(0, limit)
            console.log(formatResponse.content)
            setMessages(formatResponse.content)
        }
    }

    const handleRefresh = async () => {
        setLoading(true)
        setMessages([])
        await fetchMessages()
        setLoading(false)
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
                {messages.map((message, _) => (
                    <MessageComponents message={message} key={message.id} />
                ))}
            </div>
            <div className={styles.btnDiv}>
                <Button onClick={handleRefresh}>Refresh</Button>
                <Button onClick={() => navigate("/")}>Go back</Button>
            </div>
        </div>
    )

}