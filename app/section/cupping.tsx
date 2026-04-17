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
const ACCENT = "#EF4444";

interface Provider {
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
  services: { name: string; price: number; duration: string }[];
  features: string[];
}

interface Offer {
  id: string;
  providerName: string;
  providerId: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  validUntil: string;
  code: string;
  terms: string[];
}

const PROVIDERS: Provider[] = [
  {
    id: "1",
    name: "مركز الهجامة الطبية",
    description: "متخصصون في الحجامة الطبية وفق الأساليب النبوية الأصيلة بأعلى معايير الصحة",
    rating: 4.9,
    reviewCount: 1123,
    isOpen: true,
    address: "حي النزهة، الرياض",
    phone: "920034567",
    workingHours: "السبت - الخميس: 8:00 ص - 9:00 م | الجمعة: مغلق",
    providerId: "cupping-1",
    features: ["معقمة ومرخصة", "أطقم أحادية الاستخدام", "أطباء معتمدون", "نسائي ورجالي"],
    services: [
      { name: "حجامة رطبة (جافة)", price: 120, duration: "30 دقيقة" },
      { name: "حجامة رطبة (تقليدية)", price: 180, duration: "45 دقيقة" },
      { name: "حجامة الظهر الكاملة", price: 250, duration: "60 دقيقة" },
      { name: "حجامة مع مساج", price: 300, duration: "75 دقيقة" },
    ],
  },
  {
    id: "2",
    name: "عيادة السنة النبوية للحجامة",
    description: "علاج بالحجامة مع مختصين شرعيين وطبيين وفق السنة النبوية الصحيحة",
    rating: 4.8,
    reviewCount: 756,
    isOpen: true,
    address: "حي الريان، الرياض",
    phone: "011-7654321",
    workingHours: "السبت - الخميس: 9:00 ص - 8:00 م",
    providerId: "cupping-2",
    features: ["سنة نبوية", "أيام السنة المختارة", "فصد وحجامة", "استشارة مجانية"],
    services: [
      { name: "حجامة سنة رأس (الأخدعين)", price: 200, duration: "45 دقيقة" },
      { name: "حجامة الكاهل", price: 160, duration: "30 دقيقة" },
      { name: "حجامة الكبد والمعدة", price: 200, duration: "45 دقيقة" },
      { name: "حجامة وقائية شاملة", price: 350, duration: "90 دقيقة" },
    ],
  },
  {
    id: "3",
    name: "مركز النبض للصحة البديلة",
    description: "حجامة متكاملة مع علاجات طب بديل وتوافقي لتعزيز الصحة العامة",
    rating: 4.7,
    reviewCount: 421,
    isOpen: true,
    address: "حي المحمدية، الرياض",
    phone: "920089012",
    workingHours: "السبت - الخميس: 10:00 ص - 9:00 م",
    providerId: "cupping-3",
    features: ["طب بديل متكامل", "زيوت سنية", "أعشاب طبية", "حجز إلكتروني"],
    services: [
      { name: "حجامة + بخور طبي", price: 220, duration: "60 دقيقة" },
      { name: "حجامة + رقية شرعية", price: 280, duration: "60 دقيقة" },
      { name: "حجامة المفاصل", price: 190, duration: "45 دقيقة" },
      { name: "جلسة صحة بديلة شاملة", price: 420, duration: "120 دقيقة" },
    ],
  },
  {
    id: "4",
    name: "مركز شفاء للحجامة النسائية",
    description: "مركز متخصص للسيدات بأجواء خاصة ومريحة مع طاقم نسائي كامل",
    rating: 4.9,
    reviewCount: 634,
    isOpen: true,
    address: "حي الورود، الرياض",
    phone: "920045678",
    workingHours: "السبت - الخميس: 9:00 ص - 10:00 م",
    providerId: "cupping-4",
    features: ["طاقم نسائي 100%", "غرف خاصة", "بيئة محتشمة", "تخصص نسائي"],
    services: [
      { name: "حجامة نسائية شاملة", price: 200, duration: "60 دقيقة" },
      { name: "حجامة تنحيف وتخسيس", price: 280, duration: "75 دقيقة" },
      { name: "حجامة علاج الهرمونات", price: 240, duration: "60 دقيقة" },
      { name: "حجامة الوجه والرأس", price: 180, duration: "45 دقيقة" },
    ],
  },
];

