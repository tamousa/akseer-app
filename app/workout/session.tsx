import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  I18nManager,
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

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  muscle: string;
  instructions: string[];
  safetyTips: string[];
}

const DAYS_EXERCISES: Record<string, Exercise[]> = {
  "0": [
    { id: "c1", name: "بنش بريس بار", sets: 4, reps: 12, restSeconds: 90, muscle: "صدر", instructions: ["استلقِ على البنش مع ثبات القدمين", "امسك البار بعرض أكبر من الأكتاف", "انزل ببطء حتى يلمس الصدر", "ادفع للأعلى مع الزفير"], safetyTips: ["لا تقوّس ظهرك", "استخدم مساعد للأوزان الثقيلة"] },
    { id: "c2", name: "بنش بريس دمبل مائل", sets: 3, reps: 12, restSeconds: 90, muscle: "صدر علوي", instructions: ["اضبط زاوية البنش 30-45 درجة", "ارفع الدمبل مع تقريبهما", "انزل ببطء مع فتح المرفقين"], safetyTips: ["استقامة المعصم", "لا تنزل أسفل الصدر"] },
    { id: "c3", name: "تفتيح صدر بالدمبل", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر", instructions: ["استلقِ على البنش المسطح", "افتح ذراعيك للجانبين ببطء", "اجمع مع الضغط على الصدر"], safetyTips: ["انحناء خفيف في المرفق دائماً"] },
    { id: "c4", name: "ضغط صدر بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر داخلي", instructions: ["قف بين جهازي الكابل", "ادفع للأمام مع الضغط", "ارجع ببطء"], safetyTips: ["ثبات الجذع"] },
    { id: "c5", name: "بوش أب", sets: 3, reps: 20, restSeconds: 60, muscle: "صدر وترايسبس", instructions: ["يدك بعرض أكبر من الأكتاف", "انزل حتى يقترب صدرك من الأرض", "ادفع للأعلى"], safetyTips: ["جسمك مستقيم"] },
    { id: "c6", name: "ترايسبس بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["قف أمام الكابل العلوي", "اضغط للأسفل مع تثبيت المرفقين", "ارجع ببطء"], safetyTips: ["ثبت المرفقين"] },
    { id: "c7", name: "ديبس ترايسبس", sets: 3, reps: 12, restSeconds: 90, muscle: "ترايسبس", instructions: ["امسك قضبان الديبس", "انزل ببطء", "ادفع للأعلى"], safetyTips: ["لا تنزل أكثر من 90 درجة"] },
  ],
  "1": [
    { id: "b1", name: "سحب أمامي واسع", sets: 4, reps: 12, restSeconds: 90, muscle: "ظهر", instructions: ["اجلس واسحب البار للصدر", "ارجع ببطء"], safetyTips: ["لا تسحب خلف الرقبة"] },
    { id: "b2", name: "تجديف بالبار", sets: 4, reps: 12, restSeconds: 90, muscle: "ظهر أوسط", instructions: ["انحنِ 45 درجة", "اسحب نحو البطن"], safetyTips: ["استقامة الظهر"] },
    { id: "b3", name: "تجديف دمبل يد واحدة", sets: 3, reps: 12, restSeconds: 60, muscle: "ظهر", instructions: ["ضع ركبة ويد على البنش", "اسحب الدمبل نحو الورك"], safetyTips: ["لا تلف الجسم"] },
    { id: "b4", name: "سحب أرضي بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "ظهر سفلي", instructions: ["اسحب المقبض نحو البطن", "اضغط لوحتي الكتف"], safetyTips: ["لا تميل للخلف كثيراً"] },
    { id: "b5", name: "بايسبس بالبار الزجزاج", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["ثبت المرفقين", "ارفع بتقلص البايسبس"], safetyTips: ["لا تتأرجح"] },
    { id: "b6", name: "بايسبس بالدمبل جالس", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["اجلس على بنش مائل", "ارفع بالتناوب"], safetyTips: ["ظهرك ملتصق بالبنش"] },
    { id: "b7", name: "بايسبس هامر", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس خارجي", instructions: ["قبضة عمودية", "ارفع مع ثبات المرفق"], safetyTips: ["استقامة المعصم"] },
  ],
  "2": [
    { id: "l1", name: "سكوات بالبار", sets: 4, reps: 12, restSeconds: 120, muscle: "فخذ أمامي", instructions: ["البار على أعلى الظهر", "انزل حتى يوازي الفخذ الأرض", "ادفع من الكعبين"], safetyTips: ["الركبتين مع أصابع القدمين", "حزام الظهر للأوزان الثقيلة"] },
    { id: "l2", name: "ليج بريس", sets: 4, reps: 15, restSeconds: 90, muscle: "فخذ", instructions: ["انزل حتى 90 درجة", "ادفع دون قفل الركبتين"], safetyTips: ["لا تقفل الركبتين"] },
    { id: "l3", name: "لنجز بالدمبل", sets: 3, reps: 12, restSeconds: 90, muscle: "فخذ وأرداف", instructions: ["اخطُ للأمام", "انزل حتى تلمس الركبة الأرض"], safetyTips: ["الركبة لا تتجاوز أصابع القدم"] },
    { id: "l4", name: "تمديد أرجل", sets: 3, reps: 15, restSeconds: 60, muscle: "فخذ أمامي", instructions: ["ارفع بتمديد الركبتين", "اضغط لثانيتين"], safetyTips: ["لا تستخدم أوزان ثقيلة جداً"] },
    { id: "l5", name: "ثني أرجل", sets: 3, reps: 15, restSeconds: 60, muscle: "فخذ خلفي", instructions: ["اثنِ ركبتيك لرفع الوزن", "انزل ببطء"], safetyTips: ["لا ترفع الوركين"] },
    { id: "l6", name: "رفع ربلة واقف", sets: 4, reps: 20, restSeconds: 45, muscle: "ربلة", instructions: ["ارفع على أطراف أصابعك", "اضغط لثانيتين"], safetyTips: ["لا تثنِ الركبتين"] },
    { id: "l7", name: "ديدلفت روماني", sets: 3, reps: 12, restSeconds: 90, muscle: "فخذ خلفي وأرداف", instructions: ["انحنِ من الورك", "ارجع بالضغط من الأرداف"], safetyTips: ["استقامة الظهر دائماً"] },
  ],
  "3": [
    { id: "s1", name: "ضغط أكتاف بالدمبل", sets: 4, reps: 12, restSeconds: 90, muscle: "أكتاف", instructions: ["ارفع من مستوى الأذن للأعلى", "انزل ببطء"], safetyTips: ["لا تقوّس الظهر"] },
    { id: "s2", name: "رفع جانبي", sets: 3, reps: 15, restSeconds: 60, muscle: "أكتاف جانبية", instructions: ["ارفع للجانبين حتى مستوى الكتف"], safetyTips: ["لا ترفع أعلى من الكتف"] },
    { id: "s3", name: "رفع أمامي", sets: 3, reps: 12, restSeconds: 60, muscle: "أكتاف أمامية", instructions: ["ارفع للأمام بالتناوب"], safetyTips: ["لا تتأرجح"] },
    { id: "s4", name: "تجديف كتف خلفي", sets: 3, reps: 15, restSeconds: 60, muscle: "أكتاف خلفية", instructions: ["انحنِ وارفع للجانبين"], safetyTips: ["ثبات الجذع"] },
    { id: "s5", name: "كرانش عكسي", sets: 3, reps: 20, restSeconds: 45, muscle: "بطن سفلي", instructions: ["ارفع ركبتيك نحو الصدر"], safetyTips: ["لا تضغط على الرقبة"] },
    { id: "s6", name: "بلانك", sets: 3, reps: 45, restSeconds: 30, muscle: "بطن وجذع", instructions: ["ثبت لمدة 45 ثانية", "خط مستقيم من الرأس للكعبين"], safetyTips: ["لا تدلّ الوسط"] },
  ],
  "4": [
    { id: "a1", name: "بايسبس بار مستقيم", sets: 4, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["ارفع بتقلص البايسبس", "انزل ببطء"], safetyTips: ["ثبت المرفقين"] },
    { id: "a2", name: "ترايسبس فرنسي", sets: 4, reps: 12, restSeconds: 60, muscle: "ترايسبس", instructions: ["انزل البار نحو الجبهة", "ارفع بتمديد المرفقين"], safetyTips: ["لا تحرك الكتفين"] },
    { id: "a3", name: "بايسبس تركيز", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["أسند المرفق على الفخذ", "ارفع ببطء"], safetyTips: ["لا تحرك الجسم"] },
    { id: "a4", name: "ترايسبس كيكباك", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["مدّ ذراعك للخلف بالكامل"], safetyTips: ["ثبات المرفق"] },
    { id: "a5", name: "بايسبس كابل", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["اسحب للأعلى", "انزل ببطء"], safetyTips: ["ثبات المرفقين"] },
    { id: "a6", name: "ترايسبس أوفرهيد", sets: 3, reps: 12, restSeconds: 60, muscle: "ترايسبس", instructions: ["انزل الدمبل خلف الرأس", "ارفع بالتمديد"], safetyTips: ["لا تقوّس الظهر"] },
  ],
  "5": [
    { id: "h1", name: "إحماء جري خفيف", sets: 1, reps: 300, restSeconds: 30, muscle: "كارديو", instructions: ["جري خفيف 5 دقائق"], safetyTips: ["ابدأ ببطء"] },
    { id: "h2", name: "بيربي", sets: 3, reps: 15, restSeconds: 60, muscle: "كامل الجسم", instructions: ["سكوات → بلانك → بوش أب → قفز"], safetyTips: ["حافظ على الشكل الصحيح"] },
    { id: "h3", name: "ماونتن كلايمر", sets: 3, reps: 30, restSeconds: 45, muscle: "بطن", instructions: ["بلانك مع دفع الركبتين بالتناوب"], safetyTips: ["لا تدلّ الوسط"] },
    { id: "h4", name: "جامبنج جاك", sets: 3, reps: 30, restSeconds: 30, muscle: "كارديو", instructions: ["اقفز مع فتح القدمين والذراعين"], safetyTips: ["اهبط على أصابع القدمين"] },
    { id: "h5", name: "سكوات جامب", sets: 3, reps: 15, restSeconds: 60, muscle: "أرجل", instructions: ["سكوات ثم اقفز عالياً"], safetyTips: ["اهبط بلطف"] },
    { id: "h6", name: "بلانك لمس كتف", sets: 3, reps: 20, restSeconds: 45, muscle: "جذع", instructions: ["بوش أب مع لمس الكتف بالتناوب"], safetyTips: ["لا تتأرجح بالوركين"] },
  ],
};

const DAY_NAMES: Record<string, string> = {
  "0": "الأحد", "1": "الاثنين", "2": "الثلاثاء",
  "3": "الأربعاء", "4": "الخميس", "5": "الجمعة",
};

const DAY_MUSCLES: Record<string, string> = {
  "0": "صدر وترايسبس", "1": "ظهر وبايسبس", "2": "أرجل",
  "3": "أكتاف وبطن", "4": "ذراعين", "5": "كارديو وHIIT",
};

type SessionPhase = "exercise" | "rest" | "complete";

export default function WorkoutSessionScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { addWorkout } = useApp();
  const topPadding = isWeb ? 67 : insets.top;

  const exercises = DAYS_EXERCISES[day] || DAYS_EXERCISES["0"];
  const dayName = DAY_NAMES[day] || "الأحد";
  const dayMuscle = DAY_MUSCLES[day] || "صدر وترايسبس";

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("exercise");
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEx = exercises[currentExIndex];
  const totalExercises = exercises.length;

  useEffect(() => {
    totalTimerRef.current = setInterval(() => {
      setTotalTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            moveToNextExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const completeSet = () => {
    if (currentSet < currentEx.sets) {
      setCurrentSet(currentSet + 1);
      setCurrentRep(0);
      startRest(currentEx.restSeconds);
    } else {
      setCompletedExercises((prev) => new Set([...prev, currentEx.id]));
      if (currentExIndex < totalExercises - 1) {
        startRest(currentEx.restSeconds);
      } else {
        finishWorkout();
      }
    }
  };

  const startRest = (seconds: number) => {
    setPhase("rest");
    setRestTimer(seconds);
    setIsTimerRunning(true);
  };

  const skipRest = () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setRestTimer(0);
    moveToNextExercise();
  };

  const moveToNextExercise = () => {
    if (completedExercises.has(currentEx.id) || currentSet >= currentEx.sets) {
      if (currentExIndex < totalExercises - 1) {
        setCurrentExIndex(currentExIndex + 1);
        setCurrentSet(1);
        setCurrentRep(0);
        setPhase("exercise");
      } else {
        finishWorkout();
      }
    } else {
      setPhase("exercise");
    }
  };

  const finishWorkout = () => {
    setPhase("complete");
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    const caloriesBurned = Math.round(totalTime * 0.12);
    addWorkout({
      date: new Date().toISOString().split("T")[0],
      name: dayMuscle,
      duration: Math.round(totalTime / 60),
      calories: caloriesBurned,
    });
  };

  const confirmExit = () => {
    Alert.alert(
      "إنهاء التمرين؟",
      "هل تريد الخروج من التمرين الحالي؟",
      [
        { text: "متابعة", style: "cancel" },
        { text: "خروج", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  if (phase === "complete") {
    const caloriesBurned = Math.round(totalTime * 0.12);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.completeScreen, { paddingTop: topPadding + 40 }]}>
          <View style={styles.completeIcon}>
            <Text style={{ fontSize: 60 }}>🎉</Text>
          </View>
          <Text style={[styles.completeTitle, { color: colors.text }]}>أحسنت! أنهيت التمرين</Text>
          <Text style={[styles.completeSub, { color: colors.muted }]}>{dayName} — {dayMuscle}</Text>

          <View style={styles.completeStats}>
            <View style={[styles.completeStat, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={styles.completeStatEmoji}>⏱️</Text>
              <Text style={[styles.completeStatValue, { color: colors.text }]}>{formatTime(totalTime)}</Text>
              <Text style={[styles.completeStatLabel, { color: colors.muted }]}>المدة</Text>
            </View>
            <View style={[styles.completeStat, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={styles.completeStatEmoji}>🔥</Text>
              <Text style={[styles.completeStatValue, { color: colors.text }]}>{caloriesBurned}</Text>
              <Text style={[styles.completeStatLabel, { color: colors.muted }]}>سعرة</Text>
            </View>
            <View style={[styles.completeStat, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={styles.completeStatEmoji}>💪</Text>
              <Text style={[styles.completeStatValue, { color: colors.text }]}>{completedExercises.size}</Text>
              <Text style={[styles.completeStatLabel, { color: colors.muted }]}>تمرين</Text>
            </View>
          </View>

          <Pressable style={styles.completeBtn} onPress={() => router.back()}>
            <Text style={styles.completeBtnText}>العودة للبرنامج</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (phase === "rest") {
    const progress = restTimer > 0 ? restTimer / currentEx.restSeconds : 0;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.restScreen, { paddingTop: topPadding + 40 }]}>
          <Text style={[styles.restLabel, { color: colors.muted }]}>وقت الراحة</Text>

          <View style={styles.timerCircle}>
            <View style={[styles.timerCircleBg, { borderColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]} />
            <View style={[styles.timerCircleProgress, { borderColor: "#C490D8", borderTopColor: "transparent", borderRightColor: "transparent", transform: [{ rotate: `${progress * 360}deg` }] }]} />
            <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(restTimer)}</Text>
          </View>

          <Text style={[styles.restExName, { color: colors.text }]}>
            {currentSet < currentEx.sets
              ? `الجلسة التالية: ${currentSet + 1}/${currentEx.sets}`
              : currentExIndex < totalExercises - 1
                ? `التمرين التالي: ${exercises[currentExIndex + 1]?.name}`
                : "التمرين الأخير!"}
          </Text>

          <Pressable style={styles.skipBtn} onPress={skipRest}>
            <Feather name="skip-forward" size={20} color="#C490D8" />
            <Text style={styles.skipBtnText}>تخطي الراحة</Text>
          </Pressable>

          <View style={styles.restProgress}>
            <Text style={[styles.restProgressText, { color: colors.muted }]}>
              {completedExercises.size}/{totalExercises} تمارين · الوقت الكلي {formatTime(totalTime)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 40 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.exerciseScreen, { paddingTop: topPadding + 12 }]}>
        <View style={styles.sessionHeader}>
          <Pressable onPress={confirmExit} style={[styles.exitBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
            <Feather name="x" size={20} color="#F43F5E" />
          </Pressable>
          <View style={styles.sessionInfo}>
            <Text style={[styles.sessionDay, { color: colors.muted }]}>{dayName} — {dayMuscle}</Text>
            <Text style={[styles.sessionTimer, { color: colors.text }]}>{formatTime(totalTime)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.exerciseProgress}>
          <View style={[styles.exerciseProgressBar, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
            <View style={[styles.exerciseProgressFill, { width: `${((currentExIndex + 1) / totalExercises) * 100}%` }]} />
          </View>
          <Text style={[styles.exerciseProgressText, { color: colors.muted }]}>تمرين {currentExIndex + 1} من {totalExercises}</Text>
        </View>

        <View style={[styles.currentExCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.exCardHeader}>
            <View style={[styles.exBadge, { backgroundColor: "#C490D820" }]}>
              <Text style={[styles.exBadgeText, { color: "#C490D8" }]}>{currentEx.muscle}</Text>
            </View>
            <Text style={[styles.exCardNum, { color: "#C490D8" }]}>{currentExIndex + 1}/{totalExercises}</Text>
          </View>

          <Text style={[styles.exCardName, { color: colors.text }]}>{currentEx.name}</Text>

          <View style={styles.exMetaRow}>
            <View style={[styles.exMetaItem, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <Text style={[styles.exMetaValue, { color: colors.text }]}>{currentEx.sets}</Text>
              <Text style={[styles.exMetaLabel, { color: colors.muted }]}>جلسات</Text>
            </View>
            <View style={[styles.exMetaItem, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <Text style={[styles.exMetaValue, { color: colors.text }]}>{currentEx.reps}</Text>
              <Text style={[styles.exMetaLabel, { color: colors.muted }]}>عدة</Text>
            </View>
            <View style={[styles.exMetaItem, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <Text style={[styles.exMetaValue, { color: colors.text }]}>{currentEx.restSeconds}</Text>
              <Text style={[styles.exMetaLabel, { color: colors.muted }]}>ث راحة</Text>
            </View>
          </View>

          <View style={styles.setTracker}>
            <Text style={[styles.setLabel, { color: colors.text }]}>الجلسة الحالية</Text>
            <View style={styles.setDots}>
              {Array.from({ length: currentEx.sets }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.setDot,
                    {
                      backgroundColor: i < currentSet - 1 ? "#22C55E" : i === currentSet - 1 ? "#C490D8" : isDark ? colors.surfaceAlt : "#FDF6FA",
                      borderColor: i === currentSet - 1 ? "#C490D8" : "transparent",
                    },
                  ]}
                >
                  {i < currentSet - 1 ? (
                    <Feather name="check" size={12} color="#fff" />
                  ) : (
                    <Text style={[styles.setDotText, { color: i === currentSet - 1 ? "#fff" : colors.muted }]}>{i + 1}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <Pressable style={styles.completeSetBtn} onPress={completeSet}>
            <Feather name="check-circle" size={22} color="#fff" />
            <Text style={styles.completeSetText}>
              {currentSet < currentEx.sets
                ? `أنهيت الجلسة ${currentSet}`
                : "أنهيت التمرين ✓"}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.instructionsCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.instructionsHeader}>
            <Text style={[styles.instructionsTitle, { color: colors.text }]}>إرشادات الأداء</Text>
            <Feather name="info" size={18} color="#C490D8" />
          </View>
          {currentEx.instructions.map((inst, i) => (
            <View key={i} style={styles.instRow}>
              <Text style={[styles.instText, { color: colors.textSecondary }]}>{inst}</Text>
              <View style={[styles.instNum, { backgroundColor: "#C490D820" }]}>
                <Text style={[styles.instNumText, { color: "#C490D8" }]}>{i + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.safetyCard, { backgroundColor: isDark ? "rgba(244,63,94,0.08)" : "rgba(244,63,94,0.04)", borderColor: "rgba(244,63,94,0.2)" }]}>
          <View style={styles.safetyCardHeader}>
            <Text style={[styles.safetyCardTitle, { color: "#F43F5E" }]}>تنبيهات الأمان</Text>
            <Feather name="alert-triangle" size={18} color="#F43F5E" />
          </View>
          {currentEx.safetyTips.map((tip, i) => (
            <View key={i} style={styles.safetyTipRow}>
              <Text style={[styles.safetyTipText, { color: colors.textSecondary }]}>{tip}</Text>
              <Text>⚠️</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  restScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  restLabel: { fontSize: 16, fontFamily: "Tajawal_500Medium", marginBottom: 30 },
  timerCircle: { width: 200, height: 200, alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 30 },
  timerCircleBg: { position: "absolute", width: "100%", height: "100%", borderRadius: 100, borderWidth: 8 },
  timerCircleProgress: { position: "absolute", width: "100%", height: "100%", borderRadius: 100, borderWidth: 8 },
  timerText: { fontSize: 48, fontFamily: "Tajawal_800ExtraBold" },
  restExName: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "center", marginBottom: 24 },
  skipBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 8, backgroundColor: "rgba(168,85,247,0.1)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  skipBtnText: { fontSize: 15, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  restProgress: { position: "absolute", bottom: 60 },
  restProgressText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  exerciseScreen: { paddingHorizontal: 20 },
  sessionHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  exitBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sessionInfo: { alignItems: "center" },
  sessionDay: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  sessionTimer: { fontSize: 18, fontFamily: "Tajawal_700Bold" },
  exerciseProgress: { marginBottom: 20 },
  exerciseProgressBar: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  exerciseProgressFill: { height: "100%", backgroundColor: "#C490D8", borderRadius: 3 },
  exerciseProgressText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  currentExCard: { borderRadius: 22, padding: 22, borderWidth: 1, marginBottom: 16 },
  exCardHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  exBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  exBadgeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  exCardNum: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  exCardName: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 16 },
  exMetaRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 20 },
  exMetaItem: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
  exMetaValue: { fontSize: 22, fontFamily: "Tajawal_800ExtraBold" },
  exMetaLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  setTracker: { marginBottom: 20 },
  setLabel: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 10 },
  setDots: { flexDirection: "row-reverse", gap: 10, justifyContent: "center" },
  setDot: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  setDotText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  completeSetBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#22C55E", borderRadius: 16, paddingVertical: 16 },
  completeSetText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  instructionsCard: { borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 12 },
  instructionsHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 12 },
  instructionsTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  instRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 8 },
  instNum: { width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  instNumText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  instText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 20 },
  safetyCard: { borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 12 },
  safetyCardHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 10 },
  safetyCardTitle: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  safetyTipRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 6 },
  safetyTipText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 20 },
  completeScreen: { flex: 1, alignItems: "center", paddingHorizontal: 30 },
  completeIcon: { marginBottom: 20 },
  completeTitle: { fontSize: 24, fontFamily: "Cairo_700Bold", textAlign: "center", marginBottom: 8 },
  completeSub: { fontSize: 15, fontFamily: "Tajawal_400Regular", marginBottom: 30 },
  completeStats: { flexDirection: "row-reverse", gap: 12, marginBottom: 30 },
  completeStat: { flex: 1, borderRadius: 18, padding: 16, alignItems: "center", gap: 4, borderWidth: 1 },
  completeStatEmoji: { fontSize: 24 },
  completeStatValue: { fontSize: 22, fontFamily: "Tajawal_800ExtraBold" },
  completeStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  completeBtn: { backgroundColor: "#C490D8", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, alignItems: "center" },
  completeBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
});
