import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

type Props = {
  title?: string;
  showBack?: boolean;
  showNotif?: boolean;
  notifCount?: number;
};

export default function BusinessHeader({ title, showBack = false, showNotif = true, notifCount = 3 }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { businessName } = useBusiness();

  const C = colors.primary;
  const topPadding = isWeb ? 0 : insets.top;
  const displayTitle = title || businessName || "أكسير أعمال";

  return (
    <View style={[styles.container, {
      paddingTop: topPadding + 10,
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
    }]}>
      <View style={styles.row}>
        {/* Right side: back button OR title */}
        <View style={styles.rightSection}>
          {showBack ? (
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.back()}>
              <Feather name="chevron-right" size={20} color={colors.text} />
            </Pressable>
          ) : (
            <View style={{ flex: 1 }}>
              <Text style={[styles.businessName, { color: colors.text }]} numberOfLines={1}>{displayTitle}</Text>
            </View>
          )}
        </View>

        {/* Center: title (when back is shown) */}
        {showBack && title && (
          <Text style={[styles.pageTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        )}

        {/* Left side: theme toggle + notifications */}
        <View style={styles.leftSection}>
          {/* Theme toggle */}
          <Pressable
            style={[styles.iconBtn, { backgroundColor: isDark ? C + "20" : C + "12" }]}
            onPress={toggleTheme}
          >
            <Feather name={isDark ? "sun" : "moon"} size={18} color={C} />
          </Pressable>

          {/* Notification bell */}
          {showNotif && (
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Feather name="bell" size={18} color={colors.text} />
              {notifCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.rose }]}>
                  <Text style={styles.badgeText}>{notifCount > 9 ? "9+" : notifCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rightSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  leftSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  businessName: {
    fontSize: 17,
    fontFamily: "Cairo_700Bold",
    textAlign: "right",
  },
  pageTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    left: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "Tajawal_700Bold",
    color: "#fff",
  },
});
