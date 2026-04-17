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

function genCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const p = Array.from({ length: 5 }, () => c[Math.floor(Math.random() * c.length)]).join("");
  return `AKSEER-ST-${p}`;
}

export default function AddStoreOffer() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t } = useLanguage();
  const bg = isDark ? "#0A0614" : "#F5F3FF";
  const card = isDark ? "#160C2E" : "#fff";

  const [name, setName] = useState("");
  const [offerDesc, setOfferDesc] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [code, setCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);

  const save = () => {
    if (!name.trim() || !discVal.trim() || !expiry.trim())
      return Alert.alert(t("تنبيه","Notice"), t("يرجى إكمال البيانات","Please complete all fields"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("عرض:","Offer:")} ${name}\n${t("الكود:","Code:")} ${code || t("بدون كود","No Code")}\n${t("ينتهي:","Expires:")} ${expiry}`,
      [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة عرض للمتجر","Add Store Offer")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات العرض","Offer Information")}</Text>
            {[
              { ph: t("اسم العرض *","Offer Name *"), val: name, set: setName },
              { ph: t("وصف العرض...","Offer description..."), val: offerDesc, set: setOfferDesc, multi: true },
            ].map((f: any, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border, minHeight: f.multi ? 80 : undefined, alignItems: f.multi ? "flex-start" : undefined, paddingTop: f.multi ? 10 : undefined }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted}
                  value={f.val} onChangeText={f.set} textAlign="right" multiline={f.multi} />
              </View>
            ))}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("نوع وقيمة الخصم","Discount Type & Value")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((tp) => (
                <Pressable key={tp} style={[{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" }, discType === tp ? { backgroundColor: BRAND } : { backgroundColor: BRAND + "15" }]}
                  onPress={() => setDiscType(tp)}>
                  <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: discType === tp ? "#fff" : BRAND }}>
                    {tp === "pct" ? `🏷️ ${t("نسبة %","Percent %")}` : `💰 ${t("مبلغ SAR","Amount SAR")}`}
                  </Text>
                </Pressable>
              ))}
            </View>
            {[
              { ph: discType === "pct" ? t("الخصم (مثال: 20)","Discount (e.g. 20)") : t("مبلغ الخصم","Discount Amount"), val: discVal, set: setDiscVal, suf: discType === "pct" ? "%" : "SAR" },
              { ph: t("الحد الأدنى للطلب (اختياري)","Min. Order Amount (optional)"), val: minOrder, set: setMinOrder, suf: "SAR" },
              { ph: t("الحد الأقصى للاستخدامات","Max Usage Count"), val: maxUses, set: setMaxUses, suf: t("مرة","times") },
            ].map((f, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted}
                  value={f.val} onChangeText={f.set} keyboardType="decimal-pad" textAlign="right" />
                <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{f.suf}</Text>
              </View>
            ))}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("صلاحية العرض *","Offer Validity *")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder="DD/MM/YYYY" placeholderTextColor={colors.muted}
                value={expiry} onChangeText={setExpiry} textAlign="right" keyboardType="numeric" />
              <Feather name="calendar" size={18} color={BRAND} />
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Feather name="tag" size={16} color={BRAND} />
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 0 }]}>{t("كود الخصم","Discount Code")}</Text>
            </View>
            <View style={[st.inpWrap, { borderColor: code ? BRAND : colors.border, borderWidth: code ? 2 : 1 }]}>
              <TextInput style={[st.inp, { color: colors.text, fontFamily: "Cairo_700Bold", letterSpacing: 1.5 }]}
                placeholder={t("كود مخصص أو اضغط توليد تلقائي","Custom code or tap Auto-Generate")}
                placeholderTextColor={colors.muted} value={code} onChangeText={(v) => setCode(v.toUpperCase())}
                textAlign="right" autoCapitalize="characters" />
              {code && <Pressable onPress={() => Alert.alert(t("تم النسخ","Copied"), code)}><Feather name="copy" size={18} color={BRAND} /></Pressable>}
            </View>
            <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 12, borderWidth: 1, backgroundColor: BRAND + "15", borderColor: BRAND + "50" }}
              onPress={() => setCode(genCode())}>
              <Feather name="zap" size={16} color={BRAND} />
              <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: BRAND }}>⚡ {t("توليد كود خصم تلقائياً","Auto-Generate Code")}</Text>
            </Pressable>
            {code && (
              <View style={{ padding: 16, borderRadius: 14, backgroundColor: isDark ? "#12092A" : "#F5F3FF", alignItems: "center", gap: 6, borderWidth: 2, borderColor: BRAND + "30" }}>
                <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("كود الخصم الخاص بمتجرك","Your Store Discount Code")}</Text>
                <Text style={{ fontSize: 24, fontFamily: "Cairo_700Bold", color: BRAND, letterSpacing: 3 }}>{code}</Text>
                <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: BRAND + "20", borderRadius: 8 }}
                  onPress={() => Alert.alert(t("تم النسخ","Copied"), code)}>
                  <Feather name="copy" size={14} color={BRAND} />
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND }}>{t("نسخ الكود","Copy Code")}</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text, marginBottom: 2 }]}>{t("حالة العرض","Offer Status")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>
                {active ? t("مفعّل ويظهر للعملاء","Active and visible to customers") : t("موقوف","Paused")}
              </Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ false: "#ccc", true: BRAND + "80" }} thumbColor={active ? BRAND : "#f4f3f4"} />
          </View>

          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: BRAND }}
            onPress={save}>
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
});
