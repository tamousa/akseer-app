import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  I18nManager,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

interface Lab {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  phone: string;
  workingHours: string;
  providerId: string;
  tests: { name: string; price: number; category: string }[];
  features: string[];
}

interface Offer {
  id: string;
  labName: string;
  labId: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  validUntil: string;
  code: string;
  terms: string[];
}

const LABS: Lab[] = [
  {
    id: "1", name: "مختبر البرج الطبي", description: "أكبر شبكة مختبرات في المملكة مع أحدث التقنيات المخبرية",
    rating: 4.8, reviewCount: 1245, isOpen: true, address: "حي العليا، الرياض", phone: "920005050",
    workingHours: "السبت - الخميس: 7:00 ص - 10:00 م | الجمعة: 4:00 م - 10:00 م",
    providerId: "lab-1",
    tests: [
      { name: "فحص شامل CBC", price: 80, category: "دم" },
      { name: "فحص وظائف الكبد", price: 120, category: "كيمياء" },
      { name: "فحص وظائف الكلى", price: 100, category: "كيمياء" },
      { name: "فحص السكر التراكمي HbA1c", price: 90, category: "سكر" },
      { name: "فحص الغدة الدرقية TSH", price: 110, category: "هرمونات" },
      { name: "فحص فيتامين D", price: 150, category: "فيتامينات" },
      { name: "فحص حديد ومخزون الحديد", price: 130, category: "دم" },
    ],
    features: ["نتائج خلال 24 ساعة", "أجهزة حديثة", "طاقم نسائي متوفر", "مواقف سيارات"],
  },
  {
    id: "2", name: "مختبر النهضة", description: "مختبر معتمد من الهيئة السعودية مع دقة عالية في النتائج",
    rating: 4.7, reviewCount: 312, isOpen: true, address: "حي السليمانية، الرياض", phone: "011-5678901",
    workingHours: "السبت - الخميس: 7:00 ص - 10:00 م | الجمعة: 4:00 م - 10:00 م",
    providerId: "lab-2",
    tests: [
      { name: "تحليل شامل أساسي", price: 350, category: "باقات" },
      { name: "تحليل حساسية طعام", price: 450, category: "حساسية" },
      { name: "فحص فيتامينات شامل", price: 380, category: "فيتامينات" },
      { name: "فحص هرمونات شامل", price: 420, category: "هرمونات" },
      { name: "تحليل بول كامل", price: 60, category: "بول" },
    ],
    features: ["معتمد من SFDA", "نتائج إلكترونية", "تأمين معتمد"],
  },
  {
    id: "3", name: "مختبرات كير لاب", description: "خدمة سحب عينات منزلية على مدار الساعة مع نتائج سريعة",
    rating: 4.9, reviewCount: 278, isOpen: true, address: "خدمة منزلية - الرياض", phone: "920067890",
    workingHours: "يومياً: 24 ساعة",
    providerId: "lab-3",
    tests: [
      { name: "سحب عينة منزلي + تحليل شامل", price: 500, category: "منزلي" },
      { name: "سحب عينة منزلي + COVID PCR", price: 250, category: "منزلي" },
      { name: "سحب عينة منزلي + فيتامينات", price: 350, category: "منزلي" },
      { name: "فحص ما قبل الزواج", price: 400, category: "باقات" },
    ],
    features: ["خدمة 24 ساعة", "سحب منزلي", "نتائج خلال 12 ساعة", "تغطية كل الرياض"],
  },
  {
    id: "4", name: "مختبر الرازي الطبي", description: "مختبر متخصص في التحاليل الجينية والوراثية",
    rating: 4.6, reviewCount: 198, isOpen: true, address: "حي الصحافة، الرياض", phone: "011-4567890",
    workingHours: "السبت - الخميس: 8:00 ص - 9:00 م",
    providerId: "lab-1",
    tests: [
      { name: "فحص جيني شامل", price: 1200, category: "جيني" },
      { name: "فحص وراثي للأمراض", price: 800, category: "جيني" },
      { name: "تحليل كروموسومات", price: 950, category: "جيني" },
      { name: "فحص شامل أساسي", price: 250, category: "باقات" },
    ],
    features: ["تحاليل جينية متخصصة", "استشارة وراثية", "شهادات دولية"],
  },
];

