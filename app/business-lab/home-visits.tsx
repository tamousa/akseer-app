import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const HOME_VISITS = [
  { id: "HV-201", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", testsAr: "هرمونات الغدة الدرقية TSH/T3/T4", testsEn: "Thyroid Hormones TSH/T3/T4", techAr: "فني. عمر السالم", techEn: "Tech. Omar Al-Salim", addressAr: "الرياض - حي الملقا", addressEn: "Riyadh - Malqa", date: "اليوم", dateEn: "Today", time: "10:30", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#D97706", statusBg: "#FEF3C7", feeAr: "50 SAR رسوم التنقل", feeEn: "50 SAR transit fee", distance: "7 km", prepAr: "قبل الدواء الصباحي", prepEn: "Before morning medication" },
  { id: "HV-202", patientAr: "محمد الغامدي", patientEn: "Mohammed Al-Ghamdi", testsAr: "باقة مرضى السكري", testsEn: "Diabetes Package", techAr: "فني. سارة النجار", techEn: "Tech. Sara Al-Najjar", addressAr: "الرياض - حي الروضة", addressEn: "Riyadh - Rawda", date: "اليوم", dateEn: "Today", time: "12:00", statusAr: "انتظار", statusEn: "Pending", statusColor: "#6B7280", statusBg: "#F3F4F6", feeAr: "50 SAR رسوم التنقل", feeEn: "50 SAR transit fee", distance: "11 km", prepAr: "صيام 8 ساعات", prepEn: "Fast 8 hours" },
  { id: "HV-200", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", testsAr: "صورة دم كاملة + سكر", testsEn: "CBC + Blood Sugar", techAr: "فني. عمر السالم", techEn: "Tech. Omar Al-Salim", addressAr: "الرياض - حي النزهة", addressEn: "Riyadh - Nuzha", date: "أمس", dateEn: "Yesterday", time: "09:00", statusAr: "مكتمل", statusEn: "Completed", statusColor: "#A86DBF", statusBg: "#DBEAFE", feeAr: "50 SAR رسوم التنقل", feeEn: "50 SAR transit fee", distance: "3 km", prepAr: "صيام 8 ساعات", prepEn: "Fast 8 hours" },
];

const ZONES = [
  { nameAr: "شمال الرياض", nameEn: "North Riyadh", active: true, fee: "50 SAR", maxDist: "15 km", slots: "07:00 — 12:00" },
  { nameAr: "وسط الرياض", nameEn: "Central Riyadh", active: true, fee: "40 SAR", maxDist: "10 km", slots: "07:00 — 14:00" },
  { nameAr: "جنوب الرياض", nameEn: "South Riyadh", active: false, fee: "60 SAR", maxDist: "20 km", slots: "—" },
];

const TECHS = [
  { nameAr: "فني. عمر السالم", nameEn: "Tech. Omar Al-Salim", active: true, todayVisits: 2 },
  { nameAr: "فني. سارة النجار", nameEn: "Tech. Sara Al-Najjar", active: true, todayVisits: 1 },
];

export default function LabHomeVisits() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"requests" | "settings">("requests");
  const [zones, setZones] = useState(ZONES.map((z) => ({ ...z })));
  const toggleZone = (idx: number) => setZones((prev) => prev.map((z, i) => i === idx ? { ...z, active: !z.active } : z));

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("الخدمة المنزلية","Home Service")}</Text>
        <View style={[styles.badge, { backgroundColor: C + "20" }]}><Text style={{ fontSize: 16 }}>🏠</Text></View>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: isDark ? "#0A1A30" : C }]}>
        <View>
          <Text style={styles.heroTitle}>{t("فنيو المختبر اليوم","Lab Technicians Today")}</Text>
          <Text style={styles.heroSub}>{t("أخذ العينات في منزل المريض","Sample collection at patient's home")}</Text>
          <View style={styles.techRow}>
            {TECHS.map((tc, i) => (
              <View key={i} style={styles.techChip}>
                <View style={[styles.techDot, { backgroundColor: tc.active ? "#86EFAC" : "#6B7280" }]} />
                <Text style={styles.techName}>{lang === "ar" ? tc.nameAr : tc.nameEn}  ({tc.todayVisits} {t("زيارة","visits")})</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={{ fontSize: 44 }}>🚗</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt }]}>
        <Pressable style={[styles.tabBtn, activeTab === "settings" && { backgroundColor: C }]} onPress={() => setActiveTab("settings")}>
          <Text style={[styles.tabText, { color: activeTab === "settings" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("إعدادات التغطية","Coverage Settings")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "requests" && { backgroundColor: C }]} onPress={() => setActiveTab("requests")}>
          <Text style={[styles.tabText, { color: activeTab === "requests" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("طلبات اليوم","Today's Requests")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "requests" && HOME_VISITS.map((v) => (
          <Pressable key={v.id} style={[styles.visitCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(v.id, `${t("المريض:","Patient:")} ${lang === "ar" ? v.patientAr : v.patientEn}\n${t("الفني:","Tech:")} ${lang === "ar" ? v.techAr : v.techEn}\n${t("العنوان:","Address:")} ${lang === "ar" ? v.addressAr : v.addressEn}\n${t("المسافة:","Distance:")} ${v.distance}\n${t("تحضير:","Prep:")} ${lang === "ar" ? v.prepAr : v.prepEn}`)}>
            <View style={styles.visitTop}>
              <View style={[styles.statusBadge, { backgroundColor: v.statusBg }]}>
                <Text style={[styles.statusText, { color: v.statusColor }]}>{lang === "ar" ? v.statusAr : v.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.visitId, { color: colors.muted }]}>{v.id}  ·  {lang === "ar" ? v.date : v.dateEn} {v.time}</Text>
                <Text style={[styles.visitPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? v.patientAr : v.patientEn}</Text>
              </View>
            </View>
            <Text style={[styles.visitTests, { color: colors.muted }]} numberOfLines={1}>{lang === "ar" ? v.testsAr : v.testsEn}</Text>
            <View style={styles.visitAddress}>
              <Feather name="map-pin" size={12} color={C} />
              <Text style={[styles.visitAddressText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]} numberOfLines={1}>{lang === "ar" ? v.addressAr : v.addressEn}</Text>
              <View style={[styles.distBadge, { backgroundColor: C + "20" }]}>
                <Text style={[styles.distText, { color: C }]}>{v.distance}</Text>
              </View>
            </View>
            <View style={styles.techLine}>
              <Text style={[styles.techLineText, { color: colors.muted }]}>{lang === "ar" ? v.techAr : v.techEn}  ·  {v.feeEn}</Text>
            </View>
            {(v.statusAr === "انتظار") && (
              <View style={styles.actionRow}>
                <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                  onPress={() => Alert.alert(t("رفض","Reject"), `${t("رفض طلب","Reject request for")} ${lang === "ar" ? v.patientAr : v.patientEn}؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("رفض","Reject"), style: "destructive" }])}>
                  <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("رفض","Reject")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                  onPress={() => Alert.alert(t("تم التأكيد ✓","Confirmed ✓"), `${t("تم تأكيد الزيارة المنزلية لـ","Home visit confirmed for")} ${lang === "ar" ? v.patientAr : v.patientEn}`)}>
                  <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تأكيد الزيارة","Confirm Visit")}</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}

        {activeTab === "settings" && (
          <>
            <View style={[styles.infoBox, { backgroundColor: isDark ? "#0A1A30" : "#EFF6FF", borderColor: C + "30" }]}>
              <Feather name="info" size={14} color={C} />
              <Text style={[styles.infoText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>
                {t("رسوم التنقل المنزلي تُضاف تلقائياً فوق سعر التحليل أو الباقة. يمكنك تفعيل المناطق وتحديد السلوت الزمني لكل منطقة.",
                   "Home visit fees are automatically added on top of the test or package price. You can activate zones and set time slots for each zone.")}
              </Text>
            </View>
            {zones.map((z, idx) => (
              <View key={idx} style={[styles.zoneCard, { backgroundColor: cardBg, borderColor: z.active ? C + "40" : cardBorder }]}>
                <Switch value={z.active} onValueChange={() => toggleZone(idx)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={z.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.zoneName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? z.nameAr : z.nameEn}</Text>
                  <Text style={[styles.zoneMeta, { color: colors.muted }]}>{t("رسوم:","Fee:")} {z.fee}  ·  {t("أقصى:","Max:")} {z.maxDist}  ·  {z.slots}</Text>
                </View>
                <Pressable onPress={() => Alert.alert(t("تعديل المنطقة","Edit Zone"), lang === "ar" ? z.nameAr : z.nameEn)}
                  style={[styles.editBtn, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Feather name="edit-2" size={14} color={C} />
                </Pressable>
              </View>
            ))}
            <Pressable style={[styles.addZoneBtn, { borderColor: C, backgroundColor: colors.surface }]}
              onPress={() => Alert.alert(t("إضافة منطقة","Add Zone"), t("سيتم فتح نموذج إضافة منطقة تغطية جديدة","A form to add a new coverage zone will open"))}>
              <Feather name="plus" size={16} color={C} />
              <Text style={[styles.addZoneText, { color: C }]}>{t("إضافة منطقة تغطية","Add Coverage Zone")}</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  badge: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  heroBanner: { marginHorizontal: 16, borderRadius: 20, padding: 18, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 },
  heroTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", marginBottom: 10 },
  techRow: { gap: 6 },
  techChip: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  techDot: { width: 6, height: 6, borderRadius: 3 },
  techName: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#fff" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  visitCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  visitTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  visitId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  visitPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  visitTests: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  visitAddress: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  visitAddressText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular" },
  distBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  distText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  techLine: { flexDirection: "row-reverse" },
  techLineText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  infoBox: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 18 },
  zoneCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  zoneName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  zoneMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  editBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  addZoneBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderStyle: "dashed" },
  addZoneText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
});
