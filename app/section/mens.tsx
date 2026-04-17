import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
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

const LAB_TESTS = [
  { id: "testosterone", name: "التستوستيرون الكلي",    unit: "ng/dL", refMin: 300, refMax: 1000, category: "هرمونات" },
  { id: "lh",           name: "هرمون LH",              unit: "mIU/mL", refMin: 1.7, refMax: 8.6,  category: "هرمونات" },
  { id: "fsh",          name: "هرمون FSH",              unit: "mIU/mL", refMin: 1.5, refMax: 12.4, category: "هرمونات" },
  { id: "tsh",          name: "الغدة الدرقية TSH",      unit: "mIU/L",  refMin: 0.4, refMax: 4.0,  category: "هرمونات" },
  { id: "vitd",         name: "فيتامين D",              unit: "ng/mL",  refMin: 30,  refMax: 100,  category: "فيتامينات" },
  { id: "vitb12",       name: "فيتامين B12",            unit: "pg/mL",  refMin: 200, refMax: 900,  category: "فيتامينات" },
  { id: "glucose",      name: "سكر الدم الصيامي",       unit: "mg/dL",  refMin: 70,  refMax: 100,  category: "سكر" },
  { id: "hba1c",        name: "السكر التراكمي HbA1c",   unit: "%",      refMin: 4.0, refMax: 5.7,  category: "سكر" },
  { id: "chol",         name: "الكوليسترول الكلي",      unit: "mg/dL",  refMin: 0,   refMax: 200,  category: "دهون" },
  { id: "hdl",          name: "الكوليسترول الجيد HDL",  unit: "mg/dL",  refMin: 40,  refMax: 999,  category: "دهون" },
  { id: "ldl",          name: "الكوليسترول الضار LDL",  unit: "mg/dL",  refMin: 0,   refMax: 130,  category: "دهون" },
  { id: "hgb",          name: "الهيموغلوبين",           unit: "g/dL",   refMin: 13.5, refMax: 17.5, category: "دم" },
];

type LabResult = { testId: string; value: number; date: string };

const getStatus = (test: typeof LAB_TESTS[0], value: number) => {
  if (value < test.refMin) return { label: "منخفض", color: "#3B82F6" };
  if (value > test.refMax) return { label: "مرتفع",  color: "#EF4444" };
  return { label: "طبيعي", color: "#22C55E" };
};

const MENS_TOPICS = [
  { id: "testosterone", emoji: "💉", title: "التستوستيرون",      sub: "الهرمون الأساسي للرجل",     color: "#2563EB" },
  { id: "prostate",     emoji: "🫀", title: "صحة البروستاتا",    sub: "الوقاية والفحص المبكر",      color: "#F43F5E" },
  { id: "fertility",    emoji: "🔬", title: "الخصوبة والإنجاب",  sub: "صحة الحيوانات المنوية",       color: "#22C55E" },
  { id: "hair",         emoji: "💈", title: "سقوط الشعر",         sub: "العلاج والوقاية المبكرة",     color: "#F59E0B" },
  { id: "sexual",       emoji: "🧬", title: "الصحة الجنسية",     sub: "علاج ضعف الانتصاب والخ",     color: "#8B5CF6" },
  { id: "body",         emoji: "🏋️", title: "بناء الجسم",        sub: "كتلة عضلية وتقليل دهون",    color: "#10B981" },
];

const SUPPORT_GROUPS = [
  { id: "1", name: "مجموعة بناء العضلات",    members: 1204, emoji: "💪", color: "#F43F5E" },
  { id: "2", name: "صحة الرجل فوق ٣٠",       members: 876,  emoji: "👨‍⚕️", color: "#2563EB" },
  { id: "3", name: "تحسين مستوى التستوستيرون", members: 2310, emoji: "💉", color: "#8B5CF6" },
  { id: "4", name: "الخصوبة والإنجاب",        members: 543,  emoji: "🔬", color: "#22C55E" },
];

