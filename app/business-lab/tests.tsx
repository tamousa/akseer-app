import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);


const CATS_AR = ["الكل", "دم", "سكر", "هرمونات", "كبد وكلى", "مناعة", "بول وبراز", "جرثومي"];
const CATS_EN = ["All", "Blood", "Sugar", "Hormones", "Liver & Kidney", "Immunity", "Urine & Stool", "Bacterial"];

const TESTS = [
  { id: 1, nameAr: "صورة دم كاملة", nameEn: "Complete Blood Count", abbrEn: "CBC", catAr: "دم", catEn: "Blood", price: 40, homeVisit: true, preparationRequired: false, resultTime: "4h", emoji: "🩸", active: true, descAr: "تحليل شامل لعناصر الدم يشمل كريات الدم الحمراء والبيضاء والصفائح الدموية والهيموغلوبين.", descEn: "Comprehensive blood analysis including red/white cells, platelets and hemoglobin.", prepAr: "لا يشترط الصيام", prepEn: "No fasting required" },
  { id: 2, nameAr: "سكر صائم وغير صائم", nameEn: "Fasting & Random Glucose", abbrEn: "FBS/RBS", catAr: "سكر", catEn: "Sugar", price: 25, homeVisit: true, preparationRequired: true, resultTime: "2h", emoji: "🍬", active: true, descAr: "قياس مستوى الجلوكوز في الدم لتشخيص ومتابعة مرض السكري.", descEn: "Measures blood glucose to diagnose and monitor diabetes.", prepAr: "صيام 8 ساعات للسكر الصائم", prepEn: "Fast 8 hours for FBS" },
  { id: 3, nameAr: "سكر تراكمي", nameEn: "Glycated Hemoglobin", abbrEn: "HbA1c", catAr: "سكر", catEn: "Sugar", price: 60, homeVisit: true, preparationRequired: false, resultTime: "6h", emoji: "📊", active: true, descAr: "يعكس متوسط مستوى السكر في الدم خلال 2-3 أشهر الماضية.", descEn: "Reflects average blood sugar over the past 2-3 months.", prepAr: "لا يشترط الصيام", prepEn: "No fasting required" },
  { id: 4, nameAr: "هرمونات الغدة الدرقية", nameEn: "Thyroid Hormones", abbrEn: "TSH/T3/T4", catAr: "هرمونات", catEn: "Hormones", price: 120, homeVisit: true, preparationRequired: false, resultTime: "24h", emoji: "⚗️", active: true, descAr: "قياس مستويات هرمونات الغدة الدرقية TSH و T3 و T4 لتقييم وظيفة الغدة.", descEn: "Measures TSH, T3, T4 to evaluate thyroid function.", prepAr: "يُفضّل في الصباح قبل أي دواء", prepEn: "Preferably before morning medication" },
  { id: 5, nameAr: "وظائف الكبد الشاملة", nameEn: "Liver Function Test", abbrEn: "LFT", catAr: "كبد وكلى", catEn: "Liver & Kidney", price: 80, homeVisit: true, preparationRequired: true, resultTime: "6h", emoji: "🫀", active: true, descAr: "فحص شامل لإنزيمات ووظائف الكبد يشمل ALT وAST والبيليروبين.", descEn: "Full liver enzyme panel including ALT, AST, bilirubin.", prepAr: "صيام 8-10 ساعات", prepEn: "Fast 8-10 hours" },
  { id: 6, nameAr: "وظائف الكلى الشاملة", nameEn: "Kidney Function Test", abbrEn: "KFT/RFT", catAr: "كبد وكلى", catEn: "Liver & Kidney", price: 80, homeVisit: true, preparationRequired: true, resultTime: "6h", emoji: "🫘", active: true, descAr: "تقييم وظائف الكلى يشمل الكرياتينين واليوريا وحامض البوليك.", descEn: "Evaluates kidney function including creatinine, urea, uric acid.", prepAr: "صيام 8 ساعات", prepEn: "Fast 8 hours" },
  { id: 7, nameAr: "دهون الدم الشاملة", nameEn: "Lipid Profile", abbrEn: "Lipid", catAr: "دم", catEn: "Blood", price: 70, homeVisit: true, preparationRequired: true, resultTime: "4h", emoji: "💧", active: true, descAr: "قياس الكوليسترول الكلي والـ LDL والـ HDL والدهون الثلاثية.", descEn: "Measures total cholesterol, LDL, HDL and triglycerides.", prepAr: "صيام 12 ساعة", prepEn: "Fast 12 hours" },
  { id: 8, nameAr: "فيتامين D", nameEn: "Vitamin D", abbrEn: "Vit D", catAr: "مناعة", catEn: "Immunity", price: 90, homeVisit: true, preparationRequired: false, resultTime: "24h", emoji: "☀️", active: true, descAr: "قياس مستوى فيتامين د في الدم لاكتشاف النقص.", descEn: "Measures vitamin D level to detect deficiency.", prepAr: "لا يشترط الصيام", prepEn: "No fasting required" },
  { id: 9, nameAr: "فيتامين B12", nameEn: "Vitamin B12", abbrEn: "B12", catAr: "مناعة", catEn: "Immunity", price: 70, homeVisit: true, preparationRequired: false, resultTime: "24h", emoji: "💊", active: false, descAr: "قياس مستوى فيتامين B12 وهو ضروري لصحة الأعصاب وتكوين الدم.", descEn: "Measures B12, essential for nerve health and blood formation.", prepAr: "لا يشترط الصيام", prepEn: "No fasting required" },
  { id: 10, nameAr: "تحليل البول الكامل", nameEn: "Urine Analysis", abbrEn: "UA", catAr: "بول وبراز", catEn: "Urine & Stool", price: 30, homeVisit: false, preparationRequired: false, resultTime: "2h", emoji: "🧪", active: true, descAr: "فحص شامل للبول لاكتشاف الالتهابات والسكر والبروتين.", descEn: "Full urine test to detect infections, sugar and protein.", prepAr: "أول بول الصباح", prepEn: "First morning urine" },
];

