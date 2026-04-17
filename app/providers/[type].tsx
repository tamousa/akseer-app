import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  I18nManager,
  Image,
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
const CARD_WIDTH = width - 40;

const PROVIDER_IMAGES: Record<string, any[]> = {
  clinics: [
    require("@/assets/images/clinic-room.png"),
    require("@/assets/images/clinics-banner.png"),
  ],
  labs: [
    require("@/assets/images/clinics-banner.png"),
    require("@/assets/images/clinic-room.png"),
  ],
  beauty: [
    require("@/assets/images/spa-treatment.png"),
    require("@/assets/images/beauty-banner.png"),
  ],
  trainers: [
    require("@/assets/images/fitness-banner.png"),
    require("@/assets/images/fitness-equipment.png"),
  ],
  specialists: [
    require("@/assets/images/clinic-room.png"),
    require("@/assets/images/mental-banner.png"),
  ],
};

interface Provider {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  distance: string;
  priceRange: string;
  images: any[];
  tags: string[];
}

const PROVIDERS_DATA: Record<string, { title: string; subtitle: string; color: string; providers: Provider[] }> = {
  clinics: {
    title: "العيادات الطبية",
    subtitle: "احجز مع أفضل العيادات القريبة منك",
    color: "#A86DBF",
    providers: [
      { id: "clinic-1", name: "عيادات النخبة الطبية", description: "عيادات متخصصة في الجلدية والتجميل والأسنان مع أطباء خبراء", rating: 4.9, reviewCount: 328, isOpen: true, address: "حي العليا، الرياض", distance: "2.3 كم", priceRange: "150 - 500 ر.س", images: [0, 1], tags: ["جلدية", "تجميل", "أسنان"] },
      { id: "clinic-2", name: "مجمع الشفاء الطبي", description: "مجمع طبي متكامل يضم أكثر من 15 تخصص طبي", rating: 4.7, reviewCount: 215, isOpen: true, address: "حي الملقا، الرياض", distance: "4.1 كم", priceRange: "100 - 400 ر.س", images: [1, 0], tags: ["باطنية", "عظام", "أطفال"] },
      { id: "clinic-3", name: "عيادة الدكتور سلطان", description: "عيادة تخصصية في أمراض القلب والأوعية الدموية", rating: 4.8, reviewCount: 142, isOpen: false, address: "حي الورود، الرياض", distance: "5.8 كم", priceRange: "200 - 600 ر.س", images: [0, 1], tags: ["قلب", "أوعية دموية"] },
      { id: "clinic-4", name: "مركز لمسة العناية", description: "مركز متخصص في العلاج الطبيعي والتأهيل", rating: 4.6, reviewCount: 89, isOpen: true, address: "حي النرجس، الرياض", distance: "3.5 كم", priceRange: "120 - 350 ر.س", images: [1, 0], tags: ["علاج طبيعي", "تأهيل"] },
    ],
  },
  labs: {
    title: "المختبرات الطبية",
    subtitle: "تحاليل دقيقة ونتائج سريعة",
    color: "#3B82F6",
    providers: [
      { id: "lab-1", name: "مختبرات البرج الطبية", description: "أكبر شبكة مختبرات في المملكة مع أحدث الأجهزة", rating: 4.8, reviewCount: 456, isOpen: true, address: "حي الروضة، الرياض", distance: "1.8 كم", priceRange: "50 - 800 ر.س", images: [0, 1], tags: ["تحاليل دم", "هرمونات", "جينات"] },
      { id: "lab-2", name: "مختبر النهضة", description: "مختبر معتمد من الهيئة السعودية للتخصصات الصحية", rating: 4.7, reviewCount: 312, isOpen: true, address: "حي السليمانية، الرياض", distance: "3.2 كم", priceRange: "40 - 600 ر.س", images: [1, 0], tags: ["تحاليل شاملة", "فيتامينات", "حساسية"] },
      { id: "lab-3", name: "مختبرات كير لاب", description: "خدمة سحب عينات منزلية متاحة على مدار الساعة", rating: 4.9, reviewCount: 278, isOpen: true, address: "خدمة منزلية", distance: "يصلك", priceRange: "60 - 500 ر.س", images: [0, 1], tags: ["سحب منزلي", "نتائج سريعة"] },
    ],
  },
  beauty: {
    title: "صالونات ومراكز التجميل",
    subtitle: "اعتني بجمالك مع أفضل المراكز",
    color: "#EC4899",
    providers: [
      { id: "beauty-1", name: "صالون لمسات الجمال", description: "صالون نسائي متكامل للعناية بالبشرة والشعر والمكياج", rating: 4.9, reviewCount: 523, isOpen: true, address: "حي الياسمين، الرياض", distance: "1.5 كم", priceRange: "80 - 500 ر.س", images: [0, 1], tags: ["تسريحات", "عناية بشرة", "مكياج"] },
      { id: "beauty-2", name: "سبا الهدوء", description: "سبا فاخر يقدم خدمات التدليك والساونا والعناية بالجسم", rating: 4.8, reviewCount: 412, isOpen: true, address: "حي الملقا، الرياض", distance: "3.7 كم", priceRange: "150 - 800 ر.س", images: [1, 0], tags: ["تدليك", "ساونا", "عناية جسم"] },
      { id: "beauty-3", name: "باربر شوب الأنيق", description: "صالون رجالي متخصص في الحلاقة والعناية باللحية", rating: 4.7, reviewCount: 287, isOpen: false, address: "حي العليا، الرياض", distance: "2.1 كم", priceRange: "50 - 200 ر.س", images: [0, 1], tags: ["حلاقة", "لحية", "تدليك"] },
    ],
  },
  trainers: {
    title: "التدريب الشخصي",
    subtitle: "مدربون معتمدون لتحقيق أهدافك",
    color: "#22C55E",
    providers: [
      { id: "trainer-1", name: "كابتن أحمد الفيصل", description: "مدرب لياقة بدنية معتمد - خبرة 8 سنوات في بناء الأجسام", rating: 4.9, reviewCount: 234, isOpen: true, address: "جيم فتنس تايم، الرياض", distance: "2.0 كم", priceRange: "200 - 400 ر.س", images: [0, 1], tags: ["لياقة", "بناء أجسام", "تغذية"] },
      { id: "trainer-2", name: "كابتن نورة العتيبي", description: "مدربة يوغا وبيلاتيس معتمدة - تدريب شخصي وجماعي", rating: 4.8, reviewCount: 187, isOpen: true, address: "استوديو زين، الرياض", distance: "3.4 كم", priceRange: "150 - 300 ر.س", images: [1, 0], tags: ["يوغا", "بيلاتيس", "مرونة"] },
      { id: "trainer-3", name: "كابتن خالد المطيري", description: "مدرب كروسفت وتمارين وظيفية - خطط تدريبية مخصصة", rating: 4.7, reviewCount: 156, isOpen: true, address: "جيم آيرون، الرياض", distance: "4.2 كم", priceRange: "180 - 350 ر.س", images: [0, 1], tags: ["كروسفت", "وظيفي", "قوة"] },
    ],
  },
  specialists: {
    title: "المختصون في الصحة والجمال",
    subtitle: "استشارات متخصصة مع نخبة الخبراء",
    color: "#F59E0B",
    providers: [
      { id: "spec-1", name: "د. سارة الأحمدي", description: "أخصائية تغذية علاجية - ماجستير في علوم التغذية من جامعة الملك سعود", rating: 4.9, reviewCount: 345, isOpen: true, address: "استشارة عن بعد / حضوري", distance: "أونلاين", priceRange: "150 - 300 ر.س", images: [0, 1], tags: ["تغذية", "حميات", "تخسيس"] },
      { id: "spec-2", name: "د. فهد الحربي", description: "استشاري أمراض جلدية وتجميل - زمالة بريطانية", rating: 4.8, reviewCount: 298, isOpen: true, address: "حي الصحافة، الرياض", distance: "3.8 كم", priceRange: "200 - 500 ر.س", images: [1, 0], tags: ["جلدية", "تجميل", "ليزر"] },
      { id: "spec-3", name: "أ. منال الشهري", description: "أخصائية نفسية إكلينيكية - متخصصة في القلق والاكتئاب", rating: 4.9, reviewCount: 267, isOpen: false, address: "استشارة عن بعد", distance: "أونلاين", priceRange: "200 - 350 ر.س", images: [0, 1], tags: ["نفسية", "قلق", "اكتئاب"] },
    ],
  },
};

