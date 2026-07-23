import { AppProviders } from "./context/AppProviders.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import Page404 from "./pages/Page404.tsx";
import TestPage from "./pages/TestPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ApiOnlineLayout from "./layout/ApiOnlineLayout.tsx";
import { useImagePreload } from "./hook/useImagePreload.tsx";
import AuthenticatedLayout from "./layout/AuthenticatedLayout.tsx";
import AskPage from "./pages/AskPage.tsx";
import VotePage from "./pages/VotePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx"
import SettingsPage from "./pages/SettingsPage.tsx";
import { useEffect } from "react";
import { useUser } from "./hook/useUser.tsx";
import { useApi } from "./hook/useApi.tsx";
import SocialPage from "./pages/SocialPage.tsx";


import "./styles/global.scss";
import AdminPage from "./pages/AdminPage.tsx";

const RootLayout = () => {
    useImagePreload()

    return <AppProviders>
        <Outlet />
    </AppProviders>
}

const ProtectedLayout = () => {

    const { auth } = useUser()
    const { token } = useApi()

    useEffect(() => {
        auth()
    }, [token]);

    return <Outlet />
}

export default function App() {

    useEffect(() => {
        const defaultSettings = ["remember", "sound"]
        for (const setting of defaultSettings) {
            if (!localStorage.getItem(setting)) {
                localStorage.setItem(setting, "true")
            }
        }
    }, [])

    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                {
                    element: <ProtectedLayout />,
                    children: [
                        {
                            index: true,
                            element: <HomePage />
                        },
                        {
                            path: "/register",
                            element: <ApiOnlineLayout><RegisterPage /></ApiOnlineLayout>
                        },
                        {
                            path: "/login",
                            element: <ApiOnlineLayout><LoginPage /></ApiOnlineLayout>
                        },
                        {
                            path: "/asker",
                            element: <ApiOnlineLayout><AuthenticatedLayout><AskPage /></AuthenticatedLayout></ApiOnlineLayout>
                        },
                        {
                            path: "/vote",
                            element: <ApiOnlineLayout><AuthenticatedLayout><VotePage /></AuthenticatedLayout></ApiOnlineLayout>
                        },
                        {
                            path: "/profile",
                            element: <ApiOnlineLayout><AuthenticatedLayout><ProfilePage /></AuthenticatedLayout></ApiOnlineLayout>
                        },
                        {
                            path: "/leaderboard",
                            element: <ApiOnlineLayout><AuthenticatedLayout><LeaderboardPage /></AuthenticatedLayout></ApiOnlineLayout>
                        },
                        {
                            path: "/settings",
                            element: <SettingsPage />
                        },
                        {
                            path: "/social",
                            element: <SocialPage />
                        },
                        {
                            path: "/admin",
                            element: <ApiOnlineLayout><AuthenticatedLayout><AdminPage /></AuthenticatedLayout></ApiOnlineLayout>
                        },
                        {
                            path: '*',
                            element: <Page404 />
                        },
                        {
                            path: "test",
                            element: <TestPage />
                        }
                    ]
                },
            ]
        }
    ])

    return (
        <>
            <RouterProvider router={router} />
            <footer>
                <p>Alexis Burnier, Tristan Clowez and Corentin Delaporte</p>
                <p onClick={() => window.open("https://github.com/TorisutanKholwes/FoolWebsite", "_blank")} className="ankle">Powered by Alexis's ankle</p>
            </footer>
        </>
    )
}