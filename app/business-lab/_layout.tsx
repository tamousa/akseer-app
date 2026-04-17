import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { I18nManager } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function LabLayout() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#060E1A" : "#FFFFFF",
          borderTopColor: isDark ? "#1A3352" : "#BAD4E8",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#0369A1",
        tabBarInactiveTintColor: isDark ? "#4A6A8A" : "#6B9EBD",
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Tajawal_500Medium", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: t("الرئيسية",  "Home"),      tabBarIcon: ({ color, size }) => <Feather name="grid"        size={size} color={color} /> }} />
      <Tabs.Screen name="catalog"  options={{ title: t("الكتالوج",  "Catalog"),   tabBarIcon: ({ color, size }) => <Feather name="list"        size={size} color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: t("الحجوزات",  "Bookings"),  tabBarIcon: ({ color, size }) => <Feather name="calendar"    size={size} color={color} /> }} />
      <Tabs.Screen name="payments" options={{ title: t("المدفوعات", "Payments"),  tabBarIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} /> }} />
      <Tabs.Screen name="more"     options={{ title: t("المزيد",    "More"),      tabBarIcon: ({ color, size }) => <Feather name="menu"        size={size} color={color} /> }} />
      <Tabs.Screen name="tests"         options={{ href: null }} />
      <Tabs.Screen name="packages"      options={{ href: null }} />
      <Tabs.Screen name="offers"        options={{ href: null }} />
      <Tabs.Screen name="home-visits"   options={{ href: null }} />
      <Tabs.Screen name="results"       options={{ href: null }} />
      <Tabs.Screen name="schedule"      options={{ href: null }} />
      <Tabs.Screen name="lab-staff"     options={{ href: null }} />
      <Tabs.Screen name="invoices"      options={{ href: null }} />
      <Tabs.Screen name="reports"       options={{ href: null }} />
      <Tabs.Screen name="reviews"       options={{ href: null }} />
      <Tabs.Screen name="lab-preview"   options={{ href: null }} />
      <Tabs.Screen name="add-test"      options={{ href: null }} />
      <Tabs.Screen name="add-offer"     options={{ href: null }} />
    </Tabs>
  );
}
