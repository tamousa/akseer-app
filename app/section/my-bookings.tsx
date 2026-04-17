import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  I18nManager,
  Linking,
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

const BOOKINGS = [
  {
    id: "1", status: "upcoming",
    providerAr: "مركز لمسة للتجميل", providerEn: "Lamsa Beauty Center",
    serviceAr: "عناية بالبشرة + ماسك كولاجين", serviceEn: "Skin Care + Collagen Mask",
    date: "2026-04-02", time: "10:30",
    mode: "store", total: 480, color: "#EC4899", emoji: "💆‍♀️",
    addressAr: "حي العليا، الرياض", addressEn: "Al-Olaya District, Riyadh",
  },
  {
    id: "2", status: "upcoming",
    providerAr: "أ. نورة الجمال", providerEn: "Ms. Noura Beauty",
    serviceAr: "تصفيف شعر + سشوار", serviceEn: "Hair Styling + Blowout",
    date: "2026-04-05", time: "03:00",
    mode: "home", total: 250, color: "#A86DBF", emoji: "💇‍♀️",
    addressAr: "حي النرجس، الرياض", addressEn: "Al-Narjis District, Riyadh",
  },
  {
    id: "3", status: "completed",
    providerAr: "سبا رويال للعناية", providerEn: "Royal Spa & Care",
    serviceAr: "مساج كامل + ساونا", serviceEn: "Full Body Massage + Sauna",
    date: "2026-03-20", time: "05:00",
    mode: "store", total: 580, color: "#14B8A6", emoji: "🧖‍♀️",
    addressAr: "حي الروضة، الرياض", addressEn: "Al-Rawdha District, Riyadh",
  },
  {
    id: "4", status: "cancelled",
    providerAr: "أ. سارة الجمالية", providerEn: "Ms. Sara Beauty",
    serviceAr: "جلسة توجيه جمالي", serviceEn: "Beauty Consultation Session",
    date: "2026-03-15", time: "11:00",
    mode: "remote", total: 180, color: "#F59E0B", emoji: "✨",
    addressAr: null, addressEn: null,
  },
];

