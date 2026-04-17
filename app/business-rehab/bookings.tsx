import { Feather } from "@expo/vector-icons";
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

const BOOKINGS = [
  { id: 1, nameAr: "سعد الغامدي", nameEn: "Saad Al-Ghamdi", planAr: "إعادة تأهيل ركبة", planEn: "Knee Rehabilitation", time: "09:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", sessions: "8/12", status: "confirmed", amount: 350 },
  { id: 2, nameAr: "ريم المالكي", nameEn: "Reem Al-Maliki", planAr: "علاج آلام الظهر", planEn: "Back Pain Therapy", time: "10:30", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. سمر", therapistEn: "Dr. Samar", sessions: "3/8", status: "confirmed", amount: 280 },
  { id: 3, nameAr: "بدر العتيبي", nameEn: "Badr Al-Otaibi", planAr: "تأهيل ما بعد جراحة", planEn: "Post-Surgery Rehab", time: "12:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", sessions: "5/16", status: "waiting", amount: 400 },
  { id: 4, nameAr: "هند الزهراني", nameEn: "Hind Al-Zahrani", planAr: "علاج طبيعي عام", planEn: "General Physiotherapy", time: "14:30", dateAr: "اليوم", dateEn: "Today", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", sessions: "2/6", status: "confirmed", amount: 250 },
  { id: 5, nameAr: "عبدالعزيز الشهري", nameEn: "Abdulaziz Al-Shahri", planAr: "تأهيل رياضي", planEn: "Sports Rehabilitation", time: "09:00", dateAr: "غداً", dateEn: "Tomorrow", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", sessions: "1/10", status: "confirmed", amount: 300 },
];

export default function RehabBookings() {
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

  const shown = tab === "all" ? BOOKINGS : BOOKINGS.filter((b) => {
    if (tab === "today") return b.dateAr === "اليوم";
    return b.dateAr === "غداً";
  });

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#001A12" : "#ECFDF5" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("الحجوزات","Bookings")}</Text>
        <Pressable style={s.addBtn} onPress={() => Alert.alert(t("جلسة جديدة","New Session"), t("سيتم فتح نموذج جلسة جديدة","A new session form will open"))}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
      </View>
      <View style={s.tabRow}>
        {TABS.map((tb) => (
          <Pressable key={tb.key} style={[s.tab, tab === tb.key && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb.key)}>
            <Text style={[s.tabText, { color: tab === tb.key ? BRAND : colors.muted }]}>{lang === "ar" ? tb.labelAr : tb.labelEn}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}>
        {shown.map((b) => {
          const st = STATUS_MAP[b.status];
          return (
            <Pressable key={b.id} style={[s.card, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? b.nameAr : b.nameEn, `${t("الخطة:","Plan:")} ${lang === "ar" ? b.planAr : b.planEn}\n${t("الوقت:","Time:")} ${b.time}\n${t("المعالج:","Therapist:")} ${lang === "ar" ? b.therapistAr : b.therapistEn}\n${t("الجلسة:","Session:")} ${b.sessions}`)}>
              <View style={{ flex: 1 }}>
                <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                <Text style={[s.service, { color: colors.muted }]}>{lang === "ar" ? b.planAr : b.planEn}</Text>
                <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                  <Text style={[s.time, { color: BRAND }]}>{b.time} — {lang === "ar" ? b.dateAr : b.dateEn}</Text>
                  <View style={[s.sessBadge, { backgroundColor: BRAND + "15" }]}>
                    <Text style={[s.sessText, { color: BRAND }]}>{t("جلسة","Session")} {b.sessions}</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[s.statusBadge, { backgroundColor: st.color + "20" }]}>
                  <Text style={[s.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                </View>
                <Text style={[s.amount, { color: BRAND }]}>{b.amount} SAR</Text>
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
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff" },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row-reverse", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  card: { flexDirection: "row-reverse", justifyContent: "space-between", padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  name: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  service: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 4 },
  time: { fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "right" },
  sessBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sessText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  amount: { fontSize: 13, fontFamily: "Cairo_700Bold" },
});
