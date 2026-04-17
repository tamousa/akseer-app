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
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

export type BusinessCategory =
  | "store" | "clinic" | "lab" | "beauty" | "cupping" | "spa" | "rehab";

export const BUSINESS_TYPES: {
  key: BusinessCategory;
  label: string;
  sublabel: string;
  emoji: string;
  color: string;
  route: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: "store",   label: "متجر",                  sublabel: "منتجات صحية وجمالية",       emoji: "🏪", color: "#7C3AED", route: "/business",         icon: "shopping-bag" },
  { key: "clinic",  label: "عيادة",                  sublabel: "عيادات طبية ومتخصصة",        emoji: "🏥", color: "#0E7490", route: "/business-clinic",  icon: "activity"     },
  { key: "lab",     label: "مختبر",                  sublabel: "فحوصات وتحاليل طبية",        emoji: "🔬", color: "#0369A1", route: "/business-lab",    icon: "thermometer"  },
  { key: "beauty",  label: "عناية وتجميل",           sublabel: "صالونات ومراكز تجميل",       emoji: "💅", color: "#BE185D", route: "/business-beauty", icon: "scissors"     },
  { key: "cupping", label: "حجامة",                  sublabel: "مراكز الحجامة والطب النبوي", emoji: "🩸", color: "#92400E", route: "/business-cupping",icon: "droplet"      },
  { key: "spa",     label: "مساج وسبا",              sublabel: "مراكز الاسترخاء والعافية",   emoji: "💆", color: "#6366F1", route: "/business-spa",    icon: "heart"        },
  { key: "rehab",   label: "تأهيل وعلاج طبيعي",     sublabel: "مراكز إعادة التأهيل",        emoji: "🦾", color: "#059669", route: "/business-rehab",  icon: "trending-up"  },
];

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export default function BusinessAuthScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;

  const [tab, setTab] = useState<"login" | "register">("register");
  const [accountType, setAccountType] = useState<"org" | "individual" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [loginCategory, setLoginCategory] = useState<BusinessCategory>("store");
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("خطأ", "يرجى إدخال البريد وكلمة المرور");
      return;
    }
    router.replace(activeLoginType.route as any);
  };

  const handleRegisterOrg = () => {
    if (!orgName || !selectedCategory || !commercialReg || !managerName || !email || !phone || !password) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول الإلزامية");
      return;
    }
    Alert.alert(
      "تم إرسال الطلب ✓",
      "شكراً! سيتم مراجعة طلب تسجيل مؤسستك والرد خلال 48 ساعة عبر البريد الإلكتروني.",
      [{ text: "حسناً", onPress: () => router.back() }]
    );
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF8FF", borderColor: colors.border },
  ];

  const renderLogin = () => (
    <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: 10 }]}>نوع الحساب</Text>
      <View style={styles.loginCatGrid}>
        {BUSINESS_TYPES.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.loginCatChip,
              loginCategory === t.key
                ? { borderColor: t.color, backgroundColor: t.color + "20" }
                : { borderColor: isDark ? colors.border : "#E5E7EB", backgroundColor: isDark ? colors.surfaceAlt : "#F9F9F9" }
            ]}
            onPress={() => setLoginCategory(t.key)}
          >
            <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
            <Text style={[styles.loginCatLabel, { color: loginCategory === t.key ? t.color : colors.muted }]} numberOfLines={2}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loginCategory && (
        <View style={[styles.loginCatBanner, { backgroundColor: activeLoginType.color + "15", borderColor: activeLoginType.color + "40" }]}>
          <Text style={{ fontSize: 22 }}>{activeLoginType.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[{ fontSize: 14, fontFamily: "Tajawal_700Bold", color: activeLoginType.color }]}>{activeLoginType.label}</Text>
            <Text style={[{ fontSize: 11, fontFamily: "Tajawal_400Regular", color: colors.muted }]}>{activeLoginType.sublabel}</Text>
          </View>
        </View>
      )}

      <TextInput
        placeholder="البريد الإلكتروني"
        placeholderTextColor={colors.muted}
        value={loginEmail}
        onChangeText={setLoginEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle}
        textAlign="right"
      />
      <TextInput
        placeholder="كلمة المرور"
        placeholderTextColor={colors.muted}
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
        style={inputStyle}
        textAlign="right"
      />
      <Pressable onPress={() => Alert.alert("استعادة كلمة المرور", "سيتم إرسال رابط الاستعادة لبريدك الإلكتروني")}>
        <Text style={[styles.forgotText, { color: "#8B5CF6" }]}>نسيت كلمة المرور؟</Text>
      </Pressable>
      <Pressable
        style={[styles.primaryBtn, { backgroundColor: activeLoginType.color }]}
        onPress={handleLogin}
      >
        <Text style={styles.primaryBtnText}>{activeLoginType.emoji} دخول لوحة {activeLoginType.label}</Text>
      </Pressable>
    </View>
  );

  const renderAccountTypeSelect = () => (
    <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>نوع الحساب</Text>
      <Text style={[styles.sectionSub, { color: colors.muted }]}>اختر نوع الحساب الذي تريد إنشاءه</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typeCard,
            { borderColor: accountType === "individual" ? "#8B5CF6" : colors.border,
              backgroundColor: accountType === "individual" ? "#8B5CF620" : isDark ? colors.surfaceAlt : "#FDF8FF" }]}
          onPress={() => setAccountType("individual")}
        >
          <View style={[styles.typeIconBg, { backgroundColor: accountType === "individual" ? "#8B5CF6" : "#E5D8F8" }]}>
            <Feather name="user" size={22} color={accountType === "individual" ? "#fff" : "#8B5CF6"} />
          </View>
          <Text style={[styles.typeCardTitle, { color: colors.text }]}>أفراد</Text>
          <Text style={[styles.typeCardSub, { color: colors.muted }]}>مختصون وخبراء مستقلون</Text>
        </Pressable>
        <Pressable
          style={[styles.typeCard,
            { borderColor: accountType === "org" ? "#8B5CF6" : colors.border,
              backgroundColor: accountType === "org" ? "#8B5CF620" : isDark ? colors.surfaceAlt : "#FDF8FF" }]}
          onPress={() => setAccountType("org")}
        >
          <View style={[styles.typeIconBg, { backgroundColor: accountType === "org" ? "#8B5CF6" : "#E5D8F8" }]}>
            <Feather name="briefcase" size={22} color={accountType === "org" ? "#fff" : "#8B5CF6"} />
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
        <Pressable style={styles.primaryBtn} onPress={() => {}}>
          <Text style={styles.primaryBtnText}>متابعة ←</Text>
        </Pressable>
      )}
    </View>
  );

  const renderOrgForm = () => (
    <>
      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="briefcase" size={16} color="#8B5CF6" />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>بيانات المؤسسة</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>اسم المؤسسة (المعتمد من وزارة التجارة) *</Text>
          <TextInput
            placeholder="مثال: شركة الصحة والجمال لتجارة التجزئة"
            placeholderTextColor={colors.muted}
            value={orgName}
            onChangeText={setOrgName}
            style={inputStyle}
            textAlign="right"
          />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>فئة الحساب *</Text>
          <View style={styles.categoryGrid}>
            {BUSINESS_TYPES.map((c) => (
              <Pressable
                key={c.key}
                style={[styles.categoryChip, {
                  borderColor: selectedCategory === c.key ? c.color : colors.border,
                  backgroundColor: selectedCategory === c.key ? c.color : isDark ? colors.surfaceAlt : "#FDF8FF",
                }]}
                onPress={() => setSelectedCategory(c.key)}
              >
                <Text style={{ fontSize: 14 }}>{c.emoji}</Text>
                <Text style={[styles.categoryChipText, { color: selectedCategory === c.key ? "#fff" : colors.textSecondary }]}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedCategory && (
            <View style={[styles.catInfoBox, {
              backgroundColor: (BUSINESS_TYPES.find(t => t.key === selectedCategory)?.color ?? "#8B5CF6") + "15",
              borderColor: (BUSINESS_TYPES.find(t => t.key === selectedCategory)?.color ?? "#8B5CF6") + "40",
            }]}>
              <Feather name="info" size={13} color={BUSINESS_TYPES.find(t => t.key === selectedCategory)?.color ?? "#8B5CF6"} />
              <Text style={[styles.catInfoText, { color: colors.textSecondary }]}>
                {BUSINESS_TYPES.find(t => t.key === selectedCategory)?.sublabel}
              </Text>
            </View>
          )}

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>رقم السجل التجاري *</Text>
          <TextInput
            placeholder="10 أرقام"
            placeholderTextColor={colors.muted}
            value={commercialReg}
            onChangeText={setCommercialReg}
            keyboardType="numeric"
            style={inputStyle}
            textAlign="right"
            maxLength={10}
          />

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>الموقع الجغرافي - العنوان الوطني *</Text>
          <TextInput
            placeholder="المنطقة / المدينة / الحي / الشارع / المبنى"
            placeholderTextColor={colors.muted}
            value={nationalAddress}
            onChangeText={setNationalAddress}
            style={[inputStyle, { minHeight: 70, textAlignVertical: "top", paddingTop: 12 }]}
            textAlign="right"
            multiline
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={16} color="#8B5CF6" />
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

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="settings" size={16} color="#8B5CF6" />
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
                  borderColor: selectedDays.includes(day) ? "#8B5CF6" : colors.border,
                  backgroundColor: selectedDays.includes(day) ? "#8B5CF6" : isDark ? colors.surfaceAlt : "#FDF8FF",
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
          <TextInput
            placeholder="اكتب وصفاً مختصراً يعرّف بنشاطك وما تقدمه..."
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            style={[inputStyle, { minHeight: 90, textAlignVertical: "top", paddingTop: 12 }]}
            textAlign="right"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? colors.surface : "#FFFFFF", borderColor: colors.border }]}>
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Feather name="paperclip" size={16} color="#8B5CF6" />
            <Text style={[styles.formSectionTitle, { color: colors.text }]}>المرفقات</Text>
          </View>
          <Text style={[styles.sectionSub, { color: colors.muted, textAlign: "right", marginBottom: 14 }]}>
            الملفات المطلوبة لإتمام التحقق من هوية المؤسسة
          </Text>
          {[
            { icon: "file-text" as const, label: "نسخة من السجل التجاري", required: true },
            { icon: "image" as const,     label: "شعار المتجر / المؤسسة", required: true },
            { icon: "camera" as const,    label: "صور للمتجر أو المنشأة", required: false },
          ].map((att, i) => (
            <Pressable key={i}
              style={[styles.attachBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceAlt : "#FDF8FF" }]}
              onPress={() => Alert.alert("رفع ملف", `سيتم فتح متصفح الملفات لرفع: ${att.label}`)}
            >
              <View style={styles.attachBtnInner}>
                <View style={[styles.attachIcon, { backgroundColor: "#8B5CF620" }]}>
                  <Feather name={att.icon} size={18} color="#8B5CF6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.attachLabel, { color: colors.text }]}>{att.label}</Text>
                  {att.required && <Text style={[styles.attachRequired, { color: "#EF4444" }]}>مطلوب</Text>}
                </View>
                <View style={[styles.uploadBtn, { backgroundColor: "#8B5CF620" }]}>
                  <Feather name="upload" size={14} color="#8B5CF6" />
                  <Text style={[styles.uploadBtnText, { color: "#8B5CF6" }]}>رفع</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.termsCard, { backgroundColor: isDark ? "#1A1030" : "#F5F0FF", borderColor: "#8B5CF640" }]}>
        <Feather name="shield" size={16} color="#8B5CF6" />
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          بإرسال هذا الطلب، فإنك توافق على{" "}
          <Text style={{ color: "#8B5CF6" }}>شروط وأحكام</Text> منصة أكسير أعمال{" "}
          و<Text style={{ color: "#8B5CF6" }}>سياسة الخصوصية</Text>. سيتم مراجعة طلبك خلال{" "}
          <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>48 ساعة</Text>.
        </Text>
      </View>

      <Pressable style={styles.submitBtn} onPress={handleRegisterOrg}>
        <Feather name="send" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>إرسال طلب التسجيل</Text>
      </Pressable>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#0F0A1E" : "#F7F3FF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPadding + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Feather name="chevron-right" size={24} color={isDark ? "#fff" : "#333"} />
        </Pressable>

        <View style={styles.logoContainer}>
          <View style={styles.logoStack}>
            <View style={[styles.logoBriefcase, { backgroundColor: "#6D28D9" }]}>
              <Feather name="briefcase" size={36} color="#fff" />
            </View>
            <View style={styles.logoDropWrapper}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoDropImg} resizeMode="contain" />
            </View>
          </View>
          <Text style={[styles.logoTitle, { color: isDark ? "#fff" : "#1A0A33" }]}>أكسير أعمال</Text>
          <Text style={[styles.logoSub, { color: isDark ? "#BBA8D8" : "#7C5FA8" }]}>
            منصة إدارة المتاجر والعيادات والمختبرات ومراكز الصحة والجمال
          </Text>
        </View>

        <View style={[styles.tabRow, { backgroundColor: isDark ? colors.surface : "#EDE9FE", borderColor: "#8B5CF640" }]}>
          <Pressable
            style={[styles.tabBtn, tab === "register" && [styles.tabActive, { backgroundColor: "#8B5CF6" }]]}
            onPress={() => setTab("register")}
          >
            <Text style={[styles.tabText, { color: tab === "register" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>حساب جديد</Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, tab === "login" && [styles.tabActive, { backgroundColor: "#8B5CF6" }]]}
            onPress={() => setTab("login")}
          >
            <Text style={[styles.tabText, { color: tab === "login" ? "#fff" : isDark ? "#BBA8D8" : "#7C5FA8" }]}>دخول</Text>
          </Pressable>
        </View>

        {tab === "login" ? renderLogin() : (
          <>
            {renderAccountTypeSelect()}
            {accountType === "org" && renderOrgForm()}
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
  sectionTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  sectionSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 12 },
  typeRow: { flexDirection: "row-reverse", gap: 12, marginBottom: 12 },
  typeCard: { flex: 1, borderRadius: 16, borderWidth: 2, padding: 16, alignItems: "center", gap: 8 },
  typeIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  typeCardTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  typeCardSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  comingSoonBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  comingSoonText: { fontSize: 13, fontFamily: "Tajawal_700Bold", color: "#D97706" },
  primaryBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  formSection: { padding: 16, gap: 4 },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 12 },
  formSectionTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  fieldLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 6, marginTop: 4, textAlign: "right" },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Tajawal_400Regular", marginBottom: 4 },
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
  submitBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#7C3AED", borderRadius: 16, paddingVertical: 18 },
  submitBtnText: { color: "#fff", fontSize: 16, fontFamily: "Cairo_700Bold" },
  forgotText: { fontSize: 13, fontFamily: "Tajawal_500Medium", textAlign: "left", marginBottom: 6 },
  loginCatGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  loginCatChip: { width: "30%", flexGrow: 1, alignItems: "center", paddingVertical: 10, paddingHorizontal: 6, borderRadius: 12, borderWidth: 1.5, gap: 4, minWidth: 85 },
  loginCatLabel: { fontSize: 11, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  loginCatBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
});
