import { useEffect, useState } from "react";
import { ensureValidAccessToken } from "../services/apiClient";
import {
  login as loginRequest,
  logoutSession as logoutRequest,
  registerDoctor as registerDoctorRequest,
  registerPatient as registerPatientRequest,
} from "../services/authService";
import {
  clearAuthSession,
  getStoredAuthSession,
  saveAuthSession,
  subscribeToAuthChanges,
} from "../utils/authStorage";
import AuthContextValue from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const storedSession = getStoredAuthSession();

      if (!storedSession) {
        if (isMounted) {
          setSession(null);
          setIsAuthResolved(true);
        }

        return;
      }

      try {
        await ensureValidAccessToken();

        if (isMounted) {
          setSession(getStoredAuthSession());
        }
      } catch {
        clearAuthSession();

        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthResolved(true);
        }
      }
    }

    initializeSession();

    const unsubscribe = subscribeToAuthChanges((nextSession) => {
      if (isMounted) {
        setSession(nextSession);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  function applySession(authPayload) {
    const nextSession = saveAuthSession(authPayload);
    setSession(nextSession);
    return nextSession;
  }

  async function login(credentials) {
    const authPayload = await loginRequest(credentials);
    return applySession(authPayload);
  }

  async function registerPatient(patientData) {
    const authPayload = await registerPatientRequest(patientData);
    return applySession(authPayload);
  }

  async function registerDoctor(doctorData) {
    const authPayload = await registerDoctorRequest(doctorData);
    return applySession(authPayload);
  }

  async function logout() {
    try {
      if (session?.accessToken) {
        await logoutRequest();
      }
    } catch {
      // Clear local session even if the backend session is already expired.
    } finally {
      clearAuthSession();
      setSession(null);
    }
  }

  function isAuthenticated() {
    return Boolean(session?.accessToken && session?.user);
  }

  return (
    <AuthContextValue.Provider
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        refreshToken: session?.refreshToken ?? null,
        login,
        logout,
        registerPatient,
        registerDoctor,
        isAuthenticated,
        isAuthResolved,
      }}
    >
      {children}
    </AuthContextValue.Provider>
  );
}
