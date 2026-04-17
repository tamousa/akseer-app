import React, { useEffect, useRef } from "react";
import { Animated, RefreshControl, StyleSheet, View } from "react-native";
import AkseerDropLogo from "./AkseerDropLogo";

interface Props {
  refreshing: boolean;
  onRefresh: () => void;
}

export function makeAkseerRefreshControl({ refreshing, onRefresh }: Props) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="transparent"
      colors={["transparent"]}
      progressBackgroundColor="transparent"
      style={{ backgroundColor: "transparent" }}
    />
  );
}

export function AkseerRefreshIndicator({ refreshing }: { refreshing: boolean }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (refreshing) {
      Animated.parallel([
        Animated.spring(opacityAnim, { toValue: 1, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.7, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [refreshing]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        !refreshing && styles.hidden,
      ]}
    >
      <View style={styles.bubble}>
        <AkseerDropLogo size={36} animated={refreshing} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    pointerEvents: "none",
  } as any,
  hidden: { display: "none" },
  bubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
