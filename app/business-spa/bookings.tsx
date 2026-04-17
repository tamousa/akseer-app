import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const STATUS_MAP: Record<string, { ar: string; en: string; color: string; bg: string }> = {
  confirmed: { ar: "مؤكد",             en: "Confirmed",         color: "#059669", bg: "#D1FAE5" },
  waiting:   { ar: "بانتظار الموافقة", en: "Awaiting Approval", color: "#D97706", bg: "#FEF3C7" },
  completed: { ar: "مكتمل",            en: "Completed",         color: "#6366F1", bg: "#EDE9FE" },
  cancelled: { ar: "ملغى",             en: "Cancelled",         color: "#EF4444", bg: "#FEE2E2" },
  rejected:  { ar: "مرفوض",            en: "Rejected",          color: "#9CA3AF", bg: "#F3F4F6" },
};

const INITIAL_BOOKINGS = [
  {
    id: 1,
    nameAr: "لمى الشهري",
    nameEn: "Lama Al-Shahri",
    serviceAr: "مساج استرخاء 60 دقيقة",
    serviceEn: "60min Relaxation Massage",
    time: "09:00",
    dateAr: "اليوم",
    dateEn: "Today",
    staffAr: "رهف",
    staffEn: "Rahaf",
    status: "waiting",
    amount: 280
  },
  {
    id: 2,
    nameAr: "نوف العمري",
    nameEn: "Nouf Al-Omari",
    serviceAr: "باقة سبا كاملة",
    serviceEn: "Full Spa Package",
    time: "10:30",
    dateAr: "اليوم",
    dateEn: "Today",
    staffAr: "دانة",
    staffEn: "Dana",
    status: "waiting",
    amount: 450
  },
  {
    id: 3,
    nameAr: "منى الرشيد",
    nameEn: "Mona Al-Rashid",
    serviceAr: "جاكوزي + سونا",
    serviceEn: "Jacuzzi + Sauna",
    time: "11:00",
    dateAr: "اليوم",
    dateEn: "Today",
    staffAr: "رهف",
    staffEn: "Rahaf",
    status: "confirmed",
    amount: 220
  },
  {
    id: 4,
    nameAr: "هدى الزهراني",
    nameEn: "Huda Al-Zahrani",
    serviceAr: "تدليك شياتسو",
    serviceEn: "Shiatsu Massage",
    time: "13:00",
    dateAr: "اليوم",
    dateEn: "Today",
    staffAr: "دانة",
    staffEn: "Dana",
    status: "confirmed",
    amount: 320
  },
  {
    id: 5,
    nameAr: "سارة السعيد",
    nameEn: "Sara Al-Saeed",
    serviceAr: "مساج استرخاء 90 دقيقة",
    serviceEn: "90min Relaxation Massage",
    time: "10:00",
    dateAr: "غداً",
    dateEn: "Tomorrow",
    staffAr: "رهف",
    staffEn: "Rahaf",
    status: "confirmed",
    amount: 380
  }
];

