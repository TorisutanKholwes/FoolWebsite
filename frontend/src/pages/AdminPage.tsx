import { useEffect, useState } from "react";
import { useApi } from "../hook/useApi.tsx";
import { useNavigate } from "react-router";

import styles from "../styles/pages/AdminPage.module.scss"
import {
    ApiResponse,
    ErrorResponse,
    FilledVote,
    FilledVotesResponse,
    MessagesWithUsernameResponse,
    MessageWithUsername,
    User,
    UsersResponse
} from "../api/types.ts";
import Button from "../components/button/Button.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import { PanelType } from "../utils/types.ts";

export default function AdminPage() {

    const { api } = useApi()
    const { showPanel } = usePanel()
    const navigate = useNavigate()

    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const [users, setUsers] = useState<User[]>([])
    const [messages, setMessages] = useState<MessageWithUsername[]>([])
    const [votes, setVotes] = useState<FilledVote[]>([])

    useEffect(() => {
        fetchAdmin().then(() => {
            loadData()
        });
    }, []);

    const fetchAdmin = async () => {
        const response = await api.get("/auth/admin-grant")
        if (!response.ok || response.status !== 200) {
            navigate("/")
            return
        }
        setIsAdmin(true)
    }

    const loadData = async () => {
        setUsers([])
        setMessages([])
        setVotes([])
        let formatted;

        let response = await api.get("/auth/users")
        if (response.ok && response.status === 200) {
            formatted = (await response.json()) as ApiResponse<UsersResponse>
            setUsers(formatted.users)
        }
        response = await api.get("/messages/all")
        if (response.ok && response.status === 200) {
            formatted = (await response.json()) as ApiResponse<MessagesWithUsernameResponse>
            setMessages(formatted.content)
        }
        response = await api.get("/votes/all")
        if (response.ok && response.status === 200) {
            formatted = (await response.json()) as ApiResponse<FilledVotesResponse>
            setVotes(formatted.votes)
        }
    }

    const deleteUser = async (userId: number) => {
        await sendRequest(`/auth/${userId}`)
    }

    const deleteMessage = async (messageId: number) => {
        await sendRequest(`/messages/${messageId}`)
    }

    const deleteVote = async (voteId: number) => {
        await sendRequest(`/votes/admin/${voteId}`)
    }

    const sendRequest = async (url: string) => {
        const response = await api.delete(url)
        if (response.ok && response.status === 200) {
            await loadData()
            return
        }
        const formattedData = (await response.json()) as ApiResponse<ErrorResponse>
        showPanel(formattedData.error,  PanelType.ERROR, url)
    }

    return (
        <>
            {isAdmin ? (
                <div className={styles.adminPage}>
                    <h1 className={`${styles.title} orange`}>Admin Dashboard</h1>
                    <div className={styles.adminContent}>
                        <div>
                            <h2 className={styles.subtitle}>Manage users :</h2>
                            <>
                                {users.length === 0 && (
                                    <p>No content</p>
                                )}
                            </>
                            <div className={styles.adminContainer}>
                                {users.map((user) => (
                                    <div className={styles.adminElement} key={user.id}>
                                        <p>{user.name}</p>
                                        <Button onClick={() => deleteUser(user.id)} className={styles.deleteButton}>X</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.subtitle}>Manage messages :</h2>
                            <div className={styles.adminContainer}>
                                <>
                                    {messages.length === 0 && (
                                        <p>No content</p>
                                    )}
                                </>
                                {messages.map((message) => (
                                    <div className={styles.adminElement} key={message.id}>
                                        <div>
                                            <p className={styles.authorMessage}>&lt;{message.username}&gt; {message.message}</p>
                                            <p className={styles.answerMessage}>&lt;F.O.O.L. Agent&gt; {message.response}</p>
                                        </div>
                                        <Button onClick={() => deleteMessage(message.id)} className={styles.deleteButton}>X</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.subtitle}>Manage votes :</h2>
                            <div className={styles.adminContainer}>
                                <>
                                    {votes.length === 0 && (
                                        <p>No content</p>
                                    )}
                                </>
                                {votes.map((vote) => (
                                    <div className={styles.adminElement} key={vote.id}>
                                        <div>
                                            <p>{vote.type}</p>
                                            <div>
                                                <p className={styles.authorMessage}>&lt;{vote.username}&gt; {vote.message}</p>
                                                <p className={styles.answerMessage}>&lt;F.O.O.L. Agent&gt; {vote.response}</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => deleteVote(vote.id)} className={styles.deleteButton}>X</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button onClick={loadData}>Refresh</Button>
                        <Button onClick={() => navigate("/")}>Go back</Button>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    )
}