const OFFERS: Offer[] = [
  {
    id: "1", labName: "مختبر البرج الطبي", labId: "lab-1",
    title: "باقة الفحص الشامل", description: "فحص شامل يشمل أكثر من 25 تحليل مخبري",
    originalPrice: 650, discountPrice: 299, discountPercent: 54,
    validUntil: "2026-04-30", code: "BORG54",
    terms: ["صالح لزيارة واحدة", "يشمل فحص دم + كيمياء + هرمونات", "لا يشمل التحاليل الجينية"],
  },
  {
    id: "2", labName: "مختبرات كير لاب", labId: "lab-3",
    title: "سحب منزلي مجاني", description: "احصل على خدمة السحب المنزلي مجاناً مع أي باقة",
    originalPrice: 100, discountPrice: 0, discountPercent: 100,
    validUntil: "2026-05-15", code: "HOMECARE",
    terms: ["صالح على الباقات فقط", "داخل الرياض فقط", "حجز مسبق مطلوب"],
  },
  {
    id: "3", labName: "مختبر النهضة", labId: "lab-2",
    title: "فحص فيتامينات + حساسية", description: "باقة مميزة لفحص الفيتامينات وحساسية الطعام",
    originalPrice: 830, discountPrice: 399, discountPercent: 52,
    validUntil: "2026-04-20", code: "VITACHECK",
    terms: ["يشمل فحص 90 نوع حساسية", "فحص جميع الفيتامينات الأساسية", "النتائج خلال 48 ساعة"],
  },
  {
    id: "4", labName: "مختبر الرازي الطبي", labId: "lab-1",
    title: "فحص جيني بخصم 40%", description: "فحص جيني شامل مع استشارة وراثية مجانية",
    originalPrice: 1200, discountPrice: 720, discountPercent: 40,
    validUntil: "2026-06-01", code: "GENE40",
    terms: ["يشمل استشارة وراثية مجانية", "النتائج خلال أسبوع", "تقرير مفصل"],
  },
];

