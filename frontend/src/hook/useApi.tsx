import { useContext } from "react";
import { ApiContext } from "../context/ApiContext.tsx";

export const useApi = () => useContext(ApiContext)