export default function TestsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [catIdx, setCatIdx] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tests, setTests] = useState(TESTS.map((tx) => ({ ...tx })));

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  const filtered = catIdx === 0 ? tests : tests.filter((tx) => tx.catAr === CATS_AR[catIdx]);
  const toggleTest = (id: number) => setTests((prev) => prev.map((tx) => tx.id === id ? { ...tx, active: !tx.active } : tx));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("قائمة التحاليل","Tests List")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إضافة تحليل","Add Test"), t("سيتم فتح نموذج إضافة تحليل جديد","A form to add a new test will open"))}>
          <Feather name="plus" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {[
          { labelAr: "إجمالي التحاليل", labelEn: "Total Tests", value: tests.length, color: C },
          { labelAr: "نشط", labelEn: "Active", value: tests.filter((tx) => tx.active).length, color: "#059669" },
          { labelAr: "خدمة منزلية", labelEn: "Home Visits", value: tests.filter((tx) => tx.homeVisit).length, color: "#7C3AED" },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: isDark ? s.color + "15" : s.color + "10", borderColor: s.color + "30" }]}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{t(s.labelAr, s.labelEn)}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {CATS_AR.map((cat, i) => (
          <Pressable key={cat} style={[styles.filterChip, { borderColor: catIdx === i ? C : cardBorder, backgroundColor: catIdx === i ? C : cardBg }]}
            onPress={() => setCatIdx(i)}>
            <Text style={[styles.filterText, { color: catIdx === i ? "#fff" : colors.muted }]}>{lang === "ar" ? cat : CATS_EN[i]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((test) => {
          const isExp = expanded === test.id;
          return (
            <Pressable key={test.id} style={[styles.testCard, { backgroundColor: cardBg, borderColor: test.active ? C + "40" : cardBorder }]}
              onPress={() => setExpanded(isExp ? null : test.id)}>
              <View style={styles.testTop}>
                <Switch value={test.active} onValueChange={() => toggleTest(test.id)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={test.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <View style={styles.testNameRow}>
                    <View style={[styles.catBadge, { backgroundColor: isDark ? C + "25" : "#DBEAFE" }]}>
                      <Text style={[styles.catText, { color: C }]}>{lang === "ar" ? test.catAr : test.catEn}</Text>
                    </View>
                    <Text style={[styles.testName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? test.nameAr : test.nameEn}</Text>
                  </View>
                  <Text style={[styles.testEnName, { color: colors.muted }]}>{test.abbrEn}</Text>
                </View>
                <View style={[styles.testEmoji, { backgroundColor: C + "15" }]}>
                  <Text style={{ fontSize: 24 }}>{test.emoji}</Text>
                </View>
              </View>

              <View style={styles.testMeta}>
                <View style={[styles.metaTag, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Feather name="clock" size={11} color={C} />
                  <Text style={[styles.metaTagText, { color: C }]}>{test.resultTime}</Text>
                </View>
                {test.homeVisit && (
                  <View style={[styles.metaTag, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                    <Text style={[styles.metaTagText, { color: "#059669" }]}>🏠 {t("منزلي","Home")}</Text>
                  </View>
                )}
                {test.preparationRequired && (
                  <View style={[styles.metaTag, { backgroundColor: isDark ? "#292005" : "#FEF3C7" }]}>
                    <Feather name="alert-circle" size={11} color="#D97706" />
                    <Text style={[styles.metaTagText, { color: "#D97706" }]}>{t("صيام","Fasting")}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                <Text style={[styles.testPrice, { color: C }]}>{test.price} SAR</Text>
              </View>

              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  <Text style={[styles.descText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? test.descAr : test.descEn}</Text>
                  <View style={[styles.prepBox, { backgroundColor: isDark ? "#1A3352" : "#EFF6FF" }]}>
                    <Feather name="info" size={13} color={C} />
                    <View>
                      <Text style={[styles.prepLabel, { color: C }]}>{t("تعليمات التحضير","Preparation Instructions")}</Text>
                      <Text style={[styles.prepText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? test.prepAr : test.prepEn}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("حذف التحليل","Delete Test"), `${t("هل تريد حذف تحليل","Delete test")} "${lang === "ar" ? test.nameAr : test.nameEn}"؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("حذف","Delete"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("حذف","Delete")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تعديل التحليل","Edit Test"), `${t("تعديل:","Edit:")} ${lang === "ar" ? test.nameAr : test.nameEn}`)}>
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
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  summaryValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  testCard: { borderRadius: 18, padding: 14, borderWidth: 1, gap: 10 },
  testTop: { flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" },
  testEmoji: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  testNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  testName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  testEnName: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  catBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  catText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  testMeta: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6, alignItems: "center" },
  metaTag: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  metaTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  testPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  expandedSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 12, gap: 10 },
  descText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  prepBox: { flexDirection: "row-reverse", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  prepLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold", marginBottom: 2 },
  prepText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
