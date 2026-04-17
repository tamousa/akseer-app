import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ResultsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const PENDING_RESULTS = [
    { id: "LAB-802", patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", testsAr: "باقة الفحص الشامل (10 تحاليل)", testsEn: "Comprehensive Panel (10 tests)", completedAtAr: "اليوم 09:40", completedAtEn: "Today 09:40", urgent: true },
    { id: "LAB-803", patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", testsAr: "هرمونات الغدة الدرقية TSH/T3/T4", testsEn: "Thyroid Hormones TSH/T3/T4", completedAtAr: "اليوم 11:15", completedAtEn: "Today 11:15", urgent: false },
    { id: "LAB-804", patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", testsAr: "وظائف الكبد + وظائف الكلى", testsEn: "Liver & Kidney Function", completedAtAr: "اليوم 12:00", completedAtEn: "Today 12:00", urgent: true },
  ];

  const DONE_RESULTS = [
    { id: "LAB-801", patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", testsAr: "صورة دم كاملة + سكر صائم", testsEn: "CBC + Fasting Glucose", uploadedAtAr: "اليوم 09:15", uploadedAtEn: "Today 09:15", notified: true },
    { id: "LAB-800", patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", testsAr: "باقة مرضى السكري", testsEn: "Diabetes Patient Package", uploadedAtAr: "أمس 11:30", uploadedAtEn: "Yesterday 11:30", notified: true },
  ];

  const [pending, setPending] = useState(PENDING_RESULTS.map((p) => ({ ...p, done: false })));
  const [activeTab, setActiveTab] = useState<"pending" | "done">("pending");

  const cardBg = colors.surface;
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  const uploadResult = (id: string) => {
    Alert.alert(t("رفع النتيجة","Upload Result"), t("اختر طريقة رفع ملف النتيجة","Choose how to upload the result file"), [
      { text: t("ملف PDF","PDF File"), onPress: () => confirmUpload(id) },
      { text: t("صورة","Image"), onPress: () => confirmUpload(id) },
      { text: t("إلغاء","Cancel"), style: "cancel" },
    ]);
  };

  const confirmUpload = (id: string) => {
    setPending((prev) => prev.map((p) => p.id === id ? { ...p, done: true } : p));
    Alert.alert(t("تم الرفع ✓","Uploaded ✓"), t("تم رفع النتيجة وإشعار المريض عبر التطبيق","Result uploaded and patient notified via app"));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("إدارة النتائج","Manage Results")}</Text>
        <View style={[styles.pendingBadge, { backgroundColor: "#FEF3C7" }]}>
          <Text style={[styles.pendingBadgeText, { color: "#D97706" }]}>{pending.filter((p) => !p.done).length} {t("معلقة","pending")}</Text>
        </View>
      </View>

      <View style={[styles.alertBanner, { backgroundColor: isDark ? "#292005" : "#FEF3C7", borderColor: "#D9770630" }]}>
        <Feather name="alert-triangle" size={16} color="#D97706" />
        <Text style={[styles.alertText, { color: isDark ? "#FDE68A" : "#92400E" }]}>
          {pending.filter((p) => !p.done).length} {t("نتيجة بانتظار الرفع","results pending upload")} · {pending.filter((p) => !p.done && p.urgent).length} {t("منها عاجلة","urgent")}
        </Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt }]}>
        <Pressable style={[styles.tabBtn, activeTab === "done" && { backgroundColor: C }]} onPress={() => setActiveTab("done")}>
          <Text style={[styles.tabText, { color: activeTab === "done" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("مُرفوعة","Uploaded")} ({DONE_RESULTS.length})</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "pending" && { backgroundColor: C }]} onPress={() => setActiveTab("pending")}>
          <Text style={[styles.tabText, { color: activeTab === "pending" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("معلقة","Pending")} ({pending.filter((p) => !p.done).length})</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "pending" && pending.map((r) => (
          <View key={r.id} style={[styles.resultCard, { backgroundColor: cardBg, borderColor: r.urgent && !r.done ? "#DC262640" : cardBorder }]}>
            {r.urgent && !r.done && (
              <View style={[styles.urgentBadge, { backgroundColor: "#FEE2E2" }]}>
                <Feather name="alert-circle" size={12} color="#DC2626" />
                <Text style={[styles.urgentText, { color: "#DC2626" }]}>{t("عاجل","Urgent")}</Text>
              </View>
            )}
            <View style={styles.resultTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultId, { color: colors.muted }]}>{r.id}  ·  {lang === "ar" ? r.completedAtAr : r.completedAtEn}</Text>
                <Text style={[styles.resultPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? r.patientAr : r.patientEn}</Text>
                <Text style={[styles.resultTests, { color: colors.muted }]} numberOfLines={2}>{lang === "ar" ? r.testsAr : r.testsEn}</Text>
              </View>
              <View style={[styles.resultIcon, { backgroundColor: r.done ? "#D1FAE5" : C + "20" }]}>
                {r.done ? <Feather name="check-circle" size={24} color="#059669" /> : <Feather name="file-text" size={24} color={C} />}
              </View>
            </View>
            {!r.done ? (
              <View style={styles.actionRow}>
                <Pressable style={[styles.actionBtn, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}
                  onPress={() => Alert.alert(t("دردشة","Chat"), `${t("التواصل مع","Chat with")} ${lang === "ar" ? r.patientAr : r.patientEn}`)}>
                  <Feather name="message-circle" size={13} color={C} />
                  <Text style={[styles.actionBtnText, { color: C }]}>{t("دردشة","Chat")}</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: "#059669" }]} onPress={() => uploadResult(r.id)}>
                  <Feather name="upload" size={13} color="#fff" />
                  <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("رفع النتيجة","Upload Result")}</Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.doneBox, { backgroundColor: "#D1FAE5" }]}>
                <Feather name="check-circle" size={14} color="#059669" />
                <Text style={[styles.doneText, { color: "#059669" }]}>{t("تم رفع النتيجة وإشعار المريض ✓","Result uploaded and patient notified ✓")}</Text>
              </View>
            )}
          </View>
        ))}

        {activeTab === "done" && DONE_RESULTS.map((r) => (
          <View key={r.id} style={[styles.resultCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.resultTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultId, { color: colors.muted }]}>{r.id}  ·  {lang === "ar" ? r.uploadedAtAr : r.uploadedAtEn}</Text>
                <Text style={[styles.resultPatient, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? r.patientAr : r.patientEn}</Text>
                <Text style={[styles.resultTests, { color: colors.muted }]}>{lang === "ar" ? r.testsAr : r.testsEn}</Text>
              </View>
              <View style={[styles.resultIcon, { backgroundColor: "#D1FAE5" }]}>
                <Feather name="check-circle" size={24} color="#059669" />
              </View>
            </View>
            <View style={styles.doneMetaRow}>
              <View style={[styles.notifBadge, { backgroundColor: "#D1FAE5" }]}>
                <Feather name="bell" size={11} color="#059669" />
                <Text style={[styles.notifText, { color: "#059669" }]}>{t("تم إشعار المريض","Patient notified")}</Text>
              </View>
              <Pressable style={[styles.viewBtn, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}
                onPress={() => Alert.alert(t("عرض النتيجة","View Result"), `${t("عرض ملف نتيجة","View result file for")} ${lang === "ar" ? r.patientAr : r.patientEn}`)}>
                <Feather name="eye" size={13} color={C} />
                <Text style={[styles.viewBtnText, { color: C }]}>{t("عرض الملف","View File")}</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {activeTab === "pending" && pending.filter((p) => !p.done).length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={48} color="#059669" />
            <Text style={[styles.emptyTitle, { color: "#059669" }]}>{t("رائع! 🎉","Excellent! 🎉")}</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t("تم رفع جميع النتائج وإشعار المرضى","All results uploaded and patients notified")}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pendingBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  pendingBadgeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  alertBanner: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 16, marginBottom: 14, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center" },
  alertText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  resultCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 12 },
  urgentBadge: { flexDirection: "row-reverse", gap: 4, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignItems: "center" },
  urgentText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  resultTop: { flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  resultIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  resultId: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginBottom: 4 },
  resultPatient: { fontSize: 15, fontFamily: "Tajawal_700Bold", marginBottom: 4 },
  resultTests: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row-reverse", gap: 6, paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  doneBox: { flexDirection: "row-reverse", gap: 8, padding: 12, borderRadius: 12, alignItems: "center" },
  doneText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  doneMetaRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  notifBadge: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  notifText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  viewBtn: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  viewBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
