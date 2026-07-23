import { createContext, FC, useEffect, useRef, useState } from "react";
import { ProvidersProps, SoundContextType } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";
import { MUSICS } from "../utils/songs.ts";

const SoundContext = createContext<SoundContextType>({
    playing: false,
    paused: false,
    pause: newEmptyFunction(),
    resume: newEmptyFunction(),
    currentPlaying: {
        name: "",
        author: ""
    },
    play: newEmptyFunction(),
    stop: newEmptyFunction(),
    nextSong: newEmptyFunction(),
    prevSong: newEmptyFunction()
})

const SoundProvider: FC<ProvidersProps> = ( { children } ) => {

    const [musicIndex, setMusicIndex] = useState<number>(0)

    const [playing, setPlaying] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [currentPlaying, setCurrentPlaying] = useState({
        name: "",
        author: ""
    })
    const backgroundAudio = useRef(new Audio(MUSICS[musicIndex].song))

    useEffect(() => {
        if (localStorage.getItem("sound") === "true") {
            play()
            setCurrentPlaying({
                name: MUSICS[musicIndex].name,
                author: MUSICS[musicIndex].author
            })
        }
    }, []);

    const play = () => {

        backgroundAudio.current.currentTime = 0
        backgroundAudio.current.play()
        setPlaying(true)
        setPaused(false)
    }

    const stop = () => {
        if (!playing)  {
            return
        }
        backgroundAudio.current.pause()
        setPlaying(false)
    }

    const pause = () => {
        if (!playing || paused) {
            return
        }
        backgroundAudio.current.pause()
        setPaused(true)
    }

    const resume = () => {
        if (!playing || !paused) {
            return
        }
        backgroundAudio.current.play()
        setPaused(false)
    }

    const nextSong = () => {
        pause()
        const newIndex = (musicIndex + 1) % MUSICS.length
        setMusicIndex((prevIndex) => (prevIndex + 1) % MUSICS.length)
        backgroundAudio.current = new Audio(MUSICS[newIndex].song)
        setCurrentPlaying({
            name: MUSICS[newIndex].name,
            author: MUSICS[newIndex].author
        })
        play()
    }

    const prevSong = () => {
        pause()
        const newIndex = (musicIndex - 1 + MUSICS.length) % MUSICS.length
        setMusicIndex((prevIndex) => (prevIndex - 1 + MUSICS.length) % MUSICS.length)
        backgroundAudio.current = new Audio(MUSICS[newIndex].song)
        setCurrentPlaying({
            name: MUSICS[newIndex].name,
            author: MUSICS[newIndex].author
        })
        play()
    }

    return <SoundContext.Provider value={{ playing, paused, currentPlaying, play, stop, pause, resume, nextSong, prevSong }}>
        {children}
    </SoundContext.Provider>

}

export { SoundProvider, SoundContext }