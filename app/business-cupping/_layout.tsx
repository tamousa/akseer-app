import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { I18nManager } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#92400E";

export default function CuppingLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: isDark ? "#1A0E00" : "#FFFBEB", borderTopColor: BRAND + "30", height: 62, paddingBottom: 8 },
        tabBarActiveTintColor: BRAND,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: "Tajawal_700Bold", fontSize: 10 },
      }}
    >
      <Tabs.Screen name="index"            options={{ title: t("الرئيسية",  "Home"),     tabBarIcon: ({ color, size }) => <Feather name="home"        size={size} color={color} /> }} />
      <Tabs.Screen name="sessions"         options={{ title: t("الجلسات",   "Sessions"), tabBarIcon: ({ color, size }) => <Feather name="droplet"     size={size} color={color} /> }} />
      <Tabs.Screen name="bookings"         options={{ title: t("الحجوزات",  "Bookings"), tabBarIcon: ({ color, size }) => <Feather name="calendar"    size={size} color={color} /> }} />
      <Tabs.Screen name="payments"         options={{ title: t("المدفوعات", "Payments"), tabBarIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} /> }} />
      <Tabs.Screen name="more"             options={{ title: t("المزيد",    "More"),     tabBarIcon: ({ color, size }) => <Feather name="menu"        size={size} color={color} /> }} />
      <Tabs.Screen name="staff"            options={{ href: null }} />
      <Tabs.Screen name="offers"           options={{ href: null }} />
      <Tabs.Screen name="cupping-preview"  options={{ href: null }} />
      <Tabs.Screen name="add-session"      options={{ href: null }} />
      <Tabs.Screen name="add-offer"        options={{ href: null }} />
      <Tabs.Screen name="packages"         options={{ href: null }} />
    </Tabs>
  );
}
