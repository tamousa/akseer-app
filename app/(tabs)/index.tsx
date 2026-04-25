import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import React, { useState, useEffect, useRef } from "react";
import { Animated as RNAnimated } from "react-native";
import {
  Alert,
  Dimensions,
  I18nManager,
  Image,
  Keyboard,
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
import ConfettiCannon from "react-native-confetti-cannon";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";
const isWeb = Platform.OS === "web";

const QUICK_SERVICES = [
  { id: "beauty",   titleAr: "العناية والجمال",       titleEn: "Beauty",            emoji: "💅",  color: "#E0457E", route: "/section/beauty" },
  { id: "labs",     titleAr: "المختبرات",             titleEn: "Labs",              emoji: "🔬",  color: "#2563EB", route: "/section/labs" },
  { id: "clinics",  titleAr: "العيادات والاستشارات", titleEn: "Clinics",           emoji: "🩺",  color: "#00C4A0", route: "/section/clinics" },
  { id: "cupping",  titleAr: "الحجامة",               titleEn: "Cupping",           emoji: "🫙",  color: "#E14B4B", route: "/section/cupping" },
  { id: "rehab",    titleAr: "العلاج الطبيعي",        titleEn: "Physiotherapy",     emoji: "🤸",  color: "#3B82F6", route: "/section/rehab" },
  { id: "massage",  titleAr: "المساج",                titleEn: "Massage",           emoji: "💆",  color: "#3FA876", route: "/section/massage" },
  { id: "training", titleAr: "التمارين الرياضية",     titleEn: "Fitness",           emoji: "🏃",  color: "#4CAF50", route: "/section/fitness" },
  { id: "ai",       titleAr: "مساعد AI",              titleEn: "AI",                emoji: "🤖",  color: "#9F6BD8", route: "/section/ai-chat" },
  { id: "stores",   titleAr: "المتاجر",               titleEn: "Stores",            emoji: "🛍️", color: "#E8A23A", route: "/(tabs)/store" },
];

const SPECIALISTS = [
  { id: "1", nameAr: "د.سارة الأحمدي",  nameEn: "Dr. Sara Al-Ahmadi",    specialtyAr: "تغذية علاجية", specialtyEn: "Clinical Nutrition", price: 150, rating: 4.9, available: true },
  { id: "2", nameAr: "د.محمد الزهراني", nameEn: "Dr. Mohammed Al-Zahrani",specialtyAr: "طب رياضي",      specialtyEn: "Sports Medicine",    price: 120, rating: 4.8, available: true },
  { id: "3", nameAr: "د.ليلى الحربي",   nameEn: "Dr. Layla Al-Harbi",    specialtyAr: "صحة نفسية",    specialtyEn: "Mental Health",      price: 200, rating: 4.9, available: true },
  { id: "4", nameAr: "د.فيصل العتيبي",  nameEn: "Dr. Faisal Al-Otaibi",  specialtyAr: "جلدية وتجميل", specialtyEn: "Dermatology",        price: 250, rating: 4.7, available: false },
  { id: "5", nameAr: "د.نورة السالم",   nameEn: "Dr. Noura Al-Salem",    specialtyAr: "أمراض باطنية", specialtyEn: "Internal Medicine",  price: 150, rating: 4.8, available: true },
];

const OFFERS = [
  { id: "1", titleAr: "استشارة تغذية",     titleEn: "Nutrition Consultation", code: "ELIXIR56", price: 199, oldPrice: 450, discount: 56,  color: "#22C55E" },
  { id: "2", titleAr: "جلسة نفسية مجانية", titleEn: "Free Mental Session",    code: "FREEMIND", price: 0,   oldPrice: 200, discount: 100, color: "#00E0B8" },
  { id: "3", titleAr: "تحليل النوم",        titleEn: "Sleep Analysis",         code: "SLEEP58",  price: 159, oldPrice: 380, discount: 58,  color: "#3B82F6" },
  { id: "4", titleAr: "خطة رياضية",         titleEn: "Fitness Plan",           code: "FIT53",    price: 279, oldPrice: 599, discount: 53,  color: "#F43F5E" },
];

const LAB_IMAGES = {
  lab:    require("@/assets/images/clinic-room.png"),
  clinic: require("@/assets/images/clinics-banner.png"),
};

const LABS_AND_CLINICS = [
  {
    id: "1", type: "lab", nameAr: "مختبر النهضة الطبي", nameEn: "Al-Nahda Medical Lab",
    distance: "2.3 كم", infoAr: "45 تحليل", infoEn: "45 tests", rating: 4.8, emoji: "🔬", color: "#3B82F6",
    addressAr: "حي السليمانية، الرياض", addressEn: "Al-Sulaimaniyah, Riyadh", phone: "011-5678901", isOpen: true,
    workingHoursAr: "السبت - الخميس: 7ص - 10م | الجمعة: 4م - 10م",
    workingHoursEn: "Sat - Thu: 7AM - 10PM | Fri: 4PM - 10PM",
    featuresAr: ["نتائج خلال 24 ساعة", "سحب منزلي", "طاقم نسائي"],
    featuresEn: ["Results in 24h", "Home Draw", "Female Staff"],
    testsAr: [{ name: "فحص شامل CBC", price: 80 }, { name: "وظائف الكبد", price: 120 }, { name: "سكر تراكمي HbA1c", price: 90 }],
    testsEn: [{ name: "CBC Complete Test", price: 80 }, { name: "Liver Functions", price: 120 }, { name: "HbA1c Glycated Sugar", price: 90 }],
  },
  {
    id: "2", type: "clinic", nameAr: "عيادة الرعاية الأولى", nameEn: "Primary Care Clinic",
    distance: "1.8 كم", infoAr: "عيادة عامة", infoEn: "General Clinic", rating: 4.7, emoji: "🏥", color: "#00C4A0",
    addressAr: "حي العليا، الرياض", addressEn: "Al-Olaya, Riyadh", phone: "011-4321000", isOpen: true,
    workingHoursAr: "السبت - الخميس: 8ص - 9م | الجمعة: 2م - 8م",
    workingHoursEn: "Sat - Thu: 8AM - 9PM | Fri: 2PM - 8PM",
    featuresAr: ["حجز إلكتروني", "طبيب مقيم", "استشارة مجانية أولى"],
    featuresEn: ["Online Booking", "Resident Doctor", "Free First Consult"],
    testsAr: [{ name: "استشارة طبية عامة", price: 150 }, { name: "قياس ضغط وسكر", price: 50 }, { name: "ECG قلب", price: 200 }],
    testsEn: [{ name: "General Medical Consult", price: 150 }, { name: "BP & Blood Sugar Check", price: 50 }, { name: "Cardiac ECG", price: 200 }],
  },
  {
    id: "3", type: "lab", nameAr: "مختبر الرازي", nameEn: "Al-Razi Laboratory",
    distance: "3.1 كم", infoAr: "38 تحليل", infoEn: "38 tests", rating: 4.7, emoji: "🔬", color: "#3B82F6",
    addressAr: "حي الروضة، الرياض", addressEn: "Al-Rawdah, Riyadh", phone: "011-7654321", isOpen: false,
    workingHoursAr: "السبت - الخميس: 7ص - 8م | مغلق الجمعة",
    workingHoursEn: "Sat - Thu: 7AM - 8PM | Closed Friday",
    featuresAr: ["ISO معتمد", "نتائج إلكترونية", "فروع متعددة"],
    featuresEn: ["ISO Certified", "Digital Results", "Multiple Branches"],
    testsAr: [{ name: "باقة فيتامينات شاملة", price: 280 }, { name: "فحص حديد ومخزون", price: 130 }, { name: "غدة درقية TSH", price: 110 }],
    testsEn: [{ name: "Full Vitamin Panel", price: 280 }, { name: "Iron & Ferritin", price: 130 }, { name: "Thyroid TSH", price: 110 }],
  },
  {
    id: "4", type: "clinic", nameAr: "عيادة القلب والأوعية", nameEn: "Cardiology Clinic",
    distance: "2.5 كم", infoAr: "أمراض القلب", infoEn: "Cardiology", rating: 4.9, emoji: "❤️", color: "#F43F5E",
    addressAr: "حي الملقا، الرياض", addressEn: "Al-Malqa, Riyadh", phone: "011-8877665", isOpen: true,
    workingHoursAr: "السبت - الأربعاء: 9ص - 6م",
    workingHoursEn: "Sat - Wed: 9AM - 6PM",
    featuresAr: ["استشارة متخصصة", "تخطيط القلب", "أشعة تجسيمية"],
    featuresEn: ["Specialist Consult", "ECG Monitoring", "3D Imaging"],
    testsAr: [{ name: "استشارة قلب", price: 350 }, { name: "ECG + إيكو قلب", price: 450 }, { name: "اختبار إجهاد", price: 500 }],
    testsEn: [{ name: "Cardiology Consult", price: 350 }, { name: "ECG + Echo", price: 450 }, { name: "Stress Test", price: 500 }],
  },
  {
    id: "5", type: "lab", nameAr: "مختبر المدينة", nameEn: "Al-Madinah Lab",
    distance: "4.5 كم", infoAr: "52 تحليل", infoEn: "52 tests", rating: 4.9, emoji: "🔬", color: "#3B82F6",
    addressAr: "حي النزهة، الرياض", addressEn: "Al-Nuzha, Riyadh", phone: "920012345", isOpen: true,
    workingHoursAr: "السبت - الخميس: 6ص - 11م | الجمعة: 4م - 11م",
    workingHoursEn: "Sat - Thu: 6AM - 11PM | Fri: 4PM - 11PM",
    featuresAr: ["نتائج فورية", "سحب منزلي مجاني", "تطبيق ذكي للنتائج"],
    featuresEn: ["Instant Results", "Free Home Draw", "Smart Results App"],
    testsAr: [{ name: "باقة فحص شامل", price: 299 }, { name: "فحص حساسية طعام", price: 450 }, { name: "دهون وكوليسترول", price: 95 }],
    testsEn: [{ name: "Complete Checkup", price: 299 }, { name: "Food Allergy Panel", price: 450 }, { name: "Lipids & Cholesterol", price: 95 }],
  },
];

const WEEK_DATA = [
  { dayAr: "أحد",    dayEn: "Sun", steps: 4500, calories: 1800, sleep: 6.5, water: 5 },
  { dayAr: "إثنين",  dayEn: "Mon", steps: 7200, calories: 2100, sleep: 7.0, water: 7 },
  { dayAr: "ثلاثاء", dayEn: "Tue", steps: 5800, calories: 1900, sleep: 7.5, water: 6 },
  { dayAr: "أربعاء", dayEn: "Wed", steps: 8100, calories: 2200, sleep: 6.8, water: 8 },
  { dayAr: "خميس",   dayEn: "Thu", steps: 6500, calories: 2000, sleep: 7.2, water: 4 },
  { dayAr: "جمعة",   dayEn: "Fri", steps: 3200, calories: 1700, sleep: 8.0, water: 6 },
  { dayAr: "سبت",    dayEn: "Sat", steps: 6247, calories: 1850, sleep: 7.2, water: 5 },
];

function HabitsBar({ isDark, colors }: { isDark: boolean; colors: any }) {
  const { habits, toggleHabitDay } = useApp();
  const { t, lang } = useLanguage();
  const today = new Date().toISOString().split("T")[0];
  const done = habits.filter(h => h.completedDates.includes(today)).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const barColor = pct === 100 ? "#22C55E" : pct >= 60 ? "#F59E0B" : "#00E0B8";

  const confettiRef = useRef<ConfettiCannon>(null);
  const prevDone = useRef<number>(-1);
  const screenW = Dimensions.get("window").width;

  useEffect(() => {
    if (total > 0 && done === total && prevDone.current !== total) {
      confettiRef.current?.start();
    }
    prevDone.current = done;
  }, [done, total]);

  const getStreak = (completedDates: string[]) => {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const s = d.toISOString().split("T")[0];
      if (completedDates.includes(s)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  const getDaysSinceStart = (startDate?: string) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
  };

  return (
    <View>
    <View style={{ borderRadius: 20, borderWidth: 1, padding: 16, marginTop: 16, backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }}>
      {/* Header */}
      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 18 }}>✅</Text>
          <Text style={{ color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 15 }}>{t("عداد العادات اليومية", "Daily Habits Tracker")}</Text>
        </View>
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={() => router.push("/habits" as any)}
            style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#00E0B815", alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="edit-2" size={14} color="#00E0B8" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/habits" as any)}
            style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: barColor + "15", alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="plus" size={16} color={barColor} />
          </Pressable>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{ flex: 1, height: 10, backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", borderRadius: 5, overflow: "hidden" }}>
          <View style={{ width: `${pct}%`, height: 10, backgroundColor: barColor, borderRadius: 5 }} />
        </View>
        <Text style={{ color: barColor, fontFamily: "Tajawal_700Bold", fontSize: 13 }}>{done}/{total}</Text>
      </View>

      {/* Habits list */}
      {total === 0 ? (
        <Pressable onPress={() => router.push("/habits" as any)} style={{ alignItems: "center", paddingVertical: 16, gap: 6 }}>
          <Text style={{ fontSize: 30 }}>🌱</Text>
          <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 13 }}>{t("أضف أول عادة لك", "Add your first habit")}</Text>
        </Pressable>
      ) : (
        habits.map((h, idx) => {
          const isCompleted = h.completedDates.includes(today);
          const streak = getStreak(h.completedDates);
          const elapsed = getDaysSinceStart(h.startDate);
          const target = h.targetDays;
          const progressDays = target ? Math.min(elapsed, target) : streak;
          return (
            <Pressable
              key={h.id}
              onPress={() => toggleHabitDay(h.id, today)}
              style={{ flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: idx < habits.length - 1 ? 1 : 0, borderBottomColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            >
              {/* Check circle */}
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: isCompleted ? barColor : colors.border, backgroundColor: isCompleted ? barColor : "transparent", alignItems: "center", justifyContent: "center" }}>
                {isCompleted ? <Feather name="check" size={13} color="#fff" /> : <Text style={{ fontSize: 12 }}>{h.emoji}</Text>}
              </View>

              {/* Name */}
              <Text style={{ color: isCompleted ? colors.muted : colors.text, fontFamily: "Tajawal_500Medium", fontSize: 13, flex: 1, textAlign: "right", textDecorationLine: isCompleted ? "line-through" : "none" }}>
                {h.name}
              </Text>

              {/* Day counter badge */}
              {target ? (
                <View style={{ alignItems: "center", backgroundColor: progressDays >= target ? "#22C55E15" : "#00E0B815", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, minWidth: 52 }}>
                  <Text style={{ color: progressDays >= target ? "#22C55E" : "#00E0B8", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>
                    {progressDays}/{target}
                  </Text>
                  <Text style={{ color: progressDays >= target ? "#22C55E80" : "#00E0B880", fontFamily: "Tajawal_400Regular", fontSize: 9 }}>{t("يوم", "day")}</Text>
                </View>
              ) : streak > 0 ? (
                <View style={{ backgroundColor: "#F59E0B15", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: "#F59E0B", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>🔥 {streak}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })
      )}
    </View>

    <ConfettiCannon
      ref={confettiRef}
      count={180}
      origin={{ x: screenW / 2, y: -20 }}
      autoStart={false}
      fadeOut
      fallSpeed={3000}
      explosionSpeed={400}
      colors={["#00C4A0", "#EC4899", "#F5D26A", "#22C55E", "#3B82F6", "#F97316"]}
    />
    </View>
  );
}

function HealthPointsBar({ isDark, todayPoints }: { isDark: boolean; todayPoints: any }) {
  const { t } = useLanguage();
  const totalScore = Math.min(todayPoints.total * 10, 1000);
  const pct = totalScore / 1000;

  const getRating = (val: number, max: number) => {
    const p = val / max;
    if (p >= 0.8) return { label: t("ممتاز", "Excellent"),      color: "#00C4A0" };
    if (p >= 0.6) return { label: t("جيد", "Good"),             color: "#34D399" };
    if (p >= 0.4) return { label: t("متوسط", "Average"),        color: "#FBBF24" };
    return           { label: t("يحتاج تحسين", "Needs Work"),   color: "#F87171" };
  };

  const CATS = [
    { emoji: "🧘", labelAr: "ذهني",   labelEn: "Mental",   val: todayPoints.water,    max: 25 },
    { emoji: "😴", labelAr: "نوم",    labelEn: "Sleep",    val: todayPoints.sleep,    max: 25 },
    { emoji: "🥗", labelAr: "تغذية", labelEn: "Nutrition", val: todayPoints.meals,    max: 25 },
    { emoji: "🏃", labelAr: "لياقة", labelEn: "Fitness",  val: todayPoints.exercise, max: 25 },
  ];

  return (
    <View style={{ borderRadius: 20, padding: 16, marginTop: 16, backgroundColor: isDark ? "#150C2A" : "#1A0B2E" }}>
      {/* Header */}
      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 20 }}>🏆</Text>
          <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 16 }}>{t("نقاط صحتك", "Health Score")}</Text>
        </View>
        <Text style={{ color: "#00C4A0", fontFamily: "Tajawal_700Bold", fontSize: 22 }}>
          1000 / {totalScore}
        </Text>
      </View>

      {/* Category tiles */}
      <View style={{ flexDirection: "row-reverse", gap: 8, marginBottom: 14 }}>
        {CATS.map((cat) => {
          const rating = getRating(cat.val, cat.max);
          return (
            <View key={cat.labelAr} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 10, alignItems: "center", gap: 3 }}>
              <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
              <Text style={{ color: rating.color, fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{rating.label}</Text>
              <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>{t(cat.labelAr, cat.labelEn)}</Text>
            </View>
          );
        })}
      </View>

      {/* Progress bar */}
      <View style={{ height: 10, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden", marginBottom: 6 }}>
        <LinearGradient
          colors={["#007A65", "#00C4A0", "#F59E0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${Math.max(pct * 100, 3)}%` as any, height: 10, borderRadius: 5 }}
        />
      </View>
      <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
        <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>1000</Text>
        <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>{t("ممتازة", "Excellent")}</Text>
        <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>{t("جيدة", "Good")}</Text>
        <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>{t("مبتدئة", "Beginner")}</Text>
        <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 10 }}>0</Text>
      </View>
    </View>
  );
}

function QuickActionsRow({
  isDark, caloriesConsumed, nutritionGoal, todayNutrition,
}: { isDark: boolean; caloriesConsumed: number; nutritionGoal: any; todayNutrition: any }) {
  const { t, lang } = useLanguage();
  const calPct = Math.min(caloriesConsumed / (nutritionGoal.calories || 2200), 1);
  const hasFajr    = todayNutrition?.breakfast?.length > 0;
  const hasLunch   = todayNutrition?.lunch?.length  > 0;
  const hasDinner  = todayNutrition?.dinner?.length > 0;
  const nextMeal   = !hasFajr ? t("سجّل الفطور", "Log Breakfast") : !hasLunch ? t("سجّل الغداء", "Log Lunch") : !hasDinner ? t("سجّل العشاء", "Log Dinner") : t("الوجبات مكتملة ✅", "All Meals Logged ✅");
  const workoutDone = 2;
  const workoutTotal = 6;
  const workoutPct   = workoutDone / workoutTotal;

  return (
    <View style={{ flexDirection: "row-reverse", gap: 10, marginTop: 16 }}>
      {/* ── التغذية / Nutrition ── */}
      <View style={{ flex: 1, backgroundColor: isDark ? "#150C2A" : "#1A0B2E", borderRadius: 20, padding: 14 }}>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>🥘</Text>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13 }}>{t("التغذية", "Nutrition")}</Text>
          </View>
          <Pressable onPress={() => router.push("/section/nutrition-plan" as any)}>
            <Text style={{ color: "#00C4A0", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{t("إضافة", "Add")}</Text>
          </Pressable>
        </View>

        <Text style={{ color: "#00C4A0", fontFamily: "Tajawal_700Bold", fontSize: 11, textAlign: lang === "en" ? "left" : "right", marginBottom: 4 }}>
          {caloriesConsumed} / {nutritionGoal.calories || 2200} {t("سعرة", "cal")}
        </Text>
        <View style={{ height: 5, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
          <LinearGradient
            colors={["#007A65", "#F59E0B"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${Math.max(calPct * 100, 3)}%` as any, height: 5, borderRadius: 3 }}
          />
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {[
            { labelAr: "فطور", labelEn: "Breakfast", emoji: "🌅", done: hasFajr },
            { labelAr: "غداء", labelEn: "Lunch",     emoji: "☀️", done: hasLunch },
            { labelAr: "عشاء", labelEn: "Dinner",    emoji: "🌙", done: hasDinner },
          ].map((m) => (
            <View key={m.labelAr} style={{
              flexDirection: "row-reverse", alignItems: "center", gap: 3,
              backgroundColor: m.done ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.07)",
              borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
            }}>
              <Text style={{ fontSize: 11 }}>{m.done ? "✓" : m.emoji}</Text>
              <Text style={{ color: m.done ? "#00C4A0" : "rgba(255,255,255,0.5)", fontFamily: "Tajawal_500Medium", fontSize: 10 }}>{t(m.labelAr, m.labelEn)}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push("/section/nutrition-plan" as any)}
          style={{ backgroundColor: "rgba(167,139,250,0.15)", borderRadius: 12, paddingVertical: 9, alignItems: "center", borderWidth: 1, borderColor: "rgba(167,139,250,0.25)" }}
        >
          <Text style={{ color: "#00C4A0", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>+ {nextMeal}</Text>
        </Pressable>
      </View>

      {/* ── تمرين اليوم / Today's Workout ── */}
      <View style={{ flex: 1, backgroundColor: isDark ? "#150C2A" : "#1A0B2E", borderRadius: 20, padding: 14 }}>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16 }}>🏋️</Text>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13 }}>{t("تمرين اليوم", "Today's Workout")}</Text>
          </View>
          <Pressable onPress={() => router.push("/section/fitness" as any)}>
            <Text style={{ color: "#00C4A0", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{t("تفاصيل", "Details")}</Text>
          </Pressable>
        </View>

        <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 14, textAlign: lang === "en" ? "left" : "right", marginBottom: 2 }}>
          {t("صدر وكتفين", "Chest & Shoulders")}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: lang === "en" ? "left" : "right", marginBottom: 10 }}>
          {t("45 دق · 6 تمارين 💪", "45 min · 6 exercises 💪")}
        </Text>

        <View style={{ height: 5, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
          <LinearGradient
            colors={["#007A65", "#22C55E"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: `${workoutPct * 100}%` as any, height: 5, borderRadius: 3 }}
          />
        </View>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Tajawal_400Regular", fontSize: 10, textAlign: lang === "en" ? "left" : "right", marginBottom: 12 }}>
          {workoutDone}/{workoutTotal} {t("مكتملة", "completed")}
        </Text>

        <Pressable
          onPress={() => router.push("/section/fitness" as any)}
          style={{ backgroundColor: "#007A65", borderRadius: 12, paddingVertical: 9, alignItems: "center", flexDirection: "row-reverse", justifyContent: "center", gap: 6 }}
        >
          <Text style={{ fontSize: 13 }}>▶️</Text>
          <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{t("استكمل", "Continue")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const DAILY_TIPS = [
  { ar: "اشرب 8 أكواب ماء يوميًا لتحسين التركيز والطاقة 💧", en: "Drink 8 glasses of water daily to improve focus and energy 💧" },
  { ar: "تناول وجبة إفطار غنية بالبروتين لتعزيز الشبع طوال اليوم 🥚", en: "Eat a protein-rich breakfast to stay full throughout the day 🥚" },
  { ar: "امشِ 10,000 خطوة يوميًا لصحة القلب والأوعية الدموية 🚶", en: "Walk 10,000 steps daily for heart and cardiovascular health 🚶" },
  { ar: "نم 7-8 ساعات لتعزيز المناعة وتحسين المزاج 😴", en: "Sleep 7–8 hours to boost immunity and improve mood 😴" },
  { ar: "تناول 5 حصص من الخضار والفواكه يوميًا 🥗", en: "Eat 5 servings of vegetables and fruits daily 🥗" },
  { ar: "خصص 30 دقيقة يوميًا لتمارين رياضية 🏋️", en: "Dedicate 30 minutes daily to exercise 🏋️" },
  { ar: "تجنب الشاشات قبل النوم بساعة للحصول على نوم أفضل 📵", en: "Avoid screens one hour before bed for better sleep 📵" },
];

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { t, lang, toggleLang } = useLanguage();
  const {
    profile, waterIntake, addWaterGlass, steps, sleepHours,
    caloriesConsumed, bookings, weightHistory, addWeightEntry,
    currentWeight, todayPoints, totalMonthlyPoints,
    pointsNotification, dismissPointsNotification,
    todayNutrition, nutritionGoal,
  } = useApp();

  const [showNotifications, setShowNotifications]   = useState(false);
  const [showWeightModal, setShowWeightModal]         = useState(false);
  const [showNutritionModal, setShowNutritionModal]   = useState(false);
  const [newWeight, setNewWeight]                     = useState("");
  const [weightPhotoUri, setWeightPhotoUri]           = useState<string | undefined>();
  const [weightNote, setWeightNote]                   = useState("");
  const [chartTab, setChartTab]                       = useState<"steps" | "sleep" | "water">("steps");
  const [selectedOffer, setSelectedOffer]             = useState<(typeof OFFERS)[0] | null>(null);
  const [copiedOfferCode, setCopiedOfferCode]         = useState(false);
  const [expandedLabId, setExpandedLabId]             = useState<string | null>(null);

  const copyOfferCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedOfferCode(true);
    setTimeout(() => setCopiedOfferCode(false), 2000);
  };

  const topPadding = isWeb ? 67 : insets.top;

  const notifAnim   = useRef(new RNAnimated.Value(-100)).current;
  const shimmerAnim = useRef(new RNAnimated.Value(0)).current;
  const glowAnim    = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (pointsNotification) {
      RNAnimated.sequence([
        RNAnimated.timing(notifAnim, { toValue: topPadding + 10, duration: 350, useNativeDriver: false }),
        RNAnimated.delay(2200),
        RNAnimated.timing(notifAnim, { toValue: -100, duration: 300, useNativeDriver: false }),
      ]).start(() => dismissPointsNotification());
    }
  }, [pointsNotification]);

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        RNAnimated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        RNAnimated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const pointsBarColor = todayPoints.total >= 80 ? "#22C55E" : todayPoints.total >= 50 ? "#F59E0B" : "#EF4444";
  const pointsBarPct   = Math.min(100, todayPoints.total);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("صباح الخير", "Good Morning");
    if (h < 17) return t("مساء الخير", "Good Afternoon");
    return t("مساء النور", "Good Evening");
  };

  const dateStr = () => {
    const d = new Date();
    if (lang === "en") {
      const days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    }
    const days   = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return `${days[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]}`;
  };

  const chartDataKey  = chartTab === "steps" ? "steps" : chartTab === "sleep" ? "sleep" : "water";
  const chartMax      = chartTab === "steps" ? 10000 : chartTab === "sleep" ? 10 : 8;
  const chartColor    = chartTab === "steps" ? "#00E0B8" : chartTab === "sleep" ? "#8B5CF6" : "#3B82F6";
  const chartLabel    = chartTab === "steps" ? t("خطوات", "Steps") : chartTab === "sleep" ? t("ساعات نوم", "Sleep Hours") : t("أكواب ماء", "Water Cups");
  const chartCurrentVal = chartTab === "steps" ? steps.toLocaleString() : chartTab === "sleep" ? `${sleepHours}h` : `${waterIntake.glasses}/8`;

  const userName  = profile?.name || "طارق موسى";
  const firstName = userName.split(" ")[0];

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.22] });
  const glowScale      = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
  const glowOpacity    = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] });

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );

  const typeConfig: Record<string, { emoji: string; color: string }> = {
    clinic:  { emoji: "🩺", color: "#00C4A0" },
    lab:     { emoji: "🔬", color: "#3B82F6" },
    beauty:  { emoji: "💆", color: "#EC4899" },
    trainer: { emoji: "🏋️", color: "#22C55E" },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 160 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#FFFFFF" }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}
              onPress={() => setShowNotifications(true)}
            >
              {isIOS ? <SymbolView name="bell.fill" tintColor="#00E0B8" size={18} /> : <Feather name="bell" size={18} color="#00E0B8" />}
              <View style={styles.badge} />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}
              onPress={toggleTheme}
            >
              <Feather name={isDark ? "sun" : "moon"} size={18} color="#00E0B8" />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}
              onPress={toggleLang}
            >
              <Text style={{ color: "#00E0B8", fontFamily: "Cairo_700Bold", fontSize: 13 }}>{lang === "ar" ? "EN" : "ع"}</Text>
            </Pressable>
            <Pressable
              style={[styles.planBadge, { backgroundColor: "#00E0B8" + "20" }]}
              onPress={() => router.push("/subscription" as any)}
            >
              <Text style={styles.planBadgeText}>FREE</Text>
            </Pressable>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.logoRow}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} resizeMode="contain" />
              <Text style={[styles.appTitle, { color: colors.text }]}>اكسير</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── GREETING + DATE ─── */}
      <View style={[styles.summarySection, { paddingHorizontal: 20 }]}>
        <View style={styles.greetingRow}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {greeting()}، {userName}! 👋🏼
          </Text>
          <Text style={[styles.dateText, { color: colors.muted }]}>{dateStr()}</Text>
        </View>

        {/* ─── WEATHER + POINTS ─── */}
        <View style={styles.motiveAndPointsRow}>
          <View style={[styles.motiveCard, { flex: 1, backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <View style={styles.motiveRow}>
              <Text style={{ fontSize: 22 }}>🌤️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.motiveWeather, { color: colors.text }]}>{t("الرياض • 34°C", "Riyadh • 34°C")}</Text>
                <Text style={[styles.motiveDate, { color: colors.muted }]}>{t("مشمس", "Sunny")}</Text>
              </View>
            </View>
            <View style={[styles.motiveDivider, { backgroundColor: colors.border }]} />
            <View style={styles.motiveRow}>
              <Text style={{ fontSize: 16 }}>✨</Text>
              <Text style={[styles.motiveQuote, { color: colors.muted, fontSize: 11 }]}>
                {[
                  { ar: "صحتك تاج على رأسك 👑",         en: "Your health is your crown 👑" },
                  { ar: "كل خطوة تقربك للأفضل 💪",       en: "Every step brings you closer to better 💪" },
                  { ar: "جسمك أمانة، اعتنِ به 🌿",       en: "Your body is a trust, take care of it 🌿" },
                  { ar: "ابدأ يومك بنية صحية 🌟",         en: "Start your day with a healthy intention 🌟" },
                  { ar: "الاستمرارية سر النجاح 🏆",       en: "Consistency is the secret of success 🏆" },
                  { ar: "اشرب ماءك وابتسم ☀️",            en: "Drink your water and smile ☀️" },
                  { ar: "قارن نفسك بالأمس فقط 🚀",        en: "Compare yourself only to yesterday 🚀" },
                ].map(q => t(q.ar, q.en))[new Date().getDay()]}
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.pointsBox, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
            onPress={() => router.push("/points" as any)}
          >
            <View style={styles.pointsBoxHeader}>
              <Text style={{ fontSize: 20 }}>⭐</Text>
              <Text style={[styles.pointsBoxTitle, { color: colors.text }]}>{t("نقاط صحتك", "Health Score")}</Text>
            </View>
            <View style={styles.pointsScoreRow}>
              <Text style={[styles.pointsScoreNum, { color: pointsBarColor }]}>{todayPoints.total}</Text>
              <Text style={[styles.pointsScoreMax, { color: colors.muted }]}>/100</Text>
            </View>
            <View style={[styles.pointsBarBg, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}>
              <View style={[styles.pointsBarFill, { width: `${pointsBarPct}%`, backgroundColor: pointsBarColor }]} />
            </View>
            <View style={styles.pointsCatsRow}>
              <View style={styles.pointsCatItem}>
                <Text style={{ fontSize: 12 }}>🍽️</Text>
                <Text style={[styles.pointsCatVal, { color: todayPoints.meals > 0 ? "#22C55E" : colors.muted }]}>{todayPoints.meals}</Text>
              </View>
              <View style={styles.pointsCatItem}>
                <Text style={{ fontSize: 12 }}>🏋️</Text>
                <Text style={[styles.pointsCatVal, { color: todayPoints.exercise > 0 ? "#22C55E" : colors.muted }]}>{todayPoints.exercise}</Text>
              </View>
              <View style={styles.pointsCatItem}>
                <Text style={{ fontSize: 12 }}>💧</Text>
                <Text style={[styles.pointsCatVal, { color: todayPoints.water > 0 ? "#22C55E" : colors.muted }]}>{todayPoints.water}</Text>
              </View>
              <View style={styles.pointsCatItem}>
                <Text style={{ fontSize: 12 }}>😴</Text>
                <Text style={[styles.pointsCatVal, { color: todayPoints.sleep > 0 ? "#22C55E" : colors.muted }]}>{todayPoints.sleep}</Text>
              </View>
            </View>
            <View style={[styles.pointsMonthlyRow, { backgroundColor: isDark ? "rgba(0,224,184,0.1)" : "rgba(0,196,160,0.06)" }]}>
              <Text style={[styles.pointsMonthlyLabel, { color: colors.muted }]}>{t("هذا الشهر", "This Month")}</Text>
              <Text style={[styles.pointsMonthlyVal, { color: "#00E0B8" }]}>{totalMonthlyPoints} ⭐</Text>
            </View>
          </Pressable>
        </View>

        {/* ─── UPCOMING APPOINTMENTS STRIP ─── */}
        <View style={{ marginTop: 14 }}>
          <View style={[styles.sectionHeaderRow, { marginBottom: 10 }]}>
            <Text style={[styles.miniSectionTitle, { color: colors.text }]}>📅 {t("مواعيدي القادمة", "Upcoming Appointments")}</Text>
            <Pressable onPress={() => router.push("/bookings" as any)}>
              <Text style={[styles.seeAllText, { color: "#00E0B8" }]}>{t("عرض الكل", "View All")}</Text>
            </Pressable>
          </View>

          {upcomingBookings.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 10 }}>
              {upcomingBookings.slice(0, 5).map((b) => {
                const tc = typeConfig[b.type] || typeConfig.clinic;
                return (
                  <Pressable
                    key={b.id}
                    style={[styles.apptMiniCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                    onPress={() => router.push("/bookings" as any)}
                  >
                    <View style={[styles.apptMiniIcon, { backgroundColor: tc.color + "15" }]}>
                      <Text style={{ fontSize: 20 }}>{tc.emoji}</Text>
                    </View>
                    <Text style={[styles.apptMiniService, { color: colors.text }]} numberOfLines={1}>{b.service}</Text>
                    <Text style={[styles.apptMiniTime, { color: colors.muted }]} numberOfLines={1}>{b.date}</Text>
                    <View style={[styles.apptMiniStatus, { backgroundColor: b.status === "confirmed" ? "#22C55E15" : "#F59E0B15" }]}>
                      <Text style={[styles.apptMiniStatusText, { color: b.status === "confirmed" ? "#22C55E" : "#F59E0B" }]}>
                        {b.status === "confirmed" ? t("مؤكد", "Confirmed") : t("انتظار", "Pending")}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Pressable
              style={[styles.apptEmptyStrip, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
              onPress={() => router.push("/section/clinics" as any)}
            >
              <Text style={{ fontSize: 20 }}>📋</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.apptEmptyTitle, { color: colors.text }]}>{t("لا يوجد مواعيد قادمة", "No Upcoming Appointments")}</Text>
                <Text style={[styles.apptEmptySub, { color: colors.muted }]}>{t("احجز موعدك الأول مع مختص", "Book your first appointment with a specialist")}</Text>
              </View>
              <View style={styles.apptEmptyBtn}>
                <Text style={styles.apptEmptyBtnText}>{t("احجز", "Book")}</Text>
                <Feather name={lang === "en" ? "arrow-right" : "arrow-left"} size={12} color="#fff" />
              </View>
            </Pressable>
          )}
        </View>
        {/* ─── نصيحة اليوم (inline, always visible) ─── */}
        <Pressable
          style={[styles.inlineTipCard, { backgroundColor: isDark ? "#1C1330" : "#F8F0FF", borderColor: isDark ? "rgba(0,224,184,0.2)" : "rgba(0,196,160,0.15)" }]}
          onPress={() => {}}
        >
          <Text style={{ fontSize: 22 }}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inlineTipLabel, { color: "#00C4A0" }]}>{t("نصيحة اليوم", "Today's Tip")}</Text>
            <Text style={[styles.inlineTipText, { color: colors.text }]} numberOfLines={2}>
              {t(DAILY_TIPS[new Date().getDay()].ar, DAILY_TIPS[new Date().getDay()].en)}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* ─── ANIMATED CLINIC BANNER ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <RNAnimated.View style={[styles.heroBanner, { transform: [{ scale: glowScale }], opacity: glowOpacity }]}>
          <Image source={require("@/assets/images/hero-banner.png")} style={styles.heroBannerImage} resizeMode="cover" />
          <LinearGradient
            colors={["rgba(90,20,140,0.55)", "rgba(0,196,160,0.82)", "rgba(60,10,100,0.92)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <RNAnimated.View style={[StyleSheet.absoluteFill, styles.shimmerLayer, { opacity: shimmerOpacity }]} />
          <View style={styles.heroBannerContent}>
            <View style={styles.bannerBadge}>
              <View style={styles.bannerLiveDot} />
              <Text style={styles.bannerLiveText}>{t("متاح الآن", "Available Now")}</Text>
            </View>
            <Text style={styles.clinicBannerTitle}>🩺 {t("العيادة الافتراضية", "Virtual Clinic")}</Text>
            <Text style={styles.clinicBannerSub}>{t("احجز مع مختص معتمد الآن", "Book with a certified specialist now")}</Text>
            <View style={styles.clinicBannerBtns}>
              <Pressable style={styles.clinicBannerBtn} onPress={() => router.push("/section/clinics" as any)}>
                <Text style={styles.clinicBannerBtnTxt}>{t("احجز الآن ←", "Book Now →")}</Text>
              </Pressable>
              <Pressable style={styles.clinicBannerGhostBtn} onPress={() => router.push("/section/clinics" as any)}>
                <Text style={styles.clinicBannerGhostTxt}>{t("تعرف أكثر", "Learn More")}</Text>
              </Pressable>
            </View>
          </View>
        </RNAnimated.View>
      </View>

      {/* ─── وش خاطرك اليوم — الشبكة الرئيسية ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 22, marginBottom: 18 }]}>
          {t(`وش خاطرك اليوم، ${firstName}؟`, `What are you looking for today, ${firstName}?`)}
        </Text>
        <View style={styles.servicesGrid}>
          {QUICK_SERVICES.map((s) => (
            <Pressable
              key={s.id}
              style={styles.serviceItemOuter}
              onPress={() => s.route ? router.push(s.route as any) : Alert.alert(t("قريباً", "Coming Soon"), t("هذه الخدمة ستكون متاحة قريباً", "This service will be available soon"))}
            >
              <View style={[styles.serviceItemBig, { backgroundColor: s.color }]}>
                <View style={styles.serviceEmojiCircle}>
                  <Text style={{ fontSize: 36 }}>{s.emoji}</Text>
                </View>
                <Text style={styles.serviceTitleBig}>{t(s.titleAr, s.titleEn)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ─── عروض اليوم ─── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("عروض اليوم", "Today's Offers")} 🔥</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse" }}>
          {OFFERS.map((offer) => (
            <Pressable key={offer.id} onPress={() => setSelectedOffer(offer)} style={[styles.offerCard, { backgroundColor: isDark ? colors.card : "#FFFFFF", borderColor: colors.border }]}>
              <View style={[styles.discountBadge, { backgroundColor: offer.color }]}>
                <Text style={styles.discountText}>-{offer.discount}%</Text>
              </View>
              <Text style={[styles.offerTitle, { color: colors.text }]}>{t(offer.titleAr, offer.titleEn)}</Text>
              <View style={styles.offerPriceRow}>
                <Text style={[styles.offerPrice, { color: "#00E0B8" }]}>{offer.price === 0 ? t("مجاناً", "Free") : `${offer.price} ${t("ر.س", "SAR")}`}</Text>
                <Text style={[styles.offerOldPrice, { color: colors.muted }]}>{offer.oldPrice} {t("ر.س", "SAR")}</Text>
              </View>
              <View style={[styles.codeBadge, { backgroundColor: "#00E0B8" + "15", flexDirection: "row-reverse", alignItems: "center", gap: 4 }]}>
                <Feather name="copy" size={11} color="#00E0B8" />
                <Text style={[styles.codeText, { color: "#00E0B8" }]}>{offer.code}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Offer Detail Modal */}
      <Modal visible={!!selectedOffer} transparent animationType="slide" onRequestClose={() => setSelectedOffer(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedOffer(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.offerModal, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
              {selectedOffer && (
                <>
                  <View style={styles.offerModalHandle} />
                  <View style={[styles.offerModalBadge, { backgroundColor: selectedOffer.color }]}>
                    <Text style={styles.offerModalBadgeTxt}>{t(`خصم ${selectedOffer.discount}%`, `${selectedOffer.discount}% OFF`)}</Text>
                  </View>
                  <Text style={[styles.offerModalTitle, { color: colors.text }]}>{t(selectedOffer.titleAr, selectedOffer.titleEn)}</Text>
                  <View style={styles.offerModalPriceRow}>
                    <Text style={[styles.offerModalPrice, { color: selectedOffer.color }]}>
                      {selectedOffer.price === 0 ? t("مجاناً 🎁", "Free 🎁") : `${selectedOffer.price} ${t("ر.س", "SAR")}`}
                    </Text>
                    <Text style={[styles.offerModalOld, { color: colors.muted }]}>{selectedOffer.oldPrice} {t("ر.س", "SAR")}</Text>
                  </View>

                  <View style={[styles.offerModalCodeBox, { backgroundColor: selectedOffer.color + "12", borderColor: selectedOffer.color + "40" }]}>
                    <Text style={[styles.offerModalCodeLabel, { color: colors.muted }]}>{t("كود الخصم", "Discount Code")}</Text>
                    <Text style={[styles.offerModalCode, { color: selectedOffer.color }]}>{selectedOffer.code}</Text>
                    <Pressable
                      style={[styles.offerModalCopyBtn, { backgroundColor: copiedOfferCode ? "#22C55E" : selectedOffer.color }]}
                      onPress={() => copyOfferCode(selectedOffer.code)}
                    >
                      <Feather name={copiedOfferCode ? "check" : "copy"} size={15} color="#fff" />
                      <Text style={styles.offerModalCopyTxt}>{copiedOfferCode ? t("تم النسخ!", "Copied!") : t("انسخ الكود", "Copy Code")}</Text>
                    </Pressable>
                  </View>

                  <View style={[styles.offerModalInstr, { backgroundColor: isDark ? colors.card : "#F8F8F8", borderColor: colors.border }]}>
                    <Text style={[styles.offerModalInstrTitle, { color: colors.text }]}>📋 {t("كيفية استخدام الكود", "How to Use the Code")}</Text>
                    <Text style={[styles.offerModalInstrTxt, { color: colors.textSecondary }]}>{t('١. انسخ الكود بالضغط على "انسخ الكود" أعلاه', '1. Copy the code by tapping "Copy Code" above')}</Text>
                    <Text style={[styles.offerModalInstrTxt, { color: colors.textSecondary }]}>{t('٢. اختر الخدمة المطلوبة واضغط على "احجز الآن"', '2. Select the desired service and tap "Book Now"')}</Text>
                    <Text style={[styles.offerModalInstrTxt, { color: colors.textSecondary }]}>{t('٣. في خطوة الدفع، الصق الكود في خانة "كود الخصم"', '3. At checkout, paste the code in the "Discount Code" field')}</Text>
                    <Text style={[styles.offerModalInstrTxt, { color: colors.textSecondary }]}>{t("٤. سيُطبَّق الخصم تلقائياً على إجمالي الفاتورة", "4. The discount will be applied automatically to the total")}</Text>
                  </View>

                  <Pressable
                    style={[styles.offerModalCloseBtn, { backgroundColor: isDark ? colors.card : "#F3F4F6", borderColor: colors.border }]}
                    onPress={() => setSelectedOffer(null)}
                  >
                    <Text style={[styles.offerModalCloseTxt, { color: colors.muted }]}>{t("إغلاق", "Close")}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ─── الكفاءات المتاحة ─── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{t("الكفاءات المتاحة", "Available Specialists")} ⭐</Text>
          <Pressable onPress={() => router.push("/section/clinics" as any)}>
            <Text style={[styles.seeAllText, { color: "#00E0B8" }]}>{t("عرض الكل", "View All")}</Text>
          </Pressable>
        </View>
        <View style={{ height: 12 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse" }}>
          {SPECIALISTS.filter((s) => s.available).map((spec) => (
            <View key={spec.id} style={[styles.specCard, { backgroundColor: isDark ? colors.card : "#FFFFFF", borderColor: colors.border }]}>
              <View style={[styles.specAvatar, { backgroundColor: "#00E0B8" + "20" }]}>
                <Text style={{ fontSize: 20 }}>👨‍⚕️</Text>
              </View>
              <Text style={[styles.specName, { color: colors.text }]}>{t(spec.nameAr, spec.nameEn)}</Text>
              <Text style={[styles.specSpecialty, { color: colors.muted }]}>{t(spec.specialtyAr, spec.specialtyEn)}</Text>
              <View style={styles.specRatingRow}>
                <Text style={[styles.specPrice, { color: "#00E0B8" }]}>{spec.price} {t("ر.س", "SAR")}</Text>
                <View style={styles.ratingRow}>
                  <Text style={{ color: "#F5D26A", fontSize: 12 }}>⭐</Text>
                  <Text style={[styles.ratingText, { color: colors.muted }]}>{spec.rating}</Text>
                </View>
              </View>
              <Pressable style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>{t("احجز", "Book")}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ─── المختبرات والعيادات القريبة ─── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>{t("المختبرات والعيادات القريبة", "Nearby Labs & Clinics")} 📍</Text>
          <Pressable onPress={() => router.push("/section/clinics" as any)}>
            <Text style={[styles.seeAllText, { color: "#3B82F6" }]}>{t("عرض الكل", "View All")}</Text>
          </Pressable>
        </View>
        <View style={{ height: 12 }} />
        {LABS_AND_CLINICS.map((item) => {
          const isExpanded = expandedLabId === item.id;
          return (
            <View key={item.id} style={[styles.labCard, { backgroundColor: isDark ? colors.card : "#FFFFFF", borderColor: isExpanded ? item.color : colors.border }]}>
              <Pressable
                style={styles.labCardHeader}
                onPress={() => setExpandedLabId(isExpanded ? null : item.id)}
              >
                <View style={[styles.labIcon, { backgroundColor: item.color + "15", overflow: "hidden" }]}>
                  <Image
                    source={LAB_IMAGES[item.type as keyof typeof LAB_IMAGES]}
                    style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.35 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontSize: 22, zIndex: 1 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
                    <Text style={[styles.labName, { color: colors.text }]}>{t(item.nameAr, item.nameEn)}</Text>
                    <View style={[styles.labTypeBadge, { backgroundColor: item.color + "15" }]}>
                      <Text style={[styles.labTypeBadgeText, { color: item.color }]}>
                        {item.type === "lab" ? t("مختبر", "Lab") : t("عيادة", "Clinic")}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.labMeta, { color: colors.muted }]}>{item.distance} • {t(item.infoAr, item.infoEn)} • ⭐ {item.rating}</Text>
                </View>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={isExpanded ? item.color : colors.muted} />
              </Pressable>
              {isExpanded && (
                <View style={[styles.labDropdown, { borderTopColor: colors.border }]}>
                  {/* Status + Hours */}
                  <View style={styles.labDropdownRow}>
                    <View style={[styles.labDropdownChip, { backgroundColor: item.isOpen ? "#22C55E15" : "#EF444415" }]}>
                      <View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.isOpen ? "#22C55E" : "#EF4444" }]} />
                      <Text style={[styles.labDropdownChipTxt, { color: item.isOpen ? "#22C55E" : "#EF4444" }]}>
                        {item.isOpen ? t("مفتوح الآن", "Open Now") : t("مغلق الآن", "Closed Now")}
                      </Text>
                    </View>
                    <View style={[styles.labDropdownChip, { backgroundColor: item.color + "12" }]}>
                      <Feather name="map-pin" size={11} color={item.color} />
                      <Text style={[styles.labDropdownChipTxt, { color: item.color }]}>{t(item.addressAr, item.addressEn)}</Text>
                    </View>
                  </View>
                  {/* Working Hours */}
                  <View style={[styles.labDropdownChip, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F8F8", borderColor: colors.border, borderWidth: 1, alignSelf: "stretch" }]}>
                    <Feather name="clock" size={11} color={colors.muted} />
                    <Text style={[styles.labDropdownChipTxt, { color: colors.muted }]}>{t(item.workingHoursAr, item.workingHoursEn)}</Text>
                  </View>
                  {/* Features */}
                  <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 }}>
                    {(lang === "en" ? item.featuresEn : item.featuresAr).map((f: string, fi: number) => (
                      <View key={fi} style={[styles.labDropdownChip, { backgroundColor: item.color + "10" }]}>
                        <Text style={{ fontSize: 10 }}>✓</Text>
                        <Text style={[styles.labDropdownChipTxt, { color: item.color }]}>{f}</Text>
                      </View>
                    ))}
                  </View>
                  {/* Tests / Services */}
                  <View style={[{ borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.border }]}>
                    <View style={[styles.labDropdownChip, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", padding: 10, borderRadius: 0 }]}>
                      <Text style={[styles.labDropdownChipTxt, { color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 12 }]}>
                        {item.type === "lab" ? t("🔬 أبرز التحاليل", "🔬 Top Tests") : t("🏥 الخدمات المتاحة", "🏥 Available Services")}
                      </Text>
                    </View>
                    {(lang === "en" ? item.testsEn : item.testsAr).map((test: { name: string; price: number }, ti: number) => (
                      <View key={ti} style={[{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: ti === 0 ? 0 : 1, borderTopColor: colors.border }]}>
                        <Text style={[{ color: colors.text, fontSize: 13, fontFamily: "Tajawal_500Medium" }]}>{test.name}</Text>
                        <Text style={[{ color: item.color, fontSize: 13, fontFamily: "Tajawal_700Bold" }]}>{test.price} {t("ر.س", "SAR")}</Text>
                      </View>
                    ))}
                  </View>
                  {/* Actions */}
                  <View style={styles.labDropdownActions}>
                    <Pressable
                      style={[styles.labActionBtn, { backgroundColor: item.color }]}
                      onPress={() => router.push(`/providers/detail/${item.type}-${item.id}?type=${item.type === "lab" ? "labs" : "clinics"}` as any)}
                    >
                      <Feather name="calendar" size={14} color="#fff" />
                      <Text style={styles.labActionBtnTxt}>{item.type === "lab" ? t("اطلب تحليل", "Request Test") : t("احجز موعد", "Book Appointment")}</Text>
                    </Pressable>
                    <Pressable style={[styles.labActionBtnOutline, { borderColor: item.color }]}>
                      <Feather name="phone" size={14} color={item.color} />
                      <Text style={[styles.labActionBtnOutlineTxt, { color: item.color }]}>{t("اتصل", "Call")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* ─── صحتك اليوم ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("صحتك اليوم", "Today's Health")} 💚</Text>

        <View style={styles.dashRow}>
          <Pressable style={[styles.dashCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <Image source={require("@/assets/images/yoga-sunrise.png")} style={styles.dashCardImg} resizeMode="cover" />
            <LinearGradient colors={["transparent", isDark ? "rgba(14,8,24,0.95)" : "rgba(255,255,255,0.95)"]} style={styles.dashCardOverlay}>
              <View style={styles.dashCardContent}>
                <Text style={{ fontSize: 24 }}>❤️</Text>
                <Text style={[styles.dashCardVal, { color: "#F43F5E" }]}>78</Text>
                <Text style={[styles.dashCardUnit, { color: colors.muted }]}>{t("نبضة/دقيقة", "bpm")}</Text>
              </View>
              <Text style={[styles.dashCardLabel, { color: colors.text }]}>{t("معدل القلب", "Heart Rate")}</Text>
              <View style={styles.dashPulseBar}>
                <View style={[styles.dashPulseFill, { width: "78%", backgroundColor: "#F43F5E" }]} />
              </View>
            </LinearGradient>
          </Pressable>
          <View style={styles.dashColRight}>
            <View style={[styles.dashMini, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashMiniVal, { color: "#F59E0B" }]}>{caloriesConsumed}</Text>
                <Text style={[styles.dashMiniLabel, { color: colors.muted }]}>{t("سعرة حرارية", "Calories")}</Text>
              </View>
            </View>
            <View style={[styles.dashMini, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Text style={{ fontSize: 18 }}>😴</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashMiniVal, { color: "#8B5CF6" }]}>{sleepHours}h</Text>
                <Text style={[styles.dashMiniLabel, { color: colors.muted }]}>{t("ساعات النوم", "Sleep Hours")}</Text>
              </View>
            </View>
            <Pressable style={[styles.dashMini, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]} onPress={addWaterGlass}>
              <Text style={{ fontSize: 18 }}>💧</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dashMiniVal, { color: "#3B82F6" }]}>{waterIntake.glasses}/8</Text>
                <Text style={[styles.dashMiniLabel, { color: colors.muted }]}>{t("أكواب ماء", "Water Cups")}</Text>
              </View>
              <View style={[styles.waterPlusBtn, { backgroundColor: "#3B82F6" + "20" }]}>
                <Feather name="plus" size={14} color="#3B82F6" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ─── نشاطي الاسبوعي ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("نشاطي الاسبوعي", "Weekly Activity")} 📊</Text>
        <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#FFFFFF", borderColor: colors.border }]}>
          <View style={styles.chartTabsRow}>
            {([
              { key: "steps" as const, labelAr: "خطوات", labelEn: "Steps", emoji: "👟" },
              { key: "sleep" as const, labelAr: "نوم",    labelEn: "Sleep", emoji: "😴" },
              { key: "water" as const, labelAr: "ماء",    labelEn: "Water", emoji: "💧" },
            ]).map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setChartTab(tab.key)}
                style={[styles.chartTabBtn, { backgroundColor: chartTab === tab.key ? chartColor + "15" : "transparent" }]}
              >
                <Text style={{ fontSize: 14 }}>{tab.emoji}</Text>
                <Text style={[styles.chartTabText, { color: chartTab === tab.key ? chartColor : colors.muted }]}>{t(tab.labelAr, tab.labelEn)}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.chartBars}>
            {WEEK_DATA.map((d) => {
              const val = d[chartDataKey] as number;
              const h   = Math.max(8, (val / chartMax) * 100);
              return (
                <View key={d.dayAr} style={styles.chartBarCol}>
                  <View style={[styles.chartBar, { height: h, backgroundColor: chartColor }]} />
                  <Text style={[styles.chartLabel, { color: colors.muted }]}>{lang === "en" ? d.dayEn : d.dayAr}</Text>
                </View>
              );
            })}
          </View>
          <View style={[styles.chartLegend, { borderTopColor: "rgba(168,85,247,0.1)" }]}>
            <Text style={[styles.chartLegendText, { color: colors.muted }]}>{chartLabel}</Text>
            <Text style={[styles.chartLegendValue, { color: colors.text }]}>{chartCurrentVal}</Text>
          </View>
        </View>
      </View>

      {/* ─── الماكرو اليومي (opens nutrition modal) ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        <Pressable
          onPress={() => setShowNutritionModal(true)}
          style={[styles.macroCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
        >
          <View style={styles.macroHeader}>
            <Image source={require("@/assets/images/smoothie-bowl.png")} style={styles.macroImg} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.macroTitle, { color: colors.text }]}>{t("الماكرو اليومي", "Daily Macros")}</Text>
              <Text style={[styles.macroSub, { color: colors.muted }]}>{todayNutrition.calories} / {nutritionGoal.calories} {t("سعرة", "kcal")}</Text>
              <View style={styles.macroTotalBar}>
                <View style={[styles.macroTotalFill, { width: `${Math.min(100, (todayNutrition.calories / nutritionGoal.calories) * 100)}%` }]} />
              </View>
            </View>
            <Pressable
              style={styles.addMealFloatBtn}
              onPress={() => setShowNutritionModal(true)}
            >
              <Feather name="plus" size={16} color="#fff" />
              <Text style={styles.addMealFloatText}>{t("إضافة وجبة", "Add Meal")}</Text>
            </Pressable>
          </View>
          <View style={styles.macroRows}>
            {[
              { labelAr: "بروتين",      labelEn: "Protein", val: todayNutrition.protein, goal: nutritionGoal.protein, color: "#F43F5E", emoji: "🥩" },
              { labelAr: "كربوهيدرات", labelEn: "Carbs",   val: todayNutrition.carbs,   goal: nutritionGoal.carbs,   color: "#F59E0B", emoji: "🍞" },
              { labelAr: "دهون",        labelEn: "Fats",    val: todayNutrition.fat,     goal: nutritionGoal.fat,     color: "#22C55E", emoji: "🥑" },
              { labelAr: "ألياف",       labelEn: "Fiber",   val: todayNutrition.fiber,   goal: nutritionGoal.fiber,   color: "#3B82F6", emoji: "🥬" },
            ].map((m) => (
              <View key={m.labelAr} style={styles.macroRow}>
                <View style={styles.macroRowLeft}>
                  <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                  <Text style={[styles.macroRowLabel, { color: colors.text }]}>{t(m.labelAr, m.labelEn)}</Text>
                </View>
                <View style={styles.macroBarContainer}>
                  <View style={[styles.macroBarBg, { backgroundColor: m.color + "15" }]}>
                    <View style={[styles.macroBarFill, { width: `${Math.min(100, (m.val / m.goal) * 100)}%`, backgroundColor: m.color }]} />
                  </View>
                </View>
                <Text style={[styles.macroRowVal, { color: m.color }]}>{m.val}/{m.goal}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.macroTapHint, { borderTopColor: colors.border }]}>
            <Feather name="chevron-up" size={14} color={colors.muted} />
            <Text style={[styles.macroTapHintText, { color: colors.muted }]}>{t("اضغط لفتح صفحة التغذية الكاملة", "Tap to open the full nutrition page")}</Text>
          </View>
        </Pressable>
      </View>

      {/* ─── منحنى الوزن ─── */}
      <View style={{ paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.push("/weight-history" as any)} style={[styles.weightCurveCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.weightCurveHeader}>
            <View style={styles.weightCurveLeft}>
              <Text style={{ fontSize: 20 }}>⚖️</Text>
              <View>
                <Text style={[styles.weightCurveTitle, { color: colors.text }]}>{t("منحنى الوزن", "Weight Trend")}</Text>
                <Text style={[styles.weightCurveSub, { color: colors.muted }]}>{t("آخر 4 أسابيع", "Last 4 weeks")}</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.weightCurrentText}>{currentWeight} {t("كجم", "kg")}</Text>
              {weightHistory.length >= 2 && (() => {
                const diff = +(currentWeight - weightHistory[0].weight).toFixed(1);
                const trending = diff <= 0;
                return (
                  <View style={styles.weightTrendBadge}>
                    <Feather name={trending ? "trending-down" : "trending-up"} size={12} color={trending ? "#22C55E" : "#EF4444"} />
                    <Text style={{ color: trending ? "#22C55E" : "#EF4444", fontSize: 11, fontFamily: "Tajawal_700Bold" }}>
                      {diff > 0 ? "+" : ""}{diff}
                    </Text>
                  </View>
                );
              })()}
            </View>
          </View>
          <View style={styles.weightCurveArea}>
            {(() => {
              const last7   = weightHistory.slice(-7);
              const weights = last7.map((e) => e.weight);
              const labels  = last7.map((_, i) => String(i + 1));
              const minW    = Math.min(...weights) - 0.5;
              const maxW    = Math.max(...weights) + 0.5;
              const chartH  = 80;
              return (
                <View style={{ height: chartH + 30 }}>
                  <View style={styles.weightGridLines}>
                    {[0, 1, 2, 3].map((i) => (
                      <View key={i} style={[styles.weightGridLine, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }]} />
                    ))}
                  </View>
                  <View style={styles.weightDotsRow}>
                    {weights.map((w, i) => {
                      const y = chartH - ((w - minW) / (maxW - minW)) * chartH;
                      return (
                        <View key={i} style={styles.weightDotCol}>
                          <View style={{ height: chartH, justifyContent: "flex-start" }}>
                            <View style={[styles.weightDotOuter, { marginTop: y }]}>
                              <View style={styles.weightDotInner} />
                            </View>
                          </View>
                          <Text style={[styles.weightDotLabel, { color: colors.muted }]}>{labels[i]}</Text>
                          <Text style={[styles.weightDotValText, { color: colors.muted }]}>{w}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })()}
          </View>
          <Pressable style={styles.updateWeightBtn} onPress={() => setShowWeightModal(true)}>
            <Feather name="edit-3" size={14} color="#fff" />
            <Text style={styles.updateWeightBtnText}>{t("تحديث الوزن", "Update Weight")}</Text>
          </Pressable>
        </Pressable>
      </View>

      {/* ─── نقاط الصحة ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 0 }}>
        <HealthPointsBar isDark={isDark} todayPoints={todayPoints} />
      </View>

      {/* ─── التغذية وتمرين اليوم ─── */}
      <View style={{ paddingHorizontal: 20 }}>
        <QuickActionsRow
          isDark={isDark}
          caloriesConsumed={caloriesConsumed}
          nutritionGoal={nutritionGoal}
          todayNutrition={todayNutrition}
        />
      </View>

      {/* ─── عداد العادات اليومية ─── */}
      <View style={{ paddingHorizontal: 20, marginTop: 0 }}>
        <HabitsBar isDark={isDark} colors={colors} />
      </View>

      <View style={{ height: 20 }} />

      {/* ─── MODALS ─── */}

      {/* Notifications Modal */}
      <Modal visible={showNotifications} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t("الإشعارات", "Notifications")} 🔔</Text>
              <Pressable onPress={() => setShowNotifications(false)}>
                <Feather name="x" size={22} color={colors.text} />
              </Pressable>
            </View>
            {[
              {
                titleAr: "موعدك غداً",          titleEn: "Tomorrow's Appointment",
                bodyAr:  "استشارة تغذية مع د.سارة الأحمدي الساعة 10:00 ص",
                bodyEn:  "Nutrition consultation with Dr. Sara Al-Ahmadi at 10:00 AM",
                timeAr:  "منذ ساعة",   timeEn: "1 hour ago",   emoji: "📅",
              },
              {
                titleAr: "عرض جديد!",           titleEn: "New Offer!",
                bodyAr:  "خصم 56% على استشارة تغذية - استخدم كود ELIXIR56",
                bodyEn:  "56% off nutrition consultation - use code ELIXIR56",
                timeAr:  "منذ 3 ساعات", timeEn: "3 hours ago", emoji: "🔥",
              },
              {
                titleAr: "تذكير شرب الماء",      titleEn: "Water Reminder",
                bodyAr:  "شربت 4 أكواب فقط اليوم، حاول الوصول لـ 8 أكواب",
                bodyEn:  "You've had only 4 cups today, try to reach 8 cups",
                timeAr:  "منذ 5 ساعات", timeEn: "5 hours ago", emoji: "💧",
              },
            ].map((n, i) => (
              <View key={i} style={[styles.notifCard, { borderColor: colors.border }]}>
                <Text style={{ fontSize: 24 }}>{n.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.notifTitle, { color: colors.text }]}>{t(n.titleAr, n.titleEn)}</Text>
                  <Text style={[styles.notifBody, { color: colors.muted }]}>{t(n.bodyAr, n.bodyEn)}</Text>
                  <Text style={[styles.notifTime, { color: colors.muted }]}>{t(n.timeAr, n.timeEn)}</Text>
                </View>
              </View>
            ))}
            <Pressable style={styles.notifCloseBtn} onPress={() => setShowNotifications(false)}>
              <Text style={styles.notifCloseBtnText}>{t("إغلاق", "Close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Weight Modal */}
      <Modal visible={showWeightModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t("تحديث الوزن", "Update Weight")} ⚖️</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[styles.weightInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]}
                placeholder={t("أدخل وزنك الحالي (كجم)", "Enter your current weight (kg)")}
                placeholderTextColor={colors.muted}
                value={newWeight}
                onChangeText={setNewWeight}
                keyboardType="decimal-pad"
                textAlign="center"
              />
              <Pressable
                onPress={() => Keyboard.dismiss()}
                style={{ position: "absolute", left: 12, top: 0, bottom: 0, justifyContent: "center", alignItems: "center", width: 36 }}
              >
                <Feather name="chevron-down" size={20} color={colors.muted} />
              </Pressable>
            </View>
            <Pressable
              style={[styles.photoUploadBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", borderColor: colors.border }]}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.7,
                });
                if (!result.canceled && result.assets[0]) {
                  setWeightPhotoUri(result.assets[0].uri);
                }
              }}
            >
              {weightPhotoUri ? (
                <Image source={{ uri: weightPhotoUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Feather name="camera" size={24} color={colors.muted} />
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 13, marginTop: 4 }}>{t("إضافة صورة (قبل/بعد)", "Add Photo (before/after)")}</Text>
                </View>
              )}
            </Pressable>
            <TextInput
              style={[styles.weightInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border, marginTop: 8 }]}
              placeholder={t("ملاحظة (اختياري)", "Note (optional)")}
              placeholderTextColor={colors.muted}
              value={weightNote}
              onChangeText={setWeightNote}
              textAlign={lang === "en" ? "left" : "right"}
            />
            <View style={styles.modalBtns}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#22C55E" }]}
                onPress={() => {
                  const w = parseFloat(newWeight);
                  if (isNaN(w) || w < 20 || w > 300) {
                    Alert.alert(t("خطأ", "Error"), t("يرجى إدخال وزن صحيح", "Please enter a valid weight"));
                    return;
                  }
                  addWeightEntry({ date: new Date().toISOString().split("T")[0], weight: w, photoUri: weightPhotoUri, note: weightNote || undefined });
                  Alert.alert(t("تم", "Done"), t(`تم تحديث الوزن إلى ${w} كجم`, `Weight updated to ${w} kg`));
                  setShowWeightModal(false);
                  setNewWeight("");
                  setWeightPhotoUri(undefined);
                  setWeightNote("");
                }}
              >
                <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold" }}>{t("حفظ", "Save")}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.border }]}
                onPress={() => { setShowWeightModal(false); setWeightPhotoUri(undefined); setWeightNote(""); }}
              >
                <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>{t("إلغاء", "Cancel")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nutrition Modal */}
      <Modal visible={showNutritionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.nutritionModalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowNutritionModal(false)}>
                <Feather name="x" size={22} color={colors.text} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>📊 {t("التغذية اليومية", "Daily Nutrition")}</Text>
            </View>

            {/* Calorie ring summary */}
            <View style={[styles.nutritionCalorieRow, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5", borderRadius: 20, padding: 16 }]}>
              <View style={styles.nutritionCalorieCenter}>
                <Text style={[styles.nutritionBigCal, { color: "#00C4A0" }]}>{todayNutrition.calories}</Text>
                <Text style={[styles.nutritionCalLabel, { color: colors.muted }]}>{t("سعرة من", "kcal of")} {nutritionGoal.calories}</Text>
                <View style={[styles.nutritionCalBar, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}>
                  <View style={[styles.nutritionCalBarFill, { width: `${Math.min(100, (todayNutrition.calories / nutritionGoal.calories) * 100)}%` }]} />
                </View>
              </View>
              <View style={styles.nutritionQuickStats}>
                <View style={styles.nutritionQuickStat}>
                  <Text style={{ fontSize: 18 }}>💧</Text>
                  <Text style={[styles.nutritionQuickVal, { color: "#3B82F6" }]}>{waterIntake.glasses}/8</Text>
                  <Text style={[styles.nutritionQuickLbl, { color: colors.muted }]}>{t("ماء", "Water")}</Text>
                </View>
                <View style={styles.nutritionQuickStat}>
                  <Text style={{ fontSize: 18 }}>🔥</Text>
                  <Text style={[styles.nutritionQuickVal, { color: "#F59E0B" }]}>{nutritionGoal.calories - todayNutrition.calories}</Text>
                  <Text style={[styles.nutritionQuickLbl, { color: colors.muted }]}>{t("متبقي", "Left")}</Text>
                </View>
              </View>
            </View>

            {/* Macros */}
            <View style={{ gap: 10, marginTop: 8 }}>
              {[
                { labelAr: "بروتين",      labelEn: "Protein", val: todayNutrition.protein, goal: nutritionGoal.protein, color: "#F43F5E", emoji: "🥩" },
                { labelAr: "كربوهيدرات", labelEn: "Carbs",   val: todayNutrition.carbs,   goal: nutritionGoal.carbs,   color: "#F59E0B", emoji: "🍞" },
                { labelAr: "دهون",        labelEn: "Fats",    val: todayNutrition.fat,     goal: nutritionGoal.fat,     color: "#22C55E", emoji: "🥑" },
                { labelAr: "ألياف",       labelEn: "Fiber",   val: todayNutrition.fiber,   goal: nutritionGoal.fiber,   color: "#3B82F6", emoji: "🥬" },
              ].map((m) => (
                <View key={m.labelAr} style={styles.macroRow}>
                  <View style={styles.macroRowLeft}>
                    <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                    <Text style={[styles.macroRowLabel, { color: colors.text }]}>{t(m.labelAr, m.labelEn)}</Text>
                  </View>
                  <View style={styles.macroBarContainer}>
                    <View style={[styles.macroBarBg, { backgroundColor: m.color + "15" }]}>
                      <View style={[styles.macroBarFill, { width: `${Math.min(100, (m.val / m.goal) * 100)}%`, backgroundColor: m.color }]} />
                    </View>
                  </View>
                  <Text style={[styles.macroRowVal, { color: m.color }]}>{m.val}/{m.goal}</Text>
                </View>
              ))}
            </View>

            {/* Water strip */}
            <View style={[styles.waterStrip, { backgroundColor: isDark ? colors.surfaceAlt : "#EFF6FF" }]}>
              <Pressable
                style={[styles.waterAddBtn, { backgroundColor: "#3B82F6" }]}
                onPress={addWaterGlass}
              >
                <Feather name="plus" size={16} color="#fff" />
              </Pressable>
              <View style={styles.waterGlasses}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <View
                    key={i}
                    style={[styles.waterGlass, { backgroundColor: i < waterIntake.glasses ? "#3B82F6" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(59,130,246,0.12)") }]}
                  />
                ))}
              </View>
              <Text style={[styles.waterLabel, { color: "#3B82F6" }]}>💧 {waterIntake.glasses}/8 {t("أكواب", "cups")}</Text>
            </View>

            <Pressable
              style={styles.openFullNutritionBtn}
              onPress={() => { setShowNutritionModal(false); setTimeout(() => router.push("/section/nutrition-plan" as any), 200); }}
            >
              <Feather name="external-link" size={15} color="#fff" />
              <Text style={styles.openFullNutritionText}>{t("فتح صفحة التغذية الكاملة", "Open Full Nutrition Page")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Points Notification */}
      {pointsNotification && (
        <RNAnimated.View style={[styles.pointsNotif, { top: notifAnim, backgroundColor: isDark ? "#1C1330" : "#fff" }]}>
          <View style={[styles.pointsNotifIcon, { backgroundColor: pointsBarColor + "20" }]}>
            <Text style={{ fontSize: 22 }}>{pointsNotification.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pointsNotifTitle, { color: colors.text }]}>+{pointsNotification.points} {t("نقطة!", "points!")}</Text>
            <Text style={[styles.pointsNotifReason, { color: colors.muted }]}>{pointsNotification.reason}</Text>
          </View>
          <Pressable onPress={dismissPointsNotification}>
            <Feather name="x" size={16} color={colors.muted} />
          </Pressable>
        </RNAnimated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  headerInfo: {},
  logoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  logoImage: { width: 32, height: 32 },
  appTitle: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  headerActions: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: "#F43F5E" },
  planBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  planBadgeText: { color: "#00E0B8", fontSize: 11, fontFamily: "Tajawal_700Bold" },

  summarySection: { marginTop: 8 },
  greetingRow: { marginBottom: 16 },
  greeting: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  dateText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  motiveCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  motiveRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingVertical: 6 },
  motiveWeather: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  motiveDate: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  motiveDivider: { height: 1, marginVertical: 6 },
  motiveQuote: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right", flex: 1, lineHeight: 22 },
  motiveAndPointsRow: { flexDirection: "row-reverse", gap: 10 },
  pointsBox: { flex: 1, borderRadius: 18, padding: 14, borderWidth: 1 },
  pointsBoxHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginBottom: 8 },
  pointsBoxTitle: { fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pointsScoreRow: { flexDirection: "row-reverse", alignItems: "baseline", gap: 2, marginBottom: 8 },
  pointsScoreNum: { fontSize: 32, fontFamily: "Cairo_700Bold" },
  pointsScoreMax: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  pointsBarBg: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 10 },
  pointsBarFill: { height: "100%", borderRadius: 4 },
  pointsCatsRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 8 },
  pointsCatItem: { alignItems: "center", gap: 2 },
  pointsCatVal: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  pointsMonthlyRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  pointsMonthlyLabel: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  pointsMonthlyVal: { fontSize: 13, fontFamily: "Tajawal_700Bold" },

  miniSectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  inlineTipCard: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 16, padding: 14, borderWidth: 1, marginTop: 14 },
  inlineTipLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 3 },
  inlineTipText: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "right", lineHeight: 20 },
  apptMiniCard: { width: 140, borderRadius: 16, padding: 12, borderWidth: 1, gap: 6, alignItems: "center" },
  apptMiniIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  apptMiniService: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  apptMiniTime: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  apptMiniStatus: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  apptMiniStatusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  apptEmptyStrip: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  apptEmptyTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  apptEmptySub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  apptEmptyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "#00C4A0", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  apptEmptyBtnText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },

  heroBanner: { borderRadius: 22, overflow: "hidden", height: 170, position: "relative" },
  heroBannerImage: { width: "100%", height: "100%", position: "absolute" },
  shimmerLayer: { backgroundColor: "#fff" },
  heroBannerContent: { position: "absolute", bottom: 16, right: 16, left: 16 },
  bannerBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 5, alignSelf: "flex-end", backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  bannerLiveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#22C55E" },
  bannerLiveText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  clinicBannerTitle: { color: "#fff", fontSize: 19, fontFamily: "Cairo_700Bold", textAlign: "right" },
  clinicBannerSub: { color: "rgba(255,255,255,0.88)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  clinicBannerBtns: { flexDirection: "row-reverse", gap: 8, marginTop: 12 },
  clinicBannerBtn: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  clinicBannerBtnTxt: { color: "#00C4A0", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  clinicBannerGhostBtn: { borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  clinicBannerGhostTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_500Medium" },

  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 14 },
  sectionHeaderRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  seeAllText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  servicesGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  serviceItemOuter: { width: (width - 64) / 3, aspectRatio: 0.95, borderRadius: 26, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 5 },
  serviceItemBig: { flex: 1, paddingVertical: 16, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 26 },
  serviceEmojiCircle: { width: 70, height: 70, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.32)" },
  serviceEmojiGradient: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  serviceTitleBig: { fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "center", color: "#fff", lineHeight: 18 },

  offerCard: { width: 200, borderRadius: 18, padding: 16, marginLeft: 12, borderWidth: 1, gap: 8 },
  discountBadge: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  offerTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  offerPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  offerPrice: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  offerOldPrice: { fontSize: 13, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  codeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  codeText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },

  specCard: { width: 160, borderRadius: 18, padding: 14, marginLeft: 12, borderWidth: 1, alignItems: "center", gap: 6 },
  specAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  specName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  specSpecialty: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  specRatingRow: { flexDirection: "row-reverse", justifyContent: "space-between", width: "100%", alignItems: "center" },
  specPrice: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  bookBtn: { backgroundColor: "#00C4A0", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 8, marginTop: 4 },
  bookBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  labCard: { borderRadius: 16, marginBottom: 10, borderWidth: 1, overflow: "hidden" },
  labCardHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14 },
  labDropdown: { borderTopWidth: 1, padding: 14, gap: 10 },
  labDropdownRow: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" },
  labDropdownChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  labDropdownChipTxt: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  labDropdownActions: { flexDirection: "row-reverse", gap: 10 },
  labActionBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 12 },
  labActionBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  labActionBtnOutline: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5 },
  labActionBtnOutlineTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  labIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  labName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  labMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  labTypeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  labTypeBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  labBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  labBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },

  dashRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 14 },
  dashCard: { flex: 1.2, borderRadius: 20, borderWidth: 1, overflow: "hidden", height: 200 },
  dashCardImg: { width: "100%", height: "100%", position: "absolute" },
  dashCardOverlay: { flex: 1, justifyContent: "flex-end", padding: 14 },
  dashCardContent: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  dashCardVal: { fontSize: 28, fontFamily: "Tajawal_700Bold" },
  dashCardUnit: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  dashCardLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 6 },
  dashPulseBar: { height: 4, borderRadius: 2, backgroundColor: "rgba(244,63,94,0.2)" },
  dashPulseFill: { height: 4, borderRadius: 2 },
  dashColRight: { flex: 1, gap: 6 },
  dashMini: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 8, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1 },
  dashMiniVal: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  dashMiniLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  waterPlusBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  chartCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  chartTabsRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 14 },
  chartTabBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  chartTabText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  chartBars: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", height: 100, marginBottom: 12 },
  chartBarCol: { alignItems: "center", flex: 1, gap: 6 },
  chartBar: { width: 20, borderRadius: 6, minHeight: 8 },
  chartLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  chartLegend: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, paddingTop: 12 },
  chartLegendText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  chartLegendValue: { fontSize: 18, fontFamily: "Tajawal_700Bold" },

  macroCard: { borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 14 },
  macroHeader: { flexDirection: "row-reverse", gap: 12, alignItems: "center", marginBottom: 14 },
  macroImg: { width: 56, height: 56, borderRadius: 16 },
  macroTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  macroSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  macroTotalBar: { height: 4, borderRadius: 2, backgroundColor: "rgba(0,224,184,0.15)", marginTop: 6 },
  macroTotalFill: { height: 4, borderRadius: 2, backgroundColor: "#00E0B8" },
  addMealFloatBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "#00C4A0", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  addMealFloatText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  macroRows: { gap: 10 },
  macroRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  macroRowLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 6, width: 95 },
  macroRowLabel: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  macroBarContainer: { flex: 1 },
  macroBarBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  macroBarFill: { height: 8, borderRadius: 4 },
  macroRowVal: { fontSize: 12, fontFamily: "Tajawal_700Bold", width: 55, textAlign: "left" },
  macroTapHint: { flexDirection: "row-reverse", alignItems: "center", gap: 4, justifyContent: "center", paddingTop: 12, marginTop: 10, borderTopWidth: 1 },
  macroTapHintText: { fontSize: 11, fontFamily: "Tajawal_400Regular" },

  weightCurveCard: { borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 14 },
  weightCurveHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  weightCurveLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  weightCurveTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  weightCurveSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  weightCurrentText: { fontSize: 20, fontFamily: "Tajawal_700Bold", color: "#22C55E" },
  weightTrendBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#22C55E15", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  weightCurveArea: { paddingHorizontal: 4 },
  weightGridLines: { position: "absolute", left: 0, right: 0, top: 0, bottom: 30, justifyContent: "space-between" },
  weightGridLine: { height: 1 },
  weightDotsRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  weightDotCol: { alignItems: "center", flex: 1 },
  weightDotOuter: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#22C55E25", alignItems: "center", justifyContent: "center" },
  weightDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  weightDotLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginTop: 4 },
  weightDotValText: { fontSize: 9, fontFamily: "Tajawal_400Regular" },
  updateWeightBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: "#22C55E", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, alignSelf: "center", marginTop: 10 },
  updateWeightBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  tipCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  tipGradient: { padding: 18 },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  tipLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 6 },
  tipText: { fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right", lineHeight: 24 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  notifCard: { flexDirection: "row-reverse", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  notifTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  notifBody: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2, lineHeight: 20 },
  notifTime: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  notifCloseBtn: { backgroundColor: "#00C4A0", borderRadius: 14, paddingVertical: 12, alignItems: "center", marginTop: 8 },
  notifCloseBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  weightInput: { borderRadius: 14, padding: 16, borderWidth: 1, fontSize: 20, fontFamily: "Tajawal_700Bold" },
  photoUploadBtn: { borderRadius: 14, borderWidth: 1, borderStyle: "dashed", marginTop: 12, overflow: "hidden", alignItems: "center", justifyContent: "center", minHeight: 100 },
  photoPreview: { width: "100%", height: 160, borderRadius: 14 },
  photoPlaceholder: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  modalBtns: { flexDirection: "row-reverse", gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },

  nutritionModalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14, maxHeight: "88%" },
  nutritionCalorieRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16 },
  nutritionCalorieCenter: { flex: 1 },
  nutritionBigCal: { fontSize: 38, fontFamily: "Cairo_700Bold", textAlign: "right" },
  nutritionCalLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 8 },
  nutritionCalBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  nutritionCalBarFill: { height: 8, borderRadius: 4, backgroundColor: "#00C4A0" },
  nutritionQuickStats: { gap: 12 },
  nutritionQuickStat: { alignItems: "center", gap: 2 },
  nutritionQuickVal: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  nutritionQuickLbl: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  waterStrip: { flexDirection: "row-reverse", alignItems: "center", gap: 8, borderRadius: 14, padding: 12 },
  waterAddBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  waterGlasses: { flexDirection: "row-reverse", flex: 1, gap: 4 },
  waterGlass: { flex: 1, height: 20, borderRadius: 4 },
  waterLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  openFullNutritionBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#00C4A0", borderRadius: 16, paddingVertical: 14 },
  openFullNutritionText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },

  pointsNotif: { position: "absolute", left: 20, right: 20, flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, zIndex: 999, elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, borderWidth: 1, borderColor: "rgba(0,224,184,0.3)" },
  pointsNotifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  pointsNotifTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pointsNotifReason: { fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", marginTop: 2 },

  offerModal: { marginHorizontal: 16, marginBottom: 30, borderRadius: 28, padding: 24, gap: 14 },
  offerModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 4 },
  offerModalBadge: { alignSelf: "flex-end", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  offerModalBadgeTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  offerModalTitle: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  offerModalPriceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  offerModalPrice: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  offerModalOld: { fontSize: 14, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerModalCodeBox: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8, alignItems: "center" },
  offerModalCodeLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  offerModalCode: { fontSize: 24, fontFamily: "Cairo_700Bold", letterSpacing: 3 },
  offerModalCopyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  offerModalCopyTxt: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  offerModalInstr: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  offerModalInstrTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 2 },
  offerModalInstrTxt: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
  offerModalCloseBtn: { borderRadius: 14, borderWidth: 1, paddingVertical: 12, alignItems: "center" },
  offerModalCloseTxt: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
});
