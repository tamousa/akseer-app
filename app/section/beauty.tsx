import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  I18nManager,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

const BEAUTY_CENTERS = [
  {
    id: "1", name: "مركز لمسة للتجميل", emoji: "💆‍♀️", type: "مركز تجميل نسائي",
    rating: 4.9, reviews: 412, address: "حي العليا، الرياض", phone: "0501234567",
    services: ["عناية بشرة", "مكياج", "رموش", "حجامة جمالية"],
    servicesDetail: [
      { id: "s1", name: "تنظيف بشرة عميق", emoji: "✨", duration: "45 دقيقة", price: 150 },
      { id: "s2", name: "مكياج كامل", emoji: "💄", duration: "60 دقيقة", price: 200 },
      { id: "s3", name: "رسم رموش", emoji: "👁️", duration: "30 دقيقة", price: 80 },
      { id: "s4", name: "حجامة جمالية للوجه", emoji: "🌿", duration: "30 دقيقة", price: 120 },
    ],
    specialist: "أخصائية مركز لمسة",
    bookingOptions: ["inStore", "home", "video"],
    open: true, priceRange: "من 80 ر.س", color: "#EC4899",
    gender: "نسائي", category: "بشرة",
  },
  {
    id: "2", name: "صالون نضرة", emoji: "💇‍♀️", type: "صالون شعر نسائي",
    rating: 4.8, reviews: 287, address: "حي السليمانية، الرياض", phone: "0502345678",
    services: ["قص شعر", "صبغ", "كيراتين", "تصفيف عرائس"],
    servicesDetail: [
      { id: "s1", name: "قص شعر عصري", emoji: "✂️", duration: "30 دقيقة", price: 60 },
      { id: "s2", name: "صبغ شعر كامل", emoji: "🎨", duration: "90 دقيقة", price: 250 },
      { id: "s3", name: "كيراتين برازيلي", emoji: "💫", duration: "120 دقيقة", price: 400 },
      { id: "s4", name: "تصفيف عرائس", emoji: "👰", duration: "90 دقيقة", price: 600 },
    ],
    specialist: "أخصائية صالون نضرة",
    bookingOptions: ["inStore", "home"],
    open: true, priceRange: "من 60 ر.س", color: "#A86DBF",
    gender: "نسائي", category: "شعر",
  },
  {
    id: "3", name: "سبا الهدوء", emoji: "🧖‍♀️", type: "سبا وعناية جسم",
    rating: 4.7, reviews: 198, address: "حي الملقا، الرياض", phone: "0503456789",
    services: ["تدليك", "ساونا", "إزالة شعر", "عناية جسم"],
    servicesDetail: [
      { id: "s1", name: "تدليك استرخاء كامل", emoji: "🤲", duration: "60 دقيقة", price: 250 },
      { id: "s2", name: "جلسة ساونا + بخار", emoji: "♨️", duration: "45 دقيقة", price: 150 },
      { id: "s3", name: "إزالة شعر بالشمع", emoji: "🌸", duration: "30 دقيقة", price: 80 },
      { id: "s4", name: "تقشير جسم كامل", emoji: "✨", duration: "60 دقيقة", price: 200 },
    ],
    specialist: "أخصائية سبا الهدوء",
    bookingOptions: ["inStore", "home", "phone"],
    open: true, priceRange: "من 150 ر.س", color: "#7C3AED",
    gender: "نسائي", category: "مساج",
  },
  {
    id: "4", name: "مركز الحجامة والعناية", emoji: "🌿", type: "حجامة وعلاج طبيعي",
    rating: 4.8, reviews: 156, address: "حي الروضة، الرياض", phone: "0504567890",
    services: ["حجامة جافة", "حجامة رطبة", "تدليك علاجي", "علاج بالأعشاب"],
    servicesDetail: [
      { id: "s1", name: "حجامة جافة", emoji: "🌿", duration: "30 دقيقة", price: 120 },
      { id: "s2", name: "حجامة رطبة علاجية", emoji: "💧", duration: "45 دقيقة", price: 180 },
      { id: "s3", name: "تدليك علاجي بالزيوت", emoji: "🫶", duration: "60 دقيقة", price: 200 },
      { id: "s4", name: "علاج بالأعشاب الطبيعية", emoji: "🌱", duration: "45 دقيقة", price: 150 },
    ],
    specialist: "معالج مركز الحجامة",
    bookingOptions: ["inStore", "home", "phone"],
    open: true, priceRange: "من 120 ر.س", color: "#10B981",
    gender: "مختلط", category: "حجامة",
  },
  {
    id: "5", name: "باربر شوب الأناقة", emoji: "💈", type: "صالون رجالي",
    rating: 4.6, reviews: 345, address: "حي النزهة، الرياض", phone: "0505678901",
    services: ["حلاقة", "عناية لحية", "تدليك رأس", "عناية بشرة رجالي"],
    servicesDetail: [
      { id: "s1", name: "حلاقة شعر", emoji: "✂️", duration: "30 دقيقة", price: 50 },
      { id: "s2", name: "تشكيل لحية", emoji: "🧔", duration: "20 دقيقة", price: 40 },
      { id: "s3", name: "تدليك فروة رأس", emoji: "💆", duration: "20 دقيقة", price: 60 },
      { id: "s4", name: "عناية بشرة رجالي", emoji: "✨", duration: "30 دقيقة", price: 80 },
    ],
    specialist: "حلاق باربر شوب الأناقة",
    bookingOptions: ["inStore"],
    open: true, priceRange: "من 50 ر.س", color: "#3B82F6",
    gender: "رجالي", category: "شعر",
  },
];