export default function SpaBookings() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"today" | "tomorrow" | "all">("today");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const TABS = [
    { key: "today" as const,    labelAr: "اليوم", labelEn: "Today" },
    { key: "tomorrow" as const, labelAr: "غداً",  labelEn: "Tomorrow" },
    { key: "all" as const,      labelAr: "الكل",  labelEn: "All" },
  ];

  const shown = tab === "all" ? bookings : bookings.filter((b) => b.dateAr === (tab === "today" ? "اليوم" : "غداً"));
  const pendingCount = bookings.filter((b) => b.status === "waiting").length;

  const handleApprove = (id: number) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "confirmed" } : b));
    Alert.alert("✅ " + t("تم القبول", "Approved"), t("تم تأكيد الحجز بنجاح", "Booking confirmed successfully"));
  };

  const handleReject = (id: number, nameAr: string, nameEn: string) => {
    Alert.alert(
      t("رفض الحجز", "Reject Booking"),
      t("هل تريد رفض هذا الحجز؟", `Reject booking for ${nameEn}?`),
      [
        { text: t("إلغاء", "Cancel"), style: "cancel" },
        { text: t("رفض", "Reject"), style: "destructive",
          onPress: () => setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "rejected" } : b)),
        },
      ]
    );
  };

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[s.pageHeader, { paddingTop: topPadding + 10, backgroundColor: colors.background, borderBottomColor: cardBorder }]}>
        <Pressable style={[s.iconBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => router.back()}>
          <Feather name="chevron-right" size={22} color={colors.text} />
        </Pressable>
        <Text style={[s.pageTitle, { color: colors.text }]}>{t("إدارة الحجوزات", "Booking Management")}</Text>
        <Pressable style={[s.iconBtn, { backgroundColor: C }]}
          onPress={() => Alert.alert(t("حجز جديد", "New Booking"), t("سيتم فتح نموذج الحجز", "Booking form will open"))}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      {pendingCount > 0 && (
        <Pressable style={[s.pendingBanner, { backgroundColor: isDark ? "#3B2200" : "#FEF3C7", borderColor: "#D97706" }]}
          onPress={() => setTab("all")}>
          <Feather name="alert-circle" size={18} color="#D97706" />
          <Text style={[s.pendingText, { color: "#D97706" }]}>
            {t(`${pendingCount} حجوزات بانتظار موافقتك`, `${pendingCount} bookings awaiting your approval`)}
          </Text>
          <Feather name="chevron-left" size={16} color="#D97706" />
        </Pressable>
      )}

      <View style={[s.tabRow, { borderBottomColor: cardBorder, backgroundColor: colors.background }]}>
        {TABS.map((tb) => (
          <Pressable key={tb.key}
            style={[s.tab, tab === tb.key && { borderBottomColor: C, borderBottomWidth: 2 }]}
            onPress={() => setTab(tb.key)}>
            <Text style={[s.tabText, { color: tab === tb.key ? C : colors.muted }]}>{lang === "ar" ? tb.labelAr : tb.labelEn}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}>
        {shown.map((b) => {
          const st = STATUS_MAP[b.status] || STATUS_MAP.waiting;
          const isWaiting = b.status === "waiting";
          return (
            <View key={b.id} style={[s.card, { backgroundColor: cardBg, borderColor: isWaiting ? "#D97706" : cardBorder, borderWidth: isWaiting ? 1.5 : 1, marginBottom: 12 }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.name, { color: colors.text }]}>{lang === "ar" ? b.nameAr : b.nameEn}</Text>
                  <Text style={[s.service, { color: colors.muted }]}>{lang === "ar" ? b.serviceAr : b.serviceEn}</Text>
                  <Text style={[s.time, { color: C, marginTop: 4 }]}>{b.time} — {lang === "ar" ? b.dateAr : b.dateEn}</Text>
                  <Text style={[s.service, { color: colors.muted, marginTop: 2 }]}>{lang === "ar" ? b.staffAr : b.staffEn}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[s.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                  </View>
                  <Text style={[s.amount, { color: C }]}>{b.amount} SAR</Text>
                </View>
              </View>
              {isWaiting && (
                <View style={[s.actionRow, { borderTopColor: "#D97706" + "40" }]}>
                  <Pressable style={[s.rejectBtn, { borderColor: "#DC2626" }]}
                    onPress={() => handleReject(b.id, b.nameAr, b.nameEn)}>
                    <Feather name="x" size={16} color="#DC2626" />
                    <Text style={[s.actionText, { color: "#DC2626" }]}>{t("رفض", "Reject")}</Text>
                  </Pressable>
                  <Pressable style={[s.approveBtn, { backgroundColor: "#059669" }]}
                    onPress={() => handleApprove(b.id)}>
                    <Feather name="check" size={16} color="#fff" />
                    <Text style={[s.actionText, { color: "#fff" }]}>{t("قبول الحجز", "Accept")}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
        {shown.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 60, gap: 12 }}>
            <Feather name="calendar" size={48} color={colors.muted} />
            <Text style={{ fontSize: 14, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("لا توجد حجوزات", "No bookings found")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  pendingBanner: { flexDirection: "row-reverse", alignItems: "center", marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 14, padding: 12, borderWidth: 1.5, gap: 10 },
  pendingText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tabRow: { flexDirection: "row-reverse", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  card: { borderRadius: 16, padding: 14 },
  name: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  service: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  time: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  amount: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  actionRow: { flexDirection: "row-reverse", gap: 10, borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  approveBtn: { flex: 2, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  rejectBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  actionText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
