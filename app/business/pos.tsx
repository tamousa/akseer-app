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

const CATALOG = [
  { id: 1, name: "فيتامين C 1000mg", price: 89,  emoji: "💊" },
  { id: 2, name: "بروتين واي 2kg",   price: 249, emoji: "🥛" },
  { id: 3, name: "زيت أرجان",        price: 129, emoji: "🫙" },
  { id: 4, name: "ماء الورد",        price: 45,  emoji: "🌸" },
  { id: 5, name: "أوميغا 3",         price: 115, emoji: "🐟" },
  { id: 6, name: "كريم ترطيب",       price: 65,  emoji: "🧴" },
];

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number };

export default function POSPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payMethod, setPayMethod] = useState("card");
  const { t } = useLanguage();

  const PAYMENT_METHODS = [
    { key: "card",  label: t("بطاقة",   "Card")      },
    { key: "mada",  label: t("مدى",     "Mada")      },
    { key: "apple", label: t("أبل باي", "Apple Pay") },
    { key: "cash",  label: t("نقداً",   "Cash")      },
  ];

  const addToCart = (item: typeof CATALOG[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing && existing.qty > 1) return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter((c) => c.id !== id);
    });
  };

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const vat = Math.round(total * 0.15);
  const grandTotal = total + vat;

  const checkout = () => {
    if (cart.length === 0) { Alert.alert(t("السلة فارغة","Cart Empty"), t("أضف منتجات للسلة أولاً","Add products to cart first")); return; }
    Alert.alert(t("تأكيد الدفع","Confirm Payment"), `${t("المبلغ الإجمالي","Total")}: ${grandTotal} SAR\n${t("طريقة الدفع","Payment")}: ${PAYMENT_METHODS.find((p) => p.key === payMethod)?.label}`, [
      { text: t("إلغاء","Cancel"), style: "cancel" },
      { text: t("تأكيد","Confirm"), onPress: () => { Alert.alert(t("تم الدفع ✓","Payment Done ✓"), t("تمت العملية بنجاح! جاري طباعة الفاتورة...","Transaction completed! Printing receipt...")); setCart([]); } },
    ]);
  };

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}>
      <ScrollView contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 240 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
          </Pressable>
          <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("نقطة البيع","Point of Sale")}</Text>
          <View style={[styles.cartBadgeWrap, { backgroundColor: "#7C3AED20" }]}>
            <Feather name="shopping-cart" size={18} color="#7C3AED" />
            {cart.length > 0 && <View style={styles.cartDot}><Text style={styles.cartDotText}>{cart.reduce((a, c) => a + c.qty, 0)}</Text></View>}
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t("المنتجات","Products")}</Text>
        <View style={styles.catalogGrid}>
          {CATALOG.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <Pressable key={item.id} style={[styles.catalogItem, { backgroundColor: inCart ? "#7C3AED10" : cardBg, borderColor: inCart ? "#7C3AED" : cardBorder }]}
                onPress={() => addToCart(item)}>
                <Text style={styles.catalogEmoji}>{item.emoji}</Text>
                <Text style={[styles.catalogName, { color: isDark ? "#fff" : "#1A0A33" }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.catalogPrice, { color: "#7C3AED" }]}>{item.price} SAR</Text>
                {inCart && (
                  <View style={[styles.qtyBubble, { backgroundColor: "#7C3AED" }]}>
                    <Text style={styles.qtyText}>{inCart.qty}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.cartPanel, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
        {cart.length > 0 && (
          <ScrollView style={{ maxHeight: 100 }} showsVerticalScrollIndicator={false}>
            {cart.map((c) => (
              <View key={c.id} style={styles.cartRow}>
                <Text style={[styles.cartItemPrice, { color: "#7C3AED" }]}>{c.price * c.qty} SAR</Text>
                <View style={styles.qtyControls}>
                  <Pressable style={[styles.qtyBtn, { backgroundColor: "#7C3AED20" }]} onPress={() => removeFromCart(c.id)}>
                    <Feather name="minus" size={12} color="#7C3AED" />
                  </Pressable>
                  <Text style={[styles.qtyNum, { color: isDark ? "#fff" : "#1A0A33" }]}>{c.qty}</Text>
                  <Pressable style={[styles.qtyBtn, { backgroundColor: "#7C3AED20" }]} onPress={() => addToCart(c)}>
                    <Feather name="plus" size={12} color="#7C3AED" />
                  </Pressable>
                </View>
                <Text style={[styles.cartItemName, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]} numberOfLines={1}>{c.emoji} {c.name}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.totalsRow}>
          <Text style={[styles.totalFinal, { color: isDark ? "#fff" : "#1A0A33" }]}>{grandTotal} SAR</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.totalLine}>
              <Text style={[styles.totalLabel, { color: colors.muted }]}>{total} SAR</Text>
              <Text style={[styles.totalLabel, { color: colors.muted }]}>{t("المجموع:","Subtotal:")}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={[styles.totalLabel, { color: colors.muted }]}>{vat} SAR</Text>
              <Text style={[styles.totalLabel, { color: colors.muted }]}>{t("الضريبة 15%:","VAT 15%:")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.payMethodsRow}>
          {PAYMENT_METHODS.map((m) => (
            <Pressable key={m.key} style={[styles.payMethodBtn, { borderColor: payMethod === m.key ? "#7C3AED" : cardBorder, backgroundColor: payMethod === m.key ? "#7C3AED" : isDark ? "#2A1F45" : "#F3F0FF" }]}
              onPress={() => setPayMethod(m.key)}>
              <Text style={[styles.payMethodText, { color: payMethod === m.key ? "#fff" : colors.muted }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={[styles.checkoutBtn, { backgroundColor: cart.length > 0 ? "#6D28D9" : "#9CA3AF" }]} onPress={checkout}>
          <Feather name="check-circle" size={18} color="#fff" />
          <Text style={styles.checkoutText}>{t("إتمام الدفع","Complete Payment")} — {grandTotal} SAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  cartBadgeWrap: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cartDot: { position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center" },
  cartDotText: { fontSize: 9, color: "#fff", fontFamily: "Tajawal_700Bold" },
  sectionLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium", paddingHorizontal: 16, marginBottom: 10 },
  catalogGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  catalogItem: { width: "30%", borderRadius: 16, padding: 12, alignItems: "center", gap: 6, borderWidth: 1.5 },
  catalogEmoji: { fontSize: 28 },
  catalogName: { fontSize: 11, fontFamily: "Tajawal_500Medium", textAlign: "center" },
  catalogPrice: { fontSize: 13, fontFamily: "Cairo_700Bold" },
  qtyBubble: { position: "absolute", top: 6, left: 6, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 11, color: "#fff", fontFamily: "Cairo_700Bold" },
  cartPanel: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, padding: 14, gap: 10 },
  cartRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 6 },
  cartItemName: { flex: 1, fontSize: 12, fontFamily: "Tajawal_500Medium" },
  qtyControls: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  qtyBtn: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  qtyNum: { fontSize: 14, fontFamily: "Cairo_700Bold", width: 20, textAlign: "center" },
  cartItemPrice: { fontSize: 13, fontFamily: "Cairo_700Bold", minWidth: 50, textAlign: "right" },
  totalsRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  totalLine: { flexDirection: "row-reverse", justifyContent: "space-between" },
  totalLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  totalFinal: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  payMethodsRow: { flexDirection: "row-reverse", gap: 8 },
  payMethodBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center", borderWidth: 1 },
  payMethodText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  checkoutBtn: { borderRadius: 16, paddingVertical: 16, flexDirection: "row-reverse", gap: 10, alignItems: "center", justifyContent: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
});
