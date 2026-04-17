import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const SVCS = [
  { id: "1", nameAr: "حجامة رطبة للظهر", nameEn: "Wet Back Cupping", price: 180 },
  { id: "2", nameAr: "حجامة جافة للرأس", nameEn: "Dry Head Cupping", price: 120 },
  { id: "3", nameAr: "حجامة الوجه", nameEn: "Facial Cupping", price: 150 },
  { id: "4", nameAr: "حجامة الأطراف", nameEn: "Limb Cupping", price: 100 },
  { id: "5", nameAr: "جلسة زيت نبوي", nameEn: "Black Seed Oil Session", price: 80 },
];

const INIT = [
  { id: "1", nameAr: "باقة التنقية الكاملة", nameEn: "Full Cleansing Package", svcs: ["1","2"], price: 250, orig: 300, expiry: "30/06/2026", active: true },
  { id: "2", nameAr: "باقة الجلسة الشهرية", nameEn: "Monthly Session Package", svcs: ["1","3","5"], price: 350, orig: 410, expiry: "31/12/2026", active: true },
];

export default function CuppingPackages() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = colors.surface;
  const card = colors.surface;

  const [pkgs, setPkgs] = useState(INIT);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) => setSel((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const orig = sel.reduce((s, id) => s + (SVCS.find((x) => x.id === id)?.price || 0), 0);

  const add = () => {
    if (!newName.trim() || !newPrice || sel.length === 0) return Alert.alert(t("تنبيه","Notice"), t("أدخل الاسم والسعر واختر جلسة على الأقل","Enter name, price, and select at least one session"));
    setPkgs((prev) => [{ id: Date.now().toString(), nameAr: newName, nameEn: newName, svcs: sel, price: parseFloat(newPrice), orig, expiry: newExpiry || t("بلا انتهاء","No expiry"), active: true }, ...prev]);
    setNewName(""); setNewPrice(""); setNewExpiry(""); setSel([]); setAdding(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[st.hdr, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
        <Text style={st.hdrTitle}>{t("باقات الحجامة","Cupping Packages")}</Text>
        <Pressable style={[st.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => setAdding(true)}><Feather name="plus" size={20} color={colors.primary} /></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 14 }}>
        {adding && (
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "40", borderWidth: 2 }]}>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
              <Text style={[st.secTitle, { color: BRAND }]}>{t("باقة جديدة","New Package")}</Text>
              <Pressable onPress={() => setAdding(false)}><Feather name="x" size={20} color={colors.muted} /></Pressable>
            </View>
            {[
              { ph: t("اسم الباقة *","Package Name *"), val: newName, set: setNewName },
              { ph: t("سعر الباقة (SAR) *","Package Price (SAR) *"), val: newPrice, set: setNewPrice, num: true },
              { ph: t("تاريخ الانتهاء","Expiry Date"), val: newExpiry, set: setNewExpiry },
            ].map((f: any, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted} value={f.val} onChangeText={f.set} textAlign="right" keyboardType={f.num ? "decimal-pad" : "default"} />
              </View>
            ))}
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND, textAlign: "right" }}>{t("اختر الجلسات:","Select Sessions:")}</Text>
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
            {sel.length > 0 && parseFloat(newPrice) > 0 && (
              <View style={{ padding: 12, borderRadius: 12, backgroundColor: colors.surface, gap: 4 }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: BRAND }}>{parseFloat(newPrice)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("سعر الباقة","Package Price")}</Text></View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("وفّر","Save")} {orig - parseFloat(newPrice)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#059669" }}>({(((orig - parseFloat(newPrice)) / orig) * 100).toFixed(0)}%)</Text></View>
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
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted, textAlign: "right" }}>{t("تنتهي:","Expires:")} {pkg.expiry}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: pkg.active ? "#059669" : "#EF4444", alignItems: "center", justifyContent: "center" }} onPress={() => setPkgs((prev) => prev.map((p) => p.id === pkg.id ? { ...p, active: !p.active } : p))}>
                    <Feather name={pkg.active ? "eye" : "eye-off"} size={14} color="#fff" />
                  </Pressable>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#EF444415", alignItems: "center", justifyContent: "center" }} onPress={() => Alert.alert(t("حذف","Delete"), t("هل أنت متأكد؟","Are you sure?"), [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("حذف","Delete"), style: "destructive", onPress: () => setPkgs((prev) => prev.filter((p) => p.id !== pkg.id)) }])}>
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
