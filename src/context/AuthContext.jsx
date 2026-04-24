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

function getCleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function buildDisplayName(firstName, lastName) {
  const parts = [getCleanString(firstName), getCleanString(lastName)].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

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

  function applySession(authPayload, fallbackUser = null) {
    const nextSession = saveAuthSession(authPayload, fallbackUser);
    setSession(nextSession);
    return nextSession;
  }

  async function login(credentials) {
    const authPayload = await loginRequest(credentials);
    return applySession(authPayload);
  }

  async function registerPatient(patientData) {
    const authPayload = await registerPatientRequest(patientData);
    return applySession(authPayload, {
      name: buildDisplayName(patientData.firstName, patientData.lastName),
      firstName: getCleanString(patientData.firstName),
      lastName: getCleanString(patientData.lastName),
      phone: getCleanString(patientData.phoneNumber),
      gender: getCleanString(patientData.gender),
      dateOfBirth: getCleanString(patientData.dateOfBirth),
    });
  }

  async function registerDoctor(doctorData) {
    const authPayload = await registerDoctorRequest(doctorData);
    return applySession(authPayload, {
      name: buildDisplayName(doctorData.firstName, doctorData.lastName),
      firstName: getCleanString(doctorData.firstName),
      lastName: getCleanString(doctorData.lastName),
      phone: getCleanString(doctorData.phoneNumber),
      dateOfBirth: getCleanString(doctorData.dateOfBirth),
    });
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
