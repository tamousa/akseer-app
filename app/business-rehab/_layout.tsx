import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { I18nManager } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";

export default function RehabLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
                              }}
    >
      <Tabs.Screen name="index"            options={{ title: t("الرئيسية",  "Home"),     tabBarIcon: ({ color, size }) => <Feather name="home"        size={size} color={color} /> }} />
      <Tabs.Screen name="patients"         options={{ title: t("المرضى",    "Patients"), tabBarIcon: ({ color, size }) => <Feather name="users"       size={size} color={color} /> }} />
      <Tabs.Screen name="sessions"         options={{ title: t("الجلسات",   "Sessions"), tabBarIcon: ({ color, size }) => <Feather name="activity"    size={size} color={color} /> }} />
      <Tabs.Screen name="payments"         options={{ title: t("المدفوعات", "Payments"), tabBarIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} /> }} />
      <Tabs.Screen name="more"             options={{ title: t("المزيد",    "More"),     tabBarIcon: ({ color, size }) => <Feather name="menu"        size={size} color={color} /> }} />
      <Tabs.Screen name="bookings"         options={{ href: null }} />
      <Tabs.Screen name="staff"            options={{ href: null }} />
      <Tabs.Screen name="offers"           options={{ href: null }} />
      <Tabs.Screen name="treatment-plans"  options={{ href: null }} />
      <Tabs.Screen name="rehab-preview"    options={{ href: null }} />
      <Tabs.Screen name="add-service"      options={{ href: null }} />
      <Tabs.Screen name="add-offer"        options={{ href: null }} />
      <Tabs.Screen name="packages"         options={{ href: null }} />
    </Tabs>
  );
}
