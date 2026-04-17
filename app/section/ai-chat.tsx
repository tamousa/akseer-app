import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  I18nManager,
  KeyboardAvoidingView,
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
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const isIOS = Platform.OS === "ios";

interface Message {
  id: string;
  text: string;
  from: "user" | "bot";
  time: string;
}

const BOT_RESPONSES: Record<string, string> = {
  مرحبا: "مرحباً بك في مساعد أكسير الذكي! 🤖 أنا هنا لمساعدتك في كل ما يخص الصحة والجمال والعناية. كيف يمكنني مساعدتك اليوم؟",
  السلام: "وعليكم السلام! 👋🏼 أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟",
  مختبر: "🔬 يمكنك العثور على قائمة المختبرات في التطبيق عبر:\n• الصفحة الرئيسية → أيقونة المختبرات\n• صفحة صحتي → تبويب رعاية → المختبرات\n\nتوفر المختبرات خدمات مثل: تحاليل الدم، فحوصات الفيتامينات، التحاليل الجينية، وسحب المنازل. هل تريد حجز موعد؟",
  تحليل: "🔬 يمكنك حجز تحاليل طبية من خلال التطبيق عبر صفحة المختبرات. تتوفر لدينا مختبرات معتمدة مع خدمة السحب المنزلي، وإمكانية استلام النتائج إلكترونياً.\n\nهل تريد الانتقال إلى صفحة المختبرات؟",
  جمال: "💄 في قسم العناية والجمال، يمكنك:\n• حجز موعد في مراكز التجميل والصالونات\n• التواصل مع خبراء الجمال والعناية\n• الاستفادة من العروض الحصرية\n• الحجز في المركز أو في المنزل أو عبر استشارة فيديو\n\nهل تريد الانتقال إلى صفحة العناية والجمال؟",
  عناية: "✨ خدمات العناية والجمال في أكسير تشمل:\n🏠 مراكز التجميل والصالونات\n👩‍⚕️ خبراء الجمال والعناية\n🌿 مراكز الحجامة والسبا\n📱 استشارات عن بعد (هاتف أو فيديو)\n\nيمكنك الحجز في المركز، أو طلب الخدمة في المنزل!",
  صالون: "💅 لدينا مجموعة متنوعة من الصالونات في أكسير:\n• صالون لمسة للتجميل\n• صالون نضرة للشعر\n• سبا الهدوء\n• وأكثر...\n\nيمكنك الحجز مباشرة من التطبيق. هل تريد رؤية القائمة الكاملة؟",
  حجامة: "🌿 مراكز الحجامة المتاحة في أكسير تقدم:\n• حجامة جافة ورطبة\n• تدليك علاجي\n• علاج بالأعشاب\n• خدمة منزلية متاحة\n\nيمكنك حجز جلسة من صفحة العناية والجمال.",
  حجز: "📅 لحجز موعد في أكسير:\n1️⃣ اختر نوع الخدمة (عيادة، مختبر، جمال...)\n2️⃣ اختر المزود أو الخبير\n3️⃣ اختر طريقة الحجز: في المكان، منزلي، أو استشارة عن بعد\n4️⃣ اختر الوقت المناسب\n\nيمكنك مشاهدة جميع حجوزاتك في صفحة 'مواعيدي'.",
  عيادة: "🩺 تتوفر في أكسير عيادات ومختصون معتمدون في:\n• التغذية والنظام الغذائي\n• الطب الرياضي\n• الصحة النفسية\n• طب القلب والأوعية\n• الجلدية والتجميل\n\nالاستشارات متاحة حضورياً أو عبر الفيديو.",
  مواعيد: "📋 لمشاهدة مواعيدك:\n• اذهب إلى الصفحة الرئيسية → قسم 'مواعيدي القادمة'\n• أو انقر على زر 'عرض الكل'\n\nيمكنك إلغاء أو تأجيل أي موعد من هناك.",
  اشتراك: "⭐ باقات أكسير المتاحة:\n\n🆓 الباقة المجانية: الميزات الأساسية\n\n💎 أكسير PRO:\n• جميع الميزات بدون قيود\n• مساعد AI متقدم\n• تحليلات صحية مفصلة\n• أولوية في الحجوزات\n\nانتقل إلى 'حسابي' ← 'الاشتراك' لترقية باقتك.",
  حساب: "👤 يمكنك تعديل حسابك من صفحة 'حسابي' في الشريط السفلي:\n• تغيير الاسم والصورة\n• تحديث بيانات التواصل\n• إدارة الاشتراك\n• إعدادات الإشعارات\n• تغيير كلمة المرور",
  نقاط: "⭐ نظام نقاط أكسير:\nاكسب نقاطاً من خلال:\n• 💧 شرب الماء\n• 🏋️ تسجيل التمارين\n• 🍽️ تتبع الوجبات\n• 😴 تسجيل النوم\n\nيمكنك مشاهدة نقاطك من الصفحة الرئيسية. النقاط تُستبدل بخصومات وعروض حصرية!",
  متجر: "🛍️ في قسم المتاجر يمكنك:\n• تصفح منتجات الصحة والعناية\n• شراء مكملات غذائية معتمدة\n• منتجات العناية الطبيعية\n• أجهزة رياضية ومتابعة الصحة\n\nاذهب إلى تبويب 'الخدمات' للتسوق.",
  تغذية: "🥗 في قسم التغذية:\n• خطط غذائية مخصصة\n• تتبع السعرات الحرارية\n• استشارات مع خبراء تغذية\n• وصفات صحية يومية\n\nيمكنك الوصول له من صحتي ← نمط حياة أكثر صحة ← التغذية.",
  رياضة: "🏋️ في قسم التمارين الرياضية:\n• خطط تمارين مخصصة\n• تتبع التمارين اليومية\n• حاسبة السعرات المحروقة\n• جدول تمارين أسبوعي\n\nيمكنك الوصول له من صحتي ← التمارين الرياضية.",
  كلمة: "🔐 لتغيير كلمة المرور:\n1️⃣ اذهب إلى 'حسابي'\n2️⃣ اختر 'الأمان والخصوصية'\n3️⃣ انقر على 'تغيير كلمة المرور'\n4️⃣ أدخل كلمة المرور الحالية والجديدة",
  default: "شكراً لسؤالك! 😊 يمكنني مساعدتك في:\n• 🔬 المختبرات والتحاليل\n• 🩺 العيادات والاستشارات\n• 💆 العناية والجمال\n• 🛍️ المتاجر والمنتجات\n• 📅 الحجوزات والمواعيد\n• 👤 إدارة الحساب والاشتراك\n• ⭐ نظام النقاط\n\nاكتب استفسارك وسأجيبك فوراً!",
};

