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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const FAQS_AR = [
  {
    category: "الحجوزات والخدمات",
    emoji: "📅",
    color: "#3B82F6",
    items: [
      { q: "هل يمكنني حجز خدمة في المنزل؟", a: "نعم! كثير من خدمات أكسير تدعم الزيارة المنزلية. عند الحجز، اختر 'في المنزل' وسيصلك المختص إلى عنوانك في الوقت المحدد." },
      { q: "كيف يمكنني إلغاء حجز أو تأجيله؟", a: "من الصفحة الرئيسية → 'مواعيدي القادمة' → عرض الكل، ثم انقر على الحجز واختر 'إلغاء الموعد' أو 'تأجيل'. الإلغاء مجاني إذا تم قبل 24 ساعة من الموعد." },
      { q: "كيف أعرف أن حجزي تم بنجاح؟", a: "ستصلك رسالة نصية وإشعار في التطبيق فور تأكيد الحجز. كما يمكنك رؤية الحجز في صفحة 'مواعيدي القادمة'." },
      { q: "هل يمكنني حجز خدمات متعددة في نفس الوقت؟", a: "نعم! يمكنك إضافة أكثر من خدمة إلى السلة ودفع ثمنها معاً. استخدم أيقونة السلة في أعلى الصفحة." },
    ],
  },
  {
    category: "المختبرات والتحاليل",
    emoji: "🔬",
    color: "#22C55E",
    items: [
      { q: "كيف أحصل على نتائج التحاليل؟", a: "بعد إجراء التحليل، ستصلك النتائج إلكترونياً على التطبيق وعبر الرسائل النصية خلال الوقت المحدد (عادةً 12-48 ساعة حسب نوع التحليل)." },
      { q: "هل خدمة السحب المنزلي متاحة لجميع المختبرات؟", a: "خدمة السحب المنزلي متاحة في مختارة من المختبرات. ابحث عن أيقونة 'سحب منزلي' في بطاقة المختبر. مختبرات كير لاب تقدم هذه الخدمة 24 ساعة." },
      { q: "كيف أستخدم كود الخصم في الدفع؟", a: "في صفحة العروض، انقر على الكود لنسخه. عند الدفع في خطوة 'كود الخصم'، الصق الكود ليُطبَّق الخصم تلقائياً." },
    ],
  },
  {
    category: "العناية والجمال",
    emoji: "💆‍♀️",
    color: "#EC4899",
    items: [
      { q: "كيف أحجز جلسة تجميل في المنزل؟", a: "اذهب إلى قسم العناية والجمال → اختر المركز أو الخبيرة → انقر 'احجزي الآن' → اختر 'في المنزل'. أدخلي عنوانك وسيصلك المختص في الموعد." },
      { q: "هل يمكنني طلب استشارة جمال عبر الفيديو؟", a: "نعم! كثير من خبراء الجمال يقدمون استشارات فيديو. ابحثي عن أيقونة 📹 في بطاقة الخبير." },
      { q: "كيف أعرف إذا كان المركز يخدم الرجال أو النساء؟", a: "في صفحة العناية والجمال، استخدمي فلتر 'نسائي / رجالي' لتصفية النتائج." },
    ],
  },
  {
    category: "الحساب والاشتراك",
    emoji: "👤",
    color: "#A86DBF",
    items: [
      { q: "ما الفرق بين الباقة المجانية وPRO؟", a: "الباقة المجانية تتيح الخدمات الأساسية. أكسير PRO يتيح: مساعد AI متقدم بدون قيود، تحليلات صحية مفصلة، أولوية في الحجوزات، وخصومات حصرية." },
      { q: "كيف أغير كلمة المرور أو بريدي الإلكتروني؟", a: "اذهب إلى 'حسابي' → 'الأمان والخصوصية' → اختر 'تغيير كلمة المرور' أو 'تغيير البريد الإلكتروني'." },
      { q: "هل يمكنني مشاركة الاشتراك مع أفراد العائلة؟", a: "نعم! توفر أكسير باقة عائلية تتيح لـ4 أفراد الاستفادة من المزايا المميزة." },
    ],
  },
  {
    category: "نقاط المكافآت",
    emoji: "⭐",
    color: "#F59E0B",
    items: [
      { q: "كيف أكسب نقاطاً في أكسير؟", a: "تكسب نقاطاً من خلال: شرب الماء (+3 نقاط/كأس)، تسجيل التمارين (+15 نقطة)، تتبع الوجبات (+25 نقطة/يوم)، تسجيل النوم (+25 نقطة/يوم)." },
      { q: "كيف أستبدل نقاطي بخصومات؟", a: "اذهب إلى صفحة النقاط → 'استبدال النقاط'. توفر 5 مستويات من الخصومات تبدأ من 500 نقطة." },
    ],
  },
  {
    category: "الدفع والفواتير",
    emoji: "💳",
    color: "#10B981",
    items: [
      { q: "ما طرق الدفع المتاحة؟", a: "يدعم أكسير: Apple Pay، بطاقة ائتمانية/مدى، STC Pay. جميع المدفوعات مشفرة وآمنة." },
      { q: "كيف أحصل على فاتورة الخدمة؟", a: "بعد إتمام أي معاملة، يمكنك عرض الفاتورة من صفحة 'حجوزاتي' → الحجز المكتمل → 'عرض الفاتورة'. يمكن مشاركتها كـPDF." },
      { q: "هل يمكن استرداد المبلغ في حال الإلغاء؟", a: "نعم، الإلغاء قبل 24 ساعة من الموعد يُعيد المبلغ كاملاً. الإلغاء خلال 24 ساعة يُعيد 50% من المبلغ." },
    ],
  },
];

