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

const ITEMS = [
  { id: 1, name: "فيتامين C 1000mg",  sku: "VIT-001", stock: 45, minStock: 10, catKey: "supplements", price: "89",  emoji: "💊" },
  { id: 2, name: "بروتين واي 2kg",    sku: "PRO-002", stock: 12, minStock: 5,  catKey: "sports",      price: "249", emoji: "🥛" },
  { id: 3, name: "زيت أرجان طبيعي",   sku: "OIL-003", stock: 3,  minStock: 5,  catKey: "beauty",      price: "129", emoji: "🫙" },
  { id: 4, name: "كريم ترطيب اليد",   sku: "CRM-004", stock: 0,  minStock: 10, catKey: "care",        price: "65",  emoji: "🧴" },
  { id: 5, name: "ماء الورد الطبيعي", sku: "RSW-005", stock: 28, minStock: 8,  catKey: "beauty",      price: "45",  emoji: "🌸" },
  { id: 6, name: "كبسولات أوميغا 3",  sku: "OMG-006", stock: 60, minStock: 15, catKey: "supplements", price: "115", emoji: "🐟" },
];

export default function InventoryPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const [filterKey, setFilterKey] = useState("all");
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const CAT_LABELS: Record<string, string> = {
    supplements: t("مكملات","Supplements"),
    sports:      t("رياضة","Sports"),
    beauty:      t("جمال","Beauty"),
    care:        t("عناية","Care"),
  };

  const getStockStatus = (stock: number, min: number) => {
    if (stock === 0)    return { label: t("نفد المخزون","Out of Stock"), color: "#DC2626", bg: "#FEE2E2" };
    if (stock <= min)   return { label: t("منخفض","Low Stock"),          color: "#D97706", bg: "#FEF3C7" };
    return               { label: t("متوفر","Available"),                color: "#059669", bg: "#D1FAE5" };
  };

  const FILTERS = [
    { key: "all",  label: t("الكل","All")       },
    { key: "low",  label: t("منخفض","Low Stock") },
    { key: "out",  label: t("نفد","Out of Stock")},
  ];

  const cardBg = isDark ? "#1A1030" : "#FFFFFF";
  const cardBorder = isDark ? "#2A1F45" : "#EDE9FE";

  const lowCount = ITEMS.filter((i) => i.stock > 0 && i.stock <= i.minStock).length;
  const outCount = ITEMS.filter((i) => i.stock === 0).length;

  const filtered = ITEMS.filter((item) => {
    const matchSearch = item.name.includes(search) || item.sku.includes(search);
    if (filterKey === "low") return matchSearch && item.stock > 0 && item.stock <= item.minStock;
    if (filterKey === "out") return matchSearch && item.stock === 0;
    return matchSearch;
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#1A0A33"} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("المخزون","Inventory")}</Text>
        <Pressable style={styles.exportBtn}
          onPress={() => Alert.alert(t("تصدير المخزون","Export Inventory"), t("سيتم تصدير تقرير المخزون كملف Excel","Inventory report will be exported as Excel"))}>
          <Feather name="download" size={16} color="#7C3AED" />
        </Pressable>
      </View>

      {(lowCount > 0 || outCount > 0) && (
        <View style={[styles.alertBanner, { backgroundColor: "#FEF3C7", borderColor: "#D97706" }]}>
          <Feather name="alert-triangle" size={16} color="#D97706" />
          <Text style={styles.alertText}>
            {outCount > 0 && `${outCount} ${t("منتج نفد مخزونه","products out of stock")}`}
            {outCount > 0 && lowCount > 0 && "  ·  "}
            {lowCount > 0 && `${lowCount} ${t("منتج مخزونه منخفض","products low on stock")}`}
          </Text>
        </View>
      )}

      <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Feather name="search" size={16} color={colors.muted} />
        <TextInput placeholder={t("ابحث باسم المنتج أو رمز SKU...","Search by product name or SKU...")} placeholderTextColor={colors.muted}
          value={search} onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]} textAlign="right" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f.key} style={[styles.filterChip, { borderColor: filterKey === f.key ? "#7C3AED" : cardBorder, backgroundColor: filterKey === f.key ? "#7C3AED" : cardBg }]}
            onPress={() => setFilterKey(f.key)}>
            <Text style={[styles.filterText, { color: filterKey === f.key ? "#fff" : colors.muted }]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {filtered.map((item) => {
          const s = getStockStatus(item.stock, item.minStock);
          return (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: cardBg, borderColor: item.stock === 0 ? "#DC262640" : item.stock <= item.minStock ? "#D9770640" : cardBorder }]}>
              <View style={styles.itemRow}>
                <View style={styles.itemActions}>
                  <Pressable style={[styles.adjustBtn, { backgroundColor: "#7C3AED20" }]}
                    onPress={() => Alert.alert(t("تعديل المخزون","Adjust Stock"), `${t("الكمية الحالية:","Current Qty:")} ${item.stock}\n${t("أدخل الكمية الجديدة","Enter new quantity")}`)}>
                    <Feather name="edit-2" size={14} color="#7C3AED" />
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemTop}>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                    </View>
                    <Text style={[styles.itemName, { color: isDark ? "#fff" : "#1A0A33" }]}>{item.name}</Text>
                  </View>
                  <Text style={[styles.itemSku, { color: colors.muted }]}>{item.sku}  ·  {CAT_LABELS[item.catKey] ?? item.catKey}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <View style={[styles.stockBubble, { backgroundColor: s.color + "20" }]}>
                    <Text style={[styles.stockNumber, { color: s.color }]}>{item.stock}</Text>
                    <Text style={[styles.stockUnit, { color: s.color }]}>{t("قطعة","pcs")}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.stockBar}>
                <View style={[styles.stockBarFill, {
                  width: `${Math.min(100, (item.stock / Math.max(item.stock, item.minStock * 2)) * 100)}%` as any,
                  backgroundColor: s.color,
                }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 14, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  exportBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center" },
  alertBanner: { flexDirection: "row-reverse", gap: 8, marginHorizontal: 16, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "center", marginBottom: 12 },
  alertText: { fontSize: 13, fontFamily: "Tajawal_500Medium", color: "#92400E" },
  searchBar: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  filterRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14, flexDirection: "row-reverse" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  itemCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  itemRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 10 },
  itemRight: { alignItems: "center", gap: 4 },
  itemEmoji: { fontSize: 26 },
  stockBubble: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignItems: "center" },
  stockNumber: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  stockUnit: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  itemActions: {},
  adjustBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 },
  itemName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  itemSku: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  stockBar: { height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", overflow: "hidden" },
  stockBarFill: { height: 4, borderRadius: 2 },
});
