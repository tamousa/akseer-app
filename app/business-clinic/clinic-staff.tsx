import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ClinicStaffPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);

  const ROLES: Record<string, { labelAr: string; labelEn: string; color: string; bg: string }> = {
    manager: { labelAr: "مدير", labelEn: "Manager", color: C, bg: "#CFFAFE" },
    receptionist: { labelAr: "موظف استقبال", labelEn: "Receptionist", color: "#059669", bg: "#D1FAE5" },
    coordinator: { labelAr: "منسق مواعيد", labelEn: "Appointments Coordinator", color: "#7C3AED", bg: "#EDE9FE" },
    accountant: { labelAr: "محاسب", labelEn: "Accountant", color: "#D97706", bg: "#FEF3C7" },
  };

  const STAFF = [
    { id: 1, nameAr: "سلمى الدوسري", nameEn: "Salma Al-Dossari", email: "salma@clinic.sa", role: "manager", branchAr: "الكل", branchEn: "All Branches", active: true, lastLoginAr: "منذ ساعة", lastLoginEn: "1 hour ago" },
    { id: 2, nameAr: "رانية المالكي", nameEn: "Rania Al-Maliki", email: "rania@clinic.sa", role: "receptionist", branchAr: "الفرع الرئيسي", branchEn: "Main Branch", active: true, lastLoginAr: "منذ 20 دقيقة", lastLoginEn: "20 minutes ago" },
    { id: 3, nameAr: "هند الشمري", nameEn: "Hend Al-Shammari", email: "hend@clinic.sa", role: "coordinator", branchAr: "فرع العليا", branchEn: "Al-Olaya Branch", active: true, lastLoginAr: "منذ 3 ساعات", lastLoginEn: "3 hours ago" },
    { id: 4, nameAr: "عمر الحربي", nameEn: "Omar Al-Harbi", email: "omar@clinic.sa", role: "accountant", branchAr: "الكل", branchEn: "All Branches", active: false, lastLoginAr: "أمس", lastLoginEn: "Yesterday" },
  ];

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الموظفون الإداريون","Administrative Staff")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إضافة موظف","Add Staff"), t("سيتم إرسال دعوة بريدية للموظف الجديد","An email invitation will be sent to the new staff member"))}>
          <Feather name="user-plus" size={16} color="#fff" />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {STAFF.map((member) => {
          const role = ROLES[member.role];
          const isExp = expanded === member.id;
          return (
            <Pressable key={member.id} style={[styles.staffCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => setExpanded(isExp ? null : member.id)}>
              <View style={styles.staffRow}>
                <Feather name={isExp ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <View style={styles.topRow}>
                    <View style={[styles.roleBadge, { backgroundColor: isDark ? role.color + "25" : role.bg }]}>
                      <Text style={[styles.roleText, { color: role.color }]}>{lang === "ar" ? role.labelAr : role.labelEn}</Text>
                    </View>
                    <Text style={[styles.staffName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? member.nameAr : member.nameEn}</Text>
                    <View style={[styles.dot, { backgroundColor: member.active ? "#059669" : "#DC2626" }]} />
                  </View>
                  <Text style={[styles.email, { color: colors.muted }]}>{member.email}</Text>
                </View>
                <View style={[styles.avatar, { backgroundColor: role.color + "20" }]}>
                  <Text style={[styles.avatarText, { color: role.color }]}>{(lang === "ar" ? member.nameAr : member.nameEn).charAt(0)}</Text>
                </View>
              </View>
              {isExp && (
                <View style={[styles.expandSection, { borderTopColor: cardBorder }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? member.branchAr : member.branchEn}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("الفرع","Branch")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{lang === "ar" ? member.lastLoginAr : member.lastLoginEn}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("آخر دخول","Last Login")}</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("إزالة","Remove"), `${t("هل تريد إزالة","Remove")} ${lang === "ar" ? member.nameAr : member.nameEn}؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("إزالة","Remove"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("إزالة","Remove")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تعديل الصلاحيات","Edit Permissions"), `${lang === "ar" ? member.nameAr : member.nameEn}`)}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تعديل","Edit")}</Text>
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
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  staffCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  staffRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  topRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  staffName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  email: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  roleText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  expandSection: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10, marginTop: 4 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
