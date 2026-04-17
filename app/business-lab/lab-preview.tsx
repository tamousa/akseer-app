import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const C = "#0369A1";

const PACKAGES = [
  { nameAr: "باقة الفحص الشامل", nameEn: "Full Checkup", emoji: "🌟", price: 249, original: 380, tests: 10, homeVisit: true, targetAr: "للكشف السنوي", targetEn: "Annual checkup" },
  { nameAr: "باقة مرضى السكري", nameEn: "Diabetes Package", emoji: "🍬", price: 149, original: 205, tests: 5, homeVisit: true, targetAr: "لمرضى السكري", targetEn: "For diabetics" },
  { nameAr: "باقة الصحة الهرمونية", nameEn: "Hormonal Health", emoji: "⚗️", price: 279, original: 360, tests: 5, homeVisit: true, targetAr: "للتوازن الهرموني", targetEn: "Hormonal balance" },
];

const OFFERS = [
  { nameAr: "عرض الفحص الشامل — رمضان", nameEn: "Full Checkup — Ramadan", badge: "30%", emoji: "🌙", price: 174, original: 249, validToAr: "30 أبريل", validToEn: "Apr 30", code: "RAMADAN30" },
  { nameAr: "فيتامين D بـ 50 SAR", nameEn: "Vitamin D — 50 SAR", badge: "44%", emoji: "☀️", price: 50, original: 90, validToAr: "31 مارس", validToEn: "Mar 31", code: "VITD50" },
];

const TESTS = [
  { nameAr: "صورة دم كاملة CBC", nameEn: "CBC", price: 40, homeVisit: true, emoji: "🩸", time: "4h", catAr: "دم", catEn: "Blood", prepAr: "لا يشترط صيام", prepEn: "No fasting" },
  { nameAr: "سكر تراكمي HbA1c", nameEn: "HbA1c", price: 60, homeVisit: true, emoji: "📊", time: "6h", catAr: "سكر", catEn: "Sugar", prepAr: "لا يشترط صيام", prepEn: "No fasting" },
  { nameAr: "هرمونات الغدة الدرقية", nameEn: "Thyroid (TSH/T3/T4)", price: 120, homeVisit: true, emoji: "⚗️", time: "24h", catAr: "هرمونات", catEn: "Hormones", prepAr: "قبل الدواء الصباحي", prepEn: "Before morning meds" },
  { nameAr: "وظائف الكبد والكلى", nameEn: "Liver & Kidney Function", price: 160, homeVisit: true, emoji: "🫀", time: "8h", catAr: "كبد وكلى", catEn: "Liver & Kidney", prepAr: "صيام 10 ساعات", prepEn: "Fast 10 hours" },
  { nameAr: "دهون الدم الشاملة", nameEn: "Lipid Profile", price: 70, homeVisit: true, emoji: "💧", time: "4h", catAr: "دم", catEn: "Blood", prepAr: "صيام 12 ساعة", prepEn: "Fast 12 hours" },
];

const REVIEWS = [
  { customer: "أحمد الغامدي", rating: 5, commentAr: "مختبر ممتاز، النتائج وصلت على التطبيق سريعاً وبشكل واضح", commentEn: "Excellent lab, results appeared quickly and clearly in the app", timeAr: "اليوم", timeEn: "Today" },
  { customer: "فاطمة العتيبي", rating: 5, commentAr: "الخدمة المنزلية رائعة، الفني محترف وجاء في الوقت تماماً", commentEn: "Home service was great, technician was professional and on time", timeAr: "منذ 3 أيام", timeEn: "3 days ago" },
  { customer: "نورة السلمي", rating: 4, commentAr: "باقة السكري ممتازة وسعرها منافس. سأكررها كل 3 أشهر", commentEn: "Diabetes package is excellent and competitive in price. Will repeat every 3 months", timeAr: "منذ أسبوع", timeEn: "1 week ago" },
];

const CATS_AR = ["الكل", "دم 🩸", "سكر 🍬", "هرمونات ⚗️", "كبد وكلى 🫀", "مناعة 💊"];
const CATS_EN = ["All", "Blood 🩸", "Sugar 🍬", "Hormones ⚗️", "Liver & Kidney 🫀", "Immunity 💊"];

