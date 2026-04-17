import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const CYCLE_ART = require("@/assets/images/womens-cycle-art.png");

const monthNamesAr = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const dayNamesAr  = ["أح","إث","ثل","أر","خم","جم","سب"];
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/* ─── Phase metadata ───────────────────────────────────────────── */
type Phase = "period"|"fertile_low"|"fertile_high"|"ovulation"|"luteal"|"none";
const PM: Record<Phase, { label: string; color: string; bg: string; icon: string; desc: string }> = {
  period:       { label:"الطمث",          color:"#D4568A", bg:"#D4568A28", icon:"🌸", desc:"أيام الدورة الشهرية" },
  fertile_low:  { label:"خصوبة",          color:"#A86DBF", bg:"#A86DBF22", icon:"💜", desc:"بداية نافذة الخصوبة" },
  fertile_high: { label:"خصوبة عالية",    color:"#7C3AED", bg:"#7C3AED28", icon:"✨", desc:"خصوبة عالية جداً" },
  ovulation:    { label:"الإباضة",        color:"#F59E0B", bg:"#F59E0B28", icon:"🥚", desc:"يوم الإباضة" },
  luteal:       { label:"ما قبل الطمث",  color:"#6B7280", bg:"#6B728020", icon:"🌙", desc:"المرحلة الأصفرية" },
  none:         { label:"",               color:"#88888840", bg:"transparent", icon:"", desc:"" },
};

/* ─── Rich daily insight per phase (Flo-style) ─────────────────── */
const PHASE_INSIGHTS: Record<string, { energy:number; mood:number; libido:number; sleep:number; summary:string; tip:string; food:string[]; avoid:string[]; exercise:string; skincare:string }> = {
  period:   { energy:4,mood:5,libido:3,sleep:7, summary:"جسمك يتجدد الآن. قللي النشاط وأعطي نفسك وقتاً للراحة.", tip:"كمادة دافئة على البطن تُخفف التقلصات طبيعياً ✨", food:["حديد 🥩","فيتامين C 🍊","شاي البابونج 🍵","موز 🍌"], avoid:["كافيين ☕","ملح زائد 🧂","سكر 🍭","جبن معالج"], exercise:"يوغا خفيفة، تمدد، مشي 15 دقيقة", skincare:"بشرتك أكثر حساسية — استخدمي مرطباً مهدئاً" },
  fertile_low:{ energy:7,mood:8,libido:6,sleep:8, summary:"طاقتك ترتفع وتتحسن. الجسم يستعد للإباضة.", tip:"هذا وقت رائع للبدء بمشروع جديد أو التخطيط لأهدافك 💜", food:["أوميغا3 🐟","أفوكادو 🥑","بيض 🥚","خضار ورقية 🥬"], avoid:["وجبات ثقيلة","طعام مصنّع"], exercise:"هيت HIIT خفيف، رياضة جماعية", skincare:"بشرتك تتحسن — وقت مناسب للفيلر والتقشير" },
  fertile_high:{ energy:8,mood:8,libido:9,sleep:7, summary:"أنت في ذروة نافذة الخصوبة. استمتعي بطاقتك!", tip:"طاقتك في أعلى مستوياتها — استغليها في التواصل الاجتماعي 🌟", food:["زنك 🦪","فيتامين E 🌰","توت 🫐","بذور كتان"], avoid:["الكحول","مشروبات غازية"], exercise:"ركض، رياضة قوية، رفع أثقال", skincare:"بشرتك في أفضل حالاتها — المكياج يدوم أطول" },
  ovulation:  { energy:9,mood:9,libido:10,sleep:7, summary:"يوم الإباضة! هرمون LH في ذروته. أنت في أبهى حالاتك.", tip:"الدراسات تُثبت أن الصوت يصبح أكثر جمالاً يوم الإباضة! 🎵", food:["فيتامين D ☀️","سيلينيوم 🌰","فيتامين C 🍋","أحماض أمينية 🥩"], avoid:["التوتر الزائد","قلة النوم"], exercise:"تمارين قوية، سباحة، ركوب دراجة", skincare:"البشرة في ذروتها — التصوير في هذا اليوم! 📸" },
  luteal:     { energy:6,mood:5,libido:4,sleep:5, summary:"المرحلة الأصفرية. قد تشعرين بالانتفاخ وتقلبات المزاج.", tip:"المغنيسيوم يُقلل PMS بنسبة 40٪ — تناوليه يومياً 💊", food:["مغنيسيوم 🍫","كالسيوم 🥛","كربوهيدرات معقدة 🌾","فيتامين B6 🐔"], avoid:["كافيين ☕","ملح زائد 🧂","سكر مكرر 🍰"], exercise:"بيلاتس، سباحة، مشي متوسط", skincare:"قد تظهر بثور — استخدمي غسول الساليسيليك أسيد" },
};

/* ─── Symptoms list ─────────────────────────────────────────────── */
const SYMPTOMS_LIST = [
  {id:"cramps",   emoji:"😣",label:"تقلصات"},   {id:"headache",emoji:"🤕",label:"صداع"},
  {id:"bloating", emoji:"🫃",label:"انتفاخ"},   {id:"mood",    emoji:"😤",label:"تقلبات مزاج"},
  {id:"fatigue",  emoji:"😴",label:"إرهاق"},    {id:"acne",    emoji:"😔",label:"حبوب"},
  {id:"back",     emoji:"🏃",label:"ألم الظهر"}, {id:"tender",  emoji:"💕",label:"ألم الثدي"},
  {id:"nausea",   emoji:"🤢",label:"غثيان"},    {id:"insomnia",emoji:"🌙",label:"أرق"},
  {id:"appetite", emoji:"🍫",label:"شهية زائدة"},{id:"discharge",emoji:"💧",label:"إفرازات"},
];

