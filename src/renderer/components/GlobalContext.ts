import { createContext } from "react";
import { Environment } from "../../shared";

export const GlobalContext = createContext<{
    ENV: Environment;
}>(null);
