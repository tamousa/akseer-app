import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function PatientsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const PATIENTS = [
    { id: "P-001", nameAr: "أحمد الغامدي", nameEn: "Ahmed Al-Ghamdi", age: 42, genderAr: "ذكر", genderEn: "Male", lastVisitAr: "اليوم", lastVisitEn: "Today", diagnosisAr: "السكري النوع 2", diagnosisEn: "Type 2 Diabetes", doctor: "د. سارة / Dr. Sarah", visits: 8, emoji: "👨", statusAr: "منتظم", statusEn: "Regular", statusColor: "#059669", statusBg: "#D1FAE5" },
    { id: "P-002", nameAr: "منيرة القحطاني", nameEn: "Munira Al-Qahtani", age: 35, genderAr: "أنثى", genderEn: "Female", lastVisitAr: "اليوم", lastVisitEn: "Today", diagnosisAr: "قلق واكتئاب", diagnosisEn: "Anxiety & Depression", doctor: "د. خالد / Dr. Khalid", visits: 12, emoji: "👩", statusAr: "تحت المتابعة", statusEn: "Follow-up", statusColor: C, statusBg: "#CFFAFE" },
    { id: "P-003", nameAr: "فاطمة العتيبي", nameEn: "Fatima Al-Otaibi", age: 28, genderAr: "أنثى", genderEn: "Female", lastVisitAr: "اليوم", lastVisitEn: "Today", diagnosisAr: "اضطراب التغذية", diagnosisEn: "Eating Disorder", doctor: "أخ. ريم / Nurse Reem", visits: 5, emoji: "👩", statusAr: "جديد", statusEn: "New", statusColor: "#D97706", statusBg: "#FEF3C7" },
    { id: "P-004", nameAr: "خالد الشمري", nameEn: "Khalid Al-Shammari", age: 51, genderAr: "ذكر", genderEn: "Male", lastVisitAr: "أمس", lastVisitEn: "Yesterday", diagnosisAr: "ضغط الدم المرتفع", diagnosisEn: "High Blood Pressure", doctor: "د. سارة / Dr. Sarah", visits: 15, emoji: "👨", statusAr: "منتظم", statusEn: "Regular", statusColor: "#059669", statusBg: "#D1FAE5" },
    { id: "P-005", nameAr: "نورة السلمي", nameEn: "Noura Al-Salmi", age: 38, genderAr: "أنثى", genderEn: "Female", lastVisitAr: "منذ أسبوع", lastVisitEn: "1 week ago", diagnosisAr: "متابعة وقاية", diagnosisEn: "Preventive Follow-up", doctor: "د. سارة / Dr. Sarah", visits: 3, emoji: "👩", statusAr: "غير منتظم", statusEn: "Irregular", statusColor: "#DC2626", statusBg: "#FEE2E2" },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  const filtered = PATIENTS.filter((p) =>
    (lang === "ar" ? p.nameAr : p.nameEn).toLowerCase().includes(search.toLowerCase()) ||
    (lang === "ar" ? p.diagnosisAr : p.diagnosisEn).toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search)
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("سجلات المرضى","Patient Records")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("مريض جديد","New Patient"), t("سيتم فتح نموذج تسجيل مريض جديد","New patient registration form will open"))}>
          <Feather name="user-plus" size={16} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        {[
          { labelAr: "إجمالي المرضى", labelEn: "Total Patients", value: PATIENTS.length, color: C },
          { labelAr: "اليوم", labelEn: "Today", value: PATIENTS.filter((p) => p.lastVisitAr === "اليوم").length, color: "#059669" },
          { labelAr: "غير منتظمين", labelEn: "Irregular", value: PATIENTS.filter((p) => p.statusAr === "غير منتظم").length, color: "#DC2626" },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: isDark ? s.color + "15" : s.color + "10", borderColor: s.color + "30" }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Feather name="search" size={16} color={colors.muted} />
        <TextInput placeholder={t("ابحث باسم المريض أو التشخيص...","Search by name or diagnosis...")} placeholderTextColor={colors.muted}
          value={search} onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]} textAlign="right" />
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((p) => {
          const isExp = expanded === p.id;
          return (
            <Pressable key={p.id} style={[styles.patientCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => setExpanded(isExp ? null : p.id)}>
              <View style={styles.patientTop}>
                <Feather name={isExp ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <View style={styles.patientRow}>
                    <View style={[styles.statusBadge, { backgroundColor: p.statusBg }]}>
                      <Text style={[styles.statusText, { color: p.statusColor }]}>{lang === "ar" ? p.statusAr : p.statusEn}</Text>
                    </View>
                    <Text style={[styles.patientName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                  </View>
                  <Text style={[styles.patientMeta, { color: colors.muted }]}>{p.id}  ·  {p.age} {t("سنة","yrs")}  ·  {lang === "ar" ? p.diagnosisAr : p.diagnosisEn}</Text>
                </View>
                <View style={[styles.patientAvatar, { backgroundColor: C + "20" }]}>
                  <Text style={{ fontSize: 22 }}>{p.emoji}</Text>
                </View>
              </View>
              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  <View style={styles.detailGrid}>
                    {[
                      { labelAr: "الطبيب المعالج", labelEn: "Treating Doctor", value: p.doctor },
                      { labelAr: "عدد الزيارات", labelEn: "Visits", value: `${p.visits} ${t("زيارة","visits")}` },
                      { labelAr: "آخر زيارة", labelEn: "Last Visit", value: lang === "ar" ? p.lastVisitAr : p.lastVisitEn },
                      { labelAr: "الجنس", labelEn: "Gender", value: lang === "ar" ? p.genderAr : p.genderEn },
                    ].map((d, i) => (
                      <View key={i} style={styles.detailItem}>
                        <Text style={[styles.detailLabel, { color: colors.muted }]}>{lang === "ar" ? d.labelAr : d.labelEn}</Text>
                        <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{d.value}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}
                      onPress={() => Alert.alert(t("ملف المريض","Patient File"), `${t("عرض السجل الطبي الكامل لـ","Full medical record for")} ${lang === "ar" ? p.nameAr : p.nameEn}`)}>
                      <Feather name="file-text" size={14} color={C} />
                      <Text style={[styles.actionBtnText, { color: C }]}>{t("السجل الطبي","Medical Record")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("موعد جديد","New Appointment"), `${t("حجز موعد جديد للمريض","New appointment for")} ${lang === "ar" ? p.nameAr : p.nameEn}`)}>
                      <Feather name="calendar" size={14} color="#fff" />
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("حجز موعد","Book Appointment")}</Text>
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
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  pageTitle: { flex: 1, fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  statValue: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  searchBar: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 14, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  patientCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  patientTop: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  patientAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  patientRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  patientName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  patientMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  expandedSection: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 12 },
  detailGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  detailItem: { width: "47%", gap: 2 },
  detailLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row-reverse", gap: 6, paddingVertical: 10, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
