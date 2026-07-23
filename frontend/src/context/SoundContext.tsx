import { createContext, FC, useEffect, useRef, useState } from "react";
import { ProvidersProps, SoundContextType } from "./types.ts";
import { newEmptyFunction } from "../utils/utils.ts";

import minecraft from "../assets/audio/Minecraft.mp3"

const SoundContext = createContext<SoundContextType>({
    playing: false,
    play: newEmptyFunction(),
    stop: newEmptyFunction()
})

const SoundProvider: FC<ProvidersProps> = ( { children } ) => {

    const [playing, setPlaying] = useState<boolean>(false)
    const backgroundAudio = useRef(new Audio(minecraft))

    useEffect(() => {
        if (localStorage.getItem("sound") === "true") {
            play()
        }
    }, []);

    const play = () => {
        if (playing) {
            return
        }
        backgroundAudio.current.currentTime = 0
        backgroundAudio.current.play()
        setPlaying(true)
    }

    const stop = () => {
        if (!playing)  {
            return
        }
        backgroundAudio.current.pause()
        setPlaying(false)
    }

    return <SoundContext.Provider value={{ playing, play, stop }}>
        {children}
    </SoundContext.Provider>

}

export { SoundProvider, SoundContext }