const MENS_TIPS = [
  { emoji: "🥩", title: "بروتين كافٍ يومياً",          sub: "1.6 – 2.2 جرام لكل كجم — ضروري للعضلات والهرمونات",    color: "#F59E0B" },
  { emoji: "😴", title: "نوم 7-9 ساعات متواصل",        sub: "النوم الجيد يرفع التستوستيرون ويسرّع الاسترداد",        color: "#3B82F6" },
  { emoji: "🏋️", title: "تمارين مقاومة 3-4 مرات/أسبوع", sub: "الرفع الحر والأحمال الثقيلة هي الأفضل للهرمونات",     color: "#F43F5E" },
  { emoji: "☀️", title: "فيتامين D يومياً",            sub: "يرتبط ارتباطاً مباشراً بمستوى التستوستيرون والخصوبة",  color: "#22C55E" },
  { emoji: "🧘", title: "إدارة التوتر والكورتيزول",    sub: "التوتر الزائد يخفض التستوستيرون ويضعف الخصوبة",        color: "#C490D8" },
  { emoji: "🩺", title: "فحص دوري سنوي شامل",          sub: "هرمونات • سكر • ضغط • وظائف كلى وكبد • PSA بعد ٤٠",   color: "#0EA5E9" },
  { emoji: "🧂", title: "قلل الملح والسكر والكحول",    sub: "كلها تسبب خللاً هرمونياً وتضر الخصوبة",                color: "#EF4444" },
  { emoji: "🥦", title: "خضروات إندول (بروكلي، قرنبيط)", sub: "تساعد في تنظيم الإستروجين الزائد عند الرجل",         color: "#16A34A" },
];