export default function LabsSectionScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<"labs" | "offers">("labs");
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    if (Platform.OS === "android") {
      ToastAndroid.show(t("تم نسخ الكود!", "Code copied!"), ToastAndroid.SHORT);
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const TABS = [
    { key: "labs" as const, label: t("المختبرات", "Labs"), icon: "activity" as const },
    { key: "offers" as const, label: t("العروض", "Offers"), icon: "tag" as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("المختبرات والتحاليل", "Labs & Tests")} 🔬</Text>
        <Pressable onPress={() => router.push("/bookings" as any)} style={[styles.backBtn, { backgroundColor: isDark ? "rgba(59,130,246,0.12)" : "#EFF6FF" }]}>
          <Feather name="calendar" size={20} color="#3B82F6" />
        </Pressable>
      </View>

      <View style={[styles.tabsRow, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: "#3B82F6" }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Feather name={tab.icon} size={16} color={activeTab === tab.key ? "#3B82F6" : colors.muted} />
            <Text style={[styles.tabText, { color: activeTab === tab.key ? "#3B82F6" : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "labs" && LABS.map((lab) => {
          const isExpanded = expandedLab === lab.id;
          return (
            <View key={lab.id} style={[styles.labCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
              <Pressable
                style={styles.labCardHeader}
                onPress={() => setExpandedLab(isExpanded ? null : lab.id)}
              >
                <View style={styles.labCardTop}>
                  <View style={[styles.labIconBig, { backgroundColor: "#3B82F6" + "15" }]}>
                    <Text style={{ fontSize: 28 }}>🏥</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.labNameRow}>
                      <Text style={[styles.labName, { color: colors.text }]}>{lab.name}</Text>
                      <View style={[styles.openBadge, { backgroundColor: lab.isOpen ? "#22C55E18" : "#EF444418" }]}>
                        <View style={[styles.statusDot, { backgroundColor: lab.isOpen ? "#22C55E" : "#EF4444" }]} />
                        <Text style={[styles.openText, { color: lab.isOpen ? "#22C55E" : "#EF4444" }]}>
                          {lab.isOpen ? t("مفتوح", "Open") : t("مغلق", "Closed")}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.labDesc, { color: colors.muted }]}>{lab.description}</Text>
                    <View style={styles.labMeta}>
                      <View style={styles.ratingRow}>
                        <Text style={{ fontSize: 12 }}>⭐</Text>
                        <Text style={[styles.ratingText, { color: "#F59E0B" }]}>{lab.rating}</Text>
                        <Text style={[styles.reviewText, { color: colors.muted }]}>({lab.reviewCount})</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Feather name="map-pin" size={12} color={colors.muted} />
                        <Text style={[styles.metaText, { color: colors.muted }]}>{lab.address}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.muted} />
              </Pressable>

              {isExpanded && (
                <View style={[styles.labExpanded, { borderTopColor: colors.border }]}>
                  <View style={styles.featuresRow}>
                    {lab.features.map((f, i) => (
                      <View key={i} style={[styles.featurePill, { backgroundColor: "#3B82F6" + "12" }]}>
                        <Feather name="check" size={10} color="#3B82F6" />
                        <Text style={[styles.featureText, { color: "#3B82F6" }]}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.infoRows}>
                    <View style={styles.infoRow}>
                      <Feather name="clock" size={14} color={colors.muted} />
                      <Text style={[styles.infoText, { color: colors.textSecondary }]}>{lab.workingHours}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Feather name="phone" size={14} color={colors.muted} />
                      <Text style={[styles.infoText, { color: colors.textSecondary }]}>{lab.phone}</Text>
                    </View>
                  </View>

                  <Text style={[styles.testsTitle, { color: colors.text }]}>{t("التحاليل المتوفرة", "Available Tests")}</Text>
                  {lab.tests.map((test, idx) => (
                    <View key={idx} style={[styles.testRow, { borderBottomColor: colors.border }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.testName, { color: colors.text }]}>{test.name}</Text>
                        <View style={[styles.catPill, { backgroundColor: "#3B82F6" + "12" }]}>
                          <Text style={[styles.catText, { color: "#3B82F6" }]}>{test.category}</Text>
                        </View>
                      </View>
                      <Text style={[styles.testPrice, { color: "#3B82F6" }]}>{test.price} {t("ر.س", "SAR")}</Text>
                    </View>
                  ))}

                  <Pressable
                    style={[styles.bookLabBtn, { backgroundColor: "#3B82F6" }]}
                    onPress={() => router.push(`/providers/detail/${lab.providerId}?type=labs` as any)}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                    <Text style={styles.bookLabBtnText}>{t("احجز موعد", "Book Appointment")}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}

        {activeTab === "offers" && OFFERS.map((offer) => (
          <Pressable
            key={offer.id}
            style={[styles.offerCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}
            onPress={() => setSelectedOffer(offer)}
          >
            <View style={styles.offerTop}>
              <View style={[styles.discountBadge, { backgroundColor: "#22C55E" }]}>
                <Text style={styles.discountText}>-{offer.discountPercent}%</Text>
              </View>
              <View style={[styles.labTag, { backgroundColor: "#3B82F6" + "15" }]}>
                <Text style={[styles.labTagText, { color: "#3B82F6" }]}>{offer.labName}</Text>
              </View>
            </View>
            <Text style={[styles.offerTitle, { color: colors.text }]}>{offer.title}</Text>
            <Text style={[styles.offerDesc, { color: colors.muted }]}>{offer.description}</Text>
            <View style={styles.offerPriceRow}>
              <Text style={[styles.offerPrice, { color: "#3B82F6" }]}>
                {offer.discountPrice === 0 ? t("مجاناً", "Free") : `${offer.discountPrice} ${t("ر.س", "SAR")}`}
              </Text>
              <Text style={[styles.offerOldPrice, { color: colors.muted }]}>{offer.originalPrice} {t("ر.س", "SAR")}</Text>
            </View>
            <View style={styles.offerFooter}>
              <Pressable
                style={[styles.codeBadge, { backgroundColor: copiedCode === offer.code ? "#22C55E20" : "#3B82F6" + "15", flexDirection: "row-reverse", alignItems: "center", gap: 6 }]}
                onPress={() => copyCode(offer.code)}
              >
                <Feather name={copiedCode === offer.code ? "check" : "copy"} size={12} color={copiedCode === offer.code ? "#22C55E" : "#3B82F6"} />
                <Text style={[styles.codeText, { color: copiedCode === offer.code ? "#22C55E" : "#3B82F6" }]}>
                  {copiedCode === offer.code ? t("تم النسخ!", "Copied!") : offer.code}
                </Text>
              </Pressable>
              <Text style={[styles.validText, { color: colors.muted }]}>{t("صالح حتى", "Valid until")} {offer.validUntil}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!selectedOffer} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            {selectedOffer && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedOffer.title}</Text>
                  <Pressable onPress={() => setSelectedOffer(null)}>
                    <Feather name="x" size={22} color={colors.muted} />
                  </Pressable>
                </View>
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={[styles.labTag, { backgroundColor: "#3B82F6" + "15", alignSelf: "flex-end", marginBottom: 12 }]}>
                    <Text style={[styles.labTagText, { color: "#3B82F6" }]}>{selectedOffer.labName}</Text>
                  </View>
                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{selectedOffer.description}</Text>

                  <View style={[styles.priceCard, { backgroundColor: isDark ? colors.surfaceAlt : "#F0F9FF" }]}>
                    <View style={styles.priceCardRow}>
                      <Text style={[styles.priceLabel, { color: colors.muted }]}>{t("السعر الأصلي", "Original Price")}</Text>
                      <Text style={[styles.priceOld, { color: colors.muted }]}>{selectedOffer.originalPrice} {t("ر.س", "SAR")}</Text>
                    </View>
                    <View style={styles.priceCardRow}>
                      <Text style={[styles.priceLabel, { color: "#22C55E" }]}>{t("الخصم", "Discount")}</Text>
                      <Text style={[styles.priceDiscount, { color: "#22C55E" }]}>-{selectedOffer.discountPercent}%</Text>
                    </View>
                    <View style={[styles.priceCardRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 6 }]}>
                      <Text style={[styles.priceFinalLabel, { color: colors.text }]}>{t("السعر بعد الخصم", "Final Price")}</Text>
                      <Text style={styles.priceFinal}>
                        {selectedOffer.discountPrice === 0 ? t("مجاناً", "Free") : `${selectedOffer.discountPrice} ${t("ر.س", "SAR")}`}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.codeBox, { backgroundColor: isDark ? colors.surfaceAlt : "#F0F9FF", borderColor: "#3B82F6" + "30" }]}>
                    <View>
                      <Text style={[styles.codeBoxLabel, { color: colors.muted }]}>{t("كود العرض", "Offer Code")}</Text>
                      <Text style={[styles.codeBoxValue, { color: "#3B82F6" }]}>{selectedOffer.code}</Text>
                    </View>
                    <Pressable
                      style={[styles.copyBtn, { backgroundColor: copiedCode === selectedOffer.code ? "#22C55E20" : "#3B82F6" + "18" }]}
                      onPress={() => copyCode(selectedOffer.code)}
                    >
                      <Feather name={copiedCode === selectedOffer.code ? "check" : "copy"} size={16} color={copiedCode === selectedOffer.code ? "#22C55E" : "#3B82F6"} />
                      <Text style={[styles.copyBtnTxt, { color: copiedCode === selectedOffer.code ? "#22C55E" : "#3B82F6" }]}>
                        {copiedCode === selectedOffer.code ? t("تم النسخ!", "Copied!") : t("انسخ الكود", "Copy Code")}
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={[styles.termsTitle, { color: colors.text }]}>{t("الشروط والأحكام", "Terms & Conditions")}</Text>
                  {selectedOffer.terms.map((term, idx) => (
                    <View key={idx} style={styles.termRow}>
                      <View style={[styles.termDot, { backgroundColor: "#3B82F6" }]} />
                      <Text style={[styles.termText, { color: colors.textSecondary }]}>{term}</Text>
                    </View>
                  ))}

                  <Text style={[styles.expiryText, { color: colors.muted }]}>
                    {t("ينتهي العرض في", "Offer expires")} {selectedOffer.validUntil}
                  </Text>

                  <Pressable
                    style={[styles.bookOfferBtn, { backgroundColor: "#3B82F6" }]}
                    onPress={() => {
                      setSelectedOffer(null);
                      router.push(`/providers/detail/${selectedOffer.labId}?type=labs` as any);
                    }}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                    <Text style={styles.bookOfferBtnText}>{t("احجز الآن", "Book Now")}</Text>
                  </Pressable>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  tabsRow: { flexDirection: "row-reverse", borderBottomWidth: 1, paddingHorizontal: 20 },
  tab: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  labCard: { borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: "hidden" },
  labCardHeader: { padding: 16, gap: 8 },
  labCardTop: { flexDirection: "row-reverse", gap: 14 },
  labIconBig: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  labNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  labName: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  openBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  labDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  labMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 14, marginTop: 8, flexWrap: "wrap" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  metaItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  labExpanded: { borderTopWidth: 1, padding: 16, gap: 14 },
  featuresRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  featurePill: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  featureText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  infoRows: { gap: 8 },
  infoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  infoText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1 },
  testsTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  testRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  testName: { fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  testPrice: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  catPill: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  catText: { fontSize: 10, fontFamily: "Tajawal_500Medium" },
  bookLabBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  bookLabBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  offerCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14, gap: 8 },
  offerTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  discountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  labTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  labTagText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  offerTitle: { fontSize: 17, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  offerDesc: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  offerPrice: { fontSize: 18, fontFamily: "Tajawal_700Bold" },
  offerOldPrice: { fontSize: 14, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  codeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  codeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  validText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", flex: 1, textAlign: "right" },
  modalBody: { padding: 20 },
  modalDesc: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22, marginBottom: 16 },
  priceCard: { borderRadius: 16, padding: 16, gap: 8, marginBottom: 16 },
  priceCardRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
  priceOld: { fontSize: 14, fontFamily: "Tajawal_500Medium", textDecorationLine: "line-through" },
  priceDiscount: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  priceFinalLabel: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  priceFinal: { fontSize: 20, fontFamily: "Tajawal_700Bold", color: "#3B82F6" },
  codeBox: { borderRadius: 14, padding: 16, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", borderWidth: 1, marginBottom: 16 },
  codeBoxLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  codeBoxValue: { fontSize: 22, fontFamily: "Tajawal_700Bold", letterSpacing: 3, textAlign: "right" },
  copyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  copyBtnTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  termsTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 8 },
  termRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  termDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  termText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1 },
  expiryText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center", marginTop: 12, marginBottom: 8 },
  bookOfferBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, marginTop: 8, marginBottom: 20 },
  bookOfferBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
});
