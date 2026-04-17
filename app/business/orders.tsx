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

const ORDERS = [
  { id: "#1042", customer: "أحمد الغامدي",   product: "فيتامين C 1000mg",   qty: 2, amount: "178 SAR", statusKey: "new",         time: "5 min ago", address: "Riyadh - Al-Nuzha",  payment: "Bank Card"     },
  { id: "#1041", customer: "سارة المطيري",   product: "جلسة مساج ظهر",      qty: 1, amount: "220 SAR", statusKey: "processing",  time: "40 min ago",address: "Riyadh - Al-Olaya", payment: "Apple Pay"     },
  { id: "#1040", customer: "منيرة القحطاني", product: "باقة تجميل شهرية",   qty: 1, amount: "650 SAR", statusKey: "completed",   time: "2 hrs ago", address: "Riyadh - Al-Malqa", payment: "Mada"          },
  { id: "#1039", customer: "نورة السلمي",    product: "بروتين واي 2kg",      qty: 1, amount: "249 SAR", statusKey: "completed",   time: "Yest 18:30",address: "Riyadh - Al-Rawdha",payment: "Bank Card"     },
  { id: "#1038", customer: "فاطمة العتيبي",  product: "زيت أرجان طبيعي",    qty: 2, amount: "258 SAR", statusKey: "cancelled",   time: "Yest 10:15",address: "Riyadh - Al-Yarmuk",payment: "—"             },
];

export default function OrdersPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [filterKey, setFilterKey] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useLanguage();

  const FILTER_MAP = [
    { key: "all",        label: t("الكل",          "All")         },
    { key: "new",        label: t("جديد",          "New")         },
    { key: "processing", label: t("قيد التنفيذ",   "In Progress") },
    { key: "completed",  label: t("مكتمل",         "Completed")   },
    { key: "cancelled",  label: t("ملغي",          "Cancelled")   },
  ];

  const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    new:        { label: t("جديد",        "New"),         color: "#7C3AED", bg: "#EDE9FE" },
    processing: { label: t("قيد التنفيذ", "In Progress"), color: "#D97706", bg: "#FEF3C7" },
    completed:  { label: t("مكتمل",       "Completed"),   color: "#059669", bg: "#D1FAE5" },
    cancelled:  { label: t("ملغي",        "Cancelled"),   color: "#DC2626", bg: "#FEE2E2" },
  };

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  const filtered = filterKey === "all" ? ORDERS : ORDERS.filter((o) => o.statusKey === filterKey);
  const newCount = ORDERS.filter((o) => o.statusKey === "new").length;

  const handleStatusChange = (orderId: string, current: string) => {
    const nextMap: Record<string, string> = { new: "processing", processing: "completed" };
    const next = nextMap[current];
    if (next) Alert.alert(t("تحديث الحالة","Update Status"), `${t("تحديث الطلب","Update order")} ${orderId} ${t("إلى","to")}: ${STATUS_MAP[next]?.label}`, [
      { text: t("إلغاء","Cancel"), style: "cancel" },
      { text: t("تحديث","Update"), onPress: () => Alert.alert(t("تم","Done"), `${t("تم تحديث الحالة","Status updated to")}: ${STATUS_MAP[next]?.label}`) },
    ]);
    else Alert.alert(t("الطلب مكتمل","Order Completed"), t("لا يمكن تغيير حالة الطلب المكتمل","Cannot change status of a completed order"));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("الطلبات","Orders")}</Text>
        <View style={[styles.badge, { backgroundColor: "#7C3AED" }]}>
          <Text style={styles.badgeText}>{newCount} {t("جديد","New")}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTER_MAP.map((f) => (
          <Pressable key={f.key} style={[styles.filterChip, { borderColor: filterKey === f.key ? "#7C3AED" : cardBorder, backgroundColor: filterKey === f.key ? "#7C3AED" : cardBg }]}
            onPress={() => setFilterKey(f.key)}>
            <Text style={[styles.filterText, { color: filterKey === f.key ? "#fff" : colors.muted }]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {filtered.map((order) => {
          const st = STATUS_MAP[order.statusKey];
          return (
            <Pressable key={order.id} style={[styles.orderCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
              onPress={() => setExpanded(expanded === order.id ? null : order.id)}>
              <View style={styles.orderTop}>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.orderId, { color: colors.muted }]}>{order.id}  ·  {order.time}</Text>
                  <Text style={[styles.orderCustomer, { color: isDark ? "#fff" : "#1A0A33" }]}>{order.customer}</Text>
                </View>
                <Text style={[styles.orderAmount, { color: "#7C3AED" }]}>{order.amount}</Text>
              </View>
              <Text style={[styles.orderProduct, { color: colors.muted }]}>{order.product}  ×{order.qty}</Text>

              {expanded === order.id && (
                <View style={[styles.orderDetails, { borderTopColor: cardBorder }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{order.address}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("العنوان","Address")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailValue, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{order.payment}</Text>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>{t("طريقة الدفع","Payment Method")}</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtnSm, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => Alert.alert(t("إلغاء الطلب","Cancel Order"), `${t("هل تريد إلغاء الطلب","Cancel order")} ${order.id}؟`, [
                        { text: t("لا","No"), style: "cancel" },
                        { text: t("نعم","Yes"), style: "destructive" },
                      ])}>
                      <Text style={[styles.actionBtnSmText, { color: "#DC2626" }]}>{t("إلغاء","Cancel")}</Text>
                    </Pressable>
                    {order.statusKey !== "completed" && order.statusKey !== "cancelled" && (
                      <Pressable style={[styles.actionBtnSm, { backgroundColor: "#7C3AED" }]}
                        onPress={() => handleStatusChange(order.id, order.statusKey)}>
                        <Text style={[styles.actionBtnSmText, { color: "#fff" }]}>{t("تحديث الحالة →","Update Status →")}</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t("لا توجد طلبات في هذه الفئة","No orders in this category")}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 10 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  orderCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  orderTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  orderId: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  orderCustomer: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  orderAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  orderProduct: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  orderDetails: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  detailLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  actionRow: { flexDirection: "row-reverse", gap: 10, marginTop: 6 },
  actionBtnSm: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  actionBtnSmText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
