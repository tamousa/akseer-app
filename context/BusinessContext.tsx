import React, { createContext, useCallback, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BusinessCategory =
  | "store" | "clinic" | "lab" | "beauty" | "cupping" | "spa" | "rehab";

export const BUSINESS_TYPE_ROUTES: Record<BusinessCategory, string> = {
  store:   "/business",
  clinic:  "/business-clinic",
  lab:     "/business-lab",
  beauty:  "/business-beauty",
  cupping: "/business-cupping",
  spa:     "/business-spa",
  rehab:   "/business-rehab",
};

export const BUSINESS_TYPE_LABELS: Record<BusinessCategory, { ar: string; emoji: string }> = {
  store:   { ar: "المتجر",              emoji: "🏪" },
  clinic:  { ar: "العيادة",             emoji: "🏥" },
  lab:     { ar: "المختبر",             emoji: "🔬" },
  beauty:  { ar: "الصالون",             emoji: "💅" },
  cupping: { ar: "مركز الحجامة",        emoji: "🩸" },
  spa:     { ar: "مركز المساج والسبا",  emoji: "💆" },
  rehab:   { ar: "مركز العلاج الطبيعي", emoji: "🦾" },
};

interface BusinessContextType {
  isBusinessLoggedIn: boolean;
  businessType: BusinessCategory | null;
  businessName: string;
  login: (type: BusinessCategory, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({
  isBusinessLoggedIn: false,
  businessType: null,
  businessName: "",
  login: async () => {},
  logout: async () => {},
});

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [isBusinessLoggedIn, setIsBusinessLoggedIn] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessCategory | null>(null);
  const [businessName, setBusinessName] = useState("");

  const login = useCallback(async (type: BusinessCategory, name = "") => {
    setIsBusinessLoggedIn(true);
    setBusinessType(type);
    setBusinessName(name || BUSINESS_TYPE_LABELS[type].ar);
    await AsyncStorage.setItem("business_type", type);
    await AsyncStorage.setItem("business_name", name || BUSINESS_TYPE_LABELS[type].ar);
  }, []);

  const logout = useCallback(async () => {
    setIsBusinessLoggedIn(false);
    setBusinessType(null);
    setBusinessName("");
    await AsyncStorage.removeItem("business_type");
    await AsyncStorage.removeItem("business_name");
  }, []);

  return (
    <BusinessContext.Provider value={{ isBusinessLoggedIn, businessType, businessName, login, logout }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
