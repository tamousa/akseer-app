import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0369A1";

export default function LabOffers() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();

  const INITIAL_OFFERS = [
    { id: 1, nameAr: "عرض الفحص الشامل — رمضان", nameEn: "Ramadan Comprehensive Panel", emoji: "🌙", discount: 30, typeAr: "باقة", typeEn: "Package", targetAr: "باقة الفحص الشامل", targetEn: "Comprehensive Panel", originalPrice: 249, offerPrice: 174, validFromAr: "1 أبريل", validFromEn: "Apr 1", validToAr: "30 أبريل", validToEn: "Apr 30", active: true, usedCount: 42, maxUses: 100, code: "RAMADAN30", descAr: "عرض خاص بمناسبة شهر رمضان المبارك على باقة الفحص الشامل", descEn: "Special Ramadan offer on the Comprehensive Panel package" },
    { id: 2, nameAr: "فيتامين D بـ 50 ريال", nameEn: "Vitamin D for 50 SAR", emoji: "☀️", discount: 44, typeAr: "تحليل", typeEn: "Test", targetAr: "فيتامين D", targetEn: "Vitamin D", originalPrice: 90, offerPrice: 50, validFromAr: "1 مارس", validFromEn: "Mar 1", validToAr: "31 مارس", validToEn: "Mar 31", active: true, usedCount: 87, maxUses: 200, code: "VITD50", descAr: "عرض موسم الشتاء — تحليل فيتامين D بسعر مخفض", descEn: "Winter offer — Vitamin D test at a discounted price" },
    { id: 3, nameAr: "باقة السكري مجانية الشحن", nameEn: "Diabetes Package Free Delivery", emoji: "🎁", discount: 0, typeAr: "باقة", typeEn: "Package", targetAr: "باقة مرضى السكري", targetEn: "Diabetes Package", originalPrice: 149, offerPrice: 149, validFromAr: "1 مايو", validFromEn: "May 1", validToAr: "15 مايو", validToEn: "May 15", active: false, usedCount: 0, maxUses: 50, code: "DIABFREE", descAr: "باقة مرضى السكري مع توصيل مجاني للمنزل", descEn: "Diabetes Package with free home delivery" },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const [offers, setOffers] = useState(INITIAL_OFFERS.map((o) => ({ ...o })));
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggleOffer = (id: number) => setOffers((prev) => prev.map((o) => o.id === id ? { ...o, active: !o.active } : o));

  const SUMMARY = [
    { labelAr: "عروض نشطة", labelEn: "Active Offers", value: offers.filter((o) => o.active).length, color: "#059669" },
    { labelAr: "إجمالي الاستخدامات", labelEn: "Total Uses", value: offers.reduce((a, o) => a + o.usedCount, 0), color: C },
    { labelAr: "عروض منتهية", labelEn: "Ended", value: offers.filter((o) => !o.active).length, color: "#6B7280" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("العروض والخصومات","Offers & Discounts")}</Text>
        <Pressable style={[styles.addBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("عرض جديد","New Offer"), t("سيتم فتح نموذج إنشاء عرض جديد","A new offer form will open"))}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {SUMMARY.map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: isDark ? s.color + "15" : s.color + "10", borderColor: s.color + "30" }]}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{lang === "ar" ? s.labelAr : s.labelEn}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, gap: 14 }}>
        {offers.map((offer) => {
          const isExp = expanded === offer.id;
          const progress = Math.min(100, (offer.usedCount / offer.maxUses) * 100);
          return (
            <Pressable key={offer.id} style={[styles.offerCard, { backgroundColor: cardBg, borderColor: offer.active ? C + "40" : cardBorder }]}
              onPress={() => setExpanded(isExp ? null : offer.id)}>
              <View style={styles.offerTop}>
                <Switch value={offer.active} onValueChange={() => toggleOffer(offer.id)}
                  trackColor={{ false: "#ccc", true: C + "80" }} thumbColor={offer.active ? C : "#f4f3f4"} />
                <View style={{ flex: 1 }}>
                  <View style={styles.offerNameRow}>
                    {offer.discount > 0 && (
                      <View style={[styles.discBadge, { backgroundColor: "#FEE2E2" }]}>
                        <Text style={[styles.discText, { color: "#DC2626" }]}>-{offer.discount}%</Text>
                      </View>
                    )}
                    <Text style={[styles.offerName, { color: isDark ? "#fff" : "#0A1F35" }]}>{lang === "ar" ? offer.nameAr : offer.nameEn}</Text>
                  </View>
                  <Text style={[styles.offerTarget, { color: colors.muted }]}>{lang === "ar" ? offer.typeAr : offer.typeEn}: {lang === "ar" ? offer.targetAr : offer.targetEn}</Text>
                  <View style={styles.offerPriceRow}>
                    <Text style={[styles.offerPrice, { color: C }]}>{offer.offerPrice} SAR</Text>
                    {offer.offerPrice < offer.originalPrice && (
                      <Text style={[styles.offerOriginal, { color: colors.muted }]}>{offer.originalPrice} SAR</Text>
                    )}
                  </View>
                </View>
                <View style={[styles.offerEmoji, { backgroundColor: C + "15" }]}>
                  <Text style={{ fontSize: 26 }}>{offer.emoji}</Text>
                </View>
              </View>

              <View style={styles.offerValidity}>
                <Feather name="calendar" size={12} color={colors.muted} />
                <Text style={[styles.validityText, { color: colors.muted }]}>{lang === "ar" ? offer.validFromAr : offer.validFromEn} — {lang === "ar" ? offer.validToAr : offer.validToEn}</Text>
                <View style={{ flex: 1 }} />
                <View style={[styles.codeBadge, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <Text style={[styles.codeText, { color: C }]}>#{offer.code}</Text>
                </View>
              </View>

              <View style={{ gap: 4 }}>
                <View style={styles.usageRow}>
                  <Text style={[styles.usageMax, { color: colors.muted }]}>/ {offer.maxUses}</Text>
                  <Text style={[styles.usageCount, { color: C }]}>{offer.usedCount} {t("مرة استُخدم","uses")}</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#1A3352" : "#DBEAFE" }]}>
                  <View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: C }]} />
                </View>
              </View>

              {isExp && (
                <View style={[styles.expandedSection, { borderTopColor: cardBorder }]}>
                  <Text style={[styles.descText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? offer.descAr : offer.descEn}</Text>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("حذف العرض","Delete Offer"), `${t("حذف","Delete")} "${lang === "ar" ? offer.nameAr : offer.nameEn}"؟`, [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("حذف","Delete"), style: "destructive" }])}>
                      <Text style={[styles.actionBtnText, { color: "#DC2626" }]}>{t("حذف","Delete")}</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: C }]}
                      onPress={() => Alert.alert(t("نسخ كود الخصم","Copy Discount Code"), `${t("كود الخصم:","Code:")} ${offer.code}`)}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>{t("نسخ الكود","Copy Code")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable style={[styles.addOfferBtn, { borderColor: C, backgroundColor: isDark ? "#0D2035" : "#EFF6FF", marginHorizontal: 16, marginTop: 16 }]}
        onPress={() => Alert.alert(t("عرض جديد","New Offer"), t("سيتم فتح نموذج إنشاء عرض جديد","A new offer form will open"))}>
        <Feather name="tag" size={16} color={C} />
        <Text style={[styles.addOfferBtnText, { color: C }]}>{t("إضافة عرض جديد","Add New Offer")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1 },
  summaryValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  offerCard: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 10 },
  offerTop: { flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" },
  offerEmoji: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  offerNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  offerName: { fontSize: 14, fontFamily: "Cairo_700Bold", flex: 1 },
  discBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  discText: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  offerTarget: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginBottom: 6 },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  offerPrice: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  offerOriginal: { fontSize: 12, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerValidity: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  validityText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  codeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  codeText: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  usageRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  usageCount: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  usageMax: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  expandedSection: { borderTopWidth: 1, marginTop: 4, paddingTop: 12, gap: 10 },
  descText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  actionBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  addOfferBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderStyle: "dashed" },
  addOfferBtnText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
