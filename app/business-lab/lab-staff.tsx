import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const ROLES_AR = ["الكل", "فني مختبر", "طبيب مختبر", "إداري", "موصل عينات"];
const ROLES_EN = ["All", "Lab Technician", "Lab Doctor", "Admin", "Sample Courier"];

const STAFF = [
  { id: 1, nameAr: "فني. عمر السالم", nameEn: "Tech. Omar Al-Salim", roleAr: "فني مختبر", roleEn: "Lab Technician", license: "KFSH-LAB-44201", homeVisit: true, todayVisits: 2, active: true, specialtyAr: "أخذ عينات دم ومسحات", specialtyEn: "Blood draws and swabs", shift: "07:00 — 15:00" },
  { id: 2, nameAr: "فني. سارة النجار", nameEn: "Tech. Sara Al-Najjar", roleAr: "فني مختبر", roleEn: "Lab Technician", license: "KFSH-LAB-43876", homeVisit: true, todayVisits: 1, active: true, specialtyAr: "أخذ عينات + تحضير مزارع", specialtyEn: "Sampling + culture prep", shift: "07:00 — 15:00" },
  { id: 3, nameAr: "د. أحمد الدوسري", nameEn: "Dr. Ahmed Al-Dosari", roleAr: "طبيب مختبر", roleEn: "Lab Doctor", license: "SCH-PATH-7821", homeVisit: false, todayVisits: 0, active: true, specialtyAr: "أمراض دم وباثولوجيا", specialtyEn: "Hematology & Pathology", shift: "09:00 — 17:00" },
  { id: 4, nameAr: "منال الشمراني", nameEn: "Manal Al-Shamrani", roleAr: "إداري", roleEn: "Admin", license: "—", homeVisit: false, todayVisits: 0, active: true, specialtyAr: "استقبال وجدولة المواعيد", specialtyEn: "Reception & scheduling", shift: "07:00 — 15:00" },
];

export default function LabStaffPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [roleIdx, setRoleIdx] = useState(0);
  const [staff, setStaff] = useState(STAFF.map((s) => ({ ...s })));
  const [expanded, setExpanded] = useState<number | null>(null);

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const toggleStaff = (id: number) => setStaff((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  const filtered = roleIdx === 0 ? staff : staff.filter((s) => s.roleAr === ROLES_AR[roleIdx]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("موظفو المختبر","Lab Staff")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إضافة موظف","Add Staff"), t("سيتم فتح نموذج إضافة موظف جديد","A form to add a new staff member will open"))}>
          <Feather name="user-plus" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {ROLES_AR.map((r, i) => (
          <Pressable key={r} style={[styles.filterChip, { borderColor: roleIdx === i ? C : cardBorder, backgroundColor: roleIdx === i ? C : cardBg }]}
            onPress={() => setRoleIdx(i)}>
            <Text style={[styles.filterText, { color: roleIdx === i ? "#fff" : colors.muted }]}>{lang === "ar" ? r : ROLES_EN[i]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((member) => {
          const isExp = expanded === member.id;
          return (
            <Pressable key={member.id} style={[styles.staffCard, { backgroundColor: cardBg, borderColor: member.active ? C + "40" : cardBorder }]}
              onPress={() => setExpanded(isExp ? null : member.id)}>
              <View style={styles.staffTop}>
                <Switch value={member.active} onValueChange={() => toggleStaff(member.id)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={member.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <View style={[styles.roleBadge, { backgroundColor: isDark ? C + "25" : "#DBEAFE" }]}>
                      <Text style={[styles.roleText, { color: C }]}>{lang === "ar" ? member.roleAr : member.roleEn}</Text>
                    </View>
                    <Text style={[styles.staffName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? member.nameAr : member.nameEn}</Text>
                  </View>
                  <Text style={[styles.specialty, { color: colors.muted }]}>{lang === "ar" ? member.specialtyAr : member.specialtyEn}</Text>
                  <Text style={[styles.shift, { color: C }]}>⏰ {member.shift}</Text>
                </View>
                <View style={[styles.avatar, { backgroundColor: C + "20" }]}>
                  <Text style={{ fontSize: 22 }}>👤</Text>
                  {member.active && <View style={styles.activeDot} />}
                </View>
              </View>

              <View style={styles.staffMeta}>
                {member.homeVisit && (
                  <View style={[styles.metaTag, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                    <Text style={[styles.metaTagText, { color: "#059669" }]}>🏠 {member.todayVisits} {t("زيارة اليوم","visits today")}</Text>
                  </View>
                )}
                {member.license !== "—" && (
                  <View style={[styles.metaTag, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                    <Feather name="shield" size={11} color={C} />
                    <Text style={[styles.metaTagText, { color: C }]}>{t("مرخّص","Licensed")}</Text>
                  </View>
                )}
              </View>

              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  {member.license !== "—" && (
                    <View style={styles.licenseRow}>
                      <Text style={[styles.licenseValue, { color: C }]}>{member.license}</Text>
                      <Text style={[styles.licenseLabel, { color: colors.muted }]}>{t("رقم الترخيص","License Number")}</Text>
                    </View>
                  )}
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("إزالة الموظف","Remove Staff"), `${t("إزالة","Remove")} "${lang === "ar" ? member.nameAr : member.nameEn}"؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("إزالة","Remove"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("إزالة","Remove")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل بيانات","Edit profile of")} ${lang === "ar" ? member.nameAr : member.nameEn}`)}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تعديل الملف","Edit Profile")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  staffCard: { borderRadius: 18, padding: 14, borderWidth: 1, gap: 10 },
  staffTop: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#059669", position: "absolute", top: -2, right: -2, borderWidth: 2, borderColor: "#fff" },
  nameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  staffName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  roleText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  specialty: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 4 },
  shift: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  staffMeta: { flexDirection: "row-reverse", gap: 8 },
  metaTag: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  metaTagText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  expandedSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 12, gap: 10 },
  licenseRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  licenseLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  licenseValue: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
