import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { TIERS, getTierForPoints, getNextTier } from "@/constants/tiers";

const { width } = Dimensions.get("window");

type TimeRange = "daily" | "30d" | "3m" | "6m" | "1y";

const TIME_TABS_DATA: { key: TimeRange; ar: string; en: string }[] = [
  { key: "daily", ar: "اليوم", en: "Today" },
  { key: "30d", ar: "30 يوم", en: "30 Days" },
  { key: "3m", ar: "3 أشهر", en: "3 Months" },
  { key: "6m", ar: "6 أشهر", en: "6 Months" },
  { key: "1y", ar: "سنة", en: "Year" },
];

const CATEGORIES_DATA = [
  { key: "meals" as const, ar: "التغذية", en: "Nutrition", emoji: "🍽️", max: 25, color: "#F59E0B" },
  { key: "exercise" as const, ar: "التمارين", en: "Exercise", emoji: "🏋️", max: 25, color: "#3B82F6" },
  { key: "water" as const, ar: "الماء", en: "Water", emoji: "💧", max: 25, color: "#06B6D4" },
  { key: "sleep" as const, ar: "النوم", en: "Sleep", emoji: "😴", max: 25, color: "#8B5CF6" },
  { key: "weight" as const, ar: "الوزن", en: "Weight", emoji: "⚖️", max: 5, color: "#22C55E" },
];

const REWARDS_DATA = [
  { points: 500, ar: "خصم 10% على الاشتراك", en: "10% Subscription Discount", emoji: "🎫", descAr: "خصم على اشتراك أكسير الشهري", descEn: "Discount on monthly Akseer plan" },
  { points: 1000, ar: "استشارة مجانية", en: "Free Consultation", emoji: "👨‍⚕️", descAr: "جلسة استشارة صحية مجانية", descEn: "One free health consultation session" },
  { points: 1500, ar: "خصم 25% على المنتجات", en: "25% Products Discount", emoji: "🛍️", descAr: "خصم على منتجات الصحة والجمال", descEn: "Discount on health & beauty products" },
  { points: 2500, ar: "فحص طبي شامل", en: "Full Medical Check", emoji: "🏥", descAr: "فحص طبي شامل مجاني", descEn: "Free comprehensive medical check" },
  { points: 5000, ar: "اشتراك شهر مجاني", en: "Free Month Subscription", emoji: "👑", descAr: "شهر كامل مجاناً في أكسير بريميوم", descEn: "One full month free in Akseer Premium" },
];

