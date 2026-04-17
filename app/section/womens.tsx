import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
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
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const HUB_HERO = require("@/assets/images/womens-hub-hero.png");

const FEATURES = [
  {
    id: "cycle",
    titleAr: "الدورة الشهرية", titleEn: "Monthly Cycle",
    subtitleAr: "تقويم ذكي، تتبع الأعراض، والخصوبة", subtitleEn: "Smart calendar, symptom tracking & fertility",
    image: require("@/assets/images/womens-cycle-art.png"),
    gradient: ["#E8849Ecc", "#D4568Acc"] as const,
    route: "/section/womens-cycle",
    tagsAr: ["تقويم ملون", "أعراض", "خصوبة"],
    tagsEn: ["Color Calendar", "Symptoms", "Fertility"],
    badge: "🌸",
  },
  {
    id: "pregnancy",
    titleAr: "متابعة الحمل", titleEn: "Pregnancy Tracker",
    subtitleAr: "رحلة أمومتك أسبوعاً بأسبوع مع مقارنة الفواكه", subtitleEn: "Your maternity journey week by week with fruit comparisons",
    image: require("@/assets/images/womens-pregnancy-art.png"),
    gradient: ["#C490D8cc", "#A86DBFcc"] as const,
    route: "/section/pregnancy",
    tagsAr: ["حجم الجنين", "عد الحركات", "حقيبة المستشفى"],
    tagsEn: ["Baby Size", "Kick Counter", "Hospital Bag"],
    badge: "🤰",
  },
  {
    id: "beauty",
    titleAr: "العناية بالبشرة والشعر", titleEn: "Skin & Hair Care",
    subtitleAr: "روتين يومي مخصص + فحص المكونات", subtitleEn: "Personalized daily routine + ingredient check",
    image: require("@/assets/images/womens-beauty-art.png"),
    gradient: ["#F9A8D4cc", "#EC4899cc"] as const,
    route: "/section/womens-beauty",
    tagsAr: ["روتين صباحي", "فحص مكونات", "صالونات"],
    tagsEn: ["Morning Routine", "Ingredient Check", "Salons"],
    badge: "✨",
  },
  {
    id: "hormones",
    titleAr: "صحة الهرمونات", titleEn: "Hormonal Health",
    subtitleAr: "راقبي توازنك وسجّلي نتائج التحاليل", subtitleEn: "Monitor your balance and log test results",
    image: require("@/assets/images/womens-hormones-art.png"),
    gradient: ["#34D399cc", "#10B981cc"] as const,
    route: "/section/womens-hormones",
    tagsAr: ["نتائج تحاليل", "توازن هرموني", "مختبرات"],
    tagsEn: ["Lab Results", "Hormonal Balance", "Labs"],
    badge: "🔬",
  },
];

const DAILY_PHASE_TIPS: Record<string, { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; color: string; emoji: string }> = {
  period:   { titleAr: "أيام الطمث",       titleEn: "Period Days",       bodyAr: "استريحي، كمادات دافئة تخفف الألم. قللي الملح والسكر لتجنب الانتفاخ.", bodyEn: "Rest, warm compresses relieve pain. Reduce salt and sugar to avoid bloating.", color: "#D4568A", emoji: "🌹" },
  fertile:  { titleAr: "أيام الخصوبة",     titleEn: "Fertile Days",      bodyAr: "ذروة الطاقة! مثالية للتمارين القوية والاجتماعات المهمة.", bodyEn: "Peak energy! Ideal for intense workouts and important meetings.", color: "#A86DBF", emoji: "🌺" },
  ovulation:{ titleAr: "يوم الإباضة",      titleEn: "Ovulation Day",     bodyAr: "أعلى مستوى خصوبة اليوم. الجسم في أحسن حالاته.", bodyEn: "Highest fertility today. Your body is at its best.", color: "#A86DBF", emoji: "🥚" },
  luteal:   { titleAr: "ما قبل الطمث",     titleEn: "Pre-Period Phase",  bodyAr: "قد تشعرين ببعض التوتر. المغنيسيوم والشوكولاتة الداكنة تساعدان.", bodyEn: "You may feel some tension. Magnesium and dark chocolate help.", color: "#E8849E", emoji: "🌙" },
  default:  { titleAr: "نصيحة اليوم",      titleEn: "Today's Tip",       bodyAr: "اشربي 8 أكواب ماء وتذكري أن جسمك يعمل بذكاء كل يوم.", bodyEn: "Drink 8 glasses of water and remember your body works smartly every day.", color: "#A86DBF", emoji: "💜" },
};

