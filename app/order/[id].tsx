import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useCart, ProductOrder } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

type OrderStatus = ProductOrder["status"];

const STATUS_STEPS: { key: OrderStatus; label: string; icon: string; color: string }[] = [
  { key: "placed",    label: "تم تقديم الطلب",    icon: "check-circle", color: "#C490D8" },
  { key: "confirmed", label: "تأكيد الطلب",        icon: "thumbs-up",    color: "#3B82F6" },
  { key: "preparing", label: "جاري التحضير",       icon: "package",      color: "#F59E0B" },
  { key: "shipped",   label: "في الطريق إليك",     icon: "truck",        color: "#8B5CF6" },
  { key: "delivered", label: "تم الاستلام",         icon: "home",         color: "#22C55E" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  placed: 0, confirmed: 1, preparing: 2, shipped: 3, delivered: 4,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
}

export default function OrderStatusPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { productOrders } = useCart();
  const topPadding = isWeb ? 67 : insets.top;

  const order = productOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>تتبع الطلب</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundBox}>
          <Text style={{ fontSize: 52 }}>📦</Text>
          <Text style={[styles.notFoundText, { color: colors.text }]}>الطلب غير موجود</Text>
          <Pressable style={styles.backBtnLarge} onPress={() => router.back()}>
            <Text style={styles.backBtnLargeText}>العودة</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentStatusIdx = STATUS_INDEX[order.status];
  const pickupSteps = STATUS_STEPS.filter((s) => s.key !== "shipped");
  const allSteps = order.deliveryMethod === "pickup" ? pickupSteps : STATUS_STEPS;

  const getStepStatus = (stepKey: OrderStatus) => {
    const stepIdx = STATUS_INDEX[stepKey];
    if (stepIdx < currentStatusIdx) return "done";
    if (stepIdx === currentStatusIdx) return "active";
    return "pending";
  };

  const activeStep = STATUS_STEPS.find((s) => s.key === order.status)!;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[activeStep.color + "CC", activeStep.color + "88"]}
        style={[styles.heroHeader, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtnWhite}>
            <Feather name="chevron-right" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitleWhite}>تتبع الطلب</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.heroContent}>
          <View style={[styles.statusIconBig, { backgroundColor: "#ffffff30" }]}>
            <Feather name={activeStep.icon as any} size={36} color="#fff" />
          </View>
          <Text style={styles.heroStatus}>{activeStep.label}</Text>
          <Text style={styles.heroOrderId}>طلب رقم #{order.id.slice(-6)}</Text>
          <Text style={styles.heroEta}>
            {order.estimatedTime
              ? `⏱️ وقت الوصول المتوقع: ${order.estimatedTime}`
              : ""}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 80 }}
      >
        {/* ─── TIMELINE ─── */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>مراحل الطلب</Text>
          {allSteps.map((step, i) => {
            const status = getStepStatus(step.key);
            const isLast = i === allSteps.length - 1;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    {
                      backgroundColor: status === "done" ? "#22C55E"
                        : status === "active" ? step.color
                        : (isDark ? colors.surface : "#E5E7EB"),
                      borderColor: status === "pending" ? colors.border : "transparent",
                    },
                  ]}>
                    {status === "done"
                      ? <Feather name="check" size={12} color="#fff" />
                      : status === "active"
                      ? <Feather name={step.icon as any} size={12} color="#fff" />
                      : null}
                  </View>
                  {!isLast && (
                    <View style={[styles.timelineLine, { backgroundColor: status === "done" ? "#22C55E40" : colors.border }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, {
                    color: status === "pending" ? colors.muted : colors.text,
                    fontFamily: status === "active" ? "Cairo_700Bold" : "Tajawal_500Medium",
                  }]}>
                    {step.label}
                  </Text>
                  {status === "active" && (
                    <View style={[styles.activePill, { backgroundColor: step.color + "20" }]}>
                      <View style={[styles.activeDot, { backgroundColor: step.color }]} />
                      <Text style={[styles.activePillText, { color: step.color }]}>الحالة الحالية</Text>
                    </View>
                  )}
                  {status === "done" && (
                    <Text style={[styles.doneText, { color: "#22C55E" }]}>✓ تم</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ─── ORDER DETAILS ─── */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>تفاصيل الطلب</Text>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>المتجر</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{order.storeName}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>تاريخ الطلب</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{formatDate(order.date)}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>وقت الطلب</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>{formatTime(order.date)}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>طريقة الاستلام</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>
              {order.deliveryMethod === "pickup" ? "🏪 من المتجر" : "🚚 توصيل للمنزل"}
            </Text>
          </View>
          {order.city && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>المدينة</Text>
              <Text style={[styles.detailVal, { color: colors.text }]}>{order.city}</Text>
            </View>
          )}
          {order.address && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>العنوان</Text>
              <Text style={[styles.detailVal, { color: colors.text }]} numberOfLines={2}>{order.address}</Text>
            </View>
          )}
          {order.shippingMethod && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>الشحن</Text>
              <Text style={[styles.detailVal, { color: colors.text }]}>
                {order.shippingMethod === "express" ? "⚡ سريع" : "📦 عادي"}
              </Text>
            </View>
          )}
          <View style={[styles.detailRow, { borderBottomColor: "transparent" }]}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>طريقة الدفع</Text>
            <Text style={[styles.detailVal, { color: colors.text }]}>
              {order.paymentMethod === "apple" ? "Apple Pay"
                : order.paymentMethod === "card" ? "بطاقة ائتمان"
                : order.paymentMethod === "mada" ? "مدى"
                : "دفع عند الاستلام"}
            </Text>
          </View>
        </View>

        {/* ─── ITEMS ─── */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>المنتجات</Text>
          {order.items.map((item, i) => (
            <View key={i} style={[styles.itemRow, { borderBottomColor: i < order.items.length - 1 ? colors.border : "transparent" }]}>
              <View style={[styles.itemEmoji, { backgroundColor: "#C490D810" }]}>
                <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.productName}</Text>
                <Text style={[styles.itemQty, { color: colors.muted }]}>الكمية: {item.qty}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: "#C490D8" }]}>{item.price * item.qty} ر.س</Text>
            </View>
          ))}
        </View>

        {/* ─── INVOICE SUMMARY ─── */}
        <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>ملخص الفاتورة</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>المنتجات</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>{order.subtotal} ر.س</Text>
          </View>
          {order.deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>التوصيل</Text>
              <Text style={[styles.summaryVal, { color: colors.text }]}>{order.deliveryFee} ر.س</Text>
            </View>
          )}
          {order.deliveryFee === 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>التوصيل</Text>
              <Text style={[styles.summaryVal, { color: "#22C55E" }]}>مجاني</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>ضريبة 15%</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>{order.tax} ر.س</Text>
          </View>
          <View style={[styles.summaryRow, styles.grandRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.grandLabel, { color: colors.text }]}>الإجمالي</Text>
            <Text style={styles.grandVal}>{order.total} ر.س</Text>
          </View>
        </View>

        {/* ─── SUPPORT ─── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Pressable style={[styles.supportBtn, { backgroundColor: isDark ? colors.card : "#F5F5F5", borderColor: colors.border }]}>
            <Feather name="message-circle" size={18} color="#C490D8" />
            <Text style={[styles.supportBtnText, { color: colors.text }]}>التواصل مع المتجر</Text>
            <Feather name="chevron-left" size={16} color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },

  heroHeader: { paddingHorizontal: 16, paddingBottom: 28 },
  headerRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backBtnWhite: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ffffff30", alignItems: "center", justifyContent: "center" },
  headerTitleWhite: { fontSize: 20, fontFamily: "Cairo_700Bold", color: "#fff" },
  heroContent: { alignItems: "center", gap: 8 },
  statusIconBig: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  heroStatus: { fontSize: 22, fontFamily: "Cairo_700Bold", color: "#fff" },
  heroOrderId: { fontSize: 14, fontFamily: "Tajawal_400Regular", color: "#ffffffCC" },
  heroEta: { fontSize: 13, fontFamily: "Tajawal_500Medium", color: "#fff", backgroundColor: "#ffffff20", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 4 },

  card: { marginHorizontal: 16, marginTop: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 14 },
  cardTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },

  timelineRow: { flexDirection: "row-reverse", gap: 12 },
  timelineLeft: { alignItems: "center", width: 28 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  timelineLine: { flex: 1, width: 2, marginTop: 4, marginBottom: -8 },
  timelineContent: { flex: 1, paddingBottom: 14, gap: 4 },
  timelineLabel: { fontSize: 14, textAlign: "right" },
  activePill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-end" },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activePillText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  doneText: { fontSize: 11, fontFamily: "Tajawal_500Medium", textAlign: "right" },

  detailRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottomWidth: 1 },
  detailLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  detailVal: { fontSize: 13, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },

  itemRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingBottom: 12, borderBottomWidth: 1 },
  itemEmoji: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  itemQty: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  itemPrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },

  summaryRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  summaryVal: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  grandRow: { borderTopWidth: 1, paddingTop: 12, marginTop: 4 },
  grandLabel: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  grandVal: { fontSize: 18, fontFamily: "Cairo_700Bold", color: "#C490D8" },

  supportBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 16, borderWidth: 1 },
  supportBtnText: { flex: 1, fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },

  notFoundBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtnLarge: { backgroundColor: "#C490D8", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 16 },
  backBtnLargeText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
