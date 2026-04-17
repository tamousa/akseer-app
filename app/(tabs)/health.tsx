import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  I18nManager,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

// ──────────── Animated Ring (SVG-free, layered View ring with progress arc-like effect) ────────────
function ProgressRing({ size = 90, stroke = 9, progress, color, bg }: { size?: number; stroke?: number; progress: number; color: string; bg: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: Math.min(1, Math.max(0, progress)), duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progress]);
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const half = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Background ring */}
      <View style={{ position: "absolute", width: size, height: size, borderRadius: half, borderWidth: stroke, borderColor: bg }} />
      {/* Animated progress sweep using rotation of a half-mask */}
      <Animated.View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: half,
          borderWidth: stroke,
          borderColor: "transparent",
          borderTopColor: color,
          borderRightColor: color,
          transform: [{ rotate }],
        }}
      />
    </View>
  );
}

// Animated horizontal progress bar
function ProgressBar({ value, max, color, bg, height = 8 }: { value: number; max: number; color: string; bg: string; height?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [pct]);
  const w = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  return (
    <View style={{ width: "100%", height, backgroundColor: bg, borderRadius: height / 2, overflow: "hidden" }}>
      <Animated.View style={{ height: "100%", width: w as any, backgroundColor: color, borderRadius: height / 2 }} />
    </View>
  );
}

