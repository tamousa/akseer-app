import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, I18nManager, Platform, Pressable, ScrollView,
  StyleSheet, Switch, Text, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export default function ShippingPage() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { t } = useLanguage();

  const INIT_METHODS = [
    { key: "delivery",     label: t("توصيل للمنزل",    "Home Delivery"),     icon: "truck"   as const, price: "25 SAR", time: t("1-3 أيام","1-3 Days"),         active: true,  color: "#7C3AED" },
    { key: "express",      label: t("توصيل سريع",       "Express Delivery"),  icon: "zap"     as const, price: "45 SAR", time: t("نفس اليوم","Same Day"),         active: true,  color: "#D97706" },
    { key: "pickup",       label: t("استلام من الفرع", "Branch Pickup"),      icon: "map-pin" as const, price: t("مجاني","Free"), time: t("فوري","Instant"),      active: true,  color: "#059669" },
    { key: "home_service", label: t("زيارة منزلية",    "Home Visit"),         icon: "home"    as const, price: "60 SAR", time: t("بموعد مسبق","With Appointment"), active: false, color: "#2563EB" },
  ];

  const INIT_ZONES = [
    { name: t("الرياض","Riyadh"),                       areas: t("جميع الأحياء","All Neighborhoods"),                    minOrder: "50 SAR",  active: true  },
    { name: t("جدة","Jeddah"),                          areas: t("جميع الأحياء","All Neighborhoods"),                    minOrder: "80 SAR",  active: true  },
    { name: t("الدمام والمنطقة الشرقية","Dammam & Eastern Region"), areas: t("الدمام، الخبر، القطيف","Dammam, Khobar, Qatif"), minOrder: "100 SAR", active: false },
  ];

  const [methods, setMethods] = useState(INIT_METHODS);
  const [zones, setZones] = useState(INIT_ZONES);

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
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>{t("الشحن والتوصيل","Shipping & Delivery")}</Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t("طرق التوصيل","Delivery Methods")}</Text>
      <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 24 }}>
        {methods.map((m) => (
          <View key={m.key} style={[styles.methodCard, { backgroundColor: cardBg, borderColor: m.active ? m.color + "50" : cardBorder }]}>
            <Switch value={m.active} onValueChange={() => setMethods((p) => p.map((x) => x.key === m.key ? { ...x, active: !x.active } : x))}
              trackColor={{ false: "#ccc", true: "#7C3AED80" }} thumbColor={m.active ? "#7C3AED" : "#f4f3f4"} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodName, { color: isDark ? "#fff" : "#1A0A33" }]}>{m.label}</Text>
              <Text style={[styles.methodMeta, { color: colors.muted }]}>{m.price}  ·  {m.time}</Text>
            </View>
            <View style={[styles.methodIcon, { backgroundColor: m.active ? m.color + "20" : isDark ? "#2A1F45" : "#F3F0FF" }]}>
              <Feather name={m.icon} size={20} color={m.active ? m.color : colors.muted} />
            </View>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t("مناطق التغطية","Coverage Areas")}</Text>
      <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 24 }}>
        {zones.map((z) => (
          <View key={z.name} style={[styles.zoneCard, { backgroundColor: cardBg, borderColor: z.active ? "#7C3AED50" : cardBorder }]}>
            <Switch value={z.active} onValueChange={() => setZones((p) => p.map((x) => x.name === z.name ? { ...x, active: !x.active } : x))}
              trackColor={{ false: "#ccc", true: "#7C3AED80" }} thumbColor={z.active ? "#7C3AED" : "#f4f3f4"} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.zoneName, { color: isDark ? "#fff" : "#1A0A33" }]}>{z.name}</Text>
              <Text style={[styles.zoneMeta, { color: colors.muted }]}>{z.areas}  ·  {t("حد أدنى:","Min Order:")} {z.minOrder}</Text>
            </View>
          </View>
        ))}
        <Pressable style={[styles.addZoneBtn, { borderColor: "#7C3AED", backgroundColor: isDark ? "#1A1030" : "#EDE9FE" }]}
          onPress={() => Alert.alert(t("إضافة منطقة","Add Zone"), t("سيتم فتح نموذج إضافة منطقة تغطية جديدة","A form to add a new coverage zone will open"))}>
          <Feather name="plus" size={16} color="#7C3AED" />
          <Text style={[styles.addZoneText, { color: "#7C3AED" }]}>{t("إضافة منطقة جديدة","Add New Zone")}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={[styles.infoBox, { backgroundColor: isDark ? "#1A1030" : "#F5F0FF", borderColor: "#7C3AED30" }]}>
          <Feather name="info" size={16} color="#7C3AED" />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t(
              "أسعار التوصيل تُحتسب تلقائياً عند إتمام طلب العميل وفقاً للمنطقة وطريقة التوصيل المختارة.",
              "Delivery prices are calculated automatically when the customer completes their order based on the selected zone and delivery method."
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 16, marginBottom: 20, gap: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pageTitle: { flex: 1, fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  sectionLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium", paddingHorizontal: 16, marginBottom: 10 },
  methodCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  methodIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  methodName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  methodMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  zoneCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  zoneName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  zoneMeta: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  addZoneBtn: { flexDirection: "row-reverse", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderStyle: "dashed" },
  addZoneText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  infoBox: { flexDirection: "row-reverse", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 },
});
