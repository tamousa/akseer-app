import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
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
import { useApp, HOME_EQUIPMENT_LIST, HomeEquipment } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const GOALS_DATA = [
  { id: "lose", ar: "خسارة وزن", en: "Weight Loss", emoji: "🔥" },
  { id: "build", ar: "بناء عضلات", en: "Muscle Building", emoji: "💪" },
  { id: "cut", ar: "تنشيف", en: "Cutting", emoji: "✂️" },
  { id: "balanced", ar: "جسم متوازن", en: "Balanced Body", emoji: "⚖️" },
  { id: "endurance", ar: "لياقة بدنية", en: "Fitness", emoji: "🏃" },
  { id: "flexibility", ar: "مرونة", en: "Flexibility", emoji: "🧘" },
];

const WEEK_DAYS_DATA = [
  { day: 0, ar: "الأحد", en: "Sun", shortAr: "أحد", shortEn: "Sun", muscleAr: "صدر وترايسبس", muscleEn: "Chest & Triceps", emoji: "💪", color: "#F43F5E", exercises: 7, isRest: false },
  { day: 1, ar: "الاثنين", en: "Mon", shortAr: "اثنين", shortEn: "Mon", muscleAr: "ظهر وبايسبس", muscleEn: "Back & Biceps", emoji: "🏋️", color: "#3B82F6", exercises: 7, isRest: false },
  { day: 2, ar: "الثلاثاء", en: "Tue", shortAr: "ثلاثاء", shortEn: "Tue", muscleAr: "أرجل", muscleEn: "Legs", emoji: "🦵", color: "#C490D8", exercises: 7, isRest: false },
  { day: 3, ar: "الأربعاء", en: "Wed", shortAr: "أربعاء", shortEn: "Wed", muscleAr: "أكتاف وبطن", muscleEn: "Shoulders & Core", emoji: "🎯", color: "#F59E0B", exercises: 6, isRest: false },
  { day: 4, ar: "الخميس", en: "Thu", shortAr: "خميس", shortEn: "Thu", muscleAr: "ذراعين", muscleEn: "Arms", emoji: "💪", color: "#22C55E", exercises: 6, isRest: false },
  { day: 5, ar: "الجمعة", en: "Fri", shortAr: "جمعة", shortEn: "Fri", muscleAr: "كارديو وHIIT", muscleEn: "Cardio & HIIT", emoji: "🏃", color: "#EC4899", exercises: 6, isRest: false },
  { day: 6, ar: "السبت", en: "Sat", shortAr: "سبت", shortEn: "Sat", muscleAr: "راحة واستشفاء", muscleEn: "Rest & Recovery", emoji: "😴", color: "#6B7280", exercises: 0, isRest: true },
];

const BLOG_POSTS = [
  { id: "1", title: "أهمية الإحماء قبل التمرين", desc: "تعرف على كيفية تحضير جسمك للتمرين وتقليل خطر الإصابات", emoji: "🔥", color: "#F43F5E" },
  { id: "2", title: "التغذية السليمة لبناء العضلات", desc: "دليلك الشامل للبروتين والكربوهيدرات والدهون الصحية", emoji: "🥗", color: "#22C55E" },
  { id: "3", title: "أخطاء شائعة في تمارين الحديد", desc: "تجنب هذه الأخطاء لتحقيق أفضل النتائج بأمان", emoji: "⚠️", color: "#F59E0B" },
  { id: "4", title: "فوائد التمرين على الصحة النفسية", desc: "كيف تحسن الرياضة مزاجك وتقلل التوتر والقلق", emoji: "🧠", color: "#C490D8" },
  { id: "5", title: "متى تزيد الأوزان في تمارينك؟", desc: "علامات تدل على أنك جاهز للانتقال للمستوى التالي", emoji: "📈", color: "#3B82F6" },
  { id: "6", title: "أهمية النوم للاعبي كمال الأجسام", desc: "كيف يؤثر النوم على بناء العضلات والتعافي", emoji: "😴", color: "#A86DBF" },
];

