import { useEffect, useState, useCallback } from "react";
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
} from "../services/authStorage";
import AuthContextValue from "./AuthContextValue";

/** Helper utilities (same as previous version) */
function getCleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function buildDisplayName(firstName, lastName) {
  const parts = [getCleanString(firstName), getCleanString(lastName)].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

export function AuthProvider({ children }) {
  // ----- State -----
  const [session, setSession] = useState(null); // {accessToken, refreshToken, user}
  const [isAuthResolved, setIsAuthResolved] = useState(false); // false => still loading

  // ----- Helper to persist a session -----
  const applySession = useCallback((authPayload, fallbackUser = null) => {
    const next = saveAuthSession(authPayload, fallbackUser);
    setSession(next);
    return next;
  }, []);

  // ----- Initialise from storage -----
  useEffect(() => {
    let isMounted = true;
    async function init() {
      const stored = getStoredAuthSession();
      if (!stored) {
        if (isMounted) {
          setSession(null);
          setIsAuthResolved(true);
        }
        return;
      }
      try {
        // Ensure token validity – will refresh if needed
        await ensureValidAccessToken();
        if (isMounted) setSession(getStoredAuthSession());
      } catch {
        clearAuthSession();
        if (isMounted) setSession(null);
      } finally {
        if (isMounted) setIsAuthResolved(true);
      }
    }
    init();

    const unsubscribe = subscribeToAuthChanges((next) => {
      if (isMounted) setSession(next);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [applySession]);

  // ----- Auth actions -----
  const login = useCallback(async (credentials) => {
    const payload = await loginRequest(credentials);
    return applySession(payload);
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      if (session?.accessToken) await logoutRequest();
    } catch {
      // ignore backend errors, clear locally anyway
    } finally {
      clearAuthSession();
      setSession(null);
    }
  }, [session]);

  const registerPatient = useCallback(async (patientData) => {
    const payload = await registerPatientRequest(patientData);
    return applySession(payload, {
      name: buildDisplayName(patientData.firstName, patientData.lastName),
      firstName: getCleanString(patientData.firstName),
      lastName: getCleanString(patientData.lastName),
      phone: getCleanString(patientData.phoneNumber),
      gender: getCleanString(patientData.gender),
      dateOfBirth: getCleanString(patientData.dateOfBirth),
    });
  }, [applySession]);

  const registerDoctor = useCallback(async (doctorData) => {
    const payload = await registerDoctorRequest(doctorData);
    return applySession(payload, {
      name: buildDisplayName(doctorData.firstName, doctorData.lastName),
      firstName: getCleanString(doctorData.firstName),
      lastName: getCleanString(doctorData.lastName),
      phone: getCleanString(doctorData.phoneNumber),
      dateOfBirth: getCleanString(doctorData.dateOfBirth),
    });
  }, [applySession]);

  // ----- New utilities -----
  const refreshUser = useCallback(async () => {
    // Force token validation then re‑read stored session
    await ensureValidAccessToken({ forceRefresh: true });
    const refreshed = getStoredAuthSession();
    setSession(refreshed);
    return refreshed;
  }, []);

  const hasRole = useCallback(
    (role) => Boolean(session?.user?.role && session.user.role === role),
    [session]
  );

  // ----- Compatibility helpers -----
  const isAuthenticated = useCallback(() => Boolean(session?.accessToken && session?.user), [session]);

  // ----- Context value -----
  const contextValue = {
    // Core data
    user: session?.user ?? null,
    tokens: {
      accessToken: session?.accessToken ?? null,
      refreshToken: session?.refreshToken ?? null,
    },
    isLoggedIn: isAuthenticated(),
    loading: !isAuthResolved,
    // Auth actions
    login,
    logout,
    registerPatient,
    registerDoctor,
    // New helpers
    refreshUser,
    hasRole,
    // Legacy helpers kept for existing pages
    isAuthenticated,
    isAuthResolved,
  };

  return (
    <AuthContextValue.Provider value={contextValue}>
      {children}
    </AuthContextValue.Provider>
  );
}
