import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { I18nManager } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ClinicLayout() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#070F18" : "#FFFFFF",
          borderTopColor: isDark ? "#1A3A52" : "#BAE6FD",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#0E7490",
        tabBarInactiveTintColor: isDark ? "#4A7A8A" : "#6B9EAD",
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Tajawal_500Medium", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: t("الرئيسية",  "Home"),      tabBarIcon: ({ color, size }) => <Feather name="grid"        size={size} color={color} /> }} />
      <Tabs.Screen name="services" options={{ title: t("الخدمات",   "Services"),  tabBarIcon: ({ color, size }) => <Feather name="clipboard"   size={size} color={color} /> }} />
      <Tabs.Screen name="payments" options={{ title: t("المدفوعات", "Payments"),  tabBarIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} /> }} />
      <Tabs.Screen name="patients" options={{ title: t("المرضى",    "Patients"),  tabBarIcon: ({ color, size }) => <Feather name="users"       size={size} color={color} /> }} />
      <Tabs.Screen name="more"     options={{ title: t("المزيد",    "More"),      tabBarIcon: ({ color, size }) => <Feather name="menu"        size={size} color={color} /> }} />
      <Tabs.Screen name="medical-staff"     options={{ href: null }} />
      <Tabs.Screen name="appointments"      options={{ href: null }} />
      <Tabs.Screen name="medical-services"  options={{ href: null }} />
      <Tabs.Screen name="home-visits"       options={{ href: null }} />
      <Tabs.Screen name="schedule"          options={{ href: null }} />
      <Tabs.Screen name="clinic-staff"      options={{ href: null }} />
      <Tabs.Screen name="invoices"          options={{ href: null }} />
      <Tabs.Screen name="reports"           options={{ href: null }} />
      <Tabs.Screen name="reviews"           options={{ href: null }} />
      <Tabs.Screen name="clinic-preview"    options={{ href: null }} />
      <Tabs.Screen name="add-service"       options={{ href: null }} />
      <Tabs.Screen name="add-offer"         options={{ href: null }} />
      <Tabs.Screen name="packages"          options={{ href: null }} />
    </Tabs>
  );
}
