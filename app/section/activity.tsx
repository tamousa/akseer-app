import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

type ActivityType = "walk" | "run" | "bike";

const ACTIVITY_TYPES: { id: ActivityType; label: string; emoji: string; color: string; pace: string; met: number }[] = [
  { id: "walk", label: "مشي",    emoji: "🚶", color: "#22C55E", pace: "12:00", met: 3.5 },
  { id: "run",  label: "جري",    emoji: "🏃", color: "#C490D8", pace: "6:00",  met: 9.8 },
  { id: "bike", label: "دراجة", emoji: "🚴", color: "#3B82F6", pace: "4:00",  met: 6.8 },
];

const PAST_ACTIVITIES = [
  { id: "1", type: "run"  as ActivityType, date: "اليوم، 6:30 ص",      km: 5.2,  time: "31:12", pace: "6:00", cal: 412, elev: 42  },
  { id: "2", type: "walk" as ActivityType, date: "أمس، 7:00 م",        km: 3.8,  time: "45:36", pace: "12:00", cal: 190, elev: 18 },
  { id: "3", type: "run"  as ActivityType, date: "الخميس، 5:45 ص",     km: 8.1,  time: "49:04", pace: "6:03", cal: 645, elev: 67  },
  { id: "4", type: "bike" as ActivityType, date: "الثلاثاء، 6:00 م",   km: 22.4, time: "1:14:30", pace: "3:19", cal: 520, elev: 85 },
  { id: "5", type: "walk" as ActivityType, date: "الاثنين، 7:30 ص",    km: 4.5,  time: "54:00", pace: "12:00", cal: 225, elev: 12 },
];

const RECORDS = [
  { label: "أطول جري", value: "10.5 كم", date: "الثلاثاء 15 مارس" },
  { label: "أسرع كيلومتر", value: "5:42 دق/كم", date: "الأحد 10 مارس" },
  { label: "أكثر مسافة مشي", value: "8.2 كم", date: "الجمعة 7 مارس" },
];

function RouteCanvas({ color, style }: { color: string; style?: any }) {
  const points = [
    { x: 0.55, y: 0.75 }, { x: 0.45, y: 0.60 }, { x: 0.52, y: 0.48 },
    { x: 0.40, y: 0.38 }, { x: 0.30, y: 0.30 }, { x: 0.22, y: 0.40 },
    { x: 0.28, y: 0.55 }, { x: 0.38, y: 0.62 }, { x: 0.50, y: 0.70 },
    { x: 0.60, y: 0.65 }, { x: 0.70, y: 0.58 }, { x: 0.65, y: 0.42 },
    { x: 0.55, y: 0.35 }, { x: 0.62, y: 0.24 },
  ];
  const W = (style?.width as number) || 100;
  const H = (style?.height as number) || 60;
  return (
    <View style={[{ overflow: "hidden", borderRadius: 8 }, style]}>
      {points.slice(0, -1).map((pt, i) => {
        const next = points[i + 1];
        const x1 = pt.x * W, y1 = pt.y * H;
        const x2 = next.x * W, y2 = next.y * H;
        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: x1, top: y1,
              width: len, height: 2.5,
              backgroundColor: color,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: "left center",
              borderRadius: 2,
              opacity: 0.9,
            }}
          />
        );
      })}
      <View style={{ position: "absolute", left: points[0].x * W - 5, top: points[0].y * H - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: color, borderWidth: 2, borderColor: "#fff" }} />
      <View style={{ position: "absolute", left: points[points.length - 1].x * W - 5, top: points[points.length - 1].y * H - 5, width: 10, height: 10, borderRadius: 5, backgroundColor: "#F43F5E", borderWidth: 2, borderColor: "#fff" }} />
    </View>
  );
}

function LiveMapView({ color, activityType }: { color: string; activityType: ActivityType }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const gridH = 12, gridV = 8;
  return (
    <View style={lm.mapBg}>
      {Array.from({ length: gridH }).map((_, i) => (
        <View key={`h${i}`} style={[lm.gridH, { top: `${(i / gridH) * 100}%` as any }]} />
      ))}
      {Array.from({ length: gridV }).map((_, i) => (
        <View key={`v${i}`} style={[lm.gridV, { left: `${(i / gridV) * 100}%` as any }]} />
      ))}
      <RouteCanvas color={color} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
      <Animated.View style={[lm.dot, { backgroundColor: color, transform: [{ scale: pulse }] }]}>
        <Text style={{ fontSize: 14 }}>{activityType === "walk" ? "🚶" : activityType === "run" ? "🏃" : "🚴"}</Text>
      </Animated.View>
      <View style={lm.compassBox}>
        <MaterialCommunityIcons name="compass" size={20} color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  );
}