const BEAUTY_EXPERTS = [
  {
    id: "1", name: "أ. ريم الشمري", specialty: "خبيرة عناية بالبشرة", emoji: "👩",
    rating: 4.9, reviews: 312, experience: "8 سنوات", price: 200,
    bookingOptions: ["inStore", "home", "video"],
    services: ["علاج حب الشباب", "تفتيح البشرة", "عناية بالبشرة الحساسة"],
    servicesDetail: [
      { id: "s1", name: "علاج حب الشباب", emoji: "✨", duration: "45 دقيقة", price: 200 },
      { id: "s2", name: "تفتيح البشرة بالليزر", emoji: "💡", duration: "60 دقيقة", price: 350 },
      { id: "s3", name: "جلسة عناية للبشرة الحساسة", emoji: "🌸", duration: "45 دقيقة", price: 180 },
    ],
    specialist: "أ. ريم الشمري",
    available: true, color: "#EC4899", gender: "نسائي", category: "بشرة",
  },
  {
    id: "2", name: "أ. نورة القحطاني", specialty: "خبيرة شعر وحناء", emoji: "👩‍🦰",
    rating: 4.8, reviews: 241, experience: "6 سنوات", price: 150,
    bookingOptions: ["inStore", "home"],
    services: ["علاج الشعر التالف", "حناء طبيعية", "صيانة الشعر"],
    servicesDetail: [
      { id: "s1", name: "علاج الشعر التالف", emoji: "💆", duration: "60 دقيقة", price: 150 },
      { id: "s2", name: "حناء طبيعية يدوية", emoji: "🌿", duration: "90 دقيقة", price: 200 },
      { id: "s3", name: "صيانة شعر شاملة", emoji: "✨", duration: "45 دقيقة", price: 120 },
    ],
    specialist: "أ. نورة القحطاني",
    available: true, color: "#F59E0B", gender: "نسائي", category: "شعر",
  },
  {
    id: "3", name: "د. سمر الدوسري", specialty: "طبيبة تجميل وليزر", emoji: "👩‍⚕️",
    rating: 4.9, reviews: 189, experience: "12 سنة", price: 350,
    bookingOptions: ["inStore", "video", "phone"],
    services: ["ليزر إزالة شعر", "تفتيح بقع", "علاج الجلد"],
    servicesDetail: [
      { id: "s1", name: "ليزر إزالة شعر (وجه)", emoji: "⚡", duration: "30 دقيقة", price: 350 },
      { id: "s2", name: "تفتيح بقع داكنة", emoji: "💡", duration: "45 دقيقة", price: 500 },
      { id: "s3", name: "علاج الجلد والمسام", emoji: "✨", duration: "60 دقيقة", price: 450 },
    ],
    specialist: "د. سمر الدوسري",
    available: true, color: "#7C3AED", gender: "نسائي", category: "بشرة",
  },
  {
    id: "4", name: "أ. هيفاء المطيري", specialty: "خبيرة ميك أب ومكياج", emoji: "💄",
    rating: 4.7, reviews: 278, experience: "5 سنوات", price: 180,
    bookingOptions: ["inStore", "home", "video"],
    services: ["مكياج عرائس", "دروس تعليمية", "مكياج سهرات"],
    servicesDetail: [
      { id: "s1", name: "مكياج عرائس كامل", emoji: "👰", duration: "90 دقيقة", price: 800 },
      { id: "s2", name: "درس تعليمي مكياج", emoji: "📚", duration: "60 دقيقة", price: 200 },
      { id: "s3", name: "مكياج سهرات راقية", emoji: "💃", duration: "60 دقيقة", price: 180 },
    ],
    specialist: "أ. هيفاء المطيري",
    available: false, color: "#F43F5E", gender: "نسائي", category: "مكياج",
  },
  {
    id: "5", name: "أ. خالد العمري", specialty: "خبير حجامة وعلاج طبيعي", emoji: "👨",
    rating: 4.8, reviews: 167, experience: "10 سنوات", price: 250,
    bookingOptions: ["inStore", "home", "phone"],
    services: ["حجامة علاجية", "تدليك علاجي", "استشارات تغذية للبشرة"],
    servicesDetail: [
      { id: "s1", name: "حجامة علاجية متخصصة", emoji: "🌿", duration: "45 دقيقة", price: 250 },
      { id: "s2", name: "تدليك علاجي بالأعشاب", emoji: "🫶", duration: "60 دقيقة", price: 300 },
      { id: "s3", name: "استشارة تغذية للبشرة", emoji: "🥗", duration: "30 دقيقة", price: 150 },
    ],
    specialist: "أ. خالد العمري",
    available: true, color: "#10B981", gender: "رجالي", category: "حجامة",
  },
];

const BEAUTY_OFFERS = [
  {
    id: "1", centerName: "مركز لمسة للتجميل", emoji: "💆‍♀️",
    title: "باقة العناية الشاملة", description: "تشمل تنظيف بشرة + مساج وجه + ماسك مغذي",
    originalPrice: 350, discountPrice: 199, discountPercent: 43,
    validUntil: "2026-05-15", code: "LAMSA43", color: "#EC4899",
  },
  {
    id: "2", centerName: "سبا الهدوء", emoji: "🧖‍♀️",
    title: "جلسة استرخاء كاملة", description: "تدليك كامل + ساونا + قناع جسم",
    originalPrice: 450, discountPrice: 249, discountPercent: 45,
    validUntil: "2026-04-30", code: "SPA45", color: "#7C3AED",
  },
  {
    id: "3", centerName: "صالون نضرة", emoji: "💇‍♀️",
    title: "قص + صبغ + معالجة", description: "باقة شعر كاملة مع كيراتين مجاني",
    originalPrice: 500, discountPrice: 279, discountPercent: 44,
    validUntil: "2026-05-20", code: "NADURA44", color: "#A86DBF",
  },
  {
    id: "4", centerName: "مركز الحجامة والعناية", emoji: "🌿",
    title: "جلسة حجامة + تدليك", description: "حجامة علاجية مع تدليك كامل بالزيوت",
    originalPrice: 280, discountPrice: 159, discountPercent: 43,
    validUntil: "2026-06-01", code: "HIJAMA43", color: "#10B981",
  },
];

const BLOG_POSTS = [
  { title: "5 أسرار للبشرة المشرقة في المناخ السعودي", emoji: "🌟", tag: "بشرة", readTime: "3 دقائق" },
  { title: "كيف تختارين صالون التجميل المناسب لك؟", emoji: "💅", tag: "نصائح", readTime: "5 دقائق" },
  { title: "الحجامة وفوائدها للبشرة والجسم", emoji: "🌿", tag: "حجامة", readTime: "4 دقائق" },
  { title: "روتين العناية بالشعر الجاف في الشتاء", emoji: "💆", tag: "شعر", readTime: "3 دقائق" },
];

const BEAUTY_TIPS = [
  "مسحي وجهك بالتوجيه لأعلى فقط لتفادي ترهل البشرة",
  "ضعي واقي الشمس يومياً حتى في الأيام الغائمة ☀️",
  "دلكي فروة رأسك بالزيوت الطبيعية مرة أسبوعياً",
  "الكولاجين يحتاج فيتامين C لبناء نفسه، احرصي على تناوله",
  "النوم الكافي 7-8 ساعات يجدد خلايا البشرة",
];

const BOOKING_TYPES = [
  { id: "inStore", label: "في المركز", emoji: "🏠", color: "#EC4899" },
  { id: "home", label: "في المنزل", emoji: "🏡", color: "#22C55E" },
  { id: "phone", label: "استشارة هاتفية", emoji: "📞", color: "#3B82F6" },
  { id: "video", label: "استشارة فيديو", emoji: "📹", color: "#F59E0B" },
];

