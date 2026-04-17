import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ReviewsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { t } = useLanguage();

  const REVIEWS = [
    { id: 1, customer: "أحمد الغامدي",   rating: 5, product: t("فيتامين C 1000mg","Vitamin C 1000mg"),    comment: t("منتج ممتاز، لاحظت فرقاً واضحاً في المناعة خلال أسبوعين. التوصيل كان سريعاً والتغليف محكم.",                          "Excellent product! I noticed a clear difference in immunity in just two weeks. Fast delivery and secure packaging."), time: t("منذ يومين","2 days ago"),  replied: false                                                                                   },
    { id: 2, customer: "سارة المطيري",   rating: 4, product: t("جلسة مساج ظهر","Back Massage Session"),   comment: t("تجربة رائعة! المعالج محترف جداً، كنت أتمنى أن تكون الجلسة أطول قليلاً.",                                           "Amazing experience! The therapist is very professional. I wished the session was a bit longer."),                   time: t("منذ 3 أيام","3 days ago"), replied: true, reply: t("شكراً جزيلاً سارة! نقدم الآن باقة الجلسة الموسعة 90 دقيقة 😊","Thank you Sara! We now offer an extended 90-min session package 😊") },
    { id: 3, customer: "منيرة القحطاني", rating: 3, product: t("كريم ترطيب اليد","Hand Moisturizer Cream"),comment: t("المنتج جيد لكن وصل بتأخير بسيط عن الموعد المحدد.",                                                                 "Product is good but arrived slightly late."),                                                                       time: t("منذ أسبوع","1 week ago"),  replied: false                                                                                   },
  ];

  const QUESTIONS = [
    { id: 1, customer: "نورة السلمي",   question: t("هل يمكن استخدام زيت الأرجان للأطفال؟","Can argan oil be used for children?"),                                                    time: t("منذ 5 ساعات","5 hrs ago"), answered: false },
    { id: 2, customer: "فاطمة العتيبي", question: t("ما هو الفرق بين باقة التجميل الأساسية والمتقدمة؟","What's the difference between the basic and advanced beauty packages?"),       time: t("أمس","Yesterday"),          answered: true, answer: t("الباقة الأساسية تشمل 3 خدمات، بينما المتقدمة تشمل 6 خدمات مع جلسة بخار مجانية.","Basic includes 3 services; Advanced includes 6 services with a free steam session.") },
  ];

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";
  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("الأسئلة والتقييمات","Questions & Reviews")}</Text>
      </View>

      <View style={[styles.ratingCard, { backgroundColor: "#6D28D9" }]}>
        <View style={styles.ratingRow}>
          <View style={styles.ratingStars}>
            {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={14} color={s <= Math.round(parseFloat(avgRating)) ? "#FCD34D" : "#ffffff40"} />)}
          </View>
          <Text style={styles.ratingBig}>{avgRating}</Text>
        </View>
        <Text style={styles.ratingCount}>{REVIEWS.length} {t("تقييم","reviews")}  ·  {REVIEWS.filter((r) => !r.replied).length} {t("بانتظار الرد","awaiting reply")}</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "questions" && { backgroundColor: "#7C3AED" }]} onPress={() => setActiveTab("questions")}>
          <Text style={[styles.tabText, { color: activeTab === "questions" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>
            {t("الأسئلة","Questions")} ({QUESTIONS.length})
          </Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "reviews" && { backgroundColor: "#7C3AED" }]} onPress={() => setActiveTab("reviews")}>
          <Text style={[styles.tabText, { color: activeTab === "reviews" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>
            {t("التقييمات","Reviews")} ({REVIEWS.length})
          </Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "reviews" && REVIEWS.map((r) => (
          <View key={r.id} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.reviewTime, { color: colors.muted }]}>{r.time}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reviewCustomer, { color: colors.text }]}>{r.customer}</Text>
                <Text style={[styles.reviewProduct, { color: colors.muted }]}>{r.product}</Text>
              </View>
              <View style={[styles.reviewAvatar, { backgroundColor: "#7C3AED20" }]}>
                <Text style={[styles.reviewAvatarText, { color: "#7C3AED" }]}>{r.customer.charAt(0)}</Text>
              </View>
            </View>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={13} color={s <= r.rating ? "#FCD34D" : isDark ? "#333" : "#E5E7EB"} />)}
            </View>
            <Text style={[styles.reviewComment, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{r.comment}</Text>

            {"reply" in r && r.replied && r.reply && (
              <View style={[styles.replyBox, { backgroundColor: isDark ? "#2A1F45" : "#F5F0FF" }]}>
                <Feather name="corner-down-right" size={12} color="#7C3AED" />
                <Text style={[styles.replyText, { color: isDark ? "#C4B5FD" : "#5B21B6" }]}>{r.reply}</Text>
              </View>
            )}

            {!r.replied && (
              replyingTo === r.id ? (
                <View style={styles.replyInput}>
                  <TextInput
                    placeholder={t("اكتب ردك هنا...","Write your reply here...")}
                    placeholderTextColor={colors.muted}
                    value={replyText} onChangeText={setReplyText} multiline
                    style={[styles.replyTextInput, { color: colors.text, backgroundColor: isDark ? "#2A1F45" : "#F5F0FF", borderColor: "#7C3AED40" }]}
                    textAlign="right"
                  />
                  <View style={styles.replyActions}>
                    <Pressable onPress={() => setReplyingTo(null)} style={[styles.replyBtn, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
                      <Text style={[styles.replyBtnText, { color: colors.muted }]}>{t("إلغاء","Cancel")}</Text>
                    </Pressable>
                    <Pressable onPress={() => { Alert.alert(t("تم الإرسال","Sent"), t("تم إرسال ردك بنجاح","Your reply was sent successfully")); setReplyingTo(null); setReplyText(""); }}
                      style={[styles.replyBtn, { backgroundColor: "#7C3AED" }]}>
                      <Text style={[styles.replyBtnText, { color: "#fff" }]}>{t("إرسال الرد","Send Reply")}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={[styles.replyTrigger, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]} onPress={() => setReplyingTo(r.id)}>
                  <Feather name="message-circle" size={14} color="#7C3AED" />
                  <Text style={[styles.replyTriggerText, { color: "#7C3AED" }]}>{t("رد على التقييم","Reply to Review")}</Text>
                </Pressable>
              )
            )}
          </View>
        ))}

        {activeTab === "questions" && QUESTIONS.map((q) => (
          <View key={q.id} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.reviewTime, { color: colors.muted }]}>{q.time}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reviewCustomer, { color: colors.text }]}>{q.customer}</Text>
              </View>
              <View style={[styles.reviewAvatar, { backgroundColor: "#7C3AED20" }]}>
                <Text style={[styles.reviewAvatarText, { color: "#7C3AED" }]}>{q.customer.charAt(0)}</Text>
              </View>
            </View>
            <Text style={[styles.questionText, { color: colors.text }]}>{q.question}</Text>

            {"answer" in q && q.answered && q.answer && (
              <View style={[styles.replyBox, { backgroundColor: isDark ? "#2A1F45" : "#F5F0FF" }]}>
                <Feather name="corner-down-right" size={12} color="#7C3AED" />
                <Text style={[styles.replyText, { color: isDark ? "#C4B5FD" : "#5B21B6" }]}>{q.answer}</Text>
              </View>
            )}

            {!q.answered && (
              <Pressable style={[styles.replyTrigger, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
                onPress={() => Alert.alert(t("الإجابة على السؤال","Answer Question"), q.question)}>
                <Feather name="message-circle" size={14} color="#7C3AED" />
                <Text style={[styles.replyTriggerText, { color: "#7C3AED" }]}>{t("إجابة السؤال","Answer Question")}</Text>
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
  ratingCard: { marginHorizontal: 16, borderRadius: 18, padding: 18, marginBottom: 14 },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 6 },
  ratingBig: { fontSize: 36, fontFamily: "Cairo_700Bold", color: "#fff" },
  ratingStars: { flexDirection: "row-reverse", gap: 4 },
  ratingCount: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#C4B5FD" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  reviewTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  reviewCustomer: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  reviewProduct: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  starsRow: { flexDirection: "row-reverse", gap: 2 },
  reviewComment: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20 },
  questionText: { fontSize: 14, fontFamily: "Tajawal_500Medium", lineHeight: 22 },
  replyBox: { flexDirection: "row-reverse", gap: 8, padding: 10, borderRadius: 12, alignItems: "flex-start" },
  replyText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  replyTrigger: { flexDirection: "row-reverse", gap: 8, alignItems: "center", alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  replyTriggerText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  replyInput: { gap: 10 },
  replyTextInput: { borderRadius: 12, padding: 12, minHeight: 80, fontSize: 13, fontFamily: "Tajawal_400Regular", borderWidth: 1, textAlignVertical: "top" },
  replyActions: { flexDirection: "row-reverse", gap: 10 },
  replyBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  replyBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
