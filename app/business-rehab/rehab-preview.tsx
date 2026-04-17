import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const SERVICES = [
  { nameAr: "علاج طبيعي عام",          nameEn: "General Physiotherapy",    duration: 45,  price: 280, sessions: "8–12", descAr: "تقييم وعلاج شامل للحالة",       descEn: "Comprehensive assessment and treatment" },
  { nameAr: "إعادة تأهيل ما بعد جراحة", nameEn: "Post-Surgery Rehab",      duration: 60,  price: 350, sessions: "12–20", descAr: "خطة تعافي متكاملة",              descEn: "Integrated recovery plan" },
  { nameAr: "علاج آلام الظهر والعنق",   nameEn: "Back & Neck Pain",         duration: 45,  price: 260, sessions: "6–10", descAr: "موجات صوتية وتمارين",            descEn: "Ultrasound & therapeutic exercises" },
  { nameAr: "تأهيل رياضي",              nameEn: "Sports Rehabilitation",    duration: 60,  price: 320, sessions: "8–15", descAr: "للرياضيين وإصابات الملاعب",      descEn: "Athletes and sports injuries" },
  { nameAr: "تقويم عمود الفقري",        nameEn: "Spinal Correction",        duration: 30,  price: 200, sessions: "4–8",  descAr: "معالجة الانحناءات الوظيفية",     descEn: "Functional curvature correction" },
  { nameAr: "تمارين علاجية موجّهة",     nameEn: "Guided Therapeutic Exercises", duration: 45, price: 220, sessions: "open", descAr: "جلسات جماعية وفردية",        descEn: "Group and individual sessions" },
];

const PACKAGES = [
  { nameAr: "باقة إعادة التأهيل الكاملة", nameEn: "Full Rehab Package",    price: 2800, original: 3500, sessions: 10, descAr: "تقييم + 10 جلسات + تقرير نهائي",     descEn: "Assessment + 10 sessions + final report" },
  { nameAr: "باقة التأهيل الرياضي",        nameEn: "Sports Rehab Package",  price: 1800, original: 2200, sessions: 6,  descAr: "6 جلسات تأهيل + خطة تمارين منزلية", descEn: "6 rehab sessions + home exercise plan" },
];

const THERAPISTS = [
  { nameAr: "د. أحمد السلمي",   nameEn: "Dr. Ahmed Al-Salmi",   specialtyAr: "علاج طبيعي وتأهيل",    specialtyEn: "Physiotherapy & Rehab",   certAr: "بكالوريوس + ماجستير",   certEn: "BSc + MSc",           sessions: 1240, rating: 4.9, color: "#059669" },
  { nameAr: "د. سمر الغامدي",   nameEn: "Dr. Samar Al-Ghamdi",  specialtyAr: "تأهيل ما بعد جراحة",   specialtyEn: "Post-Surgery Rehab",      certAr: "معتمدة هيئة الصحة",     certEn: "Health Authority Cert", sessions: 870, rating: 4.8, color: "#047857" },
  { nameAr: "د. فاطمة العتيبي", nameEn: "Dr. Fatima Al-Otaibi", specialtyAr: "تأهيل رياضي",           specialtyEn: "Sports Rehabilitation",   certAr: "شهادة FIFA Medical",    certEn: "FIFA Medical Cert",    sessions: 530,  rating: 4.9, color: "#10B981" },
];

const INSURANCE_AR = ["بوبا", "تأمين التعاون", "الراجحي تكافل", "الاتحاد", "الأهلي تكافل"];
const INSURANCE_EN = ["Bupa", "Tawuniya", "Al Rajhi Takaful", "Al-Ittihad", "Al Ahli Takaful"];

