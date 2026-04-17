import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const BRAND = "#059669";

const SVCS = [
  { id: "1", nameAr: "جلسة علاج طبيعي (30د)", nameEn: "Physiotherapy Session (30min)", price: 150 },
  { id: "2", nameAr: "جلسة علاج طبيعي (60د)", nameEn: "Physiotherapy Session (60min)", price: 250 },
  { id: "3", nameAr: "تمارين إعادة تأهيل", nameEn: "Rehabilitation Exercises", price: 120 },
  { id: "4", nameAr: "علاج كهربائي TENS", nameEn: "TENS Electrical Therapy", price: 100 },
  { id: "5", nameAr: "الموجات فوق الصوتية", nameEn: "Ultrasound Therapy", price: 130 },
  { id: "6", nameAr: "تدليك علاجي", nameEn: "Therapeutic Massage", price: 200 },
];

const INIT = [
  { id: "1", nameAr: "باقة 10 جلسات علاج طبيعي", nameEn: "10-Session Physiotherapy Package", svcs: ["2"], cnt: 10, price: 2100, orig: 2500, expiry: "31/12/2026", active: true },
  { id: "2", nameAr: "باقة التأهيل الشاملة", nameEn: "Comprehensive Rehabilitation Package", svcs: ["2","3","4"], cnt: 1, price: 430, orig: 470, expiry: "30/06/2026", active: true },
];

