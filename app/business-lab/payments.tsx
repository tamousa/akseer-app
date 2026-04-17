import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function LabPayments() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const PAY_SECTIONS = [
    { key: "invoices", labelAr: "الفواتير", labelEn: "Invoices", icon: "file-text" as const, color: C, bg: "#DBEAFE", badgeAr: "24 فاتورة", badgeEn: "24 Invoices", descAr: "استعراض وتصدير فواتير حجوزات التحاليل", descEn: "View and export lab test booking invoices", route: "/business-lab/invoices" },
    { key: "reports", labelAr: "التقارير المالية", labelEn: "Financial Reports", icon: "bar-chart-2" as const, color: "#2563EB", bg: "#DBEAFE", badgeAr: "", badgeEn: "", descAr: "تقارير الإيرادات وأداء التحاليل والباقات", descEn: "Revenue reports and test/package performance", route: "/business-lab/reports" },
  ];

  const RECENT = [
    { id: "LAB-802", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", itemAr: "باقة الفحص الشامل", itemEn: "Comprehensive Panel", amount: "+249 SAR", timeAr: "اليوم 09:00", timeEn: "Today 09:00", color: "#059669", methodAr: "أبل باي", methodEn: "Apple Pay" },
    { id: "LAB-803", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", itemAr: "هرمونات الغدة + زيارة منزلية", itemEn: "Thyroid Hormones + Home Visit", amount: "+170 SAR", timeAr: "اليوم 10:30", timeEn: "Today 10:30", color: "#059669", methodAr: "مدى", methodEn: "Mada" },
    { id: "LAB-804", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", itemAr: "وظائف الكبد + الكلى", itemEn: "Liver & Kidney Function", amount: "+160 SAR", timeAr: "اليوم 11:00", timeEn: "Today 11:00", color: "#059669", methodAr: "بطاقة", methodEn: "Card" },
    { id: "LAB-800", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", itemAr: "باقة مرضى السكري", itemEn: "Diabetes Package", amount: "+149 SAR", timeAr: "أمس", timeEn: "Yesterday", color: "#059669", methodAr: "مدى", methodEn: "Mada" },
  ];

  const PAYMENT_METHODS = [
    { nameAr: "مدى", nameEn: "Mada", percent: 45, color: "#059669" },
    { nameAr: "أبل باي", nameEn: "Apple Pay", percent: 30, color: C },
    { nameAr: "بطاقة ائتمان", nameEn: "Credit Card", percent: 15, color: "#7C3AED" },
    { nameAr: "نقد", nameEn: "Cash", percent: 10, color: "#D97706" },
  ];

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35", paddingHorizontal: 16, marginBottom: 16 }]}>{t("المدفوعات","Payments")}</Text>

      <View style={[styles.balanceCard, { backgroundColor: C }]}>
        <Text style={styles.balLabel}>{t("إجمالي إيرادات هذا الشهر","Total Revenue This Month")}</Text>
        <Text style={styles.balAmount}>18,420 SAR</Text>
        <View style={styles.balRow}>
          <View style={styles.balStat}><Text style={styles.balStatText}>{t("حجوزات:","Bookings:")} 98</Text></View>
          <View style={styles.balDivider} />
          <View style={styles.balStat}><Text style={styles.balStatText}>{t("متوسط:","Avg:")} 188 SAR</Text></View>
        </View>
        <Pressable style={styles.withdrawBtn}
          onPress={() => Alert.alert(t("تحويل الرصيد","Transfer Balance"), t("سيتم تحويل رصيدك لحسابك البنكي المسجل","Your balance will be transferred to your registered bank account"))}>
          <Feather name="send" size={14} color={C} />
          <Text style={styles.withdrawText}>{t("تحويل الرصيد","Transfer Balance")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12, marginBottom: 20 }}>
        {PAY_SECTIONS.map((s) => (
          <Pressable key={s.key} style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push(s.route as any)}>
            <View style={styles.inner}>
              <Feather name="chevron-left" size={18} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  {(lang === "ar" ? s.badgeAr : s.badgeEn) ? (
                    <View style={[styles.badge, { backgroundColor: isDark ? C + "25" : s.bg }]}>
                      <Text style={[styles.badgeText, { color: s.color }]}>{lang === "ar" ? s.badgeAr : s.badgeEn}</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.sLabel, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
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

      <View style={[styles.methodsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.methodsTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("طرق الدفع الشائعة","Common Payment Methods")}</Text>
        <View style={{ gap: 10 }}>
          {PAYMENT_METHODS.map((m, i) => (
            <View key={i} style={styles.methodRow}>
              <Text style={[styles.methodPct, { color: m.color }]}>{m.percent}%</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <View style={[styles.progressFill, { width: `${m.percent}%` as any, backgroundColor: m.color }]} />
                </View>
              </View>
              <Text style={[styles.methodName, { color: isDark ? "#C0D8E8" : "#0A1F35" }]}>{lang === "ar" ? m.nameAr : m.nameEn}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Pressable onPress={() => router.push("/business-lab/invoices" as any)}>
          <Text style={[styles.seeAll, { color: C }]}>{t("عرض الكل","View All")}</Text>
        </Pressable>
        <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("آخر المعاملات","Recent Transactions")}</Text>
      </View>
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {RECENT.map((tx, i) => (
          <View key={i} style={[styles.txCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? tx.patientAr : tx.patientEn}</Text>
              <Text style={[styles.txMeta, { color: colors.muted }]}>{tx.id}  ·  {lang === "ar" ? tx.itemAr : tx.itemEn}  ·  {lang === "ar" ? tx.methodAr : tx.methodEn}  ·  {lang === "ar" ? tx.timeAr : tx.timeEn}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  balanceCard: { marginHorizontal: 16, borderRadius: 22, padding: 22, marginBottom: 20 },
  balLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", textAlign: "right" },
  balAmount: { fontSize: 32, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right", marginVertical: 6 },
  balRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16, marginBottom: 14 },
  balStat: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balStatText: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#BAD4E8" },
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
  methodsCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 12, marginBottom: 20 },
  methodsTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  methodRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  methodName: { fontSize: 13, fontFamily: "Tajawal_500Medium", width: 80, textAlign: "right" },
  methodPct: { fontSize: 12, fontFamily: "Cairo_700Bold", width: 35, textAlign: "left" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  sectionRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 14 },
  subTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  txCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 14, padding: 14, borderWidth: 1 },
  txAmount: { fontSize: 13, fontFamily: "Cairo_700Bold", minWidth: 80, textAlign: "right" },
  txPatient: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  txMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
});
