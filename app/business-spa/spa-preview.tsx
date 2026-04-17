import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#6366F1";

const SERVICES = [
  { nameAr: "تدليك سويدي",          nameEn: "Swedish Massage",       duration: 60,  price: 320, descAr: "استرخاء عميق للعضلات",       descEn: "Deep muscle relaxation" },
  { nameAr: "تدليك بالأحجار الساخنة", nameEn: "Hot Stone Massage",   duration: 75,  price: 420, descAr: "إزالة التوتر والإجهاد",       descEn: "Tension & stress relief" },
  { nameAr: "تدليك رياضي",          nameEn: "Sports Massage",         duration: 60,  price: 350, descAr: "للرياضيين وتعافي العضلات",   descEn: "For athletes and muscle recovery" },
  { nameAr: "ساونا جافة",           nameEn: "Dry Sauna",              duration: 30,  price: 120, descAr: "تنقية الجسم وإزالة السموم",  descEn: "Body purification and detox" },
  { nameAr: "حمام بخار",            nameEn: "Steam Bath",             duration: 30,  price: 100, descAr: "ترطيب الجلد والتنفس",        descEn: "Skin hydration and breathing" },
  { nameAr: "جاكوزي",               nameEn: "Jacuzzi",                duration: 30,  price: 150, descAr: "ارتخاء مائي كامل",           descEn: "Full aquatic relaxation" },
];

const PACKAGES = [
  { nameAr: "باقة الاسترخاء الكاملة", nameEn: "Full Relaxation Package", price: 750,  original: 980,  includes: [{ ar: "تدليك سويدي 60د", en: "Swedish Massage 60min" }, { ar: "ساونا جافة 30د", en: "Dry Sauna 30min" }, { ar: "جاكوزي 30د", en: "Jacuzzi 30min" }], badge: "🌟" },
  { nameAr: "باقة السبا الفاخرة",     nameEn: "Luxury Spa Package",      price: 1100, original: 1400, includes: [{ ar: "تدليك أحجار ساخنة", en: "Hot Stone Massage" }, { ar: "حمام بخار", en: "Steam Bath" }, { ar: "جاكوزي", en: "Jacuzzi" }, { ar: "وجبة خفيفة", en: "Light Meal" }], badge: "✨" },
];

const THERAPISTS = [
  { nameAr: "أحمد الزهراني", nameEn: "Ahmed Al-Zahrani", specialtyAr: "تدليك سويدي وأحجار", specialtyEn: "Swedish & Hot Stone", rating: 4.9, sessions: 560, color: "#6366F1" },
  { nameAr: "وليد العمري",   nameEn: "Walid Al-Omari",   specialtyAr: "رياضي وعلاج طبيعي",  specialtyEn: "Sports & Physio",    rating: 4.8, sessions: 380, color: "#4F46E5" },
];

const REVIEWS = [
  { nameAr: "خالد م.", nameEn: "Khalid M.", rating: 5, commentAr: "تجربة خيالية، التدليك بالأحجار الساخنة غيّر حياتي!", commentEn: "An amazing experience, hot stone massage changed my life!", serviceAr: "تدليك أحجار", serviceEn: "Hot Stone", time: "أمس" },
  { nameAr: "نوف ع.",  nameEn: "Nouf A.",   rating: 5, commentAr: "باقة السبا الفاخرة تستحق كل ريال، سأعود حتماً",       commentEn: "Luxury spa package is worth every riyal, I'll definitely return", serviceAr: "باقة سبا", serviceEn: "Spa Package", time: "3 أيام" },
];

