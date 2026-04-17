import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";
const VAT = 0.15;

const CATS_AR = ["علاج طبيعي", "إعادة تأهيل", "تأهيل رياضي", "ما بعد جراحة", "تقويم", "أخرى"];
const CATS_EN = ["Physiotherapy", "Rehabilitation", "Sports Rehab", "Post-Surgery", "Ortho", "Other"];

const INS_AR = ["بوبا", "تعاون", "الأهلي", "الراجحي", "الاتحاد", "لا يوجد"];
const INS_EN = ["Bupa", "Tawuniya", "Al Ahli", "Al Rajhi", "Al-Ittihad", "None"];

export default function AddRehabService() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = isDark ? "#001A12" : "#ECFDF5";
  const card = isDark ? "#003020" : "#fff";

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [catIdx, setCatIdx] = useState(0);
  const [duration, setDuration] = useState("");
  const [sessRange, setSessRange] = useState("");
  const [insIdx, setInsIdx] = useState(INS_AR.length - 1);
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
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم الخدمة","Please enter the service name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر","Please enter the price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("خدمة:","Service:")} ${name}\n${t("السعر النهائي:","Final price:")} ${finalPrice} SAR`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[st.c, { backgroundColor: bg }]}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة خدمة علاجية","Add Therapy Service")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <Pressable style={[st.imgArea, { backgroundColor: card, borderColor: BRAND + "40" }]} onPress={() => Alert.alert(t("رفع صورة","Upload Photo"), t("اختر صورة توضيحية للخدمة","Choose an illustrative photo"))}>
            <View style={[st.imgIcon, { backgroundColor: BRAND + "20" }]}><Feather name="camera" size={28} color={BRAND} /></View>
            <Text style={[st.imgLabel, { color: colors.muted }]}>{t("اضغط لإضافة صورة الخدمة","Tap to add service photo")}</Text>
          </Pressable>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات الخدمة","Service Information")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("اسم الخدمة العلاجية *","Therapy Service Name *")} placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الوصف والحالات التي تعالجها...","Description and conditions treated...")} placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <View style={{ flexDirection: "row-reverse", gap: 10 }}>
              <View style={[st.inpWrap, { borderColor: colors.border, flex: 1 }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("مدة الجلسة","Session Duration")} placeholderTextColor={colors.muted} value={duration} onChangeText={setDuration} keyboardType="numeric" textAlign="right" />
                <Text style={[st.suf, { color: colors.muted }]}>{t("د","min")}</Text>
              </View>
              <View style={[st.inpWrap, { borderColor: colors.border, flex: 1 }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("عدد الجلسات","No. of Sessions")} placeholderTextColor={colors.muted} value={sessRange} onChangeText={setSessRange} textAlign="right" />
              </View>
            </View>
            <Text style={[st.lbl, { color: colors.muted }]}>{t("تصنيف الخدمة","Service Category")}</Text>
            <View style={st.chips}>
              {CATS_AR.map((c, i) => (
                <Pressable key={c} style={[st.chip, { backgroundColor: catIdx === i ? BRAND : BRAND + "15", borderColor: catIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setCatIdx(i)}>
                  <Text style={[st.chipTxt, { color: catIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? c : CATS_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[st.lbl, { color: colors.muted }]}>{t("التأمين المقبول","Accepted Insurance")}</Text>
            <View style={st.chips}>
              {INS_AR.map((ins, i) => (
                <Pressable key={ins} style={[st.chip, { backgroundColor: insIdx === i ? BRAND : BRAND + "15", borderColor: insIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setInsIdx(i)}>
                  <Text style={[st.chipTxt, { color: insIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? ins : INS_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("التسعير والضريبة (15%)","Pricing & Tax (15%)")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("سعر الجلسة الواحدة قبل الضريبة *","Per-session price before tax *")} placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.suf, { color: colors.muted }]}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: isDark ? "#003820" : "#D1FAE5" }]}>
                <View style={st.vatRow}><Text style={[st.vatV, { color: colors.text }]}>{parseFloat(priceBase).toFixed(2)} SAR</Text><Text style={[st.vatL, { color: colors.muted }]}>{t("السعر الأساسي","Base Price")}</Text></View>
                <View style={st.vatRow}><Text style={[st.vatV, { color: "#D97706" }]}>{vatAmt.toFixed(2)} SAR</Text><Text style={[st.vatL, { color: "#D97706" }]}>{t("الضريبة 15%","Tax 15%")}</Text></View>
                <View style={{ height: 1, marginVertical: 4, backgroundColor: colors.border }} />
                <View style={st.vatRow}><Text style={[st.vatT, { color: BRAND }]}>{total.toFixed(2)} SAR</Text><Text style={[st.vatB, { color: BRAND }]}>{t("السعر شامل الضريبة","Incl. Tax")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("الخصم (اختياري)","Discount (optional)")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((tp) => (
                <Pressable key={tp} style={[st.discBtn, discType === tp && { backgroundColor: BRAND }]} onPress={() => setDiscType(tp)}>
                  <Text style={[{ fontSize: 13, fontFamily: "Tajawal_700Bold" }, { color: discType === tp ? "#fff" : colors.muted }]}>{tp === "pct" ? t("نسبة %","Percentage %") : t("مبلغ SAR","Amount SAR")}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("قيمة الخصم","Discount Value")} placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.suf, { color: colors.muted }]}>{discType === "pct" ? "%" : "SAR"}</Text>
            </View>
            {disc > 0 && parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: isDark ? "#003020" : "#F0FDF4" }]}>
                <View style={st.vatRow}><Text style={[st.vatV, { color: "#EF4444" }]}>- {discAmount.toFixed(2)} SAR</Text><Text style={[st.vatL, { color: "#EF4444" }]}>{t("الخصم","Discount")}</Text></View>
                <View style={{ height: 1, marginVertical: 4, backgroundColor: colors.border }} />
                <View style={st.vatRow}><Text style={[st.vatT, { color: "#059669" }]}>{finalPrice.toFixed(2)} SAR</Text><Text style={[st.vatB, { color: "#059669" }]}>{t("السعر النهائي للمريض","Final Price for Patient")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("حالة الخدمة","Service Status")}</Text>
              <Text style={[st.lbl, { color: colors.muted }]}>{active ? t("متاحة للحجز","Available for booking") : t("موقوفة","Unavailable")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>
          <Pressable style={[st.saveBtn, { backgroundColor: BRAND }]} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={st.saveBtnTxt}>{t("حفظ الخدمة","Save Service")}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1 },
  hdr: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hdrTitle: { flex: 1, fontSize: 17, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  saveHdr: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 },
  saveHdrTxt: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  imgArea: { height: 140, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 8 },
  imgIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  imgLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  lbl: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  suf: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  chips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  chipTxt: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  vatBox: { borderRadius: 12, padding: 12, gap: 8 },
  vatRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  vatL: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  vatB: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  vatV: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  vatT: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  discBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center" },
  saveBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16 },
  saveBtnTxt: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
});
