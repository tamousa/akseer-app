import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView,
  StyleSheet, Switch, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function SchedulePage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"schedule" | "branches">("schedule");
  const { t } = useLanguage();

  const DAYS_SCHEDULE = [
    { dayAr: "السبت",    dayEn: "Saturday",  open: true,  from: "09:00", to: "22:00" },
    { dayAr: "الأحد",    dayEn: "Sunday",    open: true,  from: "09:00", to: "22:00" },
    { dayAr: "الاثنين", dayEn: "Monday",    open: true,  from: "09:00", to: "22:00" },
    { dayAr: "الثلاثاء",dayEn: "Tuesday",   open: true,  from: "09:00", to: "22:00" },
    { dayAr: "الأربعاء",dayEn: "Wednesday", open: true,  from: "09:00", to: "22:00" },
    { dayAr: "الخميس",  dayEn: "Thursday",  open: true,  from: "09:00", to: "23:00" },
    { dayAr: "الجمعة",  dayEn: "Friday",    open: false, from: "14:00", to: "22:00" },
  ];

  const BRANCHES = [
    { id: 1, name: t("الفرع الرئيسي","Main Branch"), area: t("الرياض - حي النزهة","Riyadh - Al-Nuzha"),     phone: "0112345678", open: true,  manager: "خالد الشمري" },
    { id: 2, name: t("فرع العليا","Al-Olaya Branch"),area: t("الرياض - حي العليا","Riyadh - Al-Olaya"),     phone: "0112345679", open: true,  manager: "أحمد المالكي" },
  ];

  const [schedule, setSchedule] = useState(DAYS_SCHEDULE.map((d) => ({ ...d })));

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("مواعيد العمل والفروع","Working Hours & Branches")}</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "branches" && { backgroundColor: "#7C3AED" }]} onPress={() => setActiveTab("branches")}>
          <Text style={[styles.tabText, { color: activeTab === "branches" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>{t("الفروع","Branches")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "schedule" && { backgroundColor: "#7C3AED" }]} onPress={() => setActiveTab("schedule")}>
          <Text style={[styles.tabText, { color: activeTab === "schedule" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>{t("جدول المواعيد","Schedule")}</Text>
        </Pressable>
      </View>

      {activeTab === "schedule" && (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {schedule.map((d) => (
            <View key={d.dayEn} style={[styles.dayCard, { backgroundColor: cardBg, borderColor: d.open ? "#7C3AED50" : cardBorder }]}>
              <Switch value={d.open} onValueChange={() => setSchedule((p) => p.map((x) => x.dayEn === d.dayEn ? { ...x, open: !x.open } : x))}
                trackColor={{ false: "#ccc", true: "#7C3AED80" }} thumbColor={d.open ? "#7C3AED" : "#f4f3f4"} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayName, { color: colors.text }]}>{t(d.dayAr, d.dayEn)}</Text>
                {d.open
                  ? <Text style={[styles.dayHours, { color: "#7C3AED" }]}>{d.from} — {d.to}</Text>
                  : <Text style={[styles.dayClosed, { color: colors.muted }]}>{t("مغلق","Closed")}</Text>}
              </View>
              {d.open && (
                <Pressable onPress={() => Alert.alert(t("تعديل المواعيد","Edit Hours"), `${t("تعديل مواعيد","Edit hours for")} ${t(d.dayAr, d.dayEn)}`)}
                  style={[styles.editBtn, { backgroundColor: isDark ? "#2A1F45" : "#F3F0FF" }]}>
                  <Feather name="edit-2" size={14} color="#7C3AED" />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {activeTab === "branches" && (
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {BRANCHES.map((b) => (
            <Pressable key={b.id} style={[styles.branchCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => Alert.alert(b.name, `${t("المنطقة:","Area:")} ${b.area}\n${t("الهاتف:","Phone:")} ${b.phone}\n${t("المدير:","Manager:")} ${b.manager}`)}>
              <View style={styles.branchRow}>
                <Feather name="chevron-left" size={16} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <View style={styles.branchTop}>
                    <View style={[styles.branchStatus, { backgroundColor: b.open ? "#D1FAE5" : "#FEE2E2" }]}>
                      <View style={[styles.statusDot, { backgroundColor: b.open ? "#059669" : "#DC2626" }]} />
                      <Text style={[styles.branchStatusText, { color: b.open ? "#059669" : "#DC2626" }]}>{b.open ? t("مفتوح","Open") : t("مغلق","Closed")}</Text>
                    </View>
                    <Text style={[styles.branchName, { color: colors.text }]}>{b.name}</Text>
                  </View>
                  <Text style={[styles.branchArea, { color: colors.muted }]}>{b.area}</Text>
                  <Text style={[styles.branchMgr, { color: colors.textSecondary }]}>{t("المدير:","Manager:")} {b.manager}</Text>
                </View>
                <View style={[styles.branchIcon, { backgroundColor: "#7C3AED20" }]}>
                  <Feather name="map-pin" size={20} color="#7C3AED" />
                </View>
              </View>
            </Pressable>
          ))}
          <Pressable style={[styles.addBranchBtn, { borderColor: "#7C3AED", backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}
            onPress={() => Alert.alert(t("إضافة فرع","Add Branch"), t("سيتم فتح نموذج إضافة فرع جديد","A form to add a new branch will open"))}>
            <Feather name="plus" size={16} color="#7C3AED" />
            <Text style={[styles.addBranchText, { color: "#7C3AED" }]}>{t("إضافة فرع جديد","Add New Branch")}</Text>
          </Pressable>
        </View>
      )}
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
  branchRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  branchIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  branchTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  branchName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  branchStatus: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignItems: "center" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  branchStatusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  branchArea: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  branchMgr: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  addBranchBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderStyle: "dashed" },
  addBranchText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
});
