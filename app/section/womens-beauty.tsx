import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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
const BEAUTY_ART = require("@/assets/images/womens-beauty-art.png");

const SKIN_TYPES = [
  { id: "normal",    label: "عادية",   emoji: "😊", color: "#10B981", tips: ["مرطب خفيف كافٍ","واقي شمس يومياً","تقشير مرة/أسبوع"] },
  { id: "dry",       label: "جافة",    emoji: "🌵", color: "#F59E0B", tips: ["مرطب غني مرتين/يوم","زيت جوز الهند ليلاً","تجنبي الاستحمام الساخن"] },
  { id: "oily",      label: "دهنية",   emoji: "💧", color: "#3B82F6", tips: ["غسيل مرتين/يوم","تونر لموازنة الزيوت","مرطب خالٍ من الزيوت"] },
  { id: "combo",     label: "مختلطة",  emoji: "🔄", color: "#8B5CF6", tips: ["منطقة T: عناية بالزيوت","الخدود: مرطب جيد","تونر متوازن"] },
  { id: "sensitive", label: "حساسة",  emoji: "🌸", color: "#EC4899", tips: ["منتجات بدون عطور","مكونات مهدئة (ألوفيرا)","اختبري المنتج على المعصم"] },
];

const MORNING_ROUTINE = [
  { step: 1, name: "غسول الوجه", emoji: "💧", time: "2 دقيقة" },
  { step: 2, name: "تونر",       emoji: "🌊", time: "1 دقيقة" },
  { step: 3, name: "سيروم",      emoji: "✨", time: "1 دقيقة" },
  { step: 4, name: "مرطب",       emoji: "🥛", time: "1 دقيقة" },
  { step: 5, name: "واقي شمس",   emoji: "☀️", time: "1 دقيقة" },
  { step: 6, name: "أساس خفيف",  emoji: "💄", time: "5 دقائق" },
];

const EVENING_ROUTINE = [
  { step: 1, name: "إزالة المكياج",  emoji: "🧴", time: "3 دقائق" },
  { step: 2, name: "غسول مزدوج",     emoji: "💧", time: "2 دقيقة" },
  { step: 3, name: "تقشير (3/أسبوع)",emoji: "🌀", time: "3 دقائق" },
  { step: 4, name: "ماء ورد",         emoji: "🌹", time: "30 ثانية" },
  { step: 5, name: "سيروم ريتينول",   emoji: "⭐", time: "1 دقيقة" },
  { step: 6, name: "كريم الليل",      emoji: "🌙", time: "1 دقيقة" },
];

const HAIR_ROUTINE = [
  { step: 1, name: "زيت قبل الغسيل", emoji: "🧴", time: "قبل ساعة" },
  { step: 2, name: "شامبو مناسب",    emoji: "🫧", time: "3 دقائق" },
  { step: 3, name: "بلسم/قناع",      emoji: "💆", time: "5-15 دقيقة" },
  { step: 4, name: "سيروم الشعر",    emoji: "✨", time: "1 دقيقة" },
  { step: 5, name: "حماية حرارية",   emoji: "🔥", time: "قبل التصفيف" },
  { step: 6, name: "مصل التغذية",    emoji: "💊", time: "يومياً" },
  { step: 7, name: "تقليم الأطراف",  emoji: "✂️", time: "كل 8 أسابيع" },
];

