import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  I18nManager,
  Image,
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
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const CLINIC_IMAGES = [
  require("@/assets/images/clinic-room.png"),
  require("@/assets/images/clinics-banner.png"),
];

interface Clinic {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  distance: string;
  workingHours: string;
  tags: string[];
  departments: string[];
  images: number[];
  hasOffer: boolean;
  offerText?: string;
  priceRange: string;
}

interface SpecService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Specialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  price: number;
  experience: string;
  consultTypes: string[];
  workingHours: string;
  bio: string;
  services: SpecService[];
}

interface Offer {
  id: string;
  title: string;
  provider: string;
  providerId: string;
  providerType: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  code: string;
  validUntil: string;
  category: string;
  terms: string[];
  instructions: string;
}

const CLINICS: Clinic[] = [
  {
    id: "clinic-1", name: "عيادات النخبة الطبية",
    description: "عيادات متخصصة في الجلدية والتجميل والأسنان مع أطباء خبراء ومعدات حديثة",
    rating: 4.9, reviewCount: 328, isOpen: true,
    address: "حي العليا، الرياض", distance: "2.3 كم",
    workingHours: "9:00 ص - 10:00 م",
    tags: ["جلدية", "تجميل", "أسنان"],
    departments: ["الجلدية والتجميل", "طب الأسنان", "الليزر", "البوتوكس والفيلر"],
    images: [0, 1], hasOffer: true, offerText: "خصم 30% على الليزر",
    priceRange: "150 - 500 ر.س",
  },
  {
    id: "clinic-2", name: "مجمع الشفاء الطبي",
    description: "مجمع طبي متكامل يضم أكثر من 15 تخصص طبي تحت سقف واحد",
    rating: 4.7, reviewCount: 215, isOpen: true,
    address: "حي الملقا، الرياض", distance: "4.1 كم",
    workingHours: "8:00 ص - 11:00 م",
    tags: ["باطنية", "عظام", "أطفال"],
    departments: ["الباطنية", "العظام والمفاصل", "طب الأطفال", "الأشعة"],
    images: [1, 0], hasOffer: false,
    priceRange: "100 - 400 ر.س",
  },
  {
    id: "clinic-3", name: "عيادة الدكتور سلطان",
    description: "عيادة تخصصية في أمراض القلب والأوعية الدموية مع خبرة تزيد عن 20 عاماً",
    rating: 4.8, reviewCount: 142, isOpen: false,
    address: "حي الورود، الرياض", distance: "5.8 كم",
    workingHours: "10:00 ص - 8:00 م",
    tags: ["قلب", "أوعية دموية"],
    departments: ["أمراض القلب", "تخطيط القلب", "الإيكو"],
    images: [0, 1], hasOffer: true, offerText: "كشف مجاني للمراجعين الجدد",
    priceRange: "200 - 600 ر.س",
  },
  {
    id: "clinic-4", name: "مركز لمسة العناية",
    description: "مركز متخصص في العلاج الطبيعي والتأهيل مع أخصائيين معتمدين دولياً",
    rating: 4.6, reviewCount: 89, isOpen: true,
    address: "حي النرجس، الرياض", distance: "3.5 كم",
    workingHours: "9:00 ص - 9:00 م",
    tags: ["علاج طبيعي", "تأهيل"],
    departments: ["العلاج الطبيعي", "التأهيل الرياضي", "التدليك العلاجي"],
    images: [1, 0], hasOffer: false,
    priceRange: "120 - 350 ر.س",
  },
];

