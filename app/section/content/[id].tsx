import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

const CONTENT_DB: Record<string, any> = {
  "nutrition-1": {
    title: "خطة النظام الغذائي المتوازن",
    category: "التغذية",
    categoryColor: "#F59E0B",
    image: require("@/assets/images/meal-prep.png"),
    readTime: "5 دقائق",
    intro: "النظام الغذائي المتوازن هو أساس الصحة الجيدة. تعلم كيف تنظم وجباتك لأسبوع كامل.",
    sections: [
      {
        title: "الإفطار (7:00 - 8:00 ص)",
        items: ["بيض مسلوق (2) مع خبز أسمر", "سلطة خضار طازجة", "كوب حليب خالي الدسم", "حبة فاكهة موسمية"],
      },
      {
        title: "الغداء (12:00 - 1:00 م)",
        items: ["صدر دجاج مشوي 150 جرام", "أرز بني (كوب)", "سلطة خضار متنوعة", "زبادي قليل الدسم"],
      },
      {
        title: "العشاء (7:00 - 8:00 م)",
        items: ["سمك مشوي 120 جرام", "خضار سوتيه", "شوربة عدس", "خبز أسمر شريحة"],
      },
      {
        title: "وجبات خفيفة",
        items: ["مكسرات نيئة (حفنة)", "فاكهة طازجة", "جبنة بيضاء مع خيار", "شاي أخضر بدون سكر"],
      },
    ],
    tips: [
      "اشرب 8-10 أكواب ماء يومياً",
      "تناول وجباتك في أوقات ثابتة",
      "تجنب الأكل قبل النوم بساعتين",
      "قلل من الملح والسكر المضاف",
      "أضف الألياف لكل وجبة",
    ],
  },
  "nutrition-2": {
    title: "حساب السعرات الحرارية",
    category: "التغذية",
    categoryColor: "#F59E0B",
    image: require("@/assets/images/smoothie-bowl.png"),
    readTime: "3 دقائق",
    intro: "فهم السعرات الحرارية هو المفتاح للتحكم في الوزن.",
    sections: [
      {
        title: "كيف تحسب احتياجاتك",
        items: [
          "معدل الأيض الأساسي (BMR) = الطاقة التي يحتاجها جسمك للعمل",
          "اضرب BMR × معامل النشاط (1.2 - 1.9)",
          "للإنقاص: اطرح 500 سعرة من الناتج",
          "للزيادة: أضف 500 سعرة للناتج",
        ],
      },
      {
        title: "سعرات الأطعمة الشائعة",
        items: ["أرز أبيض (كوب): 200 سعرة", "صدر دجاج (100جم): 165 سعرة", "بيضة: 78 سعرة", "تمرة: 20 سعرة", "كوب حليب: 150 سعرة"],
      },
    ],
    tips: ["استخدم حاسبة السعرات في التطبيق", "سجل وجباتك يومياً", "لا تقل عن 1200 سعرة يومياً للنساء"],
  },
  "nutrition-3": {
    title: "وجبات لخسارة الوزن",
    category: "التغذية",
    categoryColor: "#F59E0B",
    image: require("@/assets/images/rainbow-food.png"),
    readTime: "4 دقائق",
    intro: "وصفات صحية ولذيذة تساعدك في رحلة خسارة الوزن بدون حرمان.",
    sections: [
      { title: "سلطة الكينوا بالدجاج", items: ["كوب كينوا مطبوخ", "صدر دجاج مشوي مقطع", "خيار وطماطم ونعناع", "ملعقة زيت زيتون + ليمون"] },
      { title: "سموذي الفراولة البروتيني", items: ["كوب فراولة مجمدة", "ملعقة بروتين فانيلا", "كوب حليب لوز", "ملعقة عسل"] },
      { title: "شوربة الخضار المحمصة", items: ["كوسة وجزر وبطاطا حلوة", "تُحمّص في الفرن 20 دقيقة", "تُخلط مع مرق الدجاج", "تُزيّن بالبقدونس"] },
    ],
    tips: ["حضّر وجباتك مسبقاً لتتجنب الوجبات السريعة", "استبدل المقلي بالمشوي", "أكثر من البروتين لتشعر بالشبع"],
  },
  "fitness-1": {
    title: "خطة المبتدئين (30 يوم)",
    category: "الرياضة",
    categoryColor: "#F43F5E",
    image: require("@/assets/images/fitness-equipment.png"),
    readTime: "6 دقائق",
    intro: "خطة تدريبية متدرجة للمبتدئين لمدة 30 يوماً. ابدأ رحلتك الرياضية الآن!",
    sections: [
      {
        title: "الأسبوع 1-2: البداية",
        items: ["مشي 20 دقيقة يومياً", "تمارين إحماء وتمدد", "5 تمارين ضغط (على الركبة)", "10 قرفصاء بدون أثقال", "بلانك 15 ثانية × 3"],
      },
      {
        title: "الأسبوع 3-4: التطور",
        items: ["مشي 30 دقيقة + هرولة خفيفة", "10 تمارين ضغط كاملة", "15 قرفصاء", "بلانك 30 ثانية × 3", "10 لنج لكل رجل"],
      },
    ],
    tips: ["ابدأ ببطء ولا تُجهد نفسك", "اشرب الماء قبل وبعد التمرين", "خذ يوم راحة بين كل يومين تمرين", "سجّل تقدمك يومياً"],
  },
  "fitness-2": {
    title: "تمارين الجيم المتقدمة",
    category: "الرياضة",
    categoryColor: "#F43F5E",
    image: require("@/assets/images/fitness-banner.png"),
    readTime: "7 دقائق",
    intro: "برنامج تدريبي متقدم لبناء العضلات وحرق الدهون في الجيم.",
    sections: [
      { title: "يوم الصدر والترايسبس", items: ["بنش بريس: 4×10", "فلاي دمبل: 3×12", "بنش مائل: 3×10", "ترايسبس بوشداون: 3×15", "ديبس: 3×10"] },
      { title: "يوم الظهر والبايسبس", items: ["سحب علوي: 4×10", "رو بالدمبل: 3×12", "ديدليفت: 4×8", "بايسبس كيرل: 3×15"] },
      { title: "يوم الأرجل", items: ["سكوات: 4×10", "ليج بريس: 3×12", "لنج: 3×10 لكل رجل", "ليج كيرل: 3×15", "كاف ريز: 4×15"] },
    ],
    tips: ["اتبع تدرج في الأوزان", "احصل على 7-8 ساعات نوم", "تناول بروتين خلال ساعة بعد التمرين"],
  },
  "fitness-3": {
    title: "تمارين المنزل بدون أدوات",
    category: "الرياضة",
    categoryColor: "#F43F5E",
    image: require("@/assets/images/yoga-sunrise.png"),
    readTime: "5 دقائق",
    intro: "تمارين فعالة يمكنك أداؤها في المنزل بدون أي معدات.",
    sections: [
      { title: "تمرين 20 دقيقة", items: ["جامبنغ جاكس: 30 ثانية", "بوش أبس: 15 تكرار", "سكوات: 20 تكرار", "بلانك: 45 ثانية", "ماونتن كلايمرز: 30 ثانية", "بيربيز: 10 تكرارات", "استراحة 30 ثانية بين كل تمرين"] },
    ],
    tips: ["أدّ التمرين في مكان مريح ومهوّى", "استخدم حصيرة يوغا للراحة", "سخّن قبل البدء 5 دقائق"],
  },
  "mental-1": {
    title: "تمارين التأمل اليومي",
    category: "الصحة النفسية",
    categoryColor: "#C490D8",
    image: require("@/assets/images/mental-banner.png"),
    readTime: "4 دقائق",
    intro: "10 دقائق من التأمل يومياً تُغيّر حياتك. تعلم التقنيات الأساسية.",
    sections: [
      { title: "تأمل التنفس (5 دقائق)", items: ["اجلس في وضع مريح", "أغمض عينيك واسترخِ", "ركز على نفسك الداخلي والخارجي", "شهيق لـ4 ثوانٍ", "احبس لـ4 ثوانٍ", "زفير لـ4 ثوانٍ", "كرر 10 مرات"] },
      { title: "تأمل المسح الجسدي", items: ["استلقِ على ظهرك", "ركز انتباهك على أصابع قدمك", "اصعد تدريجياً لكل جزء من جسمك", "لاحظ التوتر واتركه", "انتهِ بالرأس والوجه"] },
    ],
    tips: ["ابدأ بـ3 دقائق ثم زد تدريجياً", "اختر وقتاً ثابتاً يومياً", "لا تقلق إذا شرد ذهنك — هذا طبيعي"],
  },
  "mental-3": {
    title: "تحسين جودة النوم",
    category: "الصحة النفسية",
    categoryColor: "#C490D8",
    image: require("@/assets/images/sleep-banner.png"),
    readTime: "4 دقائق",
    intro: "نم أفضل وعش أسعد. نصائح علمية لتحسين جودة نومك.",
    sections: [
      { title: "قبل النوم", items: ["أوقف الشاشات قبل النوم بساعة", "اشرب شاي البابونج", "خفف إضاءة الغرفة", "تمارين تنفس خفيفة", "حمام ماء دافئ"] },
      { title: "بيئة النوم", items: ["حرارة الغرفة 18-20 درجة", "ستائر معتمة تماماً", "فراش مريح ووسادة مناسبة", "هدوء تام أو ضوضاء بيضاء"] },
    ],
    tips: ["نم واستيقظ بنفس الوقت يومياً", "تجنب الكافيين بعد الظهر", "مارس الرياضة صباحاً وليس مساءً"],
  },
  "womens-2": {
    title: "متابعة الحمل أسبوعاً بأسبوع",
    category: "صحة المرأة",
    categoryColor: "#EC4899",
    image: require("@/assets/images/womens-banner.png"),
    readTime: "8 دقائق",
    intro: "دليلك الشامل لمراحل الحمل وتطور الجنين أسبوعاً بأسبوع.",
    sections: [
      { title: "الثلث الأول (1-12 أسبوع)", items: ["تبدأ الأعضاء الرئيسية بالتكوّن", "حجم الجنين: من حبة عدس إلى ليمونة", "الأعراض: غثيان صباحي، إرهاق، تغير المزاج", "تناولي حمض الفوليك 400 ميكروغرام يومياً"] },
      { title: "الثلث الثاني (13-26 أسبوع)", items: ["تبدأ حركة الجنين بالظهور", "يتطور السمع والبصر", "الأعراض: زيادة الطاقة، حرقة المعدة", "ابدئي تمارين كيغل وقاع الحوض"] },
      { title: "الثلث الثالث (27-40 أسبوع)", items: ["اكتمال نمو الرئتين", "الجنين يتخذ وضع الولادة", "الأعراض: ضيق تنفس، آلام ظهر", "جهزي حقيبة المستشفى من الأسبوع 36"] },
    ],
    tips: ["راجعي طبيبك بانتظام", "تناولي الفيتامينات الموصوفة", "تجنبي الأطعمة النيئة والكافيين الزائد", "مارسي المشي يومياً 20 دقيقة"],
  },
  "beauty-1": {
    title: "روتين العناية بالبشرة",
    category: "العناية والجمال",
    categoryColor: "#F5D26A",
    image: require("@/assets/images/beauty-banner.png"),
    readTime: "5 دقائق",
    intro: "روتين يومي بسيط لبشرة مشرقة وصحية.",
    sections: [
      { title: "الروتين الصباحي", items: ["غسول لطيف حسب نوع بشرتك", "تونر مرطب", "سيروم فيتامين C", "مرطب خفيف SPF", "واقي شمس SPF 50+"] },
      { title: "الروتين المسائي", items: ["مزيل مكياج أو زيت تنظيف", "غسول مناسب", "تونر", "سيروم ريتينول (ليلاً فقط)", "كريم ليلي مغذي", "كريم عين"] },
    ],
    tips: ["اعرفي نوع بشرتك أولاً", "لا تنسي الرقبة واليدين", "غيري المنتجات حسب الموسم", "قشّري بشرتك مرة أسبوعياً فقط"],
  },
  "clinics-4": {
    title: "استشارات طبية عن بعد",
    category: "العيادات",
    categoryColor: "#A86DBF",
    image: require("@/assets/images/clinic-room.png"),
    readTime: "3 دقائق",
    intro: "تحدث مع طبيب متخصص من بيتك عبر استشارات الفيديو.",
    sections: [
      { title: "كيف تعمل الاستشارة", items: ["اختر التخصص المطلوب", "حدد الموعد المناسب", "ادفع رسوم الاستشارة", "تحدث مع الطبيب عبر الفيديو", "احصل على الوصفة أو التحويل"] },
      { title: "التخصصات المتاحة", items: ["طب عام", "تغذية علاجية", "صحة نفسية", "أمراض جلدية", "طب أطفال", "أمراض باطنية"] },
    ],
    tips: ["جهّز أسئلتك مسبقاً", "كن في مكان هادئ أثناء الاستشارة", "شارك نتائج تحاليلك السابقة"],
  },
};

