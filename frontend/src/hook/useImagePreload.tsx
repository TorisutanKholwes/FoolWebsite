import { useEffect } from "react";

const imagesFiles = [
    new URL("../assets/images/cheh.jpg", import.meta.url).href,
    new URL("../assets/images/warn.jpg", import.meta.url).href,
    new URL("../assets/images/yes.jpg", import.meta.url).href,
]

export const useImagePreload = () => {
    useEffect(() => {
        imagesFiles.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);
};