const UNIQUE_FEATURES = [
  { emoji: "🧬", titleAr: "فحص الخصوبة",         titleEn: "Fertility Check",      descAr: "نسبة احتمالية الحمل لكل يوم",        descEn: "Pregnancy probability for each day" },
  { emoji: "👶", titleAr: "عداد حركات الجنين",    titleEn: "Kick Counter",         descAr: "راقبي حركات طفلك يومياً",            descEn: "Monitor your baby's movements daily" },
  { emoji: "🔍", titleAr: "فحص مكونات المنتج",   titleEn: "Ingredient Scanner",   descAr: "هل هذا المكوّن آمن لك؟",             descEn: "Is this ingredient safe for you?" },
  { emoji: "📊", titleAr: "تقرير صحي شهري",      titleEn: "Monthly Health Report", descAr: "ملخص كامل لصحتك الهرمونية",          descEn: "Complete summary of your hormonal health" },
];

export default function WomensScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const { cycleData, pregnancyData } = useApp();

  const cycleStatus = useMemo(() => {
    if (!cycleData.lastPeriodStart) return null;
    const start = new Date(cycleData.lastPeriodStart);
    const today = new Date();
    const day = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    if (day < 1 || day > cycleData.cycleLength) return null;

    const nextPeriod = new Date(start);
    nextPeriod.setDate(nextPeriod.getDate() + cycleData.cycleLength);
    const daysLeft = Math.ceil((nextPeriod.getTime() - today.getTime()) / 86400000);

    let phaseKey = "default";
    if (day <= cycleData.periodLength) phaseKey = "period";
    else if (day >= cycleData.cycleLength - 16 && day <= cycleData.cycleLength - 12) phaseKey = "fertile";
    else if (day === cycleData.cycleLength - 14) phaseKey = "ovulation";
    else if (day > cycleData.cycleLength - 12) phaseKey = "luteal";

    return { day, daysLeft, phaseKey };
  }, [cycleData]);

  const pregnancyWeek = useMemo(() => {
    if (!pregnancyData.isPregnant || !pregnancyData.lastPeriodDate) return null;
    const start = new Date(pregnancyData.lastPeriodDate);
    return Math.min(Math.floor((new Date().getTime() - start.getTime()) / (7 * 86400000)), 40);
  }, [pregnancyData]);

  const tipData = DAILY_PHASE_TIPS[cycleStatus?.phaseKey ?? "default"];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroWrap, { paddingTop: topPadding }]}>
        <Image source={HUB_HERO} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(168,109,191,0.55)", "rgba(212,86,138,0.85)"]}
          style={styles.heroGradient}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={24} color="#fff" />
          </Pressable>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{t("صحة المرأة والطفل 👩‍⚕️", "Women & Child Health 👩‍⚕️")}</Text>
            <Text style={styles.heroSub}>{t("رفيقتك في كل مرحلة من حياتك الكريمة", "Your companion at every stage of your life")}</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: "#D4568A44" }]}>
          <Text style={styles.statEmoji}>🌸</Text>
          {cycleStatus ? (
            <>
              <Text style={[styles.statNum, { color: "#D4568A" }]}>{cycleStatus.day}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("اليوم الحالي", "Current Day")}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.statNum, { color: "#D4568A", fontSize: 14 }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("سجّلي دورتك", "Log Cycle")}</Text>
            </>
          )}
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: "#E8849E44" }]}>
          <Text style={styles.statEmoji}>📆</Text>
          {cycleStatus ? (
            <>
              <Text style={[styles.statNum, { color: "#E8849E" }]}>{cycleStatus.daysLeft}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("للدورة القادمة", "To Next Period")}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.statNum, { color: "#E8849E", fontSize: 14 }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("للدورة القادمة", "To Next Period")}</Text>
            </>
          )}
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: "#A86DBF44" }]}>
          <Text style={styles.statEmoji}>🤰</Text>
          {pregnancyWeek ? (
            <>
              <Text style={[styles.statNum, { color: "#A86DBF" }]}>{pregnancyWeek}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("أسبوع الحمل", "Preg. Week")}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.statNum, { color: "#A86DBF", fontSize: 14 }]}>—</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{t("متابعة الحمل", "Pregnancy")}</Text>
            </>
          )}
        </View>
      </View>

      <View style={[styles.phaseTip, { backgroundColor: tipData.color + "15", borderColor: tipData.color + "30" }]}>
        <Text style={{ fontSize: 28 }}>{tipData.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.phaseTipTitle, { color: tipData.color }]}>{lang === "ar" ? tipData.titleAr : tipData.titleEn}</Text>
          <Text style={[styles.phaseTipBody, { color: colors.text }]}>{lang === "ar" ? tipData.bodyAr : tipData.bodyEn}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("اختاري ما يناسبك", "Choose What Suits You")}</Text>
        <Text style={[styles.sectionSub, { color: colors.muted }]}>{t("4 أقسام متكاملة لصحتك", "4 integrated sections for your health")}</Text>
      </View>

      <View style={styles.featureCards}>
        {FEATURES.map((f) => (
          <Pressable key={f.id} onPress={() => router.push(f.route as any)} style={styles.featureCard}>
            <Image source={f.image} style={styles.featureCardImage} resizeMode="cover" />
            <LinearGradient colors={f.gradient} style={styles.featureCardOverlay}>
              <View style={styles.featureCardContent}>
                <View style={styles.featureCardLeft}>
                  <Text style={styles.featureBadge}>{f.badge}</Text>
                </View>
                <View style={styles.featureCardText}>
                  <Text style={styles.featureTitle}>{lang === "ar" ? f.titleAr : f.titleEn}</Text>
                  <Text style={styles.featureSubtitle}>{lang === "ar" ? f.subtitleAr : f.subtitleEn}</Text>
                  <View style={styles.featureTags}>
                    {(lang === "ar" ? f.tagsAr : f.tagsEn).map((tag) => (
                      <View key={tag} style={styles.featureTag}>
                        <Text style={styles.featureTagTxt}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.featureArrow}>
                  <Feather name="chevron-left" size={18} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      <View style={styles.uniqueSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("مميزات فريدة في أكسير ✨", "Unique Akseer Features ✨")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingLeft: 4 }}>
          {UNIQUE_FEATURES.map((f, i) => (
            <View key={i} style={[styles.uniqueCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={styles.uniqueEmoji}>{f.emoji}</Text>
              <Text style={[styles.uniqueTitle, { color: colors.text }]}>{lang === "ar" ? f.titleAr : f.titleEn}</Text>
              <Text style={[styles.uniqueDesc, { color: colors.muted }]}>{lang === "ar" ? f.descAr : f.descEn}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.bannerWrap} onPress={() => router.push("/section/clinics" as any)}>
        <LinearGradient colors={["#A86DBF", "#D4568A"]} style={styles.banner}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>{t("احجزي موعدك الآن 📅", "Book Your Appointment 📅")}</Text>
              <Text style={styles.bannerSub}>{t("عيادات نسائية • مختبرات • صالونات تجميل", "Women's clinics • Labs • Beauty salons")}</Text>
            </View>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnTxt}>{t("احجزي", "Book")}</Text>
              <Feather name="arrow-left" size={14} color="#A86DBF" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroWrap: { height: 260, position: "relative" },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  heroGradient: { flex: 1, paddingHorizontal: 20, paddingBottom: 20, justifyContent: "space-between" },
  backBtn: { alignSelf: "flex-start", width: 36, height: 36, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 8 },
  heroText: { gap: 4 },
  heroTitle: { color: "#fff", fontSize: 24, fontFamily: "Cairo_700Bold", textAlign: "right", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroSub: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statusRow: { flexDirection: "row-reverse", paddingHorizontal: 20, marginTop: 14, gap: 10 },
  statCard: { flex: 1, borderRadius: 18, padding: 12, borderWidth: 1, alignItems: "center", gap: 3, elevation: 2, shadowColor: "#A86DBF", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
  statEmoji: { fontSize: 20 },
  statNum: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "center" },
  statLabel: { fontSize: 9, fontFamily: "Tajawal_500Medium", textAlign: "center" },
  phaseTip: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginHorizontal: 20, marginTop: 14, borderRadius: 18, padding: 16, borderWidth: 1 },
  phaseTipTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 2 },
  phaseTipBody: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 18 },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 24, gap: 2 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  sectionSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  featureCards: { paddingHorizontal: 20, paddingTop: 14, gap: 14 },
  featureCard: { height: 130, borderRadius: 22, overflow: "hidden", elevation: 6 },
  featureCardImage: { width: "100%", height: "100%", position: "absolute" },
  featureCardOverlay: { flex: 1, padding: 16 },
  featureCardContent: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  featureCardLeft: { width: 52, height: 52, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  featureBadge: { fontSize: 26 },
  featureCardText: { flex: 1, gap: 4 },
  featureTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", textShadowColor: "rgba(0,0,0,0.2)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  featureSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  featureTags: { flexDirection: "row-reverse", gap: 6, flexWrap: "wrap", marginTop: 4 },
  featureTag: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  featureTagTxt: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_500Medium" },
  featureArrow: { width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  uniqueSection: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  uniqueCard: { width: 140, borderRadius: 18, padding: 14, borderWidth: 1, gap: 8, alignItems: "flex-end" },
  uniqueEmoji: { fontSize: 28 },
  uniqueTitle: { fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "right" },
  uniqueDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 16 },
  bannerWrap: { marginHorizontal: 20, marginTop: 24, borderRadius: 22, overflow: "hidden" },
  banner: { padding: 20 },
  bannerContent: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  bannerTitle: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bannerSub: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  bannerBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  bannerBtnTxt: { color: "#A86DBF", fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
