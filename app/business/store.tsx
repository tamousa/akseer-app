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

I18nManager.forceRTL(true);

export default function BusinessStore() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const STORE_SECTIONS = [
    { key: "products",  label: t("المنتجات والعروض والباقات", "Products, Offers & Packages"), icon: "package"       as const, color: "#7C3AED", bg: "#EDE9FE", badge: t("24 منتج",  "24 Products"), desc: t("إدارة المنتجات والعروض الترويجية وباقات الخدمات",   "Manage products, promotions and service packages"),                route: "/business/products" },
    { key: "orders",    label: t("الطلبات",                   "Orders"),                       icon: "shopping-cart" as const, color: "#059669", bg: "#D1FAE5", badge: t("3 جديد",   "3 New"),       desc: t("متابعة وإدارة طلبات العملاء",                       "Track and manage customer orders"),                                route: "/business/orders"   },
    { key: "shipping",  label: t("الشحن والتوصيل",            "Shipping & Delivery"),          icon: "truck"         as const, color: "#2563EB", bg: "#DBEAFE", badge: "",                           desc: t("إعداد طرق الشحن والتوصيل والأسعار",                 "Configure shipping methods, delivery and prices"),                route: "/business/shipping" },
    { key: "schedule",  label: t("مواعيد العمل والفروع",      "Working Hours & Branches"),      icon: "clock"         as const, color: "#D97706", bg: "#FEF3C7", badge: t("2 فرع",    "2 Branches"),  desc: t("جدولة أوقات العمل وإدارة الفروع",                    "Schedule working hours and manage branches"),                     route: "/business/schedule" },
    { key: "staff",     label: t("حسابات مدراء المتجر",       "Store Manager Accounts"),        icon: "users"         as const, color: "#7C3AED", bg: "#EDE9FE", badge: t("4 مدراء",  "4 Managers"),  desc: t("إضافة وإدارة صلاحيات فريق العمل",                   "Add and manage team permissions"),                                route: "/business/staff"    },
    { key: "inventory", label: t("المخزون",                   "Inventory"),                    icon: "archive"       as const, color: "#DC2626", bg: "#FEE2E2", badge: t("5 منخفض",  "5 Low Stock"), desc: t("مراقبة المخزون وتنبيهات النفاد",                     "Monitor inventory and low-stock alerts"),                         route: "/business/inventory"},
    { key: "reviews",   label: t("الأسئلة والتقييمات",        "Questions & Reviews"),           icon: "message-square"as const, color: "#EC4899", bg: "#FCE7F3", badge: t("8 جديد",   "8 New"),       desc: t("استعراض والرد على تقييمات وأسئلة العملاء",          "View and respond to customer reviews and questions"),             route: "/business/reviews"  },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding + 16, paddingBottom: 90 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t("إدارة المتجر", "Manage Store")}</Text>
        <Pressable
          style={[styles.previewBtn, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE", borderColor: "#7C3AED50" }]}
          onPress={() => router.push("/business/store-preview" as any)}
        >
          <Feather name="eye" size={14} color="#7C3AED" />
          <Text style={[styles.previewBtnText, { color: "#7C3AED" }]}>{t("معاينة المتجر", "Preview Store")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {STORE_SECTIONS.map((section) => (
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
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>{section.label}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 20 },
  pageTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  previewBtn: { flexDirection: "row-reverse", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  previewBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  sectionCard: { borderRadius: 18, padding: 16, borderWidth: 1 },
  sectionCardInner: { flexDirection: "row-reverse", alignItems: "center", gap: 14 },
  sectionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sectionTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  sectionLabel: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sectionDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
});
