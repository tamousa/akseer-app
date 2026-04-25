import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  I18nManager,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AkseerDropLogo from "@/components/AkseerDropLogo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const STORE_IMAGES: Record<string, any> = {
  sports:      require("@/assets/images/fitness-equipment.png"),
  organic:     require("@/assets/images/meal-prep.png"),
  supplements: require("@/assets/images/smoothie-bowl.png"),
  beauty:      require("@/assets/images/spa-treatment.png"),
  devices:     require("@/assets/images/clinic-room.png"),
  default:     require("@/assets/images/nutrition-banner.png"),
};

const CATEGORIES = [
  { key: "all",         labelAr: "الكل",   labelEn: "All",          emoji: "🏪" },
  { key: "supplements", labelAr: "مكملات", labelEn: "Supplements",  emoji: "💊" },
  { key: "organic",     labelAr: "عضوي",   labelEn: "Organic",      emoji: "🌿" },
  { key: "sports",      labelAr: "رياضة",  labelEn: "Sports",       emoji: "🏋️" },
  { key: "beauty",      labelAr: "عناية",  labelEn: "Beauty",       emoji: "✨" },
  { key: "devices",     labelAr: "أجهزة",  labelEn: "Devices",      emoji: "📱" },
];

const STORES = [
  {
    id: "1", nameAr: "متجر اللياقة الذهبي", nameEn: "Golden Fitness Store", emoji: "🏋️",
    category: "sports", rating: 4.8, reviewCount: 1250,
    deliveryTime: "20-35", deliveryFee: 0, minOrder: 50,
    tagsAr: ["أجهزة رياضية", "ملابس", "إكسسوارات"],
    tagsEn: ["Sports Gear", "Apparel", "Accessories"],
    isOpen: true, isFeatured: true,
    badgeAr: "الأكثر طلباً", badgeEn: "Most Ordered",
    bgColor: "#F59E0B",
  },
  {
    id: "2", nameAr: "متجر العضوي الطبيعي", nameEn: "Natural Organic Store", emoji: "🌿",
    category: "organic", rating: 4.9, reviewCount: 874,
    deliveryTime: "25-40", deliveryFee: 15, minOrder: 80,
    tagsAr: ["عضوي معتمد", "خضروات", "مشروبات صحية"],
    tagsEn: ["Certified Organic", "Vegetables", "Healthy Drinks"],
    isOpen: true, isFeatured: true,
    badgeAr: "عضوي 100%", badgeEn: "100% Organic",
    bgColor: "#22C55E",
  },
  {
    id: "3", nameAr: "متجر المكملات الغذائية", nameEn: "Dietary Supplements Store", emoji: "💊",
    category: "supplements", rating: 4.7, reviewCount: 3410,
    deliveryTime: "15-30", deliveryFee: 0, minOrder: 100,
    tagsAr: ["بروتين", "فيتامينات", "حرق دهون"],
    tagsEn: ["Protein", "Vitamins", "Fat Burners"],
    isOpen: true, isFeatured: false,
    badgeAr: null, badgeEn: null,
    bgColor: "#3B82F6",
  },
  {
    id: "4", nameAr: "متجر العناية والجمال", nameEn: "Beauty & Care Store", emoji: "✨",
    category: "beauty", rating: 4.8, reviewCount: 659,
    deliveryTime: "30-45", deliveryFee: 10, minOrder: 60,
    tagsAr: ["بشرة", "شعر", "طبيعي"],
    tagsEn: ["Skin", "Hair", "Natural"],
    isOpen: true, isFeatured: false,
    badgeAr: "جديد", badgeEn: "New",
    bgColor: "#EC4899",
  },
  {
    id: "5", nameAr: "متجر الأجهزة الطبية", nameEn: "Medical Devices Store", emoji: "🩺",
    category: "devices", rating: 4.6, reviewCount: 421,
    deliveryTime: "35-60", deliveryFee: 0, minOrder: 200,
    tagsAr: ["أجهزة منزلية", "قياس ضغط", "مراقبة صحة"],
    tagsEn: ["Home Devices", "Blood Pressure", "Health Monitor"],
    isOpen: false, isFeatured: false,
    badgeAr: null, badgeEn: null,
    bgColor: "#8B5CF6",
  },
  {
    id: "6", nameAr: "متجر الشاي والأعشاب", nameEn: "Tea & Herbs Store", emoji: "🍵",
    category: "organic", rating: 4.7, reviewCount: 290,
    deliveryTime: "20-35", deliveryFee: 0, minOrder: 40,
    tagsAr: ["أعشاب طبيعية", "شاي صحي", "توابل"],
    tagsEn: ["Natural Herbs", "Healthy Tea", "Spices"],
    isOpen: true, isFeatured: false,
    badgeAr: "عرض اليوم", badgeEn: "Today's Deal",
    bgColor: "#14B8A6",
  },
];