const SPECIALISTS: Specialist[] = [
  {
    id: "spec-1", name: "د. سارة الأحمدي", title: "أخصائية تغذية علاجية",
    specialty: "تغذية", rating: 4.9, reviewCount: 345, isAvailable: true,
    price: 199, experience: "10 سنوات", consultTypes: ["حضوري", "عن بعد"],
    workingHours: "الأحد - الخميس: 9:00 ص - 6:00 م",
    bio: "حاصلة على ماجستير في علوم التغذية من جامعة الملك سعود. متخصصة في الحميات العلاجية وتغذية الرياضيين.",
    services: [
      { id: "s1", name: "استشارة تغذية أولى", price: 199, duration: 45 },
      { id: "s2", name: "متابعة شهرية", price: 150, duration: 30 },
      { id: "s3", name: "خطة تغذية رياضية", price: 300, duration: 45 },
    ],
  },
  {
    id: "spec-2", name: "د. فهد الحربي", title: "استشاري جلدية وتجميل",
    specialty: "جلدية وتجميل", rating: 4.8, reviewCount: 298, isAvailable: true,
    price: 300, experience: "15 سنة", consultTypes: ["حضوري"],
    workingHours: "الأحد - الخميس: 10:00 ص - 8:00 م",
    bio: "حاصل على الزمالة البريطانية في أمراض الجلدية والتجميل. خبرة واسعة في الليزر والفيلر والبوتوكس.",
    services: [
      { id: "s1", name: "استشارة جلدية", price: 300, duration: 30 },
      { id: "s2", name: "جلسة فيلر", price: 1500, duration: 30 },
      { id: "s3", name: "جلسة ليزر تجميلي", price: 800, duration: 45 },
    ],
  },
  {
    id: "spec-3", name: "أ. منال الشهري", title: "أخصائية نفسية إكلينيكية",
    specialty: "صحة نفسية", rating: 4.9, reviewCount: 267, isAvailable: false,
    price: 180, experience: "8 سنوات", consultTypes: ["عن بعد"],
    workingHours: "الأحد - الأربعاء: 10:00 ص - 6:00 م",
    bio: "متخصصة في علاج القلق والاكتئاب والعلاج المعرفي السلوكي CBT. جلسات عن بعد فقط.",
    services: [
      { id: "s1", name: "جلسة تقييم أولية", price: 300, duration: 60 },
      { id: "s2", name: "جلسة علاج نفسي", price: 180, duration: 50 },
      { id: "s3", name: "باقة 4 جلسات", price: 800, duration: 0 },
    ],
  },
  {
    id: "spec-4", name: "د. محمد الزهراني", title: "استشاري طب رياضي",
    specialty: "طب رياضي", rating: 4.8, reviewCount: 189, isAvailable: true,
    price: 200, experience: "12 سنة", consultTypes: ["حضوري", "عن بعد"],
    workingHours: "الأحد - الخميس: 8:00 ص - 8:00 م | السبت: 10:00 ص - 4:00 م",
    bio: "حاصل على البورد السعودي في الطب الرياضي. متخصص في إصابات الملاعب وتأهيل الرياضيين.",
    services: [
      { id: "s1", name: "استشارة طب رياضي", price: 200, duration: 45 },
      { id: "s2", name: "جلسة تأهيل رياضي", price: 180, duration: 60 },
      { id: "s3", name: "تقييم لياقة بدنية طبي", price: 350, duration: 60 },
    ],
  },
  {
    id: "spec-5", name: "د. ليلى الحربي", title: "أخصائية صحة نفسية",
    specialty: "صحة نفسية", rating: 4.9, reviewCount: 312, isAvailable: true,
    price: 200, experience: "7 سنوات", consultTypes: ["عن بعد"],
    workingHours: "الأحد - الخميس: 10:00 ص - 7:00 م",
    bio: "متخصصة في العلاج الأسري والعلاقات مع خبرة في الإرشاد النفسي عن بعد.",
    services: [
      { id: "s1", name: "استشارة نفسية أولى", price: 200, duration: 50 },
      { id: "s2", name: "جلسة إرشاد نفسي", price: 180, duration: 45 },
      { id: "s3", name: "جلسة علاج أسري", price: 300, duration: 60 },
    ],
  },
];