export default function BeautySectionScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<"centers" | "experts" | "offers">("centers");
  const [selectedCenter, setSelectedCenter] = useState<(typeof BEAUTY_CENTERS)[0] | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<(typeof BEAUTY_OFFERS)[0] | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Multi-step booking
  type BookingProvider = (typeof BEAUTY_CENTERS)[0] & { servicesDetail: { id: string; name: string; emoji: string; duration: string; price: number }[] };
  const [bookingProvider, setBookingProvider] = useState<BookingProvider | null>(null);
  const [bookingStep, setBookingStep] = useState<"services" | "datetime" | "summary" | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingPayment, setBookingPayment] = useState<"cash" | "card" | "online">("cash");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingMode, setBookingMode] = useState<"store" | "home" | "remote" | null>(null);

  const openBooking = (provider: any) => {
    setBookingProvider(provider);
    setSelectedServiceIds([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingPayment("cash");
    setBookingConfirmed(false);
    setBookingMode(null);
    setBookingStep("services");
  };

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Booking date helpers
  const bookingDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const days = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    return { key: d.toISOString().slice(0, 10), day: days[d.getDay()], date: d.getDate() };
  });
  const morningSlots = ["09:00 ص", "09:30 ص", "10:00 ص", "10:30 ص", "11:00 ص", "11:30 ص"];
  const afternoonSlots = ["12:00 م", "12:30 م", "01:00 م", "01:30 م", "02:00 م", "02:30 م", "03:00 م", "03:30 م"];
  const eveningSlots = ["04:00 م", "04:30 م", "05:00 م", "05:30 م", "06:00 م", "06:30 م", "07:00 م"];

  const bookingTotal = bookingProvider
    ? (bookingProvider.servicesDetail || [])
        .filter((s) => selectedServiceIds.includes(s.id))
        .reduce((sum, s) => sum + s.price, 0)
    : 0;

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterRating, setFilterRating] = useState<"all" | "4.5" | "4.8">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterBooking, setFilterBooking] = useState("all");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const activeFilterCount = [
    filterRating !== "all",
    filterCategory !== "all",
    filterGender !== "all",
    filterBooking !== "all",
    filterAvailable,
  ].filter(Boolean).length;

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setFilterRating("all");
    setFilterCategory("all");
    setFilterGender("all");
    setFilterBooking("all");
    setFilterAvailable(false);
  };

  const filteredCenters = BEAUTY_CENTERS.filter((c) => {
    if (filterRating === "4.5" && c.rating < 4.5) return false;
    if (filterRating === "4.8" && c.rating < 4.8) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterGender !== "all" && c.gender !== filterGender) return false;
    if (filterBooking !== "all" && !c.bookingOptions.includes(filterBooking)) return false;
    if (filterAvailable && !c.open) return false;
    return true;
  });

  const filteredExperts = BEAUTY_EXPERTS.filter((e) => {
    if (filterRating === "4.5" && e.rating < 4.5) return false;
    if (filterRating === "4.8" && e.rating < 4.8) return false;
    if (filterCategory !== "all" && e.category !== filterCategory) return false;
    if (filterGender !== "all" && e.gender !== filterGender) return false;
    if (filterBooking !== "all" && !e.bookingOptions.includes(filterBooking)) return false;
    if (filterAvailable && !e.available) return false;
    return true;
  });

  const bannerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bannerAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(bannerAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bannerBg = bannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(236,72,153,0.85)", "rgba(168,109,191,0.92)"],
  });

  const TABS = [
    { key: "centers" as const, label: "المراكز والصالونات", icon: "home" as const },
    { key: "experts" as const, label: "خبراء الجمال والعناية", icon: "users" as const },
    { key: "offers" as const, label: "العروض", icon: "tag" as const },
  ];

  const getBookingLabel = (opt: string) => BOOKING_TYPES.find(b => b.id === opt)?.label || opt;
  const getBookingEmoji = (opt: string) => BOOKING_TYPES.find(b => b.id === opt)?.emoji || "";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>العناية والجمال ✨</Text>
        <Pressable
          style={[styles.backBtn, { position: "relative" }]}
          onPress={() => router.push("/section/my-bookings" as any)}
        >
          <Feather name="calendar" size={22} color="#EC4899" />
          <View style={styles.bookingsIconBadge}>
            <Text style={styles.bookingsIconBadgeTxt}>2</Text>
          </View>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: "#EC4899" }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Feather name={tab.icon} size={14} color={activeTab === tab.key ? "#EC4899" : colors.muted} />
            <Text style={[styles.tabText, { color: activeTab === tab.key ? "#EC4899" : colors.muted }]} numberOfLines={1}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Filter Toggle Bar */}
      {(activeTab === "centers" || activeTab === "experts") && (
        <View style={[styles.filterToggleBar, { backgroundColor: isDark ? colors.surface : "#FAFAFA", borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setShowFilters(!showFilters)} style={[styles.filterToggleBtn, { backgroundColor: activeFilterCount > 0 ? "#EC489918" : (isDark ? colors.card : "#fff"), borderColor: activeFilterCount > 0 ? "#EC4899" : colors.border }]}>
            <Feather name="sliders" size={15} color={activeFilterCount > 0 ? "#EC4899" : colors.text} />
            <Text style={[styles.filterToggleTxt, { color: activeFilterCount > 0 ? "#EC4899" : colors.text }]}>
              تصفية{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Text>
            <Feather name={showFilters ? "chevron-up" : "chevron-down"} size={13} color={activeFilterCount > 0 ? "#EC4899" : colors.muted} />
          </Pressable>
          {activeFilterCount > 0 && (
            <Pressable onPress={resetFilters} style={styles.resetBtn}>
              <Feather name="x" size={13} color="#EC4899" />
              <Text style={styles.resetTxt}>إعادة تعيين</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Filter Panel */}
      {showFilters && (activeTab === "centers" || activeTab === "experts") && (
        <View style={[styles.filterPanel, { backgroundColor: isDark ? colors.card : "#FFF5FB", borderBottomColor: colors.border }]}>
          {/* Rating */}
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.muted }]}>التقييم</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
              {[{ v: "all", l: "الكل" }, { v: "4.5", l: "⭐ 4.5+" }, { v: "4.8", l: "⭐ 4.8+" }].map((o) => (
                <Pressable key={o.v} onPress={() => setFilterRating(o.v as any)}
                  style={[styles.filterChip, { backgroundColor: filterRating === o.v ? "#EC4899" : (isDark ? colors.surface : "#fff"), borderColor: filterRating === o.v ? "#EC4899" : colors.border }]}>
                  <Text style={[styles.filterChipTxt, { color: filterRating === o.v ? "#fff" : colors.text }]}>{o.l}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Category */}
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.muted }]}>التخصص</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
              {["all", "شعر", "بشرة", "مكياج", "مساج", "حجامة"].map((c) => (
                <Pressable key={c} onPress={() => setFilterCategory(c)}
                  style={[styles.filterChip, { backgroundColor: filterCategory === c ? "#A86DBF" : (isDark ? colors.surface : "#fff"), borderColor: filterCategory === c ? "#A86DBF" : colors.border }]}>
                  <Text style={[styles.filterChipTxt, { color: filterCategory === c ? "#fff" : colors.text }]}>{c === "all" ? "الكل" : c}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Gender */}
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.muted }]}>الجنس</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
              {["all", "نسائي", "رجالي", "مختلط"].map((g) => (
                <Pressable key={g} onPress={() => setFilterGender(g)}
                  style={[styles.filterChip, { backgroundColor: filterGender === g ? "#7C3AED" : (isDark ? colors.surface : "#fff"), borderColor: filterGender === g ? "#7C3AED" : colors.border }]}>
                  <Text style={[styles.filterChipTxt, { color: filterGender === g ? "#fff" : colors.text }]}>{g === "all" ? "الكل" : g}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Booking Type */}
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.muted }]}>نوع الحجز</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
              {[{ v: "all", l: "الكل" }, { v: "home", l: "🏡 منزلي" }, { v: "inStore", l: "🏠 بالمحل" }, { v: "video", l: "📹 فيديو" }, { v: "phone", l: "📞 هاتف" }].map((b) => (
                <Pressable key={b.v} onPress={() => setFilterBooking(b.v)}
                  style={[styles.filterChip, { backgroundColor: filterBooking === b.v ? "#3B82F6" : (isDark ? colors.surface : "#fff"), borderColor: filterBooking === b.v ? "#3B82F6" : colors.border }]}>
                  <Text style={[styles.filterChipTxt, { color: filterBooking === b.v ? "#fff" : colors.text }]}>{b.l}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Availability */}
          <Pressable style={styles.filterRow} onPress={() => setFilterAvailable(!filterAvailable)}>
            <Text style={[styles.filterLabel, { color: colors.muted }]}>متاح الآن فقط</Text>
            <View style={[styles.toggleTrack, { backgroundColor: filterAvailable ? "#EC4899" : (isDark ? colors.surface : "#E5E7EB") }]}>
              <View style={[styles.toggleThumb, { transform: [{ translateX: filterAvailable ? (I18nManager.isRTL ? -20 : 20) : 0 }] }]} />
            </View>
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Store Banner */}
        <Pressable onPress={() => router.push("/(tabs)/store" as any)}>
          <Animated.View style={[styles.storeBanner, { backgroundColor: bannerBg }]}>
            <Image source={require("@/assets/images/beauty-banner.png")} style={styles.storeBannerImg} resizeMode="cover" />
            <LinearGradient
              colors={["rgba(236,72,153,0.7)", "rgba(168,109,191,0.9)"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.storeBannerContent}>
              <Animated.View style={[styles.storeBannerBadge, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTxt}>عروض حصرية</Text>
              </Animated.View>
              <Text style={styles.storeBannerTitle}>🛍️ تسوقي منتجات العناية والجمال</Text>
              <Text style={styles.storeBannerSub}>أفضل المنتجات بأسعار مميزة</Text>
              <View style={styles.storeBannerBtn}>
                <Text style={styles.storeBannerBtnTxt}>تصفحي المتاجر ←</Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>

        {/* ─── CENTERS TAB ─── */}
        {activeTab === "centers" && (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              مراكز وصالونات التجميل{filteredCenters.length < BEAUTY_CENTERS.length ? ` (${filteredCenters.length} نتيجة)` : ""}
            </Text>
            {filteredCenters.length === 0 && (
              <View style={styles.emptyFilter}>
                <Text style={{ fontSize: 36 }}>🔍</Text>
                <Text style={[styles.emptyFilterTxt, { color: colors.muted }]}>لا توجد نتائج تطابق الفلتر المحدد</Text>
                <Pressable onPress={resetFilters}><Text style={{ color: "#EC4899", fontFamily: "Tajawal_700Bold", fontSize: 14 }}>إعادة تعيين الفلتر</Text></Pressable>
              </View>
            )}
            {filteredCenters.map((center) => (
              <View key={center.id} style={[styles.centerCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <Pressable onPress={() => setSelectedCenter(center)} style={styles.centerTop}>
                  <View style={[styles.centerAvatar, { backgroundColor: center.color + "18" }]}>
                    <Text style={{ fontSize: 30 }}>{center.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.centerNameRow}>
                      <Text style={[styles.centerName, { color: colors.text }]}>{center.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Pressable onPress={() => toggleFav(`c-${center.id}`)} hitSlop={8}>
                          <Feather name="heart" size={16} color={favorites.has(`c-${center.id}`) ? "#EC4899" : colors.muted} fill={favorites.has(`c-${center.id}`) ? "#EC4899" : "none"} />
                        </Pressable>
                        <View style={[styles.openBadge, { backgroundColor: center.open ? "#22C55E18" : "#EF444418" }]}>
                          <View style={[styles.statusDot, { backgroundColor: center.open ? "#22C55E" : "#EF4444" }]} />
                          <Text style={[styles.openTxt, { color: center.open ? "#22C55E" : "#EF4444" }]}>
                            {center.open ? "مفتوح" : "مغلق"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.typePill, { backgroundColor: center.color + "15" }]}>
                      <Text style={[styles.typeText, { color: center.color }]}>{center.type}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={{ fontSize: 11 }}>⭐</Text>
                      <Text style={[styles.ratingTxt, { color: "#F59E0B" }]}>{center.rating}</Text>
                      <Text style={[styles.reviewsTxt, { color: colors.muted }]}>({center.reviews})</Text>
                      <Feather name="map-pin" size={11} color={colors.muted} />
                      <Text style={[styles.addressTxt, { color: colors.muted }]} numberOfLines={1}>{center.address}</Text>
                    </View>
                  </View>
                </Pressable>

                <View style={styles.servicesRow}>
                  {center.services.map((s, i) => (
                    <View key={i} style={[styles.serviceChip, { backgroundColor: center.color + "12" }]}>
                      <Text style={[styles.serviceChipTxt, { color: center.color }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.bookingOptionsRow]}>
                  {center.bookingOptions.map((opt) => {
                    const btype = BOOKING_TYPES.find(b => b.id === opt);
                    if (!btype) return null;
                    return (
                      <View key={opt} style={[styles.bookOptionChip, { backgroundColor: btype.color + "15" }]}>
                        <Text style={{ fontSize: 14 }}>{btype.emoji}</Text>
                        <Text style={[styles.bookOptionTxt, { color: btype.color }]}>{btype.label}</Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.centerFooter}>
                  <Pressable
                    style={[styles.bookBtn, { backgroundColor: center.color }]}
                    onPress={() => openBooking(center)}
                  >
                    <Feather name="calendar" size={14} color="#fff" />
                    <Text style={styles.bookBtnTxt}>احجزي الآن</Text>
                  </Pressable>
                  <Text style={[styles.priceTxt, { color: colors.muted }]}>{center.priceRange}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── EXPERTS TAB ─── */}
        {activeTab === "experts" && (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              خبراء الجمال والعناية{filteredExperts.length < BEAUTY_EXPERTS.length ? ` (${filteredExperts.length} نتيجة)` : ""}
            </Text>
            {filteredExperts.length === 0 && (
              <View style={styles.emptyFilter}>
                <Text style={{ fontSize: 36 }}>🔍</Text>
                <Text style={[styles.emptyFilterTxt, { color: colors.muted }]}>لا توجد نتائج تطابق الفلتر المحدد</Text>
                <Pressable onPress={resetFilters}><Text style={{ color: "#EC4899", fontFamily: "Tajawal_700Bold", fontSize: 14 }}>إعادة تعيين الفلتر</Text></Pressable>
              </View>
            )}
            {filteredExperts.map((expert) => (
              <View key={expert.id} style={[styles.expertCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <View style={styles.expertTop}>
                  <View style={[styles.expertAvatar, { backgroundColor: expert.color + "20" }]}>
                    <Text style={{ fontSize: 32 }}>{expert.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.expertNameRow}>
                      <Text style={[styles.expertName, { color: colors.text }]}>{expert.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Pressable onPress={() => toggleFav(`e-${expert.id}`)} hitSlop={8}>
                          <Feather name="heart" size={16} color={favorites.has(`e-${expert.id}`) ? "#EC4899" : colors.muted} fill={favorites.has(`e-${expert.id}`) ? "#EC4899" : "none"} />
                        </Pressable>
                        <View style={[styles.availBadge, { backgroundColor: expert.available ? "#22C55E18" : "#EF444418" }]}>
                          <View style={[styles.statusDot, { backgroundColor: expert.available ? "#22C55E" : "#EF4444" }]} />
                          <Text style={[styles.openTxt, { color: expert.available ? "#22C55E" : "#EF4444" }]}>
                            {expert.available ? "متاح" : "مشغول"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.typePill, { backgroundColor: expert.color + "15" }]}>
                      <Text style={[styles.typeText, { color: expert.color }]}>{expert.specialty}</Text>
                    </View>
                    <View style={styles.expertMeta}>
                      <Text style={[styles.ratingTxt, { color: "#F59E0B" }]}>⭐ {expert.rating}</Text>
                      <Text style={[styles.reviewsTxt, { color: colors.muted }]}>({expert.reviews})</Text>
                      <View style={[styles.expPill, { backgroundColor: colors.border }]}>
                        <Text style={[styles.expTxt, { color: colors.textSecondary }]}>{expert.experience} خبرة</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.expertServices}>
                  {expert.services.map((s, i) => (
                    <View key={i} style={[styles.serviceChip, { backgroundColor: expert.color + "10" }]}>
                      <Text style={[styles.serviceChipTxt, { color: expert.color }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.bookingOptionsRow]}>
                  {expert.bookingOptions.map((opt) => {
                    const btype = BOOKING_TYPES.find(b => b.id === opt);
                    if (!btype) return null;
                    return (
                      <View key={opt} style={[styles.bookOptionChip, { backgroundColor: btype.color + "15" }]}>
                        <Text style={{ fontSize: 13 }}>{btype.emoji}</Text>
                        <Text style={[styles.bookOptionTxt, { color: btype.color }]}>{btype.label}</Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.expertFooter}>
                  <Pressable
                    style={[styles.bookBtn, { backgroundColor: expert.available ? expert.color : colors.muted }]}
                    onPress={() => expert.available && openBooking(expert)}
                  >
                    <Feather name="calendar" size={14} color="#fff" />
                    <Text style={styles.bookBtnTxt}>{expert.available ? "احجز موعد" : "غير متاح"}</Text>
                  </Pressable>
                  <Text style={[styles.expertPrice, { color: expert.color }]}>{expert.price} ر.س / جلسة</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── OFFERS TAB ─── */}
        {activeTab === "offers" && (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>عروض العناية والجمال 🔥</Text>
            {BEAUTY_OFFERS.map((offer) => (
              <Pressable
                key={offer.id}
                style={[styles.offerCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}
                onPress={() => setSelectedOffer(offer)}
              >
                <View style={styles.offerTop}>
                  <View style={[styles.discountBadge, { backgroundColor: offer.color }]}>
                    <Text style={styles.discountTxt}>-{offer.discountPercent}%</Text>
                  </View>
                  <View style={styles.offerCenterTag}>
                    <Text style={{ fontSize: 18 }}>{offer.emoji}</Text>
                    <Text style={[styles.offerCenterName, { color: colors.muted }]}>{offer.centerName}</Text>
                  </View>
                </View>
                <Text style={[styles.offerTitle, { color: colors.text }]}>{offer.title}</Text>
                <Text style={[styles.offerDesc, { color: colors.muted }]}>{offer.description}</Text>
                <View style={styles.offerPriceRow}>
                  <Text style={[styles.offerPrice, { color: offer.color }]}>{offer.discountPrice} ر.س</Text>
                  <Text style={[styles.offerOldPrice, { color: colors.muted }]}>{offer.originalPrice} ر.س</Text>
                </View>
                <View style={styles.offerFooter}>
                  <View style={[styles.codeBadge, { backgroundColor: offer.color + "15" }]}>
                    <Text style={[styles.codeTxt, { color: offer.color }]}>{offer.code}</Text>
                  </View>
                  <Text style={[styles.validTxt, { color: colors.muted }]}>صالح حتى {offer.validUntil}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* ─── BEAUTY TIPS ─── */}
        <View style={[styles.tipsCard, { backgroundColor: isDark ? "#1C1330" : "#FDF0FF", borderColor: isDark ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.15)" }]}>
          <Text style={[styles.sectionTitle, { color: "#EC4899", marginBottom: 10 }]}>💡 نصائح العناية والجمال</Text>
          {BEAUTY_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={{ color: "#EC4899", marginTop: 1 }}>✨</Text>
              <Text style={[styles.tipTxt, { color: colors.text }]}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* ─── BLOG ─── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📖 مدونة العناية والجمال</Text>
          {BLOG_POSTS.map((post, i) => (
            <Pressable key={i} style={[styles.blogCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
              <Text style={{ fontSize: 24 }}>{post.emoji}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.blogTitle, { color: colors.text }]}>{post.title}</Text>
                <View style={styles.blogMeta}>
                  <View style={[styles.blogTag, { backgroundColor: "#EC489918" }]}>
                    <Text style={[styles.blogTagTxt, { color: "#EC4899" }]}>{post.tag}</Text>
                  </View>
                  <View style={styles.readTimeRow}>
                    <Feather name="clock" size={11} color={colors.muted} />
                    <Text style={[styles.readTimeTxt, { color: colors.muted }]}>{post.readTime}</Text>
                  </View>
                </View>
              </View>
              <Feather name="chevron-left" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* ─── MULTI-STEP BOOKING MODAL ─── */}
      <Modal visible={!!bookingStep} transparent animationType="slide" onRequestClose={() => setBookingStep(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff", maxHeight: "90%" }]}>
            {bookingProvider && (
              <>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {bookingStep === "services" ? "اختاري الخدمات" : bookingStep === "datetime" ? "التاريخ والوقت" : "تأكيد الحجز"}
                    </Text>
                    <Text style={[styles.modalSub, { color: colors.muted }]}>{bookingProvider.name}</Text>
                  </View>
                  <Pressable onPress={() => setBookingStep(null)}>
                    <Feather name="x" size={22} color={colors.muted} />
                  </Pressable>
                </View>

                {/* Step Indicators */}
                <View style={{ flexDirection: "row-reverse", justifyContent: "center", gap: 8, marginBottom: 14 }}>
                  {["services", "datetime", "summary"].map((step, i) => (
                    <View key={step} style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: bookingStep === step ? bookingProvider.color : (["services", "datetime", "summary"].indexOf(bookingStep!) > i ? bookingProvider.color + "60" : colors.border), alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" }}>{i + 1}</Text>
                      </View>
                      {i < 2 && <View style={{ width: 20, height: 2, backgroundColor: colors.border }} />}
                    </View>
                  ))}
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* ─── Step 1: Services ─── */}
                  {bookingStep === "services" && (
                    <View style={{ gap: 14 }}>
                      {/* Booking Mode */}
                      <View style={{ gap: 8 }}>
                        <Text style={[styles.svcSectionTitle, { color: colors.text }]}>🗓️ طريقة الخدمة</Text>
                        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                          {[
                            { key: "store" as const, label: "بالمحل", emoji: "🏠", desc: "زيارة المركز" },
                            { key: "home" as const, label: "بالمنزل", emoji: "🏡", desc: "نأتي إليكِ" },
                            { key: "remote" as const, label: "عن بعد", emoji: "📱", desc: "فيديو / هاتف" },
                          ].map((mode) => (
                            <Pressable
                              key={mode.key}
                              onPress={() => setBookingMode(mode.key)}
                              style={[{
                                flex: 1, borderRadius: 14, borderWidth: 1.5, padding: 10, alignItems: "center", gap: 4,
                                backgroundColor: bookingMode === mode.key ? bookingProvider.color + "12" : (isDark ? colors.card : "#F9F9F9"),
                                borderColor: bookingMode === mode.key ? bookingProvider.color : colors.border,
                              }]}
                            >
                              <Text style={{ fontSize: 22 }}>{mode.emoji}</Text>
                              <Text style={{ color: bookingMode === mode.key ? bookingProvider.color : colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13 }}>{mode.label}</Text>
                              <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 10, textAlign: "center" }}>{mode.desc}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>

                      <View style={{ height: 1, backgroundColor: colors.border }} />
                      <Text style={[styles.svcSectionTitle, { color: colors.text }]}>✨ اختاري الخدمات</Text>
                      {(bookingProvider.servicesDetail || []).map((svc) => {
                        const selected = selectedServiceIds.includes(svc.id);
                        return (
                          <Pressable
                            key={svc.id}
                            onPress={() => setSelectedServiceIds(prev => selected ? prev.filter(x => x !== svc.id) : [...prev, svc.id])}
                            style={[styles.svcRow, { backgroundColor: selected ? bookingProvider.color + "10" : (isDark ? colors.card : "#F9F9F9"), borderColor: selected ? bookingProvider.color : colors.border }]}
                          >
                            <View style={[styles.svcCheckbox, { backgroundColor: selected ? bookingProvider.color : "transparent", borderColor: selected ? bookingProvider.color : colors.muted }]}>
                              {selected && <Feather name="check" size={13} color="#fff" />}
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
                                <Text style={{ fontSize: 22 }}>{svc.emoji}</Text>
                                <Text style={[styles.svcName, { color: colors.text }]}>{svc.name}</Text>
                              </View>
                              <View style={[styles.svcMeta]}>
                                <Feather name="clock" size={11} color={colors.muted} />
                                <Text style={[styles.svcDuration, { color: colors.muted }]}>{svc.duration}</Text>
                              </View>
                            </View>
                            <Text style={[styles.svcPrice, { color: bookingProvider.color }]}>{svc.price} ر.س</Text>
                          </Pressable>
                        );
                      })}
                      {selectedServiceIds.length > 0 && (
                        <View style={[styles.svcSubtotal, { backgroundColor: bookingProvider.color + "10", borderColor: bookingProvider.color + "30" }]}>
                          <Text style={[{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 14 }]}>المجموع</Text>
                          <Text style={[{ color: bookingProvider.color, fontFamily: "Cairo_700Bold", fontSize: 18 }]}>{bookingTotal} ر.س</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* ─── Step 2: Date & Time ─── */}
                  {bookingStep === "datetime" && (
                    <View style={{ gap: 16 }}>
                      <Text style={[styles.svcSectionTitle, { color: colors.text }]}>📅 اختاري التاريخ</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, flexDirection: "row-reverse" }}>
                        {bookingDates.map((d) => (
                          <Pressable
                            key={d.key}
                            onPress={() => setSelectedDate(d.key)}
                            style={[styles.dateChip, { backgroundColor: selectedDate === d.key ? bookingProvider.color : (isDark ? colors.card : "#F5F5F5"), borderColor: selectedDate === d.key ? bookingProvider.color : colors.border }]}
                          >
                            <Text style={[styles.dateChipDay, { color: selectedDate === d.key ? "#fff" : colors.muted }]}>{d.day}</Text>
                            <Text style={[styles.dateChipNum, { color: selectedDate === d.key ? "#fff" : colors.text }]}>{d.date}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>

                      {[{ label: "الصباح ☀️", slots: morningSlots }, { label: "الظهيرة 🌤️", slots: afternoonSlots }, { label: "المساء 🌙", slots: eveningSlots }].map(({ label, slots }) => (
                        <View key={label} style={{ gap: 8 }}>
                          <Text style={[styles.svcSectionTitle, { color: colors.text }]}>{label}</Text>
                          <View style={styles.timeSlotsGrid}>
                            {slots.map((slot) => (
                              <Pressable
                                key={slot}
                                onPress={() => setSelectedTime(slot)}
                                style={[styles.timeSlot, { backgroundColor: selectedTime === slot ? bookingProvider.color : (isDark ? colors.card : "#F5F5F5"), borderColor: selectedTime === slot ? bookingProvider.color : colors.border }]}
                              >
                                <Text style={[styles.timeSlotTxt, { color: selectedTime === slot ? "#fff" : colors.text }]}>{slot}</Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* ─── Step 3: Summary ─── */}
                  {bookingStep === "summary" && !bookingConfirmed && (
                    <View style={{ gap: 12 }}>
                      {/* Location */}
                      <View style={[styles.summarySection, { backgroundColor: isDark ? colors.card : "#F9F9F9", borderColor: colors.border }]}>
                        <Text style={[styles.summarySectionTitle, { color: colors.text }]}>📍 معلومات المكان</Text>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>الاسم</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{bookingProvider.name}</Text></View>
                        {"address" in bookingProvider && <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>العنوان</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{(bookingProvider as any).address}</Text></View>}
                        {"phone" in bookingProvider && <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>التواصل</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{(bookingProvider as any).phone}</Text></View>}
                      </View>

                      {/* Booking Info */}
                      <View style={[styles.summarySection, { backgroundColor: isDark ? colors.card : "#F9F9F9", borderColor: colors.border }]}>
                        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <Text style={[styles.summarySectionTitle, { color: colors.text }]}>📋 تفاصيل الحجز</Text>
                          <Pressable onPress={() => setBookingStep("datetime")}>
                            <Text style={{ color: bookingProvider.color, fontFamily: "Tajawal_700Bold", fontSize: 13 }}>تعديل</Text>
                          </Pressable>
                        </View>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>التاريخ والوقت</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{selectedDate} | {selectedTime}</Text></View>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>المختص</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{(bookingProvider as any).specialist || bookingProvider.name}</Text></View>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>الحالة</Text><Text style={[{ color: "#F59E0B", fontFamily: "Tajawal_700Bold", fontSize: 13 }]}>قيد المراجعة</Text></View>
                      </View>

                      {/* Services */}
                      <View style={[styles.summarySection, { backgroundColor: isDark ? colors.card : "#F9F9F9", borderColor: colors.border }]}>
                        <Text style={[styles.summarySectionTitle, { color: colors.text }]}>✨ الخدمات المحددة</Text>
                        {(bookingProvider.servicesDetail || []).filter(s => selectedServiceIds.includes(s.id)).map(svc => (
                          <View key={svc.id} style={styles.summaryRow}>
                            <Text style={[styles.summaryKey, { color: colors.text }]}>{svc.emoji} {svc.name} (×1)</Text>
                            <Text style={[styles.summaryVal, { color: bookingProvider.color }]}>{svc.price} ر.س</Text>
                          </View>
                        ))}
                      </View>

                      {/* Price */}
                      <View style={[styles.summarySection, { backgroundColor: isDark ? colors.card : "#F9F9F9", borderColor: colors.border }]}>
                        <Text style={[styles.summarySectionTitle, { color: colors.text }]}>💰 تفاصيل السعر</Text>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>المجموع الفرعي</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{bookingTotal} ر.س</Text></View>
                        <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 4 }]}>
                          <Text style={[styles.summarySectionTitle, { color: colors.text }]}>الإجمالي</Text>
                          <Text style={[styles.summaryVal, { color: bookingProvider.color, fontSize: 18, fontFamily: "Cairo_700Bold" }]}>{bookingTotal} ر.س</Text>
                        </View>
                      </View>

                      {/* Payment */}
                      <View style={[styles.summarySection, { backgroundColor: isDark ? colors.card : "#F9F9F9", borderColor: colors.border }]}>
                        <Text style={[styles.summarySectionTitle, { color: colors.text }]}>💳 طريقة الدفع</Text>
                        {[{ key: "cash", label: "نقداً بعد الخدمة", emoji: "💵" }, { key: "card", label: "بطاقة بنكية", emoji: "💳" }, { key: "online", label: "دفع إلكتروني", emoji: "📱" }].map(pm => (
                          <Pressable key={pm.key} onPress={() => setBookingPayment(pm.key as any)} style={[styles.summaryRow, { borderRadius: 8, padding: 8, marginTop: 4, backgroundColor: bookingPayment === pm.key ? bookingProvider.color + "12" : "transparent", borderColor: bookingPayment === pm.key ? bookingProvider.color : "transparent", borderWidth: 1 }]}>
                            <Text style={{ fontSize: 20 }}>{pm.emoji}</Text>
                            <Text style={[styles.summaryVal, { color: colors.text, flex: 1, textAlign: "right" }]}>{pm.label}</Text>
                            <View style={[{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: bookingPayment === pm.key ? bookingProvider.color : colors.muted, alignItems: "center", justifyContent: "center" }]}>
                              {bookingPayment === pm.key && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: bookingProvider.color }} />}
                            </View>
                          </Pressable>
                        ))}
                      </View>

                      {/* Mode-specific Info */}
                      {bookingMode === "home" && (
                        <View style={[styles.summarySection, { backgroundColor: "#3B82F610", borderColor: "#3B82F630" }]}>
                          <Text style={[styles.summarySectionTitle, { color: colors.text }]}>🏡 خدمة بالمنزل</Text>
                          <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "right", lineHeight: 20 }]}>
                            سيتوجه المختص إلى عنوانك المسجل. يمكنك إرسال موقعك الدقيق بعد تأكيد الحجز.
                          </Text>
                        </View>
                      )}
                      {bookingMode === "store" && (
                        <View style={[styles.summarySection, { backgroundColor: "#22C55E10", borderColor: "#22C55E30" }]}>
                          <Text style={[styles.summarySectionTitle, { color: colors.text }]}>🏠 بالمحل</Text>
                          {"address" in bookingProvider && (
                            <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
                              <Feather name="map-pin" size={14} color="#22C55E" />
                              <Text style={[{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 13, flex: 1, textAlign: "right" }]}>{(bookingProvider as any).address}</Text>
                            </View>
                          )}
                        </View>
                      )}
                      {bookingMode === "remote" && (
                        <View style={[styles.summarySection, { backgroundColor: "#8B5CF610", borderColor: "#8B5CF630" }]}>
                          <Text style={[styles.summarySectionTitle, { color: colors.text }]}>📱 جلسة عن بعد</Text>
                          <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "right", lineHeight: 20 }]}>
                            سيتم إرسال رابط الجلسة المرئية أو رقم التواصل المباشر على الجوال بعد التأكيد.
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* ─── Booking Confirmed ─── */}
                  {bookingStep === "summary" && bookingConfirmed && (
                    <View style={{ gap: 14, paddingVertical: 8 }}>
                      <View style={{ alignItems: "center", gap: 10 }}>
                        <Text style={{ fontSize: 56 }}>✅</Text>
                        <Text style={[{ color: "#22C55E", fontFamily: "Cairo_700Bold", fontSize: 20 }]}>تم تأكيد الحجز!</Text>
                        <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 14, textAlign: "center" }]}>سيتواصل معك فريق {bookingProvider.name} لتأكيد الموعد</Text>
                      </View>

                      {/* Booking Summary */}
                      <View style={[styles.summarySection, { backgroundColor: "#22C55E10", borderColor: "#22C55E40" }]}>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>التاريخ</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{selectedDate}</Text></View>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>الوقت</Text><Text style={[styles.summaryVal, { color: colors.text }]}>{selectedTime}</Text></View>
                        <View style={styles.summaryRow}>
                          <Text style={[styles.summaryKey, { color: colors.muted }]}>طريقة الخدمة</Text>
                          <Text style={[styles.summaryVal, { color: colors.text }]}>
                            {bookingMode === "home" ? "🏡 بالمنزل" : bookingMode === "store" ? "🏠 بالمحل" : "📱 عن بعد"}
                          </Text>
                        </View>
                        <View style={styles.summaryRow}><Text style={[styles.summaryKey, { color: colors.muted }]}>الإجمالي</Text><Text style={[styles.summaryVal, { color: "#22C55E", fontFamily: "Cairo_700Bold", fontSize: 16 }]}>{bookingTotal} ر.س</Text></View>
                      </View>

                      {/* Mode-specific Action */}
                      {bookingMode === "home" && (
                        <Pressable
                          style={[styles.confirmBookBtn, { backgroundColor: "#3B82F6" }]}
                          onPress={() => Linking.openURL("https://maps.app.goo.gl/shareLocation")}
                        >
                          <Feather name="map-pin" size={16} color="#fff" />
                          <Text style={styles.confirmBookTxt}>📍 أرسل موقعي للمختص</Text>
                        </Pressable>
                      )}
                      {bookingMode === "store" && (
                        <Pressable
                          style={[styles.confirmBookBtn, { backgroundColor: "#22C55E" }]}
                          onPress={() => {
                            const addr = (bookingProvider as any).address || bookingProvider.name;
                            Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(addr)}`);
                          }}
                        >
                          <Feather name="map" size={16} color="#fff" />
                          <Text style={styles.confirmBookTxt}>🗺️ عرض موقع المحل على الخريطة</Text>
                        </Pressable>
                      )}
                      {bookingMode === "remote" && (
                        <Pressable
                          style={[styles.confirmBookBtn, { backgroundColor: "#8B5CF6" }]}
                          onPress={() => Linking.openURL(`tel:${(bookingProvider as any).phone || "0500000000"}`)}
                        >
                          <Feather name="video" size={16} color="#fff" />
                          <Text style={styles.confirmBookTxt}>📞 الاتصال المباشر بالمختص</Text>
                        </Pressable>
                      )}

                      {/* Cancellation Policy */}
                      <View style={[styles.summarySection, { backgroundColor: "#F59E0B08", borderColor: "#F59E0B30" }]}>
                        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <Text style={{ fontSize: 16 }}>⚠️</Text>
                          <Text style={[styles.summarySectionTitle, { color: "#F59E0B" }]}>سياسة الإلغاء والاسترداد</Text>
                        </View>
                        {[
                          "إلغاء مجاني حتى 24 ساعة قبل الموعد",
                          "إلغاء بعد 24 ساعة: رسوم 50% من قيمة الحجز",
                          "عدم الحضور دون إشعار: لا يُسترد المبلغ",
                          "التأخر أكثر من 15 دقيقة يُعتبر عدم حضور",
                          "يمكن تعديل الموعد مرة واحدة مجاناً",
                        ].map((policy, idx) => (
                          <View key={idx} style={{ flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, marginTop: 4 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F59E0B", marginTop: 6 }} />
                            <Text style={{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 12, flex: 1, textAlign: "right", lineHeight: 20 }}>{policy}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Footer Buttons */}
                <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                  {bookingStep === "services" && (
                    <>
                      {!bookingMode && (
                        <Text style={{ color: "#F59E0B", fontFamily: "Tajawal_700Bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>
                          ⚠️ اختاري طريقة الخدمة أولاً
                        </Text>
                      )}
                      <Pressable
                        style={[styles.confirmBookBtn, { backgroundColor: (selectedServiceIds.length > 0 && bookingMode) ? bookingProvider.color : colors.muted }]}
                        onPress={() => (selectedServiceIds.length > 0 && bookingMode) && setBookingStep("datetime")}
                      >
                        <Text style={styles.confirmBookTxt}>التالي ← اختاري الوقت</Text>
                      </Pressable>
                    </>
                  )}
                  {bookingStep === "datetime" && (
                    <View style={{ flexDirection: "row-reverse", gap: 10 }}>
                      <Pressable style={[styles.confirmBookBtn, { flex: 1, backgroundColor: (selectedDate && selectedTime) ? bookingProvider.color : colors.muted }]}
                        onPress={() => (selectedDate && selectedTime) && setBookingStep("summary")}>
                        <Text style={styles.confirmBookTxt}>التالي ← ملخص الحجز</Text>
                      </Pressable>
                      <Pressable style={[styles.confirmBookBtnOutline, { borderColor: colors.border }]} onPress={() => setBookingStep("services")}>
                        <Feather name="arrow-right" size={16} color={colors.muted} />
                      </Pressable>
                    </View>
                  )}
                  {bookingStep === "summary" && !bookingConfirmed && (
                    <View style={{ flexDirection: "row-reverse", gap: 10 }}>
                      <Pressable style={[styles.confirmBookBtn, { flex: 1, backgroundColor: bookingProvider.color }]} onPress={() => setBookingConfirmed(true)}>
                        <Feather name="check" size={16} color="#fff" />
                        <Text style={styles.confirmBookTxt}>تأكيد الحجز</Text>
                      </Pressable>
                      <Pressable style={[styles.confirmBookBtnOutline, { borderColor: colors.border }]} onPress={() => setBookingStep("datetime")}>
                        <Feather name="arrow-right" size={16} color={colors.muted} />
                      </Pressable>
                    </View>
                  )}
                  {bookingStep === "summary" && bookingConfirmed && (
                    <Pressable style={[styles.confirmBookBtn, { backgroundColor: "#22C55E" }]} onPress={() => setBookingStep(null)}>
                      <Text style={styles.confirmBookTxt}>إغلاق</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ─── OFFER DETAIL MODAL ─── */}
      <Modal visible={!!selectedOffer} transparent animationType="slide" onRequestClose={() => setSelectedOffer(null)}>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <View style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: selectedOffer.color }]}>
                      <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 13 }}>خصم {selectedOffer.discountPercent}%</Text>
                    </View>
                    <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
                      <Text style={{ fontSize: 16 }}>{selectedOffer.emoji}</Text>
                      <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 13 }]}>{selectedOffer.centerName}</Text>
                    </View>
                  </View>
                  <View style={[styles.offerDetailPrice, { backgroundColor: isDark ? colors.surfaceAlt : "#FFF0F8" }]}>
                    <Text style={[styles.offerDetailPriceVal, { color: selectedOffer.color }]}>{selectedOffer.discountPrice} ر.س</Text>
                    <Text style={[styles.offerDetailOld, { color: colors.muted }]}>بدلاً من {selectedOffer.originalPrice} ر.س</Text>
                  </View>
                  <Text style={[styles.modalSub, { color: colors.textSecondary, marginTop: 12 }]}>{selectedOffer.description}</Text>

                  {/* Code Box with Copy */}
                  <View style={[styles.codeCard, { backgroundColor: selectedOffer.color + "10", borderColor: selectedOffer.color + "30", borderWidth: 1, borderRadius: 14, padding: 16, alignItems: "center", gap: 8, marginTop: 12 }]}>
                    <Text style={[styles.codeLabel, { color: colors.muted }]}>كود العرض</Text>
                    <Text style={[styles.codeVal, { color: selectedOffer.color, fontSize: 22, letterSpacing: 3 }]}>{selectedOffer.code}</Text>
                    <Pressable
                      style={[{ flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: copiedCode === selectedOffer.code ? "#22C55E" : selectedOffer.color }]}
                      onPress={() => copyCode(selectedOffer.code)}
                    >
                      <Feather name={copiedCode === selectedOffer.code ? "check" : "copy"} size={15} color="#fff" />
                      <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 }}>{copiedCode === selectedOffer.code ? "تم النسخ!" : "انسخ الكود"}</Text>
                    </Pressable>
                  </View>

                  {/* Instructions */}
                  <View style={[{ borderRadius: 14, borderWidth: 1, padding: 14, gap: 6, marginTop: 12, backgroundColor: isDark ? colors.card : "#F8F8F8", borderColor: colors.border }]}>
                    <Text style={[{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13 }]}>📋 كيفية استخدام الكود</Text>
                    <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", lineHeight: 20 }]}>١. انسخ الكود بالضغط على "انسخ الكود" أعلاه</Text>
                    <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", lineHeight: 20 }]}>٢. اضغطي على "احجزي الآن" لاختيار الخدمة</Text>
                    <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", lineHeight: 20 }]}>٣. في خطوة الدفع، الصقي الكود في خانة "كود الخصم"</Text>
                    <Text style={[{ color: colors.textSecondary, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", lineHeight: 20 }]}>٤. سيُطبَّق الخصم تلقائياً على إجمالي الفاتورة</Text>
                  </View>

                  <Text style={[styles.validTxt, { color: colors.muted, textAlign: "center", marginTop: 10 }]}>
                    📅 صالح حتى: {selectedOffer.validUntil}
                  </Text>
                  <Pressable
                    style={[styles.confirmBookBtn, { backgroundColor: selectedOffer.color, marginTop: 16 }]}
                    onPress={() => {
                      setSelectedOffer(null);
                      openBooking(BEAUTY_CENTERS[0]);
                    }}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                    <Text style={styles.confirmBookTxt}>احجزي الآن</Text>
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
  tabsRow: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tab: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  storeBanner: { margin: 16, borderRadius: 20, overflow: "hidden", height: 150, position: "relative" },
  storeBannerImg: { width: "100%", height: "100%", position: "absolute" },
  storeBannerContent: { flex: 1, padding: 16, justifyContent: "flex-end" },
  storeBannerBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-end", marginBottom: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  liveTxt: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  storeBannerTitle: { color: "#fff", fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  storeBannerSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  storeBannerBtn: { marginTop: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, alignSelf: "flex-end" },
  storeBannerBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 14 },
  centerCard: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 14, gap: 12 },
  centerTop: { flexDirection: "row-reverse", gap: 14 },
  centerAvatar: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  centerNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  centerName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1 },
  openBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  openTxt: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  typePill: { alignSelf: "flex-end", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  typeText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  metaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 5, marginTop: 6, flexWrap: "wrap" },
  ratingTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  reviewsTxt: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  addressTxt: { fontSize: 11, fontFamily: "Tajawal_400Regular", flex: 1 },
  servicesRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  serviceChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  serviceChipTxt: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  bookingOptionsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  bookOptionChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  bookOptionTxt: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  centerFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  bookBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  bookBtnTxt: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  priceTxt: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  expertCard: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 14, gap: 12 },
  expertTop: { flexDirection: "row-reverse", gap: 14 },
  expertAvatar: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  expertNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, flexWrap: "wrap" },
  expertName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1 },
  availBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  expertMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  expPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  expTxt: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  expertServices: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  expertFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  expertPrice: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  offerCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14, gap: 8 },
  offerTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  discountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  offerCenterTag: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  offerCenterName: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  offerTitle: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  offerDesc: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  offerPrice: { fontSize: 18, fontFamily: "Tajawal_700Bold" },
  offerOldPrice: { fontSize: 13, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  codeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  codeTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  validTxt: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  tipsCard: { marginHorizontal: 20, marginTop: 20, marginBottom: 8, borderRadius: 20, padding: 16, borderWidth: 1, gap: 8 },
  tipRow: { flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" },
  tipTxt: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 22 },
  blogCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10 },
  blogTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  blogMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  blogTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  blogTagTxt: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  readTimeRow: { flexDirection: "row-reverse", alignItems: "center", gap: 3 },
  readTimeTxt: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: "80%", gap: 12 },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", flex: 1 },
  modalSub: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  bookTypesGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, marginVertical: 8 },
  bookTypeCard: { width: (width - 88) / 2, borderRadius: 18, borderWidth: 2, padding: 16, alignItems: "center", gap: 8 },
  bookTypeLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  confirmBookBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16 },
  confirmBookTxt: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  offerDetailPrice: { borderRadius: 16, padding: 16, alignItems: "center", gap: 4 },
  offerDetailPriceVal: { fontSize: 32, fontFamily: "Cairo_700Bold" },
  offerDetailOld: { fontSize: 14, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  codeCard: { borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 4, marginTop: 14 },
  codeLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  codeVal: { fontSize: 20, fontFamily: "Cairo_700Bold", letterSpacing: 2 },
  filterToggleBar: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1 },
  filterToggleBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterToggleTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  resetBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  resetTxt: { color: "#EC4899", fontSize: 13, fontFamily: "Tajawal_500Medium" },
  filterPanel: { paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
  filterRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, justifyContent: "space-between" },
  filterLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold", minWidth: 56, textAlign: "right" },
  filterChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterChipTxt: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  toggleTrack: { width: 46, height: 26, borderRadius: 13, padding: 3 },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" },
  emptyFilter: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
  emptyFilterTxt: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  bookingsIconBadge: { position: "absolute", top: 2, left: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: "#EC4899", alignItems: "center", justifyContent: "center" },
  bookingsIconBadgeTxt: { color: "#fff", fontSize: 9, fontFamily: "Tajawal_700Bold" },
  modalBody: { maxHeight: 400 },
  modalFooter: { borderTopWidth: 1, paddingTop: 14, marginTop: 8 },
  confirmBookBtnOutline: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  svcRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  svcCheckbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  svcName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  svcMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginTop: 2 },
  svcDuration: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  svcPrice: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  svcSubtotal: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 14 },
  svcSectionTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  dateChip: { width: 56, height: 64, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  dateChipDay: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  dateChipNum: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  timeSlotsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  timeSlot: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  timeSlotTxt: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  summarySection: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  summarySectionTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  summaryRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  summaryKey: { fontSize: 12, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  summaryVal: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "left" },
});
