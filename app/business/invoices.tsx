import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView,
  StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const INVOICES = [
  { id: "INV-2041", customer: "أحمد الغامدي",   items: 2, amount: "178 SAR", date: "29 Mar 2026", statusKey: "paid",      method: "Bank Card"     },
  { id: "INV-2040", customer: "سارة المطيري",   items: 1, amount: "220 SAR", date: "29 Mar 2026", statusKey: "paid",      method: "Apple Pay"     },
  { id: "INV-2039", customer: "منيرة القحطاني", items: 1, amount: "650 SAR", date: "28 Mar 2026", statusKey: "paid",      method: "Mada"          },
  { id: "INV-2038", customer: "نورة السلمي",    items: 1, amount: "249 SAR", date: "28 Mar 2026", statusKey: "paid",      method: "Bank Card"     },
  { id: "INV-2037", customer: "فاطمة العتيبي",  items: 2, amount: "258 SAR", date: "27 Mar 2026", statusKey: "refunded",  method: "—"             },
  { id: "INV-2036", customer: "خالد الشمري",    items: 3, amount: "420 SAR", date: "27 Mar 2026", statusKey: "pending",   method: "Bank Transfer" },
];

export default function InvoicesPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [filterKey, setFilterKey] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useLanguage();

  const FILTER_MAP = [
    { key: "all",      label: t("الكل",       "All")      },
    { key: "paid",     label: t("مدفوعة",     "Paid")     },
    { key: "pending",  label: t("معلقة",      "Pending")  },
    { key: "refunded", label: t("مسترجعة",    "Refunded") },
  ];

  const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    paid:     { label: t("مدفوعة",  "Paid"),     color: "#059669", bg: "#D1FAE5" },
    pending:  { label: t("معلقة",   "Pending"),  color: "#D97706", bg: "#FEF3C7" },
    refunded: { label: t("مسترجعة", "Refunded"), color: "#DC2626", bg: "#FEE2E2" },
  };

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  const filtered = filterKey === "all" ? INVOICES : INVOICES.filter((i) => i.statusKey === filterKey);
  const paidInvoices = filtered.filter((i) => i.statusKey === "paid");
  const total = paidInvoices.reduce((a, i) => a + parseFloat(i.amount.replace(" SAR", "").replace(",", "")), 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("الفواتير","Invoices")}</Text>
        <Pressable style={styles.exportBtn}
          onPress={() => Alert.alert(t("تصدير الفواتير","Export Invoices"), t("سيتم تصدير الفواتير كملف PDF أو Excel","Invoices will be exported as PDF or Excel"))}>
          <Feather name="download" size={16} color="#7C3AED" />
        </Pressable>
      </View>

      <View style={[styles.summaryBanner, { backgroundColor: "#6D28D9" }]}>
        <Text style={styles.summaryLabel}>{t("إجمالي المدفوعات","Total Payments")}</Text>
        <Text style={styles.summaryAmount}>{total.toLocaleString()} SAR</Text>
        <Text style={styles.summaryCount}>{paidInvoices.length} {t("فاتورة مدفوعة","paid invoices")}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTER_MAP.map((f) => (
          <Pressable key={f.key} style={[styles.filterChip, { borderColor: filterKey === f.key ? "#7C3AED" : cardBorder, backgroundColor: filterKey === f.key ? "#7C3AED" : cardBg }]}
            onPress={() => setFilterKey(f.key)}>
            <Text style={[styles.filterText, { color: filterKey === f.key ? "#fff" : colors.muted }]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {filtered.map((inv) => {
          const st = STATUS_MAP[inv.statusKey];
          return (
            <Pressable key={inv.id} style={[styles.invCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => setExpanded(expanded === inv.id ? null : inv.id)}>
              <View style={styles.invTop}>
                <View style={[styles.invStatus, { backgroundColor: st.bg }]}>
                  <Text style={[styles.invStatusText, { color: st.color }]}>{st.label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.invId, { color: colors.muted }]}>{inv.id}  ·  {inv.date}</Text>
                  <Text style={[styles.invCustomer, { color: isDark ? "#fff" : "#1A0A33" }]}>{inv.customer}</Text>
                </View>
                <Text style={[styles.invAmount, { color: "#7C3AED" }]}>{inv.amount}</Text>
              </View>

              {expanded === inv.id && (
                <View style={[styles.invDetails, { borderTopColor: cardBorder }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{inv.items} {t("عناصر","items")}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("عدد المنتجات","Items Count")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{inv.method}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("طريقة الدفع","Payment Method")}</Text>
                  </View>
                  <View style={styles.invActions}>
                    <Pressable style={[styles.invActionBtn, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
                      onPress={() => Alert.alert(t("تفاصيل الفاتورة","Invoice Details"), `${inv.id} - ${inv.customer}\n${t("المبلغ","Amount")}: ${inv.amount}`)}>
                      <Feather name="eye" size={14} color="#7C3AED" />
                      <Text style={[styles.invActionText, { color: "#7C3AED" }]}>{t("عرض","View")}</Text>
                    </Pressable>
                    <Pressable style={[styles.invActionBtn, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
                      onPress={() => Alert.alert(t("تحميل الفاتورة","Download Invoice"), `${t("جاري تحميل","Downloading")} ${inv.id}...`)}>
                      <Feather name="download" size={14} color="#7C3AED" />
                      <Text style={[styles.invActionText, { color: "#7C3AED" }]}>{t("تحميل PDF","Download PDF")}</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  exportBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center" },
  summaryBanner: { marginHorizontal: 16, borderRadius: 18, padding: 18, marginBottom: 14 },
  summaryLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#C4B5FD", textAlign: "right" },
  summaryAmount: { fontSize: 32, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right" },
  summaryCount: { fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#A78BFA", textAlign: "right" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  invCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  invTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  invStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  invStatusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  invId: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  invCustomer: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  invAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  invDetails: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  invActions: { flexDirection: "row-reverse", gap: 10, marginTop: 6 },
  invActionBtn: { flex: 1, flexDirection: "row-reverse", gap: 6, paddingVertical: 10, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  invActionText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
