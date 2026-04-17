import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BusinessHeader from "@/components/BusinessHeader";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function CuppingIndex() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "جلسات اليوم", labelEn: "Today's Sessions", value: "8", delta: "+2", up: true, icon: "droplet" as const },
    { labelAr: "إيراد الأسبوع", labelEn: "Weekly Revenue", value: "1,950", delta: "+12%", up: true, icon: "dollar-sign" as const },
    { labelAr: "عملاء جدد", labelEn: "New Clients", value: "3", delta: "+1", up: true, icon: "user-plus" as const },
    { labelAr: "متوسط التقييم", labelEn: "Avg. Rating", value: "4.9 ★", delta: "", up: true, icon: "star" as const },
  ];

  const SESSIONS_TODAY = [
    { nameAr: "عبدالله المطيري", nameEn: "Abdullah Al-Mutairi", typeAr: "حجامة رطبة", typeEn: "Wet Cupping", time: "09:00", therapistAr: "أبو خالد", therapistEn: "Abu Khalid", color: "#B45309" },
    { nameAr: "سلطان القحطاني", nameEn: "Sultan Al-Qahtani", typeAr: "حجامة جافة", typeEn: "Dry Cupping", time: "10:30", therapistAr: "أبو عمر", therapistEn: "Abu Omar", color: "#92400E" },
    { nameAr: "محمد العتيبي", nameEn: "Mohammed Al-Otaibi", typeAr: "حجامة وجه", typeEn: "Facial Cupping", time: "12:00", therapistAr: "أبو خالد", therapistEn: "Abu Khalid", color: "#D97706" },
    { nameAr: "فهد الشهري", nameEn: "Fahad Al-Shahri", typeAr: "حجامة ظهر", typeEn: "Back Cupping", time: "14:00", therapistAr: "أبو سعد", therapistEn: "Abu Saad", color: "#78350F" },
  ];

  const QUICK = [
    { labelAr: "جلسة جديدة", labelEn: "New Session", icon: "plus-circle" as const, route: "/business-cupping/bookings" },
    { labelAr: "الجلسات", labelEn: "Sessions", icon: "droplet" as const, route: "/business-cupping/sessions" },
    { labelAr: "المعالجون", labelEn: "Therapists", icon: "users" as const, route: "/business-cupping/staff" },
    { labelAr: "العروض", labelEn: "Offers", icon: "tag" as const, route: "/business-cupping/offers" },
    { labelAr: "الزيارات المنزلية", labelEn: "Home Visits", icon: "home" as const, route: "/business-cupping/sessions" },
    { labelAr: "معاينة", labelEn: "Preview", icon: "eye" as const, route: "/business-cupping/cupping-preview" },
  ];

  const TOP_TYPES = [
    { nameAr: "حجامة رطبة", nameEn: "Wet Cupping", pct: 38, count: 14 },
    { nameAr: "حجامة جافة", nameEn: "Dry Cupping", pct: 30, count: 11 },
    { nameAr: "حجامة ظهر", nameEn: "Back Cupping", pct: 18, count: 7 },
    { nameAr: "حجامة وجه", nameEn: "Facial Cupping", pct: 9, count: 3 },
    { nameAr: "حجامة قدم", nameEn: "Foot Cupping", pct: 5, count: 2 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BusinessHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View style={[styles.alertBanner, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
          <Feather name="alert-triangle" size={16} color="#D97706" />
          <Text style={[styles.alertText, { color: "#92400E" }]}>{t("تذكير: سجّل بروتوكول التعقيم لجلسات اليوم","Reminder: Record the sterilization protocol for today's sessions")}</Text>
          <Pressable style={styles.alertBtn}>
            <Text style={[styles.alertBtnText, { color: BRAND }]}>{t("تسجيل","Record")}</Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
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
              <Pressable key={i} style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: BRAND + "25" }]}
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("جلسات اليوم","Today's Sessions")}</Text>
            <Pressable onPress={() => router.push("/business-cupping/bookings" as any)}>
              <Text style={[styles.seeAll, { color: BRAND }]}>{t("عرض الكل","View All")}</Text>
            </Pressable>
          </View>
          {SESSIONS_TODAY.map((s, i) => (
            <View key={i} style={[styles.sessCard, { backgroundColor: colors.surface, borderColor: s.color + "30" }]}>
              <View style={[styles.sessTypeBadge, { backgroundColor: s.color + "20" }]}>
                <Feather name="droplet" size={16} color={s.color} />
                <Text style={[styles.sessTypeText, { color: s.color }]}>{lang === "ar" ? s.typeAr : s.typeEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                <Text style={[styles.sessTherapist, { color: colors.muted }]}>{t("المعالج:","Therapist:")} {lang === "ar" ? s.therapistAr : s.therapistEn}</Text>
              </View>
              <Text style={[styles.sessTime, { color: s.color }]}>{s.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("أنواع الحجامة الأكثر طلباً","Most Requested Cupping Types")}</Text>
          {TOP_TYPES.map((s, i) => (
            <View key={i} style={styles.rankRow}>
              <Text style={[styles.rankCount, { color: BRAND }]}>{s.count}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.rankName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                <View style={[styles.barTrack, { backgroundColor: isDark ? "#3A1800" : "#FEF3C7" }]}>
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
  alertBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 8, margin: 16, padding: 12, borderRadius: 12, borderWidth: 1 },
  alertText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  alertBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#FEF3C7", borderRadius: 8 },
  alertBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 16, gap: 12, marginBottom: 8 },
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
  sessCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  sessTypeBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  sessTypeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sessName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sessTherapist: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sessTime: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  rankRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 10 },
  rankCount: { fontSize: 14, fontFamily: "Cairo_700Bold", width: 28, textAlign: "center" },
  rankName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  rankPct: { fontSize: 12, fontFamily: "Tajawal_400Regular", width: 36, textAlign: "left" },
});
