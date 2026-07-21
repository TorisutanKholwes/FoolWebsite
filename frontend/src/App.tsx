import { AppProviders } from "./context/AppProviders.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import Page404 from "./pages/Page404.tsx";

import "./styles/global.scss"
import TestPage from "./pages/TestPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const RootLayout = () => {
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
                    element: <RegisterPage />
                },
                {
                    path: "/login",
                    element: <LoginPage />
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