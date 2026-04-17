import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BeautyStaff() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STAFF = [
    { id: 1, nameAr: "نورة الشمري", nameEn: "Noura Al-Shammari", roleAr: "مختصة شعر وصبغات", roleEn: "Hair & Color Specialist", sessions: 340, rating: 4.9, statusAr: "نشط", statusEn: "Active", color: BRAND },
    { id: 2, nameAr: "هيا العتيبي", nameEn: "Haya Al-Otaibi", roleAr: "مختصة عناية بشرة", roleEn: "Skin Care Specialist", sessions: 210, rating: 4.8, statusAr: "نشط", statusEn: "Active", color: "#9D174D" },
    { id: 3, nameAr: "لمياء الحربي", nameEn: "Lamia Al-Harbi", roleAr: "مختصة مكياج", roleEn: "Makeup Specialist", sessions: 280, rating: 4.9, statusAr: "نشط", statusEn: "Active", color: "#DB2777" },
    { id: 4, nameAr: "سلمى الدوسري", nameEn: "Salma Al-Dossari", roleAr: "مختصة أظافر وإزالة", roleEn: "Nails & Removal Specialist", sessions: 195, rating: 4.7, statusAr: "إجازة", statusEn: "On Leave", color: "#EC4899" },
  ];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("الموظفات","Staff")} ({STAFF.length})</Text>
        <Pressable style={[s.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => Alert.alert(t("إضافة موظفة","Add Staff"), t("سيتم فتح نموذج إضافة موظفة جديدة","A new staff form will open"))}>
          <Feather name="user-plus" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 10 }}>
        {STAFF.map((m) => (
          <View key={m.id} style={[s.card, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: m.color + "30" }]}>
            <View style={[s.avatar, { backgroundColor: m.color }]}><Feather name="user" size={22} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? m.nameAr : m.nameEn}</Text>
              <Text style={[s.role, { color: colors.muted }]}>{lang === "ar" ? m.roleAr : m.roleEn}</Text>
              <Text style={[s.sessions, { color: m.color }]}>{m.sessions} {t("جلسة","sessions")}  ·  ★ {m.rating}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[s.statusBadge, { backgroundColor: m.statusAr === "نشط" ? "#DCFCE7" : "#FEF3C7" }]}>
                <Text style={[s.statusText, { color: m.statusAr === "نشط" ? "#059669" : "#D97706" }]}>{lang === "ar" ? m.statusAr : m.statusEn}</Text>
              </View>
              <Pressable style={[s.editBtn, { backgroundColor: m.color + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل بيانات:","Edit:")} ${lang === "ar" ? m.nameAr : m.nameEn}`)}>
                <Feather name="edit-2" size={14} color={m.color} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 2 },
  role: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 3 },
  sessions: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
