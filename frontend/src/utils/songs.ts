import minecraft from "../assets/audio/Minecraft.mp3"
import minecraftCover from "../assets/images/music/minecraft.jpg"
import sweden from "../assets/audio/Sweden.mp3"
import wet_hands from "../assets/audio/Wet Hands.mp3"

import lava from "../assets/audio/lavachicken.mp3"
import lavaCover from "../assets/images/music/lava.webp"

import otherside from "../assets/audio/otherside.mp3"
import othersideCover from "../assets/images/music/otherside.webp"

import creator from "../assets/audio/Creator.mp3"
import creatorCover from "../assets/images/music/creator.webp"

import pigstep from "../assets/audio/Pigstep.mp3"
import pigstepCover from "../assets/images/music/pigstep.webp"

import aerie from "../assets/audio/Aerie.mp3"
import aerieCover from "../assets/images/music/aerie.webp"

export type Music = {
    name: string,
    author: string,
    song: string,
    image: string,
}

export const MUSICS: Music[] = [
    {
        name: "Minecraft",
        author: "C418",
        song: minecraft,
        image: minecraftCover,
    },
    {
        name: "Otherside",
        author: "Lena Raine",
        song: otherside,
        image: othersideCover,
    },
    {
        name: "Sweden",
        author: "C418",
        song: sweden,
        image: minecraftCover
    },
    {
        name: "Creator",
        author: "Lena Raine",
        song: creator,
        image: creatorCover
    },
    {
        name: "Wet Hands",
        author: "C418",
        song: wet_hands,
        image: minecraftCover
    },
    {
        name: "Pigstep",
        author: "Lena Raine",
        song: pigstep,
        image: pigstepCover
    },
    {
        name: "Lava Chicken",
        author: "Hyper Potions",
        song: lava,
        image: lavaCover
    },
    {
        name: "Aerie",
        author: "Lena Raine",
        song: aerie,
        image: aerieCover
    }
]