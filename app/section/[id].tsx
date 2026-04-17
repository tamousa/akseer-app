import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
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

const SECTION_BANNERS: Record<string, any> = {
  nutrition: require("@/assets/images/nutrition-banner.png"),
  fitness: require("@/assets/images/fitness-banner.png"),
  mental: require("@/assets/images/mental-banner.png"),
  womens: require("@/assets/images/womens-banner.png"),
  mens: require("@/assets/images/mens-banner.png"),
  baby: require("@/assets/images/baby-banner.png"),
  beauty: require("@/assets/images/beauty-banner.png"),
  clinics: require("@/assets/images/clinics-banner.png"),
};

const SECTION_DATA: Record<string, any> = {
  nutrition: {
    title: "التغذية الصحية",
    subtitle: "تعلم كيف تتغذى بشكل صحيح",
    color: "#F59E0B",
    items: [
      { id: "1", title: "خطة النظام الغذائي المتوازن", sub: "خطة شاملة لأسبوع كامل", type: "plan", contentId: "nutrition-1" },
      { id: "2", title: "حساب السعرات الحرارية", sub: "احسب احتياجاتك اليومية", type: "calculator", contentId: "nutrition-2" },
      { id: "3", title: "وجبات لخسارة الوزن", sub: "وصفات صحية ولذيذة", type: "recipes", contentId: "nutrition-3" },
      { id: "4", title: "البروتين والكربوهيدرات", sub: "دليل المكملات الغذائية", type: "guide", contentId: "nutrition-4" },
      { id: "5", title: "تتبع وجباتك اليومية", sub: "سجل ما تأكله", type: "tracker", contentId: "nutrition-5" },
    ],
    tips: [
      "اشرب 8 أكواب ماء يومياً",
      "تناول 5 حصص من الخضار والفاكهة",
      "قلل السكر والملح في وجباتك",
      "لا تتخطى وجبة الإفطار",
    ],
  },
  fitness: {
    title: "الرياضة والتمارين",
    subtitle: "خطط تدريبية لجميع المستويات",
    color: "#F43F5E",
    items: [
      { id: "1", title: "خطة المبتدئين (30 يوم)", sub: "ابدأ رحلتك الرياضية", type: "plan", contentId: "fitness-1" },
      { id: "2", title: "تمارين الجيم المتقدمة", sub: "للمستوى المتوسط والمتقدم", type: "plan", contentId: "fitness-2" },
      { id: "3", title: "تمارين المنزل بدون أدوات", sub: "ابقَ في شكل بدون جيم", type: "home", contentId: "fitness-3" },
      { id: "4", title: "تمارين كارديو للدهون", sub: "احرق الدهون بفعالية", type: "cardio", contentId: "fitness-4" },
      { id: "5", title: "التمدد والمرونة", sub: "تعافَ بشكل صحيح", type: "stretch", contentId: "fitness-5" },
    ],
    tips: [
      "ارفع الأثقال 3-4 مرات أسبوعياً",
      "أضف 150 دقيقة كارديو أسبوعياً",
      "النوم الكافي أهم من التمرين",
      "دوَّم أكثر مما تكثف",
    ],
  },
  mental: {
    title: "الصحة النفسية",
    subtitle: "صحتك النفسية لا تقل أهمية",
    color: "#C490D8",
    items: [
      { id: "1", title: "تمارين التأمل اليومي", sub: "10 دقائق تغير يومك", type: "meditation", contentId: "mental-1" },
      { id: "2", title: "تقليل التوتر والقلق", sub: "تقنيات التنفس والاسترخاء", type: "stress", contentId: "mental-2" },
      { id: "3", title: "تحسين جودة النوم", sub: "نم أفضل وعش أسعد", type: "sleep", contentId: "mental-3" },
      { id: "4", title: "تعزيز الثقة بالنفس", sub: "تمارين ذهنية يومية", type: "confidence", contentId: "mental-4" },
      { id: "5", title: "استشارة نفسية", sub: "تحدث مع متخصص", type: "consult", contentId: "mental-5" },
    ],
    tips: [
      "خصص 10 دقائق للتأمل يومياً",
      "دوّن مشاعرك في مفكرة",
      "تحدث مع شخص تثق به",
      "قلل وقت الشاشات قبل النوم",
    ],
  },
  womens: {
    title: "صحة المرأة",
    subtitle: "رعاية شاملة لصحة المرأة",
    color: "#EC4899",
    items: [
      { id: "1", title: "متابعة الدورة الشهرية", sub: "تتبع وتوقع موعد دورتك", type: "cycle", route: "/section/womens-cycle" },
      { id: "2", title: "متابعة الحمل أسبوعاً بأسبوع", sub: "مراحل الحمل والتطور", type: "pregnancy", route: "/section/pregnancy" },
      { id: "3", title: "التغذية للحامل والمرضع", sub: "أهم العناصر الغذائية", type: "nutrition", contentId: "womens-2" },
      { id: "4", title: "ما بعد الولادة", sub: "التعافي والعودة للرياضة", type: "postpartum", contentId: "womens-4" },
      { id: "5", title: "صحة سن اليأس", sub: "التكيف مع التغيرات", type: "menopause", contentId: "womens-5" },
    ],
    tips: [
      "تناولي حمض الفوليك يومياً",
      "راجعي طبيبك بانتظام",
      "حافظي على نشاطك البدني",
      "اعتني بصحتك النفسية",
    ],
  },
  mens: {
    title: "صحة الرجل",
    subtitle: "قوة وحيوية وصحة مثالية",
    color: "#3B82F6",
    items: [
      { id: "1", title: "تعزيز الطاقة والحيوية", sub: "نمط حياة الرجل الصحي", type: "energy", contentId: "mens-1" },
      { id: "2", title: "بناء العضلات والقوة", sub: "برنامج تدريبي متكامل", type: "muscle", contentId: "mens-2" },
      { id: "3", title: "صحة القلب والأوعية", sub: "وقاية ومتابعة", type: "heart", contentId: "mens-3" },
      { id: "4", title: "إدارة التوتر والضغط", sub: "الصحة النفسية للرجل", type: "stress", contentId: "mens-4" },
      { id: "5", title: "الفحوصات الدورية", sub: "ما يجب فحصه سنوياً", type: "checkup", contentId: "mens-5" },
    ],
    tips: [
      "افحص ضغطك كل 6 أشهر",
      "تجنب التدخين والكحول",
      "مارس الرياضة بانتظام",
      "نم 7-8 ساعات يومياً",
    ],
  },
  baby: {
    title: "صحة الطفل",
    subtitle: "نمو صحي وتطور سليم",
    color: "#22C55E",
    items: [
      { id: "1", title: "مراحل نمو الطفل", sub: "من الولادة حتى 5 سنوات", type: "growth", contentId: "baby-1" },
      { id: "2", title: "التغذية والرضاعة", sub: "أفضل خيارات التغذية", type: "feeding", contentId: "baby-2" },
      { id: "3", title: "جدول التطعيمات", sub: "اللقاحات الأساسية", type: "vaccines", contentId: "baby-3" },
      { id: "4", title: "أمراض الطفولة الشائعة", sub: "الأعراض والعلاج", type: "diseases", contentId: "baby-4" },
      { id: "5", title: "النشاط والتطور الحركي", sub: "ألعاب تنشيطية ومفيدة", type: "activity", contentId: "baby-5" },
    ],
    tips: [
      "الرضاعة الطبيعية أفضل خيار",
      "راجع طبيب الأطفال دورياً",
      "تأكد من اكتمال التطعيمات",
      "العب مع طفلك يومياً",
    ],
  },
  beauty: {
    title: "العناية والجمال",
    subtitle: "اعتني بجمالك الطبيعي",
    color: "#F5D26A",
    items: [
      { id: "1", title: "روتين العناية بالبشرة", sub: "خطوات لبشرة مشرقة", type: "skincare", contentId: "beauty-1" },
      { id: "2", title: "العناية بالشعر", sub: "تغذية وصيانة", type: "hair", contentId: "beauty-2" },
      { id: "3", title: "حجز موعد صالون", sub: "صالونات قريبة منك", type: "salon", contentId: "beauty-3" },
      { id: "4", title: "المكياج الطبيعي", sub: "تعلمي الأساسيات", type: "makeup", contentId: "beauty-4" },
      { id: "5", title: "تفتيح البشرة طبيعياً", sub: "وصفات طبيعية فعالة", type: "recipes", contentId: "beauty-5" },
    ],
    tips: [
      "نظفي بشرتك مرتين يومياً",
      "استخدمي واقي الشمس دائماً",
      "اشربي الماء الكافي",
      "نومي جيداً لبشرة أفضل",
    ],
  },
  clinics: {
    title: "العيادات والمختبرات",
    subtitle: "خدمات طبية موثوقة",
    color: "#A86DBF",
    items: [
      { id: "1", title: "العيادات الطبية", sub: "احجز مع طبيبك المفضل", type: "clinics", route: "/section/clinics" },
      { id: "2", title: "المختبرات الطبية", sub: "مختبرات معتمدة قريبة منك", type: "labs", route: "/providers/labs" },
      { id: "3", title: "المختصون في الصحة", sub: "استشارات مع نخبة الخبراء", type: "specialists", route: "/providers/specialists" },
      { id: "4", title: "التدريب الشخصي", sub: "مدربون معتمدون لتحقيق أهدافك", type: "trainers", route: "/providers/trainers" },
      { id: "5", title: "صالونات التجميل", sub: "مراكز العناية والجمال", type: "beauty", route: "/providers/beauty" },
    ],
    tips: [
      "افحص صحتك سنوياً",
      "لا تؤجل استشارة الطبيب",
      "احتفظ بسجلاتك الطبية",
      "اتبع تعليمات طبيبك دائماً",
    ],
  },
};

