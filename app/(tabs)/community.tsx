import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  I18nManager,
  Image,
  Modal,
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
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);

const isWeb = Platform.OS === "web";

const CATEGORIES = [
  { key: "الكل",                keyEn: "All",              emoji: "🌐", color: "#6B7280" },
  { key: "التغذية",             keyEn: "Nutrition",        emoji: "🥗", color: "#F59E0B" },
  { key: "الرياضة",             keyEn: "Fitness",          emoji: "🏋️", color: "#F43F5E" },
  { key: "الصحة النفسية",       keyEn: "Mental Health",    emoji: "🧠", color: "#00E0B8" },
  { key: "جمال وعناية",         keyEn: "Beauty & Care",    emoji: "💆", color: "#EC4899" },
  { key: "طبي",                 keyEn: "Medical",          emoji: "🩺", color: "#00C4A0" },
  { key: "النوم",               keyEn: "Sleep",            emoji: "😴", color: "#3B82F6" },
  { key: "صحة المرأة والطفل",   keyEn: "Women & Child",    emoji: "🌸", color: "#F472B6" },
  { key: "صحة الرجل",           keyEn: "Men's Health",     emoji: "💪", color: "#2563EB" },
  { key: "مختبرات",             keyEn: "Labs",             emoji: "🔬", color: "#0EA5E9" },
  { key: "متاجر",               keyEn: "Stores",           emoji: "🛍️", color: "#10B981" },
  { key: "تدريب شخصي",          keyEn: "Personal Training",emoji: "🏃", color: "#22C55E" },
];

const STORIES = [
  { id: "1", nameAr: "سارة",  nameEn: "Sara",   emoji: "👩", color: "#EC4899", hasNew: true },
  { id: "2", nameAr: "محمد",  nameEn: "Mohammed",emoji: "👨", color: "#3B82F6", hasNew: true },
  { id: "3", nameAr: "نورة",  nameEn: "Noura",  emoji: "👩", color: "#00E0B8", hasNew: false },
  { id: "4", nameAr: "فيصل", nameEn: "Faisal",  emoji: "👨", color: "#22C55E", hasNew: true },
  { id: "5", nameAr: "لمى",   nameEn: "Lama",   emoji: "👩", color: "#F59E0B", hasNew: false },
];

