import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const PLANS = [
  {
    id: "free",
    name: "مجانية",
    price: 0,
    period: "",
    color: "#6B7280",
    features: [
      "متابعة الماكرو الأساسية",
      "3 حاسبات صحية",
      "تمارين محدودة (3 أيام/أسبوع)",
      "مقالات صحية مجانية",
      "حجز مواعيد عادي",
      "متابعة الوزن",
    ],
    limitations: [
      "إعلانات",
      "بدون مساعد AI",
      "بدون خطط تغذية مخصصة",
      "بدون تقارير صحية",
    ],
  },
  {
    id: "pro",
    name: "PRO",
    price: 49,
    period: "/شهر",
    color: "#A86DBF",
    popular: true,
    features: [
      "جميع مميزات المجانية",
      "مساعد AI للصحة والتغذية",
      "خطط تغذية مخصصة حسب أهدافك",
      "تمارين كاملة 7 أيام/أسبوع مع فيديو",
      "تقارير صحية أسبوعية وشهرية",
      "بدون إعلانات",
      "أولوية في حجز المواعيد",
      "استشارات نفسية شهرية مجانية",
      "متابعة النوم والمزاج المتقدمة",
      "تحليل تقدم اللياقة بالرسوم البيانية",
    ],
    limitations: [],
  },
  {
    id: "family",
    name: "عائلية",
    price: 89,
    period: "/شهر",
    color: "#22C55E",
    features: [
      "جميع مميزات PRO",
      "حتى 5 أفراد في العائلة",
      "لوحة تحكم عائلية",
      "متابعة صحة الأطفال",
      "خصم 20% على جميع الحجوزات",
      "مختص تغذية عائلي مخصص",
      "خطط وجبات عائلية",
      "تقارير صحية لكل فرد",
    ],
    limitations: [],
  },
];

export default function SubscriptionScreen() {
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const topPadding = isWeb ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>الاشتراكات</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.heroSection}>
        <Image source={require("@/assets/images/logo.png")} style={styles.heroLogo} resizeMode="contain" />
        <Text style={[styles.heroTitle, { color: colors.text }]}>اكسير PRO</Text>
        <Text style={[styles.heroSub, { color: colors.muted }]}>ارتقِ بصحتك مع مميزات حصرية</Text>
      </View>

      <View style={styles.plansContainer}>
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={[
                styles.planCard,
                {
                  backgroundColor: isDark ? colors.card : "#fff",
                  borderColor: isSelected ? plan.color : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularText}>الأكثر شيوعاً ⭐</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  {plan.price > 0 ? (
                    <>
                      <Text style={[styles.planPrice, { color: colors.text }]}>{plan.price}</Text>
                      <Text style={[styles.planCurrency, { color: colors.muted }]}>ر.س{plan.period}</Text>
                    </>
                  ) : (
                    <Text style={[styles.planPrice, { color: colors.text }]}>مجاناً</Text>
                  )}
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Feather name="check-circle" size={16} color={plan.color} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{f}</Text>
                  </View>
                ))}
                {plan.limitations.map((l, i) => (
                  <View key={`l-${i}`} style={styles.featureRow}>
                    <Feather name="x-circle" size={16} color="#F43F5E" />
                    <Text style={[styles.featureText, { color: colors.muted }]}>{l}</Text>
                  </View>
                ))}
              </View>

              {isSelected && plan.price > 0 && (
                <Pressable
                  style={[styles.subscribeBtn, { backgroundColor: plan.color }]}
                  onPress={() => Alert.alert("الاشتراك", `سيتم اشتراكك في باقة ${plan.name} بمبلغ ${plan.price} ر.س/شهر`, [{ text: "تأكيد" }, { text: "إلغاء", style: "cancel" }])}
                >
                  <Text style={styles.subscribeBtnText}>اشترك الآن</Text>
                </Pressable>
              )}
              {isSelected && plan.price === 0 && (
                <View style={[styles.currentBadge, { backgroundColor: plan.color + "15" }]}>
                  <Text style={[styles.currentText, { color: plan.color }]}>باقتك الحالية</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.faqSection}>
        <Text style={[styles.faqTitle, { color: colors.text }]}>أسئلة شائعة</Text>
        {[
          { q: "هل يمكنني إلغاء الاشتراك؟", a: "نعم، يمكنك إلغاء الاشتراك في أي وقت من إعدادات حسابك" },
          { q: "هل هناك فترة تجريبية؟", a: "نعم، تحصل على 7 أيام مجانية عند الاشتراك الأول" },
          { q: "كيف يعمل الاشتراك العائلي؟", a: "يمكنك إضافة حتى 5 أفراد من عائلتك ومشاركة جميع المميزات" },
        ].map((faq, i) => (
          <View key={i} style={[styles.faqCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <Text style={[styles.faqQ, { color: colors.text }]}>{faq.q}</Text>
            <Text style={[styles.faqA, { color: colors.muted }]}>{faq.a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  heroSection: { alignItems: "center", paddingVertical: 20, gap: 8 },
  heroLogo: { width: 64, height: 64 },
  heroTitle: { fontSize: 28, fontFamily: "Cairo_700Bold" },
  heroSub: { fontSize: 15, fontFamily: "Tajawal_400Regular" },
  plansContainer: { paddingHorizontal: 20, gap: 16 },
  planCard: { borderRadius: 24, padding: 20, overflow: "hidden" },
  popularBadge: { position: "absolute", top: 0, left: 0, right: 0, paddingVertical: 6, alignItems: "center" },
  popularText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  planHeader: { marginTop: 10, gap: 4, alignItems: "flex-end" },
  planName: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  planPriceRow: { flexDirection: "row-reverse", alignItems: "baseline", gap: 4 },
  planPrice: { fontSize: 32, fontFamily: "Tajawal_700Bold" },
  planCurrency: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
  featuresList: { marginTop: 16, gap: 10 },
  featureRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  featureText: { fontSize: 14, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  subscribeBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 16 },
  subscribeBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  currentBadge: { borderRadius: 14, paddingVertical: 10, alignItems: "center", marginTop: 16 },
  currentText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  faqSection: { paddingHorizontal: 20, marginTop: 30, marginBottom: 20 },
  faqTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 14 },
  faqCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10 },
  faqQ: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  faqA: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 6, lineHeight: 22 },
});
