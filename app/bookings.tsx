import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  I18nManager,
  Linking,
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
import { useApp, Booking } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";

const TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  clinic: { emoji: "🩺", label: "عيادة", color: "#C490D8" },
  lab: { emoji: "🔬", label: "مختبر", color: "#3B82F6" },
  beauty: { emoji: "💆", label: "عناية وجمال", color: "#EC4899" },
  trainer: { emoji: "🏃", label: "مدرب", color: "#22C55E" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: "مؤكد", color: "#22C55E", bg: "#22C55E15" },
  pending: { label: "معلق", color: "#F59E0B", bg: "#F59E0B15" },
  completed: { label: "مكتمل", color: "#3B82F6", bg: "#3B82F615" },
  cancelled: { label: "ملغي", color: "#F43F5E", bg: "#F43F5E15" },
};

export default function BookingsScreen() {
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();
  const topPadding = isWeb ? 67 : insets.top;
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [homeNotes, setHomeNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const displayBookings = activeTab === "upcoming" ? upcoming : past;

  const handleCancel = (b: Booking) => {
    Alert.alert(
      "إلغاء الموعد",
      `هل أنت متأكد من إلغاء موعد "${b.service}"؟\n\nسياسة الاسترداد:\n• إلغاء قبل 24 ساعة: استرداد كامل\n• إلغاء قبل 12 ساعة: استرداد 50%\n• إلغاء قبل أقل من 12 ساعة: بدون استرداد`,
      [
        { text: "تأكيد الإلغاء", style: "destructive", onPress: () => { Alert.alert("تم", "تم إلغاء الموعد بنجاح"); setSelectedBooking(null); } },
        { text: "تراجع", style: "cancel" },
      ]
    );
  };

  const handleLocation = () => {
    const lat = 24.7136;
    const lng = 46.6753;
    const url = Platform.OS === "ios"
      ? `maps:0,0?q=${lat},${lng}`
      : `geo:0,0?q=${lat},${lng}`;
    Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`));
  };

  const handleSendHomeLocation = () => {
    Alert.alert(
      "إرسال الموقع",
      `سيتم إرسال موقع منزلك للمختص${homeNotes ? `\n\nملاحظات: ${homeNotes}` : ""}`,
      [
        { text: "إرسال", onPress: () => { Alert.alert("تم", "تم إرسال الموقع والملاحظات للمختص"); setHomeNotes(""); } },
        { text: "إلغاء", style: "cancel" },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>حجوزاتي 📅</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, { backgroundColor: activeTab === "upcoming" ? "#A86DBF" : (isDark ? colors.card : "#fff"), borderColor: colors.border }]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, { color: activeTab === "upcoming" ? "#fff" : colors.text }]}>القادمة ({upcoming.length})</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, { backgroundColor: activeTab === "past" ? "#A86DBF" : (isDark ? colors.card : "#fff"), borderColor: colors.border }]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, { color: activeTab === "past" ? "#fff" : colors.text }]}>السابقة ({past.length})</Text>
        </Pressable>
      </View>

      {displayBookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>📅</Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            {activeTab === "upcoming" ? "لا توجد مواعيد قادمة" : "لا توجد مواعيد سابقة"}
          </Text>
          {activeTab === "upcoming" && (
            <Pressable style={styles.emptyBtn} onPress={() => router.push("/section/clinics" as any)}>
              <Text style={styles.emptyBtnText}>احجز موعد جديد</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {displayBookings.map((booking) => {
            const typeConf = TYPE_CONFIG[booking.type] || TYPE_CONFIG.clinic;
            const statusConf = STATUS_CONFIG[booking.status];
            return (
              <Pressable
                key={booking.id}
                onPress={() => setSelectedBooking(booking)}
                style={[styles.bookingCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
              >
                <View style={styles.bookingHeader}>
                  <View style={[styles.typeIcon, { backgroundColor: typeConf.color + "15" }]}>
                    <Text style={{ fontSize: 24 }}>{typeConf.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bookingService, { color: colors.text }]}>{booking.service}</Text>
                    <Text style={[styles.bookingProvider, { color: colors.muted }]}>{booking.provider}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusConf.bg }]}>
                    <Text style={[styles.statusText, { color: statusConf.color }]}>{statusConf.label}</Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Feather name="calendar" size={14} color={colors.muted} />
                    <Text style={[styles.detailText, { color: colors.muted }]}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Feather name="clock" size={14} color={colors.muted} />
                    <Text style={[styles.detailText, { color: colors.muted }]}>{booking.time}</Text>
                  </View>
                  <Text style={[styles.bookingPrice, { color: "#C490D8" }]}>{booking.price} ر.س</Text>
                </View>
                <View style={styles.bookingActions}>
                  <Feather name="chevron-left" size={18} color={colors.muted} />
                  <Text style={[styles.viewDetailsText, { color: colors.muted }]}>عرض التفاصيل</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <Modal visible={!!selectedBooking} transparent animationType="slide">
        {selectedBooking && (() => {
          const typeConf = TYPE_CONFIG[selectedBooking.type] || TYPE_CONFIG.clinic;
          const statusConf = STATUS_CONFIG[selectedBooking.status];
          const isActive = selectedBooking.status === "confirmed" || selectedBooking.status === "pending";
          const bookingMethod = "in-person";
          return (
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>تفاصيل الموعد</Text>
                    <Pressable onPress={() => setSelectedBooking(null)}>
                      <Feather name="x" size={22} color={colors.text} />
                    </Pressable>
                  </View>

                  <View style={[styles.detailCard, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F5FF", borderColor: colors.border }]}>
                    <View style={styles.detailCardHeader}>
                      <View style={[styles.detailTypeIcon, { backgroundColor: typeConf.color + "15" }]}>
                        <Text style={{ fontSize: 32 }}>{typeConf.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.detailServiceName, { color: colors.text }]}>{selectedBooking.service}</Text>
                        <Text style={[styles.detailProviderName, { color: colors.muted }]}>{selectedBooking.provider}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusConf.bg, alignSelf: "flex-end", marginTop: 6 }]}>
                          <Text style={[styles.statusText, { color: statusConf.color }]}>{statusConf.label}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailInfoRows}>
                      <View style={styles.detailInfoRow}>
                        <Feather name="calendar" size={16} color={typeConf.color} />
                        <Text style={[styles.detailInfoLabel, { color: colors.muted }]}>التاريخ</Text>
                        <Text style={[styles.detailInfoVal, { color: colors.text }]}>{selectedBooking.date}</Text>
                      </View>
                      <View style={styles.detailInfoRow}>
                        <Feather name="clock" size={16} color={typeConf.color} />
                        <Text style={[styles.detailInfoLabel, { color: colors.muted }]}>الوقت</Text>
                        <Text style={[styles.detailInfoVal, { color: colors.text }]}>{selectedBooking.time}</Text>
                      </View>
                      <View style={styles.detailInfoRow}>
                        <Feather name="credit-card" size={16} color={typeConf.color} />
                        <Text style={[styles.detailInfoLabel, { color: colors.muted }]}>المبلغ</Text>
                        <Text style={[styles.detailInfoVal, { color: "#A86DBF" }]}>{selectedBooking.price} ر.س</Text>
                      </View>
                      <View style={styles.detailInfoRow}>
                        <Feather name="tag" size={16} color={typeConf.color} />
                        <Text style={[styles.detailInfoLabel, { color: colors.muted }]}>النوع</Text>
                        <Text style={[styles.detailInfoVal, { color: colors.text }]}>{typeConf.label}</Text>
                      </View>
                    </View>
                  </View>

                  {isActive && (
                    <View style={styles.actionButtons}>
                      <Text style={[styles.actionTitle, { color: colors.text }]}>خيارات الموعد</Text>

                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                        onPress={() => { Linking.openURL("tel:0500000000").catch(() => Alert.alert("الاتصال", "تعذر فتح تطبيق الاتصال")); }}
                      >
                        <View style={[styles.actionIconBg, { backgroundColor: "#22C55E15" }]}>
                          <Feather name="phone" size={18} color="#22C55E" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.actionBtnTitle, { color: colors.text }]}>اتصال هاتفي</Text>
                          <Text style={[styles.actionBtnSub, { color: colors.muted }]}>الاتصال بالمختص/العيادة مباشرة</Text>
                        </View>
                        <Feather name="chevron-left" size={18} color={colors.muted} />
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                        onPress={() => { Linking.openURL("https://meet.akseer.sa/abc123").catch(() => Alert.alert("اجتماع عن بعد", "تعذر فتح رابط الاجتماع")); }}
                      >
                        <View style={[styles.actionIconBg, { backgroundColor: "#3B82F615" }]}>
                          <Feather name="video" size={18} color="#3B82F6" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.actionBtnTitle, { color: colors.text }]}>اجتماع عن بعد</Text>
                          <Text style={[styles.actionBtnSub, { color: colors.muted }]}>رابط الاجتماع المرئي</Text>
                        </View>
                        <Feather name="chevron-left" size={18} color={colors.muted} />
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                        onPress={handleLocation}
                      >
                        <View style={[styles.actionIconBg, { backgroundColor: "#F59E0B15" }]}>
                          <Feather name="map-pin" size={18} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.actionBtnTitle, { color: colors.text }]}>اذهب للموقع</Text>
                          <Text style={[styles.actionBtnSub, { color: colors.muted }]}>فتح الموقع في خرائط قوقل/أبل</Text>
                        </View>
                        <Feather name="chevron-left" size={18} color={colors.muted} />
                      </Pressable>

                      <Pressable
                        style={[styles.actionBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                        onPress={handleSendHomeLocation}
                      >
                        <View style={[styles.actionIconBg, { backgroundColor: "#EC489915" }]}>
                          <Feather name="home" size={18} color="#EC4899" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.actionBtnTitle, { color: colors.text }]}>إرسال موقع المنزل</Text>
                          <Text style={[styles.actionBtnSub, { color: colors.muted }]}>للمواعيد بالمنزل</Text>
                        </View>
                        <Feather name="chevron-left" size={18} color={colors.muted} />
                      </Pressable>

                      <TextInput
                        style={[styles.notesInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]}
                        placeholder="أضف ملاحظات للمختص..."
                        placeholderTextColor={colors.muted}
                        value={homeNotes}
                        onChangeText={setHomeNotes}
                        textAlign="right"
                        multiline
                      />
                    </View>
                  )}

                  <View style={styles.policySection}>
                    <Pressable
                      style={[styles.policyBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                      onPress={() => Alert.alert("الفاتورة", `رقم الفاتورة: INV-${selectedBooking.id}\n\nالخدمة: ${selectedBooking.service}\nالمبلغ: ${selectedBooking.price} ر.س\nضريبة 15%: ${(selectedBooking.price * 0.15).toFixed(0)} ر.س\nالإجمالي: ${(selectedBooking.price * 1.15).toFixed(0)} ر.س\n\nالرقم الضريبي: 310456789012345`)}
                    >
                      <Feather name="file-text" size={18} color="#A86DBF" />
                      <Text style={[styles.policyBtnText, { color: colors.text }]}>عرض الفاتورة</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.policyBtn, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                      onPress={() => Alert.alert("سياسة الإلغاء والاسترداد", "• إلغاء قبل 24 ساعة من الموعد: استرداد كامل للمبلغ\n• إلغاء قبل 12 ساعة: استرداد 50% من المبلغ\n• إلغاء قبل أقل من 12 ساعة: لا يوجد استرداد\n\n• يتم الاسترداد خلال 5-7 أيام عمل\n• رسوم الخدمة غير قابلة للاسترداد\n\nللاستفسار تواصل مع خدمة العملاء")}
                    >
                      <Feather name="shield" size={18} color="#3B82F6" />
                      <Text style={[styles.policyBtnText, { color: colors.text }]}>سياسة الإلغاء والاسترداد</Text>
                    </Pressable>

                    {isActive && (
                      <Pressable
                        style={[styles.cancelBtn]}
                        onPress={() => handleCancel(selectedBooking)}
                      >
                        <Feather name="x-circle" size={18} color="#F43F5E" />
                        <Text style={styles.cancelBtnText}>إلغاء الموعد</Text>
                      </Pressable>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          );
        })()}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row-reverse", paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: "center", borderWidth: 1 },
  tabText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: "Tajawal_500Medium" },
  emptyBtn: { backgroundColor: "#A86DBF", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 8 },
  emptyBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  list: { paddingHorizontal: 20 },
  bookingCard: { borderRadius: 20, padding: 18, borderWidth: 1, marginBottom: 14 },
  bookingHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 14, marginBottom: 14 },
  typeIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  bookingService: { fontSize: 16, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  bookingProvider: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  bookingDetails: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.1)", paddingTop: 12 },
  detailItem: { flexDirection: "row-reverse", alignItems: "center", gap: 4 },
  detailText: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  bookingPrice: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  bookingActions: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.06)" },
  viewDetailsText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 20, fontFamily: "Cairo_700Bold" },
  detailCard: { borderRadius: 20, padding: 18, borderWidth: 1, marginBottom: 16 },
  detailCardHeader: { flexDirection: "row-reverse", gap: 14, marginBottom: 16 },
  detailTypeIcon: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  detailServiceName: { fontSize: 18, fontFamily: "Cairo_700Bold", textAlign: "right" },
  detailProviderName: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 4 },
  detailInfoRows: { gap: 12 },
  detailInfoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  detailInfoLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular", width: 60, textAlign: "right" },
  detailInfoVal: { fontSize: 14, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "left" },
  actionButtons: { gap: 10, marginBottom: 16 },
  actionTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 6 },
  actionBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  actionIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionBtnTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  actionBtnSub: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  notesInput: { borderRadius: 14, padding: 14, borderWidth: 1, fontSize: 14, fontFamily: "Tajawal_400Regular", minHeight: 60, textAlignVertical: "top" },
  policySection: { gap: 10 },
  policyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  policyBtnText: { fontSize: 14, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  cancelBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, backgroundColor: "#F43F5E15", marginTop: 4 },
  cancelBtnText: { color: "#F43F5E", fontSize: 15, fontFamily: "Tajawal_700Bold" },
});
