import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ClinicPayments() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const PAY_SECTIONS = [
    { key: "invoices", labelAr: "الفواتير الطبية", labelEn: "Medical Invoices", icon: "file-text" as const, color: C, bg: "#CFFAFE", badgeAr: "18 فاتورة", badgeEn: "18 Invoices", descAr: "استعراض وتصدير فواتير جلسات ومواعيد المرضى", descEn: "View and export patient session invoices", route: "/business-clinic/invoices" },
    { key: "reports", labelAr: "التقارير المالية", labelEn: "Financial Reports", icon: "bar-chart-2" as const, color: "#2563EB", bg: "#DBEAFE", badgeAr: "", badgeEn: "", descAr: "تقارير الإيرادات وأداء الخدمات الطبية", descEn: "Revenue reports and medical service performance", route: "/business-clinic/reports" },
  ];

  const INSURANCE = [
    { nameAr: "بوبا العربية", nameEn: "Bupa Arabia", accepted: true, coverage: "90%", color: "#059669" },
    { nameAr: "ميدغلف", nameEn: "Medgulf", accepted: true, coverage: "85%", color: "#059669" },
    { nameAr: "تعاونية للتأمين", nameEn: "Cooperative Insurance", accepted: true, coverage: "80%", color: "#059669" },
    { nameAr: "الراجحي تكافل", nameEn: "Al Rajhi Takaful", accepted: false, coverage: "—", color: "#6B7280" },
  ];

  const RECENT = [
    { id: "MED-305", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", serviceAr: "استشارة عامة", serviceEn: "General Consultation", amount: "+350 SAR", timeAr: "اليوم 09:30", timeEn: "Today 09:30", color: "#059669", methodAr: "بطاقة", methodEn: "Card" },
    { id: "MED-304", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", serviceAr: "جلسة نفسية", serviceEn: "Psychology Session", amount: "+280 SAR", timeAr: "اليوم 10:30", timeEn: "Today 10:30", color: "#059669", methodAr: "أبل باي", methodEn: "Apple Pay" },
    { id: "MED-303", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", serviceAr: "زيارة منزلية تغذية", serviceEn: "Home Nutrition Visit", amount: "+320 SAR", timeAr: "أمس 14:00", timeEn: "Yesterday 14:00", color: "#059669", methodAr: "مدى", methodEn: "Mada" },
    { id: "MED-302", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", serviceAr: "جلسة نفسية", serviceEn: "Psychology Session", amount: "-50 SAR", timeAr: "أمس 17:00", timeEn: "Yesterday 17:00", color: "#DC2626", methodAr: "استرداد", methodEn: "Refund" },
  ];

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("المدفوعات","Payments")}</Text>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: C }]}>
        <Text style={styles.balLabel}>{t("إجمالي إيرادات هذا الشهر","Total Revenue This Month")}</Text>
        <Text style={styles.balAmount}>28,640 SAR</Text>
        <View style={styles.balRow}>
          <View style={styles.balStat}>
            <Feather name="arrow-down-left" size={13} color="#A5D8E6" />
            <Text style={styles.balStatText}>{t("وارد:","In:")} 29,200 SAR</Text>
          </View>
          <View style={styles.balDivider} />
          <View style={styles.balStat}>
            <Feather name="refresh-ccw" size={13} color="#FCA5A5" />
            <Text style={styles.balStatText}>{t("استرداد:","Refund:")} 560 SAR</Text>
          </View>
        </View>
        <Pressable style={styles.withdrawBtn}
          onPress={() => Alert.alert(t("تحويل الرصيد","Transfer Balance"), t("سيتم تحويل رصيدك لحسابك البنكي المسجل","Balance will be transferred to your registered bank account"))}>
          <Feather name="send" size={14} color={C} />
          <Text style={styles.withdrawText}>{t("تحويل الرصيد","Transfer Balance")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12, marginBottom: 22 }}>
        {PAY_SECTIONS.map((s) => (
          <Pressable key={s.key} style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push(s.route as any)}>
            <View style={styles.inner}>
              <Feather name="chevron-left" size={18} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  {(lang === "ar" ? s.badgeAr : s.badgeEn) ? <View style={[styles.badge, { backgroundColor: isDark ? s.color + "25" : s.bg }]}><Text style={[styles.badgeText, { color: s.color }]}>{lang === "ar" ? s.badgeAr : s.badgeEn}</Text></View> : null}
                  <Text style={[styles.sLabel, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
                </View>
                <Text style={[styles.sDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
              </View>
              <View style={[styles.sIcon, { backgroundColor: isDark ? s.color + "25" : s.bg }]}>
                <Feather name={s.icon} size={22} color={s.color} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={[styles.insuranceCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.insTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("شركات التأمين المقبولة","Accepted Insurance Companies")}</Text>
        <View style={{ gap: 10 }}>
          {INSURANCE.map((ins, i) => (
            <View key={i} style={styles.insRow}>
              <View style={[styles.insStatus, { backgroundColor: ins.accepted ? "#D1FAE520" : "#E5E7EB20" }]}>
                <Feather name={ins.accepted ? "check-circle" : "x-circle"} size={14} color={ins.color} />
              </View>
              <Text style={[styles.insName, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? ins.nameAr : ins.nameEn}</Text>
              <Text style={[styles.insCoverage, { color: ins.color }]}>{ins.coverage}</Text>
            </View>
          ))}
        </View>
        <Pressable style={[styles.manageInsBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}
          onPress={() => Alert.alert(t("إدارة التأمين","Manage Insurance"), t("إضافة أو تعديل شركات التأمين المقبولة","Add or edit accepted insurance companies"))}>
          <Text style={[styles.manageInsBtnText, { color: C }]}>{t("إدارة شركات التأمين","Manage Insurance")}</Text>
        </Pressable>
      </View>

      <View style={styles.sectionRow}>
        <Pressable onPress={() => router.push("/business-clinic/invoices" as any)}>
          <Text style={[styles.seeAll, { color: C }]}>{t("عرض الكل","View All")}</Text>
        </Pressable>
        <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("آخر المعاملات","Recent Transactions")}</Text>
      </View>
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {RECENT.map((tx, i) => (
          <View key={i} style={[styles.txCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? tx.patientAr : tx.patientEn}</Text>
              <Text style={[styles.txMeta, { color: colors.muted }]}>{tx.id}  ·  {lang === "ar" ? tx.serviceAr : tx.serviceEn}  ·  {lang === "ar" ? tx.methodAr : tx.methodEn}  ·  {lang === "ar" ? tx.timeAr : tx.timeEn}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { paddingHorizontal: 16, marginBottom: 20 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  balanceCard: { marginHorizontal: 16, borderRadius: 22, padding: 22, marginBottom: 20 },
  balLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6", textAlign: "right" },
  balAmount: { fontSize: 32, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right", marginVertical: 6 },
  balRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16, marginBottom: 14 },
  balStat: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balStatText: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#DDD6FE" },
  balDivider: { width: 1, height: 16, backgroundColor: "#ffffff30" },
  withdrawBtn: { flexDirection: "row-reverse", gap: 8, backgroundColor: "#fff", alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  withdrawText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#A86DBF" },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  inner: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  topRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  sLabel: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  insuranceCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 12, marginBottom: 20 },
  insTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  insRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  insStatus: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  insName: { flex: 1, fontSize: 13, fontFamily: "Tajawal_500Medium" },
  insCoverage: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  manageInsBtn: { paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  manageInsBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  sectionRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 14 },
  subTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  txCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 14, padding: 14, borderWidth: 1 },
  txAmount: { fontSize: 14, fontFamily: "Cairo_700Bold", minWidth: 80, textAlign: "right" },
  txPatient: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  txMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
});
