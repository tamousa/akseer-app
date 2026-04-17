import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";

const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "#059669" },
  waiting: { ar: "في الانتظار", en: "Waiting", color: "#D97706" },
  completed: { ar: "مكتمل", en: "Completed", color: "#6366F1" },
  cancelled: { ar: "ملغى", en: "Cancelled", color: "#EF4444" },
};

const SESSIONS = [
  { id: 1, patientAr: "سعد الغامدي", patientEn: "Saad Al-Ghamdi", planAr: "إعادة تأهيل ركبة", planEn: "Knee Rehabilitation", sessNum: "8/12", time: "09:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", status: "confirmed", amount: 350 },
  { id: 2, patientAr: "ريم المالكي", patientEn: "Reem Al-Maliki", planAr: "علاج آلام الظهر", planEn: "Back Pain Therapy", sessNum: "3/8", time: "10:30", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. سمر", therapistEn: "Dr. Samar", status: "confirmed", amount: 280 },
  { id: 3, patientAr: "بدر العتيبي", patientEn: "Badr Al-Otaibi", planAr: "تأهيل ما بعد جراحة", planEn: "Post-Surgery Rehab", sessNum: "5/16", time: "12:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", status: "waiting", amount: 350 },
  { id: 4, patientAr: "هند الزهراني", patientEn: "Hind Al-Zahrani", planAr: "علاج طبيعي عام", planEn: "General Physiotherapy", sessNum: "2/6", time: "14:30", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", status: "confirmed", amount: 220 },
  { id: 5, patientAr: "طلال النجار", patientEn: "Talal Al-Najjar", planAr: "تأهيل رياضي", planEn: "Sports Rehabilitation", sessNum: "6/10", time: "09:00", dateAr: "غداً", dateEn: "Tomorrow", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", status: "confirmed", amount: 320 },
];

export default function RehabSessions() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const [tab, setTab] = useState<"today" | "tomorrow" | "all">("today");

  const TABS = [
    { key: "today" as const, labelAr: "اليوم", labelEn: "Today" },
    { key: "tomorrow" as const, labelAr: "غداً", labelEn: "Tomorrow" },
    { key: "all" as const, labelAr: "الكل", labelEn: "All" },
  ];

  const shown = tab === "all" ? SESSIONS : SESSIONS.filter((s) => {
    if (tab === "today") return s.dateAr === "اليوم";
    return s.dateAr === "غداً";
  });

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#001A12" : "#ECFDF5" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("الجلسات","Sessions")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={s.addBtn} onPress={() => router.push("/business-rehab/packages" as any)}>
            <Feather name="package" size={18} color="#fff" />
          </Pressable>
          <Pressable style={s.addBtn} onPress={() => router.push("/business-rehab/add-service" as any)}>
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      <View style={s.tabRow}>
        {TABS.map((tb) => (
          <Pressable key={tb.key} style={[s.tab, tab === tb.key && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb.key)}>
            <Text style={[s.tabText, { color: tab === tb.key ? BRAND : colors.muted }]}>{lang === "ar" ? tb.labelAr : tb.labelEn}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}>
        {shown.map((ss) => {
          const st = STATUS_MAP[ss.status];
          return (
            <Pressable key={ss.id} style={[s.card, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? ss.patientAr : ss.patientEn, `${t("الخطة:","Plan:")} ${lang === "ar" ? ss.planAr : ss.planEn}\n${t("الوقت:","Time:")} ${ss.time}\n${t("المعالج:","Therapist:")} ${lang === "ar" ? ss.therapistAr : ss.therapistEn}`)}>
              <View style={{ flex: 1 }}>
                <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? ss.patientAr : ss.patientEn}</Text>
                <Text style={[s.plan, { color: colors.muted }]}>{lang === "ar" ? ss.planAr : ss.planEn}</Text>
                <Text style={[s.therapist, { color: BRAND }]}>{lang === "ar" ? ss.therapistAr : ss.therapistEn} · {ss.time}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[s.statusBadge, { backgroundColor: st.color + "20" }]}>
                  <Text style={[s.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                </View>
                <View style={[s.sessBadge, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[s.sessText, { color: BRAND }]}>{t("جلسة","Session")} {ss.sessNum}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row-reverse", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  card: { flexDirection: "row-reverse", justifyContent: "space-between", padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  name: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 3 },
  plan: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 3 },
  therapist: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  sessBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  sessText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
