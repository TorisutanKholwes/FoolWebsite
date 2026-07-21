import * as React from "react";
import { useEffect } from "react";
import { ProvidersProps } from "../context/types.ts";
import { useNavigate } from "react-router";
import { useApi } from "../hook/useApi.tsx";
import { ApiStatus } from "../api/types.ts";

const ApiOnlineLayout: React.FC<ProvidersProps> = ( { children } ) => {

    const navigate = useNavigate();
    const { apiOnline, loading } = useApi()

    useEffect(() => {
        if (loading) return
        if (apiOnline !== ApiStatus.ONLINE) {
            navigate('/')
        }
    }, [apiOnline, loading])

    return <>{children}</>
}

export default ApiOnlineLayout;