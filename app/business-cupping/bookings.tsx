import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#92400E";

const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "#059669" },
  waiting: { ar: "في الانتظار", en: "Waiting", color: "#D97706" },
  completed: { ar: "مكتمل", en: "Completed", color: "#6366F1" },
  cancelled: { ar: "ملغى", en: "Cancelled", color: "#EF4444" },
};

const BOOKINGS = [
  { id: 1, nameAr: "عبدالله المطيري", nameEn: "Abdullah Al-Mutairi", typeAr: "حجامة رطبة", typeEn: "Wet Cupping", time: "09:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "أبو خالد", therapistEn: "Abu Khalid", homeVisit: false, status: "confirmed", amount: 280 },
  { id: 2, nameAr: "سلطان القحطاني", nameEn: "Sultan Al-Qahtani", typeAr: "حجامة جافة", typeEn: "Dry Cupping", time: "10:30", dateAr: "اليوم", dateEn: "Today", therapistAr: "أبو عمر", therapistEn: "Abu Omar", homeVisit: false, status: "confirmed", amount: 180 },
  { id: 3, nameAr: "محمد العتيبي", nameEn: "Mohammed Al-Otaibi", typeAr: "حجامة وجه", typeEn: "Facial Cupping", time: "12:00", dateAr: "اليوم", dateEn: "Today", therapistAr: "أبو خالد", therapistEn: "Abu Khalid", homeVisit: false, status: "waiting", amount: 200 },
  { id: 4, nameAr: "فهد الشهري", nameEn: "Fahad Al-Shahri", typeAr: "حجامة ظهر", typeEn: "Back Cupping", time: "08:00", dateAr: "غداً", dateEn: "Tomorrow", therapistAr: "أبو سعد", therapistEn: "Abu Saad", homeVisit: true, status: "confirmed", amount: 320 },
  { id: 5, nameAr: "ناصر الدوسري", nameEn: "Nasser Al-Dossari", typeAr: "حجامة رطبة", typeEn: "Wet Cupping", time: "11:00", dateAr: "غداً", dateEn: "Tomorrow", therapistAr: "أبو عمر", therapistEn: "Abu Omar", homeVisit: false, status: "confirmed", amount: 280 },
];

export default function CuppingBookings() {
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
    <View style={[s.container, { backgroundColor: isDark ? "#1A0E00" : "#FFFBEB" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("الحجوزات","Bookings")}</Text>
        <Pressable style={s.addBtn} onPress={() => Alert.alert(t("حجز جديد","New Booking"), t("سيتم فتح نموذج حجز جديد","A new booking form will open"))}>
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
            <Pressable key={b.id} style={[s.card, { backgroundColor: isDark ? "#2A1500" : "#fff", borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? b.nameAr : b.nameEn, `${t("النوع:","Type:")} ${lang === "ar" ? b.typeAr : b.typeEn}\n${t("الوقت:","Time:")} ${b.time}\n${t("المعالج:","Therapist:")} ${lang === "ar" ? b.therapistAr : b.therapistEn}`)}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  {b.homeVisit && (
                    <View style={s.homeBadge}>
                      <Feather name="home" size={10} color="#6366F1" />
                      <Text style={s.homeText}>{t("منزلي","Home")}</Text>
                    </View>
                  )}
                  <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                </View>
                <Text style={[s.service, { color: colors.muted }]}>{lang === "ar" ? b.typeAr : b.typeEn} · {lang === "ar" ? b.therapistAr : b.therapistEn}</Text>
                <Text style={[s.time, { color: BRAND }]}>{b.time} — {lang === "ar" ? b.dateAr : b.dateEn}</Text>
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  amount: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  homeBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 3, backgroundColor: "#6366F120", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  homeText: { fontSize: 9, fontFamily: "Tajawal_700Bold", color: "#6366F1" },
});
