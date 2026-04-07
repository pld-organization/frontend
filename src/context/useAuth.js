import { useContext } from "react";
import AuthContextValue from "./AuthContextValue";

export function useAuth() {
  const context = useContext(AuthContextValue);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
