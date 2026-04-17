import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#0369A1";
const VAT = 0.15;

const CATS_AR = ["دم", "بول", "براز", "هرمونات", "أشعة", "بكتريا", "حساسية", "أخرى"];
const CATS_EN = ["Blood", "Urine", "Stool", "Hormones", "Radiology", "Bacteria", "Allergy", "Other"];

const RESULTS_AR = ["يوم واحد", "يومان", "3 أيام", "أسبوع", "فوري (نفس اليوم)"];
const RESULTS_EN = ["1 Day", "2 Days", "3 Days", "1 Week", "Instant (Same Day)"];

export default function AddLabTest() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = isDark ? "#060E1A" : "#F0F8FF";
  const card = isDark ? "#0D2035" : "#fff";

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [catIdx, setCatIdx] = useState(0);
  const [resultIdx, setResultIdx] = useState(0);
  const [homeVisit, setHomeVisit] = useState(false);
  const [priceBase, setPriceBase] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [active, setActive] = useState(true);

  const vatAmt = +(parseFloat(priceBase) || 0) * VAT;
  const total = +((parseFloat(priceBase) || 0) + vatAmt).toFixed(2);
  const disc = parseFloat(discVal) || 0;
  const discAmount = discType === "pct" ? +(total * disc / 100).toFixed(2) : disc;
  const finalPrice = +(total - discAmount).toFixed(2);

  const save = () => {
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم الفحص","Please enter the test name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر","Please enter the price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("فحص:","Test:")} ${name}\n${t("السعر النهائي:","Final price:")} ${finalPrice} SAR`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة فحص / تحليل","Add Test / Analysis")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات الفحص","Test Information")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("اسم الفحص / التحليل *","Test / Analysis Name *")} placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("كود الفحص (مثال: CBC-001)","Test code (e.g. CBC-001)")} placeholderTextColor={colors.muted} value={code} onChangeText={setCode} textAlign="right" />
              <Feather name="hash" size={16} color={colors.muted} />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الوصف وما يقيسه هذا الفحص...","Description and what this test measures...")} placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{t("نوع الفحص","Test Type")}</Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
              {CATS_AR.map((c, i) => (
                <Pressable key={c} style={[st.chip, { backgroundColor: catIdx === i ? BRAND : BRAND + "15", borderColor: catIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setCatIdx(i)}>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: catIdx === i ? "#fff" : BRAND }}>{lang === "ar" ? c : CATS_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{t("مدة الحصول على النتيجة","Result Time")}</Text>
            <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
              {RESULTS_AR.map((r, i) => (
                <Pressable key={r} style={[st.chip, { backgroundColor: resultIdx === i ? BRAND : BRAND + "15", borderColor: resultIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setResultIdx(i)}>
                  <Text style={{ fontSize: 10, fontFamily: "Tajawal_700Bold", color: resultIdx === i ? "#fff" : BRAND }}>{lang === "ar" ? r : RESULTS_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", color: colors.text }}>{t("متاح للزيارة المنزلية","Available for home visits")}</Text></View>
              <Switch value={homeVisit} onValueChange={setHomeVisit} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={homeVisit ? BRAND : "#f4f3f4"} />
            </View>
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("التسعير والضريبة (15%)","Pricing & Tax (15%)")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("السعر قبل الضريبة *","Price before tax *")} placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: colors.muted }}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={{ borderRadius: 12, padding: 12, gap: 8, backgroundColor: isDark ? "#0A1E38" : "#DBEAFE" }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: colors.text }}>{parseFloat(priceBase).toFixed(2)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("الأساسي","Base")}</Text></View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: "#D97706" }}>{vatAmt.toFixed(2)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#D97706" }}>{t("الضريبة 15%","Tax 15%")}</Text></View>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 18, fontFamily: "Cairo_700Bold", color: BRAND }}>{total.toFixed(2)} SAR</Text><Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: BRAND }}>{t("شامل الضريبة","Incl. Tax")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("الخصم","Discount")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((tp) => (
                <Pressable key={tp} style={[{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center" }, discType === tp && { backgroundColor: BRAND }]} onPress={() => setDiscType(tp)}>
                  <Text style={{ fontSize: 13, fontFamily: "Tajawal_700Bold", color: discType === tp ? "#fff" : colors.muted }}>{tp === "pct" ? t("نسبة %","Percentage %") : t("مبلغ SAR","Amount SAR")}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("قيمة الخصم","Discount Value")} placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
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
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("الفحص متاح","Test Available")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{active ? t("نعم","Yes") : t("لا — موقوف","No — Suspended")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>
          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: BRAND }} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" }}>{t("حفظ الفحص","Save Test")}</Text>
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
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
});
