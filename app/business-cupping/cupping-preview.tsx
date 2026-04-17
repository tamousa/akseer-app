import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const SESSION_TYPES = [
  { nameAr: "حجامة رطبة",        nameEn: "Wet Cupping",     price: 280, duration: 45, descAr: "إزالة الدم الفاسد — الفائدة الأكبر",  descEn: "Removes stagnant blood — maximum benefit",  icon: "droplet" as const },
  { nameAr: "حجامة جافة",        nameEn: "Dry Cupping",     price: 180, duration: 30, descAr: "تنشيط الدورة الدموية",                descEn: "Stimulates blood circulation",              icon: "wind" as const },
  { nameAr: "حجامة وجه",         nameEn: "Facial Cupping",  price: 200, duration: 35, descAr: "لصحة بشرة الوجه",                    descEn: "For facial skin health",                    icon: "smile" as const },
  { nameAr: "حجامة ظهر كاملة",   nameEn: "Full Back",       price: 320, duration: 60, descAr: "علاج آلام الظهر والعمود الفقري",      descEn: "Back pain and spine relief",               icon: "activity" as const },
  { nameAr: "حجامة قدم",         nameEn: "Foot Cupping",    price: 150, duration: 25, descAr: "ارتياح وتنشيط الأطراف",              descEn: "Relaxation and limb stimulation",           icon: "navigation" as const },
  { nameAr: "حجامة رأس",         nameEn: "Head Cupping",    price: 160, duration: 30, descAr: "للصداع وتحسين التركيز",              descEn: "Headache relief and focus improvement",     icon: "zap" as const },
];

const PACKAGES = [
  { nameAr: "باقة الحجامة الكاملة",  nameEn: "Full Cupping Package",   price: 680, original: 860, sessions: 3, descAr: "حجامة رطبة + ظهر + قدم",        descEn: "Wet + Back + Foot cupping" },
  { nameAr: "باقة الصيانة الشهرية", nameEn: "Monthly Maintenance",    price: 450, original: 560, sessions: 2, descAr: "حجامة جافة × 2 جلسة",          descEn: "Dry cupping × 2 sessions" },
];

const THERAPISTS = [
  { nameAr: "أبو خالد السلمي",  nameEn: "Abu Khalid Al-Salmi",  certAr: "معتمد من المجلس الصحي", certEn: "Health Council Certified", sessions: 890, rating: 4.9, color: "#B45309" },
  { nameAr: "أبو عمر الغامدي",  nameEn: "Abu Omar Al-Ghamdi",   certAr: "ترخيص هيئة الحجامة",   certEn: "Cupping Authority License", sessions: 620, rating: 4.8, color: "#92400E" },
];

const REVIEWS = [
  { nameAr: "عبدالله م.", nameEn: "Abdullah M.", rating: 5, commentAr: "الحجامة الرطبة مع أبو خالد ممتازة، أحسست بتحسن كبير", commentEn: "Wet cupping with Abu Khalid was excellent, I felt a big improvement", serviceAr: "حجامة رطبة", serviceEn: "Wet Cupping", time: "أمس" },
  { nameAr: "سعد ف.",    nameEn: "Saad F.",      rating: 5, commentAr: "مركز نظيف ومحترف، بروتوكول التعقيم واضح وممتاز",   commentEn: "Clean professional center, excellent sterilization protocol", serviceAr: "حجامة ظهر", serviceEn: "Back Cupping", time: "3 أيام" },
];

