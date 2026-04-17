import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useCart, InvoiceData } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const PAYMENT_METHODS = [
  { key: "apple", label: "Apple Pay", icon: "smartphone" as const },
  { key: "card", label: "بطاقة ائتمان", icon: "credit-card" as const },
  { key: "mada", label: "مدى", icon: "credit-card" as const },
  { key: "cash", label: "الدفع عند الحضور", icon: "dollar-sign" as const },
];

export default function CartScreen() {
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { items, removeFromCart, clearCart, totalPrice, addInvoice } = useCart();
  const { addBooking } = useApp();

  const [paymentMethod, setPaymentMethod] = useState("apple");
  const [step, setStep] = useState<"review" | "payment" | "confirm">("review");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const topPadding = isWeb ? 67 : insets.top;
  const tax = Math.round(totalPrice * 0.15);
  const grandTotal = totalPrice + tax;

  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const finalizeBooking = () => {
    if (invoiceId) return invoiceId;

    const newInvoiceId = Date.now().toString();

    const invoice: InvoiceData = {
      id: newInvoiceId,
      items: [...items],
      subtotal: totalPrice,
      tax,
      total: grandTotal,
      providerName: items[0]?.providerName || "",
      providerType: items[0]?.providerType || "",
      date: new Date().toISOString(),
      status: "paid",
    };
    addInvoice(invoice);

    items.forEach((item) => {
      const typeMap: Record<string, "clinic" | "lab" | "beauty" | "trainer"> = {
        clinics: "clinic",
        labs: "lab",
        beauty: "beauty",
        trainers: "trainer",
        specialists: "clinic",
      };
      addBooking({
        type: typeMap[item.providerType] || "clinic",
        service: item.serviceName,
        provider: item.providerName,
        date: item.date,
        time: item.time,
        price: item.price,
        status: "confirmed",
      });
    });

    clearCart();
    setInvoiceId(newInvoiceId);
    return newInvoiceId;
  };

  const handlePay = () => {
    if (items.length === 0) return;
    const id = finalizeBooking();
    setStep("confirm");
  };

  if (items.length === 0 && step !== "confirm") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>سلة المشتريات</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.empty}>
          <Feather name="shopping-cart" size={48} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>السلة فارغة</Text>
          <Text style={[styles.emptySubText, { color: colors.muted }]}>ابدأ بإضافة خدمات من العيادات أو المتاجر</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.back()}>
            <Text style={styles.browseBtnText}>تصفح الخدمات</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => { if (step === "review") router.back(); else setStep("review"); }} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === "review" ? "سلة المشتريات" : step === "payment" ? "الدفع" : "تأكيد الحجز"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.stepsRow}>
        {["استعراض", "الدفع", "تأكيد"].map((s, i) => {
          const stepIdx = step === "review" ? 0 : step === "payment" ? 1 : 2;
          const isActive = i <= stepIdx;
          return (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: isActive ? "#C490D8" : isDark ? colors.surfaceAlt : "#E8E2F4" }]}>
                <Text style={[styles.stepNum, { color: isActive ? "#fff" : colors.muted }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, { color: isActive ? "#C490D8" : colors.muted }]}>{s}</Text>
            </View>
          );
        })}
      </View>

      {step === "review" && (
        <>
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>الخدمات المختارة</Text>
            {items.map((item) => (
              <View key={item.id} style={[styles.itemCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.serviceName}</Text>
                    <Text style={[styles.itemProvider, { color: colors.muted }]}>{item.providerName}</Text>
                  </View>
                  <Pressable onPress={() => removeFromCart(item.id)}>
                    <Feather name="trash-2" size={18} color="#F43F5E" />
                  </Pressable>
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemDetail}>
                    <Feather name="calendar" size={13} color={colors.muted} />
                    <Text style={[styles.itemDetailText, { color: colors.textSecondary }]}>{item.date}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Feather name="clock" size={13} color={colors.muted} />
                    <Text style={[styles.itemDetailText, { color: colors.textSecondary }]}>{item.time}</Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: "#C490D8" }]}>{item.price} ر.س</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.totalCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>المجموع الفرعي</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>{totalPrice} ر.س</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>ضريبة القيمة المضافة (15%)</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>{tax} ر.س</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={[styles.grandTotalLabel, { color: colors.text }]}>الإجمالي</Text>
              <Text style={[styles.grandTotalValue]}>  {grandTotal} ر.س</Text>
            </View>
          </View>

          <View style={styles.sectionPad}>
            <Pressable style={styles.continueBtn} onPress={() => setStep("payment")}>
              <Text style={styles.continueBtnText}>متابعة للدفع</Text>
              <Feather name="arrow-left" size={18} color="#fff" />
            </Pressable>
          </View>
        </>
      )}

      {step === "payment" && (
        <>
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>كود الخصم</Text>
            <View style={[styles.discountRow, { borderColor: discountApplied ? "#22C55E" : discountError ? "#F43F5E" : colors.border }]}>
              <TextInput
                style={[styles.discountInput, { color: colors.text }]}
                placeholder="أدخل كود الخصم"
                placeholderTextColor={colors.muted}
                value={discountCode}
                onChangeText={(t) => { setDiscountCode(t.toUpperCase()); setDiscountError(""); setDiscountApplied(false); }}
                autoCapitalize="characters"
              />
              <Pressable
                style={[styles.discountApplyBtn, { backgroundColor: discountApplied ? "#22C55E" : "#C490D8" }]}
                onPress={() => {
                  if (!discountCode.trim()) { setDiscountError("أدخل كود الخصم"); return; }
                  const validCodes = ["ELIXIR56", "FREEMIND", "SLEEP58", "FIT53", "AKSEER10", "WELCOME"];
                  if (validCodes.includes(discountCode.trim())) { setDiscountApplied(true); setDiscountError(""); }
                  else { setDiscountError("كود غير صالح"); setDiscountApplied(false); }
                }}
              >
                <Text style={styles.discountApplyText}>{discountApplied ? "✓ تم" : "تطبيق"}</Text>
              </Pressable>
            </View>
            {discountError ? <Text style={styles.discountErrorText}>{discountError}</Text> : null}
            {discountApplied ? <Text style={styles.discountSuccessText}>تم تطبيق الكود بنجاح!</Text> : null}
          </View>

          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>طريقة الدفع</Text>
            {PAYMENT_METHODS.map((pm) => (
              <Pressable
                key={pm.key}
                style={[styles.paymentCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: paymentMethod === pm.key ? "#C490D8" : colors.border }]}
                onPress={() => setPaymentMethod(pm.key)}
              >
                <View style={[styles.paymentIcon, { backgroundColor: paymentMethod === pm.key ? "#C490D8" + "20" : isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
                  <Feather name={pm.icon} size={20} color={paymentMethod === pm.key ? "#C490D8" : colors.muted} />
                </View>
                <Text style={[styles.paymentLabel, { color: colors.text }]}>{pm.label}</Text>
                <View style={[styles.radioOuter, { borderColor: paymentMethod === pm.key ? "#C490D8" : colors.muted }]}>
                  {paymentMethod === pm.key && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            ))}
          </View>

          <View style={[styles.totalCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={[styles.grandTotalLabel, { color: colors.text }]}>المبلغ المطلوب</Text>
              <Text style={[styles.grandTotalValue]}>{grandTotal} ر.س</Text>
            </View>
          </View>

          <View style={styles.sectionPad}>
            <Pressable style={styles.payBtn} onPress={handlePay}>
              <Feather name="lock" size={16} color="#fff" />
              <Text style={styles.payBtnText}>ادفع {grandTotal} ر.س</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === "confirm" && (
        <View style={styles.confirmSection}>
          <View style={styles.successIcon}>
            <Feather name="check-circle" size={64} color="#22C55E" />
          </View>
          <Text style={[styles.confirmTitle, { color: colors.text }]}>تم الدفع بنجاح!</Text>
          <Text style={[styles.confirmSub, { color: colors.muted }]}>تم تأكيد حجزك وإرسال التفاصيل</Text>

          <Pressable style={styles.confirmBtn} onPress={() => { if (invoiceId) router.push(`/invoice/${invoiceId}` as any); }}>
            <Feather name="file-text" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>عرض الفاتورة</Text>
          </Pressable>

          <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.push("/bookings" as any)}>
            <Feather name="calendar" size={18} color="#C490D8" />
            <Text style={[styles.secondaryBtnText, { color: "#C490D8" }]}>عرض حجوزاتي</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 18, fontFamily: "Tajawal_700Bold", marginTop: 8 },
  emptySubText: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
  browseBtn: { backgroundColor: "#A86DBF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 8 },
  browseBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  stepsRow: { flexDirection: "row-reverse", justifyContent: "center", gap: 32, paddingVertical: 16, paddingHorizontal: 20 },
  stepItem: { alignItems: "center", gap: 6 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  stepLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  sectionPad: { paddingHorizontal: 20, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 12 },
  itemCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10 },
  itemHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  itemName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  itemProvider: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  itemDetails: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.1)", paddingTop: 10 },
  itemDetail: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  itemDetailText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  itemPrice: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  totalCard: { marginHorizontal: 20, borderRadius: 18, padding: 18, borderWidth: 1, marginTop: 16 },
  totalRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 8 },
  totalLabel: { fontSize: 14, fontFamily: "Tajawal_400Regular" },
  totalValue: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.15)", paddingTop: 12, marginBottom: 0 },
  grandTotalLabel: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  grandTotalValue: { fontSize: 18, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  continueBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#A86DBF", paddingVertical: 16, borderRadius: 16, marginTop: 12 },
  continueBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  paymentCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 16, padding: 16, borderWidth: 1.5, marginBottom: 10 },
  paymentIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  paymentLabel: { flex: 1, fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#C490D8" },
  payBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#22C55E", paddingVertical: 16, borderRadius: 16, marginTop: 12 },
  payBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  confirmSection: { alignItems: "center", paddingTop: 40, paddingHorizontal: 20, gap: 12 },
  successIcon: { marginBottom: 8 },
  confirmTitle: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  confirmSub: { fontSize: 15, fontFamily: "Tajawal_400Regular", marginBottom: 20 },
  confirmBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#A86DBF", paddingVertical: 16, borderRadius: 16, width: "100%", marginBottom: 10 },
  confirmBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  secondaryBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1, width: "100%" },
  secondaryBtnText: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  discountRow: { flexDirection: "row-reverse", alignItems: "center", borderRadius: 14, borderWidth: 1.5, overflow: "hidden", marginBottom: 4 },
  discountInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  discountApplyBtn: { paddingHorizontal: 20, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  discountApplyText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  discountErrorText: { color: "#F43F5E", fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", marginTop: 4 },
  discountSuccessText: { color: "#22C55E", fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right", marginTop: 4 },
});
