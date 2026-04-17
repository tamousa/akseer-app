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

function genCode(prefix: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `AKSEER-${prefix}-${part}`;
}

export default function AddBeautyOffer() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t } = useLanguage();
  const bg = isDark ? "#150010" : "#FFF0F6";
  const card = isDark ? "#2D0020" : "#fff";

  const [offerName, setOfferName] = useState("");
  const [offerDesc, setOfferDesc] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [code, setCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => { setCode(genCode("BT")); setCopied(false); };
  const copyCode = () => { setCopied(true); Alert.alert(t("تم النسخ","Copied"), t("تم نسخ كود الخصم: ","Discount code copied: ") + code); };
  const save = () => {
    if (!offerName.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال اسم العرض","Please enter the offer name"));
    if (!discVal.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال قيمة الخصم","Please enter the discount value"));
    if (!expiry.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال تاريخ انتهاء العرض","Please enter the expiry date"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("عرض:","Offer:")} ${offerName}\n${t("الكود:","Code:")} ${code || t("بدون كود","No code")}\n${t("ينتهي:","Expires:")} ${expiry}`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة عرض","Add Offer")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات العرض","Offer Information")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("اسم العرض *","Offer Name *")} placeholderTextColor={colors.muted} value={offerName} onChangeText={setOfferName} textAlign="right" />
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border, minHeight: 80, alignItems: "flex-start", paddingTop: 10 }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("وصف العرض (اختياري)...","Offer Description (optional)...")} placeholderTextColor={colors.muted} value={offerDesc} onChangeText={setOfferDesc} textAlign="right" multiline />
            </View>
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("نوع الخصم والقيمة","Discount Type & Value")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((tp) => (
                <Pressable key={tp} style={[{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: BRAND + "10", alignItems: "center", borderWidth: 2, borderColor: "transparent" }, discType === tp && { backgroundColor: BRAND, borderColor: BRAND }]} onPress={() => setDiscType(tp)}>
                  <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: discType === tp ? "#fff" : BRAND }}>{tp === "pct" ? t("🏷️ نسبة مئوية %","🏷️ Percentage %") : t("💰 مبلغ ثابت SAR","💰 Fixed Amount SAR")}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={discType === "pct" ? t("الخصم (مثال: 20)","Discount (e.g. 20)") : t("مبلغ الخصم","Discount Amount")} placeholderTextColor={colors.muted} value={discVal} onChangeText={setDiscVal} keyboardType="decimal-pad" textAlign="right" />
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BRAND + "20", borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: BRAND }}>{discType === "pct" ? "%" : "SAR"}</Text>
              </View>
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الحد الأدنى للطلب (اختياري)","Min. Order Amount (optional)")} placeholderTextColor={colors.muted} value={minOrder} onChangeText={setMinOrder} keyboardType="decimal-pad" textAlign="right" />
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>SAR</Text>
            </View>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("الحد الأقصى لعدد الاستخدامات","Max. Number of Uses")} placeholderTextColor={colors.muted} value={maxUses} onChangeText={setMaxUses} keyboardType="numeric" textAlign="right" />
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("مرة","times")}</Text>
            </View>
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("تاريخ الانتهاء","Expiry Date")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder="DD/MM/YYYY" placeholderTextColor={colors.muted} value={expiry} onChangeText={setExpiry} textAlign="right" keyboardType="numeric" />
              <Feather name="calendar" size={18} color={BRAND} />
            </View>
            {expiry.length > 0 && (
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingHorizontal: 4 }}>
                <Feather name="clock" size={14} color="#D97706" />
                <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#D97706" }}>{t("العرض ينتهي في:","Offer expires on:")} {expiry}</Text>
              </View>
            )}
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("كود الخصم","Discount Code")}</Text>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{t("يمكنك توليد كود تلقائي أو كتابة كود مخصص","Generate automatic code or write a custom one")}</Text>
            <View style={[st.inpWrap, { borderColor: code ? BRAND : colors.border, borderWidth: code ? 2 : 1 }]}>
              <TextInput style={[st.inp, { color: colors.text, fontFamily: "Cairo_700Bold", fontSize: 15, letterSpacing: 1 }]} placeholder={t("اكتب كوداً مخصصاً أو اضغط توليد تلقائي","Custom code or tap Auto-generate")} placeholderTextColor={colors.muted} value={code} onChangeText={(v) => { setCode(v.toUpperCase()); setCopied(false); }} textAlign="right" autoCapitalize="characters" />
              {code ? <Pressable onPress={copyCode} style={{ padding: 4 }}><Feather name={copied ? "check" : "copy"} size={18} color={copied ? "#059669" : BRAND} /></Pressable> : <Feather name="tag" size={18} color={colors.muted} />}
            </View>
            <Pressable style={[st.genBtn, { backgroundColor: BRAND + "15", borderColor: BRAND + "50" }]} onPress={generate}>
              <Feather name="zap" size={16} color={BRAND} />
              <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("توليد كود تلقائي","Auto-generate Code")}</Text>
            </Pressable>
            {code ? (
              <View style={{ borderRadius: 12, padding: 14, backgroundColor: isDark ? "#1A0018" : "#FFF0F6", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 22, fontFamily: "Cairo_700Bold", color: BRAND, letterSpacing: 2 }}>{code}</Text>
                <Text style={{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("شارك هذا الكود مع عملائك","Share this code with your clients")}</Text>
              </View>
            ) : null}
          </View>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("حالة العرض","Offer Status")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{active ? t("العرض مفعّل ويظهر للعملاء","Offer is active and visible to clients") : t("العرض موقوف","Offer is inactive")}</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>
          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: BRAND }} onPress={save}>
            <Feather name="check-circle" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" }}>{t("نشر العرض","Publish Offer")}</Text>
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
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  genBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
});
