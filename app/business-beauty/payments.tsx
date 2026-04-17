import { Feather } from "@expo/vector-icons";
import React from "react";
import { I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BeautyPayments() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
    completed: { ar: "مكتمل", en: "Completed", color: "#059669" },
    pending: { ar: "معلق", en: "Pending", color: "#D97706" },
    refunded: { ar: "مسترد", en: "Refunded", color: "#EF4444" },
  };

  const TXS = [
    { id: 1, nameAr: "سارة العنزي", nameEn: "Sara Al-Anazi", serviceAr: "صبغة شعر", serviceEn: "Hair Color", amount: 250, methodAr: "مدى", methodEn: "Mada", dateAr: "اليوم 10:00", dateEn: "Today 10:00", status: "completed" },
    { id: 2, nameAr: "منى الشمري", nameEn: "Muna Al-Shammari", serviceAr: "مكياج", serviceEn: "Makeup", amount: 350, methodAr: "فيزا", methodEn: "Visa", dateAr: "اليوم 11:30", dateEn: "Today 11:30", status: "completed" },
    { id: 3, nameAr: "رنا الحربي", nameEn: "Rana Al-Harbi", serviceAr: "مانيكير", serviceEn: "Manicure", amount: 120, methodAr: "كاش", methodEn: "Cash", dateAr: "اليوم 14:00", dateEn: "Today 14:00", status: "pending" },
    { id: 4, nameAr: "نوف العسيري", nameEn: "Nouf Al-Asiri", serviceAr: "عناية بشرة", serviceEn: "Skin Care", amount: 200, methodAr: "آبل باي", methodEn: "Apple Pay", dateAr: "أمس 15:00", dateEn: "Yesterday 15:00", status: "completed" },
    { id: 5, nameAr: "لمى القحطاني", nameEn: "Lama Al-Qahtani", serviceAr: "تسريحة", serviceEn: "Hairstyle", amount: 80, methodAr: "مدى", methodEn: "Mada", dateAr: "أمس 12:00", dateEn: "Yesterday 12:00", status: "completed" },
  ];

  const total = TXS.filter((t) => t.status === "completed").reduce((a, t) => a + t.amount, 0);
  const completedCount = TXS.filter((t) => t.status === "completed").length;
  const pendingCount = TXS.filter((t) => t.status === "pending").length;

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <View style={[s.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("المدفوعات","Payments")}</Text>
      </View>
      <View style={[s.summaryCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "30" }]}>
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: BRAND }]}>{total} SAR</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("إيراد اليوم","Today's Revenue")}</Text>
        </View>
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: colors.text }]}>{completedCount}</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("معاملة ناجحة","Successful")}</Text>
        </View>
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: "#D97706" }]}>{pendingCount}</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("معلقة","Pending")}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}>
        {TXS.map((tx) => {
          const st = STATUS_MAP[tx.status];
          return (
            <View key={tx.id} style={[s.txCard, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "20" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[s.txName, { color: colors.text }]}>{lang === "ar" ? tx.nameAr : tx.nameEn}</Text>
                <Text style={[s.txService, { color: colors.muted }]}>{lang === "ar" ? tx.serviceAr : tx.serviceEn} · {lang === "ar" ? tx.methodAr : tx.methodEn}</Text>
                <Text style={[s.txDate, { color: colors.muted }]}>{lang === "ar" ? tx.dateAr : tx.dateEn}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={[s.txAmount, { color: BRAND }]}>{tx.amount} SAR</Text>
                <View style={[s.statusBadge, { backgroundColor: st.color + "20" }]}>
                  <Text style={[s.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "right" },
  summaryCard: { flexDirection: "row-reverse", margin: 16, borderRadius: 16, padding: 16, borderWidth: 1, justifyContent: "space-around" },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryVal: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  divider: { width: 1, height: 40 },
  txCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  txName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  txService: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  txDate: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  txAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