export default function ProviderListScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPadding = isWeb ? 67 : insets.top;
  const data = PROVIDERS_DATA[type] || PROVIDERS_DATA.clinics;
  const providerImages = PROVIDER_IMAGES[type] || PROVIDER_IMAGES.clinics;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{data.title}</Text>
        <Pressable onPress={() => router.push("/bookings" as any)} style={styles.bookingsBtn}>
          <Feather name="calendar" size={20} color="#C490D8" />
          <Text style={styles.bookingsBtnText}>حجوزاتي</Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: colors.muted }]}>{data.subtitle}</Text>

      <View style={styles.providersList}>
        {data.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            providerImages={providerImages}
            providerType={type}
            colors={colors}
            isDark={isDark}
            themeColor={data.color}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function ProviderCard({
  provider,
  providerImages,
  providerType,
  colors,
  isDark,
  themeColor,
}: {
  provider: Provider;
  providerImages: any[];
  providerType: string;
  colors: any;
  isDark: boolean;
  themeColor: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = provider.images.map((idx: number) => providerImages[idx]);

  return (
    <Pressable
      style={[styles.providerCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}
      onPress={() => router.push(`/providers/detail/${provider.id}?type=${providerType}` as any)}
    >
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH - 2));
            setActiveImageIndex(idx);
          }}
          scrollEventThrottle={16}
        >
          {images.map((img: any, idx: number) => (
            <Image key={idx} source={img} style={styles.providerImage} resizeMode="cover" />
          ))}
        </ScrollView>

        <View style={[styles.statusBadge, { backgroundColor: provider.isOpen ? "#22C55E" : "#F43F5E" }]}>
          <Text style={styles.statusText}>{provider.isOpen ? "مفتوح" : "مغلق"}</Text>
        </View>

        <View style={styles.imageDots}>
          {images.map((_: any, idx: number) => (
            <View key={idx} style={[styles.dot, { backgroundColor: idx === activeImageIndex ? "#fff" : "rgba(255,255,255,0.5)" }]} />
          ))}
        </View>
      </View>

      <View style={styles.providerInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.providerName, { color: colors.text }]}>{provider.name}</Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingText, { color: "#F59E0B" }]}>⭐ {provider.rating}</Text>
            <Text style={[styles.reviewCount, { color: colors.muted }]}>({provider.reviewCount})</Text>
          </View>
        </View>

        <Text style={[styles.providerDesc, { color: colors.textSecondary }]} numberOfLines={2}>{provider.description}</Text>

        <View style={styles.tagsRow}>
          {provider.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: themeColor + "15" }]}>
              <Text style={[styles.tagText, { color: themeColor }]}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={13} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{provider.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="credit-card" size={13} color={colors.muted} />
            <Text style={[styles.metaText, { color: colors.muted }]}>{provider.priceRange}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold", flex: 1, textAlign: "center" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  bookingsBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "#C490D8" + "15", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  bookingsBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  subtitle: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", paddingHorizontal: 20, marginBottom: 16 },
  providersList: { paddingHorizontal: 20, gap: 16 },
  providerCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  imageContainer: { height: 180, position: "relative" },
  providerImage: { width: CARD_WIDTH - 2, height: 180 },
  statusBadge: { position: "absolute", top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  statusText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  imageDots: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  providerInfo: { padding: 16, gap: 10 },
  nameRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  providerName: { fontSize: 17, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1 },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginLeft: 8 },
  ratingText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewCount: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  providerDesc: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
  tagsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  metaItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
});