const lm = StyleSheet.create({
  mapBg: { flex: 1, backgroundColor: "#1a2535", position: "relative", overflow: "hidden" },
  gridH: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.04)" },
  gridV: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.04)" },
  dot: { position: "absolute", right: "35%", top: "38%", width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "#fff" },
  compassBox: { position: "absolute", bottom: 10, left: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
});

export default function ActivityScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activityType, setActivityType] = useState<ActivityType>("run");
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedType = ACTIVITY_TYPES.find(a => a.id === activityType)!;

  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
        setDistance(d => +(d + (activityType === "run" ? 0.0028 : activityType === "walk" ? 0.0014 : 0.0056)).toFixed(4));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording, paused, activityType]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const paceSeconds = distance > 0 ? Math.round(seconds / distance) : 0;
  const formatPace = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const calories = Math.round((selectedType.met * 70 * seconds) / 3600);

  const stopActivity = () => {
    Alert.alert(
      "إنهاء النشاط",
      `هل تريد حفظ نشاطك؟\n${formatTime(seconds)} · ${distance.toFixed(2)} كم · ${calories} سعرة`,
      [
        { text: "إلغاء" },
        {
          text: "حفظ",
          onPress: () => {
            setRecording(false);
            setPaused(false);
            setSeconds(0);
            setDistance(0);
            Alert.alert("تم الحفظ! 🎉", "أحسنت! تم تسجيل نشاطك بنجاح.");
          },
        },
      ]
    );
  };

  const weeklyTotal = PAST_ACTIVITIES.reduce((sum, a) => sum + a.km, 0);
  const weeklyTime = PAST_ACTIVITIES.reduce((sum, a) => {
    const parts = a.time.split(":").map(Number);
    return sum + (parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0]);
  }, 0);
  const weeklyCalories = PAST_ACTIVITIES.reduce((sum, a) => sum + a.cal, 0);

  if (recording) {
    return (
      <View style={[s.root, { backgroundColor: "#0a0a0a" }]}>
        {/* Live Map */}
        <LiveMapView color={selectedType.color} activityType={activityType} />

        {/* Top status bar */}
        <View style={[s.liveTopBar, { paddingTop: topPadding + 8 }]}>
          <Pressable
            style={s.cancelBtn}
            onPress={() => {
              setRecording(false);
              setPaused(false);
              setSeconds(0);
              setDistance(0);
            }}
          >
            <Feather name="x" size={22} color="#fff" />
          </Pressable>
          <View style={[s.liveBadge, { backgroundColor: paused ? "#F59E0B" : "#22C55E" }]}>
            <View style={[s.liveDot, { backgroundColor: paused ? "#fff" : "#fff" }]} />
            <Text style={s.liveBadgeText}>{paused ? "متوقف" : "مباشر"}</Text>
          </View>
          <View style={[s.liveTypePill, { backgroundColor: selectedType.color + "30", borderColor: selectedType.color + "60" }]}>
            <Text style={{ fontSize: 14 }}>{selectedType.emoji}</Text>
            <Text style={[s.liveTypeText, { color: selectedType.color }]}>{selectedType.label}</Text>
          </View>
        </View>

        {/* Stats panel */}
        <View style={s.statsPanel}>
          {/* Primary stat: Distance */}
          <View style={s.primaryStat}>
            <Text style={[s.primaryStatVal, { color: selectedType.color }]}>{distance.toFixed(2)}</Text>
            <Text style={s.primaryStatUnit}>كيلومتر</Text>
          </View>
          {/* Secondary stats */}
          <View style={s.secondaryStats}>
            {[
              { label: "الوقت",    val: formatTime(seconds),        icon: "clock" as const },
              { label: "الوتيرة",  val: distance > 0 ? `${formatPace(paceSeconds)} دق/كم` : "—", icon: "zap" as const },
              { label: "السعرات", val: String(calories),            icon: "activity" as const },
            ].map((item, i) => (
              <View key={i} style={[s.statBox, i < 2 && { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.1)" }]}>
                <Feather name={item.icon} size={13} color="rgba(255,255,255,0.45)" />
                <Text style={s.statBoxVal}>{item.val}</Text>
                <Text style={s.statBoxLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Controls */}
          <View style={s.controls}>
            <Pressable style={s.stopBtn} onPress={stopActivity}>
              <View style={s.stopIcon} />
            </Pressable>
            <Pressable
              style={[s.pauseBtn, { backgroundColor: paused ? "#22C55E" : selectedType.color }]}
              onPress={() => setPaused(!paused)}
            >
              {paused
                ? <Feather name="play" size={32} color="#fff" />
                : <Feather name="pause" size={32} color="#fff" />}
            </Pressable>
            <Pressable style={s.stopBtn} onPress={() => Alert.alert("التقاط صورة", "سيتم إضافة لقطة لمسارك!")}>
              <Feather name="camera" size={20} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </View>
          <View style={{ height: isWeb ? 16 : insets.bottom + 8 }} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 40 : insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="chevron-right" size={26} color={colors.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.text }]}>الأنشطة الخارجية</Text>
        <Pressable style={s.historyBtn} onPress={() => {}}>
          <Feather name="bar-chart-2" size={20} color="#C490D8" />
        </Pressable>
      </View>

      {/* Weekly summary */}
      <LinearGradient
        colors={isDark ? ["#1A0B2E", "#0F0820"] : ["#2D0A5A", "#1A0B3D"]}
        style={s.weeklyCard}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={s.weeklyTitle}>هذا الأسبوع 📆</Text>
        <View style={s.weeklyRow}>
          {[
            { val: `${weeklyTotal.toFixed(1)}`, unit: "كم",   label: "المسافة",  icon: "map-pin" as const },
            { val: `${weeklyTime}`,              unit: "دق",   label: "الوقت",    icon: "clock" as const },
            { val: `${weeklyCalories}`,          unit: "سعرة", label: "السعرات",  icon: "activity" as const },
            { val: `${PAST_ACTIVITIES.length}`,  unit: "نشاط", label: "الأنشطة",  icon: "zap" as const },
          ].map((item, i) => (
            <View key={i} style={s.weeklyItem}>
              <Text style={s.weeklyVal}>{item.val}</Text>
              <Text style={s.weeklyUnit}>{item.unit}</Text>
              <Text style={s.weeklyLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Activity type selector */}
      <View style={s.section}>
        <Text style={[s.sectionTitle, { color: colors.text }]}>نوع النشاط</Text>
        <View style={s.typeRow}>
          {ACTIVITY_TYPES.map(type => (
            <Pressable
              key={type.id}
              style={[s.typeCard, {
                backgroundColor: activityType === type.id ? type.color : isDark ? colors.card : "#fff",
                borderColor: activityType === type.id ? type.color : colors.border,
              }]}
              onPress={() => setActivityType(type.id)}
            >
              <Text style={{ fontSize: 30 }}>{type.emoji}</Text>
              <Text style={[s.typeLabel, { color: activityType === type.id ? "#fff" : colors.text }]}>{type.label}</Text>
              <Text style={[s.typePace, { color: activityType === type.id ? "rgba(255,255,255,0.8)" : colors.muted }]}>
                {type.pace} دق/كم
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Map preview + Record button */}
      <View style={s.section}>
        <View style={[s.mapPreviewCard, { borderColor: colors.border }]}>
          <RouteCanvas color={selectedType.color} style={s.mapCanvas} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.mapLabel}>
            <View style={[s.mapDot, { backgroundColor: selectedType.color }]} />
            <Text style={s.mapLabelText}>موقعك الحالي · الرياض</Text>
          </View>
        </View>

        <Pressable
          style={[s.recordBtn, { backgroundColor: selectedType.color }]}
          onPress={() => {
            setRecording(true);
            setPaused(false);
            setSeconds(0);
            setDistance(0);
          }}
        >
          <View style={s.recordBtnInner}>
            <Text style={{ fontSize: 28 }}>{selectedType.emoji}</Text>
          </View>
          <Text style={s.recordBtnText}>ابدأ {selectedType.label}</Text>
        </Pressable>
      </View>

      {/* Personal records */}
      <View style={s.section}>
        <Text style={[s.sectionTitle, { color: colors.text }]}>أرقامي القياسية 🏆</Text>
        <View style={s.recordsRow}>
          {RECORDS.map((r, i) => (
            <View key={i} style={[s.recordCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <MaterialCommunityIcons name="trophy" size={20} color="#F5D26A" />
              <Text style={[s.recordVal, { color: colors.text }]}>{r.value}</Text>
              <Text style={[s.recordLabel, { color: colors.muted }]}>{r.label}</Text>
              <Text style={[s.recordDate, { color: colors.muted }]}>{r.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent activities */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text, marginBottom: 0 }]}>الأنشطة الأخيرة</Text>
          <Text style={[s.seeAll, { color: "#C490D8" }]}>الكل</Text>
        </View>
        {PAST_ACTIVITIES.map(act => {
          const t = ACTIVITY_TYPES.find(a => a.id === act.type)!;
          return (
            <Pressable
              key={act.id}
              style={[s.actCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
            >
              {/* Route thumbnail */}
              <RouteCanvas
                color={t.color}
                style={[s.actRoute, { backgroundColor: isDark ? colors.surfaceAlt : "#f4f1ff" }]}
              />
              {/* Info */}
              <View style={s.actInfo}>
                <View style={s.actHeader}>
                  <View style={[s.actTypePill, { backgroundColor: t.color + "20" }]}>
                    <Text style={{ fontSize: 11 }}>{t.emoji}</Text>
                    <Text style={[s.actTypeText, { color: t.color }]}>{t.label}</Text>
                  </View>
                  <Text style={[s.actDate, { color: colors.muted }]}>{act.date}</Text>
                </View>
                <View style={s.actStats}>
                  {[
                    { val: `${act.km} كم`,      label: "مسافة" },
                    { val: act.time,             label: "وقت" },
                    { val: `${act.pace} د/كم`,  label: "وتيرة" },
                    { val: `${act.cal}`,         label: "سعرة" },
                  ].map((st, i) => (
                    <View key={i} style={s.actStat}>
                      <Text style={[s.actStatVal, { color: colors.text }]}>{st.val}</Text>
                      <Text style={[s.actStatLabel, { color: colors.muted }]}>{st.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  // header
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  historyBtn: { padding: 8 },

  // weekly card
  weeklyCard: { marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 6 },
  weeklyTitle: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 15, textAlign: "right", marginBottom: 14 },
  weeklyRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  weeklyItem: { alignItems: "center", gap: 2 },
  weeklyVal: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 18 },
  weeklyUnit: { color: "rgba(255,255,255,0.6)", fontFamily: "Tajawal_400Regular", fontSize: 10 },
  weeklyLabel: { color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 11 },

  // sections
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 12 },
  sectionHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_700Bold" },

  // activity type
  typeRow: { flexDirection: "row-reverse", gap: 10 },
  typeCard: { flex: 1, alignItems: "center", borderRadius: 18, padding: 16, gap: 6, borderWidth: 1.5 },
  typeLabel: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  typePace: { fontSize: 10, fontFamily: "Tajawal_400Regular" },

  // map preview
  mapPreviewCard: { borderRadius: 20, overflow: "hidden", height: 180, marginBottom: 14, borderWidth: 1 },
  mapCanvas: { width: "100%", height: "100%", backgroundColor: "#1a2535" },
  mapLabel: { position: "absolute", bottom: 12, right: 12, flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  mapDot: { width: 8, height: 8, borderRadius: 4 },
  mapLabelText: { color: "#fff", fontFamily: "Tajawal_500Medium", fontSize: 11 },

  // record button
  recordBtn: { borderRadius: 20, paddingVertical: 18, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 12 },
  recordBtnInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  recordBtnText: { color: "#fff", fontSize: 20, fontFamily: "Cairo_700Bold" },

  // records
  recordsRow: { flexDirection: "row-reverse", gap: 10 },
  recordCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center", gap: 4, borderWidth: 1 },
  recordVal: { fontSize: 14, fontFamily: "Cairo_700Bold", textAlign: "center" },
  recordLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  recordDate: { fontSize: 9, fontFamily: "Tajawal_400Regular", textAlign: "center" },

  // activity cards
  actCard: { borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, flexDirection: "row-reverse", gap: 12, alignItems: "flex-start" },
  actRoute: { width: 90, height: 72, borderRadius: 12 },
  actInfo: { flex: 1 },
  actHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  actTypePill: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  actTypeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  actDate: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  actStats: { flexDirection: "row-reverse", gap: 12 },
  actStat: { alignItems: "center", gap: 1 },
  actStatVal: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  actStatLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },

  // live recording screen
  cancelBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  liveTopBar: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  liveBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 3.5 },
  liveBadgeText: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 },
  liveTypePill: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  liveTypeText: { fontFamily: "Tajawal_700Bold", fontSize: 12 },

  statsPanel: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(10,10,10,0.95)", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 20, paddingHorizontal: 20 },
  primaryStat: { alignItems: "center", marginBottom: 20 },
  primaryStatVal: { fontSize: 64, fontFamily: "Cairo_700Bold", lineHeight: 72 },
  primaryStatUnit: { color: "rgba(255,255,255,0.55)", fontFamily: "Tajawal_400Regular", fontSize: 14, marginTop: -6 },
  secondaryStats: { flexDirection: "row-reverse", marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 3 },
  statBoxVal: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 14 },
  statBoxLabel: { color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 10 },

  controls: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 28 },
  pauseBtn: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center" },
  stopBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  stopIcon: { width: 18, height: 18, backgroundColor: "#EF4444", borderRadius: 3 },
});
