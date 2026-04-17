import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const INITIAL_ORDERS = [
  { id: "#1045", customer: "خلود العمري",     product: "مكمل زنك + فيتامين D",  qty: 3, amount: "235 SAR", statusKey: "new",       time: "منذ دقيقتين",  address: "الرياض - النزهة",  payment: "Apple Pay" },
  { id: "#1044", customer: "بدر الشمري",       product: "بروتين واي 2kg",        qty: 1, amount: "249 SAR", statusKey: "new",       time: "منذ 8 دقائق",  address: "الرياض - العليا",  payment: "مدى" },
  { id: "#1043", customer: "نوف الزهراني",     product: "باقة رعاية البشرة",      qty: 1, amount: "420 SAR", statusKey: "new",       time: "منذ 15 دقيقة", address: "الرياض - الملقا",  payment: "بطاقة بنكية" },
  { id: "#1042", customer: "أحمد الغامدي",    product: "فيتامين C 1000mg",       qty: 2, amount: "178 SAR", statusKey: "processing", time: "منذ 40 دقيقة", address: "الرياض - النزهة",  payment: "بطاقة بنكية" },
  { id: "#1041", customer: "سارة المطيري",    product: "زيت شعر أرجان",          qty: 1, amount: "220 SAR", statusKey: "processing", time: "منذ ساعة",     address: "الرياض - العليا",  payment: "Apple Pay" },
  { id: "#1040", customer: "منيرة القحطاني",  product: "باقة تجميل شهرية",       qty: 1, amount: "650 SAR", statusKey: "completed",  time: "منذ ساعتين",   address: "الرياض - الملقا",  payment: "مدى" },
  { id: "#1039", customer: "نورة السلمي",     product: "بروتين واي 2kg",         qty: 1, amount: "249 SAR", statusKey: "completed",  time: "أمس 18:30",    address: "الرياض - الروضة",  payment: "بطاقة بنكية" },
  { id: "#1038", customer: "فاطمة العتيبي",   product: "زيت أرجان طبيعي",       qty: 2, amount: "258 SAR", statusKey: "cancelled",  time: "أمس 10:15",    address: "الرياض - اليرموك", payment: "—" },
];

const STATUS_INFO: Record<string, { ar: string; en: string; color: string; bg: string }> = {
  new:        { ar: "طلب جديد",    en: "New Order",    color: "#7C3AED", bg: "#EDE9FE" },
  processing: { ar: "قيد التنفيذ", en: "In Progress",  color: "#D97706", bg: "#FEF3C7" },
  completed:  { ar: "مكتمل",       en: "Completed",    color: "#059669", bg: "#D1FAE5" },
  cancelled:  { ar: "ملغي",        en: "Cancelled",    color: "#DC2626", bg: "#FEE2E2" },
  rejected:   { ar: "مرفوض",       en: "Rejected",     color: "#9CA3AF", bg: "#F3F4F6" },
};