const QUICK_QUESTIONS_AR = [
  "كيف أحجز موعد؟",
  "ما هي المختبرات المتاحة؟",
  "عروض العناية والجمال",
  "كيف أشترك في PRO؟",
  "كيف أعدّل حسابي؟",
  "ما هو نظام النقاط؟",
  "صالونات للحجز",
  "استشارة غذائية",
];

const QUICK_QUESTIONS_EN = [
  "How do I book an appointment?",
  "What labs are available?",
  "Beauty & wellness offers",
  "How to subscribe to PRO?",
  "How to edit my account?",
  "What is the points system?",
  "Salons to book",
  "Nutrition consultation",
];


function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) {
      return response;
    }
  }
  return BOT_RESPONSES.default;
}

function getTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AIChatScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const scrollRef = useRef<ScrollView>(null);
  const { profile } = useApp();
  const { t, lang } = useLanguage();
  const firstName = profile?.name?.split(" ")[0] || "طارق";

  const QUICK_QUESTIONS = lang === "ar" ? QUICK_QUESTIONS_AR : QUICK_QUESTIONS_EN;

  const welcomeText = lang === "ar"
    ? `مرحباً ${firstName} 👋🏼 .. كيف اقدر اخدمك اليوم؟\n\nيمكنني مساعدتك في:\n• حجز موعد بالمختبرات والعيادات\n• خدمات العناية والجمال\n• معلومات المتاجر والعروض\n• إدارة حسابك واشتراكك\n• أي استفسار صحي أو عن التطبيق`
    : `Hello ${firstName} 👋🏼 .. How can I help you today?\n\nI can assist you with:\n• Booking appointments at labs and clinics\n• Beauty & wellness services\n• Store info and promotions\n• Managing your account & subscription\n• Any health or app-related questions`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      from: "bot",
      text: welcomeText,
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingDot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingDot, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(typingDot, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: "user", text: text.trim(), time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botText = getBotResponse(text.trim());
      const botMsg: Message = { id: (Date.now() + 1).toString(), from: "bot", text: botText, time: getTime() };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800 + Math.random() * 600);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.botAvatarHeader}>
            <Text style={{ fontSize: 20 }}>🤖</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t("مساعد أكسير الذكي", "Akseer AI Assistant")}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={[styles.onlineTxt, { color: "#22C55E" }]}>{t("متصل الآن", "Online")}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIOS ? "padding" : "height"}
        keyboardVerticalOffset={isWeb ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesArea}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.msgRow, msg.from === "user" ? styles.msgRowUser : styles.msgRowBot]}
            >
              {msg.from === "bot" && (
                <View style={styles.botAvatar}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                </View>
              )}
              <View style={{ maxWidth: "80%" }}>
                <View
                  style={[
                    styles.bubble,
                    msg.from === "user"
                      ? [styles.bubbleUser, { backgroundColor: "#A86DBF" }]
                      : [styles.bubbleBot, { backgroundColor: isDark ? colors.card : "#F0F0F8", borderColor: colors.border }],
                  ]}
                >
                  <Text style={[styles.bubbleTxt, { color: msg.from === "user" ? "#fff" : colors.text }]}>
                    {msg.text}
                  </Text>
                </View>
                <Text style={[styles.timeTxt, { color: colors.muted, textAlign: msg.from === "user" ? "right" : "left" }]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <View style={styles.botAvatar}>
                <Text style={{ fontSize: 16 }}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleBot, { backgroundColor: isDark ? colors.card : "#F0F0F8", borderColor: colors.border }]}>
                <View style={styles.typingDots}>
                  {[0, 1, 2].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.typingDot,
                        {
                          backgroundColor: colors.muted,
                          opacity: typingDot.interpolate({ inputRange: [0, 1], outputRange: [i === 0 ? 0.3 : i === 1 ? 0.6 : 1, i === 0 ? 1 : i === 1 ? 0.6 : 0.3] }),
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Quick Questions */}
          <View style={{ marginTop: 12, marginBottom: 4 }}>
            <Text style={[styles.quickTitle, { color: colors.muted }]}>{t("أسئلة شائعة للنقر عليها:", "Tap a common question:")}</Text>
            <View style={styles.quickGrid}>
              {QUICK_QUESTIONS.map((q, i) => (
                <Pressable
                  key={i}
                  onPress={() => sendMessage(q)}
                  style={[styles.quickChip, { backgroundColor: isDark ? colors.card : "#F0F0F8", borderColor: colors.border }]}
                >
                  <Text style={[styles.quickChipTxt, { color: "#A86DBF" }]}>{q}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* FAQ Link */}
          <Pressable
            onPress={() => router.push("/section/ai-faq" as any)}
            style={[styles.faqLink, { backgroundColor: isDark ? colors.card : "#F5F0FF", borderColor: "#A86DBF30" }]}
          >
            <Feather name="help-circle" size={18} color="#A86DBF" />
            <Text style={[styles.faqLinkTxt, { color: "#A86DBF" }]}>{t("لمزيداً من الأسئلة الأكثر شيوعاً", "More frequently asked questions")}</Text>
            <Feather name="chevron-left" size={16} color="#A86DBF" />
          </Pressable>
        </ScrollView>

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: isDark ? colors.surface : "#fff",
              borderTopColor: colors.border,
              paddingBottom: isWeb ? 16 : insets.bottom + 8,
            },
          ]}
        >
          <Pressable
            style={[styles.sendBtn, { backgroundColor: input.trim() ? "#A86DBF" : colors.border }]}
            onPress={() => sendMessage(input)}
          >
            <Feather name="send" size={18} color={input.trim() ? "#fff" : colors.muted} />
          </Pressable>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5" }]}
            value={input}
            onChangeText={setInput}
            placeholder={t("اكتب سؤالك هنا...", "Type your question here...")}
            placeholderTextColor={colors.muted}
            textAlign="right"
            multiline
            maxLength={300}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  botAvatarHeader: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#A86DBF20", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  onlineRow: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" },
  onlineTxt: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  messagesArea: { flex: 1 },
  msgRow: { flexDirection: "row-reverse", marginBottom: 12, alignItems: "flex-end", gap: 8 },
  msgRowUser: { justifyContent: "flex-start" },
  msgRowBot: { justifyContent: "flex-end" },
  botAvatar: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#A86DBF20", alignItems: "center", justifyContent: "center" },
  bubble: { borderRadius: 18, padding: 12, borderWidth: 1 },
  bubbleUser: { borderRadius: 18, borderTopLeftRadius: 6, borderWidth: 0 },
  bubbleBot: { borderRadius: 18, borderTopRightRadius: 6 },
  bubbleTxt: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22 },
  timeTxt: { fontSize: 10, fontFamily: "Tajawal_400Regular", marginTop: 3, paddingHorizontal: 4 },
  typingDots: { flexDirection: "row-reverse", gap: 4, paddingVertical: 2 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  quickTitle: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 8 },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  quickChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  quickChipTxt: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  faqLink: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 12, marginBottom: 8 },
  faqLinkTxt: { flex: 1, fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  inputBar: { flexDirection: "row-reverse", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, fontFamily: "Tajawal_400Regular", maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
