import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  I18nManager,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

export default function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { invoices } = useCart();

  const topPadding = isWeb ? 67 : insets.top;
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Feather name="file-text" size={48} color={colors.muted} />
        <Text style={[styles.notFoundText, { color: colors.muted }]}>لم يتم العثور على الفاتورة</Text>
        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={{ color: "#C490D8", fontSize: 16, fontFamily: "Tajawal_700Bold" }}>رجوع</Text>
        </Pressable>
      </View>
    );
  }

  const invoiceDate = new Date(invoice.date);
  const formattedDate = invoiceDate.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  const formattedTime = invoiceDate.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>الفاتورة</Text>
        <Pressable onPress={() => Alert.alert("مشاركة", "سيتم مشاركة الفاتورة")}>
          <Feather name="share-2" size={20} color={colors.muted} />
        </Pressable>
      </View>

      <View style={[styles.invoiceCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
        <View style={styles.invoiceHeader}>
          <View style={styles.logoRow}>
            <View style={[styles.logoBg, { backgroundColor: isDark ? "#1C1330" : "#F9EFF5" }]}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoImg} resizeMode="contain" />
            </View>
            <View>
              <Text style={[styles.appName, { color: colors.text }]}>اكسير</Text>
              <Text style={[styles.appSub, { color: colors.muted }]}>الصحة والعناية والجمال</Text>
            </View>
          </View>

          <View style={[styles.paidBadge]}>
            <Feather name="check-circle" size={14} color="#22C55E" />
            <Text style={styles.paidText}>مدفوعة</Text>
          </View>
        </View>

        <View style={[styles.divider, { borderColor: colors.border }]} />

        <View style={styles.invoiceMeta}>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.muted }]}>رقم الفاتورة</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>INV-{invoice.id.slice(-6)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.muted }]}>التاريخ</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{formattedDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.muted }]}>الوقت</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{formattedTime}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.muted }]}>مزود الخدمة</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{invoice.providerName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: colors.muted }]}>الرقم الضريبي</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>310456789012345</Text>
          </View>
        </View>

        <View style={[styles.divider, { borderColor: colors.border }]} />

        <Text style={[styles.itemsTitle, { color: colors.text }]}>بنود الخدمات</Text>

        <View style={[styles.tableHeader, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
          <Text style={[styles.thText, { color: colors.muted, flex: 2 }]}>الخدمة</Text>
          <Text style={[styles.thText, { color: colors.muted, flex: 1 }]}>التاريخ</Text>
          <Text style={[styles.thText, { color: colors.muted, width: 70 }]}>السعر</Text>
        </View>

        {invoice.items.map((item, idx) => (
          <View key={idx} style={[styles.tableRow, { borderColor: colors.border }]}>
            <View style={{ flex: 2 }}>
              <Text style={[styles.tdName, { color: colors.text }]}>{item.serviceName}</Text>
              <Text style={[styles.tdSub, { color: colors.muted }]}>{item.time}</Text>
            </View>
            <Text style={[styles.tdText, { color: colors.textSecondary, flex: 1 }]}>{item.date}</Text>
            <Text style={[styles.tdPrice, { width: 70 }]}>{item.price} ر.س</Text>
          </View>
        ))}

        <View style={[styles.divider, { borderColor: colors.border }]} />

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>المجموع الفرعي</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{invoice.subtotal} ر.س</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>ضريبة القيمة المضافة (15%)</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{invoice.tax} ر.س</Text>
          </View>
          <View style={[styles.totalRow, styles.grandRow]}>
            <Text style={[styles.grandLabel, { color: colors.text }]}>الإجمالي</Text>
            <Text style={styles.grandValue}>{invoice.total} ر.س</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.policyLink]}
        onPress={() => Alert.alert("سياسة الاسترجاع وإلغاء الطلب",
          "• يمكن إلغاء الحجز مجاناً قبل 24 ساعة من الموعد\n• الإلغاء خلال 24 ساعة يخضع لرسوم 25%\n• لا يمكن الاسترجاع بعد تنفيذ الخدمة\n• للاستفسارات: support@akseer.sa"
        )}
      >
        <Feather name="info" size={14} color="#C490D8" />
        <Text style={styles.policyText}>سياسة الاسترجاع وإلغاء الطلب</Text>
      </Pressable>

      <View style={styles.actionButtons}>
        <Pressable style={styles.bookingsBtn} onPress={() => router.push("/bookings" as any)}>
          <Feather name="calendar" size={18} color="#fff" />
          <Text style={styles.bookingsBtnText}>عرض حجوزاتي</Text>
        </Pressable>

        <Pressable style={[styles.homeBtn, { borderColor: colors.border }]} onPress={() => router.push("/(tabs)" as any)}>
          <Feather name="home" size={18} color="#C490D8" />
          <Text style={[styles.homeBtnText, { color: "#C490D8" }]}>الرئيسية</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16, fontFamily: "Tajawal_500Medium", marginTop: 12 },
  backLink: { marginTop: 16 },
  invoiceCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, borderWidth: 1 },
  invoiceHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  logoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  logoBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  logoImg: { width: 28, height: 28 },
  appName: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  appSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  paidBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "#22C55E" + "15", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  paidText: { color: "#22C55E", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  divider: { borderBottomWidth: 1, marginVertical: 16 },
  invoiceMeta: { gap: 10 },
  metaRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  metaLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  metaValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  itemsTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 12 },
  tableHeader: { flexDirection: "row-reverse", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginBottom: 4 },
  thText: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tableRow: { flexDirection: "row-reverse", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 0.5, alignItems: "center" },
  tdName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  tdSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  tdText: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  tdPrice: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#C490D8", textAlign: "left" },
  totalsSection: { gap: 8 },
  totalRow: { flexDirection: "row-reverse", justifyContent: "space-between" },
  totalLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  totalValue: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  grandRow: { borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.15)", paddingTop: 12, marginTop: 4 },
  grandLabel: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  grandValue: { fontSize: 18, fontFamily: "Tajawal_700Bold", color: "#C490D8" },
  policyLink: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, marginHorizontal: 20 },
  policyText: { color: "#C490D8", fontSize: 13, fontFamily: "Tajawal_500Medium", textDecorationLine: "underline" },
  actionButtons: { paddingHorizontal: 20, marginTop: 20, gap: 10 },
  bookingsBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#A86DBF", paddingVertical: 16, borderRadius: 16 },
  bookingsBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  homeBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  homeBtnText: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
});
