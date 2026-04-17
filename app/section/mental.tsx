import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Animated,
  Dimensions,
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const MOODS = [
  { value: 5, label: "ممتاز", emoji: "😄", color: "#22C55E" },
  { value: 4, label: "جيد",   emoji: "🙂", color: "#3B82F6" },
  { value: 3, label: "عادي",  emoji: "😐", color: "#F59E0B" },
  { value: 2, label: "توتر",  emoji: "😰", color: "#F97316" },
  { value: 1, label: "حزن",   emoji: "😢", color: "#EC4899" },
  { value: 0, label: "قلق",   emoji: "😟", color: "#C490D8" },
];

const SAMPLE_MOOD_HISTORY = [
  { id: "1", date: "اليوم، 9:30 ص",       mood: 4, note: "بداية يوم جيدة، شعرت بالنشاط بعد النوم المبكر." },
  { id: "2", date: "أمس، 10:15 م",        mood: 3, note: "يوم عادي، قليل من التعب." },
  { id: "3", date: "الأحد، 8:00 ص",       mood: 5, note: "مزاج رائع! أنجزت كل مهامي اليوم." },
  { id: "4", date: "السبت، 11:00 م",      mood: 2, note: "ضغط كثير في العمل اليوم." },
  { id: "5", date: "الجمعة، 7:45 ص",     mood: 5, note: "إجازة جميلة مع العائلة." },
];

const SAMPLE_DIARY = [
  { id: "1", date: "اليوم، 8:45 ص",      title: "تأملاتي الصباحية",         body: "استيقظت مبكراً اليوم وشعرت بأن كل شيء في مكانه الصحيح. الضوء الصباحي كان جميلاً والهواء منعشاً..." },
  { id: "2", date: "أمس، 11:30 م",       title: "قبل النوم",                 body: "أفكّر في المحادثة التي دارت اليوم. أحياناً الصمت أبلغ من الكلام. أحاول أن أتعلم..." },
  { id: "3", date: "الأحد، 9:00 ص",     title: "عن أهدافي",                 body: "قررت أن أكتب أهدافي للشهر القادم. أريد أن أكون أكثر انضباطاً في نومي وتغذيتي..." },
  { id: "4", date: "السبت، 10:00 م",    title: "يوم التحديات",              body: "كان يوماً صعباً لكنني تجاوزته. الصعوبات تعلمنا الصبر والثقة بالنفس..." },
];

const SAMPLE_GRATITUDE = [
  { id: "1", date: "اليوم",      items: ["صحتي وصحة عائلتي", "فنجان القهوة الصباحي", "ابتسامة صديقي"] },
  { id: "2", date: "أمس",       items: ["يوم عمل منتج", "المطر الجميل", "وجبة لذيذة"] },
  { id: "3", date: "الأحد",     items: ["ليلة نوم هادئة", "كتاب ملهم", "حديث دافئ مع أمي"] },
];

const SOUNDS_LIST = [
  { id: "rain",    label: "المطر الهادئ",    emoji: "🌧️", desc: "أمطار خفيفة على الزجاج",     color: "#3B82F6" },
  { id: "river",   label: "نهر متدفق",       emoji: "🏞️", desc: "صوت الماء المتدفق بهدوء",   color: "#0EA5E9" },
  { id: "birds",   label: "أصوات العصافير",  emoji: "🐦", desc: "طيور في حديقة صباحية",      color: "#22C55E" },
  { id: "forest",  label: "الغابة الليلية",  emoji: "🌲", desc: "أصوات الطبيعة الليلية",     color: "#16A34A" },
  { id: "ocean",   label: "أمواج البحر",     emoji: "🌊", desc: "بحر هادئ مع نسيم الليل",    color: "#0284C7" },
  { id: "fire",    label: "الموقد الدافئ",   emoji: "🔥", desc: "أصوات الحطب يحترق",         color: "#F59E0B" },
  { id: "wind",    label: "نسيم الجبال",     emoji: "🍃", desc: "هواء عليل بين الأشجار",     color: "#34D399" },
  { id: "sleep",   label: "نوم عميق",        emoji: "😴", desc: "موسيقى ثيتا للنوم العميق",  color: "#8B5CF6" },
];

const BREATH_PHASES = [
  { label: "شهيق",  duration: 4, color: "#3B82F6", instruction: "تنفس ببطء من أنفك" },
  { label: "احتبس", duration: 7, color: "#8B5CF6", instruction: "احبس نفَسك بهدوء" },
  { label: "زفير",  duration: 8, color: "#22C55E", instruction: "أخرج الهواء ببطء من فمك" },
];

const TIMER_OPTIONS = [
  { label: "5 دق",   seconds: 300 },
  { label: "10 دق",  seconds: 600 },
  { label: "30 دق",  seconds: 1800 },
  { label: "ساعة",   seconds: 3600 },
  { label: "ساعتين", seconds: 7200 },
];

const SUPPORT_GROUPS = [
  { id: "1", name: "مجموعة التعافي من القلق",     members: 3421, emoji: "🧘", color: "#C490D8" },
  { id: "2", name: "قهر الاكتئاب معاً",           members: 1876, emoji: "🌈", color: "#3B82F6" },
  { id: "3", name: "مهارات التعامل مع الضغوط",    members: 2105, emoji: "💪", color: "#22C55E" },
  { id: "4", name: "النوم الجيد والراحة الذهنية", members: 987,  emoji: "😴", color: "#8B5CF6" },
];

const PHQ9_QUESTIONS = [
  "فقدان الاهتمام أو الاستمتاع بالأشياء",
  "الشعور بالحزن أو اليأس أو انعدام الأمل",
  "صعوبة النوم أو النوم الزائد",
  "الشعور بالتعب أو نقص الطاقة",
  "ضعف الشهية أو الإفراط في الأكل",
  "الشعور بالفشل أو خيبة الأمل تجاه النفس",
  "صعوبة التركيز",
  "البطء أو التسارع في الحركة والكلام",
  "أفكار إيذاء النفس",
];

const GAD7_QUESTIONS = [
  "الشعور بالتوتر أو الإرهاق أو الانفعال",
  "عدم القدرة على إيقاف القلق أو السيطرة عليه",
  "القلق الزائد حول أشياء مختلفة",
  "صعوبة الاسترخاء",
  "التململ لدرجة صعوبة الجلوس ساكناً",
  "أن تصبح سريع الانزعاج أو التهيّج",
  "الشعور بالخوف كأن شيئاً سيئاً سيحدث",
];

const WELLNESS_QS = [
  { q: "كيف مستوى طاقتك اليوم؟",         emoji: "⚡" },
  { q: "هل شعرت بالهدوء والاطمئنان؟",    emoji: "🕊️" },
  { q: "هل أتممت مهامك اليومية؟",         emoji: "✅" },
  { q: "هل شعرت بالرضا والأمان؟",         emoji: "🌟" },
  { q: "هل تفاعلت إيجابياً مع الآخرين؟", emoji: "🤝" },
];

const WEEK_WELLNESS = [72, 55, 80, 65, 90, 70, 85];

