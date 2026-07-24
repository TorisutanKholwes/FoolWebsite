import { useEffect } from "react";

const files = import.meta.glob("/src/assets/**/*", { eager: true });

const imagesFiles = Object.keys(files)

console.log(imagesFiles)

export const useImagePreload = () => {
    useEffect(() => {
        imagesFiles.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);
};