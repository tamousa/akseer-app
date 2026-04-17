import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const INITIAL_APPOINTMENTS = [
  { id: "APT-505", patientAr: "ريم الزهراني", patientEn: "Reem Al-Zahrani", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "كشف مبدئي", serviceEn: "Initial Checkup", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "اليوم", dateEn: "Today", time: "08:30", status: "waiting", fee: "350 SAR" },
  { id: "APT-506", patientAr: "عمر الشهري", patientEn: "Omar Al-Shehri", doctor: "د. خالد / Dr. Khalid", specialtyAr: "نفسية", specialtyEn: "Psychology", serviceAr: "جلسة تقييم", serviceEn: "Assessment Session", type: "virtual", typeAr: "مرئي", typeEn: "Virtual", dateAr: "اليوم", dateEn: "Today", time: "09:00", status: "waiting", fee: "280 SAR" },
  { id: "APT-501", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "استشارة عامة", serviceEn: "General Consultation", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "اليوم", dateEn: "Today", time: "10:00", status: "confirmed", fee: "350 SAR" },
  { id: "APT-502", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", doctor: "د. خالد / Dr. Khalid", specialtyAr: "نفسية", specialtyEn: "Psychology", serviceAr: "جلسة علاج معرفي", serviceEn: "Cognitive Therapy", type: "virtual", typeAr: "مرئي", typeEn: "Virtual", dateAr: "اليوم", dateEn: "Today", time: "10:30", status: "confirmed", fee: "280 SAR" },
  { id: "APT-503", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "متابعة السكري", serviceEn: "Diabetes Follow-up", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "اليوم", dateEn: "Today", time: "11:00", status: "waiting", fee: "350 SAR" },
  { id: "APT-504", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", doctor: "أخ. ريم / Nurse Reem", specialtyAr: "تغذية", specialtyEn: "Nutrition", serviceAr: "تقييم تغذوي", serviceEn: "Nutritional Assessment", type: "home", typeAr: "منزلي", typeEn: "Home", dateAr: "اليوم", dateEn: "Today", time: "14:00", status: "confirmed", fee: "320 SAR" },
  { id: "APT-500", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", doctor: "د. خالد / Dr. Khalid", specialtyAr: "نفسية", specialtyEn: "Psychology", serviceAr: "جلسة قلق", serviceEn: "Anxiety Session", type: "virtual", typeAr: "مرئي", typeEn: "Virtual", dateAr: "أمس", dateEn: "Yesterday", time: "16:00", status: "completed", fee: "280 SAR" },
  { id: "APT-499", patientAr: "سارة المطيري", patientEn: "Sarah Al-Mutairi", doctor: "د. سارة / Dr. Sarah", specialtyAr: "طب عام", specialtyEn: "General Med", serviceAr: "كشف عام", serviceEn: "General Checkup", type: "in-clinic", typeAr: "حضوري", typeEn: "In-Clinic", dateAr: "أمس", dateEn: "Yesterday", time: "09:30", status: "cancelled", fee: "—" },
];

const STATUS_MAP = {
  waiting:   { ar: "بانتظار الموافقة", en: "Awaiting Approval", color: "#D97706", bg: "#FEF3C7" },
  confirmed: { ar: "مؤكد",            en: "Confirmed",         color: "#059669", bg: "#D1FAE5" },
  completed: { ar: "مكتمل",           en: "Completed",         color: "#6366F1", bg: "#EDE9FE" },
  cancelled: { ar: "ملغي",            en: "Cancelled",         color: "#DC2626", bg: "#FEE2E2" },
  rejected:  { ar: "مرفوض",           en: "Rejected",          color: "#9CA3AF", bg: "#F3F4F6" },
};

const TYPE_ICONS: Record<string, string> = { "in-clinic": "🏥", home: "🏠", virtual: "📱" };

export default function AppointmentsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [appts, setAppts] = useState(INITIAL_APPOINTMENTS);

  const FILTERS = [
    { key: "all",       ar: "الكل",     en: "All" },
    { key: "waiting",   ar: "انتظار",   en: "Pending" },
    { key: "confirmed", ar: "مؤكد",     en: "Confirmed" },
    { key: "completed", ar: "مكتمل",    en: "Completed" },
    { key: "cancelled", ar: "ملغي",     en: "Cancelled" },
  ];

  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);
  const pendingCount = appts.filter((a) => a.status === "waiting").length;

  const handleApprove = (id: string) => {
    setAppts((prev) => prev.map((a) => a.id === id ? { ...a, status: "confirmed" } : a));
    Alert.alert("✅ " + t("تم القبول", "Approved"), t("تم تأكيد الموعد بنجاح", "Appointment confirmed successfully"));
  };

  const handleReject = (id: string, patientAr: string, patientEn: string) => {
    Alert.alert(
      t("رفض الموعد", "Reject Appointment"),
      t(`هل تريد رفض موعد ${patientAr}؟`, `Reject appointment for ${patientEn}?`),
      [
        { text: t("إلغاء", "Cancel"), style: "cancel" },
        {
          text: t("رفض", "Reject"),
          style: "destructive",
          onPress: () => setAppts((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a)),
        },
      ]
    );
  };

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Page header */}
      <View style={[styles.pageHeader, { paddingTop: topPadding + 10, backgroundColor: colors.background, borderBottomColor: cardBorder }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Feather name="chevron-right" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("إدارة المواعيد", "Appointments")}</Text>
        <Pressable style={[styles.iconBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("موعد جديد", "New Appointment"), t("سيتم فتح نموذج إضافة موعد", "New appointment form"))}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Pending alert banner */}
        {pendingCount > 0 && (
          <Pressable style={[styles.pendingBanner, { backgroundColor: isDark ? "#3B2200" : "#FEF3C7", borderColor: "#D97706" }]}
            onPress={() => setFilter("waiting")}>
            <Feather name="alert-circle" size={18} color="#D97706" />
            <Text style={[styles.pendingText, { color: "#D97706" }]}>
              {t(`${pendingCount} مواعيد بانتظار موافقتك — اضغط للمراجعة`, `${pendingCount} appointments awaiting your approval — tap to review`)}
            </Text>
            <Feather name="chevron-left" size={16} color="#D97706" />
          </Pressable>
        )}

        {/* Summary row */}
        <View style={styles.summaryRow}>
          {[
            { labelAr: "اليوم", labelEn: "Today", value: appts.filter((a) => a.dateAr === "اليوم").length, color: C },
            { labelAr: "انتظار", labelEn: "Pending", value: pendingCount, color: "#D97706" },
            { labelAr: "مكتمل", labelEn: "Done", value: appts.filter((a) => a.status === "completed").length, color: "#059669" },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCard, { backgroundColor: s.color + "18", borderColor: s.color + "40" }]}>
              <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
            </View>
          ))}
        </View>

        {/* Type row */}
        <View style={styles.typeRow}>
          {[
            { key: "in-clinic", ar: "حضوري", en: "In-Clinic", icon: "🏥" },
            { key: "home", ar: "منزلي", en: "Home", icon: "🏠" },
            { key: "virtual", ar: "مرئي", en: "Virtual", icon: "📱" },
          ].map((tp) => (
            <View key={tp.key} style={[styles.typeCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={{ fontSize: 22 }}>{tp.icon}</Text>
              <Text style={[styles.typeName, { color: colors.text }]}>{lang === "ar" ? tp.ar : tp.en}</Text>
              <Text style={[styles.typeCount, { color: C }]}>{appts.filter((a) => a.type === tp.key).length}</Text>
            </View>
          ))}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable key={f.key}
              style={[styles.filterChip, { borderColor: filter === f.key ? C : cardBorder, backgroundColor: filter === f.key ? C : cardBg }]}
              onPress={() => setFilter(f.key)}>
              <Text style={[styles.filterText, { color: filter === f.key ? "#fff" : colors.muted }]}>
                {lang === "ar" ? f.ar : f.en}
                {f.key === "waiting" && pendingCount > 0 ? ` (${pendingCount})` : ""}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Appointments list */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {filtered.map((apt) => {
            const st = STATUS_MAP[apt.status as keyof typeof STATUS_MAP] || STATUS_MAP.waiting;
            const isWaiting = apt.status === "waiting";
            return (
              <View key={apt.id} style={[styles.aptCard, { backgroundColor: cardBg, borderColor: isWaiting ? "#D97706" : cardBorder, borderWidth: isWaiting ? 1.5 : 1 }]}>
                {/* Card header */}
                <View style={styles.aptTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.aptId, { color: colors.muted }]}>{apt.id}  ·  {lang === "ar" ? apt.dateAr : apt.dateEn}  ·  {apt.time}</Text>
                    <Text style={[styles.aptPatient, { color: colors.text }]}>{lang === "ar" ? apt.patientAr : apt.patientEn}</Text>
                    <Text style={[styles.aptMeta, { color: colors.muted }]}>
                      {TYPE_ICONS[apt.type]} {lang === "ar" ? apt.typeAr : apt.typeEn}  ·  {apt.doctor}
                    </Text>
                    <Text style={[styles.aptService, { color: colors.muted }]}>{lang === "ar" ? apt.serviceAr : apt.serviceEn}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 6 }}>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                      <Text style={[styles.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                    </View>
                    <Text style={[styles.aptFee, { color: C }]}>{apt.fee}</Text>
                  </View>
                </View>

                {/* Approve/Reject — always visible for waiting */}
                {isWaiting && (
                  <View style={[styles.actionRow, { borderTopColor: "#D97706" + "40" }]}>
                    <Pressable style={[styles.rejectBtn, { borderColor: "#DC2626" }]}
                      onPress={() => handleReject(apt.id, apt.patientAr, apt.patientEn)}>
                      <Feather name="x" size={16} color="#DC2626" />
                      <Text style={[styles.actionText, { color: "#DC2626" }]}>{t("رفض", "Reject")}</Text>
                    </Pressable>
                    <Pressable style={[styles.approveBtn, { backgroundColor: "#059669" }]}
                      onPress={() => handleApprove(apt.id)}>
                      <Feather name="check" size={16} color="#fff" />
                      <Text style={[styles.actionText, { color: "#fff" }]}>{t("قبول الموعد", "Accept")}</Text>
                    </Pressable>
                  </View>
                )}

                {/* Notes button for completed */}
                {apt.status === "completed" && (
                  <Pressable style={[styles.noteBtn, { backgroundColor: C + "15", borderColor: C + "40" }]}
                    onPress={() => Alert.alert(t("ملاحظات طبية", "Medical Notes"), t("سيتم فتح نموذج إضافة الملاحظات", "Medical notes form will open"))}>
                    <Feather name="file-text" size={14} color={C} />
                    <Text style={[styles.actionText, { color: C }]}>{t("إضافة ملاحظات طبية", "Add Medical Notes")}</Text>
                  </Pressable>
                )}
              </View>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="calendar" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>{t("لا توجد مواعيد في هذه الفئة", "No appointments in this category")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pendingBanner: { flexDirection: "row-reverse", alignItems: "center", marginHorizontal: 16, marginTop: 14, marginBottom: 4, borderRadius: 14, padding: 12, borderWidth: 1.5, gap: 10 },
  pendingText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, paddingTop: 14, gap: 10, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  summaryValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  typeRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  typeCard: { flex: 1, borderRadius: 14, padding: 10, alignItems: "center", borderWidth: 1, gap: 4 },
  typeName: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  typeCount: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  aptCard: { borderRadius: 16, padding: 14 },
  aptTop: { flexDirection: "row-reverse", gap: 10, marginBottom: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  aptId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  aptPatient: { fontSize: 15, fontFamily: "Cairo_700Bold", marginBottom: 2 },
  aptService: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  aptMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  aptFee: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  actionRow: { flexDirection: "row-reverse", gap: 10, borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  approveBtn: { flex: 2, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  rejectBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  actionText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  noteBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginTop: 10 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
