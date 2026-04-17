import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const PRODS = [
  { id: "1", nameAr: "مكمل بروتين 1kg",   nameEn: "Protein Supplement 1kg", price: 180 },
  { id: "2", nameAr: "كريم ترطيب فاخر",   nameEn: "Luxury Moisturizer",     price: 120 },
  { id: "3", nameAr: "فيتامين سي 1000mg",  nameEn: "Vitamin C 1000mg",       price: 80  },
  { id: "4", nameAr: "زيت أوميغا-3",       nameEn: "Omega-3 Oil",            price: 95  },
  { id: "5", nameAr: "مسحوق كولاجين",      nameEn: "Collagen Powder",        price: 150 },
];

export default function StorePackages() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();

  const INIT = [
    { id: "1", nameAr: "باقة المكملات الشهرية", nameEn: "Monthly Supplements Package", prods: ["1","3","4"], price: 320, orig: 355, expiry: "31/12/2026", active: true },
    { id: "2", nameAr: "باقة العناية بالبشرة",  nameEn: "Skincare Package",            prods: ["2","5"],     price: 230, orig: 270, expiry: "30/06/2026", active: true },
  ];

  const bg = isDark ? "#0A0614" : "#F5F3FF";
  const card = isDark ? "#160C2E" : "#fff";
  const [pkgs, setPkgs] = useState(INIT);
  const [adding, setAdding] = useState(false);
  const [nm, setNm] = useState("");
  const [pr, setPr] = useState("");
  const [ex, setEx] = useState("");
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
  const orig = sel.reduce((s, id) => s + (PRODS.find((x) => x.id === id)?.price || 0), 0);

  const add = () => {
    if (!nm.trim() || !pr || sel.length === 0) return Alert.alert(t("تنبيه","Notice"), t("أكمل البيانات","Complete all fields"));
    setPkgs((p) => [{ id: Date.now().toString(), nameAr: nm, nameEn: nm, prods: sel, price: parseFloat(pr), orig, expiry: ex || t("بلا انتهاء","No Expiry"), active: true }, ...p]);
    setNm(""); setPr(""); setEx(""); setSel([]); setAdding(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[st.hdr, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
        <Text style={st.hdrTitle}>{t("باقات المتجر","Store Packages")}</Text>
        <Pressable style={[st.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => setAdding(true)}><Feather name="plus" size={20} color={colors.primary} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 14 }}>
        {adding && (
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "40", borderWidth: 2 }]}>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
              <Text style={[st.secTitle, { color: BRAND }]}>📦 {t("باقة جديدة","New Package")}</Text>
              <Pressable onPress={() => setAdding(false)}><Feather name="x" size={20} color={colors.muted} /></Pressable>
            </View>
            {[
              { ph: t("اسم الباقة *","Package Name *"), v: nm, s: setNm },
              { ph: t("سعر الباقة (SAR) *","Package Price (SAR) *"), v: pr, s: setPr, num: true },
              { ph: t("تاريخ انتهاء العرض","Offer Expiry Date"), v: ex, s: setEx },
            ].map((f: any, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted}
                  value={f.v} onChangeText={f.s} textAlign="right" keyboardType={f.num ? "decimal-pad" : "default"} />
              </View>
            ))}
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND, textAlign: "right" }}>{t("المنتجات المشمولة:","Included Products:")}</Text>
            {PRODS.map((s) => {
              const on = sel.includes(s.id);
              return (
                <Pressable key={s.id} style={[st.svcRow, { borderColor: on ? BRAND : colors.border, backgroundColor: on ? BRAND + "10" : "transparent" }]} onPress={() => toggle(s.id)}>
                  <View style={[st.check, { borderColor: on ? BRAND : colors.border, backgroundColor: on ? BRAND : "transparent" }]}>
                    {on && <Feather name="check" size={12} color="#fff" />}
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: "Tajawal_400Regular", color: colors.text, textAlign: "right" }}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: BRAND }}>{s.price} SAR</Text>
                </Pressable>
              );
            })}
            {sel.length > 0 && parseFloat(pr) > 0 && (
              <View style={{ padding: 12, borderRadius: 12, backgroundColor: isDark ? "#120D24" : "#F5F3FF", gap: 4 }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND }}>{parseFloat(pr)} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("سعر الباقة","Package Price")}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("وفّر","Save")} {orig - parseFloat(pr)} SAR ({(((orig - parseFloat(pr)) / orig) * 100).toFixed(0)}%)</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted, textDecorationLine: "line-through" }}>{orig} SAR</Text>
                </View>
              </View>
            )}
            <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: BRAND }} onPress={add}>
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold" }}>{t("إضافة الباقة","Add Package")}</Text>
            </Pressable>
          </View>
        )}

        {pkgs.map((pkg) => {
          const pp = PRODS.filter((s) => pkg.prods.includes(s.id));
          return (
            <View key={pkg.id} style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", opacity: pkg.active ? 1 : 0.6 }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: colors.text, textAlign: "right" }}>{lang === "ar" ? pkg.nameAr : pkg.nameEn}</Text>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted, textAlign: "right" }}>{t("تنتهي:","Expires:")} {pkg.expiry}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: pkg.active ? "#059669" : "#EF4444", alignItems: "center", justifyContent: "center" }}
                    onPress={() => setPkgs((p) => p.map((x) => x.id === pkg.id ? { ...x, active: !x.active } : x))}>
                    <Feather name={pkg.active ? "eye" : "eye-off"} size={14} color="#fff" />
                  </Pressable>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#EF444415", alignItems: "center", justifyContent: "center" }}
                    onPress={() => Alert.alert(t("حذف","Delete"), t("هل أنت متأكد؟","Are you sure?"), [
                      { text: t("إلغاء","Cancel") },
                      { text: t("حذف","Delete"), style: "destructive", onPress: () => setPkgs((p) => p.filter((x) => x.id !== pkg.id)) },
                    ])}>
                    <Feather name="trash-2" size={14} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
              <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 }}>
                {pp.map((s) => (
                  <View key={s.id} style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BRAND + "15", borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: BRAND }}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  </View>
                ))}
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
          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: BRAND + "60", backgroundColor: BRAND + "08" }}
            onPress={() => setAdding(true)}>
            <Feather name="plus" size={20} color={BRAND} />
            <Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("إنشاء باقة جديدة","Create New Package")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  hdr: { flexDirection: "row-reverse", alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  hdrTitle: { flex: 1, fontSize: 18, color: "#fff", fontFamily: "Cairo_700Bold", textAlign: "center" },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  sec: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  secTitle: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 2 },
  inpWrap: { flexDirection: "row-reverse", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  inp: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  svcRow: { flexDirection: "row-reverse", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  check: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