const REVIEWS = [
  { nameAr: "سعد غ.",  nameEn: "Saad G.",  rating: 5, commentAr: "العلاج الطبيعي مع د. أحمد أعاد لي حياتي بعد عملية الركبة", commentEn: "Physiotherapy with Dr. Ahmed gave me my life back after knee surgery", serviceAr: "إعادة تأهيل", serviceEn: "Rehabilitation", time: "أمس" },
  { nameAr: "ريم م.",  nameEn: "Reem M.",  rating: 5, commentAr: "المركز راقي ومعقم والمعالجون محترفون جداً",              commentEn: "Excellent center, sterile and very professional therapists",       serviceAr: "علاج ظهر",    serviceEn: "Back Pain",       time: "3 أيام" },
];

export default function RehabPreview() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"services" | "packages" | "therapists" | "insurance" | "reviews">("services");

  const TAB_LABELS = {
    services:   { ar: "الخدمات",  en: "Services" },
    packages:   { ar: "الباقات",  en: "Packages" },
    therapists: { ar: "المعالجون", en: "Therapists" },
    insurance:  { ar: "التأمين",  en: "Insurance" },
    reviews:    { ar: "التقييمات", en: "Reviews" },
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
            <Text style={styles.avatarText}>🦾</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.bizName, { color: colors.text }]}>{t("أكسير للتأهيل والعلاج الطبيعي","Akseer Rehabilitation & Physiotherapy")}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.verifiedBadge, { backgroundColor: BRAND + "20" }]}>
                <Feather name="check-circle" size={11} color={BRAND} />
                <Text style={[styles.verifiedText, { color: BRAND }]}>{t("موثّق","Verified")}</Text>
              </View>
              <Text style={[styles.bioCat, { color: colors.muted }]}>• {t("مراكز التأهيل والعلاج الطبيعي","Rehab & Physiotherapy Centers")}</Text>
            </View>
            <Text style={[styles.bioAddress, { color: colors.muted }]}>📍 {t("الرياض — حي السليمانية","Riyadh — Al Sulaymaniyah")}</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingVal, { color: colors.text }]}>4.9 ★</Text>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>(189 {t("تقييم","reviews")})</Text>
              <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
              <Text style={[{ fontSize: 11, fontFamily: "Tajawal_400Regular" }, { color: "#10B981" }]}>{t("متاح الآن","Open Now")}</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row-reverse", paddingHorizontal: 16, gap: 8, alignItems: "center" }}>
            <Text style={[{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND, marginLeft: 4 }]}>{t("تأمين مقبول:","Accepted Insurance:")}</Text>
            {INSURANCE_AR.map((ins, i) => (
              <View key={ins} style={[styles.insBadge, { backgroundColor: BRAND + "15", borderColor: BRAND + "40" }]}>
                <Feather name="shield" size={10} color={BRAND} />
                <Text style={[styles.insText, { color: BRAND }]}>{lang === "ar" ? ins : INSURANCE_EN[i]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaPrimary, { backgroundColor: BRAND, flex: 2 }]}>
            <Feather name="calendar" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>{t("احجز جلسة تقييم","Book Assessment")}</Text>
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
            {(["services", "packages", "therapists", "insurance", "reviews"] as const).map((tb) => (
              <Pressable key={tb} style={[styles.tab, tab === tb && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb)}>
                <Text style={[styles.tabText, { color: tab === tb ? BRAND : colors.muted }]}>{lang === "ar" ? TAB_LABELS[tb].ar : TAB_LABELS[tb].en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {tab === "services" && (
          <View style={{ paddingHorizontal: 16 }}>
            {SERVICES.map((s, i) => (
              <View key={i} style={[styles.serviceRow, { backgroundColor: colors.surface, borderColor: BRAND + "20" }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={[styles.serviceDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
                  <View style={styles.serviceMeta}>
                    <Text style={[styles.serviceDur, { color: colors.muted }]}>⏱ {s.duration} {t("د","min")}</Text>
                    <Text style={[styles.serviceSessionRange, { color: BRAND }]}>📋 {s.sessions} {t("جلسة","sessions")}</Text>
                  </View>
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
              <View key={i} style={[styles.pkgCard, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
                <Text style={[styles.pkgName, { color: colors.text }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                <Text style={[styles.pkgDesc, { color: colors.muted }]}>{lang === "ar" ? p.descAr : p.descEn}</Text>
                <View style={styles.pkgPriceRow}>
                  <Text style={[styles.pkgOrigPrice, { color: colors.muted }]}>{p.original} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: BRAND }]}>{p.price} SAR</Text>
                  <View style={[styles.discBadge, { backgroundColor: BRAND + "20" }]}>
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
                  <Text style={[styles.therapistSpec, { color: colors.muted }]}>{lang === "ar" ? th.specialtyAr : th.specialtyEn}</Text>
                  <Text style={[styles.therapistCert, { color: th.color }]}>✓ {lang === "ar" ? th.certAr : th.certEn}</Text>
                  <Text style={[styles.therapistSess, { color: colors.muted }]}>{th.sessions} {t("جلسة منجزة","completed sessions")}</Text>
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

        {tab === "insurance" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={[styles.insInfoCard, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
              <Feather name="shield" size={28} color={BRAND} />
              <Text style={[styles.insInfoTitle, { color: colors.text }]}>{t("شركات التأمين المقبولة","Accepted Insurance Companies")}</Text>
              <Text style={[styles.insInfoSub, { color: colors.muted }]}>{t("يمكنك حجز جلستك مباشرة وتسوية الفاتورة عبر التأمين","Book your session directly and settle the bill via insurance")}</Text>
            </View>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 }}>
              {INSURANCE_AR.map((ins, i) => (
                <View key={ins} style={[styles.insCard2, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
                  <Feather name="shield" size={20} color={BRAND} />
                  <Text style={[styles.insCardText, { color: colors.text }]}>{lang === "ar" ? ins : INSURANCE_EN[i]}</Text>
                  <View style={[styles.insCovBadge, { backgroundColor: BRAND + "20" }]}>
                    <Text style={[styles.insCovText, { color: BRAND }]}>{t("مغطّى","Covered")}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === "reviews" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={[styles.ratingOverview, { backgroundColor: colors.surface, borderColor: BRAND + "30" }]}>
              <Text style={[styles.ratingBig, { color: BRAND }]}>4.9</Text>
              <Text style={[styles.ratingStars, { color: "#F59E0B" }]}>★★★★★</Text>
              <Text style={[styles.ratingCountText, { color: colors.muted }]}>189 {t("تقييم","reviews")}</Text>
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
  badgeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, flexWrap: "wrap" },
  verifiedBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  verifiedText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  bioCat: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bioAddress: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  ratingVal: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  ratingCount: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  dot: { fontSize: 14 },
  insBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  insText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  ctaRow: { flexDirection: "row-reverse", gap: 10, marginHorizontal: 16, marginBottom: 16 },
  ctaPrimary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14 },
  ctaBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  ctaSecondary: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  ctaSecText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)", marginBottom: 16 },
  tabsRow: { flexDirection: "row-reverse", paddingHorizontal: 16 },
  tab: { paddingHorizontal: 12, paddingVertical: 12 },
  tabText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  serviceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  serviceDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  serviceMeta: { flexDirection: "row-reverse", gap: 10 },
  serviceDur: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  serviceSessionRange: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  servicePrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  pkgCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12, gap: 8 },
  pkgName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pkgDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  pkgPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgOrigPrice: { fontSize: 13, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  pkgPrice: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  discBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  pkgBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  therapistCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
  therapistAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  therapistName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  therapistSpec: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  therapistCert: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  therapistSess: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  therapistRating: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  bookStaffBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookStaffText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  insInfoCard: { alignItems: "center", padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 14, gap: 8 },
  insInfoTitle: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  insInfoSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  insCard2: { flexGrow: 1, minWidth: "45%", alignItems: "center", padding: 16, borderRadius: 14, borderWidth: 1, gap: 6 },
  insCardText: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  insCovBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  insCovText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
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
