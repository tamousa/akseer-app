import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const PERIODS_AR = ["هذا الشهر", "الشهر الماضي", "هذا العام"];
const PERIODS_EN = ["This Month", "Last Month", "This Year"];

const POPULAR_TESTS = [
  { nameAr: "صورة دم كاملة CBC", nameEn: "CBC", count: 124, revenue: 4960, pct: 85 },
  { nameAr: "سكر تراكمي HbA1c", nameEn: "HbA1c", count: 98, revenue: 5880, pct: 67 },
  { nameAr: "هرمونات الغدة الدرقية", nameEn: "Thyroid Hormones", count: 76, revenue: 9120, pct: 52 },
  { nameAr: "باقة الفحص الشامل", nameEn: "Full Checkup Package", count: 54, revenue: 13446, pct: 37 },
  { nameAr: "وظائف الكبد والكلى", nameEn: "Liver & Kidney", count: 48, revenue: 7680, pct: 33 },
];

const MONTHLY_DATA = [
  { monthAr: "أكتوبر", monthEn: "Oct", value: 12400 },
  { monthAr: "نوفمبر", monthEn: "Nov", value: 15800 },
  { monthAr: "ديسمبر", monthEn: "Dec", value: 14200 },
  { monthAr: "يناير", monthEn: "Jan", value: 16900 },
  { monthAr: "فبراير", monthEn: "Feb", value: 15400 },
  { monthAr: "مارس", monthEn: "Mar", value: 18420 },
];

export default function LabReports() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [periodIdx, setPeriodIdx] = useState(0);

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const maxVal = Math.max(...MONTHLY_DATA.map((m) => m.value));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("التقارير المالية","Financial Reports")}</Text>
      </View>

      <View style={styles.periodRow}>
        {PERIODS_AR.map((p, i) => (
          <Pressable key={p} style={[styles.periodChip, { borderColor: periodIdx === i ? C : cardBorder, backgroundColor: periodIdx === i ? C : cardBg }]}
            onPress={() => setPeriodIdx(i)}>
            <Text style={[styles.periodText, { color: periodIdx === i ? "#fff" : colors.muted }]}>{lang === "ar" ? p : PERIODS_EN[i]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.statsGrid}>
        {[
          { labelAr: "إجمالي الإيرادات", labelEn: "Total Revenue", value: "18,420 SAR", changeAr: "+8.4%", changeEn: "+8.4%", color: "#059669", icon: "trending-up" as const },
          { labelAr: "عدد الحجوزات", labelEn: "Bookings", value: "98", changeAr: "+14 عن الشهر الماضي", changeEn: "+14 vs last month", color: C, icon: "calendar" as const },
          { labelAr: "متوسط قيمة الحجز", labelEn: "Avg. Booking Value", value: "188 SAR", changeAr: "+5.2%", changeEn: "+5.2%", color: "#7C3AED", icon: "activity" as const },
          { labelAr: "حجوزات منزلية", labelEn: "Home Bookings", value: "24", changeAr: "24.5%", changeEn: "24.5%", color: "#D97706", icon: "home" as const },
        ].map((stat, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <Feather name={stat.icon} size={16} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#0A1F35" }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{t(stat.labelAr, stat.labelEn)}</Text>
            <Text style={[styles.statChange, { color: stat.color }]}>{lang === "ar" ? stat.changeAr : stat.changeEn}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("الإيرادات الشهرية","Monthly Revenue")}</Text>
        <View style={styles.barChart}>
          {MONTHLY_DATA.map((m, i) => {
            const h = Math.round((m.value / maxVal) * 100);
            return (
              <View key={i} style={styles.barCol}>
                <Text style={[styles.barValue, { color: C }]}>{Math.round(m.value / 1000)}k</Text>
                <View style={[styles.barBg, { height: 100 }]}>
                  <View style={[styles.barFill, { height: h, backgroundColor: i === 5 ? C : C + "50" }]} />
                </View>
                <Text style={[styles.barLabel, { color: colors.muted }]}>{lang === "ar" ? m.monthAr.substring(0, 3) : m.monthEn}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.popularCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#0A1F35", marginBottom: 12 }]}>{t("أكثر التحاليل طلباً","Most Requested Tests")}</Text>
        {POPULAR_TESTS.map((tx, i) => (
          <View key={i} style={styles.testRow}>
            <Text style={[styles.testRevenue, { color: C }]}>{tx.revenue.toLocaleString()}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.testNameRow}>
                <Text style={[styles.testCount, { color: colors.muted }]}>{tx.count} {t("حجز","orders")}</Text>
                <Text style={[styles.testName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? tx.nameAr : tx.nameEn}</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                <View style={[styles.progressFill, { width: `${tx.pct}%` as any, backgroundColor: C }]} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  periodRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  periodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  periodText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 10, marginBottom: 16 },
  statCard: { width: "47%", borderRadius: 16, padding: 14, borderWidth: 1, gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  statChange: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  chartCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 14 },
  chartTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 16 },
  barChart: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end" },
  barCol: { alignItems: "center", gap: 4 },
  barValue: { fontSize: 9, fontFamily: "Cairo_700Bold" },
  barBg: { width: 26, justifyContent: "flex-end", backgroundColor: "transparent" },
  barFill: { width: 26, borderRadius: 6 },
  barLabel: { fontSize: 9, fontFamily: "Tajawal_400Regular" },
  popularCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 14 },
  testRow: { flexDirection: "row-reverse", gap: 10, alignItems: "center" },
  testNameRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  testName: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  testCount: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  testRevenue: { fontSize: 11, fontFamily: "Cairo_700Bold", width: 52, textAlign: "left" },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
});
