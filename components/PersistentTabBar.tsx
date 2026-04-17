import { BlurView } from "expo-blur";
import { router, usePathname, useSegments } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
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
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const HIDDEN_ROUTES = ["/auth", "/onboarding", "/business-auth"];
const HIDDEN_PREFIXES = [
  "/business",        // matches /business, /business/, /business-clinic, /business-rehab, etc.
  "/store-checkout",
  "/order/",
];

const TAB_COUNT = 5;

const TABS = [
  { key: "index",     label: "الرئيسية", featherName: "home" as const,         color: "#A86DBF", route: "/(tabs)/"          },
  { key: "store",     label: "الخدمات",  featherName: "shopping-bag" as const, color: "#3B82F6", route: "/(tabs)/store"     },
  { key: "health",    label: "صحتي",     featherName: "heart" as const,        color: "#EC4899", route: "/(tabs)/health"    },
  { key: "community", label: "المجتمع",  featherName: "users" as const,        color: "#F43F5E", route: "/(tabs)/community" },
  { key: "profile",   label: "حسابي",    featherName: "user" as const,         color: "#22C55E", route: "/(tabs)/profile"   },
];

function getActiveIndex(segments: string[]): number {
  if (segments[0] === "(tabs)") {
    const name = segments[1] || "index";
    const idx = TABS.findIndex((t) => t.key === name);
    return idx >= 0 ? idx : 0;
  }
  return -1;
}

export default function PersistentTabBar() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const activeIndex = getActiveIndex(segments as string[]);

  const pillX = useRef(new Animated.Value(activeIndex >= 0 ? activeIndex : 0)).current;
  const scaleAnims = useRef(TABS.map(() => new Animated.Value(1))).current;
  const glowAnims = useRef(TABS.map(() => new Animated.Value(0))).current;
  const healthPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (activeIndex >= 0) {
      Animated.spring(pillX, {
        toValue: activeIndex,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      glowAnims.forEach((a, i) => {
        Animated.timing(a, {
          toValue: i === activeIndex ? 1 : 0,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(healthPulse, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(healthPulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const shouldHide =
    HIDDEN_ROUTES.includes(pathname) ||
    HIDDEN_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/business-auth");

  if (shouldHide) return null;

  const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
  const PILL_WIDTH = 56;

  const pillTranslateX = pillX.interpolate({
    inputRange: TABS.map((_, i) => i),
    outputRange: TABS.map((_, i) => {
      const center = TAB_WIDTH * i + TAB_WIDTH / 2;
      return center - PILL_WIDTH / 2;
    }),
  });

  const pillColor = activeIndex >= 0 ? TABS[activeIndex].color : "#A86DBF";

  const handleTabPress = (tab: typeof TABS[0], index: number) => {
    Animated.sequence([
      Animated.spring(scaleAnims[index], { toValue: 0.82, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(scaleAnims[index], { toValue: 1.1,  useNativeDriver: true, tension: 200, friction: 8  }),
      Animated.spring(scaleAnims[index], { toValue: 1,    useNativeDriver: true, tension: 200, friction: 10 }),
    ]).start();

    router.navigate(tab.route as any);
  };

  const tabBarHeight = isWeb ? 72 : 60 + insets.bottom;

  return (
    <View
      style={[styles.tabBar, { height: tabBarHeight, paddingBottom: isWeb ? 10 : insets.bottom }]}
      pointerEvents="box-none"
    >
      {isIOS ? (
        <BlurView intensity={85} tint={isDark ? "dark" : "extraLight"} style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? "rgba(18,10,34,0.97)" : "rgba(255,255,255,0.97)" },
          ]}
        />
      )}

      <View style={[styles.topLine, { backgroundColor: isDark ? "rgba(168,109,191,0.25)" : "rgba(168,109,191,0.18)" }]} />

      {activeIndex >= 0 && TABS[activeIndex].key !== "health" && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: PILL_WIDTH,
              transform: [{ translateX: pillTranslateX }],
              backgroundColor: pillColor + "22",
              borderColor: pillColor + "55",
            },
          ]}
          pointerEvents="none"
        />
      )}

      {TABS.map((tab, index) => {
        const isActive = activeIndex === index;
        const isHealthTab = tab.key === "health";
        const tabColor = isActive ? tab.color : (isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.35)");

        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab, index)}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            {isHealthTab ? (
              <Animated.View style={[styles.healthBtn, { transform: [{ scale: scaleAnims[index] }] }]}>
                <LinearGradient
                  colors={isActive ? ["#EC4899", "#A86DBF"] : ["#EC489988", "#A86DBF88"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.healthGradient}
                >
                  <Animated.View style={{ transform: [{ scale: healthPulse }] }}>
                    <Feather name="heart" size={22} color="#FFF" />
                  </Animated.View>
                </LinearGradient>
                <View style={[styles.healthGlow, { opacity: isActive ? 1 : 0.4 }]} />
              </Animated.View>
            ) : (
              <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnims[index] }] }]}>
                {isActive && (
                  <Animated.View
                    style={[
                      styles.iconGlow,
                      { backgroundColor: tab.color + "28", opacity: glowAnims[index] },
                    ]}
                  />
                )}
                <Feather name={tab.featherName} size={21} color={tabColor} />
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: tab.color }]} />
                )}
              </Animated.View>
            )}

            <Text
              style={[
                styles.tabLabel,
                {
                  color: isHealthTab ? "#EC4899" : tabColor,
                  fontFamily: isActive || isHealthTab ? "Tajawal_700Bold" : "Tajawal_500Medium",
                  opacity: isActive || isHealthTab ? 1 : 0.7,
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
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
    left: 20,
    right: 20,
    height: 1,
  },
  pill: {
    position: "absolute",
    top: 5,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    gap: 2,
  },
  iconWrap: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconGlow: {
    position: "absolute",
    width: 38,
    height: 32,
    borderRadius: 12,
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
  healthBtn: {
    marginTop: -16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  healthGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  healthGlow: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(236,72,153,0.25)",
    transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }],
    zIndex: -1,
  },
});