const OFFERS: Offer[] = [
  {
    id: "1",
    providerName: "مركز الهجامة الطبية",
    providerId: "cupping-1",
    title: "باقة 5 جلسات حجامة بخصم 40%",
    description: "5 جلسات حجامة رطبة أو جافة حسب الاختيار مع استشارة طبية",
    originalPrice: 900,
    discountPrice: 540,
    discountPercent: 40,
    validUntil: "2026-05-20",
    code: "HEJAMA40",
    terms: ["خلال 6 أشهر", "لنفس الشخص", "يشمل استشارة طبية"],
  },
  {
    id: "2",
    providerName: "عيادة السنة النبوية",
    providerId: "cupping-2",
    title: "عرض أيام السنة الشهرية",
    description: "احجز في اليوم 17 أو 19 أو 21 من الشهر القمري واحصل على خصم",
    originalPrice: 350,
    discountPrice: 220,
    discountPercent: 37,
    validUntil: "2026-06-30",
    code: "SUNNAH37",
    terms: ["في الأيام البيض فقط", "حجز مسبق مطلوب", "حجامة الكاهل أو الأخدعين"],
  },
  {
    id: "3",
    providerName: "مركز النبض",
    providerId: "cupping-3",
    title: "جلسة الصحة البديلة الشاملة",
    description: "حجامة + بخور طبي + مساج خفيف + أعشاب طبية بسعر استثنائي",
    originalPrice: 600,
    discountPrice: 380,
    discountPercent: 37,
    validUntil: "2026-05-01",
    code: "NABDH37",
    terms: ["جلسة واحدة فقط", "حجز مسبق 48 ساعة", "غير قابل للتحويل"],
  },
];

