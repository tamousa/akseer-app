import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function RehabStaff() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STAFF = [
    { id: 1, nameAr: "د. أحمد السلمي", nameEn: "Dr. Ahmed Al-Salmi", specialtyAr: "علاج طبيعي وتأهيل", specialtyEn: "Physiotherapy & Rehab", certAr: "بكالوريوس + ماجستير", certEn: "BSc + MSc", sessions: 1240, rating: 4.9, patients: 18, color: BRAND },
    { id: 2, nameAr: "د. سمر الغامدي", nameEn: "Dr. Samar Al-Ghamdi", specialtyAr: "تأهيل ما بعد جراحة", specialtyEn: "Post-Surgery Rehabilitation", certAr: "معتمدة هيئة الصحة", certEn: "Health Authority Certified", sessions: 870, rating: 4.8, patients: 12, color: "#047857" },
    { id: 3, nameAr: "د. فاطمة العتيبي", nameEn: "Dr. Fatima Al-Otaibi", specialtyAr: "تأهيل رياضي", specialtyEn: "Sports Rehabilitation", certAr: "شهادة FIFA Medical", certEn: "FIFA Medical Certificate", sessions: 530, rating: 4.9, patients: 10, color: "#10B981" },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("الفريق الطبي","Medical Team")} ({STAFF.length})</Text>
        <Pressable style={[s.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => Alert.alert(t("إضافة معالج","Add Therapist"), t("سيتم فتح نموذج إضافة معالج طبي جديد","A new therapist form will open"))}>
          <Feather name="user-plus" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 10 }}>
        {STAFF.map((m) => (
          <View key={m.id} style={[s.card, { backgroundColor: colors.surface, borderColor: m.color + "30" }]}>
            <View style={[s.avatar, { backgroundColor: m.color }]}><Feather name="user" size={22} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? m.nameAr : m.nameEn}</Text>
              <Text style={[s.cert, { color: m.color }]}>✓ {lang === "ar" ? m.certAr : m.certEn}</Text>
              <Text style={[s.specialty, { color: colors.muted }]}>{lang === "ar" ? m.specialtyAr : m.specialtyEn}</Text>
              <Text style={[s.sessions, { color: m.color }]}>{m.sessions} {t("جلسة","sessions")}  ·  {m.patients} {t("مريض نشط","active patients")}  ·  ★ {m.rating}</Text>
            </View>
            <Pressable style={[s.editBtn, { backgroundColor: m.color + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل:","Edit:")} ${lang === "ar" ? m.nameAr : m.nameEn}`)}>
              <Feather name="edit-2" size={14} color={m.color} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  cert: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  specialty: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sessions: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  editBtn: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
