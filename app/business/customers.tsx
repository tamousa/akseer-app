import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const CUSTOMERS = [
  { name: "أحمد الغامدي",   phone: "0501234567", orders: 8,  spent: "1,240 SAR", lastOrder: "اليوم",        tag: "مميز", tagColor: "#7C3AED", tagBg: "#EDE9FE" },
  { name: "سارة المطيري",   phone: "0551234567", orders: 5,  spent: "850 SAR",   lastOrder: "أمس",          tag: "نشط",  tagColor: "#059669", tagBg: "#D1FAE5" },
  { name: "منيرة القحطاني", phone: "0561234567", orders: 12, spent: "2,870 SAR", lastOrder: "منذ 3 أيام",   tag: "مميز", tagColor: "#7C3AED", tagBg: "#EDE9FE" },
  { name: "نورة السلمي",    phone: "0541234567", orders: 2,  spent: "320 SAR",   lastOrder: "منذ أسبوع",    tag: "جديد", tagColor: "#D97706", tagBg: "#FEF3C7" },
  { name: "فاطمة العتيبي",  phone: "0531234567", orders: 3,  spent: "480 SAR",   lastOrder: "منذ أسبوعين",  tag: "نشط",  tagColor: "#059669", tagBg: "#D1FAE5" },
];

export default function BusinessCustomers() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const filtered = CUSTOMERS.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  const tagLabel = (tag: string) => {
    if (tag === "مميز") return t("مميز", "VIP");
    if (tag === "نشط")  return t("نشط",  "Active");
    if (tag === "جديد") return t("جديد", "New");
    return tag;
  };

  const SUMMARY = [
    { label: t("إجمالي العملاء",    "Total Customers"),  value: "128", icon: "users"    as const, color: "#7C3AED" },
    { label: t("عملاء جدد الشهر",  "New This Month"),   value: "14",  icon: "user-plus" as const, color: "#059669" },
    { label: t("معدل الاحتفاظ",     "Retention Rate"),   value: "78%", icon: "repeat"   as const, color: "#2563EB" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("إدارة العملاء", "Customers")}</Text>
        <Pressable
          style={[styles.exportBtn, { borderColor: "#7C3AED", backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}
          onPress={() => Alert.alert(t("تصدير", "Export"), t("سيتم تصدير بيانات العملاء كملف Excel", "Customer data will be exported as an Excel file"))}
        >
          <Feather name="download" size={14} color="#7C3AED" />
          <Text style={[styles.exportBtnText, { color: "#7C3AED" }]}>{t("تصدير", "Export")}</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        {SUMMARY.map((s, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
            <View style={[styles.summaryIcon, { backgroundColor: s.color + "20" }]}>
              <Feather name={s.icon} size={16} color={s.color} />
            </View>
            <Text style={[styles.summaryValue, { color: isDark ? "#fff" : "#1A0A33" }]}>{s.value}</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.searchBar, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
        <Feather name="search" size={18} color={colors.muted} />
        <TextInput
          placeholder={t("ابحث بالاسم أو رقم الجوال...", "Search by name or phone...")}
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]}
          textAlign="right"
        />
      </View>

      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {filtered.map((customer, i) => (
          <Pressable
            key={i}
            style={[styles.customerCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
            onPress={() => Alert.alert(customer.name, `${t("الجوال","Phone")}: ${customer.phone}\n${t("الطلبات","Orders")}: ${customer.orders}\n${t("إجمالي الإنفاق","Total Spent")}: ${customer.spent}`)}
          >
            <Feather name="chevron-left" size={16} color={colors.muted} style={{ marginLeft: 4 }} />
            <View style={{ flex: 1 }}>
              <View style={styles.customerTop}>
                <View style={[styles.customerTag, { backgroundColor: customer.tagBg }]}>
                  <Text style={[styles.customerTagText, { color: customer.tagColor }]}>{tagLabel(customer.tag)}</Text>
                </View>
                <Text style={[styles.customerName, { color: isDark ? "#fff" : "#1A0A33" }]}>{customer.name}</Text>
              </View>
              <Text style={[styles.customerPhone, { color: colors.muted }]}>{customer.phone}  ·  {t("آخر طلب:", "Last order:")} {customer.lastOrder}</Text>
              <View style={styles.customerStats}>
                <View style={styles.customerStat}>
                  <Text style={[styles.customerStatValue, { color: "#7C3AED" }]}>{customer.spent}</Text>
                  <Text style={[styles.customerStatLabel, { color: colors.muted }]}>{t("إجمالي الإنفاق", "Total Spent")}</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: isDark ? "#2A1F45" : "#EDE9FE" }]} />
                <View style={styles.customerStat}>
                  <Text style={[styles.customerStatValue, { color: "#059669" }]}>{customer.orders}</Text>
                  <Text style={[styles.customerStatLabel, { color: colors.muted }]}>{t("طلب", "Orders")}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.customerAvatar, { backgroundColor: "#7C3AED20" }]}>
              <Text style={[styles.customerAvatarText, { color: "#7C3AED" }]}>{customer.name.charAt(0)}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 20 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  exportBtn: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  exportBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  summaryRow: { flexDirection: "row-reverse", paddingHorizontal: 14, gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center", gap: 6, borderWidth: 1 },
  summaryIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  summaryValue: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  searchBar: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 20, marginBottom: 16, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  customerCard: { borderRadius: 18, padding: 16, borderWidth: 1, flexDirection: "row-reverse", alignItems: "flex-start", gap: 12 },
  customerAvatar: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  customerAvatarText: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  customerTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  customerName: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  customerTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  customerTagText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  customerPhone: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 10 },
  customerStats: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  customerStat: { alignItems: "flex-end" },
  customerStatValue: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  customerStatLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  statDivider: { width: 1, height: 28 },
});
