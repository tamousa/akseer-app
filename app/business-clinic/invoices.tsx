import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function ClinicInvoices() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const INVOICES = [
    { id: "MED-305", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", serviceAr: "استشارة طبية عامة", serviceEn: "General Medical Consultation", doctor: "د. سارة / Dr. Sarah", amount: "350 SAR", dateAr: "اليوم", dateEn: "Today", status: "paid", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "بطاقة", methodEn: "Card", insuranceAr: "—", insuranceEn: "—" },
    { id: "MED-304", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", serviceAr: "جلسة علاج نفسي", serviceEn: "Psychological Therapy", doctor: "د. خالد / Dr. Khalid", amount: "280 SAR", dateAr: "اليوم", dateEn: "Today", status: "paid", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "أبل باي", methodEn: "Apple Pay", insuranceAr: "بوبا العربية 90%", insuranceEn: "Bupa Arabia 90%" },
    { id: "MED-303", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", serviceAr: "تقييم تغذوي + زيارة منزلية", serviceEn: "Nutritional Assessment + Home Visit", doctor: "أخ. ريم / Nurse Reem", amount: "320 SAR", dateAr: "أمس", dateEn: "Yesterday", status: "paid", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "مدى", methodEn: "Mada", insuranceAr: "—", insuranceEn: "—" },
    { id: "MED-302", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", serviceAr: "استشارة عامة", serviceEn: "General Consultation", doctor: "د. سارة / Dr. Sarah", amount: "350 SAR", dateAr: "أمس", dateEn: "Yesterday", status: "pending", statusAr: "معلقة", statusEn: "Pending", statusColor: "#D97706", statusBg: "#FEF3C7", methodAr: "تأمين", methodEn: "Insurance", insuranceAr: "ميدغلف", insuranceEn: "Medgulf" },
    { id: "MED-301", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", serviceAr: "جلسة نفسية", serviceEn: "Psychology Session", doctor: "د. خالد / Dr. Khalid", amount: "280 SAR", dateAr: "منذ 3 أيام", dateEn: "3 days ago", status: "refunded", statusAr: "مسترجعة", statusEn: "Refunded", statusColor: "#DC2626", statusBg: "#FEE2E2", methodAr: "—", methodEn: "—", insuranceAr: "—", insuranceEn: "—" },
  ];

  const FILTERS = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "paid", ar: "مدفوعة", en: "Paid" },
    { key: "pending", ar: "معلقة", en: "Pending" },
    { key: "refunded", ar: "مسترجعة", en: "Refunded" },
  ];

  const filtered = filter === "all" ? INVOICES : INVOICES.filter((i) => i.status === filter);
  const total = INVOICES.filter((i) => i.status === "paid").reduce((a, i) => a + parseFloat(i.amount.replace(" SAR", "")), 0);
  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الفواتير الطبية","Medical Invoices")}</Text>
        <Pressable style={[styles.exportBtn, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}
          onPress={() => Alert.alert(t("تصدير","Export"), t("سيتم تصدير الفواتير بصيغة PDF أو Excel","Invoices will be exported as PDF or Excel"))}>
          <Feather name="download" size={16} color={C} />
        </Pressable>
      </View>

      <View style={[styles.summaryBanner, { backgroundColor: C }]}>
        <Text style={styles.sumLabel}>{t("إجمالي المدفوعات","Total Payments")}</Text>
        <Text style={styles.sumAmount}>{total.toLocaleString()} SAR</Text>
        <Text style={styles.sumCount}>{INVOICES.filter((i) => i.status === "paid").length} {t("فاتورة مدفوعة","paid invoices")}</Text>
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
        {filtered.map((inv) => (
          <Pressable key={inv.id} style={[styles.invCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setExpanded(expanded === inv.id ? null : inv.id)}>
            <View style={styles.invTop}>
              <View style={[styles.statusBadge, { backgroundColor: inv.statusBg }]}>
                <Text style={[styles.statusText, { color: inv.statusColor }]}>{lang === "ar" ? inv.statusAr : inv.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.invId, { color: colors.muted }]}>{inv.id}  ·  {lang === "ar" ? inv.dateAr : inv.dateEn}</Text>
                <Text style={[styles.invPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? inv.patientAr : inv.patientEn}</Text>
              </View>
              <Text style={[styles.invAmount, { color: C }]}>{inv.amount}</Text>
            </View>
            <Text style={[styles.invMeta, { color: colors.muted }]}>{inv.doctor}  ·  {lang === "ar" ? inv.serviceAr : inv.serviceEn}</Text>
            {expanded === inv.id && (
              <View style={[styles.expandSection, { borderTopColor: cardBorder }]}>
                {[
                  { labelAr: "طريقة الدفع", labelEn: "Payment Method", valueAr: inv.methodAr, valueEn: inv.methodEn },
                  { labelAr: "التأمين", labelEn: "Insurance", valueAr: inv.insuranceAr, valueEn: inv.insuranceEn },
                ].map((d, i) => (
                  <View key={i} style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? d.valueAr : d.valueEn}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{lang === "ar" ? d.labelAr : d.labelEn}</Text>
                  </View>
                ))}
                <Pressable style={[styles.printBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}
                  onPress={() => Alert.alert(t("طباعة الفاتورة","Print Invoice"), `${inv.id}`)}>
                  <Feather name="printer" size={14} color={C} />
                  <Text style={[styles.printBtnText, { color: C }]}>{t("طباعة / تصدير PDF","Print / Export PDF")}</Text>
                </Pressable>
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
  exportBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryBanner: { marginHorizontal: 16, borderRadius: 18, padding: 18, marginBottom: 16, alignItems: "center" },
  sumLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
  sumAmount: { fontSize: 30, fontFamily: "Cairo_700Bold", color: "#fff", marginVertical: 4 },
  sumCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  invCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  invTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  invId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  invPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  invAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  invMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  expandSection: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  printBtn: { flexDirection: "row-reverse", gap: 8, paddingVertical: 10, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  printBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
