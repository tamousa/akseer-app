import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import LangToggle from "@/components/LangToggle";

I18nManager.forceRTL(true);

export default function AuthScreen() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { login, loginAsGuest } = useApp();
  const isWeb = Platform.OS === "web";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);

  const topPadding = isWeb ? 67 : insets.top;

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t("خطأ", "Error"), t("يرجى إدخال البريد وكلمة المرور", "Please enter email and password"));
      return;
    }
    login(email);
    router.replace("/(tabs)");
  };

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert(t("خطأ", "Error"), t("يرجى ملء جميع الحقول", "Please fill all fields"));
      return;
    }
    login(email);
    router.replace("/onboarding");
  };

  const handleGuest = () => {
    loginAsGuest();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPadding + 40, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ position: "absolute", top: topPadding + 12, right: 20 }}>
          <LangToggle />
        </View>

        <View style={styles.logoContainer}>
          <View style={[styles.logoBg, { backgroundColor: isDark ? "#1C1330" : "#F9EFF5" }]}>
            <Image source={require("@/assets/images/logo.png")} style={styles.logoImg} resizeMode="contain" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>{t("اكسير", "Akseer")}</Text>
          <Text style={[styles.logoSub, { color: colors.muted }]}>{t("الصحة والعناية والجمال", "Health, Care & Beauty")}</Text>
        </View>

        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, tab === "register" && styles.tabActive]}
            onPress={() => setTab("register")}
          >
            <Text style={[styles.tabText, { color: tab === "register" ? "#C490D8" : colors.muted }]}>
              {t("حساب جديد", "Sign Up")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, tab === "login" && styles.tabActive]}
            onPress={() => setTab("login")}
          >
            <Text style={[styles.tabText, { color: tab === "login" ? "#C490D8" : colors.muted }]}>
              {t("دخول", "Login")}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
          {tab === "register" && (
            <TextInput
              placeholder={t("الاسم الكامل", "Full Name")}
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
              textAlign="right"
            />
          )}

          <TextInput
            placeholder={t("البريد الإلكتروني", "Email")}
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
            textAlign="right"
          />

          <TextInput
            placeholder={t("كلمة المرور", "Password")}
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
            textAlign="right"
          />

          {tab === "login" && (
            <View style={styles.optionsRow}>
              <Pressable onPress={() => Alert.alert(t("نسيت كلمة المرور", "Forgot Password"), t("سيتم إرسال رابط إعادة التعيين", "A reset link will be sent"))}>
                <Text style={[styles.forgotText, { color: "#C490D8" }]}>{t("نسيت كلمة المرور؟", "Forgot password?")}</Text>
              </Pressable>
              <Pressable style={styles.rememberRow} onPress={() => setRemember(!remember)}>
                <Text style={[styles.rememberText, { color: colors.textSecondary }]}>{t("تذكرني", "Remember me")}</Text>
                <View style={[styles.checkbox, { borderColor: "#C490D8", backgroundColor: remember ? "#C490D8" : "transparent" }]}>
                  {remember && <Feather name="check" size={12} color="#fff" />}
                </View>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={tab === "login" ? handleLogin : handleRegister}>
            <Text style={styles.primaryBtnText}>
              {tab === "login" ? t("تسجيل الدخول", "Sign In") : t("إنشاء حساب", "Create Account")}
            </Text>
          </Pressable>
        </View>

        <Pressable style={[styles.guestBtn, { borderColor: colors.border }]} onPress={handleGuest}>
          <Text style={[styles.guestBtnText, { color: colors.textSecondary }]}>
            {t("دخول بدون تسجيل", "Continue as Guest")}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.businessBtn, { backgroundColor: isDark ? colors.surface : "#F0EBFF", borderColor: colors.border }]}
          onPress={() => router.push("/business-auth" as any)}
        >
          <View style={styles.businessBtnInner}>
            <View style={[styles.businessIcon, { backgroundColor: "#A86DBF" }]}>
              <Feather name="briefcase" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.businessTitle, { color: colors.text }]}>{t("أكسير أعمال", "Akseer Business")}</Text>
              <Text style={[styles.businessSub, { color: colors.muted }]}>{t("بوابة العيادات والمتاجر والمختصين", "Portal for clinics, stores & specialists")}</Text>
            </View>
            <Feather name="chevron-left" size={18} color={colors.muted} />
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", paddingHorizontal: 24 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoBg: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  logoImg: { width: 50, height: 50 },
  logoText: { fontSize: 36, fontFamily: "Cairo_700Bold" },
  logoSub: { fontSize: 14, fontFamily: "Tajawal_400Regular", marginTop: 4 },
  tabRow: { flexDirection: "row-reverse", marginBottom: 24, gap: 0, width: "100%" },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: "#C490D8" },
  tabText: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  card: { width: "100%", borderRadius: 24, padding: 24, borderWidth: 1, marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: "Tajawal_400Regular", marginBottom: 14 },
  optionsRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  rememberRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  rememberText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  forgotText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  primaryBtn: { borderRadius: 14, paddingVertical: 16, alignItems: "center", backgroundColor: "#A86DBF" },
  primaryBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  guestBtn: { width: "100%", borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, marginBottom: 16 },
  guestBtnText: { fontSize: 15, fontFamily: "Tajawal_500Medium" },
  businessBtn: { width: "100%", borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  businessBtnInner: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  businessIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  businessTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  businessSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
});
