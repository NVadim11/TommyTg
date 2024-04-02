import { createContext } from "react"

export const AuthContext = createContext({
  value: null,
  setValue: () => {}
});