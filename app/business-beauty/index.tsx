import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BusinessHeader from "@/components/BusinessHeader";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BeautyIndex() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [notifOpen, setNotifOpen] = useState(false);
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "حجوزات اليوم", labelEn: "Today's Bookings", value: "12", delta: "+3", up: true, icon: "calendar" as const },
    { labelAr: "إيراد الأسبوع", labelEn: "Weekly Revenue", value: "2,840", delta: "+18%", up: true, icon: "dollar-sign" as const },
    { labelAr: "عملاء جدد", labelEn: "New Clients", value: "5", delta: "+2", up: true, icon: "users" as const },
    { labelAr: "تقييم المركز", labelEn: "Center Rating", value: "4.8 ★", delta: "", up: true, icon: "star" as const },
  ];

  const UPCOMING = [
    { nameAr: "سارة العنزي", nameEn: "Sara Al-Anazi", serviceAr: "صبغة شعر وتسريحة", serviceEn: "Hair Color & Styling", time: "10:00", specialistAr: "نورة", specialistEn: "Noura", color: "#BE185D" },
    { nameAr: "منى الشمري", nameEn: "Muna Al-Shammari", serviceAr: "عناية بالبشرة", serviceEn: "Skin Care", time: "11:30", specialistAr: "هيا", specialistEn: "Haya", color: "#9D174D" },
    { nameAr: "رنا الحربي", nameEn: "Rana Al-Harbi", serviceAr: "مكياج سواريه", serviceEn: "Evening Makeup", time: "13:00", specialistAr: "لمياء", specialistEn: "Lamia", color: "#DB2777" },
    { nameAr: "فاطمة العتيبي", nameEn: "Fatima Al-Otaibi", serviceAr: "مانيكير وباديكير", serviceEn: "Manicure & Pedicure", time: "14:30", specialistAr: "سلمى", specialistEn: "Salma", color: "#EC4899" },
  ];

  const QUICK = [
    { labelAr: "إضافة حجز", labelEn: "Add Booking", icon: "calendar" as const, route: "/business-beauty/bookings" },
    { labelAr: "الخدمات", labelEn: "Services", icon: "scissors" as const, route: "/business-beauty/services" },
    { labelAr: "الموظفات", labelEn: "Staff", icon: "users" as const, route: "/business-beauty/staff" },
    { labelAr: "العروض", labelEn: "Offers", icon: "tag" as const, route: "/business-beauty/offers" },
    { labelAr: "معرض الأعمال", labelEn: "Portfolio", icon: "image" as const, route: "/business-beauty/gallery" },
    { labelAr: "معاينة", labelEn: "Preview", icon: "eye" as const, route: "/business-beauty/beauty-preview" },
  ];

  const TOP_SERVICES = [
    { nameAr: "شعر (صبغ / قص / تسريح)", nameEn: "Hair (Color/Cut/Style)", pct: 42, count: 18 },
    { nameAr: "عناية بالبشرة", nameEn: "Skin Care", pct: 25, count: 11 },
    { nameAr: "مكياج", nameEn: "Makeup", pct: 18, count: 8 },
    { nameAr: "أظافر", nameEn: "Nails", pct: 10, count: 4 },
    { nameAr: "إزالة الشعر", nameEn: "Hair Removal", pct: 5, count: 2 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <BusinessHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "30" }]}>
              <View style={[styles.statIcon, { backgroundColor: BRAND + "20" }]}>
                <Feather name={s.icon} size={18} color={BRAND} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
              {s.delta ? <Text style={[styles.statDelta, { color: s.up ? "#10B981" : "#EF4444" }]}>{s.delta}</Text> : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("إجراءات سريعة","Quick Actions")}</Text>
          <View style={styles.quickGrid}>
            {QUICK.map((q, i) => (
              <Pressable key={i} style={[styles.quickCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "25" }]}
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
            <Pressable onPress={() => router.push("/business-beauty/bookings" as any)}>
              <Text style={[styles.seeAll, { color: BRAND }]}>{t("عرض الكل","View All")}</Text>
            </Pressable>
          </View>
          {UPCOMING.map((a, i) => (
            <View key={i} style={[styles.apptCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: a.color + "30" }]}>
              <View style={[styles.apptDot, { backgroundColor: a.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.apptName, { color: colors.text }]}>{lang === "ar" ? a.nameAr : a.nameEn}</Text>
                <Text style={[styles.apptService, { color: colors.muted }]}>{lang === "ar" ? a.serviceAr : a.serviceEn}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={[styles.apptTime, { color: a.color }]}>{a.time}</Text>
                <View style={[styles.specialistBadge, { backgroundColor: a.color + "15" }]}>
                  <Text style={[styles.specialistText, { color: a.color }]}>{lang === "ar" ? a.specialistAr : a.specialistEn}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("الخدمات الأكثر طلباً","Most Requested Services")}</Text>
          {TOP_SERVICES.map((s, i) => (
            <View key={i} style={styles.rankRow}>
              <Text style={[styles.rankCount, { color: BRAND }]}>{s.count}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.rankName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                <View style={[styles.barTrack, { backgroundColor: isDark ? "#3D0030" : "#FCE7F3" }]}>
                  <View style={[styles.barFill, { width: `${s.pct}%` as any, backgroundColor: BRAND }]} />
                </View>
              </View>
              <Text style={[styles.rankPct, { color: colors.muted }]}>{s.pct}%</Text>
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
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  quickCard: { width: "30%", flexGrow: 1, minWidth: 90, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: "center", gap: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  apptCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  apptDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  apptName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  apptService: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  apptTime: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  specialistBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  specialistText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  rankRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 10 },
  rankCount: { fontSize: 14, fontFamily: "Cairo_700Bold", width: 28, textAlign: "center" },
  rankName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  rankPct: { fontSize: 12, fontFamily: "Tajawal_400Regular", width: 36, textAlign: "left" },
});
