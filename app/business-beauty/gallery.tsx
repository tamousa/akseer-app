import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const CATS_AR = ["الكل", "شعر", "مكياج", "بشرة", "أظافر"];
const CATS_EN = ["All", "Hair", "Makeup", "Skin", "Nails"];

const GALLERY = [
  { id: 1, catAr: "شعر",   catEn: "Hair",   titleAr: "صبغة أشقر رماني",       titleEn: "Ash Blonde Dye",         likes: 120, emoji: "💇‍♀️", color: "#BE185D" },
  { id: 2, catAr: "مكياج", catEn: "Makeup", titleAr: "مكياج سواريه ناعم",     titleEn: "Soft Evening Makeup",    likes: 240, emoji: "💄",   color: "#9D174D" },
  { id: 3, catAr: "شعر",   catEn: "Hair",   titleAr: "تسريحة عروس كلاسيكية",  titleEn: "Classic Bridal Updo",    likes: 310, emoji: "👰",   color: "#DB2777" },
  { id: 4, catAr: "بشرة",  catEn: "Skin",   titleAr: "بشرة مضيئة جلسة عناية", titleEn: "Glowing Skin Session",   likes: 88,  emoji: "✨",   color: "#EC4899" },
  { id: 5, catAr: "أظافر", catEn: "Nails",  titleAr: "أظافر فرنسية + نقش",    titleEn: "French Nails + Art",     likes: 155, emoji: "💅",   color: "#F472B6" },
  { id: 6, catAr: "مكياج", catEn: "Makeup", titleAr: "مكياج عروس كامل",        titleEn: "Full Bridal Makeup",     likes: 420, emoji: "💍",   color: "#BE185D" },
  { id: 7, catAr: "شعر",   catEn: "Hair",   titleAr: "باليياج ذهبي",           titleEn: "Golden Balayage",        likes: 195, emoji: "🌟",   color: "#9D174D" },
  { id: 8, catAr: "أظافر", catEn: "Nails",  titleAr: "أظافر جل هولوغرام",      titleEn: "Hologram Gel Nails",     likes: 200, emoji: "🦋",   color: "#DB2777" },
];

export default function BeautyGallery() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const [catIdx, setCatIdx] = useState(0);
  const catArFilter = CATS_AR[catIdx];
  const shown = catIdx === 0 ? GALLERY : GALLERY.filter((g) => g.catAr === catArFilter);

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("معرض الأعمال","Work Gallery")}</Text>
        <Pressable style={[s.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => Alert.alert(t("رفع صورة","Upload Photo"), t("سيتم فتح متصفح الصور لرفع عمل جديد","Gallery will open to upload a new work"))}>
          <Feather name="upload" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 16 }}>
          <View style={{ flexDirection: "row-reverse", gap: 8 }}>
            {CATS_AR.map((c, i) => (
              <Pressable key={c} style={[s.catChip, { backgroundColor: catIdx === i ? BRAND : isDark ? "#2D0020" : "#FCE7F3", borderColor: catIdx === i ? BRAND : colors.border }]} onPress={() => setCatIdx(i)}>
                <Text style={[s.catText, { color: catIdx === i ? "#fff" : colors.text }]}>{lang === "ar" ? c : CATS_EN[i]}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <View style={s.grid}>
          {shown.map((g) => (
            <Pressable key={g.id} style={[s.gridItem, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: g.color + "30" }]}
              onPress={() => Alert.alert(lang === "ar" ? g.titleAr : g.titleEn, `${t("التصنيف:","Category:")} ${lang === "ar" ? g.catAr : g.catEn}\n${t("الإعجابات:","Likes:")} ${g.likes}`)}>
              <View style={[s.gridEmoji, { backgroundColor: g.color + "20" }]}>
                <Text style={{ fontSize: 36 }}>{g.emoji}</Text>
              </View>
              <Text style={[s.gridTitle, { color: colors.text }]} numberOfLines={2}>{lang === "ar" ? g.titleAr : g.titleEn}</Text>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
                <Feather name="heart" size={12} color="#EF4444" />
                <Text style={[s.gridLikes, { color: colors.muted }]}>{g.likes}</Text>
              </View>
              <View style={[s.gridCatBadge, { backgroundColor: g.color + "20" }]}>
                <Text style={[s.gridCatText, { color: g.color }]}>{lang === "ar" ? g.catAr : g.catEn}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  gridItem: { width: "47%", flexGrow: 1, borderRadius: 16, padding: 12, borderWidth: 1, gap: 6 },
  gridEmoji: { height: 100, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  gridTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  gridLikes: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  gridCatBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gridCatText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
});
