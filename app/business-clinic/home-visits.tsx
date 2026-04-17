import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function HomeVisitsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"requests" | "settings">("requests");

  const VISITS = [
    { id: "HV-101", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", specialist: "أخ. ريم / Nurse Reem", serviceAr: "تقييم تغذوي", serviceEn: "Nutritional Assessment", addressAr: "الرياض - حي الملقا - شارع الأمير سلطان", addressEn: "Riyadh - Al Malqa - Prince Sultan St", dateAr: "اليوم", dateEn: "Today", time: "14:00", status: "confirmed", statusAr: "مؤكد", statusEn: "Confirmed", statusColor: "#059669", statusBg: "#D1FAE5", fee: "320 SAR", distance: "8 km" },
    { id: "HV-100", patientAr: "محمد الغامدي", patientEn: "Mohammed Al-Ghamdi", specialist: "د. خالد / Dr. Khalid", serviceAr: "جلسة نفسية منزلية", serviceEn: "Home Psychology Session", addressAr: "الرياض - حي الروضة", addressEn: "Riyadh - Al Rawdha District", dateAr: "غداً", dateEn: "Tomorrow", time: "10:00", status: "waiting", statusAr: "انتظار", statusEn: "Waiting", statusColor: "#D97706", statusBg: "#FEF3C7", fee: "380 SAR", distance: "12 km" },
    { id: "HV-099", patientAr: "أمل الحربي", patientEn: "Amal Al-Harbi", specialist: "أخ. ريم / Nurse Reem", serviceAr: "متابعة خطة التغذية", serviceEn: "Nutrition Plan Follow-up", addressAr: "الرياض - حي النزهة", addressEn: "Riyadh - Al Nuzha District", dateAr: "أمس", dateEn: "Yesterday", time: "11:30", status: "completed", statusAr: "مكتمل", statusEn: "Completed", statusColor: "#0E7490", statusBg: "#CFFAFE", fee: "220 SAR", distance: "5 km" },
  ];

  const ZONES_INIT = [
    { nameAr: "شمال الرياض", nameEn: "North Riyadh", active: true, feeAr: "50 ريال", feeEn: "50 SAR", maxDist: "15 km" },
    { nameAr: "وسط الرياض", nameEn: "Central Riyadh", active: true, feeAr: "40 ريال", feeEn: "40 SAR", maxDist: "10 km" },
    { nameAr: "شرق الرياض", nameEn: "East Riyadh", active: false, feeAr: "60 ريال", feeEn: "60 SAR", maxDist: "20 km" },
  ];

  const [zones, setZones] = useState(ZONES_INIT.map((z) => ({ ...z })));
  const toggleZone = (nameAr: string) => setZones((prev) => prev.map((z) => z.nameAr === nameAr ? { ...z, active: !z.active } : z));

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الخدمة المنزلية","Home Visits")}</Text>
        <View style={[styles.homeBadge, { backgroundColor: C + "20" }]}><Text style={{ fontSize: 16 }}>🏠</Text></View>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: isDark ? "#0D2A40" : C }]}>
        <View>
          <Text style={styles.heroTitle}>{t("الخدمة المنزلية","Home Visits")}</Text>
          <Text style={styles.heroSub}>{t("يرسل لك مختصك الصحي في الوقت المحدد","Your specialist comes to you on time")}</Text>
          <View style={styles.heroStats}>
            {[
              { labelAr: "مكتملة", labelEn: "Done", val: VISITS.filter((v) => v.status === "completed").length },
              { labelAr: "مجدولة", labelEn: "Scheduled", val: VISITS.filter((v) => v.status === "confirmed").length },
              { labelAr: "انتظار", labelEn: "Pending", val: VISITS.filter((v) => v.status === "waiting").length },
            ].map((s, i) => (
              <View key={i} style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={{ fontSize: 48 }}>🚗</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "settings" && { backgroundColor: C }]} onPress={() => setActiveTab("settings")}>
          <Text style={[styles.tabText, { color: activeTab === "settings" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("إعدادات التغطية","Coverage Settings")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "requests" && { backgroundColor: C }]} onPress={() => setActiveTab("requests")}>
          <Text style={[styles.tabText, { color: activeTab === "requests" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("الطلبات","Requests")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "requests" && VISITS.map((v) => (
          <Pressable key={v.id} style={[styles.visitCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(v.id, `${t("المريض:","Patient:")} ${lang === "ar" ? v.patientAr : v.patientEn}\n${t("المختص:","Specialist:")} ${v.specialist}\n${t("الرسوم:","Fee:")} ${v.fee}`)}>
            <View style={styles.visitTop}>
              <View style={[styles.statusBadge, { backgroundColor: v.statusBg }]}>
                <Text style={[styles.statusText, { color: v.statusColor }]}>{lang === "ar" ? v.statusAr : v.statusEn}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.visitId, { color: colors.muted }]}>{v.id}  ·  {lang === "ar" ? v.dateAr : v.dateEn} {v.time}</Text>
                <Text style={[styles.visitPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? v.patientAr : v.patientEn}</Text>
              </View>
              <Text style={[styles.visitFee, { color: C }]}>{v.fee}</Text>
            </View>
            <View style={styles.visitMeta}>
              <Feather name="user" size={12} color={colors.muted} />
              <Text style={[styles.visitSpecialist, { color: colors.muted }]}>{v.specialist}  ·  {lang === "ar" ? v.serviceAr : v.serviceEn}</Text>
            </View>
            <View style={styles.visitAddress}>
              <Feather name="map-pin" size={12} color={C} />
              <Text style={[styles.visitAddressText, { color: isDark ? "#A5D8E6" : "#0A2330" }]} numberOfLines={1}>{lang === "ar" ? v.addressAr : v.addressEn}</Text>
              <View style={[styles.distBadge, { backgroundColor: C + "20" }]}>
                <Text style={[styles.distText, { color: C }]}>{v.distance}</Text>
              </View>
            </View>
            {v.status === "waiting" && (
              <View style={styles.actionRow}>
                <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                  onPress={() => Alert.alert(t("رفض الزيارة","Reject Visit"), `${lang === "ar" ? v.patientAr : v.patientEn}؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("رفض","Reject"), style: "destructive" }])}>
                  <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("رفض","Reject")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                  onPress={() => Alert.alert(t("تم","Done"), `${t("تم تأكيد الزيارة المنزلية للمريض","Home visit confirmed for")} ${lang === "ar" ? v.patientAr : v.patientEn}`)}>
                  <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تأكيد الزيارة ✓","Confirm Visit ✓")}</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}

        {activeTab === "settings" && (
          <>
            <View style={[styles.infoBox, { backgroundColor: isDark ? "#0D2A40" : "#E0F7FA", borderColor: C + "30" }]}>
              <Feather name="info" size={14} color={C} />
              <Text style={[styles.infoText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>
                {t("رسوم الزيارة المنزلية تُضاف تلقائياً إلى رسوم الخدمة عند حجز المريض.","Home visit fees are automatically added to service fees when the patient books.")}
              </Text>
            </View>
            {zones.map((z) => (
              <View key={z.nameAr} style={[styles.zoneCard, { backgroundColor: cardBg, borderColor: z.active ? C + "40" : cardBorder }]}>
                <Switch value={z.active} onValueChange={() => toggleZone(z.nameAr)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={z.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.zoneName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? z.nameAr : z.nameEn}</Text>
                  <Text style={[styles.zoneMeta, { color: colors.muted }]}>{t("رسوم التنقل:","Travel fee:")} {lang === "ar" ? z.feeAr : z.feeEn}  ·  {t("أقصى مسافة:","Max distance:")} {z.maxDist}</Text>
                </View>
                <Pressable onPress={() => Alert.alert(t("تعديل المنطقة","Edit Zone"), `${lang === "ar" ? z.nameAr : z.nameEn}`)}
                  style={[styles.editBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                  <Feather name="edit-2" size={14} color={C} />
                </Pressable>
              </View>
            ))}
            <Pressable style={[styles.addZoneBtn, { borderColor: C, backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}
              onPress={() => Alert.alert(t("إضافة منطقة","Add Zone"), t("سيتم فتح نموذج إضافة منطقة تغطية جديدة","New coverage zone form will open"))}>
              <Feather name="plus" size={16} color={C} />
              <Text style={[styles.addZoneText, { color: C }]}>{t("إضافة منطقة تغطية جديدة","Add New Coverage Zone")}</Text>
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
  homeBadge: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  heroBanner: { marginHorizontal: 16, borderRadius: 20, padding: 18, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 },
  heroTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6", marginBottom: 10 },
  heroStats: { flexDirection: "row-reverse", gap: 16 },
  heroStat: { alignItems: "center" },
  heroStatVal: { fontSize: 20, fontFamily: "Cairo_700Bold", color: "#fff" },
  heroStatLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  visitCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 8 },
  visitTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  visitId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  visitPatient: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  visitFee: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  visitMeta: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  visitSpecialist: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  visitAddress: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  visitAddressText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular" },
  distBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  distText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
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
