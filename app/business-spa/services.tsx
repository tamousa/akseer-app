import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function SpaServices() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const CATS = [
    { ar: "الكل", en: "All" },
    { ar: "تدليك", en: "Massage" },
    { ar: "حرارة", en: "Heat" },
    { ar: "مائي", en: "Aquatic" },
  ];

  const SERVICES = [
    { id: 1, nameAr: "تدليك سويدي", nameEn: "Swedish Massage", catAr: "تدليك", catEn: "Massage", price: 320, duration: 60, rooms: true, active: true },
    { id: 2, nameAr: "تدليك بالأحجار الساخنة", nameEn: "Hot Stone Massage", catAr: "تدليك", catEn: "Massage", price: 420, duration: 75, rooms: true, active: true },
    { id: 3, nameAr: "تدليك رياضي", nameEn: "Sports Massage", catAr: "تدليك", catEn: "Massage", price: 350, duration: 60, rooms: true, active: true },
    { id: 4, nameAr: "ساونا جافة", nameEn: "Dry Sauna", catAr: "حرارة", catEn: "Heat", price: 120, duration: 30, rooms: false, active: true },
    { id: 5, nameAr: "حمام بخار", nameEn: "Steam Bath", catAr: "حرارة", catEn: "Heat", price: 100, duration: 30, rooms: false, active: true },
    { id: 6, nameAr: "جاكوزي", nameEn: "Jacuzzi", catAr: "مائي", catEn: "Aquatic", price: 150, duration: 30, rooms: false, active: true },
    { id: 7, nameAr: "علاج بالأعشاب", nameEn: "Herbal Treatment", catAr: "تدليك", catEn: "Massage", price: 280, duration: 50, rooms: true, active: false },
  ];

  const [catIdx, setCatIdx] = useState(0);
  const filtered = catIdx === 0 ? SERVICES : SERVICES.filter((s) => s.catAr === CATS[catIdx].ar);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("إدارة الخدمات","Manage Services")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-spa/packages" as any)}>
            <Feather name="package" size={18} color={colors.primary} />
          </Pressable>
          <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.push("/business-spa/add-service" as any)}>
            <Feather name="plus" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row-reverse", gap: 8 }}>
            {CATS.map((c, i) => (
              <Pressable key={i} style={[styles.catChip, { backgroundColor: catIdx === i ? BRAND : isDark ? "#12124A" : "#E0E7FF", borderColor: catIdx === i ? BRAND : colors.border }]} onPress={() => setCatIdx(i)}>
                <Text style={[styles.catText, { color: catIdx === i ? "#fff" : colors.text }]}>{lang === "ar" ? c.ar : c.en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        {filtered.map((sv) => (
          <View key={sv.id} style={[styles.serviceCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "25" }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <View style={[styles.catBadge, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[styles.catBadgeText, { color: BRAND }]}>{lang === "ar" ? sv.catAr : sv.catEn}</Text>
                </View>
                <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? sv.nameAr : sv.nameEn}</Text>
              </View>
              <View style={{ flexDirection: "row-reverse", gap: 10, flexWrap: "wrap" }}>
                <Text style={[styles.meta, { color: colors.muted }]}>⏱ {sv.duration} {t("دقيقة","min")}</Text>
                <Text style={[styles.meta, { color: BRAND }]}>{sv.price} SAR</Text>
                {sv.rooms && (
                  <View style={[styles.roomBadge, { backgroundColor: "#EEF2FF" }]}>
                    <Feather name="home" size={10} color={BRAND} />
                    <Text style={[styles.roomText, { color: BRAND }]}>{t("غرفة مستقلة","Private Room")}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[styles.statusBadge, { backgroundColor: sv.active ? "#DCFCE7" : "#FEE2E2" }]}>
                <Text style={[styles.statusText, { color: sv.active ? "#059669" : "#EF4444" }]}>{sv.active ? t("نشط","Active") : t("موقوف","Inactive")}</Text>
              </View>
              <Pressable style={[styles.editBtn, { backgroundColor: BRAND + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل:","Edit:")} ${lang === "ar" ? sv.nameAr : sv.nameEn}`)}>
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
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  serviceCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  meta: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  roomBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  roomText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
