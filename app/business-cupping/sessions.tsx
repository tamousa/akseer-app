import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function CuppingSessions() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const SESSION_TYPES = [
    { id: 1, nameAr: "حجامة رطبة", nameEn: "Wet Cupping", price: 280, duration: 45, homeVisit: true, active: true },
    { id: 2, nameAr: "حجامة جافة", nameEn: "Dry Cupping", price: 180, duration: 30, homeVisit: true, active: true },
    { id: 3, nameAr: "حجامة وجه", nameEn: "Facial Cupping", price: 200, duration: 35, homeVisit: false, active: true },
    { id: 4, nameAr: "حجامة ظهر كاملة", nameEn: "Full Back Cupping", price: 320, duration: 60, homeVisit: true, active: true },
    { id: 5, nameAr: "حجامة قدم", nameEn: "Foot Cupping", price: 150, duration: 25, homeVisit: true, active: true },
    { id: 6, nameAr: "حجامة رأس", nameEn: "Head Cupping", price: 160, duration: 30, homeVisit: false, active: true },
    { id: 7, nameAr: "حجامة وجه وجبهة", nameEn: "Face & Forehead Cupping", price: 240, duration: 40, homeVisit: false, active: false },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("أنواع الجلسات","Session Types")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-cupping/packages" as any)}>
            <Feather name="package" size={18} color={colors.primary} />
          </Pressable>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-cupping/add-session" as any)}>
            <Feather name="plus" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.sterilBanner, { backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" }]}>
        <Feather name="shield" size={16} color="#059669" />
        <Text style={[styles.sterilText, { color: "#065F46" }]}>{t("التعقيم: أدوات معقّمة ومفردة لكل جلسة — مطلوب تسجيل يومي","Sterilization: Single-use sterile tools per session — daily log required")}</Text>
        <Pressable style={styles.sterilBtn}>
          <Text style={[styles.sterilBtnText, { color: "#059669" }]}>{t("سجّل","Log")}</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}>
        {SESSION_TYPES.map((sv) => (
          <View key={sv.id} style={[styles.sessCard, { backgroundColor: colors.surface, borderColor: BRAND + "25" }]}>
            <View style={[styles.sessIcon, { backgroundColor: BRAND + "20" }]}>
              <Feather name="droplet" size={20} color={BRAND} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessName, { color: colors.text }]}>{lang === "ar" ? sv.nameAr : sv.nameEn}</Text>
              <View style={{ flexDirection: "row-reverse", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                <Text style={[styles.sessMeta, { color: colors.muted }]}>⏱ {sv.duration} {t("د","min")}</Text>
                <Text style={[styles.sessMeta, { color: BRAND }]}>{sv.price} SAR</Text>
                {sv.homeVisit && (
                  <View style={styles.homeBadge}>
                    <Feather name="home" size={10} color="#6366F1" />
                    <Text style={styles.homeText}>{t("منزلي","Home")}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[styles.statusBadge, { backgroundColor: sv.active ? "#DCFCE7" : "#FEE2E2" }]}>
                <Text style={[styles.statusText, { color: sv.active ? "#059669" : "#EF4444" }]}>{sv.active ? t("نشط","Active") : t("موقوف","Inactive")}</Text>
              </View>
              <Pressable style={[styles.actionBtn, { backgroundColor: BRAND + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل:","Edit:")} ${lang === "ar" ? sv.nameAr : sv.nameEn}`)}>
                <Feather name="edit-2" size={14} color={BRAND} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sterilBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 8, margin: 16, padding: 12, borderRadius: 12, borderWidth: 1 },
  sterilText: { flex: 1, fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sterilBtn: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#ECFDF5", borderRadius: 8 },
  sterilBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sessCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  sessIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sessName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sessMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  homeBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#EEF2FF", borderRadius: 8 },
  homeText: { fontSize: 10, fontFamily: "Tajawal_700Bold", color: "#6366F1" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  actionBtn: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
