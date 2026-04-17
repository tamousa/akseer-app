import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function StorePreviewPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [activeCat, setActiveCat] = useState(0);
  const [saved, setSaved] = useState(false);
  const { t, lang } = useLanguage();

  const OFFERS = [
    { nameAr: "خصم 20% على فيتامين C", nameEn: "20% Off Vitamin C", badge: "20%", emoji: "💊", validToAr: "30 أبريل", validToEn: "Apr 30", code: "VIT20",   color: "#DC2626" },
    { nameAr: "باقة الشتاء — بروتين + شاكر", nameEn: "Winter Pack — Protein + Shaker", badge: t("جديد","New"), emoji: "🥛", validToAr: "15 مايو", validToEn: "May 15", code: "WINTER", color: "#D97706" },
    { nameAr: "عرض الكولاجين المميز", nameEn: "Premium Collagen Offer", badge: "15%", emoji: "✨", validToAr: "20 أبريل", validToEn: "Apr 20", code: "COL15",  color: "#7C3AED" },
  ];

  const SERVICES = [
    { nameAr: "استشارة تغذية",       nameEn: "Nutrition Consultation", emoji: "🥗", price: 150, durationAr: "45 دق", durationEn: "45 min", homeVisit: false, virtual: true  },
    { nameAr: "فحص لياقة بدنية",     nameEn: "Fitness Assessment",     emoji: "💪", price: 100, durationAr: "30 دق", durationEn: "30 min", homeVisit: true,  virtual: false },
    { nameAr: "جلسة متابعة لياقة",   nameEn: "Fitness Follow-up",      emoji: "🏋️", price: 80,  durationAr: "60 دق", durationEn: "60 min", homeVisit: true,  virtual: true  },
  ];

  const PRODUCTS = [
    { nameAr: "فيتامين C 1000mg", nameEn: "Vitamin C 1000mg", price: 89,  rating: 4.8, reviews: 24, emoji: "💊", badgeAr: "الأكثر مبيعاً", badgeEn: "Best Seller", original: 110 },
    { nameAr: "بروتين واي 2kg",   nameEn: "Whey Protein 2kg", price: 249, rating: 4.6, reviews: 18, emoji: "🥛", badgeAr: "",               badgeEn: "",           original: 0   },
    { nameAr: "زيت أرجان طبيعي",  nameEn: "Natural Argan Oil",price: 129, rating: 4.9, reviews: 31, emoji: "🫙", badgeAr: "مميز",           badgeEn: "Featured",   original: 0   },
    { nameAr: "ماء الورد الطبيعي", nameEn: "Natural Rose Water",price: 45, rating: 4.5, reviews: 12, emoji: "🌸", badgeAr: "",               badgeEn: "",           original: 60  },
  ];

  const REVIEWS = [
    { customer: "أحمد الغامدي",   rating: 5, commentAr: "منتج ممتاز وتوصيل سريع، سعيد بالتجربة",             commentEn: "Excellent product and fast delivery, very happy!",        timeAr: "منذ يومين",    timeEn: "2 days ago"  },
    { customer: "سارة المطيري",   rating: 4, commentAr: "جودة عالية وسعر مناسب. سأطلب مجدداً بإذن الله",      commentEn: "High quality, good price. Will order again!",              timeAr: "منذ أسبوع",    timeEn: "1 week ago"  },
    { customer: "فهد العنزي",     rating: 5, commentAr: "خدمة ممتازة ومنتجات أصلية 100%",                     commentEn: "Excellent service and 100% authentic products.",           timeAr: "منذ أسبوعين",  timeEn: "2 weeks ago" },
  ];

  const CATS = [
    t("الكل","All"), `${t("مكملات","Supplements")} 💊`, `${t("جمال","Beauty")} ✨`,
    `${t("رياضة","Sports")} 💪`, `${t("عناية","Care")} 🌿`,
  ];

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { backgroundColor: "#4C1D95", paddingTop: topPadding + 8 }]}>
        <View style={styles.topBarRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.topBarTitle}>{t("معاينة المتجر","Store Preview")}</Text>
            <Text style={styles.topBarSub}>{t("هكذا يرى العملاء متجرك في تطبيق أكسير","This is how customers see your store in Akseer")}</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t("معاينة حية","Live Preview")}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={[styles.hero, { backgroundColor: "#6D28D9" }]}>
          <View style={styles.heroLogo}><Text style={{ fontSize: 32 }}>🏪</Text></View>
          <Text style={styles.heroName}>{t("متجر الصحة النقية","Pure Health Store")}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={13} color="#FCD34D" />
            <Text style={styles.ratingVal}>4.8</Text>
            <Text style={styles.ratingCount}>({t("54 تقييم","54 reviews")})</Text>
          </View>
          <View style={styles.tagsRow}>
            {[t("مكملات","Supplements"), t("رياضة","Sports"), t("جمال","Beauty"), t("عناية","Care")].map((tg, i) => (
              <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>{tg}</Text></View>
            ))}
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}><Feather name="clock" size={11} color="#C4B5FD" /><Text style={styles.infoText}>09:00 — 22:00</Text></View>
            <View style={styles.infoItem}><Feather name="map-pin" size={11} color="#C4B5FD" /><Text style={styles.infoText}>{t("الرياض، النزهة","Riyadh, Al-Nuzha")}</Text></View>
            <View style={styles.infoItem}><Feather name="truck" size={11} color="#C4B5FD" /><Text style={styles.infoText}>{t("توصيل 25 SAR","Delivery 25 SAR")}</Text></View>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaMain, { backgroundColor: C }]}>
            <Feather name="shopping-bag" size={15} color="#fff" />
            <Text style={styles.ctaMainText}>{t("تسوّق الآن","Shop Now")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE", borderColor: C + "40" }]}>
            <Feather name="message-circle" size={16} color={C} />
            <Text style={[styles.ctaSecondaryText, { color: C }]}>{t("دردشة","Chat")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: saved ? C + "20" : (isDark ? "#2A1F45" : "#EDE9FE"), borderColor: saved ? C : C + "40" }]}
            onPress={() => setSaved(!saved)}>
            <Feather name="heart" size={16} color={saved ? C : colors.muted} />
            <Text style={[styles.ctaSecondaryText, { color: saved ? C : colors.muted }]}>{saved ? t("متابَع ✓","Following ✓") : t("متابعة","Follow")}</Text>
          </Pressable>
        </View>

        <View style={[styles.bioCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.bioHeader}>
            <Feather name="info" size={14} color={C} />
            <Text style={[styles.bioTitle, { color: colors.text }]}>{t("عن المتجر","About the Store")}</Text>
          </View>
          <Text style={[styles.bioText, { color: isDark ? "#C4B5FD" : "#3D2B6B" }]}>
            {t("متجر الصحة النقية متخصص في المكملات الغذائية الطبيعية، منتجات العناية بالجسم، ومستلزمات اللياقة البدنية. نوفر منتجات أصلية 100% مع ضمان الجودة وخدمة توصيل سريعة لجميع أحياء الرياض.",
               "Pure Health Store specializes in natural dietary supplements, body care products, and fitness essentials. We provide 100% authentic products with quality guarantee and fast delivery across Riyadh.")}
          </Text>
          <View style={styles.bioStats}>
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>+500</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("منتج","Products")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>+1200</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("عميل","Customers")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>{t("3 سنوات","3 Years")}</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("خبرة","Experience")}</Text></View>
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: colors.text }]}>{t("العروض والخصومات","Offers & Discounts")}</Text>
          <Text style={[styles.secCount, { color: C }]}>{OFFERS.length} {t("عروض","Offers")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {OFFERS.map((o, i) => (
            <View key={i} style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.offerBadge, { backgroundColor: o.color }]}><Text style={styles.offerBadgeText}>{o.badge}</Text></View>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{o.emoji}</Text>
              <Text style={[styles.offerName, { color: colors.text }]}>{lang === "ar" ? o.nameAr : o.nameEn}</Text>
              <Text style={[styles.offerValidity, { color: colors.muted }]}>{t("حتى","Until")} {lang === "ar" ? o.validToAr : o.validToEn}</Text>
              <View style={[styles.offerCode, { backgroundColor: isDark ? "#2A1F45" : "#F5F0FF" }]}>
                <Text style={[styles.offerCodeText, { color: C }]}>#{o.code}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: colors.text }]}>{t("الخدمات","Services")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {SERVICES.map((s, i) => (
            <View key={i} style={[styles.serviceCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.serviceEmoji, { backgroundColor: C + "15" }]}><Text style={{ fontSize: 26 }}>{s.emoji}</Text></View>
              <Text style={[styles.serviceName, { color: colors.text }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
              <Text style={[styles.serviceMeta, { color: colors.muted }]}>{lang === "ar" ? s.durationAr : s.durationEn}</Text>
              <View style={styles.serviceIcons}>
                {s.virtual && <View style={[styles.sIcon, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}><Text style={{ fontSize: 10 }}>📱</Text></View>}
                {s.homeVisit && <View style={[styles.sIcon, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}><Text style={{ fontSize: 10 }}>🏠</Text></View>}
              </View>
              <Text style={[styles.servicePrice, { color: C }]}>{s.price} SAR</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: colors.text }]}>{t("المنتجات","Products")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATS.map((cat, i) => (
            <Pressable key={i} style={[styles.catChip, { backgroundColor: activeCat === i ? C : cardBg, borderColor: activeCat === i ? C : cardBorder }]}
              onPress={() => setActiveCat(i)}>
              <Text style={[styles.catChipText, { color: activeCat === i ? "#fff" : colors.muted }]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.productsGrid}>
          {PRODUCTS.map((p, i) => {
            const badge = lang === "ar" ? p.badgeAr : p.badgeEn;
            return (
              <View key={i} style={[styles.productCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <View style={[styles.productImg, { backgroundColor: isDark ? "#2A1F45" : "#F5F0FF" }]}>
                  <Text style={{ fontSize: 36 }}>{p.emoji}</Text>
                  {badge ? <View style={[styles.productBadge, { backgroundColor: C }]}><Text style={styles.productBadgeText}>{badge}</Text></View> : null}
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{lang === "ar" ? p.nameAr : p.nameEn}</Text>
                  <View style={styles.productRatingRow}>
                    <Text style={[styles.productReviews, { color: colors.muted }]}>({p.reviews})</Text>
                    <Text style={[styles.productRatingVal, { color: "#D97706" }]}>{p.rating}</Text>
                    <Feather name="star" size={10} color="#FCD34D" />
                  </View>
                  <View style={styles.productBottom}>
                    <Pressable style={[styles.addBtn, { backgroundColor: C + "20" }]}><Feather name="plus" size={14} color={C} /></Pressable>
                    <View style={{ alignItems: "flex-end" }}>
                      {p.original > 0 && <Text style={[styles.productOriginal, { color: colors.muted }]}>{p.original} SAR</Text>}
                      <Text style={[styles.productPrice, { color: C }]}>{p.price} SAR</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: colors.text }]}>{t("آخر التقييمات","Latest Reviews")}</Text>
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
                <Text style={[styles.reviewName, { color: colors.text }]}>{r.customer}</Text>
                <View style={[styles.reviewAvatar, { backgroundColor: C + "20" }]}>
                  <Text style={[styles.reviewAvatarText, { color: C }]}>{r.customer.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={12} color={s <= r.rating ? "#FCD34D" : (isDark ? "#2A1F45" : "#E5E7EB")} />)}
              </View>
              <Text style={[styles.reviewComment, { color: isDark ? "#C4B5FD" : "#3D2B6B" }]}>{lang === "ar" ? r.commentAr : r.commentEn}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.infoBox, { backgroundColor: isDark ? "#1A1030" : "#F5F0FF", borderColor: C + "30" }]}>
          <Feather name="eye" size={14} color={C} />
          <Text style={[styles.infoBoxText, { color: isDark ? "#C4B5FD" : "#3D2B6B" }]}>
            {t(
              "أي تعديل في المنتجات، الخدمات، أو العروض يُحدَّث فوراً لدى العملاء في تطبيق أكسير. التواصل يتم حصرياً عبر الدردشة الداخلية في المنصة.",
              "Any changes to products, services, or offers are instantly updated for customers in the Akseer app. All communication is exclusively via the platform's internal chat."
            )}
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
  topBarSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#C4B5FD", textAlign: "right" },
  liveBadge: { flexDirection: "row-reverse", gap: 4, backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignItems: "center" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#86EFAC" },
  liveText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#fff" },
  hero: { paddingHorizontal: 20, paddingVertical: 24, alignItems: "center" },
  heroLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: "#ffffff20", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroName: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 6 },
  ratingRow: { flexDirection: "row-reverse", gap: 4, alignItems: "center", marginBottom: 10 },
  ratingVal: { fontSize: 14, fontFamily: "Cairo_700Bold", color: "#FCD34D" },
  ratingCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#C4B5FD" },
  tagsRow: { flexDirection: "row-reverse", gap: 6, marginBottom: 12 },
  heroTag: { backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroTagText: { fontSize: 12, fontFamily: "Tajawal_500Medium", color: "#E9D5FF" },
  infoRow: { flexDirection: "row-reverse", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  infoItem: { flexDirection: "row-reverse", gap: 4, alignItems: "center" },
  infoText: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#C4B5FD" },
  ctaRow: { flexDirection: "row-reverse", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  ctaMain: { flex: 2, flexDirection: "row-reverse", gap: 6, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ctaMainText: { fontSize: 14, fontFamily: "Tajawal_700Bold", color: "#fff" },
  ctaSecondary: { flex: 1, flexDirection: "row-reverse", gap: 5, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  ctaSecondaryText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bioCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
  bioHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  bioTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bioText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  bioStats: { flexDirection: "row-reverse", justifyContent: "space-around", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#7C3AED20" },
  bioStat: { alignItems: "center", gap: 2 },
  bioStatVal: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  bioStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bioStatDivider: { width: 1, height: "100%" },
  secHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12, marginTop: 4 },
  secTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  secCount: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  hScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 20, flexDirection: "row-reverse" },
  offerCard: { width: 160, borderRadius: 18, padding: 14, borderWidth: 1, gap: 4 },
  offerBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  offerBadgeText: { fontSize: 11, fontFamily: "Cairo_700Bold", color: "#fff" },
  offerName: { fontSize: 13, fontFamily: "Tajawal_700Bold", lineHeight: 18 },
  offerValidity: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  offerCode: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 6 },
  offerCodeText: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  serviceCard: { width: 140, borderRadius: 18, padding: 14, borderWidth: 1, alignItems: "center", gap: 6 },
  serviceEmoji: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  serviceName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  serviceMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  serviceIcons: { flexDirection: "row-reverse", gap: 4 },
  sIcon: { width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  servicePrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  catScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 12, flexDirection: "row-reverse" },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  catChipText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  productsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 12, gap: 10, marginBottom: 20 },
  productCard: { width: "47%", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  productImg: { height: 100, alignItems: "center", justifyContent: "center" },
  productBadge: { position: "absolute", top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  productBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold", color: "#fff" },
  productInfo: { padding: 10, gap: 4 },
  productName: { fontSize: 12, fontFamily: "Tajawal_500Medium", lineHeight: 18 },
  productRatingRow: { flexDirection: "row-reverse", gap: 3, alignItems: "center" },
  productRatingVal: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  productReviews: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  productBottom: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  productPrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  productOriginal: { fontSize: 10, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  addBtn: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
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
