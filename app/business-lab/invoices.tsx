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

export default function LabInvoices() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const INVOICES = [
    { id: "INV-LAB-2401", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", testsAr: "صورة دم كاملة + سكر صائم", testsEn: "CBC + Fasting Glucose", dateAr: "اليوم 09:00", dateEn: "Today 09:00", amount: "65 SAR", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "مدى", methodEn: "Mada", typeAr: "حضوري", typeEn: "In-person" },
    { id: "INV-LAB-2402", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", testsAr: "باقة الفحص الشامل", testsEn: "Comprehensive Panel", dateAr: "اليوم 09:00", dateEn: "Today 09:00", amount: "249 SAR", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "أبل باي", methodEn: "Apple Pay", typeAr: "حضوري", typeEn: "In-person" },
    { id: "INV-LAB-2403", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", testsAr: "هرمونات الغدة الدرقية + زيارة منزلية", testsEn: "Thyroid Hormones + Home Visit", dateAr: "اليوم 10:30", dateEn: "Today 10:30", amount: "170 SAR", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "بطاقة", methodEn: "Card", typeAr: "منزلي", typeEn: "Home" },
    { id: "INV-LAB-2404", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", testsAr: "وظائف الكبد + وظائف الكلى", testsEn: "Liver & Kidney Function", dateAr: "اليوم 11:00", dateEn: "Today 11:00", amount: "160 SAR", statusAr: "معلقة", statusEn: "Pending", statusColor: "#D97706", statusBg: "#FEF3C7", methodAr: "—", methodEn: "—", typeAr: "حضوري", typeEn: "In-person" },
    { id: "INV-LAB-2400", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", testsAr: "باقة مرضى السكري + زيارة منزلية", testsEn: "Diabetes Package + Home Visit", dateAr: "أمس", dateEn: "Yesterday", amount: "199 SAR", statusAr: "مدفوعة", statusEn: "Paid", statusColor: "#059669", statusBg: "#D1FAE5", methodAr: "مدى", methodEn: "Mada", typeAr: "منزلي", typeEn: "Home" },
  ];

  const FILTERS = [
    { keyAr: "الكل", keyEn: "All" },
    { keyAr: "مدفوعة", keyEn: "Paid" },
    { keyAr: "معلقة", keyEn: "Pending" },
  ];

  const [filterIdx, setFilterIdx] = useState(0);
  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  const filtered = filterIdx === 0 ? INVOICES : INVOICES.filter((inv) =>
    filterIdx === 1 ? inv.statusAr === "مدفوعة" : inv.statusAr === "معلقة"
  );
  const paidTotal = INVOICES.filter((inv) => inv.statusAr === "مدفوعة").length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("الفواتير","Invoices")}</Text>
        <Pressable style={[styles.exportBtn, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE", borderColor: C + "40" }]}
          onPress={() => Alert.alert(t("تصدير الفواتير","Export Invoices"), t("سيتم تصدير فواتير الشهر الحالي بصيغة PDF","Current month invoices will be exported as PDF"))}>
          <Feather name="download" size={16} color={C} />
        </Pressable>
      </View>

      <View style={[styles.totalCard, { backgroundColor: C }]}>
        <Text style={styles.totalLabel}>{t("إجمالي الفواتير المدفوعة","Total Paid Invoices")}</Text>
        <Text style={styles.totalAmount}>843 SAR</Text>
        <Text style={styles.totalSub}>{paidTotal} {t("فاتورة مدفوعة من أصل","paid out of")} {INVOICES.length}</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f, i) => (
          <Pressable key={i} style={[styles.filterChip, { borderColor: filterIdx === i ? C : cardBorder, backgroundColor: filterIdx === i ? C : cardBg }]}
            onPress={() => setFilterIdx(i)}>
            <Text style={[styles.filterText, { color: filterIdx === i ? "#fff" : colors.muted }]}>{lang === "ar" ? f.keyAr : f.keyEn}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {filtered.map((inv) => (
          <Pressable key={inv.id} style={[styles.invCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(inv.id, `${t("المريض:","Patient:")} ${lang === "ar" ? inv.patientAr : inv.patientEn}\n${t("التحاليل:","Tests:")} ${lang === "ar" ? inv.testsAr : inv.testsEn}\n${t("المبلغ:","Amount:")} ${inv.amount}\n${t("طريقة الدفع:","Payment:")} ${lang === "ar" ? inv.methodAr : inv.methodEn}\n${t("النوع:","Type:")} ${lang === "ar" ? inv.typeAr : inv.typeEn}`)}>
            <View style={styles.invTop}>
              <View style={[styles.statusBadge, { backgroundColor: inv.statusBg }]}>
                <Text style={[styles.statusText, { color: inv.statusColor }]}>{lang === "ar" ? inv.statusAr : inv.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.invId, { color: colors.muted }]}>{inv.id}  ·  {lang === "ar" ? inv.dateAr : inv.dateEn}</Text>
                <Text style={[styles.invPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? inv.patientAr : inv.patientEn}</Text>
              </View>
              <Text style={[styles.invAmount, { color: C }]}>{inv.amount}</Text>
            </View>
            <View style={styles.invMeta}>
              <Text style={[styles.invTests, { color: colors.muted }]} numberOfLines={1}>{lang === "ar" ? inv.testsAr : inv.testsEn}</Text>
              {inv.methodAr !== "—" && (
                <View style={[styles.methodBadge, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Text style={[styles.methodText, { color: C }]}>{lang === "ar" ? inv.methodAr : inv.methodEn}</Text>
                </View>
              )}
            </View>
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
  exportBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  totalCard: { marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 14 },
  totalLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", textAlign: "right" },
  totalAmount: { fontSize: 30, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right", marginVertical: 4 },
  totalSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", textAlign: "right" },
  filterRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  invCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  invTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  invId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  invPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  invAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  invMeta: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  invTests: { flex: 1, fontSize: 11, fontFamily: "Tajawal_400Regular" },
  methodBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  methodText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
