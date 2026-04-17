import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BeautyServices() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const CATS = [
    { ar: "الكل", en: "All" },
    { ar: "شعر", en: "Hair" },
    { ar: "بشرة", en: "Skin" },
    { ar: "مكياج", en: "Makeup" },
    { ar: "أظافر", en: "Nails" },
    { ar: "إزالة", en: "Removal" },
  ];

  const SERVICES = [
    { id: 1, nameAr: "قص وتسريح", nameEn: "Cut & Style", catAr: "شعر", catEn: "Hair", price: 80, duration: 45, active: true },
    { id: 2, nameAr: "صبغة كاملة", nameEn: "Full Color", catAr: "شعر", catEn: "Hair", price: 250, duration: 120, active: true },
    { id: 3, nameAr: "تنعيم كيراتين", nameEn: "Keratin Treatment", catAr: "شعر", catEn: "Hair", price: 450, duration: 180, active: true },
    { id: 4, nameAr: "عناية بالبشرة", nameEn: "Facial Care", catAr: "بشرة", catEn: "Skin", price: 200, duration: 60, active: true },
    { id: 5, nameAr: "مكياج سواريه", nameEn: "Evening Makeup", catAr: "مكياج", catEn: "Makeup", price: 350, duration: 90, active: true },
    { id: 6, nameAr: "مكياج عروس", nameEn: "Bridal Makeup", catAr: "مكياج", catEn: "Makeup", price: 800, duration: 120, active: true },
    { id: 7, nameAr: "مانيكير + باديكير", nameEn: "Mani + Pedi", catAr: "أظافر", catEn: "Nails", price: 120, duration: 60, active: true },
    { id: 8, nameAr: "تطويل أظافر", nameEn: "Nail Extensions", catAr: "أظافر", catEn: "Nails", price: 180, duration: 75, active: false },
    { id: 9, nameAr: "إزالة شعر كاملة", nameEn: "Full Hair Removal", catAr: "إزالة", catEn: "Removal", price: 160, duration: 60, active: true },
  ];

  const [catIdx, setCatIdx] = useState(0);
  const filtered = catIdx === 0 ? SERVICES : SERVICES.filter((s) => s.catAr === CATS[catIdx].ar);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("إدارة الخدمات","Manage Services")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-beauty/packages" as any)}>
            <Feather name="package" size={18} color={colors.primary} />
          </Pressable>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-beauty/add-service" as any)}>
            <Feather name="plus" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90, padding: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row-reverse", gap: 8 }}>
            {CATS.map((c, i) => (
              <Pressable key={i} style={[styles.catChip, { backgroundColor: catIdx === i ? BRAND : isDark ? "#2D0020" : "#FCE7F3", borderColor: catIdx === i ? BRAND : colors.border }]} onPress={() => setCatIdx(i)}>
                <Text style={[styles.catText, { color: catIdx === i ? "#fff" : colors.text }]}>{lang === "ar" ? c.ar : c.en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        {filtered.map((sv) => (
          <View key={sv.id} style={[styles.serviceCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "25" }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <View style={[styles.catBadge, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[styles.catBadgeText, { color: BRAND }]}>{lang === "ar" ? sv.catAr : sv.catEn}</Text>
                </View>
                <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? sv.nameAr : sv.nameEn}</Text>
              </View>
              <Text style={[styles.serviceMeta, { color: colors.muted }]}>⏱ {sv.duration} {t("دقيقة","min")}  ·  {sv.price} SAR</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[styles.activeBadge, { backgroundColor: sv.active ? "#DCFCE7" : "#FEE2E2" }]}>
                <Text style={[styles.activeText, { color: sv.active ? "#059669" : "#EF4444" }]}>{sv.active ? t("نشط","Active") : t("موقوف","Inactive")}</Text>
              </View>
              <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                <Pressable style={styles.editBtn} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل خدمة:","Edit service:")} ${lang === "ar" ? sv.nameAr : sv.nameEn}`)}>
                  <Feather name="edit-2" size={14} color={BRAND} />
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => Alert.alert(t("حذف","Delete"), `${t("هل تريد حذف:","Delete service:")} ${lang === "ar" ? sv.nameAr : sv.nameEn}؟`, [{ text: t("إلغاء","Cancel") }, { text: t("حذف","Delete"), style: "destructive" }])}>
                  <Feather name="trash-2" size={14} color="#EF4444" />
                </Pressable>
              </View>
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
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  serviceCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  nameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  serviceMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  activeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#FCE7F3", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" },
});
