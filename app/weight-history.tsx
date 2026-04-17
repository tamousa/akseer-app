import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
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
import { useApp, WeightEntry } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

I18nManager.forceRTL(true);
const { width } = Dimensions.get("window");

function formatDate(dateStr: string, lang: "ar" | "en") {
  const d = new Date(dateStr);
  if (lang === "en") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDay(dateStr: string, lang: "ar" | "en") {
  const d = new Date(dateStr);
  if (lang === "en") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[d.getDay()];
  }
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return days[d.getDay()];
}

export default function WeightHistoryScreen() {
  const { isDark } = useTheme();
  const { t, lang } = useLanguage();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { weightHistory, addWeightEntry, currentWeight } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [viewTab, setViewTab] = useState<"timeline" | "photos">("timeline");
  const [selectedPhoto, setSelectedPhoto] = useState<WeightEntry | null>(null);

  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 20 : insets.top;

  const sortedEntries = [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const photosEntries = sortedEntries.filter(e => e.photoUri);

  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const totalChange = +(currentWeight - startWeight).toFixed(1);
  const lowestWeight = weightHistory.length > 0 ? Math.min(...weightHistory.map(e => e.weight)) : 0;
  const highestWeight = weightHistory.length > 0 ? Math.max(...weightHistory.map(e => e.weight)) : 0;

  const last7 = weightHistory.slice(-7);
  const chartWeights = last7.map(e => e.weight);
  const chartLabels = last7.map(e => {
    const d = new Date(e.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const minW = chartWeights.length > 0 ? Math.min(...chartWeights) - 0.5 : 0;
  const maxW = chartWeights.length > 0 ? Math.max(...chartWeights) + 0.5 : 1;
  const chartH = 100;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const saveEntry = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 20 || w > 300) {
      Alert.alert(t("خطأ", "Error"), t("يرجى إدخال وزن صحيح", "Please enter a valid weight"));
      return;
    }
    addWeightEntry({
      date: new Date().toISOString().split("T")[0],
      weight: w,
      photoUri,
      note: note || undefined,
    });
    Alert.alert(t("تم", "Done"), lang === "ar" ? `تم تسجيل الوزن ${w} كجم` : `Weight ${w} kg recorded`);
    setShowAddModal(false);
    setNewWeight("");
    setPhotoUri(undefined);
    setNote("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("سجل الوزن", "Weight Log")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient
          colors={isDark ? ["#1C1330", "#0E0818"] : ["#F8F0F5", "#FEFAFB"]}
          style={styles.summaryCard}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{t("الوزن الحالي", "Current Weight")}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{currentWeight} {t("كجم", "kg")}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{t("التغيير الكلي", "Total Change")}</Text>
              <Text style={[styles.summaryValue, { color: totalChange <= 0 ? "#22C55E" : "#EF4444" }]}>
                {totalChange > 0 ? "+" : ""}{totalChange} {t("كجم", "kg")}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryRow, { marginTop: 16 }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{t("أقل وزن", "Lowest")}</Text>
              <Text style={[styles.summaryValue, { color: "#7ECFB3" }]}>{lowestWeight} {t("كجم", "kg")}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>{t("أعلى وزن", "Highest")}</Text>
              <Text style={[styles.summaryValue, { color: "#E8849E" }]}>{highestWeight} {t("كجم", "kg")}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.chartCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>{t("الرسم البياني", "Weight Chart")}</Text>
          <View style={{ height: chartH + 40, marginTop: 12 }}>
            <View style={styles.gridLines}>
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.gridLine, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }]} />
              ))}
            </View>
            <View style={styles.dotsRow}>
              {chartWeights.map((w, i) => {
                const y = chartH - ((w - minW) / (maxW - minW)) * chartH;
                return (
                  <View key={i} style={styles.dotCol}>
                    <View style={{ height: chartH, justifyContent: "flex-start" }}>
                      <View style={[styles.dotOuter, { marginTop: y }]}>
                        <View style={styles.dotInner} />
                      </View>
                    </View>
                    <Text style={[styles.dotLabel, { color: colors.muted }]}>{chartLabels[i]}</Text>
                    <Text style={[styles.dotVal, { color: colors.muted }]}>{w}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(["timeline", "photos"] as const).map(tab => (
            <Pressable
              key={tab}
              style={[styles.tabBtn, viewTab === tab && styles.tabBtnActive]}
              onPress={() => setViewTab(tab)}
            >
              <Feather name={tab === "timeline" ? "clock" : "image"} size={16} color={viewTab === tab ? "#fff" : colors.muted} />
              <Text style={[styles.tabBtnText, viewTab === tab ? { color: "#fff" } : { color: colors.muted }]}>
                {tab === "timeline" ? t("الجدول الزمني", "Timeline") : t("معرض الصور", "Photos")}
              </Text>
            </Pressable>
          ))}
        </View>

        {viewTab === "timeline" ? (
          <View style={styles.timelineContainer}>
            {sortedEntries.map((entry, idx) => {
              const prevEntry = idx < sortedEntries.length - 1 ? sortedEntries[idx + 1] : null;
              const diff = prevEntry ? +(entry.weight - prevEntry.weight).toFixed(1) : 0;
              return (
                <View key={entry.id} style={styles.timelineItem}>
                  <View style={styles.timelineLine}>
                    <View style={[styles.timelineDot, { backgroundColor: diff <= 0 ? "#22C55E" : diff > 0 ? "#EF4444" : "#A86DBF" }]} />
                    {idx < sortedEntries.length - 1 && (
                      <View style={[styles.timelineConnector, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }]} />
                    )}
                  </View>
                  <View style={[styles.timelineCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
                    <View style={styles.timelineCardHeader}>
                      <View>
                        <Text style={[styles.timelineDate, { color: colors.text }]}>{formatDate(entry.date, lang)}</Text>
                        <Text style={[styles.timelineDay, { color: colors.muted }]}>{formatDay(entry.date, lang)}</Text>
                      </View>
                      <View style={{ alignItems: "flex-start" }}>
                        <Text style={[styles.timelineWeight, { color: colors.text }]}>{entry.weight} {t("كجم", "kg")}</Text>
                        {diff !== 0 && (
                          <View style={[styles.diffBadge, { backgroundColor: diff <= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }]}>
                            <Feather name={diff <= 0 ? "trending-down" : "trending-up"} size={11} color={diff <= 0 ? "#22C55E" : "#EF4444"} />
                            <Text style={{ color: diff <= 0 ? "#22C55E" : "#EF4444", fontSize: 11, fontFamily: "Tajawal_700Bold" }}>
                              {diff > 0 ? "+" : ""}{diff}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {entry.note && (
                      <Text style={[styles.timelineNote, { color: colors.muted }]}>{entry.note}</Text>
                    )}
                    {entry.photoUri && (
                      <Pressable onPress={() => setSelectedPhoto(entry)}>
                        <Image source={{ uri: entry.photoUri }} style={styles.timelinePhoto} />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.photosGrid}>
            {photosEntries.length === 0 ? (
              <View style={styles.emptyPhotos}>
                <Feather name="camera-off" size={40} color={colors.muted} />
                <Text style={[styles.emptyPhotosText, { color: colors.muted }]}>{t("لا توجد صور بعد", "No photos yet")}</Text>
                <Text style={[styles.emptyPhotosSub, { color: colors.muted }]}>{t("أضف صورة عند تسجيل وزنك لتتبع التقدم", "Add a photo when logging weight to track progress")}</Text>
              </View>
            ) : (
              <View style={styles.photosRow}>
                {photosEntries.map(entry => (
                  <Pressable key={entry.id} style={styles.photoItem} onPress={() => setSelectedPhoto(entry)}>
                    <Image source={{ uri: entry.photoUri }} style={styles.photoThumb} />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoOverlayText}>{entry.weight} {t("كجم", "kg")}</Text>
                      <Text style={styles.photoOverlayDate}>{formatDate(entry.date, lang)}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setShowAddModal(true)}>
        <LinearGradient colors={["#A86DBF", "#E8849E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fabGrad}>
          <Feather name="plus" size={24} color="#fff" />
        </LinearGradient>
      </Pressable>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t("تسجيل وزن جديد ⚖️", "Log New Weight ⚖️")}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]}
              placeholder={t("الوزن (كجم)", "Weight (kg)")}
              placeholderTextColor={colors.muted}
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="decimal-pad"
              textAlign="center"
            />
            <Pressable
              style={[styles.photoBtn, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", borderColor: colors.border }]}
              onPress={pickPhoto}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.modalPhotoPreview} />
              ) : (
                <View style={styles.photoBtnInner}>
                  <Feather name="camera" size={28} color={colors.muted} />
                  <Text style={{ color: colors.muted, fontFamily: "Tajawal_500Medium", fontSize: 14, marginTop: 6 }}>{t("إضافة صورة (قبل/بعد)", "Add Photo (Before/After)")}</Text>
                </View>
              )}
            </Pressable>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border, fontSize: 15, fontFamily: "Tajawal_500Medium" }]}
              placeholder={t("ملاحظة (اختياري)", "Note (optional)")}
              placeholderTextColor={colors.muted}
              value={note}
              onChangeText={setNote}
              textAlign={lang === "ar" ? "right" : "left"}
            />
            <View style={styles.modalBtns}>
              <Pressable style={[styles.modalBtn, { backgroundColor: "#22C55E" }]} onPress={saveEntry}>
                <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", fontSize: 15 }}>{t("حفظ", "Save")}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.border }]}
                onPress={() => { setShowAddModal(false); setPhotoUri(undefined); setNote(""); setNewWeight(""); }}
              >
                <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold", fontSize: 15 }}>{t("إلغاء", "Cancel")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedPhoto} transparent animationType="fade">
        <View style={styles.photoViewOverlay}>
          <Pressable style={styles.photoViewClose} onPress={() => setSelectedPhoto(null)}>
            <Feather name="x" size={24} color="#fff" />
          </Pressable>
          {selectedPhoto && (
            <View style={styles.photoViewContent}>
              {selectedPhoto.photoUri ? (
                <Image source={{ uri: selectedPhoto.photoUri }} style={styles.photoViewImage} resizeMode="contain" />
              ) : null}
              <View style={styles.photoViewInfo}>
                <Text style={styles.photoViewWeight}>{selectedPhoto.weight} {t("كجم", "kg")}</Text>
                <Text style={styles.photoViewDate}>{formatDate(selectedPhoto.date, lang)}</Text>
                {selectedPhoto.note && <Text style={styles.photoViewNote}>{selectedPhoto.note}</Text>}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  summaryCard: { marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16 },
  summaryRow: { flexDirection: "row-reverse", justifyContent: "space-around" },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryLabel: { fontSize: 12, fontFamily: "Tajawal_500Medium", marginBottom: 4 },
  summaryValue: { fontSize: 22, fontFamily: "Tajawal_800ExtraBold" },
  summaryDivider: { width: 1, height: 40 },
  chartCard: { marginHorizontal: 20, borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 16 },
  chartTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right" },
  gridLines: { position: "absolute", top: 0, left: 0, right: 0, height: 100, justifyContent: "space-between" },
  gridLine: { height: 1, width: "100%" },
  dotsRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end" },
  dotCol: { alignItems: "center", flex: 1 },
  dotOuter: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#A86DBF33", alignItems: "center", justifyContent: "center" },
  dotInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#A86DBF" },
  dotLabel: { fontSize: 9, fontFamily: "Tajawal_400Regular", marginTop: 4 },
  dotVal: { fontSize: 9, fontFamily: "Tajawal_700Bold" },
  tabRow: { flexDirection: "row-reverse", marginHorizontal: 20, gap: 10, marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(168,109,191,0.08)" },
  tabBtnActive: { backgroundColor: "#A86DBF" },
  tabBtnText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  timelineContainer: { paddingHorizontal: 20 },
  timelineItem: { flexDirection: "row-reverse", marginBottom: 16 },
  timelineLine: { alignItems: "center", width: 24, marginLeft: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 16 },
  timelineConnector: { width: 2, flex: 1, marginTop: 4 },
  timelineCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1 },
  timelineCardHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  timelineDate: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  timelineDay: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  timelineWeight: { fontSize: 20, fontFamily: "Tajawal_800ExtraBold" },
  diffBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  timelineNote: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 8, lineHeight: 20 },
  timelinePhoto: { width: "100%", height: 160, borderRadius: 12, marginTop: 10 },
  photosGrid: { paddingHorizontal: 20 },
  emptyPhotos: { alignItems: "center", paddingVertical: 60 },
  emptyPhotosText: { fontSize: 16, fontFamily: "Tajawal_700Bold", marginTop: 12 },
  emptyPhotosSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", marginTop: 4, textAlign: "center" },
  photosRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  photoItem: { width: (width - 50) / 2, height: (width - 50) / 2, borderRadius: 16, overflow: "hidden" },
  photoThumb: { width: "100%", height: "100%" },
  photoOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.55)", padding: 8 },
  photoOverlayText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  photoOverlayDate: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  fab: { position: "absolute", bottom: 30, left: 20, zIndex: 10 },
  fabGrad: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", shadowColor: "#A86DBF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "center", marginBottom: 16 },
  input: { borderRadius: 14, padding: 16, borderWidth: 1, fontSize: 20, fontFamily: "Tajawal_700Bold", marginBottom: 12 },
  photoBtn: { borderRadius: 14, borderWidth: 1, borderStyle: "dashed", marginBottom: 12, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  photoBtnInner: { alignItems: "center", paddingVertical: 28 },
  modalPhotoPreview: { width: "100%", height: 180, borderRadius: 14 },
  modalBtns: { flexDirection: "row-reverse", gap: 10, marginTop: 4 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  photoViewOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center" },
  photoViewClose: { position: "absolute", top: 60, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  photoViewContent: { alignItems: "center", paddingHorizontal: 20 },
  photoViewImage: { width: width - 40, height: width - 40, borderRadius: 16 },
  photoViewInfo: { marginTop: 16, alignItems: "center" },
  photoViewWeight: { color: "#fff", fontSize: 28, fontFamily: "Tajawal_800ExtraBold" },
  photoViewDate: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "Tajawal_500Medium", marginTop: 4 },
  photoViewNote: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "Tajawal_400Regular", marginTop: 8, textAlign: "center" },
});
