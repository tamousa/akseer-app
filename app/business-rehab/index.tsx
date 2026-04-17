import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";

export default function RehabIndex() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATS = [
    { labelAr: "جلسات اليوم", labelEn: "Today's Sessions", value: "11", delta: "+1", up: true, icon: "activity" as const },
    { labelAr: "إيراد الأسبوع", labelEn: "Weekly Revenue", value: "4,100", delta: "+15%", up: true, icon: "dollar-sign" as const },
    { labelAr: "مرضى نشطون", labelEn: "Active Patients", value: "34", delta: "+4", up: true, icon: "users" as const },
    { labelAr: "نسبة التعافي", labelEn: "Recovery Rate", value: "89%", delta: "+3%", up: true, icon: "trending-up" as const },
  ];

  const SESSIONS_TODAY = [
    { nameAr: "سعد الغامدي", nameEn: "Saad Al-Ghamdi", planAr: "إعادة تأهيل ركبة", planEn: "Knee Rehabilitation", sessions: "8/12", time: "09:00", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", color: "#059669" },
    { nameAr: "ريم المالكي", nameEn: "Reem Al-Maliki", planAr: "علاج آلام الظهر", planEn: "Back Pain Therapy", sessions: "3/8", time: "10:30", therapistAr: "د. سمر", therapistEn: "Dr. Samar", color: "#047857" },
    { nameAr: "بدر العتيبي", nameEn: "Badr Al-Otaibi", planAr: "تأهيل ما بعد جراحة", planEn: "Post-Surgery Rehab", sessions: "5/16", time: "12:00", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", color: "#10B981" },
    { nameAr: "هند الزهراني", nameEn: "Hind Al-Zahrani", planAr: "علاج طبيعي عام", planEn: "General Physiotherapy", sessions: "2/6", time: "14:30", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", color: "#34D399" },
  ];

  const QUICK = [
    { labelAr: "جلسة جديدة", labelEn: "New Session", icon: "plus-circle" as const, route: "/business-rehab/sessions" },
    { labelAr: "المرضى", labelEn: "Patients", icon: "users" as const, route: "/business-rehab/patients" },
    { labelAr: "خطط العلاج", labelEn: "Treatment Plans", icon: "clipboard" as const, route: "/business-rehab/treatment-plans" },
    { labelAr: "المعالجون", labelEn: "Therapists", icon: "heart" as const, route: "/business-rehab/staff" },
    { labelAr: "العروض", labelEn: "Offers", icon: "tag" as const, route: "/business-rehab/offers" },
    { labelAr: "معاينة", labelEn: "Preview", icon: "eye" as const, route: "/business-rehab/rehab-preview" },
  ];

  const TOP_SERVICES = [
    { nameAr: "علاج طبيعي عام", nameEn: "General Physiotherapy", pct: 35, count: 15 },
    { nameAr: "إعادة تأهيل بعد جراحة", nameEn: "Post-Surgery Rehab", pct: 28, count: 12 },
    { nameAr: "علاج آلام الظهر", nameEn: "Back Pain Therapy", pct: 20, count: 9 },
    { nameAr: "تأهيل رياضي", nameEn: "Sports Rehabilitation", pct: 12, count: 5 },
    { nameAr: "تقويم عمود الفقري", nameEn: "Spine Correction", pct: 5, count: 2 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#001A12" : "#ECFDF5" }]}>
      <View style={[styles.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSub}>{t("لوحة تحكم | مركز","Control Panel | Center")}</Text>
          <Text style={styles.headerTitle}>{t("أكسير للتأهيل والعلاج الطبيعي 🦾","Akseer Rehab & Physiotherapy 🦾")}</Text>
        </View>
        <View style={{ flexDirection: "row-reverse", gap: 10 }}>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={20} color="#fff" />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push("/business-rehab/rehab-preview" as any)}>
            <Feather name="eye" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "30" }]}>
              <View style={[styles.statIcon, { backgroundColor: BRAND + "20" }]}>
                <Feather name={s.icon} size={18} color={BRAND} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
              {s.delta ? <Text style={[styles.statDelta, { color: s.up ? "#10B981" : "#EF4444" }]}>{s.delta}</Text> : null}
            </View>
          ))}
        </View>

        <View style={[styles.insCard, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "30" }]}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.insTitle, { color: colors.text }]}>{t("مطالبات التأمين المعلقة","Pending Insurance Claims")}</Text>
            <Text style={[styles.insSub, { color: colors.muted }]}>3 {t("مطالبات بانتظار المراجعة","claims pending review")}</Text>
          </View>
          <Pressable style={[styles.insBtn, { backgroundColor: BRAND }]}>
            <Text style={styles.insBtnText}>{t("مراجعة","Review")}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("إجراءات سريعة","Quick Actions")}</Text>
          <View style={styles.quickGrid}>
            {QUICK.map((q, i) => (
              <Pressable key={i} style={[styles.quickCard, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "25" }]}
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
            <Pressable onPress={() => router.push("/business-rehab/sessions" as any)}>
              <Text style={[styles.seeAll, { color: BRAND }]}>{t("عرض الكل","View All")}</Text>
            </Pressable>
          </View>
          {SESSIONS_TODAY.map((s, i) => (
            <View key={i} style={[styles.sessCard, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: s.color + "30" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                <Text style={[styles.sessPlan, { color: colors.muted }]}>{lang === "ar" ? s.planAr : s.planEn}</Text>
                <Text style={[styles.sessTherapist, { color: s.color }]}>{lang === "ar" ? s.therapistAr : s.therapistEn}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={[styles.sessTime, { color: s.color }]}>{s.time}</Text>
                <View style={[styles.sessProgress, { backgroundColor: s.color + "20" }]}>
                  <Text style={[styles.sessProgressText, { color: s.color }]}>{t("جلسة","Session")} {s.sessions}</Text>
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
                <View style={[styles.barTrack, { backgroundColor: isDark ? "#003820" : "#D1FAE5" }]}>
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
  headerTitle: { fontSize: 19, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "right" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: "#FCD34D", alignItems: "center", justifyContent: "center" },
  badgeText: { fontSize: 9, fontFamily: "Tajawal_700Bold", color: "#78350F" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", padding: 16, gap: 12 },
  statCard: { width: "47%", flexGrow: 1, borderRadius: 16, padding: 14, borderWidth: 1, gap: 4, alignItems: "flex-end" },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  statLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statDelta: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  insCard: { flexDirection: "row-reverse", alignItems: "center", marginHorizontal: 16, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 16, gap: 12 },
  insTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  insSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  insBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  insBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  quickCard: { width: "30%", flexGrow: 1, minWidth: 90, borderRadius: 14, padding: 14, borderWidth: 1, alignItems: "center", gap: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  sessCard: { flexDirection: "row-reverse", alignItems: "center", borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8, gap: 10 },
  sessName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sessPlan: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sessTherapist: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sessTime: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  sessProgress: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  sessProgressText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  rankRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 10 },
  rankCount: { fontSize: 14, fontFamily: "Cairo_700Bold", width: 28, textAlign: "center" },
  rankName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  rankPct: { fontSize: 12, fontFamily: "Tajawal_400Regular", width: 36, textAlign: "left" },
});
