import React from "react";
import { I18nManager, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#6366F1";

export default function SpaPayments() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const STATUS_MAP: Record<string, { ar: string; en: string; color: string }> = {
    completed: { ar: "مكتمل", en: "Completed", color: "#059669" },
    pending: { ar: "معلق", en: "Pending", color: "#D97706" },
  };

  const TXS = [
    { id: 1, nameAr: "خالد المنصور", nameEn: "Khalid Al-Mansour", serviceAr: "تدليك سويدي", serviceEn: "Swedish Massage", amount: 320, methodAr: "فيزا", methodEn: "Visa", dateAr: "اليوم 10:00", dateEn: "Today 10:00", status: "completed" },
    { id: 2, nameAr: "عمر الدوسري", nameEn: "Omar Al-Dossari", serviceAr: "ساونا + بخار", serviceEn: "Sauna + Steam", amount: 220, methodAr: "مدى", methodEn: "Mada", dateAr: "اليوم 11:00", dateEn: "Today 11:00", status: "completed" },
    { id: 3, nameAr: "لمياء الزهراني", nameEn: "Lamia Al-Zahrani", serviceAr: "تدليك أحجار", serviceEn: "Hot Stone Massage", amount: 420, methodAr: "كاش", methodEn: "Cash", dateAr: "اليوم 13:30", dateEn: "Today 13:30", status: "pending" },
    { id: 4, nameAr: "نوف العسيري", nameEn: "Nouf Al-Asiri", serviceAr: "باقة الاسترخاء", serviceEn: "Relaxation Package", amount: 750, methodAr: "آبل باي", methodEn: "Apple Pay", dateAr: "اليوم 15:00", dateEn: "Today 15:00", status: "completed" },
  ];

  const total = TXS.filter((t) => t.status === "completed").reduce((a, t) => a + t.amount, 0);

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#0A0A2A" : "#EEF2FF" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("المدفوعات","Payments")}</Text>
      </View>
      <View style={[s.summaryCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "30" }]}>
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: BRAND }]}>{total} SAR</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("إيراد اليوم","Today's Revenue")}</Text>
        </View>
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: colors.text }]}>{TXS.filter((t) => t.status === "completed").length}</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("ناجحة","Successful")}</Text>
        </View>
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <View style={s.summaryItem}>
          <Text style={[s.summaryVal, { color: "#D97706" }]}>{TXS.filter((t) => t.status === "pending").length}</Text>
          <Text style={[s.summaryLabel, { color: colors.muted }]}>{t("معلقة","Pending")}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}>
        {TXS.map((tx) => {
          const st = STATUS_MAP[tx.status];
          return (
            <View key={tx.id} style={[s.txCard, { backgroundColor: isDark ? "#12124A" : "#fff", borderColor: BRAND + "20" }]}>
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
