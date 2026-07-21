import * as React from "react";
import { useEffect } from "react";
import { ProvidersProps } from "../context/types.ts";
import { useNavigate } from "react-router";
import { useApi } from "../hook/useApi.tsx";
import { ApiStatus } from "../api/types.ts";

const AuthenticatedLayout: React.FC<ProvidersProps> = ( { children } ) => {

    const navigate = useNavigate();
    const { isAuthenticated, api, token, apiOnline, loading } = useApi()

    useEffect(() => {
        if (loading) return
        if (!isAuthenticated || apiOnline !== ApiStatus.ONLINE) {
            navigate('/')
            return;
        }
        api.validate()
            .then(valid => {
                if (!valid) navigate('/')
            })
            .catch(() => navigate('/'));
    }, [token, apiOnline, loading])

    return <>{children}</>
}

export default AuthenticatedLayout