/* ─── Date Picker Component ─────────────────────────────────────── */
function DatePicker({ value, onSelect, title }: { value: string; onSelect: (d: string) => void; title: string }) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [open, setOpen] = useState(false);

  const today = new Date();
  const initY = value ? parseInt(value.split("-")[0]) : today.getFullYear();
  const initM = value ? parseInt(value.split("-")[1]) - 1 : today.getMonth();
  const [pY, setPY] = useState(initY);
  const [pM, setPM] = useState(initM);

  const displayVal = value ? `${parseInt(value.split("-")[2])} ${monthNamesAr[parseInt(value.split("-")[1])-1]} ${value.split("-")[0]}` : "اختاري التاريخ";
  const totalDays  = daysInMonth(pY, pM);
  const firstDay   = firstDayOfMonth(pY, pM);
  const cells: (number|null)[] = [...Array(firstDay).fill(null), ...Array.from({length:totalDays},(_,i)=>i+1)];

  const modalBg = isDark ? colors.surface : "#FFFFFF";
  const chipBorder = isDark ? "#5A4570" : "#D8C8E8";

  return (
    <>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted, textAlign: "right" }}>{title}</Text>
        <Pressable onPress={() => setOpen(true)} style={[{
          borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
          borderColor: value ? "#A86DBF" : colors.border,
          backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5",
          flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between",
        }]}>
          <Text style={{ fontSize: 14, fontFamily: "Tajawal_500Medium", color: value ? colors.text : colors.muted }}>{displayVal}</Text>
          <Feather name="calendar" size={16} color="#A86DBF" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex:1, backgroundColor:"rgba(0,0,0,0.55)", justifyContent:"center", alignItems:"center" }} onPress={() => setOpen(false)}>
          <Pressable onPress={e => e.stopPropagation()}
            style={{ backgroundColor: modalBg, borderRadius: 24, padding: 20, width: "88%", maxWidth: 360, gap: 12 }}>
            <Text style={{ fontSize: 16, fontFamily: "Cairo_700Bold", color: colors.text, textAlign: "center" }}>{title}</Text>

            {/* Month navigation */}
            <View style={{ flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"center" }}>
              <Pressable onPress={() => { if(pM===0){setPM(11);setPY(y=>y-1);}else setPM(m=>m-1); }}>
                <Feather name="chevron-right" size={22} color={colors.text} />
              </Pressable>
              <Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: colors.text }}>{monthNamesAr[pM]} {pY}</Text>
              <Pressable onPress={() => { if(pM===11){setPM(0);setPY(y=>y+1);}else setPM(m=>m+1); }}>
                <Feather name="chevron-left" size={22} color={colors.text} />
              </Pressable>
            </View>

            {/* Day headers */}
            <View style={{ flexDirection:"row-reverse" }}>
              {dayNamesAr.map(d => (
                <Text key={d} style={{ flex:1, textAlign:"center", fontSize:11, fontFamily:"Tajawal_500Medium", color:colors.muted }}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={{ flexDirection:"row-reverse", flexWrap:"wrap" }}>
              {cells.map((cell, idx) => {
                if (!cell) return <View key={idx} style={{ width:"14.28%", aspectRatio:1 }} />;
                const ds = toDateStr(pY, pM, cell);
                const isSel = ds === value;
                const isFut = new Date(pY, pM, cell) > new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                return (
                  <Pressable key={idx} onPress={() => { if(!isFut){ onSelect(ds); setOpen(false); } }}
                    style={{ width:"14.28%", aspectRatio:1, alignItems:"center", justifyContent:"center",
                      backgroundColor: isSel ? "#A86DBF" : "transparent",
                      borderRadius: 10, opacity: isFut ? 0.35 : 1 }}>
                    <Text style={{ fontSize:13, fontFamily: isSel ? "Cairo_700Bold" : "Tajawal_400Regular",
                      color: isSel ? "#fff" : colors.text }}>{cell}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={() => setOpen(false)}
              style={{ backgroundColor:"#A86DBF", borderRadius:14, padding:12, alignItems:"center" }}>
              <Text style={{ color:"#fff", fontSize:13, fontFamily:"Tajawal_700Bold" }}>تأكيد</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* ─── Phase meter bar ───────────────────────────────────────────── */
function PhaseMeter({ label, value, color }: { label:string; value:number; color:string }) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  return (
    <View style={{ flex:1, gap:4, alignItems:"center" }}>
      <Text style={{ fontSize:10, fontFamily:"Tajawal_400Regular", color:colors.muted }}>{label}</Text>
      <View style={{ width:"100%", height:6, backgroundColor:colors.border, borderRadius:4, overflow:"hidden" }}>
        <View style={{ width:`${value*10}%`, height:"100%", backgroundColor:color, borderRadius:4 }} />
      </View>
      <Text style={{ fontSize:11, fontFamily:"Cairo_700Bold", color }}>{value}/10</Text>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Screen
═══════════════════════════════════════════════════════════════ */
export default function CycleScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const { cycleData, updateCycleData } = useApp();

  const today = new Date();
  const [calYear,    setCalYear]    = useState(today.getFullYear());
  const [calMonth,   setCalMonth]   = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [symptomsOpen,  setSymptomsOpen]  = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);
  const [activeTab, setActiveTab]  = useState<"food"|"exercise"|"skincare">("food");
  const [histRange, setHistRange]  = useState<"1mo"|"3mo"|"6mo"|"1yr">("1mo");

  /* Settings local state */
  const [settLastPeriod,    setSettLastPeriod]    = useState(cycleData.lastPeriodStart    ? cycleData.lastPeriodStart.split("T")[0]    : "");
  const [settCurrentPeriod, setSettCurrentPeriod] = useState(cycleData.currentPeriodStart ? cycleData.currentPeriodStart.split("T")[0] : "");
  const [settCycleLen,  setSettCycleLen]  = useState(cycleData.cycleLength);
  const [settPeriodLen, setSettPeriodLen] = useState(cycleData.periodLength);
  const [settBloodFlow, setSettBloodFlow] = useState<"light"|"medium"|"heavy">(cycleData.bloodFlow ?? "medium");

  const openSettings = () => {
    setSettLastPeriod(cycleData.lastPeriodStart    ? cycleData.lastPeriodStart.split("T")[0]    : "");
    setSettCurrentPeriod(cycleData.currentPeriodStart ? cycleData.currentPeriodStart.split("T")[0] : "");
    setSettCycleLen(cycleData.cycleLength);
    setSettPeriodLen(cycleData.periodLength);
    setSettBloodFlow(cycleData.bloodFlow ?? "medium");
    setSettingsOpen(true);
  };

  /* ─ Cycle computations ─ */
  const cycleStats = useMemo(() => {
    if (!cycleData.lastPeriodStart) return null;
    const start = new Date(cycleData.lastPeriodStart);
    const dayNum = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    if (dayNum < 1) return null;
    const ovulDay = cycleData.cycleLength - 14;
    const nextPeriod = new Date(start);
    nextPeriod.setDate(nextPeriod.getDate() + cycleData.cycleLength);
    const daysToNext = Math.ceil((nextPeriod.getTime() - today.getTime()) / 86400000);
    const ovulDate = new Date(start);
    ovulDate.setDate(ovulDate.getDate() + ovulDay);
    const daysToOvul = Math.ceil((ovulDate.getTime() - today.getTime()) / 86400000);
    const diff = Math.abs(dayNum - ovulDay);
    const fertMap: Record<number,number> = {0:33,1:31,2:27,3:16,4:7,5:3};
    const fertility = diff <= 5 ? (fertMap[diff] ?? 0) : 0;
    let phase: string = "luteal";
    if (dayNum <= cycleData.periodLength) phase = "period";
    else if (dayNum >= ovulDay - 5 && dayNum < ovulDay - 1) phase = "fertile_low";
    else if (dayNum === ovulDay - 1 || dayNum === ovulDay - 2) phase = "fertile_high";
    else if (dayNum === ovulDay) phase = "ovulation";
    const insight = PHASE_INSIGHTS[phase] ?? PHASE_INSIGHTS.luteal;
    return { dayNum, daysToNext: Math.max(0,daysToNext), daysToOvul: Math.max(0,daysToOvul), phase, fertility, ovulDay, nextPeriod, ovulDate, insight };
  }, [cycleData, today]);

  const pmsWarning = cycleStats ? cycleStats.daysToNext <= 5 && cycleStats.daysToNext > 0 : false;

  /* ─ Day phase for calendar ─ */
  const getDayPhase = useCallback((d: number): Phase => {
    if (!cycleData.lastPeriodStart) return "none";
    const start = new Date(cycleData.lastPeriodStart);
    const calDate = new Date(calYear, calMonth, d);
    const diff = Math.floor((calDate.getTime() - start.getTime()) / 86400000) + 1;
    const ovulDay = cycleData.cycleLength - 14;
    const raw = diff % cycleData.cycleLength;
    const inCycle = raw <= 0 ? raw + cycleData.cycleLength : raw;
    if (inCycle === 0 || diff < 1) return "none";
    if (inCycle <= cycleData.periodLength) return "period";
    if (inCycle === ovulDay) return "ovulation";
    if (inCycle >= ovulDay - 5 && inCycle <= ovulDay - 3) return "fertile_low";
    if (inCycle >= ovulDay - 2 && inCycle < ovulDay) return "fertile_high";
    if (inCycle > ovulDay) return "luteal";
    return "none";
  }, [cycleData, calYear, calMonth]);

  const getDaySymptoms = useCallback((d: number) => {
    return cycleData.symptoms.find(s => {
      const sd = new Date(s.date);
      return sd.getFullYear()===calYear && sd.getMonth()===calMonth && sd.getDate()===d;
    });
  }, [cycleData.symptoms, calYear, calMonth]);

  /* ─ Actions ─ */
  const openSymptomsForDay = () => {
    const ex = getDaySymptoms(selectedDay);
    setSelectedSymptoms(ex?.symptoms ?? []);
    setPainLevel(ex?.painLevel ?? 0);
    setSymptomsOpen(true);
  };

  const saveSymptoms = () => {
    if (!selectedSymptoms.length) { setSymptomsOpen(false); return; }
    const dateStr = new Date(calYear, calMonth, selectedDay).toISOString();
    const updated = [
      ...cycleData.symptoms.filter(s => { const sd=new Date(s.date); return !(sd.getFullYear()===calYear&&sd.getMonth()===calMonth&&sd.getDate()===selectedDay); }),
      { date: dateStr, symptoms: selectedSymptoms, painLevel }
    ];
    updateCycleData({ symptoms: updated });
    setSymptomsOpen(false); setSelectedSymptoms([]); setPainLevel(0);
  };

  const saveSettings = () => {
    if (!settLastPeriod) { Alert.alert("تنبيه", "اختاري تاريخ آخر دورة من التقويم"); return; }
    const partial: any = { cycleLength: settCycleLen, periodLength: settPeriodLen, bloodFlow: settBloodFlow };
    partial.lastPeriodStart = new Date(settLastPeriod).toISOString();
    if (settCurrentPeriod) partial.currentPeriodStart = new Date(settCurrentPeriod).toISOString();
    updateCycleData(partial);
    setSettingsOpen(false);
    // Navigate calendar to show result
    const d = new Date(settLastPeriod);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };

  const markPeriodStart = () => {
    const dateStr = new Date(calYear, calMonth, selectedDay).toISOString();
    updateCycleData({ lastPeriodStart: dateStr, currentPeriodStart: dateStr });
    Alert.alert("✅ تم", `${selectedDay} ${monthNamesAr[calMonth]} — بداية الدورة`);
  };

  /* ─ Calendar cells ─ */
  const totalDays = daysInMonth(calYear, calMonth);
  const firstDay  = firstDayOfMonth(calYear, calMonth);
  const calCells: (number|null)[] = [...Array(firstDay).fill(null), ...Array.from({length:totalDays},(_,i)=>i+1)];

  /* ─ Symptom history ─ */
  const sympHistory = useMemo(() => {
    const ranges = {"1mo":30,"3mo":90,"6mo":180,"1yr":365};
    const cutoff = new Date(today.getTime() - ranges[histRange]*86400000);
    const filtered = cycleData.symptoms.filter(s => new Date(s.date) >= cutoff);
    const counts: Record<string,number> = {};
    filtered.forEach(s => s.symptoms.forEach(sym => { counts[sym]=(counts[sym]??0)+1; }));
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  }, [cycleData.symptoms, histRange]);

  const selPhase      = getDayPhase(selectedDay);
  const selPhaseMeta  = PM[selPhase];
  const selDaySym     = getDaySymptoms(selectedDay);
  const modalBg       = isDark ? colors.surface : "#FFFFFF";
  const chipBorder    = isDark ? "#5A4570" : "#D8C8E8";
  const inputBg       = isDark ? colors.surfaceAlt : "#F8F0F5";

  const phaseInsight  = cycleStats?.insight ?? PHASE_INSIGHTS.luteal;
  const phaseMeta     = PM[(cycleStats?.phase as Phase) ?? "luteal"];

  /* ─ Ovulation countdown label ─ */
  const ovulLabel = cycleStats
    ? cycleStats.daysToOvul === 0 ? "يوم الإباضة! 🥚"
    : cycleStats.daysToOvul < 0  ? `انتهت قبل ${Math.abs(cycleStats.daysToOvul)} يوم`
    : `بعد ${cycleStats.daysToOvul} يوم`
    : "—";

  return (
    <ScrollView style={[S.container, {backgroundColor:colors.background}]}
      contentContainerStyle={{paddingBottom: isWeb ? 34 : insets.bottom+40}}
      showsVerticalScrollIndicator={false}>

      {/* ── Hero ── */}
      <View style={[S.hero, {height: cycleStats ? 260+topPadding : 220+topPadding}]}>
        <Image source={CYCLE_ART} style={S.heroImg} resizeMode="cover" />
        <LinearGradient colors={["rgba(212,86,138,0.35)","rgba(168,109,191,0.80)","rgba(100,40,140,0.96)"]}
          style={[S.heroGrad, {paddingTop: topPadding}]}>
          <View style={S.heroRow}>
            <Pressable onPress={() => router.back()} style={S.iconBtn}>
              <Feather name="chevron-right" size={22} color="#fff" />
            </Pressable>
            <Pressable onPress={openSettings} style={S.iconBtn}>
              <Feather name="settings" size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={{gap:8}}>
            <View style={{gap:2}}>
              <Text style={S.heroTitle}>🌸 الدورة الشهرية</Text>
              <Text style={S.heroSub}>تقويم ذكي • خصوبة • توصيات يومية</Text>
            </View>

            {/* Inline stats inside hero when data exists */}
            {cycleStats && (
              <View style={S.heroStats}>
                <View style={S.heroStatChip}>
                  <Text style={S.heroStatNum}>{cycleStats.dayNum}</Text>
                  <Text style={S.heroStatLbl}>اليوم</Text>
                </View>
                <View style={S.heroStatSep}/>
                <View style={S.heroStatChip}>
                  <Text style={S.heroStatNum}>{cycleStats.daysToNext}</Text>
                  <Text style={S.heroStatLbl}>للدورة القادمة</Text>
                </View>
                <View style={S.heroStatSep}/>
                <View style={S.heroStatChip}>
                  <Text style={[S.heroStatNum, {color: phaseMeta.color==="transparent"?"#fff":phaseMeta.color}]}>
                    {phaseMeta.icon||"🌸"}
                  </Text>
                  <Text style={S.heroStatLbl}>{phaseMeta.label||"دورة"}</Text>
                </View>
                {cycleStats.daysToOvul > 0 && (
                  <>
                    <View style={S.heroStatSep}/>
                    <View style={S.heroStatChip}>
                      <Text style={S.heroStatNum}>{cycleStats.daysToOvul}</Text>
                      <Text style={S.heroStatLbl}>للإباضة</Text>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* ── PMS Alert ── */}
      {pmsWarning && (
        <View style={S.pmsAlert}>
          <Text style={{fontSize:20}}>⚠️</Text>
          <Text style={[S.pmsAlertTxt, {color:"#F59E0B"}]}>
            منبّه PMS: دورتك القادمة بعد {cycleStats!.daysToNext} {cycleStats!.daysToNext===1?"يوم":"أيام"} — المغنيسيوم وتقليل الكافيين
          </Text>
        </View>
      )}

      {/* ── No data CTA (whole card tappable, no duplicate button) ── */}
      {!cycleData.lastPeriodStart && (
        <Pressable onPress={openSettings}
          style={[S.card, {backgroundColor:"#A86DBF12", borderColor:"#A86DBF44", alignItems:"center", gap:10}]}>
          <Text style={{fontSize:40}}>📅</Text>
          <Text style={[S.cardTitle, {color:"#A86DBF"}]}>سجّلي أول دورة شهرية</Text>
          <Text style={[S.sub, {color:colors.muted, textAlign:"center"}]}>
            اضغطي هنا أو على ⚙️ بالأعلى لإعداد دورتك
          </Text>
        </Pressable>
      )}

      {/* ── Stats Row (only when data exists) ── */}
      {cycleStats && (
        <>
          <View style={[S.phaseBadge, {backgroundColor:phaseMeta.bg, borderColor:phaseMeta.color+"60"}]}>
            <Text style={[S.phaseLabel, {color:phaseMeta.color}]}>
              {phaseMeta.icon} {phaseMeta.label} — اليوم {cycleStats.dayNum} من دورتك
            </Text>
          </View>

          <View style={S.statsRow}>
            {[
              {val:cycleStats.dayNum,    label:"اليوم الحالي",    color:"#D4568A", emoji:"📅"},
              {val:cycleStats.daysToNext,label:"للدورة القادمة",  color:"#E8849E", emoji:"🔴"},
              {val:cycleStats.daysToOvul,label:"للإباضة",         color:"#A86DBF", emoji:"🥚"},
            ].map((s,i) => (
              <View key={i} style={[S.statCard, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
                <Text style={{fontSize:18}}>{s.emoji}</Text>
                <Text style={[S.statVal, {color:s.color}]}>{s.val}</Text>
                <Text style={[S.sub, {color:colors.muted, textAlign:"center"}]}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Daily Insight Card (Flo-style) ── */}
          <View style={[S.card, {backgroundColor: isDark?colors.surface:"#fff", borderColor:phaseMeta.color+"44"}]}>
            <View style={{flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"flex-start"}}>
              <View style={{flex:1, gap:4}}>
                <Text style={[S.cardTitle, {color:colors.text}]}>✨ يومك الهرموني اليوم</Text>
                <Text style={[S.sub, {color:colors.muted, lineHeight:18}]}>{phaseInsight.summary}</Text>
              </View>
              <View style={[S.insightBadge, {backgroundColor:phaseMeta.color+"20"}]}>
                <Text style={{fontSize:22}}>{phaseMeta.icon}</Text>
              </View>
            </View>

            {/* Meter bars */}
            <View style={{flexDirection:"row-reverse", gap:10}}>
              <PhaseMeter label="طاقة ⚡"   value={phaseInsight.energy}  color="#A86DBF" />
              <PhaseMeter label="مزاج 😊"   value={phaseInsight.mood}    color="#EC4899" />
              <PhaseMeter label="نوم 🌙"    value={phaseInsight.sleep}   color="#6366F1" />
              <PhaseMeter label="رغبة 💜"   value={phaseInsight.libido}  color="#F59E0B" />
            </View>

            {/* Tip of the day */}
            <View style={[S.tipBox, {backgroundColor:phaseMeta.bg, borderColor:phaseMeta.color+"40"}]}>
              <Text style={{fontSize:16}}>💡</Text>
              <Text style={[S.sub, {color:phaseMeta.color, flex:1, textAlign:"right", lineHeight:18}]}>
                {phaseInsight.tip}
              </Text>
            </View>
          </View>

          {/* ── Fertility Score ── */}
          <View style={[S.card, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
            <View style={{flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"center"}}>
              <Text style={[S.cardTitle, {color:colors.text}]}>🧬 نسبة الخصوبة</Text>
              <Text style={[S.fertilityPct, {color: cycleStats.fertility>15?"#A86DBF":colors.muted}]}>
                {cycleStats.fertility}%
              </Text>
            </View>
            <View style={[S.barTrack, {backgroundColor:colors.border}]}>
              <View style={[S.barFill, {width:`${Math.min(cycleStats.fertility*3.3,100)}%`,
                backgroundColor: cycleStats.fertility>20?"#A86DBF":"#E8849E"}]} />
            </View>
            <View style={{flexDirection:"row-reverse", justifyContent:"space-between"}}>
              <Text style={[S.sub, {color:colors.muted}]}>
                {cycleStats.fertility===0 ? "احتمالية منخفضة جداً" :
                 cycleStats.fertility<15  ? "خصوبة منخفضة نسبياً" :
                 cycleStats.fertility<30  ? "خصوبة متوسطة" : "🌟 خصوبة عالية جداً!"}
              </Text>
              <Text style={[S.sub, {color:"#A86DBF"}]}>إباضة: {ovulLabel}</Text>
            </View>
          </View>
        </>
      )}

      {/* ── Interactive Calendar ── */}
      <View style={[S.card, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
        {/* Month nav */}
        <View style={S.calHeader}>
          <Pressable onPress={() => {if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}}>
            <Feather name="chevron-right" size={22} color={colors.text} />
          </Pressable>
          <Text style={[S.calMonthTxt, {color:colors.text}]}>{monthNamesAr[calMonth]} {calYear}</Text>
          <Pressable onPress={() => {if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}}>
            <Feather name="chevron-left" size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* Day names */}
        <View style={{flexDirection:"row-reverse"}}>
          {dayNamesAr.map(d => <Text key={d} style={[S.dayName, {color:colors.muted}]}>{d}</Text>)}
        </View>

        {/* Grid */}
        <View style={{flexDirection:"row-reverse", flexWrap:"wrap"}}>
          {calCells.map((cell,idx) => {
            if (!cell) return <View key={idx} style={S.calCell} />;
            const ph    = getDayPhase(cell);
            const meta  = PM[ph];
            const isToday = cell===today.getDate() && calMonth===today.getMonth() && calYear===today.getFullYear();
            const isSel   = cell === selectedDay;
            const hasSym  = !!getDaySymptoms(cell);
            return (
              <Pressable key={idx} onPress={() => setSelectedDay(cell)}
                style={[S.calCell,
                  {backgroundColor: meta.bg},
                  isSel && {borderWidth:2, borderColor:"#A86DBF", borderRadius:10}]}>
                {isToday && <View style={S.todayRing} />}
                <Text style={[S.calDay, {
                  color: ph==="none" ? colors.text : meta.color,
                  fontFamily: isToday ? "Cairo_700Bold" : "Tajawal_400Regular",
                }]}>{cell}</Text>
                {hasSym && <View style={[S.sympDot, {backgroundColor:meta.color}]} />}
              </Pressable>
            );
          })}
        </View>

        {/* Legend */}
        <View style={S.legend}>
          {(["period","ovulation","fertile_high","luteal"] as Phase[]).map(p => (
            <View key={p} style={S.legendItem}>
              <View style={[S.legendDot, {backgroundColor:PM[p].color}]} />
              <Text style={[S.sub, {color:colors.muted, fontSize:10}]}>{PM[p].label}</Text>
            </View>
          ))}
        </View>

        {/* Day detail panel */}
        <View style={[S.dayDetail, {
          backgroundColor: selPhase!=="none" ? selPhaseMeta.bg : inputBg,
          borderColor:     selPhase!=="none" ? selPhaseMeta.color+"44" : colors.border,
        }]}>
          <View style={{flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={[S.cardTitle, {color:colors.text, fontSize:14}]}>
              📆 {selectedDay} {monthNamesAr[calMonth]} {calYear}
            </Text>
            {selPhase!=="none" && (
              <View style={[S.phasePill, {backgroundColor:selPhaseMeta.color}]}>
                <Text style={S.phasePillTxt}>{selPhaseMeta.label}</Text>
              </View>
            )}
          </View>

          {selPhase!=="none" && (
            <Text style={[S.sub, {color:selPhaseMeta.color}]}>{selPhaseMeta.desc}</Text>
          )}

          {selDaySym?.symptoms.length ? (
            <View style={{gap:6}}>
              <Text style={[S.sub, {color:colors.text, fontFamily:"Tajawal_700Bold"}]}>أعراض مسجّلة:</Text>
              <View style={S.chipRow}>
                {selDaySym.symptoms.map(sid => {
                  const sym = SYMPTOMS_LIST.find(s=>s.id===sid);
                  return sym ? (
                    <View key={sid} style={[S.chip, {backgroundColor:"#D4568A18"}]}>
                      <Text style={[S.chipTxt, {color:"#D4568A"}]}>{sym.emoji} {sym.label}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          ) : (
            <Text style={[S.sub, {color:colors.muted}]}>لا توجد أعراض لهذا اليوم</Text>
          )}

          <View style={S.calBtns}>
            <Pressable onPress={markPeriodStart} style={[S.calBtn, {backgroundColor:"#D4568A18", borderColor:"#D4568A44"}]}>
              <Text style={[S.calBtnTxt, {color:"#D4568A"}]}>📅 بداية الدورة</Text>
            </Pressable>
            <Pressable onPress={openSymptomsForDay} style={[S.calBtn, {backgroundColor:"#A86DBF18", borderColor:"#A86DBF44"}]}>
              <Text style={[S.calBtnTxt, {color:"#A86DBF"}]}>📝 سجّلي أعراضك</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Phase Recommendations (Flo-style tabs) ── */}
      {cycleStats && (
        <View style={[S.card, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
          <Text style={[S.cardTitle, {color:colors.text}]}>🎯 توصيات مرحلة {phaseMeta.label}</Text>
          <View style={S.tabRow}>
            {([["food","🥗 تغذية"],["exercise","💪 رياضة"],["skincare","✨ بشرة"]] as const).map(([t,lbl]) => (
              <Pressable key={t} onPress={() => setActiveTab(t)}
                style={[S.tab, activeTab===t && {backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt, activeTab===t?{color:"#fff"}:{color:colors.muted}]}>{lbl}</Text>
              </Pressable>
            ))}
          </View>

          {activeTab==="food" && (
            <View style={{gap:10}}>
              <Text style={[S.sub, {color:"#10B981", fontFamily:"Tajawal_700Bold"}]}>✅ تناولي:</Text>
              <View style={S.chipRow}>{phaseInsight.food.map((f,i) => <View key={i} style={[S.chip,{backgroundColor:"#10B98118"}]}><Text style={[S.chipTxt,{color:"#10B981"}]}>{f}</Text></View>)}</View>
              <Text style={[S.sub, {color:"#EF4444", fontFamily:"Tajawal_700Bold"}]}>🚫 تجنبي:</Text>
              <View style={S.chipRow}>{phaseInsight.avoid.map((f,i) => <View key={i} style={[S.chip,{backgroundColor:"#EF444418"}]}><Text style={[S.chipTxt,{color:"#EF4444"}]}>{f}</Text></View>)}</View>
            </View>
          )}
          {activeTab==="exercise" && (
            <View style={[S.tipBox, {backgroundColor:"#A86DBF12", borderColor:"#A86DBF33"}]}>
              <Text style={{fontSize:20}}>💪</Text>
              <Text style={[S.sub, {color:colors.text, flex:1, textAlign:"right", lineHeight:20}]}>
                {phaseInsight.exercise}
              </Text>
            </View>
          )}
          {activeTab==="skincare" && (
            <View style={[S.tipBox, {backgroundColor:"#EC489912", borderColor:"#EC489933"}]}>
              <Text style={{fontSize:20}}>✨</Text>
              <Text style={[S.sub, {color:colors.text, flex:1, textAlign:"right", lineHeight:20}]}>
                {phaseInsight.skincare}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ── Symptom History ── */}
      <View style={[S.card, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
        <Text style={[S.cardTitle, {color:colors.text}]}>📊 إحصاءات الأعراض</Text>
        <View style={S.tabRow}>
          {([["1mo","شهر"],["3mo","3 أشهر"],["6mo","6 أشهر"],["1yr","سنة"]] as const).map(([r,lbl]) => (
            <Pressable key={r} onPress={() => setHistRange(r)} style={[S.tab, histRange===r && {backgroundColor:"#A86DBF"}]}>
              <Text style={[S.tabTxt, histRange===r?{color:"#fff"}:{color:colors.muted}]}>{lbl}</Text>
            </Pressable>
          ))}
        </View>
        {sympHistory.length > 0 ? (
          <View style={{gap:10}}>
            {sympHistory.map(([symId,count]) => {
              const sym = SYMPTOMS_LIST.find(s=>s.id===symId);
              const pct = (count/sympHistory[0][1])*100;
              return (
                <View key={symId} style={{flexDirection:"row-reverse", alignItems:"center", gap:8}}>
                  <Text style={[S.sub, {color:colors.muted, width:100, textAlign:"right"}]}>{sym?.emoji} {sym?.label ?? symId}</Text>
                  <View style={[S.barTrack, {flex:1, backgroundColor:colors.border}]}>
                    <View style={[S.barFill, {width:`${pct}%`}]} />
                  </View>
                  <Text style={[S.sub, {color:"#A86DBF", width:24, fontFamily:"Cairo_700Bold", textAlign:"center"}]}>{count}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[S.sub, {color:colors.muted, textAlign:"center", paddingVertical:12}]}>لا توجد أعراض في هذه الفترة</Text>
        )}
      </View>

      {/* ── Articles ── */}
      <View style={{paddingHorizontal:20, paddingTop:8, gap:10}}>
        <Text style={[S.cardTitle, {color:colors.text}]}>📖 مقالات مفيدة</Text>
        {[
          {title:"5 طرق طبيعية لتخفيف آلام الدورة", emoji:"🌿", tag:"طبيعي"},
          {title:"هل الدورة غير المنتظمة تؤثر على الخصوبة؟", emoji:"🧬", tag:"خصوبة"},
          {title:"تأثير التوتر على دورتك الشهرية", emoji:"🧠", tag:"صحة نفسية"},
        ].map((a,i) => (
          <Pressable key={i} style={[S.blogCard, {backgroundColor: isDark?colors.surface:"#fff", borderColor:colors.border}]}>
            <Text style={{fontSize:22}}>{a.emoji}</Text>
            <View style={{flex:1, gap:4}}>
              <Text style={[S.sub, {color:colors.text, textAlign:"right"}]}>{a.title}</Text>
              <View style={[S.chip, {backgroundColor:"#A86DBF18", alignSelf:"flex-end"}]}>
                <Text style={[S.chipTxt, {color:"#A86DBF"}]}>{a.tag}</Text>
              </View>
            </View>
            <Feather name="chevron-left" size={16} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      {/* ── Store banner ── */}
      <Pressable style={S.bannerWrap} onPress={() => router.push("/(tabs)/store" as any)}>
        <LinearGradient colors={["#F59E0B","#EC4899"]} style={S.bookBanner}>
          <Text style={S.bookBannerTxt}>🛍️ منتجات العناية والصحة النسائية</Text>
          <View style={S.bookBtn}><Text style={S.bookBtnTxt}>تسوقي الآن</Text></View>
        </LinearGradient>
      </Pressable>

      <Pressable style={S.bannerWrap} onPress={() => router.push("/section/clinics" as any)}>
        <LinearGradient colors={["#D4568A","#A86DBF"]} style={S.bookBanner}>
          <Text style={S.bookBannerTxt}>💜 احصلي على رعاية صحية تهتم بكم</Text>
          <View style={S.bookBtn}><Text style={S.bookBtnTxt}>احجزي الآن</Text></View>
        </LinearGradient>
      </Pressable>

      {/* ══════════════════════════════════════════════════
          Settings Modal — with DatePicker components
      ══════════════════════════════════════════════════ */}
      <Modal visible={settingsOpen} transparent animationType="slide" onRequestClose={() => setSettingsOpen(false)}>
        <View style={S.overlay}>
          <ScrollView style={[S.modalSheet, {backgroundColor:modalBg}]}
            contentContainerStyle={{padding:24, gap:18, paddingBottom:40}}
            showsVerticalScrollIndicator={false}>
            <Text style={[S.cardTitle, {color:colors.text, fontSize:17}]}>⚙️ إعدادات الدورة الشهرية</Text>

            {/* DatePicker for last period */}
            <DatePicker
              title="📅 تاريخ آخر دورة شهرية"
              value={settLastPeriod}
              onSelect={setSettLastPeriod}
            />

            {/* DatePicker for current period (optional) */}
            <DatePicker
              title="📅 بداية الدورة الحالية (اختياري)"
              value={settCurrentPeriod}
              onSelect={setSettCurrentPeriod}
            />

            {/* Cycle & period length */}
            <View style={{flexDirection:"row-reverse", gap:12}}>
              <View style={{flex:1, gap:8}}>
                <Text style={[S.sub, {color:colors.muted, fontFamily:"Tajawal_700Bold"}]}>🔄 طول الدورة (يوم)</Text>
                <View style={{flexDirection:"row-reverse", flexWrap:"wrap", gap:6}}>
                  {[21,24,28,30,35,40].map(n => (
                    <Pressable key={n} onPress={() => setSettCycleLen(n)}
                      style={[S.numChip, {backgroundColor: settCycleLen===n?"#A86DBF":inputBg, borderColor: settCycleLen===n?"#A86DBF":chipBorder}]}>
                      <Text style={[S.chipTxt, {color: settCycleLen===n?"#fff":colors.text}]}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[S.sub, {color:"#A86DBF"}]}>مختار: {settCycleLen} يوم</Text>
              </View>
              <View style={{flex:1, gap:8}}>
                <Text style={[S.sub, {color:colors.muted, fontFamily:"Tajawal_700Bold"}]}>🩸 مدة الطمث (يوم)</Text>
                <View style={{flexDirection:"row-reverse", flexWrap:"wrap", gap:6}}>
                  {[2,3,4,5,6,7,8].map(n => (
                    <Pressable key={n} onPress={() => setSettPeriodLen(n)}
                      style={[S.numChip, {backgroundColor: settPeriodLen===n?"#D4568A":inputBg, borderColor: settPeriodLen===n?"#D4568A":chipBorder}]}>
                      <Text style={[S.chipTxt, {color: settPeriodLen===n?"#fff":colors.text}]}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[S.sub, {color:"#D4568A"}]}>مختار: {settPeriodLen} أيام</Text>
              </View>
            </View>

            {/* Blood flow */}
            <View style={{gap:8}}>
              <Text style={[S.sub, {color:colors.muted, fontFamily:"Tajawal_700Bold"}]}>💧 كمية الدم</Text>
              <View style={{flexDirection:"row-reverse", gap:8}}>
                {([["light","خفيفة 💧"],["medium","متوسطة 🩸"],["heavy","غزيرة 🔴"]] as const).map(([val,lbl]) => (
                  <Pressable key={val} onPress={() => setSettBloodFlow(val)}
                    style={[S.flowChip, {backgroundColor: settBloodFlow===val?"#D4568A":inputBg, borderColor: settBloodFlow===val?"#D4568A":chipBorder}]}>
                    <Text style={[S.chipTxt, {color: settBloodFlow===val?"#fff":colors.text}]}>{lbl}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Ovulation preview */}
            {settLastPeriod ? (
              <View style={[S.infoBox, {backgroundColor:"#A86DBF12", borderColor:"#A86DBF33"}]}>
                <Text style={[S.sub, {color:"#A86DBF", fontFamily:"Tajawal_700Bold"}]}>🥚 الإباضة المتوقعة</Text>
                <Text style={[S.sub, {color:colors.muted}]}>
                  يوم {settCycleLen - 14} من الدورة
                  {" ← "}
                  {new Date(new Date(settLastPeriod).getTime() + (settCycleLen-14)*86400000).toLocaleDateString("ar-SA")}
                </Text>
                <Text style={[S.sub, {color:colors.muted}]}>
                  الدورة القادمة: {new Date(new Date(settLastPeriod).getTime() + settCycleLen*86400000).toLocaleDateString("ar-SA")}
                </Text>
              </View>
            ) : null}

            <View style={S.modalBtns}>
              <Pressable onPress={() => setSettingsOpen(false)} style={[S.modalBtn, {backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt, {color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveSettings} style={[S.modalBtn, {backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt, {color:"#fff"}]}>💾 حفظ وعرض التقويم</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════
          Symptoms Modal
      ══════════════════════════════════════════════════ */}
      <Modal visible={symptomsOpen} transparent animationType="slide" onRequestClose={() => setSymptomsOpen(false)}>
        <View style={S.overlay}>
          <ScrollView style={[S.modalSheet, {backgroundColor:modalBg}]}
            contentContainerStyle={{padding:24, gap:14, paddingBottom:40}}
            showsVerticalScrollIndicator={false}>
            <Text style={[S.cardTitle, {color:colors.text}]}>📝 أعراض {selectedDay} {monthNamesAr[calMonth]}</Text>
            <View style={S.sympGrid}>
              {SYMPTOMS_LIST.map(s => (
                <Pressable key={s.id} onPress={() => setSelectedSymptoms(prev => prev.includes(s.id)?prev.filter(x=>x!==s.id):[...prev,s.id])}
                  style={[S.sympChip, {borderColor: selectedSymptoms.includes(s.id)?"#A86DBF":chipBorder}, selectedSymptoms.includes(s.id) && {backgroundColor:"#A86DBF"}]}>
                  <Text style={{fontSize:14}}>{s.emoji}</Text>
                  <Text style={[S.chipTxt, selectedSymptoms.includes(s.id)?{color:"#fff"}:{color:colors.text}]}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[S.sub, {color:colors.text, fontFamily:"Tajawal_700Bold"}]}>شدة الألم: {painLevel}/10</Text>
            <View style={{flexDirection:"row-reverse", gap:4, flexWrap:"wrap", justifyContent:"center"}}>
              {Array.from({length:11},(_,i) => (
                <Pressable key={i} onPress={() => setPainLevel(i)}
                  style={[S.painBtn, {backgroundColor: painLevel===i?"#D4568A":inputBg, borderColor: painLevel===i?"#D4568A":chipBorder}]}>
                  <Text style={[S.chipTxt, {color: painLevel===i?"#fff":colors.text}]}>{i}</Text>
                </Pressable>
              ))}
            </View>
            <View style={S.modalBtns}>
              <Pressable onPress={() => {setSymptomsOpen(false);setSelectedSymptoms([]);}} style={[S.modalBtn, {backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt, {color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveSymptoms} style={[S.modalBtn, {backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt, {color:"#fff"}]}>حفظ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ══════════════════════════════════════════════════
   Styles
══════════════════════════════════════════════════ */
const S = StyleSheet.create({
  container: { flex:1 },
  hero: { position:"relative" },
  heroImg: { width:"100%", height:"100%", position:"absolute" },
  heroGrad: { flex:1, padding:16, justifyContent:"space-between" },
  heroRow: { flexDirection:"row-reverse", justifyContent:"space-between" },
  iconBtn: { width:36, height:36, backgroundColor:"rgba(0,0,0,0.22)", borderRadius:10, alignItems:"center", justifyContent:"center" },
  heroTitle: { color:"#fff", fontSize:22, fontFamily:"Cairo_700Bold", textAlign:"right", textShadowColor:"rgba(0,0,0,0.35)", textShadowOffset:{width:0,height:1}, textShadowRadius:5 },
  heroSub: { color:"rgba(255,255,255,0.9)", fontSize:12, fontFamily:"Tajawal_400Regular", textAlign:"right" },
  heroStats: { flexDirection:"row-reverse", backgroundColor:"rgba(0,0,0,0.25)", borderRadius:16, padding:10, alignItems:"center", justifyContent:"space-around", gap:0 },
  heroStatChip: { alignItems:"center", flex:1, gap:1 },
  heroStatNum: { color:"#fff", fontSize:18, fontFamily:"Cairo_700Bold", textShadowColor:"rgba(0,0,0,0.3)", textShadowOffset:{width:0,height:1}, textShadowRadius:2 },
  heroStatLbl: { color:"rgba(255,255,255,0.82)", fontSize:9, fontFamily:"Tajawal_500Medium", textAlign:"center" },
  heroStatSep: { width:1, height:30, backgroundColor:"rgba(255,255,255,0.25)" },
  pmsAlert: { flexDirection:"row-reverse", alignItems:"center", gap:10, marginHorizontal:20, marginTop:14, backgroundColor:"#F59E0B18", borderColor:"#F59E0B44", borderWidth:1, borderRadius:16, padding:14 },
  pmsAlertTxt: { flex:1, fontSize:12, fontFamily:"Tajawal_700Bold", textAlign:"right", lineHeight:18 },
  phaseBadge: { marginHorizontal:20, marginTop:14, borderRadius:14, padding:12, borderWidth:1 },
  phaseLabel: { fontSize:14, fontFamily:"Tajawal_700Bold", textAlign:"right" },
  statsRow: { flexDirection:"row-reverse", paddingHorizontal:20, gap:10, marginTop:12 },
  statCard: { flex:1, borderRadius:16, padding:12, alignItems:"center", borderWidth:1, gap:4 },
  statVal: { fontSize:20, fontFamily:"Cairo_700Bold" },
  card: { marginHorizontal:20, marginTop:16, borderRadius:20, padding:16, borderWidth:1, gap:12 },
  cardTitle: { fontSize:15, fontFamily:"Cairo_700Bold", textAlign:"right" },
  sub: { fontSize:12, fontFamily:"Tajawal_400Regular", textAlign:"right" },
  insightBadge: { width:52, height:52, borderRadius:16, alignItems:"center", justifyContent:"center" },
  tipBox: { flexDirection:"row-reverse", alignItems:"flex-start", gap:8, borderRadius:14, padding:12, borderWidth:1 },
  fertilityPct: { fontSize:28, fontFamily:"Cairo_700Bold" },
  barTrack: { height:10, borderRadius:6, overflow:"hidden" },
  barFill: { height:"100%", backgroundColor:"#A86DBF", borderRadius:6 },
  calHeader: { flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"center" },
  calMonthTxt: { fontSize:16, fontFamily:"Cairo_700Bold" },
  dayName: { flex:1, textAlign:"center", fontSize:11, fontFamily:"Tajawal_500Medium" },
  calCell: { width:"14.28%", aspectRatio:1, alignItems:"center", justifyContent:"center", borderRadius:10, position:"relative" },
  todayRing: { position:"absolute", inset:2, borderRadius:8, borderWidth:2, borderColor:"#A86DBF" },
  calDay: { fontSize:13 },
  sympDot: { width:4, height:4, borderRadius:2, position:"absolute", bottom:2 },
  legend: { flexDirection:"row-reverse", flexWrap:"wrap", gap:10, justifyContent:"center" },
  legendItem: { flexDirection:"row-reverse", alignItems:"center", gap:5 },
  legendDot: { width:8, height:8, borderRadius:4 },
  dayDetail: { borderRadius:16, padding:14, borderWidth:1, gap:10, marginTop:4 },
  phasePill: { borderRadius:10, paddingHorizontal:10, paddingVertical:4 },
  phasePillTxt: { color:"#fff", fontSize:11, fontFamily:"Tajawal_700Bold" },
  calBtns: { flexDirection:"row-reverse", gap:10 },
  calBtn: { flex:1, borderRadius:12, padding:10, alignItems:"center", borderWidth:1 },
  calBtnTxt: { fontSize:12, fontFamily:"Tajawal_700Bold" },
  tabRow: { flexDirection:"row-reverse", gap:6 },
  tab: { flex:1, borderRadius:10, paddingVertical:7, alignItems:"center" },
  tabTxt: { fontSize:12, fontFamily:"Tajawal_700Bold" },
  chipRow: { flexDirection:"row-reverse", flexWrap:"wrap", gap:8 },
  chip: { borderRadius:10, paddingHorizontal:10, paddingVertical:5 },
  chipTxt: { fontSize:12, fontFamily:"Tajawal_500Medium" },
  blogCard: { flexDirection:"row-reverse", alignItems:"center", gap:12, borderRadius:16, padding:14, borderWidth:1 },
  bannerWrap: { marginHorizontal:20, marginTop:20, borderRadius:22, overflow:"hidden", marginBottom:10 },
  bookBanner: { padding:20, flexDirection:"row-reverse", alignItems:"center", justifyContent:"space-between" },
  bookBannerTxt: { color:"#fff", fontSize:14, fontFamily:"Cairo_700Bold" },
  bookBtn: { backgroundColor:"#fff", borderRadius:12, paddingHorizontal:16, paddingVertical:8 },
  bookBtnTxt: { color:"#D4568A", fontSize:13, fontFamily:"Tajawal_700Bold" },
  overlay: { flex:1, backgroundColor:"rgba(0,0,0,0.65)", justifyContent:"flex-end" },
  modalSheet: { borderTopLeftRadius:28, borderTopRightRadius:28, maxHeight:"90%" },
  numChip: { borderRadius:10, paddingHorizontal:10, paddingVertical:6, borderWidth:1 },
  flowChip: { flex:1, borderRadius:14, paddingVertical:10, alignItems:"center", borderWidth:1 },
  infoBox: { borderRadius:14, padding:12, borderWidth:1, gap:4 },
  modalBtns: { flexDirection:"row-reverse", gap:10 },
  modalBtn: { flex:1, borderRadius:14, padding:14, alignItems:"center" },
  sympGrid: { flexDirection:"row-reverse", flexWrap:"wrap", gap:8 },
  sympChip: { flexDirection:"row-reverse", alignItems:"center", gap:4, borderWidth:1.5, borderRadius:12, paddingHorizontal:10, paddingVertical:7 },
  painBtn: { width:30, height:30, borderRadius:8, alignItems:"center", justifyContent:"center", borderWidth:1 },
});