const STORE_OFFERS = [
  {
    id: "1", titleAr: "خصم على المكملات الغذائية", titleEn: "Supplements Discount", code: "SUPP30",
    price: 105, oldPrice: 150, discount: 30, color: "#22C55E",
    providerAr: "متجر المكملات", providerEn: "Supplements Store",
    descAr: "خصم 30% على جميع مكملات البروتين والفيتامينات",
    descEn: "30% off all protein and vitamin supplements",
    validUntil: "2026-05-30",
  },
  {
    id: "2", titleAr: "شحن مجاني لأي طلب", titleEn: "Free Shipping on Any Order", code: "FREESHIP",
    price: 0, oldPrice: 25, discount: 100, color: "#3B82F6",
    providerAr: "جميع المتاجر", providerEn: "All Stores",
    descAr: "شحن مجاني على جميع الطلبات بدون حد أدنى",
    descEn: "Free shipping on all orders with no minimum",
    validUntil: "2026-04-30",
  },
  {
    id: "3", titleAr: "خصم على منتجات العناية", titleEn: "Beauty Products Discount", code: "CARE25",
    price: 64, oldPrice: 85, discount: 25, color: "#EC4899",
    providerAr: "متجر العناية", providerEn: "Beauty Store",
    descAr: "خصم 25% على منتجات العناية بالبشرة والشعر المختارة",
    descEn: "25% off selected skin and hair care products",
    validUntil: "2026-06-15",
  },
  {
    id: "4", titleAr: "باقة اللياقة الاقتصادية", titleEn: "Economy Fitness Bundle", code: "FIT40",
    price: 117, oldPrice: 195, discount: 40, color: "#F59E0B",
    providerAr: "متجر اللياقة", providerEn: "Fitness Store",
    descAr: "احصل على حبال مقاومة + حصيرة تمارين + شاكر بروتين بسعر مميز",
    descEn: "Get resistance bands + exercise mat + protein shaker at a special price",
    validUntil: "2026-05-01",
  },
];

