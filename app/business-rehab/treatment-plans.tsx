import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function TreatmentPlans() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const PLANS = [
    { id: 1, patientAr: "سعد الغامدي", patientEn: "Saad Al-Ghamdi", titleAr: "خطة إعادة تأهيل ركبة", titleEn: "Knee Rehabilitation Plan", sessions: 12, completed: 8, therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", startDate: "01/03/2026", endDate: "30/04/2026", statusAr: "نشط", statusEn: "Active", insuranceAr: "بوبا", insuranceEn: "Bupa" },
    { id: 2, patientAr: "ريم المالكي", patientEn: "Reem Al-Maliki", titleAr: "خطة علاج آلام الظهر", titleEn: "Back Pain Therapy Plan", sessions: 8, completed: 3, therapistAr: "د. سمر", therapistEn: "Dr. Samar", startDate: "15/03/2026", endDate: "15/04/2026", statusAr: "نشط", statusEn: "Active", insuranceAr: null, insuranceEn: null },
    { id: 3, patientAr: "بدر العتيبي", patientEn: "Badr Al-Otaibi", titleAr: "خطة تأهيل ما بعد جراحة", titleEn: "Post-Surgery Rehabilitation Plan", sessions: 16, completed: 5, therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", startDate: "10/03/2026", endDate: "30/05/2026", statusAr: "نشط", statusEn: "Active", insuranceAr: "تعاون", insuranceEn: "Tawuniya" },
    { id: 4, patientAr: "طلال النجار", patientEn: "Talal Al-Najjar", titleAr: "خطة تأهيل رياضي", titleEn: "Sports Rehabilitation Plan", sessions: 10, completed: 10, therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", startDate: "01/02/2026", endDate: "15/03/2026", statusAr: "مكتمل", statusEn: "Completed", insuranceAr: "بوبا", insuranceEn: "Bupa" },
    { id: 5, patientAr: "منيرة العسيري", patientEn: "Munira Al-Asiri", titleAr: "خطة علاج آلام الركبة", titleEn: "Knee Pain Therapy Plan", sessions: 10, completed: 8, therapistAr: "د. سمر", therapistEn: "Dr. Samar", startDate: "05/03/2026", endDate: "05/04/2026", statusAr: "مكتمل", statusEn: "Completed", insuranceAr: null, insuranceEn: null },
  ];

  const FILTERS = [
    { key: "all" as const, labelAr: "الكل", labelEn: "All" },
    { key: "active" as const, labelAr: "نشط", labelEn: "Active" },
    { key: "completed" as const, labelAr: "مكتمل", labelEn: "Completed" },
  ];

  const [filterIdx, setFilterIdx] = useState(0);
  const shown = filterIdx === 0 ? PLANS : PLANS.filter((p) => filterIdx === 1 ? p.statusAr === "نشط" : p.statusAr === "مكتمل");

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("خطط العلاج","Treatment Plans")} ({PLANS.length})</Text>
        <Pressable style={[s.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => Alert.alert(t("خطة جديدة","New Plan"), t("سيتم فتح نموذج إنشاء خطة علاج جديدة","A new treatment plan form will open"))}>
          <Feather name="plus" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row-reverse", gap: 8, padding: 16, paddingBottom: 8 }}>
        {FILTERS.map((f, i) => (
          <Pressable key={i} style={[s.filterChip, { backgroundColor: filterIdx === i ? BRAND : isDark ? "#003020" : "#D1FAE5", borderColor: filterIdx === i ? BRAND : colors.border }]} onPress={() => setFilterIdx(i)}>
            <Text style={[s.filterText, { color: filterIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? f.labelAr : f.labelEn}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 90, gap: 10 }}>
        {shown.map((p) => {
          const pct = Math.round((p.completed / p.sessions) * 100);
          const isActive = p.statusAr === "نشط";
          return (
            <Pressable key={p.id} style={[s.planCard, { backgroundColor: colors.surface, borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? p.titleAr : p.titleEn, `${t("المريض:","Patient:")} ${lang === "ar" ? p.patientAr : p.patientEn}\n${t("المعالج:","Therapist:")} ${lang === "ar" ? p.therapistAr : p.therapistEn}\n${t("التأمين:","Insurance:")} ${lang === "ar" ? (p.insuranceAr || t("لا يوجد","None")) : (p.insuranceEn || t("لا يوجد","None"))}\n${t("الجلسات:","Sessions:")} ${p.completed}/${p.sessions}`)}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <View style={[s.statusBadge, { backgroundColor: isActive ? "#D1FAE5" : "#DCFCE7" }]}>
                    <Text style={[s.statusText, { color: isActive ? BRAND : "#047857" }]}>{lang === "ar" ? p.statusAr : p.statusEn}</Text>
                  </View>
                  {p.insuranceAr && (
                    <View style={[s.insBadge, { backgroundColor: "#EEF2FF" }]}>
                      <Feather name="shield" size={10} color="#6366F1" />
                      <Text style={[s.insText, { color: "#6366F1" }]}>{lang === "ar" ? p.insuranceAr : p.insuranceEn}</Text>
                    </View>
                  )}
                </View>
                <Text style={[s.planTitle, { color: colors.text }]}>{lang === "ar" ? p.titleAr : p.titleEn}</Text>
                <Text style={[s.planPatient, { color: colors.muted }]}>{t("المريض:","Patient:")} {lang === "ar" ? p.patientAr : p.patientEn}  ·  {lang === "ar" ? p.therapistAr : p.therapistEn}</Text>
                <Text style={[s.planDates, { color: colors.muted }]}>{p.startDate} — {p.endDate}</Text>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <View style={[s.progressTrack, { backgroundColor: isDark ? "#003820" : "#D1FAE5" }]}>
                    <View style={[s.progressFill, { width: `${pct}%` as any, backgroundColor: p.statusAr === "مكتمل" ? "#047857" : BRAND }]} />
                  </View>
                  <Text style={[s.progressText, { color: BRAND }]}>{p.completed}/{p.sessions}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  planCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  planTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  planPatient: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  planDates: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  insBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  insText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  progressTrack: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressText: { fontSize: 12, fontFamily: "Cairo_700Bold", width: 38, textAlign: "right" },
});
