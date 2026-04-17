import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const HORMONES_ART = require("@/assets/images/womens-hormones-art.png");

const HORMONE_PANELS = [
  { id: "thyroid", name: "هرمونات الغدة الدرقية", emoji: "🦋", color: "#F59E0B", badge: "تؤثر على كل خلية في الجسم ⚡", tests: ["TSH","T3","T4","Anti-TPO"], symptoms: ["التعب","البرود","الأرق","تساقط الشعر","زيادة الوزن"], info: "تحكم معدل الأيض، الطاقة، ودرجة الحرارة. خلل الدرقية شائع جداً في المرأة." },
  { id: "estrogen", name: "هرمونات الأنوثة", emoji: "🌸", color: "#EC4899", badge: "أساس الصحة الإنجابية 💜", tests: ["LH","FSH","Progesterone","Estradiol (E2)"], symptoms: ["اضطراب الدورة","جفاف المهبل","تقلبات المزاج","ضعف الخصوبة"], info: "تتحكم في الدورة الشهرية والخصوبة والصحة العاطفية والعظام." },
  { id: "testosterone", name: "التستوستيرون", emoji: "💪", color: "#A86DBF", badge: "مهم للمرأة أيضاً! 🔬", tests: ["Free Testosterone","Total Testosterone","DHEA-S","SHBG"], symptoms: ["ضعف الرغبة","فقدان العضلات","التعب المزمن","حبوب الوجه"], info: "يؤثر على الطاقة، الرغبة الجنسية، كتلة العضلات، والمزاج. ارتفاعه قد يسبب PCOS." },
  { id: "insulin", name: "الأنسولين وسكر الدم", emoji: "🍬", color: "#10B981", badge: "مرتبط بـ PCOS وهشاشة العظام 📊", tests: ["Fasting Glucose","HbA1c","Fasting Insulin","HOMA-IR"], symptoms: ["تعب بعد الأكل","رغبة شديدة بالسكر","انتفاخ","صعوبة خسارة الوزن"], info: "مقاومة الأنسولين شائعة في PCOS وتؤثر على هرمونات الأنوثة." },
  { id: "cortisol", name: "هرمون الكورتيزول", emoji: "😤", color: "#EF4444", badge: "هرمون التوتر — راقبيه! ⚠️", tests: ["Morning Cortisol","24h Urine Cortisol","ACTH","Cortisol Saliva"], symptoms: ["توتر مزمن","اضطراب النوم","زيادة الوزن في البطن","ضعف المناعة"], info: "ارتفاع الكورتيزول المزمن يضر بكل الهرمونات الأخرى ويؤثر على الدورة." },
  { id: "prolactin", name: "البرولاكتين", emoji: "🍼", color: "#6366F1", badge: "ليس فقط لمن يرضعن!", tests: ["Prolactin","MRI الغدة النخامية (إذا مرتفع)"], symptoms: ["اضطراب الدورة","سيلان الثدي","ضعف الرغبة","صعوبة الحمل"], info: "ارتفاعه قد يوقف الدورة ويؤثر على الخصوبة، حتى بدون رضاعة." },
];

const CONDITIONS = [
  { name: "متلازمة تكيس المبايض PCOS", emoji: "🔵", color: "#A86DBF", tests: ["LH/FSH Ratio","Testosterone","Insulin","AMH"] },
  { name: "قصور الغدة الدرقية", emoji: "🦋", color: "#F59E0B", tests: ["TSH","T3","T4","Anti-TPO"] },
  { name: "مرحلة قبل انقطاع الطمث", emoji: "🌙", color: "#EC4899", tests: ["FSH","Estradiol","AMH","LH"] },
  { name: "خلل هرمونات الأنوثة", emoji: "💮", color: "#10B981", tests: ["Estradiol","Progesterone","LH","FSH"] },
];

