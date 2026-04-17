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

function genCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const p = Array.from({ length: 5 }, () => c[Math.floor(Math.random() * c.length)]).join("");
  return `AKSEER-CL-${p}`;
}

export default function AddClinicOffer() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bg = isDark ? "#050F18" : "#F0FDFF";
  const card = isDark ? "#0A2030" : "#fff";
  const { t, lang } = useLanguage();

  const [name, setName] = useState("");
  const [discType, setDiscType] = useState<"pct" | "amount">("pct");
  const [discVal, setDiscVal] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [code, setCode] = useState("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);

  const save = () => {
    if (!name.trim() || !discVal.trim() || !expiry.trim()) return Alert.alert(t("تنبيه","Notice"), t("يرجى إكمال البيانات","Please complete all fields"));
    Alert.alert(t("تم الحفظ ✓","Saved ✓"), `${t("عرض:","Offer:")} ${name}`, [{ text: t("موافق","OK"), onPress: () => router.back() }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
          <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
          <Text style={st.hdrTitle}>{t("إضافة عرض طبي","Add Medical Offer")}</Text>
          <Pressable style={st.saveHdr} onPress={save}><Text style={st.saveHdrTxt}>{t("حفظ","Save")}</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("معلومات العرض","Offer Info")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("اسم العرض الطبي *","Medical Offer Name *")}
                placeholderTextColor={colors.muted} value={name} onChangeText={setName} textAlign="right" />
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("قيمة الخصم","Discount Value")}</Text>
            <View style={{ flexDirection: "row-reverse", gap: 8 }}>
              {(["pct", "amount"] as const).map((typ) => (
                <Pressable key={typ} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: discType === typ ? BRAND : BRAND + "15" }}
                  onPress={() => setDiscType(typ)}>
                  <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: discType === typ ? "#fff" : BRAND }}>{typ === "pct" ? t("نسبة %","Percent %") : t("مبلغ SAR","Amount SAR")}</Text>
                </Pressable>
              ))}
            </View>
            {[
              { ph: discType === "pct" ? t("الخصم %","Discount %") : t("مبلغ الخصم","Discount Amount"), val: discVal, set: setDiscVal, suf: discType === "pct" ? "%" : "SAR" },
              { ph: t("الحد الأدنى للطلب","Minimum Order"), val: minOrder, set: setMinOrder, suf: "SAR" },
              { ph: t("الحد الأقصى للاستخدامات","Maximum Uses"), val: maxUses, set: setMaxUses, suf: t("مرة","times") },
            ].map((f, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted}
                  value={f.val} onChangeText={f.set} keyboardType="decimal-pad" textAlign="right" />
                <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{f.suf}</Text>
              </View>
            ))}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("تاريخ الانتهاء *","Expiry Date *")}</Text>
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.muted} value={expiry} onChangeText={setExpiry} textAlign="right" keyboardType="numeric" />
              <Feather name="calendar" size={18} color={BRAND} />
            </View>
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20" }]}>
            <Text style={[st.secTitle, { color: colors.text }]}>{t("كود الخصم","Discount Code")}</Text>
            <View style={[st.inpWrap, { borderColor: code ? BRAND : colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text, fontFamily: "Cairo_700Bold", letterSpacing: 1 }]}
                placeholder={t("كود مخصص أو توليد تلقائي","Custom code or auto-generate")}
                placeholderTextColor={colors.muted} value={code} onChangeText={(v) => setCode(v.toUpperCase())} textAlign="right" />
              {code && <Pressable onPress={() => Alert.alert(t("تم النسخ","Copied"), code)}><Feather name="copy" size={18} color={BRAND} /></Pressable>}
            </View>
            <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, backgroundColor: BRAND + "15", borderColor: BRAND + "50" }}
              onPress={() => setCode(genCode())}>
              <Feather name="zap" size={16} color={BRAND} />
              <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("توليد كود تلقائي","Auto-generate Code")}</Text>
            </Pressable>
            {code && (
              <View style={{ padding: 14, borderRadius: 12, backgroundColor: isDark ? "#091A28" : "#CFFAFE", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND, letterSpacing: 2 }}>{code}</Text>
              </View>
            )}
          </View>

          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", flexDirection: "row-reverse", alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={[st.secTitle, { color: colors.text }]}>{t("حالة العرض","Offer Status")}</Text>
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", color: colors.muted }}>{active ? t("مفعّل","Active") : t("موقوف","Paused")}</Text>
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
});