// Ingredient checker database
const SAFE_INGREDIENTS: Record<string, { safe: boolean; desc: string; color: string }> = {
  "retinol":        { safe: true,  desc: "مضاد للشيخوخة فعّال — تجنبيه أثناء الحمل", color: "#F59E0B" },
  "niacinamide":    { safe: true,  desc: "آمن تماماً، يوحّد لون البشرة ويضيق المسام", color: "#10B981" },
  "hyaluronic":     { safe: true,  desc: "ممتاز لترطيب البشرة", color: "#10B981" },
  "vitamin c":      { safe: true,  desc: "مضاد أكسدة ممتاز لإشراق البشرة", color: "#10B981" },
  "salicylic":      { safe: true,  desc: "فعّال للبشرة الدهنية — تجنبيه أثناء الحمل", color: "#F59E0B" },
  "benzoyl":        { safe: true,  desc: "مضاد للبكتيريا — تجنبيه أثناء الحمل", color: "#F59E0B" },
  "glycolic":       { safe: true,  desc: "تقشير لطيف — ابدئي بتركيز منخفض", color: "#10B981" },
  "hydroquinone":   { safe: false, desc: "يُنصح بتجنبه — مثبط قوي للميلانين بآثار جانبية", color: "#EF4444" },
  "parabens":       { safe: false, desc: "يُنصح بتجنبه — قد يؤثر على الهرمونات", color: "#EF4444" },
  "fragrance":      { safe: false, desc: "يُنصح بتجنبه للبشرة الحساسة", color: "#F59E0B" },
  "alcohol":        { safe: false, desc: "يجفف البشرة الحساسة", color: "#F59E0B" },
  "zinc":           { safe: true,  desc: "مضاد للالتهابات ومهدئ للبشرة", color: "#10B981" },
  "aloe":           { safe: true,  desc: "مهدئ ومرطب طبيعي ممتاز", color: "#10B981" },
  "ceramides":      { safe: true,  desc: "يعيد بناء حاجز البشرة", color: "#10B981" },
  "spf":            { safe: true,  desc: "ضروري يومياً لحماية البشرة", color: "#10B981" },
};

const SALONS = [
  { name: "صالون لمسة", rating: 4.9, reviews: 284, specialty: "بشرة + شعر", emoji: "💅" },
  { name: "صالون نضرة", rating: 4.8, reviews: 196, specialty: "عناية طبيعية", emoji: "🌿" },
  { name: "صالون نوف", rating: 4.7, reviews: 312, specialty: "تصفيف شعر", emoji: "💇" },
];

const DAYS_SHORT = ["أح","إث","ثل","أر","خم","جم","سب"];