const DAILY_SYMPTOMS = [
  { id: "tired",     emoji: "😴", label: "إرهاق" },
  { id: "anxious",   emoji: "😰", label: "قلق" },
  { id: "bloated",   emoji: "🫃", label: "انتفاخ" },
  { id: "cramps",    emoji: "😣", label: "تقلصات" },
  { id: "headache",  emoji: "🤕", label: "صداع" },
  { id: "acne",      emoji: "😔", label: "حبوب" },
  { id: "hotflash",  emoji: "🥵", label: "هبات ساخنة" },
  { id: "insomnia",  emoji: "🌙", label: "أرق" },
  { id: "mood",      emoji: "😤", label: "تقلبات مزاج" },
  { id: "hairloss",  emoji: "💇", label: "تساقط شعر" },
  { id: "coldhand",  emoji: "🥶", label: "برودة الأطراف" },
  { id: "dryskin",   emoji: "🏜️", label: "جفاف الجلد" },
];

const LABS = [
  { name: "مختبر نظرة", rating: 4.9, specialty: "تحاليل هرمونية متكاملة", emoji: "🔬" },
  { name: "مختبر الحياة", rating: 4.8, specialty: "نتائج في 24 ساعة", emoji: "⚗️" },
  { name: "مختبر البيان", rating: 4.7, specialty: "جهاز الموجات فوق الصوتية", emoji: "🏥" },
];

