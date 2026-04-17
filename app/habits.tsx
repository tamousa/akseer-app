import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const todayStr = () => new Date().toISOString().split("T")[0];

const HABIT_TYPES = [
  { keyAr: "صحية",   keyEn: "Health",    emoji: "❤️" },
  { keyAr: "رياضية", keyEn: "Sports",    emoji: "🏃" },
  { keyAr: "تغذوية", keyEn: "Nutrition", emoji: "🥗" },
  { keyAr: "نفسية",  keyEn: "Mental",    emoji: "🧠" },
  { keyAr: "نوم",    keyEn: "Sleep",     emoji: "😴" },
  { keyAr: "مياه",   keyEn: "Water",     emoji: "💧" },
];

const DURATION_OPTIONS = [
  { labelAr: "7 أيام",   labelEn: "7 Days",    days: 7 },
  { labelAr: "21 يوماً", labelEn: "21 Days",   days: 21 },
  { labelAr: "30 يوماً", labelEn: "30 Days",   days: 30 },
  { labelAr: "45 يوماً", labelEn: "45 Days",   days: 45 },
  { labelAr: "60 يوماً", labelEn: "60 Days",   days: 60 },
  { labelAr: "90 يوماً", labelEn: "90 Days",   days: 90 },
  { labelAr: "6 أشهر",  labelEn: "6 Months",  days: 180 },
  { labelAr: "سنة",     labelEn: "1 Year",     days: 365 },
];

// ─── Circular Progress Ring ──────────────────────────────────────────────────
function RingChart({ pct, size = 110, strokeWidth = 11, color = "#A86DBF" }: {
  pct: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct, 1);
  const cx = size / 2;
  const cy = size / 2;
  return (
    <Svg width={size} height={size}>
      {/* background track */}
      <Circle
        cx={cx} cy={cy} r={r}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* progress arc — rotated -90deg around center using transform */}
      <Circle
        cx={cx} cy={cy} r={r}
        stroke={pct >= 1 ? "#22C55E" : color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </Svg>
  );
}