export default function BeautyScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const { beautyLogs, updateBeautyLog } = useApp();

  const [skinType, setSkinType] = useState<string>("normal");
  const [checkedMorning, setCheckedMorning] = useState<boolean[]>(Array(MORNING_ROUTINE.length).fill(false));
  const [checkedEvening, setCheckedEvening] = useState<boolean[]>(Array(EVENING_ROUTINE.length).fill(false));
  const [checkedHair, setCheckedHair] = useState<boolean[]>(Array(HAIR_ROUTINE.length).fill(false));
  const [activeRoutine, setActiveRoutine] = useState<"morning"|"evening"|"hair">("morning");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientResult, setIngredientResult] = useState<{ safe: boolean; desc: string; color: string } | null>(null);
  const [weekDay] = useState(new Date().getDay());

  const morningPct = Math.round((checkedMorning.filter(Boolean).length / MORNING_ROUTINE.length) * 100);
  const eveningPct = Math.round((checkedEvening.filter(Boolean).length / EVENING_ROUTINE.length) * 100);
  const hairPct    = Math.round((checkedHair.filter(Boolean).length / HAIR_ROUTINE.length) * 100);

  const activeSkinType = SKIN_TYPES.find(s => s.id === skinType) ?? SKIN_TYPES[0];

  const checkIngredient = () => {
    const query = ingredientInput.toLowerCase().trim();
    const match = Object.entries(SAFE_INGREDIENTS).find(([key]) => query.includes(key) || key.includes(query));
    setIngredientResult(match ? match[1] : { safe: true, desc: "لم نجد معلومات عن هذا المكوّن في قاعدة بياناتنا — ابحثي عنه في INCI Decoder", color: "#6B7280" });
  };

  const toggleMorning = (i: number) => setCheckedMorning(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  const toggleEvening = (i: number) => setCheckedEvening(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  const toggleHair    = (i: number) => setCheckedHair(prev => { const n = [...prev]; n[i] = !n[i]; return n; });

  const routineData = activeRoutine === "morning" ? { steps: MORNING_ROUTINE, checked: checkedMorning, toggle: toggleMorning, pct: morningPct, color: "#F59E0B", emoji: "☀️" }
    : activeRoutine === "evening" ? { steps: EVENING_ROUTINE, checked: checkedEvening, toggle: toggleEvening, pct: eveningPct, color: "#7C3AED", emoji: "🌙" }
    : { steps: HAIR_ROUTINE, checked: checkedHair, toggle: toggleHair, pct: hairPct, color: "#EC4899", emoji: "💆" };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}>

      {/* AI Art Banner */}
      <View style={[styles.hero, { height: 220 + topPadding }]}>
        <Image source={BEAUTY_ART} style={styles.heroImg} resizeMode="cover" />
        <LinearGradient colors={["rgba(236,72,153,0.45)","rgba(249,168,212,0.85)"]}
          style={[styles.heroGrad, { paddingTop: topPadding }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="chevron-right" size={22} color="#fff" />
          </Pressable>
          <View style={{ gap: 4 }}>
            <Text style={styles.heroTitle}>✨ العناية بالبشرة والشعر</Text>
            <Text style={styles.heroSub}>روتين مخصص • فحص مكونات • نصائح خبراء</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Skin Type Selector */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>نوع بشرتك 🔍</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, flexDirection: "row-reverse" }}>
          {SKIN_TYPES.map(s => (
            <Pressable key={s.id} onPress={() => setSkinType(s.id)}
              style={[styles.skinChip, skinType===s.id ? { backgroundColor: s.color, borderColor: s.color } : { backgroundColor: s.color + "18", borderColor: s.color + "44" }]}>
              <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
              <Text style={[styles.chipTxt, { color: skinType===s.id ? "#fff" : s.color }]}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={[styles.skinTipsBox, { backgroundColor: activeSkinType.color + "12", borderColor: activeSkinType.color + "33" }]}>
          <Text style={[styles.subTxt, { color: activeSkinType.color, fontFamily: "Tajawal_700Bold" }]}>نصائح بشرة {activeSkinType.label}:</Text>
          {activeSkinType.tips.map((tip, i) => (
            <View key={i} style={{ flexDirection: "row-reverse", gap: 6, alignItems: "flex-start" }}>
              <Text style={{ color: activeSkinType.color, marginTop: 1 }}>•</Text>
              <Text style={[styles.subTxt, { color: colors.text, flex: 1 }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Today's Progress */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📊 تقدم اليوم</Text>
        <View style={{ gap: 10 }}>
          {[
            { label: "روتين الصباح ☀️", pct: morningPct, color: "#F59E0B" },
            { label: "روتين المساء 🌙", pct: eveningPct, color: "#7C3AED" },
            { label: "روتين الشعر 💆", pct: hairPct, color: "#EC4899" },
          ].map((r, i) => (
            <View key={i} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                <Text style={[styles.subTxt, { color: colors.text }]}>{r.label}</Text>
                <Text style={[styles.subTxt, { color: r.color }]}>{r.pct}%</Text>
              </View>
              <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.barFill, { width: `${r.pct}%`, backgroundColor: r.color }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Weekly Calendar */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📅 هذا الأسبوع</Text>
        <View style={styles.weekRow}>
          {DAYS_SHORT.map((d, i) => {
            const isToday = i === weekDay;
            const done = morningPct + eveningPct > 100;
            return (
              <View key={i} style={[styles.weekDay, isToday && { backgroundColor: "#EC4899" }]}>
                <Text style={[styles.weekDayTxt, isToday ? { color: "#fff" } : { color: colors.muted }]}>{d}</Text>
                {done && <View style={[styles.weekDot, { backgroundColor: isToday ? "#fff" : "#10B981" }]} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* Routine Steps */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.tabRow}>
          {([["morning","☀️ صباحي"],["evening","🌙 مسائي"],["hair","💆 شعر"]] as const).map(([t, lbl]) => (
            <Pressable key={t} onPress={() => setActiveRoutine(t)} style={[styles.tab, activeRoutine===t && { backgroundColor: routineData.color }]}>
              <Text style={[styles.tabTxt, activeRoutine===t ? { color: "#fff" } : { color: colors.muted }]}>{lbl}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>روتين {activeRoutine==="morning" ? "الصباح" : activeRoutine==="evening" ? "المساء" : "الشعر"}</Text>
          <Text style={[styles.subTxt, { color: routineData.color, fontFamily: "Tajawal_700Bold" }]}>{routineData.pct}%</Text>
        </View>
        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.barFill, { width: `${routineData.pct}%`, backgroundColor: routineData.color }]} />
        </View>
        <View style={{ gap: 8 }}>
          {routineData.steps.map((step, i) => (
            <Pressable key={i} onPress={() => routineData.toggle(i)}
              style={[styles.stepRow, { backgroundColor: routineData.checked[i] ? routineData.color + "12" : "transparent" }]}>
              <View style={[styles.stepCheck, { borderColor: routineData.color, backgroundColor: routineData.checked[i] ? routineData.color : "transparent" }]}>
                {routineData.checked[i] && <Feather name="check" size={12} color="#fff" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subTxt, { color: colors.text, textDecorationLine: routineData.checked[i] ? "line-through" : "none" }]}>
                  {step.emoji} {step.name}
                </Text>
                <Text style={[styles.subTxt, { color: colors.muted, fontSize: 10 }]}>{step.time}</Text>
              </View>
              <View style={[styles.stepNum, { backgroundColor: routineData.color + "20" }]}>
                <Text style={[styles.subTxt, { color: routineData.color, fontFamily: "Cairo_700Bold" }]}>{step.step}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Ingredient Checker — UNIQUE FEATURE */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>🔍 فاحصة مكونات المنتج</Text>
        <Text style={[styles.subTxt, { color: colors.muted }]}>ادخلي اسم المكوّن لمعرفة مدى أمانه لبشرتك</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.ingredientInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={ingredientInput}
            onChangeText={setIngredientInput}
            placeholder="مثال: retinol, niacinamide, parabens"
            placeholderTextColor={colors.muted}
            textAlign="right"
          />
          <Pressable onPress={checkIngredient} style={[styles.checkBtn, { backgroundColor: "#EC4899" }]}>
            <Text style={styles.checkBtnTxt}>فحص</Text>
          </Pressable>
        </View>
        {ingredientResult && (
          <View style={[styles.ingredientResult, { backgroundColor: ingredientResult.color + "15", borderColor: ingredientResult.color + "40" }]}>
            <Text style={{ fontSize: 28 }}>{ingredientResult.safe ? "✅" : "⚠️"}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subTxt, { color: ingredientResult.color, fontFamily: "Tajawal_700Bold" }]}>
                {ingredientResult.safe ? "مكوّن آمن" : "يُنصح بالحذر"}
              </Text>
              <Text style={[styles.subTxt, { color: colors.text }]}>{ingredientResult.desc}</Text>
            </View>
          </View>
        )}
        <View style={styles.chipRow}>
          {["retinol","niacinamide","hyaluronic","parabens","vitamin c","spf"].map(k => (
            <Pressable key={k} onPress={() => { setIngredientInput(k); }}
              style={[styles.chip, { backgroundColor: "#EC489918", borderColor: "#EC489933", borderWidth: 1 }]}>
              <Text style={[styles.chipTxt, { color: "#EC4899" }]}>{k}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Beauty Tips */}
      <View style={[styles.card, { backgroundColor: "#EC489912", borderColor: "#EC489933" }]}>
        <Text style={[styles.cardTitle, { color: "#EC4899" }]}>💡 نصائح جمال اليوم</Text>
        {[
          "اشربي 8 أكواب ماء يومياً لبشرة مشرقة",
          "ضعي واقي الشمس حتى في الأيام الغائمة",
          "النوم الكافي يجدد خلايا البشرة أثناء الليل",
          "مساج الوجه يحسن الدورة الدموية ويشد البشرة",
        ].map((tip, i) => (
          <View key={i} style={{ flexDirection: "row-reverse", gap: 8, alignItems: "flex-start" }}>
            <Text style={{ color: "#EC4899", marginTop: 1 }}>✨</Text>
            <Text style={[styles.subTxt, { color: colors.text, flex: 1 }]}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Beauty Stores */}
      <View style={{ paddingHorizontal: 20, paddingTop: 4, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>🛍️ متاجر تلبي احتياجات العناية والجمال</Text>
        {[
          { name: "متجر العناية الطبيعية", emoji: "🌿", specialty: "منتجات طبيعية وعضوية", rating: 4.9, reviews: 312 },
          { name: "متجر الجمال الفاخر", emoji: "✨", specialty: "عطور ومستحضرات فاخرة", rating: 4.8, reviews: 245 },
          { name: "متجر سكن كير", emoji: "💆", specialty: "منتجات العناية بالبشرة", rating: 4.7, reviews: 198 },
          { name: "متجر هير كير", emoji: "💇", specialty: "منتجات العناية بالشعر", rating: 4.8, reviews: 167 },
        ].map((s, i) => (
          <Pressable key={i} onPress={() => router.push("/(tabs)/store" as any)} style={[styles.salonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 28 }}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subTxt, { color: colors.text, fontFamily: "Tajawal_700Bold" }]}>{s.name}</Text>
              <Text style={[styles.subTxt, { color: colors.muted }]}>{s.specialty}</Text>
              <View style={{ flexDirection: "row-reverse", gap: 4, alignItems: "center" }}>
                <Text style={[styles.subTxt, { color: "#F59E0B" }]}>⭐ {s.rating}</Text>
                <Text style={[styles.subTxt, { color: colors.muted }]}>({s.reviews} تقييم)</Text>
              </View>
            </View>
            <View style={[styles.bookBtn, { backgroundColor: "#EC489920" }]}>
              <Text style={[styles.chipTxt, { color: "#EC4899" }]}>تصفحي</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Blog */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📖 مقالات الجمال</Text>
        {[
          { title: "روتين جمال السعودية الذي يناسب المناخ الحار", emoji: "🌞", tag: "روتين" },
          { title: "كيف تختارين سيروم الفيتامين C المناسب؟", emoji: "🍊", tag: "سيروم" },
          { title: "وصفات منزلية لتقوية الشعر بالمكونات الطبيعية", emoji: "🌿", tag: "شعر" },
        ].map((a, i) => (
          <Pressable key={i} style={[styles.blogCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.subTxt, { color: colors.text }]}>{a.title}</Text>
              <View style={[styles.chip, { backgroundColor: "#EC489918", alignSelf: "flex-end" }]}>
                <Text style={[styles.chipTxt, { color: "#EC4899" }]}>{a.tag}</Text>
              </View>
            </View>
            <Feather name="chevron-left" size={16} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      {/* Booking Banner */}
      <Pressable style={styles.bannerWrap} onPress={() => router.push("/section/beauty" as any)}>
        <LinearGradient colors={["#A86DBF","#EC4899"]} style={styles.bookBanner}>
          <Text style={[styles.bookBannerTxt, { flex: 1 }]}>خبراء ومراكز العناية والجمال في خدمتكم</Text>
          <View style={styles.bookBtn}><Text style={styles.bookBtnTxt}>احجزي</Text></View>
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { position: "relative" },
  heroImg: { width: "100%", height: "100%", position: "absolute" },
  heroGrad: { flex: 1, padding: 16, justifyContent: "space-between" },
  iconBtn: { width: 36, height: 36, backgroundColor: "rgba(0,0,0,0.22)", borderRadius: 10, alignItems: "center", justifyContent: "center", alignSelf: "flex-start" },
  heroTitle: { color: "#fff", fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroSub: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  card: { marginHorizontal: 20, marginTop: 16, borderRadius: 20, padding: 16, borderWidth: 1, gap: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  subTxt: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  barTrack: { height: 10, borderRadius: 6, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#EC4899", borderRadius: 6 },
  skinChip: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", gap: 4, borderWidth: 1 },
  skinTipsBox: { borderRadius: 14, padding: 12, gap: 8, borderWidth: 1 },
  chipRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  chipTxt: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  weekRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  weekDay: { flex: 1, alignItems: "center", borderRadius: 12, paddingVertical: 8, gap: 4 },
  weekDayTxt: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  weekDot: { width: 6, height: 6, borderRadius: 3 },
  tabRow: { flexDirection: "row-reverse", gap: 6 },
  tab: { flex: 1, borderRadius: 10, paddingVertical: 7, alignItems: "center" },
  tabTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  stepRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 10, padding: 8 },
  stepCheck: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  stepNum: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  inputRow: { flexDirection: "row-reverse", gap: 8 },
  ingredientInput: { flex: 1, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, fontFamily: "Tajawal_400Regular" },
  checkBtn: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, justifyContent: "center" },
  checkBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  ingredientResult: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 12, borderWidth: 1 },
  salonCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  blogCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  bannerWrap: { marginHorizontal: 20, marginTop: 20, borderRadius: 22, overflow: "hidden" },
  bookBanner: { padding: 20, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  bookBannerTxt: { color: "#fff", fontSize: 14, fontFamily: "Cairo_700Bold" },
  bookBtn: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnTxt: { color: "#EC4899", fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