const POSTS = [
  {
    id: "1", user: "سارة المطيري", avatar: "👩", avatarColor: "#EC4899", time: "منذ ساعة",
    contentAr: "بعد 3 أشهر من التدريب المنتظم وتناول البروتين، فقدت 8 كيلو وأشعر بطاقة رائعة! الاستمرارية هي المفتاح 💪",
    contentEn: "After 3 months of regular training and protein, I lost 8kg and feel amazing! Consistency is the key 💪",
    likes: 42, comments: 12, shares: 5, tag: "الرياضة", tagEn: "Fitness", tagColor: "#F43F5E", hasImage: true,
  },
  {
    id: "2", user: "محمد العمري", avatar: "👨", avatarColor: "#3B82F6", time: "منذ 3 ساعات",
    contentAr: "نصيحة اليوم: ابدأ يومك بكوب ماء دافئ مع الليمون قبل الفطور. فرق كبير على الهضم والطاقة! 🍋",
    contentEn: "Today's tip: Start your day with warm lemon water before breakfast. Huge difference for digestion and energy! 🍋",
    likes: 89, comments: 24, shares: 15, tag: "التغذية", tagEn: "Nutrition", tagColor: "#F59E0B", hasImage: false,
  },
  {
    id: "3", user: "نورة السالم", avatar: "👩", avatarColor: "#00E0B8", time: "منذ أمس",
    contentAr: "التأمل لمدة 10 دقائق يومياً غير حياتي تماماً. قل توتري وتحسن نومي بشكل ملحوظ ✨ جربوه!",
    contentEn: "10 minutes of daily meditation completely changed my life. Stress reduced and sleep improved noticeably ✨ Try it!",
    likes: 156, comments: 38, shares: 22, tag: "الصحة النفسية", tagEn: "Mental Health", tagColor: "#00E0B8", hasImage: false,
  },
  {
    id: "4", user: "فاطمة الزهراء", avatar: "👩", avatarColor: "#22C55E", time: "منذ يومين",
    contentAr: "للحوامل: تمارين الكيغل والمشي اليومي ساعدتني كثيراً في فترة الحمل. استشيروا طبيبكم دائماً قبل البدء 🤰",
    contentEn: "For pregnant women: Kegel exercises and daily walking helped me a lot during pregnancy. Always consult your doctor first 🤰",
    likes: 203, comments: 67, shares: 31, tag: "صحة المرأة والطفل", tagEn: "Women & Child", tagColor: "#EC4899", hasImage: true,
  },
  {
    id: "5", user: "أحمد السلمي", avatar: "👨", avatarColor: "#2563EB", time: "منذ 5 ساعات",
    contentAr: "أهمية فحص التستوستيرون الدوري لكل رجل فوق 30. اكتشفت نقصاً وعالجته — الطاقة والتركيز تحسنا بشكل ملحوظ 💪",
    contentEn: "The importance of regular testosterone checks for every man over 30. Found a deficiency and treated it — energy and focus improved remarkably 💪",
    likes: 74, comments: 19, shares: 8, tag: "صحة الرجل", tagEn: "Men's Health", tagColor: "#2563EB", hasImage: false,
  },
  {
    id: "6", user: "رنا المالكي", avatar: "👩", avatarColor: "#F43F5E", time: "منذ 3 أيام",
    contentAr: "نتائج مختبر النهضة جاتني في أقل من 4 ساعات! وخدمة السحب المنزلي راحة كبيرة 🔬",
    contentEn: "Lab results from Al-Nahda lab came in less than 4 hours! And the home draw service is so convenient 🔬",
    likes: 31, comments: 9, shares: 4, tag: "مختبرات", tagEn: "Labs", tagColor: "#0EA5E9", hasImage: false,
  },
  {
    id: "7", user: "لمياء الحربي", avatar: "👩", avatarColor: "#10B981", time: "منذ يوم",
    contentAr: "جربت منتج المكملات الجديد من متجر الكيتو — بروتين ممتاز وطعم رائع 🛍️ أنصح فيه!",
    contentEn: "Tried the new supplement product from the Keto store — excellent protein and great taste 🛍️ Highly recommended!",
    likes: 58, comments: 14, shares: 7, tag: "متاجر", tagEn: "Stores", tagColor: "#10B981", hasImage: false,
  },
  {
    id: "8", user: "خالد الزهراني", avatar: "👨", avatarColor: "#8B5CF6", time: "منذ ساعتين",
    contentAr: "7 ساعات نوم متواصلة بعد 3 أشهر من الأرق. سر الليلة: تأمل 15 دقيقة + إطفاء الشاشات قبل ساعة 😴",
    contentEn: "7 hours of solid sleep after 3 months of insomnia. Tonight's secret: 15min meditation + screen-off 1 hour before bed 😴",
    likes: 112, comments: 31, shares: 18, tag: "النوم", tagEn: "Sleep", tagColor: "#3B82F6", hasImage: false,
  },
];

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { t, lang } = useLanguage();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [newPost, setNewPost] = useState("");
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<typeof CATEGORIES[0] | null>(null);

  const topPadding = isWeb ? 67 : insets.top;

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };
  const toggleSave = (id: string) => {
    setSavedPosts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    if (!selectedTag) {
      Alert.alert(t("اختر تصنيفاً", "Choose a Category"), t("يرجى اختيار تصنيف لمنشورك قبل النشر", "Please choose a category for your post before publishing"));
      return;
    }
    Alert.alert(t("تم النشر", "Published"), `${t("تمت إضافة مشاركتك في تصنيف", "Your post was added to")} "${t(selectedTag.key, selectedTag.keyEn)}"`);
    setNewPost("");
    setSelectedTag(null);
  };

  const filteredPosts = activeFilter === "الكل" ? POSTS : POSTS.filter((p) => p.tag === activeFilter);
  const activeFilterCat = CATEGORIES.find(c => c.key === activeFilter);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 90 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Text style={[styles.headerTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
          {t("المجتمع", "Community")}
        </Text>
        <Text style={[styles.headerSub, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>
          {t("شارك تجربتك وألهم الآخرين", "Share your experience and inspire others")}
        </Text>
      </View>

      {/* Stories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll} contentContainerStyle={{ flexDirection: "row-reverse", paddingRight: 20 }}>
        <View style={[styles.storyAdd, { backgroundColor: isDark ? colors.card : "#FDF6FA" }]}>
          <Feather name="plus" size={20} color="#00E0B8" />
          <Text style={[styles.storyName, { color: colors.muted }]}>{t("إضافة", "Add")}</Text>
        </View>
        {STORIES.map((s) => (
          <View key={s.id} style={styles.storyItem}>
            <View style={[styles.storyRing, s.hasNew && { borderColor: "#00E0B8" }]}>
              <View style={[styles.storyAvatar, { backgroundColor: s.color + "20" }]}>
                <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
              </View>
            </View>
            <Text style={[styles.storyName, { color: colors.muted }]}>{t(s.nameAr, s.nameEn)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={{ flexDirection: "row-reverse", paddingRight: 20 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.key}
            style={[styles.filterChip, {
              backgroundColor: activeFilter === cat.key ? cat.color : isDark ? colors.surfaceAlt : "#FDF6FA",
              borderColor: activeFilter === cat.key ? cat.color : colors.border,
              borderWidth: 1,
              flexDirection: lang === "en" ? "row" : "row-reverse",
            }]}
            onPress={() => setActiveFilter(cat.key)}
          >
            <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
            <Text style={[styles.filterText, { color: activeFilter === cat.key ? "#fff" : colors.muted }]}>
              {t(cat.key, cat.keyEn)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Filter badge */}
      {activeFilter !== "الكل" && activeFilterCat && (
        <View style={{ paddingHorizontal: 20, marginBottom: 8, flexDirection: lang === "en" ? "row" : "row-reverse", alignItems: "center", gap: 8 }}>
          <View style={[{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: (activeFilterCat.color ?? "#666") + "15" }]}>
            <Text style={{ color: activeFilterCat.color, fontFamily: "Tajawal_700Bold", fontSize: 13 }}>
              {activeFilterCat.emoji} {t(activeFilterCat.key, activeFilterCat.keyEn)}
            </Text>
          </View>
          <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 12 }}>
            {filteredPosts.length} {t("منشور", "posts")}
          </Text>
          <Pressable onPress={() => setActiveFilter("الكل")}>
            <Text style={{ color: "#EF4444", fontFamily: "Tajawal_500Medium", fontSize: 12 }}>× {t("مسح الفلتر", "Clear filter")}</Text>
          </Pressable>
        </View>
      )}

      {/* New Post Box */}
      <View style={[styles.newPostCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
        <TextInput
          placeholder={t("شارك تجربتك الصحية...", "Share your health experience...")}
          placeholderTextColor={colors.muted}
          value={newPost}
          onChangeText={setNewPost}
          multiline
          style={[styles.newPostInput, { color: colors.text, backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: colors.border }]}
          textAlign={lang === "en" ? "left" : "right"}
        />

        {selectedTag && (
          <View style={{ flexDirection: lang === "en" ? "row" : "row-reverse", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <View style={[styles.tagPreview, { backgroundColor: selectedTag.color + "15", borderColor: selectedTag.color + "30", flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
              <Text style={{ fontSize: 13 }}>{selectedTag.emoji}</Text>
              <Text style={[{ color: selectedTag.color, fontFamily: "Tajawal_700Bold", fontSize: 12 }]}>{t(selectedTag.key, selectedTag.keyEn)}</Text>
            </View>
            <Pressable onPress={() => setSelectedTag(null)}>
              <Feather name="x-circle" size={16} color={colors.muted} />
            </Pressable>
          </View>
        )}

        <View style={[styles.newPostActions, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
          <Pressable style={[styles.postBtn, { backgroundColor: (newPost.trim() && selectedTag) ? "#00E0B8" : colors.border }]} onPress={handlePost}>
            <Text style={styles.postBtnTxt}>{t("نشر", "Post")}</Text>
          </Pressable>
          <View style={[styles.mediaActions, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
            <Pressable style={[styles.mediaBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <Feather name="image" size={18} color={colors.muted} />
            </Pressable>
            <Pressable
              style={[styles.mediaBtn, { backgroundColor: selectedTag ? selectedTag.color + "15" : isDark ? colors.surfaceAlt : "#FDF6FA" }]}
              onPress={() => setShowTagModal(true)}
            >
              <Feather name="tag" size={18} color={selectedTag ? selectedTag.color : colors.muted} />
            </Pressable>
          </View>
        </View>
        {!selectedTag && (
          <Text style={{ color: "#F59E0B", fontFamily: "Tajawal_400Regular", fontSize: 11, textAlign: lang === "en" ? "left" : "right", marginTop: 4 }}>
            ⚠️ {t("يجب اختيار تصنيف قبل النشر", "A category must be chosen before posting")}
          </Text>
        )}
      </View>

      {/* Posts Feed */}
      <View style={styles.feed}>
        {filteredPosts.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40, gap: 10 }}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 14 }}>
              {t("لا توجد منشورات في هذا التصنيف", "No posts in this category")}
            </Text>
          </View>
        )}
        {filteredPosts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <View style={[styles.postHeader, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
              <View style={[styles.avatar, { backgroundColor: post.avatarColor + "20" }]}>
                <Text style={{ fontSize: 20 }}>{post.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.userRow, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                  <Text style={[styles.postUser, { color: colors.text }]}>{post.user}</Text>
                  <Pressable onPress={() => setActiveFilter(post.tag)}>
                    <View style={[styles.postTag, { backgroundColor: post.tagColor + "15" }]}>
                      <Text style={[styles.postTagTxt, { color: post.tagColor }]}>{t(post.tag, post.tagEn)}</Text>
                    </View>
                  </Pressable>
                </View>
                <Text style={[styles.postTime, { color: colors.muted, textAlign: lang === "en" ? "left" : "right" }]}>{post.time}</Text>
              </View>
              <Pressable><Feather name="more-horizontal" size={18} color={colors.muted} /></Pressable>
            </View>

            <Text style={[styles.postContent, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
              {t(post.contentAr, post.contentEn)}
            </Text>

            {post.hasImage && (
              <View style={styles.postImageWrap}>
                <Image
                  source={post.id === "1" ? require("@/assets/images/fitness-equipment.png") : require("@/assets/images/yoga-sunrise.png")}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={[styles.postActions, { borderTopColor: colors.border, flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
              <Pressable style={[styles.actionBtn, { flexDirection: lang === "en" ? "row" : "row-reverse" }]} onPress={() => toggleLike(post.id)}>
                <Feather name="heart" size={20} color={likedPosts.includes(post.id) ? "#F43F5E" : colors.muted} />
                <Text style={[styles.actionTxt, { color: likedPosts.includes(post.id) ? "#F43F5E" : colors.muted }]}>
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                <Feather name="message-circle" size={20} color={colors.muted} />
                <Text style={[styles.actionTxt, { color: colors.muted }]}>{post.comments}</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { flexDirection: lang === "en" ? "row" : "row-reverse" }]}>
                <Feather name="share-2" size={20} color={colors.muted} />
                <Text style={[styles.actionTxt, { color: colors.muted }]}>{post.shares}</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { flexDirection: lang === "en" ? "row" : "row-reverse" }]} onPress={() => toggleSave(post.id)}>
                <Feather name="bookmark" size={20} color={savedPosts.includes(post.id) ? "#00E0B8" : colors.muted} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Tag Selector Modal */}
      <Modal visible={showTagModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowTagModal(false)}>
          <View style={[styles.tagModal, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.tagModalHandle} />
            <Text style={[styles.tagModalTitle, { color: colors.text, textAlign: lang === "en" ? "left" : "right" }]}>
              🏷️ {t("اختر تصنيف المنشور", "Choose Post Category")}
            </Text>
            <Text style={[{ color: colors.muted, fontFamily: "Tajawal_400Regular", fontSize: 13, textAlign: lang === "en" ? "left" : "right", marginBottom: 16 }]}>
              {t("اختيار التصنيف يساعد المجتمع على العثور على مشاركتك", "Choosing a category helps the community find your post")}
            </Text>
            <View style={styles.tagGrid}>
              {CATEGORIES.filter(c => c.key !== "الكل").map((cat) => (
                <Pressable
                  key={cat.key}
                  style={[styles.tagOption, {
                    backgroundColor: selectedTag?.key === cat.key ? cat.color + "20" : isDark ? colors.surfaceAlt : "#F8F8F8",
                    borderColor: selectedTag?.key === cat.key ? cat.color : colors.border,
                    borderWidth: 1.5,
                    flexDirection: lang === "en" ? "row" : "row-reverse",
                  }]}
                  onPress={() => { setSelectedTag(cat); setShowTagModal(false); }}
                >
                  <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
                  <Text style={[styles.tagOptionTxt, { color: selectedTag?.key === cat.key ? cat.color : colors.text }]}>
                    {t(cat.key, cat.keyEn)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontFamily: "Cairo_700Bold" },
  headerSub: { fontSize: 14, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  storiesScroll: { marginBottom: 14 },
  storyItem: { alignItems: "center", marginLeft: 14 },
  storyAdd: { alignItems: "center", justifyContent: "center", marginLeft: 14, width: 60, height: 60, borderRadius: 30, marginBottom: 16 },
  storyRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: "transparent", alignItems: "center", justifyContent: "center" },
  storyAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  storyName: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 4 },
  filtersScroll: { marginBottom: 12 },
  filterChip: { alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50, marginLeft: 8 },
  filterText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  newPostCard: { marginHorizontal: 20, borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 16 },
  newPostInput: { borderWidth: 1, borderRadius: 14, padding: 14, minHeight: 70, fontSize: 14, fontFamily: "Tajawal_400Regular", marginBottom: 12, textAlignVertical: "top" },
  tagPreview: { alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  newPostActions: { justifyContent: "space-between", alignItems: "center" },
  postBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  postBtnTxt: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  mediaActions: { gap: 8 },
  mediaBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  feed: { paddingHorizontal: 20, gap: 16, paddingBottom: 16 },
  postCard: { borderRadius: 20, padding: 18, borderWidth: 1 },
  postHeader: { gap: 12, marginBottom: 14, alignItems: "flex-start" },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  userRow: { gap: 8, alignItems: "center", marginBottom: 2, flexWrap: "wrap" },
  postUser: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  postTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  postTagTxt: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  postTime: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  postContent: { fontSize: 14, lineHeight: 24, fontFamily: "Tajawal_400Regular", marginBottom: 14 },
  postImageWrap: { height: 180, borderRadius: 14, overflow: "hidden", marginBottom: 14 },
  postImage: { width: "100%", height: "100%" },
  postActions: { justifyContent: "space-between", paddingTop: 14, borderTopWidth: 1 },
  actionBtn: { alignItems: "center", gap: 4 },
  actionTxt: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  tagModal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  tagModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 20 },
  tagModalTitle: { fontSize: 20, fontFamily: "Cairo_700Bold", marginBottom: 4 },
  tagGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  tagOption: { alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  tagOptionTxt: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
});