export default function RehabPackages() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = isDark ? "#001A12" : "#ECFDF5";
  const card = isDark ? "#003020" : "#fff";

  const [pkgs, setPkgs] = useState(INIT);
  const [adding, setAdding] = useState(false);
  const [nm, setNm] = useState("");
  const [pr, setPr] = useState("");
  const [cnt, setCnt] = useState("1");
  const [ex, setEx] = useState("");
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
  const orig = sel.reduce((s, id) => s + (SVCS.find((x) => x.id === id)?.price || 0), 0) * parseInt(cnt || "1");

  const add = () => {
    if (!nm.trim() || !pr || sel.length === 0) return Alert.alert(t("تنبيه","Notice"), t("أكمل البيانات","Complete the data"));
    setPkgs((p) => [{ id: Date.now().toString(), nameAr: nm, nameEn: nm, svcs: sel, cnt: parseInt(cnt) || 1, price: parseFloat(pr), orig, expiry: ex || t("بلا انتهاء","No expiry"), active: true }, ...p]);
    setNm(""); setPr(""); setCnt("1"); setEx(""); setSel([]); setAdding(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[st.hdr, { backgroundColor: BRAND, paddingTop: isWeb ? 72 : insets.top + 16 }]}>
        <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
        <Text style={st.hdrTitle}>{t("باقات التأهيل","Rehab Packages")}</Text>
        <Pressable style={st.addBtn} onPress={() => setAdding(true)}><Feather name="plus" size={20} color="#fff" /></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80, gap: 14 }}>
        {adding && (
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "40", borderWidth: 2 }]}>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
              <Text style={[st.secTitle, { color: BRAND }]}>{t("باقة جديدة","New Package")}</Text>
              <Pressable onPress={() => setAdding(false)}><Feather name="x" size={20} color={colors.muted} /></Pressable>
            </View>
            {[
              { ph: t("اسم الباقة *","Package Name *"), v: nm, s: setNm },
              { ph: t("سعر الباقة (SAR) *","Package Price (SAR) *"), v: pr, s: setPr, num: true },
              { ph: t("تاريخ الانتهاء","Expiry Date"), v: ex, s: setEx },
            ].map((f: any, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted} value={f.v} onChangeText={f.s} textAlign="right" keyboardType={f.num ? "decimal-pad" : "default"} />
              </View>
            ))}
            <View style={[st.inpWrap, { borderColor: colors.border }]}>
              <TextInput style={[st.inp, { color: colors.text }]} placeholder={t("عدد الجلسات في الباقة","Sessions per package")} placeholderTextColor={colors.muted} value={cnt} onChangeText={setCnt} textAlign="right" keyboardType="numeric" />
              <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: colors.muted }}>{t("جلسة","session")}</Text>
            </View>
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND, textAlign: "right" }}>{t("الخدمات:","Services:")}</Text>
            {SVCS.map((s) => {
              const on = sel.includes(s.id);
              return (
                <Pressable key={s.id} style={[st.svcRow, { borderColor: on ? BRAND : colors.border, backgroundColor: on ? BRAND + "10" : "transparent" }]} onPress={() => toggle(s.id)}>
                  <View style={[st.check, { borderColor: on ? BRAND : colors.border, backgroundColor: on ? BRAND : "transparent" }]}>{on && <Feather name="check" size={12} color="#fff" />}</View>
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: "Tajawal_400Regular", color: colors.text, textAlign: "right" }}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: BRAND }}>{s.price} SAR</Text>
                </Pressable>
              );
            })}
            {sel.length > 0 && parseFloat(pr) > 0 && (
              <View style={{ padding: 12, borderRadius: 12, backgroundColor: isDark ? "#003820" : "#D1FAE5", gap: 4 }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND }}>{parseFloat(pr)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("للباقة كاملة","full package")} ({cnt} {t("جلسة","sessions")})</Text></View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("وفّر","Save")} {orig - parseFloat(pr)} SAR ({(((orig - parseFloat(pr)) / orig) * 100).toFixed(0)}%)</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted, textDecorationLine: "line-through" }}>{orig} SAR</Text></View>
              </View>
            )}
            <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: BRAND }} onPress={add}>
              <Feather name="plus-circle" size={18} color="#fff" /><Text style={{ color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold" }}>{t("إضافة الباقة","Add Package")}</Text>
            </Pressable>
          </View>
        )}
        {pkgs.map((pkg) => {
          const psvcs = SVCS.filter((s) => pkg.svcs.includes(s.id));
          return (
            <View key={pkg.id} style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", opacity: pkg.active ? 1 : 0.6 }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: colors.text, textAlign: "right" }}>{lang === "ar" ? pkg.nameAr : pkg.nameEn}</Text>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: BRAND, textAlign: "right" }}>{pkg.cnt} {t("جلسة","sessions")} · {t("تنتهي:","Expires:")} {pkg.expiry}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: pkg.active ? "#059669" : "#EF4444", alignItems: "center", justifyContent: "center" }} onPress={() => setPkgs((p) => p.map((x) => x.id === pkg.id ? { ...x, active: !x.active } : x))}>
                    <Feather name={pkg.active ? "eye" : "eye-off"} size={14} color="#fff" />
                  </Pressable>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#EF444415", alignItems: "center", justifyContent: "center" }} onPress={() => Alert.alert(t("حذف","Delete"), t("هل أنت متأكد؟","Are you sure?"), [{ text: t("إلغاء","Cancel") }, { text: t("حذف","Delete"), style: "destructive", onPress: () => setPkgs((p) => p.filter((x) => x.id !== pkg.id)) }])}>
                    <Feather name="trash-2" size={14} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
              <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 }}>
                {psvcs.map((s) => <View key={s.id} style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BRAND + "15", borderRadius: 8 }}><Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: BRAND }}>{lang === "ar" ? s.nameAr : s.nameEn}</Text></View>)}
              </View>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 12 }}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND }}>{pkg.price} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted, textDecorationLine: "line-through" }}>{pkg.orig} SAR</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#05966920", borderRadius: 10 }}>
                  <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("وفّر","Save")} {pkg.orig - pkg.price} SAR</Text>
                </View>
              </View>
            </View>
          );
        })}
        {!adding && (
          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: BRAND + "60", backgroundColor: BRAND + "08" }} onPress={() => setAdding(true)}>
            <Feather name="plus" size={20} color={BRAND} /><Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("إنشاء باقة جديدة","Create New Package")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  hdr: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hdrTitle: { flex: 1, fontSize: 18, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  svcRow: { flexDirection: "row-reverse", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  check: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