function ScaleSelector({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const inputBg = isDark ? colors.surfaceAlt : "#F0EAF7";
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.text, textAlign: "right" }}>{label}</Text>
        <View style={[{ borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: color + "22" }]}>
          <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color }}>{value}/10</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row-reverse", gap: 4 }}>
        {Array.from({length: 10}, (_, i) => (
          <Pressable key={i} onPress={() => onChange(i + 1)}
            style={{ flex: 1, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: value === i + 1 ? color : inputBg }}>
            <Text style={{ fontSize: 11, fontFamily: "Cairo_700Bold", color: value === i + 1 ? "#fff" : colors.muted }}>{i + 1}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function HormonesScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const { hormoneEntries, hormoneTests, addHormoneEntry, addHormoneTest } = useApp();

  const [logOpen, setLogOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [libido, setLibido] = useState(5);
  const [thyroidFeel, setThyroidFeel] = useState(5);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState("");
  const [testUnit, setTestUnit] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [testNormalRange, setTestNormalRange] = useState("");
  const [activeInsight, setActiveInsight] = useState<"symptoms"|"energy"|"mood">("symptoms");
  const [chartTestName, setChartTestName] = useState<string | null>(null);

  const modalBg = isDark ? colors.surface : "#FFFFFF";
  const inputBg = isDark ? colors.surfaceAlt : "#F8F0F5";
  const chipBorder = isDark ? "#5A4570" : "#D8C8E8";

  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return hormoneEntries.find(e => e.date.startsWith(today));
  }, [hormoneEntries]);

  const balanceScore = useMemo(() => {
    if (hormoneTests.length === 0) return null;
    const recent = hormoneTests.slice(-5);
    const inRange = recent.filter(t => {
      if (!t.normalRange || !t.result) return true;
      const [min, max] = t.normalRange.split("-").map(Number);
      const val = parseFloat(t.result);
      if (isNaN(val) || isNaN(min) || isNaN(max)) return true;
      return val >= min && val <= max;
    });
    return Math.round((inRange.length / recent.length) * 100);
  }, [hormoneTests]);

  const symptomFrequency = useMemo(() => {
    const last30 = hormoneEntries.filter(e => new Date().getTime() - new Date(e.date).getTime() < 30 * 86400000);
    const counts: Record<string, number> = {};
    last30.forEach(e => e.symptoms.forEach(s => { counts[s] = (counts[s] ?? 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [hormoneEntries]);

  const avgEnergy = useMemo(() => {
    const last7 = hormoneEntries.filter(e => new Date().getTime() - new Date(e.date).getTime() < 7 * 86400000);
    if (!last7.length) return null;
    return (last7.reduce((s, e) => s + (e.energy ?? 5), 0) / last7.length).toFixed(1);
  }, [hormoneEntries]);

  const avgMood = useMemo(() => {
    const last7 = hormoneEntries.filter(e => new Date().getTime() - new Date(e.date).getTime() < 7 * 86400000);
    if (!last7.length) return null;
    return (last7.reduce((s, e) => s + (e.mood ?? 5), 0) / last7.length).toFixed(1);
  }, [hormoneEntries]);

  const uniqueTestNames = useMemo(() => [...new Set(hormoneTests.map(t => t.name))], [hormoneTests]);

  const testTrendData = useMemo(() => {
    if (!chartTestName) return [];
    return hormoneTests
      .filter(t => t.name === chartTestName)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-6);
  }, [hormoneTests, chartTestName]);

  const saveLog = () => {
    addHormoneEntry({ date: new Date().toISOString(), symptoms: selectedSymptoms, energy, mood, stress, libido, thyroidFeel, notes: "" });
    setLogOpen(false); setSelectedSymptoms([]); setEnergy(5); setMood(5); setStress(5); setLibido(5); setThyroidFeel(5);
    Alert.alert("✅ تم", "تم تسجيل تحديثاتك الهرمونية اليوم");
  };

  const saveTest = () => {
    if (!testName || !testResult) { Alert.alert("خطأ", "أدخلي اسم التحليل والنتيجة"); return; }
    addHormoneTest({ id: Date.now().toString(), name: testName, result: testResult, unit: testUnit, date: testDate, normalRange: testNormalRange, notes: "" });
    setTestOpen(false); setTestName(""); setTestResult(""); setTestUnit(""); setTestNormalRange("");
    setChartTestName(testName);
    Alert.alert("✅ تم", "تم حفظ نتيجة التحليل — شاهدي الرسم البياني أدناه");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}>

      <View style={[styles.hero, { height: 220 + topPadding }]}>
        <Image source={HORMONES_ART} style={styles.heroImg} resizeMode="cover" />
        <LinearGradient colors={["rgba(16,185,129,0.45)","rgba(52,211,153,0.85)"]}
          style={[styles.heroGrad, { paddingTop: topPadding }]}>
          <View style={styles.heroRow}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="chevron-right" size={22} color="#fff" />
            </Pressable>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={styles.heroTitle}>🔬 صحة الهرمونات</Text>
            <Text style={styles.heroSub}>راقبي توازنك الهرموني يومياً</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Quick status */}
      <View style={styles.statsRow}>
        <Pressable onPress={() => setLogOpen(true)} style={[styles.statCard, { backgroundColor: "#10B98118", borderColor: "#10B98133" }]}>
          <Text style={{ fontSize: 20 }}>📝</Text>
          <Text style={[styles.statVal, { color: "#10B981" }]}>{todayEntry ? todayEntry.symptoms.length : "—"}</Text>
          <Text style={[styles.statLbl, { color: colors.muted }]}>أعراض اليوم</Text>
        </Pressable>
        <Pressable onPress={() => setLogOpen(true)} style={[styles.statCard, { backgroundColor: "#A86DBF18", borderColor: "#A86DBF33" }]}>
          <Text style={{ fontSize: 20 }}>⚡</Text>
          <Text style={[styles.statVal, { color: "#A86DBF" }]}>{todayEntry?.energy ?? "—"}/10</Text>
          <Text style={[styles.statLbl, { color: colors.muted }]}>الطاقة</Text>
        </Pressable>
        <Pressable onPress={() => setLogOpen(true)} style={[styles.statCard, { backgroundColor: "#EC489918", borderColor: "#EC489933" }]}>
          <Text style={{ fontSize: 20 }}>😊</Text>
          <Text style={[styles.statVal, { color: "#EC4899" }]}>{todayEntry?.mood ?? "—"}/10</Text>
          <Text style={[styles.statLbl, { color: colors.muted }]}>المزاج</Text>
        </Pressable>
      </View>

      {/* Log today button */}
      {!todayEntry ? (
        <Pressable onPress={() => setLogOpen(true)} style={[styles.card, { backgroundColor: "#10B98112", borderColor: "#10B98133", alignItems: "center", gap: 8, flexDirection: "row-reverse", justifyContent: "center" }]}>
          <Feather name="plus-circle" size={20} color="#10B981" />
          <Text style={[styles.cardTitle, { color: "#10B981" }]}>سجّلي تحديثاتك الهرمونية اليوم</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setLogOpen(true)} style={[styles.card, { backgroundColor: "#10B98112", borderColor: "#10B98133" }]}>
          <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={[styles.cardTitle, { color: "#10B981", fontSize: 13 }]}>✅ تم تسجيل تحديثاتك اليوم</Text>
            <Text style={[styles.subTxt, { color: colors.muted }]}>تعديل</Text>
          </View>
          <View style={{ flexDirection: "row-reverse", gap: 12 }}>
            <Text style={[styles.subTxt, { color: colors.muted }]}>طاقة: {todayEntry.energy}/10</Text>
            <Text style={[styles.subTxt, { color: colors.muted }]}>مزاج: {todayEntry.mood}/10</Text>
            <Text style={[styles.subTxt, { color: colors.muted }]}>توتر: {todayEntry.stress ?? 5}/10</Text>
          </View>
        </Pressable>
      )}

      {/* Hormone Balance Score */}
      {balanceScore !== null && (
        <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>🎯 نقاط توازنك الهرموني</Text>
          <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.barFill, { width: `${balanceScore}%`, backgroundColor: balanceScore > 70 ? "#10B981" : balanceScore > 40 ? "#F59E0B" : "#EF4444" }]} />
              </View>
              <Text style={[styles.subTxt, { color: colors.muted }]}>
                {balanceScore > 70 ? "توازن ممتاز! استمري على نمط حياتك الصحي 🌟" :
                 balanceScore > 40 ? "بعض القيم خارج المعدل — استشيري طبيبتك" :
                 "يُنصح باستشارة طبيب متخصص بالهرمونات ⚠️"}
              </Text>
            </View>
            <Text style={{ fontSize: 40, fontFamily: "Cairo_700Bold", color: balanceScore > 70 ? "#10B981" : balanceScore > 40 ? "#F59E0B" : "#EF4444", marginRight: 12 }}>
              {balanceScore}%
            </Text>
          </View>
        </View>
      )}

      {/* 30-Day Insights */}
      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📊 إحصاءات 30 يوم</Text>
        <View style={styles.tabRow}>
          {([["symptoms","أعراض"],["energy","طاقة"],["mood","مزاج"]] as const).map(([t, lbl]) => (
            <Pressable key={t} onPress={() => setActiveInsight(t)} style={[styles.tab, activeInsight===t && { backgroundColor: "#10B981" }]}>
              <Text style={[styles.tabTxt, activeInsight===t ? { color: "#fff" } : { color: colors.muted }]}>{lbl}</Text>
            </Pressable>
          ))}
        </View>

        {activeInsight === "symptoms" && (
          symptomFrequency.length > 0 ? (
            <View style={{ gap: 10 }}>
              {symptomFrequency.map(([symId, count]) => {
                const sym = DAILY_SYMPTOMS.find(s => s.id === symId);
                const pct = (count / (symptomFrequency[0][1])) * 100;
                return (
                  <View key={symId} style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
                    <Text style={[styles.subTxt, { color: colors.muted, width: 95, textAlign: "right" }]}>{sym?.emoji} {sym?.label ?? symId}</Text>
                    <View style={[styles.barTrack, { flex: 1, backgroundColor: colors.border }]}>
                      <View style={[styles.barFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={[styles.subTxt, { color: "#10B981", width: 28, textAlign: "center", fontFamily: "Cairo_700Bold" }]}>{count}</Text>
                  </View>
                );
              })}
            </View>
          ) : <Text style={[styles.subTxt, { color: colors.muted, textAlign: "center", paddingVertical: 12 }]}>لا توجد بيانات — ابدئي بتسجيل أعراضك يومياً</Text>
        )}
        {activeInsight === "energy" && (
          avgEnergy ? (
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 48, fontFamily: "Cairo_700Bold", color: "#A86DBF" }}>{avgEnergy}</Text>
              <Text style={[styles.subTxt, { color: colors.muted }]}>متوسط طاقتك آخر 7 أيام</Text>
              <View style={[styles.barTrack, { width: "100%", backgroundColor: colors.border }]}>
                <View style={[styles.barFill, { width: `${(parseFloat(avgEnergy) / 10) * 100}%`, backgroundColor: "#A86DBF" }]} />
              </View>
            </View>
          ) : <Text style={[styles.subTxt, { color: colors.muted, textAlign: "center", paddingVertical: 12 }]}>سجّلي طاقتك يومياً لرؤية الإحصاءات</Text>
        )}
        {activeInsight === "mood" && (
          avgMood ? (
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 48, fontFamily: "Cairo_700Bold", color: "#EC4899" }}>{avgMood}</Text>
              <Text style={[styles.subTxt, { color: colors.muted }]}>متوسط مزاجك آخر 7 أيام</Text>
              <View style={[styles.barTrack, { width: "100%", backgroundColor: colors.border }]}>
                <View style={[styles.barFill, { width: `${(parseFloat(avgMood) / 10) * 100}%`, backgroundColor: "#EC4899" }]} />
              </View>
            </View>
          ) : <Text style={[styles.subTxt, { color: colors.muted, textAlign: "center", paddingVertical: 12 }]}>سجّلي مزاجك يومياً لرؤية الإحصاءات</Text>
        )}
      </View>

      {/* Test Results Log */}
      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>📋 نتائج تحاليلي</Text>
          <Pressable onPress={() => setTestOpen(true)} style={[styles.addBtn, { backgroundColor: "#10B981" }]}>
            <Text style={styles.addBtnTxt}>+ أضيفي نتيجة</Text>
          </Pressable>
        </View>

        {/* Chart — show trends for a selected test */}
        {uniqueTestNames.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.subTxt, { color: colors.muted, fontFamily: "Tajawal_700Bold" }]}>📈 مقارنة نتائج التحاليل عبر الزمن</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
              {uniqueTestNames.map(name => (
                <Pressable key={name} onPress={() => setChartTestName(chartTestName === name ? null : name)}
                  style={[styles.testChip, { backgroundColor: chartTestName === name ? "#10B981" : inputBg, borderColor: chartTestName === name ? "#10B981" : chipBorder }]}>
                  <Text style={[styles.chipTxt, { color: chartTestName === name ? "#fff" : colors.text }]}>{name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {chartTestName && testTrendData.length > 0 && (
              <View style={[styles.chartBox, { backgroundColor: "#10B98108", borderColor: "#10B98130" }]}>
                <Text style={[styles.subTxt, { color: "#10B981", fontFamily: "Cairo_700Bold", marginBottom: 8 }]}>
                  {chartTestName} — آخر {testTrendData.length} نتائج
                  {testTrendData[0]?.unit ? ` (${testTrendData[0].unit})` : ""}
                </Text>
                {(() => {
                  const vals = testTrendData.map(t => parseFloat(t.result)).filter(v => !isNaN(v));
                  const maxVal = Math.max(...vals, 1);
                  return (
                    <View style={{ gap: 8 }}>
                      {testTrendData.map((t, i) => {
                        const val = parseFloat(t.result);
                        const pct = isNaN(val) ? 50 : (val / maxVal) * 100;
                        const inRange = t.normalRange ? (() => {
                          const [min, max] = t.normalRange.split("-").map(Number);
                          return !isNaN(val) && !isNaN(min) && !isNaN(max) ? val >= min && val <= max : true;
                        })() : true;
                        return (
                          <View key={i} style={{ gap: 4 }}>
                            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                              <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10 }]}>{t.date}</Text>
                              <Text style={[styles.subTxt, { color: inRange ? "#10B981" : "#EF4444", fontFamily: "Cairo_700Bold" }]}>
                                {t.result} {t.unit}  {inRange ? "✅" : "⚠️"}
                              </Text>
                            </View>
                            <View style={[styles.barTrack, { backgroundColor: colors.border, height: 8 }]}>
                              <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, height: 8, backgroundColor: inRange ? "#10B981" : "#EF4444" }]} />
                            </View>
                          </View>
                        );
                      })}
                      {testTrendData[0]?.normalRange && (
                        <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10, textAlign: "center" }]}>
                          المعدل الطبيعي: {testTrendData[0].normalRange}
                        </Text>
                      )}
                    </View>
                  );
                })()}
              </View>
            )}
          </View>
        )}

        {hormoneTests.length > 0 ? (
          <View style={{ gap: 8 }}>
            <Text style={[styles.subTxt, { color: colors.muted, fontFamily: "Tajawal_700Bold" }]}>آخر النتائج:</Text>
            {hormoneTests.slice(-5).reverse().map((t, i) => {
              const inRange = t.normalRange && t.result ? (() => {
                const [min, max] = t.normalRange.split("-").map(Number);
                const val = parseFloat(t.result);
                return !isNaN(val) && !isNaN(min) && !isNaN(max) ? val >= min && val <= max : true;
              })() : true;
              return (
                <View key={i} style={[styles.testResultRow, { backgroundColor: inRange ? "#10B98110" : "#EF444410", borderColor: inRange ? "#10B98130" : "#EF444430" }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subTxt, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>{t.name}</Text>
                    <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10 }]}>{t.date}</Text>
                  </View>
                  <View style={{ alignItems: "flex-start" }}>
                    <Text style={[styles.subTxt, { color: inRange ? "#10B981" : "#EF4444", fontFamily: "Cairo_700Bold", fontSize: 14 }]}>
                      {t.result} {t.unit}
                    </Text>
                    {t.normalRange && <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10 }]}>طبيعي: {t.normalRange}</Text>}
                  </View>
                  <Text style={{ fontSize: 16 }}>{inRange ? "✅" : "⚠️"}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.subTxt, { color: colors.muted, textAlign: "center", paddingVertical: 12 }]}>
            لم تُضافي أي نتائج بعد — ابدئي بتسجيل نتائج تحاليلك
          </Text>
        )}
      </View>

      {/* Hormone Panels */}
      <View style={{ paddingHorizontal: 20, paddingTop: 4, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>🧬 التحاليل الهرمونية المهمة</Text>
        {HORMONE_PANELS.map((panel) => (
          <Pressable key={panel.id} onPress={() => setExpandedPanel(expandedPanel === panel.id ? null : panel.id)}
            style={[styles.panelCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: panel.color + "44" }]}>
            <View style={[styles.panelHeader, { borderBottomWidth: expandedPanel === panel.id ? 1 : 0, borderBottomColor: panel.color + "30" }]}>
              <View style={[styles.panelIcon, { backgroundColor: panel.color + "20" }]}>
                <Text style={{ fontSize: 22 }}>{panel.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10 }]}>{panel.badge}</Text>
                <Text style={[styles.cardTitle, { color: colors.text, fontSize: 14 }]}>{panel.name}</Text>
              </View>
              <Feather name={expandedPanel === panel.id ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
            </View>
            {expandedPanel === panel.id && (
              <View style={{ gap: 12, paddingTop: 12 }}>
                <Text style={[styles.subTxt, { color: colors.text }]}>{panel.info}</Text>
                <View style={{ gap: 6 }}>
                  <Text style={[styles.subTxt, { color: panel.color, fontFamily: "Tajawal_700Bold" }]}>التحاليل المطلوبة:</Text>
                  <View style={styles.chipRow}>
                    {panel.tests.map(t => (
                      <View key={t} style={[styles.chip, { backgroundColor: panel.color + "18" }]}>
                        <Text style={[styles.chipTxt, { color: panel.color }]}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={{ gap: 6 }}>
                  <Text style={[styles.subTxt, { color: "#EF4444", fontFamily: "Tajawal_700Bold" }]}>أبرز الأعراض:</Text>
                  <Text style={[styles.subTxt, { color: colors.muted }]}>{panel.symptoms.join(" • ")}</Text>
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Common Conditions */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>💊 حالات شائعة عند المرأة</Text>
        {CONDITIONS.map((c, i) => (
          <Pressable key={i} onPress={() => setExpandedCondition(expandedCondition === c.name ? null : c.name)}
            style={[styles.panelCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: c.color + "44" }]}>
            <View style={styles.panelHeader}>
              <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
              <Text style={[styles.cardTitle, { color: colors.text, flex: 1, fontSize: 13 }]}>{c.name}</Text>
              <Feather name={expandedCondition === c.name ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
            </View>
            {expandedCondition === c.name && (
              <View style={{ gap: 8, paddingTop: 10 }}>
                <Text style={[styles.subTxt, { color: c.color, fontFamily: "Tajawal_700Bold" }]}>التحاليل الأساسية للتشخيص:</Text>
                <View style={styles.chipRow}>
                  {c.tests.map(t => (
                    <View key={t} style={[styles.chip, { backgroundColor: c.color + "18" }]}>
                      <Text style={[styles.chipTxt, { color: c.color }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Labs */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>🔬 مختبرات موصى بها</Text>
        {LABS.map((lab, i) => (
          <Pressable key={i} style={[styles.labCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
            <Text style={{ fontSize: 26 }}>{lab.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subTxt, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>{lab.name}</Text>
              <Text style={[styles.subTxt, { color: colors.muted }]}>{lab.specialty}</Text>
              <Text style={[styles.subTxt, { color: "#F59E0B" }]}>⭐ {lab.rating}</Text>
            </View>
            <View style={[styles.addBtn, { backgroundColor: "#10B98120" }]}>
              <Text style={[styles.addBtnTxt, { color: "#10B981" }]}>احجزي</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Blog */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📖 مقالات هرمونية</Text>
        {[
          { title: "هل تعانين من PCOS؟ 7 علامات تكشفها تحاليل بسيطة", emoji: "🔵", tag: "PCOS" },
          { title: "ما الفرق بين قصور وفرط نشاط الغدة الدرقية؟", emoji: "🦋", tag: "درقية" },
          { title: "أطعمة تدعم التوازن الهرموني لدى المرأة", emoji: "🥗", tag: "تغذية" },
        ].map((a, i) => (
          <Pressable key={i} style={[styles.blogCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
            <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.subTxt, { color: colors.text }]}>{a.title}</Text>
              <View style={[styles.chip, { backgroundColor: "#10B98118", alignSelf: "flex-end" }]}>
                <Text style={[styles.chipTxt, { color: "#10B981" }]}>{a.tag}</Text>
              </View>
            </View>
            <Feather name="chevron-left" size={16} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.bannerWrap} onPress={() => router.push("/section/clinics" as any)}>
        <LinearGradient colors={["#10B981","#34D399"]} style={styles.bookBanner}>
          <Text style={styles.bookBannerTxt}>🔬 احجزي تحاليل هرمونية الآن</Text>
          <View style={styles.bookBtn}><Text style={styles.bookBtnTxt}>احجزي</Text></View>
        </LinearGradient>
      </Pressable>

      {/* ===== Daily Log Modal ===== */}
      <Modal visible={logOpen} transparent animationType="slide" onRequestClose={() => setLogOpen(false)}>
        <View style={styles.overlay}>
          <ScrollView style={[styles.modalSheet, { backgroundColor: modalBg }]}
            contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: 17 }]}>🔬 تحديثات الهرمونات</Text>
            <Text style={[styles.subTxt, { color: colors.muted }]}>سجّلي حالتك الهرمونية الشاملة اليوم</Text>

            <View style={{ gap: 8 }}>
              <Text style={[styles.subTxt, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>الأعراض التي تشعرين بها:</Text>
              <View style={styles.sympGrid}>
                {DAILY_SYMPTOMS.map(s => (
                  <Pressable key={s.id} onPress={() => setSelectedSymptoms(prev => prev.includes(s.id) ? prev.filter(x => x!==s.id) : [...prev, s.id])}
                    style={[styles.sympChip, { borderColor: selectedSymptoms.includes(s.id) ? "#10B981" : chipBorder, backgroundColor: selectedSymptoms.includes(s.id) ? "#10B981" : "transparent" }]}>
                    <Text style={{ fontSize: 14 }}>{s.emoji}</Text>
                    <Text style={[styles.chipTxt, { color: selectedSymptoms.includes(s.id) ? "#fff" : colors.text }]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <ScaleSelector label="⚡ مستوى الطاقة" value={energy} onChange={setEnergy} color="#A86DBF" />
            <ScaleSelector label="😊 حالة المزاج" value={mood} onChange={setMood} color="#EC4899" />
            <ScaleSelector label="😰 مستوى التوتر" value={stress} onChange={setStress} color="#EF4444" />
            <ScaleSelector label="💜 الرغبة الجنسية" value={libido} onChange={setLibido} color="#6366F1" />
            <ScaleSelector label="🦋 إحساس الغدة الدرقية (1=برود شديد / 10=دفء طبيعي)" value={thyroidFeel} onChange={setThyroidFeel} color="#F59E0B" />

            <View style={styles.modalBtns}>
              <Pressable onPress={() => setLogOpen(false)} style={[styles.modalBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F0EAF7" }]}>
                <Text style={[styles.tabTxt, { color: colors.text }]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveLog} style={[styles.modalBtn, { backgroundColor: "#10B981" }]}>
                <Text style={[styles.tabTxt, { color: "#fff" }]}>💾 حفظ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ===== Test Result Modal ===== */}
      <Modal visible={testOpen} transparent animationType="slide" onRequestClose={() => setTestOpen(false)}>
        <View style={styles.overlay}>
          <ScrollView style={[styles.modalSheet, { backgroundColor: modalBg }]}
            contentContainerStyle={{ padding: 24, gap: 14, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: 17 }]}>📋 أضيفي نتيجة تحليل هرموني</Text>

            {[
              { lbl: "اسم التحليل *", val: testName, set: setTestName, ph: "مثال: TSH" },
              { lbl: "النتيجة *", val: testResult, set: setTestResult, ph: "مثال: 2.5" },
              { lbl: "الوحدة", val: testUnit, set: setTestUnit, ph: "مثال: mIU/L" },
              { lbl: "المعدل الطبيعي", val: testNormalRange, set: setTestNormalRange, ph: "مثال: 0.4-4.0" },
              { lbl: "تاريخ التحليل", val: testDate, set: setTestDate, ph: "YYYY-MM-DD" },
            ].map(({ lbl, val, set, ph }, i) => (
              <View key={i} style={{ gap: 6 }}>
                <Text style={[styles.subTxt, { color: colors.muted, fontFamily: "Tajawal_700Bold" }]}>{lbl}</Text>
                <TextInput
                  style={[styles.testInput, { color: colors.text, borderColor: colors.border, backgroundColor: inputBg }]}
                  value={val} onChangeText={set} placeholder={ph} placeholderTextColor={colors.muted} textAlign="right" />
              </View>
            ))}

            <View style={[styles.infoBox, { backgroundColor: "#10B98112", borderColor: "#10B98133" }]}>
              <Text style={[styles.subTxt, { color: "#10B981" }]}>💡 بعد الحفظ، ستظهر نتيجتك في الرسم البياني التفاعلي لمتابعة التغيرات عبر الزمن</Text>
            </View>

            <View style={styles.modalBtns}>
              <Pressable onPress={() => setTestOpen(false)} style={[styles.modalBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F0EAF7" }]}>
                <Text style={[styles.tabTxt, { color: colors.text }]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveTest} style={[styles.modalBtn, { backgroundColor: "#10B981" }]}>
                <Text style={[styles.tabTxt, { color: "#fff" }]}>💾 حفظ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { position: "relative" },
  heroImg: { width: "100%", height: "100%", position: "absolute" },
  heroGrad: { flex: 1, padding: 16, justifyContent: "space-between" },
  heroRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  iconBtn: { width: 36, height: 36, backgroundColor: "rgba(0,0,0,0.22)", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  heroTitle: { color: "#fff", fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroSub: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statsRow: { flexDirection: "row-reverse", paddingHorizontal: 20, gap: 10, marginTop: 14 },
  statCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center", borderWidth: 1, gap: 4 },
  statVal: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  card: { marginHorizontal: 20, marginTop: 14, borderRadius: 20, padding: 16, borderWidth: 1, gap: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  subTxt: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  barTrack: { height: 10, borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#10B981", borderRadius: 6 },
  tabRow: { flexDirection: "row-reverse", gap: 6 },
  tab: { flex: 1, borderRadius: 10, paddingVertical: 7, alignItems: "center" },
  tabTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  chipRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  chipTxt: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  testChip: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  panelCard: { borderRadius: 18, padding: 14, borderWidth: 1, gap: 0 },
  panelHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingBottom: 10 },
  panelIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  addBtn: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnTxt: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  testResultRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 12, borderWidth: 1 },
  labCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  blogCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  bannerWrap: { marginHorizontal: 20, marginTop: 20, borderRadius: 22, overflow: "hidden" },
  bookBanner: { padding: 20, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  bookBannerTxt: { color: "#fff", fontSize: 14, fontFamily: "Cairo_700Bold" },
  bookBtn: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnTxt: { color: "#10B981", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  chartBox: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 4 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "90%" },
  sympGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  sympChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
  modalBtns: { flexDirection: "row-reverse", gap: 10, marginTop: 4 },
  modalBtn: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
  testInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, fontFamily: "Tajawal_400Regular" },
  infoBox: { borderRadius: 14, padding: 12, borderWidth: 1 },
});