export default function MyBookingsScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;

  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const filtered = BOOKINGS.filter(b => activeFilter === "all" || b.status === activeFilter);

  const STATUS_MAP = {
    upcoming:  { labelAr: "قادم",   labelEn: "Upcoming",   color: "#3B82F6", bg: "#3B82F615" },
    completed: { labelAr: "مكتمل",  labelEn: "Completed",  color: "#22C55E", bg: "#22C55E15" },
    cancelled: { labelAr: "ملغي",   labelEn: "Cancelled",  color: "#EF4444", bg: "#EF444415" },
  };

  const MODE_MAP = {
    store:  { labelAr: "بالمحل",  labelEn: "In-Store",  emoji: "🏠" },
    home:   { labelAr: "بالمنزل", labelEn: "At Home",   emoji: "🏡" },
    remote: { labelAr: "عن بعد",  labelEn: "Remote",    emoji: "📱" },
  };

  const FILTERS = [
    { key: "all" as const, labelAr: "الكل", labelEn: "All", count: BOOKINGS.length },
    { key: "upcoming" as const, labelAr: "قادمة", labelEn: "Upcoming", count: BOOKINGS.filter(b => b.status === "upcoming").length },
    { key: "completed" as const, labelAr: "مكتملة", labelEn: "Completed", count: BOOKINGS.filter(b => b.status === "completed").length },
    { key: "cancelled" as const, labelAr: "ملغاة", labelEn: "Cancelled", count: BOOKINGS.filter(b => b.status === "cancelled").length },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("حجوزاتي 📅", "My Bookings 📅")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.statsRow, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            style={[styles.filterTab, activeFilter === f.key && { borderBottomColor: "#EC4899" }]}
          >
            <Text style={[styles.filterTabCount, { color: activeFilter === f.key ? "#EC4899" : colors.text }]}>{f.count}</Text>
            <Text style={[styles.filterTabLabel, { color: activeFilter === f.key ? "#EC4899" : colors.muted }]}>{lang === "ar" ? f.labelAr : f.labelEn}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: isWeb ? 34 : insets.bottom + 30, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>📭</Text>
            <Text style={[styles.emptyTxt, { color: colors.muted }]}>{t("لا توجد حجوزات", "No bookings found")}</Text>
          </View>
        )}

        {filtered.map((booking) => {
          const statusInfo = STATUS_MAP[booking.status as keyof typeof STATUS_MAP];
          const modeInfo = MODE_MAP[booking.mode as keyof typeof MODE_MAP];
          const address = lang === "ar" ? booking.addressAr : booking.addressEn;
          return (
            <View key={booking.id} style={[styles.bookingCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border, borderRightWidth: 4, borderRightColor: booking.color }]}>
              <View style={styles.cardTop}>
                <View style={[styles.providerIcon, { backgroundColor: booking.color + "18" }]}>
                  <Text style={{ fontSize: 26 }}>{booking.emoji}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.providerName, { color: colors.text }]}>{lang === "ar" ? booking.providerAr : booking.providerEn}</Text>
                  <Text style={[styles.serviceName, { color: colors.muted }]}>{lang === "ar" ? booking.serviceAr : booking.serviceEn}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                  <Text style={[styles.statusTxt, { color: statusInfo.color }]}>{lang === "ar" ? statusInfo.labelAr : statusInfo.labelEn}</Text>
                </View>
              </View>

              <View style={[styles.detailsBox, { backgroundColor: isDark ? colors.surface : "#FAFAFA", borderColor: colors.border }]}>
                <View style={styles.detailRow}>
                  <Feather name="calendar" size={13} color={colors.muted} />
                  <Text style={[styles.detailTxt, { color: colors.text }]}>{booking.date} — {booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={{ fontSize: 13 }}>{modeInfo.emoji}</Text>
                  <Text style={[styles.detailTxt, { color: colors.text }]}>{lang === "ar" ? modeInfo.labelAr : modeInfo.labelEn}</Text>
                  {address && (
                    <Text style={[styles.detailSub, { color: colors.muted }]}>• {address}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Feather name="credit-card" size={13} color={colors.muted} />
                  <Text style={[styles.detailTxt, { color: booking.color, fontFamily: "Cairo_700Bold" }]}>{booking.total} {t("ر.س", "SAR")}</Text>
                </View>
              </View>

              {booking.status === "upcoming" && (
                <View style={styles.actionRow}>
                  {booking.mode === "home" && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]} onPress={() => Linking.openURL("https://maps.app.goo.gl/")}>
                      <Feather name="map-pin" size={13} color="#fff" />
                      <Text style={styles.actionBtnTxt}>{t("أرسل موقعك", "Send Location")}</Text>
                    </Pressable>
                  )}
                  {booking.mode === "store" && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#22C55E" }]} onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address || "")}`)}>
                      <Feather name="map" size={13} color="#fff" />
                      <Text style={styles.actionBtnTxt}>{t("عرض الموقع", "View Location")}</Text>
                    </Pressable>
                  )}
                  {booking.mode === "remote" && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: "#8B5CF6" }]} onPress={() => Linking.openURL("tel:0500000000")}>
                      <Feather name="video" size={13} color="#fff" />
                      <Text style={styles.actionBtnTxt}>{t("انضم للجلسة", "Join Session")}</Text>
                    </Pressable>
                  )}
                  <Pressable style={[styles.actionBtnOutline, { borderColor: "#EF4444" }]}>
                    <Feather name="x-circle" size={13} color="#EF4444" />
                    <Text style={[styles.actionBtnOutlineTxt, { color: "#EF4444" }]}>{t("إلغاء الحجز", "Cancel Booking")}</Text>
                  </Pressable>
                </View>
              )}
              {booking.status === "completed" && (
                <View style={styles.actionRow}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: booking.color, flex: 1 }]} onPress={() => router.push("/section/beauty" as any)}>
                    <Feather name="repeat" size={13} color="#fff" />
                    <Text style={styles.actionBtnTxt}>{t("احجز مجدداً", "Book Again")}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}

        <View style={[styles.policyCard, { backgroundColor: isDark ? colors.card : "#FFFBF0", borderColor: "#F59E0B30" }]}>
          <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
            <Text style={[styles.policyTitle, { color: "#F59E0B" }]}>{t("سياسة الإلغاء والاسترداد", "Cancellation & Refund Policy")}</Text>
          </View>
          {(lang === "ar" ? [
            "إلغاء مجاني حتى 24 ساعة قبل الموعد",
            "إلغاء بعد 24 ساعة: رسوم 50% من قيمة الحجز",
            "عدم الحضور دون إشعار: لا يُسترد المبلغ",
            "التأخر أكثر من 15 دقيقة يُعتبر عدم حضور",
            "يمكن تعديل الموعد مرة واحدة مجاناً",
          ] : [
            "Free cancellation up to 24 hours before appointment",
            "Cancellation within 24 hours: 50% fee applies",
            "No-show without notice: no refund",
            "Late by more than 15 minutes counts as no-show",
            "Appointment can be rescheduled once for free",
          ]).map((policy, idx) => (
            <View key={idx} style={{ flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, marginTop: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#F59E0B", marginTop: 6 }} />
              <Text style={[styles.policyTxt, { color: colors.textSecondary }]}>{policy}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row-reverse", borderBottomWidth: 1, paddingHorizontal: 4 },
  filterTab: { flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: 2.5, borderBottomColor: "transparent", gap: 2 },
  filterTabCount: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  filterTabLabel: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: "Tajawal_400Regular" },
  bookingCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  cardTop: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  providerIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  providerName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  serviceName: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTxt: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  detailsBox: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  detailTxt: { fontSize: 13, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  detailSub: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  actionRow: { flexDirection: "row-reverse", gap: 10 },
  actionBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  actionBtnTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  actionBtnOutline: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  actionBtnOutlineTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  policyCard: { borderRadius: 18, borderWidth: 1, padding: 16 },
  policyTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  policyTxt: { fontSize: 12, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right", lineHeight: 20 },
});
