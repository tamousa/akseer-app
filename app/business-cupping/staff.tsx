import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#92400E";

export default function CuppingStaff() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STAFF = [
    { id: 1, nameAr: "أبو خالد السلمي", nameEn: "Abu Khalid Al-Salmi", certAr: "ترخيص وزارة الصحة", certEn: "Ministry of Health Licensed", sessions: 890, rating: 4.9, statusAr: "نشط", statusEn: "Active", color: BRAND },
    { id: 2, nameAr: "أبو عمر الغامدي", nameEn: "Abu Omar Al-Ghamdi", certAr: "معتمد هيئة الحجامة", certEn: "Cupping Board Certified", sessions: 620, rating: 4.8, statusAr: "نشط", statusEn: "Active", color: "#B45309" },
    { id: 3, nameAr: "أبو سعد الحربي", nameEn: "Abu Saad Al-Harbi", certAr: "شهادة في الطب التكميلي", certEn: "Complementary Medicine Diploma", sessions: 410, rating: 4.8, statusAr: "نشط", statusEn: "Active", color: "#D97706" },
  ];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#1A0E00" : "#FFFBEB" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("المعالجون","Therapists")} ({STAFF.length})</Text>
        <Pressable style={s.addBtn} onPress={() => Alert.alert(t("إضافة معالج","Add Therapist"), t("سيتم فتح نموذج إضافة معالج جديد","A new therapist form will open"))}>
          <Feather name="user-plus" size={20} color="#fff" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 10 }}>
        {STAFF.map((m) => (
          <View key={m.id} style={[s.card, { backgroundColor: isDark ? "#2A1500" : "#fff", borderColor: m.color + "30" }]}>
            <View style={[s.avatar, { backgroundColor: m.color }]}><Feather name="user" size={22} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? m.nameAr : m.nameEn}</Text>
              <Text style={[s.cert, { color: "#059669" }]}>✓ {lang === "ar" ? m.certAr : m.certEn}</Text>
              <Text style={[s.sessions, { color: m.color }]}>{m.sessions} {t("جلسة","sessions")}  ·  ★ {m.rating}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[s.statusBadge, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[s.statusText, { color: "#059669" }]}>{lang === "ar" ? m.statusAr : m.statusEn}</Text>
              </View>
              <Pressable style={[s.editBtn, { backgroundColor: m.color + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل بيانات:","Edit:")} ${lang === "ar" ? m.nameAr : m.nameEn}`)}>
                <Feather name="edit-2" size={14} color={m.color} />
              </Pressable>
            </View>
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
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 2 },
  cert: { fontSize: 11, fontFamily: "Tajawal_500Medium", textAlign: "right", marginBottom: 3 },
  sessions: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
