import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ClinicSchedule() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"schedule" | "branches">("schedule");

  const SCHEDULE = [
    { dayAr: "السبت", dayEn: "Saturday", open: true, from: "08:00", to: "20:00" },
    { dayAr: "الأحد", dayEn: "Sunday", open: true, from: "08:00", to: "20:00" },
    { dayAr: "الاثنين", dayEn: "Monday", open: true, from: "08:00", to: "20:00" },
    { dayAr: "الثلاثاء", dayEn: "Tuesday", open: true, from: "08:00", to: "20:00" },
    { dayAr: "الأربعاء", dayEn: "Wednesday", open: true, from: "08:00", to: "16:00" },
    { dayAr: "الخميس", dayEn: "Thursday", open: true, from: "08:00", to: "14:00" },
    { dayAr: "الجمعة", dayEn: "Friday", open: false, from: "—", to: "—" },
  ];

  const BRANCHES = [
    { id: 1, nameAr: "الفرع الرئيسي", nameEn: "Main Branch", areaAr: "الرياض - حي النزهة", areaEn: "Riyadh - Al Nuzha District", open: true, doctors: 2, rooms: 4 },
    { id: 2, nameAr: "فرع العليا", nameEn: "Al-Olaya Branch", areaAr: "الرياض - حي العليا", areaEn: "Riyadh - Al Olaya District", open: true, doctors: 1, rooms: 2 },
  ];

  const [schedule, setSchedule] = useState(SCHEDULE.map((d) => ({ ...d })));
  const toggleDay = (dayAr: string) => setSchedule((prev) => prev.map((d) => d.dayAr === dayAr ? { ...d, open: !d.open } : d));

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("مواعيد العمل والفروع","Work Schedule & Branches")}</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "branches" && { backgroundColor: C }]} onPress={() => setActiveTab("branches")}>
          <Text style={[styles.tabText, { color: activeTab === "branches" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("الفروع","Branches")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "schedule" && { backgroundColor: C }]} onPress={() => setActiveTab("schedule")}>
          <Text style={[styles.tabText, { color: activeTab === "schedule" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("جدول العمل","Work Schedule")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {activeTab === "schedule" && schedule.map((d) => (
          <View key={d.dayAr} style={[styles.dayCard, { backgroundColor: cardBg, borderColor: d.open ? C + "40" : cardBorder }]}>
            <Switch value={d.open} onValueChange={() => toggleDay(d.dayAr)}
              trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={d.open ? C : "#f4f3f4"} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.dayName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? d.dayAr : d.dayEn}</Text>
              {d.open
                ? <Text style={[styles.dayHours, { color: C }]}>{d.from} — {d.to}</Text>
                : <Text style={[styles.dayClosed, { color: colors.muted }]}>{t("مغلق","Closed")}</Text>}
            </View>
            {d.open && (
              <Pressable onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل مواعيد","Edit hours for")} ${lang === "ar" ? d.dayAr : d.dayEn}`)}
                style={[styles.editBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                <Feather name="edit-2" size={14} color={C} />
              </Pressable>
            )}
          </View>
        ))}

        {activeTab === "branches" && (
          <>
            {BRANCHES.map((b) => (
              <Pressable key={b.id} style={[styles.branchCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
                onPress={() => Alert.alert(lang === "ar" ? b.nameAr : b.nameEn, `${t("المنطقة:","Area:")} ${lang === "ar" ? b.areaAr : b.areaEn}\n${t("أطباء:","Doctors:")} ${b.doctors}  ·  ${t("غرف:","Rooms:")} ${b.rooms}`)}>
                <View style={styles.branchRow}>
                  <Feather name="chevron-left" size={16} color={colors.muted} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.branchTop}>
                      <View style={[styles.branchStatus, { backgroundColor: b.open ? "#D1FAE5" : "#FEE2E2" }]}>
                        <View style={[styles.statusDot, { backgroundColor: b.open ? "#059669" : "#DC2626" }]} />
                        <Text style={[styles.statusTxt, { color: b.open ? "#059669" : "#DC2626" }]}>{b.open ? t("مفتوح","Open") : t("مغلق","Closed")}</Text>
                      </View>
                      <Text style={[styles.branchName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                    </View>
                    <Text style={[styles.branchArea, { color: colors.muted }]}>{lang === "ar" ? b.areaAr : b.areaEn}</Text>
                    <View style={styles.branchStats}>
                      <View style={[styles.branchStat, { backgroundColor: isDark ? C + "20" : "#E0F7FA" }]}>
                        <Feather name="users" size={11} color={C} />
                        <Text style={[styles.branchStatText, { color: C }]}>{b.doctors} {t("أطباء","Doctors")}</Text>
                      </View>
                      <View style={[styles.branchStat, { backgroundColor: isDark ? C + "20" : "#E0F7FA" }]}>
                        <Feather name="layout" size={11} color={C} />
                        <Text style={[styles.branchStatText, { color: C }]}>{b.rooms} {t("غرف","Rooms")}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.branchIcon, { backgroundColor: C + "20" }]}>
                    <Feather name="map-pin" size={22} color={C} />
                  </View>
                </View>
              </Pressable>
            ))}
            <Pressable style={[styles.addBtn, { borderColor: C, backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}
              onPress={() => Alert.alert(t("إضافة فرع","Add Branch"), t("سيتم فتح نموذج إضافة فرع جديد","New branch form will open"))}>
              <Feather name="plus" size={16} color={C} />
              <Text style={[styles.addBtnText, { color: C }]}>{t("إضافة فرع جديد","Add New Branch")}</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  dayCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  dayName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  dayHours: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  dayClosed: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  editBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  branchCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  branchRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  branchIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  branchTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  branchName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  branchStatus: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignItems: "center" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusTxt: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  branchArea: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 6 },
  branchStats: { flexDirection: "row-reverse", gap: 8 },
  branchStat: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignItems: "center" },
  branchStatText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  addBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderStyle: "dashed" },
  addBtnText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
});
