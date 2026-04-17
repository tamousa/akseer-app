import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ClinicServices() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const SECTIONS = [
    { key: "medical-staff", labelAr: "الكادر الصحي", labelEn: "Medical Staff", icon: "users" as const, color: C, bg: "#CFFAFE", badgeAr: "3 أطباء", badgeEn: "3 Doctors", descAr: "إدارة ملفات الأطباء والمختصين وجداولهم", descEn: "Manage doctor profiles, schedules and specialties", route: "/business-clinic/medical-staff" },
    { key: "medical-services", labelAr: "الخدمات الطبية", labelEn: "Medical Services", icon: "clipboard" as const, color: "#7C3AED", bg: "#EDE9FE", badgeAr: "5 خدمات", badgeEn: "5 Services", descAr: "إدارة الخدمات والباقات الطبية المتاحة للحجز", descEn: "Manage medical services and packages available for booking", route: "/business-clinic/medical-services" },
    { key: "appointments", labelAr: "المواعيد", labelEn: "Appointments", icon: "calendar" as const, color: "#059669", bg: "#D1FAE5", badgeAr: "3 اليوم", badgeEn: "3 Today", descAr: "جدولة وإدارة مواعيد المرضى (حضوري / مرئي / منزلي)", descEn: "Schedule and manage patient appointments (In-Clinic / Virtual / Home)", route: "/business-clinic/appointments" },
    { key: "home-visits", labelAr: "الخدمة المنزلية", labelEn: "Home Visits", icon: "home" as const, color: "#D97706", bg: "#FEF3C7", badgeAr: "1 مجدول", badgeEn: "1 Scheduled", descAr: "إدارة طلبات الزيارات المنزلية وتخصيص المختصين", descEn: "Manage home visit requests and assign specialists", route: "/business-clinic/home-visits" },
    { key: "schedule", labelAr: "مواعيد العمل والفروع", labelEn: "Work Schedule & Branches", icon: "clock" as const, color: "#2563EB", bg: "#DBEAFE", badgeAr: "2 فرع", badgeEn: "2 Branches", descAr: "ضبط ساعات العمل وإدارة فروع العيادة", descEn: "Set working hours and manage clinic branches", route: "/business-clinic/schedule" },
    { key: "reviews", labelAr: "التقييمات والأسئلة", labelEn: "Reviews & Questions", icon: "message-square" as const, color: "#EC4899", bg: "#FCE7F3", badgeAr: "12 جديد", badgeEn: "12 New", descAr: "استعراض والرد على تقييمات وأسئلة المرضى", descEn: "Browse and reply to patient reviews and questions", route: "/business-clinic/reviews" },
  ];

  const QUICK = [
    { key: "add-service", labelAr: "إضافة خدمة", labelEn: "Add Service", icon: "plus-circle" as const, color: C, route: "/business-clinic/add-service" },
    { key: "add-offer", labelAr: "إضافة عرض", labelEn: "Add Offer", icon: "tag" as const, color: "#BE185D", route: "/business-clinic/add-offer" },
    { key: "packages", labelAr: "الباقات", labelEn: "Packages", icon: "package" as const, color: "#059669", route: "/business-clinic/packages" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("إدارة العيادة","Clinic Management")}</Text>
        <Pressable style={[styles.previewBtn, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA", borderColor: C + "40" }]}
          onPress={() => router.push("/business-clinic/clinic-preview" as any)}>
          <Feather name="eye" size={14} color={C} />
          <Text style={[styles.previewBtnText, { color: C }]}>{t("معاينة العيادة","Preview Clinic")}</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 12 }}>
        {QUICK.map((q) => (
          <Pressable key={q.key} style={{ flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: q.color + "40", backgroundColor: q.color + "10" }}
            onPress={() => router.push(q.route as any)}>
            <Feather name={q.icon} size={15} color={q.color} />
            <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: q.color }}>{lang === "ar" ? q.labelAr : q.labelEn}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {SECTIONS.map((s) => (
          <Pressable key={s.key} style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(s.route as any)}>
            <View style={styles.inner}>
              <Feather name="chevron-left" size={18} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                  {(lang === "ar" ? s.badgeAr : s.badgeEn) && <View style={[styles.badge, { backgroundColor: isDark ? s.color + "25" : s.bg }]}><Text style={[styles.badgeText, { color: s.color }]}>{lang === "ar" ? s.badgeAr : s.badgeEn}</Text></View>}
                  <Text style={[styles.sLabel, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
                </View>
                <Text style={[styles.sDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
              </View>
              <View style={[styles.sIcon, { backgroundColor: isDark ? s.color + "25" : s.bg }]}>
                <Feather name={s.icon} size={22} color={s.color} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  previewBtn: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  previewBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  inner: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  topRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  sLabel: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
