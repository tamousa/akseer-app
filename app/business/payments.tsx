import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function BusinessPayments() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const PAYMENT_SECTIONS = [
    { key: "invoices", label: t("الفواتير",          "Invoices"),          icon: "file-text"   as const, color: "#7C3AED", bg: "#EDE9FE", badge: t("12 فاتورة", "12 Invoices"), desc: t("استعراض وتصدير الفواتير الصادرة والمدفوعة",          "View and export issued and paid invoices"),                                route: "/business/invoices" },
    { key: "pos",      label: t("نقاط البيع",         "Point of Sale"),     icon: "monitor"     as const, color: "#059669", bg: "#D1FAE5", badge: "",                            desc: t("إدارة عمليات البيع الحضوري وإتمام الدفع",              "Manage in-person sales and complete payments"),                            route: "/business/pos"      },
    { key: "reports",  label: t("التقارير المالية",   "Financial Reports"), icon: "bar-chart-2" as const, color: "#2563EB", bg: "#DBEAFE", badge: "",                            desc: t("تقارير الإيرادات والمصاريف والأرباح التفصيلية",         "Detailed revenue, expenses and profit reports"),                          route: "/business/reports"  },
  ];

  const RECENT_TRANSACTIONS = [
    { id: "INV-2041", customer: "أحمد الغامدي",   amount: "+178 SAR", time: t("اليوم 14:32", "Today 14:32"), icon: "arrow-down-left"  as const, color: "#059669" },
    { id: "INV-2040", customer: "سارة المطيري",   amount: "+220 SAR", time: t("اليوم 11:20", "Today 11:20"), icon: "arrow-down-left"  as const, color: "#059669" },
    { id: "INV-2039", customer: "منيرة القحطاني", amount: "+650 SAR", time: t("أمس 18:05",   "Yest. 18:05"), icon: "arrow-down-left"  as const, color: "#059669" },
    { id: "INV-2038", customer: "فاطمة العتيبي",  amount: "-45 SAR",  time: t("أمس 10:15",   "Yest. 10:15"), icon: "arrow-up-right"   as const, color: "#DC2626" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("إدارة المدفوعات", "Payments Management")}</Text>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: "#6D28D9" }]}>
        <Text style={styles.balanceLabel}>{t("الرصيد الإجمالي هذا الشهر", "Total Balance This Month")}</Text>
        <Text style={styles.balanceAmount}>14,320 SAR</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Feather name="arrow-down-left" size={14} color="#A78BFA" />
            <Text style={styles.balanceStatText}>{t("وارد: 15,200 ر", "In: 15,200 SAR")}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Feather name="arrow-up-right" size={14} color="#FCA5A5" />
            <Text style={styles.balanceStatText}>{t("صادر: 880 ر", "Out: 880 SAR")}</Text>
          </View>
        </View>
        <Pressable style={styles.withdrawBtn}
          onPress={() => Alert.alert(t("تحويل الرصيد", "Transfer Balance"), t("سيتم تحويل رصيدك لحسابك البنكي المسجل", "Your balance will be transferred to your registered bank account"))}>
          <Feather name="send" size={14} color="#7C3AED" />
          <Text style={styles.withdrawBtnText}>{t("تحويل الرصيد", "Transfer Balance")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12, marginBottom: 24 }}>
        {PAYMENT_SECTIONS.map((section) => (
          <Pressable key={section.key}
            style={[styles.sectionCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
            onPress={() => router.push(section.route as any)}>
            <View style={styles.sectionCardInner}>
              <Feather name="chevron-left" size={18} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTop}>
                  {section.badge ? (
                    <View style={[styles.badge, { backgroundColor: isDark ? section.color + "25" : section.bg }]}>
                      <Text style={[styles.badgeText, { color: section.color }]}>{section.badge}</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.sectionLabel, { color: isDark ? "#fff" : "#1A0A33" }]}>{section.label}</Text>
                </View>
                <Text style={[styles.sectionDesc, { color: colors.muted }]}>{section.desc}</Text>
              </View>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? section.color + "25" : section.bg }]}>
                <Feather name={section.icon} size={22} color={section.color} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Pressable onPress={() => router.push("/business/invoices" as any)}>
          <Text style={[styles.seeAll, { color: "#7C3AED" }]}>{t("عرض الكل", "View All")}</Text>
        </Pressable>
        <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("آخر المعاملات", "Recent Transactions")}</Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {RECENT_TRANSACTIONS.map((tx, i) => (
          <View key={i} style={[styles.txCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
            <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txCustomer, { color: isDark ? "#fff" : "#1A0A33" }]}>{tx.customer}</Text>
              <Text style={[styles.txMeta, { color: colors.muted }]}>{tx.id}  ·  {tx.time}</Text>
            </View>
            <View style={[styles.txIcon, { backgroundColor: tx.color + "20" }]}>
              <Feather name={tx.icon} size={18} color={tx.color} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 20 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  balanceCard: { marginHorizontal: 16, borderRadius: 22, padding: 22, marginBottom: 22 },
  balanceLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#C4B5FD", textAlign: "right" },
  balanceAmount: { fontSize: 36, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "right", marginVertical: 6 },
  balanceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16, marginBottom: 16 },
  balanceStat: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balanceStatText: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#DDD6FE" },
  balanceDivider: { width: 1, height: 16, backgroundColor: "#ffffff30" },
  withdrawBtn: { flexDirection: "row-reverse", gap: 8, backgroundColor: "#fff", alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  withdrawBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#7C3AED" },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  sectionCardInner: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sectionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sectionTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  sectionLabel: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sectionDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  sectionRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 14 },
  subTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  txCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 14, padding: 14, borderWidth: 1 },
  txIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txCustomer: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  txMeta: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  txAmount: { fontSize: 15, fontFamily: "Cairo_700Bold", minWidth: 80, textAlign: "right" },
});
