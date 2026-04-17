import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function ClinicReports() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [period, setPeriod] = useState("week");

  const PERIODS = [
    { key: "today", ar: "اليوم", en: "Today" },
    { key: "week", ar: "هذا الأسبوع", en: "This Week" },
    { key: "month", ar: "هذا الشهر", en: "This Month" },
    { key: "year", ar: "هذا العام", en: "This Year" },
  ];

  const WEEKLY = [
    { dayAr: "الأحد", dayEn: "Sun", revenue: 840, visits: 4 },
    { dayAr: "الاثنين", dayEn: "Mon", revenue: 1680, visits: 7 },
    { dayAr: "الثلاثاء", dayEn: "Tue", revenue: 1260, visits: 5 },
    { dayAr: "الأربعاء", dayEn: "Wed", revenue: 2240, visits: 8 },
    { dayAr: "الخميس", dayEn: "Thu", revenue: 1960, visits: 7 },
    { dayAr: "الجمعة", dayEn: "Fri", revenue: 420, visits: 2 },
    { dayAr: "السبت", dayEn: "Sat", revenue: 2800, visits: 12 },
  ];

  const TOP_SERVICES = [
    { nameAr: "استشارة طبية عامة", nameEn: "General Medical Consultation", revenue: "5,250 SAR", visits: 15, percent: 90 },
    { nameAr: "جلسة علاج نفسي", nameEn: "Psychological Therapy Session", revenue: "3,640 SAR", visits: 13, percent: 70 },
    { nameAr: "تقييم تغذوي", nameEn: "Nutritional Assessment", revenue: "2,200 SAR", visits: 10, percent: 55 },
    { nameAr: "زيارة منزلية", nameEn: "Home Visit", revenue: "1,600 SAR", visits: 5, percent: 35 },
  ];

  const TOP_DOCTORS = [
    { nameAr: "د. سارة الدوسري", nameEn: "Dr. Sarah Al-Dossari", specialtyAr: "طب عام", specialtyEn: "General Med", revenue: "6,650 SAR", visits: 19, emoji: "👩‍⚕️" },
    { nameAr: "د. خالد العمري", nameEn: "Dr. Khalid Al-Omari", specialtyAr: "نفسية", specialtyEn: "Psychology", revenue: "4,480 SAR", visits: 16, emoji: "👨‍⚕️" },
    { nameAr: "أخ. ريم الحربي", nameEn: "Nurse Reem Al-Harbi", specialtyAr: "تغذية", specialtyEn: "Nutrition", revenue: "2,200 SAR", visits: 10, emoji: "👩‍⚕️" },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";
  const maxRev = Math.max(...WEEKLY.map((d) => d.revenue));
  const totalRev = WEEKLY.reduce((a, d) => a + d.revenue, 0);
  const totalVisits = WEEKLY.reduce((a, d) => a + d.visits, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("التقارير المالية","Financial Reports")}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable key={p.key} style={[styles.periodChip, { borderColor: period === p.key ? C : cardBorder, backgroundColor: period === p.key ? C : cardBg }]}
            onPress={() => setPeriod(p.key)}>
            <Text style={[styles.periodText, { color: period === p.key ? "#fff" : colors.muted }]}>{lang === "ar" ? p.ar : p.en}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.kpiRow}>
        {[
          { labelAr: "الإيرادات", labelEn: "Revenue", value: `${totalRev.toLocaleString()} SAR`, icon: "trending-up" as const, color: C, change: "+15%" },
          { labelAr: "الزيارات", labelEn: "Visits", value: totalVisits, icon: "calendar" as const, color: "#059669", change: "+4" },
          { labelAr: "متوسط الجلسة", labelEn: "Avg Session", value: `${Math.round(totalRev / totalVisits)} SAR`, icon: "activity" as const, color: "#7C3AED", change: "+11%" },
        ].map((k, i) => (
          <View key={i} style={[styles.kpiCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.kpiIcon, { backgroundColor: k.color + "20" }]}>
              <Feather name={k.icon} size={16} color={k.color} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? "#fff" : "#0A2330" }]}>{k.value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.muted }]}>{lang === "ar" ? k.labelAr : k.labelEn}</Text>
            <Text style={[styles.kpiChange, { color: k.color }]}>{k.change}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("إيرادات الزيارات الأسبوعية","Weekly Visit Revenue")}</Text>
        <View style={styles.chartBars}>
          {WEEKLY.map((d) => (
            <View key={d.dayAr} style={styles.barGroup}>
              <Text style={[styles.barValue, { color: C }]}>{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}</Text>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: Math.max(8, (d.revenue / maxRev) * 100), backgroundColor: C }]} />
              </View>
              <Text style={[styles.barLabel, { color: colors.muted }]}>{lang === "ar" ? d.dayAr.slice(0, 3) : d.dayEn}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("أفضل الخدمات مبيعاً","Top Services")}</Text>
        <View style={{ gap: 14 }}>
          {TOP_SERVICES.map((s, i) => (
            <View key={i} style={styles.svcRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.svcTopRow}>
                  <Text style={[styles.svcRevenue, { color: C }]}>{s.revenue}</Text>
                  <Text style={[styles.svcName, { color: isDark ? "#fff" : "#0A2330" }]} numberOfLines={1}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                  <View style={[styles.progressFill, { width: `${s.percent}%` as any, backgroundColor: C }]} />
                </View>
              </View>
              <View style={[styles.rankBadge, { backgroundColor: i === 0 ? "#FEF3C7" : isDark ? "#1A3A52" : "#E0F7FA" }]}>
                <Text style={[styles.rankText, { color: i === 0 ? "#D97706" : colors.muted }]}>#{i + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("أداء الكادر الطبي","Medical Staff Performance")}</Text>
        <View style={{ gap: 12 }}>
          {TOP_DOCTORS.map((d, i) => (
            <View key={i} style={styles.drRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.drTopRow}>
                  <Text style={[styles.drRevenue, { color: C }]}>{d.revenue}</Text>
                  <Text style={[styles.drName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? d.nameAr : d.nameEn}</Text>
                </View>
                <Text style={[styles.drSpecialty, { color: colors.muted }]}>{lang === "ar" ? d.specialtyAr : d.specialtyEn}  ·  {d.visits} {t("زيارة","visits")}</Text>
              </View>
              <View style={[styles.drAvatar, { backgroundColor: C + "20" }]}>
                <Text style={{ fontSize: 22 }}>{d.emoji}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  periodRow: { paddingHorizontal: 16, gap: 8, marginBottom: 16, flexDirection: "row-reverse" },
  periodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  periodText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  kpiRow: { flexDirection: "row-reverse", paddingHorizontal: 14, gap: 10, marginBottom: 14 },
  kpiCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center", gap: 4, borderWidth: 1 },
  kpiIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  kpiValue: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  kpiLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  kpiChange: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  chartCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 14 },
  chartTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 16 },
  chartBars: { flexDirection: "row-reverse", alignItems: "flex-end", justifyContent: "space-between", height: 130 },
  barGroup: { flex: 1, alignItems: "center", gap: 4 },
  barWrapper: { width: "60%", alignItems: "center", justifyContent: "flex-end", height: 100 },
  bar: { width: "100%", borderRadius: 6 },
  barValue: { fontSize: 8, fontFamily: "Tajawal_700Bold" },
  barLabel: { fontSize: 8, fontFamily: "Tajawal_400Regular" },
  svcRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  rankBadge: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  svcTopRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 6 },
  svcName: { fontSize: 12, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  svcRevenue: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  drRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  drAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  drTopRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 2 },
  drName: { fontSize: 13, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },
  drRevenue: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  drSpecialty: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
});
