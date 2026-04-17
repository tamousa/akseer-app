import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#6366F1";

type RoomStatusKey = "busy" | "available" | "maintenance" | "reserved";

const STATUS_MAP: Record<RoomStatusKey, { ar: string; en: string; color: string; bg: string }> = {
  busy:        { ar: "مشغولة",  en: "Busy",        color: "#EF4444", bg: "#FEE2E2" },
  available:   { ar: "متاحة",  en: "Available",   color: "#059669", bg: "#DCFCE7" },
  maintenance: { ar: "صيانة",  en: "Maintenance", color: "#D97706", bg: "#FEF3C7" },
  reserved:    { ar: "محجوزة", en: "Reserved",    color: "#6366F1", bg: "#EEF2FF" },
};

const ROOMS = [
  { id: 1, nameAr: "غرفة 1", nameEn: "Room 1", status: "busy" as RoomStatusKey, clientAr: "خالد المنصور", clientEn: "Khalid Al-Mansour", serviceAr: "تدليك سويدي", serviceEn: "Swedish Massage", until: "11:00", typeAr: "تدليك", typeEn: "Massage" },
  { id: 2, nameAr: "غرفة 2", nameEn: "Room 2", status: "busy" as RoomStatusKey, clientAr: "لمياء الزهراني", clientEn: "Lamia Al-Zahrani", serviceAr: "تدليك أحجار", serviceEn: "Stone Massage", until: "15:00", typeAr: "تدليك", typeEn: "Massage" },
  { id: 3, nameAr: "غرفة 3", nameEn: "Room 3", status: "available" as RoomStatusKey, clientAr: null, clientEn: null, serviceAr: null, serviceEn: null, until: null, typeAr: "تدليك", typeEn: "Massage" },
  { id: 4, nameAr: "غرفة 4", nameEn: "Room 4", status: "reserved" as RoomStatusKey, clientAr: "نوف العسيري", clientEn: "Nouf Al-Asiri", serviceAr: "باقة سبا", serviceEn: "Spa Package", until: "16:00", typeAr: "سبا", typeEn: "Spa" },
  { id: 5, nameAr: "غرفة 5", nameEn: "Room 5", status: "maintenance" as RoomStatusKey, clientAr: null, clientEn: null, serviceAr: null, serviceEn: null, until: t_("غداً","Tomorrow"), typeAr: "بخار", typeEn: "Steam" },
  { id: 6, nameAr: "ساونا", nameEn: "Sauna", status: "available" as RoomStatusKey, clientAr: null, clientEn: null, serviceAr: null, serviceEn: null, until: null, typeAr: "حرارة", typeEn: "Heat" },
  { id: 7, nameAr: "جاكوزي", nameEn: "Jacuzzi", status: "busy" as RoomStatusKey, clientAr: "عمر الدوسري", clientEn: "Omar Al-Dosari", serviceAr: "جاكوزي", serviceEn: "Jacuzzi", until: "12:00", typeAr: "مائي", typeEn: "Aquatic" },
];

function t_(ar: string, en: string) { return ar; }

export default function SpaRooms() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const SUMMARY_KEYS: RoomStatusKey[] = ["busy", "available", "reserved", "maintenance"];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#0A0A2A" : "#EEF2FF" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("الغرف والمرافق","Rooms & Facilities")}</Text>
      </View>
      <View style={[s.summaryRow, { backgroundColor: isDark ? "#12124A" : "#fff", borderBottomColor: colors.border }]}>
        {SUMMARY_KEYS.map((key) => {
          const count = ROOMS.filter((r) => r.status === key).length;
          const cfg = STATUS_MAP[key];
          return (
            <View key={key} style={s.summaryItem}>
              <Text style={[s.summaryNum, { color: cfg.color }]}>{count}</Text>
              <Text style={[s.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? cfg.ar : cfg.en}</Text>
            </View>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 10 }}>
        {ROOMS.map((r) => {
          const cfg = STATUS_MAP[r.status];
          return (
            <Pressable key={r.id} style={[s.roomCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: cfg.color + "30" }]}
              onPress={() => r.clientAr
                ? Alert.alert(lang === "ar" ? r.nameAr : r.nameEn, `${t("العميل:","Client:")} ${lang === "ar" ? r.clientAr : r.clientEn}\n${t("الخدمة:","Service:")} ${lang === "ar" ? r.serviceAr : r.serviceEn}\n${t("حتى:","Until:")} ${r.until}`)
                : Alert.alert(lang === "ar" ? r.nameAr : r.nameEn, r.status === "maintenance" ? `${t("قيد الصيانة حتى:","Maintenance until:")} ${r.until}` : t("الغرفة متاحة للحجز الآن","Room is available for booking"))}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <View style={[s.typeBadge, { backgroundColor: BRAND + "20" }]}><Text style={[s.typeText, { color: BRAND }]}>{lang === "ar" ? r.typeAr : r.typeEn}</Text></View>
                  <Text style={[s.roomName, { color: colors.text }]}>{lang === "ar" ? r.nameAr : r.nameEn}</Text>
                </View>
                {r.clientAr && <Text style={[s.clientText, { color: colors.muted }]}>{lang === "ar" ? r.clientAr : r.clientEn} — {lang === "ar" ? r.serviceAr : r.serviceEn}</Text>}
                {r.until && r.status !== "available" && <Text style={[s.untilText, { color: cfg.color }]}>{t("حتى:","Until:")} {r.until}</Text>}
                {r.status === "available" && <Text style={[s.availText, { color: cfg.color }]}>{t("متاحة للحجز","Available for booking")}</Text>}
              </View>
              <View style={{ alignItems: "flex-end", gap: 8 }}>
                <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[s.statusText, { color: cfg.color }]}>{lang === "ar" ? cfg.ar : cfg.en}</Text>
                </View>
                {r.status === "available" && (
                  <Pressable style={[s.bookBtn, { backgroundColor: BRAND }]} onPress={() => Alert.alert(t("حجز الغرفة","Book Room"), `${t("تعيين حجز لـ:","Assign booking for:")} ${lang === "ar" ? r.nameAr : r.nameEn}`)}>
                    <Text style={s.bookBtnText}>{t("احجز","Book")}</Text>
                  </Pressable>
                )}
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
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "right" },
  summaryRow: { flexDirection: "row-reverse", justifyContent: "space-around", padding: 16, borderBottomWidth: 1 },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryNum: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  roomCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  roomName: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  clientText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  untilText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  availText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
});