// ─── Mini Horizontal Bar ─────────────────────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.06)", overflow: "hidden", flex: 1 }}>
      <View style={{ width: `${Math.min(pct * 100, 100)}%`, height: 6, backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
}

export default function HabitsScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { habits, toggleHabitDay, addHabit } = useApp();
  const topPadding = isWeb ? 67 : insets.top;

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");
  const [newTypeAr, setNewTypeAr] = useState("صحية");
  const [targetDays, setTargetDays] = useState<number>(30);

  const confettiRef = useRef<ConfettiCannon>(null);
  const prevCompleted = useRef<number>(-1);

  const today = todayStr();
  const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;
  const todayPct = habits.length > 0 ? completedToday / habits.length : 0;

  useEffect(() => {
    if (
      habits.length > 0 &&
      completedToday === habits.length &&
      prevCompleted.current !== habits.length
    ) {
      confettiRef.current?.start();
    }
    prevCompleted.current = completedToday;
  }, [completedToday, habits.length]);

  // ── helpers ──
  const getStreak = (h: typeof habits[0]) => {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = d.toISOString().split("T")[0];
      if (h.completedDates.includes(ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    return streak;
  };

  const getDaysSinceStart = (startDate?: string) => {
    if (!startDate) return 0;
    return Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1;
  };

  const getLast7Days = () => {
    const dayNamesAr = ["أحد", "إثن", "ثلا", "أرب", "خمس", "جمع", "سبت"];
    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toISOString().split("T")[0], label: lang === "ar" ? dayNamesAr[d.getDay()] : dayNamesEn[d.getDay()] };
    });
  };

  // Completion rate in last N days for a habit
  const getAdherence = (h: typeof habits[0], days = 30) => {
    let count = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (h.completedDates.includes(d.toISOString().split("T")[0])) count++;
    }
    return days > 0 ? count / days : 0;
  };

  const handleAdd = () => {
    if (!newName.trim()) { Alert.alert(t("خطأ", "Error"), t("أدخل اسم العادة", "Enter a habit name")); return; }
    addHabit({ name: newName, emoji: newEmoji, type: newTypeAr, dailyGoal: 1, unit: t("مرة", "time"), targetDays, startDate: todayStr() });
    setNewName(""); setTargetDays(30); setShowAdd(false);
    Alert.alert(t("تمت الإضافة", "Added!"), t("عادة جديدة أضيفت بنجاح!", "New habit added successfully!"));
  };

  const last7 = getLast7Days();

  // Category colors
  const HABIT_COLORS = ["#A86DBF", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("ارتقِ", "Elevate")} 🎯</Text>
        <Pressable
          onPress={() => setShowAdd(!showAdd)}
          style={styles.addIconBtn}
        >
          <Feather name={showAdd ? "x" : "plus"} size={22} color="#A86DBF" />
        </Pressable>
      </View>

      {/* ── Today's Progress Card (Ring + Stats) ── */}
      <View style={[styles.progressCard, { backgroundColor: "#A86DBF" }]}>
        <View style={styles.progressCardInner}>
          {/* Ring */}
          <View style={{ width: 100, height: 100 }}>
            <RingChart pct={todayPct} size={100} strokeWidth={10} color="#F5D26A" />
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <Text style={styles.ringPct}>{Math.round(todayPct * 100)}%</Text>
            </View>
          </View>
          {/* Text stats */}
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.progressTitle}>{t("تقدمك اليوم", "Today's Progress")}</Text>
            <Text style={styles.progressText}>
              {completedToday} {t("من", "of")} {habits.length} {t("عادات مكتملة", "habits done")}
            </Text>
            {completedToday === habits.length && habits.length > 0 && (
              <View style={styles.congBadge}>
                <Text style={styles.congText}>🏆 {t("يوم مثالي!", "Perfect Day!")}</Text>
              </View>
            )}
            <View style={{ gap: 4, marginTop: 4 }}>
              <View style={{ height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                <View style={{ width: `${todayPct * 100}%`, height: 6, backgroundColor: "#F5D26A", borderRadius: 3 }} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── Charts Section ── */}
      {habits.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 {t("إحصائيات الالتزام", "Commitment Stats")}</Text>

          {/* Per-habit adherence bars */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>{t("نسبة الالتزام (آخر 30 يوماً)", "Adherence Rate (Last 30 Days)")}</Text>
            <View style={{ gap: 12, marginTop: 10 }}>
              {habits.map((h, i) => {
                const adh = getAdherence(h, 30);
                const barColor = HABIT_COLORS[i % HABIT_COLORS.length];
                return (
                  <View key={h.id} style={{ gap: 5 }}>
                    <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={[styles.chartHabitName, { color: colors.text }]}>{h.emoji} {h.name}</Text>
                      <Text style={[styles.chartPctLabel, { color: barColor }]}>{Math.round(adh * 100)}%</Text>
                    </View>
                    <MiniBar pct={adh} color={barColor} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Weekly bar chart */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, marginTop: 12 }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>{t("الأداء الأسبوعي", "Weekly Performance")}</Text>
            <View style={styles.barChartRow}>
              {last7.map((day) => {
                const done = habits.filter((h) => h.completedDates.includes(day.date)).length;
                const ratio = habits.length > 0 ? done / habits.length : 0;
                const barH = Math.max(ratio * 80, 4);
                const barColor = ratio >= 1 ? "#22C55E" : ratio > 0 ? "#A86DBF" : (isDark ? colors.surfaceAlt : "#EDE9FE");
                return (
                  <View key={day.date} style={styles.barCol}>
                    <Text style={[styles.barPct, { color: colors.muted }]}>
                      {ratio > 0 ? `${Math.round(ratio * 100)}%` : ""}
                    </Text>
                    <View style={[styles.barBg, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3EEFA" }]}>
                      <View style={[styles.barFill, { height: barH, backgroundColor: barColor }]} />
                    </View>
                    <Text style={[styles.barLabel, { color: day.date === today ? "#A86DBF" : colors.muted, fontFamily: day.date === today ? "Tajawal_700Bold" : "Tajawal_400Regular" }]}>
                      {day.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Per-habit ring charts row */}
          <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, marginTop: 12 }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>{t("نسبة إنجاز الأهداف", "Goal Completion Rate")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ flexDirection: "row-reverse", gap: 16, paddingHorizontal: 4 }}>
              {habits.map((h, i) => {
                const elapsed = getDaysSinceStart(h.startDate);
                const target = h.targetDays || 30;
                const pct = Math.min(elapsed / target, 1);
                const barColor = HABIT_COLORS[i % HABIT_COLORS.length];
                return (
                  <View key={h.id} style={{ alignItems: "center", gap: 6 }}>
                    <View style={{ width: 72, height: 72 }}>
                      <RingChart pct={pct} size={72} strokeWidth={8} color={barColor} />
                      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.miniRingPct, { color: barColor }]}>{Math.round(pct * 100)}%</Text>
                      </View>
                    </View>
                    <Text style={[styles.ringHabitName, { color: colors.text }]} numberOfLines={1}>{h.emoji}</Text>
                    <Text style={[styles.ringHabitLabel, { color: colors.muted }]} numberOfLines={1}>{h.name}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ── Add Habit Form ── */}
      {showAdd && (
        <View style={[styles.addCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: "#A86DBF40" }]}>
          <Text style={[styles.addTitle, { color: colors.text }]}>{t("إضافة عادة جديدة", "Add New Habit")}</Text>
          <TextInput
            placeholder={t("اسم العادة", "Habit name")}
            placeholderTextColor={colors.muted}
            value={newName}
            onChangeText={setNewName}
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
            textAlign="right"
          />
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>{t("النوع", "Type")}</Text>
          <View style={styles.typeGrid}>
            {HABIT_TYPES.map((ht) => (
              <Pressable
                key={ht.keyAr}
                style={[styles.typeChip, { backgroundColor: newTypeAr === ht.keyAr ? "#A86DBF" : isDark ? colors.surfaceAlt : "#FDF6FA" }]}
                onPress={() => { setNewTypeAr(ht.keyAr); setNewEmoji(ht.emoji); }}
              >
                <Text style={{ fontSize: 16 }}>{ht.emoji}</Text>
                <Text style={[styles.typeText, { color: newTypeAr === ht.keyAr ? "#fff" : colors.text }]}>{t(ht.keyAr, ht.keyEn)}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.fieldLabel, { color: colors.muted }]}>{t("مدة الهدف", "Goal Duration")}</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((opt) => (
              <Pressable
                key={opt.days}
                style={[styles.durationChip, { backgroundColor: targetDays === opt.days ? "#A86DBF" : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: targetDays === opt.days ? "#A86DBF" : colors.border }]}
                onPress={() => setTargetDays(opt.days)}
              >
                <Text style={[styles.durationText, { color: targetDays === opt.days ? "#fff" : colors.text }]}>{t(opt.labelAr, opt.labelEn)}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.addActions}>
            <Pressable style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>{t("إضافة العادة", "Add Habit")}</Text>
            </Pressable>
            <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowAdd(false)}>
              <Text style={[styles.cancelBtnText, { color: colors.muted }]}>{t("إلغاء", "Cancel")}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Habits List ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("عاداتك اليومية", "Your Daily Habits")}</Text>
        {habits.length === 0 ? (
          <View style={{ alignItems: "center", padding: 30, gap: 10 }}>
            <Text style={{ fontSize: 40 }}>🌱</Text>
            <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 15, textAlign: "center" }}>
              {t("لا توجد عادات بعد\nاضغط + لإضافة أولى عاداتك", "No habits yet\nTap + to add your first habit")}
            </Text>
          </View>
        ) : habits.map((habit, i) => {
          const isCompleted = habit.completedDates.includes(today);
          const streak = getStreak(habit);
          const elapsed = getDaysSinceStart(habit.startDate);
          const target = habit.targetDays;
          const progressDays = target ? Math.min(elapsed, target) : streak;
          const isGoalDone = target ? progressDays >= target : false;
          const progressPct = target ? Math.min(progressDays / target, 1) : (streak > 0 ? 1 : 0);
          const barColor = HABIT_COLORS[i % HABIT_COLORS.length];

          return (
            <View key={habit.id} style={[styles.habitCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: isCompleted ? "#22C55E40" : colors.border }]}>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: target ? 10 : 0 }}>
                <Pressable
                  style={[styles.checkBtn, { backgroundColor: isCompleted ? "#22C55E" : isDark ? colors.surfaceAlt : "#FDF6FA" }]}
                  onPress={() => toggleHabitDay(habit.id, today)}
                >
                  {isCompleted ? <Feather name="check" size={22} color="#fff" /> : <Text style={{ fontSize: 22 }}>{habit.emoji}</Text>}
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitName, { color: colors.text, textDecorationLine: isCompleted ? "line-through" : "none" }]}>{habit.name}</Text>
                  <Text style={[styles.habitMeta, { color: colors.muted }]}>{habit.type} • {habit.dailyGoal} {habit.unit}</Text>
                </View>
                {target ? (
                  <View style={{ alignItems: "center", gap: 2 }}>
                    <View style={[styles.counterBadge, { backgroundColor: isGoalDone ? "#22C55E" : barColor }]}>
                      <Text style={styles.counterNum}>{progressDays}</Text>
                      <Text style={styles.counterSlash}>/</Text>
                      <Text style={styles.counterTarget}>{target}</Text>
                    </View>
                    <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 9 }}>{t("يوم", "day")}</Text>
                  </View>
                ) : streak > 0 ? (
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakText}>🔥 {streak}</Text>
                  </View>
                ) : null}
              </View>
              {target && (
                <View style={{ gap: 4 }}>
                  <View style={{ height: 5, backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <View style={{ width: `${progressPct * 100}%`, height: 5, backgroundColor: isGoalDone ? "#22C55E" : barColor, borderRadius: 3 }} />
                  </View>
                  <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 10 }}>
                      {isGoalDone ? `🎉 ${t("أكملت الهدف!", "Goal complete!")}` : `${Math.round(progressPct * 100)}%`}
                    </Text>
                    {!isGoalDone && target && (
                      <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 10 }}>
                        {target - progressDays} {t("يوم متبقي", "days left")}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* ── Last 7 Days Grid ── */}
      {habits.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("آخر 7 أيام", "Last 7 Days")}</Text>
          <View style={[styles.weekCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <View style={styles.weekRow}>
              {last7.map((day) => {
                const done = habits.filter((h) => h.completedDates.includes(day.date)).length;
                const ratio = habits.length > 0 ? done / habits.length : 0;
                return (
                  <View key={day.date} style={styles.weekDay}>
                    <View style={[styles.weekDot, { backgroundColor: ratio >= 1 ? "#22C55E" : ratio > 0 ? "#A86DBF" : isDark ? colors.surfaceAlt : "#F9EFF5" }]}>
                      {ratio >= 1 && <Feather name="check" size={14} color="#fff" />}
                      {ratio > 0 && ratio < 1 && <Text style={{ fontSize: 10, color: "#fff", fontFamily: "Tajawal_700Bold" }}>{done}</Text>}
                    </View>
                    <Text style={[styles.weekLabel, { color: day.date === today ? "#A86DBF" : colors.muted }]}>{day.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </ScrollView>

    {/* Confetti overlay — fires when all habits are done */}
    <ConfettiCannon
      ref={confettiRef}
      count={180}
      origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
      autoStart={false}
      fadeOut
      fallSpeed={3000}
      explosionSpeed={400}
      colors={["#A86DBF", "#EC4899", "#F5D26A", "#22C55E", "#3B82F6", "#F97316"]}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  addIconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#A86DBF15", alignItems: "center", justifyContent: "center" },

  // Progress card
  progressCard: { marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 20 },
  progressCardInner: { flexDirection: "row-reverse", alignItems: "center", gap: 18 },
  ringPct: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 18 },
  progressTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  progressText: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  congBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, alignSelf: "flex-end" },
  congText: { color: "#F5D26A", fontFamily: "Tajawal_700Bold", fontSize: 13 },

  // Charts
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 12 },
  chartCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  chartTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  chartHabitName: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  chartPctLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold" },

  // Vertical bar chart
  barChartRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12, paddingHorizontal: 4 },
  barCol: { alignItems: "center", gap: 4, flex: 1 },
  barPct: { fontSize: 9, fontFamily: "Tajawal_400Regular" },
  barBg: { width: 26, height: 80, borderRadius: 8, justifyContent: "flex-end", overflow: "hidden" },
  barFill: { width: "100%", borderRadius: 8 },
  barLabel: { fontSize: 10 },

  // Ring habit mini
  miniRingPct: { fontFamily: "Tajawal_700Bold", fontSize: 12 },
  ringHabitName: { fontSize: 18, textAlign: "center" },
  ringHabitLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center", maxWidth: 64 },

  // Habit cards
  habitCard: { borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1.5 },
  checkBtn: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  habitName: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  habitMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  counterBadge: { flexDirection: "row", alignItems: "baseline", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 1 },
  counterNum: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  counterSlash: { color: "rgba(255,255,255,0.6)", fontFamily: "Tajawal_400Regular", fontSize: 11 },
  counterTarget: { color: "rgba(255,255,255,0.8)", fontFamily: "Tajawal_500Medium", fontSize: 11 },
  streakBadge: { backgroundColor: "#F59E0B15", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  streakText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#F59E0B" },

  // Week grid
  weekCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  weekRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  weekDay: { alignItems: "center", gap: 6 },
  weekDot: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  weekLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },

  // Add form
  addCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, borderWidth: 1.5, marginBottom: 20 },
  addTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Tajawal_400Regular", marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right", marginBottom: 8 },
  typeGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  typeChip: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50 },
  typeText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  durationGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  durationChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, borderWidth: 1 },
  durationText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  addActions: { flexDirection: "row-reverse", gap: 10 },
  addBtn: { flex: 1, backgroundColor: "#A86DBF", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  cancelBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1 },
  cancelBtnText: { fontSize: 15, fontFamily: "Tajawal_500Medium" },
});
