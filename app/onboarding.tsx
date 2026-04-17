import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  I18nManager,
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const STEPS = ["المعلومات الأساسية", "الأهداف الصحية", "النشاط البدني", "التغذية والنوم", "الصحة والأمراض", "الاهتمامات"];

const GOALS = ["خسارة وزن", "زيادة عضلات", "تحسين اللياقة", "تحسين النوم", "تقليل التوتر", "صحة عامة", "عناية بالبشرة والجمال"];
const ACTIVITY_LEVELS = ["خامل تماماً", "نشاط خفيف", "نشاط معتدل", "نشاط عالي", "رياضي محترف"];
const EXERCISES = ["مشي", "جري", "جيم", "يوغا", "سباحة", "ركوب دراجة", "كرة قدم", "تمارين منزلية"];
const DIETS = ["لا يوجد", "نباتي", "كيتو", "خالي من الغلوتين", "منخفض السكر"];
const DISEASES = ["لا يوجد", "سكري", "ضغط الدم", "القلب", "الغدة الدرقية", "الربو", "أخرى"];
const INTERESTS = ["عيادات", "مختبرات", "تمارين", "تغذية", "نوم", "صحة نفسية", "عناية وجمال"];
const CITIES = ["الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر", "أبها", "تبوك", "أخرى"];

