import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const PACKAGES = [
  {
    id: 1, emoji: "🌟", price: 249, original: 380, active: true, homeVisit: true,
    nameAr: "باقة الفحص الشامل", nameEn: "Full Checkup Package",
    targetAr: "للكشف السنوي العام", targetEn: "For annual checkup",
    tests: ["صورة دم كاملة", "سكر صائم", "سكر تراكمي HbA1c", "وظائف الكبد", "وظائف الكلى", "دهون الدم", "فيتامين D", "فيتامين B12", "هرمونات الغدة الدرقية", "تحليل البول"],
    resultTime: "24h",
  },
  {
    id: 2, emoji: "🍬", price: 149, original: 205, active: true, homeVisit: true,
    nameAr: "باقة مرضى السكري", nameEn: "Diabetes Package",
    targetAr: "لمرضى السكري والمتابعة", targetEn: "For diabetes monitoring",
    tests: ["سكر صائم", "سكر تراكمي HbA1c", "صورة دم كاملة", "وظائف الكلى", "دهون الدم"],
    resultTime: "6h",
  },
  {
    id: 3, emoji: "⚗️", price: 279, original: 360, active: true, homeVisit: true,
    nameAr: "باقة الصحة الهرمونية", nameEn: "Hormonal Health Package",
    targetAr: "للتحقق من التوازن الهرموني", targetEn: "For hormonal balance",
    tests: ["هرمونات الغدة الدرقية TSH/T3/T4", "فيتامين D", "فيتامين B12", "صورة دم كاملة", "حديد الدم + فريتين"],
    resultTime: "24h",
  },
  {
    id: 4, emoji: "🫀", price: 140, original: 190, active: false, homeVisit: true,
    nameAr: "باقة الكبد والكلى", nameEn: "Liver & Kidney Package",
    targetAr: "تقييم وظائف الأعضاء الحيوية", targetEn: "Vital organ function evaluation",
    tests: ["وظائف الكبد الشاملة LFT", "وظائف الكلى الشاملة KFT", "صورة دم كاملة", "دهون الدم"],
    resultTime: "8h",
  },
];

export default function PackagesPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pkgs, setPkgs] = useState(PACKAGES.map((p) => ({ ...p })));

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const togglePkg = (id: number) => setPkgs((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("باقات التحاليل","Test Packages")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إنشاء باقة","Create Package"), t("سيتم فتح نموذج إنشاء باقة جديدة","A form to create a new package will open"))}>
          <Feather name="plus" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.infoBanner, { backgroundColor: isDark ? "#0A1A30" : "#EFF6FF", borderColor: C + "30" }]}>
        <Feather name="package" size={16} color={C} />
        <Text style={[styles.infoText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>
          {t("الباقات تجمع عدة تحاليل بسعر مخفّض وتظهر للمرضى في الصفحة الرئيسية وصفحة المختبر في أكسير.",
             "Packages bundle multiple tests at a discounted price and appear to patients on the home and lab pages in Akseer.")}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 14 }}>
        {pkgs.map((pkg) => {
          const isExp = expanded === pkg.id;
          const savings = pkg.original - pkg.price;
          const discountPct = Math.round((savings / pkg.original) * 100);
          return (
            <Pressable key={pkg.id} style={[styles.pkgCard, { backgroundColor: cardBg, borderColor: pkg.active ? C + "40" : cardBorder }]}
              onPress={() => setExpanded(isExp ? null : pkg.id)}>
              <View style={styles.pkgTop}>
                <Switch value={pkg.active} onValueChange={() => togglePkg(pkg.id)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={pkg.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <View style={styles.pkgNameRow}>
                    <View style={[styles.discountBadge, { backgroundColor: "#FEF3C7" }]}>
                      <Text style={[styles.discountText, { color: "#D97706" }]}>{t("خصم","Discount")} {discountPct}%</Text>
                    </View>
                    <Text style={[styles.pkgName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? pkg.nameAr : pkg.nameEn}</Text>
                  </View>
                  <Text style={[styles.pkgTarget, { color: colors.muted }]}>{lang === "ar" ? pkg.targetAr : pkg.targetEn}</Text>
                  <View style={styles.pkgPriceRow}>
                    <Text style={[styles.pkgSavings, { color: "#059669" }]}>{t("وفّر","Save")} {savings} SAR</Text>
                    <Text style={[styles.pkgOriginal, { color: colors.muted }]}>{pkg.original} SAR</Text>
                    <Text style={[styles.pkgPrice, { color: C }]}>{pkg.price} SAR</Text>
                  </View>
                </View>
                <View style={[styles.pkgEmoji, { backgroundColor: C + "15" }]}>
                  <Text style={{ fontSize: 28 }}>{pkg.emoji}</Text>
                  <View style={[styles.testsCount, { backgroundColor: C }]}>
                    <Text style={styles.testsCountText}>{pkg.tests.length}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.pkgMeta}>
                <View style={[styles.metaTag, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Feather name="clock" size={11} color={C} />
                  <Text style={[styles.metaTagText, { color: C }]}>{pkg.resultTime}</Text>
                </View>
                {pkg.homeVisit && (
                  <View style={[styles.metaTag, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                    <Text style={[styles.metaTagText, { color: "#059669" }]}>🏠 {t("منزلي","Home")}</Text>
                  </View>
                )}
                <Text style={[styles.testsNum, { color: colors.muted }]}>{pkg.tests.length} {t("تحليل","tests")}</Text>
              </View>

              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  <Text style={[styles.includesLabel, { color: colors.muted }]}>{t("التحاليل المشمولة","Included Tests")}</Text>
                  <View style={styles.testsList}>
                    {pkg.tests.map((tx, i) => (
                      <View key={i} style={styles.testItem}>
                        <Text style={[styles.testItemText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{tx}</Text>
                        <Feather name="check-circle" size={14} color={C} />
                      </View>
                    ))}
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("حذف الباقة","Delete Package"), `${t("حذف","Delete")} "${lang === "ar" ? pkg.nameAr : pkg.nameEn}"؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("حذف","Delete"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("حذف","Delete")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل باقة","Edit package")} ${lang === "ar" ? pkg.nameAr : pkg.nameEn}`)}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تعديل الباقة","Edit Package")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable style={[styles.addPkgBtn, { borderColor: C, backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16 }]}
        onPress={() => Alert.alert(t("باقة جديدة","New Package"), t("سيتم فتح نموذج إنشاء باقة جديدة مخصصة","A custom package creation form will open"))}>
        <Feather name="plus" size={16} color={C} />
        <Text style={[styles.addPkgBtnText, { color: C }]}>{t("إنشاء باقة جديدة","Create New Package")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  infoBanner: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
  pkgCard: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 10 },
  pkgTop: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  pkgEmoji: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  testsCount: { position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  testsCountText: { fontSize: 10, fontFamily: "Cairo_700Bold", color: "#fff" },
  pkgNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  pkgName: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  discountText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgTarget: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 8 },
  pkgPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgPrice: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  pkgOriginal: { fontSize: 13, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  pkgSavings: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgMeta: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  metaTag: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  metaTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  testsNum: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  expandedSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 12, gap: 12 },
  includesLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  testsList: { gap: 8 },
  testItem: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  testItemText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  addPkgBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderStyle: "dashed" },
  addPkgBtnText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
