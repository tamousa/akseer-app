import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { I18nManager } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BusinessLayout() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#120D24" : "#FFFFFF",
          borderTopColor: isDark ? "#2A1F45" : "#EDE9FE",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: isDark ? "#7A6A96" : "#A89BC4",
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Tajawal_500Medium", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: t("الرئيسية",   "Home"),      tabBarIcon: ({ color, size }) => <Feather name="grid"          size={size} color={color} /> }} />
      <Tabs.Screen name="store"     options={{ title: t("المتجر",      "Store"),     tabBarIcon: ({ color, size }) => <Feather name="shopping-bag"  size={size} color={color} /> }} />
      <Tabs.Screen name="payments"  options={{ title: t("المدفوعات",   "Payments"),  tabBarIcon: ({ color, size }) => <Feather name="credit-card"   size={size} color={color} /> }} />
      <Tabs.Screen name="customers" options={{ title: t("العملاء",     "Customers"), tabBarIcon: ({ color, size }) => <Feather name="users"         size={size} color={color} /> }} />
      <Tabs.Screen name="more"      options={{ title: t("المزيد",      "More"),      tabBarIcon: ({ color, size }) => <Feather name="menu"          size={size} color={color} /> }} />
      <Tabs.Screen name="products"      options={{ href: null }} />
      <Tabs.Screen name="orders"        options={{ href: null }} />
      <Tabs.Screen name="shipping"      options={{ href: null }} />
      <Tabs.Screen name="schedule"      options={{ href: null }} />
      <Tabs.Screen name="staff"         options={{ href: null }} />
      <Tabs.Screen name="inventory"     options={{ href: null }} />
      <Tabs.Screen name="reviews"       options={{ href: null }} />
      <Tabs.Screen name="invoices"      options={{ href: null }} />
      <Tabs.Screen name="pos"           options={{ href: null }} />
      <Tabs.Screen name="reports"       options={{ href: null }} />
      <Tabs.Screen name="store-preview" options={{ href: null }} />
      <Tabs.Screen name="add-product"   options={{ href: null }} />
      <Tabs.Screen name="add-offer"     options={{ href: null }} />
      <Tabs.Screen name="packages"      options={{ href: null }} />
    </Tabs>
  );
}
