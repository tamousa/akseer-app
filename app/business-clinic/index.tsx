import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function ClinicHome() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "مواعيد اليوم", labelEn: "Today's Appts", value: "12", change: "+3", icon: "calendar" as const, color: C },
    { labelAr: "مرضى جدد", labelEn: "New Patients", value: "5", change: "+2", icon: "user-plus" as const, color: "#059669" },
    { labelAr: "إيرادات اليوم", labelEn: "Today Revenue", value: "3,840 SAR", change: "+18%", icon: "trending-up" as const, color: "#7C3AED" },
    { labelAr: "التقييم العام", labelEn: "Overall Rating", value: "4.9", change: "★", icon: "star" as const, color: "#D97706" },
  ];

  const QUICK = [
    { labelAr: "إضافة موعد", labelEn: "Add Appointment", icon: "calendar" as const, color: C, bg: "#CFFAFE", route: "/business-clinic/appointments" },
    { labelAr: "الكادر الصحي", labelEn: "Medical Staff", icon: "users" as const, color: "#059669", bg: "#D1FAE5", route: "/business-clinic/medical-staff" },
    { labelAr: "الخدمة المنزلية", labelEn: "Home Visits", icon: "home" as const, color: "#7C3AED", bg: "#EDE9FE", route: "/business-clinic/home-visits" },
    { labelAr: "التقارير", labelEn: "Reports", icon: "bar-chart-2" as const, color: "#D97706", bg: "#FEF3C7", route: "/business-clinic/reports" },
  ];

  const TODAY_APPOINTMENTS = [
    { time: "09:00", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", doctor: "د. سارة الدوسري / Dr. Sarah", serviceAr: "استشارة عامة", serviceEn: "General Consultation", typeAr: "حضوري", typeEn: "In-Clinic", typeIcon: "🏥", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5" },
    { time: "10:30", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", doctor: "د. خالد العمري / Dr. Khalid", serviceAr: "جلسة نفسية", serviceEn: "Psychology Session", typeAr: "مرئي", typeEn: "Virtual", typeIcon: "📱", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5" },
    { time: "11:00", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", doctor: "د. سارة الدوسري / Dr. Sarah", serviceAr: "متابعة السكري", serviceEn: "Diabetes Follow-up", typeAr: "حضوري", typeEn: "In-Clinic", typeIcon: "🏥", statusAr: "انتظار", statusEn: "Waiting", statusColor: "#D97706", statusBg: "#FEF3C7" },
    { time: "14:00", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", doctor: "أخ. ريم الحربي / Nurse Reem", serviceAr: "زيارة منزلية", serviceEn: "Home Visit", typeAr: "منزلي", typeEn: "Home", typeIcon: "🏠", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5" },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={[styles.avatarCircle, { backgroundColor: C + "30" }]}>
          <Text style={{ fontSize: 18 }}>🏥</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={[styles.greeting, { color: colors.muted }]}>{t("مرحباً، إدارة","Welcome, Admin")}</Text>
          <Text style={[styles.clinicName, { color: isDark ? "#fff" : "#0A2330" }]}>{t("عيادة الشفاء المتخصصة","Al-Shifa Specialized Clinic")}</Text>
        </View>
        <Pressable style={[styles.notifBtn, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}>
          <Feather name="bell" size={20} color={C} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: isDark ? "#0D2A40" : "#0E7490" }]}>
        <View>
          <Text style={styles.heroTitle}>{t("اليوم، 29 مارس","Today, March 29")}</Text>
          <Text style={styles.heroSub}>{t("لديك 12 موعداً · 3 في انتظار التأكيد","You have 12 appointments · 3 pending")}</Text>
        </View>
        <Text style={{ fontSize: 40 }}>🩺</Text>
      </View>

      <Pressable style={[styles.previewBtn, { backgroundColor: isDark ? "#0D2035" : "#E0F2FE", borderColor: C + "50" }]}
        onPress={() => router.push("/business-clinic/clinic-preview" as any)}>
        <Feather name="eye" size={15} color={C} />
        <Text style={[styles.previewBtnText, { color: C }]}>{t("معاينة كيف تظهر عيادتك للمرضى في أكسير","Preview how your clinic appears to patients")}</Text>
        <Feather name="chevron-left" size={15} color={C} />
      </Pressable>

      <View style={styles.statsGrid}>
        {STATS.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
              <Feather name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#0A2330" }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
            <Text style={[styles.statChange, { color: s.color }]}>{s.change}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#0A2330", marginHorizontal: 20 }]}>{t("إجراءات سريعة","Quick Actions")}</Text>
      <View style={styles.quickGrid}>
        {QUICK.map((q, i) => (
          <Pressable key={i} style={[styles.quickCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push(q.route as any)}>
            <View style={[styles.quickIcon, { backgroundColor: isDark ? q.color + "25" : q.bg }]}>
              <Feather name={q.icon} size={22} color={q.color} />
            </View>
            <Text style={[styles.quickLabel, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? q.labelAr : q.labelEn}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Pressable onPress={() => router.push("/business-clinic/appointments" as any)}>
          <Text style={[styles.seeAll, { color: C }]}>{t("عرض الكل","View All")}</Text>
        </Pressable>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("مواعيد اليوم","Today's Appointments")}</Text>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {TODAY_APPOINTMENTS.map((apt, i) => (
          <View key={i} style={[styles.aptCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={[styles.aptStatus, { backgroundColor: apt.statusBg }]}>
              <Text style={[styles.aptStatusText, { color: apt.statusColor }]}>{lang === "ar" ? apt.statusAr : apt.statusEn}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.aptTop}>
                <Text style={[styles.aptType, { color: colors.muted }]}>{apt.typeIcon} {lang === "ar" ? apt.typeAr : apt.typeEn}</Text>
                <Text style={[styles.aptPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? apt.patientAr : apt.patientEn}</Text>
              </View>
              <Text style={[styles.aptMeta, { color: colors.muted }]}>{apt.doctor}  ·  {lang === "ar" ? apt.serviceAr : apt.serviceEn}</Text>
            </View>
            <View style={[styles.aptTime, { backgroundColor: C + "20" }]}>
              <Feather name="clock" size={11} color={C} />
              <Text style={[styles.aptTimeText, { color: C }]}>{apt.time}</Text>
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
  clinicName: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  notifBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", position: "absolute", top: 8, right: 8 },
  heroBanner: { marginHorizontal: 20, borderRadius: 20, padding: 20, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  heroTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
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
  aptCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  aptStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  aptStatusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  aptTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  aptPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  aptType: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  aptMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  aptTime: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  aptTimeText: { fontSize: 13, fontFamily: "Cairo_700Bold" },
});
