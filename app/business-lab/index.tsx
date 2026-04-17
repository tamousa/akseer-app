import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0369A1";

export default function LabHome() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "حجوزات اليوم", labelEn: "Today's Bookings", value: "18", changeAr: "+5", changeEn: "+5", icon: "calendar" as const, color: C },
    { labelAr: "منتظر النتائج", labelEn: "Pending Results", value: "7", changeAr: "جديد", changeEn: "New", icon: "clock" as const, color: "#D97706" },
    { labelAr: "إيرادات اليوم", labelEn: "Today's Revenue", value: "2,840", changeAr: "+22%", changeEn: "+22%", icon: "trending-up" as const, color: "#059669" },
    { labelAr: "التقييم", labelEn: "Rating", value: "4.8", changeAr: "★", changeEn: "★", icon: "star" as const, color: "#7C3AED" },
  ];

  const QUICK = [
    { labelAr: "حجز جديد", labelEn: "New Booking", icon: "calendar" as const, color: C, bg: "#DBEAFE", route: "/business-lab/bookings" },
    { labelAr: "رفع نتائج", labelEn: "Upload Results", icon: "upload" as const, color: "#059669", bg: "#D1FAE5", route: "/business-lab/results" },
    { labelAr: "الخدمة المنزلية", labelEn: "Home Visits", icon: "home" as const, color: "#7C3AED", bg: "#EDE9FE", route: "/business-lab/home-visits" },
    { labelAr: "الكتالوج", labelEn: "Catalog", icon: "list" as const, color: "#D97706", bg: "#FEF3C7", route: "/business-lab/catalog" },
  ];

  const TODAY_BOOKINGS = [
    { id: "LAB-801", time: "08:30", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", testsAr: "صورة دم كاملة + سكر", testsEn: "CBC + Fasting Glucose", typeAr: "حضوري", typeEn: "In-Lab", typeIcon: "🏥", statusAr: "مكتمل", statusEn: "Completed", statusColor: C, statusBg: "#DBEAFE" },
    { id: "LAB-802", time: "09:00", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", testsAr: "باقة الفحص الشامل", testsEn: "Comprehensive Panel", typeAr: "حضوري", typeEn: "In-Lab", typeIcon: "🏥", statusAr: "جاري", statusEn: "Processing", statusColor: "#059669", statusBg: "#D1FAE5" },
    { id: "LAB-803", time: "10:30", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", testsAr: "هرمونات الغدة الدرقية", testsEn: "Thyroid Hormones TSH/T3/T4", typeAr: "منزلي", typeEn: "Home Visit", typeIcon: "🏠", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#D97706", statusBg: "#FEF3C7" },
    { id: "LAB-804", time: "11:00", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", testsAr: "وظائف الكبد والكلى", testsEn: "Liver & Kidney Function", typeAr: "حضوري", typeEn: "In-Lab", typeIcon: "🏥", statusAr: "انتظار", statusEn: "Waiting", statusColor: "#6B7280", statusBg: "#F3F4F6" },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={[styles.avatarCircle, { backgroundColor: C + "30" }]}>
          <Text style={{ fontSize: 18 }}>🔬</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={[styles.greeting, { color: colors.muted }]}>{t("مرحباً، إدارة","Welcome, Management")}</Text>
          <Text style={[styles.labName, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("مختبر التشخيص الطبي","Medical Diagnostics Lab")}</Text>
        </View>
        <Pressable style={[styles.notifBtn, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE" }]}>
          <Feather name="bell" size={20} color={C} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: isDark ? "#0A2040" : C }]}>
        <View>
          <Text style={styles.heroTitle}>{t("اليوم، 29 مارس","Today, March 29")}</Text>
          <Text style={styles.heroSub}>{t("18 حجزاً · 7 نتائج بانتظار الرفع","18 bookings · 7 results pending upload")}</Text>
          <View style={styles.heroTags}>
            <View style={styles.heroTag}><Text style={styles.heroTagText}>🏥 12 {t("حضوري","in-lab")}</Text></View>
            <View style={styles.heroTag}><Text style={styles.heroTagText}>🏠 6 {t("منزلي","home")}</Text></View>
          </View>
        </View>
        <Text style={{ fontSize: 44 }}>🔬</Text>
      </View>

      <Pressable style={[styles.previewBtn, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE", borderColor: C + "50" }]}
        onPress={() => router.push("/business-lab/lab-preview" as any)}>
        <Feather name="eye" size={15} color={C} />
        <Text style={[styles.previewBtnText, { color: C }]}>{t("معاينة كيف يظهر مختبرك للمرضى في أكسير","Preview how your lab appears to patients in Akseer")}</Text>
        <Feather name="chevron-left" size={15} color={C} />
      </Pressable>

      <View style={styles.statsGrid}>
        {STATS.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
              <Feather name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#0A1F35" }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
            <Text style={[styles.statChange, { color: s.color }]}>{lang === "ar" ? s.changeAr : s.changeEn}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#0A1F35", marginHorizontal: 20 }]}>{t("إجراءات سريعة","Quick Actions")}</Text>
      <View style={styles.quickGrid}>
        {QUICK.map((q, i) => (
          <Pressable key={i} style={[styles.quickCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push(q.route as any)}>
            <View style={[styles.quickIcon, { backgroundColor: isDark ? q.color + "25" : q.bg }]}>
              <Feather name={q.icon} size={22} color={q.color} />
            </View>
            <Text style={[styles.quickLabel, { color: isDark ? "#C0D8E8" : "#0A1F35" }]}>{lang === "ar" ? q.labelAr : q.labelEn}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Pressable onPress={() => router.push("/business-lab/bookings" as any)}>
          <Text style={[styles.seeAll, { color: C }]}>{t("عرض الكل","View All")}</Text>
        </Pressable>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("حجوزات اليوم","Today's Bookings")}</Text>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {TODAY_BOOKINGS.map((bk, i) => (
          <View key={i} style={[styles.bkCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.bkStatus, { backgroundColor: bk.statusBg }]}>
              <Text style={[styles.bkStatusText, { color: bk.statusColor }]}>{lang === "ar" ? bk.statusAr : bk.statusEn}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.bkTop}>
                <Text style={[styles.bkType, { color: colors.muted }]}>{bk.typeIcon} {lang === "ar" ? bk.typeAr : bk.typeEn}</Text>
                <Text style={[styles.bkPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? bk.patientAr : bk.patientEn}</Text>
              </View>
              <Text style={[styles.bkMeta, { color: colors.muted }]} numberOfLines={1}>{lang === "ar" ? bk.testsAr : bk.testsEn}</Text>
            </View>
            <View style={[styles.bkTime, { backgroundColor: C + "20" }]}>
              <Feather name="clock" size={11} color={C} />
              <Text style={[styles.bkTimeText, { color: C }]}>{bk.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  avatarCircle: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1 },
  greeting: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  labName: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  notifBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", position: "absolute", top: 8, right: 8 },
  heroBanner: { marginHorizontal: 20, borderRadius: 20, padding: 20, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  heroTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", marginBottom: 8 },
  heroTags: { flexDirection: "row-reverse", gap: 8 },
  heroTag: { backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  heroTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#fff" },
  previewBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", marginHorizontal: 20, marginBottom: 20, padding: 13, borderRadius: 14, borderWidth: 1 },
  previewBtnText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 12, marginBottom: 24 },
  statCard: { width: "47%", borderRadius: 18, padding: 16, borderWidth: 1, gap: 4 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  statChange: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", marginBottom: 14 },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 12, marginBottom: 24 },
  quickCard: { width: "47%", borderRadius: 18, padding: 16, alignItems: "center", gap: 10, borderWidth: 1 },
  quickIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  sectionRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  bkCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  bkStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bkStatusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  bkTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  bkPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  bkType: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bkMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bkTime: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  bkTimeText: { fontSize: 13, fontFamily: "Cairo_700Bold" },
});