const FAQS_EN = [
  {
    category: "Bookings & Services",
    emoji: "📅",
    color: "#3B82F6",
    items: [
      { q: "Can I book a home visit service?", a: "Yes! Many Akseer services support home visits. When booking, choose 'At Home' and the specialist will come to your address at the scheduled time." },
      { q: "How can I cancel or reschedule a booking?", a: "From the Home page → 'Upcoming Appointments' → View All, then tap the booking and choose 'Cancel' or 'Reschedule'. Cancellation is free if done 24 hours before the appointment." },
      { q: "How do I know my booking was successful?", a: "You'll receive an SMS and in-app notification once your booking is confirmed. You can also see the booking in 'Upcoming Appointments'." },
      { q: "Can I book multiple services at the same time?", a: "Yes! You can add more than one service to the cart and pay for them together. Use the cart icon at the top of the page." },
    ],
  },
  {
    category: "Labs & Tests",
    emoji: "🔬",
    color: "#22C55E",
    items: [
      { q: "How do I get my test results?", a: "After your test, results will be sent electronically to the app and via SMS within the specified time (usually 12–48 hours depending on the test type)." },
      { q: "Is home sample collection available at all labs?", a: "Home collection is available at select labs. Look for the 'Home Collection' icon on the lab card. CareL ab offers this service 24 hours." },
      { q: "How do I use a discount code at checkout?", a: "On the offers page, tap the code to copy it. At checkout in the 'Discount Code' step, paste the code and the discount will apply automatically." },
    ],
  },
  {
    category: "Beauty & Care",
    emoji: "💆‍♀️",
    color: "#EC4899",
    items: [
      { q: "How do I book a beauty session at home?", a: "Go to Beauty & Care → Choose the center or specialist → Tap 'Book Now' → Select 'At Home'. Enter your address and the specialist will arrive on time." },
      { q: "Can I request a beauty consultation via video?", a: "Yes! Many beauty experts offer video consultations. Look for the 📹 icon on the expert's card." },
      { q: "How do I know if a center serves men or women?", a: "On the Beauty & Care page, use the 'Women / Men' filter at the top to filter results." },
    ],
  },
  {
    category: "Account & Subscription",
    emoji: "👤",
    color: "#A86DBF",
    items: [
      { q: "What's the difference between Free and PRO?", a: "The free plan offers basic services. Akseer PRO provides: unlimited advanced AI assistant, detailed health analytics, booking priority, and exclusive discounts." },
      { q: "How do I change my password or email?", a: "Go to 'My Account' → 'Security & Privacy' → Choose 'Change Password' or 'Change Email'." },
      { q: "Can I share my subscription with family members?", a: "Yes! Akseer offers a family plan for up to 4 members to enjoy premium benefits." },
    ],
  },
  {
    category: "Reward Points",
    emoji: "⭐",
    color: "#F59E0B",
    items: [
      { q: "How do I earn points in Akseer?", a: "Earn points by: drinking water (+3 pts/glass), logging workouts (+15 pts), tracking meals (+25 pts/day), logging sleep (+25 pts/day)." },
      { q: "How do I redeem my points for discounts?", a: "Go to the Points page → 'Redeem Points'. There are 5 discount tiers starting from 500 points." },
    ],
  },
  {
    category: "Payments & Invoices",
    emoji: "💳",
    color: "#10B981",
    items: [
      { q: "What payment methods are available?", a: "Akseer supports: Apple Pay, credit/debit card (Mada), STC Pay. All payments are encrypted and secure." },
      { q: "How do I get a service invoice?", a: "After any transaction, view the invoice from 'My Bookings' → Completed booking → 'View Invoice'. It can be shared as a PDF." },
      { q: "Can I get a refund if I cancel?", a: "Yes, cancellation 24 hours before the appointment gets a full refund. Cancellation within 24 hours gets a 50% refund." },
    ],
  },
];

