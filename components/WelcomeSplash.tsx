import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

interface Props {
  onFinish: () => void;
}

export default function WelcomeSplash({ onFinish }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const titleOp = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.timing(fadeOut, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeOut, zIndex: 9999 }]}>
      <LinearGradient
        colors={["#1A0B2E", "#3D1A66", "#A86DBF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.glow} />
        <Animated.View style={{ transform: [{ scale }], opacity }}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </Animated.View>
        <Animated.Text style={[styles.title, { opacity: titleOp, transform: [{ translateY: titleY }] }]}>
          أكسير
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: titleOp, transform: [{ translateY: titleY }] }]}>
          صحتك. جمالك. تميّزك.
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  glow: { position: "absolute", width: 380, height: 380, borderRadius: 190, backgroundColor: "rgba(196,144,216,0.18)", top: "30%" },
  logo: { width: 140, height: 140 },
  title: { color: "#fff", fontSize: 42, fontFamily: "Cairo_700Bold", letterSpacing: 2 },
  subtitle: { color: "rgba(255,255,255,0.85)", fontSize: 15, fontFamily: "Tajawal_500Medium" },
});
