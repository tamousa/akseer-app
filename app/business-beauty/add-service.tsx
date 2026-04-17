import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#BE185D";
const VAT = 0.15;

const CATS_AR = ["شعر", "بشرة", "مكياج", "أظافر", "إزالة"];
const CATS_EN = ["Hair", "Skin", "Makeup", "Nails", "Waxing"];

function calcVat(base: string) {
  const n = parseFloat(base) || 0;
  const vat = +(n * VAT).toFixed(2);
  const total = +(n + vat).toFixed(2);
  return { vat, total };
}

export default function AddBeautyService() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = isDark ? "#150010" : "#FFF0F6";
  const card = isDark ? "#2D0020" : "#fff";

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [catIdx, setCatIdx] = useState(0);
  const [duration, setDuration] = useState("");
  const [priceBase, setPriceBase] = useState("");
  const [discountType, setDiscountType] = useState<"pct" | "amount">("pct");
  const [discountVal, setDiscountVal] = useState("");
  const [active, setActive] = useState(true);
  const [hasImage, setHasImage] = useState(false);

  const { vat, total } = calcVat(priceBase);
  const disc = parseFloat(discountVal) || 0;
  const discAmount = discountType === "pct" ? +(total * disc / 100).toFixed(2) : disc;
  const finalPrice = +(total - discAmount).toFixed(2);

  const save = () => {
    if (!name.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم الخدمة","Please enter the service name"));
    if (!priceBase.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال السعر الأساسي","Please enter the base price"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("تمت إضافة خدمة:","Service added:")} ${name}\n${t("السعر النهائي:","Final price:")} ${finalPrice} SAR`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[st.container, { backgroundColor: bg }]}>
        <View style={[st.header, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.backBtn} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.headerTitle}>{t("إضافة خدمة","Add Service")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrText}>{t("حفظ","Save")}</Text></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <Pressable style={[st.imageArea, { backgroundColor: card, borderColor: BRAND + "40" }]}
            onPress={() => { setHasImage(!hasImage); Alert.alert(t("رفع صورة","Upload Photo"), t("اختر صورة من معرض الصور أو التقط صورة جديدة","Choose from gallery or take a new photo")); }}>
            {hasImage ? (
              <View style={{ alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 48 }}>🖼️</Text>
                <Text style={[st.imageLabel, { color: BRAND }]}>{t("تم اختيار الصورة — اضغط لتغييرها","Photo selected — tap to change")}</Text>
              </View>
            ) : (
              <View style={{ alignItems: "center", gap: 8 }}>
                <View style={[st.imageIcon, { backgroundColor: BRAND + "20" }]}><Feather name="camera" size={28} color={BRAND} /></View>
                <Text style={[st.imageLabel, { color: colors.muted }]}>{t("اضغط لإضافة صورة الخدمة","Tap to add service photo")}</Text>
                <Text style={[st.imageSub, { color: colors.muted }]}>JPG / PNG / WEBP • {t("حجم أقصى 5MB","Max size 5MB")}</Text>
              </View>
            )}
          </Pressable>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("معلومات الخدمة","Service Information")}</Text>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("اسم الخدمة *","Service Name *")} placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("وصف الخدمة (اختياري)","Service Description (optional)")} placeholderTextColor={colors.muted} value={desc} onChangeText={setDesc} textAlign="right" multiline />
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("مدة الخدمة (بالدقائق)","Duration (minutes)")} placeholderTextColor={colors.muted} value={duration} onChangeText={setDuration} keyboardType="numeric" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>{t("دقيقة","min")}</Text>
            </View>
            <Text style={[st.fieldLabel, { color: colors.muted }]}>{t("التصنيف","Category")}</Text>
            <View style={st.chipsRow}>
              {CATS_AR.map((c, i) => (
                <Pressable key={c} style={[st.chip, { backgroundColor: catIdx === i ? BRAND : BRAND + "15", borderColor: catIdx === i ? BRAND : BRAND + "40" }]} onPress={() => setCatIdx(i)}>
                  <Text style={[st.chipText, { color: catIdx === i ? "#fff" : BRAND }]}>{lang === "ar" ? c : CATS_EN[i]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("التسعير والضريبة","Pricing & Tax")}</Text>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={t("السعر قبل الضريبة *","Price before tax *")} placeholderTextColor={colors.muted} value={priceBase} onChangeText={setPriceBase} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>SAR</Text>
            </View>
            {parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: isDark ? "#1A0018" : "#FFF0F6" }]}>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: colors.text }]}>{parseFloat(priceBase).toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: colors.muted }]}>{t("السعر الأساسي","Base Price")}</Text></View>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: "#D97706" }]}>{vat.toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: "#D97706" }]}>{t("ضريبة القيمة المضافة (15%)","VAT (15%)")}</Text></View>
                <View style={[st.vatDivider, { backgroundColor: colors.border }]} />
                <View style={st.vatRow}><Text style={[st.vatTotal, { color: BRAND }]}>{total.toFixed(2)} SAR</Text><Text style={[st.vatLabelBold, { color: BRAND }]}>{t("السعر شامل الضريبة","Price incl. Tax")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>{t("الخصم","Discount")}</Text>
            <View style={st.discTypeRow}>
              <Pressable style={[st.discTypeBtn, discountType === "pct" && { backgroundColor: BRAND }]} onPress={() => setDiscountType("pct")}>
                <Text style={[st.discTypeText, { color: discountType === "pct" ? "#fff" : colors.muted }]}>{t("نسبة مئوية %","Percentage %")}</Text>
              </Pressable>
              <Pressable style={[st.discTypeBtn, discountType === "amount" && { backgroundColor: BRAND }]} onPress={() => setDiscountType("amount")}>
                <Text style={[st.discTypeText, { color: discountType === "amount" ? "#fff" : colors.muted }]}>{t("مبلغ ثابت SAR","Fixed Amount SAR")}</Text>
              </Pressable>
            </View>
            <View style={[st.inputWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.input, { color: colors.text }]} placeholder={discountType === "pct" ? t("نسبة الخصم (مثال: 10)","Discount % (e.g. 10)") : t("مبلغ الخصم (مثال: 20)","Discount amount (e.g. 20)")} placeholderTextColor={colors.muted} value={discountVal} onChangeText={setDiscountVal} keyboardType="decimal-pad" textAlign="right" />
              <Text style={[st.inputSuffix, { color: colors.muted }]}>{discountType === "pct" ? "%" : "SAR"}</Text>
            </View>
            {disc > 0 && parseFloat(priceBase) > 0 && (
              <View style={[st.vatBox, { backgroundColor: isDark ? "#001A00" : "#F0FDF4" }]}>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: colors.text }]}>{total.toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: colors.muted }]}>{t("قبل الخصم","Before Discount")}</Text></View>
                <View style={st.vatRow}><Text style={[st.vatVal, { color: "#EF4444" }]}>- {discAmount.toFixed(2)} SAR</Text><Text style={[st.vatLabel, { color: "#EF4444" }]}>{t("الخصم","Discount")} {discountType === "pct" ? `(${disc}%)` : ""}</Text></View>
                <View style={[st.vatDivider, { backgroundColor: colors.border }]} />
                <View style={st.vatRow}><Text style={[st.vatTotal, { color: "#059669" }]}>{finalPrice.toFixed(2)} SAR</Text><Text style={[st.vatLabelBold, { color: "#059669" }]}>{t("السعر النهائي للعميل","Final Price for Client")}</Text></View>
              </View>
            )}
          </View>
          <View style={[st.section, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.sectionTitle, { color: colors.text, marginBottom: 2 }]}>{t("حالة الخدمة","Service Status")}</Text>
              <Text style={[st.fieldLabel, { color: colors.muted }]}>{active ? t("الخدمة متاحة للحجز","Service is available for booking") : t("الخدمة موقوفة مؤقتاً","Service is temporarily unavailable")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>
          <Pressable style={[st.saveBtn, { backgroundColor: BRAND }]} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={st.saveBtnText}>{t("حفظ الخدمة","Save Service")}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  saveHdr: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 },
  saveHdrText: { color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 14 },
  imageArea: { height: 160, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  imageIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  imageLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  imageSub: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  section: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  sectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  fieldLabel: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  inputWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  inputSuffix: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  chipsRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
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
  saveBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, marginTop: 4 },
  saveBtnText: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
});