export default function CuppingScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<"providers" | "offers">("providers");
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
    { key: "providers" as const, label: t("المراكز", "Centers"), icon: "map-pin" as const },
    { key: "offers" as const, label: t("العروض", "Offers"), icon: "tag" as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("الحجامة", "Cupping Therapy")} 🩸</Text>
        <Pressable onPress={() => router.push("/bookings" as any)} style={[styles.backBtn, { backgroundColor: ACCENT + "18" }]}>
          <Feather name="calendar" size={20} color={ACCENT} />
        </Pressable>
      </View>

      <View style={[styles.tabsRow, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: ACCENT }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Feather name={tab.icon} size={16} color={activeTab === tab.key ? ACCENT : colors.muted} />
            <Text style={[styles.tabText, { color: activeTab === tab.key ? ACCENT : colors.muted }]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "providers" && PROVIDERS.map((provider) => {
          const isExpanded = expandedId === provider.id;
          return (
            <View key={provider.id} style={[styles.card, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
              <Pressable style={styles.cardHeader} onPress={() => setExpandedId(isExpanded ? null : provider.id)}>
                <View style={styles.cardTop}>
                  <View style={[styles.cardIcon, { backgroundColor: ACCENT + "15" }]}>
                    <Text style={{ fontSize: 28 }}>🫙</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.cardName, { color: colors.text }]}>{provider.name}</Text>
                      <View style={[styles.openBadge, { backgroundColor: provider.isOpen ? "#22C55E18" : "#EF444418" }]}>
                        <View style={[styles.statusDot, { backgroundColor: provider.isOpen ? "#22C55E" : "#EF4444" }]} />
                        <Text style={[styles.openText, { color: provider.isOpen ? "#22C55E" : "#EF4444" }]}>
                          {provider.isOpen ? t("مفتوح", "Open") : t("مغلق", "Closed")}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.cardDesc, { color: colors.muted }]}>{provider.description}</Text>
                    <View style={styles.cardMeta}>
                      <View style={styles.ratingRow}>
                        <Text style={{ fontSize: 12 }}>⭐</Text>
                        <Text style={[styles.ratingText, { color: "#F59E0B" }]}>{provider.rating}</Text>
                        <Text style={[styles.reviewText, { color: colors.muted }]}>({provider.reviewCount})</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Feather name="map-pin" size={12} color={colors.muted} />
                        <Text style={[styles.metaText, { color: colors.muted }]}>{provider.address}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={colors.muted} />
              </Pressable>

              {isExpanded && (
                <View style={[styles.expanded, { borderTopColor: colors.border }]}>
                  <View style={styles.featuresRow}>
                    {provider.features.map((f, i) => (
                      <View key={i} style={[styles.featurePill, { backgroundColor: ACCENT + "12" }]}>
                        <Feather name="check" size={10} color={ACCENT} />
                        <Text style={[styles.featureText, { color: ACCENT }]}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.infoRows}>
                    <View style={styles.infoRow}>
                      <Feather name="clock" size={14} color={colors.muted} />
                      <Text style={[styles.infoText, { color: colors.textSecondary }]}>{provider.workingHours}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Feather name="phone" size={14} color={colors.muted} />
                      <Text style={[styles.infoText, { color: colors.textSecondary }]}>{provider.phone}</Text>
                    </View>
                  </View>

                  <Text style={[styles.servicesTitle, { color: colors.text }]}>{t("الخدمات المتاحة", "Available Services")}</Text>
                  {provider.services.map((svc, idx) => (
                    <View key={idx} style={[styles.serviceRow, { borderBottomColor: colors.border }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.serviceName, { color: colors.text }]}>{svc.name}</Text>
                        <View style={[styles.durationPill, { backgroundColor: ACCENT + "12" }]}>
                          <Feather name="clock" size={10} color={ACCENT} />
                          <Text style={[styles.durationText, { color: ACCENT }]}>{svc.duration}</Text>
                        </View>
                      </View>
                      <Text style={[styles.servicePrice, { color: ACCENT }]}>{svc.price} {t("ر.س", "SAR")}</Text>
                    </View>
                  ))}

                  <Pressable
                    style={[styles.bookBtn, { backgroundColor: ACCENT }]}
                    onPress={() => router.push(`/providers/detail/${provider.providerId}?type=cupping` as any)}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                    <Text style={styles.bookBtnText}>{t("احجز موعد", "Book Appointment")}</Text>
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
              <View style={[styles.providerTag, { backgroundColor: ACCENT + "15" }]}>
                <Text style={[styles.providerTagText, { color: ACCENT }]}>{offer.providerName}</Text>
              </View>
            </View>
            <Text style={[styles.offerTitle, { color: colors.text }]}>{offer.title}</Text>
            <Text style={[styles.offerDesc, { color: colors.muted }]}>{offer.description}</Text>
            <View style={styles.offerPriceRow}>
              <Text style={[styles.offerPrice, { color: ACCENT }]}>{offer.discountPrice} {t("ر.س", "SAR")}</Text>
              <Text style={[styles.offerOldPrice, { color: colors.muted }]}>{offer.originalPrice} {t("ر.س", "SAR")}</Text>
            </View>
            <View style={styles.offerFooter}>
              <Pressable
                style={[styles.codeBadge, { backgroundColor: copiedCode === offer.code ? "#22C55E20" : ACCENT + "15", flexDirection: "row-reverse", alignItems: "center", gap: 6 }]}
                onPress={() => copyCode(offer.code)}
              >
                <Feather name={copiedCode === offer.code ? "check" : "copy"} size={12} color={copiedCode === offer.code ? "#22C55E" : ACCENT} />
                <Text style={[styles.codeText, { color: copiedCode === offer.code ? "#22C55E" : ACCENT }]}>
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
                  <View style={[styles.providerTag, { backgroundColor: ACCENT + "15", alignSelf: "flex-end", marginBottom: 12 }]}>
                    <Text style={[styles.providerTagText, { color: ACCENT }]}>{selectedOffer.providerName}</Text>
                  </View>
                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{selectedOffer.description}</Text>

                  <View style={[styles.priceCard, { backgroundColor: isDark ? colors.surfaceAlt : "#FEF2F2" }]}>
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
                      <Text style={[styles.priceFinal, { color: ACCENT }]}>{selectedOffer.discountPrice} {t("ر.س", "SAR")}</Text>
                    </View>
                  </View>

                  <View style={[styles.codeBox, { backgroundColor: isDark ? colors.surfaceAlt : "#FEF2F2", borderColor: ACCENT + "30" }]}>
                    <View>
                      <Text style={[styles.codeBoxLabel, { color: colors.muted }]}>{t("كود العرض", "Offer Code")}</Text>
                      <Text style={[styles.codeBoxValue, { color: ACCENT }]}>{selectedOffer.code}</Text>
                    </View>
                    <Pressable
                      style={[styles.copyBtn, { backgroundColor: copiedCode === selectedOffer.code ? "#22C55E20" : ACCENT + "18" }]}
                      onPress={() => copyCode(selectedOffer.code)}
                    >
                      <Feather name={copiedCode === selectedOffer.code ? "check" : "copy"} size={16} color={copiedCode === selectedOffer.code ? "#22C55E" : ACCENT} />
                      <Text style={[styles.copyBtnTxt, { color: copiedCode === selectedOffer.code ? "#22C55E" : ACCENT }]}>
                        {copiedCode === selectedOffer.code ? t("تم النسخ!", "Copied!") : t("انسخ الكود", "Copy Code")}
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={[styles.termsTitle, { color: colors.text }]}>{t("الشروط والأحكام", "Terms & Conditions")}</Text>
                  {selectedOffer.terms.map((term, idx) => (
                    <View key={idx} style={styles.termRow}>
                      <View style={[styles.termDot, { backgroundColor: ACCENT }]} />
                      <Text style={[styles.termText, { color: colors.textSecondary }]}>{term}</Text>
                    </View>
                  ))}
                  <Text style={[styles.expiryText, { color: colors.muted }]}>
                    {t("ينتهي العرض في", "Offer expires")} {selectedOffer.validUntil}
                  </Text>
                  <Pressable
                    style={[styles.bookOfferBtn, { backgroundColor: ACCENT }]}
                    onPress={() => {
                      setSelectedOffer(null);
                      router.push(`/providers/detail/${selectedOffer.providerId}?type=cupping` as any);
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
  headerTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  tabsRow: { flexDirection: "row-reverse", borderBottomWidth: 1, paddingHorizontal: 20 },
  tab: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  card: { borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: "hidden" },
  cardHeader: { padding: 16, gap: 8 },
  cardTop: { flexDirection: "row-reverse", gap: 14 },
  cardIcon: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  nameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardName: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  openBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  cardDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  cardMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 14, marginTop: 8, flexWrap: "wrap" },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  metaItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  expanded: { borderTopWidth: 1, padding: 16, gap: 14 },
  featuresRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  featurePill: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  featureText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  infoRows: { gap: 8 },
  infoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  infoText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1 },
  servicesTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  serviceRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  serviceName: { fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  servicePrice: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  durationPill: { flexDirection: "row-reverse", alignItems: "center", gap: 4, alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  durationText: { fontSize: 10, fontFamily: "Tajawal_500Medium" },
  bookBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  bookBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  offerCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14, gap: 8 },
  offerTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  discountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  providerTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  providerTagText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
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
  priceFinal: { fontSize: 20, fontFamily: "Tajawal_700Bold" },
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
