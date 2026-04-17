import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#7C3AED";
const VAT = 0.15;

export default function AddProduct() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t } = useLanguage();

  const CATS = [
    t("صحة","Health"), t("تجميل","Beauty"), t("أجهزة","Devices"),
    t("مكملات","Supplements"), t("أدوية","Medicine"), t("رياضة","Sports"), t("أخرى","Other"),
  ];

  const bg = isDark ? "#0A0614" : "#F5F3FF";
  const card = isDark ? "#160C2E" : "#fff";
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [stock, setStock] = useState("");
  const [priceBase, setPriceBase] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [active, setActive] = useState(true);
  const [imgs, setImgs] = useState(0);

  const vatAmt = +(parseFloat(priceBase) || 0) * VAT;
  const total = +((parseFloat(priceBase) || 0) + vatAmt).toFixed(2);
  const disc = parseFloat(discVal) || 0;
  const discAmount = discType === "pct" ? +(total * disc / 100).toFixed(2) : disc;
  const finalPrice = +(total - discAmount).toFixed(2);

  const save = () => {
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم المنتج","Please enter product name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر","Please enter price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("منتج:","Product:")} ${name}\n${t("السعر النهائي:","Final Price:")} ${finalPrice} SAR`,
      [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة منتج","Add Product")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <View style={{ flexDirection: "row-reverse", gap: 10 }}>
            <Pressable style={[st.imgMain, { backgroundColor: card, borderColor: BRAND + "40" }]}
              onPress={() => { setImgs((prev) => Math.min(prev + 1, 5)); Alert.alert(t("رفع صورة","Upload Image"), t("اختر صوراً للمنتج (حتى 5 صور)","Choose product images (up to 5)")); }}>
              {imgs > 0
                ? <><Text style={{ fontSize: 36 }}>📦</Text><Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: BRAND, marginTop: 4 }}>{imgs} {t("صورة مضافة","images added")}</Text></>
                : <><View style={[st.imgIcon, { backgroundColor: BRAND + "20" }]}><Feather name="camera" size={24} color={BRAND} /></View><Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: colors.muted, marginTop: 4 }}>{t("أضف حتى 5 صور","Add up to 5 images")}</Text></>
              }
            </Pressable>
            <View style={{ gap: 8, justifyContent: "center" }}>
              {[1, 2].map((i) => (
                <Pressable key={i} style={[st.imgThumb, { backgroundColor: card, borderColor: BRAND + "20" }]} onPress={() => Alert.alert(t("صورة إضافية","Extra Image"), t("اختر صورة","Choose image"))}>
                  <Feather name="plus" size={18} color={BRAND + "60"} />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات المنتج","Product Information")}</Text>
            {[
              { ph: t("اسم المنتج *","Product Name *"), val: name, set: setName },
              { ph: t("كود المنتج / SKU (اختياري)","Product Code / SKU (optional)"), val: sku, set: setSku },
            ].map((f, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted} value={f.val} onChangeText={f.set} textAlign="right" />
              </View>
            ))}
            <View style={[st.inpWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الوصف والمكونات...","Description and ingredients...")} placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{t("التصنيف","Category")}</Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
              {CATS.map((c) => (
                <Pressable key={c} style={[st.chip, { backgroundColor: cat === c ? BRAND : BRAND + "15", borderColor: cat === c ? BRAND : BRAND + "40" }]} onPress={() => setCat(c)}>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: cat === c ? "#fff" : BRAND }}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الكمية المتاحة في المخزون","Available stock quantity")} placeholderTextColor={colors.muted} value={stock} onChangeText={setStock} keyboardType="numeric" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("قطعة","pcs")}</Text>
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("التسعير والضريبة (VAT 15%)","Pricing & Tax (VAT 15%)")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("السعر قبل الضريبة *","Price before tax *")} placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={{ borderRadius: 12, padding: 14, gap: 8, backgroundColor: isDark ? "#120D24" : "#F5F3FF", borderWidth: 1, borderColor: BRAND + "20" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: colors.text }}>{parseFloat(priceBase).toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("سعر المنتج (بدون ضريبة)","Price (excl. VAT)")}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: "#D97706" }}>+ {vatAmt.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#D97706" }}>{t("ضريبة القيمة المضافة 15%","VAT 15%")}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 2 }} />
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND }}>{total.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: BRAND }}>{t("السعر النهائي شامل الضريبة","Final Price incl. VAT")}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("الخصم","Discount")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((tp) => (
                <Pressable key={tp} style={[{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center" }, discType === tp && { backgroundColor: BRAND }]}
                  onPress={() => setDiscType(tp)}>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: discType === tp ? "#fff" : colors.muted }}>
                    {tp === "pct" ? t("نسبة %","Percent %") : t("مبلغ ثابت SAR","Fixed Amount SAR")}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]}
                placeholder={discType === "pct" ? t("نسبة الخصم (مثال: 20)","Discount % (e.g. 20)") : t("مبلغ الخصم","Discount Amount")}
                placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{discType === "pct" ? "%" : "SAR"}</Text>
            </View>
            {disc > 0 && parseFloat(priceBase) > 0 && (
              <View style={{ borderRadius: 12, padding: 12, gap: 6, backgroundColor: isDark ? "#003020" : "#F0FDF4" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: "#EF4444" }}>- {discAmount.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#EF4444" }}>{t("الخصم","Discount")} {discType === "pct" ? `(${disc}%)` : ""}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: "#059669" }}>{finalPrice.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#059669" }}>{t("السعر النهائي للمشتري","Final Price for Buyer")}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("المنتج متاح للبيع","Product Available for Sale")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>
                {active ? t("يظهر في المتجر","Visible in store") : t("مخفي","Hidden")}
              </Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>

          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: BRAND }} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" }}>{t("نشر المنتج","Publish Product")}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  hdr: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hdrTitle: { flex: 1, fontSize: 18, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  saveHdr: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 },
  saveHdrTxt: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  imgMain: { flex: 1, height: 160, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 },
  imgThumb: { width: 74, height: 74, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  imgIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
});
