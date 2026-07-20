import { BodyData, HttpMethod } from "./types.ts";
import { UnknowMap } from "../utils/types.ts";

export function emptyApiClient() {
    return new ApiClient("")
}

export default class ApiClient {
    baseUrl: string;
    token: string | null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        this.token = null
    }

    setToken = (token: string | null) => {
        this.token = token
    }

    async request(endpoint: string, method: HttpMethod, options: RequestInit = {}, json: boolean = true) {
        const url = `${this.baseUrl}${endpoint}`
        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string> || {}),
        }
        if (json) {
            headers["Content-Type"] = "application/json"
        }
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`
        }
        try {
            return await fetch(url, {
                method,
                headers,
                ...options
            })
        } catch (error) {
            throw new Error(`Api request failed: ${error}`);
        }
    }

    get(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, HttpMethod.GET, options);
    }

    post(endpoint: string, body: BodyData, options: RequestInit = {}, json: boolean = true) {
        return this.request(endpoint, HttpMethod.POST, {
            ...options,
            body: body instanceof FormData ? body : JSON.stringify(body),
        }, json)
    }

    put(endpoint: string, body: UnknowMap, options: RequestInit = {}) {
        return this.request(endpoint, HttpMethod.PUT, {
            ...options,
            body: JSON.stringify(body),
        }, true)
    }

    delete(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, HttpMethod.DELETE, options, true);
    }


    async validate(): Promise<boolean> {
        if (!this.token) {
            return false;
        }
        const response = await this.get("/auth/validate");
        return (await response.json()).valid;
    }
}