export default function HealthScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { t, lang } = useLanguage();
  const {
    waterIntake,
    addWaterGlass,
    workoutLogs,
    todayNutrition,
    nutritionGoal,
    sleepHours,
    steps,
    userGoals,
    setUserGoals,
  } = useApp();

  const topPadding = isWeb ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"numbers" | "health" | "care" | "calc">("numbers");
  const [editGoals, setEditGoals] = useState(false);
  const [tmpGoals, setTmpGoals] = useState(userGoals);

  useEffect(() => { setTmpGoals(userGoals); }, [userGoals]);

  const today = new Date().toISOString().split("T")[0];
  const todayWorkouts = workoutLogs.filter((w) => w.date === today);
  const caloriesBurned = todayWorkouts.reduce((s, w) => s + w.calories, 0);
  const activeMinutes = todayWorkouts.reduce((s, w) => s + w.duration, 0);

  const metrics = [
    { id: "water",    emoji: "💧", labelAr: "شرب الماء",     labelEn: "Hydration", value: waterIntake.glasses,         goal: userGoals.water,         unitAr: "كوب",   unitEn: "cups",  color: "#3B82F6", bg: "rgba(59,130,246,0.12)", action: addWaterGlass },
    { id: "calories", emoji: "🔥", labelAr: "السعرات",        labelEn: "Calories",  value: caloriesBurned,              goal: userGoals.caloriesBurn,  unitAr: "سعرة",  unitEn: "kcal",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    { id: "sleep",    emoji: "😴", labelAr: "النوم",           labelEn: "Sleep",     value: sleepHours,                  goal: userGoals.sleep,         unitAr: "ساعة",  unitEn: "hrs",   color: "#A86DBF", bg: "rgba(168,109,191,0.14)" },
    { id: "active",   emoji: "🏃", labelAr: "النشاط الرياضي", labelEn: "Activity",  value: activeMinutes,               goal: userGoals.activeMinutes, unitAr: "دقيقة", unitEn: "min",   color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
    { id: "steps",    emoji: "👟", labelAr: "الخطوات",         labelEn: "Steps",     value: steps,                       goal: userGoals.steps,         unitAr: "خطوة",  unitEn: "steps", color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
    { id: "nutrition",emoji: "🥗", labelAr: "التغذية",         labelEn: "Nutrition", value: todayNutrition.calories || 0,goal: nutritionGoal.calories,  unitAr: "سعرة",  unitEn: "kcal",  color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  ];

  const overallProgress = Math.round(metrics.reduce((s, m) => s + Math.min(1, m.value / m.goal), 0) / metrics.length * 100);

  const HEALTH_SECTIONS = [
    { id: "nutrition", titleAr: "التغذية",                titleEn: "Nutrition",            descAr: "خطط وجباتك وتتبع سعراتك", descEn: "Plan meals & track calories", emoji: "🥗", color: "#F59E0B", route: "/section/nutrition-plan" },
    { id: "fitness",   titleAr: "التمارين الرياضية",       titleEn: "Fitness",              descAr: "برنامج تدريبي شخصي",       descEn: "Personalized training",       emoji: "🏋️", color: "#F43F5E", route: "/section/fitness" },
    { id: "womens",    titleAr: "صحة المرأة والطفل",       titleEn: "Women & Child Health", descAr: "الدورة، الحمل، الجمال",     descEn: "Cycle, pregnancy, beauty",     emoji: "🌸", color: "#EC4899", route: "/section/womens" },
    { id: "mens",      titleAr: "صحة الرجل",              titleEn: "Men's Health",         descAr: "هرمونات وعافية للرجل",       descEn: "Hormones & men's wellness",    emoji: "💪", color: "#3B82F6", route: "/section/mens" },
    { id: "mental",    titleAr: "الصحة النفسية",           titleEn: "Mental Health",        descAr: "تأمل ومزاج وجلسات دعم",     descEn: "Mood, meditation & support",   emoji: "🧠", color: "#A86DBF", route: "/section/mental" },
  ];

  const CARE_SECTIONS = [
    { id: "clinics",     titleAr: "العيادات والاستشارات", titleEn: "Clinics & Consultations", descAr: "استشارات معتمدة من المختصين", descEn: "Certified specialist consultations", emoji: "🩺", color: "#A86DBF", route: "/section/clinics" },
    { id: "labs",        titleAr: "المختبرات",            titleEn: "Laboratories",            descAr: "احجز فحوصاتك من المنزل",       descEn: "Book lab tests from home",            emoji: "🔬", color: "#3B82F6", route: "/section/labs" },
    { id: "specialists", titleAr: "المختصون",             titleEn: "Specialists",             descAr: "أطباء، مدربون ومختصو تغذية",   descEn: "Doctors, trainers & nutritionists",   emoji: "👨‍⚕️", color: "#F59E0B", route: "/providers/specialists" },
    { id: "rehab",       titleAr: "العلاج الطبيعي",        titleEn: "Physiotherapy",           descAr: "جلسات تأهيل وعلاج طبيعي",      descEn: "Rehab & physiotherapy sessions",      emoji: "🤸", color: "#0EA5E9", route: "/section/rehab" },
    { id: "cupping",     titleAr: "الحجامة",               titleEn: "Cupping",                 descAr: "حجامة وعلاج بديل",            descEn: "Cupping & alternative care",          emoji: "🫙", color: "#EF4444", route: "/section/cupping" },
  ];

  const CALCULATORS = [
    { id: "calories", titleAr: "السعرات",       titleEn: "Calories",       emoji: "🔥", color: "#F59E0B" },
    { id: "bmi",      titleAr: "الجسم والوزن",  titleEn: "BMI & Weight",   emoji: "⚖️", color: "#3B82F6" },
    { id: "heart",    titleAr: "خطر القلب",     titleEn: "Heart Risk",     emoji: "❤️", color: "#F43F5E" },
    { id: "diabetes", titleAr: "خطر السكري",    titleEn: "Diabetes Risk",  emoji: "💉", color: "#A86DBF" },
    { id: "water",    titleAr: "احتياج الماء",  titleEn: "Water Needs",    emoji: "💧", color: "#0EA5E9" },
    { id: "protein",  titleAr: "احتياج البروتين",titleEn: "Protein Needs",  emoji: "🥩", color: "#10B981" },
  ];

  const TABS = [
    { id: "numbers", labelAr: "أرقامي",             labelEn: "My Numbers",  emoji: "📊" },
    { id: "health",  labelAr: "صحتك",                labelEn: "Your Health", emoji: "💚" },
    { id: "care",    labelAr: "الرعاية الطبية",       labelEn: "Care",        emoji: "🩺" },
    { id: "calc",    labelAr: "الحاسبات",             labelEn: "Calculators", emoji: "🧮" },
  ] as const;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══ Header ═══ */}
      <LinearGradient
        colors={isDark ? ["#1A0B2E", "#2A1450"] : ["#F8F0FF", "#FDF6FA"]}
        style={[styles.header, { paddingTop: topPadding + 14 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t("صحتي", "My Health")}</Text>
            <Text style={[styles.headerSub, { color: colors.muted }]}>
              {t("ملخص يومي وتفاعلي لأرقامك الصحية", "Your daily interactive health summary")}
            </Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{overallProgress}</Text>
            <Text style={styles.scorePct}>%</Text>
          </View>
        </View>

        {/* ═══ Tabs ═══ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 8, paddingTop: 16 }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[styles.tab, { backgroundColor: active ? "#A86DBF" : isDark ? "rgba(255,255,255,0.06)" : "rgba(168,109,191,0.08)", borderColor: active ? "#A86DBF" : "transparent" }]}
              >
                <Text style={{ fontSize: 14 }}>{tab.emoji}</Text>
                <Text style={[styles.tabText, { color: active ? "#fff" : colors.text }]}>{t(tab.labelAr, tab.labelEn)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* ═══════════════ TAB: أرقامي ═══════════════ */}
      {activeTab === "numbers" && (
        <View>
          {/* Hero summary card */}
          <View style={[styles.heroCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <Image source={require("@/assets/images/yoga-sunrise.png")} style={styles.heroImg} resizeMode="cover" />
            <LinearGradient colors={["rgba(168,109,191,0.0)", "rgba(168,109,191,0.85)", "rgba(60,10,100,0.95)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>📊 {t("أرقامي اليوم", "Today's Stats")}</Text>
              </View>
              <Text style={styles.heroTitle}>{t(overallProgress >= 80 ? "أداء ممتاز اليوم 🌟" : overallProgress >= 50 ? "أنت على الطريق الصحيح! 💪" : "ابدأ يومك بشكل صحي 🌱", overallProgress >= 80 ? "Excellent today 🌟" : overallProgress >= 50 ? "You're on track! 💪" : "Start your day healthy 🌱")}</Text>
              <Text style={styles.heroSub}>{t(`أنجزت ${overallProgress}% من أهدافك اليومية`, `${overallProgress}% of today's goals completed`)}</Text>
              <Pressable style={styles.heroEditBtn} onPress={() => setEditGoals(true)}>
                <Feather name="sliders" size={14} color="#fff" />
                <Text style={styles.heroEditBtnText}>{t("تعديل أهدافي", "Edit my goals")}</Text>
              </Pressable>
            </View>
          </View>

          {/* Metric cards grid */}
          <View style={styles.metricsGrid}>
            {metrics.map((m) => {
              const pct = Math.min(100, Math.round((m.value / m.goal) * 100));
              return (
                <View
                  key={m.id}
                  style={[styles.metricCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                >
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricBadge, { backgroundColor: m.bg }]}>
                      <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                    </View>
                    <Text style={[styles.metricPct, { color: m.color }]}>{pct}%</Text>
                  </View>
                  <Text style={[styles.metricLabel, { color: colors.muted }]}>{t(m.labelAr, m.labelEn)}</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={[styles.metricVal, { color: colors.text }]}>{m.id === "sleep" ? m.value.toFixed(1) : m.value.toLocaleString()}</Text>
                    <Text style={[styles.metricGoal, { color: colors.muted }]}>/ {m.goal.toLocaleString()} {t(m.unitAr, m.unitEn)}</Text>
                  </View>
                  <ProgressBar value={m.value} max={m.goal} color={m.color} bg={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"} />
                  {m.action && (
                    <Pressable onPress={m.action} style={[styles.metricAction, { backgroundColor: m.color + "18" }]}>
                      <Feather name="plus" size={12} color={m.color} />
                      <Text style={[styles.metricActionText, { color: m.color }]}>{t("أضف كوب", "Add cup")}</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>

          {/* Weekly chart preview */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <View style={styles.chartHeader}>
              <Pressable onPress={() => router.push("/section/fitness" as any)}>
                <Text style={[styles.chartLink, { color: "#A86DBF" }]}>{t("التفاصيل", "Details")} ←</Text>
              </Pressable>
              <Text style={[styles.chartTitle, { color: colors.text }]}>📈 {t("نشاطك هذا الأسبوع", "This Week's Activity")}</Text>
            </View>
            <View style={styles.weekChart}>
              {[420, 310, 580, 450, 670, 380, caloriesBurned || 220].map((v, i) => {
                const maxV = 800;
                const h = Math.max(8, (v / maxV) * 100);
                const isToday = i === 6;
                return (
                  <View key={i} style={styles.weekBar}>
                    <View style={[styles.weekBarTrack, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]}>
                      <View style={{ height: `${h}%`, backgroundColor: isToday ? "#A86DBF" : "#A86DBF80", borderRadius: 6, marginTop: "auto" }} />
                    </View>
                    <Text style={[styles.weekBarLbl, { color: isToday ? "#A86DBF" : colors.muted, fontFamily: isToday ? "Tajawal_700Bold" : "Tajawal_400Regular" }]}>
                      {[t("سبت","Sat"),t("أحد","Sun"),t("اثنين","Mon"),t("ثلاثاء","Tue"),t("أربعاء","Wed"),t("خميس","Thu"),t("اليوم","Today")][i]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Insight banner */}
          <Pressable
            style={styles.insightBanner}
            onPress={() => router.push("/section/ai-chat" as any)}
          >
            <LinearGradient colors={["#A86DBF", "#6D28D9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.insightContent}>
              <View style={styles.insightAvatar}>
                <Text style={{ fontSize: 28 }}>🤖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.insightTitle}>{t("مساعدك الصحي الذكي", "Your AI Health Coach")}</Text>
                <Text style={styles.insightSub}>{t("احصل على نصائح مخصصة بناءً على أرقامك", "Get personalized tips based on your stats")}</Text>
              </View>
              <Feather name="chevron-left" size={22} color="#fff" />
            </View>
          </Pressable>
        </View>
      )}

      {/* ═══════════════ TAB: صحتك ═══════════════ */}
      {activeTab === "health" && (
        <View style={{ paddingTop: 4 }}>
          <View style={[styles.bannerCard, { backgroundColor: "#EC4899" }]}>
            <Image source={require("@/assets/images/womens-hub-hero.png")} style={styles.bannerImg} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(236,72,153,0.85)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerInner}>
              <Text style={styles.bannerTitle}>{t("جميع جوانب صحتك في مكان واحد 💚", "All your health in one place 💚")}</Text>
              <Text style={styles.bannerSub}>{t("استكشف الأقسام لتصل لأهدافك بأسرع وقت", "Explore sections to reach your goals faster")}</Text>
            </View>
          </View>

          <View style={styles.sectionPad}>
            {HEALTH_SECTIONS.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.bigCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                onPress={() => router.push(s.route as any)}
              >
                <View style={[styles.bigCardIcon, { backgroundColor: s.color + "1A" }]}>
                  <Text style={{ fontSize: 30 }}>{s.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bigCardTitle, { color: colors.text }]}>{t(s.titleAr, s.titleEn)}</Text>
                  <Text style={[styles.bigCardDesc, { color: colors.muted }]}>{t(s.descAr, s.descEn)}</Text>
                </View>
                <View style={[styles.bigCardArrow, { backgroundColor: s.color + "12" }]}>
                  <Feather name={lang === "en" ? "chevron-right" : "chevron-left"} size={18} color={s.color} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* ═══════════════ TAB: الرعاية الطبية ═══════════════ */}
      {activeTab === "care" && (
        <View style={{ paddingTop: 4 }}>
          <View style={[styles.bannerCard, { backgroundColor: "#A86DBF" }]}>
            <Image source={require("@/assets/images/clinics-banner.png")} style={styles.bannerImg} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(60,10,100,0.9)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerInner}>
              <Text style={styles.bannerTitle}>{t("رعاية طبية معتمدة 🏥", "Certified Medical Care 🏥")}</Text>
              <Text style={styles.bannerSub}>{t("احجز موعدك مع أفضل المختصين", "Book with top specialists")}</Text>
            </View>
          </View>

          <View style={styles.sectionPad}>
            {CARE_SECTIONS.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.bigCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                onPress={() => router.push(s.route as any)}
              >
                <View style={[styles.bigCardIcon, { backgroundColor: s.color + "1A" }]}>
                  <Text style={{ fontSize: 30 }}>{s.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bigCardTitle, { color: colors.text }]}>{t(s.titleAr, s.titleEn)}</Text>
                  <Text style={[styles.bigCardDesc, { color: colors.muted }]}>{t(s.descAr, s.descEn)}</Text>
                </View>
                <View style={[styles.bigCardArrow, { backgroundColor: s.color + "12" }]}>
                  <Feather name={lang === "en" ? "chevron-right" : "chevron-left"} size={18} color={s.color} />
                </View>
              </Pressable>
            ))}

            <Pressable
              style={[styles.emergencyCard, { backgroundColor: "#EF4444" }]}
              onPress={() => router.push("/section/clinics" as any)}
            >
              <View style={styles.emergencyIcon}>
                <MaterialCommunityIcons name="ambulance" size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.emergencyTitle}>{t("استشارة طارئة", "Emergency Consultation")}</Text>
                <Text style={styles.emergencySub}>{t("تواصل مع طبيب خلال دقائق", "Reach a doctor within minutes")}</Text>
              </View>
              <View style={styles.emergencyBtn}>
                <Text style={styles.emergencyBtnText}>{t("اتصل", "Call")}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}

      {/* ═══════════════ TAB: الحاسبات ═══════════════ */}
      {activeTab === "calc" && (
        <View style={{ paddingTop: 4 }}>
          <View style={[styles.bannerCard, { backgroundColor: "#3B82F6" }]}>
            <Image source={require("@/assets/images/nutrition-banner.png")} style={styles.bannerImg} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(59,130,246,0.92)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerInner}>
              <Text style={styles.bannerTitle}>{t("حاسباتك الصحية الذكية 🧮", "Smart Health Calculators 🧮")}</Text>
              <Text style={styles.bannerSub}>{t("احسب أرقامك بدقة وتعرّف على وضعك", "Calculate your numbers accurately")}</Text>
            </View>
          </View>

          <View style={styles.sectionPad}>
            <View style={styles.calcGrid}>
              {CALCULATORS.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.calcCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                  onPress={() => router.push(`/calculator/${c.id}` as any)}
                >
                  <View style={[styles.calcIcon, { backgroundColor: c.color + "1A" }]}>
                    <Text style={{ fontSize: 32 }}>{c.emoji}</Text>
                  </View>
                  <Text style={[styles.calcTitle, { color: colors.text }]}>{t(c.titleAr, c.titleEn)}</Text>
                  <View style={[styles.calcBadge, { backgroundColor: c.color + "15" }]}>
                    <Text style={[styles.calcBadgeText, { color: c.color }]}>{t("احسب", "Calculate")}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* ═══ Edit Goals Modal ═══ */}
      <Modal visible={editGoals} transparent animationType="slide" onRequestClose={() => setEditGoals(false)}>
        <Pressable style={styles.modalBg} onPress={() => setEditGoals(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={[styles.modalCard, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>🎯 {t("تعديل أهدافي اليومية", "Edit My Daily Goals")}</Text>
            <Text style={[styles.modalSub, { color: colors.muted }]}>{t("حدّث أهدافك حسب احتياجك", "Update your goals as you need")}</Text>

            {[
              { key: "water" as const,         labelAr: "💧 الماء (أكواب)",    labelEn: "💧 Water (cups)",        min: 1, max: 20 },
              { key: "caloriesBurn" as const,  labelAr: "🔥 السعرات (محروقة)", labelEn: "🔥 Calories burned",     min: 100, max: 2000 },
              { key: "sleep" as const,         labelAr: "😴 النوم (ساعات)",    labelEn: "😴 Sleep (hours)",       min: 4, max: 12 },
              { key: "steps" as const,         labelAr: "👟 الخطوات",          labelEn: "👟 Steps",               min: 1000, max: 30000 },
              { key: "activeMinutes" as const, labelAr: "🏃 النشاط (دقائق)",   labelEn: "🏃 Active minutes",      min: 10, max: 240 },
            ].map((g) => (
              <View key={g.key} style={[styles.goalRow, { borderColor: colors.border }]}>
                <Text style={[styles.goalLbl, { color: colors.text }]}>{t(g.labelAr, g.labelEn)}</Text>
                <TextInput
                  value={String(tmpGoals[g.key])}
                  onChangeText={(v) => setTmpGoals({ ...tmpGoals, [g.key]: Math.max(g.min, Math.min(g.max, parseInt(v) || g.min)) })}
                  keyboardType="numeric"
                  style={[styles.goalInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
                />
              </View>
            ))}

            <View style={styles.modalBtns}>
              <Pressable style={[styles.modalCancel, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5" }]} onPress={() => { setTmpGoals(userGoals); setEditGoals(false); }}>
                <Text style={[styles.modalCancelText, { color: colors.text }]}>{t("إلغاء", "Cancel")}</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={() => { setUserGoals(tmpGoals); setEditGoals(false); }}>
                <Text style={styles.modalSaveText}>{t("حفظ التغييرات", "Save Changes")}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 18, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 30, fontFamily: "Cairo_700Bold", textAlign: "right" },
  headerSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  scoreCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#A86DBF", alignItems: "center", justifyContent: "center", flexDirection: "row-reverse", gap: 1, shadowColor: "#A86DBF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  scoreNum: { color: "#fff", fontSize: 22, fontFamily: "Cairo_700Bold" },
  scorePct: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: "Tajawal_500Medium", marginBottom: 4 },

  tab: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, borderWidth: 1.5 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },

  heroCard: { marginHorizontal: 20, marginTop: 18, borderRadius: 22, overflow: "hidden", height: 200, borderWidth: 1, position: "relative" },
  heroImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroOverlay: { flex: 1, padding: 18, justifyContent: "flex-end", gap: 6 },
  heroBadge: { alignSelf: "flex-end", backgroundColor: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.4)", borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: "auto" },
  heroBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  heroSub: { color: "rgba(255,255,255,0.92)", fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  heroEditBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, alignSelf: "flex-end", backgroundColor: "rgba(255,255,255,0.22)", borderColor: "rgba(255,255,255,0.4)", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginTop: 6 },
  heroEditBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },

  metricsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, paddingHorizontal: 20, marginTop: 14 },
  metricCard: { width: (width - 50) / 2, borderRadius: 18, padding: 14, gap: 8, borderWidth: 1 },
  metricHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  metricBadge: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  metricPct: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  metricLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  metricValueRow: { flexDirection: "row-reverse", alignItems: "baseline", gap: 4 },
  metricVal: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  metricGoal: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  metricAction: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 6, borderRadius: 10, marginTop: 4 },
  metricActionText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },

  chartCard: { marginHorizontal: 20, marginTop: 14, borderRadius: 20, padding: 16, borderWidth: 1 },
  chartHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  chartTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  chartLink: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  weekChart: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", height: 130, gap: 6 },
  weekBar: { flex: 1, alignItems: "center", gap: 6 },
  weekBarTrack: { width: "100%", height: 100, borderRadius: 6, overflow: "hidden", justifyContent: "flex-end" },
  weekBarLbl: { fontSize: 10 },

  insightBanner: { marginHorizontal: 20, marginTop: 14, borderRadius: 18, overflow: "hidden", height: 90 },
  insightContent: { flex: 1, padding: 14, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  insightAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  insightTitle: { color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  insightSub: { color: "rgba(255,255,255,0.86)", fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },

  bannerCard: { marginHorizontal: 20, marginTop: 16, borderRadius: 20, overflow: "hidden", height: 130, position: "relative" },
  bannerImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  bannerInner: { flex: 1, padding: 16, justifyContent: "flex-end" },
  bannerTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bannerSub: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },

  sectionPad: { paddingHorizontal: 20, marginTop: 14, gap: 10 },
  bigCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 18, padding: 14, borderWidth: 1 },
  bigCardIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  bigCardTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bigCardDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  bigCardArrow: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  emergencyCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 18, padding: 16, marginTop: 4 },
  emergencyIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  emergencyTitle: { color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  emergencySub: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  emergencyBtn: { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  emergencyBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  calcGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  calcCard: { width: (width - 52) / 2, borderRadius: 20, padding: 18, alignItems: "center", gap: 10, borderWidth: 1 },
  calcIcon: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  calcTitle: { fontSize: 14, fontFamily: "Cairo_700Bold", textAlign: "center" },
  calcBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 2 },
  calcBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 40, gap: 12 },
  modalHandle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#D4D4D8", marginBottom: 8 },
  modalTitle: { fontSize: 19, fontFamily: "Cairo_700Bold", textAlign: "right" },
  modalSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 6 },
  goalRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  goalLbl: { fontSize: 14, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  goalInput: { width: 90, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  modalBtns: { flexDirection: "row-reverse", gap: 10, marginTop: 12 },
  modalCancel: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  modalCancelText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  modalSave: { flex: 1.5, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: "#A86DBF" },
  modalSaveText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
});
