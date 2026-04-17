import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const DAYS_AR = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const DAYS_EN = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const INITIAL_SCHEDULE = [
  { dayIdx: 0, open: true, from: "07:00", to: "22:00", homeVisit: true },
  { dayIdx: 1, open: true, from: "07:00", to: "22:00", homeVisit: true },
  { dayIdx: 2, open: true, from: "07:00", to: "22:00", homeVisit: true },
  { dayIdx: 3, open: true, from: "07:00", to: "22:00", homeVisit: true },
  { dayIdx: 4, open: true, from: "07:00", to: "22:00", homeVisit: true },
  { dayIdx: 5, open: true, from: "07:00", to: "21:00", homeVisit: true },
  { dayIdx: 6, open: false, from: "14:00", to: "22:00", homeVisit: false },
];

const BRANCHES = [
  { nameAr: "الفرع الرئيسي — حي الملقا", nameEn: "Main Branch — Malqa", addressAr: "الرياض، طريق الملك فهد", addressEn: "Riyadh, King Fahd Rd", active: true, main: true, homeVisitRangeAr: "شمال الرياض", homeVisitRangeEn: "North Riyadh" },
  { nameAr: "فرع حي الروضة", nameEn: "Rawda Branch", addressAr: "الرياض، حي الروضة", addressEn: "Riyadh, Rawda District", active: true, main: false, homeVisitRangeAr: "وسط الرياض", homeVisitRangeEn: "Central Riyadh" },
];

export default function LabSchedule() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE.map((s) => ({ ...s })));
  const [activeTab, setActiveTab] = useState<"hours" | "branches">("hours");

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const toggleDay = (idx: number) => setSchedule((prev) => prev.map((s) => s.dayIdx === idx ? { ...s, open: !s.open } : s));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("مواعيد العمل والفروع","Working Hours & Branches")}</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt }]}>
        <Pressable style={[styles.tabBtn, activeTab === "branches" && { backgroundColor: C }]} onPress={() => setActiveTab("branches")}>
          <Text style={[styles.tabText, { color: activeTab === "branches" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("الفروع","Branches")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "hours" && { backgroundColor: C }]} onPress={() => setActiveTab("hours")}>
          <Text style={[styles.tabText, { color: activeTab === "hours" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("أوقات العمل","Working Hours")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {activeTab === "hours" && schedule.map((day) => (
          <View key={day.dayIdx} style={[styles.dayCard, { backgroundColor: cardBg, borderColor: day.open ? C + "40" : cardBorder }]}>
            <View style={styles.dayRow}>
              <Switch value={day.open} onValueChange={() => toggleDay(day.dayIdx)}
                trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={day.open ? C : "#f4f3f4"} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? DAYS_AR[day.dayIdx] : DAYS_EN[day.dayIdx]}</Text>
                {day.open
                  ? <Text style={[styles.dayHours, { color: C }]}>{day.from} — {day.to}</Text>
                  : <Text style={[styles.dayHours, { color: colors.muted }]}>{t("مغلق","Closed")}</Text>}
              </View>
              {day.homeVisit && day.open && (
                <View style={[styles.hmBadge, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                  <Text style={[styles.hmBadgeText, { color: "#059669" }]}>🏠 {t("منزلي","Home")}</Text>
                </View>
              )}
              {day.open && (
                <Pressable onPress={() => Alert.alert(`${t("تعديل وقت","Edit hours")} ${lang === "ar" ? DAYS_AR[day.dayIdx] : DAYS_EN[day.dayIdx]}`, `${t("من:","From:")} ${day.from}\n${t("إلى:","To:")} ${day.to}`)}
                  style={[styles.editBtn, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Feather name="edit-2" size={14} color={C} />
                </Pressable>
              )}
            </View>
          </View>
        ))}

        {activeTab === "branches" && (
          <>
            {BRANCHES.map((b, i) => (
              <View key={i} style={[styles.branchCard, { backgroundColor: cardBg, borderColor: b.active ? C + "40" : cardBorder }]}>
                <View style={styles.branchTop}>
                  {b.main && <View style={[styles.mainBadge, { backgroundColor: C + "20" }]}><Text style={[styles.mainBadgeText, { color: C }]}>{t("رئيسي","Main")}</Text></View>}
                  <Text style={[styles.branchName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                </View>
                <Text style={[styles.branchAddress, { color: colors.muted }]}>📍 {lang === "ar" ? b.addressAr : b.addressEn}</Text>
                <Text style={[styles.branchHV, { color: "#059669" }]}>🏠 {t("تغطية منزلية:","Home coverage:")} {lang === "ar" ? b.homeVisitRangeAr : b.homeVisitRangeEn}</Text>
                <Pressable style={[styles.editBranchBtn, { borderColor: C, backgroundColor: colors.surface }]}
                  onPress={() => Alert.alert(t("تعديل الفرع","Edit Branch"), lang === "ar" ? b.nameAr : b.nameEn)}>
                  <Feather name="edit-2" size={13} color={C} />
                  <Text style={[styles.editBranchText, { color: C }]}>{t("تعديل الفرع","Edit Branch")}</Text>
                </Pressable>
              </View>
            ))}
            <Pressable style={[styles.addBranchBtn, { borderColor: C, backgroundColor: colors.surface }]}
              onPress={() => Alert.alert(t("فرع جديد","New Branch"), t("سيتم فتح نموذج إضافة فرع جديد","A form to add a new branch will open"))}>
              <Feather name="plus" size={16} color={C} />
              <Text style={[styles.addBranchText, { color: C }]}>{t("إضافة فرع","Add Branch")}</Text>
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
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  dayCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  dayRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  dayName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  dayHours: { fontSize: 12, fontFamily: "Cairo_700Bold", marginTop: 2 },
  hmBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  hmBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  branchCard: { borderRadius: 18, padding: 16, borderWidth: 1, gap: 8 },
  branchTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  mainBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  mainBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  branchName: { fontSize: 14, fontFamily: "Cairo_700Bold", flex: 1 },
  branchAddress: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  branchHV: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  editBranchBtn: { flexDirection: "row-reverse", gap: 6, alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 10, borderWidth: 1 },
  editBranchText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  addBranchBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderStyle: "dashed" },
  addBranchText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
