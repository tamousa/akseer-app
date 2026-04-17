import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const STAFF = [
  { id: 1, name: "محمد العمري",  email: "m.omari@store.sa",     role: "owner",   branch: "all",  lastLogin: "5m",  active: true  },
  { id: 2, name: "خالد الشمري", email: "k.shammari@store.sa",   role: "admin",   branch: "main", lastLogin: "1h",  active: true  },
  { id: 3, name: "أحمد المالكي", email: "a.maliki@store.sa",    role: "admin",   branch: "olaya",lastLogin: "3h",  active: true  },
  { id: 4, name: "سلمى الدوسري", email: "s.dosari@store.sa",    role: "seller",  branch: "main", lastLogin: "yday",active: false },
];

export default function StaffPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [expanded, setExpanded] = useState<number | null>(null);
  const { t } = useLanguage();

  const ROLES: Record<string, { label: string; color: string; bg: string; perms: string[] }> = {
    owner:   { label: t("المالك",        "Owner"),           color: "#7C3AED", bg: "#EDE9FE", perms: [t("كامل الصلاحيات","Full Access")]                                                                   },
    admin:   { label: t("مدير",          "Admin"),           color: "#2563EB", bg: "#DBEAFE", perms: [t("المنتجات","Products"), t("الطلبات","Orders"), t("العملاء","Customers"), t("المدفوعات","Payments")] },
    seller:  { label: t("بائع",          "Seller"),          color: "#059669", bg: "#D1FAE5", perms: [t("الطلبات","Orders"), t("المخزون","Inventory")]                                                      },
    support: { label: t("دعم العملاء",    "Customer Support"),color: "#D97706", bg: "#FEF3C7", perms: [t("العملاء","Customers"), t("التقييمات","Reviews")]                                                  },
  };

  const BRANCH_LABELS: Record<string, string> = {
    all:   t("الكل","All"),
    main:  t("الفرع الرئيسي","Main Branch"),
    olaya: t("فرع العليا","Al-Olaya Branch"),
  };

  const LOGIN_LABELS: Record<string, string> = {
    "5m":   t("منذ 5 دقائق","5 min ago"),
    "1h":   t("منذ ساعة","1 hour ago"),
    "3h":   t("منذ 3 ساعات","3 hours ago"),
    "yday": t("أمس","Yesterday"),
  };

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("حسابات مدراء المتجر","Store Manager Accounts")}</Text>
        <Pressable style={styles.addBtn}
          onPress={() => Alert.alert(t("إضافة مدير","Add Manager"), t("سيتم إرسال دعوة عبر البريد الإلكتروني","An invitation will be sent via email"))}>
          <Feather name="user-plus" size={16} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.rolesRow}>
        {Object.entries(ROLES).map(([key, r]) => (
          <View key={key} style={[styles.roleChip, { backgroundColor: isDark ? r.color + "25" : r.bg }]}>
            <Text style={[styles.roleChipText, { color: r.color }]}>{r.label}</Text>
            <Text style={[styles.roleChipCount, { color: r.color }]}>{STAFF.filter((s) => s.role === key).length}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {STAFF.map((member) => {
          const role = ROLES[member.role];
          const isExpanded = expanded === member.id;
          return (
            <Pressable key={member.id} style={[styles.staffCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => setExpanded(isExpanded ? null : member.id)}>
              <View style={styles.staffRow}>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <View style={styles.staffTop}>
                    <View style={[styles.roleBadge, { backgroundColor: isDark ? role.color + "25" : role.bg }]}>
                      <Text style={[styles.roleBadgeText, { color: role.color }]}>{role.label}</Text>
                    </View>
                    <Text style={[styles.staffName, { color: isDark ? "#fff" : "#1A0A33" }]}>{member.name}</Text>
                    <View style={[styles.activeDot, { backgroundColor: member.active ? "#059669" : "#DC2626" }]} />
                  </View>
                  <Text style={[styles.staffEmail, { color: colors.muted }]}>{member.email}</Text>
                </View>
                <View style={[styles.staffAvatar, { backgroundColor: role.color + "20" }]}>
                  <Text style={[styles.staffAvatarText, { color: role.color }]}>{member.name.charAt(0)}</Text>
                </View>
              </View>

              {isExpanded && (
                <View style={[styles.staffDetails, { borderTopColor: cardBorder }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{BRANCH_LABELS[member.branch] ?? member.branch}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("الفرع","Branch")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{LOGIN_LABELS[member.lastLogin] ?? member.lastLogin}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("آخر دخول","Last Login")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{role.perms.join("، ")}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("الصلاحيات","Permissions")}</Text>
                  </View>
                  {member.role !== "owner" && (
                    <View style={styles.actionRow}>
                      <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                        onPress={() => Alert.alert(t("إزالة المدير","Remove Manager"), `${t("هل تريد إزالة","Remove")} ${member.name}؟`, [
                          { text: t("إلغاء","Cancel"), style: "cancel" },
                          { text: t("إزالة","Remove"), style: "destructive" },
                        ])}>
                        <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("إزالة","Remove")}</Text>
                      </Pressable>
                      <Pressable style={[styles.actionBtn, { backgroundColor: "#7C3AED" }]}
                        onPress={() => Alert.alert(t("تعديل الصلاحيات","Edit Permissions"), `${t("تعديل صلاحيات:","Edit permissions:")} ${member.name}`)}>
                        <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تعديل الصلاحيات","Edit Permissions")}</Text>
                      </Pressable>
                    </View>
                  )}
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
  addBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center" },
  rolesRow: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  roleChip: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  roleChipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  roleChipCount: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  staffCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  staffRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  staffAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  staffAvatarText: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  staffTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  staffName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  staffEmail: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  roleBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  staffDetails: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10, marginTop: 6 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