export default function StoreScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useApp();
  const { productOrders } = useCart();
  const { t, lang } = useLanguage();

  const MENU_TABS = [
    { key: "stores", labelAr: "المتاجر",        labelEn: "Stores" },
    { key: "beauty", labelAr: "العناية والجمال", labelEn: "Beauty & Care" },
    { key: "ai",     labelAr: "مساعد AI 🤖",    labelEn: "AI Assistant 🤖" },
  ];

  const [activeTab, setActiveTab] = useState("stores");
  const [showOrders, setShowOrders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1800);
  };
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreOffer, setSelectedStoreOffer] = useState<(typeof STORE_OFFERS)[0] | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 3, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -3, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 2, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.delay(3000),
      ])
    ).start();
  }, []);

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const topPadding = isWeb ? 67 : insets.top;

  const filteredStores = STORES.filter((s) => {
    if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
    const nameToSearch = t(s.nameAr, s.nameEn).toLowerCase();
    const query = searchQuery.toLowerCase();
    if (searchQuery && !nameToSearch.includes(query) && !s.tagsAr.some(tag => tag.includes(searchQuery)) && !s.tagsEn.some(tag => tag.toLowerCase().includes(query))) return false;
    return true;
  });

  const featuredStores = filteredStores.filter(s => s.isFeatured);
  const regularStores = filteredStores.filter(s => !s.isFeatured);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ─── STICKY TOP SECTION ─── */}
      <View style={[styles.topSection, { backgroundColor: isDark ? colors.surface : "#fff", paddingTop: topPadding + 8 }]}>
        {/* Location Bar */}
        <View style={[styles.locationRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          <View style={styles.locationLeft}>
            <View style={[styles.locationBtn, { backgroundColor: "#00E0B8" + "15", flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
              <Feather name="map-pin" size={14} color="#00E0B8" />
              <Text style={[styles.locationTxt, { color: colors.text }]}>{t("الرياض، السليمانية", "Riyadh, Al-Sulaimaniyah")}</Text>
              <Feather name="chevron-down" size={14} color={colors.muted} />
            </View>
          </View>
          <View style={{ flexDirection: lang === "en" ? "row" : "row-reverse", gap: 8 }}>
            <Pressable
              style={[styles.notifBtn, { backgroundColor: isDark ? colors.card : "#F5F5F5" }]}
              onPress={() => setShowOrders(true)}
            >
              <Feather name="package" size={18} color={"#00E0B8"} />
              {productOrders.length > 0 && (
                <View style={styles.ordersBadge}>
                  <Text style={styles.ordersBadgeText}>{productOrders.length}</Text>
                </View>
              )}
            </Pressable>
            <Pressable style={[styles.notifBtn, { backgroundColor: isDark ? colors.card : "#F5F5F5" }]}>
              <Feather name="bell" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* ─── ORDERS MODAL ─── */}
        <Modal visible={showOrders} transparent animationType="slide" onRequestClose={() => setShowOrders(false)}>
          <Pressable style={styles.ordersOverlay} onPress={() => setShowOrders(false)}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.ordersSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
                <View style={styles.ordersHandle} />
                <View style={[styles.ordersHeaderRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                  <Pressable onPress={() => setShowOrders(false)}>
                    <Feather name="x" size={22} color={colors.muted} />
                  </Pressable>
                  <Text style={[styles.ordersTitle, { color: colors.text }]}>📦 {t("طلباتي", "My Orders")}</Text>
                </View>
                {productOrders.length === 0 ? (
                  <View style={styles.ordersEmpty}>
                    <Text style={{ fontSize: 48 }}>🛍️</Text>
                    <Text style={[styles.ordersEmptyTxt, { color: colors.muted }]}>{t("لا يوجد طلبات بعد", "No orders yet")}</Text>
                    <Text style={[{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center" }, { color: colors.muted }]}>
                      {t("ابدأ التسوق من أحد المتاجر وستظهر طلباتك هنا", "Start shopping and your orders will appear here")}
                    </Text>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24, gap: 12 }}>
                    {productOrders.map((order: any) => (
                      <Pressable
                        key={order.id}
                        onPress={() => { setShowOrders(false); router.push(("/order/" + order.id) as any); }}
                        style={[styles.orderCard, { backgroundColor: isDark ? colors.card : "#F8F5FF", borderColor: "#00E0B820" }]}
                      >
                        <View style={[styles.orderCardTop, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                          <View style={[styles.orderStatusBadge, { backgroundColor: order.status === "delivered" ? "#22C55E" : order.status === "cancelled" ? "#EF4444" : "#00E0B8" }]}>
                            <Text style={styles.orderStatusText}>
                              {order.status === "delivered"
                                ? t("✓ تم التوصيل", "✓ Delivered")
                                : order.status === "cancelled"
                                ? t("✕ ملغي", "✕ Cancelled")
                                : t("🕐 قيد التوصيل", "🕐 In Delivery")}
                            </Text>
                          </View>
                          <Text style={[styles.orderCardId, { color: colors.muted }]}>#{order.id.slice(-6)}</Text>
                        </View>
                        <Text style={[styles.orderCardStore, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>{order.storeName}</Text>
                        <View style={[styles.orderCardMeta, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                          <Text style={[{ fontSize: 12, fontFamily: "Tajawal_400Regular" }, { color: colors.muted }]}>{order.date}</Text>
                          <Text style={[styles.orderCardTotal, { color: "#00E0B8" }]}>{order.total} {t("ر.س", "SAR")}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.card : "#F5F5F5", borderColor: colors.border, flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t("ابحث عن متجر أو منتج...", "Search for a store or product...")}
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={lang === "en" ? "left" : "right"}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={16} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* Top Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.border, flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          {MENU_TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: "#00E0B8" }]}
              onPress={() => {
                if (tab.key === "ai") {
                  router.push("/section/ai-chat" as any);
                } else if (tab.key === "beauty") {
                  router.push("/section/beauty" as any);
                } else {
                  setActiveTab(tab.key);
                }
              }}
            >
              <Text style={[styles.tabText, { color: activeTab === tab.key ? "#00E0B8" : colors.muted }]}>
                {t(tab.labelAr, tab.labelEn)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00E0B8"
            colors={["#00E0B8", "#007A65"]}
          />
        }
      >
        {activeTab === "stores" && (
          <>
            {/* ─── CATEGORY FILTERS ─── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10, flexDirection: "row-reverse" }}
            >
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.key}
                  onPress={() => setSelectedCategory(cat.key)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: selectedCategory === cat.key ? "#00E0B8" : (isDark ? colors.card : "#F5F5F5"),
                      borderColor: selectedCategory === cat.key ? "#00E0B8" : colors.border,
                      flexDirection: lang === "en" ? "row" : "row-reverse",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                  <Text style={[styles.catChipTxt, { color: selectedCategory === cat.key ? "#fff" : colors.text }]}>
                    {t(cat.labelAr, cat.labelEn)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* ─── URGENT RED BADGE ─── */}
            {selectedCategory === "all" && searchQuery === "" && (
              <Animated.View style={[styles.urgentBanner, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={["#EF4444", "#DC2626"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.urgentGradient, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}
                >
                  <Animated.Text style={[styles.urgentEmoji, { transform: [{ translateX: shakeAnim }] }]}>🔔</Animated.Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.urgentTitle, { textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("الحقوا على العروض!", "Grab the deals!")}
                    </Text>
                    <Text style={[styles.urgentSub, { textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("عروض تنتهي خلال أيام — لا تفوتك", "Deals ending in days — don't miss out")}
                    </Text>
                  </View>
                  <View style={styles.urgentArrow}>
                    <Feather name={lang === "en" ? "arrow-right" : "arrow-left"} size={18} color="#fff" />
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* ─── FEATURED OFFERS BANNER ─── */}
            {selectedCategory === "all" && searchQuery === "" && (
              <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
                <View style={[styles.sectionHeader, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("عروض حصرية 🔥", "Exclusive Offers 🔥")}</Text>
                  <Text style={[styles.sectionMore, { color: "#00E0B8" }]}>{t("عرض الكل", "View All")}</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, flexDirection: "row-reverse" }}>
                  {STORE_OFFERS.map((offer) => (
                    <Pressable
                      key={offer.id}
                      onPress={() => { setCopiedCode(null); setSelectedStoreOffer(offer); }}
                      style={[styles.offerBannerCard, { backgroundColor: offer.color + "12", borderColor: offer.color + "30" }]}
                    >
                      <View style={[styles.offerBannerBadge, { backgroundColor: offer.color }]}>
                        <Text style={styles.offerBannerBadgeTxt}>-{offer.discount}%</Text>
                      </View>
                      <Text style={[styles.offerBannerTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]} numberOfLines={2}>
                        {t(offer.titleAr, offer.titleEn)}
                      </Text>
                      <Text style={[styles.offerBannerProv, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>
                        {t(offer.providerAr, offer.providerEn)}
                      </Text>
                      <View style={[styles.offerBannerCodeRow, { backgroundColor: offer.color + "18", flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                        <Feather name="copy" size={11} color={offer.color} />
                        <Text style={[styles.offerBannerCode, { color: offer.color }]}>{offer.code}</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ─── FEATURED STORES ─── */}
            {featuredStores.length > 0 && (
              <View style={{ marginHorizontal: 16, marginBottom: 4 }}>
                <View style={[styles.sectionHeader, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("مميزون ⭐", "Featured ⭐")}</Text>
                </View>
                {featuredStores.map((store) => (
                  <StoreCard key={store.id} store={store} colors={colors} isDark={isDark} t={t} lang={lang} />
                ))}
              </View>
            )}

            {/* ─── ALL / FILTERED STORES ─── */}
            <View style={{ marginHorizontal: 16 }}>
              {regularStores.length > 0 && (
                <View style={[styles.sectionHeader, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {selectedCategory === "all"
                      ? t("جميع المتاجر", "All Stores")
                      : t(CATEGORIES.find(c => c.key === selectedCategory)?.labelAr ?? "", CATEGORIES.find(c => c.key === selectedCategory)?.labelEn ?? "")}
                  </Text>
                  <Text style={[styles.resultCount, { color: colors.muted }]}>
                    {regularStores.length} {t("متجر", "stores")}
                  </Text>
                </View>
              )}
              {regularStores.map((store) => (
                <StoreCard key={store.id} store={store} colors={colors} isDark={isDark} t={t} lang={lang} />
              ))}
              {filteredStores.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={{ fontSize: 40 }}>🔍</Text>
                  <Text style={[styles.emptyTxt, { color: colors.muted }]}>{t("لا توجد متاجر مطابقة", "No matching stores")}</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === "beauty" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Pressable
              style={[styles.beautyBanner, { backgroundColor: "#EC4899" + "15", borderColor: "#EC4899" + "30", flexDirection: lang === "en" ? "row" : "row-reverse" }]}
              onPress={() => router.push("/section/beauty" as any)}
            >
              <Text style={{ fontSize: 48 }}>💆‍♀️</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.beautyBannerTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
                  {t("العناية والجمال ✨", "Beauty & Care ✨")}
                </Text>
                <Text style={[styles.beautyBannerSub, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>
                  {t("مراكز تجميل • خبراء • حجز منزلي", "Beauty Centers • Experts • Home Booking")}
                </Text>
              </View>
              <View style={[styles.beautyBannerBtn, { backgroundColor: "#EC4899", flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                <Text style={styles.beautyBannerBtnTxt}>{t("استكشفي", "Explore")}</Text>
                <Feather name={lang === "en" ? "arrow-right" : "arrow-left"} size={14} color="#fff" />
              </View>
            </Pressable>
          </View>
        )}

        {activeTab === "ai" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <Pressable
              style={[styles.aiNavCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: "#00C4A0", flexDirection: lang === "en" ? "row" : "row-reverse" }]}
              onPress={() => router.push("/section/ai-chat" as any)}
            >
              <View style={[styles.aiNavIcon, { backgroundColor: "#00C4A020" }]}>
                <Text style={{ fontSize: 36 }}>🤖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.aiNavTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
                  {t("مساعد أكسير الذكي", "Akseer Smart Assistant")}
                </Text>
                <Text style={[styles.aiNavSub, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>
                  {t("اسألني عن الصحة والجمال والعناية والمتاجر والمواعيد!", "Ask me about health, beauty, care, stores, and appointments!")}
                </Text>
              </View>
              <Feather name={lang === "en" ? "chevron-right" : "chevron-left"} size={22} color="#00C4A0" />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ─── OFFER DETAIL MODAL ─── */}
      <Modal visible={!!selectedStoreOffer} transparent animationType="slide" onRequestClose={() => setSelectedStoreOffer(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedStoreOffer(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
              {selectedStoreOffer && (
                <>
                  <View style={styles.modalHandle} />
                  <View style={{ flexDirection: lang === "en" ? "row" : "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={[styles.modalBadge, { backgroundColor: selectedStoreOffer.color }]}>
                      <Text style={styles.modalBadgeTxt}>{t("خصم", "Discount")} {selectedStoreOffer.discount}%</Text>
                    </View>
                    <Text style={[styles.modalProv, { color: colors.muted }]}>{t(selectedStoreOffer.providerAr, selectedStoreOffer.providerEn)}</Text>
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
                    {t(selectedStoreOffer.titleAr, selectedStoreOffer.titleEn)}
                  </Text>
                  <Text style={[styles.modalDesc, { color: colors.textSecondary, textAlign: lang === "en" ? "left" : "right" }]}>
                    {t(selectedStoreOffer.descAr, selectedStoreOffer.descEn)}
                  </Text>

                  <View style={[styles.modalPriceRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                    <Text style={[styles.modalPrice, { color: selectedStoreOffer.color }]}>
                      {selectedStoreOffer.price === 0 ? t("مجاناً 🎁", "Free 🎁") : `${selectedStoreOffer.price} ${t("ر.س", "SAR")}`}
                    </Text>
                    <Text style={[styles.modalOldPrice, { color: colors.muted }]}>{selectedStoreOffer.oldPrice} {t("ر.س", "SAR")}</Text>
                    <Text style={[styles.modalValid, { color: colors.muted }]}>• {t("صالح حتى", "Valid until")} {selectedStoreOffer.validUntil}</Text>
                  </View>

                  <View style={[styles.codeBox, { backgroundColor: selectedStoreOffer.color + "10", borderColor: selectedStoreOffer.color + "40", flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                    <View>
                      <Text style={[styles.codeLabel, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>{t("كود الخصم", "Discount Code")}</Text>
                      <Text style={[styles.codeVal, { color: selectedStoreOffer.color, textAlign: lang === "en" ? "left" : "right" }]}>{selectedStoreOffer.code}</Text>
                    </View>
                    <Pressable
                      style={[styles.copyBtn, { backgroundColor: copiedCode === selectedStoreOffer.code ? "#22C55E" : selectedStoreOffer.color, flexDirection: lang === "en" ? "row" : "row-reverse" }]}
                      onPress={() => copyCode(selectedStoreOffer.code)}
                    >
                      <Feather name={copiedCode === selectedStoreOffer.code ? "check" : "copy"} size={15} color="#fff" />
                      <Text style={styles.copyBtnTxt}>{copiedCode === selectedStoreOffer.code ? t("تم النسخ!", "Copied!") : t("انسخ الكود", "Copy Code")}</Text>
                    </Pressable>
                  </View>

                  <View style={[styles.instrBox, { backgroundColor: isDark ? colors.card : "#F8F8F8", borderColor: colors.border }]}>
                    <Text style={[styles.instrTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
                      📋 {t("كيفية استخدام الكود", "How to use the code")}
                    </Text>
                    <Text style={[styles.instrTxt, { color: colors.textSecondary, textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("١. انسخ الكود بالضغط على «انسخ الكود» أعلاه", "1. Copy the code by pressing \"Copy Code\" above")}
                    </Text>
                    <Text style={[styles.instrTxt, { color: colors.textSecondary, textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("٢. اختر المنتج المطلوب واضفه إلى السلة", "2. Select the desired product and add it to cart")}
                    </Text>
                    <Text style={[styles.instrTxt, { color: colors.textSecondary, textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("٣. في خطوة الدفع، الصق الكود في خانة «كود الخصم»", "3. At checkout, paste the code in the discount code field")}
                    </Text>
                    <Text style={[styles.instrTxt, { color: colors.textSecondary, textAlign: lang === "en" ? "left" : "right" }]}>
                      {t("٤. سيُطبَّق الخصم تلقائياً على إجمالي الفاتورة", "4. The discount will be applied automatically to the total")}
                    </Text>
                  </View>

                  <Pressable
                    style={[styles.closeBtn, { backgroundColor: isDark ? colors.card : "#F3F4F6", borderColor: colors.border }]}
                    onPress={() => setSelectedStoreOffer(null)}
                  >
                    <Text style={[styles.closeBtnTxt, { color: colors.muted }]}>{t("إغلاق", "Close")}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function StoreCard({ store, colors, isDark, t, lang }: { store: (typeof STORES)[0]; colors: any; isDark: boolean; t: (ar: string, en: string) => string; lang: string }) {
  return (
    <Pressable
      style={[styles.storeCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
      onPress={() => router.push(`/store/${store.id}` as any)}
    >
      {/* Logo / Image Area */}
      <View style={styles.storeLogoBox}>
        <Image
          source={STORE_IMAGES[store.category] || STORE_IMAGES.default}
          style={styles.storeLogoImg}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[store.bgColor + "CC", store.bgColor + "55"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.storeEmoji, { position: "absolute" }]}>{store.emoji}</Text>
        {!store.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedTxt}>{t("مغلق", "Closed")}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.storeInfo}>
        <View style={[styles.storeNameRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          <Text style={[styles.storeName, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]} numberOfLines={1}>
            {t(store.nameAr, store.nameEn)}
          </Text>
          {(store.badgeAr || store.badgeEn) && (
            <View style={[styles.storeBadge, { backgroundColor: store.bgColor }]}>
              <Text style={styles.storeBadgeTxt}>{t(store.badgeAr ?? "", store.badgeEn ?? "")}</Text>
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={[styles.storeTagsRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          {(lang === "en" ? store.tagsEn : store.tagsAr).slice(0, 2).map((tag, i) => (
            <View key={i} style={[styles.storeTag, { backgroundColor: store.bgColor + "12", borderColor: store.bgColor + "25" }]}>
              <Text style={[styles.storeTagTxt, { color: store.bgColor }]}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Meta row */}
        <View style={[styles.storeMeta, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          <View style={[styles.storeMetaItem, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
            <Text style={{ fontSize: 11 }}>⭐</Text>
            <Text style={[styles.storeMetaTxt, { color: "#F59E0B" }]}>{store.rating}</Text>
            <Text style={[styles.storeMetaSub, { color: colors.muted }]}>({store.reviewCount})</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.storeMetaItem, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
            <Feather name="clock" size={11} color={colors.muted} />
            <Text style={[styles.storeMetaTxt, { color: colors.muted }]}>{store.deliveryTime} {t("دقيقة", "min")}</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.storeMetaItem, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
            <Feather name="package" size={11} color={colors.muted} />
            <Text style={[styles.storeMetaTxt, { color: store.deliveryFee === 0 ? "#22C55E" : colors.muted }]}>
              {store.deliveryFee === 0 ? t("شحن مجاني", "Free shipping") : `${store.deliveryFee} ${t("ر.س", "SAR")}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow */}
      <Feather name={lang === "en" ? "chevron-right" : "chevron-left"} size={20} color={colors.muted} style={{ alignSelf: "center" }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 3 },
  locationRow: { justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  locationLeft: { flex: 1 },
  locationBtn: { alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignSelf: "flex-start" },
  locationTxt: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  notifBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  searchBar: { alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  tabRow: { borderBottomWidth: 1, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  catChip: { alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, borderWidth: 1 },
  catChipTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  sectionHeader: { justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  sectionMore: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  resultCount: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  offerBannerCard: { width: 170, borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  offerBannerBadge: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  offerBannerBadgeTxt: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  offerBannerTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  offerBannerProv: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  offerBannerCodeRow: { alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, alignSelf: "flex-end" },
  offerBannerCode: { fontSize: 11, fontFamily: "Cairo_700Bold", letterSpacing: 1 },
  storeCard: { flexDirection: "row-reverse", alignItems: "stretch", borderRadius: 18, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  storeLogoBox: { width: 100, alignSelf: "stretch", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  storeLogoImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  urgentBanner: { marginHorizontal: 16, marginBottom: 14, borderRadius: 16, overflow: "hidden" },
  urgentGradient: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  urgentEmoji: { fontSize: 28 },
  urgentTitle: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 16 },
  urgentSub: { color: "#FFE4E4", fontFamily: "Tajawal_400Regular", fontSize: 12 },
  urgentArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  storeEmoji: { fontSize: 36 },
  closedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  closedTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  storeInfo: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 6 },
  storeNameRow: { alignItems: "center", gap: 8, flexWrap: "wrap" },
  storeName: { fontSize: 15, fontFamily: "Tajawal_700Bold", flex: 1 },
  storeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  storeBadgeTxt: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },
  storeTagsRow: { flexWrap: "wrap", gap: 6 },
  storeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  storeTagTxt: { fontSize: 10, fontFamily: "Tajawal_500Medium" },
  storeMeta: { alignItems: "center", gap: 8, flexWrap: "wrap" },
  storeMetaItem: { alignItems: "center", gap: 3 },
  storeMetaTxt: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  storeMetaSub: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  metaDivider: { width: 1, height: 12 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: "Tajawal_400Regular" },
  beautyBanner: { alignItems: "center", gap: 16, borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 16 },
  beautyBannerTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  beautyBannerSub: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  beautyBannerBtn: { alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  beautyBannerBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  aiNavCard: { alignItems: "center", gap: 14, borderRadius: 20, borderWidth: 2, padding: 20 },
  aiNavIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  aiNavTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", marginBottom: 6 },
  aiNavSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 4 },
  modalBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  modalBadgeTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  modalProv: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  modalDesc: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20 },
  modalPriceRow: { alignItems: "center", gap: 10, flexWrap: "wrap" },
  modalPrice: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  modalOldPrice: { fontSize: 14, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  modalValid: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  codeBox: { justifyContent: "space-between", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 14 },
  codeLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  codeVal: { fontSize: 20, fontFamily: "Cairo_700Bold", letterSpacing: 2 },
  copyBtn: { alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  copyBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  instrBox: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  instrTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 2 },
  instrTxt: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 20 },
  closeBtn: { borderRadius: 14, borderWidth: 1, paddingVertical: 14, alignItems: "center" },
  closeBtnTxt: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  ordersBadge: { position: "absolute", top: -3, left: -3, backgroundColor: "#EF4444", borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  ordersBadgeText: { color: "#fff", fontSize: 9, fontFamily: "Cairo_700Bold" },
  ordersOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  ordersSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 8, maxHeight: "80%" as any },
  ordersHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", alignSelf: "center", marginBottom: 16 },
  ordersHeaderRow: { alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  ordersTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  ordersEmpty: { alignItems: "center", gap: 10, paddingVertical: 40 },
  ordersEmptyTxt: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  orderCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 6 },
  orderCardTop: { alignItems: "center", justifyContent: "space-between" },
  orderStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  orderStatusText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  orderCardId: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  orderCardStore: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  orderCardMeta: { justifyContent: "space-between", alignItems: "center" },
  orderCardTotal: { fontSize: 15, fontFamily: "Cairo_700Bold" },
});
