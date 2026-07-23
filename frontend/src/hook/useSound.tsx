import { useContext } from "react";
import { SoundContext } from "../context/SoundContext.tsx";

export const useSound = () => useContext(SoundContext);