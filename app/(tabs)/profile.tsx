import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  I18nManager,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import AkseerDropLogo from "@/components/AkseerDropLogo";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const FAQ_ITEMS = [
  { q: "هل الخدمات مجانية للمستخدم؟", a: "نعم! الخدمات الأساسية مجانية تماماً للأبد بدون بطاقة ائتمان. الباقة المدفوعة تضيف مزايا متقدمة كرسائل AI غير محدودة والتقارير الصحية." },
  { q: "هل بياناتي الصحية آمنة؟", a: "بالكامل. نستخدم تشفير AES-256 ولا نشارك بياناتك مع أي طرف ثالث. بياناتك ملكك وحدك." },
  { q: "هل يمكنني إلغاء الاشتراك؟", a: "بالطبع! يمكنك إلغاء اشتراكك في أي وقت من صفحة الاشتراك. لا رسوم إلغاء ولا التزامات." },
  { q: "هل التطبيق متاح على iOS وAndroid؟", a: "نعم! اكسير متاح على App Store وGoogle Play. يمكنك أيضاً استخدامه عبر المتصفح." },
];

const REVIEWS = [
  { name: "أحمد الغامدي",  color: "#3B82F6", initial: "أ", time: "منذ 3 أشهر", stars: 5, text: "أفضل تطبيق صحي جربته. في شهر واحد خسرت 4 كيلو وبدأت أتابع صحتي بشكل منظم. حجز المختبر كان سهل جداً وجاءني رجل لأخذ العينة في المنزل!" },
  { name: "نورة العتيبي",  color: "#EC4899", initial: "ن", time: "منذ شهر",   stars: 5, text: "متابعة الدورة الشهرية والهرمونات كانت ميزة غيّرت حياتي. والمساعد الذكي يجاوب على أسئلتي الصحية في أي وقت. 10/10!" },
  { name: "محمد الشمري",  color: "#22C55E", initial: "م", time: "منذ أسبوع", stars: 5, text: "حجزت صالون حلاقة وطبيب في نفس اليوم من التطبيق! التصميم جميل والتطبيق سريع جداً. أنصح به كل الناس." },
];

const SERVICES = [
  { emoji: "🔬", title: "المختبرات الطبية",   sub: "نتائج رقمية خلال 24 ساعة" },
  { emoji: "🩺", title: "عيادات اكسير",       sub: "أطباء معتمدون · فيديو وحضوري" },
  { emoji: "💈", title: "العناية والجمال",     sub: "رجالي ونسائي · دفع آمن" },
  { emoji: "🤸", title: "المدربون الشخصيون",  sub: "معتمدون لكل مستوى" },
  { emoji: "🤖", title: "مساعد AI صحي",       sub: "إجابة فورية 24/7" },
  { emoji: "📊", title: "تتبع الصحة",          sub: "سعرات · ماء · نوم · وزن" },
  { emoji: "🏆", title: "تحديات ومجتمع",      sub: "نقاط وشارات يومية محفزة" },
  { emoji: "🛍️", title: "اكسير ماركت",        sub: "مكملات وأجهزة بأفضل سعر" },
];

function AboutModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const D = "#1A0B2E";
  const D2 = "#150C2A";

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: D }}>
        {/* Header */}
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: isWeb ? 20 : 56, paddingBottom: 16, backgroundColor: D2 }}>
          <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20 }}>عن اكسير ✨</Text>
          <Pressable onPress={onClose} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }}>
            <Feather name="x" size={20} color="#fff" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Hero */}
          <LinearGradient colors={["#2D0A5C", "#1A0B2E"]} style={{ paddingHorizontal: 24, paddingVertical: 32, alignItems: "center" }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>💧</Text>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 26, textAlign: "center", marginBottom: 8 }}>اكسير</Text>
            <Text style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Tajawal_400Regular", fontSize: 14, textAlign: "center", lineHeight: 22 }}>
              منصة الصحة الشاملة للمملكة العربية السعودية{"\n"}تتبع صحتك، احجز خدماتك، وعِش بصحة أفضل 🇸🇦
            </Text>
          </LinearGradient>

          {/* كل ما تحتاجه */}
          <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 4 }}>كل ما تحتاجه لصحة مثالية</Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "center", marginBottom: 20 }}>9 خدمات متكاملة في منصة واحدة</Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 }}>
              {SERVICES.map((s) => (
                <View key={s.title} style={{ width: "47.5%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 16, gap: 6 }}>
                  <Text style={{ fontSize: 28 }}>{s.emoji}</Text>
                  <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13 }}>{s.title}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 11 }}>{s.sub}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* مصمم لكل فرد */}
          <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 16 }}>مصمم لكل فرد في الأسرة</Text>
            <View style={{ flexDirection: "row-reverse", gap: 10 }}>
              <View style={{ flex: 1, backgroundColor: "rgba(236,72,153,0.15)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(236,72,153,0.3)" }}>
                <Text style={{ fontSize: 30, marginBottom: 8 }}>👩</Text>
                <Text style={{ color: "#EC4899", fontFamily: "Cairo_700Bold", fontSize: 14, marginBottom: 4 }}>صحة المرأة</Text>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 11, lineHeight: 18 }}>دورة شهرية · حمل · بشرة هرمونات · شعر · تغذية</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: "rgba(59,130,246,0.15)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(59,130,246,0.3)" }}>
                <Text style={{ fontSize: 30, marginBottom: 8 }}>👨</Text>
                <Text style={{ color: "#60A5FA", fontFamily: "Cairo_700Bold", fontSize: 14, marginBottom: 4 }}>صحة الرجل</Text>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 11, lineHeight: 18 }}>هرمونات · قلب · بروستاتا نوم · إنجابية · لياقة</Text>
              </View>
            </View>
          </View>

          {/* كيف يعمل */}
          <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 20 }}>كيف يعمل اكسير؟</Text>
            {[
              { n: "1", title: "سجّل وخصص تجربتك", sub: "أجب على 5 أسئلة سريعة – يضبط اكسير خطتك الصحية فوراً" },
              { n: "2", title: "تابع صحتك يومياً", sub: "سجّل نومك، ماءك، وجباتك وخطواتك – اكسير يحللها لك" },
              { n: "3", title: "احجز واستشر بضغطة", sub: "أطباء، مختبرات، صالونات، مدربون – كل شيء في مكان واحد" },
            ].map((step) => (
              <View key={step.n} style={{ flexDirection: "row-reverse", alignItems: "flex-start", gap: 14, marginBottom: 16, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5D26A", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Text style={{ color: "#0F0520", fontFamily: "Cairo_700Bold", fontSize: 16 }}>{step.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 14, textAlign: "right", marginBottom: 4 }}>{step.title}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", lineHeight: 18 }}>{step.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* الأسعار */}
          <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 4 }}>اختر باقتك</Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "center", marginBottom: 20 }}>الخدمات الأساسية مجانية دائماً</Text>

            {/* مجاني */}
            <View style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 18 }}>مجاني</Text>
                <View style={{ flexDirection: "row-reverse", alignItems: "baseline", gap: 4 }}>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 12 }}>ريال/شهر</Text>
                  <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 26 }}>0</Text>
                </View>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginBottom: 12 }}>للأبد – بلا بطاقة ائتمان</Text>
              {["تتبع الصحة اليومي", "عيادات اكسير والحجوزات", "المختبرات والصالونات", "مجتمع اكسير والتحديات"].map((f) => (
                <View key={f} style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Feather name="check" size={14} color="#A78BFA" />
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Tajawal_400Regular", fontSize: 13 }}>{f}</Text>
                </View>
              ))}
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
                <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 13 }}>5 رسائل AI يومياً</Text>
              </View>
            </View>

            {/* بريميوم */}
            <View style={{ backgroundColor: "#1E0A40", borderRadius: 20, padding: 20, borderWidth: 2, borderColor: "#F5D26A50", position: "relative" }}>
              <View style={{ position: "absolute", top: -1, left: 16, backgroundColor: "#F5D26A", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 }}>
                <Text style={{ color: "#0F0520", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>⭐ الأكثر طلباً</Text>
              </View>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, marginBottom: 4 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 18 }}>👑</Text>
                  <Text style={{ color: "#F5D26A", fontFamily: "Cairo_700Bold", fontSize: 18 }}>بريميوم</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", alignItems: "baseline", gap: 4 }}>
                  <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Tajawal_400Regular", fontSize: 12 }}>ريال/شهر</Text>
                  <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 26 }}>12.99</Text>
                </View>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginBottom: 14, textDecorationLine: "line-through" }}>أو 99.99 سنوياً</Text>
              {[
                "كل مزايا الباقة المجانية",
                "رسائل AI غير محدودة",
                "تحليل تغذية تفصيلي (فيتامينات ومعادن)",
                "تقارير صحية شهرية PDF",
                "أولوية في الحجوزات",
                "خصم 10% على جميع الخدمات",
              ].map((f) => (
                <View key={f} style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Feather name="check" size={14} color="#F5D26A" />
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Tajawal_400Regular", fontSize: 13 }}>{f}</Text>
                </View>
              ))}
              <Pressable style={{ backgroundColor: "#F5D26A", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 12 }}>
                <Text style={{ color: "#0F0520", fontFamily: "Cairo_700Bold", fontSize: 15 }}>ابدأ تجربة مجانية 7 أيام ←</Text>
              </Pressable>
            </View>
          </View>

          {/* آراء */}
          <View style={{ paddingHorizontal: 20, paddingTop: 32 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 20 }}>ماذا قالوا عن اكسير</Text>
            {REVIEWS.map((r) => (
              <View key={r.name} style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: r.color, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 16 }}>{r.initial}</Text>
                    </View>
                    <View>
                      <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13, textAlign: "right" }}>{r.name}</Text>
                      <Text style={{ color: "#F5D26A", fontSize: 12 }}>{"★".repeat(r.stars)}</Text>
                    </View>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Tajawal_400Regular", fontSize: 11 }}>{r.time}</Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "right", lineHeight: 20 }}>{r.text}</Text>
              </View>
            ))}
          </View>

          {/* FAQ */}
          <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20, textAlign: "center", marginBottom: 16 }}>الأسئلة الشائعة</Text>
            {FAQ_ITEMS.map((item, i) => (
              <Pressable key={i} onPress={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontFamily: "Tajawal_500Medium", fontSize: 13, flex: 1, textAlign: "right" }}>{item.q}</Text>
                  <Feather name={openFaq === i ? "minus" : "plus"} size={18} color="rgba(255,255,255,0.4)" style={{ marginLeft: 8 }} />
                </View>
                {openFaq === i && (
                  <Text style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Tajawal_400Regular", fontSize: 12, textAlign: "right", marginTop: 10, lineHeight: 20 }}>{item.a}</Text>
                )}
              </Pressable>
            ))}
          </View>

          {/* CTA */}
          <View style={{ paddingHorizontal: 20, paddingTop: 32, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 22, textAlign: "center", marginBottom: 6 }}>ابدأ رحلتك الصحية اليوم</Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: "center", marginBottom: 20 }}>مجاني تماماً – لا بطاقة ائتمان مطلوبة</Text>
            <Pressable onPress={onClose} style={{ backgroundColor: "#F5D26A", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, alignItems: "center", width: "100%" }}>
              <Text style={{ color: "#0F0520", fontFamily: "Cairo_700Bold", fontSize: 16 }}>ابدأ مجاناً 🚀</Text>
            </Pressable>
            <Text style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Tajawal_400Regular", fontSize: 11, marginTop: 20, textAlign: "center" }}>
              اكسير v2.0 · صُنع بـ ❤️ في المملكة العربية السعودية
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profile, setProfile, workoutLogs, bookings, totalMonthlyPoints, pointsHistory, logout } = useApp();
  const { t, lang, toggleLang, isRTL } = useLanguage();

  const topPadding = isWeb ? 67 : insets.top;

  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing]         = useState(false);
  const [showAbout, setShowAbout]     = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [name, setName]               = useState(profile?.name || "");
  const [email, setEmail]             = useState(profile?.email || "");
  const [city, setCity]               = useState(profile?.city || "");
  const [weight, setWeight]           = useState(profile?.weight?.toString() || "");
  const [height, setHeight]           = useState(profile?.height?.toString() || "");

  const bmi = profile ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : null;

  const totalPoints  = pointsHistory.reduce((s, p) => s + p.total, 0) + (profile?.points || 0);
  const streak       = 14;
  const isPro        = profile?.isPro ?? false;
  const invoiceCount = 3;
  const reportCount  = pointsHistory.length;
  const notifCount   = 5;

  const handleSave = () => {
    if (!name) return Alert.alert(t("خطأ", "Error"), t("يرجى إدخال الاسم", "Please enter your name"));
    if (profile) {
      setProfile({ ...profile, name, email, city, weight: parseFloat(weight) || profile.weight, height: parseFloat(height) || profile.height });
    }
    setEditing(false);
    Alert.alert(t("تم الحفظ", "Saved"), t("تم تحديث ملفك الشخصي", "Your profile has been updated"));
  };

  const CARD_BG   = isDark ? colors.card : "#fff";
  const CARD_BDR  = colors.border;
  const SEC_TITLE_C = colors.muted;

  const ACCOUNT_ITEMS = [
    { id: "edit",     label: t("معلومات حسابي", "My Account Info"),    sub: t("الاسم، البريد، رقم الجوال", "Name, email, phone"),                      emoji: "✏️", color: "#C490D8" },
    { id: "goals",    label: t("أهدافي الصحية", "My Health Goals"),    sub: t("الوزن المستهدف، السعرات، الخطة", "Target weight, calories, plan"),       emoji: "🎯", color: "#F59E0B" },
    { id: "reports",  label: t("تقاريري الصحية", "My Health Reports"),  sub: t("تحليل تقدمك الشهري والأسبوعي", "Monthly & weekly progress analysis"),   emoji: "📊", color: "#3B82F6" },
    { id: "security", label: t("الأمان وكلمة المرور", "Security & Password"), sub: t("تغيير كلمة المرور، المصادقة الثنائية", "Change password, 2FA"), emoji: "🔒", color: "#22C55E" },
  ];

  const DEVICES = [
    { id: "watch",    label: "Apple Watch",          sub: "آخر مزامنة: منذ 2 دقيقة", connected: true  },
    { id: "galaxy",   label: "Samsung Galaxy Watch", sub: "اضغط للربط",              connected: false },
    { id: "fitbit",   label: "Fitbit",               sub: "اضغط للربط",              connected: false },
  ];

  const SETTINGS_ITEMS = [
    { id: "theme",   label: t("الوضع الليلي / النهاري", "Dark / Light Mode"),   sub: isDark ? t("الوضع الليلي مفعّل", "Dark mode on") : t("الوضع النهاري مفعّل", "Light mode on"), emoji: "🌙", color: "#6366F1", isToggle: true },
    { id: "notif",   label: t("الإشعارات", "Notifications"),                     sub: t("تخصيص التنبيهات والتذكيرات", "Customize alerts & reminders"),                           emoji: "🔔", color: "#F59E0B" },
    { id: "lang",    label: t("اللغة / Language", "Language / اللغة"),           sub: lang === "ar" ? "العربية – اضغط للتغيير للإنجليزية" : "English – tap to switch to Arabic",  emoji: "🌍", color: "#3B82F6", badge: lang === "ar" ? "AR" : "EN" },
    { id: "privacy", label: t("الخصوصية والأمان", "Privacy & Security"),          sub: t("إدارة بياناتك وصلاحيات التطبيق", "Manage your data and app permissions"),              emoji: "🛡️", color: "#22C55E" },
    { id: "help",    label: t("المساعدة والدعم", "Help & Support"),               sub: t("الأسئلة الشائعة والتواصل معنا", "FAQs and contact us"),                                emoji: "❓", color: "#EC4899" },
    { id: "about",   label: t("عن اكسير", "About Akseer"),                        sub: t("تعرف على المنصة وباقاتها ومميزاتها", "Learn about the platform and its features"),      emoji: "✨", color: "#A78BFA" },
  ];

  const handleItem = (id: string) => {
    if (id === "edit")          setEditing(true);
    else if (id === "about")    setShowAbout(true);
    else if (id === "reports")  router.push("/bookings" as any);
    else if (id === "lang")     toggleLang();
    else Alert.alert(t("قريباً", "Coming Soon"), t("هذه الميزة ستكون متاحة قريباً", "This feature will be available soon"));
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: isWeb ? 40 : insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); }}
            tintColor="#C490D8"
            colors={["#C490D8", "#7C3AED"]}
          />
        }
      >
        {/* ── Hero Card ── */}
        <LinearGradient
          colors={["#3B0764", "#6D28D9", "#A78BFA"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingTop: topPadding + 16, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          {/* Top bar */}
          <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
              <AkseerDropLogo size={22} fillProgress={0.8} />
              <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 18 }}>أكسير</Text>
            </View>
            <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
              <View style={{ backgroundColor: isPro ? "#F5D26A" : "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: isPro ? "#0F0520" : "#fff", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{isPro ? "بريميوم ⭐" : "مجاني"}</Text>
              </View>
              <Pressable style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 6 }}>
                <Text style={{ fontSize: 13 }}>🔔</Text>
              </Pressable>
              <Pressable onPress={toggleTheme} style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 6 }}>
                <Text style={{ fontSize: 13 }}>{isDark ? "☀️" : "🌙"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Avatar + info */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.4)" }}>
              <Text style={{ fontSize: 36 }}>{profile?.gender === "female" ? "👩" : "👨"}</Text>
            </View>
            <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 22, marginBottom: 2 }}>{profile?.name || "مستخدم اكسير"}</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Tajawal_400Regular", fontSize: 13, marginBottom: 14 }}>{profile?.email || "user@elixir.sa"}</Text>

            {/* Badges row */}
            <View style={{ flexDirection: "row-reverse", gap: 8, marginBottom: 16 }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row-reverse", gap: 4, alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>🏆</Text>
                <Text style={{ color: "#F5D26A", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{totalPoints.toLocaleString("ar-SA")} نقطة</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row-reverse", gap: 4, alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>🔥</Text>
                <Text style={{ color: "#FB923C", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{streak} يوم</Text>
              </View>
              <View style={{ backgroundColor: isPro ? "rgba(245,210,106,0.3)" : "rgba(255,255,255,0.15)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row-reverse", gap: 4, alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>⭐</Text>
                <Text style={{ color: isPro ? "#F5D26A" : "#fff", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{isPro ? "بريميوم" : "مجاني"}</Text>
              </View>
            </View>

            {/* Edit button */}
            <Pressable onPress={() => setEditing(true)} style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 24, flexDirection: "row-reverse", gap: 8, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" }}>
              <Text style={{ fontSize: 14 }}>✏️</Text>
              <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 13 }}>تعديل الملف الشخصي</Text>
            </Pressable>
          </View>

          {/* Quick stats */}
          <View style={{ flexDirection: "row-reverse", gap: 10 }}>
            {[
              { val: notifCount, label: "إشعار", emoji: "🔴" },
              { val: invoiceCount, label: "فاتورة", emoji: "🧾" },
              { val: reportCount, label: "تقرير", emoji: "📊" },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 20 }}>{s.val}</Text>
                <Text style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Tajawal_400Regular", fontSize: 11 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          {/* ── Edit form ── */}
          {editing && (
            <View style={[styles.card, { backgroundColor: CARD_BG, borderColor: CARD_BDR, marginBottom: 16 }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <Text style={{ color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 17 }}>تعديل الملف الشخصي</Text>
                <Pressable onPress={() => setEditing(false)}>
                  <Feather name="x" size={22} color={colors.muted} />
                </Pressable>
              </View>
              {[
                { label: "الاسم", value: name, setter: setName, keyb: "default" as const },
                { label: "البريد الإلكتروني", value: email, setter: setEmail, keyb: "email-address" as const },
                { label: "المدينة", value: city, setter: setCity, keyb: "default" as const },
              ].map((f) => (
                <View key={f.label}>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 12, textAlign: "right", marginBottom: 6 }}>{f.label}</Text>
                  <TextInput value={f.value} onChangeText={f.setter} keyboardType={f.keyb}
                    style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: CARD_BDR }]}
                    textAlign="right" />
                </View>
              ))}
              <View style={{ flexDirection: "row-reverse", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 12, textAlign: "right", marginBottom: 6 }}>الوزن (كجم)</Text>
                  <TextInput value={weight} onChangeText={setWeight} keyboardType="numeric"
                    style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: CARD_BDR }]}
                    textAlign="center" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 12, textAlign: "right", marginBottom: 6 }}>الطول (سم)</Text>
                  <TextInput value={height} onChangeText={setHeight} keyboardType="numeric"
                    style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: CARD_BDR }]}
                    textAlign="center" />
                </View>
              </View>
              <Pressable onPress={handleSave} style={{ backgroundColor: "#7C3AED", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 }}>
                <Text style={{ color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 15 }}>حفظ التغييرات</Text>
              </Pressable>
            </View>
          )}

          {/* ── الحساب ── */}
          <View style={[styles.section, { backgroundColor: CARD_BG, borderColor: CARD_BDR }]}>
            <Text style={[styles.sectionTitle, { color: SEC_TITLE_C }]}>👤 {t("الحساب", "Account")}</Text>
            {ACCOUNT_ITEMS.map((item, idx) => (
              <Pressable key={item.id}
                style={[styles.row, { borderBottomWidth: idx < ACCOUNT_ITEMS.length - 1 ? 1 : 0, borderColor: CARD_BDR }]}
                onPress={() => handleItem(item.id)}
              >
                <Feather name="chevron-left" size={16} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{item.label}</Text>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{item.sub}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: item.color + "18" }]}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* ── الاشتراك ── */}
          <View style={[styles.section, { backgroundColor: CARD_BG, borderColor: CARD_BDR }]}>
            <Text style={[styles.sectionTitle, { color: SEC_TITLE_C }]}>⭐ {t("الاشتراك", "Subscription")}</Text>

            {/* بريميوم نشط */}
            <View style={[styles.row, { borderBottomWidth: 1, borderColor: CARD_BDR }]}>
              <View style={{ backgroundColor: "#22C55E20", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: "#22C55E", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{t("نشط", "Active")}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 14, textAlign: "right" }}>{t("بريميوم نشط", "Premium Active")}</Text>
                <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{t("يتجدد في 3 أبريل 2026 · 12.99 ر/شهر", "Renews Apr 3, 2026 · 12.99 SAR/mo")}</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#F5D26A18" }]}>
                <Text style={{ fontSize: 18 }}>⭐</Text>
              </View>
            </View>

            {/* ترقية */}
            <Pressable style={[styles.row, { borderBottomWidth: 1, borderColor: CARD_BDR }]} onPress={() => Alert.alert(t("الباقة السنوية", "Annual Plan"), t("وفر 30% – 100 ريال/سنة فقط!", "Save 30% – only 100 SAR/year!"))}>
              <Text style={{ color: "#6D28D9", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{t("ترقية ›", "Upgrade ›")}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{t("ترقية للباقة السنوية", "Upgrade to Annual Plan")}</Text>
                <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{t("وفر 30% – 100 ريال/سنة فقط", "Save 30% – 100 SAR/year only")}</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#6D28D918" }]}>
                <Text style={{ fontSize: 18 }}>💎</Text>
              </View>
            </Pressable>

            {/* عائلية */}
            <Pressable style={[styles.row, { borderBottomWidth: 1, borderColor: CARD_BDR }]} onPress={() => Alert.alert(t("الباقة العائلية", "Family Plan"), t("25.99 ر/شهر للأسرة كاملة", "25.99 SAR/month for the whole family"))}>
              <Text style={{ color: "#6D28D9", fontFamily: "Tajawal_700Bold", fontSize: 12 }}>{t("اشترك ›", "Subscribe ›")}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{t("الباقة العائلية", "Family Plan")}</Text>
                <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{t("25.99 ر/شهر · 4 أفراد · حسابات مستقلة", "25.99 SAR/mo · 4 members · individual accounts")}</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#EC489918" }]}>
                <Text style={{ fontSize: 18 }}>👨‍👩‍👧</Text>
              </View>
            </Pressable>

            {/* فواتير */}
            <Pressable style={styles.row} onPress={() => Alert.alert(t("الفواتير", "Invoices"), t("سجل المعاملات المالية", "Financial transactions history"))}>
              <Feather name="chevron-left" size={16} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{t("الفواتير والمدفوعات", "Invoices & Payments")}</Text>
                <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{t("سجل المعاملات المالية", "Financial transactions history")}</Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: "#3B82F618" }]}>
                <Text style={{ fontSize: 18 }}>🧾</Text>
              </View>
            </Pressable>
          </View>

          {/* ── الأجهزة الذكية ── */}
          <View style={[styles.section, { backgroundColor: CARD_BG, borderColor: CARD_BDR }]}>
            <Text style={[styles.sectionTitle, { color: SEC_TITLE_C }]}>📱 {t("الأجهزة الذكية", "Smart Devices")}</Text>
            {DEVICES.map((d, idx) => (
              <View key={d.id} style={[styles.row, { borderBottomWidth: idx < DEVICES.length - 1 ? 1 : 0, borderColor: CARD_BDR }]}>
                {d.connected ? (
                  <View style={{ backgroundColor: "#22C55E20", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: "#22C55E", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{t("متصلة", "Connected")}</Text>
                  </View>
                ) : (
                  <Pressable onPress={() => Alert.alert(t("ربط الجهاز", "Connect Device"), `${t("اضغط لربط", "Tap to connect")} ${d.label}`)} style={{ backgroundColor: "#6D28D918", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: "#A78BFA", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{t("ربط +", "Connect +")}</Text>
                  </Pressable>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{d.label}</Text>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{d.sub}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: d.connected ? "#22C55E18" : isDark ? colors.surfaceAlt : "#F5F5F5" }]}>
                  <Text style={{ fontSize: 18 }}>{d.id === "watch" ? "⌚" : d.id === "galaxy" ? "📱" : "💙"}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── الإعدادات ── */}
          <View style={[styles.section, { backgroundColor: CARD_BG, borderColor: CARD_BDR }]}>
            <Text style={[styles.sectionTitle, { color: SEC_TITLE_C }]}>⚙️ {t("الإعدادات", "Settings")}</Text>
            {SETTINGS_ITEMS.map((item, idx) => (
              <Pressable key={item.id}
                style={[styles.row, { borderBottomWidth: idx < SETTINGS_ITEMS.length - 1 ? 1 : 0, borderColor: CARD_BDR }]}
                onPress={() => handleItem(item.id)}
              >
                {item.isToggle ? (
                  <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: "#E5E7EB", true: "#6D28D9" }} thumbColor="#fff" />
                ) : item.badge ? (
                  <View style={{ backgroundColor: "#3B82F620", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: "#3B82F6", fontFamily: "Tajawal_700Bold", fontSize: 11 }}>{item.badge}</Text>
                  </View>
                ) : (
                  <Feather name="chevron-left" size={16} color={colors.muted} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: "Tajawal_500Medium", fontSize: 14, textAlign: "right" }}>{item.label}</Text>
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: "right", marginTop: 1 }}>{item.sub}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: item.color + "18" }]}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Logout */}
          <Pressable
            style={{ borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#F43F5E30", marginBottom: 16 }}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Text style={{ color: "#F43F5E", fontFamily: "Tajawal_700Bold", fontSize: 15 }}>{t("تسجيل الخروج", "Sign Out")}</Text>
          </Pressable>

          <Text style={{ textAlign: "center", color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 11, marginBottom: 10 }}>
            {t("اكسير — الصحة والعناية والجمال • v2.0 ❤️ المملكة العربية السعودية", "Akseer — Health, Wellness & Beauty • v2.0 ❤️ Saudi Arabia")}
          </Text>
        </View>
      </ScrollView>

      <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} isDark={isDark} />

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade" onRequestClose={() => setShowLogoutConfirm(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <View style={{ width: "100%", backgroundColor: isDark ? "#1C1330" : "#fff", borderRadius: 24, padding: 28, alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#F43F5E18", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Feather name="log-out" size={28} color="#F43F5E" />
            </View>
            <Text style={{ fontFamily: "Cairo_700Bold", fontSize: 20, color: isDark ? "#fff" : "#1a1a2e", marginBottom: 8 }}>{t("تسجيل الخروج", "Sign Out")}</Text>
            <Text style={{ fontFamily: "Tajawal_400Regular", fontSize: 14, color: isDark ? "rgba(255,255,255,0.5)" : "#888", textAlign: "center", marginBottom: 28 }}>
              {t("هل أنت متأكد من تسجيل الخروج من حسابك؟", "Are you sure you want to sign out of your account?")}
            </Text>
            <Pressable
              style={{ width: "100%", backgroundColor: "#F43F5E", borderRadius: 14, paddingVertical: 15, alignItems: "center", marginBottom: 12 }}
              onPress={() => { setShowLogoutConfirm(false); logout(); router.replace("/auth" as any); }}
            >
              <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 16 }}>{t("نعم، تسجيل الخروج", "Yes, Sign Out")}</Text>
            </Pressable>
            <Pressable
              style={{ width: "100%", borderRadius: 14, paddingVertical: 15, alignItems: "center" }}
              onPress={() => setShowLogoutConfirm(false)}
            >
              <Text style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#888", fontFamily: "Tajawal_500Medium", fontSize: 15 }}>{t("إلغاء", "Cancel")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: { borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: "hidden" },
  sectionTitle: { fontSize: 12, fontFamily: "Tajawal_500Medium", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, textAlign: "right" },
  row: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 20, padding: 20, borderWidth: 1 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Tajawal_400Regular", marginBottom: 14 },
});