export default function MentalHealthScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<"tools" | "mood" | "community">("tools");

  // ── Mood ──
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [showMoodHistory, setShowMoodHistory] = useState(false);

  // ── Diary ──
  const [diaryText, setDiaryText] = useState("");
  const [showDiary, setShowDiary] = useState(false);

  // ── Gratitude ──
  const [gratitudeText, setGratitudeText] = useState("");
  const [showGratitude, setShowGratitude] = useState(false);

  // ── Sleep ──
  const [sleepTime, setSleepTime] = useState("11:30 م");
  const [wakeTime, setWakeTime] = useState("6:30 ص");
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);

  // ── Wellness ──
  const [wellnessAnswers, setWellnessAnswers] = useState<Record<number, number>>({});
  const [showWellnessChart, setShowWellnessChart] = useState(false);

  // ── Tests ──
  const [phq9Open, setPhq9Open] = useState(false);
  const [gad7Open, setGad7Open] = useState(false);
  const [phq9Ans, setPhq9Ans] = useState<Record<number, number>>({});
  const [gad7Ans, setGad7Ans] = useState<Record<number, number>>({});
  const [phq9Done, setPhq9Done] = useState(false);
  const [gad7Done, setGad7Done] = useState(false);

  // ── SOS ──
  const [showSOS, setShowSOS] = useState(false);
  const [sosPhase, setSosPhase] = useState(0);
  const [sosTimer, setSosTimer] = useState(4);
  const [sosCycles, setSosCycles] = useState(0);
  const [sosComplete, setSosComplete] = useState(false);
  const sosIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sosAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const sosAnim = useRef(new Animated.Value(0.6)).current;

  // ── Breathing tool ──
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(BREATH_PHASES[0].duration);
  const breathAnim = useRef(new Animated.Value(0.6)).current;
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // ── Relaxation timer ──
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  // Pulse for banner
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Breathing animation helper
  const startBreathPhase = useCallback((phase: number) => {
    const p = BREATH_PHASES[phase];
    setBreathPhase(phase);
    setBreathTimer(p.duration);
    breathAnimRef.current?.stop();
    const toValue = phase === 0 ? 1 : phase === 1 ? 1 : 0.6;
    breathAnimRef.current = Animated.timing(breathAnim, { toValue, duration: p.duration * 1000, useNativeDriver: true });
    breathAnimRef.current.start();
    let t = p.duration;
    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    breathIntervalRef.current = setInterval(() => {
      t -= 1;
      setBreathTimer(t);
      if (t <= 0) {
        clearInterval(breathIntervalRef.current!);
        const next = (phase + 1) % BREATH_PHASES.length;
        if (next === 0) setBreathCount((c) => c + 1);
        startBreathPhase(next);
      }
    }, 1000);
  }, []);

  const toggleBreath = () => {
    if (breathActive) {
      setBreathActive(false);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      breathAnimRef.current?.stop();
      breathAnim.setValue(0.6);
      setBreathPhase(0);
      setBreathTimer(BREATH_PHASES[0].duration);
    } else {
      setBreathActive(true);
      setBreathCount(0);
      startBreathPhase(0);
    }
  };
  useEffect(() => { return () => { if (breathIntervalRef.current) clearInterval(breathIntervalRef.current); }; }, []);

  // SOS breathing
  const startSOSPhase = useCallback((phase: number) => {
    const p = BREATH_PHASES[phase];
    setSosPhase(phase);
    setSosTimer(p.duration);
    sosAnimRef.current?.stop();
    const toValue = phase === 0 ? 1 : phase === 1 ? 1 : 0.6;
    sosAnimRef.current = Animated.timing(sosAnim, { toValue, duration: p.duration * 1000, useNativeDriver: true });
    sosAnimRef.current.start();
    let t = p.duration;
    if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    sosIntervalRef.current = setInterval(() => {
      t -= 1;
      setSosTimer(t);
      if (t <= 0) {
        clearInterval(sosIntervalRef.current!);
        const next = (phase + 1) % BREATH_PHASES.length;
        if (next === 0) setSosCycles((c) => {
          const newC = c + 1;
          if (newC >= 3) { setSosComplete(true); return newC; }
          return newC;
        });
        if (!sosComplete) startSOSPhase(next);
      }
    }, 1000);
  }, [sosComplete]);

  const openSOS = () => {
    setSosComplete(false);
    setSosCycles(0);
    setSosPhase(0);
    setSosTimer(4);
    sosAnim.setValue(0.6);
    setShowSOS(true);
    setTimeout(() => startSOSPhase(0), 500);
  };

  const closeSOS = () => {
    if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    sosAnimRef.current?.stop();
    setShowSOS(false);
    setSosComplete(false);
    setSosCycles(0);
  };
  useEffect(() => { return () => { if (sosIntervalRef.current) clearInterval(sosIntervalRef.current); }; }, []);

  // Relaxation timer
  const toggleTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      setTimerRemaining(timerSeconds);
      setTimerActive(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((r) => {
          if (r <= 1) { clearInterval(timerIntervalRef.current!); setTimerActive(false); return 0; }
          return r - 1;
        });
      }, 1000);
    }
  };
  useEffect(() => { return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); }; }, []);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const currentPhase = BREATH_PHASES[breathPhase];
  const sosCurrentPhase = BREATH_PHASES[sosPhase];
  const breathScale = breathAnim.interpolate({ inputRange: [0.6, 1], outputRange: [0.6, 1] });
  const sosScale    = sosAnim.interpolate({ inputRange: [0.6, 1], outputRange: [0.6, 1] });
  const timerProgress = timerSeconds > 0 ? 1 - timerRemaining / timerSeconds : 0;

  const phq9Score = Object.values(phq9Ans).reduce((a, b) => a + b, 0);
  const gad7Score = Object.values(gad7Ans).reduce((a, b) => a + b, 0);
  const phq9Level = phq9Score <= 4 ? { label: "لا يوجد اكتئاب", color: "#22C55E" } : phq9Score <= 9 ? { label: "اكتئاب خفيف", color: "#F59E0B" } : phq9Score <= 14 ? { label: "اكتئاب معتدل", color: "#F97316" } : { label: "اكتئاب شديد", color: "#EF4444" };
  const gad7Level = gad7Score <= 4 ? { label: "قلق طبيعي", color: "#22C55E" } : gad7Score <= 9 ? { label: "قلق خفيف", color: "#F59E0B" } : gad7Score <= 14 ? { label: "قلق معتدل", color: "#F97316" } : { label: "قلق شديد", color: "#EF4444" };

  const wellnessTotal = Object.keys(wellnessAnswers).length === WELLNESS_QS.length
    ? Math.round((Object.values(wellnessAnswers).reduce((a, b) => a + b, 0) / (WELLNESS_QS.length * 5)) * 100)
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: topPadding }]}>
        <Image source={require("@/assets/images/mental-meditation-hero.png")} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
        <LinearGradient colors={["rgba(80,0,180,0.25)", "rgba(91,33,182,0.88)"]} style={StyleSheet.absoluteFill as any} />
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: topPadding }]}>
          <Feather name="chevron-right" size={24} color="#fff" />
        </Pressable>
        <Pressable onPress={() => router.push("/bookings" as any)} style={[styles.bookingsBtn, { top: topPadding }]}>
          <Feather name="calendar" size={20} color="#fff" />
          <Text style={styles.bookingsBtnText}>حجوزاتي</Text>
        </Pressable>
        <View style={{ padding: 20, paddingTop: 52 }}>
          <Text style={styles.headerTitle}>الصحة النفسية 🧠</Text>
          <Text style={styles.headerSub}>أدوات للتأمل، التنفس، وتتبع مشاعرك</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsBar, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {[
          { key: "tools" as const,     label: "الأدوات",   emoji: "🛠️" },
          { key: "mood" as const,      label: "مزاجك",     emoji: "😊" },
          { key: "community" as const, label: "المجتمع",   emoji: "🤝" },
        ].map((t) => (
          <Pressable key={t.key} style={[styles.tabBtn, activeTab === t.key && { borderBottomColor: "#8B5CF6" }]} onPress={() => setActiveTab(t.key)}>
            <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
            <Text style={[styles.tabTxt, { color: activeTab === t.key ? "#8B5CF6" : colors.muted }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40, gap: 14, padding: 16 }}>

        {/* ─────────────── TOOLS TAB ─────────────── */}
        {activeTab === "tools" && (
          <>
            {/* SOS PANIC BUTTON */}
            <Pressable onPress={openSOS} style={styles.sosCard}>
              <View style={styles.sosBadge}>
                <Text style={styles.sosBadgeTxt}>SOS 🆘</Text>
              </View>
              <Text style={styles.sosTitle}>نوبة قلق أو ذعر؟</Text>
              <Text style={styles.sosSub}>اضغط لبدء بروتوكول التهدئة الفوري</Text>
              <View style={styles.sosBtn}>
                <Text style={styles.sosBtnTxt}>🆘 ابدأ التهدئة الآن</Text>
              </View>
            </Pressable>

            {/* Animated Clinic Banner */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Pressable onPress={() => router.push("/section/clinics" as any)} style={[styles.aiHeroBanner, { overflow: "hidden" }]}>
                <Image source={require("@/assets/images/mental-therapy-banner.png")} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                <LinearGradient colors={["transparent", "rgba(91,33,182,0.92)"]} style={StyleSheet.absoluteFill as any} />
                <View style={styles.aiHeroContent}>
                  <Text style={styles.bannerTitle}>🧠 تحدث مع معالج نفسي</Text>
                  <Text style={styles.bannerSub}>جلسات فردية • عن بُعد • سرية تامة • معتمدون</Text>
                  <View style={styles.bannerCTA}><Text style={styles.bannerCTATxt}>احجز جلستك ←</Text></View>
                </View>
              </Pressable>
            </Animated.View>

            {/* Breathing Tool */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>🫁 تمرين التنفس العميق</Text>
              <Text style={[styles.toolSub, { color: colors.muted }]}>تقنية 4-7-8: شهيق 4 ث • احتبس 7 ث • زفير 8 ث</Text>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Animated.View style={[styles.breathCircle, { transform: [{ scale: breathScale }], borderColor: currentPhase.color, backgroundColor: currentPhase.color + "15" }]}>
                  <Text style={[styles.breathPhaseLabel, { color: currentPhase.color }]}>{currentPhase.label}</Text>
                  <Text style={[styles.breathTimer, { color: currentPhase.color }]}>{breathTimer}</Text>
                  <Text style={[styles.breathInstruction, { color: colors.muted }]}>{currentPhase.instruction}</Text>
                </Animated.View>
                {breathActive && <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 12, marginTop: 8 }]}>دورة {breathCount + 1}</Text>}
              </View>
              <Pressable style={[styles.breathBtn, { backgroundColor: breathActive ? "#EF4444" : "#8B5CF6" }]} onPress={toggleBreath}>
                <Text style={styles.breathBtnTxt}>{breathActive ? "إيقاف" : "ابدأ التنفس"}</Text>
              </Pressable>
            </View>

            {/* Relaxation Timer + Sounds (Calm style) */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>⏱️ عداد الاسترخاء</Text>
              <Text style={[styles.toolSub, { color: colors.muted }]}>اختر مدة جلستك وصوتاً مريحاً</Text>
              {!timerActive && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}>
                  {TIMER_OPTIONS.map((opt) => (
                    <Pressable key={opt.label} style={[styles.timerChip, { backgroundColor: timerSeconds === opt.seconds ? "#8B5CF6" : isDark ? colors.surfaceAlt : "#F5F3FF", borderColor: timerSeconds === opt.seconds ? "#8B5CF6" : colors.border }]}
                      onPress={() => { setTimerSeconds(opt.seconds); setTimerRemaining(opt.seconds); }}>
                      <Text style={[styles.timerChipTxt, { color: timerSeconds === opt.seconds ? "#fff" : colors.muted }]}>{opt.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
              <View style={[styles.timerDisplay, { backgroundColor: "#8B5CF608", borderColor: "#8B5CF630" }]}>
                <Text style={[styles.timerCountdown, { color: timerActive ? "#8B5CF6" : colors.text }]}>{fmtTime(timerActive ? timerRemaining : timerSeconds)}</Text>
                {timerActive && (
                  <View style={[styles.timerProgressBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.timerProgressFill, { width: `${timerProgress * 100}%` as any }]} />
                  </View>
                )}
              </View>
              <Pressable style={[styles.breathBtn, { backgroundColor: timerActive ? "#EF4444" : "#8B5CF6", marginTop: 12 }]} onPress={toggleTimer}>
                <Text style={styles.breathBtnTxt}>{timerActive ? "إيقاف العداد" : "بدء الاسترخاء"}</Text>
              </Pressable>

              {/* Sounds - Calm style list */}
              <View style={[styles.soundsHeader, { marginTop: 18 }]}>
                <Text style={[styles.soundsHeaderTxt, { color: colors.text }]}>🎵 الأصوات الهادئة</Text>
                {activeSound && (
                  <View style={styles.nowPlayingPill}>
                    <View style={styles.playDot} />
                    <Text style={styles.nowPlayingTxt}>يعزف الآن</Text>
                  </View>
                )}
              </View>
              <View style={{ gap: 8, marginTop: 8 }}>
                {SOUNDS_LIST.map((s) => {
                  const isPlaying = activeSound === s.id;
                  return (
                    <Pressable key={s.id} style={[styles.soundRow, { backgroundColor: isPlaying ? s.color + "12" : isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: isPlaying ? s.color : colors.border, borderWidth: isPlaying ? 1.5 : 1 }]}
                      onPress={() => setActiveSound(isPlaying ? null : s.id)}>
                      <View style={[styles.soundPlayBtn, { backgroundColor: isPlaying ? s.color : s.color + "25" }]}>
                        <Feather name={isPlaying ? "pause" : "play"} size={14} color={isPlaying ? "#fff" : s.color} />
                      </View>
                      <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.soundRowLabel, { color: isPlaying ? s.color : colors.text }]}>{s.label}</Text>
                        <Text style={[styles.soundRowDesc, { color: colors.muted }]}>{s.desc}</Text>
                      </View>
                      {isPlaying && (
                        <View style={{ flexDirection: "row", gap: 2, alignItems: "flex-end" }}>
                          {[6, 10, 7, 12, 8].map((h, i) => (
                            <View key={i} style={{ width: 3, height: h, backgroundColor: s.color, borderRadius: 2 }} />
                          ))}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Sleep Quality Tracker */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>🌙 تتبع جودة النوم</Text>
              <Text style={[styles.toolSub, { color: colors.muted }]}>سجّل مواعيد نومك وجودته</Text>
              <View style={styles.sleepRow}>
                <View style={styles.sleepInputBox}>
                  <Text style={[styles.sleepInputLabel, { color: colors.muted }]}>وقت النوم</Text>
                  <TextInput value={sleepTime} onChangeText={setSleepTime} style={[styles.sleepInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#F5F3FF", borderColor: colors.border }]} textAlign="center" />
                </View>
                <View style={[styles.sleepArrow, { backgroundColor: "#8B5CF615" }]}>
                  <Feather name="arrow-left" size={18} color="#8B5CF6" />
                </View>
                <View style={styles.sleepInputBox}>
                  <Text style={[styles.sleepInputLabel, { color: colors.muted }]}>وقت الاستيقاظ</Text>
                  <TextInput value={wakeTime} onChangeText={setWakeTime} style={[styles.sleepInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#F5F3FF", borderColor: colors.border }]} textAlign="center" />
                </View>
              </View>
              <Text style={[styles.sleepQualityLabel, { color: colors.text }]}>جودة النوم:</Text>
              <View style={styles.sleepQualityRow}>
                {[{ v: 1, label: "سيء", emoji: "😫" }, { v: 2, label: "متوسط", emoji: "😐" }, { v: 3, label: "جيد", emoji: "😊" }, { v: 4, label: "ممتاز", emoji: "😴" }].map((q) => (
                  <Pressable key={q.v} onPress={() => setSleepQuality(q.v)} style={[styles.sleepQualityBtn, { backgroundColor: sleepQuality === q.v ? "#8B5CF6" : isDark ? colors.surfaceAlt : "#F5F3FF", borderColor: sleepQuality === q.v ? "#8B5CF6" : colors.border }]}>
                    <Text style={{ fontSize: 20 }}>{q.emoji}</Text>
                    <Text style={[{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: sleepQuality === q.v ? "#fff" : colors.muted }]}>{q.label}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={[styles.breathBtn, { backgroundColor: sleepQuality ? "#8B5CF6" : colors.border, marginTop: 12 }]} onPress={() => { if (sleepQuality) setSleepQuality(null); }}>
                <Text style={styles.breathBtnTxt}>💾 حفظ بيانات النوم</Text>
              </Pressable>
            </View>

            {/* Certified Mental Health Tests */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>📋 اختبارات الصحة النفسية المعتمدة</Text>
              <Text style={[styles.toolSub, { color: colors.muted }]}>اختبارات معتمدة عالمياً لقياس صحتك النفسية</Text>

              {/* PHQ-9 */}
              <Pressable style={[styles.testCard, { borderColor: phq9Done ? "#22C55E" : colors.border }]} onPress={() => setPhq9Open(!phq9Open)}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row-reverse", gap: 10, alignItems: "center" }}>
                    <View style={[styles.testIcon, { backgroundColor: "#3B82F615" }]}><Text style={{ fontSize: 20 }}>🧪</Text></View>
                    <View>
                      <Text style={[styles.testName, { color: colors.text }]}>PHQ-9 — الاكتئاب</Text>
                      <Text style={[styles.testDesc, { color: colors.muted }]}>9 أسئلة • نتيجة فورية</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                    {phq9Done && <View style={[styles.testScoreBadge, { backgroundColor: phq9Level.color + "20" }]}><Text style={[{ color: phq9Level.color, fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>{phq9Score}/27</Text></View>}
                    <Feather name={phq9Open ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
                  </View>
                </View>
              </Pressable>
              {phq9Open && (
                <View style={[styles.testExpanded, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: colors.border }]}>
                  {PHQ9_QUESTIONS.map((q, i) => (
                    <View key={i} style={{ marginBottom: 14 }}>
                      <Text style={[{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 13, textAlign: "right", marginBottom: 8 }]}>{i + 1}. {q}</Text>
                      <View style={{ flexDirection: "row-reverse", gap: 6 }}>
                        {[{ v: 0, l: "أبداً" }, { v: 1, l: "أحياناً" }, { v: 2, l: "غالباً" }, { v: 3, l: "دائماً" }].map((opt) => (
                          <Pressable key={opt.v} onPress={() => setPhq9Ans({ ...phq9Ans, [i]: opt.v })} style={[styles.testOpt, { backgroundColor: phq9Ans[i] === opt.v ? "#3B82F6" : isDark ? colors.card : "#fff", borderColor: phq9Ans[i] === opt.v ? "#3B82F6" : colors.border }]}>
                            <Text style={[{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: phq9Ans[i] === opt.v ? "#fff" : colors.muted }]}>{opt.l}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ))}
                  {Object.keys(phq9Ans).length === 9 && (
                    <View style={[styles.testResult, { backgroundColor: phq9Level.color + "15", borderColor: phq9Level.color + "30" }]}>
                      <Text style={[{ color: phq9Level.color, fontFamily: "Cairo_700Bold", fontSize: 15, textAlign: "right" }]}>النتيجة: {phq9Score}/27 — {phq9Level.label}</Text>
                    </View>
                  )}
                  <Pressable style={[styles.breathBtn, { backgroundColor: "#3B82F6", marginTop: 8 }]} onPress={() => { setPhq9Done(true); setPhq9Open(false); }}>
                    <Text style={styles.breathBtnTxt}>حفظ النتيجة</Text>
                  </Pressable>
                </View>
              )}

              {/* GAD-7 */}
              <Pressable style={[styles.testCard, { borderColor: gad7Done ? "#22C55E" : colors.border, marginTop: 10 }]} onPress={() => setGad7Open(!gad7Open)}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row-reverse", gap: 10, alignItems: "center" }}>
                    <View style={[styles.testIcon, { backgroundColor: "#C490D815" }]}><Text style={{ fontSize: 20 }}>🌡️</Text></View>
                    <View>
                      <Text style={[styles.testName, { color: colors.text }]}>GAD-7 — القلق</Text>
                      <Text style={[styles.testDesc, { color: colors.muted }]}>7 أسئلة • نتيجة فورية</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                    {gad7Done && <View style={[styles.testScoreBadge, { backgroundColor: gad7Level.color + "20" }]}><Text style={[{ color: gad7Level.color, fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>{gad7Score}/21</Text></View>}
                    <Feather name={gad7Open ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
                  </View>
                </View>
              </Pressable>
              {gad7Open && (
                <View style={[styles.testExpanded, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: colors.border }]}>
                  {GAD7_QUESTIONS.map((q, i) => (
                    <View key={i} style={{ marginBottom: 14 }}>
                      <Text style={[{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 13, textAlign: "right", marginBottom: 8 }]}>{i + 1}. {q}</Text>
                      <View style={{ flexDirection: "row-reverse", gap: 6 }}>
                        {[{ v: 0, l: "أبداً" }, { v: 1, l: "أحياناً" }, { v: 2, l: "غالباً" }, { v: 3, l: "دائماً" }].map((opt) => (
                          <Pressable key={opt.v} onPress={() => setGad7Ans({ ...gad7Ans, [i]: opt.v })} style={[styles.testOpt, { backgroundColor: gad7Ans[i] === opt.v ? "#C490D8" : isDark ? colors.card : "#fff", borderColor: gad7Ans[i] === opt.v ? "#C490D8" : colors.border }]}>
                            <Text style={[{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: gad7Ans[i] === opt.v ? "#fff" : colors.muted }]}>{opt.l}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ))}
                  {Object.keys(gad7Ans).length === 7 && (
                    <View style={[styles.testResult, { backgroundColor: gad7Level.color + "15", borderColor: gad7Level.color + "30" }]}>
                      <Text style={[{ color: gad7Level.color, fontFamily: "Cairo_700Bold", fontSize: 15, textAlign: "right" }]}>النتيجة: {gad7Score}/21 — {gad7Level.label}</Text>
                    </View>
                  )}
                  <Pressable style={[styles.breathBtn, { backgroundColor: "#C490D8", marginTop: 8 }]} onPress={() => { setGad7Done(true); setGad7Open(false); }}>
                    <Text style={styles.breathBtnTxt}>حفظ النتيجة</Text>
                  </Pressable>
                </View>
              )}

              {/* PSS - simplified */}
              <View style={[styles.testCard, { borderColor: colors.border, marginTop: 10, opacity: 0.6 }]}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row-reverse", gap: 10, alignItems: "center" }}>
                    <View style={[styles.testIcon, { backgroundColor: "#F5930015" }]}><Text style={{ fontSize: 20 }}>📊</Text></View>
                    <View>
                      <Text style={[styles.testName, { color: colors.text }]}>PSS — مستوى الضغط</Text>
                      <Text style={[styles.testDesc, { color: colors.muted }]}>10 أسئلة • قريباً</Text>
                    </View>
                  </View>
                  <View style={[styles.soonBadge]}><Text style={styles.soonTxt}>قريباً</Text></View>
                </View>
              </View>
            </View>

            {/* تمرين التأريض 1-2-3-4-5 */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>🌱 تمرين التأريض 1-2-3-4-5</Text>
              <Text style={[styles.toolSub, { color: colors.muted }]}>تقنية Grounding لتهدئة القلق الفوري</Text>
              {[
                { n: 5, emoji: "👁️", sense: "أشياء تراها" },
                { n: 4, emoji: "✋", sense: "أشياء تلمسها" },
                { n: 3, emoji: "👂", sense: "أشياء تسمعها" },
                { n: 2, emoji: "👃", sense: "أشياء تشمّها" },
                { n: 1, emoji: "👅", sense: "شيء تتذوقه" },
              ].map((step) => (
                <View key={step.n} style={[styles.groundingRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.groundingNum, { backgroundColor: "#8B5CF615" }]}>
                    <Text style={[{ color: "#8B5CF6", fontFamily: "Cairo_700Bold", fontSize: 16 }]}>{step.n}</Text>
                  </View>
                  <Text style={{ fontSize: 22 }}>{step.emoji}</Text>
                  <Text style={[{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, flex: 1, textAlign: "right" }]}>{step.sense}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ─────────────── MOOD TAB ─────────────── */}
        {activeTab === "mood" && (
          <>
            {/* Mood Picker */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={[styles.toolTitle, { color: colors.text, marginBottom: 0 }]}>كيف تشعر الآن؟ 💭</Text>
                <Pressable onPress={() => setShowMoodHistory(true)} style={[styles.historyBtn, { backgroundColor: "#8B5CF615" }]}>
                  <Feather name="clock" size={14} color="#8B5CF6" />
                  <Text style={[{ color: "#8B5CF6", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>السجل</Text>
                </Pressable>
              </View>
              <View style={styles.moodGrid}>
                {MOODS.map((m) => (
                  <Pressable key={m.value} style={[styles.moodBtn, { backgroundColor: selectedMood === m.value ? m.color + "20" : isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: selectedMood === m.value ? m.color : colors.border, borderWidth: selectedMood === m.value ? 2 : 1 }]}
                    onPress={() => setSelectedMood(m.value)}>
                    <Text style={{ fontSize: 32 }}>{m.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: selectedMood === m.value ? m.color : colors.muted }]}>{m.label}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput placeholder="اكتب ملاحظة عن يومك... (اختياري)" placeholderTextColor={colors.muted} value={moodNote} onChangeText={setMoodNote} multiline
                style={[styles.moodInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: colors.border }]} textAlign="right" />
              <Pressable style={[styles.breathBtn, { backgroundColor: selectedMood !== null ? "#8B5CF6" : colors.muted }]} onPress={() => { if (selectedMood === null) return; setSelectedMood(null); setMoodNote(""); }}>
                <Text style={styles.breathBtnTxt}>تسجيل الحالة</Text>
              </Pressable>
            </View>

            {/* Wellness Check Redesigned */}
            <View style={[styles.toolCard, { backgroundColor: "#7C3AED08", borderColor: "#7C3AED20" }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={[styles.toolTitle, { color: colors.text, marginBottom: 0 }]}>⭐ قياس صحتك النفسية اليوم</Text>
                <Pressable onPress={() => setShowWellnessChart(true)} style={[styles.historyBtn, { backgroundColor: "#7C3AED15" }]}>
                  <Feather name="bar-chart-2" size={14} color="#7C3AED" />
                  <Text style={[{ color: "#7C3AED", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>المؤشرات</Text>
                </Pressable>
              </View>
              <Text style={[styles.toolSub, { color: colors.muted, marginBottom: 14 }]}>أجب على أسئلة اليوم لفهم صحتك النفسية بشكل أفضل</Text>
              {WELLNESS_QS.map((item, idx) => (
                <View key={idx} style={[styles.wellnessCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
                  <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                    <Text style={[{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13, flex: 1, textAlign: "right" }]}>{item.q}</Text>
                  </View>
                  <View style={{ flexDirection: "row-reverse", justifyContent: "center", gap: 8 }}>
                    {[{ v: 1, e: "😞" }, { v: 2, e: "😕" }, { v: 3, e: "😐" }, { v: 4, e: "🙂" }, { v: 5, e: "😄" }].map((opt) => (
                      <Pressable key={opt.v} onPress={() => setWellnessAnswers({ ...wellnessAnswers, [idx]: opt.v })}
                        style={[styles.wellnessEmojiBtn, { backgroundColor: wellnessAnswers[idx] === opt.v ? "#8B5CF620" : isDark ? colors.surfaceAlt : "#F5F3FF", borderColor: wellnessAnswers[idx] === opt.v ? "#8B5CF6" : "transparent", borderWidth: wellnessAnswers[idx] === opt.v ? 2 : 0 }]}>
                        <Text style={{ fontSize: 26 }}>{opt.e}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
              {wellnessTotal !== null && (
                <View style={[styles.wellnessResult, { backgroundColor: wellnessTotal >= 70 ? "#22C55E15" : wellnessTotal >= 50 ? "#F59E0B15" : "#EF444415", borderColor: wellnessTotal >= 70 ? "#22C55E30" : wellnessTotal >= 50 ? "#F59E0B30" : "#EF444430" }]}>
                  <Text style={{ fontSize: 28 }}>{wellnessTotal >= 70 ? "🌟" : wellnessTotal >= 50 ? "🌤️" : "⛅"}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 15, textAlign: "right" }]}>مستوى صحتك النفسية اليوم: {wellnessTotal}%</Text>
                    <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right" }]}>{wellnessTotal >= 70 ? "ممتاز! استمر في هذا المنوال 💪" : wellnessTotal >= 50 ? "جيد، لكن هناك مجال للتحسين" : "يوم صعب؟ خذ استراحة واهتم بنفسك"}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Diary with notebook history */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={[styles.toolTitle, { color: colors.text, marginBottom: 0 }]}>📓 يومياتي الذهنية</Text>
                <Pressable onPress={() => setShowDiary(true)} style={[styles.historyBtn, { backgroundColor: "#C490D815" }]}>
                  <Feather name="book-open" size={14} color="#C490D8" />
                  <Text style={[{ color: "#C490D8", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>دفتر اليوميات</Text>
                </Pressable>
              </View>
              <Text style={[styles.toolSub, { color: colors.muted }]}>اكتب أفكارك وعواطفك بحرية — لن يراها أحد</Text>
              <TextInput placeholder="ما الذي يدور في ذهنك اليوم؟..." placeholderTextColor={colors.muted} multiline value={diaryText} onChangeText={setDiaryText}
                style={[styles.moodInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#F8F8FF", borderColor: colors.border, minHeight: 120 }]} textAlign="right" />
              <Pressable style={[styles.breathBtn, { backgroundColor: "#C490D8" }]} onPress={() => setDiaryText("")}>
                <Text style={styles.breathBtnTxt}>💾 حفظ اليوميات</Text>
              </Pressable>
            </View>

            {/* Gratitude Journal */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? "#1C1330" : "#FFF8E7", borderColor: "#F59E0B30" }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={[styles.toolTitle, { color: colors.text, marginBottom: 0 }]}>🙏 يومية الامتنان</Text>
                <Pressable onPress={() => setShowGratitude(true)} style={[styles.historyBtn, { backgroundColor: "#F59E0B15" }]}>
                  <Feather name="heart" size={14} color="#F59E0B" />
                  <Text style={[{ color: "#F59E0B", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>الذكريات</Text>
                </Pressable>
              </View>
              <Text style={[styles.toolSub, { color: colors.muted }]}>اشكر أصغر التفاصيل في يومك — الامتنان يصنع السعادة</Text>
              <TextInput placeholder="اليوم أنا ممتنٌّ لـ..." placeholderTextColor={colors.muted} multiline value={gratitudeText} onChangeText={setGratitudeText}
                style={[styles.moodInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FFFDF0", borderColor: "#F59E0B30", minHeight: 100 }]} textAlign="right" />
              <Pressable style={[styles.breathBtn, { backgroundColor: "#F59E0B" }]} onPress={() => setGratitudeText("")}>
                <Text style={styles.breathBtnTxt}>✨ أضف لليومية</Text>
              </Pressable>
            </View>

            {/* Mood Week Chart */}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>مزاجك هذا الأسبوع 📈</Text>
              <View style={styles.moodChart}>
                {[4, 3, 5, 2, 4, 3, 5].map((val, i) => {
                  const mood = MOODS.find(m => m.value === val) || MOODS[2];
                  return (
                    <View key={i} style={styles.moodChartCol}>
                      <Text style={{ fontSize: 22 }}>{mood.emoji}</Text>
                      <View style={[styles.moodChartBar, { height: (val / 5) * 60, backgroundColor: mood.color }]} />
                      <Text style={[styles.moodChartDay, { color: colors.muted }]}>{["س", "أح", "إث", "ث", "ر", "خ", "ج"][i]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* ─────────────── COMMUNITY TAB ─────────────── */}
        {activeTab === "community" && (
          <>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Pressable onPress={() => router.push("/section/clinics" as any)} style={[styles.aiHeroBanner, { overflow: "hidden" }]}>
                <Image source={require("@/assets/images/mental-therapy-banner.png")} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                <LinearGradient colors={["rgba(76,29,149,0.3)", "rgba(91,33,182,0.92)"]} style={StyleSheet.absoluteFill as any} />
                <View style={styles.aiHeroContent}>
                  <Text style={styles.bannerTitle}>🌙 احجز جلسة مع معالج</Text>
                  <Text style={styles.bannerSub}>معالجون معتمدون • سرية تامة • متاح الآن</Text>
                  <View style={styles.bannerCTA}><Text style={styles.bannerCTATxt}>ابدأ الرحلة ←</Text></View>
                </View>
              </Pressable>
            </Animated.View>
            <Text style={[styles.toolTitle, { color: colors.text }]}>مجموعات الدعم النفسي 🤝</Text>
            {SUPPORT_GROUPS.map((g) => (
              <Pressable key={g.id} style={[styles.groupCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
                <View style={[styles.groupIcon, { backgroundColor: g.color + "15" }]}><Text style={{ fontSize: 26 }}>{g.emoji}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.groupName, { color: colors.text }]}>{g.name}</Text>
                  <Text style={[styles.groupMembers, { color: colors.muted }]}>{g.members.toLocaleString("ar")} عضو نشط</Text>
                </View>
                <View style={[styles.joinBtn, { backgroundColor: g.color }]}><Text style={styles.joinBtnTxt}>انضم</Text></View>
              </Pressable>
            ))}
            <View style={[styles.toolCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>💜 نصائح يومية للصحة النفسية</Text>
              {[
                { emoji: "☀️", text: "ابدأ يومك بـ 5 أشياء تشكر الله عليها" },
                { emoji: "🚶", text: "المشي 20 دقيقة يومياً يقلل القلق بنسبة 48%" },
                { emoji: "📵", text: "تجنب الشاشات ساعة قبل النوم لتحسين نومك" },
                { emoji: "🗣️", text: "التحدث مع صديق مقرب يخفف الضغط النفسي" },
                { emoji: "🍃", text: "قضاء 20 دقيقة في الطبيعة يخفض مستوى الكورتيزول" },
              ].map((tip, idx) => (
                <View key={idx} style={[styles.tipRow, { borderBottomColor: colors.border, borderBottomWidth: idx < 4 ? 1 : 0 }]}>
                  <Text style={{ fontSize: 20 }}>{tip.emoji}</Text>
                  <Text style={[{ color: colors.text, fontFamily: "Tajawal_400Regular", fontSize: 13, flex: 1, textAlign: "right", lineHeight: 20 }]}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* ─── SOS MODAL ─── */}
      <Modal visible={showSOS} transparent animationType="fade">
        <View style={styles.sosModal}>
          {!sosComplete ? (
            <View style={styles.sosModalContent}>
              <Text style={styles.sosModalTitle}>🆘 بروتوكول التهدئة الفوري</Text>
              <Text style={styles.sosModalSub}>تقنية 4-7-8 للتهدئة الفورية</Text>
              <View style={{ alignItems: "center", marginVertical: 30 }}>
                <Animated.View style={[styles.breathCircle, { transform: [{ scale: sosScale }], borderColor: sosCurrentPhase.color, backgroundColor: sosCurrentPhase.color + "20", width: 220, height: 220, borderRadius: 110 }]}>
                  <Text style={[styles.breathPhaseLabel, { color: sosCurrentPhase.color, fontSize: 26 }]}>{sosCurrentPhase.label}</Text>
                  <Text style={[styles.breathTimer, { color: sosCurrentPhase.color, fontSize: 52 }]}>{sosTimer}</Text>
                  <Text style={[styles.breathInstruction, { color: "rgba(255,255,255,0.7)" }]}>{sosCurrentPhase.instruction}</Text>
                </Animated.View>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Tajawal_400Regular", fontSize: 13, marginTop: 12 }}>
                  دورة {sosCycles + 1} من 3
                </Text>
              </View>
              <Pressable style={styles.sosCloseBtn} onPress={closeSOS}>
                <Text style={styles.sosCloseBtnTxt}>إيقاف</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.sosModalContent}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>✅</Text>
              <Text style={styles.sosModalTitle}>أحسنت! استمر في التنفس</Text>
              <Text style={styles.sosModalSub}>إذا لم تشعر بالتحسن، تواصل مع مختص فوراً</Text>
              <View style={{ gap: 10, marginTop: 20, width: "100%" }}>
                {[
                  { name: "خط مساندة نفسية", phone: "920033360", color: "#22C55E" },
                  { name: "د.أحمد - نفسيات",  phone: "0501234567", color: "#3B82F6" },
                  { name: "د.نورة - قلق وذعر", phone: "0557654321", color: "#C490D8" },
                ].map((c, i) => (
                  <Pressable key={i} style={[styles.emergencyContact, { backgroundColor: c.color + "20", borderColor: c.color + "40" }]}>
                    <Feather name="phone" size={16} color={c.color} />
                    <View style={{ flex: 1 }}>
                      <Text style={[{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 }]}>{c.name}</Text>
                      <Text style={[{ color: "rgba(255,255,255,0.6)", fontFamily: "Tajawal_400Regular", fontSize: 12 }]}>{c.phone}</Text>
                    </View>
                    <Text style={{ color: c.color, fontFamily: "Tajawal_700Bold" }}>اتصل</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={[styles.sosCloseBtn, { marginTop: 20, backgroundColor: "rgba(255,255,255,0.15)" }]} onPress={closeSOS}>
                <Text style={styles.sosCloseBtnTxt}>إغلاق</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {/* ─── MOOD HISTORY MODAL ─── */}
      <Modal visible={showMoodHistory} transparent animationType="slide">
        <View style={styles.bottomModal}>
          <View style={[styles.bottomModalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.bottomModalHeader}>
              <Pressable onPress={() => setShowMoodHistory(false)}><Feather name="x" size={22} color={colors.muted} /></Pressable>
              <Text style={[styles.bottomModalTitle, { color: colors.text }]}>📊 سجل الحالة النفسية</Text>
            </View>
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {SAMPLE_MOOD_HISTORY.map((entry) => {
                const mood = MOODS.find(m => m.value === entry.mood) || MOODS[2];
                return (
                  <View key={entry.id} style={[styles.historyEntry, { backgroundColor: isDark ? colors.card : "#F8F8FF", borderColor: mood.color + "30" }]}>
                    <Text style={{ fontSize: 30 }}>{mood.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                        <Text style={[{ color: mood.color, fontFamily: "Tajawal_700Bold", fontSize: 13 }]}>{mood.label}</Text>
                        <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11 }]}>{entry.date}</Text>
                      </View>
                      {entry.note && <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", marginTop: 4, lineHeight: 18 }]}>{entry.note}</Text>}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── DIARY MODAL (Notebook style) ─── */}
      <Modal visible={showDiary} transparent animationType="slide">
        <View style={styles.bottomModal}>
          <View style={[styles.bottomModalContent, { backgroundColor: isDark ? "#1A1030" : "#FFF8F0" }]}>
            <View style={styles.bottomModalHeader}>
              <Pressable onPress={() => setShowDiary(false)}><Feather name="x" size={22} color={colors.muted} /></Pressable>
              <Text style={[styles.bottomModalTitle, { color: colors.text }]}>📖 دفتر يومياتي الذهنية</Text>
            </View>
            <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false}>
              {SAMPLE_DIARY.map((entry, idx) => (
                <View key={entry.id} style={[styles.notebookEntry, { backgroundColor: isDark ? colors.card : "#FFFEF2", borderColor: "#C490D830", borderLeftColor: ["#8B5CF6", "#3B82F6", "#22C55E", "#F59E0B"][idx % 4] }]}>
                  <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Text style={[{ color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 14 }]}>{entry.title}</Text>
                    <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11 }]}>{entry.date}</Text>
                  </View>
                  <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "right", lineHeight: 20 }]} numberOfLines={3}>{entry.body}</Text>
                  <View style={{ flexDirection: "row-reverse", justifyContent: "flex-end", marginTop: 8, gap: 8 }}>
                    <Pressable style={[styles.notebookAction, { borderColor: "#EF4444" }]}>
                      <Feather name="trash-2" size={12} color="#EF4444" />
                      <Text style={[{ color: "#EF4444", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>حذف</Text>
                    </Pressable>
                    <Pressable style={[styles.notebookAction, { borderColor: "#8B5CF6" }]}>
                      <Feather name="eye" size={12} color="#8B5CF6" />
                      <Text style={[{ color: "#8B5CF6", fontSize: 11, fontFamily: "Tajawal_700Bold" }]}>قراءة</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── GRATITUDE MODAL ─── */}
      <Modal visible={showGratitude} transparent animationType="slide">
        <View style={styles.bottomModal}>
          <View style={[styles.bottomModalContent, { backgroundColor: isDark ? "#1A1020" : "#FFFDF0" }]}>
            <View style={styles.bottomModalHeader}>
              <Pressable onPress={() => setShowGratitude(false)}><Feather name="x" size={22} color={colors.muted} /></Pressable>
              <Text style={[styles.bottomModalTitle, { color: colors.text }]}>🙏 يومياتي الامتنان</Text>
            </View>
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {SAMPLE_GRATITUDE.map((entry) => (
                <View key={entry.id} style={[styles.gratitudeEntry, { backgroundColor: isDark ? colors.card : "#FFFEF5", borderColor: "#F59E0B30" }]}>
                  <Text style={[{ color: "#F59E0B", fontFamily: "Cairo_700Bold", fontSize: 14, textAlign: "right", marginBottom: 8 }]}>🌟 {entry.date}</Text>
                  {entry.items.map((item, i) => (
                    <View key={i} style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ color: "#F59E0B", fontSize: 14 }}>✦</Text>
                      <Text style={[{ color: colors.text, fontFamily: "Tajawal_400Regular", fontSize: 13, flex: 1, textAlign: "right" }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── WELLNESS CHART MODAL ─── */}
      <Modal visible={showWellnessChart} transparent animationType="slide">
        <View style={styles.bottomModal}>
          <View style={[styles.bottomModalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.bottomModalHeader}>
              <Pressable onPress={() => setShowWellnessChart(false)}><Feather name="x" size={22} color={colors.muted} /></Pressable>
              <Text style={[styles.bottomModalTitle, { color: colors.text }]}>📊 مؤشر صحتك النفسية</Text>
            </View>
            <Text style={[{ color: colors.muted, textAlign: "right", fontFamily: "Tajawal_400Regular", fontSize: 13, marginBottom: 16 }]}>مستوى صحتك النفسية خلال الأسبوع الماضي</Text>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", height: 120, marginBottom: 8 }}>
              {WEEK_WELLNESS.map((val, i) => (
                <View key={i} style={{ alignItems: "center", gap: 4, flex: 1 }}>
                  <Text style={[{ color: colors.muted, fontFamily: "Tajawal_700Bold", fontSize: 10 }]}>{val}%</Text>
                  <View style={{ height: (val / 100) * 90, width: 28, backgroundColor: val >= 70 ? "#22C55E" : val >= 50 ? "#F59E0B" : "#EF4444", borderRadius: 6 }} />
                  <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 10 }]}>{["س", "أح", "إث", "ث", "ر", "خ", "ج"][i]}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row-reverse", gap: 12, justifyContent: "center" }}>
              {[{ color: "#22C55E", label: "ممتاز ≥70%" }, { color: "#F59E0B", label: "جيد ≥50%" }, { color: "#EF4444", label: "يحتاج اهتمام" }].map((l, i) => (
                <View key={i} style={{ flexDirection: "row-reverse", gap: 4, alignItems: "center" }}>
                  <View style={{ width: 10, height: 10, backgroundColor: l.color, borderRadius: 3 }} />
                  <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11 }]}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { height: 168, overflow: "hidden", position: "relative" },
  backBtn: { position: "absolute", top: 0, right: 16, zIndex: 20, paddingTop: 16, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  bookingsBtn: { position: "absolute", top: 0, left: 16, zIndex: 20, paddingTop: 16, flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  bookingsBtnText: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 },
  headerTitle: { color: "#fff", fontSize: 24, fontFamily: "Cairo_700Bold", textAlign: "right" },
  headerSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  tabsBar: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tabBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 12, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  toolCard: { borderRadius: 20, padding: 18, borderWidth: 1 },
  toolTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  toolSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 14 },

  // SOS
  sosCard: { borderRadius: 20, padding: 20, backgroundColor: "#EF444412", borderWidth: 2, borderColor: "#EF4444", alignItems: "center", gap: 6 },
  sosBadge: { backgroundColor: "#EF4444", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  sosBadgeTxt: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13 },
  sosTitle: { color: "#EF4444", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center" },
  sosSub: { color: "#EF4444", fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "center", opacity: 0.85 },
  sosBtn: { backgroundColor: "#EF4444", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 30, marginTop: 6 },
  sosBtnTxt: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },

  // SOS Modal
  sosModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", alignItems: "center", justifyContent: "center", padding: 20 },
  sosModalContent: { width: "100%", alignItems: "center" },
  sosModalTitle: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 22, textAlign: "center", marginBottom: 6 },
  sosModalSub: { color: "rgba(255,255,255,0.65)", fontFamily: "Tajawal_400Regular", fontSize: 14, textAlign: "center" },
  sosCloseBtn: { marginTop: 10, backgroundColor: "#EF4444", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 30 },
  sosCloseBtnTxt: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 15 },
  emergencyContact: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },

  // Banner
  aiHeroBanner: { height: 170, borderRadius: 20, position: "relative" },
  aiHeroContent: { position: "absolute", bottom: 16, right: 16, left: 16 },
  bannerTitle: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  bannerCTA: { alignSelf: "flex-end", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, marginTop: 10 },
  bannerCTATxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  // Breath
  breathCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, alignItems: "center", justifyContent: "center", gap: 4 },
  breathPhaseLabel: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  breathTimer: { fontSize: 40, fontFamily: "Tajawal_700Bold" },
  breathInstruction: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center", paddingHorizontal: 20 },
  breathBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  breathBtnTxt: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },

  // Timer
  timerChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  timerChipTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  timerDisplay: { borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center", gap: 12 },
  timerCountdown: { fontSize: 48, fontFamily: "Tajawal_700Bold", letterSpacing: 2 },
  timerProgressBar: { width: "100%", height: 6, borderRadius: 3 },
  timerProgressFill: { height: 6, borderRadius: 3, backgroundColor: "#8B5CF6" },

  // Sounds (Calm style)
  soundsHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  soundsHeaderTxt: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  nowPlayingPill: { flexDirection: "row-reverse", gap: 5, alignItems: "center", backgroundColor: "#8B5CF615", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  playDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#8B5CF6" },
  nowPlayingTxt: { color: "#8B5CF6", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  soundRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14 },
  soundPlayBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  soundRowLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  soundRowDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },

  // Sleep
  sleepRow: { flexDirection: "row-reverse", gap: 10, alignItems: "center", marginBottom: 14 },
  sleepInputBox: { flex: 1, gap: 6 },
  sleepInputLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  sleepInput: { borderWidth: 1, borderRadius: 12, padding: 10, fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sleepArrow: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  sleepQualityLabel: { fontFamily: "Tajawal_700Bold", fontSize: 13, textAlign: "right", marginBottom: 10 },
  sleepQualityRow: { flexDirection: "row-reverse", gap: 8 },
  sleepQualityBtn: { flex: 1, alignItems: "center", gap: 4, borderRadius: 12, borderWidth: 1.5, paddingVertical: 10 },

  // Tests
  testCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  testIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  testName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  testDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  testScoreBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  testExpanded: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 8 },
  testOpt: { flex: 1, borderRadius: 8, borderWidth: 1, paddingVertical: 6, alignItems: "center" },
  testResult: { borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row-reverse", alignItems: "center", gap: 10, marginTop: 8 },
  soonBadge: { backgroundColor: "#F59E0B20", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  soonTxt: { color: "#F59E0B", fontSize: 11, fontFamily: "Tajawal_700Bold" },

  // Grounding
  groundingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  groundingNum: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  // Mood
  moodGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  moodBtn: { width: (width - 76) / 3, borderRadius: 16, padding: 12, alignItems: "center", gap: 4 },
  moodLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  moodInput: { borderWidth: 1, borderRadius: 14, padding: 14, minHeight: 80, fontSize: 14, fontFamily: "Tajawal_400Regular", marginBottom: 12, textAlignVertical: "top" },
  moodChart: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 10 },
  moodChartCol: { flex: 1, alignItems: "center", gap: 6 },
  moodChartBar: { width: 20, borderRadius: 5 },
  moodChartDay: { fontSize: 11, fontFamily: "Tajawal_400Regular" },

  // Wellness
  wellnessCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  wellnessEmojiBtn: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  wellnessResult: { borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row-reverse", alignItems: "center", gap: 12, marginTop: 4 },

  // History buttons
  historyBtn: { flexDirection: "row-reverse", gap: 5, alignItems: "center", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },

  // Community
  groupCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  groupIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  groupName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  groupMembers: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  joinBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  joinBtnTxt: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, paddingVertical: 10 },

  // Modals
  bottomModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  bottomModalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40, maxHeight: "85%" },
  bottomModalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  bottomModalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },

  // History entry
  historyEntry: { flexDirection: "row-reverse", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },

  // Notebook
  notebookEntry: { borderRadius: 14, borderWidth: 1, borderLeftWidth: 4, padding: 14, marginBottom: 12 },
  notebookAction: { flexDirection: "row-reverse", gap: 4, alignItems: "center", borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },

  // Gratitude
  gratitudeEntry: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
});
