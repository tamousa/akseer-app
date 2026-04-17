import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const C = "#0369A1";

export default function LabCatalog() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  const SECTIONS = [
    { key: "tests",       labelAr: "قائمة التحاليل",     labelEn: "Tests List",       icon: "list" as const,    color: C,         bg: "#DBEAFE", badgeAr: "10 تحليل",  badgeEn: "10 tests",  descAr: "إدارة كل التحاليل المتاحة مع التصنيف والسعر وتعليمات التحضير ووقت النتيجة", descEn: "Manage all available tests with categories, pricing, preparation instructions and result times", route: "/business-lab/tests" },
    { key: "packages",    labelAr: "باقات التحاليل",     labelEn: "Test Packages",    icon: "package" as const, color: "#7C3AED", bg: "#EDE9FE", badgeAr: "4 باقات",   badgeEn: "4 packages", descAr: "حزم تحاليل متعددة بسعر واحد مخفّض — مثالية للفحص السنوي والمتابعة المستمرة", descEn: "Multiple test bundles at a discounted price — ideal for annual checkups and continuous monitoring", route: "/business-lab/packages" },
    { key: "offers",      labelAr: "العروض والخصومات",  labelEn: "Offers & Discounts", icon: "tag" as const,   color: "#D97706", bg: "#FEF3C7", badgeAr: "2 نشط",     badgeEn: "2 active",   descAr: "خصومات موسمية وعروض ترويجية على التحاليل والباقات مع كود الخصم", descEn: "Seasonal discounts and promotions on tests and packages with discount codes", route: "/business-lab/offers" },
    { key: "home-visits", labelAr: "الخدمة المنزلية",   labelEn: "Home Visits",      icon: "home" as const,    color: "#059669", bg: "#D1FAE5", badgeAr: "6 اليوم",   badgeEn: "6 today",    descAr: "إرسال فني مختبر لأخذ العينة في منزل المريض — إدارة الطلبات ومناطق التغطية", descEn: "Send a lab technician to collect samples at the patient's home — manage requests and coverage zones", route: "/business-lab/home-visits" },
  ];

  const CATALOG_STATS = [
    { labelAr: "تحاليل نشطة", labelEn: "Active Tests",    value: 9, icon: "activity" as const, color: C },
    { labelAr: "باقات متاحة", labelEn: "Packages",         value: 3, icon: "package" as const,  color: "#7C3AED" },
    { labelAr: "عروض نشطة",   labelEn: "Active Offers",   value: 2, icon: "tag" as const,      color: "#D97706" },
    { labelAr: "تحاليل منزلية", labelEn: "Home Visits",   value: 9, icon: "home" as const,     color: "#059669" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("كتالوج المختبر","Lab Catalog")}</Text>
        <Pressable style={[styles.previewBtn, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE", borderColor: C + "40" }]}
          onPress={() => router.push("/business-lab/lab-preview" as any)}>
          <Feather name="eye" size={14} color={C} />
          <Text style={[styles.previewBtnText, { color: C }]}>{t("معاينة","Preview")}</Text>
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        {CATALOG_STATS.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
              <Feather name={s.icon} size={16} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#0A1F35" }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{t(s.labelAr, s.labelEn)}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {SECTIONS.map((s) => (
          <Pressable key={s.key} style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push(s.route as any)}>
            <View style={styles.inner}>
              <Feather name="chevron-left" size={18} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  {s.badgeAr && <View style={[styles.badge, { backgroundColor: isDark ? s.color + "25" : s.bg }]}><Text style={[styles.badgeText, { color: s.color }]}>{t(s.badgeAr, s.badgeEn)}</Text></View>}
                  <Text style={[styles.sLabel, { color: isDark ? "#fff" : "#0A1F35" }]}>{t(s.labelAr, s.labelEn)}</Text>
                </View>
                <Text style={[styles.sDesc, { color: colors.muted }]}>{t(s.descAr, s.descEn)}</Text>
              </View>
              <View style={[styles.sIcon, { backgroundColor: isDark ? s.color + "25" : s.bg }]}>
                <Feather name={s.icon} size={22} color={s.color} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  previewBtn: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  previewBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 10, marginBottom: 16 },
  statCard: { width: "47%", borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", flex: 1 },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  inner: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  topRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  sLabel: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
