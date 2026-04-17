import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BusinessMore() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const MENU_ITEMS = [
    {
      group: t("حساب المتجر", "Store Account"),
      items: [
        { label: t("بيانات المتجر والملف التعريفي",    "Store Data & Profile"),           icon: "briefcase"   as const, color: "#7C3AED" },
        { label: t("الشعار والصور والهوية البصرية",     "Logo, Photos & Visual Identity"), icon: "image"       as const, color: "#EC4899" },
        { label: t("بيانات الاتصال والموقع",            "Contact Info & Location"),        icon: "map-pin"     as const, color: "#2563EB" },
        { label: t("الوثائق والتراخيص",                 "Documents & Licenses"),           icon: "file-text"   as const, color: "#D97706" },
      ],
    },
    {
      group: t("الإعدادات", "Settings"),
      items: [
        { label: t("الإشعارات والتنبيهات",              "Notifications & Alerts"),         icon: "bell"        as const, color: "#059669" },
        { label: t("الأمان وكلمة المرور",               "Security & Password"),            icon: "lock"        as const, color: "#DC2626" },
        { label: t("إدارة الاشتراك والباقة",            "Subscription Management"),        icon: "star"        as const, color: "#7C3AED" },
        { label: t("طرق الدفع والحساب البنكي",          "Payment Methods & Bank Account"), icon: "credit-card" as const, color: "#059669" },
      ],
    },
    {
      group: t("الدعم", "Support"),
      items: [
        { label: t("مركز المساعدة والأسئلة الشائعة",   "Help Center & FAQ"),              icon: "help-circle"    as const, color: "#6B7280" },
        { label: t("تواصل مع الدعم الفني",             "Contact Technical Support"),       icon: "message-circle" as const, color: "#2563EB" },
        { label: t("سياسة الخصوصية والشروط",           "Privacy Policy & Terms"),          icon: "shield"         as const, color: "#6B7280" },
      ],
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("المزيد", "More")}</Text>
      </View>

      <View style={[styles.storeProfile, { backgroundColor: "#6D28D9" }]}>
        <View style={styles.storeProfileInner}>
          <View style={{ flex: 1 }}>
            <View style={[styles.statusBadge, { backgroundColor: "#ffffff25" }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{t("حساب مُعتمد", "Verified Account")}</Text>
            </View>
            <Text style={styles.storeNameText}>{t("متجر الصحة النقية", "Pure Health Store")}</Text>
            <Text style={styles.storeTypeText}>{t("متجر  ·  الرياض", "Store  ·  Riyadh")}</Text>
            <Text style={styles.storeEmailText}>store@health.sa</Text>
          </View>
          <View style={[styles.storeAvatarLarge, { backgroundColor: "#ffffff20" }]}>
            <Feather name="briefcase" size={30} color="#fff" />
          </View>
        </View>
        <View style={styles.profileStats}>
          {[
            { label: t("المنتجات", "Products"), value: "24"   },
            { label: t("الطلبات",  "Orders"),   value: "148"  },
            { label: t("العملاء",  "Customers"),value: "128"  },
            { label: t("التقييم", "Rating"),    value: "4.8★" },
          ].map((s, i) => (
            <View key={i} style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{s.value}</Text>
              <Text style={styles.profileStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.planCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
        <View style={styles.planInner}>
          <Pressable
            style={[styles.upgradeBtn, { backgroundColor: "#7C3AED" }]}
            onPress={() => Alert.alert(t("ترقية الباقة", "Upgrade Plan"), t("سيتم عرض باقات أكسير أعمال المتاحة", "Available Akseer Business plans will be displayed"))}
          >
            <Text style={styles.upgradeBtnText}>{t("ترقية الباقة", "Upgrade Plan")}</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.planName, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("الباقة الأساسية", "Basic Plan")}</Text>
            <Text style={[styles.planExpiry, { color: colors.muted }]}>{t("تنتهي في 15 مايو 2026", "Expires May 15, 2026")}</Text>
          </View>
          <View style={[styles.planIcon, { backgroundColor: "#7C3AED20" }]}>
            <Feather name="star" size={20} color="#7C3AED" />
          </View>
        </View>
      </View>

      {MENU_ITEMS.map((group, gi) => (
        <View key={gi} style={{ marginBottom: 8 }}>
          <Text style={[styles.groupTitle, { color: colors.muted }]}>{group.group}</Text>
          <View style={[styles.menuGroup, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
            {group.items.map((item, ii) => (
              <Pressable
                key={ii}
                style={[styles.menuItem, ii < group.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? "#2A1F45" : "#F3F0FF" }]}
                onPress={() => Alert.alert(item.label, t("هذا القسم قيد التطوير وسيكون متاحاً قريباً", "This section is under development and will be available soon"))}
              >
                <Feather name="chevron-left" size={16} color={colors.muted} />
                <Text style={[styles.menuLabel, { color: isDark ? "#E2D9F3" : "#2D1B5E" }]}>{item.label}</Text>
                <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                  <Feather name={item.icon} size={16} color={item.color} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Pressable
        style={[styles.logoutBtn, { borderColor: "#EF444450", backgroundColor: isDark ? "#2D0F0F" : "#FEF2F2" }]}
        onPress={() =>
          Alert.alert(
            t("تسجيل الخروج", "Sign Out"),
            t("هل تريد تسجيل الخروج من أكسير أعمال؟", "Do you want to sign out of Akseer Business?"),
            [
              { text: t("إلغاء", "Cancel"), style: "cancel" },
              { text: t("تسجيل الخروج", "Sign Out"), style: "destructive", onPress: () => router.replace("/business-auth") },
            ]
          )
        }
      >
        <Text style={styles.logoutText}>{t("تسجيل الخروج", "Sign Out")}</Text>
        <Feather name="log-out" size={18} color="#EF4444" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 20, marginBottom: 16 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  storeProfile: { marginHorizontal: 20, borderRadius: 22, padding: 20, marginBottom: 16 },
  storeProfileInner: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 14, marginBottom: 18 },
  storeAvatarLarge: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statusBadge: { flexDirection: "row-reverse", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignItems: "center", marginBottom: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#86EFAC" },
  statusText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#D4FAE6" },
  storeNameText: { fontSize: 20, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 2 },
  storeTypeText: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#C4B5FD", marginBottom: 2 },
  storeEmailText: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A78BFA" },
  profileStats: { flexDirection: "row-reverse", borderTopWidth: 1, borderTopColor: "#ffffff20", paddingTop: 14 },
  profileStat: { flex: 1, alignItems: "center" },
  profileStatValue: { fontSize: 16, fontFamily: "Cairo_700Bold", color: "#fff" },
  profileStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#C4B5FD" },
  planCard: { marginHorizontal: 20, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 20 },
  planInner: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  planIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  planName: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  planExpiry: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  upgradeBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  upgradeBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  groupTitle: { fontSize: 12, fontFamily: "Tajawal_500Medium", paddingHorizontal: 20, marginBottom: 8, marginTop: 4 },
  menuGroup: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, overflow: "hidden", marginBottom: 8 },
  menuItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  logoutBtn: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 20, marginTop: 12, paddingVertical: 16, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  logoutText: { fontSize: 15, fontFamily: "Tajawal_700Bold", color: "#EF4444" },
});
