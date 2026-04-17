import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
  useFonts as useTajawalFonts,
} from "@expo-google-fonts/tajawal";
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts as useCairoFonts,
} from "@expo-google-fonts/cairo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import PersistentTabBar from "@/components/PersistentTabBar";
import BusinessTabBar from "@/components/BusinessTabBar";
import WelcomeSplash from "@/components/WelcomeSplash";
import { AppProvider } from "@/context/AppContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { setBaseUrl } from "@workspace/api-client-react";

setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="business-auth" options={{ presentation: "card" }} />
      <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal", animation: "slide_from_right" }} />
      <Stack.Screen name="section/clinics" options={{ presentation: "card" }} />
      <Stack.Screen name="section/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="section/content/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="section/pregnancy" options={{ presentation: "card" }} />
      <Stack.Screen name="section/womens-cycle" options={{ presentation: "card" }} />
      <Stack.Screen name="providers/[type]" options={{ presentation: "card" }} />
      <Stack.Screen name="providers/detail/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="cart" options={{ presentation: "card" }} />
      <Stack.Screen name="invoice/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="section/fitness" options={{ presentation: "card" }} />
      <Stack.Screen name="workout/[day]" options={{ presentation: "card" }} />
      <Stack.Screen name="workout/session" options={{ presentation: "card" }} />
      <Stack.Screen name="calculator/[type]" options={{ presentation: "modal" }} />
      <Stack.Screen name="bookings" options={{ presentation: "card" }} />
      <Stack.Screen name="habits" options={{ presentation: "card" }} />
      <Stack.Screen name="section/labs" options={{ presentation: "card" }} />
      <Stack.Screen name="section/nutrition-plan" options={{ presentation: "card" }} />
      <Stack.Screen name="subscription" options={{ presentation: "card" }} />
      <Stack.Screen name="weight-history" options={{ presentation: "card" }} />
      <Stack.Screen name="store/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="store-checkout" options={{ presentation: "card" }} />
      <Stack.Screen name="order/[id]" options={{ presentation: "card" }} />
    </Stack>
  );
}

function InnerLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [showWelcome, setShowWelcome] = React.useState(true);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardProvider>
        <LanguageProvider>
          <AppProvider>
            <BusinessProvider>
              <CartProvider>
                <StatusBar style={isDark ? "light" : "dark"} />
                <View style={{ flex: 1 }}>
                  <RootLayoutNav />
                  <PersistentTabBar />
                  <BusinessTabBar />
                  {showWelcome && <WelcomeSplash onFinish={() => setShowWelcome(false)} />}
                </View>
              </CartProvider>
            </BusinessProvider>
          </AppProvider>
        </LanguageProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [tajawalLoaded] = useTajawalFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
  });

  const [cairoLoaded] = useCairoFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (tajawalLoaded && cairoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [tajawalLoaded, cairoLoaded]);

  if (!tajawalLoaded || !cairoLoaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <InnerLayout />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
