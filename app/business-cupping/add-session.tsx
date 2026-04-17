import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const VAT = 0.15;

const TYPES_AR = ["رطبة", "جافة", "وجه", "ظهر", "رأس", "قدم", "أخرى"];
const TYPES_EN = ["Wet", "Dry", "Face", "Back", "Head", "Foot", "Other"];

export default function AddCuppingSession() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = colors.surface;
  const card = colors.surface;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [typeIdx, setTypeIdx] = useState(0);
  const [duration, setDuration] = useState("");
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
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم نوع الجلسة","Please enter the session type name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر","Please enter the price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("تمت إضافة نوع جلسة:","Session type added:")} ${name}\n${t("السعر النهائي:","Final price:")} ${finalPrice} SAR`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[st.container, { backgroundColor: bg }]}>
        <View style={[st.header, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <Pressable style={st.backBtn} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={[st.headerTitle, { color: colors.text }]}>{t("إضافة نوع جلسة","Add Session Type")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrText}>{t("حفظ","Save")}</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 14 }}>
          <Pressable style={[st.imageArea, { backgroundColor: card, borderColor: BRAND + "40" }]} onPress={() => Alert.alert(t("رفع صورة","Upload Photo"), t("اختر صورة توضيحية للجلسة","Choose an illustrative photo for the session"))}>
            <View style={[st.imageIcon, { backgroundColor: BRAND + "20" }]}><Feather name="camera" size={28} color={BRAND} /></View>
            <Text style={[st.imageLabel, { color: colors.muted }]}>{t("اضغط لإضافة صورة الجلسة","Tap to add session photo")}</Text>
          </Pressable>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("معلومات الجلسة","Session Information")}</Text>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("اسم نوع الجلسة *","Session Type Name *")} placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("وصف الجلسة وفوائدها...","Session description and benefits...")} placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("مدة الجلسة","Session Duration")} placeholderTextColor={colors.muted} value={duration} onChangeText={setDuration} keyboardType="numeric" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>{t("دقيقة","min")}</Text>
            </View>
            <Text style={[st.fieldLabel, { color: colors.muted }]}>{t("نوع الحجامة","Cupping Type")}</Text>
            <View style={st.chipsRow}>
              {TYPES_AR.map((tp, i) => (
                <Pressable key={tp} style={[st.chip, { backgroundColor: typeIdx === i ? BRAND : BRAND + "15", borderColor: typeIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setTypeIdx(i)}>
                  <Text style={[st.chipText, { color: typeIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? tp : TYPES_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
            <View style={st.toggleRow}>
              <View style={{ flex: 1 }}><Text style={[st.fieldLabel, { color: colors.text, fontSize: 13 }]}>{t("متاح للزيارة المنزلية","Available for home visits")}</Text></View>
              <Switch value={homeVisit} onValueChange={setHomeVisit} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={homeVisit ? BRAND : "#f4f3f4"} />
            </View>
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("التسعير والضريبة","Pricing & Tax")}</Text>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("السعر قبل الضريبة *","Price before tax *")} placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: colors.surface }]}>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: colors.text }]}>{parseFloat(priceBase).toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: colors.muted }]}>{t("السعر الأساسي","Base Price")}</Text></View>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: "#D97706" }]}>{vatAmt.toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: "#D97706" }]}>{t("ضريبة القيمة المضافة (15%)","VAT (15%)")}</Text></View>
                <View style={[st.vatDivider, { backgroundColor: colors.border }]} />
                <View style={st.vatRow}><Text style={[st.vatTotal, { color: BRAND }]}>{total.toFixed(2)} SAR</Text><Text style={[st.vatLabelBold, { color: BRAND }]}>{t("السعر شامل الضريبة","Price incl. Tax")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("الخصم","Discount")}</Text>
            <View style={st.discTypeRow}>
              <Pressable style={[st.discTypeBtn, discType === "pct" && { backgroundColor: BRAND }]} onPress={() => setDiscType("pct")}>
                <Text style={[st.discTypeText, { color: discType === "pct" ? "#fff" : colors.muted }]}>{t("نسبة %","Percentage %")}</Text>
              </Pressable>
              <Pressable style={[st.discTypeBtn, discType === "amount" && { backgroundColor: BRAND }]} onPress={() => setDiscType("amount")}>
                <Text style={[st.discTypeText, { color: discType === "amount" ? "#fff" : colors.muted }]}>{t("مبلغ SAR","Amount SAR")}</Text>
              </Pressable>
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={discType === "pct" ? t("نسبة الخصم","Discount %") : t("مبلغ الخصم","Discount Amount")} placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>{discType === "pct" ? "%" : "SAR"}</Text>
            </View>
            {disc > 0 && parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: isDark ? "#003020" : "#F0FDF4" }]}>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: "#EF4444" }]}>- {discAmount.toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: "#EF4444" }]}>{t("الخصم","Discount")}</Text></View>
                <View style={[st.vatDivider, { backgroundColor: colors.border }]} />
                <View style={st.vatRow}><Text style={[st.vatTotal, { color: "#059669" }]}>{finalPrice.toFixed(2)} SAR</Text><Text style={[st.vatLabelBold, { color: "#059669" }]}>{t("السعر النهائي","Final Price")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.sectionTitle, { color: colors.text, marginBottom: 2 }]}>{t("حالة الجلسة","Session Status")}</Text>
              <Text style={[st.fieldLabel, { color: colors.muted }]}>{active ? t("الجلسة متاحة للحجز","Session available for booking") : t("الجلسة موقوفة","Session unavailable")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>
          <Pressable style={[st.saveBtn, { backgroundColor: BRAND }]} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={st.saveBtnText}>{t("حفظ الجلسة","Save Session")}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  saveHdr: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 },
  saveHdrText: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  imageArea: { height: 140, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 8 },
  imageIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  imageLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  section: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  sectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  fieldLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  inputWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  inputSuffix: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  chipsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  toggleRow: { flexDirection: "row-reverse", alignItems: "center" },
  vatBox: { borderRadius: 12, padding: 12, gap: 8 },
  vatRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  vatLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  vatLabelBold: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  vatVal: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  vatTotal: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  vatDivider: { height: 1, marginVertical: 4 },
  discTypeRow: { flexDirection: "row-reverse", gap: 8 },
  discTypeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center" },
  discTypeText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  saveBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16 },
  saveBtnText: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
});