export default function SectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPadding = isWeb ? 67 : insets.top;
  const section = SECTION_DATA[id] || SECTION_DATA.nutrition;
  const bannerImage = SECTION_BANNERS[id] || SECTION_BANNERS.nutrition;

  const handleItemPress = (item: any) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.contentId) {
      router.push(`/section/content/${item.contentId}` as any);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.bannerWrap}>
        <Image source={bannerImage} style={styles.bannerImage} resizeMode="cover" />
        <View style={styles.bannerOverlay} />
        <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="chevron-right" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { fontFamily: "Cairo_700Bold" }]}>{section.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: "Tajawal_400Regular" }]}>{section.subtitle}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.tipsCard, { backgroundColor: section.color + "15", borderColor: section.color + "30" }]}>
        <Text style={[styles.cardTitle, { color: section.color, fontFamily: "Cairo_700Bold" }]}>
          نصائح سريعة
        </Text>
        {section.tips.map((tip: string, idx: number) => (
          <View key={idx} style={styles.tipRow}>
            <View style={[styles.tipDot, { backgroundColor: section.color }]} />
            <Text style={[styles.tipTxt, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>
              {tip}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Cairo_700Bold" }]}>
          المحتوى
        </Text>
        {section.items.map((item: any) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.contentItem,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => handleItemPress(item)}
          >
            <Feather name="chevron-left" size={20} color={colors.muted} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>
                {item.title}
              </Text>
              <Text style={[styles.itemSub, { color: colors.muted, fontFamily: "Tajawal_400Regular" }]}>
                {item.sub}
              </Text>
            </View>
            <View style={[styles.itemIcon, { backgroundColor: section.color + "20" }]}>
              <Feather name="arrow-left" size={16} color={section.color} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bannerWrap: { height: 220, position: "relative" },
  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  header: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 32 },
  backBtn: { marginBottom: 20 },
  headerContent: { alignItems: "flex-end", gap: 8 },
  title: { color: "#fff", fontSize: 26, textAlign: "right" },
  subtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "right" },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: -16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    gap: 10,
    zIndex: 1,
  },
  cardTitle: { fontSize: 16, textAlign: "right", marginBottom: 4 },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  tipTxt: { flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" },
  section: { paddingHorizontal: 20, gap: 12 },
  sectionLabel: { fontSize: 18, textAlign: "right", marginBottom: 4 },
  contentItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  itemTitle: { fontSize: 15, textAlign: "right", marginBottom: 3 },
  itemSub: { fontSize: 12, textAlign: "right" },
  itemIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