export default function LabPreviewPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeCat, setActiveCat] = useState(0);
  const [saved, setSaved] = useState(false);

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}>
      <View style={[styles.topBar, { backgroundColor: "#072040", paddingTop: topPadding + 8 }]}>
        <View style={styles.topBarRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.topBarTitle}>{t("معاينة المختبر","Lab Preview")}</Text>
            <Text style={styles.topBarSub}>{t("هكذا يراه المرضى في تطبيق أكسير","How patients see it in the Akseer app")}</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t("معاينة حية","Live Preview")}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={[styles.hero, { backgroundColor: C }]}>
          <View style={styles.heroLogo}><Text style={{ fontSize: 32 }}>🔬</Text></View>
          <Text style={styles.heroName}>{t("مختبر التشخيص الطبي","Medical Diagnostic Lab")}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={13} color="#FCD34D" />
            <Text style={styles.ratingVal}>4.8</Text>
            <Text style={styles.ratingCount}>({t("102 تقييم","102 reviews")})</Text>
          </View>
          <View style={styles.tagsRow}>
            {[t("تحاليل","Tests"), t("خدمة منزلية","Home Service"), t("نتيجة سريعة","Fast Results"), t("الرياض","Riyadh")].map((tg, i) => (
              <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>{tg}</Text></View>
            ))}
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}><Feather name="clock" size={11} color="#BAD4E8" /><Text style={styles.infoText}>07:00 — 22:00</Text></View>
            <View style={styles.infoItem}><Feather name="map-pin" size={11} color="#BAD4E8" /><Text style={styles.infoText}>{t("الرياض","Riyadh")}</Text></View>
            <View style={styles.infoItem}><Feather name="home" size={11} color="#BAD4E8" /><Text style={styles.infoText}>{t("خدمة منزلية","Home Service")}</Text></View>
            <View style={styles.infoItem}><Feather name="zap" size={11} color="#BAD4E8" /><Text style={styles.infoText}>{t("نتيجة خلال ساعات","Results in hours")}</Text></View>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaMain, { backgroundColor: C }]}>
            <Feather name="calendar" size={15} color="#fff" />
            <Text style={styles.ctaMainText}>{t("حجز تحليل","Book Test")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE", borderColor: C + "40" }]}>
            <Feather name="message-circle" size={16} color={C} />
            <Text style={[styles.ctaSecondaryText, { color: C }]}>{t("دردشة","Chat")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: saved ? C + "20" : (isDark ? "#0D2035" : "#DBEAFE"), borderColor: saved ? C : C + "40" }]}
            onPress={() => setSaved(!saved)}>
            <Feather name="heart" size={16} color={saved ? C : colors.muted} />
            <Text style={[styles.ctaSecondaryText, { color: saved ? C : colors.muted }]}>{saved ? t("متابَع ✓","Following ✓") : t("متابعة","Follow")}</Text>
          </Pressable>
        </View>

        <View style={[styles.bioCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.bioHeader}>
            <Feather name="info" size={14} color={C} />
            <Text style={[styles.bioTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("عن المختبر","About the Lab")}</Text>
          </View>
          <Text style={[styles.bioText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>
            {t("مختبر التشخيص الطبي متخصص في تحاليل الدم والهرمونات ووظائف الأعضاء. نوفر خدمة أخذ العينات في المنزل مع إرسال النتائج فور جهوزها مباشرة عبر تطبيق أكسير.",
               "Medical Diagnostic Lab specializes in blood, hormone, and organ function tests. We provide home sample collection with results sent instantly through the Akseer app.")}
          </Text>
          <View style={styles.bioStats}>
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>+50</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("تحليل","tests")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>+2000</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("مريض","patients")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>{t("فرعان","2")}</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("في الرياض","branches")}</Text></View>
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("باقات التحاليل","Test Packages")}</Text>
          <Text style={[styles.secCount, { color: "#D97706" }]}>{t("وفّر أكثر","Save More")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {PACKAGES.map((p, i) => {
            const savings = p.original - p.price;
            const pct = Math.round((savings / p.original) * 100);
            return (
              <View key={i} style={[styles.packageCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <View style={[styles.discBadge, { backgroundColor: "#FEF3C7" }]}>
                  <Text style={[styles.discText, { color: "#D97706" }]}>{t("خصم","Off")} {pct}%</Text>
                </View>
                <Text style={{ fontSize: 30, marginBottom: 6 }}>{p.emoji}</Text>
                <Text style={[styles.packageName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                <Text style={[styles.packageTarget, { color: colors.muted }]}>{lang === "ar" ? p.targetAr : p.targetEn}</Text>
                <Text style={[styles.packageTests, { color: C }]}>{p.tests} {t("تحاليل","tests")}</Text>
                {p.homeVisit && <Text style={[styles.packageHomeText, { color: "#059669" }]}>🏠 {t("يشمل خدمة منزلية","includes home service")}</Text>}
                <View style={styles.packagePriceRow}>
                  <Text style={[styles.packageOriginal, { color: colors.muted }]}>{p.original} SAR</Text>
                  <Text style={[styles.packagePrice, { color: C }]}>{p.price} SAR</Text>
                </View>
                <Pressable style={[styles.packageBtn, { backgroundColor: C }]}>
                  <Text style={styles.packageBtnText}>{t("احجز الباقة","Book Package")}</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("العروض النشطة","Active Offers")}</Text>
          <Text style={[styles.secCount, { color: "#DC2626" }]}>{OFFERS.length} {t("عروض","offers")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {OFFERS.map((o, i) => (
            <View key={i} style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.offerBadge, { backgroundColor: "#DC2626" }]}>
                <Text style={styles.offerBadgeText}>-{o.badge}</Text>
              </View>
              <Text style={{ fontSize: 28, marginBottom: 6 }}>{o.emoji}</Text>
              <Text style={[styles.offerName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? o.nameAr : o.nameEn}</Text>
              <View style={styles.offerPriceRow}>
                <Text style={[styles.offerOriginal, { color: colors.muted }]}>{o.original} SAR</Text>
                <Text style={[styles.offerPrice, { color: C }]}>{o.price} SAR</Text>
              </View>
              <Text style={[styles.offerValidity, { color: colors.muted }]}>{t("حتى","Until")} {lang === "ar" ? o.validToAr : o.validToEn}</Text>
              <View style={[styles.offerCode, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                <Text style={[styles.offerCodeText, { color: C }]}>#{o.code}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.homeServiceCard, { backgroundColor: isDark ? "#0A1A30" : "#DBEAFE", borderColor: C + "30" }]}>
          <Text style={{ fontSize: 28 }}>🚗</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.homeServiceTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("خدمة أخذ العينة في المنزل","Home Sample Collection")}</Text>
            <Text style={[styles.homeServiceDesc, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{t("فني مختبر معتمد يزورك في أي وقت · رسوم توصيل 50 SAR","Certified lab technician visits anytime · 50 SAR delivery fee")}</Text>
          </View>
          <Pressable style={[styles.homeServiceBtn, { backgroundColor: C }]}>
            <Text style={styles.homeServiceBtnText}>{t("احجز","Book")}</Text>
          </Pressable>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("قائمة التحاليل","Tests List")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATS_AR.map((cat, i) => (
            <Pressable key={i} style={[styles.catChip, { backgroundColor: activeCat === i ? C : cardBg, borderColor: activeCat === i ? C : cardBorder }]}
              onPress={() => setActiveCat(i)}>
              <Text style={[styles.catChipText, { color: activeCat === i ? "#fff" : colors.muted }]}>{lang === "ar" ? cat : CATS_EN[i]}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
          {TESTS.map((tx, i) => (
            <View key={i} style={[styles.testCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.testEmoji, { backgroundColor: C + "15" }]}>
                <Text style={{ fontSize: 22 }}>{tx.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.testName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? tx.nameAr : tx.nameEn}</Text>
                <View style={styles.testMeta}>
                  <View style={[styles.catBadge, { backgroundColor: isDark ? C + "25" : "#DBEAFE" }]}>
                    <Text style={[styles.catBadgeText, { color: C }]}>{lang === "ar" ? tx.catAr : tx.catEn}</Text>
                  </View>
                  <Feather name="clock" size={10} color={colors.muted} />
                  <Text style={[styles.testMetaText, { color: colors.muted }]}>{tx.time}</Text>
                  {tx.homeVisit && <Text style={[styles.testMetaText, { color: "#059669" }]}>🏠</Text>}
                </View>
                <View style={[styles.prepBox, { backgroundColor: isDark ? "#1A3352" : "#EFF6FF" }]}>
                  <Feather name="info" size={10} color={C} />
                  <Text style={[styles.prepText, { color: isDark ? "#A5C8E0" : C }]}>{lang === "ar" ? tx.prepAr : tx.prepEn}</Text>
                </View>
              </View>
              <View style={styles.testRight}>
                <Text style={[styles.testPrice, { color: C }]}>{tx.price} SAR</Text>
                <Pressable style={[styles.addTestBtn, { backgroundColor: C }]}>
                  <Feather name="plus" size={14} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("التقييمات","Reviews")}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: C + "20" }]}>
            <Feather name="star" size={12} color={C} />
            <Text style={[styles.ratingBadgeText, { color: C }]}>4.8</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
          {REVIEWS.map((r, i) => (
            <View key={i} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.reviewTop}>
                <Text style={[styles.reviewTime, { color: colors.muted }]}>{lang === "ar" ? r.timeAr : r.timeEn}</Text>
                <Text style={[styles.reviewName, { color: isDark ? "#fff" : "#0A1F35" }]}>{r.customer}</Text>
                <View style={[styles.reviewAvatar, { backgroundColor: C + "20" }]}>
                  <Text style={[styles.reviewAvatarText, { color: C }]}>{r.customer.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => <Feather key={s} name="star" size={12} color={s <= r.rating ? "#FCD34D" : (isDark ? "#1A3352" : "#E5E7EB")} />)}
              </View>
              <Text style={[styles.reviewComment, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? r.commentAr : r.commentEn}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.infoBox, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE", borderColor: C + "30" }]}>
          <Feather name="eye" size={14} color={C} />
          <Text style={[styles.infoBoxText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>
            {t("أي تعديل في التحاليل، الباقات، أو العروض يُحدَّث فوراً. النتائج تصل مباشرة عبر التطبيق. التواصل حصرياً عبر دردشة أكسير.",
               "Any changes to tests, packages, or offers update instantly. Results are delivered directly through the app. Communication is exclusively via Akseer chat.")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingBottom: 14 },
  topBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  topBarTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  topBarSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#BAD4E8", textAlign: "right" },
  liveBadge: { flexDirection: "row-reverse", gap: 4, backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignItems: "center" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#86EFAC" },
  liveText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#fff" },
  hero: { paddingHorizontal: 20, paddingVertical: 24, alignItems: "center" },
  heroLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: "#ffffff20", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroName: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 6 },
  ratingRow: { flexDirection: "row-reverse", gap: 4, alignItems: "center", marginBottom: 10 },
  ratingVal: { fontSize: 14, fontFamily: "Cairo_700Bold", color: "#FCD34D" },
  ratingCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#BAD4E8" },
  tagsRow: { flexDirection: "row-reverse", gap: 6, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" },
  heroTag: { backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#BAD4E8" },
  infoRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  infoItem: { flexDirection: "row-reverse", gap: 4, alignItems: "center" },
  infoText: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#BAD4E8" },
  ctaRow: { flexDirection: "row-reverse", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  ctaMain: { flex: 2, flexDirection: "row-reverse", gap: 6, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ctaMainText: { fontSize: 14, fontFamily: "Tajawal_700Bold", color: "#fff" },
  ctaSecondary: { flex: 1, flexDirection: "row-reverse", gap: 5, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  ctaSecondaryText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bioCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
  bioHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  bioTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bioText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  bioStats: { flexDirection: "row-reverse", justifyContent: "space-around", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#0369A125" },
  bioStat: { alignItems: "center", gap: 2 },
  bioStatVal: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  bioStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bioStatDivider: { width: 1 },
  secHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12, marginTop: 4 },
  secTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  secCount: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  hScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 20, flexDirection: "row-reverse" },
  packageCard: { width: 180, borderRadius: 20, padding: 14, borderWidth: 1, gap: 4 },
  discBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  discText: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  packageName: { fontSize: 13, fontFamily: "Cairo_700Bold", lineHeight: 18 },
  packageTarget: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  packageTests: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  packageHomeText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  packagePriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  packagePrice: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  packageOriginal: { fontSize: 12, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  packageBtn: { paddingVertical: 8, borderRadius: 10, alignItems: "center", marginTop: 6 },
  packageBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#fff" },
  offerCard: { width: 165, borderRadius: 18, padding: 14, borderWidth: 1, gap: 4 },
  offerBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  offerBadgeText: { fontSize: 11, fontFamily: "Cairo_700Bold", color: "#fff" },
  offerName: { fontSize: 12, fontFamily: "Tajawal_700Bold", lineHeight: 18 },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  offerPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  offerOriginal: { fontSize: 11, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerValidity: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  offerCode: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 4 },
  offerCodeText: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  homeServiceCard: { flexDirection: "row-reverse", gap: 12, marginHorizontal: 16, marginBottom: 20, borderRadius: 16, padding: 14, borderWidth: 1, alignItems: "center" },
  homeServiceTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", marginBottom: 4 },
  homeServiceDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", lineHeight: 16 },
  homeServiceBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  homeServiceBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#fff" },
  catScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 12, flexDirection: "row-reverse" },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  catChipText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  testCard: { flexDirection: "row-reverse", gap: 10, borderRadius: 14, padding: 12, borderWidth: 1 },
  testEmoji: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  testName: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 6 },
  testMeta: { flexDirection: "row-reverse", gap: 6, alignItems: "center", marginBottom: 6 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  testMetaText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  prepBox: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignItems: "center" },
  prepText: { fontSize: 10, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  testRight: { alignItems: "flex-end", gap: 8, justifyContent: "space-between" },
  testPrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  addTestBtn: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  ratingBadge: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  ratingBadgeText: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  reviewCard: { borderRadius: 14, padding: 12, borderWidth: 1, gap: 8 },
  reviewTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  reviewName: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  starsRow: { flexDirection: "row-reverse", gap: 2 },
  reviewComment: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  infoBox: { flexDirection: "row-reverse", gap: 10, margin: 16, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoBoxText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
});