export default function FitnessScreen() {
  
  const { isDark } = useTheme();
  const { t, lang } = useLanguage();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { workoutLogs, profile, homeEquipment, setHomeEquipment, isHomeWorkout, setIsHomeWorkout } = useApp();
  const topPadding = isWeb ? 67 : insets.top;
  const isPro = profile?.isPro ?? false;

  const [selectedGoal, setSelectedGoal] = useState("build");
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const GOALS = GOALS_DATA.map(g => ({ ...g, label: lang === "ar" ? g.ar : g.en }));
  const WEEK_DAYS = WEEK_DAYS_DATA.map(d => ({
    ...d,
    name: lang === "ar" ? d.ar : d.en,
    short: lang === "ar" ? d.shortAr : d.shortEn,
    muscle: lang === "ar" ? d.muscleAr : d.muscleEn,
  }));
  const chartData = [
    { day: t("أحد", "Sun"), val: 320, max: 500 },
    { day: t("اثنين", "Mon"), val: 410, max: 500 },
    { day: t("ثلاثاء", "Tue"), val: 280, max: 500 },
    { day: t("أربعاء", "Wed"), val: 390, max: 500 },
    { day: t("خميس", "Thu"), val: 450, max: 500 },
    { day: t("جمعة", "Fri"), val: 200, max: 500 },
    { day: t("سبت", "Sat"), val: 0, max: 500 },
  ];

  const toggleEquipment = (id: HomeEquipment) => {
    const updated = homeEquipment.includes(id)
      ? homeEquipment.filter(e => e !== id)
      : [...homeEquipment, id];
    setHomeEquipment(updated);
  };

  const today = new Date();
  const todayDayIndex = today.getDay();

  const thisWeekLogs = workoutLogs.filter((w) => {
    const d = new Date(w.date);
    const diff = Math.abs(today.getTime() - d.getTime());
    return diff < 7 * 24 * 60 * 60 * 1000;
  });
  const totalCalories = thisWeekLogs.reduce((s, w) => s + w.calories, 0);
  const totalMinutes = thisWeekLogs.reduce((s, w) => s + w.duration, 0);
  const workoutDays = new Set(thisWeekLogs.map((w) => w.date)).size;
  const streak = Math.min(workoutDays, 7);


  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 40 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={26} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("التمارين الرياضية", "Fitness")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
          <Pressable onPress={() => router.push("/bookings" as any)} style={[styles.editBtn, { backgroundColor: isDark ? "rgba(34,197,94,0.12)" : "#F0FDF4" }]}>
            <Feather name="calendar" size={16} color="#22C55E" />
          </Pressable>
          <Pressable onPress={() => setShowGoalEditor(true)} style={[styles.editBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
            <Feather name="sliders" size={16} color="#C490D8" />
            <Text style={styles.editBtnText}>{t("تعديل البرنامج", "Edit Plan")}</Text>
          </Pressable>
        </View>
      </View>

      {showGoalEditor && (
        <View style={[styles.goalEditor, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.goalHeader}>
            <Pressable onPress={() => setShowGoalEditor(false)}>
              <Feather name="x" size={22} color={colors.muted} />
            </Pressable>
            <Text style={[styles.goalTitle, { color: colors.text }]}>{t("تعديل البرنامج التدريبي", "Edit Training Plan")}</Text>
          </View>

          <Text style={[styles.editorSectionTitle, { color: colors.text }]}>{t("🎯 هدفي من التمارين", "🎯 My Fitness Goal")}</Text>
          <View style={styles.goalGrid}>
            {GOALS.map((g) => (
              <Pressable
                key={g.id}
                style={[styles.goalChip, { backgroundColor: selectedGoal === g.id ? "#C490D8" : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: selectedGoal === g.id ? "#C490D8" : colors.border }]}
                onPress={() => setSelectedGoal(g.id)}
              >
                <Text style={{ fontSize: 20 }}>{g.emoji}</Text>
                <Text style={[styles.goalChipText, { color: selectedGoal === g.id ? "#fff" : colors.text }]}>{g.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.editorDivider, { backgroundColor: colors.border }]} />

          <Text style={[styles.editorSectionTitle, { color: colors.text }]}>{t("🏠 مكان التمرين", "🏠 Workout Location")}</Text>
          <View style={styles.locationToggle}>
            <Pressable
              style={[styles.locationBtn, !isHomeWorkout && styles.locationBtnActive]}
              onPress={() => setIsHomeWorkout(false)}
            >
              <Text style={{ fontSize: 18 }}>🏋️‍♂️</Text>
              <Text style={[styles.locationBtnText, { color: !isHomeWorkout ? "#fff" : colors.text }]}>{t("النادي", "Gym")}</Text>
            </Pressable>
            <Pressable
              style={[styles.locationBtn, isHomeWorkout && styles.locationBtnActive]}
              onPress={() => setIsHomeWorkout(true)}
            >
              <Text style={{ fontSize: 18 }}>🏠</Text>
              <Text style={[styles.locationBtnText, { color: isHomeWorkout ? "#fff" : colors.text }]}>{t("المنزل", "Home")}</Text>
            </Pressable>
          </View>

          <View style={[styles.editorDivider, { backgroundColor: colors.border }]} />

          <Text style={[styles.editorSectionTitle, { color: colors.text }]}>{t("📅 كم يوم بالأسبوع تحب تتمرن؟", "📅 How many days per week?")}</Text>
          <Text style={[styles.editorSectionSub, { color: colors.muted }]}>
            {lang === "ar"
              ? `سنخصص لك برنامج ${daysPerWeek} أيام بالأسبوع مع ${7 - daysPerWeek} أيام راحة`
              : `We'll build a ${daysPerWeek}-day plan with ${7 - daysPerWeek} rest day(s)`}
          </Text>
          <View style={styles.daysRow}>
            {[2, 3, 4, 5, 6, 7].map((n) => {
              const active = daysPerWeek === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setDaysPerWeek(n)}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: active ? "#C490D8" : isDark ? colors.surfaceAlt : "#FDF6FA",
                      borderColor: active ? "#C490D8" : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.dayPillNum, { color: active ? "#fff" : colors.text }]}>{n}</Text>
                  <Text style={[styles.dayPillLabel, { color: active ? "rgba(255,255,255,0.85)" : colors.muted }]}>
                    {t("أيام", "days")}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {isHomeWorkout && (
            <>
              <Text style={[styles.editorSectionTitle, { color: colors.text, marginTop: 14 }]}>{t("🛠️ الأدوات المتاحة بالمنزل", "🛠️ Available Home Equipment")}</Text>
              <Text style={[styles.editorSectionSub, { color: colors.muted }]}>{t("حدد الأدوات عندك عشان التمارين تتناسب معها", "Select available equipment to customize your workouts")}</Text>
              <View style={styles.equipGrid}>
                {HOME_EQUIPMENT_LIST.map((eq) => {
                  const selected = homeEquipment.includes(eq.id);
                  return (
                    <Pressable
                      key={eq.id}
                      style={[styles.equipChip, { backgroundColor: selected ? "#7ECFB3" : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: selected ? "#7ECFB3" : colors.border }]}
                      onPress={() => toggleEquipment(eq.id)}
                    >
                      <Text style={{ fontSize: 18 }}>{eq.emoji}</Text>
                      <Text style={[styles.equipChipText, { color: selected ? "#fff" : colors.text }]}>{eq.label}</Text>
                      {selected && <Feather name="check" size={14} color="#fff" />}
                    </Pressable>
                  );
                })}
              </View>
              <View style={[styles.equipSummary, { backgroundColor: isDark ? "rgba(126,207,179,0.1)" : "rgba(126,207,179,0.08)", borderColor: "rgba(126,207,179,0.2)" }]}>
                <Feather name="info" size={14} color="#7ECFB3" />
                <Text style={[styles.equipSummaryText, { color: colors.muted }]}>
                  {homeEquipment.length === 0
                    ? t("لم تحدد أي أداة — سيعتمد البرنامج على تمارين وزن الجسم فقط", "No equipment selected — bodyweight exercises only")
                    : lang === "ar" ? `${homeEquipment.length} أداة محددة — سيتم تخصيص التمارين بناءً عليها` : `${homeEquipment.length} item(s) selected — workouts will be customized`}
                </Text>
              </View>
            </>
          )}

          <Pressable
            style={styles.goalSaveBtn}
            onPress={() => {
              setShowGoalEditor(false);
              Alert.alert(
                t("تم التحديث", "Updated"),
                isHomeWorkout
                  ? lang === "ar" ? `تم تعديل برنامجك للتمارين المنزلية: ${daysPerWeek} أيام/أسبوع مع ${homeEquipment.length} أداة` : `Home plan updated: ${daysPerWeek} days/week with ${homeEquipment.length} item(s)`
                  : lang === "ar" ? `تم تعديل برنامجك التدريبي: ${daysPerWeek} أيام بالأسبوع` : `Training plan updated: ${daysPerWeek} days/week`
              );
            }}
          >
            <Text style={styles.goalSaveBtnText}>{t("حفظ التغييرات", "Save Changes")}</Text>
          </Pressable>
        </View>
      )}

      {/* ─── متجر المنتجات الرياضية ─── */}
      <View style={styles.sectionPad}>
        <Pressable
          style={styles.sportsShopCard}
          onPress={() => router.push("/(tabs)/store" as any)}
        >
          <Image source={require("@/assets/images/fitness-equipment.png")} style={styles.sportsShopImg} resizeMode="cover" />
          <View style={styles.sportsShopOverlay} />
          <View style={styles.sportsShopContent}>
            <View style={styles.sportsShopBadge}>
              <Text style={styles.sportsShopBadgeText}>🛒 {t("جديد", "New")}</Text>
            </View>
            <Text style={styles.sportsShopTitle}>{t("متجر المنتجات الرياضية", "Sports Shop")}</Text>
            <Text style={styles.sportsShopSub}>
              {t("ملابس • أحذية • دراجات • أجهزة لياقة وأكثر", "Apparel • Shoes • Bikes • Gear and more")}
            </Text>
            <View style={styles.sportsShopRow}>
              <View style={styles.sportsShopChip}><Text style={styles.sportsShopChipTxt}>👟 {t("أحذية", "Shoes")}</Text></View>
              <View style={styles.sportsShopChip}><Text style={styles.sportsShopChipTxt}>👕 {t("ملابس", "Apparel")}</Text></View>
              <View style={styles.sportsShopChip}><Text style={styles.sportsShopChipTxt}>🚴 {t("دراجات", "Bikes")}</Text></View>
            </View>
            <View style={styles.sportsShopBtn}>
              <Text style={styles.sportsShopBtnText}>{t("تسوق الآن", "Shop Now")}</Text>
              <Feather name="chevron-left" size={16} color="#fff" />
            </View>
          </View>
        </Pressable>
      </View>

      {/* ─── الأنشطة الخارجية ─── */}
      <View style={styles.sectionPad}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("الأنشطة الخارجية", "Outdoor Activities")}</Text>
        <View style={styles.activityRow}>
          {[
            { id: "walk", emoji: "🚶", label: t("مشي", "Walking"),   color: "#22C55E", sub: t("تتبع مساراتك", "Track your routes") },
            { id: "run",  emoji: "🏃", label: t("جري", "Running"),   color: "#C490D8", sub: t("راقب وتيرتك", "Monitor your pace")  },
            { id: "bike", emoji: "🚴", label: t("دراجة", "Cycling"), color: "#3B82F6", sub: t("سجّل رحلاتك", "Log your rides")  },
          ].map(a => (
            <Pressable
              key={a.id}
              style={[styles.activityCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: a.color + "40" }]}
              onPress={() => router.push("/section/activity" as any)}
            >
              <View style={[styles.activityEmoji, { backgroundColor: a.color + "18" }]}>
                <Text style={{ fontSize: 28 }}>{a.emoji}</Text>
              </View>
              <Text style={[styles.activityLabel, { color: colors.text }]}>{a.label}</Text>
              <Text style={[styles.activitySub, { color: colors.muted }]}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionPad}>
        <View style={styles.proHeader}>
          <View style={styles.proBadge}>
            <MaterialCommunityIcons name="crown" size={14} color="#F5D26A" />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("ملخص التقدم", "Progress Summary")}</Text>
        </View>

        {!isPro && (
          <View style={[styles.proLock, { backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.06)", borderColor: "rgba(168,85,247,0.2)" }]}>
            <MaterialCommunityIcons name="lock" size={16} color="#C490D8" />
            <Text style={[styles.proLockText, { color: colors.muted }]}>{t("اشترك في PRO لعرض التحليلات المتقدمة", "Subscribe to PRO for advanced analytics")}</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#C490D8" }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{totalCalories || 1850}</Text>
            <Text style={styles.statLabel}>{t("سعرة محروقة", "Cal Burned")}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#A86DBF" }]}>
            <Text style={styles.statEmoji}>🏋️</Text>
            <Text style={styles.statValue}>{workoutDays || 4}</Text>
            <Text style={styles.statLabel}>{t("أيام تمرين", "Workout Days")}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F43F5E" }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>{streak || 3}</Text>
            <Text style={styles.statLabel}>{t("أيام متتالية", "Day Streak")}</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>{t("السعرات المحروقة هذا الأسبوع", "Calories Burned This Week")}</Text>
          <View style={styles.chartContainer}>
            {chartData.map((d, i) => (
              <View key={i} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View style={[styles.barBg, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]} />
                  <View style={[styles.barFill, { height: `${(d.val / d.max) * 100}%`, backgroundColor: i === todayDayIndex ? "#C490D8" : "rgba(168,85,247,0.4)" }]} />
                </View>
                <Text style={[styles.barLabel, { color: i === todayDayIndex ? "#C490D8" : colors.muted }]}>{d.day}</Text>
                <Text style={[styles.barValue, { color: i === todayDayIndex ? "#C490D8" : colors.muted }]}>{d.val}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartStats}>
            <View style={styles.chartStatItem}>
              <Text style={[styles.chartStatValue, { color: colors.text }]}>{totalMinutes || 245}</Text>
              <Text style={[styles.chartStatLabel, { color: colors.muted }]}>{t("دقيقة تمرين", "Workout Min")}</Text>
            </View>
            <View style={[styles.chartDivider, { backgroundColor: colors.border }]} />
            <View style={styles.chartStatItem}>
              <Text style={[styles.chartStatValue, { color: colors.text }]}>%{Math.round(((workoutDays || 4) / 6) * 100)}</Text>
              <Text style={[styles.chartStatLabel, { color: colors.muted }]}>{t("نسبة الالتزام", "Consistency")}</Text>
            </View>
            <View style={[styles.chartDivider, { backgroundColor: colors.border }]} />
            <View style={styles.chartStatItem}>
              <Text style={[styles.chartStatValue, { color: colors.text }]}>+12%</Text>
              <Text style={[styles.chartStatLabel, { color: colors.muted }]}>{t("معدل التغيير", "Change Rate")}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionPad}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("البرنامج التدريبي الأسبوعي", "Weekly Training Plan")}</Text>
        <Text style={[styles.sectionSub, { color: colors.muted }]}>
          {GOALS.find((g) => g.id === selectedGoal)?.emoji} {t("هدفك:", "Your goal:")} {GOALS.find((g) => g.id === selectedGoal)?.label}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 8 }}>
          {WEEK_DAYS.map((d) => {
            const isToday = d.day === todayDayIndex;
            return (
              <Pressable
                key={d.day}
                style={[
                  styles.dayCard,
                  {
                    backgroundColor: isToday ? "#C490D8" : isDark ? colors.card : "#fff",
                    borderColor: isToday ? "#C490D8" : colors.border,
                    opacity: d.isRest ? 0.7 : 1,
                  },
                ]}
                onPress={() => {
                  if (d.isRest) {
                    Alert.alert(t("يوم راحة 😴", "Rest Day 😴"), t("استرح اليوم واستعد للتمارين غداً!\n\nنصيحة: حاول ممارسة تمارين الإطالة الخفيفة.", "Rest today and get ready for tomorrow!\n\nTip: Try light stretching exercises."));
                  } else {
                    router.push(`/workout/${d.day}` as any);
                  }
                }}
              >
                <Text style={[styles.dayName, { color: isToday ? "#fff" : colors.muted }]}>{d.short}</Text>
                <Text style={{ fontSize: 28 }}>{d.emoji}</Text>
                <Text style={[styles.dayMuscle, { color: isToday ? "#fff" : colors.text }]}>{d.muscle}</Text>
                {d.isRest ? (
                  <View style={[styles.restBadge, { backgroundColor: isToday ? "rgba(255,255,255,0.2)" : "#6B728015" }]}>
                    <Text style={[styles.restBadgeText, { color: isToday ? "#fff" : "#6B7280" }]}>{t("راحة", "Rest")}</Text>
                  </View>
                ) : (
                  <Text style={[styles.dayExCount, { color: isToday ? "rgba(255,255,255,0.8)" : colors.muted }]}>
                    {d.exercises} {t("تمارين", "exercises")}
                  </Text>
                )}
                {isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>{t("اليوم", "Today")}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {!WEEK_DAYS[todayDayIndex].isRest && (
          <Pressable
            style={styles.startBtn}
            onPress={() => router.push(`/workout/${todayDayIndex}` as any)}
          >
            <MaterialCommunityIcons name="play-circle" size={22} color="#fff" />
            <Text style={styles.startBtnText}>{t("ابدأ تمرين اليوم", "Start Today's Workout")} — {WEEK_DAYS[todayDayIndex].muscle}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.sectionPad}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("المدربون الشخصيون", "Personal Trainers")}</Text>
        <Pressable
          style={styles.trainerBanner}
          onPress={() => router.push("/providers/trainers" as any)}
        >
          <Image source={require("@/assets/images/trainer-banner.png")} style={styles.trainerBannerImg} resizeMode="cover" />
          <View style={styles.trainerOverlay} />
          <View style={styles.trainerContent}>
            <Text style={styles.trainerTitle}>{t("تدرب مع أفضل المدربين", "Train with the Best Coaches")}</Text>
            <Text style={styles.trainerSub}>{t("مدربون معتمدون لتحقيق أهدافك", "Certified trainers to achieve your goals")}</Text>
            <View style={styles.trainerBtn}>
              <Feather name="chevron-left" size={16} color="#C490D8" />
              <Text style={styles.trainerBtnText}>{t("استعرض المدربين", "Browse Trainers")}</Text>
            </View>
          </View>
          <View style={styles.trainerAvatars}>
            <View style={[styles.trainerAvatar, { backgroundColor: "#C490D8" }]}><Text style={{ fontSize: 16 }}>👨‍🏫</Text></View>
            <View style={[styles.trainerAvatar, { backgroundColor: "#A86DBF", marginRight: -10 }]}><Text style={{ fontSize: 16 }}>👩‍🏫</Text></View>
            <View style={[styles.trainerAvatar, { backgroundColor: "#F43F5E", marginRight: -10 }]}><Text style={{ fontSize: 16 }}>🏋️</Text></View>
            <View style={[styles.trainerMoreBadge, { marginRight: -10 }]}><Text style={styles.trainerMoreText}>+5</Text></View>
          </View>
        </Pressable>
      </View>

      <View style={styles.sectionPad}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("مدونة ونصائح رياضية", "Blog & Fitness Tips")}</Text>
        <Text style={[styles.sectionSub, { color: colors.muted }]}>{t("نصائح لتعزيز أدائك الرياضي", "Tips to boost your athletic performance")}</Text>

        <Pressable style={[styles.blogFeatured, { borderColor: colors.border }]}>
          <Image source={require("@/assets/images/fitness-blog.png")} style={styles.blogFeaturedImg} resizeMode="cover" />
          <View style={styles.blogFeaturedOverlay} />
          <View style={styles.blogFeaturedContent}>
            <View style={styles.blogTag}>
              <Text style={styles.blogTagText}>{t("مقال مميز", "Featured")}</Text>
            </View>
            <Text style={styles.blogFeaturedTitle}>دليلك الشامل لبناء برنامج تدريبي فعال</Text>
            <Text style={styles.blogFeaturedDesc}>تعرف على أساسيات التخطيط الرياضي وكيف تحقق أقصى استفادة من تمارينك</Text>
          </View>
        </Pressable>

        {BLOG_POSTS.map((post) => (
          <Pressable
            key={post.id}
            style={[styles.blogCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
            onPress={() => Alert.alert(post.title, post.desc)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.blogCardTitle, { color: colors.text }]}>{post.title}</Text>
              <Text style={[styles.blogCardDesc, { color: colors.muted }]} numberOfLines={2}>{post.desc}</Text>
            </View>
            <View style={[styles.blogIcon, { backgroundColor: post.color + "15" }]}>
              <Text style={{ fontSize: 22 }}>{post.emoji}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 8, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  editBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  editBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  sectionPad: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 19, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  sectionSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 8 },
  proHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 12 },
  proBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(245,210,106,0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  proBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold", color: "#F5D26A" },
  proLock: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  proLockText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  statsRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center", gap: 4 },
  statEmoji: { fontSize: 22 },
  statValue: { color: "#fff", fontSize: 22, fontFamily: "Tajawal_800ExtraBold" },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  chartCard: { borderRadius: 20, padding: 18, borderWidth: 1 },
  chartTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 16 },
  chartContainer: { flexDirection: "row-reverse", justifyContent: "space-between", height: 120, marginBottom: 12 },
  chartBar: { alignItems: "center", flex: 1 },
  barContainer: { width: 20, height: 80, borderRadius: 10, overflow: "hidden", position: "relative", marginBottom: 6 },
  barBg: { position: "absolute", width: "100%", height: "100%", borderRadius: 10 },
  barFill: { position: "absolute", bottom: 0, width: "100%", borderRadius: 10 },
  barLabel: { fontSize: 10, fontFamily: "Tajawal_500Medium" },
  barValue: { fontSize: 9, fontFamily: "Tajawal_400Regular" },
  chartStats: { flexDirection: "row-reverse", justifyContent: "space-around", paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.1)" },
  chartStatItem: { alignItems: "center" },
  chartStatValue: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  chartStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  chartDivider: { width: 1, height: 30 },
  dayCard: { width: 110, borderRadius: 18, padding: 14, alignItems: "center", gap: 6, borderWidth: 1, position: "relative" },
  dayName: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  dayMuscle: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  dayExCount: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  restBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  restBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  todayBadge: { position: "absolute", top: -8, backgroundColor: "#F5D26A", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8 },
  todayBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold", color: "#000" },
  startBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#C490D8", borderRadius: 16, paddingVertical: 16, marginTop: 14 },
  startBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  sportsShopCard: { borderRadius: 22, overflow: "hidden", height: 220, position: "relative", marginTop: 4 },
  sportsShopImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  sportsShopOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(13,11,26,0.62)" },
  sportsShopContent: { flex: 1, padding: 18, justifyContent: "flex-end", gap: 8 },
  sportsShopBadge: { alignSelf: "flex-end", backgroundColor: "#FB923C", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: "auto" },
  sportsShopBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  sportsShopTitle: { color: "#fff", fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  sportsShopSub: { color: "rgba(255,255,255,0.88)", fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  sportsShopRow: { flexDirection: "row-reverse", gap: 6, marginTop: 4 },
  sportsShopChip: { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.3)", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  sportsShopChipTxt: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_500Medium" },
  sportsShopBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#FB923C", paddingVertical: 12, borderRadius: 14, marginTop: 8 },
  sportsShopBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },

  trainerBanner: { borderRadius: 20, overflow: "hidden", height: 160, position: "relative", marginTop: 8 },
  trainerBannerImg: { width: "100%", height: "100%" },
  trainerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  trainerContent: { position: "absolute", bottom: 16, right: 16, left: 16 },
  trainerTitle: { color: "#fff", fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  trainerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 8 },
  trainerBtn: { flexDirection: "row-reverse", alignItems: "center", alignSelf: "flex-end", gap: 4, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  trainerBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  trainerAvatars: { position: "absolute", top: 16, left: 16, flexDirection: "row" },
  trainerAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  trainerMoreBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", borderWidth: 2, borderColor: "#fff" },
  trainerMoreText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  blogFeatured: { borderRadius: 20, overflow: "hidden", height: 180, marginBottom: 14, borderWidth: 1 },
  blogFeaturedImg: { width: "100%", height: "100%" },
  blogFeaturedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  blogFeaturedContent: { position: "absolute", bottom: 14, right: 14, left: 14 },
  blogTag: { alignSelf: "flex-end", backgroundColor: "#C490D8", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  blogTagText: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },
  blogFeaturedTitle: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  blogFeaturedDesc: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  blogCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  blogCardTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  blogCardDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 18 },
  blogIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  goalEditor: { marginHorizontal: 20, borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 8 },
  goalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  goalTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  goalGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  goalChip: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1, width: (width - 70) / 2 },
  goalChipText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  editorSectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 8 },
  editorSectionSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 10 },
  editorDivider: { height: 1, marginVertical: 16 },
  locationToggle: { flexDirection: "row-reverse", gap: 10, marginBottom: 4 },
  locationBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: "rgba(168,109,191,0.08)" },
  locationBtnActive: { backgroundColor: "#A86DBF" },
  locationBtnText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  daysRow: { flexDirection: "row-reverse", gap: 8, marginTop: 10, justifyContent: "space-between" },
  dayPill: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 14, borderWidth: 1.2 },
  dayPillNum: { fontSize: 18, fontFamily: "Cairo_700Bold", lineHeight: 22 },
  dayPillLabel: { fontSize: 10, fontFamily: "Tajawal_500Medium", marginTop: 1 },
  equipGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  equipChip: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  equipChipText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  equipSummary: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  equipSummaryText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", lineHeight: 18 },
  goalSaveBtn: { backgroundColor: "#C490D8", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  goalSaveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  activityRow: { flexDirection: "row-reverse", gap: 10 },
  activityCard: { flex: 1, borderRadius: 18, padding: 14, alignItems: "center", gap: 6, borderWidth: 1.5 },
  activityEmoji: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  activityLabel: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  activitySub: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
});
