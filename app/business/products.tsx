import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ProductsPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const TABS = [t("منتجات", "Products"), t("عروض", "Offers"), t("باقات", "Packages")];

  const PRODUCTS = [
    { id: 1, name: "فيتامين C 1000mg",   category: t("مكملات", "Supplements"), price: "89",  stock: 45, status: t("نشط",     "Active"),    statusColor: "#059669", img: "💊" },
    { id: 2, name: "بروتين واي 2kg",      category: t("رياضة",  "Sports"),      price: "249", stock: 12, status: t("نشط",     "Active"),    statusColor: "#059669", img: "🥛" },
    { id: 3, name: "زيت أرجان طبيعي",     category: t("جمال",   "Beauty"),      price: "129", stock: 3,  status: t("منخفض",   "Low Stock"), statusColor: "#D97706", img: "🫙" },
    { id: 4, name: "كريم ترطيب اليد",     category: t("عناية",  "Care"),        price: "65",  stock: 0,  status: t("نفد",     "Out"),       statusColor: "#DC2626", img: "🧴" },
  ];

  const OFFERS = [
    { id: 1, name: t("خصم رمضان 20%",       "Ramadan 20% Off"),     type: t("نسبة",  "Percent"), value: "20%",       ends: "30 Apr",  products: 8, status: t("نشط",     "Active"),  statusColor: "#059669" },
    { id: 2, name: t("اشتر 2 احصل على 1",   "Buy 2 Get 1"),         type: t("هدية",  "Gift"),    value: "—",         ends: "15 May",  products: 3, status: t("نشط",     "Active"),  statusColor: "#059669" },
    { id: 3, name: t("تخفيض المخزون",        "Clearance Sale"),      type: t("ثابت",  "Fixed"),   value: "30 SAR",    ends: t("انتهى","Ended"),    products: 5, status: t("منتهي",  "Expired"), statusColor: "#6B7280" },
  ];

  const PACKAGES = [
    { id: 1, name: t("باقة الصحة الشاملة",  "Comprehensive Health Package"), items: 5, price: "399", originalPrice: "520", status: t("نشط", "Active"), statusColor: "#059669" },
    { id: 2, name: t("باقة التجميل الشهرية","Monthly Beauty Package"),        items: 4, price: "650", originalPrice: "800", status: t("نشط", "Active"), statusColor: "#059669" },
  ];

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("المنتجات والعروض والباقات", "Products, Offers & Packages")}</Text>
        <Pressable style={styles.addBtn} onPress={() => Alert.alert(t("إضافة", "Add"), `${t("إضافة", "Add")} ${TABS[activeTab]}`)}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={[styles.tabRow, { backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}>
        {TABS.map((tab, i) => (
          <Pressable key={i} style={[styles.tabBtn, activeTab === i && { backgroundColor: "#7C3AED" }]}
            onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabText, { color: activeTab === i ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Feather name="search" size={16} color={colors.muted} />
        <TextInput placeholder={`${t("ابحث في", "Search in")} ${TABS[activeTab]}...`} placeholderTextColor={colors.muted}
          value={search} onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]} textAlign="right" />
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {activeTab === 0 && PRODUCTS.map((p) => (
          <Pressable key={p.id} style={[styles.productCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(p.name, `${t("السعر","Price")}: ${p.price} SAR\n${t("المخزون","Stock")}: ${p.stock}\n${t("الفئة","Category")}: ${p.category}`)}>
            <View style={styles.productActions}>
              <Pressable onPress={() => Alert.alert(t("خيارات","Options"), `${t("تعديل أو حذف","Edit or Delete")}: ${p.name}`)}
                style={[styles.actionBtn, { backgroundColor: isDark ? "#2A1F45" : "#F3F0FF" }]}>
                <Feather name="more-horizontal" size={16} color="#7C3AED" />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.productTop}>
                <View style={[styles.stockBadge, { backgroundColor: p.statusColor + "20" }]}>
                  <Text style={[styles.stockText, { color: p.statusColor }]}>{p.status}  ·  {p.stock}</Text>
                </View>
                <Text style={[styles.productName, { color: isDark ? "#fff" : "#1A0A33" }]}>{p.name}</Text>
              </View>
              <Text style={[styles.productCat, { color: colors.muted }]}>{p.category}</Text>
            </View>
            <View style={styles.productRight}>
              <Text style={styles.productEmoji}>{p.img}</Text>
              <Text style={[styles.productPrice, { color: "#7C3AED" }]}>{p.price} SAR</Text>
            </View>
          </Pressable>
        ))}

        {activeTab === 1 && OFFERS.map((o) => (
          <Pressable key={o.id} style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(o.name, `${t("النوع","Type")}: ${o.type}\n${t("المنتجات المشمولة","Included Products")}: ${o.products}\n${t("تنتهي","Ends")}: ${o.ends}`)}>
            <View style={styles.offerRow}>
              <Feather name="chevron-left" size={16} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <View style={styles.offerTop}>
                  <View style={[styles.offerStatus, { backgroundColor: o.statusColor + "20" }]}>
                    <Text style={[styles.offerStatusText, { color: o.statusColor }]}>{o.status}</Text>
                  </View>
                  <Text style={[styles.offerName, { color: isDark ? "#fff" : "#1A0A33" }]}>{o.name}</Text>
                </View>
                <Text style={[styles.offerMeta, { color: colors.muted }]}>
                  {o.type}  ·  {o.value}  ·  {o.products} {t("منتج","products")}  ·  {o.ends}
                </Text>
              </View>
              <View style={[styles.offerTag, { backgroundColor: "#7C3AED20" }]}>
                <Feather name="tag" size={18} color="#7C3AED" />
              </View>
            </View>
          </Pressable>
        ))}

        {activeTab === 2 && PACKAGES.map((pkg) => (
          <Pressable key={pkg.id} style={[styles.pkgCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => Alert.alert(pkg.name, `${t("السعر","Price")}: ${pkg.price} SAR\n${t("السعر الأصلي","Original")}: ${pkg.originalPrice} SAR\n${t("المنتجات","Items")}: ${pkg.items}`)}>
            <View style={styles.pkgRow}>
              <Feather name="chevron-left" size={16} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.pkgName, { color: isDark ? "#fff" : "#1A0A33" }]}>{pkg.name}</Text>
                <Text style={[styles.pkgMeta, { color: colors.muted }]}>{pkg.items} {t("عناصر","items")}</Text>
                <View style={styles.pkgPriceRow}>
                  <Text style={[styles.pkgOriginal, { color: colors.muted }]}>{pkg.originalPrice} SAR</Text>
                  <Text style={[styles.pkgPrice, { color: "#7C3AED" }]}>{pkg.price} SAR</Text>
                </View>
              </View>
              <View style={[styles.pkgIcon, { backgroundColor: "#7C3AED20" }]}>
                <Feather name="box" size={20} color="#7C3AED" />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  addBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 16, borderRadius: 14, padding: 4, marginBottom: 14 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  searchBar: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 14, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  productCard: { borderRadius: 16, padding: 14, borderWidth: 1, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  productRight: { alignItems: "center", gap: 6 },
  productEmoji: { fontSize: 28 },
  productPrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  productActions: {},
  actionBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  productTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  productName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  productCat: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  stockText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  offerCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  offerRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  offerTag: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  offerTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  offerName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  offerStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  offerStatusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  offerMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  pkgCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  pkgRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  pkgIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  pkgName: { fontSize: 14, fontFamily: "Tajawal_700Bold", marginBottom: 2 },
  pkgMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginBottom: 6 },
  pkgPriceRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  pkgPrice: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  pkgOriginal: { fontSize: 12, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
});
