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
  { id: 1, nameAr: "قص وتشكيل الشعر",      nameEn: "Haircut & Styling",     category: "شعر",   duration: 60,  price: 180 },
  { id: 2, nameAr: "صبغة شاملة",            nameEn: "Full Color",            category: "شعر",   duration: 120, price: 350 },
  { id: 3, nameAr: "مكياج سواريه",          nameEn: "Evening Makeup",        category: "مكياج", duration: 90,  price: 420 },
  { id: 4, nameAr: "مكياج يومي ناعم",       nameEn: "Daily Light Makeup",    category: "مكياج", duration: 45,  price: 220 },
  { id: 5, nameAr: "تنظيف بشرة عميق",       nameEn: "Deep Skin Cleanse",     category: "بشرة",  duration: 60,  price: 280 },
  { id: 6, nameAr: "أظافر جل فرنسي",        nameEn: "French Gel Nails",      category: "أظافر", duration: 75,  price: 200 },
];

const PACKAGES = [
  { id: 1, nameAr: "باقة العروس الكاملة",  nameEn: "Full Bridal Package",     price: 1800, originalPrice: 2300, badge: "🌟", includes: ["مكياج عروس", "قص وتسريح", "أظافر كاملة", "تنظيف بشرة"] },
  { id: 2, nameAr: "باقة التجميل الشهرية", nameEn: "Monthly Beauty Package",  price: 680,  originalPrice: 850,  badge: null, includes: ["قص شعر × 2", "مكياج × 1", "أظافر × 1"] },
];

const STAFF = [
  { nameAr: "هيفاء الشمري",   nameEn: "Haifa Al-Shammari",  specialtyAr: "مكياج ومكياج عروس", specialtyEn: "Makeup & Bridal",   sessions: 320, rating: 4.9, color: "#BE185D" },
  { nameAr: "منى العتيبي",    nameEn: "Mona Al-Otaibi",     specialtyAr: "شعر وتسريح",        specialtyEn: "Hair & Styling",     sessions: 280, rating: 4.8, color: "#DB2777" },
  { nameAr: "ريم السلمي",     nameEn: "Reem Al-Salmi",      specialtyAr: "عناية بالبشرة",     specialtyEn: "Skincare",           sessions: 195, rating: 4.9, color: "#EC4899" },
];

const REVIEWS = [
  { nameAr: "نوف ع.",  nameEn: "Nouf A.",  rating: 5, commentAr: "أفضل مكياج عروس جربته، هيفاء فنانة حقيقية", commentEn: "Best bridal makeup I've had, Haifa is a true artist", serviceAr: "مكياج عروس", serviceEn: "Bridal Makeup", time: "أمس" },
  { nameAr: "سارة م.", nameEn: "Sara M.", rating: 5, commentAr: "باقة العروس تستحق كل ريال، خدمة راقية جداً",    commentEn: "The bridal package is worth every riyal, very classy service", serviceAr: "باقة العروس", serviceEn: "Bridal Package", time: "3 أيام" },
];

const CATS_AR = ["الكل", "شعر", "بشرة", "مكياج", "أظافر", "إزالة"];
const CATS_EN = ["All", "Hair", "Skin", "Makeup", "Nails", "Waxing"];

