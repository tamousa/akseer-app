import { reloadAppAsync } from "expo";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AkseerDropLogo from "./AkseerDropLogo";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

function SadFaceAnimation({ isDark }: { isDark: boolean }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(wiggle, { toValue: 6, duration: 80, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -6, duration: 80, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 4, duration: 70, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 70, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: bounce },
          { rotate: wiggle.interpolate({ inputRange: [-6, 6], outputRange: ["-4deg", "4deg"] }) },
        ],
        alignItems: "center",
      }}
    >
      <View style={styles.logoCircle}>
        <AkseerDropLogo size={64} fillProgress={0.3} />
      </View>
      <Text style={styles.sadFace}>😢</Text>
    </Animated.View>
  );
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  const bg = isDark ? "#0F0520" : "#F8F4FF";
  const card = isDark ? "#1A0B2E" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1A0B2E";
  const mutedColor = isDark ? "rgba(255,255,255,0.55)" : "rgba(26,11,46,0.55)";
  const accentColor = "#7C3AED";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch {
      resetError();
    }
  };

  const monoFont = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

  const isNetworkError =
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("timeout") ||
    error.message?.toLowerCase().includes("connection");

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Dev error details button */}
      {__DEV__ && (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={[styles.devBtn, { top: insets.top + 12, backgroundColor: card }]}
        >
          <Text style={{ fontSize: 14 }}>🐛</Text>
        </Pressable>
      )}

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        {/* Animated logo + sad face */}
        <SadFaceAnimation isDark={isDark} />

        {/* Dots decoration */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === 1 ? accentColor : accentColor + "40" },
              ]}
            />
          ))}
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: card, shadowColor: accentColor }]}>
          <Text style={[styles.title, { color: textColor }]}>
            {isNetworkError ? "تعذّر الاتصال بالإنترنت" : "عذراً، حدث خطأ غير متوقع"}
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            {isNetworkError
              ? "تحقّق من اتصالك بالإنترنت وحاول مجدداً. أكسير ينتظرك! 💜"
              : "ذرّة صغيرة من الكون تعثّرت في مكانها. سنصلحها فوراً!"}
          </Text>

          {isNetworkError && (
            <View style={[styles.tipBox, { backgroundColor: accentColor + "12", borderColor: accentColor + "30" }]}>
              <Text style={[styles.tipText, { color: accentColor }]}>
                💡 جرّب: Wi-Fi · البيانات · إعادة التشغيل
              </Text>
            </View>
          )}
        </View>

        {/* Retry button */}
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: accentColor, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
          onPress={handleRestart}
        >
          <Text style={styles.retryBtnText}>🔄 حاول مجدداً</Text>
        </Pressable>

        {/* Reset button */}
        <Pressable onPress={resetError} style={styles.resetBtn}>
          <Text style={[styles.resetBtnText, { color: mutedColor }]}>إغلاق وتجاهل الخطأ</Text>
        </Pressable>

        {/* Branding */}
        <Text style={[styles.brand, { color: mutedColor }]}>أكسير · الصحة والعناية والجمال 💜</Text>
      </Animated.View>

      {/* Dev Error Details Modal */}
      {__DEV__ && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>تفاصيل الخطأ 🐛</Text>
                <Pressable onPress={() => setIsModalVisible(false)} style={styles.modalClose}>
                  <Text style={{ fontSize: 20, color: mutedColor }}>✕</Text>
                </Pressable>
              </View>
              <ScrollView showsVerticalScrollIndicator style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                <View style={[styles.errorBox, { backgroundColor: isDark ? "#0A0014" : "#F8F4FF" }]}>
                  <Text style={[styles.errorText, { color: textColor, fontFamily: monoFont }]} selectable>
                    {`Error: ${error.message}\n\n${error.stack ?? ""}`}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  devBtn: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    gap: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  sadFace: {
    fontSize: 32,
    marginTop: -8,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    gap: 10,
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  tipBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  tipText: {
    fontSize: 13,
    fontFamily: "Tajawal_500Medium",
    textAlign: "center",
  },
  retryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Cairo_700Bold",
  },
  resetBtn: {
    paddingVertical: 8,
  },
  resetBtnText: {
    fontSize: 13,
    fontFamily: "Tajawal_400Regular",
  },
  brand: {
    fontSize: 11,
    fontFamily: "Tajawal_400Regular",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    height: "88%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,58,237,0.12)",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
  },
  modalClose: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 11,
    lineHeight: 18,
  },
});
