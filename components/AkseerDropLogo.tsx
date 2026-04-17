import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface AkseerDropLogoProps {
  size?: number;
  animated?: boolean;
  fillProgress?: number;
  style?: object;
}

export default function AkseerDropLogo({
  size = 60,
  animated = false,
  fillProgress,
  style,
}: AkseerDropLogoProps) {
  const fillAnim = useRef(new Animated.Value(fillProgress ?? 0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fillAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(fillAnim, {
            toValue: 0.15,
            duration: 700,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else if (fillProgress !== undefined) {
      Animated.timing(fillAnim, {
        toValue: fillProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [animated, fillProgress]);

  const vbW = 60;
  const vbH = 80;
  const dropPath =
    "M30,2 C30,2 6,34 6,54 C6,68 17,78 30,78 C43,78 54,68 54,54 C54,34 30,2 30,2 Z";

  const clipY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [vbH, 0],
  });

  return (
    <Svg
      width={size}
      height={(size * vbH) / vbW}
      viewBox={`0 0 ${vbW} ${vbH}`}
      style={style}
    >
      <Defs>
        <LinearGradient id="dropOutline" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#A78BFA" />
          <Stop offset="100%" stopColor="#7C3AED" />
        </LinearGradient>
        <LinearGradient id="dropFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#C490D8" />
          <Stop offset="100%" stopColor="#6D28D9" />
        </LinearGradient>
        <ClipPath id="fillClip">
          <AnimatedRect
            x="0"
            y={clipY as any}
            width={vbW}
            height={vbH}
          />
        </ClipPath>
      </Defs>

      {/* Outline drop */}
      <Path
        d={dropPath}
        fill="none"
        stroke="url(#dropOutline)"
        strokeWidth="2.5"
        opacity={0.4}
      />

      {/* Filled portion (animated clip) */}
      <Path
        d={dropPath}
        fill="url(#dropFill)"
        clipPath="url(#fillClip)"
      />

      {/* Shine highlight */}
      <Path
        d="M22,22 Q24,14 30,12 Q26,20 24,28 Z"
        fill="rgba(255,255,255,0.35)"
      />
    </Svg>
  );
}