export default function SpaPreview() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"services" | "packages" | "therapists" | "reviews">("services");

  const TAB_LABELS = {
    services:   { ar: "الخدمات",  en: "Services" },
    packages:   { ar: "الباقات",  en: "Packages" },
    therapists: { ar: "المعالجون", en: "Therapists" },
    reviews:    { ar: "التقييمات", en: "Reviews" },
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0A0A2A" : "#EEF2FF" }]}>
      <View style={[styles.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-right" size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>{t("معاينة الصفحة العامة","Public Page Preview")}</Text>
          <Text style={styles.headerSub}>{t("هكذا يراك العملاء في تطبيق أكسير","How clients see you in Akseer")}</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <View style={[styles.bioCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
          <View style={[styles.avatar, { backgroundColor: BRAND }]}>
            <Text style={styles.avatarText}>💆</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.bizName, { color: colors.text }]}>{t("أكسير للمساج والسبا","Akseer Massage & Spa")}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.verifiedBadge, { backgroundColor: BRAND + "20" }]}>
                <Feather name="check-circle" size={11} color={BRAND} />
                <Text style={[styles.verifiedText, { color: BRAND }]}>{t("موثّق","Verified")}</Text>
              </View>
              <Text style={[styles.bioCat, { color: colors.muted }]}>• {t("مراكز المساج والسبا","Massage & Spa Centers")}</Text>
            </View>
            <Text style={[styles.bioAddress, { color: colors.muted }]}>📍 {t("الرياض — حي الورود","Riyadh — Al Woroud")}</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingVal, { color: colors.text }]}>4.8 ★</Text>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>(274 {t("تقييم","reviews")})</Text>
              <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
              <Text style={[{ fontSize: 11, fontFamily: "Tajawal_400Regular" }, { color: "#10B981" }]}>{t("متاح الآن","Open Now")}</Text>
            </View>
          </View>
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
            {(["services", "packages", "therapists", "reviews"] as const).map((tb) => (
              <Pressable key={tb} style={[styles.tab, tab === tb && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb)}>
                <Text style={[styles.tabText, { color: tab === tb ? BRAND : colors.muted }]}>{lang === "ar" ? TAB_LABELS[tb].ar : TAB_LABELS[tb].en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {tab === "services" && (
          <View style={{ paddingHorizontal: 16 }}>
            {SERVICES.map((s, i) => (
              <View key={i} style={[styles.serviceRow, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "20" }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={[styles.serviceDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
                  <Text style={[styles.serviceDur, { color: colors.muted }]}>⏱ {s.duration} {t("دقيقة","min")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.servicePrice, { color: BRAND }]}>{s.price} SAR</Text>
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
              <View key={i} style={[styles.pkgCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
                {p.badge ? <View style={[styles.pkgBadge, { backgroundColor: BRAND }]}><Text style={styles.pkgBadgeText}>{p.badge} {t("الأكثر طلباً","Most Popular")}</Text></View> : null}
                <Text style={[styles.pkgName, { color: colors.text }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                <View style={styles.pkgPriceRow}>
                  <Text style={[styles.pkgOrigPrice, { color: colors.muted }]}>{p.original} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: BRAND }]}>{p.price} SAR</Text>
                </View>
                <View style={{ gap: 6, marginTop: 8 }}>
                  {p.includes.map((inc, j) => (
                    <View key={j} style={styles.pkgIncRow}>
                      <Feather name="check" size={13} color="#10B981" />
                      <Text style={[styles.pkgIncText, { color: colors.textSecondary }]}>{lang === "ar" ? inc.ar : inc.en}</Text>
                    </View>
                  ))}
                </View>
                <Pressable style={[styles.pkgBtn, { backgroundColor: BRAND }]}>
                  <Text style={styles.pkgBtnText}>{t("احجز الباقة","Book Package")}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {tab === "therapists" && (
          <View style={{ paddingHorizontal: 16 }}>
            {THERAPISTS.map((th, i) => (
              <View key={i} style={[styles.therapistCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: th.color + "30" }]}>
                <View style={[styles.therapistAvatar, { backgroundColor: th.color }]}>
                  <Feather name="user" size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.therapistName, { color: colors.text }]}>{lang === "ar" ? th.nameAr : th.nameEn}</Text>
                  <Text style={[styles.therapistSpec, { color: colors.muted }]}>{lang === "ar" ? th.specialtyAr : th.specialtyEn}</Text>
                  <Text style={[styles.therapistSess, { color: th.color }]}>{th.sessions} {t("جلسة","sessions")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.therapistRating, { color: "#F59E0B" }]}>★ {th.rating}</Text>
                  <Pressable style={[styles.bookStaffBtn, { backgroundColor: th.color }]}>
                    <Text style={styles.bookStaffText}>{t("احجز","Book")}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "reviews" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={[styles.ratingOverview, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
              <Text style={[styles.ratingBig, { color: BRAND }]}>4.8</Text>
              <Text style={[styles.ratingStars, { color: "#F59E0B" }]}>★★★★★</Text>
              <Text style={[styles.ratingCountText, { color: colors.muted }]}>274 {t("تقييم","reviews")}</Text>
            </View>
            {REVIEWS.map((r, i) => (
              <View key={i} style={[styles.reviewCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "20" }]}>
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
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
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
  ctaRow: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 16, marginBottom: 16 },
  ctaPrimary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14 },
  ctaBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  ctaSecondary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  ctaSecText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)", marginBottom: 16 },
  tabsRow: { flexDirection: "row-reverse", paddingHorizontal: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 12 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  serviceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  serviceDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  serviceDur: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  servicePrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  pkgCard: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 12, gap: 6 },
  pkgBadge: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  pkgBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pkgPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  pkgOrigPrice: { fontSize: 13, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
  pkgPrice: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  pkgIncRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgIncText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  pkgBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 8 },
  pkgBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  therapistCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
  therapistAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  therapistName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  therapistSpec: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  therapistSess: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
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
