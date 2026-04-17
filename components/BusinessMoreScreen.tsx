import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useBusiness } from "@/context/BusinessContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export type MenuSection = {
  titleAr: string;
  items: {
    labelAr: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    route?: string | null;
  }[];
};

type Props = {
  businessNameAr: string;
  businessTypeAr: string;
  businessEmoji: string;
  stats: { labelAr: string; value: string }[];
  sections: MenuSection[];
};

export default function BusinessMoreScreen({ businessNameAr, businessTypeAr, businessEmoji, stats, sections }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();
  const { logout } = useBusiness();

  const C = colors.primary;
  const cardBg = isDark ? colors.surface : "#FFFFFF";
  const cardBorder = isDark ? colors.cardBorder : colors.border;

  const handleLogout = () => {
    Alert.alert(
      t("تسجيل الخروج", "Sign Out"),
      t("هل أنت متأكد أنك تريد الخروج من لوحة التحكم؟", "Are you sure you want to sign out of the dashboard?"),
      [
        { text: t("إلغاء", "Cancel"), style: "cancel" },
        {
          text: t("خروج", "Sign Out"),
          style: "destructive",
          onPress: () => {
            logout().finally(() => {
              router.replace("/business-auth" as any);
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.profileCard, { backgroundColor: C, paddingTop: topPadding + 12 }]}>
        <View style={styles.profileRow}>
          <View>
            <View style={[styles.verifiedBadge, { backgroundColor: "#ffffff25" }]}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>{t("حساب مُعتمد", "Verified Account")}</Text>
            </View>
            <Text style={styles.profileName}>{businessNameAr}</Text>
            <Text style={styles.profileType}>{businessTypeAr}</Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: "#ffffff20" }]}>
            <Text style={{ fontSize: 32 }}>{businessEmoji}</Text>
          </View>
        </View>
        {stats.length > 0 && (
          <View style={[styles.statsRow, { borderTopColor: "#ffffff20" }]}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.labelAr}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Menu Sections */}
      {sections.map((section, si) => (
        <View key={si} style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.titleAr}</Text>
          <View style={[styles.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {section.items.map((item, ii) => (
              <Pressable
                key={ii}
                style={[styles.menuItem, ii < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: cardBorder }]}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  } else {
                    Alert.alert(item.labelAr, t("هذا القسم قيد التطوير", "This section is under development"));
                  }
                }}
              >
                <Feather name="chevron-left" size={16} color={colors.muted} />
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.labelAr}</Text>
                <View style={[styles.menuItemIcon, { backgroundColor: C + "15" }]}>
                  <Feather name={item.icon} size={17} color={C} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Settings quick access */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t("الحساب والإعدادات", "Account & Settings")}</Text>
        <View style={[styles.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {[
            { labelAr: "ملف المنشأة والبيانات",     icon: "edit-2" as const },
            { labelAr: "إعدادات الإشعارات",          icon: "bell"  as const },
            { labelAr: "الأمان وكلمة المرور",        icon: "lock"  as const },
            { labelAr: "إدارة الاشتراك والباقة",     icon: "star"  as const },
            { labelAr: "الدعم والمساعدة",            icon: "help-circle" as const },
            { labelAr: "سياسة الخصوصية والشروط",    icon: "shield" as const },
          ].map((item, ii, arr) => (
            <Pressable
              key={ii}
              style={[styles.menuItem, ii < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: cardBorder }]}
              onPress={() => Alert.alert(item.labelAr, t("هذا القسم قيد التطوير", "This section is under development"))}
            >
              <Feather name="chevron-left" size={16} color={colors.muted} />
              <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.labelAr}</Text>
              <View style={[styles.menuItemIcon, { backgroundColor: C + "15" }]}>
                <Feather name={item.icon} size={17} color={C} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <Pressable style={[styles.logoutBtn, { backgroundColor: isDark ? "#2A0A0A" : "#FFF5F5", borderColor: "#EF4444" }]} onPress={handleLogout}>
          <Feather name="log-out" size={19} color="#EF4444" />
          <Text style={styles.logoutText}>{t("تسجيل الخروج", "Sign Out")}</Text>
        </Pressable>
      </View>

      {/* Version */}
      <Text style={[styles.version, { color: colors.muted }]}>أكسير أعمال  v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: { paddingHorizontal: 20, paddingBottom: 0 },
  profileRow: { flexDirection: "row-reverse", alignItems: "flex-start", justifyContent: "space-between", paddingBottom: 20 },
  verifiedBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginBottom: 8 },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ADE80" },
  verifiedText: { fontSize: 11, color: "#fff", fontFamily: "Tajawal_500Medium" },
  profileName: { fontSize: 20, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  profileType: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  avatarCircle: { width: 64, height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row-reverse", borderTopWidth: 1, paddingTop: 16, paddingBottom: 20, gap: 0 },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontFamily: "Cairo_700Bold", color: "#fff" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Tajawal_400Regular", marginTop: 2 },
  sectionTitle: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 8, marginRight: 4, letterSpacing: 0.3 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  menuItemIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuItemLabel: { flex: 1, fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  logoutBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, borderWidth: 1.5, paddingVertical: 16 },
  logoutText: { fontSize: 15, fontFamily: "Tajawal_700Bold", color: "#EF4444" },
  version: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center", marginTop: 24, marginBottom: 8 },
});
