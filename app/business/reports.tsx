import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const WEEKLY_DATA = [
  { dayAr: "الأحد",     dayEn: "Sun", revenue: 420,  orders: 4  },
  { dayAr: "الاثنين",   dayEn: "Mon", revenue: 890,  orders: 8  },
  { dayAr: "الثلاثاء",  dayEn: "Tue", revenue: 650,  orders: 6  },
  { dayAr: "الأربعاء",  dayEn: "Wed", revenue: 1200, orders: 11 },
  { dayAr: "الخميس",   dayEn: "Thu", revenue: 980,  orders: 9  },
  { dayAr: "الجمعة",   dayEn: "Fri", revenue: 320,  orders: 3  },
  { dayAr: "السبت",    dayEn: "Sat", revenue: 1450, orders: 13 },
];

const TOP_PRODUCTS = [
  { nameAr: "باقة التجميل الشهرية", nameEn: "Monthly Beauty Package", revenue: "3,250 SAR", orders: 5,  percent: 85 },
  { nameAr: "بروتين واي 2kg",       nameEn: "Whey Protein 2kg",       revenue: "1,494 SAR", orders: 6,  percent: 60 },
  { nameAr: "فيتامين C 1000mg",     nameEn: "Vitamin C 1000mg",       revenue: "890 SAR",   orders: 10, percent: 45 },
  { nameAr: "زيت أرجان طبيعي",      nameEn: "Natural Argan Oil",      revenue: "645 SAR",   orders: 5,  percent: 30 },
];

export default function ReportsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [periodKey, setPeriodKey] = useState("week");
  const { t, lang } = useLanguage();

  const PERIODS = [
    { key: "today",  label: t("اليوم",       "Today")     },
    { key: "week",   label: t("هذا الأسبوع", "This Week") },
    { key: "month",  label: t("هذا الشهر",   "This Month")},
    { key: "year",   label: t("هذا العام",    "This Year") },
  ];

  const PAY_METHODS = [
    { methodAr: "بطاقة بنكية", methodEn: "Bank Card",  percent: 45, color: "#7C3AED" },
    { methodAr: "مدى",         methodEn: "Mada",        percent: 30, color: "#2563EB" },
    { methodAr: "أبل باي",     methodEn: "Apple Pay",   percent: 15, color: "#059669" },
    { methodAr: "نقداً",       methodEn: "Cash",        percent: 10, color: "#D97706" },
  ];

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";
  const maxRevenue = Math.max(...WEEKLY_DATA.map((d) => d.revenue));
  const totalRevenue = WEEKLY_DATA.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = WEEKLY_DATA.reduce((a, d) => a + d.orders, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("التقارير المالية","Financial Reports")}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable key={p.key} style={[styles.periodChip, { borderColor: periodKey === p.key ? "#7C3AED" : cardBorder, backgroundColor: periodKey === p.key ? "#7C3AED" : cardBg }]}
            onPress={() => setPeriodKey(p.key)}>
            <Text style={[styles.periodText, { color: periodKey === p.key ? "#fff" : colors.muted }]}>{p.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.kpiRow}>
        {[
          { label: t("الإيرادات","Revenue"),      value: `${totalRevenue.toLocaleString()} SAR`, icon: "trending-up"   as const, color: "#7C3AED", change: "+18%" },
          { label: t("الطلبات","Orders"),          value: totalOrders.toString(),                  icon: "shopping-cart" as const, color: "#059669", change: "+5"   },
          { label: t("متوسط الطلب","Avg. Order"), value: `${Math.round(totalRevenue / totalOrders)} SAR`, icon: "bar-chart" as const, color: "#2563EB", change: "+12%" },
        ].map((k, i) => (
          <View key={i} style={[styles.kpiCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.kpiIcon, { backgroundColor: k.color + "20" }]}>
              <Feather name={k.icon} size={16} color={k.color} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{k.value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.muted }]}>{k.label}</Text>
            <Text style={[styles.kpiChange, { color: k.color }]}>{k.change}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{t("الإيرادات اليومية","Daily Revenue")}</Text>
        <View style={styles.chartBars}>
          {WEEKLY_DATA.map((d) => (
            <View key={d.dayEn} style={styles.barGroup}>
              <Text style={[styles.barValue, { color: "#7C3AED" }]}>
                {d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
              </Text>
              <View style={styles.barWrapper}>
                <View style={[styles.bar, { height: Math.max(8, (d.revenue / maxRevenue) * 100), backgroundColor: "#7C3AED" }]} />
              </View>
              <Text style={[styles.barLabel, { color: colors.muted }]}>{lang === "ar" ? d.dayAr.slice(0, 3) : d.dayEn}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{t("أفضل المنتجات مبيعاً","Top Selling Products")}</Text>
        <View style={{ gap: 14 }}>
          {TOP_PRODUCTS.map((p, i) => (
            <View key={i} style={styles.productRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.productTopRow}>
                  <Text style={[styles.productRevenue, { color: "#7C3AED" }]}>{p.revenue}</Text>
                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
                  <View style={[styles.progressFill, { width: `${p.percent}%` as any, backgroundColor: "#7C3AED" }]} />
                </View>
              </View>
              <View style={[styles.rankBadge, { backgroundColor: i === 0 ? "#FEF3C7" : isDark ? "#2A1F45" : "#F3F0FF" }]}>
                <Text style={[styles.rankText, { color: i === 0 ? "#D97706" : colors.muted }]}>#{i + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{t("توزيع طرق الدفع","Payment Method Distribution")}</Text>
        <View style={{ gap: 10 }}>
          {PAY_METHODS.map((m, i) => (
            <View key={i} style={styles.payRow}>
              <Text style={[styles.payPercent, { color: m.color }]}>{m.percent}%</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
                  <View style={[styles.progressFill, { width: `${m.percent}%` as any, backgroundColor: m.color }]} />
                </View>
              </View>
              <Text style={[styles.payMethod, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{lang === "ar" ? m.methodAr : m.methodEn}</Text>
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
  kpiValue: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  kpiLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  kpiChange: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  chartCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 14 },
  chartTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 16 },
  chartBars: { flexDirection: "row-reverse", alignItems: "flex-end", justifyContent: "space-between", height: 130 },
  barGroup: { flex: 1, alignItems: "center", gap: 4 },
  barWrapper: { width: "60%", alignItems: "center", justifyContent: "flex-end", height: 100 },
  bar: { width: "100%", borderRadius: 6 },
  barValue: { fontSize: 9, fontFamily: "Tajawal_700Bold" },
  barLabel: { fontSize: 9, fontFamily: "Tajawal_400Regular" },
  productRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  rankBadge: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  productTopRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 6 },
  productName: { fontSize: 13, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  productRevenue: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  payRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  payMethod: { fontSize: 12, fontFamily: "Tajawal_500Medium", width: 80, textAlign: "right" },
  payPercent: { fontSize: 12, fontFamily: "Cairo_700Bold", width: 36, textAlign: "right" },
});