export default function BeautyPreview() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"services" | "packages" | "staff" | "reviews">("services");
  const [catIdx, setCatIdx] = useState(0);

  const filteredServices = catIdx === 0 ? SERVICES : SERVICES.filter(s => s.category === CATS_AR[catIdx]);

  const TAB_LABELS = {
    services:  { ar: "الخدمات",    en: "Services" },
    packages:  { ar: "الباقات",    en: "Packages" },
    staff:     { ar: "المختصات",   en: "Staff" },
    reviews:   { ar: "التقييمات", en: "Reviews" },
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
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
        <View style={[styles.bioCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "30" }]}>
          <View style={[styles.avatar, { backgroundColor: BRAND }]}>
            <Text style={styles.avatarText}>💅</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.bizName, { color: colors.text }]}>{t("أكسير للعناية والتجميل","Akseer Beauty Center")}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.verifiedBadge, { backgroundColor: BRAND + "20" }]}>
                <Feather name="check-circle" size={11} color={BRAND} />
                <Text style={[styles.verifiedText, { color: BRAND }]}>{t("موثّق","Verified")}</Text>
              </View>
              <Text style={[styles.bioCat, { color: colors.muted }]}>• {t("مراكز العناية والتجميل","Beauty Centers")}</Text>
            </View>
            <Text style={[styles.bioAddress, { color: colors.muted }]}>📍 {t("الرياض — حي النزهة","Riyadh — Al Nuzha")}</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingVal, { color: colors.text }]}>4.8 ★</Text>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>(218 {t("تقييم","reviews")})</Text>
              <Text style={[styles.dot, { color: colors.muted }]}>•</Text>
              <Text style={[styles.bioCat, { color: "#10B981" }]}>{t("متاح الآن","Open Now")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaPrimary, { backgroundColor: BRAND, flex: 2 }]}>
            <Feather name="calendar" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>{t("احجزي الآن","Book Now")}</Text>
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
            {(["services", "packages", "staff", "reviews"] as const).map((tb) => (
              <Pressable key={tb} style={[styles.tab, tab === tb && { borderBottomColor: BRAND, borderBottomWidth: 2 }]} onPress={() => setTab(tb)}>
                <Text style={[styles.tabText, { color: tab === tb ? BRAND : colors.muted }]}>{lang === "ar" ? TAB_LABELS[tb].ar : TAB_LABELS[tb].en}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {tab === "services" && (
          <View style={{ paddingHorizontal: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                {CATS_AR.map((c, i) => (
                  <Pressable key={c} style={[styles.catChip, { backgroundColor: catIdx === i ? BRAND : isDark ? "#2D0020" : "#FCE7F3", borderColor: catIdx === i ? BRAND : colors.border }]} onPress={() => setCatIdx(i)}>
                    <Text style={[styles.catChipText, { color: catIdx === i ? "#fff" : colors.text }]}>{lang === "ar" ? c : CATS_EN[i]}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            {filteredServices.map((s) => (
              <Pressable key={s.id} style={[styles.serviceRow, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "20" }]}>
                <Pressable style={[styles.bookBtn, { backgroundColor: BRAND }]}>
                  <Text style={styles.bookBtnText}>{t("احجزي","Book")}</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={[styles.serviceDur, { color: colors.muted }]}>⏱ {s.duration} {t("دقيقة","min")}</Text>
                </View>
                <Text style={[styles.servicePrice, { color: BRAND }]}>{s.price} SAR</Text>
              </Pressable>
            ))}
          </View>
        )}

        {tab === "packages" && (
          <View style={{ paddingHorizontal: 16 }}>
            {PACKAGES.map((p) => (
              <View key={p.id} style={[styles.pkgCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "30" }]}>
                {p.badge ? <View style={[styles.pkgBadge, { backgroundColor: BRAND }]}><Text style={styles.pkgBadgeText}>{p.badge} {t("الأكثر طلباً","Most Popular")}</Text></View> : null}
                <Text style={[styles.pkgName, { color: colors.text }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                <View style={styles.pkgPriceRow}>
                  <Text style={[styles.pkgOrigPrice, { color: colors.muted }]}>{p.originalPrice} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: BRAND }]}>{p.price} SAR</Text>
                  <View style={[styles.discBadge, { backgroundColor: "#DCFCE7" }]}>
                    <Text style={[styles.discText, { color: "#059669" }]}>{t("وفّري","Save")} {p.originalPrice - p.price} SAR</Text>
                  </View>
                </View>
                <View style={{ gap: 6, marginTop: 8 }}>
                  {p.includes.map((inc, j) => (
                    <View key={j} style={styles.pkgIncRow}>
                      <Feather name="check" size={13} color="#10B981" />
                      <Text style={[styles.pkgIncText, { color: colors.textSecondary }]}>{inc}</Text>
                    </View>
                  ))}
                </View>
                <Pressable style={[styles.pkgBtn, { backgroundColor: BRAND }]}>
                  <Text style={styles.pkgBtnText}>{t("احجزي الباقة","Book Package")}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {tab === "staff" && (
          <View style={{ paddingHorizontal: 16 }}>
            {STAFF.map((sp, i) => (
              <View key={i} style={[styles.staffCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: sp.color + "30" }]}>
                <View style={[styles.staffAvatar, { backgroundColor: sp.color }]}>
                  <Feather name="user" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.staffName, { color: colors.text }]}>{lang === "ar" ? sp.nameAr : sp.nameEn}</Text>
                  <Text style={[styles.staffSpec, { color: colors.muted }]}>{lang === "ar" ? sp.specialtyAr : sp.specialtyEn}</Text>
                  <Text style={[styles.staffSessions, { color: sp.color }]}>{sp.sessions} {t("جلسة","sessions")}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.staffRating, { color: "#F59E0B" }]}>★ {sp.rating}</Text>
                  <Pressable style={[styles.bookStaffBtn, { backgroundColor: sp.color + "20", borderColor: sp.color }]}>
                    <Text style={[styles.bookStaffText, { color: sp.color }]}>{t("احجزي","Book")}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "reviews" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={[styles.ratingOverview, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "30" }]}>
              <Text style={[styles.ratingBig, { color: BRAND }]}>4.8</Text>
              <Text style={[styles.ratingStars, { color: "#F59E0B" }]}>★★★★★</Text>
              <Text style={[styles.ratingCountText, { color: colors.muted }]}>218 {t("تقييم","reviews")}</Text>
            </View>
            {REVIEWS.map((r, i) => (
              <View key={i} style={[styles.reviewCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "20" }]}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewName, { color: colors.text }]}>{lang === "ar" ? r.nameAr : r.nameEn}</Text>
                  <Text style={[styles.reviewTime, { color: colors.muted }]}>{r.time}</Text>
                </View>
                <Text style={[styles.reviewStars, { color: "#F59E0B" }]}>{"★".repeat(r.rating)}</Text>
                <View style={[styles.reviewServiceTag, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[styles.reviewServiceText, { color: BRAND }]}>{lang === "ar" ? r.serviceAr : r.serviceEn}</Text>
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
  bizName: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  badgeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, flexWrap: "wrap" },
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
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catChipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  serviceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  serviceDur: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  servicePrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  bookBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  pkgCard: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 12, gap: 6 },
  pkgBadge: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pkgBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pkgPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgOrigPrice: { fontSize: 13, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
  pkgPrice: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  discBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pkgIncRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  pkgIncText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  pkgBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 8 },
  pkgBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  staffCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
  staffAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  staffName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  staffSpec: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  staffSessions: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  staffRating: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  bookStaffBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  bookStaffText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  ratingOverview: { alignItems: "center", borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 12, gap: 4 },
  ratingBig: { fontSize: 48, fontFamily: "Cairo_700Bold" },
  ratingStars: { fontSize: 24 },
  ratingCountText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  reviewCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10, gap: 6 },
  reviewHeader: { flexDirection: "row-reverse", justifyContent: "space-between" },
  reviewName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewStars: { fontSize: 16, textAlign: "right" },
  reviewServiceTag: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reviewServiceText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  reviewComment: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
});
