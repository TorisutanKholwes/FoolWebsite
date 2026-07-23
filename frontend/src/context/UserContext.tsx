import { createContext, FC, useState } from "react";
import { ProvidersProps, UserContextType } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { ApiResponse, User, UserResponse } from "../api/types.ts";
import { useApi } from "../hook/useApi.tsx";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: newEmptyFunction(),
    auth: newEmptyFunction(),
    reset: newEmptyFunction(),
})

const UserProvider: FC<ProvidersProps> = ( { children } ) => {

    const { api, isAuthenticated, logout } = useApi()
    const [user, setUser] = useState<User|null>(null)

    const auth = async () => {
        if (!isAuthenticated) {
            return
        }
        const response = await api.get("/auth/me")
        if (response.ok && response.status === 200) {
            const formatted = (await response.json()) as ApiResponse<UserResponse>
            setUser(formatted.user)
        } else {
            setUser(null)
            logout()
        }
    }

    const reset = () => {
        setUser(null)
    }

    return (
        <UserContext.Provider value={ { user, auth, reset, setUser } }>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }