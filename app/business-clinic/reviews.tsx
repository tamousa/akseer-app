import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function ClinicReviews() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const REVIEWS = [
    { id: 1, patientAr: "أحمد الغامدي", patientEn: "Ahmed Al-Ghamdi", doctor: "د. سارة / Dr. Sarah", rating: 5, commentAr: "طبيبة رائعة وودودة جداً، شرحت لي كل شيء بشكل مفهوم.", commentEn: "Wonderful and very friendly doctor, explained everything clearly.", timeAr: "منذ يومين", timeEn: "2 days ago", replied: false },
    { id: 2, patientAr: "منيرة القحطاني", patientEn: "Munira Al-Qahtani", doctor: "د. خالد / Dr. Khalid", rating: 5, commentAr: "الجلسات النفسية غيّرت حياتي، شكراً جزيلاً للدكتور.", commentEn: "The therapy sessions changed my life, thank you so much!", timeAr: "منذ أسبوع", timeEn: "1 week ago", replied: true, replyAr: "شكراً! نسعد بمتابعتك دائماً 💚", replyEn: "Thank you! We're always happy to follow up with you 💚" },
    { id: 3, patientAr: "خالد الشمري", patientEn: "Khalid Al-Shammari", doctor: "د. سارة / Dr. Sarah", rating: 3, commentAr: "الخدمة جيدة لكن كان في انتظار طويل قبل الموعد.", commentEn: "Service is good but there was a long wait before the appointment.", timeAr: "منذ أسبوعين", timeEn: "2 weeks ago", replied: false },
  ];

  const QUESTIONS = [
    { id: 1, patientAr: "نورة السلمي", patientEn: "Noura Al-Salmi", questionAr: "هل يمكن إجراء الاستشارة بالفيديو مع الدكتورة سارة؟", questionEn: "Can I do a video consultation with Dr. Sarah?", timeAr: "منذ 3 ساعات", timeEn: "3 hours ago", answered: false },
    { id: 2, patientAr: "فاطمة العتيبي", patientEn: "Fatima Al-Otaibi", questionAr: "ما هي مستندات التأمين المطلوبة للكشف؟", questionEn: "What insurance documents are required for the checkup?", timeAr: "أمس", timeEn: "Yesterday", answered: true, answerAr: "نقبل بطاقة التأمين الأصلية مع الهوية الوطنية.", answerEn: "We accept the original insurance card with national ID." },
  ];

  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";
  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#0A2330"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("التقييمات والأسئلة","Reviews & Questions")}</Text>
      </View>

      <View style={[styles.ratingCard, { backgroundColor: C }]}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingBig}>{avgRating}</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={14} color={s <= Math.round(parseFloat(avgRating)) ? "#FCD34D" : "#ffffff30"} />)}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ratingTitle}>{t("تقييم العيادة","Clinic Rating")}</Text>
          <Text style={styles.ratingCount}>{REVIEWS.length} {t("تقييم مريض","patient reviews")}</Text>
          <Text style={styles.ratingPending}>{REVIEWS.filter((r) => !r.replied).length} {t("بانتظار الرد","awaiting reply")}</Text>
        </View>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA" }]}>
        <Pressable style={[styles.tabBtn, activeTab === "questions" && { backgroundColor: C }]} onPress={() => setActiveTab("questions")}>
          <Text style={[styles.tabText, { color: activeTab === "questions" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("الأسئلة","Questions")} ({QUESTIONS.length})</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, activeTab === "reviews" && { backgroundColor: C }]} onPress={() => setActiveTab("reviews")}>
          <Text style={[styles.tabText, { color: activeTab === "reviews" ? "#fff" : isDark ? "#6BAABD" : C }]}>{t("التقييمات","Reviews")} ({REVIEWS.length})</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {activeTab === "reviews" && REVIEWS.map((r) => (
          <View key={r.id} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.reviewTime, { color: colors.muted }]}>{lang === "ar" ? r.timeAr : r.timeEn}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reviewPatient, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? r.patientAr : r.patientEn}</Text>
                <Text style={[styles.reviewDoctor, { color: colors.muted }]}>{r.doctor}</Text>
              </View>
              <View style={[styles.avatar, { backgroundColor: C + "20" }]}>
                <Text style={[styles.avatarText, { color: C }]}>{(lang === "ar" ? r.patientAr : r.patientEn).charAt(0)}</Text>
              </View>
            </View>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={13} color={s <= r.rating ? "#FCD34D" : (isDark ? "#1A3A52" : "#E5E7EB")} />)}
            </View>
            <Text style={[styles.commentText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? r.commentAr : r.commentEn}</Text>
            {r.replied && r.replyAr && (
              <View style={[styles.replyBox, { backgroundColor: isDark ? "#0D3245" : "#E0F7FA", borderColor: C + "30" }]}>
                <Text style={[styles.replyLabel, { color: C }]}>💬 {t("رد العيادة","Clinic Reply")}</Text>
                <Text style={[styles.replyText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? r.replyAr : r.replyEn}</Text>
              </View>
            )}
            {!r.replied && (
              replyingTo === r.id ? (
                <View style={{ gap: 8 }}>
                  <View style={[styles.replyInput, { borderColor: C, backgroundColor: isDark ? "#0B1E2E" : "#F0FDFF" }]}>
                    <TextInput style={[styles.replyInputText, { color: colors.text }]}
                      placeholder={t("اكتب ردك هنا...","Write your reply here...")}
                      placeholderTextColor={colors.muted} value={replyText} onChangeText={setReplyText} textAlign="right" multiline />
                  </View>
                  <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                    <Pressable style={[styles.sendBtn, { backgroundColor: C }]}
                      onPress={() => { Alert.alert(t("تم الإرسال","Sent"), t("تم إرسال ردك على التقييم","Your reply has been sent")); setReplyingTo(null); setReplyText(""); }}>
                      <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 13 }}>{t("إرسال","Send")}</Text>
                    </Pressable>
                    <Pressable style={[styles.cancelBtn, { borderColor: cardBorder }]} onPress={() => { setReplyingTo(null); setReplyText(""); }}>
                      <Text style={{ color: colors.muted, fontFamily: "Tajawal_700Bold", fontSize: 13 }}>{t("إلغاء","Cancel")}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={[styles.replyBtn, { borderColor: C + "40", backgroundColor: C + "10" }]}
                  onPress={() => setReplyingTo(r.id)}>
                  <Feather name="message-square" size={13} color={C} />
                  <Text style={[styles.replyBtnText, { color: C }]}>{t("رد على هذا التقييم","Reply to this review")}</Text>
                </Pressable>
              )
            )}
          </View>
        ))}

        {activeTab === "questions" && QUESTIONS.map((q) => (
          <View key={q.id} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.reviewTime, { color: colors.muted }]}>{lang === "ar" ? q.timeAr : q.timeEn}</Text>
              <Text style={[styles.reviewPatient, { color: isDark ? "#fff" : "#0A2330", flex: 1 }]}>{lang === "ar" ? q.patientAr : q.patientEn}</Text>
              <View style={[{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }, { backgroundColor: q.answered ? "#D1FAE5" : "#FEF3C7" }]}>
                <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: q.answered ? "#059669" : "#D97706" }}>
                  {q.answered ? t("مجاب","Answered") : t("بانتظار الرد","Pending")}
                </Text>
              </View>
            </View>
            <Text style={[styles.commentText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? q.questionAr : q.questionEn}</Text>
            {q.answered && q.answerAr && (
              <View style={[styles.replyBox, { backgroundColor: isDark ? "#0D3245" : "#E0F7FA", borderColor: C + "30" }]}>
                <Text style={[styles.replyLabel, { color: C }]}>💬 {t("رد العيادة","Clinic Reply")}</Text>
                <Text style={[styles.replyText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? q.answerAr : q.answerEn}</Text>
              </View>
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
  ratingCard: { marginHorizontal: 16, borderRadius: 18, padding: 18, flexDirection: "row-reverse", gap: 16, alignItems: "center", marginBottom: 16 },
  ratingLeft: { alignItems: "center", gap: 6 },
  ratingBig: { fontSize: 38, fontFamily: "Cairo_700Bold", color: "#fff" },
  starsRow: { flexDirection: "row-reverse", gap: 3 },
  ratingTitle: { fontSize: 14, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  ratingCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6", textAlign: "right", marginTop: 4 },
  ratingPending: { fontSize: 11, fontFamily: "Tajawal_700Bold", color: "#FCD34D", textAlign: "right", marginTop: 4 },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  reviewTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  reviewPatient: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewDoctor: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  commentText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
  replyBox: { borderRadius: 12, padding: 12, borderWidth: 1, gap: 6 },
  replyLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  replyText: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18, textAlign: "right" },
  replyBtn: { flexDirection: "row-reverse", gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  replyBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  replyInput: { borderRadius: 12, borderWidth: 1.5, padding: 12, minHeight: 70 },
  replyInputText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  sendBtn: { flex: 2, paddingVertical: 11, borderRadius: 12, alignItems: "center" },
  cancelBtn: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center", borderWidth: 1 },
});
