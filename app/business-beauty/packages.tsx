import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, I18nManager, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const SAMPLE_SERVICES = [
  { id: "1", nameAr: "قص وتصفيف الشعر", nameEn: "Cut & Style", price: 120 },
  { id: "2", nameAr: "صبغ شعر كامل", nameEn: "Full Hair Color", price: 280 },
  { id: "3", nameAr: "تنظيف بشرة", nameEn: "Facial Cleansing", price: 160 },
  { id: "4", nameAr: "مكياج احتفالي", nameEn: "Occasion Makeup", price: 350 },
  { id: "5", nameAr: "مانيكير وبيديكير", nameEn: "Mani & Pedi", price: 140 },
  { id: "6", nameAr: "إزالة شمع كاملة", nameEn: "Full Waxing", price: 200 },
];

const INIT_PKGS = [
  { id: "1", nameAr: "باقة العروس الذهبية", nameEn: "Golden Bride Package", services: ["1","2","4"], price: 620, origPrice: 750, expiry: "31/12/2026", active: true },
  { id: "2", nameAr: "باقة العناية الشاملة", nameEn: "Full Care Package", services: ["3","5","6"], price: 420, origPrice: 500, expiry: "30/06/2026", active: true },
];

export default function BeautyPackages() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const BRAND = colors.primary;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t, lang } = useLanguage();
  const bg = isDark ? "#150010" : "#FFF0F6";
  const card = isDark ? "#2D0020" : "#fff";

  const [pkgs, setPkgs] = useState(INIT_PKGS);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [selServices, setSelServices] = useState<string[]>([]);

  const toggleSvc = (id: string) => setSelServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const origPrice = selServices.reduce((sum, id) => sum + (SAMPLE_SERVICES.find((s) => s.id === id)?.price || 0), 0);
  const savings = origPrice - (parseFloat(newPrice) || 0);

  const addPkg = () => {
    if (!newName.trim() || !newPrice.trim() || selServices.length === 0) return Alert.alert(t("تنبيه","Notice"), t("يرجى إدخال الاسم والسعر واختيار خدمة واحدة على الأقل","Please enter name, price, and select at least one service"));
    const pkg = { id: Date.now().toString(), nameAr: newName, nameEn: newName, services: selServices, price: parseFloat(newPrice), origPrice, expiry: newExpiry || t("بلا انتهاء","No expiry"), active: true };
    setPkgs((prev) => [pkg, ...prev]);
    setNewName(""); setNewPrice(""); setNewExpiry(""); setSelServices([]); setAdding(false);
  };

  const toggleActive = (id: string) => setPkgs((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const deletePkg = (id: string) => Alert.alert(t("حذف الباقة","Delete Package"), t("هل أنت متأكد؟","Are you sure?"), [{ text: t("إلغاء","Cancel"), style: "cancel" }, { text: t("حذف","Delete"), style: "destructive", onPress: () => setPkgs((prev) => prev.filter((p) => p.id !== id)) }]);

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={[st.hdr, { backgroundColor: colors.surface, paddingTop: isWeb ? 72 : insets.top + 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Pressable style={st.back} onPress={() => router.back()}><Feather name="chevron-right" size={22} color="#fff" /></Pressable>
        <Text style={st.hdrTitle}>{t("إدارة الباقات","Manage Packages")}</Text>
        <Pressable style={[st.addBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => setAdding(true)}><Feather name="plus" size={20} color={colors.primary} /></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90, gap: 14 }}>
        {adding && (
          <View style={[st.sec, { backgroundColor: card, borderColor: BRAND + "40", borderWidth: 2 }]}>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[st.secTitle, { color: BRAND }]}>✨ {t("إنشاء باقة جديدة","Create New Package")}</Text>
              <Pressable onPress={() => setAdding(false)}><Feather name="x" size={20} color={colors.muted} /></Pressable>
            </View>
            {[
              { ph: t("اسم الباقة *","Package Name *"), val: newName, set: setNewName },
              { ph: t("سعر الباقة بعد الخصم (SAR) *","Package Price (SAR) *"), val: newPrice, set: setNewPrice, num: true },
              { ph: t("تاريخ الانتهاء","Expiry Date"), val: newExpiry, set: setNewExpiry },
            ].map((f: any, i) => (
              <View key={i} style={[st.inpWrap, { borderColor: colors.border }]}>
                <TextInput style={[st.inp, { color: colors.text }]} placeholder={f.ph} placeholderTextColor={colors.muted} value={f.val} onChangeText={f.set} textAlign="right" keyboardType={f.num ? "decimal-pad" : "default"} />
              </View>
            ))}
            <Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND, textAlign: "right" }}>{t("اختر الخدمات المشمولة:","Select Included Services:")}</Text>
            {SAMPLE_SERVICES.map((svc) => {
              const sel = selServices.includes(svc.id);
              return (
                <Pressable key={svc.id} style={[st.svcRow, { borderColor: sel ? BRAND : colors.border, backgroundColor: sel ? BRAND + "10" : "transparent" }]} onPress={() => toggleSvc(svc.id)}>
                  <View style={[st.check, { borderColor: sel ? BRAND : colors.border, backgroundColor: sel ? BRAND : "transparent" }]}>{sel && <Feather name="check" size={12} color="#fff" />}</View>
                  <Text style={{ flex: 1, fontSize: 13, fontFamily: "Tajawal_400Regular", color: colors.text, textAlign: "right" }}>{lang === "ar" ? svc.nameAr : svc.nameEn}</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: BRAND }}>{svc.price} SAR</Text>
                </Pressable>
              );
            })}
            {selServices.length > 0 && (
              <View style={{ borderRadius: 12, padding: 12, backgroundColor: isDark ? "#1A0018" : "#FFF0F6", gap: 6 }}>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: colors.text }}>{origPrice} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted }}>{t("السعر الأصلي","Original Price")}</Text></View>
                {parseFloat(newPrice) > 0 && <><View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 14, fontFamily: "Cairo_700Bold", color: "#059669" }}>{parseFloat(newPrice)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: "#059669" }}>{t("سعر الباقة","Package Price")}</Text></View>
                <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><Text style={{ fontSize: 16, fontFamily: "Cairo_700Bold", color: BRAND }}>{t("وفّر","Save")} {savings.toFixed(0)} SAR</Text><Text style={{ fontSize: 12, fontFamily: "Tajawal_700Bold", color: BRAND }}>({((savings / origPrice) * 100).toFixed(0)}% {t("توفير","savings")})</Text></View></>}
              </View>
            )}
            <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: BRAND }} onPress={addPkg}>
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Cairo_700Bold" }}>{t("إضافة الباقة","Add Package")}</Text>
            </Pressable>
          </View>
        )}
        {pkgs.map((pkg) => {
          const pkgSvcs = SAMPLE_SERVICES.filter((s) => pkg.services.includes(s.id));
          return (
            <View key={pkg.id} style={[st.sec, { backgroundColor: card, borderColor: BRAND + "20", opacity: pkg.active ? 1 : 0.6 }]}>
              <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: "Cairo_700Bold", color: colors.text, textAlign: "right" }}>{lang === "ar" ? pkg.nameAr : pkg.nameEn}</Text>
                  <Text style={{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted, textAlign: "right", marginTop: 2 }}>{t("تنتهي:","Expires:")} {pkg.expiry}</Text>
                </View>
                <View style={{ flexDirection: "row-reverse", gap: 8, alignItems: "center" }}>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: pkg.active ? "#059669" : "#EF4444" }} onPress={() => toggleActive(pkg.id)}>
                    <Feather name={pkg.active ? "eye" : "eye-off"} size={14} color="#fff" />
                  </Pressable>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: BRAND + "15", alignItems: "center", justifyContent: "center" }} onPress={() => Alert.alert(t("تعديل","Edit"), t("افتح محرر الباقة","Open package editor"))}>
                    <Feather name="edit-2" size={14} color={BRAND} />
                  </Pressable>
                  <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#EF444415", alignItems: "center", justifyContent: "center" }} onPress={() => deletePkg(pkg.id)}>
                    <Feather name="trash-2" size={14} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
              <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 6 }}>
                {pkgSvcs.map((s) => (
                  <View key={s.id} style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BRAND + "15", borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontFamily: "Tajawal_700Bold", color: BRAND }}>{lang === "ar" ? s.nameAr : s.nameEn}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 12 }}>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Cairo_700Bold", color: BRAND }}>{pkg.price} SAR</Text>
                  <Text style={{ fontSize: 12, fontFamily: "Tajawal_400Regular", color: colors.muted, textDecorationLine: "line-through" }}>{pkg.origPrice} SAR</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#059669" + "20", borderRadius: 10 }}>
                  <Text style={{ fontSize: 12, fontFamily: "Cairo_700Bold", color: "#059669" }}>{t("وفّر","Save")} {pkg.origPrice - pkg.price} SAR</Text>
                </View>
              </View>
            </View>
          );
        })}
        {!adding && (
          <Pressable style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: BRAND + "60", backgroundColor: BRAND + "08" }} onPress={() => setAdding(true)}>
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