const OFFERS: Offer[] = [
  {
    id: "o1", title: "جلسة ليزر إزالة شعر",
    provider: "عيادات النخبة الطبية", providerId: "clinic-1", providerType: "clinics",
    description: "جلسة ليزر كاملة لمنطقة واحدة مع أحدث أجهزة الليزر",
    originalPrice: 500, discountedPrice: 350, discountPercent: 30,
    code: "LASER30", validUntil: "2026-04-30", category: "تجميل",
    instructions: "أدخل الكود عند الحجز في صفحة الدفع أو أخبر الاستقبال بالكود عند الحضور. الخصم يطبق تلقائياً.",
    terms: ["العرض ساري حتى 30 أبريل 2026", "صالح لمنطقة واحدة فقط لكل جلسة", "لا يمكن الجمع مع عروض أخرى", "الإلغاء قبل 24 ساعة مجاناً", "يشمل الكشف المبدئي قبل الجلسة"],
  },
  {
    id: "o2", title: "باقة الفحص الشامل",
    provider: "مختبرات البرج الطبية", providerId: "lab-1", providerType: "labs",
    description: "أكثر من 30 تحليل شامل لجميع وظائف الجسم مع تقرير مفصل",
    originalPrice: 800, discountedPrice: 500, discountPercent: 38,
    code: "CHECK38", validUntil: "2026-04-15", category: "تحاليل",
    instructions: "احجز موعدك واذكر كود الخصم عند الحضور. النتائج خلال 24-48 ساعة عبر التطبيق.",
    terms: ["العرض ساري حتى 15 أبريل 2026", "يشمل صيام 8-12 ساعة قبل سحب العينة", "النتائج خلال 48 ساعة", "لا يشمل التحاليل الجينية", "متاح في جميع فروع البرج"],
  },
  {
    id: "o3", title: "استشارة تغذية أولى",
    provider: "د. سارة الأحمدي", providerId: "spec-1", providerType: "specialists",
    description: "فحص شامل وخطة غذائية مخصصة مع متابعة أسبوعية مجانية",
    originalPrice: 350, discountedPrice: 199, discountPercent: 43,
    code: "NUTR43", validUntil: "2026-05-01", category: "استشارات",
    instructions: "احجز الاستشارة حضورياً أو عن بعد واستخدم الكود عند الدفع. تشمل متابعة أسبوعية مجانية لمدة شهر.",
    terms: ["العرض ساري حتى 1 مايو 2026", "يشمل خطة غذائية مخصصة", "متابعة أسبوعية مجانية لمدة شهر", "متاح حضورياً وعن بعد", "للمراجعين الجدد فقط"],
  },
  {
    id: "o4", title: "جلسة تنظيف بشرة عميق",
    provider: "عيادات النخبة الطبية", providerId: "clinic-1", providerType: "clinics",
    description: "تنظيف وتقشير البشرة مع قناع مغذي وترطيب عميق",
    originalPrice: 400, discountedPrice: 250, discountPercent: 38,
    code: "GLOW38", validUntil: "2026-04-20", category: "عناية",
    instructions: "استخدم الكود عند الحجز من التطبيق أو عند الحضور. ينصح بعدم وضع مكياج قبل الجلسة.",
    terms: ["العرض ساري حتى 20 أبريل 2026", "الجلسة 60 دقيقة", "يشمل القناع المغذي والترطيب", "لا يمكن الجمع مع عروض أخرى", "الإلغاء قبل 12 ساعة مجاناً"],
  },
  {
    id: "o5", title: "جلسة علاج نفسي",
    provider: "أ. منال الشهري", providerId: "spec-3", providerType: "specialists",
    description: "جلسة علاج معرفي سلوكي CBT عن بعد مع متابعة أسبوعية",
    originalPrice: 300, discountedPrice: 180, discountPercent: 40,
    code: "MIND40", validUntil: "2026-04-25", category: "نفسية",
    instructions: "احجز جلسة عن بعد واستخدم الكود عند الدفع. سيتم إرسال رابط الجلسة قبل الموعد بساعة.",
    terms: ["العرض ساري حتى 25 أبريل 2026", "الجلسة 50 دقيقة عبر الفيديو", "يشمل متابعة أسبوعية واحدة مجانية", "متاح عن بعد فقط", "الإلغاء قبل 24 ساعة مجاناً"],
  },
];

