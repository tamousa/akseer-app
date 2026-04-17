import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0369A1";

export default function BookingsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const FILTERS = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "today", ar: "اليوم", en: "Today" },
    { key: "confirmed", ar: "مؤكد", en: "Confirmed" },
    { key: "processing", ar: "جاري", en: "Processing" },
    { key: "waiting", ar: "انتظار", en: "Waiting" },
    { key: "completed", ar: "مكتمل", en: "Completed" },
    { key: "cancelled", ar: "ملغي", en: "Cancelled" },
  ];

  const BOOKINGS = [
    { id: "LAB-801", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", testsAr: "صورة دم كاملة + سكر صائم", testsEn: "CBC + Fasting Glucose", typeAr: "حضوري", typeEn: "In-Lab", dateAr: "اليوم", dateEn: "Today", time: "08:30", status: "completed", statusAr: "مكتمل", statusEn: "Completed", statusColor: C, statusBg: "#DBEAFE", fee: "65 SAR", resultReady: true, prepAr: "صيام 8 ساعات", prepEn: "8-hour fasting" },
    { id: "LAB-802", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", testsAr: "باقة الفحص الشامل", testsEn: "Comprehensive Panel", typeAr: "حضوري", typeEn: "In-Lab", dateAr: "اليوم", dateEn: "Today", time: "09:00", status: "processing", statusAr: "جاري", statusEn: "Processing", statusColor: "#059669", statusBg: "#D1FAE5", fee: "249 SAR", resultReady: false, prepAr: "صيام 10 ساعات", prepEn: "10-hour fasting" },
    { id: "LAB-803", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", testsAr: "هرمونات الغدة الدرقية TSH/T3/T4", testsEn: "Thyroid Hormones TSH/T3/T4", typeAr: "منزلي", typeEn: "Home Visit", dateAr: "اليوم", dateEn: "Today", time: "10:30", status: "confirmed", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#D97706", statusBg: "#FEF3C7", fee: "120 SAR", resultReady: false, prepAr: "قبل الدواء الصباحي", prepEn: "Before morning medication" },
    { id: "LAB-804", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", testsAr: "وظائف الكبد + وظائف الكلى", testsEn: "Liver & Kidney Function", typeAr: "حضوري", typeEn: "In-Lab", dateAr: "اليوم", dateEn: "Today", time: "11:00", status: "waiting", statusAr: "انتظار", statusEn: "Waiting", statusColor: "#6B7280", statusBg: "#F3F4F6", fee: "160 SAR", resultReady: false, prepAr: "صيام 10 ساعات", prepEn: "10-hour fasting" },
    { id: "LAB-800", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", testsAr: "باقة مرضى السكري", testsEn: "Diabetes Patient Package", typeAr: "منزلي", typeEn: "Home Visit", dateAr: "أمس", dateEn: "Yesterday", time: "09:30", status: "completed", statusAr: "مكتمل", statusEn: "Completed", statusColor: C, statusBg: "#DBEAFE", fee: "149 SAR", resultReady: true, prepAr: "صيام 8 ساعات", prepEn: "8-hour fasting" },
    { id: "LAB-799", patientAr: "سارة المطيري", patientEn: "Sara Al-Mutairi", testsAr: "فيتامين D + B12", testsEn: "Vitamin D + B12", typeAr: "حضوري", typeEn: "In-Lab", dateAr: "أمس", dateEn: "Yesterday", time: "10:00", status: "cancelled", statusAr: "ملغي", statusEn: "Cancelled", statusColor: "#DC2626", statusBg: "#FEE2E2", fee: "—", resultReady: false, prepAr: "لا يشترط صيام", prepEn: "No fasting required" },
  ];

  const filtered = filter === "all" ? BOOKINGS
    : filter === "today" ? BOOKINGS.filter((b) => b.dateAr === "اليوم")
    : BOOKINGS.filter((b) => b.status === filter);

  const todayCount = BOOKINGS.filter((b) => b.dateAr === "اليوم").length;
  const homeCount = BOOKINGS.filter((b) => b.typeAr === "منزلي" && b.dateAr === "اليوم").length;
  const pendingResults = BOOKINGS.filter((b) => b.status === "completed" && !b.resultReady).length;

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("إدارة الحجوزات","Manage Bookings")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("حجز جديد","New Booking"), t("سيتم فتح نموذج حجز جديد","New booking form will open"))}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {[
          { labelAr: "حجوزات اليوم", labelEn: "Today's Bookings", value: todayCount, color: C },
          { labelAr: "منزلي اليوم", labelEn: "Home Today", value: homeCount, color: "#7C3AED" },
          { labelAr: "نتائج معلقة", labelEn: "Pending Results", value: pendingResults, color: "#D97706" },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f.key} style={[styles.filterChip, { borderColor: filter === f.key ? C : cardBorder, backgroundColor: filter === f.key ? C : cardBg }]}
            onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, { color: filter === f.key ? "#fff" : colors.muted }]}>{lang === "ar" ? f.ar : f.en}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {filtered.map((bk) => (
          <Pressable key={bk.id} style={[styles.bkCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setExpanded(expanded === bk.id ? null : bk.id)}>
            <View style={styles.bkTop}>
              <View style={[styles.statusBadge, { backgroundColor: bk.statusBg }]}>
                <Text style={[styles.statusText, { color: bk.statusColor }]}>{lang === "ar" ? bk.statusAr : bk.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bkId, { color: colors.muted }]}>{bk.id}  ·  {lang === "ar" ? bk.dateAr : bk.dateEn} {bk.time}</Text>
                <Text style={[styles.bkPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? bk.patientAr : bk.patientEn}</Text>
              </View>
              <Text style={[styles.bkFee, { color: C }]}>{bk.fee}</Text>
            </View>
            <View style={styles.bkMeta}>
              <Text style={{ fontSize: 11 }}>{bk.typeAr === "منزلي" ? "🏠" : "🏥"}</Text>
              <Text style={[styles.bkType, { color: colors.muted }]}>{lang === "ar" ? bk.typeAr : bk.typeEn}</Text>
              <Text style={[styles.bkTests, { color: isDark ? "#A0C8E8" : "#1E3A5F" }]} numberOfLines={1}>{lang === "ar" ? bk.testsAr : bk.testsEn}</Text>
            </View>
            {expanded === bk.id && (
              <View style={[styles.expandSection, { borderTopColor: cardBorder }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailValue, { color: isDark ? "#C0D8E8" : "#0A1F35" }]}>{lang === "ar" ? bk.prepAr : bk.prepEn}</Text>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("التحضير","Preparation")}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={[styles.resultChip, { backgroundColor: bk.resultReady ? "#D1FAE5" : "#FEF3C7" }]}>
                    <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: bk.resultReady ? "#059669" : "#D97706" }}>
                      {bk.resultReady ? t("جاهزة","Ready") : t("قيد الإعداد","Pending")}
                    </Text>
                  </View>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("النتائج","Results")}</Text>
                </View>
                {bk.status === "waiting" && (
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("إلغاء الحجز","Cancel Booking"), `${lang === "ar" ? bk.patientAr : bk.patientEn}`, [{ text: t("تراجع","Back"), style: "cancel" }, { text: t("إلغاء","Cancel"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("إلغاء","Cancel")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تم","Done"), t("تم تأكيد الحجز","Booking confirmed"))}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تأكيد ✓","Confirm ✓")}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, borderWidth: 1, alignItems: "center", gap: 4 },
  summaryVal: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  bkCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  bkTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  bkId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  bkPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  bkFee: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  bkMeta: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  bkType: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bkTests: { flex: 1, fontSize: 12, fontFamily: "Tajawal_500Medium" },
  expandSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 10, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  resultChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
