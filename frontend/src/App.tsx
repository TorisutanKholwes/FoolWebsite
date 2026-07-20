import { AppProviders } from "./context/AppProviders.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

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
                    element: <h1>Hello World</h1>
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