export default function ClinicsSection() {
  
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState("clinics");

  const TABS = [
    { key: "clinics", label: t("العيادات", "Clinics"), icon: "activity" as const },
    { key: "specialists", label: t("المختصين", "Specialists"), icon: "users" as const },
    { key: "offers", label: t("العروض", "Offers"), icon: "tag" as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable style={[styles.backBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5" }]} onPress={() => router.back()}>
            <Feather name="chevron-right" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("العيادات والاستشارات", "Clinics & Consultations")}</Text>
          <Pressable style={[styles.bookingsBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5" }]} onPress={() => router.push("/bookings" as any)}>
            <Feather name="calendar" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Feather name={tab.icon} size={16} color={activeTab === tab.key ? colors.primary : colors.muted} />
              <Text style={[styles.tabLabel, { color: activeTab === tab.key ? colors.primary : colors.muted }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "clinics" && <ClinicsTab colors={colors} isDark={isDark} />}
        {activeTab === "specialists" && <SpecialistsTab colors={colors} isDark={isDark} />}
        {activeTab === "offers" && <OffersTab colors={colors} isDark={isDark} />}
      </ScrollView>
    </View>
  );
}

function ClinicsTab({ colors, isDark }: { colors: any; isDark: boolean }) {
  return (
    <View style={styles.listPad}>
      {CLINICS.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} colors={colors} isDark={isDark} />
      ))}
    </View>
  );
}

function ClinicCard({ clinic, colors, isDark }: { clinic: Clinic; colors: any; isDark: boolean }) {
  const { t } = useLanguage();
  const [imgIdx, setImgIdx] = useState(0);
  const images = clinic.images.map((i) => CLINIC_IMAGES[i]);

  return (
    <Pressable
      style={[styles.clinicCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}
      onPress={() => router.push(`/providers/detail/${clinic.id}?type=clinics` as any)}
    >
      <View style={styles.clinicImgWrap}>
        <ScrollView
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={(e) => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH - 2)))}
          scrollEventThrottle={16}
        >
          {images.map((img, idx) => (
            <Image key={idx} source={img} style={{ width: CARD_WIDTH - 2, height: 180 }} resizeMode="cover" />
          ))}
        </ScrollView>
        <View style={[styles.statusBadge, { backgroundColor: clinic.isOpen ? "#22C55E" : "#EF4444" }]}>
          <View style={[styles.statusDot, { backgroundColor: clinic.isOpen ? "#86EFAC" : "#FCA5A5" }]} />
          <Text style={styles.statusText}>{clinic.isOpen ? t("مفتوح", "Open") : t("مغلق", "Closed")}</Text>
        </View>
        {clinic.hasOffer && (
          <View style={styles.promoBadge}>
            <LinearGradient colors={["#F43F5E", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.promoGradient}>
              <Feather name="percent" size={10} color="#fff" />
              <Text style={styles.promoBadgeText}>{clinic.offerText}</Text>
            </LinearGradient>
          </View>
        )}
        <View style={styles.imgDots}>
          {images.map((_, idx) => (
            <View key={idx} style={[styles.dot, { backgroundColor: idx === imgIdx ? "#fff" : "rgba(255,255,255,0.5)" }]} />
          ))}
        </View>
      </View>
      <View style={styles.clinicInfo}>
        <View style={styles.nameRatingRow}>
          <Text style={[styles.clinicName, { color: colors.text }]} numberOfLines={1}>{clinic.name}</Text>
          <View style={styles.ratingPill}>
            <Text style={{ fontSize: 11 }}>⭐</Text>
            <Text style={styles.ratingVal}>{clinic.rating}</Text>
            <Text style={[styles.reviewCnt, { color: colors.muted }]}>({clinic.reviewCount})</Text>
          </View>
        </View>
        <Text style={[styles.clinicDesc, { color: colors.textSecondary }]} numberOfLines={2}>{clinic.description}</Text>
        <View style={styles.deptRow}>
          {clinic.departments.slice(0, 3).map((dept) => (
            <View key={dept} style={[styles.deptChip, { backgroundColor: colors.primary + "12" }]}>
              <Text style={[styles.deptText, { color: colors.primary }]}>{dept}</Text>
            </View>
          ))}
          {clinic.departments.length > 3 && (
            <View style={[styles.deptChip, { backgroundColor: colors.primary + "12" }]}>
              <Text style={[styles.deptText, { color: colors.primary }]}>+{clinic.departments.length - 3}</Text>
            </View>
          )}
        </View>
        <View style={styles.metaStrip}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={13} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{clinic.workingHours}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={13} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{clinic.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="credit-card" size={13} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{clinic.priceRange}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function SpecialistsTab({ colors, isDark }: { colors: any; isDark: boolean }) {
  return (
    <View style={styles.listPad}>
      {SPECIALISTS.map((spec) => (
        <SpecialistCard key={spec.id} spec={spec} colors={colors} isDark={isDark} />
      ))}
    </View>
  );
}

function SpecialistCard({ spec, colors, isDark }: { spec: Specialist; colors: any; isDark: boolean }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.specCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <View style={styles.specTop}>
          <View style={[styles.specAvatar, { backgroundColor: colors.primary + "18" }]}>
            <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
          </View>
          <View style={styles.specInfo}>
            <Text style={[styles.specName, { color: colors.text }]}>{spec.name}</Text>
            <Text style={[styles.specTitle, { color: colors.textSecondary }]}>{spec.title}</Text>
            <View style={styles.specMetaRow}>
              <View style={styles.ratingPill}>
                <Text style={{ fontSize: 10 }}>⭐</Text>
                <Text style={[styles.ratingVal, { fontSize: 12 }]}>{spec.rating}</Text>
                <Text style={[styles.reviewCnt, { color: colors.muted, fontSize: 10 }]}>({spec.reviewCount})</Text>
              </View>
              <Text style={[styles.specExp, { color: colors.muted }]}>{t("خبرة", "Exp.")} {spec.experience}</Text>
            </View>
          </View>
          <Feather name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} style={{ marginTop: 4 }} />
        </View>

        <Text style={[styles.specBio, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 2}>{spec.bio}</Text>

        <View style={styles.specTagsRow}>
          <View style={[styles.specTag, { backgroundColor: colors.primary + "12" }]}>
            <Text style={[styles.specTagText, { color: colors.primary }]}>{spec.specialty}</Text>
          </View>
          {spec.consultTypes.map((ct) => (
            <View key={ct} style={[styles.specTag, { backgroundColor: ct === "عن بعد" ? "#3B82F620" : "#22C55E20" }]}>
              <Feather name={ct === "عن بعد" ? "video" : "map-pin"} size={10} color={ct === "عن بعد" ? "#3B82F6" : "#22C55E"} />
              <Text style={[styles.specTagText, { color: ct === "عن بعد" ? "#3B82F6" : "#22C55E" }]}>
                {ct === "عن بعد" ? t("عن بعد", "Remote") : t("حضوري", "In-person")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.specPriceRow}>
          <View style={[styles.availBadge, { backgroundColor: spec.isAvailable ? "#22C55E18" : "#EF444418" }]}>
            <View style={[styles.statusDot, { backgroundColor: spec.isAvailable ? "#22C55E" : "#EF4444", width: 6, height: 6 }]} />
            <Text style={[styles.availText, { color: spec.isAvailable ? "#22C55E" : "#EF4444" }]}>
              {spec.isAvailable ? t("متاح الآن", "Available") : t("غير متاح", "Unavailable")}
            </Text>
          </View>
          <Text style={[styles.specPrice, { color: colors.primary }]}>
            {t("يبدأ من", "From")} {spec.price} <Text style={{ fontSize: 12 }}>{t("ر.س", "SAR")}</Text>
          </Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={[styles.specExpanded, { borderTopColor: colors.border }]}>
          <View style={styles.specHoursRow}>
            <Feather name="clock" size={14} color={colors.primary} />
            <Text style={[styles.specHoursText, { color: colors.textSecondary }]}>{spec.workingHours}</Text>
          </View>

          <Text style={[styles.specServicesLabel, { color: colors.text }]}>{t("الخدمات المتاحة", "Available Services")}</Text>
          {spec.services.map((svc) => (
            <View key={svc.id} style={[styles.specSvcRow, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.specSvcName, { color: colors.text }]}>{svc.name}</Text>
                {svc.duration > 0 && <Text style={[styles.specSvcDur, { color: colors.muted }]}>{svc.duration} {t("دقيقة", "min")}</Text>}
              </View>
              <Text style={[styles.specSvcPrice, { color: colors.primary }]}>{svc.price} {t("ر.س", "SAR")}</Text>
            </View>
          ))}

          <Pressable
            style={[styles.specBookBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/providers/detail/${spec.id}?type=specialists` as any)}
          >
            <Feather name="calendar" size={16} color="#fff" />
            <Text style={styles.specBookBtnText}>{t("احجز موعد", "Book Appointment")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function OffersTab({ colors, isDark }: { colors: any; isDark: boolean }) {
  const { t } = useLanguage();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = async (code: string, offerId: string) => {
    try {
      await Clipboard.setStringAsync(code);
    } catch {}
    setCopiedId(offerId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <View style={styles.listPad}>
      {OFFERS.map((offer) => (
        <Pressable
          key={offer.id}
          style={[styles.offerCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}
          onPress={() => setSelectedOffer(offer)}
        >
          <View style={styles.offerRow}>
            <View style={styles.offerDiscountBadge}>
              <LinearGradient colors={["#F43F5E", "#EC4899"]} style={styles.discountGrad}>
                <Text style={styles.discountPct}>{offer.discountPercent}%</Text>
                <Text style={styles.discountLabel}>{t("خصم", "Off")}</Text>
              </LinearGradient>
            </View>
            <View style={styles.offerContent}>
              <Text style={[styles.offerTitle, { color: colors.text }]} numberOfLines={1}>{offer.title}</Text>
              <Text style={[styles.offerProvider, { color: colors.primary }]} numberOfLines={1}>{offer.provider}</Text>
              <View style={styles.offerPriceRow}>
                <Text style={[styles.offerOldPrice, { color: colors.muted }]}>{offer.originalPrice} ر.س</Text>
                <Text style={[styles.offerNewPrice, { color: "#22C55E" }]}>{offer.discountedPrice} ر.س</Text>
              </View>
            </View>
          </View>
          <View style={[styles.offerCodeStrip, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderTopColor: colors.border }]}>
            <Pressable
              style={[styles.copyCodeBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}
              onPress={(e) => { e.stopPropagation?.(); copyCode(offer.code, offer.id); }}
            >
              <Feather name={copiedId === offer.id ? "check" : "copy"} size={13} color={colors.primary} />
              <Text style={[styles.copyCodeText, { color: colors.primary }]}>
                {copiedId === offer.id ? t("تم النسخ!", "Copied!") : offer.code}
              </Text>
            </Pressable>
            <View style={[styles.deptChip, { backgroundColor: "#F59E0B18" }]}>
              <Text style={[styles.deptText, { color: "#F59E0B" }]}>{offer.category}</Text>
            </View>
          </View>
        </Pressable>
      ))}

      <Modal visible={!!selectedOffer} transparent animationType="slide" onRequestClose={() => setSelectedOffer(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            {selectedOffer && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{t("تفاصيل العرض", "Offer Details")}</Text>
                  <Pressable onPress={() => setSelectedOffer(null)}>
                    <Feather name="x" size={22} color={colors.muted} />
                  </Pressable>
                </View>
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalOfferTop}>
                    <View style={[styles.modalDiscountBig, { overflow: "hidden" }]}>
                      <LinearGradient colors={["#F43F5E", "#EC4899"]} style={styles.modalDiscountGrad}>
                        <Text style={styles.modalDiscountPct}>{selectedOffer.discountPercent}%</Text>
                        <Text style={styles.modalDiscountLbl}>{t("خصم", "Off")}</Text>
                      </LinearGradient>
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={[styles.modalOfferTitle, { color: colors.text }]}>{selectedOffer.title}</Text>
                      <Text style={[styles.modalOfferProv, { color: colors.primary }]}>{selectedOffer.provider}</Text>
                    </View>
                  </View>

                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{selectedOffer.description}</Text>

                  <View style={styles.modalPriceRow}>
                    <View>
                      <Text style={[styles.modalPriceLabel, { color: colors.muted }]}>{t("السعر الأصلي", "Original Price")}</Text>
                      <Text style={[styles.modalOldPrice, { color: colors.muted }]}>{selectedOffer.originalPrice} {t("ر.س", "SAR")}</Text>
                    </View>
                    <Feather name="arrow-left" size={18} color={colors.muted} />
                    <View>
                      <Text style={[styles.modalPriceLabel, { color: colors.muted }]}>{t("بعد الخصم", "After Discount")}</Text>
                      <Text style={[styles.modalNewPrice, { color: "#22C55E" }]}>{selectedOffer.discountedPrice} {t("ر.س", "SAR")}</Text>
                    </View>
                    <View style={[styles.modalSaveBadge, { backgroundColor: "#F43F5E15" }]}>
                      <Text style={[styles.modalSaveText, { color: "#F43F5E" }]}>
                        {t("وفر", "Save")} {selectedOffer.originalPrice - selectedOffer.discountedPrice} {t("ر.س", "SAR")}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={[styles.modalCodeBox, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.primary + "30" }]}
                    onPress={() => copyCode(selectedOffer.code, selectedOffer.id)}
                  >
                    <View style={{ alignItems: "center", gap: 6 }}>
                      <Text style={[styles.modalCodeLabel, { color: colors.muted }]}>{t("كود الخصم", "Discount Code")}</Text>
                      <Text style={[styles.modalCodeVal, { color: colors.primary }]}>{selectedOffer.code}</Text>
                    </View>
                    <View style={[styles.modalCopyBtn, { backgroundColor: colors.primary }]}>
                      <Feather name={copiedId === selectedOffer.id ? "check" : "copy"} size={14} color="#fff" />
                      <Text style={styles.modalCopyText}>{copiedId === selectedOffer.id ? t("تم النسخ!", "Copied!") : t("نسخ الكود", "Copy Code")}</Text>
                    </View>
                  </Pressable>

                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Feather name="info" size={16} color={colors.primary} />
                      <Text style={[styles.modalSectionTitle, { color: colors.text }]}>{t("تعليمات الاستخدام", "Usage Instructions")}</Text>
                    </View>
                    <Text style={[styles.modalInstructions, { color: colors.textSecondary }]}>{selectedOffer.instructions}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Feather name="file-text" size={16} color={colors.primary} />
                      <Text style={[styles.modalSectionTitle, { color: colors.text }]}>{t("الشروط والأحكام", "Terms & Conditions")}</Text>
                    </View>
                    {selectedOffer.terms.map((term, idx) => (
                      <View key={idx} style={styles.termRow}>
                        <View style={[styles.termBullet, { backgroundColor: colors.primary }]} />
                        <Text style={[styles.termText, { color: colors.textSecondary }]}>{term}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.modalValidBox, { backgroundColor: "#F59E0B12" }]}>
                    <Feather name="clock" size={14} color="#F59E0B" />
                    <Text style={[styles.modalValidText, { color: "#F59E0B" }]}>
                      {t("ينتهي في", "Expires")} {selectedOffer.validUntil.split("-").reverse().join("/")}
                    </Text>
                  </View>

                  <Pressable
                    style={[styles.modalBookBtn, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setSelectedOffer(null);
                      router.push(`/providers/detail/${selectedOffer.providerId}?type=${selectedOffer.providerType}` as any);
                    }}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                    <Text style={styles.modalBookText}>{t("احجز الآن واستفد من العرض", "Book Now & Claim Offer")}</Text>
                  </Pressable>

                  <View style={{ height: 20 }} />
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
  header: { paddingHorizontal: 20, paddingBottom: 0 },
  headerRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "center", flex: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bookingsBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tabsRow: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tab: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabLabel: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  listPad: { paddingHorizontal: 20, gap: 16 },
  clinicCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  clinicImgWrap: { height: 180, position: "relative" },
  statusBadge: { position: "absolute", top: 12, left: 12, flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, zIndex: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  promoBadge: { position: "absolute", top: 12, right: 12, zIndex: 5 },
  promoGradient: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  promoBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  imgDots: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5, zIndex: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  clinicInfo: { padding: 16, gap: 10 },
  nameRatingRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  clinicName: { fontSize: 17, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1, marginLeft: 8 },
  ratingPill: { flexDirection: "row-reverse", alignItems: "center", gap: 3, backgroundColor: "#F59E0B15", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ratingVal: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#F59E0B" },
  reviewCnt: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  clinicDesc: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
  deptRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  deptChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deptText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  metaStrip: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12, marginTop: 2 },
  metaItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  specCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 12 },
  specTop: { flexDirection: "row-reverse", gap: 14 },
  specAvatar: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  specInfo: { flex: 1, gap: 3 },
  specName: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  specTitle: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  specMetaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginTop: 4 },
  specExp: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  specBio: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 19, color: "#666" },
  specTagsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  specTag: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  specPriceRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  availBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  availText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  specPrice: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  specExpanded: { borderTopWidth: 1, paddingTop: 14, marginTop: 4, gap: 12 },
  specHoursRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  specHoursText: { fontSize: 13, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  specServicesLabel: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  specSvcRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 12 },
  specSvcName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  specSvcDur: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  specSvcPrice: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  specBookBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  specBookBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  offerCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  offerRow: { flexDirection: "row-reverse", padding: 14, gap: 12, alignItems: "center" },
  offerDiscountBadge: { width: 56, height: 56, borderRadius: 14, overflow: "hidden" },
  discountGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  discountPct: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  discountLabel: { color: "rgba(255,255,255,0.85)", fontSize: 9, fontFamily: "Tajawal_500Medium", marginTop: -2 },
  offerContent: { flex: 1, gap: 2 },
  offerTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  offerProvider: { fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 2 },
  offerOldPrice: { fontSize: 13, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
  offerNewPrice: { fontSize: 17, fontFamily: "Tajawal_700Bold" },
  offerCodeStrip: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  copyCodeBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  copyCodeText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  modalBody: { padding: 20 },
  modalOfferTop: { flexDirection: "row-reverse", gap: 14, alignItems: "center", marginBottom: 16 },
  modalDiscountBig: { width: 70, height: 70, borderRadius: 18 },
  modalDiscountGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalDiscountPct: { color: "#fff", fontSize: 24, fontFamily: "Tajawal_700Bold" },
  modalDiscountLbl: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: "Tajawal_500Medium", marginTop: -3 },
  modalOfferTitle: { fontSize: 18, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  modalOfferProv: { fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  modalDesc: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22, marginBottom: 16 },
  modalPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  modalPriceLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  modalOldPrice: { fontSize: 16, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
  modalNewPrice: { fontSize: 22, fontFamily: "Tajawal_700Bold" },
  modalSaveBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  modalSaveText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  modalCodeBox: { padding: 16, borderRadius: 16, borderWidth: 1.5, marginBottom: 20, alignItems: "center", gap: 12 },
  modalCodeLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  modalCodeVal: { fontSize: 24, fontFamily: "Tajawal_700Bold", letterSpacing: 2 },
  modalCopyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  modalCopyText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  modalSection: { marginBottom: 16, gap: 10 },
  modalSectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  modalSectionTitle: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  modalInstructions: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22 },
  termRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  termBullet: { width: 5, height: 5, borderRadius: 3, marginTop: 8 },
  termText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 20 },
  modalValidBox: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 14, borderRadius: 12, marginBottom: 16 },
  modalValidText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  modalBookBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16 },
  modalBookText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
});
