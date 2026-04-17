import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#0E7490";
const VAT = 0.15;

export default function AddClinicService() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bg = isDark ? "#050F18" : "#F0FDFF";
  const card = isDark ? "#0A2030" : "#fff";
  const { t, lang } = useLanguage();

  const CATS = [
    { ar: "كشف", en: "Checkup" }, { ar: "متابعة", en: "Follow-up" }, { ar: "استشارة", en: "Consultation" },
    { ar: "إجراء طبي", en: "Medical Procedure" }, { ar: "أشعة", en: "Radiology" }, { ar: "تحاليل", en: "Lab Tests" }, { ar: "أخرى", en: "Other" },
  ];

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [catIndex, setCatIndex] = useState(0);
  const [duration, setDuration] = useState("");
  const [priceBase, setPriceBase] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [active, setActive] = useState(true);
  const [homeVisit, setHomeVisit] = useState(false);

  const vatAmt = +(parseFloat(priceBase) || 0) * VAT;
  const total = +((parseFloat(priceBase) || 0) + vatAmt).toFixed(2);
  const disc = parseFloat(discVal) || 0;
  const discAmount = discType === "pct" ? +(total * disc / 100).toFixed(2) : disc;
  const finalPrice = +(total - discAmount).toFixed(2);

  const save = () => {
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم الخدمة","Please enter the service name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر","Please enter the price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("خدمة:","Service:")} ${name}\n${t("السعر النهائي:","Final Price:")} ${finalPrice} SAR`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة خدمة طبية","Add Medical Service")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 14 }}>
          <Pressable style={[st.imgArea, { backgroundColor: card, borderColor: BRAND + "40" }]}
            onPress={() => Alert.alert(t("رفع صورة","Upload Image"), t("اختر صورة توضيحية","Choose an illustrative image"))}>
            <View style={[st.imgIcon, { backgroundColor: BRAND + "20" }]}><Feather name="camera" size={28} color={BRAND} /></View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("اضغط لإضافة صورة","Tap to add image")}</Text>
          </Pressable>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات الخدمة الطبية","Medical Service Info")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("اسم الخدمة *","Service Name *")}
                placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الوصف والتفاصيل...","Description and details...")}
                placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("مدة الخدمة","Service Duration")}
                placeholderTextColor={colors.muted} value={duration} onChangeText={setDuration} keyboardType="numeric" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("دقيقة","min")}</Text>
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{t("تصنيف الخدمة","Service Category")}</Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
              {CATS.map((c, i) => (
                <Pressable key={c.ar} style={[st.chip, { backgroundColor: catIndex === i ? BRAND : BRAND + "15", borderColor: catIndex === i ? BRAND : BRAND + "40" }]}
                  onPress={() => setCatIndex(i)}>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: catIndex === i ? "#fff" : BRAND }}>{lang === "ar" ? c.ar : c.en}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", color: colors.text }}>{t("متاح للزيارة المنزلية","Available for Home Visit")}</Text></View>
              <Switch value={homeVisit} onValueChange={setHomeVisit} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={homeVisit ? BRAND : "#f4f3f4"} />
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("التسعير والضريبة","Pricing & VAT")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("السعر قبل الضريبة *","Price Before VAT *")}
                placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={{ borderRadius: 12, padding: 12, gap: 8, backgroundColor: isDark ? "#091A28" : "#E0F7FA" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 16, fontFamily: "Cairo_700Bold", color: BRAND }}>{total.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: BRAND }}>{t("شامل الضريبة","Incl. VAT")}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: "#D97706" }}>{vatAmt.toFixed(2)} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#D97706" }}>{t("الضريبة 15%","VAT 15%")}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("الخصم","Discount")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((typ) => (
                <Pressable key={typ} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: discType === typ ? BRAND : BRAND + "15", alignItems: "center" }}
                  onPress={() => setDiscType(typ)}>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: discType === typ ? "#fff" : BRAND }}>{typ === "pct" ? t("نسبة %","Percent %") : t("مبلغ SAR","Amount SAR")}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("قيمة الخصم","Discount Value")}
                placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{discType === "pct" ? "%" : "SAR"}</Text>
            </View>
            {disc > 0 && parseFloat(priceBase) > 0 && (
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", padding: 12, borderRadius: 12, backgroundColor: isDark ? "#003020" : "#F0FDF4" }}>
                <Text style={{ fontSize: 18, fontFamily: "Cairo_700Bold", color: "#059669" }}>{finalPrice.toFixed(2)} SAR</Text>
                <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#059669" }}>{t("السعر النهائي","Final Price")}</Text>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("الخدمة متاحة","Service Active")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{active ? t("نعم — تظهر للمرضى","Yes — visible to patients") : t("لا — موقوفة","No — paused")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>

          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: BRAND }} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" }}>{t("حفظ الخدمة","Save Service")}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  hdr: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hdrTitle: { flex: 1, fontSize: 17, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  saveHdr: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 },
  saveHdrTxt: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  imgArea: { height: 130, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 8 },
  imgIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
});
