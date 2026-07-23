import * as React from "react";
import { ApiContextType, ProvidersProps } from "./types.ts";
import ApiClient, { emptyApiClient } from "../api/client.ts";
import { ApiResponse, ApiStatus, BasicResponse } from "../api/types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { useEffect, useMemo, useState } from "react";

const ApiContext = React.createContext<ApiContextType>({
    api: emptyApiClient(),
    login: newEmptyFunction(),
    logout: newEmptyFunction(),
    token: null,
    isAuthenticated: false,
    apiOnline: ApiStatus.OFFLINE,
    loading: false
    }
)

const ApiProvider: React.FC<ProvidersProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken") || null)
    const [apiOnline, setApiOnline] = useState<ApiStatus>(ApiStatus.OFFLINE)
    const [loading, setLoading] = useState<boolean>(true)

    const apiClient = useMemo(() => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""
        const client = new ApiClient(apiBaseUrl)
        if (token) {
            client.setToken(token)
        }
        return client
    }, [token])


    const login = (newToken: string) => {
        if (localStorage.getItem("remember") === "true") {
            localStorage.setItem("authToken", newToken)
        }
        setToken(newToken)
        apiClient.setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem("authToken")
        setToken(null)
        apiClient.setToken(null)
    }

    useEffect(() => {
        const checkApi = async () => {
            setLoading(true)
            try {
                const response = await apiClient.get("/health")
                const json = (await response.json()) as ApiResponse<BasicResponse>
                if (response.ok && response.status === 200) {
                    setApiOnline(json.message as ApiStatus)
                } else {
                    setApiOnline(ApiStatus.ONLINE)
                }
            } catch {
                setApiOnline(ApiStatus.OFFLINE)
            } finally {
                setLoading(false)
            }
        }
        checkApi()
        const interval = setInterval(() => {
            checkApi()
        }, 60000)

        return () => clearInterval(interval)
    }, []);


    const value: ApiContextType = {
        api: apiClient,
        login,
        logout,
        token,
        isAuthenticated: !!token,
        apiOnline,
        loading
    }

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export { ApiProvider, ApiContext };