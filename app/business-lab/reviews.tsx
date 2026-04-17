import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const C = "#0369A1";

const REVIEWS = [
  { id: 1, name: "أحمد الغامدي", rating: 5, textAr: "مختبر ممتاز، سرعة في الاستقبال والنتائج وصلت بسرعة للتطبيق.", textEn: "Excellent lab, fast reception and results arrived quickly in the app.", date: "اليوم", dateEn: "Today", typeAr: "حضوري", typeEn: "In-person", replied: false },
  { id: 2, name: "منيرة القحطاني", rating: 4, textAr: "باقة الفحص الشامل ممتازة والنتائج وصلت في نفس اليوم، بس وقت الانتظار كان طويل شوية.", textEn: "The full checkup package is excellent and results came the same day, but waiting time was a bit long.", date: "أمس", dateEn: "Yesterday", typeAr: "حضوري", typeEn: "In-person", replied: true, replyAr: "شكراً لك، نعمل على تحسين أوقات الانتظار!", replyEn: "Thank you, we are working on improving waiting times!" },
  { id: 3, name: "فاطمة العتيبي", rating: 5, textAr: "الخدمة المنزلية رائعة! الفني محترف وجاء في الوقت المحدد تماماً.", textEn: "Home service is wonderful! The technician was professional and came exactly on time.", date: "منذ 3 أيام", dateEn: "3 days ago", typeAr: "منزلي", typeEn: "Home", replied: false },
];

const QUESTIONS = [
  { id: 1, name: "محمد السالم", questionAr: "هل تحليل السكر التراكمي يحتاج صيام؟", questionEn: "Does the HbA1c test require fasting?", date: "اليوم", dateEn: "Today", answered: false },
  { id: 2, name: "نورة الشمري", questionAr: "كم يستغرق تحليل هرمونات الغدة الدرقية؟", questionEn: "How long does the thyroid hormones test take?", date: "أمس", dateEn: "Yesterday", answered: true, answerAr: "النتيجة تكون جاهزة خلال 24 ساعة عادةً.", answerEn: "Results are usually ready within 24 hours." },
];

export default function LabReviews() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3352" : "#BAD4E8";
  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#060E1A" : "#F0F7FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A1F35"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A1F35" }]}>{t("التقييمات والأسئلة","Reviews & Questions")}</Text>
      </View>

      <View style={[styles.ratingHero, { backgroundColor: C }]}>
        <View style={styles.ratingRight}>
          <Text style={styles.ratingNum}>{avgRating}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Feather key={s} name="star" size={14} color={s <= Math.round(parseFloat(avgRating)) ? "#FCD34D" : "#ffffff40"} />
            ))}
          </View>
          <Text style={styles.ratingCount}>{REVIEWS.length} {t("تقييم","reviews")}</Text>
        </View>
        <View style={styles.ratingBars}>
          {[5, 4, 3].map((star) => {
            const count = REVIEWS.filter((r) => r.rating === star).length;
            const pct = Math.round((count / REVIEWS.length) * 100);
            return (
              <View key={star} style={styles.ratingBarRow}>
                <Text style={styles.ratingBarNum}>{star}★</Text>
                <View style={styles.ratingBarBg}><View style={[styles.ratingBarFill, { width: `${pct}%` as any }]} /></View>
                <Text style={styles.ratingBarCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#0D2035" : "#DBEAFE" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "reviews" && { backgroundColor: C }]} onPress={() => setActiveTab("reviews")}>
          <Text style={[styles.tabText, { color: activeTab === "reviews" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("تقييمات","Reviews")}</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "questions" && { backgroundColor: C }]} onPress={() => setActiveTab("questions")}>
          <Text style={[styles.tabText, { color: activeTab === "questions" ? "#fff" : isDark ? "#6B9EBD" : C }]}>{t("أسئلة","Questions")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "reviews" && REVIEWS.map((review) => (
          <View key={review.id} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewTop}>
              <View style={styles.reviewMeta}>
                <Text style={[styles.reviewDate, { color: colors.muted }]}>{lang === "ar" ? review.date : review.dateEn}  ·  {lang === "ar" ? review.typeAr : review.typeEn}</Text>
                <Text style={[styles.reviewName, { color: isDark ? "#fff" : "#0A1F35" }]}>{review.name}</Text>
              </View>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((s) => <Feather key={s} name="star" size={12} color={s <= review.rating ? "#FCD34D" : (isDark ? "#1A3352" : "#E5E7EB")} />)}
              </View>
            </View>
            <Text style={[styles.reviewText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? review.textAr : review.textEn}</Text>
            {review.replied && (
              <View style={[styles.replyBox, { backgroundColor: isDark ? "#1A3352" : "#EFF6FF" }]}>
                <Feather name="corner-down-left" size={12} color={C} />
                <Text style={[styles.replyText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? review.replyAr : review.replyEn}</Text>
              </View>
            )}
            {!review.replied && (
              <Pressable style={[styles.replyBtn, { borderColor: C, backgroundColor: isDark ? "#0D2035" : "#EFF6FF" }]}
                onPress={() => Alert.alert(t("الرد على التقييم","Reply to Review"), t("سيتم فتح نافذة كتابة الرد","A reply window will open"))}>
                <Feather name="message-square" size={13} color={C} />
                <Text style={[styles.replyBtnText, { color: C }]}>{t("الرد على التقييم","Reply to Review")}</Text>
              </Pressable>
            )}
          </View>
        ))}

        {activeTab === "questions" && QUESTIONS.map((q) => (
          <View key={q.id} style={[styles.questionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.questionTop}>
              <Text style={[styles.questionDate, { color: colors.muted }]}>{lang === "ar" ? q.date : q.dateEn}</Text>
              <Text style={[styles.questionName, { color: isDark ? "#fff" : "#0A1F35" }]}>{q.name}</Text>
            </View>
            <View style={[styles.questionBox, { backgroundColor: isDark ? "#1A3352" : "#F0F9FF" }]}>
              <Feather name="help-circle" size={14} color={C} />
              <Text style={[styles.questionText, { color: isDark ? "#A5C8E0" : "#0A1F35" }]}>{lang === "ar" ? q.questionAr : q.questionEn}</Text>
            </View>
            {q.answered && (
              <View style={[styles.answerBox, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}>
                <Feather name="check-circle" size={14} color="#059669" />
                <Text style={[styles.answerText, { color: isDark ? "#A5C8E0" : "#065F46" }]}>{lang === "ar" ? q.answerAr : q.answerEn}</Text>
              </View>
            )}
            {!q.answered && (
              <Pressable style={[styles.replyBtn, { borderColor: "#059669", backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}
                onPress={() => Alert.alert(t("الإجابة على السؤال","Answer Question"), lang === "ar" ? q.questionAr : q.questionEn)}>
                <Feather name="edit-2" size={13} color="#059669" />
                <Text style={[styles.replyBtnText, { color: "#059669" }]}>{t("الإجابة على السؤال","Answer Question")}</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  ratingHero: { marginHorizontal: 16, borderRadius: 20, padding: 18, flexDirection: "row-reverse", gap: 20, alignItems: "center", marginBottom: 14 },
  ratingRight: { alignItems: "center", gap: 4 },
  ratingNum: { fontSize: 40, fontFamily: "Cairo_700Bold", color: "#fff" },
  starsRow: { flexDirection: "row-reverse", gap: 2 },
  ratingCount: { fontSize: 11, color: "#BAD4E8", fontFamily: "Tajawal_400Regular" },
  ratingBars: { flex: 1, gap: 6 },
  ratingBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  ratingBarNum: { fontSize: 11, color: "#fff", fontFamily: "Cairo_700Bold", width: 24 },
  ratingBarBg: { flex: 1, height: 6, backgroundColor: "#ffffff30", borderRadius: 3, overflow: "hidden" },
  ratingBarFill: { height: 6, backgroundColor: "#FCD34D", borderRadius: 3 },
  ratingBarCount: { fontSize: 11, color: "#BAD4E8", fontFamily: "Tajawal_400Regular", width: 16 },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  reviewTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  reviewName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  reviewDate: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewMeta: { gap: 2 },
  reviewStars: { flexDirection: "row-reverse", gap: 2 },
  reviewText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
  replyBox: { flexDirection: "row-reverse", gap: 8, padding: 10, borderRadius: 10, alignItems: "flex-start" },
  replyText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18, textAlign: "right" },
  replyBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 10, borderWidth: 1 },
  replyBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  questionCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  questionTop: { flexDirection: "row-reverse", justifyContent: "space-between" },
  questionName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  questionDate: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  questionBox: { flexDirection: "row-reverse", gap: 8, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  questionText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_500Medium", lineHeight: 20, textAlign: "right" },
  answerBox: { flexDirection: "row-reverse", gap: 8, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  answerText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18, textAlign: "right" },
});
