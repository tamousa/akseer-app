import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const STATUS_INFO: Record<string, { ar: string; en: string; color: string; bg: string }> = {
  waiting:   { ar: "ينتظر الموافقة", en: "Awaiting Approval", color: "#D97706", bg: "#FEF3C7" },
  confirmed: { ar: "مؤكد",           en: "Confirmed",        color: "#059669", bg: "#D1FAE5" },
  completed: { ar: "مكتمل",          en: "Completed",        color: "#6366F1", bg: "#EDE9FE" },
  cancelled: { ar: "ملغى",           en: "Cancelled",        color: "#EF4444", bg: "#FEE2E2" },
  rejected:  { ar: "مرفوض",          en: "Rejected",         color: "#9CA3AF", bg: "#F3F4F6" },
};

const INITIAL_SESSIONS = [
  { id: 1, patientAr: "سعد الغامدي",   patientEn: "Saad Al-Ghamdi",    planAr: "إعادة تأهيل ركبة",    planEn: "Knee Rehabilitation",   sessNum: "8/12", time: "09:00", dateAr: "اليوم", dateEn: "Today",    therapistAr: "د. أحمد",   therapistEn: "Dr. Ahmed",   status: "confirmed", amount: 350 },
  { id: 2, patientAr: "ريم المالكي",   patientEn: "Reem Al-Maliki",    planAr: "علاج آلام الظهر",     planEn: "Back Pain Therapy",     sessNum: "3/8",  time: "10:30", dateAr: "اليوم", dateEn: "Today",    therapistAr: "د. سمر",    therapistEn: "Dr. Samar",   status: "confirmed", amount: 280 },
  { id: 3, patientAr: "بدر العتيبي",   patientEn: "Badr Al-Otaibi",    planAr: "تأهيل ما بعد جراحة", planEn: "Post-Surgery Rehab",    sessNum: "5/16", time: "12:00", dateAr: "اليوم", dateEn: "Today",    therapistAr: "د. أحمد",   therapistEn: "Dr. Ahmed",   status: "waiting",   amount: 350 },
  { id: 4, patientAr: "هند الزهراني", patientEn: "Hind Al-Zahrani",   planAr: "علاج طبيعي عام",      planEn: "General Physiotherapy", sessNum: "2/6",  time: "14:30", dateAr: "اليوم", dateEn: "Today",    therapistAr: "د. فاطمة",  therapistEn: "Dr. Fatima",  status: "waiting",   amount: 220 },
  { id: 5, patientAr: "طلال النجار",   patientEn: "Talal Al-Najjar",   planAr: "تأهيل رياضي",         planEn: "Sports Rehabilitation", sessNum: "6/10", time: "09:00", dateAr: "غداً",  dateEn: "Tomorrow", therapistAr: "د. فاطمة",  therapistEn: "Dr. Fatima",  status: "confirmed", amount: 320 },
  { id: 6, patientAr: "نوف القحطاني", patientEn: "Nouf Al-Qahtani",   planAr: "علاج عصبي",           planEn: "Neurological Therapy",  sessNum: "1/8",  time: "11:00", dateAr: "غداً",  dateEn: "Tomorrow", therapistAr: "د. أحمد",   therapistEn: "Dr. Ahmed",   status: "waiting",   amount: 300 },
];

