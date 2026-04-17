import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Alert,
  Dimensions,
  I18nManager,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp, HomeEquipment } from "@/context/AppContext";
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
  isProVideo: boolean;
  equipment?: HomeEquipment[];
  homeAlt?: Exercise;
}

const DAYS_CONFIG: Record<string, { title: string; muscle: string; emoji: string; color: string; image: any; exercises: Exercise[] }> = {
  "0": {
    title: "الأحد",
    muscle: "صدر وترايسبس",
    emoji: "💪",
    color: "#F43F5E",
    image: require("@/assets/images/workout-chest.png"),
    exercises: [
      { id: "c1", name: "بنش بريس بار", sets: 4, reps: 12, restSeconds: 90, muscle: "صدر", instructions: ["استلقِ على البنش مع ثبات القدمين على الأرض", "امسك البار بعرض أكبر من الأكتاف", "انزل البار ببطء حتى يلمس الصدر", "ادفع البار للأعلى بقوة مع الزفير"], safetyTips: ["لا تقوّس ظهرك بشكل مبالغ فيه", "استخدم مساعد عند رفع أوزان ثقيلة"], isProVideo: true, equipment: ["barbell", "bench"], homeAlt: { id: "c1h", name: "بوش أب عادي", sets: 4, reps: 15, restSeconds: 60, muscle: "صدر", instructions: ["ضع يديك بعرض أكبر من الأكتاف", "انزل حتى يقترب صدرك من الأرض", "ادفع للأعلى بقوة"], safetyTips: ["حافظ على جسمك مستقيماً"], isProVideo: false } },
      { id: "c2", name: "بنش بريس دمبل مائل", sets: 3, reps: 12, restSeconds: 90, muscle: "صدر علوي", instructions: ["اضبط زاوية البنش على 30-45 درجة", "ارفع الدمبل للأعلى مع تقريبهما", "انزل ببطء مع فتح المرفقين"], safetyTips: ["حافظ على استقامة المعصم", "لا تنزل الدمبل أسفل مستوى الصدر"], isProVideo: true, equipment: ["dumbbells", "bench"], homeAlt: { id: "c2h", name: "بوش أب مائل (قدمين مرتفعة)", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر علوي", instructions: ["ضع قدميك على كرسي أو سرير", "يداك على الأرض بعرض الأكتاف", "انزل ببطء وادفع للأعلى"], safetyTips: ["حافظ على استقامة الجسم", "لا تدلّ الوسط"], isProVideo: false } },
      { id: "c3", name: "تفتيح صدر بالدمبل", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر", instructions: ["استلقِ على البنش المسطح", "ارفع الدمبل للأعلى مع انحناء خفيف في المرفق", "افتح ذراعيك ببطء للجانبين", "اجمع الدمبل مع الضغط على الصدر"], safetyTips: ["حافظ على انحناء خفيف في المرفق دائماً", "لا تستخدم أوزان ثقيلة جداً"], isProVideo: false, equipment: ["dumbbells", "bench"], homeAlt: { id: "c3h", name: "تفتيح بحبل المقاومة", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر", instructions: ["ثبت الحبل خلفك على ارتفاع الصدر", "ادفع للأمام مع تقريب اليدين", "ارجع ببطء"], safetyTips: ["حافظ على ثبات الجذع"], isProVideo: false } },
      { id: "c4", name: "ضغط صدر بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "صدر داخلي", instructions: ["قف بين جهازي الكابل", "ادفع للأمام مع الضغط", "ارجع ببطء للوضع الأول"], safetyTips: ["حافظ على ثبات الجذع", "لا تستخدم قوة الدفع بالجسم"], isProVideo: false, homeAlt: { id: "c4h", name: "بوش أب ضيق (دايموند)", sets: 3, reps: 12, restSeconds: 60, muscle: "صدر داخلي وترايسبس", instructions: ["ضع يديك قريبة من بعض على شكل ماسة", "انزل ببطء حتى يقترب صدرك من يديك", "ادفع للأعلى بقوة"], safetyTips: ["حافظ على المرفقين قريبين من جسمك"], isProVideo: false } },
      { id: "c5", name: "بوش أب", sets: 3, reps: 20, restSeconds: 60, muscle: "صدر وترايسبس", instructions: ["ضع يديك بعرض أكبر من الأكتاف", "انزل بجسمك حتى يقترب صدرك من الأرض", "ادفع للأعلى بقوة"], safetyTips: ["حافظ على جسمك مستقيماً", "لا تدلّ رأسك للأسفل"], isProVideo: false },
      { id: "c6", name: "ترايسبس بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["قف أمام جهاز الكابل العلوي", "امسك الحبل أو البار", "اضغط للأسفل مع تثبيت المرفقين", "ارجع ببطء للأعلى"], safetyTips: ["لا تحرك المرفقين للأمام أو الخلف", "حافظ على استقامة الظهر"], isProVideo: true, homeAlt: { id: "c6h", name: "ترايسبس ديبس على كرسي", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["ضع يديك على حافة كرسي ثابت", "مدّ رجليك للأمام", "انزل بجسمك ببطء بثني المرفقين", "ادفع للأعلى"], safetyTips: ["حافظ على ظهرك قريباً من الكرسي", "لا تنزل أكثر من 90 درجة"], isProVideo: false } },
      { id: "c7", name: "ديبس ترايسبس", sets: 3, reps: 12, restSeconds: 90, muscle: "ترايسبس", instructions: ["امسك قضبان الديبس", "انزل بجسمك ببطء", "ادفع للأعلى مع التركيز على الترايسبس"], safetyTips: ["لا تنزل أكثر من 90 درجة", "حافظ على ميل خفيف للأمام"], isProVideo: false, homeAlt: { id: "c7h", name: "ترايسبس كيكباك بالدمبل", sets: 3, reps: 12, restSeconds: 60, muscle: "ترايسبس", instructions: ["انحنِ للأمام مع إمساك دمبل", "مدّ ذراعك للخلف بالكامل", "ارجع ببطء"], safetyTips: ["حافظ على ثبات المرفق"], isProVideo: false, equipment: ["dumbbells"] } },
    ],
  },
  "1": {
    title: "الاثنين",
    muscle: "ظهر وبايسبس",
    emoji: "🏋️",
    color: "#3B82F6",
    image: require("@/assets/images/gym-training.png"),
    exercises: [
      { id: "b1", name: "سحب أمامي واسع", sets: 4, reps: 12, restSeconds: 90, muscle: "ظهر", instructions: ["اجلس على جهاز السحب الأمامي", "امسك البار بقبضة واسعة", "اسحب البار للأسفل حتى يصل للصدر", "ارجع ببطء للأعلى"], safetyTips: ["لا تسحب خلف الرقبة", "حافظ على استقامة الظهر"], isProVideo: true, homeAlt: { id: "b1h", name: "عقلة (بار عقلة)", sets: 4, reps: 8, restSeconds: 90, muscle: "ظهر", instructions: ["امسك البار بقبضة واسعة", "اسحب جسمك للأعلى حتى يتجاوز ذقنك البار", "انزل ببطء"], safetyTips: ["لا تتأرجح بالجسم"], isProVideo: false, equipment: ["pullupbar"] } },
      { id: "b2", name: "تجديف بالبار", sets: 4, reps: 12, restSeconds: 90, muscle: "ظهر أوسط", instructions: ["انحنِ للأمام بزاوية 45 درجة", "اسحب البار نحو البطن", "اضغط على عضلات الظهر في الأعلى", "انزل ببطء"], safetyTips: ["حافظ على استقامة الظهر", "لا تستخدم قوة الدفع"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "b2h", name: "تجديف بالدمبل منحني", sets: 4, reps: 12, restSeconds: 90, muscle: "ظهر أوسط", instructions: ["انحنِ للأمام مع دمبل في كل يد", "اسحب الدمبل نحو البطن", "اضغط واعصر الظهر"], safetyTips: ["حافظ على استقامة الظهر"], isProVideo: false, equipment: ["dumbbells"] } },
      { id: "b3", name: "تجديف بالدمبل يد واحدة", sets: 3, reps: 12, restSeconds: 60, muscle: "ظهر", instructions: ["ضع ركبة ويد على البنش", "اسحب الدمبل نحو الورك", "اضغط في الأعلى وانزل ببطء"], safetyTips: ["حافظ على ثبات الجذع", "لا تلف الجسم"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "b3h", name: "سحب بحبل المقاومة", sets: 3, reps: 15, restSeconds: 60, muscle: "ظهر", instructions: ["ثبت الحبل أمامك على ارتفاع منخفض", "اسحب نحو جسمك مع الضغط على الظهر", "ارجع ببطء"], safetyTips: ["حافظ على استقامة الظهر"], isProVideo: false, equipment: ["resistancebands"] } },
      { id: "b4", name: "سحب أرضي بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "ظهر سفلي", instructions: ["اجلس على جهاز الكابل السفلي", "اسحب المقبض نحو البطن", "اضغط على لوحتي الكتف معاً"], safetyTips: ["لا تميل للخلف بشكل مبالغ", "حافظ على انحناء خفيف في الركبتين"], isProVideo: false, homeAlt: { id: "b4h", name: "سوبرمان", sets: 3, reps: 15, restSeconds: 45, muscle: "ظهر سفلي", instructions: ["استلقِ على بطنك", "ارفع ذراعيك ورجليك في نفس الوقت", "ثبت لثانيتين وانزل ببطء"], safetyTips: ["لا ترفع عالياً جداً"], isProVideo: false } },
      { id: "b5", name: "بايسبس بالبار الزجزاج", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["قف مع إمساك البار الزجزاج", "ثبت المرفقين على جانبيك", "ارفع البار بتقلص البايسبس", "انزل ببطء"], safetyTips: ["لا تحرك المرفقين", "لا تستخدم تأرجح الجسم"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "b5h", name: "بايسبس بالدمبل واقف", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["امسك دمبل في كل يد", "ارفع بالتناوب مع لف المعصم", "انزل ببطء"], safetyTips: ["ثبت المرفقين"], isProVideo: false, equipment: ["dumbbells"] } },
      { id: "b6", name: "بايسبس بالدمبل جالس", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["اجلس على بنش مائل 45 درجة", "ارفع الدمبل بالتناوب", "لف المعصم في الأعلى"], safetyTips: ["حافظ على ظهرك ملتصقاً بالبنش", "لا ترفع أوزان ثقيلة جداً"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "b6h", name: "عقلة ضيقة (تشين أب)", sets: 3, reps: 8, restSeconds: 60, muscle: "بايسبس وظهر", instructions: ["امسك البار بقبضة ضيقة من الأسفل", "اسحب جسمك للأعلى بالتركيز على البايسبس", "انزل ببطء"], safetyTips: ["لا تتأرجح"], isProVideo: false, equipment: ["pullupbar"] } },
      { id: "b7", name: "بايسبس هامر", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس خارجي", instructions: ["امسك الدمبل بقبضة عمودية (محايدة)", "ارفع للأعلى مع ثبات المرفق", "انزل ببطء"], safetyTips: ["حافظ على استقامة المعصم", "لا تتأرجح"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "b7h", name: "بايسبس بحبل المقاومة هامر", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس خارجي", instructions: ["قف على وسط الحبل بقبضة محايدة", "ارفع للأعلى مع ثبات المرفق", "انزل ببطء"], safetyTips: ["حافظ على المعصم مستقيماً"], isProVideo: false, equipment: ["resistancebands"] } },
    ],
  },
  "2": {
    title: "الثلاثاء",
    muscle: "أرجل",
    emoji: "🦵",
    color: "#C490D8",
    image: require("@/assets/images/workout-legs.png"),
    exercises: [
      { id: "l1", name: "سكوات بالبار", sets: 4, reps: 12, restSeconds: 120, muscle: "فخذ أمامي", instructions: ["ضع البار على أعلى الظهر", "قف بعرض الأكتاف", "انزل حتى يوازي الفخذ الأرض", "ادفع للأعلى من الكعبين"], safetyTips: ["حافظ على الركبتين في اتجاه أصابع القدمين", "لا تميل للأمام بشكل مبالغ", "استخدم حزام الظهر للأوزان الثقيلة"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "l1h", name: "سكوات بوزن الجسم", sets: 4, reps: 20, restSeconds: 60, muscle: "فخذ أمامي", instructions: ["قف بعرض الأكتاف", "انزل ببطء حتى يوازي الفخذ الأرض", "ادفع من الكعبين للأعلى"], safetyTips: ["حافظ على الركبتين في اتجاه أصابع القدم"], isProVideo: false } },
      { id: "l2", name: "ليج بريس", sets: 4, reps: 15, restSeconds: 90, muscle: "فخذ", instructions: ["اجلس على جهاز الليج بريس", "ضع قدميك بعرض الأكتاف", "انزل حتى 90 درجة", "ادفع للأعلى دون قفل الركبتين"], safetyTips: ["لا تقفل ركبتيك في الأعلى", "لا تنزل أكثر من اللازم"], isProVideo: true, homeAlt: { id: "l2h", name: "سكوات بلغاري (رجل واحدة)", sets: 3, reps: 12, restSeconds: 90, muscle: "فخذ وأرداف", instructions: ["ضع قدمك الخلفية على كرسي", "انزل بالركبة الأمامية حتى 90 درجة", "ادفع للأعلى"], safetyTips: ["حافظ على استقامة الجذع", "لا تتجاوز الركبة أصابع القدم"], isProVideo: false } },
      { id: "l3", name: "لنجز بالدمبل", sets: 3, reps: 12, restSeconds: 90, muscle: "فخذ وأرداف", instructions: ["امسك دمبل في كل يد", "اخطُ للأمام خطوة واسعة", "انزل حتى تلمس الركبة الخلفية الأرض", "ادفع من القدم الأمامية للرجوع"], safetyTips: ["حافظ على استقامة الجذع", "لا تدع الركبة تتجاوز أصابع القدم"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "l3h", name: "لنجز بوزن الجسم", sets: 3, reps: 15, restSeconds: 60, muscle: "فخذ وأرداف", instructions: ["اخطُ للأمام خطوة واسعة", "انزل حتى تلمس الركبة الأرض", "ارجع بالدفع من القدم الأمامية"], safetyTips: ["حافظ على استقامة الجذع"], isProVideo: false } },
      { id: "l4", name: "تمديد أرجل (ليج إكستنشن)", sets: 3, reps: 15, restSeconds: 60, muscle: "فخذ أمامي", instructions: ["اجلس على جهاز تمديد الأرجل", "ارفع الوزن بتمديد الركبتين", "اضغط في الأعلى لثانيتين", "انزل ببطء"], safetyTips: ["لا تستخدم أوزان ثقيلة جداً", "حافظ على ظهرك ملتصقاً بالمقعد"], isProVideo: false, homeAlt: { id: "l4h", name: "سكوات جدار (وول سيت)", sets: 3, reps: 45, restSeconds: 60, muscle: "فخذ أمامي", instructions: ["أسند ظهرك على الجدار", "انزل حتى تصل لزاوية 90 درجة", "ثبت لمدة 45 ثانية"], safetyTips: ["حافظ على الركبتين فوق الكاحلين"], isProVideo: false } },
      { id: "l5", name: "ثني أرجل (ليج كيرل)", sets: 3, reps: 15, restSeconds: 60, muscle: "فخذ خلفي", instructions: ["استلقِ على جهاز ثني الأرجل", "اثنِ ركبتيك لرفع الوزن", "اضغط في الأعلى", "انزل ببطء"], safetyTips: ["لا ترفع الوركين عن المقعد", "تحكم في الحركة ولا تستعجل"], isProVideo: false, homeAlt: { id: "l5h", name: "جسر الأرداف (غلوت بريدج)", sets: 3, reps: 20, restSeconds: 45, muscle: "فخذ خلفي وأرداف", instructions: ["استلقِ على ظهرك مع ثني الركبتين", "ارفع الوركين للأعلى بالضغط من الكعبين", "اضغط على الأرداف في الأعلى", "انزل ببطء"], safetyTips: ["لا تقوّس الظهر بشكل مبالغ"], isProVideo: false } },
      { id: "l6", name: "رفع ربلة واقف", sets: 4, reps: 20, restSeconds: 45, muscle: "ربلة (سمانة)", instructions: ["قف على حافة الدرجة", "ارفع جسمك على أطراف أصابعك", "اضغط في الأعلى لثانيتين", "انزل ببطء حتى تمتد الربلة"], safetyTips: ["حافظ على ثبات الجسم", "لا تثنِ الركبتين"], isProVideo: false },
      { id: "l7", name: "ديدلفت روماني", sets: 3, reps: 12, restSeconds: 90, muscle: "فخذ خلفي وأرداف", instructions: ["امسك البار بقبضة من الأعلى", "انحنِ من الورك مع ثبات الركبتين", "انزل حتى تشعر بالتمدد", "ارجع للأعلى بالضغط من الأرداف"], safetyTips: ["حافظ على استقامة الظهر دائماً", "لا تثنِ الركبتين كثيراً", "ابدأ بأوزان خفيفة"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "l7h", name: "ديدلفت بالدمبل رجل واحدة", sets: 3, reps: 12, restSeconds: 60, muscle: "فخذ خلفي وأرداف", instructions: ["قف على رجل واحدة مع دمبل", "انحنِ للأمام مع رفع الرجل الخلفية", "ارجع للوقوف"], safetyTips: ["ابدأ بدون وزن حتى تتقن التوازن"], isProVideo: false, equipment: ["dumbbells"] } },
    ],
  },
  "3": {
    title: "الأربعاء",
    muscle: "أكتاف وبطن",
    emoji: "🎯",
    color: "#F59E0B",
    image: require("@/assets/images/fitness-equipment.png"),
    exercises: [
      { id: "s1", name: "ضغط أكتاف بالدمبل", sets: 4, reps: 12, restSeconds: 90, muscle: "أكتاف أمامية", instructions: ["اجلس على بنش مع دعم الظهر", "ارفع الدمبل من مستوى الأذن للأعلى", "انزل ببطء حتى تصل لمستوى الأذن"], safetyTips: ["لا تقوّس ظهرك", "لا تقفل المرفقين في الأعلى"], isProVideo: true, equipment: ["dumbbells"], homeAlt: { id: "s1h", name: "بايك بوش أب", sets: 4, reps: 12, restSeconds: 60, muscle: "أكتاف أمامية", instructions: ["اتخذ وضع البوش أب مع رفع المؤخرة عالياً", "انزل رأسك نحو الأرض بثني المرفقين", "ادفع للأعلى"], safetyTips: ["حافظ على الأرجل مستقيمة"], isProVideo: false } },
      { id: "s2", name: "رفع جانبي بالدمبل", sets: 3, reps: 15, restSeconds: 60, muscle: "أكتاف جانبية", instructions: ["قف مع إمساك دمبل في كل يد", "ارفع ذراعيك للجانبين حتى مستوى الكتف", "انزل ببطء"], safetyTips: ["لا ترفع أعلى من مستوى الكتف", "حافظ على انحناء خفيف في المرفق"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "s2h", name: "رفع جانبي بحبل المقاومة", sets: 3, reps: 15, restSeconds: 60, muscle: "أكتاف جانبية", instructions: ["قف على وسط الحبل", "ارفع ذراعيك للجانبين", "انزل ببطء"], safetyTips: ["لا ترفع أعلى من الكتف"], isProVideo: false, equipment: ["resistancebands"] } },
      { id: "s3", name: "رفع أمامي بالدمبل", sets: 3, reps: 12, restSeconds: 60, muscle: "أكتاف أمامية", instructions: ["ارفع الدمبل للأمام بالتناوب", "ارفع حتى مستوى الكتف", "انزل ببطء مع التحكم"], safetyTips: ["لا تتأرجح بالجسم", "استخدم أوزان مناسبة"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "s3h", name: "بلانك على الكتف (تاب)", sets: 3, reps: 20, restSeconds: 60, muscle: "أكتاف أمامية وجذع", instructions: ["اتخذ وضع البلانك العالي", "المس كتفك بيدك المعاكسة بالتناوب", "حافظ على ثبات الجسم"], safetyTips: ["لا تلف الوركين"], isProVideo: false } },
      { id: "s4", name: "تجديف معكوس للكتف الخلفي", sets: 3, reps: 15, restSeconds: 60, muscle: "أكتاف خلفية", instructions: ["انحنِ للأمام بزاوية 45 درجة", "ارفع الدمبل للجانبين", "اضغط على عضلات الكتف الخلفية"], safetyTips: ["حافظ على ثبات الجذع", "لا تستخدم قوة الدفع"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "s4h", name: "تمدد كتف خلفي على الأرض", sets: 3, reps: 15, restSeconds: 45, muscle: "أكتاف خلفية", instructions: ["استلقِ على بطنك مع فتح ذراعيك", "ارفع ذراعيك للجانبين مع الضغط على الكتف الخلفي", "انزل ببطء"], safetyTips: ["لا ترفع الصدر عن الأرض كثيراً"], isProVideo: false } },
      { id: "s5", name: "كرانش عكسي", sets: 3, reps: 20, restSeconds: 45, muscle: "بطن سفلي", instructions: ["استلقِ على ظهرك", "ارفع ركبتيك نحو صدرك", "انزل ببطء دون لمس الأرض"], safetyTips: ["لا تضغط على الرقبة", "حافظ على أسفل الظهر ملامساً للأرض"], isProVideo: false },
      { id: "s6", name: "بلانك", sets: 3, reps: 45, restSeconds: 30, muscle: "بطن وجذع", instructions: ["ضع ذراعيك على الأرض وارفع جسمك", "حافظ على خط مستقيم من الرأس للكعبين", "ثبت لمدة 45 ثانية"], safetyTips: ["لا تدلّ الوسط للأسفل", "لا ترفع المؤخرة عالياً"], isProVideo: false },
    ],
  },
  "4": {
    title: "الخميس",
    muscle: "ذراعين",
    emoji: "💪",
    color: "#22C55E",
    image: require("@/assets/images/fitness-equipment.png"),
    exercises: [
      { id: "a1", name: "بايسبس بالبار المستقيم", sets: 4, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["قف واحمل البار بقبضة من الأسفل", "ارفع البار بتقلص البايسبس", "انزل ببطء مع التحكم"], safetyTips: ["ثبت المرفقين على جانبيك", "لا تتأرجض"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "a1h", name: "بايسبس بالدمبل واقف", sets: 4, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["امسك دمبل في كل يد", "ارفع بالتناوب مع لف المعصم", "انزل ببطء"], safetyTips: ["ثبت المرفقين"], isProVideo: false, equipment: ["dumbbells"] } },
      { id: "a2", name: "ترايسبس فرنسي بالبار", sets: 4, reps: 12, restSeconds: 60, muscle: "ترايسبس", instructions: ["استلقِ وامسك البار فوق الرأس", "انزل البار نحو الجبهة", "ارفع بتمديد المرفقين"], safetyTips: ["لا تحرك الكتفين", "استخدم وزناً مناسباً لتجنب إصابة المرفق"], isProVideo: true, equipment: ["barbell"], homeAlt: { id: "a2h", name: "ترايسبس ديبس على كرسي", sets: 4, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["ضع يديك على كرسي ثابت خلفك", "مدّ رجليك للأمام", "انزل ببطء وادفع للأعلى"], safetyTips: ["لا تنزل أكثر من 90 درجة"], isProVideo: false } },
      { id: "a3", name: "بايسبس تركيز جالس", sets: 3, reps: 12, restSeconds: 60, muscle: "بايسبس", instructions: ["اجلس وأسند مرفقك على فخذك الداخلي", "ارفع الدمبل بتقلص البايسبس", "انزل ببطء حتى تمديد كامل"], safetyTips: ["لا تحرك الجسم", "تحكم في الحركة في كلا الاتجاهين"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "a3h", name: "تشين أب قبضة ضيقة", sets: 3, reps: 8, restSeconds: 60, muscle: "بايسبس", instructions: ["امسك البار بقبضة ضيقة من الأسفل", "اسحب جسمك ببطء مع التركيز على البايسبس", "انزل ببطء"], safetyTips: ["لا تتأرجح بالجسم"], isProVideo: false, equipment: ["pullupbar"] } },
      { id: "a4", name: "ترايسبس كيكباك", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس", instructions: ["انحنِ للأمام مع إمساك دمبل", "مدّ ذراعك للخلف بالكامل", "اضغط لثانيتين وارجع ببطء"], safetyTips: ["حافظ على ثبات المرفق", "لا تتأرجح بالجسم"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "a4h", name: "ترايسبس بوش أب ضيق", sets: 3, reps: 12, restSeconds: 60, muscle: "ترايسبس", instructions: ["اتخذ وضع البوش أب مع يدين قريبتين", "انزل ببطء مع ضم المرفقين للجسم", "ادفع للأعلى"], safetyTips: ["حافظ على المرفقين ملتصقين بالجسم"], isProVideo: false } },
      { id: "a5", name: "بايسبس بالكابل", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["قف أمام جهاز الكابل السفلي", "اسحب المقبض للأعلى", "اضغط في الأعلى وانزل ببطء"], safetyTips: ["حافظ على ثبات المرفقين", "تحكم في الحركة"], isProVideo: false, homeAlt: { id: "a5h", name: "بايسبس بحبل المقاومة", sets: 3, reps: 15, restSeconds: 60, muscle: "بايسبس", instructions: ["قف على وسط الحبل", "اسحب للأعلى مع ثبات المرفقين", "انزل ببطء"], safetyTips: ["حافظ على ثبات المرفقين"], isProVideo: false, equipment: ["resistancebands"] } },
      { id: "a6", name: "ترايسبس أوفرهيد بالدمبل", sets: 3, reps: 12, restSeconds: 60, muscle: "ترايسبس طويل", instructions: ["اجلس وامسك دمبل بكلتا اليدين فوق الرأس", "انزل الدمبل خلف الرأس", "ارفع بتمديد المرفقين"], safetyTips: ["حافظ على ثبات المرفقين", "لا تقوّس الظهر"], isProVideo: false, equipment: ["dumbbells"], homeAlt: { id: "a6h", name: "ترايسبس ديبس أرضي", sets: 3, reps: 15, restSeconds: 60, muscle: "ترايسبس طويل", instructions: ["اجلس وضع يديك خلفك على الأرض", "ارفع جسمك بتمديد الذراعين", "انزل ببطء بثني المرفقين"], safetyTips: ["لا تنزل أكثر من 90 درجة"], isProVideo: false } },
    ],
  },
  "5": {
    title: "الجمعة",
    muscle: "كارديو وHIIT",
    emoji: "🏃",
    color: "#EC4899",
    image: require("@/assets/images/yoga-sunrise.png"),
    exercises: [
      { id: "h1", name: "إحماء (جري خفيف)", sets: 1, reps: 300, restSeconds: 30, muscle: "كارديو", instructions: ["ابدأ بجري خفيف في المكان لمدة 5 دقائق", "ارفع ركبتيك بالتدريج", "حافظ على إيقاع منتظم"], safetyTips: ["ابدأ ببطء وزد تدريجياً"], isProVideo: false },
      { id: "h2", name: "بيربي", sets: 3, reps: 15, restSeconds: 60, muscle: "كامل الجسم", instructions: ["قف ثم انزل للقرفصاء", "ادفع قدميك للخلف لوضع البلانك", "اعمل بوش أب", "ارجع للقرفصاء واقفز للأعلى"], safetyTips: ["حافظ على شكل صحيح رغم السرعة", "لا تهبط على كعبيك"], isProVideo: true },
      { id: "h3", name: "ماونتن كلايمر", sets: 3, reps: 30, restSeconds: 45, muscle: "بطن وكارديو", instructions: ["ابدأ في وضع البلانك", "ادفع ركبتيك بالتناوب نحو الصدر", "حافظ على إيقاع سريع"], safetyTips: ["لا تدلّ الوسط", "حافظ على ثبات الكتفين"], isProVideo: false },
      { id: "h4", name: "جامبنج جاك", sets: 3, reps: 30, restSeconds: 30, muscle: "كارديو", instructions: ["قف ثم اقفز مع فتح القدمين والذراعين", "ارجع للوضع الأول", "كرر بإيقاع سريع"], safetyTips: ["اهبط على أصابع القدمين", "حافظ على ثبات الجسم"], isProVideo: false },
      { id: "h5", name: "سكوات جامب", sets: 3, reps: 15, restSeconds: 60, muscle: "أرجل وكارديو", instructions: ["اعمل سكوات عادي", "في الصعود اقفز عالياً", "اهبط بلطف في وضع السكوات"], safetyTips: ["اهبط على أصابع القدمين أولاً", "حافظ على الركبتين في خط مع أصابع القدمين"], isProVideo: false },
      { id: "h6", name: "بلانك مع لمس الكتف", sets: 3, reps: 20, restSeconds: 45, muscle: "جذع", instructions: ["ابدأ في وضع البوش أب", "المس كتفك الأيسر بيدك اليمنى والعكس", "حافظ على ثبات الوركين"], safetyTips: ["لا تتأرجح بالوركين", "باعد بين القدمين لثبات أكبر"], isProVideo: false },
    ],
  },
};

export default function WorkoutDayScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, isHomeWorkout, homeEquipment } = useApp();
  const topPadding = isWeb ? 67 : insets.top;
  const isPro = profile?.isPro ?? false;

  const dayConfig = DAYS_CONFIG[day] || DAYS_CONFIG["0"];
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const resolvedExercises = useMemo(() => {
    if (!isHomeWorkout) return dayConfig.exercises;
    return dayConfig.exercises.map((ex) => {
      const canDoOriginal = !ex.equipment || ex.equipment.length === 0 ||
        ex.equipment.every(e => homeEquipment.includes(e as HomeEquipment));

      if (ex.homeAlt) {
        const altEquip = ex.homeAlt.equipment || [];
        const canDoAlt = altEquip.length === 0 || altEquip.every(e => homeEquipment.includes(e));
        if (canDoAlt) return { ...ex.homeAlt, _isHome: true };
      }

      if (canDoOriginal) return ex;

      return ex;
    });
  }, [isHomeWorkout, homeEquipment, dayConfig.exercises]);

  const toggleComplete = (id: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = completedExercises.size;
  const totalCount = resolvedExercises.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 40 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroSection}>
        <Image source={dayConfig.image} style={styles.heroImg} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={[styles.heroContent, { paddingTop: topPadding + 12 }]}>
          <View style={styles.heroNav}>
            <View style={{ width: 40 }} />
            <Text style={styles.heroTitle}>{dayConfig.title} — {dayConfig.muscle}{isHomeWorkout ? " 🏠" : ""}</Text>
            <Pressable onPress={() => router.back()} style={styles.heroBackBtn}>
              <Feather name="chevron-right" size={24} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.heroSub}>{totalCount} تمارين · {resolvedExercises.reduce((s: number, e: any) => s + e.sets, 0)} جلسة · ~{Math.round(totalCount * 4)} دقيقة</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: colors.muted }]}>{completedCount}/{totalCount} تمارين مكتملة</Text>
          <Text style={[styles.progressPercent, { color: "#C490D8" }]}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Pressable
        style={styles.startSessionBtn}
        onPress={() => router.push({ pathname: "/workout/session" as any, params: { day } })}
      >
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
        <Text style={styles.startSessionText}>ابدأ التمرين التفاعلي</Text>
      </Pressable>

      <View style={styles.sectionPad}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>قائمة التمارين</Text>
      </View>

      {isHomeWorkout && (
        <View style={[styles.homeBanner, { backgroundColor: isDark ? "rgba(126,207,179,0.12)" : "rgba(126,207,179,0.1)", borderColor: "rgba(126,207,179,0.3)" }]}>
          <Text style={{ fontSize: 16 }}>🏠</Text>
          <Text style={[styles.homeBannerText, { color: "#7ECFB3" }]}>وضع التمرين المنزلي — تم تعديل التمارين بناءً على أدواتك</Text>
        </View>
      )}

      {resolvedExercises.map((ex: any, idx: number) => {
        const isCompleted = completedExercises.has(ex.id);
        const isExpanded = expandedExercise === ex.id;
        const isHomeSub = !!(ex as any)._isHome;

        return (
          <View key={ex.id} style={[styles.exerciseCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: isCompleted ? "#22C55E" : isHomeSub ? "#7ECFB3" : colors.border }]}>
            <Pressable style={styles.exerciseHeader} onPress={() => setExpandedExercise(isExpanded ? null : ex.id)}>
              <View style={styles.exerciseLeft}>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
                {isHomeSub && (
                  <View style={[styles.videoBadge, { backgroundColor: "rgba(126,207,179,0.15)" }]}>
                    <Text style={{ fontSize: 10 }}>🏠</Text>
                    <Text style={[styles.videoBadgeText, { color: "#7ECFB3" }]}>بديل منزلي</Text>
                  </View>
                )}
                {ex.isProVideo && !isHomeSub && (
                  <View style={styles.videoBadge}>
                    <MaterialCommunityIcons name="play-circle" size={14} color="#F5D26A" />
                    <Text style={styles.videoBadgeText}>فيديو</Text>
                  </View>
                )}
              </View>
              <View style={styles.exerciseInfo}>
                <View style={styles.exerciseNameRow}>
                  <Text style={[styles.exerciseName, { color: colors.text, textDecorationLine: isCompleted ? "line-through" : "none" }]}>{ex.name}</Text>
                  <View style={[styles.exerciseNum, { backgroundColor: dayConfig.color + "20" }]}>
                    <Text style={[styles.exerciseNumText, { color: dayConfig.color }]}>{idx + 1}</Text>
                  </View>
                </View>
                <Text style={[styles.exerciseMeta, { color: colors.muted }]}>
                  {ex.muscle} · {ex.sets} جلسات × {ex.reps} عدة · راحة {ex.restSeconds} ث
                </Text>
              </View>
              <Pressable
                style={[styles.checkBtn, { backgroundColor: isCompleted ? "#22C55E" : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: isCompleted ? "#22C55E" : colors.border }]}
                onPress={() => toggleComplete(ex.id)}
              >
                <Feather name="check" size={18} color={isCompleted ? "#fff" : colors.muted} />
              </Pressable>
            </Pressable>

            {isExpanded && (
              <View style={[styles.exerciseExpanded, { borderTopColor: colors.border }]}>
                {ex.isProVideo && (
                  <Pressable style={[styles.videoSection, { backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.06)" }]}>
                    <MaterialCommunityIcons name="play-circle-outline" size={32} color="#C490D8" />
                    <View>
                      <Text style={[styles.videoTitle, { color: colors.text }]}>شاهد الفيديو التوضيحي</Text>
                      <Text style={[styles.videoSub, { color: colors.muted }]}>
                        {isPro ? "اضغط لمشاهدة الفيديو" : "متاح لمشتركي PRO فقط"}
                      </Text>
                    </View>
                    {!isPro && <MaterialCommunityIcons name="lock" size={18} color="#C490D8" />}
                  </Pressable>
                )}

                <Text style={[styles.expandTitle, { color: colors.text }]}>إرشادات الأداء:</Text>
                {ex.instructions.map((inst, i) => (
                  <View key={i} style={styles.instructionRow}>
                    <Text style={[styles.instructionText, { color: colors.textSecondary }]}>{inst}</Text>
                    <Text style={[styles.instructionNum, { color: "#C490D8" }]}>{i + 1}.</Text>
                  </View>
                ))}

                <View style={[styles.safetyBox, { backgroundColor: isDark ? "rgba(244,63,94,0.1)" : "rgba(244,63,94,0.06)" }]}>
                  <View style={styles.safetyHeader}>
                    <Text style={[styles.safetyTitle, { color: "#F43F5E" }]}>تنبيهات للوقاية من الإصابات</Text>
                    <Feather name="alert-triangle" size={16} color="#F43F5E" />
                  </View>
                  {ex.safetyTips.map((tip, i) => (
                    <View key={i} style={styles.safetyRow}>
                      <Text style={[styles.safetyText, { color: colors.textSecondary }]}>{tip}</Text>
                      <Text style={{ color: "#F43F5E" }}>⚠️</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: { height: 200, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  heroContent: { position: "absolute", top: 0, right: 0, left: 0, paddingHorizontal: 20 },
  heroNav: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  heroBackBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroTitle: { color: "#fff", fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "center" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  progressSection: { paddingHorizontal: 20, paddingVertical: 16 },
  progressRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 8 },
  progressText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  progressPercent: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#C490D8", borderRadius: 4 },
  startSessionBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#C490D8", marginHorizontal: 20, borderRadius: 16, paddingVertical: 16 },
  startSessionText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  sectionPad: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  homeBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginHorizontal: 20, marginBottom: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  homeBannerText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  exerciseCard: { marginHorizontal: 20, marginBottom: 10, borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  exerciseHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 16, gap: 12 },
  exerciseLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  exerciseInfo: { flex: 1 },
  exerciseNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  exerciseNum: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  exerciseNumText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  exerciseName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", flex: 1 },
  exerciseMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  checkBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  videoBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(245,210,106,0.15)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  videoBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold", color: "#F5D26A" },
  exerciseExpanded: { borderTopWidth: 1, padding: 16 },
  expandTitle: { fontSize: 14, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 8 },
  instructionRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 6, paddingRight: 4 },
  instructionNum: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  instructionText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 20 },
  safetyBox: { borderRadius: 14, padding: 14, marginTop: 12 },
  safetyHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 8 },
  safetyTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  safetyRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 4 },
  safetyText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", flex: 1, lineHeight: 18 },
  videoSection: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, marginBottom: 14 },
  videoTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  videoSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
});
