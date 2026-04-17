import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#6366F1";

export default function SpaIndex() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "حجوزات اليوم", labelEn: "Today's Bookings", value: "9", delta: "+2", up: true, icon: "calendar" as const },
    { labelAr: "إيراد الأسبوع", labelEn: "Weekly Revenue", value: "3,420", delta: "+22%", up: true, icon: "dollar-sign" as const },
    { labelAr: "الغرف المتاحة", labelEn: "Available Rooms", value: "4", delta: "", up: true, icon: "home" as const },
    { labelAr: "متوسط التقييم", labelEn: "Avg. Rating", value: "4.7 ★", delta: "", up: true, icon: "star" as const },
  ];

  const BOOKINGS = [
    { nameAr: "خالد المنصور", nameEn: "Khalid Al-Mansour", serviceAr: "تدليك سويدي 60 د", serviceEn: "Swedish Massage 60 min", time: "10:00", roomAr: "غرفة 1", roomEn: "Room 1", color: "#6366F1" },
    { nameAr: "عمر الدوسري", nameEn: "Omar Al-Dossari", serviceAr: "حمام بخار + ساونا", serviceEn: "Steam Bath + Sauna", time: "11:00", roomAr: "غرفة 3", roomEn: "Room 3", color: "#4F46E5" },
    { nameAr: "لمياء الزهراني", nameEn: "Lamia Al-Zahrani", serviceAr: "تدليك بالأحجار", serviceEn: "Hot Stone Massage", time: "13:30", roomAr: "غرفة 2", roomEn: "Room 2", color: "#7C3AED" },
    { nameAr: "نوف العسيري", nameEn: "Nouf Al-Asiri", serviceAr: "باقة الاسترخاء", serviceEn: "Relaxation Package", time: "15:00", roomAr: "غرفة 4", roomEn: "Room 4", color: "#818CF8" },
  ];

  const QUICK = [
    { labelAr: "حجز جديد", labelEn: "New Booking", icon: "plus-circle" as const, route: "/business-spa/bookings" },
    { labelAr: "الخدمات", labelEn: "Services", icon: "heart" as const, route: "/business-spa/services" },
    { labelAr: "الغرف", labelEn: "Rooms", icon: "home" as const, route: "/business-spa/rooms" },
    { labelAr: "المعالجون", labelEn: "Therapists", icon: "users" as const, route: "/business-spa/staff" },
    { labelAr: "العروض", labelEn: "Offers", icon: "tag" as const, route: "/business-spa/offers" },
    { labelAr: "معاينة", labelEn: "Preview", icon: "eye" as const, route: "/business-spa/spa-preview" },
  ];

  const ROOMS = [
    { num: "1", statusAr: "مشغولة", statusEn: "Occupied", color: "#EF4444" },
    { num: "2", statusAr: "مشغولة", statusEn: "Occupied", color: "#EF4444" },
    { num: "3", statusAr: "متاحة", statusEn: "Available", color: "#10B981" },
    { num: "4", statusAr: "متاحة", statusEn: "Available", color: "#10B981" },
    { num: "5", statusAr: "صيانة", statusEn: "Maintenance", color: "#F59E0B" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0A0A2A" : "#EEF2FF" }]}>
      <View style={[styles.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSub}>{t("لوحة تحكم | مركز","Control Panel | Center")}</Text>
          <Text style={styles.headerTitle}>{t("أكسير للمساج والسبا 💆","Akseer Massage & Spa 💆")}</Text>
        </View>
        <View style={{ flexDirection: "row-reverse", gap: 10 }}>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={20} color="#fff" />
            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push("/business-spa/spa-preview" as any)}>
            <Feather name="eye" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
              <View style={[styles.statIcon, { backgroundColor: BRAND + "20" }]}>
                <Feather name={s.icon} size={18} color={BRAND} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
              {s.delta ? <Text style={[styles.statDelta, { color: s.up ? "#10B981" : "#EF4444" }]}>{s.delta}</Text> : null}
            </View>
          ))}
        </View>

        <View style={[styles.roomsCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>{t("إشغال الغرف الآن","Room Occupancy Now")}</Text>
          <View style={styles.roomsRow}>
            {ROOMS.map((r) => (
              <View key={r.num} style={[styles.roomCell, { backgroundColor: r.color + "20", borderColor: r.color + "40" }]}>
                <Text style={[styles.roomNum, { color: r.color }]}>{r.num}</Text>
                <Text style={[styles.roomStatus, { color: r.color }]}>{lang === "ar" ? r.statusAr : r.statusEn}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("إجراءات سريعة","Quick Actions")}</Text>
          <View style={styles.quickGrid}>
            {QUICK.map((q, i) => (
              <Pressable key={i} style={[styles.quickCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "25" }]}
                onPress={() => router.push(q.route as any)}>
                <View style={[styles.quickIcon, { backgroundColor: BRAND + "20" }]}>
                  <Feather name={q.icon} size={22} color={BRAND} />
                </View>
                <Text style={[styles.quickLabel, { color: colors.text }]}>{lang === "ar" ? q.labelAr : q.labelEn}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("حجوزات اليوم","Today's Bookings")}</Text>
            <Pressable onPress={() => router.push("/business-spa/bookings" as any)}>
              <Text style={[styles.seeAll, { color: BRAND }]}>{t("عرض الكل","View All")}</Text>
            </Pressable>
          </View>
          {BOOKINGS.map((b, i) => (
            <View key={i} style={[styles.bookCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: b.color + "30" }]}>
              <View style={[styles.bookRoomBadge, { backgroundColor: b.color + "20" }]}>
                <Text style={[styles.bookRoomText, { color: b.color }]}>{lang === "ar" ? b.roomAr : b.roomEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bookName, { color: colors.text }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                <Text style={[styles.bookService, { color: colors.muted }]}>{lang === "ar" ? b.serviceAr : b.serviceEn}</Text>
              </View>
              <Text style={[styles.bookTime, { color: b.color }]}>{b.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "Tajawal_400Regular", textAlign: "right" },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "right" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: "#FCD34D", alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 9, fontFamily: "Tajawal_700Bold", color: "#78350F" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", padding: 16, gap: 12 },
  statCard: { width: "47%", flexGrow: 1, borderRadius: 16, padding: 14, borderWidth: 1, gap: 4, alignItems: "flex-end" },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  statLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statDelta: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  roomsCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  roomsRow: { flexDirection: "row-reverse", gap: 10 },
  roomCell: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
  roomNum: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  roomStatus: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  quickCard: { width: "30%", flexGrow: 1, minWidth: 90, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: "center", gap: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  bookCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  bookRoomBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  bookRoomText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bookName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  bookService: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  bookTime: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
