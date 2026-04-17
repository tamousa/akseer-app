import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function RehabPatients() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATUS_MAP: Record<string, { ar: string; en: string }> = {
    active: { ar: "نشط", en: "Active" },
    completed: { ar: "مكتمل", en: "Completed" },
  };

  const PATIENTS = [
    { id: 1, nameAr: "سعد الغامدي", nameEn: "Saad Al-Ghamdi", planAr: "إعادة تأهيل ركبة", planEn: "Knee Rehabilitation", progress: 67, sessions: "8/12", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", insuranceAr: "بوبا", insuranceEn: "Bupa", status: "active" },
    { id: 2, nameAr: "ريم المالكي", nameEn: "Reem Al-Maliki", planAr: "علاج آلام الظهر", planEn: "Back Pain Therapy", progress: 38, sessions: "3/8", therapistAr: "د. سمر", therapistEn: "Dr. Samar", insuranceAr: "الأهلي", insuranceEn: "Al-Ahli", status: "active" },
    { id: 3, nameAr: "بدر العتيبي", nameEn: "Badr Al-Otaibi", planAr: "تأهيل ما بعد جراحة", planEn: "Post-Surgery Rehab", progress: 31, sessions: "5/16", therapistAr: "د. أحمد", therapistEn: "Dr. Ahmed", insuranceAr: "تعاون", insuranceEn: "Tawuniya", status: "active" },
    { id: 4, nameAr: "هند الزهراني", nameEn: "Hind Al-Zahrani", planAr: "علاج طبيعي عام", planEn: "General Physiotherapy", progress: 33, sessions: "2/6", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", insuranceAr: "—", insuranceEn: "—", status: "active" },
    { id: 5, nameAr: "طلال النجار", nameEn: "Talal Al-Najjar", planAr: "تأهيل رياضي", planEn: "Sports Rehabilitation", progress: 100, sessions: "10/10", therapistAr: "د. فاطمة", therapistEn: "Dr. Fatima", insuranceAr: "بوبا", insuranceEn: "Bupa", status: "completed" },
    { id: 6, nameAr: "منيرة العسيري", nameEn: "Munira Al-Asiri", planAr: "علاج آلام الركبة", planEn: "Knee Pain Therapy", progress: 80, sessions: "8/10", therapistAr: "د. سمر", therapistEn: "Dr. Samar", insuranceAr: "الراجحي", insuranceEn: "Al-Rajhi", status: "completed" },
  ];

  const FILTERS = [
    { key: "all" as const, labelAr: "الكل", labelEn: "All" },
    { key: "active" as const, labelAr: "نشط", labelEn: "Active" },
    { key: "completed" as const, labelAr: "مكتمل", labelEn: "Completed" },
  ];

  const [search, setSearch] = useState("");
  const [filterIdx, setFilterIdx] = useState(0);

  const filtered = PATIENTS.filter((p) =>
    (filterIdx === 0 || p.status === FILTERS[filterIdx].key) &&
    (search === "" || p.nameAr.includes(search) || p.nameEn.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("المرضى","Patients")} ({PATIENTS.length})</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => Alert.alert(t("تسجيل مريض","Register Patient"), t("سيتم فتح نموذج تسجيل مريض جديد","A new patient registration form will open"))}>
          <Feather name="user-plus" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t("ابحث باسم المريض...","Search by patient name...")}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          {FILTERS.map((f, i) => (
            <Pressable key={i} style={[styles.filterChip, { backgroundColor: filterIdx === i ? BRAND : isDark ? "#003020" : "#D1FAE5", borderColor: filterIdx === i ? BRAND : colors.border }]} onPress={() => setFilterIdx(i)}>
              <Text style={[styles.filterText, { color: filterIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? f.labelAr : f.labelEn}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 90 }}>
        {filtered.map((p) => {
          const st = STATUS_MAP[p.status];
          return (
            <Pressable key={p.id} style={[styles.patientCard, { backgroundColor: colors.surface, borderColor: BRAND + "25" }]}
              onPress={() => Alert.alert(lang === "ar" ? p.nameAr : p.nameEn, `${t("خطة العلاج:","Treatment:")} ${lang === "ar" ? p.planAr : p.planEn}\n${t("المعالج:","Therapist:")} ${lang === "ar" ? p.therapistAr : p.therapistEn}\n${t("التأمين:","Insurance:")} ${lang === "ar" ? p.insuranceAr : p.insuranceEn}`)}>
              <View style={[styles.avatar, { backgroundColor: p.status === "completed" ? "#047857" : BRAND }]}>
                <Feather name="user" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
                  <View style={[styles.statusBadge, { backgroundColor: p.status === "completed" ? "#DCFCE7" : "#D1FAE5" }]}>
                    <Text style={[styles.statusText, { color: p.status === "completed" ? "#047857" : BRAND }]}>{lang === "ar" ? st.ar : st.en}</Text>
                  </View>
                  <Text style={[styles.patientName, { color: colors.text }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                </View>
                <Text style={[styles.planText, { color: colors.muted }]}>{lang === "ar" ? p.planAr : p.planEn}</Text>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <View style={[styles.progressTrack, { backgroundColor: isDark ? "#003820" : "#D1FAE5" }]}>
                    <View style={[styles.progressFill, { width: `${p.progress}%` as any, backgroundColor: p.progress === 100 ? "#047857" : BRAND }]} />
                  </View>
                  <Text style={[styles.progressText, { color: BRAND }]}>{p.progress}%</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={[styles.sessText, { color: BRAND }]}>{p.sessions}</Text>
                {p.insuranceAr !== "—" && (
                  <View style={[styles.insBadge, { backgroundColor: "#EEF2FF" }]}>
                    <Text style={[styles.insText, { color: "#6366F1" }]}>{lang === "ar" ? p.insuranceAr : p.insuranceEn}</Text>
                  </View>
                )}
                <Text style={[styles.therapistText, { color: colors.muted }]}>{lang === "ar" ? p.therapistAr : p.therapistEn}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  searchBox: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  patientCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  patientName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  planText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 12, fontFamily: "Tajawal_700Bold", width: 36 },
  sessText: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  insBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  insText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  therapistText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
});
