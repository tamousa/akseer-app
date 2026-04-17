import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0369A1";

export default function LabMore() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const SECTIONS = [
    {
      titleAr: "الإدارة", titleEn: "Management", items: [
        { key: "lab-staff", labelAr: "فنيو وموظفو المختبر", labelEn: "Lab Technicians & Staff", icon: "users" as const, color: "#7C3AED", route: "/business-lab/lab-staff" },
        { key: "schedule", labelAr: "مواعيد العمل والفروع", labelEn: "Working Hours & Branches", icon: "clock" as const, color: "#2563EB", route: "/business-lab/schedule" },
      ],
    },
    {
      titleAr: "التقارير والمالية", titleEn: "Reports & Finance", items: [
        { key: "reports", labelAr: "التقارير المالية", labelEn: "Financial Reports", icon: "bar-chart-2" as const, color: "#059669", route: "/business-lab/reports" },
        { key: "invoices", labelAr: "الفواتير", labelEn: "Invoices", icon: "file-text" as const, color: C, route: "/business-lab/invoices" },
      ],
    },
    {
      titleAr: "التواصل والمعاينة", titleEn: "Communication & Preview", items: [
        { key: "reviews", labelAr: "التقييمات والأسئلة", labelEn: "Reviews & Questions", icon: "message-square" as const, color: "#EC4899", route: "/business-lab/reviews" },
        { key: "preview", labelAr: "معاينة المختبر للمرضى", labelEn: "Lab Preview for Patients", icon: "eye" as const, color: C, route: "/business-lab/lab-preview" },
      ],
    },
    {
      titleAr: "الإعدادات", titleEn: "Settings", items: [
        { key: "profile", labelAr: "ملف المختبر", labelEn: "Lab Profile", icon: "edit" as const, color: "#D97706", route: null },
        { key: "notifications", labelAr: "إعدادات الإشعارات", labelEn: "Notification Settings", icon: "bell" as const, color: "#6B7280", route: null },
        { key: "logout", labelAr: "تسجيل الخروج", labelEn: "Sign Out", icon: "log-out" as const, color: "#DC2626", route: null },
      ],
    },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <View style={[styles.labIcon, { backgroundColor: C + "20" }]}><Text style={{ fontSize: 28 }}>🔬</Text></View>
        <View>
          <Text style={[styles.labName, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("مختبر التشخيص الطبي","Medical Diagnostics Lab")}</Text>
          <Text style={[styles.labId, { color: colors.muted }]}>ID: LB-10087  ·  {t("الرياض","Riyadh")}</Text>
        </View>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.titleAr} style={{ marginBottom: 20 }}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>{lang === "ar" ? section.titleAr : section.titleEn}</Text>
          <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {section.items.map((item, i) => (
              <Pressable key={item.key}
                style={[styles.menuItem, i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: cardBorder }]}
                onPress={() => {
                  if (item.key === "logout") {
                    Alert.alert(t("تسجيل الخروج","Sign Out"), t("هل تريد تسجيل الخروج؟","Do you want to sign out?"), [
                      { text: t("إلغاء","Cancel"), style: "cancel" },
                      { text: t("خروج","Sign Out"), style: "destructive", onPress: () => router.replace("/auth" as any) },
                    ]);
                  } else if (item.route) {
                    router.push(item.route as any);
                  } else {
                    Alert.alert(lang === "ar" ? item.labelAr : item.labelEn, t("هذه الميزة قيد التطوير","This feature is under development"));
                  }
                }}>
                <Feather name="chevron-left" size={16} color={colors.muted} />
                <Text style={[styles.menuLabel, { color: item.key === "logout" ? "#DC2626" : isDark ? "#C0D8E8" : "#0A1F35" }]}>{lang === "ar" ? item.labelAr : item.labelEn}</Text>
                <View style={[styles.menuIcon, { backgroundColor: isDark ? item.color + "20" : item.color + "15" }]}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      <Text style={[styles.version, { color: colors.muted }]}>{t("أكسير أعمال — مختبرات","Akseer Business — Labs")} v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 14, paddingHorizontal: 16, marginBottom: 24 },
  labIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  labName: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  labId: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  sectionTitle: { fontSize: 12, fontFamily: "Tajawal_700Bold", paddingHorizontal: 16, marginBottom: 8 },
  sectionCard: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  menuIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Tajawal_500Medium" },
  version: { textAlign: "center", fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 10 },
});
