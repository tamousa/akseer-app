import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

export default function CalculatorScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPadding = isWeb ? 67 : insets.top;

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("moderate");
  const [heartAge, setHeartAge] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [waist, setWaist] = useState("");
  const [familyHistory, setFamilyHistory] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [result, setResult] = useState<any>(null);

  const ACTIVITY_LEVELS = [
    { id: "sedentary", label: "قاعد (لا رياضة)", factor: 1.2 },
    { id: "light", label: "خفيف (1-3 أيام)", factor: 1.375 },
    { id: "moderate", label: "معتدل (3-5 أيام)", factor: 1.55 },
    { id: "active", label: "نشيط (6-7 أيام)", factor: 1.725 },
    { id: "very_active", label: "مكثف جداً", factor: 1.9 },
  ];

  const calcCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a) return;
    const bmr =
      gender === "male"
        ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
        : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
    const factor =
      ACTIVITY_LEVELS.find((l) => l.id === activity)?.factor || 1.55;
    const tdee = Math.round(bmr * factor);
    const bmi = (w / (h / 100) ** 2).toFixed(1);
    setResult({
      tdee,
      lose: tdee - 500,
      gain: tdee + 500,
      bmi,
      bmiLabel:
        parseFloat(bmi) < 18.5
          ? "نحيف"
          : parseFloat(bmi) < 25
          ? "طبيعي"
          : parseFloat(bmi) < 30
          ? "زيادة وزن"
          : "سمنة",
      bmiColor:
        parseFloat(bmi) < 18.5
          ? "#3A7DBE"
          : parseFloat(bmi) < 25
          ? "#2AA876"
          : parseFloat(bmi) < 30
          ? "#E8932A"
          : "#E05252",
    });
  };

  const calcHeart = () => {
    const a = parseInt(heartAge);
    const s = parseInt(systolic);
    if (!a || !s) return;
    const maxHR = 220 - a;
    const zone1 = Math.round(maxHR * 0.5);
    const zone2 = Math.round(maxHR * 0.6);
    const zone3 = Math.round(maxHR * 0.7);
    const zone4 = Math.round(maxHR * 0.8);
    const zone5 = Math.round(maxHR * 0.9);
    let bpStatus = "طبيعي";
    let bpColor = "#2AA876";
    if (s >= 180) { bpStatus = "أزمة ضغط"; bpColor = "#E05252"; }
    else if (s >= 140) { bpStatus = "ضغط عالٍ"; bpColor = "#E05252"; }
    else if (s >= 130) { bpStatus = "مرتفع قليلاً"; bpColor = "#E8932A"; }
    else if (s >= 120) { bpStatus = "مرتفع حدودي"; bpColor = "#E8932A"; }
    setResult({ maxHR, zone1, zone2, zone3, zone4, zone5, bpStatus, bpColor });
  };

  const calcDiabetes = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const wa = parseFloat(waist);
    if (!w || !h || !a) return;
    let score = 0;
    if (a >= 45) score += 2;
    if (a >= 65) score += 2;
    const bmi = w / (h / 100) ** 2;
    if (bmi >= 25) score += 2;
    if (bmi >= 30) score += 2;
    if (wa > (gender === "male" ? 102 : 88)) score += 2;
    if (familyHistory) score += 3;
    if (smoker) score += 1;
    let risk = "منخفض", riskColor = "#2AA876", advice = "خطر منخفض للإصابة بالسكري. حافظ على نمط حياتك الصحي.";
    if (score >= 12) { risk = "مرتفع جداً"; riskColor = "#E05252"; advice = "خطر مرتفع جداً! راجع طبيبك فوراً لإجراء الفحوصات اللازمة."; }
    else if (score >= 9) { risk = "مرتفع"; riskColor = "#E05252"; advice = "خطر مرتفع. يُنصح بإجراء تحليل السكر وتغيير نمط الحياة."; }
    else if (score >= 6) { risk = "معتدل"; riskColor = "#E8932A"; advice = "خطر معتدل. اتبع نظاماً غذائياً صحياً وزد نشاطك البدني."; }
    else if (score >= 3) { risk = "منخفض نسبياً"; riskColor = "#E8932A"; advice = "خطر منخفض نسبياً. حافظ على وزن صحي ومارس الرياضة."; }
    setResult({ score, risk, riskColor, advice });
  };

  const calcBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return;
    const bmi = (w / (h / 100) ** 2).toFixed(1);
    let label = "طبيعي", color = "#2AA876", advice = "";
    if (parseFloat(bmi) < 18.5) { label = "نحيف"; color = "#3A7DBE"; advice = "أنت تحت الوزن الطبيعي. زد كمية السعرات الحرارية."; }
    else if (parseFloat(bmi) < 25) { label = "طبيعي"; color = "#2AA876"; advice = "وزنك مثالي! حافظ على نمط حياتك الصحي."; }
    else if (parseFloat(bmi) < 30) { label = "زيادة وزن"; color = "#E8932A"; advice = "لديك زيادة بسيطة في الوزن. النظام الغذائي والرياضة سيساعدان."; }
    else { label = "سمنة"; color = "#E05252"; advice = "يُنصح باستشارة طبيب متخصص لوضع خطة إنقاص وزن."; }
    setResult({ bmi, label, color, advice });
  };

  const getCalcConfig = () => {
    switch (type) {
      case "calories": return { title: "حاسبة السعرات الحرارية", color: "#F59E0B", calc: calcCalories };
      case "heart": return { title: "حاسبة معدل القلب", color: "#F43F5E", calc: calcHeart };
      case "diabetes": return { title: "حاسبة مخاطر السكري", color: "#C490D8", calc: calcDiabetes };
      case "bmi": return { title: "حاسبة مؤشر كتلة الجسم", color: "#3B82F6", calc: calcBmi };
      default: return { title: "حاسبة", color: colors.tint, calc: () => {} };
    }
  };

  const config = getCalcConfig();

  const Field = ({ label, value, onChange, keyboard = "numeric", placeholder = "" }: any) => (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Tajawal_500Medium" }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border, fontFamily: "Tajawal_500Medium" }]}
        textAlign="right"
      />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 8, backgroundColor: config.color }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-right" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.title, { fontFamily: "Cairo_700Bold" }]}>{config.title}</Text>
      </View>

      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Gender selector - shown for most calculators */}
        {type !== "heart" && (
          <>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Tajawal_500Medium" }]}>الجنس</Text>
            <View style={styles.segRow}>
              {(["female", "male"] as const).map((g) => (
                <Pressable
                  key={g}
                  style={[styles.seg, { backgroundColor: gender === g ? config.color : isDark ? colors.surfaceAlt : "#FDF6FA" }]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.segTxt, { color: gender === g ? "#fff" : colors.textSecondary, fontFamily: "Tajawal_500Medium" }]}>
                    {g === "female" ? "أنثى" : "ذكر"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {(type === "calories" || type === "bmi" || type === "diabetes") && (
          <>
            {type !== "bmi" && <Field label="العمر (سنة)" value={age} onChange={setAge} placeholder="30" />}
            <Field label="الوزن (كجم)" value={weight} onChange={setWeight} placeholder="70" />
            <Field label="الطول (سم)" value={height} onChange={setHeight} placeholder="170" />
          </>
        )}

        {type === "calories" && (
          <>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: "Tajawal_500Medium" }]}>مستوى النشاط</Text>
            {ACTIVITY_LEVELS.map((l) => (
              <Pressable
                key={l.id}
                style={[styles.radioBtn, { backgroundColor: activity === l.id ? config.color + "20" : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: activity === l.id ? config.color : colors.border }]}
                onPress={() => setActivity(l.id)}
              >
                <View style={[styles.radioCircle, { borderColor: activity === l.id ? config.color : colors.border }]}>
                  {activity === l.id && <View style={[styles.radioDot, { backgroundColor: config.color }]} />}
                </View>
                <Text style={[styles.radioTxt, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>{l.label}</Text>
              </Pressable>
            ))}
          </>
        )}

        {type === "heart" && (
          <>
            <Field label="العمر (سنة)" value={heartAge} onChange={setHeartAge} placeholder="35" />
            <Field label="ضغط الدم الانقباضي" value={systolic} onChange={setSystolic} placeholder="120" />
            <Field label="ضغط الدم الانبساطي" value={diastolic} onChange={setDiastolic} placeholder="80" />
          </>
        )}

        {type === "diabetes" && (
          <>
            <Field label="محيط الخصر (سم)" value={waist} onChange={setWaist} placeholder="90" />
            <View style={styles.checkRow}>
              <Pressable style={[styles.checkbox, { borderColor: familyHistory ? config.color : colors.border, backgroundColor: familyHistory ? config.color : "transparent" }]} onPress={() => setFamilyHistory(!familyHistory)}>
                {familyHistory && <Feather name="check" size={14} color="#fff" />}
              </Pressable>
              <Text style={[styles.checkLabel, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>تاريخ عائلي للسكري</Text>
            </View>
            <View style={styles.checkRow}>
              <Pressable style={[styles.checkbox, { borderColor: smoker ? config.color : colors.border, backgroundColor: smoker ? config.color : "transparent" }]} onPress={() => setSmoker(!smoker)}>
                {smoker && <Feather name="check" size={14} color="#fff" />}
              </Pressable>
              <Text style={[styles.checkLabel, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>مدخن</Text>
            </View>
          </>
        )}

        <Pressable
          style={[styles.calcBtn, { backgroundColor: config.color }]}
          onPress={config.calc}
        >
          <Text style={[styles.calcBtnTxt, { fontFamily: "Cairo_700Bold" }]}>احسب الآن</Text>
        </Pressable>
      </View>

      {/* Results */}
      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resultTitle, { color: colors.text, fontFamily: "Cairo_700Bold" }]}>
            النتائج
          </Text>

          {type === "calories" && (
            <>
              <View style={[styles.resultRow, { backgroundColor: config.color + "15" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>السعرات اليومية للحفاظ</Text>
                <Text style={[styles.resultValue, { color: config.color, fontFamily: "Cairo_700Bold" }]}>{result.tdee}</Text>
              </View>
              <View style={[styles.resultRow, { backgroundColor: "#E8932A15" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>لإنقاص الوزن (-0.5 كجم/أسبوع)</Text>
                <Text style={[styles.resultValue, { color: "#E8932A", fontFamily: "Cairo_700Bold" }]}>{result.lose}</Text>
              </View>
              <View style={[styles.resultRow, { backgroundColor: "#2AA87615" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>لزيادة الوزن (+0.5 كجم/أسبوع)</Text>
                <Text style={[styles.resultValue, { color: "#2AA876", fontFamily: "Cairo_700Bold" }]}>{result.gain}</Text>
              </View>
              <View style={[styles.resultRow, { backgroundColor: result.bmiColor + "15" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>مؤشر كتلة الجسم (BMI)</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.resultValue, { color: result.bmiColor, fontFamily: "Cairo_700Bold" }]}>{result.bmi}</Text>
                  <Text style={[{ color: result.bmiColor, fontSize: 12, fontFamily: "Tajawal_500Medium" }]}>{result.bmiLabel}</Text>
                </View>
              </View>
            </>
          )}

          {type === "heart" && (
            <>
              <View style={[styles.resultRow, { backgroundColor: "#E0525215" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>أقصى معدل للقلب</Text>
                <Text style={[styles.resultValue, { color: "#E05252", fontFamily: "Cairo_700Bold" }]}>{result.maxHR} نبضة/د</Text>
              </View>
              <View style={[styles.resultRow, { backgroundColor: result.bpColor + "15" }]}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>حالة ضغط الدم</Text>
                <Text style={[styles.resultValue, { color: result.bpColor, fontFamily: "Cairo_700Bold" }]}>{result.bpStatus}</Text>
              </View>
              <Text style={[styles.zonesTitle, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>مناطق التدريب</Text>
              {[
                { label: "سهل جداً", range: `${result.zone1}–${result.zone2}`, color: "#2AA876" },
                { label: "حرق الدهون", range: `${result.zone2}–${result.zone3}`, color: "#E8932A" },
                { label: "هوائي", range: `${result.zone3}–${result.zone4}`, color: "#E8932A" },
                { label: "لاهوائي", range: `${result.zone4}–${result.zone5}`, color: "#E05252" },
                { label: "أقصى جهد", range: `${result.zone5}+`, color: "#E05252" },
              ].map((z) => (
                <View key={z.label} style={[styles.zoneRow, { backgroundColor: z.color + "15" }]}>
                  <Text style={[styles.zoneRange, { color: z.color, fontFamily: "Cairo_700Bold" }]}>{z.range}</Text>
                  <Text style={[styles.zoneLabel, { color: colors.textSecondary, fontFamily: "Tajawal_400Regular" }]}>{z.label}</Text>
                </View>
              ))}
            </>
          )}

          {type === "diabetes" && (
            <>
              <View style={[styles.riskBadge, { backgroundColor: result.riskColor + "20" }]}>
                <Text style={[styles.riskLabel, { color: result.riskColor, fontFamily: "Cairo_700Bold" }]}>
                  مستوى الخطر: {result.risk}
                </Text>
                <Text style={[styles.riskScore, { color: result.riskColor, fontFamily: "Tajawal_700Bold" }]}>
                  النقاط: {result.score}/20
                </Text>
              </View>
              <Text style={[styles.advice, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>
                {result.advice}
              </Text>
            </>
          )}

          {type === "bmi" && (
            <>
              <View style={[styles.bmiCircle, { borderColor: result.color }]}>
                <Text style={[styles.bmiVal, { color: result.color, fontFamily: "Cairo_700Bold" }]}>{result.bmi}</Text>
                <Text style={[styles.bmiLabel, { color: result.color, fontFamily: "Tajawal_700Bold" }]}>{result.label}</Text>
              </View>
              <Text style={[styles.advice, { color: colors.text, fontFamily: "Tajawal_400Regular" }]}>
                {result.advice}
              </Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 },
  backBtn: { marginBottom: 12 },
  title: { color: "#fff", fontSize: 24, textAlign: "right" },
  form: { marginHorizontal: 20, marginTop: -16, borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, marginBottom: 8, textAlign: "right" },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  segRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 16 },
  seg: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  segTxt: { fontSize: 14 },
  radioBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8, borderWidth: 1 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 8, height: 8, borderRadius: 4 },
  radioTxt: { flex: 1, fontSize: 13, textAlign: "right" },
  checkRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  checkLabel: { flex: 1, fontSize: 14, textAlign: "right" },
  calcBtn: { borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  calcBtnTxt: { color: "#fff", fontSize: 16 },
  resultCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20, gap: 12 },
  resultTitle: { fontSize: 18, textAlign: "right", marginBottom: 4 },
  resultRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderRadius: 12, padding: 14 },
  resultLabel: { flex: 1, fontSize: 13, textAlign: "right" },
  resultValue: { fontSize: 20, textAlign: "left" },
  zonesTitle: { fontSize: 15, textAlign: "right", marginTop: 4 },
  zoneRow: { flexDirection: "row-reverse", justifyContent: "space-between", borderRadius: 10, padding: 12 },
  zoneLabel: { fontSize: 13 },
  zoneRange: { fontSize: 13 },
  riskBadge: { borderRadius: 16, padding: 20, alignItems: "center", gap: 8 },
  riskLabel: { fontSize: 18 },
  riskScore: { fontSize: 14 },
  advice: { fontSize: 14, lineHeight: 22, textAlign: "right", backgroundColor: "rgba(0,0,0,0.03)", borderRadius: 12, padding: 14 },
  bmiCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, alignItems: "center", justifyContent: "center", alignSelf: "center", gap: 6 },
  bmiVal: { fontSize: 36 },
  bmiLabel: { fontSize: 16 },
});
