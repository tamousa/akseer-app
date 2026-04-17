import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Tab = {
  key: string;
  labelAr: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  route: string;
};

type BusinessConfig = {
  color: string;
  prefix: string;
  tabs: Tab[];
};

const BUSINESS_CONFIGS: BusinessConfig[] = [
  {
    prefix: "/business-clinic",
    color: "#0E7490",
    tabs: [
      { key: "index",        labelAr: "الرئيسية",  icon: "home",        route: "/business-clinic" },
      { key: "appointments", labelAr: "المواعيد",  icon: "calendar",    route: "/business-clinic/appointments" },
      { key: "patients",     labelAr: "المرضى",    icon: "users",       route: "/business-clinic/patients" },
      { key: "payments",     labelAr: "المدفوعات", icon: "credit-card", route: "/business-clinic/payments" },
      { key: "more",         labelAr: "المزيد",    icon: "menu",        route: "/business-clinic/more" },
    ],
  },
  {
    prefix: "/business-rehab",
    color: "#059669",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",        route: "/business-rehab" },
      { key: "sessions", labelAr: "الجلسات",   icon: "activity",    route: "/business-rehab/sessions" },
      { key: "patients", labelAr: "المرضى",    icon: "users",       route: "/business-rehab/patients" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business-rehab/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business-rehab/more" },
    ],
  },
  {
    prefix: "/business-spa",
    color: "#7C3AED",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",        route: "/business-spa" },
      { key: "bookings", labelAr: "الحجوزات",  icon: "calendar",    route: "/business-spa/bookings" },
      { key: "services", labelAr: "الخدمات",   icon: "star",        route: "/business-spa/services" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business-spa/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business-spa/more" },
    ],
  },
  {
    prefix: "/business-beauty",
    color: "#EC4899",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",        route: "/business-beauty" },
      { key: "bookings", labelAr: "الحجوزات",  icon: "calendar",    route: "/business-beauty/bookings" },
      { key: "services", labelAr: "الخدمات",   icon: "scissors",    route: "/business-beauty/services" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business-beauty/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business-beauty/more" },
    ],
  },
  {
    prefix: "/business-cupping",
    color: "#D97706",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",        route: "/business-cupping" },
      { key: "sessions", labelAr: "الجلسات",   icon: "activity",    route: "/business-cupping/sessions" },
      { key: "bookings", labelAr: "الحجوزات",  icon: "calendar",    route: "/business-cupping/bookings" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business-cupping/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business-cupping/more" },
    ],
  },
  {
    prefix: "/business-lab",
    color: "#4F46E5",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",        route: "/business-lab" },
      { key: "bookings", labelAr: "الحجوزات",  icon: "calendar",    route: "/business-lab/bookings" },
      { key: "catalog",  labelAr: "التحاليل",  icon: "list",        route: "/business-lab/catalog" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business-lab/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business-lab/more" },
    ],
  },
  {
    prefix: "/business",
    color: "#3B82F6",
    tabs: [
      { key: "index",    labelAr: "الرئيسية",  icon: "home",       route: "/business" },
      { key: "products", labelAr: "المنتجات",  icon: "package",    route: "/business/products" },
      { key: "orders",   labelAr: "الطلبات",   icon: "shopping-bag", route: "/business/orders" },
      { key: "payments", labelAr: "المدفوعات", icon: "credit-card", route: "/business/payments" },
      { key: "more",     labelAr: "المزيد",    icon: "menu",        route: "/business/more" },
    ],
  },
];

// Routes where even the business tab bar should be hidden
const BUSINESS_HIDE_ROUTES = [
  "/business-auth",
  "/business-clinic/add-service",
  "/business-clinic/add-offer",
  "/business-rehab/add-service",
  "/business-rehab/add-offer",
  "/business-spa/add-service",
  "/business-spa/add-offer",
  "/business-beauty/add-service",
  "/business-beauty/add-offer",
  "/business-cupping/add-session",
  "/business-cupping/add-offer",
  "/business-lab/add-test",
  "/business-lab/add-offer",
  "/business/add-product",
  "/business/add-offer",
];

function getActiveKey(pathname: string, tabs: Tab[]): string {
  // Exact match for index
  for (const tab of tabs) {
    if (tab.route === pathname) return tab.key;
  }
  // Prefix match for nested routes
  for (const tab of tabs) {
    if (tab.key !== "index" && pathname.startsWith(tab.route)) return tab.key;
  }
  return "index";
}

export default function BusinessTabBar() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const scaleAnims = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;

  // Hide on non-business routes or specific add/edit screens
  const config = BUSINESS_CONFIGS.find((c) => pathname.startsWith(c.prefix));
  if (!config) return null;
  if (BUSINESS_HIDE_ROUTES.some((r) => pathname.startsWith(r))) return null;

  // Unified primary color matching the main app
  const color = colors.primary;
  const { tabs } = config;
  const activeKey = getActiveKey(pathname, tabs);
  const TAB_COUNT = tabs.length;

  const handlePress = (tab: Tab, index: number) => {
    Animated.sequence([
      Animated.spring(scaleAnims[index], { toValue: 0.8, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(scaleAnims[index], { toValue: 1,   useNativeDriver: true, tension: 200, friction: 8 }),
    ]).start();
    router.navigate(tab.route as any);
  };

  const tabBarHeight = isWeb ? 72 : 60 + insets.bottom;

  return (
    <View
      style={[styles.tabBar, { height: tabBarHeight, paddingBottom: isWeb ? 10 : insets.bottom }]}
      pointerEvents="box-none"
    >
      {/* Background */}
      {isIOS ? (
        <BlurView intensity={90} tint={isDark ? "dark" : "extraLight"} style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? "rgba(10,20,30,0.97)" : "rgba(255,255,255,0.97)" },
          ]}
        />
      )}

      {/* Top accent line */}
      <View style={[styles.topLine, { backgroundColor: color + "50" }]} />

      {/* Tabs */}
      {tabs.map((tab, index) => {
        const isActive = activeKey === tab.key;
        const tabColor = isActive ? color : isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.30)";

        return (
          <Pressable
            key={tab.key}
            style={[styles.tabItem, { width: SCREEN_WIDTH / TAB_COUNT }]}
            onPress={() => handlePress(tab, index)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Animated.View
              style={[
                styles.iconWrap,
                {
                  transform: [{ scale: scaleAnims[index] }],
                  backgroundColor: isActive ? color + "18" : "transparent",
                  borderColor: isActive ? color + "40" : "transparent",
                },
              ]}
            >
              <Feather name={tab.icon} size={20} color={tabColor} />
              {isActive && (
                <View style={[styles.activeDot, { backgroundColor: color }]} />
              )}
            </Animated.View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: tabColor,
                  fontFamily: isActive ? "Tajawal_700Bold" : "Tajawal_500Medium",
                },
              ]}
              numberOfLines={1}
            >
              {tab.labelAr}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 6,
    zIndex: 100,
    elevation: 16,
  },
  topLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    gap: 2,
  },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
