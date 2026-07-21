import { useContext } from "react";
import { PopupContext } from "../context/PopupContext.tsx";

export const usePopup = () => useContext(PopupContext);