export default function AIFaqScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const [expanded, setExpanded] = useState<string | null>(null);

  const FAQS = lang === "ar" ? FAQS_AR : FAQS_EN;
  const toggle = (key: string) => setExpanded(expanded === key ? null : key);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("الأسئلة الشائعة ❓", "FAQ ❓")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroBanner, { backgroundColor: isDark ? "#1C1330" : "#F5F0FF", borderColor: "#A86DBF25" }]}>
          <Text style={{ fontSize: 32 }}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>{t("مركز المساعدة", "Help Center")}</Text>
            <Text style={[styles.heroSub, { color: colors.muted }]}>{t("اعثر على إجابة لأي سؤال عن تطبيق أكسير", "Find answers to any question about the Akseer app")}</Text>
          </View>
        </View>

        {FAQS.map((cat) => (
          <View key={cat.category} style={{ marginBottom: 6 }}>
            <View style={styles.catHeader}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + "18" }]}>
                <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
              </View>
              <Text style={[styles.catTitle, { color: colors.text }]}>{cat.category}</Text>
            </View>

            {cat.items.map((item, i) => {
              const key = `${cat.category}-${i}`;
              const isOpen = expanded === key;
              return (
                <View key={key} style={[styles.faqCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: isOpen ? cat.color + "40" : colors.border }]}>
                  <Pressable onPress={() => toggle(key)} style={styles.faqQuestion}>
                    <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={isOpen ? cat.color : colors.muted} />
                    <Text style={[styles.faqQ, { color: colors.text, flex: 1 }]}>{item.q}</Text>
                  </Pressable>
                  {isOpen && (
                    <View style={[styles.faqAnswer, { borderTopColor: colors.border }]}>
                      <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <Pressable
          style={[styles.chatBtn, { backgroundColor: "#A86DBF" }]}
          onPress={() => router.back()}
        >
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.chatBtnTxt}>{t("عودة للدردشة مع المساعد الذكي", "Back to AI Assistant Chat")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  heroBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 20 },
  heroTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  heroSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  catHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 10, marginTop: 10 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  catTitle: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  faqCard: { borderRadius: 14, borderWidth: 1, marginBottom: 8, overflow: "hidden" },
  faqQuestion: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 14 },
  faqQ: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", lineHeight: 22 },
  faqAnswer: { borderTopWidth: 1, padding: 14, paddingTop: 12 },
  faqA: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22 },
  chatBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 16, marginTop: 20 },
  chatBtnTxt: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
