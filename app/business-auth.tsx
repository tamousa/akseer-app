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
import { BusinessCategory, BUSINESS_TYPE_ROUTES, useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export const BUSINESS_TYPES: {
  key: BusinessCategory;
  label: string;
  sublabel: string;
  emoji: string;
  route: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: "store",   label: "متجر",               sublabel: "منتجات صحية وجمالية",       emoji: "🏪", route: "/business",         icon: "shopping-bag" },
  { key: "clinic",  label: "عيادة",               sublabel: "عيادات طبية ومتخصصة",       emoji: "🏥", route: "/business-clinic",  icon: "activity"     },
  { key: "lab",     label: "مختبر",               sublabel: "فحوصات وتحاليل طبية",       emoji: "🔬", route: "/business-lab",     icon: "thermometer"  },
  { key: "beauty",  label: "عناية وتجميل",        sublabel: "صالونات ومراكز تجميل",      emoji: "💅", route: "/business-beauty",  icon: "scissors"     },
  { key: "cupping", label: "حجامة",               sublabel: "مراكز الحجامة والطب النبوي",emoji: "🩸", route: "/business-cupping", icon: "droplet"      },
  { key: "spa",     label: "مساج وسبا",           sublabel: "مراكز الاسترخاء والعافية",  emoji: "💆", route: "/business-spa",     icon: "heart"        },
  { key: "rehab",   label: "تأهيل وعلاج طبيعي",  sublabel: "مراكز إعادة التأهيل",       emoji: "🦾", route: "/business-rehab",   icon: "trending-up"  },
];

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

type Step = "typeSelect" | "orgForm";