export default function CuppingPreview() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"sessions" | "packages" | "therapists" | "reviews">("sessions");

  const TAB_LABELS = {
    sessions:   { ar: "أنواع الجلسات", en: "Sessions" },
    packages:   { ar: "الباقات",       en: "Packages" },
    therapists: { ar: "المعالجون",     en: "Therapists" },
    reviews:    { ar: "التقييمات",    en: "Reviews" },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-right" size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("معاينة الصفحة العامة","Public Page Preview")}</Text>
          <Text style={styles.headerSub}>{t("هكذا يراك العملاء في تطبيق أكسير","How clients see you in Akseer")}</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        <View style={[styles.bioCard, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
          <View style={[styles.avatar, { backgroundColor: BRAND }]}>
            <Text style={styles.avatarText}>🩸</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.bizName, { color: colors.text }]}>{t("أكسير للحجامة والطب النبوي","Akseer Cupping & Prophetic Medicine")}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.verifiedBadge, { backgroundColor: BRAND + "20" }]}>
                <Feather name="check-circle" size={11} color={BRAND} />
                <Text style={[styles.verifiedText, { color: BRAND }]}>{t("موثّق","Verified")}</Text>
              </View>
              <Text style={[styles.bioCat, { color: colors.muted }]}>• {t("مراكز الحجامة","Cupping Centers")}</Text>
            </View>
            <Text style={[styles.bioAddress, { color: colors.muted }]}>📍 {t("الرياض — حي العليا","Riyadh — Al Olaya")}</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingVal, { color: colors.text }]}>4.9 ★</Text>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>(312 {t("تقييم","reviews")})</Text>
              <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
              <Text style={[styles.bioCat, { color: "#10B981" }]}>{t("متاح الآن","Open Now")}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.sterilBadge, { backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" }]}>
          <Feather name="shield" size={16} color="#059669" />
          <Text style={[styles.sterilText, { color: "#065F46" }]}>✓ {t("بروتوكول تعقيم معتمد — أدوات معقّمة لكل جلسة","Certified sterilization protocol — sterile tools per session")}</Text>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaPrimary, { backgroundColor: BRAND, flex: 2 }]}>
            <Feather name="calendar" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>{t("احجز الآن","Book Now")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { borderColor: BRAND, flex: 1 }]}>
            <Feather name="message-circle" size={16} color={BRAND} />
            <Text style={[styles.ctaSecText, { color: BRAND }]}>{t("دردشة","Chat")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { borderColor: BRAND, flex: 1 }]}>
            <Feather name="heart" size={16} color={BRAND} />
            <Text style={[styles.ctaSecText, { color: BRAND }]}>{t("متابعة","Follow")}</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabsRow}>
            {(["sessions", "packages", "therapists", "reviews"] as const).map((tb) => (
              <Pressable key={tb} style={[styles.tab, tab === tb && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb)}>
                <Text style={[styles.tabText, { color: tab === tb ? BRAND : colors.muted }]}>{lang === "ar" ? TAB_LABELS[tb].ar : TAB_LABELS[tb].en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {tab === "sessions" && (
          <View style={{ paddingHorizontal: 16 }}>
            {SESSION_TYPES.map((s, i) => (
              <View key={i} style={[styles.sessCard, { backgroundColor: colors.surface, borderColor: BRAND + "20" }]}>
                <View style={[styles.sessIcon, { backgroundColor: BRAND + "20" }]}>
                  <Feather name={s.icon} size={20} color={BRAND} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={[styles.sessDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
                  <Text style={[styles.sessDur, { color: colors.muted }]}>⏱ {s.duration} {t("دقيقة","min")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.sessPrice, { color: BRAND }]}>{s.price} SAR</Text>
                  <Pressable style={[styles.bookBtn, { backgroundColor: BRAND }]}>
                    <Text style={styles.bookBtnText}>{t("احجز","Book")}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "packages" && (
          <View style={{ paddingHorizontal: 16 }}>
            {PACKAGES.map((p, i) => (
              <View key={i} style={[styles.pkgCard, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
                <Text style={[styles.pkgName, { color: colors.text }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                <Text style={[styles.pkgDesc, { color: colors.muted }]}>{lang === "ar" ? p.descAr : p.descEn}</Text>
                <View style={styles.pkgRow}>
                  <Text style={[styles.pkgOrigPrice, { color: colors.muted }]}>{p.original} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: BRAND }]}>{p.price} SAR</Text>
                  <View style={[styles.discBadge, { backgroundColor: "#FEF3C7" }]}>
                    <Text style={[styles.discText, { color: BRAND }]}>{t("وفّر","Save")} {p.original - p.price} SAR</Text>
                  </View>
                </View>
                <Pressable style={[styles.pkgBtn, { backgroundColor: BRAND }]}>
                  <Text style={styles.pkgBtnText}>{t("احجز الباقة","Book Package")} ({p.sessions} {t("جلسات","sessions")})</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {tab === "therapists" && (
          <View style={{ paddingHorizontal: 16 }}>
            {THERAPISTS.map((th, i) => (
              <View key={i} style={[styles.therapistCard, { backgroundColor: colors.surface, borderColor: th.color + "30" }]}>
                <View style={[styles.therapistAvatar, { backgroundColor: th.color }]}>
                  <Feather name="user" size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.therapistName, { color: colors.text }]}>{lang === "ar" ? th.nameAr : th.nameEn}</Text>
                  <Text style={[styles.therapistCert, { color: "#059669" }]}>✓ {lang === "ar" ? th.certAr : th.certEn}</Text>
                  <Text style={[styles.therapistSessions, { color: colors.muted }]}>{th.sessions} {t("جلسة منجزة","completed sessions")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.therapistRating, { color: "#F59E0B" }]}>★ {th.rating}</Text>
                  <Pressable style={[styles.bookStaffBtn, { backgroundColor: th.color }]}>
                    <Text style={styles.bookStaffText}>{t("احجز معه","Book")}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "reviews" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={[styles.ratingOverview, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
              <Text style={[styles.ratingBig, { color: BRAND }]}>4.9</Text>
              <Text style={[styles.ratingStars, { color: "#F59E0B" }]}>★★★★★</Text>
              <Text style={[styles.ratingCountText, { color: colors.muted }]}>312 {t("تقييم","reviews")}</Text>
            </View>
            {REVIEWS.map((r, i) => (
              <View key={i} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: BRAND + "20" }]}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewName, { color: colors.text }]}>{lang === "ar" ? r.nameAr : r.nameEn}</Text>
                  <Text style={[styles.reviewTime, { color: colors.muted }]}>{r.time}</Text>
                </View>
                <Text style={[styles.reviewStars, { color: "#F59E0B" }]}>{"★".repeat(r.rating)}</Text>
                <View style={[styles.reviewTag, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[styles.reviewTagText, { color: BRAND }]}>{lang === "ar" ? r.serviceAr : r.serviceEn}</Text>
                </View>
                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>{lang === "ar" ? r.commentAr : r.commentEn}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, color: "#fff", fontFamily: "Cairo_700Bold" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "Tajawal_400Regular" },
  bioCard: { flexDirection: "row-reverse", gap: 12, margin: 16, borderRadius: 18, padding: 16, borderWidth: 1 },
  avatar: { width: 70, height: 70, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 32 },
  bizName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  badgeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  verifiedBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  verifiedText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  bioCat: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bioAddress: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  ratingVal: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  ratingCount: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  dot: { fontSize: 14 },
  sterilBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginHorizontal: 16, marginBottom: 12, padding: 10, borderRadius: 12, borderWidth: 1 },
  sterilText: { fontSize: 12, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },
  ctaRow: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 16, marginBottom: 16 },
  ctaPrimary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14 },
  ctaBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  ctaSecondary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  ctaSecText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)", marginBottom: 16 },
  tabsRow: { flexDirection: "row-reverse", paddingHorizontal: 16 },
  tab: { paddingHorizontal: 14, paddingVertical: 12 },
  tabText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sessCard: { flexDirection: "row-reverse", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  sessIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sessName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sessDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sessDur: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sessPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  pkgCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12, gap: 8 },
  pkgName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pkgDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  pkgRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgOrigPrice: { fontSize: 13, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  pkgPrice: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  discBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  pkgBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  therapistCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
  therapistAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  therapistName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  therapistCert: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  therapistSessions: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  therapistRating: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  bookStaffBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookStaffText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  ratingOverview: { alignItems: "center", borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 12, gap: 4 },
  ratingBig: { fontSize: 48, fontFamily: "Cairo_700Bold" },
  ratingStars: { fontSize: 24 },
  ratingCountText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  reviewCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10, gap: 6 },
  reviewHeader: { flexDirection: "row-reverse", justifyContent: "space-between" },
  reviewName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewStars: { fontSize: 16, textAlign: "right" },
  reviewTag: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reviewTagText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  reviewComment: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
});
