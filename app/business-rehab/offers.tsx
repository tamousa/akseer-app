import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";

export default function RehabOffers() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const OFFERS = [
    { id: 1, nameAr: "باقة إعادة التأهيل الكاملة", nameEn: "Full Rehabilitation Package", discount: 20, price: 2800, original: 3500, sessions: 10, endDateAr: "دائم", endDateEn: "Permanent", uses: 18, active: true },
    { id: 2, nameAr: "باقة التأهيل الرياضي", nameEn: "Sports Rehabilitation Package", discount: 18, price: 1800, original: 2200, sessions: 6, endDateAr: "دائم", endDateEn: "Permanent", uses: 25, active: true },
    { id: 3, nameAr: "خصم تأمين إضافي 10%", nameEn: "Additional Insurance 10% Discount", discount: 10, price: null, original: null, sessions: null, endDateAr: "دائم", endDateEn: "Permanent", uses: 40, active: true },
    { id: 4, nameAr: "عرض المراجعة الأولى مجاناً", nameEn: "Free First Consultation", discount: 100, price: 0, original: null, sessions: 1, endDateAr: "دائم", endDateEn: "Permanent", uses: 33, active: true },
  ];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#001A12" : "#ECFDF5" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("العروض والباقات","Offers & Packages")}</Text>
        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <Pressable style={s.addBtn} onPress={() => router.push("/business-rehab/packages" as any)}>
            <Feather name="package" size={18} color="#fff" />
          </Pressable>
          <Pressable style={s.addBtn} onPress={() => router.push("/business-rehab/add-offer" as any)}>
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 10 }}>
        {OFFERS.map((o) => (
          <View key={o.id} style={[s.card, { backgroundColor: isDark ? "#003020" : "#fff", borderColor: BRAND + "25" }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <View style={[s.typeBadge, { backgroundColor: BRAND + "20" }]}>
                  <Text style={[s.typeText, { color: BRAND }]}>{o.sessions ? t("باقة","Package") : t("خصم","Discount")}</Text>
                </View>
                <Text style={[s.offerName, { color: colors.text }]}>{lang === "ar" ? o.nameAr : o.nameEn}</Text>
              </View>
              {o.price != null && o.price > 0 && (
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
                  {o.original && <Text style={[s.origPrice, { color: colors.muted }]}>{o.original} SAR</Text>}
                  <Text style={[s.offerPrice, { color: BRAND }]}>{o.price} SAR</Text>
                  <View style={[s.discBadge, { backgroundColor: BRAND + "20" }]}><Text style={[s.discText, { color: BRAND }]}>-{o.discount}%</Text></View>
                </View>
              )}
              {o.price === 0 && <Text style={[s.offerPrice, { color: BRAND }]}>{t("مجاناً","Free")}</Text>}
              <Text style={[s.meta, { color: colors.muted }]}>
                {o.sessions ? `📋 ${o.sessions} ${t("جلسات","sessions")}  ·  ` : ""}🎫 {o.uses} {t("استخدام","uses")}  ·  📅 {lang === "ar" ? o.endDateAr : o.endDateEn}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[s.statusBadge, { backgroundColor: o.active ? "#DCFCE7" : "#FEE2E2" }]}>
                <Text style={[s.statusText, { color: o.active ? "#059669" : "#EF4444" }]}>{o.active ? t("نشط","Active") : t("موقوف","Inactive")}</Text>
              </View>
              <Pressable style={[s.editBtn, { backgroundColor: BRAND + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), lang === "ar" ? o.nameAr : o.nameEn)}>
                <Feather name="edit-2" size={14} color={BRAND} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontFamily: "Cairo_700Bold" },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  card: { flexDirection: "row-reverse", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  offerName: { fontSize: 14, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },
  origPrice: { fontSize: 12, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  offerPrice: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  discBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  meta: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  editBtn: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