export default function MensHealthScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeTab, setActiveTab] = useState<"home" | "labs" | "tips">("home");
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(LAB_TESTS[0].id);
  const [inputValue, setInputValue] = useState("");
  const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]);
  const [testSearch, setTestSearch] = useState("");

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.025, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,     duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleAddResult = () => {
    const val = parseFloat(inputValue.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      Alert.alert("خطأ", "يرجى إدخال قيمة صحيحة");
      return;
    }
    const existing = labResults.findIndex(r => r.testId === selectedTestId);
    if (existing >= 0) {
      const updated = [...labResults];
      updated[existing] = { testId: selectedTestId, value: val, date: inputDate };
      setLabResults(updated);
    } else {
      setLabResults(prev => [...prev, { testId: selectedTestId, value: val, date: inputDate }]);
    }
    setShowAddModal(false);
    setInputValue("");
    Alert.alert("✅ تم الحفظ", "تمت إضافة نتيجة التحليل بنجاح");
  };

  const filteredTests = LAB_TESTS.filter(t =>
    t.name.includes(testSearch) || t.category.includes(testSearch)
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── Hero Header ── */}
      <View style={[styles.headerWrap, { paddingTop: topPadding }]}>
        <Image source={require("@/assets/images/mens-banner.png")} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
        <LinearGradient colors={["rgba(15,23,42,0.4)", "rgba(29,78,216,0.92)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill as any} />
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: topPadding + 8 }]}>
          <Feather name="chevron-right" size={24} color="#fff" />
        </Pressable>
        <Pressable onPress={() => router.push("/bookings" as any)} style={[styles.backBtn, { top: topPadding + 8, left: 16, right: "auto" }]}>
          <Feather name="calendar" size={20} color="#fff" />
        </Pressable>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>صحة الرجل 💪</Text>
          <Text style={styles.heroSub}>كل ما يخص جسمك وهرموناتك وحيويتك</Text>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View style={[styles.tabsBar, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {[
          { key: "home" as const, label: "الرئيسية", emoji: "🏠" },
          { key: "labs" as const, label: "تحاليلي",  emoji: "🔬" },
          { key: "tips" as const, label: "نصائح",    emoji: "💡" },
        ].map((t) => (
          <Pressable key={t.key} style={[styles.tabBtn, activeTab === t.key && { borderBottomColor: "#2563EB" }]} onPress={() => setActiveTab(t.key)}>
            <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
            <Text style={[styles.tabTxt, { color: activeTab === t.key ? "#2563EB" : colors.muted }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40, gap: 16, padding: 16 }}>

        {/* ════ TAB: HOME ════ */}
        {activeTab === "home" && (
          <>
            {/* AI Image Section Banner */}
            <View style={[styles.aiImageCard, { overflow: "hidden" }]}>
              <Image source={require("@/assets/images/mens-gym-hero.png")} style={styles.aiImageFull} resizeMode="cover" />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.aiImageGradient} />
              <View style={styles.aiImageText}>
                <Text style={styles.aiImageTitle}>ابنِ جسمك وصحتك</Text>
                <Text style={styles.aiImageSub}>رياضة • تغذية • هرمونات متوازنة</Text>
              </View>
            </View>

            {/* Animated Clinic Booking Banner */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Pressable onPress={() => router.push("/section/clinics" as any)}>
                <LinearGradient colors={["#1E3A8A", "#1D4ED8", "#2563EB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookingBanner}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.bannerBadge}>
                      <Text style={styles.bannerBadgeTxt}>🔥 احجز الآن</Text>
                    </View>
                    <Text style={styles.bannerTitle}>استشارة طبيب أندرولوجي</Text>
                    <Text style={styles.bannerSub}>متخصص في الهرمونات • الخصوبة • الصحة الجنسية</Text>
                    <View style={styles.bannerFooter}>
                      <Text style={styles.bannerPrice}>يبدأ من <Text style={{ fontSize: 18, fontFamily: "Tajawal_700Bold" }}>150 ر.س</Text></Text>
                      <View style={styles.bannerArrow}><Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>احجز ←</Text></View>
                    </View>
                  </View>
                  <Text style={{ fontSize: 52 }}>👨‍⚕️</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Topics Grid */}
            <View>
              <Text style={[styles.secTitle, { color: colors.text }]}>موضوعات صحة الرجل</Text>
              <View style={styles.topicsGrid}>
                {MENS_TOPICS.map((topic) => (
                  <Pressable key={topic.id} style={[styles.topicCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: topic.color + "25" }]}>
                    <View style={[styles.topicIconWrap, { backgroundColor: topic.color + "15" }]}>
                      <Text style={{ fontSize: 28 }}>{topic.emoji}</Text>
                    </View>
                    <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
                    <Text style={[styles.topicSub, { color: colors.muted }]}>{topic.sub}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Clinic AI Image Banner */}
            <Pressable onPress={() => router.push("/section/clinics" as any)} style={[styles.aiImageCard, { overflow: "hidden" }]}>
              <Image source={require("@/assets/images/mens-clinic-banner.png")} style={styles.aiImageFull} resizeMode="cover" />
              <LinearGradient colors={["transparent", "rgba(15,23,42,0.88)"]} style={styles.aiImageGradient} />
              <View style={styles.aiImageText}>
                <Text style={styles.aiImageTitle}>استشارة طبية سرية</Text>
                <Text style={styles.aiImageSub}>أطباء متخصصون بصحة الرجل • متاح الآن</Text>
                <View style={[styles.bannerArrow, { alignSelf: "flex-end", marginTop: 8 }]}>
                  <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>احجز ←</Text>
                </View>
              </View>
            </Pressable>

            {/* Lab Package Banner */}
            <Pressable onPress={() => router.push("/section/labs" as any)}>
              <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.labBanner}>
                <View style={[styles.labBannerIcon, { backgroundColor: "#3B82F620" }]}>
                  <Text style={{ fontSize: 36 }}>🔬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labBannerBadge}>باقة تحاليل مقترحة</Text>
                  <Text style={styles.labBannerTitle}>فحص شامل لصحة الرجل</Text>
                  <Text style={styles.labBannerSub}>تستوستيرون • هرمونات • فيتامينات • سكر • دهون • دم</Text>
                  <View style={[styles.bannerArrow, { marginTop: 10 }]}><Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>اطلب التحليل ←</Text></View>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Support Groups */}
            <View>
              <Text style={[styles.secTitle, { color: colors.text }]}>مجتمع الرجال 🤝</Text>
              {SUPPORT_GROUPS.map((g) => (
                <Pressable key={g.id} style={[styles.groupRow, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
                  <View style={[styles.groupIcon, { backgroundColor: g.color + "15" }]}>
                    <Text style={{ fontSize: 24 }}>{g.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.groupName, { color: colors.text }]}>{g.name}</Text>
                    <Text style={[styles.groupCount, { color: colors.muted }]}>{g.members.toLocaleString("ar")} عضو</Text>
                  </View>
                  <View style={[styles.joinBtn, { backgroundColor: g.color }]}>
                    <Text style={styles.joinBtnTxt}>انضم</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Promotional Info Card */}
            <LinearGradient colors={["#7C3AED15", "#2563EB10"]} style={[styles.promoCard, { borderColor: "#2563EB20" }]}>
              <Text style={[styles.promoTitle, { color: colors.text }]}>هل تعلم؟ 🧬</Text>
              <Text style={[styles.promoTxt, { color: colors.muted }]}>
                يبدأ انخفاض هرمون التستوستيرون بشكل طبيعي بعد سن الـ 30 بمعدل 1-2% سنوياً. الفحص الدوري وأسلوب الحياة الصحي يساعدان في الحفاظ على مستوياته المثلى.
              </Text>
              <Pressable onPress={() => setActiveTab("labs")} style={[styles.promoBtn, { backgroundColor: "#2563EB" }]}>
                <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 13 }}>سجّل نتائج تحاليلك الآن</Text>
              </Pressable>
            </LinearGradient>
          </>
        )}

        {/* ════ TAB: LABS ════ */}
        {activeTab === "labs" && (
          <>
            <LinearGradient colors={["#1E3A8A15", "#2563EB08"]} style={[styles.labsHeader, { borderColor: "#2563EB20" }]}>
              <Text style={{ fontSize: 32 }}>🔬</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.secTitle, { color: colors.text, marginBottom: 2 }]}>نتائج تحاليلي</Text>
                <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "right" }]}>
                  أدخل نتائجك وسنحددها على المرجع الطبي
                </Text>
              </View>
            </LinearGradient>

            {/* Add Result Button */}
            <Pressable style={[styles.addResultBtn, { backgroundColor: "#2563EB" }]} onPress={() => setShowAddModal(true)}>
              <Feather name="plus-circle" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 15 }}>إضافة نتيجة تحليل</Text>
            </Pressable>

            {/* Tests List with user results */}
            {labResults.length === 0 && (
              <View style={[styles.emptyLabs, { backgroundColor: isDark ? colors.card : "#F8FAFF", borderColor: "#2563EB20" }]}>
                <Text style={{ fontSize: 48 }}>📋</Text>
                <Text style={[{ color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 16 }]}>لا توجد نتائج بعد</Text>
                <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "center", lineHeight: 20 }]}>
                  ابدأ بإضافة نتائج تحاليلك الطبية لمتابعة مؤشراتك الصحية
                </Text>
              </View>
            )}

            {labResults.length > 0 && (
              <View style={{ gap: 10 }}>
                {labResults.map((result) => {
                  const test = LAB_TESTS.find(t => t.id === result.testId)!;
                  const status = getStatus(test, result.value);
                  const pct = Math.min(100, Math.max(0, ((result.value - test.refMin) / (test.refMax - test.refMin)) * 100));
                  return (
                    <View key={result.testId} style={[styles.resultCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, borderRightColor: status.color, borderRightWidth: 4 }]}>
                      <View style={styles.resultHeader}>
                        <View style={[styles.statusBadge, { backgroundColor: status.color + "15" }]}>
                          <Text style={[styles.statusTxt, { color: status.color }]}>{status.label}</Text>
                        </View>
                        <Text style={[styles.resultName, { color: colors.text }]}>{test.name}</Text>
                      </View>
                      <View style={styles.resultValueRow}>
                        <Text style={[styles.resultUnit, { color: colors.muted }]}>{test.unit}</Text>
                        <Text style={[styles.resultValue, { color: status.color }]}>{result.value}</Text>
                      </View>
                      <View style={[styles.refBar, { backgroundColor: colors.border }]}>
                        <View style={[styles.refFill, { width: `${pct}%` as any, backgroundColor: status.color }]} />
                      </View>
                      <View style={styles.refRange}>
                        <Text style={[styles.refTxt, { color: colors.muted }]}>المرجعي: {test.refMin} – {test.refMax} {test.unit}</Text>
                        <Text style={[styles.refDate, { color: colors.muted }]}>{result.date}</Text>
                      </View>
                      <Pressable onPress={() => {
                        setSelectedTestId(result.testId);
                        setInputValue(String(result.value));
                        setShowAddModal(true);
                      }} style={styles.editBtn}>
                        <Feather name="edit-2" size={13} color={colors.muted} />
                        <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 12 }]}>تعديل</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}

            {/* All Available Tests */}
            <View style={[styles.allTestsCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={[styles.secTitle, { color: colors.text }]}>📋 التحاليل المتاحة للإدخال</Text>
              {["هرمونات", "فيتامينات", "سكر", "دهون", "دم"].map((cat) => (
                <View key={cat}>
                  <Text style={[styles.catLabel, { color: "#2563EB", backgroundColor: "#2563EB10" }]}>{cat}</Text>
                  {LAB_TESTS.filter(t => t.category === cat).map((test) => {
                    const hasResult = labResults.some(r => r.testId === test.id);
                    return (
                      <Pressable key={test.id} style={[styles.testRow, { borderBottomColor: colors.border }]}
                        onPress={() => { setSelectedTestId(test.id); setInputValue(""); setShowAddModal(true); }}>
                        <Feather name={hasResult ? "check-circle" : "plus-circle"} size={16} color={hasResult ? "#22C55E" : "#2563EB"} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.testName, { color: colors.text }]}>{test.name}</Text>
                          <Text style={[styles.testRef, { color: colors.muted }]}>المرجعي: {test.refMin} – {test.refMax} {test.unit}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Book Lab Banner */}
            <Pressable onPress={() => router.push("/section/labs" as any)}>
              <LinearGradient colors={["#1D4ED8", "#2563EB"]} style={styles.bookingBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>🔬 طلب تحليل من مختبر</Text>
                  <Text style={styles.bannerSub}>سحب منزلي • نتائج سريعة • أسعار مناسبة</Text>
                  <View style={[styles.bannerArrow, { marginTop: 10 }]}>
                    <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>اطلب الآن ←</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 48 }}>🏥</Text>
              </LinearGradient>
            </Pressable>
          </>
        )}

        {/* ════ TAB: TIPS ════ */}
        {activeTab === "tips" && (
          <>
            {/* Hero Banner */}
            <LinearGradient colors={["#1E3A8A", "#2563EB"]} style={styles.tipHero}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipHeroTitle}>💡 نصائح خبراء صحة الرجل</Text>
                <Text style={styles.tipHeroSub}>محتوى مراجَع من أطباء أندرولوجيا ومختصين معتمدين</Text>
              </View>
              <Text style={{ fontSize: 52 }}>🏆</Text>
            </LinearGradient>

            {MENS_TIPS.map((tip, idx) => (
              <View key={idx} style={[styles.tipCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, borderRightColor: tip.color, borderRightWidth: 4 }]}>
                <View style={[styles.tipIcon, { backgroundColor: tip.color + "15" }]}>
                  <Text style={{ fontSize: 28 }}>{tip.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
                  <Text style={[styles.tipSub, { color: colors.muted }]}>{tip.sub}</Text>
                </View>
              </View>
            ))}

            {/* Consultation Banner */}
            <Pressable onPress={() => router.push("/section/clinics" as any)}>
              <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.consultBanner}>
                <View style={[styles.labBannerIcon, { backgroundColor: "#2563EB20" }]}>
                  <Text style={{ fontSize: 36 }}>🩺</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labBannerBadge}>متخصص بصحة الرجل</Text>
                  <Text style={[styles.labBannerTitle, { fontSize: 15 }]}>تحدث مع طبيب أندرولوجي</Text>
                  <Text style={styles.labBannerSub}>استشارة سرية • عن بُعد أو حضورية • معتمد</Text>
                  <View style={[styles.bannerArrow, { marginTop: 10 }]}>
                    <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>احجز موعداً ←</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* ── Add Result Modal ── */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>🔬 إضافة نتيجة تحليل</Text>

            {/* Search Tests */}
            <View style={[styles.searchRow, { backgroundColor: isDark ? colors.surfaceAlt : "#F1F5F9", borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.muted} />
              <TextInput
                placeholder="ابحث عن التحليل..."
                placeholderTextColor={colors.muted}
                value={testSearch}
                onChangeText={setTestSearch}
                style={{ flex: 1, color: colors.text, fontFamily: "Tajawal_400Regular", fontSize: 14, textAlign: "right" }}
              />
            </View>

            {/* Test Picker */}
            <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
              {filteredTests.map((t) => (
                <Pressable key={t.id} style={[styles.testPickRow, { backgroundColor: selectedTestId === t.id ? "#2563EB15" : "transparent", borderColor: selectedTestId === t.id ? "#2563EB40" : "transparent" }]}
                  onPress={() => setSelectedTestId(t.id)}>
                  <Feather name={selectedTestId === t.id ? "check-circle" : "circle"} size={16} color={selectedTestId === t.id ? "#2563EB" : colors.muted} />
                  <View>
                    <Text style={[{ color: selectedTestId === t.id ? "#2563EB" : colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13 }]}>{t.name}</Text>
                    <Text style={[{ color: colors.muted, fontSize: 11, fontFamily: "Tajawal_400Regular" }]}>المرجعي: {t.refMin} – {t.refMax} {t.unit}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Value Input */}
            <View style={{ marginTop: 12, gap: 8 }}>
              <Text style={[{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13, textAlign: "right" }]}>
                القيمة ({LAB_TESTS.find(t => t.id === selectedTestId)?.unit ?? ""})
              </Text>
              <TextInput
                placeholder="أدخل القيمة..."
                placeholderTextColor={colors.muted}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="decimal-pad"
                textAlign="right"
                style={[styles.valueInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F8FAFF", borderColor: colors.border, color: colors.text }]}
              />
              <Text style={[{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 13, textAlign: "right" }]}>تاريخ التحليل</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.muted}
                value={inputDate}
                onChangeText={setInputDate}
                textAlign="right"
                style={[styles.valueInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F8FAFF", borderColor: colors.border, color: colors.text }]}
              />
            </View>

            <View style={{ flexDirection: "row-reverse", gap: 10, marginTop: 16 }}>
              <Pressable style={[styles.modalSaveBtn, { flex: 2, backgroundColor: "#2563EB" }]} onPress={handleAddResult}>
                <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 15 }}>حفظ النتيجة</Text>
              </Pressable>
              <Pressable style={[styles.modalSaveBtn, { flex: 1, backgroundColor: colors.border }]} onPress={() => setShowAddModal(false)}>
                <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>إلغاء</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { height: 170, overflow: "hidden", position: "relative" },
  backBtn: { position: "absolute", right: 16, zIndex: 10, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  heroContent: { position: "absolute", bottom: 18, right: 20, left: 20 },
  heroTitle: { color: "#fff", fontSize: 26, fontFamily: "Cairo_700Bold", textAlign: "right" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  tabsBar: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tabBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 12, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  secTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 10 },
  bookingBanner: { borderRadius: 20, padding: 18, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  bannerBadge: { backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 8 },
  bannerBadgeTxt: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  bannerTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  bannerFooter: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  bannerPrice: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Tajawal_400Regular" },
  bannerArrow: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  topicsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  topicCard: { width: (width - 52) / 2, borderRadius: 18, padding: 14, gap: 8, borderWidth: 1.5, alignItems: "flex-end" },
  topicIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  topicTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  topicSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 16 },
  labBanner: { borderRadius: 20, padding: 18, flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  labBannerIcon: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  labBannerBadge: { color: "#60A5FA", fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  labBannerTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  labBannerSub: { color: "#94A3B8", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4, lineHeight: 18 },
  groupRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  groupIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  groupName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  groupCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  joinBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  joinBtnTxt: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  promoCard: { borderRadius: 20, padding: 18, borderWidth: 1, gap: 10 },
  promoTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  promoTxt: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22 },
  promoBtn: { borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  labsHeader: { borderRadius: 18, padding: 16, flexDirection: "row-reverse", gap: 12, alignItems: "center", borderWidth: 1 },
  addResultBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center", flexDirection: "row-reverse", justifyContent: "center", gap: 8 },
  emptyLabs: { borderRadius: 20, padding: 30, alignItems: "center", gap: 10, borderWidth: 1.5, borderStyle: "dashed" },
  resultCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  resultHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  resultName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1 },
  resultValueRow: { flexDirection: "row-reverse", alignItems: "baseline", gap: 6, marginBottom: 8 },
  resultValue: { fontSize: 28, fontFamily: "Tajawal_700Bold" },
  resultUnit: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  refBar: { height: 6, borderRadius: 3, marginBottom: 6 },
  refFill: { height: 6, borderRadius: 3 },
  refRange: { flexDirection: "row-reverse", justifyContent: "space-between" },
  refTxt: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  refDate: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  editBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, alignSelf: "flex-end", marginTop: 8 },
  allTestsCard: { borderRadius: 20, padding: 16, borderWidth: 1, gap: 4 },
  catLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-end", marginBottom: 6, marginTop: 10 },
  testRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  testName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  testRef: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  consultBanner: { borderRadius: 20, padding: 18, flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  tipHero: { borderRadius: 20, padding: 18, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  tipHeroTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  tipHeroSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  tipCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  tipIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tipTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tipSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, maxHeight: "90%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 14 },
  searchRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  testPickRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 4 },
  valueInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 18, fontFamily: "Tajawal_700Bold" },
  modalSaveBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  aiImageCard: { height: 180, borderRadius: 20, position: "relative" },
  aiImageFull: { width: "100%", height: "100%", borderRadius: 20 },
  aiImageGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  aiImageText: { position: "absolute", bottom: 16, right: 16, left: 16 },
  aiImageTitle: { color: "#fff", fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  aiImageSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 3 },
});
