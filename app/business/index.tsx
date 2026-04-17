import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { LangToggle } from "@/components/LangToggle";

I18nManager.forceRTL(true);

export default function BusinessHome() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const STATS = [
    { label: t("الطلبات اليوم",   "Today's Orders"),  value: "12",    change: "+3",   icon: "shopping-cart" as const, color: "#7C3AED" },
    { label: t("الإيرادات (ريال)", "Revenue (SAR)"),   value: "2,840", change: "+18%", icon: "trending-up"   as const, color: "#059669" },
    { label: t("العملاء الجدد",    "New Customers"),   value: "5",     change: "+2",   icon: "user-plus"     as const, color: "#D97706" },
    { label: t("التقييم العام",    "Overall Rating"),  value: "4.8",   change: "★",    icon: "star"          as const, color: "#EC4899" },
  ];

  const QUICK_ACTIONS = [
    { label: t("إضافة منتج", "Add Product"), icon: "plus-circle"  as const, color: "#7C3AED", bg: "#EDE9FE", route: "/business/products" },
    { label: t("الطلبات",    "Orders"),      icon: "shopping-cart" as const, color: "#059669", bg: "#D1FAE5", route: "/business/orders"   },
    { label: t("نقطة البيع", "Point of Sale"),icon: "monitor"      as const, color: "#D97706", bg: "#FEF3C7", route: "/business/pos"      },
    { label: t("التقارير",   "Reports"),     icon: "bar-chart-2"  as const, color: "#2563EB", bg: "#DBEAFE", route: "/business/reports"  },
  ];

  const RECENT_ORDERS = [
    { id: "#1042", customer: "أحمد الغامدي",    product: "فيتامين C 1000mg",    status: t("جديد",          "New"),        statusColor: "#7C3AED", statusBg: "#EDE9FE", amount: "89 SAR",  time: t("منذ 5 دقائق",  "5 min ago") },
    { id: "#1041", customer: "سارة المطيري",    product: "جلسة مساج ظهر",       status: t("قيد التنفيذ",   "In Progress"), statusColor: "#D97706", statusBg: "#FEF3C7", amount: "220 SAR", time: t("منذ 40 دقيقة", "40 min ago") },
    { id: "#1040", customer: "منيرة القحطاني",  product: "باقة تجميل شهرية",    status: t("مكتمل",         "Completed"),  statusColor: "#059669", statusBg: "#D1FAE5", amount: "650 SAR", time: t("منذ 2 ساعة",   "2 hrs ago") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <LangToggle color="#7C3AED" bg={isDark ? "#1E1535" : "#EDE9FE"} />
        <View style={styles.headerCenter}>
          <Text style={[styles.greeting, { color: isDark ? "#BBA8D8" : "#7C5FA8" }]}>{t("مرحباً،", "Hello,")}</Text>
          <Text style={[styles.storeName, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("متجر الصحة النقية", "Pure Health Store")}</Text>
        </View>
        <View style={[styles.notifBtn, { backgroundColor: isDark ? "#1E1535" : "#EDE9FE" }]}>
          <Feather name="bell" size={20} color="#7C3AED" />
          <View style={styles.notifDot} />
        </View>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: "#6D28D9" }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>{t("مرحباً بك في لوحة التحكم", "Welcome to Your Dashboard")}</Text>
          <Text style={styles.heroSub}>{t("حسابك نشط ✓  |  المتجر: متجر (مُعتمد)", "Account Active ✓  |  Store: Store (Verified)")}</Text>
        </View>
        <View style={styles.heroIconWrap}>
          <Feather name="activity" size={40} color="#ffffff40" />
        </View>
      </View>

      <View style={styles.statsGrid}>
        {STATS.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
              <Feather name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: isDark ? "#fff" : "#1A0A33" }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
            <Text style={[styles.statChange, { color: s.color }]}>{s.change}</Text>
          </View>
        ))}
      </View>

      <Pressable style={[styles.previewStoreBtn, { backgroundColor: "#4C1D95", borderColor: "#7C3AED50" }]}
        onPress={() => router.push("/business/store-preview" as any)}>
        <Feather name="eye" size={16} color="#C4B5FD" />
        <Text style={styles.previewStoreBtnText}>{t("معاينة كيف يظهر متجرك للعملاء في أكسير", "Preview how your store appears to customers in Akseer")}</Text>
        <Feather name="chevron-left" size={16} color="#A78BFA" />
      </Pressable>

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#1A0A33", marginHorizontal: 20 }]}>{t("إجراءات سريعة", "Quick Actions")}</Text>
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((a, i) => (
          <Pressable key={i} style={[styles.quickCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}
            onPress={() => router.push(a.route as any)}>
            <View style={[styles.quickIcon, { backgroundColor: isDark ? a.color + "25" : a.bg }]}>
              <Feather name={a.icon} size={22} color={a.color} />
            </View>
            <Text style={[styles.quickLabel, { color: isDark ? "#D4C5F0" : "#3D2B6B" }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("آخر الطلبات", "Recent Orders")}</Text>
        <Pressable onPress={() => router.push("/business/orders" as any)}>
          <Text style={[styles.seeAll, { color: "#7C3AED" }]}>{t("عرض الكل", "View All")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {RECENT_ORDERS.map((order, i) => (
          <View key={i} style={[styles.orderCard, { backgroundColor: isDark ? "#1A1030" : "#FFFFFF", borderColor: isDark ? "#2A1F45" : "#EDE9FE" }]}>
            <View style={styles.orderTop}>
              <View style={[styles.orderStatus, { backgroundColor: order.statusBg }]}>
                <Text style={[styles.orderStatusText, { color: order.statusColor }]}>{order.status}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderId, { color: colors.muted }]}>{order.id}  ·  {order.time}</Text>
                <Text style={[styles.orderCustomer, { color: isDark ? "#fff" : "#1A0A33" }]}>{order.customer}</Text>
              </View>
            </View>
            <View style={styles.orderBottom}>
              <Text style={[styles.orderAmount, { color: "#7C3AED" }]}>{order.amount}</Text>
              <Text style={[styles.orderProduct, { color: colors.muted }]}>{order.product}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  avatarCircle: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1 },
  greeting: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  storeName: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  notifBtn: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", position: "absolute", top: 8, right: 8 },
  heroBanner: { marginHorizontal: 20, borderRadius: 20, padding: 20, flexDirection: "row-reverse", alignItems: "center", marginBottom: 20, overflow: "hidden" },
  heroTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", color: "#fff", marginBottom: 6 },
  heroSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", color: "#DBBFFF" },
  heroIconWrap: { marginRight: 8 },
  previewStoreBtn: { flexDirection: "row-reverse", gap: 10, alignItems: "center", marginHorizontal: 20, marginBottom: 20, padding: 14, borderRadius: 16, borderWidth: 1 },
  previewStoreBtnText: { flex: 1, fontSize: 13, fontFamily: "Tajawal_500Medium", color: "#C4B5FD", textAlign: "right" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 12, marginBottom: 24 },
  statCard: { width: "47%", borderRadius: 18, padding: 16, borderWidth: 1, gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  statValue: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  statChange: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", marginBottom: 14 },
  quickGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 14, gap: 12, marginBottom: 24 },
  quickCard: { width: "47%", borderRadius: 18, padding: 16, alignItems: "center", gap: 10, borderWidth: 1 },
  quickIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  sectionRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  orderCard: { borderRadius: 16, padding: 14, borderWidth: 1, gap: 10 },
  orderTop: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 10 },
  orderStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  orderStatusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  orderId: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginBottom: 2 },
  orderCustomer: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  orderBottom: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  orderAmount: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  orderProduct: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
});
