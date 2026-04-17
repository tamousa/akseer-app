import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const C = "#0E7490";

export default function ClinicPreviewPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [saved, setSaved] = useState(false);
  const cardBg = isDark ? "#0D2035" : "#FFFFFF";
  const cardBorder = isDark ? "#1A3A52" : "#BAE6FD";

  const DOCTORS = [
    { nameAr: "د. سارة الدوسري", nameEn: "Dr. Sarah Al-Dossari", specialtyAr: "طب عام", specialtyEn: "General Med", rating: 4.9, fee: 350, available: true, emoji: "👩‍⚕️", sessions: 280 },
    { nameAr: "د. خالد العمري", nameEn: "Dr. Khalid Al-Omari", specialtyAr: "نفسية", specialtyEn: "Psychology", rating: 4.8, fee: 280, available: true, emoji: "👨‍⚕️", sessions: 190 },
    { nameAr: "أخ. ريم الحربي", nameEn: "Nurse Reem Al-Harbi", specialtyAr: "تغذية", specialtyEn: "Nutrition", rating: 4.7, fee: 220, available: false, emoji: "👩‍⚕️", sessions: 145 },
  ];

  const SERVICES = [
    { nameAr: "استشارة طبية عامة", nameEn: "General Medical Consultation", durationAr: "30 دق", durationEn: "30 min", price: 350, homeVisit: false, virtual: true, emoji: "🩺", descAr: "فحص شامل واستشارة طبية عامة مع تقرير مفصل", descEn: "Comprehensive exam and medical consultation with detailed report" },
    { nameAr: "جلسة علاج نفسي", nameEn: "Psychological Therapy Session", durationAr: "60 دق", durationEn: "60 min", price: 280, homeVisit: true, virtual: true, emoji: "🧠", descAr: "علاج سلوكي معرفي مع د. خالد", descEn: "Cognitive behavioral therapy with Dr. Khalid" },
    { nameAr: "تقييم تغذوي", nameEn: "Nutritional Assessment", durationAr: "45 دق", durationEn: "45 min", price: 220, homeVisit: true, virtual: false, emoji: "🥗", descAr: "تحليل عادات الغذاء وخطة صحية مخصصة", descEn: "Analyze dietary habits and personalized health plan" },
  ];

  const OFFERS = [
    { nameAr: "باقة العناية الشاملة", nameEn: "Comprehensive Care Package", badge: "25%", emoji: "🌟", validToAr: "30 أبريل", validToEn: "April 30", code: "CARE25", includesAr: "3 جلسات + تقرير", includesEn: "3 sessions + report" },
    { nameAr: "استشارة + تقييم تغذوي", nameEn: "Consultation + Nutrition Assessment", badge: lang === "ar" ? "جديد" : "New", emoji: "🥗", validToAr: "15 مايو", validToEn: "May 15", code: "NUTRI", includesAr: "جلستان بسعر واحد", includesEn: "2 sessions at one price" },
  ];

  const INSURANCE = [
    { ar: "بوبا", en: "Bupa" }, { ar: "ميدغلف", en: "MedGulf" }, { ar: "التعاونية", en: "Al-Tawuniya" }, { ar: "الأهلي تكافل", en: "Ahli Takaful" },
  ];

  const REVIEWS = [
    { customerAr: "منيرة القحطاني", customerEn: "Munira Al-Qahtani", rating: 5, commentAr: "د. سارة ممتازة، شرحت كل شيء بوضوح والموعد في الوقت المحدد", commentEn: "Dr. Sarah is excellent, explained everything clearly and was on time", timeAr: "اليوم", timeEn: "Today" },
    { customerAr: "فهد الشمري", customerEn: "Fahd Al-Shammari", rating: 4, commentAr: "جلسات د. خالد مفيدة جداً. العيادة نظيفة وهادئة", commentEn: "Dr. Khalid's sessions are very helpful. The clinic is clean and quiet", timeAr: "منذ 3 أيام", timeEn: "3 days ago" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#070F18" : "#F0FDFF" }}>
      <View style={[styles.topBar, { backgroundColor: "#083344", paddingTop: topPadding + 8 }]}>
        <View style={styles.topBarRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.topBarTitle}>{t("معاينة العيادة","Clinic Preview")}</Text>
            <Text style={styles.topBarSub}>{t("هكذا يراها المرضى في تطبيق أكسير","This is how patients see it in the Akseer app")}</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t("معاينة حية","Live Preview")}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={[styles.hero, { backgroundColor: C }]}>
          <View style={styles.heroLogo}><Text style={{ fontSize: 34 }}>🏥</Text></View>
          <Text style={styles.heroName}>{t("عيادة الشفاء المتخصصة","Al-Shifa Specialized Clinic")}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={13} color="#FCD34D" />
            <Text style={styles.ratingVal}>4.9</Text>
            <Text style={styles.ratingCount}>(54 {t("تقييم","reviews")})</Text>
          </View>
          <View style={styles.tagsRow}>
            {[
              { ar: "طب عام", en: "General Med" }, { ar: "نفسية", en: "Psychology" }, { ar: "تغذية", en: "Nutrition" }, { ar: "زيارات منزلية", en: "Home Visits" },
            ].map((tg, i) => (
              <View key={i} style={styles.heroTag}><Text style={styles.heroTagText}>{lang === "ar" ? tg.ar : tg.en}</Text></View>
            ))}
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}><Feather name="clock" size={11} color="#A5D8E6" /><Text style={styles.infoItemText}>08:00 — 20:00</Text></View>
            <View style={styles.infoItem}><Feather name="map-pin" size={11} color="#A5D8E6" /><Text style={styles.infoItemText}>{t("الرياض، النزهة","Riyadh, Al-Nuzha")}</Text></View>
            <View style={styles.infoItem}><Feather name="home" size={11} color="#A5D8E6" /><Text style={styles.infoItemText}>{t("زيارة منزلية","Home Visit")}</Text></View>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={[styles.ctaMain, { backgroundColor: C }]}>
            <Feather name="calendar" size={15} color="#fff" />
            <Text style={styles.ctaMainText}>{t("حجز موعد","Book Appointment")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA", borderColor: C + "40" }]}>
            <Feather name="message-circle" size={16} color={C} />
            <Text style={[styles.ctaSecondaryText, { color: C }]}>{t("دردشة","Chat")}</Text>
          </Pressable>
          <Pressable style={[styles.ctaSecondary, { backgroundColor: saved ? C + "20" : (isDark ? "#0D2035" : "#E0F7FA"), borderColor: saved ? C : C + "40" }]}
            onPress={() => setSaved(!saved)}>
            <Feather name="heart" size={16} color={saved ? C : colors.muted} />
            <Text style={[styles.ctaSecondaryText, { color: saved ? C : colors.muted }]}>{saved ? t("متابَع ✓","Following ✓") : t("متابعة","Follow")}</Text>
          </Pressable>
        </View>

        <View style={[styles.bioCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.bioHeader}>
            <Feather name="info" size={14} color={C} />
            <Text style={[styles.bioTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("عن العيادة","About the Clinic")}</Text>
          </View>
          <Text style={[styles.bioText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>
            {t("عيادة الشفاء المتخصصة تقدم خدمات طبية شاملة في الطب العام، الصحة النفسية، والتغذية العلاجية. نوفر استشارات حضورية ومرئية وزيارات منزلية.", "Al-Shifa Specialist Clinic provides comprehensive medical services in general medicine, mental health, and therapeutic nutrition. We offer in-clinic, virtual and home consultations.")}
          </Text>
          <View style={styles.bioStats}>
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>3</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("أطباء","Doctors")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>+600</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("مريض","Patients")}</Text></View>
            <View style={[styles.bioStatDivider, { backgroundColor: cardBorder }]} />
            <View style={styles.bioStat}><Text style={[styles.bioStatVal, { color: C }]}>5</Text><Text style={[styles.bioStatLabel, { color: colors.muted }]}>{t("سنوات خبرة","yrs exp.")}</Text></View>
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الكادر الطبي","Medical Staff")}</Text>
          <Text style={[styles.secCount, { color: C }]}>{DOCTORS.length} {t("أطباء","doctors")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {DOCTORS.map((d, i) => (
            <View key={i} style={[styles.doctorCard, { backgroundColor: cardBg, borderColor: d.available ? C + "50" : cardBorder }]}>
              <View style={[styles.doctorAvatar, { backgroundColor: C + "20" }]}>
                <Text style={{ fontSize: 30 }}>{d.emoji}</Text>
                <View style={[styles.availDot, { backgroundColor: d.available ? "#059669" : "#6B7280" }]} />
              </View>
              <Text style={[styles.doctorName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? d.nameAr : d.nameEn}</Text>
              <Text style={[styles.doctorSpecialty, { color: C }]}>{lang === "ar" ? d.specialtyAr : d.specialtyEn}</Text>
              <Text style={[styles.doctorRating, { color: "#D97706" }]}>{d.rating} ★</Text>
              <Text style={[styles.doctorSessions, { color: colors.muted }]}>{d.sessions} {t("جلسة","sessions")}</Text>
              <Text style={[styles.doctorFee, { color: isDark ? "#C0DCE8" : "#0A2330" }]}>{d.fee} SAR</Text>
              <View style={[styles.bookBtn, { backgroundColor: d.available ? C : (isDark ? "#1A3A52" : "#E0F7FA") }]}>
                <Text style={[styles.bookBtnText, { color: d.available ? "#fff" : colors.muted }]}>{d.available ? t("احجز","Book") : t("غير متاح","Unavailable")}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.bookingTypesCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.bookingTypesTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("أنواع الحجز المتاحة","Available Booking Types")}</Text>
          <View style={styles.bookingTypesRow}>
            {[
              { icon: "🏥", labelAr: "حضوري", labelEn: "In-Clinic", subAr: "في العيادة", subEn: "At clinic", color: C },
              { icon: "📱", labelAr: "مرئي", labelEn: "Virtual", subAr: "عبر الفيديو", subEn: "Via video", color: "#7C3AED" },
              { icon: "🏠", labelAr: "منزلي", labelEn: "Home Visit", subAr: "في بيتك", subEn: "At home", color: "#059669" },
            ].map((typ, i) => (
              <View key={i} style={[styles.bookingTypeItem, { backgroundColor: typ.color + "15" }]}>
                <Text style={{ fontSize: 22 }}>{typ.icon}</Text>
                <Text style={[styles.bookingTypeLabel, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? typ.labelAr : typ.labelEn}</Text>
                <Text style={[styles.bookingTypeSub, { color: typ.color }]}>{lang === "ar" ? typ.subAr : typ.subEn}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("العروض الحالية","Current Offers")}</Text>
          <Text style={[styles.secCount, { color: "#D97706" }]}>{OFFERS.length} {t("عروض","offers")}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {OFFERS.map((o, i) => (
            <View key={i} style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.offerBadge, { backgroundColor: "#D97706" }]}>
                <Text style={styles.offerBadgeText}>{o.badge}</Text>
              </View>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{o.emoji}</Text>
              <Text style={[styles.offerName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? o.nameAr : o.nameEn}</Text>
              <Text style={[styles.offerIncludes, { color: C }]}>{lang === "ar" ? o.includesAr : o.includesEn}</Text>
              <Text style={[styles.offerValidity, { color: colors.muted }]}>{t("حتى","Until")} {lang === "ar" ? o.validToAr : o.validToEn}</Text>
              <View style={[styles.offerCode, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                <Text style={[styles.offerCodeText, { color: C }]}>#{o.code}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("الخدمات الطبية","Medical Services")}</Text>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
          {SERVICES.map((s, i) => (
            <View key={i} style={[styles.serviceRow, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.serviceLeft}>
                <Text style={[styles.servicePrice, { color: C }]}>{s.price} SAR</Text>
                <Text style={[styles.serviceDur, { color: colors.muted }]}>{lang === "ar" ? s.durationAr : s.durationEn}</Text>
                <View style={styles.serviceIcons}>
                  {s.virtual && <View style={[styles.sIcon, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}><Text style={{ fontSize: 10 }}>📱</Text></View>}
                  {s.homeVisit && <View style={[styles.sIcon, { backgroundColor: isDark ? "#0E2A1A" : "#D1FAE5" }]}><Text style={{ fontSize: 10 }}>🏠</Text></View>}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.serviceName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                <Text style={[styles.serviceDesc, { color: colors.muted }]}>{lang === "ar" ? s.descAr : s.descEn}</Text>
              </View>
              <View style={[styles.serviceEmoji, { backgroundColor: C + "15" }]}>
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.insuranceCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.insuranceTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("شركات التأمين المقبولة","Accepted Insurance Companies")}</Text>
          <View style={styles.insuranceRow}>
            {INSURANCE.map((ins, i) => (
              <View key={i} style={[styles.insuranceBadge, { backgroundColor: isDark ? "#1A3A52" : "#E0F7FA" }]}>
                <Text style={{ fontSize: 14 }}>🛡️</Text>
                <Text style={[styles.insuranceName, { color: C }]}>{lang === "ar" ? ins.ar : ins.en}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.secHeader}>
          <Text style={[styles.secTitle, { color: isDark ? "#fff" : "#0A2330" }]}>{t("التقييمات","Reviews")}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: C + "20" }]}>
            <Feather name="star" size={12} color={C} />
            <Text style={[styles.ratingBadgeText, { color: C }]}>4.9</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
          {REVIEWS.map((r, i) => (
            <View key={i} style={[styles.reviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.reviewTop}>
                <Text style={[styles.reviewTime, { color: colors.muted }]}>{lang === "ar" ? r.timeAr : r.timeEn}</Text>
                <Text style={[styles.reviewName, { color: isDark ? "#fff" : "#0A2330" }]}>{lang === "ar" ? r.customerAr : r.customerEn}</Text>
                <View style={[styles.reviewAvatar, { backgroundColor: C + "20" }]}>
                  <Text style={[styles.reviewAvatarText, { color: C }]}>{(lang === "ar" ? r.customerAr : r.customerEn).charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={12} color={s <= r.rating ? "#FCD34D" : (isDark ? "#1A3A52" : "#E5E7EB")} />)}
              </View>
              <Text style={[styles.reviewComment, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>{lang === "ar" ? r.commentAr : r.commentEn}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.infoBox, { backgroundColor: isDark ? "#0D2035" : "#E0F7FA", borderColor: C + "30" }]}>
          <Feather name="eye" size={14} color={C} />
          <Text style={[styles.infoBoxText, { color: isDark ? "#A5D8E6" : "#0A2330" }]}>
            {t("أي تعديل في الكادر الطبي، الخدمات، أو المواعيد يُحدَّث فوراً للمرضى. التواصل يتم حصرياً عبر الدردشة الداخلية في منصة أكسير.",
               "Any updates to medical staff, services, or schedules are reflected immediately to patients. Communication is exclusively via the Akseer in-app chat.")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingBottom: 14 },
  topBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  topBarTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  topBarSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#A5D8E6", textAlign: "right" },
  liveBadge: { flexDirection: "row-reverse", gap: 4, backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignItems: "center" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#86EFAC" },
  liveText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#fff" },
  hero: { paddingHorizontal: 20, paddingVertical: 24, alignItems: "center" },
  heroLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: "#ffffff20", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroName: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 6 },
  ratingRow: { flexDirection: "row-reverse", gap: 4, alignItems: "center", marginBottom: 10 },
  ratingVal: { fontSize: 14, fontFamily: "Cairo_700Bold", color: "#FCD34D" },
  ratingCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
  tagsRow: { flexDirection: "row-reverse", gap: 6, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" },
  heroTag: { backgroundColor: "#ffffff20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroTagText: { fontSize: 11, fontFamily: "Tajawal_500Medium", color: "#E0F7FA" },
  infoRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  infoItem: { flexDirection: "row-reverse", gap: 4, alignItems: "center" },
  infoItemText: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#A5D8E6" },
  ctaRow: { flexDirection: "row-reverse", gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  ctaMain: { flex: 2, flexDirection: "row-reverse", gap: 6, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ctaMainText: { fontSize: 14, fontFamily: "Tajawal_700Bold", color: "#fff" },
  ctaSecondary: { flex: 1, flexDirection: "row-reverse", gap: 5, paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  ctaSecondaryText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bioCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
  bioHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  bioTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bioText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  bioStats: { flexDirection: "row-reverse", justifyContent: "space-around", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#0E749025" },
  bioStat: { alignItems: "center", gap: 2 },
  bioStatVal: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  bioStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  bioStatDivider: { width: 1 },
  secHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12, marginTop: 4 },
  secTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  secCount: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  hScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 20, flexDirection: "row-reverse" },
  doctorCard: { width: 150, borderRadius: 18, padding: 14, alignItems: "center", gap: 5, borderWidth: 1 },
  doctorAvatar: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  availDot: { position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "#fff" },
  doctorName: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  doctorSpecialty: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  doctorRating: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  doctorSessions: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  doctorFee: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  bookBtn: { width: "100%", paddingVertical: 8, borderRadius: 10, alignItems: "center", marginTop: 4 },
  bookBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bookingTypesCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 12, marginBottom: 20 },
  bookingTypesTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bookingTypesRow: { flexDirection: "row-reverse", gap: 10 },
  bookingTypeItem: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", gap: 4 },
  bookingTypeLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  bookingTypeSub: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  offerCard: { width: 170, borderRadius: 18, padding: 14, borderWidth: 1, gap: 4 },
  offerBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  offerBadgeText: { fontSize: 11, fontFamily: "Cairo_700Bold", color: "#fff" },
  offerName: { fontSize: 13, fontFamily: "Tajawal_700Bold", lineHeight: 18 },
  offerIncludes: { fontSize: 11, fontFamily: "Tajawal_700Bold", marginTop: 2 },
  offerValidity: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  offerCode: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 4 },
  offerCodeText: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  serviceRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  serviceEmoji: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  serviceLeft: { alignItems: "flex-end", gap: 4, minWidth: 70 },
  servicePrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  serviceDur: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  serviceIcons: { flexDirection: "row-reverse", gap: 4 },
  sIcon: { width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  serviceName: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 4 },
  serviceDesc: { fontSize: 11, fontFamily: "Tajawal_400Regular", lineHeight: 16 },
  insuranceCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 12, marginBottom: 20 },
  insuranceTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right" },
  insuranceRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  insuranceBadge: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  insuranceName: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  ratingBadge: { flexDirection: "row-reverse", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  ratingBadgeText: { fontSize: 12, fontFamily: "Cairo_700Bold" },
  reviewCard: { borderRadius: 14, padding: 12, borderWidth: 1, gap: 8 },
  reviewTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  reviewName: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  starsRow: { flexDirection: "row-reverse", gap: 2 },
  reviewComment: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  infoBox: { flexDirection: "row-reverse", gap: 10, margin: 16, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoBoxText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
});