export default function OrdersPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const C = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t, lang } = useLanguage();
  const [filterKey, setFilterKey] = useState("all");
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const FILTERS = [
    { key: "all",        ar: "الكل",        en: "All" },
    { key: "new",        ar: "طلبات جديدة", en: "New" },
    { key: "processing", ar: "قيد التنفيذ", en: "Processing" },
    { key: "completed",  ar: "مكتمل",       en: "Completed" },
    { key: "cancelled",  ar: "ملغي",        en: "Cancelled" },
  ];

  const cardBg = colors.surface;
  const cardBorder = colors.border;

  const filtered = filterKey === "all" ? orders : orders.filter((o) => o.statusKey === filterKey);
  const newCount = orders.filter((o) => o.statusKey === "new").length;

  const handleAccept = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statusKey: "processing" } : o));
    Alert.alert("✅ " + t("تم قبول الطلب", "Order Accepted"), t("سيتم البدء في تجهيز الطلب", "Order is being processed now"));
  };

  const handleReject = (id: string) => {
    Alert.alert(
      t("رفض الطلب", "Reject Order"),
      t("هل تريد رفض هذا الطلب؟", "Are you sure you want to reject this order?"),
      [
        { text: t("إلغاء", "Cancel"), style: "cancel" },
        {
          text: t("رفض", "Reject"), style: "destructive",
          onPress: () => setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statusKey: "rejected" } : o)),
        },
      ]
    );
  };

  const handleComplete = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statusKey: "completed" } : o));
    Alert.alert("✅ " + t("تم", "Done"), t("تم تحديث حالة الطلب إلى مكتمل", "Order marked as completed"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.pageHeader, { paddingTop: topPadding + 10, backgroundColor: colors.background, borderBottomColor: cardBorder }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Feather name="chevron-right" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("إدارة الطلبات", "Order Management")}</Text>
        {newCount > 0 && (
          <View style={[styles.newBadge, { backgroundColor: C }]}>
            <Text style={styles.newBadgeText}>{newCount} {t("جديد", "New")}</Text>
          </View>
        )}
      </View>

      {/* Pending banner */}
      {newCount > 0 && (
        <Pressable style={[styles.pendingBanner, { backgroundColor: isDark ? "#1E0050" : "#F5F0FF", borderColor: C }]}
          onPress={() => setFilterKey("new")}>
          <Feather name="alert-circle" size={18} color={C} />
          <Text style={[styles.pendingText, { color: C }]}>
            {t(`${newCount} طلبات جديدة تنتظر موافقتك`, `${newCount} new orders awaiting your approval`)}
          </Text>
          <Feather name="chevron-left" size={16} color={C} />
        </Pressable>
      )}

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f.key}
            style={[styles.filterChip, { borderColor: filterKey === f.key ? C : cardBorder, backgroundColor: filterKey === f.key ? C : cardBg }]}
            onPress={() => setFilterKey(f.key)}>
            <Text style={[styles.filterText, { color: filterKey === f.key ? "#fff" : colors.muted }]}>
              {lang === "ar" ? f.ar : f.en}
              {f.key === "new" && newCount > 0 ? ` (${newCount})` : ""}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, gap: 12 }}>
        {filtered.map((order) => {
          const st = STATUS_INFO[order.statusKey] || STATUS_INFO.new;
          const isNew = order.statusKey === "new";
          const isProcessing = order.statusKey === "processing";
          return (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: cardBg, borderColor: isNew ? C : cardBorder, borderWidth: isNew ? 1.5 : 1 }]}>
              {/* Order header */}
              <View style={styles.orderTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.orderId, { color: colors.muted }]}>{order.id}  ·  {order.time}</Text>
                  <Text style={[styles.orderCustomer, { color: colors.text }]}>{order.customer}</Text>
                  <Text style={[styles.orderProduct, { color: colors.muted }]}>{order.product}  ×{order.qty}</Text>
                  <Text style={[styles.orderAddress, { color: colors.muted }]}>📍 {order.address}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[styles.statusText, { color: st.color }]}>{lang === "ar" ? st.ar : st.en}</Text>
                  </View>
                  <Text style={[styles.orderAmount, { color: C }]}>{order.amount}</Text>
                  <Text style={[styles.orderPayment, { color: colors.muted }]}>{order.payment}</Text>
                </View>
              </View>

              {/* Action buttons for new orders */}
              {isNew && (
                <View style={[styles.actionRow, { borderTopColor: C + "30" }]}>
                  <Pressable style={[styles.rejectBtn, { borderColor: "#DC2626" }]}
                    onPress={() => handleReject(order.id)}>
                    <Feather name="x" size={16} color="#DC2626" />
                    <Text style={[styles.actionText, { color: "#DC2626" }]}>{t("رفض الطلب", "Reject")}</Text>
                  </Pressable>
                  <Pressable style={[styles.acceptBtn, { backgroundColor: "#059669" }]}
                    onPress={() => handleAccept(order.id)}>
                    <Feather name="check" size={16} color="#fff" />
                    <Text style={[styles.actionText, { color: "#fff" }]}>{t("قبول الطلب", "Accept Order")}</Text>
                  </Pressable>
                </View>
              )}

              {/* Complete button for in-progress orders */}
              {isProcessing && (
                <Pressable style={[styles.completeBtn, { backgroundColor: "#059669" + "15", borderColor: "#059669" + "40" }]}
                  onPress={() => handleComplete(order.id)}>
                  <Feather name="package" size={14} color="#059669" />
                  <Text style={[styles.actionText, { color: "#059669" }]}>{t("تأكيد التسليم", "Confirm Delivery")}</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>{t("لا توجد طلبات في هذه الفئة", "No orders in this category")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  newBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  newBadgeText: { color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  pendingBanner: { flexDirection: "row-reverse", alignItems: "center", marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 14, padding: 12, borderWidth: 1.5, gap: 10 },
  pendingText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  orderCard: { borderRadius: 16, padding: 14 },
  orderTop: { flexDirection: "row-reverse", gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  orderId: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  orderCustomer: { fontSize: 15, fontFamily: "Tajawal_700Bold", marginBottom: 2 },
  orderProduct: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  orderAddress: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  orderAmount: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  orderPayment: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  actionRow: { flexDirection: "row-reverse", gap: 10, borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  acceptBtn: { flex: 2, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  rejectBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  actionText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  completeBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginTop: 10 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
});
