import minecraft from "../assets/audio/Minecraft.mp3"
import otherside from "../assets/audio/otherside.mp3"

export type Music = {
    name: string,
    author: string,
    song: string
}

export const MUSICS: Music[] = [
    {
        name: "Minecraft",
        author: "C418",
        song: minecraft
    },
    {
        name: "Otherside",
        author: "Lena Raine",
        song: otherside
    }
]