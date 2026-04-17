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

export default function AppointmentsPage() {
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
    { key: "waiting", ar: "انتظار", en: "Waiting" },
    { key: "completed", ar: "مكتمل", en: "Completed" },
    { key: "cancelled", ar: "ملغي", en: "Cancelled" },
  ];

  const TYPE_ICONS: Record<string, string> = { "in-clinic": "🏥", "home": "🏠", "virtual": "📱" };

  const APPOINTMENTS = [
    { id: "APT-501", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "استشارة عامة", serviceEn: "General Consultation", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "اليوم", dateEn: "Today", time: "09:00", status: "confirmed", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5", fee: "350 SAR" },
    { id: "APT-502", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", doctor: "د. خالد / Dr. Khalid", specialtyAr: "نفسية", specialtyEn: "Psychology", serviceAr: "جلسة علاج معرفي", serviceEn: "Cognitive Therapy", type: "virtual", typeAr: "مرئي", typeEn: "Virtual", dateAr: "اليوم", dateEn: "Today", time: "10:30", status: "confirmed", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5", fee: "280 SAR" },
    { id: "APT-503", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "متابعة السكري", serviceEn: "Diabetes Follow-up", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "اليوم", dateEn: "Today", time: "11:00", status: "waiting", statusAr: "انتظار", statusEn: "Waiting", statusColor: "#D97706", statusBg: "#FEF3C7", fee: "350 SAR" },
    { id: "APT-504", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", doctor: "أخ. ريم / Nurse Reem", specialtyAr: "تغذية", specialtyEn: "Nutrition", serviceAr: "تقييم تغذوي", serviceEn: "Nutritional Assessment", type: "home", typeAr: "منزلي", typeEn: "Home", dateAr: "اليوم", dateEn: "Today", time: "14:00", status: "confirmed", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5", fee: "320 SAR" },
    { id: "APT-500", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", doctor: "د. خالد / Dr. Khalid", specialtyAr: "نفسية", specialtyEn: "Psychology", serviceAr: "جلسة قلق", serviceEn: "Anxiety Session", type: "virtual", typeAr: "مرئي", typeEn: "Virtual", dateAr: "أمس", dateEn: "Yesterday", time: "16:00", status: "completed", statusAr: "مكتمل", statusEn: "Completed", statusColor: C, statusBg: "#CFFAFE", fee: "280 SAR" },
    { id: "APT-499", patientAr: "سارة المطيري", patientEn: "Sarah Al-Mutairi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "كشف عام", serviceEn: "General Checkup", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "أمس", dateEn: "Yesterday", time: "09:30", status: "cancelled", statusAr: "ملغي", statusEn: "Cancelled", statusColor: "#DC2626", statusBg: "#FEE2E2", fee: "—" },
  ];

  const filtered = filter === "all" ? APPOINTMENTS
    : filter === "today" ? APPOINTMENTS.filter((a) => a.dateAr === "اليوم")
    : APPOINTMENTS.filter((a) => a.status === filter);

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("إدارة المواعيد","Appointment Management")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("موعد جديد","New Appointment"), t("سيتم فتح نموذج إضافة موعد جديد","New appointment form will open"))}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {[
          { labelAr: "مواعيد اليوم", labelEn: "Today", value: APPOINTMENTS.filter((a) => a.dateAr === "اليوم").length, color: C },
          { labelAr: "بانتظار التأكيد", labelEn: "Pending", value: APPOINTMENTS.filter((a) => a.status === "waiting").length, color: "#D97706" },
          { labelAr: "المكتملة", labelEn: "Completed", value: APPOINTMENTS.filter((a) => a.status === "completed").length, color: "#059669" },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: isDark ? s.color + "15" : s.color + "10", borderColor: s.color + "30" }]}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
          </View>
        ))}
      </View>

      <View style={styles.typeRow}>
        {[
          { key: "in-clinic", ar: "حضوري", en: "In-Clinic", icon: "🏥" },
          { key: "home", ar: "منزلي", en: "Home", icon: "🏠" },
          { key: "virtual", ar: "مرئي", en: "Virtual", icon: "📱" },
        ].map((tp) => (
          <View key={tp.key} style={[styles.typeCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={{ fontSize: 22 }}>{tp.icon}</Text>
            <Text style={[styles.typeName, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? tp.ar : tp.en}</Text>
            <Text style={[styles.typeCount, { color: C }]}>{APPOINTMENTS.filter((a) => a.type === tp.key).length}</Text>
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

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((apt) => (
          <Pressable key={apt.id} style={[styles.aptCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => setExpanded(expanded === apt.id ? null : apt.id)}>
            <View style={styles.aptTop}>
              <View style={[styles.statusBadge, { backgroundColor: apt.statusBg }]}>
                <Text style={[styles.statusText, { color: apt.statusColor }]}>{lang === "ar" ? apt.statusAr : apt.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.aptIdRow}>
                  <Text style={[styles.aptType, { color: colors.muted }]}>{TYPE_ICONS[apt.type]} {lang === "ar" ? apt.typeAr : apt.typeEn}</Text>
                  <Text style={[styles.aptId, { color: colors.muted }]}>{apt.id}  ·  {lang === "ar" ? apt.dateAr : apt.dateEn} {apt.time}</Text>
                </View>
                <Text style={[styles.aptPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? apt.patientAr : apt.patientEn}</Text>
              </View>
              <Text style={[styles.aptFee, { color: C }]}>{apt.fee}</Text>
            </View>
            <Text style={[styles.aptMeta, { color: colors.muted }]}>{apt.doctor}  ·  {lang === "ar" ? apt.specialtyAr : apt.specialtyEn}  ·  {lang === "ar" ? apt.serviceAr : apt.serviceEn}</Text>

            {expanded === apt.id && (
              <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? apt.serviceAr : apt.serviceEn}</Text>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("الخدمة","Service")}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? apt.specialtyAr : apt.specialtyEn}</Text>
                  <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("التخصص","Specialty")}</Text>
                </View>
                {apt.status === "waiting" && (
                  <View style={styles.confirmRow}>
                    <Pressable style={[styles.confirmBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("رفض الموعد","Reject Appointment"), `${t("هل تريد رفض موعد","Reject appointment for")} ${lang === "ar" ? apt.patientAr : apt.patientEn}؟`, [
                        { text: t("إلغاء","Cancel"), style: "cancel" },
                        { text: t("رفض","Reject"), style: "destructive" },
                      ])}>
                      <Text style={[styles.confirmBtnText, { color: "#DC2626" }]}>{t("رفض","Reject")}</Text>
                    </Pressable>
                    <Pressable style={[styles.confirmBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تأكيد الموعد","Confirm Appointment"), `${t("تم تأكيد موعد","Confirmed appointment for")} ${lang === "ar" ? apt.patientAr : apt.patientEn} ${t("الساعة","at")} ${apt.time}`)}>
                      <Text style={[styles.confirmBtnText, { color: "#fff" }]}>{t("تأكيد الموعد ✓","Confirm ✓")}</Text>
                    </Pressable>
                  </View>
                )}
                {apt.status === "completed" && (
                  <Pressable style={[styles.confirmBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA", alignSelf: "flex-start", paddingHorizontal: 16 }]}
                    onPress={() => Alert.alert(t("التقرير الطبي","Medical Report"), t("سيتم فتح نموذج إضافة ملاحظات طبية","Medical notes form will open"))}>
                    <Text style={[styles.confirmBtnText, { color: C }]}>{t("إضافة ملاحظات طبية","Add Medical Notes")}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </Pressable>
        ))}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t("لا توجد مواعيد في هذه الفئة","No appointments in this category")}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  summaryValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  typeRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  typeCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1, gap: 4 },
  typeName: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  typeCount: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  aptCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  aptTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  aptIdRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 2 },
  aptId: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  aptType: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  aptPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  aptFee: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  aptMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  expandedSection: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  confirmRow: { flexDirection: "row-reverse", gap: 10 },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  confirmBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