const DEFAULT_CONTENT = {
  title: "المحتوى",
  category: "عام",
  categoryColor: "#C490D8",
  image: require("@/assets/images/hero-banner.png"),
  readTime: "3 دقائق",
  intro: "محتوى صحي مفيد ومعتمد من متخصصين.",
  sections: [
    { title: "معلومات عامة", items: ["هذا المحتوى سيكون متاحاً قريباً", "ترقب التحديثات القادمة"] },
  ],
  tips: ["تابعنا لمزيد من المحتوى الصحي"],
};

export default function ContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const content = CONTENT_DB[id || ""] || DEFAULT_CONTENT;
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.bannerContainer}>
        <Image source={content.image} style={styles.bannerImage} resizeMode="cover" />
        <View style={styles.bannerOverlay} />
        <View style={[styles.bannerActions, { paddingTop: topPadding + 8 }]}>
          <Pressable style={styles.backCircle} onPress={() => router.back()}>
            <Feather name="chevron-right" size={22} color="#fff" />
          </Pressable>
          <View style={styles.bannerRightActions}>
            <Pressable style={styles.backCircle} onPress={() => setBookmarked(!bookmarked)}>
              <Feather name={bookmarked ? "bookmark" : "bookmark"} size={18} color={bookmarked ? "#F5D26A" : "#fff"} />
            </Pressable>
            <Pressable style={styles.backCircle} onPress={() => Alert.alert("مشاركة", "تم نسخ الرابط")}>
              <Feather name="share-2" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
        <View style={styles.bannerBottom}>
          <View style={[styles.categoryBadge, { backgroundColor: content.categoryColor }]}>
            <Text style={styles.categoryText}>{content.category}</Text>
          </View>
          <Text style={styles.bannerTitle}>{content.title}</Text>
          <View style={styles.metaRow}>
            <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{content.readTime}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.introCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
        <Text style={[styles.introText, { color: colors.text }]}>{content.intro}</Text>
      </View>

      {content.sections.map((section: any, idx: number) => (
        <Pressable
          key={idx}
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
          onPress={() => setExpandedSection(expandedSection === idx ? null : idx)}
        >
          <View style={styles.sectionHeader}>
            <Feather name={expandedSection === idx ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={[styles.sectionNum, { backgroundColor: content.categoryColor + "20" }]}>
              <Text style={[styles.sectionNumText, { color: content.categoryColor }]}>{idx + 1}</Text>
            </View>
          </View>
          {expandedSection === idx && (
            <View style={styles.sectionContent}>
              {section.items.map((item: string, i: number) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.itemDot, { backgroundColor: content.categoryColor }]} />
                  <Text style={[styles.itemText, { color: colors.textSecondary }]}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      ))}

      {content.tips && content.tips.length > 0 && (
        <View style={[styles.tipsCard, { backgroundColor: content.categoryColor + "10", borderColor: content.categoryColor + "25" }]}>
          <Text style={[styles.tipsTitle, { color: content.categoryColor }]}>💡 نصائح مهمة</Text>
          {content.tips.map((tip: string, idx: number) => (
            <View key={idx} style={styles.tipRow}>
              <Text style={[styles.tipNum, { color: content.categoryColor }]}>{idx + 1}</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionBtn, { backgroundColor: "#A86DBF" }]} onPress={() => Alert.alert("تم الحفظ", "تم حفظ المحتوى في المفضلة")}>
          <Feather name="heart" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>حفظ</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: content.categoryColor }]} onPress={() => Alert.alert("مشاركة", "تم نسخ الرابط للمشاركة")}>
          <Feather name="share" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>شارك</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bannerContainer: { height: 260, position: "relative" },
  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  bannerActions: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row-reverse", justifyContent: "space-between", paddingHorizontal: 16 },
  bannerRightActions: { flexDirection: "row-reverse", gap: 8 },
  backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" },
  bannerBottom: { position: "absolute", bottom: 20, left: 20, right: 20 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-end", marginBottom: 8 },
  categoryText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bannerTitle: { color: "#fff", fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right" },
  metaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginTop: 6 },
  metaText: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Tajawal_400Regular" },
  introCard: { marginHorizontal: 20, marginTop: -20, borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 16, zIndex: 1 },
  introText: { fontSize: 15, lineHeight: 26, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  sectionCard: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", padding: 16, gap: 12 },
  sectionNum: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  sectionNumText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  sectionTitle: { flex: 1, fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  sectionContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  itemRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  itemDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  itemText: { flex: 1, fontSize: 14, lineHeight: 22, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  tipsCard: { marginHorizontal: 20, borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 16, gap: 10 },
  tipsTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  tipRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  tipNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(168,85,247,0.1)", textAlign: "center", lineHeight: 22, fontSize: 12, fontFamily: "Tajawal_700Bold" },
  tipText: { flex: 1, fontSize: 14, lineHeight: 22, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  actionRow: { flexDirection: "row-reverse", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  actionBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
