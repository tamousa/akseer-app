import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#6366F1";

export default function SpaMore() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const ITEMS = [
    { labelAr: "المعالجون", labelEn: "Therapists", icon: "users" as const, route: "/business-spa/staff", color: BRAND },
    { labelAr: "العروض والباقات", labelEn: "Offers & Packages", icon: "tag" as const, route: "/business-spa/offers", color: BRAND },
    { labelAr: "الغرف", labelEn: "Rooms", icon: "home" as const, route: "/business-spa/rooms", color: "#4F46E5" },
    { labelAr: "جدول الغرف", labelEn: "Room Schedule", icon: "grid" as const, route: "/business-spa/rooms", color: "#7C3AED" },
    { labelAr: "معاينة الصفحة", labelEn: "Page Preview", icon: "eye" as const, route: "/business-spa/spa-preview", color: "#4F46E5" },
    { labelAr: "التقارير", labelEn: "Reports", icon: "bar-chart-2" as const, route: null, color: "#059669" },
    { labelAr: "إعدادات الحساب", labelEn: "Account Settings", icon: "settings" as const, route: null, color: "#9CA3AF" },
    { labelAr: "الدعم", labelEn: "Support", icon: "help-circle" as const, route: null, color: "#F59E0B" },
  ];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#0A0A2A" : "#EEF2FF" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("المزيد","More")}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 10 }}>
        {ITEMS.map((item, i) => (
          <Pressable key={i} style={[s.item, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "25" }]}
            onPress={() => item.route ? router.push(item.route as any) : Alert.alert(lang === "ar" ? item.labelAr : item.labelEn, t("هذا القسم قيد التطوير","This section is under development"))}>
            <View style={[s.itemIcon, { backgroundColor: item.color + "20" }]}>
              <Feather name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={[s.itemLabel, { color: colors.text }]}>{lang === "ar" ? item.labelAr : item.labelEn}</Text>
            <Feather name="chevron-left" size={18} color={colors.muted} />
          </Pressable>
        ))}
        <Pressable style={[s.logoutBtn, { borderColor: "#EF4444" }]}
          onPress={() => Alert.alert(t("تسجيل الخروج","Sign Out"), t("هل أنت متأكد؟","Are you sure?"), [
            { text: t("إلغاء","Cancel") },
            { text: t("خروج","Sign Out"), style: "destructive", onPress: () => router.replace("/business-auth" as any) }
          ])}>
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={s.logoutText}>{t("تسجيل الخروج","Sign Out")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, alignItems: "flex-end" },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  item: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  itemIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  itemLabel: { flex: 1, fontSize: 15, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  logoutBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 8 },
  logoutText: { fontSize: 15, fontFamily: "Tajawal_700Bold", color: "#EF4444", textAlign: "right" },
});
