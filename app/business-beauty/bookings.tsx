import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#BE185D";

const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "#059669" },
  waiting: { ar: "في الانتظار", en: "Waiting", color: "#D97706" },
  completed: { ar: "مكتمل", en: "Completed", color: "#6366F1" },
  cancelled: { ar: "ملغى", en: "Cancelled", color: "#EF4444" },
};

const BOOKINGS = [
  { id: 1, nameAr: "سارة العنزي", nameEn: "Sara Al-Anazi", serviceAr: "صبغة شعر", serviceEn: "Hair Color", time: "10:00", dateAr: "اليوم", dateEn: "Today", specialistAr: "نورة", specialistEn: "Noura", status: "confirmed", amount: 250 },
  { id: 2, nameAr: "منى الشمري", nameEn: "Muna Al-Shammari", serviceAr: "مكياج", serviceEn: "Makeup", time: "11:30", dateAr: "اليوم", dateEn: "Today", specialistAr: "لمياء", specialistEn: "Lamia", status: "confirmed", amount: 350 },
  { id: 3, nameAr: "رنا الحربي", nameEn: "Rana Al-Harbi", serviceAr: "مانيكير", serviceEn: "Manicure", time: "14:00", dateAr: "اليوم", dateEn: "Today", specialistAr: "سلمى", specialistEn: "Salma", status: "waiting", amount: 120 },
  { id: 4, nameAr: "فاطمة العتيبي", nameEn: "Fatima Al-Otaibi", serviceAr: "عناية بشرة", serviceEn: "Skin Care", time: "10:30", dateAr: "غداً", dateEn: "Tomorrow", specialistAr: "هيا", specialistEn: "Haya", status: "confirmed", amount: 200 },
  { id: 5, nameAr: "لمى القحطاني", nameEn: "Lama Al-Qahtani", serviceAr: "إزالة شعر", serviceEn: "Hair Removal", time: "12:00", dateAr: "غداً", dateEn: "Tomorrow", specialistAr: "سلمى", specialistEn: "Salma", status: "confirmed", amount: 160 },
  { id: 6, nameAr: "نوف العسيري", nameEn: "Nouf Al-Asiri", serviceAr: "تسريحة", serviceEn: "Hairstyle", time: "15:00", dateAr: "أمس", dateEn: "Yesterday", specialistAr: "نورة", specialistEn: "Noura", status: "completed", amount: 80 },
];

export default function BeautyBookings() {
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
    <View style={[s.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
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
            <Pressable key={b.id} style={[s.card, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? b.nameAr : b.nameEn, `${t("الخدمة:","Service:")} ${lang === "ar" ? b.serviceAr : b.serviceEn}\n${t("الوقت:","Time:")} ${b.time}\n${t("المختصة:","Specialist:")} ${lang === "ar" ? b.specialistAr : b.specialistEn}\n${t("المبلغ:","Amount:")} ${b.amount} SAR`)}>
              <View style={{ flex: 1 }}>
                <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                <Text style={[s.service, { color: colors.muted }]}>{lang === "ar" ? b.serviceAr : b.serviceEn} · {lang === "ar" ? b.specialistAr : b.specialistEn}</Text>
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
});
