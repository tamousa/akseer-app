import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#BE185D";

export default function BeautyOffers() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const OFFERS = [
    { id: 1, nameAr: "باقة العروس الذهبية", nameEn: "Golden Bride Package", discount: 21, originalPrice: 1900, price: 1500, typeAr: "باقة", typeEn: "Package", endDateAr: "30/04/2026", endDateEn: "30/04/2026", uses: 12, active: true },
    { id: 2, nameAr: "عرض مانيكير الثلاثاء", nameEn: "Tuesday Manicure Offer", discount: 20, originalPrice: 120, price: 95, typeAr: "خصم", typeEn: "Discount", endDateAr: "كل ثلاثاء", endDateEn: "Every Tuesday", uses: 34, active: true },
    { id: 3, nameAr: "باقة العناية الشهرية", nameEn: "Monthly Care Package", discount: 20, originalPrice: 500, price: 399, typeAr: "باقة", typeEn: "Package", endDateAr: "30/05/2026", endDateEn: "30/05/2026", uses: 8, active: true },
    { id: 4, nameAr: "خصم الطالبات 15%", nameEn: "Student 15% Discount", discount: 15, originalPrice: null, price: null, typeAr: "خصم", typeEn: "Discount", endDateAr: "دائم", endDateEn: "Permanent", uses: 55, active: false },
  ];

  return (
    <View style={[s.container, { backgroundColor: isDark ? "#150010" : "#FFF0F6" }]}>
      <View style={[s.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Text style={s.headerTitle}>{t("العروض والخصومات","Offers & Discounts")}</Text>
        <Pressable style={s.addBtn} onPress={() => router.push("/business-beauty/add-offer" as any)}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 10 }}>
        <View style={{ flexDirection: "row-reverse", gap: 10, marginBottom: 4 }}>
          <Pressable style={{ flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 14, borderRadius: 14, backgroundColor: BRAND + "15", borderWidth: 1, borderColor: BRAND + "30" }} onPress={() => router.push("/business-beauty/add-offer" as any)}>
            <Feather name="tag" size={16} color={BRAND} />
            <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("عرض جديد","New Offer")}</Text>
          </Pressable>
          <Pressable style={{ flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 14, borderRadius: 14, backgroundColor: "#05966915", borderWidth: 1, borderColor: "#05966930" }} onPress={() => router.push("/business-beauty/packages" as any)}>
            <Feather name="package" size={16} color="#059669" />
            <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("الباقات","Packages")}</Text>
          </Pressable>
        </View>
        {OFFERS.map((o) => (
          <View key={o.id} style={[s.card, { backgroundColor: isDark ? "#2D0020" : "#fff", borderColor: BRAND + "25" }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <View style={[s.typeBadge, { backgroundColor: BRAND + "20" }]}><Text style={[s.typeText, { color: BRAND }]}>{lang === "ar" ? o.typeAr : o.typeEn}</Text></View>
                <Text style={[s.offerName, { color: colors.text }]}>{lang === "ar" ? o.nameAr : o.nameEn}</Text>
              </View>
              {o.price && (
                <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
                  {o.originalPrice && <Text style={[s.origPrice, { color: colors.muted }]}>{o.originalPrice} SAR</Text>}
                  <Text style={[s.offerPrice, { color: BRAND }]}>{o.price} SAR</Text>
                  <View style={[s.discBadge, { backgroundColor: "#DCFCE7" }]}><Text style={[s.discText, { color: "#059669" }]}>-{o.discount}%</Text></View>
                </View>
              )}
              <Text style={[s.meta, { color: colors.muted }]}>📅 {lang === "ar" ? o.endDateAr : o.endDateEn}  ·  🎫 {o.uses} {t("استخدام","uses")}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <View style={[s.statusBadge, { backgroundColor: o.active ? "#DCFCE7" : "#FEE2E2" }]}>
                <Text style={[s.statusText, { color: o.active ? "#059669" : "#EF4444" }]}>{o.active ? t("نشط","Active") : t("موقوف","Inactive")}</Text>
              </View>
              <Pressable style={[s.editBtn, { backgroundColor: BRAND + "15" }]} onPress={() => Alert.alert(t("تعديل","Edit"), `${t("تعديل العرض:","Edit offer:")} ${lang === "ar" ? o.nameAr : o.nameEn}`)}>
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
