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

import "./styles/global.scss"
import VotePage from "./pages/VotePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";

const RootLayout = () => {
    useImagePreload()
    return <AppProviders>
        <Outlet />
    </AppProviders>
}

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
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
                    path: '*',
                    element: <Page404 />
                },
                {
                    path: "test",
                    element: <TestPage />
                }
            ]
        }
    ])

    return (
        <>
            <RouterProvider router={router} />
            <footer>
                © 2026 Alexis Burnier-Framboret & Tristan Clowez & Corentin Delaporte. Powered by our brains.
            </footer>
        </>
    )
}