export default function PointsScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    todayPoints,
    pointsHistory,
    totalMonthlyPoints,
    totalAllTimePoints,
    redeemPoints,
    tierBonusPoints,
    availablePoints,
    mysteryBoxAvailable,
    lastMysteryReward,
    claimMysteryBox,
    dismissMysteryReward,
  } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const TIME_TABS = TIME_TABS_DATA.map((tab) => ({ ...tab, label: t(tab.ar, tab.en) }));
  const CATEGORIES = CATEGORIES_DATA.map((cat) => ({ ...cat, label: t(cat.ar, cat.en) }));
  const REWARDS = REWARDS_DATA.map((r) => ({ ...r, title: t(r.ar, r.en), desc: t(r.descAr, r.descEn) }));

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const scoreColor = todayPoints.total >= 80 ? "#22C55E" : todayPoints.total >= 50 ? "#F59E0B" : "#EF4444";
  const scorePct = Math.min(100, todayPoints.total);

  const filteredHistory = useMemo(() => {
    if (timeRange === "daily") {
      const today = new Date().toISOString().split("T")[0];
      return pointsHistory.filter((p) => p.date === today);
    }
    const now = new Date();
    let daysBack = 30;
    if (timeRange === "3m") daysBack = 90;
    else if (timeRange === "6m") daysBack = 180;
    else if (timeRange === "1y") daysBack = 365;

    const cutoff = new Date(now.getTime() - daysBack * 86400000).toISOString().split("T")[0];
    return pointsHistory.filter((p) => p.date >= cutoff);
  }, [pointsHistory, timeRange]);

  const avgScore = useMemo(() => {
    if (filteredHistory.length === 0) return 0;
    return Math.round(filteredHistory.reduce((s, p) => s + p.total, 0) / filteredHistory.length);
  }, [filteredHistory]);

  const periodTotal = useMemo(() => {
    return filteredHistory.reduce((s, p) => s + p.total, 0);
  }, [filteredHistory]);

  const categoryAvgs = useMemo(() => {
    if (filteredHistory.length === 0) return { meals: 0, exercise: 0, water: 0, sleep: 0, weight: 0 };
    const len = filteredHistory.length;
    return {
      meals: Math.round(filteredHistory.reduce((s, p) => s + p.meals, 0) / len),
      exercise: Math.round(filteredHistory.reduce((s, p) => s + p.exercise, 0) / len),
      water: Math.round(filteredHistory.reduce((s, p) => s + p.water, 0) / len),
      sleep: Math.round(filteredHistory.reduce((s, p) => s + p.sleep, 0) / len),
      weight: Math.round(filteredHistory.reduce((s, p) => s + p.weight, 0) / len),
    };
  }, [filteredHistory]);

  const currentTier = getTierForPoints(totalAllTimePoints);
  const nextTier = getNextTier(currentTier.key);
  const tierProgress = nextTier
    ? Math.min(100, ((totalAllTimePoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;
  const pointsToNext = nextTier ? nextTier.min - totalAllTimePoints : 0;

  const chartBarWidth = useMemo(() => {
    const barsToShow = Math.min(filteredHistory.length, 14);
    if (barsToShow === 0) return 20;
    return Math.max(12, Math.min(28, (width - 80) / barsToShow - 4));
  }, [filteredHistory]);

  const chartData = useMemo(() => {
    return filteredHistory.slice(-14);
  }, [filteredHistory]);

  const streakDays = useMemo(() => {
    let streak = 0;
    const sorted = [...pointsHistory].sort((a, b) => b.date.localeCompare(a.date));
    let expectedDate = new Date();
    for (const day of sorted) {
      const expected = expectedDate.toISOString().split("T")[0];
      if (day.date === expected && day.total >= 50) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (day.date < expected) {
        break;
      }
    }
    return streak;
  }, [pointsHistory]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-right" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("نقاط صحتك", "Health Score")}</Text>
        <View style={{ width: 22 }} />
      </View>

      <LinearGradient
        colors={isDark ? ["#1C1330", "#0E0818"] : ["#F8F0F5", "#FEFAFB"]}
        style={styles.heroSection}
      >
        <View style={styles.heroCircleWrap}>
          <View style={[styles.heroCircleBg, { borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]}>
            <View style={[styles.heroCircleProgress, { borderColor: scoreColor, borderLeftColor: "transparent", borderBottomColor: scorePct >= 50 ? scoreColor : "transparent", transform: [{ rotate: `${(scorePct / 100) * 360}deg` }] }]} />
            <View style={styles.heroCircleInner}>
              <Text style={[styles.heroScore, { color: scoreColor }]}>{todayPoints.total}</Text>
              <Text style={[styles.heroScoreMax, { color: colors.muted }]}>/100</Text>
            </View>
          </View>
          <Text style={[styles.heroLabel, { color: colors.text }]}>{t("نقاط اليوم", "Today's Score")}</Text>
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatItem}>
            <Text style={[styles.heroStatVal, { color: "#C490D8" }]}>{streakDays}</Text>
            <Text style={[styles.heroStatLabel, { color: colors.muted }]}>{t("أيام متتالية", "Streak Days")} 🔥</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.heroStatItem}>
            <Text style={[styles.heroStatVal, { color: "#C490D8" }]}>{totalMonthlyPoints}</Text>
            <Text style={[styles.heroStatLabel, { color: colors.muted }]}>{t("هذا الشهر", "This Month")} ⭐</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.heroStatItem}>
            <Text style={[styles.heroStatVal, { color: "#22C55E" }]}>{availablePoints}</Text>
            <Text style={[styles.heroStatLabel, { color: colors.muted }]}>
              {t("نقاط متاحة", "Available Pts")} 🎁
              {tierBonusPoints > 0 ? ` (+${tierBonusPoints} ${currentTier.icon})` : ""}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* ─── صندوق المفاجآت اليومي ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <Pressable
          onPress={() => mysteryBoxAvailable && claimMysteryBox()}
          disabled={!mysteryBoxAvailable}
        >
          <LinearGradient
            colors={mysteryBoxAvailable ? ["#A86DBF", "#EC4899"] : (isDark ? ["#1F1830", "#15101F"] : ["#EDE3F2", "#F8E8F0"]) }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.mysteryBox, !mysteryBoxAvailable && { opacity: 0.6 }]}
          >
            <View style={styles.mysteryIconWrap}>
              <Text style={styles.mysteryIcon}>{mysteryBoxAvailable ? "🎁" : "✅"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mysteryTitle, { color: mysteryBoxAvailable ? "#fff" : colors.text }]}>
                {mysteryBoxAvailable
                  ? t("صندوق مفاجأة اليوم", "Today's Mystery Box")
                  : t("تم فتح صندوق اليوم", "Today's box opened")}
              </Text>
              <Text style={[styles.mysteryDesc, { color: mysteryBoxAvailable ? "rgba(255,255,255,0.85)" : colors.muted }]}>
                {mysteryBoxAvailable
                  ? lang === "ar"
                    ? `اربح من ${currentTier.mysteryMin} إلى ${currentTier.mysteryMax} نقطة ${currentTier.icon}`
                    : `Win ${currentTier.mysteryMin}–${currentTier.mysteryMax} pts ${currentTier.icon}`
                  : t("ارجع غداً لصندوق جديد", "Come back tomorrow for a new box")}
              </Text>
            </View>
            {mysteryBoxAvailable && (
              <View style={styles.mysteryCta}>
                <Text style={styles.mysteryCtaText}>{t("افتح", "Open")}</Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </View>

      {/* ─── بطاقة المستوى ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <LinearGradient
          colors={currentTier.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tierCard}
        >
          <View style={styles.tierTopRow}>
            <View style={styles.tierIconWrap}>
              <Text style={styles.tierIcon}>{currentTier.icon}</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.tierLabel}>{t("مستواك الحالي", "Your Tier")}</Text>
              <View style={styles.tierBenefitsRow}>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeIcon}>✨</Text>
                  <Text style={styles.tierBadgeText}>×{currentTier.multiplier}</Text>
                </View>
                {currentTier.discount > 0 && (
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeIcon}>🎟️</Text>
                    <Text style={styles.tierBadgeText}>{currentTier.discount}%</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.tierProgressWrap}>
            <View style={styles.tierProgressTrack}>
              <View style={[styles.tierProgressFill, { width: `${tierProgress}%` }]} />
            </View>
            <View style={styles.tierMarkers}>
              {TIERS.map(tr => {
                const isPast = totalAllTimePoints >= tr.min;
                const isCurrent = tr.key === currentTier.key;
                return (
                  <View key={tr.key} style={[styles.tierMarker, isCurrent && styles.tierMarkerActive]}>
                    <Text style={{ fontSize: isCurrent ? 22 : 16, opacity: isPast ? 1 : 0.4 }}>{tr.icon}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.tierProgressText}>
            {nextTier
              ? lang === "ar"
                ? `يتبقى ${pointsToNext} نقطة للوصول إلى ${nextTier.icon}`
                : `${pointsToNext} pts to reach ${nextTier.icon}`
              : lang === "ar"
                ? `وصلت لأعلى مستوى ${currentTier.icon}`
                : `You reached the top tier ${currentTier.icon}`}
          </Text>
        </LinearGradient>

        {/* مزايا المستويات */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 14 }]}>🏆 {t("مستويات المكافآت", "Tier Benefits")}</Text>
          {TIERS.map(tr => {
            const isCurrent = tr.key === currentTier.key;
            const isUnlocked = totalAllTimePoints >= tr.min;
            return (
              <View key={tr.key} style={[styles.tierRow, { borderColor: colors.border, opacity: isUnlocked ? 1 : 0.55 }, isCurrent && { backgroundColor: tr.color + "18", borderColor: tr.color }]}>
                <View style={styles.tierRowIcon}>
                  <Text style={{ fontSize: 32 }}>{tr.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tierRowRange, { color: colors.text }]}>
                    {tr.max === Infinity
                      ? lang === "ar" ? `+${tr.min} نقطة` : `${tr.min}+ pts`
                      : lang === "ar" ? `${tr.min} – ${tr.max} نقطة` : `${tr.min}–${tr.max} pts`}
                  </Text>
                  <View style={styles.tierRowBenefits}>
                    <Text style={[styles.tierRowBenefitText, { color: colors.muted }]}>✨ {t("مضاعف", "Multiplier")} ×{tr.multiplier}</Text>
                    {tr.discount > 0 && (
                      <Text style={[styles.tierRowBenefitText, { color: colors.muted }]}>🎟️ {t("خصم", "Discount")} {tr.discount}%</Text>
                    )}
                  </View>
                </View>
                {isCurrent && (
                  <View style={[styles.tierCurrentPill, { backgroundColor: tr.color }]}>
                    <Text style={styles.tierCurrentPillText}>{t("الحالي", "Current")}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.timeTabs}>
          {TIME_TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.timeTab, timeRange === tab.key && { backgroundColor: "#C490D8" }]}
              onPress={() => setTimeRange(tab.key)}
            >
              <Text style={[styles.timeTabText, { color: timeRange === tab.key ? "#fff" : colors.muted }]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>📊 {t("تاريخ النقاط", "Points History")}</Text>
            <View style={styles.periodStats}>
              <Text style={[styles.periodStatLabel, { color: colors.muted }]}>{t("المعدل:", "Avg:")} </Text>
              <Text style={[styles.periodStatVal, { color: avgScore >= 80 ? "#22C55E" : avgScore >= 50 ? "#F59E0B" : "#EF4444" }]}>{avgScore}</Text>
              <Text style={[styles.periodStatLabel, { color: colors.muted }]}>  |  {t("المجموع:", "Total:")} </Text>
              <Text style={[styles.periodStatVal, { color: "#C490D8" }]}>{periodTotal}</Text>
            </View>
          </View>

          {chartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                {chartData.map((day, i) => {
                  const barH = Math.max(4, (day.total / 100) * 100);
                  const barColor = day.total >= 80 ? "#22C55E" : day.total >= 50 ? "#F59E0B" : "#EF4444";
                  return (
                    <View key={i} style={[styles.chartBarCol, { width: chartBarWidth }]}>
                      <Text style={[styles.chartBarVal, { color: barColor }]}>{day.total}</Text>
                      <View style={[styles.chartBar, { height: barH, backgroundColor: barColor, width: chartBarWidth - 4 }]} />
                      <Text style={[styles.chartBarDate, { color: colors.muted }]}>{day.date.slice(8)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 14 }}>{t("لا توجد بيانات لهذه الفترة", "No data for this period")}</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>📋 {t("تفصيل الفئات", "Category Breakdown")}</Text>
          {CATEGORIES.map((cat) => {
            const val = timeRange === "daily" ? todayPoints[cat.key] : categoryAvgs[cat.key];
            const pct = Math.min(100, (val / cat.max) * 100);
            return (
              <View key={cat.key} style={styles.catRow}>
                <View style={styles.catLabelRow}>
                  <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: colors.text }]}>{cat.label}</Text>
                  <Text style={[styles.catVal, { color: cat.color }]}>{val}/{cat.max}</Text>
                </View>
                <View style={[styles.catBarBg, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]}>
                  <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 6 }]}>🎁 {t("استبدال النقاط", "Redeem Points")}</Text>
          <Text style={[styles.rewardsSubtitle, { color: colors.muted }]}>{t(`لديك ${availablePoints} نقطة متاحة للاستبدال`, `You have ${availablePoints} points available`)}</Text>

          {REWARDS.map((reward, i) => {
            const canRedeem = availablePoints >= reward.points;
            return (
              <View key={i} style={[styles.rewardItem, { borderColor: colors.border, opacity: canRedeem ? 1 : 0.5 }]}>
                <View style={[styles.rewardEmoji, { backgroundColor: canRedeem ? "#C490D820" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)") }]}>
                  <Text style={{ fontSize: 28 }}>{reward.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rewardTitle, { color: colors.text }]}>{reward.title}</Text>
                  <Text style={[styles.rewardDesc, { color: colors.muted }]}>{reward.desc}</Text>
                  <Text style={[styles.rewardCost, { color: "#C490D8" }]}>{reward.points} {t("نقطة", "pts")}</Text>
                </View>
                <Pressable
                  style={[styles.redeemBtn, { backgroundColor: canRedeem ? "#C490D8" : colors.border }]}
                  onPress={() => canRedeem && redeemPoints(reward.points)}
                  disabled={!canRedeem}
                >
                  <Text style={[styles.redeemBtnText, { color: canRedeem ? "#fff" : colors.muted }]}>{t("استبدال", "Redeem")}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, marginBottom: 40 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>💡 {t("كيف تكسب النقاط؟", "How to earn points?")}</Text>
          <View style={styles.tipRow}>
            <Text style={{ fontSize: 14 }}>🍽️</Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>{t("سجّل وجباتك اليومية (حتى 25 نقطة)", "Log your daily meals (up to 25 pts)")}</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={{ fontSize: 14 }}>🏋️</Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>{t("أكمل تمارينك (حتى 25 نقطة)", "Complete your workouts (up to 25 pts)")}</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={{ fontSize: 14 }}>💧</Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>{t("اشرب 8 أكواب ماء (حتى 25 نقطة)", "Drink 8 cups of water (up to 25 pts)")}</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={{ fontSize: 14 }}>😴</Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>{t("نم 7-9 ساعات (حتى 25 نقطة)", "Sleep 7–9 hours (up to 25 pts)")}</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={{ fontSize: 14 }}>⚖️</Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>{t("سجّل وزنك يومياً (5 نقاط إضافية)", "Log your weight daily (5 bonus pts)")}</Text>
          </View>
        </View>
      </View>

      {/* ─── مودال صندوق المفاجآت ─── */}
      <MysteryRewardModal reward={lastMysteryReward} onClose={dismissMysteryReward} t={t} lang={lang} isDark={isDark} />
    </ScrollView>
  );
}

function MysteryRewardModal({
  reward,
  onClose,
  t,
  lang,
  isDark,
}: {
  reward: { points: number; tierIcon: string } | null;
  onClose: () => void;
  t: (a: string, e: string) => string;
  lang: string;
  isDark: boolean;
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reward) {
      scale.setValue(0);
      rotate.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
  }, [reward]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "720deg"] });

  return (
    <Modal visible={!!reward} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable onPress={() => {}}>
          <LinearGradient
            colors={["#A86DBF", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalCard}
          >
            <Animated.View style={{ transform: [{ scale }, { rotate: spin }] }}>
              <Text style={styles.modalGiftIcon}>🎁</Text>
            </Animated.View>
            <Text style={styles.modalTitle}>{t("مبروك!", "Congrats!")}</Text>
            <Text style={styles.modalReward}>
              +{reward?.points ?? 0} {t("نقطة", "pts")} {reward?.tierIcon ?? ""}
            </Text>
            <Text style={styles.modalSub}>
              {lang === "ar" ? "أُضيفت لرصيدك القابل للاستبدال" : "Added to your redeemable balance"}
            </Text>
            <Pressable onPress={onClose} style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>{t("رائع!", "Awesome!")}</Text>
            </Pressable>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  heroSection: { paddingVertical: 24, paddingHorizontal: 20, marginHorizontal: 20, borderRadius: 24 },
  heroCircleWrap: { alignItems: "center", marginBottom: 20 },
  heroCircleBg: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, alignItems: "center", justifyContent: "center", position: "relative" },
  heroCircleProgress: { position: "absolute", width: 120, height: 120, borderRadius: 60, borderWidth: 8 },
  heroCircleInner: { flexDirection: "row-reverse", alignItems: "baseline", gap: 2 },
  heroScore: { fontSize: 36, fontFamily: "Cairo_700Bold" },
  heroScoreMax: { fontSize: 16, fontFamily: "Tajawal_500Medium" },
  heroLabel: { fontSize: 14, fontFamily: "Tajawal_700Bold", marginTop: 8 },
  heroStatsRow: { flexDirection: "row-reverse", justifyContent: "space-around", alignItems: "center" },
  heroStatItem: { alignItems: "center", flex: 1 },
  heroStatVal: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  heroStatLabel: { fontSize: 11, fontFamily: "Tajawal_500Medium", marginTop: 2, textAlign: "center" },
  heroStatDivider: { width: 1, height: 30 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  timeTabs: { flexDirection: "row-reverse", gap: 6, marginBottom: 16 },
  timeTab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  timeTabText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  card: { borderRadius: 20, padding: 18, borderWidth: 1, marginBottom: 16 },
  cardHeader: { marginBottom: 14 },
  cardTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  periodStats: { flexDirection: "row-reverse", alignItems: "center", marginTop: 4 },
  periodStatLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  periodStatVal: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  chartContainer: { marginTop: 4 },
  chartBars: { flexDirection: "row-reverse", alignItems: "flex-end", justifyContent: "center", height: 130, gap: 4 },
  chartBarCol: { alignItems: "center" },
  chartBar: { borderRadius: 4, minHeight: 4 },
  chartBarVal: { fontSize: 9, fontFamily: "Tajawal_700Bold", marginBottom: 3 },
  chartBarDate: { fontSize: 8, fontFamily: "Tajawal_400Regular", marginTop: 4 },
  emptyChart: { height: 100, alignItems: "center", justifyContent: "center" },
  catRow: { marginBottom: 14 },
  catLabelRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 6 },
  catLabel: { flex: 1, fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  catVal: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  catBarBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  catBarFill: { height: "100%", borderRadius: 4 },
  rewardsSubtitle: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right", marginBottom: 16 },
  rewardItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  rewardEmoji: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rewardTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  rewardDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  rewardCost: { fontSize: 12, fontFamily: "Tajawal_700Bold", marginTop: 4 },
  redeemBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  redeemBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  tipRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingVertical: 6 },
  tipText: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right", flex: 1 },

  tierCard: { borderRadius: 24, padding: 18, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  tierTopRow: { flexDirection: "row-reverse", alignItems: "center", gap: 14, marginBottom: 16 },
  tierIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)" },
  tierIcon: { fontSize: 38 },
  tierLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Tajawal_500Medium", marginBottom: 8 },
  tierBenefitsRow: { flexDirection: "row-reverse", gap: 6 },
  tierBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tierBadgeIcon: { fontSize: 13 },
  tierBadgeText: { color: "#fff", fontSize: 12, fontFamily: "Cairo_700Bold" },
  tierProgressWrap: { marginTop: 4, marginBottom: 12 },
  tierProgressTrack: { height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.2)", overflow: "hidden" },
  tierProgressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 4 },
  tierMarkers: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  tierMarker: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  tierMarkerActive: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 18, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)" },
  tierProgressText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "center", marginTop: 4 },

  tierRow: { flexDirection: "row-reverse", alignItems: "center", gap: 14, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  tierRowIcon: { width: 50, alignItems: "center", justifyContent: "center" },
  tierRowRange: { fontSize: 14, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  tierRowBenefits: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  tierRowBenefitText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  tierCurrentPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tierCurrentPillText: { color: "#fff", fontSize: 11, fontFamily: "Cairo_700Bold" },

  mysteryBox: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 22, shadowColor: "#A86DBF", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  mysteryIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  mysteryIcon: { fontSize: 32 },
  mysteryTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  mysteryDesc: { fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", marginTop: 2 },
  mysteryCta: { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)" },
  mysteryCtaText: { color: "#fff", fontSize: 13, fontFamily: "Cairo_700Bold" },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center", justifyContent: "center", padding: 28 },
  modalCard: { borderRadius: 28, padding: 28, alignItems: "center", minWidth: 280 },
  modalGiftIcon: { fontSize: 96, marginBottom: 8 },
  modalTitle: { color: "#fff", fontSize: 24, fontFamily: "Cairo_700Bold", marginTop: 4 },
  modalReward: { color: "#fff", fontSize: 32, fontFamily: "Cairo_700Bold", marginTop: 8 },
  modalSub: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Tajawal_500Medium", marginTop: 6, textAlign: "center" },
  modalBtn: { marginTop: 20, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 14, paddingHorizontal: 36, paddingVertical: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)" },
  modalBtnText: { color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold" },
});