export default function RehabSessions() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const [tab, setTab] = useState<"today" | "tomorrow" | "all">("today");
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const TABS = [
    { key: "today" as const,    ar: "اليوم", en: "Today" },
    { key: "tomorrow" as const, ar: "غداً",  en: "Tomorrow" },
    { key: "all" as const,      ar: "الكل",  en: "All" },
  ];

  const shown = tab === "all" ? sessions : sessions.filter((s) =>
    tab === "today" ? s.dateAr === "اليوم" : s.dateAr === "غداً"
  );

  const waitingCount = sessions.filter((s) => s.status === "waiting" && s.dateAr === "اليوم").length;

  const handleAccept = (id: number) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "confirmed" } : s));
    Alert.alert("✅ " + t("تم قبول الجلسة", "Session Confirmed"), t("تم تأكيد الحجز وإشعار العميل", "Booking confirmed and client notified"));
  };

  const handleReject = (id: number) => {
    Alert.alert(
      t("رفض الحجز", "Reject Booking"),
      t("هل تريد رفض هذا الحجز؟", "Are you sure you want to reject this booking?"),
      [
        { text: t("إلغاء", "Cancel"), style: "cancel" },
        {
          text: t("رفض", "Reject"), style: "destructive",
          onPress: () => setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected" } : s)),
        },
      ]
    );
  };

  const handleComplete = (id: number) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: "completed" } : s));
    Alert.alert("✅ " + t("تم", "Done"), t("تم تسجيل الجلسة كمكتملة", "Session marked as completed"));
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[s.iconBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Feather name="chevron-right" size={22} color={colors.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("جلسات التأهيل", "Rehab Sessions")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={[s.iconBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-rehab/packages" as any)}>
            <Feather name="package" size={18} color={C} />
          </Pressable>
          <Pressable style={[s.iconBtn, { backgroundColor: C }]} onPress={() => router.push("/business-rehab/add-service" as any)}>
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      {waitingCount > 0 && (
        <View style={[s.alertBanner, { backgroundColor: isDark ? "#1F1400" : "#FFFBEB", borderColor: "#D97706" }]}>
          <Feather name="alert-circle" size={16} color="#D97706" />
          <Text style={[s.alertText, { color: "#D97706" }]}>
            {t(`${waitingCount} حجز ينتظر موافقتك اليوم`, `${waitingCount} booking(s) awaiting your approval today`)}
          </Text>
        </View>
      )}

      <View style={[s.tabRow, { borderBottomColor: colors.border }]}>
        {TABS.map((tb) => (
          <Pressable key={tb.key} style={[s.tab, tab === tb.key && { borderBottomColor: C, borderBottomWidth: 2 }]} onPress={() => setTab(tb.key)}>
            <Text style={[s.tabText, { color: tab === tb.key ? C : colors.muted }]}>{lang === "ar" ? tb.ar : tb.en}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 10 }}>
        {shown.map((ss) => {
          const st = STATUS_INFO[ss.status] || STATUS_INFO.waiting;
          const isWaiting = ss.status === "waiting";
          const isConfirmed = ss.status === "confirmed";
          return (
            <View key={ss.id} style={[s.card, { backgroundColor: colors.surface, borderColor: isWaiting ? "#D97706" : colors.border, borderWidth: isWaiting ? 1.5 : 1 }]}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? ss.patientAr : ss.patientEn}</Text>
                  <Text style={[s.plan, { color: colors.muted }]}>{lang === "ar" ? ss.planAr : ss.planEn}</Text>
                  <Text style={[s.therapist, { color: C }]}>
                    {lang === "ar" ? ss.therapistAr : ss.therapistEn} · {ss.time}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[s.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                  </View>
                  <View style={[s.sessBadge, { backgroundColor: C + "20" }]}>
                    <Text style={[s.sessText, { color: C }]}>{t("جلسة", "Session")} {ss.sessNum}</Text>
                  </View>
                  <Text style={[s.amount, { color: C }]}>{ss.amount} {t("ريال", "SAR")}</Text>
                </View>
              </View>

              {isWaiting && (
                <View style={[s.actionRow, { borderTopColor: "#D97706" + "30" }]}>
                  <Pressable style={[s.rejectBtn, { borderColor: "#EF4444" }]} onPress={() => handleReject(ss.id)}>
                    <Feather name="x" size={15} color="#EF4444" />
                    <Text style={[s.actionText, { color: "#EF4444" }]}>{t("رفض", "Reject")}</Text>
                  </Pressable>
                  <Pressable style={[s.acceptBtn, { backgroundColor: "#059669" }]} onPress={() => handleAccept(ss.id)}>
                    <Feather name="check" size={15} color="#fff" />
                    <Text style={[s.actionText, { color: "#fff" }]}>{t("قبول الحجز", "Accept Booking")}</Text>
                  </Pressable>
                </View>
              )}

              {isConfirmed && (
                <Pressable style={[s.completeBtn, { backgroundColor: "#6366F1" + "10", borderColor: "#6366F1" + "40" }]}
                  onPress={() => handleComplete(ss.id)}>
                  <Feather name="check-circle" size={14} color="#6366F1" />
                  <Text style={[s.actionText, { color: "#6366F1" }]}>{t("تسجيل اكتمال الجلسة", "Mark Session Complete")}</Text>
                </Pressable>
              )}
            </View>
          );
        })}
        {shown.length === 0 && (
          <View style={s.empty}>
            <Feather name="calendar" size={40} color={colors.muted} />
            <Text style={[s.emptyText, { color: colors.muted }]}>{t("لا توجد جلسات", "No sessions scheduled")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  alertBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 16, marginTop: 10, marginBottom: 2, borderRadius: 12, padding: 12, borderWidth: 1.5 },
  alertText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tabRow: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  card: { borderRadius: 16, padding: 14 },
  cardTop: { flexDirection: "row-reverse", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  sessBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  sessText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  name: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 3 },
  plan: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 3 },
  therapist: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  amount: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  actionRow: { flexDirection: "row-reverse", gap: 10, borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  acceptBtn: { flex: 2, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 11, borderRadius: 12 },
  rejectBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  actionText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  completeBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginTop: 10 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
