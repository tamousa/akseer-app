import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

type DeliveryMethod = "pickup" | "home";
type ShippingMethod = "standard" | "express";
type PaymentMethod = "apple" | "card" | "mada" | "cash";
type Step = "cart" | "delivery" | "shipping" | "payment" | "confirm";

const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "أبها", "تبوك", "القصيم", "حائل"];
const USER_CITY = "الرياض";

const PAYMENT_METHODS = [
  { key: "apple" as PaymentMethod, label: "Apple Pay", icon: "smartphone" as const, color: "#000" },
  { key: "card" as PaymentMethod, label: "بطاقة ائتمان / مدى", icon: "credit-card" as const, color: "#3B82F6" },
  { key: "cash" as PaymentMethod, label: "الدفع عند الاستلام", icon: "dollar-sign" as const, color: "#22C55E" },
];

const STEPS: { key: Step; label: string }[] = [
  { key: "cart", label: "السلة" },
  { key: "delivery", label: "التوصيل" },
  { key: "payment", label: "الدفع" },
  { key: "confirm", label: "تأكيد" },
];

export default function StoreCheckoutScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    productItems,
    removeProductFromCart,
    updateProductQty,
    clearProductCart,
    productTotal,
    addProductOrder,
    productOrders,
  } = useCart();

  const topPadding = isWeb ? 67 : insets.top;

  const [step, setStep] = useState<Step>("cart");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [selectedCity, setSelectedCity] = useState(USER_CITY);
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("apple");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const isDifferentCity = deliveryMethod === "home" && selectedCity !== USER_CITY;
  const deliveryFee = deliveryMethod === "pickup" ? 0 : isDifferentCity ? 0 : 15;
  const shippingFee = isDifferentCity
    ? shippingMethod === "express" ? 75 : 35
    : 0;
  const discount = discountApplied ? Math.round(productTotal * 0.1) : 0;
  const subtotal = productTotal - discount;
  const tax = Math.round(subtotal * 0.15);
  const grandTotal = subtotal + tax + deliveryFee + shippingFee;

  const storeName = productItems[0]?.storeName ?? "";
  const storeId = productItems[0]?.storeId ?? "";

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const visibleSteps = step === "confirm"
    ? STEPS.filter((s) => s.key !== "shipping")
    : deliveryMethod === "home" && isDifferentCity
    ? STEPS
    : STEPS.filter((s) => s.key !== "shipping");

  const placeOrder = () => {
    const newId = Date.now().toString();
    addProductOrder({
      id: newId,
      items: [...productItems],
      subtotal,
      deliveryFee: deliveryFee + shippingFee,
      tax,
      total: grandTotal,
      storeName,
      storeId,
      deliveryMethod,
      shippingMethod: isDifferentCity ? shippingMethod : undefined,
      address: deliveryMethod === "home" ? address || "الرياض، حي السليمانية" : undefined,
      city: deliveryMethod === "home" ? selectedCity : undefined,
      paymentMethod,
      date: new Date().toISOString(),
      status: "placed",
      estimatedTime:
        deliveryMethod === "pickup"
          ? "30 دقيقة"
          : isDifferentCity
          ? shippingMethod === "express"
            ? "يوم عمل"
            : "2-3 أيام عمل"
          : "45-60 دقيقة",
    });
    setOrderId(newId);
    clearProductCart();
    setStep("confirm");
  };

  const goNext = () => {
    if (step === "cart") setStep("delivery");
    else if (step === "delivery") {
      if (deliveryMethod === "home" && isDifferentCity) setStep("shipping");
      else setStep("payment");
    } else if (step === "shipping") setStep("payment");
    else if (step === "payment") placeOrder();
  };

  const goBack = () => {
    if (step === "cart") router.back();
    else if (step === "delivery") setStep("cart");
    else if (step === "shipping") setStep("delivery");
    else if (step === "payment") {
      if (isDifferentCity) setStep("shipping");
      else setStep("delivery");
    }
  };

  if (productItems.length === 0 && step !== "confirm") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>سلة المشتريات</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 56 }}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>السلة فارغة</Text>
          <Text style={[styles.emptySub, { color: colors.muted }]}>أضف منتجات من المتاجر للمتابعة</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.back()}>
            <Text style={styles.browseBtnText}>تصفح المتاجر</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable onPress={step === "confirm" ? () => {} : goBack} style={styles.backBtn}>
          {step !== "confirm" && <Feather name="chevron-right" size={24} color={colors.text} />}
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === "cart" ? "سلة المشتريات"
            : step === "delivery" ? "طريقة الاستلام"
            : step === "shipping" ? "طريقة الشحن"
            : step === "payment" ? "الدفع"
            : "تأكيد الطلب"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {step !== "confirm" && (
        <View style={[styles.stepsRow, { backgroundColor: isDark ? colors.surface : "#fff", borderBottomColor: colors.border }]}>
          {[
            { key: "cart", label: "السلة" },
            { key: "delivery", label: "التوصيل" },
            ...(isDifferentCity ? [{ key: "shipping", label: "الشحن" }] : []),
            { key: "payment", label: "الدفع" },
          ].map((s, i, arr) => {
            const sIdx = arr.findIndex((x) => x.key === step);
            const isActive = i <= sIdx;
            const isCurrent = s.key === step;
            return (
              <React.Fragment key={s.key}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, { backgroundColor: isActive ? "#C490D8" : isDark ? colors.surfaceAlt : "#EEE" }]}>
                    {isActive && !isCurrent
                      ? <Feather name="check" size={14} color="#fff" />
                      : <Text style={[styles.stepNum, { color: isActive ? "#fff" : colors.muted }]}>{i + 1}</Text>}
                  </View>
                  <Text style={[styles.stepLabel, { color: isCurrent ? "#C490D8" : isActive ? colors.text : colors.muted }]}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: i < sIdx ? "#C490D8" : colors.border }]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 100 }}>

        {/* ═══════════ STEP 1: CART ═══════════ */}
        {step === "cart" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              منتجات من {storeName}
            </Text>
            {productItems.map((item) => (
              <View key={item.id} style={[styles.cartItem, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
                <View style={[styles.cartItemEmoji, { backgroundColor: "#C490D810" }]}>
                  <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.cartItemName, { color: colors.text }]} numberOfLines={2}>{item.productName}</Text>
                  <Text style={[styles.cartItemPrice, { color: "#C490D8" }]}>{item.price} ر.س</Text>
                </View>
                <View style={styles.qtyRow}>
                  <Pressable
                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                    onPress={() => updateProductQty(item.id, item.qty + 1)}
                  >
                    <Feather name="plus" size={14} color="#C490D8" />
                  </Pressable>
                  <Text style={[styles.qtyText, { color: colors.text }]}>{item.qty}</Text>
                  <Pressable
                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                    onPress={() => updateProductQty(item.id, item.qty - 1)}
                  >
                    <Feather name="minus" size={14} color={colors.muted} />
                  </Pressable>
                </View>
                <Pressable onPress={() => removeProductFromCart(item.id)} style={{ padding: 6 }}>
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </Pressable>
              </View>
            ))}

            <View style={[styles.discountRow, { borderColor: discountApplied ? "#22C55E" : discountError ? "#EF4444" : colors.border }]}>
              <TextInput
                style={[styles.discountInput, { color: colors.text }]}
                placeholder="كود الخصم"
                placeholderTextColor={colors.muted}
                value={discountCode}
                onChangeText={(t) => { setDiscountCode(t.toUpperCase()); setDiscountError(""); setDiscountApplied(false); }}
                autoCapitalize="characters"
              />
              <Pressable
                style={[styles.discountApplyBtn, { backgroundColor: discountApplied ? "#22C55E" : "#C490D8" }]}
                onPress={() => {
                  if (!discountCode.trim()) { setDiscountError("أدخل كوداً"); return; }
                  const valid = ["AKSEER10", "WELCOME", "SHOP10", "FREESHIP", "SUPP30", "CARE25"];
                  if (valid.includes(discountCode)) { setDiscountApplied(true); }
                  else { setDiscountError("كود غير صالح"); }
                }}
              >
                <Text style={styles.discountApplyText}>{discountApplied ? "✓ تم" : "تطبيق"}</Text>
              </Pressable>
            </View>
            {discountError ? <Text style={styles.errorText}>{discountError}</Text> : null}
            {discountApplied ? <Text style={styles.successText}>🎉 تم تطبيق خصم 10%</Text> : null}

            <View style={[styles.summaryCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>المجموع</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>{productTotal} ر.س</Text>
              </View>
              {discountApplied && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#22C55E" }]}>خصم 10%</Text>
                  <Text style={[styles.summaryVal, { color: "#22C55E" }]}>- {discount} ر.س</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ═══════════ STEP 2: DELIVERY ═══════════ */}
        {step === "delivery" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر طريقة الاستلام</Text>

            <Pressable
              style={[styles.deliveryCard, { borderColor: deliveryMethod === "pickup" ? "#C490D8" : colors.border, backgroundColor: isDark ? colors.card : "#fff" }]}
              onPress={() => setDeliveryMethod("pickup")}
            >
              <View style={[styles.deliveryIcon, { backgroundColor: deliveryMethod === "pickup" ? "#C490D820" : (isDark ? colors.surface : "#F5F5F5") }]}>
                <Text style={{ fontSize: 28 }}>🏪</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.deliveryTitle, { color: colors.text }]}>الاستلام من المتجر</Text>
                <Text style={[styles.deliverySub, { color: colors.muted }]}>جاهز خلال 30 دقيقة • مجاني</Text>
                <View style={styles.deliveryBadge}>
                  <Text style={styles.deliveryBadgeText}>✓ أسرع طريقة</Text>
                </View>
              </View>
              <View style={[styles.radioOuter, { borderColor: deliveryMethod === "pickup" ? "#C490D8" : colors.muted }]}>
                {deliveryMethod === "pickup" && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            <Pressable
              style={[styles.deliveryCard, { borderColor: deliveryMethod === "home" ? "#C490D8" : colors.border, backgroundColor: isDark ? colors.card : "#fff" }]}
              onPress={() => setDeliveryMethod("home")}
            >
              <View style={[styles.deliveryIcon, { backgroundColor: deliveryMethod === "home" ? "#C490D820" : (isDark ? colors.surface : "#F5F5F5") }]}>
                <Text style={{ fontSize: 28 }}>🏠</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.deliveryTitle, { color: colors.text }]}>التوصيل للمنزل</Text>
                <Text style={[styles.deliverySub, { color: colors.muted }]}>45-60 دقيقة في الرياض</Text>
                <Text style={[styles.deliverySub, { color: colors.muted }]}>2-3 أيام لمدن أخرى</Text>
              </View>
              <View style={[styles.radioOuter, { borderColor: deliveryMethod === "home" ? "#C490D8" : colors.muted }]}>
                {deliveryMethod === "home" && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            {deliveryMethod === "home" && (
              <View style={{ gap: 10 }}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>المدينة</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: "row-reverse" }}>
                  {CITIES.map((city) => (
                    <Pressable
                      key={city}
                      onPress={() => setSelectedCity(city)}
                      style={[
                        styles.cityChip,
                        {
                          backgroundColor: selectedCity === city ? "#C490D8" : (isDark ? colors.card : "#F5F5F5"),
                          borderColor: selectedCity === city ? "#C490D8" : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.cityChipText, { color: selectedCity === city ? "#fff" : colors.text }]}>
                        {city}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {isDifferentCity && (
                  <View style={[styles.shippingNotice, { backgroundColor: "#F59E0B15", borderColor: "#F59E0B40" }]}>
                    <Feather name="info" size={14} color="#F59E0B" />
                    <Text style={[styles.shippingNoticeText, { color: "#F59E0B" }]}>
                      التوصيل لـ{selectedCity} يتطلب اختيار خدمة شحن
                    </Text>
                  </View>
                )}

                <Text style={[styles.fieldLabel, { color: colors.text }]}>العنوان التفصيلي</Text>
                <View style={[styles.inputBox, { backgroundColor: isDark ? colors.card : "#F5F5F5", borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="الحي، الشارع، رقم المبنى"
                    placeholderTextColor={colors.muted}
                    value={address}
                    onChangeText={setAddress}
                    textAlign="right"
                    multiline
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* ═══════════ STEP 3: SHIPPING ═══════════ */}
        {step === "shipping" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
            <View style={[styles.shippingDestBadge, { backgroundColor: "#C490D815", borderColor: "#C490D840" }]}>
              <Feather name="map-pin" size={14} color="#C490D8" />
              <Text style={[styles.shippingDestText, { color: "#C490D8" }]}>
                التوصيل إلى: {selectedCity}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر طريقة الشحن</Text>

            <Pressable
              style={[styles.shippingCard, { borderColor: shippingMethod === "express" ? "#F59E0B" : colors.border, backgroundColor: isDark ? colors.card : "#fff" }]}
              onPress={() => setShippingMethod("express")}
            >
              <View style={[styles.shippingIcon, { backgroundColor: shippingMethod === "express" ? "#F59E0B15" : (isDark ? colors.surface : "#FFF8E1") }]}>
                <Text style={{ fontSize: 28 }}>⚡</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.shippingTitle, { color: colors.text }]}>شحن سريع (يوم عمل)</Text>
                  <View style={[styles.shippingTagBadge, { backgroundColor: "#F59E0B" }]}>
                    <Text style={styles.shippingTagText}>موصى به</Text>
                  </View>
                </View>
                <Text style={[styles.shippingSub, { color: colors.muted }]}>يصلك غداً إذا طلبت قبل 3 م</Text>
                <Text style={[styles.shippingPrice, { color: "#F59E0B" }]}>75 ر.س</Text>
              </View>
              <View style={[styles.radioOuter, { borderColor: shippingMethod === "express" ? "#F59E0B" : colors.muted }]}>
                {shippingMethod === "express" && <View style={[styles.radioInner, { backgroundColor: "#F59E0B" }]} />}
              </View>
            </Pressable>

            <Pressable
              style={[styles.shippingCard, { borderColor: shippingMethod === "standard" ? "#3B82F6" : colors.border, backgroundColor: isDark ? colors.card : "#fff" }]}
              onPress={() => setShippingMethod("standard")}
            >
              <View style={[styles.shippingIcon, { backgroundColor: shippingMethod === "standard" ? "#3B82F615" : (isDark ? colors.surface : "#EFF6FF") }]}>
                <Text style={{ fontSize: 28 }}>📦</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.shippingTitle, { color: colors.text }]}>شحن عادي (2-3 أيام)</Text>
                <Text style={[styles.shippingSub, { color: colors.muted }]}>خدمة شحن الاقتصادية</Text>
                <Text style={[styles.shippingPrice, { color: "#3B82F6" }]}>35 ر.س</Text>
              </View>
              <View style={[styles.radioOuter, { borderColor: shippingMethod === "standard" ? "#3B82F6" : colors.muted }]}>
                {shippingMethod === "standard" && <View style={[styles.radioInner, { backgroundColor: "#3B82F6" }]} />}
              </View>
            </Pressable>

            <View style={[styles.summaryCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>قيمة الطلب</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>{subtotal} ر.س</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>رسوم الشحن</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>{shippingMethod === "express" ? 75 : 35} ر.س</Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══════════ STEP 4: PAYMENT ═══════════ */}
        {step === "payment" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
            <View style={[styles.orderSummaryBanner, { backgroundColor: isDark ? colors.card : "#F8F4FF", borderColor: "#C490D830" }]}>
              <View style={styles.orderSummaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  {deliveryMethod === "pickup" ? "🏪 استلام من المتجر" : `🚚 توصيل إلى ${selectedCity}`}
                </Text>
              </View>
              {deliveryMethod === "home" && address.length > 0 && (
                <Text style={[styles.addressPreview, { color: colors.muted }]}>{address}</Text>
              )}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>طريقة الدفع</Text>
            {PAYMENT_METHODS.map((pm) => (
              <Pressable
                key={pm.key}
                style={[styles.paymentCard, { borderColor: paymentMethod === pm.key ? "#C490D8" : colors.border, backgroundColor: isDark ? colors.card : "#fff" }]}
                onPress={() => setPaymentMethod(pm.key)}
              >
                <View style={[styles.paymentIcon, { backgroundColor: paymentMethod === pm.key ? "#C490D815" : (isDark ? colors.surface : "#F5F5F5") }]}>
                  <Feather name={pm.icon} size={20} color={paymentMethod === pm.key ? "#C490D8" : colors.muted} />
                </View>
                <Text style={[styles.paymentLabel, { color: colors.text }]}>{pm.label}</Text>
                <View style={[styles.radioOuter, { borderColor: paymentMethod === pm.key ? "#C490D8" : colors.muted }]}>
                  {paymentMethod === pm.key && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            ))}

            <View style={[styles.summaryCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>المنتجات</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>{productTotal} ر.س</Text>
              </View>
              {discountApplied && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#22C55E" }]}>خصم</Text>
                  <Text style={[styles.summaryVal, { color: "#22C55E" }]}>- {discount} ر.س</Text>
                </View>
              )}
              {(deliveryFee > 0 || shippingFee > 0) && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{isDifferentCity ? "الشحن" : "التوصيل"}</Text>
                  <Text style={[styles.summaryVal, { color: colors.text }]}>{deliveryFee + shippingFee} ر.س</Text>
                </View>
              )}
              {deliveryFee === 0 && shippingFee === 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#22C55E" }]}>{deliveryMethod === "pickup" ? "الاستلام" : "التوصيل"}</Text>
                  <Text style={[styles.summaryVal, { color: "#22C55E" }]}>مجاني</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>ضريبة 15%</Text>
                <Text style={[styles.summaryVal, { color: colors.text }]}>{tax} ر.س</Text>
              </View>
              <View style={[styles.summaryRow, styles.grandRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.grandLabel, { color: colors.text }]}>الإجمالي</Text>
                <Text style={styles.grandVal}>{grandTotal} ر.س</Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══════════ STEP 5: CONFIRM ═══════════ */}
        {step === "confirm" && (
          <View style={styles.confirmBox}>
            <LinearGradient
              colors={["#22C55E20", "#22C55E08"]}
              style={styles.confirmIconBg}
            >
              <Text style={{ fontSize: 64 }}>✅</Text>
            </LinearGradient>
            <Text style={[styles.confirmTitle, { color: colors.text }]}>تم تأكيد طلبك!</Text>
            <Text style={[styles.confirmSub, { color: colors.muted }]}>
              {deliveryMethod === "pickup"
                ? "🏪 طلبك جاهز للاستلام من المتجر خلال 30 دقيقة"
                : isDifferentCity
                ? `📦 سيصلك خلال ${shippingMethod === "express" ? "يوم عمل" : "2-3 أيام عمل"} إلى ${selectedCity}`
                : "🚚 طلبك في الطريق إليك خلال 45-60 دقيقة"}
            </Text>

            <View style={[styles.orderIdCard, { backgroundColor: isDark ? colors.card : "#F8F4FF", borderColor: "#C490D830" }]}>
              <Text style={[styles.orderIdLabel, { color: colors.muted }]}>رقم الطلب</Text>
              <Text style={[styles.orderIdVal, { color: "#C490D8" }]}>#{orderId?.slice(-6)}</Text>
            </View>

            <Pressable
              style={styles.trackBtn}
              onPress={() => { if (orderId) router.push(`/order/${orderId}` as any); }}
            >
              <Feather name="map-pin" size={18} color="#fff" />
              <Text style={styles.trackBtnText}>تتبع الطلب</Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryBtn, { borderColor: colors.border }]}
              onPress={() => router.push("/(tabs)/store" as any)}
            >
              <Feather name="shopping-bag" size={18} color="#C490D8" />
              <Text style={[styles.secondaryBtnText, { color: "#C490D8" }]}>مواصلة التسوق</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ─── BOTTOM CTA ─── */}
      {step !== "confirm" && (
        <View style={[styles.bottomCta, { backgroundColor: isDark ? colors.surface : "#fff", borderTopColor: colors.border, paddingBottom: isWeb ? 20 : insets.bottom + 10 }]}>
          {step === "cart" && (
            <View style={styles.bottomSummary}>
              <Text style={[styles.bottomTotal, { color: colors.text }]}>{subtotal} ر.س</Text>
              <Text style={[styles.bottomItems, { color: colors.muted }]}>{productItems.reduce((s, p) => s + p.qty, 0)} منتج</Text>
            </View>
          )}
          {step === "payment" && (
            <View style={styles.bottomSummary}>
              <Text style={[styles.bottomTotal, { color: colors.text }]}>{grandTotal} ر.س</Text>
              <Text style={[styles.bottomItems, { color: colors.muted }]}>الإجمالي مع الضريبة</Text>
            </View>
          )}
          <Pressable
            style={[styles.nextBtn, { flex: step === "delivery" || step === "shipping" ? 1 : undefined }]}
            onPress={goNext}
          >
            {step === "payment"
              ? <>
                  <Feather name="lock" size={16} color="#fff" />
                  <Text style={styles.nextBtnText}>ادفع {grandTotal} ر.س</Text>
                </>
              : <>
                  <Text style={styles.nextBtnText}>
                    {step === "cart" ? "اختر طريقة الاستلام"
                      : step === "delivery" ? "متابعة"
                      : step === "shipping" ? "متابعة للدفع"
                      : "متابعة"}
                  </Text>
                  <Feather name="arrow-left" size={16} color="#fff" />
                </>}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },

  stepsRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 6, borderBottomWidth: 1 },
  stepItem: { alignItems: "center", gap: 4 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  stepLabel: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  stepLine: { flex: 1, height: 2, borderRadius: 2, marginBottom: 16 },

  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 30 },
  emptyTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  emptySub: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  browseBtn: { backgroundColor: "#C490D8", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 16, marginTop: 8 },
  browseBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },

  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  fieldLabel: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },

  cartItem: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 16, padding: 12, borderWidth: 1 },
  cartItemEmoji: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cartItemName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  cartItemPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  qtyRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 15, fontFamily: "Cairo_700Bold", minWidth: 20, textAlign: "center" },

  discountRow: { flexDirection: "row-reverse", alignItems: "center", borderRadius: 14, borderWidth: 1.5, overflow: "hidden" },
  discountInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  discountApplyBtn: { paddingHorizontal: 18, paddingVertical: 13, alignItems: "center", justifyContent: "center" },
  discountApplyText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  errorText: { color: "#EF4444", fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  successText: { color: "#22C55E", fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right" },

  summaryCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  summaryRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  summaryVal: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  grandRow: { borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
  grandLabel: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  grandVal: { fontSize: 18, fontFamily: "Cairo_700Bold", color: "#C490D8" },

  deliveryCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 18, padding: 16, borderWidth: 1.5 },
  deliveryIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  deliveryTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  deliverySub: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  deliveryBadge: { backgroundColor: "#22C55E20", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start" },
  deliveryBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold", color: "#22C55E" },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#C490D8" },

  cityChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  cityChipText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  shippingNotice: { flexDirection: "row-reverse", gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  shippingNoticeText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_500Medium", textAlign: "right" },
  inputBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  input: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Tajawal_400Regular", minHeight: 60 },

  shippingDestBadge: { flexDirection: "row-reverse", gap: 8, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center" },
  shippingDestText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  shippingCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 18, padding: 16, borderWidth: 1.5 },
  shippingIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  shippingTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  shippingSub: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  shippingPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  shippingTagBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  shippingTagText: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },

  orderSummaryBanner: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 6 },
  orderSummaryRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  addressPreview: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  paymentCard: { flexDirection: "row-reverse", alignItems: "center", gap: 14, borderRadius: 16, padding: 16, borderWidth: 1.5 },
  paymentIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  paymentLabel: { flex: 1, fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },

  confirmBox: { alignItems: "center", paddingTop: 36, paddingHorizontal: 20, gap: 14 },
  confirmIconBg: { width: 120, height: 120, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  confirmTitle: { fontSize: 26, fontFamily: "Cairo_700Bold" },
  confirmSub: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "center", lineHeight: 22 },
  orderIdCard: { borderRadius: 16, padding: 16, borderWidth: 1, alignItems: "center", width: "100%", gap: 4 },
  orderIdLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  orderIdVal: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  trackBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#C490D8", paddingVertical: 16, borderRadius: 16, width: "100%" },
  trackBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  secondaryBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1, width: "100%" },
  secondaryBtnText: { fontSize: 16, fontFamily: "Tajawal_700Bold" },

  bottomCta: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderTopWidth: 1 },
  bottomSummary: { flex: 1 },
  bottomTotal: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  bottomItems: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  nextBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#A86DBF", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 16 },
  nextBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
