import { useContext } from "react";
import { PanelContext } from "../context/PanelContext.tsx";

export const usePanel = () => useContext(PanelContext);