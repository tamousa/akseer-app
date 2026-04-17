import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function MedicalServicesPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"services" | "packages">("services");

  const SERVICES_DATA = [
    { id: 1, nameAr: "استشارة طبية عامة", nameEn: "General Medical Consultation", emoji: "🩺", specialtyAr: "طب عام", specialtyEn: "General Med", durationAr: "30 دق", durationEn: "30 min", price: 350, homeVisit: false, virtual: true, active: true, descAr: "استشارة طبية شاملة مع تقييم الحالة الصحية", descEn: "Comprehensive medical consultation with health assessment" },
    { id: 2, nameAr: "جلسة علاج نفسي", nameEn: "Psychological Therapy Session", emoji: "🧠", specialtyAr: "نفسية", specialtyEn: "Psychology", durationAr: "60 دق", durationEn: "60 min", price: 280, homeVisit: true, virtual: true, active: true, descAr: "جلسة علاج سلوكي معرفي لمعالجة القلق والاكتئاب", descEn: "Cognitive behavioral therapy for anxiety, depression and stress" },
    { id: 3, nameAr: "تقييم تغذوي شامل", nameEn: "Comprehensive Nutritional Assessment", emoji: "🥗", specialtyAr: "تغذية", specialtyEn: "Nutrition", durationAr: "45 دق", durationEn: "45 min", price: 220, homeVisit: true, virtual: false, active: true, descAr: "تقييم الحالة الغذائية ووضع خطة تغذية مخصصة", descEn: "Evaluate nutritional status and create a personalized nutrition plan" },
    { id: 4, nameAr: "متابعة مرضى السكري", nameEn: "Diabetes Follow-up", emoji: "💉", specialtyAr: "طب عام", specialtyEn: "General Med", durationAr: "20 دق", durationEn: "20 min", price: 200, homeVisit: false, virtual: true, active: true, descAr: "متابعة دورية لمستويات السكر والتعديل على الخطة العلاجية", descEn: "Regular monitoring of sugar levels and treatment plan adjustments" },
    { id: 5, nameAr: "فحص ضغط الدم", nameEn: "Blood Pressure Check", emoji: "❤️", specialtyAr: "طب عام", specialtyEn: "General Med", durationAr: "15 دق", durationEn: "15 min", price: 150, homeVisit: true, virtual: false, active: false, descAr: "قياس وتقييم ضغط الدم مع تقديم التوصيات اللازمة", descEn: "Measure and evaluate blood pressure with recommendations" },
  ];

  const PACKAGES = [
    { id: 1, nameAr: "باقة المتابعة الشهرية", nameEn: "Monthly Follow-up Package", services: 4, price: 750, original: 950, descAr: "استشارة + جلستا متابعة + تقرير شهري", descEn: "Consultation + 2 follow-up sessions + monthly report", active: true },
    { id: 2, nameAr: "برنامج إنقاص الوزن (3 أشهر)", nameEn: "Weight Loss Program (3 months)", services: 12, price: 1800, original: 2400, descAr: "12 جلسة تغذية + 3 جلسات متابعة طبية", descEn: "12 nutrition sessions + 3 medical follow-up sessions", active: true },
  ];

  const [services, setServices] = useState(SERVICES_DATA.map((s) => ({ ...s })));
  const toggleService = (id: number) => setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الخدمات الطبية","Medical Services")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إضافة","Add"), `${t("إضافة","Add")} ${activeTab === "services" ? t("خدمة","Service") : t("باقة","Package")} ${t("جديدة","New")}`)}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "packages" && { backgroundColor: C }]} onPress={() => setActiveTab("packages")}>
          <Text style={[styles.tabText, { color: activeTab === "packages" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("الباقات","Packages")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "services" && { backgroundColor: C }]} onPress={() => setActiveTab("services")}>
          <Text style={[styles.tabText, { color: activeTab === "services" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("الخدمات","Services")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "services" && services.map((svc) => (
          <View key={svc.id} style={[styles.svcCard, { backgroundColor: cardBg, borderColor: svc.active ? C + "40" : cardBorder }]}>
            <View style={styles.svcTop}>
              <Switch value={svc.active} onValueChange={() => toggleService(svc.id)}
                trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={svc.active ? C : "#f4f3f4"} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.svcName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? svc.nameAr : svc.nameEn}</Text>
                <Text style={[styles.svcDesc, { color: colors.muted }]} numberOfLines={2}>{lang === "ar" ? svc.descAr : svc.descEn}</Text>
              </View>
              <View style={[styles.svcEmoji, { backgroundColor: isDark ? C + "20" : "#CFFAFE" }]}>
                <Text style={{ fontSize: 26 }}>{svc.emoji}</Text>
              </View>
            </View>
            <View style={styles.svcMeta}>
              <View style={[styles.svcTag, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                <Feather name="clock" size={11} color={C} />
                <Text style={[styles.svcTagText, { color: C }]}>{lang === "ar" ? svc.durationAr : svc.durationEn}</Text>
              </View>
              {svc.homeVisit && (
                <View style={[styles.svcTag, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                  <Text style={[styles.svcTagText, { color: "#059669" }]}>🏠 {t("منزلي","Home")}</Text>
                </View>
              )}
              {svc.virtual && (
                <View style={[styles.svcTag, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}>
                  <Text style={[styles.svcTagText, { color: "#7C3AED" }]}>📱 {t("مرئي","Virtual")}</Text>
                </View>
              )}
              <View style={{ flex: 1 }} />
              <Text style={[styles.svcPrice, { color: C }]}>{svc.price} SAR</Text>
            </View>
          </View>
        ))}

        {activeTab === "packages" && PACKAGES.map((pkg) => (
          <Pressable key={pkg.id} style={[styles.pkgCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(lang === "ar" ? pkg.nameAr : pkg.nameEn, `${lang === "ar" ? pkg.descAr : pkg.descEn}\n${t("السعر:","Price:")} ${pkg.price} SAR`)}>
            <View style={styles.pkgRow}>
              <Feather name="chevron-left" size={16} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.pkgName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? pkg.nameAr : pkg.nameEn}</Text>
                <Text style={[styles.pkgDesc, { color: colors.muted }]}>{lang === "ar" ? pkg.descAr : pkg.descEn}</Text>
                <View style={styles.pkgPriceRow}>
                  <Text style={[styles.pkgOriginal, { color: colors.muted }]}>{pkg.original} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: C }]}>{pkg.price} SAR</Text>
                </View>
              </View>
              <View style={[styles.pkgIcon, { backgroundColor: isDark ? C + "20" : "#CFFAFE" }]}>
                <Feather name="box" size={22} color={C} />
                <Text style={[styles.pkgSessions, { color: C }]}>{pkg.services} {t("جلسة","sessions")}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  svcCard: { borderRadius: 18, padding: 14, borderWidth: 1, gap: 10 },
  svcTop: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  svcEmoji: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  svcName: { fontSize: 14, fontFamily: "Tajawal_700Bold", marginBottom: 4 },
  svcDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", lineHeight: 17 },
  svcMeta: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6, alignItems: "center" },
  svcTag: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  svcTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  svcPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  pkgCard: { borderRadius: 18, padding: 14, borderWidth: 1 },
  pkgRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  pkgIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 2 },
  pkgSessions: { fontSize: 9, fontFamily: "Tajawal_700Bold" },
  pkgName: { fontSize: 14, fontFamily: "Tajawal_700Bold", marginBottom: 4 },
  pkgDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 6 },
  pkgPriceRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  pkgPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  pkgOriginal: { fontSize: 12, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
});