export default function BusinessAuthScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;
  const { login } = useBusiness();

  // ─── Primary colour (matches main app) ───
  const C = colors.primary;

  const [tab, setTab] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<Step>("typeSelect");
  const [accountType, setAccountType] = useState<"org" | "individual" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [loginCategory, setLoginCategory] = useState<BusinessCategory>("clinic");
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword]   = useState(false);

  const [orgName, setOrgName]                           = useState("");
  const [commercialReg, setCommercialReg]               = useState("");
  const [nationalAddress, setNationalAddress]           = useState("");
  const [managerName, setManagerName]                   = useState("");
  const [email, setEmail]                               = useState("");
  const [phone, setPhone]                               = useState("");
  const [password, setPassword]                         = useState("");
  const [branches, setBranches]                         = useState("");
  const [expectedBeneficiaries, setExpectedBeneficiaries] = useState("");
  const [workFrom, setWorkFrom]                         = useState("");
  const [workTo, setWorkTo]                             = useState("");
  const [description, setDescription]                   = useState("");

  const toggleDay = (day: string) =>
    setSelectedDays((p) => p.includes(day) ? p.filter((d) => d !== day) : [...p, day]);

  const activeLoginType = BUSINESS_TYPES.find((t) => t.key === loginCategory)!;

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("خطأ", "يرجى إدخال البريد وكلمة المرور");
      return;
    }
    await login(loginCategory, `${activeLoginType.emoji} ${activeLoginType.label}`);
    router.replace(activeLoginType.route as any);
  };

  const handleRegisterOrg = async () => {
    if (!orgName || !selectedCategory || !commercialReg || !managerName || !email || !phone || !password) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول الإلزامية المُعلَّمة بـ *");
      return;
    }
    const type = BUSINESS_TYPES.find(t => t.key === selectedCategory)!;
    Alert.alert(
      "تم إرسال الطلب ✓",
      "شكراً! سيتم مراجعة طلب تسجيل مؤسستك والرد خلال 48 ساعة عبر البريد الإلكتروني.",
      [{
        text: "دخول مؤقت للعرض",
        onPress: async () => {
          await login(selectedCategory, orgName);
          router.replace(BUSINESS_TYPE_ROUTES[selectedCategory] as any);
        }
      }, { text: "حسناً", onPress: () => router.back() }]
    );
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDFAFF", borderColor: colors.border },
  ];

  const renderLogin = () => (
    <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: 10 }]}>نوع الحساب</Text>
      <View style={styles.loginCatGrid}>
        {BUSINESS_TYPES.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.loginCatChip,
              loginCategory === t.key
                ? { borderColor: C, backgroundColor: C + "18" }
                : { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceAlt : "#F9F9F9" }
            ]}
            onPress={() => setLoginCategory(t.key)}
          >
            <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
            <Text style={[styles.loginCatLabel, { color: loginCategory === t.key ? C : colors.muted }]} numberOfLines={2}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.loginCatBanner, { backgroundColor: C + "12", borderColor: C + "35" }]}>
        <Text style={{ fontSize: 22 }}>{activeLoginType.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[{ fontSize: 14, fontFamily: "Tajawal_700Bold", color: C }]}>{activeLoginType.label}</Text>
          <Text style={[{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted }]}>{activeLoginType.sublabel}</Text>
        </View>
      </View>

      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>البريد الإلكتروني</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceAlt : "#FDFAFF" }]}>
        <TextInput
          placeholder="example@business.com"
          placeholderTextColor={colors.muted}
          value={loginEmail}
          onChangeText={setLoginEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.inputInner, { color: colors.text }]}
          textAlign="right"
        />
        <Feather name="mail" size={16} color={colors.muted} style={{ marginLeft: 8 }} />
      </View>

      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>كلمة المرور</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceAlt : "#FDFAFF" }]}>
        <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
          <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.muted} />
        </Pressable>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry={!showPassword}
          style={[styles.inputInner, { color: colors.text }]}
          textAlign="right"
        />
        <Feather name="lock" size={16} color={colors.muted} style={{ marginLeft: 8 }} />
      </View>

      <Pressable onPress={() => Alert.alert("استعادة كلمة المرور", "سيتم إرسال رابط الاستعادة لبريدك الإلكتروني")}>
        <Text style={[styles.forgotText, { color: C }]}>نسيت كلمة المرور؟</Text>
      </Pressable>
      <Pressable style={[styles.primaryBtn, { backgroundColor: C }]} onPress={handleLogin}>
        <Feather name="log-in" size={18} color="#fff" />
        <Text style={styles.primaryBtnText}>دخول لوحة {activeLoginType.label}</Text>
      </Pressable>
    </View>
  );

  const renderAccountTypeSelect = () => (
    <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>نوع الحساب</Text>
      <Text style={[styles.sectionSub, { color: colors.muted }]}>اختر نوع الحساب الذي تريد إنشاءه</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typeCard, {
            borderColor: accountType === "individual" ? C : colors.border,
            backgroundColor: accountType === "individual" ? C + "12" : isDark ? colors.surfaceAlt : "#FDFAFF",
          }]}
          onPress={() => setAccountType("individual")}
        >
          <View style={[styles.typeIconBg, { backgroundColor: accountType === "individual" ? C : C + "20" }]}>
            <Feather name="user" size={22} color={accountType === "individual" ? "#fff" : C} />
          </View>
          <Text style={[styles.typeCardTitle, { color: colors.text }]}>أفراد</Text>
          <Text style={[styles.typeCardSub, { color: colors.muted }]}>مختصون وخبراء مستقلون</Text>
        </Pressable>
        <Pressable
          style={[styles.typeCard, {
            borderColor: accountType === "org" ? C : colors.border,
            backgroundColor: accountType === "org" ? C + "12" : isDark ? colors.surfaceAlt : "#FDFAFF",
          }]}
          onPress={() => setAccountType("org")}
        >
          <View style={[styles.typeIconBg, { backgroundColor: accountType === "org" ? C : C + "20" }]}>
            <Feather name="briefcase" size={22} color={accountType === "org" ? "#fff" : C} />
          </View>
          <Text style={[styles.typeCardTitle, { color: colors.text }]}>مؤسسات</Text>
          <Text style={[styles.typeCardSub, { color: colors.muted }]}>متاجر وعيادات وصالونات والمزيد</Text>
        </Pressable>
      </View>
      {accountType === "individual" && (
        <View style={[styles.comingSoonBadge, { backgroundColor: "#FFF7ED", borderColor: "#FDE68A" }]}>
          <Feather name="clock" size={14} color="#D97706" />
          <Text style={styles.comingSoonText}>تسجيل الأفراد قريباً</Text>
        </View>
      )}
      {accountType === "org" && (
        <Pressable style={[styles.primaryBtn, { backgroundColor: C }]} onPress={() => setRegisterStep("orgForm")}>
          <Text style={styles.primaryBtnText}>متابعة ←</Text>
        </Pressable>
      )}
    </View>
  );

  const renderOrgForm = () => (
    <>
      {/* Back to type select */}
      <Pressable style={styles.stepBack} onPress={() => setRegisterStep("typeSelect")}>
        <Feather name="chevron-right" size={18} color={C} />
        <Text style={[styles.stepBackText, { color: C }]}>العودة</Text>
      </Pressable>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="briefcase" size={16} color={C} />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>بيانات المؤسسة</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>اسم المؤسسة (المعتمد من وزارة التجارة) *</Text>
          <TextInput placeholder="مثال: شركة الصحة والجمال لتجارة التجزئة" placeholderTextColor={colors.muted} value={orgName} onChangeText={setOrgName} style={inputStyle} textAlign="right" />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>فئة الحساب *</Text>
          <View style={styles.categoryGrid}>
            {BUSINESS_TYPES.map((bt) => (
              <Pressable
                key={bt.key}
                style={[styles.categoryChip, {
                  borderColor: selectedCategory === bt.key ? C : colors.border,
                  backgroundColor: selectedCategory === bt.key ? C : isDark ? colors.surfaceAlt : "#FDFAFF",
                }]}
                onPress={() => setSelectedCategory(bt.key)}
              >
                <Text style={{ fontSize: 14 }}>{bt.emoji}</Text>
                <Text style={[styles.categoryChipText, { color: selectedCategory === bt.key ? "#fff" : colors.textSecondary }]}>
                  {bt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedCategory && (
            <View style={[styles.catInfoBox, { backgroundColor: C + "12", borderColor: C + "35" }]}>
              <Feather name="info" size={13} color={C} />
              <Text style={[styles.catInfoText, { color: colors.textSecondary }]}>
                {BUSINESS_TYPES.find(t => t.key === selectedCategory)?.sublabel}
              </Text>
            </View>
          )}

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>رقم السجل التجاري *</Text>
          <TextInput placeholder="10 أرقام" placeholderTextColor={colors.muted} value={commercialReg} onChangeText={setCommercialReg} keyboardType="numeric" style={inputStyle} textAlign="right" maxLength={10} />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>الموقع الجغرافي - العنوان الوطني *</Text>
          <TextInput placeholder="المنطقة / المدينة / الحي / الشارع / المبنى" placeholderTextColor={colors.muted} value={nationalAddress} onChangeText={setNationalAddress} style={[inputStyle, { minHeight: 70, textAlignVertical: "top", paddingTop: 12 }]} textAlign="right" multiline />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={16} color={C} />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>بيانات مدير الحساب</Text>
          </View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>اسم مدير الحساب الثلاثي *</Text>
          <TextInput placeholder="الاسم الأول والأب والعائلة" placeholderTextColor={colors.muted} value={managerName} onChangeText={setManagerName} style={inputStyle} textAlign="right" />
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>البريد الإلكتروني *</Text>
          <TextInput placeholder="example@business.com" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={inputStyle} textAlign="right" />
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>رقم الجوال *</Text>
          <TextInput placeholder="05XXXXXXXX" placeholderTextColor={colors.muted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={inputStyle} textAlign="right" maxLength={10} />
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>كلمة المرور *</Text>
          <TextInput placeholder="8 أحرف على الأقل" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry style={inputStyle} textAlign="right" />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="settings" size={16} color={C} />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>تفاصيل تشغيلية</Text>
          </View>
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>عدد الفروع</Text>
              <TextInput placeholder="0" placeholderTextColor={colors.muted} value={branches} onChangeText={setBranches} keyboardType="numeric" style={inputStyle} textAlign="right" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>المستفيدون المتوقعون</Text>
              <TextInput placeholder="مثال: 500" placeholderTextColor={colors.muted} value={expectedBeneficiaries} onChangeText={setExpectedBeneficiaries} keyboardType="numeric" style={inputStyle} textAlign="right" />
            </View>
          </View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>أيام العمل</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <Pressable key={day}
                style={[styles.dayChip, {
                  borderColor: selectedDays.includes(day) ? C : colors.border,
                  backgroundColor: selectedDays.includes(day) ? C : isDark ? colors.surfaceAlt : "#FDFAFF",
                }]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayChipText, { color: selectedDays.includes(day) ? "#fff" : colors.textSecondary }]}>{day}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>من الساعة</Text>
              <TextInput placeholder="08:00" placeholderTextColor={colors.muted} value={workFrom} onChangeText={setWorkFrom} style={inputStyle} textAlign="right" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>حتى الساعة</Text>
              <TextInput placeholder="22:00" placeholderTextColor={colors.muted} value={workTo} onChangeText={setWorkTo} style={inputStyle} textAlign="right" />
            </View>
          </View>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>نبذة عن المؤسسة</Text>
          <TextInput placeholder="اكتب وصفاً مختصراً يعرّف بنشاطك وما تقدمه..." placeholderTextColor={colors.muted} value={description} onChangeText={setDescription} multiline style={[inputStyle, { minHeight: 90, textAlignVertical: "top", paddingTop: 12 }]} textAlign="right" />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.cardBorder }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="paperclip" size={16} color={C} />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>المرفقات</Text>
          </View>
          <Text style={[styles.sectionSub, { color: colors.muted, textAlign: "right", marginBottom: 14 }]}>
            الملفات المطلوبة لإتمام التحقق من هوية المؤسسة
          </Text>
          {[
            { icon: "file-text" as const, label: "نسخة من السجل التجاري", required: true },
            { icon: "image" as const,     label: "شعار المتجر / المؤسسة",  required: true },
            { icon: "camera" as const,    label: "صور للمتجر أو المنشأة",   required: false },
          ].map((att, i) => (
            <Pressable key={i}
              style={[styles.attachBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceAlt : "#FDFAFF" }]}
              onPress={() => Alert.alert("رفع ملف", `سيتم فتح متصفح الملفات لرفع: ${att.label}`)}
            >
              <View style={styles.attachBtnInner}>
                <View style={[styles.attachIcon, { backgroundColor: C + "18" }]}>
                  <Feather name={att.icon} size={18} color={C} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.attachLabel, { color: colors.text }]}>{att.label}</Text>
                  {att.required && <Text style={[styles.attachRequired, { color: "#EF4444" }]}>مطلوب</Text>}
                </View>
                <View style={[styles.uploadBtn, { backgroundColor: C + "18" }]}>
                  <Feather name="upload" size={14} color={C} />
                  <Text style={[styles.uploadBtnText, { color: C }]}>رفع</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.termsCard, { backgroundColor: isDark ? colors.surfaceAlt : C + "0A", borderColor: C + "35" }]}>
        <Feather name="shield" size={16} color={C} />
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          بإرسال هذا الطلب، فإنك توافق على{" "}
          <Text style={{ color: C }}>شروط وأحكام</Text> منصة أكسير أعمال{" "}
          و<Text style={{ color: C }}>سياسة الخصوصية</Text>. سيتم مراجعة طلبك خلال{" "}
          <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>48 ساعة</Text>.
        </Text>
      </View>

      <Pressable style={[styles.submitBtn, { backgroundColor: C }]} onPress={handleRegisterOrg}>
        <Feather name="send" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>إرسال طلب التسجيل</Text>
      </Pressable>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPadding + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.logoContainer}>
          <View style={styles.logoStack}>
            <View style={[styles.logoBriefcase, { backgroundColor: C }]}>
              <Feather name="briefcase" size={36} color="#fff" />
            </View>
            <View style={styles.logoDropWrapper}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoDropImg} resizeMode="contain" />
            </View>
          </View>
          <Text style={[styles.logoTitle, { color: colors.text }]}>أكسير أعمال</Text>
          <Text style={[styles.logoSub, { color: colors.textSecondary }]}>
            منصة إدارة المتاجر والعيادات والمختبرات ومراكز الصحة والجمال
          </Text>
        </View>

        <View style={[styles.tabRow, { backgroundColor: isDark ? colors.surface : colors.surfaceAlt, borderColor: C + "30" }]}>
          <Pressable
            style={[styles.tabBtn, tab === "register" && [styles.tabActive, { backgroundColor: C }]]}
            onPress={() => { setTab("register"); setRegisterStep("typeSelect"); }}
          >
            <Text style={[styles.tabText, { color: tab === "register" ? "#fff" : colors.muted }]}>حساب جديد</Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, tab === "login" && [styles.tabActive, { backgroundColor: C }]]}
            onPress={() => setTab("login")}
          >
            <Text style={[styles.tabText, { color: tab === "login" ? "#fff" : colors.muted }]}>دخول</Text>
          </Pressable>
        </View>

        {tab === "login" ? renderLogin() : (
          <>
            {registerStep === "typeSelect" && renderAccountTypeSelect()}
            {registerStep === "orgForm" && renderOrgForm()}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, gap: 16 },
  backRow: { flexDirection: "row-reverse", marginBottom: 8 },
  logoContainer: { alignItems: "center", marginBottom: 8, gap: 6 },
  logoStack: { position: "relative", width: 80, height: 80, marginBottom: 4 },
  logoBriefcase: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  logoDropWrapper: { position: "absolute", bottom: -6, right: -6, width: 36, height: 36, borderRadius: 18, overflow: "hidden", backgroundColor: "#fff", borderWidth: 2, borderColor: "#fff" },
  logoDropImg: { width: 32, height: 32 },
  logoTitle: { fontSize: 24, fontFamily: "Cairo_700Bold" },
  logoSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  tabRow: { flexDirection: "row-reverse", borderRadius: 14, padding: 4, borderWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  tabActive: {},
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  card: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  sectionTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4, padding: 16, paddingBottom: 0 },
  sectionSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 12 },
  typeRow: { flexDirection: "row-reverse", gap: 12, marginBottom: 12, padding: 16, paddingTop: 0 },
  typeCard: { flex: 1, borderRadius: 16, borderWidth: 2, padding: 16, alignItems: "center", gap: 8 },
  typeIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  typeCardTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  typeCardSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  comingSoonBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, margin: 16, marginTop: 0 },
  comingSoonText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#D97706" },
  primaryBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center", flexDirection: "row-reverse", justifyContent: "center", gap: 8, margin: 16, marginTop: 0 },
  primaryBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  formSection: { padding: 16, gap: 4 },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 12 },
  formSectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  fieldLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 6, marginTop: 4, textAlign: "right" },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Tajawal_400Regular", marginBottom: 4 },
  inputWrap: { flexDirection: "row-reverse", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 4 },
  inputInner: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular", paddingVertical: 10 },
  categoryGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  categoryChip: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  categoryChipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  catInfoBox: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 4 },
  catInfoText: { fontSize: 12, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  twoCol: { flexDirection: "row-reverse", gap: 12 },
  daysRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  dayChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  dayChipText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  attachBtn: { borderRadius: 12, borderWidth: 1, marginBottom: 8, overflow: "hidden" },
  attachBtnInner: { flexDirection: "row-reverse", alignItems: "center", padding: 12, gap: 12 },
  attachIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  attachLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  attachRequired: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  uploadBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  uploadBtnText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  termsCard: { flexDirection: "row-reverse", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  termsText: { fontSize: 12, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right", lineHeight: 20 },
  submitBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 18 },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
  forgotText: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "left", marginBottom: 6 },
  loginCatGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 14, padding: 16, paddingBottom: 0 },
  loginCatChip: { width: "30%", flexGrow: 1, alignItems: "center", paddingVertical: 10, paddingHorizontal: 6, borderRadius: 12, borderWidth: 1.5, gap: 4, minWidth: 85 },
  loginCatLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  loginCatBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, marginBottom: 14, marginHorizontal: 16 },
  stepBack: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  stepBackText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
