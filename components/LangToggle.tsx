import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useLanguage } from "@/context/LanguageContext";

interface LangToggleProps {
  color?: string;
  bg?: string;
}

export function LangToggle({ color = "#fff", bg = "rgba(255,255,255,0.18)" }: LangToggleProps) {
  const { lang, toggleLang } = useLanguage();
  return (
    <Pressable style={[styles.btn, { backgroundColor: bg }]} onPress={toggleLang}>
      <Text style={[styles.txt, { color }]}>{lang === "ar" ? "EN" : "عربي"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 12,
    fontFamily: "Tajawal_700Bold",
    letterSpacing: 0.5,
  },
});