export default function OnboardingScreen() {
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { setOnboarding, profile, setProfile } = useApp();
  const isWeb = Platform.OS === "web";

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("أنثى");
  const [age, setAge] = useState("28");
  const [height, setHeight] = useState("165");
  const [weight, setWeight] = useState("62");
  const [city, setCity] = useState("الرياض");
  const [goal, setGoal] = useState("تحسين اللياقة");
  const [targetWeight, setTargetWeight] = useState("58");
  const [activityLevel, setActivityLevel] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [selectedExercises, setSelectedExercises] = useState<string[]>(["مشي", "يوغا"]);
  const [meals, setMeals] = useState(3);
  const [diet, setDiet] = useState("لا يوجد");
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [diseases, setDiseases] = useState<string[]>(["لا يوجد"]);
  const [stressLevel, setStressLevel] = useState(3);
  const [waterDaily, setWaterDaily] = useState(6);
  const [interests, setInterests] = useState<string[]>(["تمارين", "تغذية"]);

  const topPadding = isWeb ? 67 : insets.top;

  const toggleMulti = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (item === "لا يوجد") {
      setter(["لا يوجد"]);
      return;
    }
    const filtered = list.filter((i) => i !== "لا يوجد");
    if (filtered.includes(item)) {
      setter(filtered.filter((i) => i !== item));
    } else {
      setter([...filtered, item]);
    }
  };

  const finish = () => {
    const score = Math.min(100, 55 + Math.floor(Math.random() * 30));
    setOnboarding({
      completed: true,
      healthScore: score,
      step1: { gender, age: parseInt(age), height: parseInt(height), weight: parseInt(weight), city },
    });
    if (profile) {
      setProfile({ ...profile, weight: parseFloat(weight), height: parseFloat(height), age: parseInt(age), city, goal });
    }
    router.replace("/(tabs)");
  };

  const skipAll = () => {
    setOnboarding({ completed: true, healthScore: 50 });
    router.replace("/(tabs)");
  };

  const ChipSelect = ({ options, selected, onSelect, multi = false }: { options: string[]; selected: string | string[]; onSelect: (v: string) => void; multi?: boolean }) => (
    <View style={styles.chipGrid}>
      {options.map((opt) => {
        const isSelected = multi ? (selected as string[]).includes(opt) : selected === opt;
        return (
          <Pressable
            key={opt}
            style={[styles.chip, { backgroundColor: isSelected ? "#C490D8" : isDark ? colors.surfaceAlt : "#F9EFF5", borderColor: isSelected ? "#C490D8" : colors.border }]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, { color: isSelected ? "#fff" : colors.text }]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  const SliderRow = ({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) => (
    <View style={styles.sliderRow}>
      <Text style={[styles.sliderLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.sliderControls}>
        <Pressable style={[styles.sliderBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => value > min && onChange(value - 1)}>
          <Feather name="minus" size={16} color={colors.text} />
        </Pressable>
        <Text style={[styles.sliderValue, { color: "#C490D8" }]}>{value}</Text>
        <Pressable style={[styles.sliderBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => value < max && onChange(value + 1)}>
          <Feather name="plus" size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: colors.text }]}>الجنس</Text>
            <ChipSelect options={["أنثى", "ذكر"]} selected={gender} onSelect={setGender} />
            <Text style={[styles.question, { color: colors.text }]}>العمر</Text>
            <TextInput value={age} onChangeText={setAge} keyboardType="numeric" style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]} textAlign="center" />
            <Text style={[styles.question, { color: colors.text }]}>الطول (سم)</Text>
            <TextInput value={height} onChangeText={setHeight} keyboardType="numeric" style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]} textAlign="center" />
            <Text style={[styles.question, { color: colors.text }]}>الوزن (كجم)</Text>
            <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]} textAlign="center" />
            <Text style={[styles.question, { color: colors.text }]}>المدينة</Text>
            <ChipSelect options={CITIES} selected={city} onSelect={setCity} />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: colors.text }]}>ما هدفك الرئيسي؟</Text>
            <ChipSelect options={GOALS} selected={goal} onSelect={setGoal} />
            <Text style={[styles.question, { color: colors.text }]}>الوزن المستهدف (كجم)</Text>
            <TextInput value={targetWeight} onChangeText={setTargetWeight} keyboardType="numeric" style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]} textAlign="center" />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: colors.text }]}>مستوى النشاط الحالي</Text>
            <ChipSelect options={ACTIVITY_LEVELS} selected={ACTIVITY_LEVELS[activityLevel]} onSelect={(v) => setActivityLevel(ACTIVITY_LEVELS.indexOf(v))} />
            <SliderRow label="أيام التمرين أسبوعياً" value={daysPerWeek} min={0} max={7} onChange={setDaysPerWeek} />
            <Text style={[styles.question, { color: colors.text }]}>التمارين المفضلة</Text>
            <ChipSelect options={EXERCISES} selected={selectedExercises} onSelect={(v) => toggleMulti(selectedExercises, v, setSelectedExercises)} multi />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <SliderRow label="عدد الوجبات يومياً" value={meals} min={1} max={6} onChange={setMeals} />
            <Text style={[styles.question, { color: colors.text }]}>نظام غذائي خاص؟</Text>
            <ChipSelect options={DIETS} selected={diet} onSelect={setDiet} />
            <SliderRow label="ساعات النوم" value={sleepHours} min={3} max={12} onChange={setSleepHours} />
            <SliderRow label="جودة النوم (1-5)" value={sleepQuality} min={1} max={5} onChange={setSleepQuality} />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: colors.text }]}>أمراض مزمنة؟</Text>
            <ChipSelect options={DISEASES} selected={diseases} onSelect={(v) => toggleMulti(diseases, v, setDiseases)} multi />
            <SliderRow label="مستوى التوتر (1-5)" value={stressLevel} min={1} max={5} onChange={setStressLevel} />
            <SliderRow label="أكواب الماء يومياً" value={waterDaily} min={0} max={15} onChange={setWaterDaily} />
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.question, { color: colors.text }]}>ما الذي يهمك أكثر؟</Text>
            <ChipSelect options={INTERESTS} selected={interests} onSelect={(v) => toggleMulti(interests, v, setInterests)} multi />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={skipAll}>
          <Text style={[styles.skipAllText, { color: colors.muted }]}>تخطّي الكل</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>التقييم الصحي</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBg, { backgroundColor: isDark ? colors.surfaceAlt : "#F9EFF5" }]}>
          <View style={[styles.progressFill, { width: `${((step + 1) / 6) * 100}%` }]} />
        </View>
        <Text style={[styles.stepLabel, { color: colors.muted }]}>
          {step + 1} / 6 — {STEPS[step]}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.skipBtn, { borderColor: colors.border }]}
          onPress={() => step < 5 ? setStep(step + 1) : finish()}
        >
          <Text style={[styles.skipBtnText, { color: colors.muted }]}>تخطّي</Text>
        </Pressable>
        <Pressable
          style={styles.nextBtn}
          onPress={() => step < 5 ? setStep(step + 1) : finish()}
        >
          <Text style={styles.nextBtnText}>{step < 5 ? "التالي" : "إنهاء"}</Text>
          <Feather name={step < 5 ? "arrow-left" : "check"} size={18} color="#fff" />
        </Pressable>
        {step > 0 && (
          <Pressable style={[styles.backBtn, { borderColor: colors.border }]} onPress={() => setStep(step - 1)}>
            <Feather name="arrow-right" size={18} color={colors.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  skipAllText: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  progressContainer: { paddingHorizontal: 20, marginBottom: 20 },
  progressBg: { height: 6, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: "#C490D8" },
  stepLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  scrollContent: { flex: 1, paddingHorizontal: 20 },
  stepContent: { gap: 16 },
  question: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, fontFamily: "Tajawal_500Medium" },
  chipGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50, borderWidth: 1 },
  chipText: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  sliderRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  sliderLabel: { fontSize: 15, fontFamily: "Tajawal_500Medium" },
  sliderControls: { flexDirection: "row", alignItems: "center", gap: 16 },
  sliderBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  sliderValue: { fontSize: 22, fontFamily: "Tajawal_700Bold", minWidth: 30, textAlign: "center" },
  footer: { flexDirection: "row-reverse", paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  nextBtn: { flex: 1, flexDirection: "row-reverse", backgroundColor: "#A86DBF", borderRadius: 14, paddingVertical: 16, alignItems: "center", justifyContent: "center", gap: 8 },
  nextBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  skipBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  skipBtnText: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  backBtn: { width: 52, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
