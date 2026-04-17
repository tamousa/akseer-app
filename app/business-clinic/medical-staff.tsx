import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function MedicalStaffPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [specFilter, setSpecFilter] = useState("all");

  const SPECIALTIES = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "general", ar: "طب عام", en: "General Med" },
    { key: "nutrition", ar: "تغذية", en: "Nutrition" },
    { key: "psychology", ar: "نفسية", en: "Psychology" },
  ];

  const STAFF = [
    { id: 1, nameAr: "د. سارة الدوسري", nameEn: "Dr. Sarah Al-Dossari", titleAr: "استشارية", titleEn: "Consultant", emoji: "👩‍⚕️", specialtyKey: "general", specialtyAr: "طب عام", specialtyEn: "General Med", rating: 4.9, consultations: 342, available: true, experience: 8, fee: 350, bioAr: "طبيبة عامة متخصصة في الأمراض المزمنة وإدارة السكري والضغط.", bioEn: "General physician specializing in chronic diseases, diabetes and blood pressure management.", typesAr: ["حضوري", "مرئي"], typesEn: ["In-Clinic", "Virtual"], consultationsToday: 4, license: "SA-45231" },
    { id: 2, nameAr: "د. خالد العمري", nameEn: "Dr. Khalid Al-Omari", titleAr: "أخصائي", titleEn: "Specialist", emoji: "👨‍⚕️", specialtyKey: "psychology", specialtyAr: "نفسية", specialtyEn: "Psychology", rating: 4.8, consultations: 218, available: true, experience: 6, fee: 280, bioAr: "أخصائي علم النفس الإكلينيكي، متخصص في القلق والاكتئاب.", bioEn: "Clinical psychologist specializing in anxiety, depression and cognitive behavioral therapy.", typesAr: ["حضوري", "مرئي", "منزلي"], typesEn: ["In-Clinic", "Virtual", "Home"], consultationsToday: 6, license: "SA-38912" },
    { id: 3, nameAr: "أخ. ريم الحربي", nameEn: "Nurse Reem Al-Harbi", titleAr: "أخصائية", titleEn: "Specialist", emoji: "👩‍⚕️", specialtyKey: "nutrition", specialtyAr: "تغذية", specialtyEn: "Nutrition", rating: 4.7, consultations: 189, available: false, experience: 4, fee: 220, bioAr: "أخصائية تغذية إكلينيكية معتمدة، تقدم خدمة الزيارة المنزلية.", bioEn: "Certified clinical nutritionist offering home visit services and personalized diet plans.", typesAr: ["حضوري", "منزلي"], typesEn: ["In-Clinic", "Home"], consultationsToday: 0, license: "SA-52018" },
  ];

  const filtered = specFilter === "all" ? STAFF : STAFF.filter((s) => s.specialtyKey === specFilter);
  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الكادر الصحي","Medical Staff")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("إضافة عضو","Add Member"), t("سيتم فتح نموذج إضافة عضو كادر جديد","New staff member form will open"))}>
          <Feather name="user-plus" size={16} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {[
          { labelAr: "إجمالي الكادر", labelEn: "Total Staff", value: STAFF.length, color: C },
          { labelAr: "متاح الآن", labelEn: "Available Now", value: STAFF.filter((s) => s.available).length, color: "#059669" },
          { labelAr: "مواعيد اليوم", labelEn: "Today's Appts", value: STAFF.reduce((a, s) => a + s.consultationsToday, 0), color: "#D97706" },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: isDark ? s.color + "15" : s.color + "10", borderColor: s.color + "30" }]}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {SPECIALTIES.map((sp) => (
          <Pressable key={sp.key} style={[styles.filterChip, { borderColor: specFilter === sp.key ? C : cardBorder, backgroundColor: specFilter === sp.key ? C : cardBg }]}
            onPress={() => setSpecFilter(sp.key)}>
            <Text style={[styles.filterText, { color: specFilter === sp.key ? "#fff" : colors.muted }]}>{lang === "ar" ? sp.ar : sp.en}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 14 }}>
        {filtered.map((member) => {
          const isExp = expanded === member.id;
          return (
            <Pressable key={member.id} style={[styles.staffCard, { backgroundColor: cardBg, borderColor: member.available ? C + "40" : cardBorder }]}
              onPress={() => setExpanded(isExp ? null : member.id)}>
              <View style={styles.staffTop}>
                <View style={styles.staffInfo}>
                  <View style={styles.staffTitleRow}>
                    <View style={[styles.specBadge, { backgroundColor: isDark ? C + "25" : "#CFFAFE" }]}>
                      <Text style={[styles.specText, { color: C }]}>{lang === "ar" ? member.specialtyAr : member.specialtyEn}</Text>
                    </View>
                    <View style={[styles.availDot, { backgroundColor: member.available ? "#059669" : "#6B7280" }]} />
                  </View>
                  <Text style={[styles.staffName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? `${member.titleAr} ${member.nameAr}` : `${member.titleEn} ${member.nameEn}`}</Text>
                  <View style={styles.staffMeta}>
                    <Text style={[styles.metaItem, { color: colors.muted }]}>{member.experience} {t("سنة خبرة","yrs exp")}</Text>
                    <Text style={[styles.metaSep, { color: colors.muted }]}>·</Text>
                    <Feather name="star" size={11} color="#FCD34D" />
                    <Text style={[styles.ratingText, { color: "#D97706" }]}>{member.rating}</Text>
                    <Text style={[styles.metaSep, { color: colors.muted }]}>·</Text>
                    <Text style={[styles.metaItem, { color: colors.muted }]}>{member.consultations} {t("استشارة","consults")}</Text>
                  </View>
                </View>
                <View style={[styles.staffAvatar, { backgroundColor: C + "20" }]}>
                  <Text style={{ fontSize: 28 }}>{member.emoji}</Text>
                  <View style={[styles.feeTag, { backgroundColor: C }]}>
                    <Text style={styles.feeText}>{member.fee} SAR</Text>
                  </View>
                </View>
              </View>

              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  <Text style={[styles.bioText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? member.bioAr : member.bioEn}</Text>
                  <Text style={[styles.expandLabel, { color: colors.muted }]}>{t("أنواع الاستشارة","Consultation Types")}</Text>
                  <View style={styles.casesRow}>
                    {(lang === "ar" ? member.typesAr : member.typesEn).map((tp, i) => (
                      <View key={i} style={[styles.typeChip, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5", borderColor: "#05966930" }]}>
                        <Text style={[styles.typeText, { color: "#059669" }]}>
                          {["حضوري","In-Clinic"].includes(tp) ? "🏥" : ["منزلي","Home"].includes(tp) ? "🏠" : "📱"} {tp}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("الرخصة","License")}</Text>
                      <Text style={[styles.detailValue, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{member.license}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("إيقاف مؤقت","Pause"), `${t("هل تريد إيقاف مواعيد","Pause appointments for")} ${lang === "ar" ? member.nameAr : member.nameEn}؟`, [
                        { text: t("إلغاء","Cancel"), style: "cancel" },
                        { text: t("إيقاف","Pause"), style: "destructive" },
                      ])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("إيقاف مؤقت","Pause")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("تعديل الملف","Edit Profile"), `${lang === "ar" ? member.nameAr : member.nameEn}`)}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("تعديل الملف","Edit Profile")}</Text>
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
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  summaryValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  staffCard: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 12 },
  staffTop: { flexDirection: "row-reverse", gap: 14, alignItems: "flex-start" },
  staffAvatar: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  feeTag: { position: "absolute", bottom: -8, alignSelf: "center", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  feeText: { fontSize: 10, fontFamily: "Cairo_700Bold", color: "#fff" },
  staffInfo: { flex: 1 },
  staffTitleRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 6 },
  specBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  specText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  staffName: { fontSize: 16, fontFamily: "Cairo_700Bold", marginBottom: 6 },
  staffMeta: { flexDirection: "row-reverse", gap: 6, alignItems: "center", flexWrap: "wrap" },
  metaItem: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  metaSep: { fontSize: 11 },
  ratingText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  casesRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  typeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  expandedSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 14, gap: 12 },
  bioText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  expandLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", marginBottom: -6 },
  detailsRow: { flexDirection: "row-reverse", gap: 20 },
  detailItem: { gap: 2 },
  detailLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
