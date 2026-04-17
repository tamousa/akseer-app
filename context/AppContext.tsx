import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTierForPoints } from "@/constants/tiers";

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: "male" | "female";
  goal: string;
  city: string;
  points: number;
  isPro: boolean;
}

export interface OnboardingData {
  completed: boolean;
  healthScore: number;
  step1?: { gender: string; age: number; height: number; weight: number; city: string };
  step2?: { goal: string; targetWeight: number; duration: string };
  step3?: { activityLevel: number; daysPerWeek: number; exercises: string[] };
  step4?: { meals: number; diet: string; sleepHours: number; sleepQuality: number };
  step5?: { diseases: string[]; medications: boolean; allergies: string[]; stressLevel: number; waterGlasses: number };
  step6?: { interests: string[] };
}

export interface CycleData {
  lastPeriodStart: string | null;
  currentPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  bloodFlow: "light" | "medium" | "heavy";
  symptoms: { date: string; symptoms: string[]; painLevel?: number }[];
}

export interface PregnancyWeightLog {
  date: string;
  weight: number;
}

export interface HospitalBagItem {
  id: string;
  category: string;
  name: string;
  checked: boolean;
  custom?: boolean;
}

export interface KickSession {
  date: string;
  kicks: number;
  durationMin: number;
}

export interface PregnancyData {
  isPregnant: boolean;
  lastPeriodDate: string | null;
  firstScanDate: string | null;
  babyGender: "boy" | "girl" | "surprise";
  babyName: string;
  prePregnancyWeight: number | null;
  height: number | null;
  symptoms: { date: string; symptoms: string[] }[];
  weightLogs: PregnancyWeightLog[];
  hospitalBag: HospitalBagItem[];
  kickSessions: KickSession[];
}

export interface BeautyLog {
  date: string;
  skinMorning: string[];
  skinEvening: string[];
  hairRoutine: string[];
  notes: string;
  rating: number;
}

export interface HormoneEntry {
  date: string;
  symptoms: string[];
  energy: number;
  mood: number;
  stress: number;
  libido: number;
  thyroidFeel: number;
  notes: string;
}

export interface HormoneTest {
  id: string;
  name: string;
  date: string;
  result: string;
  unit: string;
  normalRange: string;
  notes: string;
}

export interface WaterIntake {
  date: string;
  glasses: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  name: string;
  duration: number;
  calories: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  type: string;
  dailyGoal: number;
  unit: string;
  completedDates: string[];
  targetDays?: number;
  startDate?: string;
}

export interface Booking {
  id: string;
  type: "clinic" | "lab" | "beauty" | "trainer";
  service: string;
  provider: string;
  date: string;
  time: string;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  photoUri?: string;
  note?: string;
}

export interface DailyPoints {
  date: string;
  meals: number;
  exercise: number;
  water: number;
  sleep: number;
  weight: number;
  total: number;
}

export interface PointsNotification {
  id: string;
  category: string;
  points: number;
  reason: string;
  emoji: string;
  visible: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  nameEn?: string;
  brand?: string;
  barcode?: string;
  category: "protein" | "carbs" | "dairy" | "fruits" | "vegetables" | "fats" | "drinks" | "snacks" | "grains" | "meals" | "supplements";
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface LoggedFood {
  id: string;
  foodItem: FoodItem;
  quantity: number;
}

export type MealType = "breakfast" | "snack1" | "lunch" | "snack2" | "dinner";

export interface MealLog {
  id: string;
  date: string;
  mealType: MealType;
  items: LoggedFood[];
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  addedAt: string;
}

export const MEAL_TYPE_INFO: Record<MealType, { name: string; emoji: string; time: string }> = {
  breakfast: { name: "الفطور", emoji: "🌅", time: "7:00 ص" },
  snack1: { name: "وجبة خفيفة", emoji: "🍎", time: "10:00 ص" },
  lunch: { name: "الغداء", emoji: "🍽️", time: "1:00 م" },
  snack2: { name: "وجبة خفيفة", emoji: "🥤", time: "4:00 م" },
  dinner: { name: "العشاء", emoji: "🌙", time: "7:00 م" },
};

export const FOOD_DATABASE: FoodItem[] = [
  { id: "f1", name: "بيض مسلوق", nameEn: "Boiled Egg", category: "protein", servingSize: 50, servingUnit: "حبة", calories: 70, protein: 6, carbs: 0.5, fat: 5, fiber: 0 },
  { id: "f2", name: "صدر دجاج مشوي", nameEn: "Grilled Chicken Breast", category: "protein", servingSize: 100, servingUnit: "جم", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { id: "f3", name: "سمك سلمون", nameEn: "Salmon", category: "protein", servingSize: 100, servingUnit: "جم", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { id: "f4", name: "لحم بقر مفروم", nameEn: "Ground Beef", category: "protein", servingSize: 100, servingUnit: "جم", calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  { id: "f5", name: "تونا معلبة", nameEn: "Canned Tuna", category: "protein", servingSize: 85, servingUnit: "جم", calories: 100, protein: 22, carbs: 0, fat: 1, fiber: 0 },
  { id: "f6", name: "روبيان", nameEn: "Shrimp", category: "protein", servingSize: 100, servingUnit: "جم", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  { id: "f7", name: "أرز أبيض", nameEn: "White Rice", category: "grains", servingSize: 150, servingUnit: "كوب مطبوخ", calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6 },
  { id: "f8", name: "أرز بني", nameEn: "Brown Rice", category: "grains", servingSize: 150, servingUnit: "كوب مطبوخ", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
  { id: "f9", name: "خبز أسمر", nameEn: "Whole Wheat Bread", category: "grains", servingSize: 30, servingUnit: "شريحة", calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 2 },
  { id: "f10", name: "خبز أبيض", nameEn: "White Bread", category: "grains", servingSize: 30, servingUnit: "شريحة", calories: 75, protein: 2.5, carbs: 14, fat: 1, fiber: 0.5 },
  { id: "f11", name: "شوفان", nameEn: "Oats", category: "grains", servingSize: 40, servingUnit: "جم", calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4 },
  { id: "f12", name: "معكرونة مطبوخة", nameEn: "Cooked Pasta", category: "grains", servingSize: 140, servingUnit: "كوب", calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
  { id: "f13", name: "بطاطا حلوة", nameEn: "Sweet Potato", category: "carbs", servingSize: 130, servingUnit: "حبة متوسطة", calories: 115, protein: 2, carbs: 27, fat: 0, fiber: 4 },
  { id: "f14", name: "بطاطس مسلوقة", nameEn: "Boiled Potato", category: "carbs", servingSize: 150, servingUnit: "حبة متوسطة", calories: 130, protein: 3, carbs: 30, fat: 0, fiber: 2 },
  { id: "f15", name: "حليب كامل الدسم", nameEn: "Whole Milk", category: "dairy", servingSize: 240, servingUnit: "كوب", calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12 },
  { id: "f16", name: "حليب قليل الدسم", nameEn: "Low-fat Milk", category: "dairy", servingSize: 240, servingUnit: "كوب", calories: 100, protein: 8, carbs: 12, fat: 2.5, fiber: 0, sugar: 12 },
  { id: "f17", name: "زبادي يوناني", nameEn: "Greek Yogurt", category: "dairy", servingSize: 170, servingUnit: "علبة", calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 4 },
  { id: "f18", name: "جبنة قريش", nameEn: "Cottage Cheese", category: "dairy", servingSize: 100, servingUnit: "جم", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 },
  { id: "f19", name: "جبنة شيدر", nameEn: "Cheddar Cheese", category: "dairy", servingSize: 28, servingUnit: "شريحة", calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0 },
  { id: "f20", name: "لبنة", nameEn: "Labneh", category: "dairy", servingSize: 30, servingUnit: "ملعقة كبيرة", calories: 50, protein: 3, carbs: 2, fat: 3.5, fiber: 0 },
  { id: "f21", name: "تفاحة", nameEn: "Apple", category: "fruits", servingSize: 180, servingUnit: "حبة", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, sugar: 19 },
  { id: "f22", name: "موزة", nameEn: "Banana", category: "fruits", servingSize: 120, servingUnit: "حبة", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, sugar: 14 },
  { id: "f23", name: "تمر", nameEn: "Dates", category: "fruits", servingSize: 24, servingUnit: "حبة (3)", calories: 66, protein: 0.4, carbs: 18, fat: 0, fiber: 1.6, sugar: 16 },
  { id: "f24", name: "برتقالة", nameEn: "Orange", category: "fruits", servingSize: 130, servingUnit: "حبة", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3 },
  { id: "f25", name: "فراولة", nameEn: "Strawberries", category: "fruits", servingSize: 150, servingUnit: "كوب", calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3 },
  { id: "f26", name: "أفوكادو", nameEn: "Avocado", category: "fats", servingSize: 50, servingUnit: "نصف حبة", calories: 80, protein: 1, carbs: 4, fat: 7, fiber: 3 },
  { id: "f27", name: "زيت زيتون", nameEn: "Olive Oil", category: "fats", servingSize: 14, servingUnit: "ملعقة كبيرة", calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0 },
  { id: "f28", name: "لوز", nameEn: "Almonds", category: "snacks", servingSize: 28, servingUnit: "جم (23 حبة)", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 },
  { id: "f29", name: "فول سوداني", nameEn: "Peanuts", category: "snacks", servingSize: 28, servingUnit: "جم", calories: 161, protein: 7, carbs: 5, fat: 14, fiber: 2 },
  { id: "f30", name: "زبدة الفول السوداني", nameEn: "Peanut Butter", category: "fats", servingSize: 32, servingUnit: "ملعقتين كبيرتين", calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2 },
  { id: "f31", name: "عسل", nameEn: "Honey", category: "carbs", servingSize: 21, servingUnit: "ملعقة كبيرة", calories: 64, protein: 0, carbs: 17, fat: 0, fiber: 0, sugar: 17 },
  { id: "f32", name: "خيار", nameEn: "Cucumber", category: "vegetables", servingSize: 100, servingUnit: "حبة", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { id: "f33", name: "طماطم", nameEn: "Tomato", category: "vegetables", servingSize: 120, servingUnit: "حبة", calories: 22, protein: 1, carbs: 4.8, fat: 0.2, fiber: 1.5 },
  { id: "f34", name: "بروكلي", nameEn: "Broccoli", category: "vegetables", servingSize: 90, servingUnit: "كوب", calories: 31, protein: 2.5, carbs: 6, fat: 0.3, fiber: 2.4 },
  { id: "f35", name: "سبانخ", nameEn: "Spinach", category: "vegetables", servingSize: 30, servingUnit: "كوب", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7 },
  { id: "f36", name: "جزر", nameEn: "Carrot", category: "vegetables", servingSize: 60, servingUnit: "حبة متوسطة", calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7 },
  { id: "f37", name: "فول مدمس", nameEn: "Fava Beans", category: "protein", servingSize: 170, servingUnit: "كوب", calories: 187, protein: 13, carbs: 33, fat: 0.7, fiber: 9 },
  { id: "f38", name: "حمص", nameEn: "Hummus", category: "snacks", servingSize: 30, servingUnit: "ملعقتين كبيرتين", calories: 50, protein: 2, carbs: 4, fat: 3, fiber: 1 },
  { id: "f39", name: "كبسة دجاج", nameEn: "Chicken Kabsa", category: "meals", servingSize: 350, servingUnit: "طبق", calories: 520, protein: 35, carbs: 55, fat: 16, fiber: 2 },
  { id: "f40", name: "شاورما دجاج", nameEn: "Chicken Shawarma", category: "meals", servingSize: 250, servingUnit: "ساندويتش", calories: 450, protein: 28, carbs: 40, fat: 18, fiber: 2 },
  { id: "f41", name: "فلافل", nameEn: "Falafel", category: "snacks", servingSize: 17, servingUnit: "حبة", calories: 57, protein: 2.3, carbs: 5, fat: 3.4, fiber: 1 },
  { id: "f42", name: "مندي لحم", nameEn: "Lamb Mandi", category: "meals", servingSize: 350, servingUnit: "طبق", calories: 580, protein: 38, carbs: 50, fat: 22, fiber: 1 },
  { id: "f43", name: "سلطة خضار", nameEn: "Green Salad", category: "vegetables", servingSize: 150, servingUnit: "طبق", calories: 35, protein: 2, carbs: 7, fat: 0.3, fiber: 3 },
  { id: "f44", name: "ويي بروتين", nameEn: "Whey Protein", category: "supplements", servingSize: 30, servingUnit: "سكوب", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },
  { id: "f45", name: "قهوة عربية", nameEn: "Arabic Coffee", category: "drinks", servingSize: 90, servingUnit: "فنجال", calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
  { id: "f46", name: "شاي أخضر", nameEn: "Green Tea", category: "drinks", servingSize: 240, servingUnit: "كوب", calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { id: "f47", name: "عصير برتقال طبيعي", nameEn: "Fresh Orange Juice", category: "drinks", servingSize: 240, servingUnit: "كوب", calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21 },
  { id: "f48", name: "كريم كراميل", nameEn: "Crème Caramel", category: "snacks", servingSize: 100, servingUnit: "حبة", calories: 150, protein: 3, carbs: 22, fat: 5, fiber: 0, sugar: 18 },
  { id: "f49", name: "سمبوسة لحم", nameEn: "Meat Samosa", category: "snacks", servingSize: 30, servingUnit: "حبة", calories: 80, protein: 3, carbs: 8, fat: 4, fiber: 0.5 },
  { id: "f50", name: "كنافة", nameEn: "Kunafa", category: "snacks", servingSize: 100, servingUnit: "قطعة", calories: 350, protein: 7, carbs: 45, fat: 16, fiber: 1, sugar: 30 },
];

export const BARCODE_PRODUCTS: Record<string, FoodItem> = {
  "6281048080016": { id: "bc1", name: "المراعي حليب كامل الدسم", brand: "المراعي", barcode: "6281048080016", category: "dairy", servingSize: 200, servingUnit: "مل", calories: 124, protein: 6, carbs: 10, fat: 6.6, fiber: 0, sugar: 10 },
  "6281100050018": { id: "bc2", name: "نادك زبادي", brand: "نادك", barcode: "6281100050018", category: "dairy", servingSize: 170, servingUnit: "علبة", calories: 95, protein: 5, carbs: 12, fat: 3, fiber: 0 },
  "6281048012345": { id: "bc3", name: "المراعي جبنة شيدر شرائح", brand: "المراعي", barcode: "6281048012345", category: "dairy", servingSize: 20, servingUnit: "شريحة", calories: 70, protein: 4, carbs: 0.5, fat: 6, fiber: 0 },
  "5449000000996": { id: "bc4", name: "كوكاكولا", brand: "Coca-Cola", barcode: "5449000000996", category: "drinks", servingSize: 330, servingUnit: "مل", calories: 139, protein: 0, carbs: 35, fat: 0, fiber: 0, sugar: 35 },
  "8690504055679": { id: "bc5", name: "أولكر بسكويت شوكولاتة", brand: "أولكر", barcode: "8690504055679", category: "snacks", servingSize: 36, servingUnit: "قطعتين", calories: 180, protein: 2, carbs: 24, fat: 8, fiber: 1, sugar: 12 },
};

export type HomeEquipment = "dumbbells" | "barbell" | "bench" | "pullupbar" | "resistancebands" | "mat" | "kettlebell" | "jumprope" | "abwheel" | "ball";

export const HOME_EQUIPMENT_LIST: { id: HomeEquipment; label: string; emoji: string }[] = [
  { id: "dumbbells", label: "دمبل", emoji: "🏋️" },
  { id: "barbell", label: "بار حديد", emoji: "🔩" },
  { id: "bench", label: "بنش", emoji: "🛋️" },
  { id: "pullupbar", label: "بار عقلة", emoji: "🪜" },
  { id: "resistancebands", label: "حبل مقاومة", emoji: "🔗" },
  { id: "mat", label: "بساط تمارين", emoji: "🧘" },
  { id: "kettlebell", label: "كيتلبل", emoji: "🔔" },
  { id: "jumprope", label: "حبل نط", emoji: "⏭️" },
  { id: "abwheel", label: "عجلة بطن", emoji: "⭕" },
  { id: "ball", label: "كرة تمارين", emoji: "🔵" },
];

interface AppContextType {
  isLoggedIn: boolean;
  loaded: boolean;
  login: (email: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  onboarding: OnboardingData;
  setOnboarding: (o: OnboardingData) => void;
  cycleData: CycleData;
  setCycleData: (c: CycleData) => void;
  updateCycleData: (partial: Partial<CycleData>) => void;
  waterIntake: WaterIntake;
  addWaterGlass: () => void;
  workoutLogs: WorkoutLog[];
  addWorkout: (w: Omit<WorkoutLog, "id">) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (m: Omit<MoodEntry, "id">) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  habits: Habit[];
  addHabit: (h: Omit<Habit, "id" | "completedDates">) => void;
  toggleHabitDay: (habitId: string, date: string) => void;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id">) => void;
  weightHistory: WeightEntry[];
  addWeightEntry: (w: Omit<WeightEntry, "id">) => void;
  currentWeight: number;
  homeEquipment: HomeEquipment[];
  setHomeEquipment: (eq: HomeEquipment[]) => void;
  isHomeWorkout: boolean;
  setIsHomeWorkout: (v: boolean) => void;
  mealLogs: MealLog[];
  addFoodToMeal: (mealType: MealType, food: FoodItem, quantity: number) => void;
  removeFoodFromMeal: (mealType: MealType, loggedFoodId: string) => void;
  todayMeals: Record<MealType, LoggedFood[]>;
  todayNutrition: DailyNutrition;
  nutritionGoal: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  userGoals: { water: number; caloriesBurn: number; sleep: number; steps: number; activeMinutes: number };
  setUserGoals: (g: { water: number; caloriesBurn: number; sleep: number; steps: number; activeMinutes: number }) => void;
  steps: number;
  sleepHours: number;
  caloriesConsumed: number;
  pointsHistory: DailyPoints[];
  todayPoints: DailyPoints;
  addHealthPoints: (category: "meals" | "exercise" | "water" | "sleep" | "weight", points: number, reason: string) => void;
  pointsNotification: PointsNotification | null;
  dismissPointsNotification: () => void;
  totalMonthlyPoints: number;
  totalAllTimePoints: number;
  redeemedPoints: number;
  redeemPoints: (amount: number) => void;
  tierBonusPoints: number;
  availablePoints: number;
  mysteryBoxAvailable: boolean;
  lastMysteryReward: { points: number; tierIcon: string } | null;
  claimMysteryBox: () => Promise<{ points: number; tierIcon: string } | null>;
  dismissMysteryReward: () => void;
  shoppingList: ShoppingItem[];
  addShoppingItem: (name: string, category: string) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearCheckedItems: () => void;
  pregnancyData: PregnancyData;
  setPregnancyData: (p: PregnancyData) => void;
  updatePregnancyData: (partial: Partial<PregnancyData>) => void;
  beautyLogs: BeautyLog[];
  addBeautyLog: (log: BeautyLog) => void;
  hormoneEntries: HormoneEntry[];
  addHormoneEntry: (e: HormoneEntry) => void;
  hormoneTests: HormoneTest[];
  addHormoneTest: (t: Omit<HormoneTest, "id">) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const todayStr = () => new Date().toISOString().split("T")[0];

const DEFAULT_PROFILE: UserProfile = {
  name: "سارة المطيري",
  email: "sara@elixir.sa",
  age: 28,
  weight: 62,
  height: 165,
  gender: "female",
  goal: "تحسين اللياقة",
  city: "الرياض",
  points: 847,
  isPro: false,
};

const _30daysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 5); return d.toISOString().split("T")[0]; })();
const DEFAULT_HABITS: Habit[] = [
  { id: "1", name: "شرب الماء", emoji: "💧", type: "مياه", dailyGoal: 8, unit: "أكواب", completedDates: [], targetDays: 30, startDate: _30daysAgo },
  { id: "2", name: "المشي", emoji: "🚶", type: "رياضية", dailyGoal: 30, unit: "دقيقة", completedDates: [], targetDays: 21, startDate: _30daysAgo },
  { id: "3", name: "التأمل", emoji: "🧘", type: "نفسية", dailyGoal: 10, unit: "دقائق", completedDates: [], targetDays: 90, startDate: _30daysAgo },
  { id: "4", name: "قراءة", emoji: "📖", type: "صحية", dailyGoal: 20, unit: "دقيقة", completedDates: [], targetDays: 45, startDate: _30daysAgo },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [userGoals, setUserGoalsState] = useState({
    water: 8,
    caloriesBurn: 500,
    sleep: 8,
    steps: 10000,
    activeMinutes: 30,
  });
  const [onboarding, setOnboardingState] = useState<OnboardingData>({
    completed: false,
    healthScore: 0,
  });
  const [cycleData, setCycleDataState] = useState<CycleData>({
    lastPeriodStart: null,
    currentPeriodStart: null,
    cycleLength: 28,
    periodLength: 5,
    bloodFlow: "medium",
    symptoms: [],
  });
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({ date: todayStr(), glasses: 4 });
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [bookings, setBookings] = useState<Booking[]>([
    { id: "1", type: "clinic", service: "استشارة تغذية", provider: "د.سارة الأحمدي", date: "2026-03-28", time: "10:00", price: 150, status: "confirmed" },
    { id: "2", type: "lab", service: "تحليل شامل", provider: "مختبر النهضة", date: "2026-03-30", time: "08:30", price: 350, status: "pending" },
  ]);
  const [homeEquipment, setHomeEquipmentState] = useState<HomeEquipment[]>(["mat"]);
  const [isHomeWorkout, setIsHomeWorkoutState] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<DailyPoints[]>([
    { date: "2026-03-20", meals: 20, exercise: 25, water: 25, sleep: 20, weight: 5, total: 95 },
    { date: "2026-03-21", meals: 15, exercise: 20, water: 20, sleep: 25, weight: 0, total: 80 },
    { date: "2026-03-22", meals: 25, exercise: 0, water: 25, sleep: 20, weight: 0, total: 70 },
    { date: "2026-03-23", meals: 20, exercise: 25, water: 15, sleep: 25, weight: 5, total: 90 },
    { date: "2026-03-24", meals: 10, exercise: 15, water: 20, sleep: 15, weight: 0, total: 60 },
    { date: "2026-03-25", meals: 25, exercise: 25, water: 25, sleep: 25, weight: 5, total: 100 },
  ]);
  const [pointsNotification, setPointsNotification] = useState<PointsNotification | null>(null);
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [tierBonusPoints, setTierBonusPoints] = useState(0);
  const [lastMysteryBoxDate, setLastMysteryBoxDate] = useState<string | null>(null);
  const [lastMysteryReward, setLastMysteryReward] = useState<{ points: number; tierIcon: string } | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const DEFAULT_HOSPITAL_BAG: HospitalBagItem[] = [
    { id:"m1", category:"للأم", name:"ملابس مريحة", checked:false },
    { id:"m2", category:"للأم", name:"مستلزمات النظافة الشخصية", checked:false },
    { id:"m3", category:"للأم", name:"بطاقة الهوية الوطنية", checked:false },
    { id:"m4", category:"للأم", name:"بطاقة التأمين الصحي", checked:false },
    { id:"m5", category:"للأم", name:"شاحن الهاتف", checked:false },
    { id:"m6", category:"للأم", name:"سجل الحمل الطبي", checked:false },
    { id:"b1", category:"للطفل", name:"ملابس مولود (0-3 شهور) ×5", checked:false },
    { id:"b2", category:"للطفل", name:"بطانية لف", checked:false },
    { id:"b3", category:"للطفل", name:"قبعة ولفافة", checked:false },
    { id:"b4", category:"للطفل", name:"حفاضات مولود", checked:false },
    { id:"b5", category:"للطفل", name:"مناديل رطبة للمولود", checked:false },
    { id:"b6", category:"للطفل", name:"شامبو وكريم للمولود", checked:false },
    { id:"d1", category:"للأب/المرافق", name:"ملابس للمرافق ×2", checked:false },
    { id:"d2", category:"للأب/المرافق", name:"وجبات خفيفة وماء", checked:false },
    { id:"d3", category:"للأب/المرافق", name:"وثيقة عقد الزواج", checked:false },
  ];

  const [pregnancyData, setPregnancyDataState] = useState<PregnancyData>({
    isPregnant: false,
    lastPeriodDate: null,
    firstScanDate: null,
    babyGender: "surprise",
    babyName: "",
    prePregnancyWeight: null,
    height: null,
    symptoms: [],
    weightLogs: [],
    hospitalBag: DEFAULT_HOSPITAL_BAG,
    kickSessions: [],
  });
  const [beautyLogs, setBeautyLogs] = useState<BeautyLog[]>([]);
  const [hormoneEntries, setHormoneEntries] = useState<HormoneEntry[]>([]);
  const [hormoneTests, setHormoneTests] = useState<HormoneTest[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { id: "w1", date: "2026-02-01", weight: 72.0 },
    { id: "w2", date: "2026-02-08", weight: 71.5 },
    { id: "w3", date: "2026-02-15", weight: 71.8 },
    { id: "w4", date: "2026-02-22", weight: 71.2 },
    { id: "w5", date: "2026-03-01", weight: 70.9 },
    { id: "w6", date: "2026-03-08", weight: 71.0 },
    { id: "w7", date: "2026-03-15", weight: 70.5 },
  ]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [loggedIn, p, o, c, w, wl, me] = await Promise.all([
        AsyncStorage.getItem("isLoggedIn"),
        AsyncStorage.getItem("profile"),
        AsyncStorage.getItem("onboarding"),
        AsyncStorage.getItem("cycleData"),
        AsyncStorage.getItem("waterIntake"),
        AsyncStorage.getItem("workoutLogs"),
        AsyncStorage.getItem("moodEntries"),
      ]);
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        if (p) setProfileState(JSON.parse(p));
        else setProfileState(DEFAULT_PROFILE);
      }
      if (o) setOnboardingState(JSON.parse(o));
      if (c) setCycleDataState(JSON.parse(c));
      if (w) {
        const parsed = JSON.parse(w) as WaterIntake;
        if (parsed.date === todayStr()) setWaterIntake(parsed);
      }
      if (wl) setWorkoutLogs(JSON.parse(wl));
      if (me) setMoodEntries(JSON.parse(me));
      const wh = await AsyncStorage.getItem("weightHistory");
      if (wh) setWeightHistory(JSON.parse(wh));
      const ph = await AsyncStorage.getItem("pointsHistory");
      if (ph) setPointsHistory(JSON.parse(ph));
      const rp = await AsyncStorage.getItem("redeemedPoints");
      if (rp) setRedeemedPoints(JSON.parse(rp));
      const tbp = await AsyncStorage.getItem("tierBonusPoints");
      if (tbp) setTierBonusPoints(JSON.parse(tbp));
      const lmbd = await AsyncStorage.getItem("lastMysteryBoxDate");
      if (lmbd) setLastMysteryBoxDate(JSON.parse(lmbd));
      const heq = await AsyncStorage.getItem("homeEquipment");
      if (heq) setHomeEquipmentState(JSON.parse(heq));
      const ihw = await AsyncStorage.getItem("isHomeWorkout");
      if (ihw) setIsHomeWorkoutState(JSON.parse(ihw));
      const ml = await AsyncStorage.getItem("mealLogs");
      if (ml) setMealLogs(JSON.parse(ml));
      const sl = await AsyncStorage.getItem("shoppingList");
      if (sl) setShoppingList(JSON.parse(sl));
      const pd = await AsyncStorage.getItem("pregnancyData");
      if (pd) setPregnancyDataState(JSON.parse(pd));
      const bl = await AsyncStorage.getItem("beautyLogs");
      if (bl) setBeautyLogs(JSON.parse(bl));
      const he = await AsyncStorage.getItem("hormoneEntries");
      if (he) setHormoneEntries(JSON.parse(he));
      const ht = await AsyncStorage.getItem("hormoneTests");
      if (ht) setHormoneTests(JSON.parse(ht));
      const ug = await AsyncStorage.getItem("userGoals");
      if (ug) setUserGoalsState(JSON.parse(ug));
    } catch {}
    setLoaded(true);
  }

  const login = async (email: string) => {
    setIsLoggedIn(true);
    const p = { ...DEFAULT_PROFILE, email };
    setProfileState(p);
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("profile", JSON.stringify(p));
  };

  const loginAsGuest = async () => {
    setIsLoggedIn(true);
    setProfileState(DEFAULT_PROFILE);
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("profile", JSON.stringify(DEFAULT_PROFILE));
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.setItem("isLoggedIn", "false");
  };

  const setProfile = async (p: UserProfile) => {
    setProfileState(p);
    await AsyncStorage.setItem("profile", JSON.stringify(p));
  };

  const setOnboarding = async (o: OnboardingData) => {
    setOnboardingState(o);
    await AsyncStorage.setItem("onboarding", JSON.stringify(o));
  };

  const setCycleData = async (c: CycleData) => {
    setCycleDataState(c);
    await AsyncStorage.setItem("cycleData", JSON.stringify(c));
  };

  const updateCycleData = async (partial: Partial<CycleData>) => {
    const updated = { ...cycleData, ...partial };
    setCycleDataState(updated);
    await AsyncStorage.setItem("cycleData", JSON.stringify(updated));
  };

  const updatePregnancyData = async (partial: Partial<PregnancyData>) => {
    const updated = { ...pregnancyData, ...partial };
    setPregnancyDataState(updated);
    await AsyncStorage.setItem("pregnancyData", JSON.stringify(updated));
  };

  const addWaterGlass = async () => {
    const today = todayStr();
    const newGlasses = waterIntake.date === today ? waterIntake.glasses + 1 : 1;
    const next: WaterIntake = { date: today, glasses: newGlasses };
    setWaterIntake(next);
    await AsyncStorage.setItem("waterIntake", JSON.stringify(next));
    if (newGlasses <= 8) {
      const pts = newGlasses === 8 ? 10 : 3;
      const reason = newGlasses === 8 ? "أكملت 8 أكواب ماء!" : `كوب ماء #${newGlasses}`;
      addHealthPoints("water", pts, reason);
    }
  };

  const addWorkout = async (w: Omit<WorkoutLog, "id">) => {
    const newLog: WorkoutLog = { ...w, id: Date.now().toString() };
    const updated = [newLog, ...workoutLogs].slice(0, 50);
    setWorkoutLogs(updated);
    await AsyncStorage.setItem("workoutLogs", JSON.stringify(updated));
    addHealthPoints("exercise", 15, `أكملت تمرين ${w.name}`);
  };

  const addMoodEntry = async (m: Omit<MoodEntry, "id">) => {
    const newEntry: MoodEntry = { ...m, id: Date.now().toString() };
    const updated = [newEntry, ...moodEntries].slice(0, 100);
    setMoodEntries(updated);
    await AsyncStorage.setItem("moodEntries", JSON.stringify(updated));
  };

  const toggleFavorite = async (id: string) => {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  const addHabit = async (h: Omit<Habit, "id" | "completedDates">) => {
    const newHabit: Habit = { ...h, id: Date.now().toString(), completedDates: [] };
    const updated = [...habits, newHabit];
    setHabits(updated);
  };

  const toggleHabitDay = async (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const has = h.completedDates.includes(date);
        return { ...h, completedDates: has ? h.completedDates.filter((d) => d !== date) : [...h.completedDates, date] };
      })
    );
  };

  const addBooking = async (b: Omit<Booking, "id">) => {
    const newBooking: Booking = { ...b, id: Date.now().toString() };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const addWeightEntry = async (w: Omit<WeightEntry, "id">) => {
    const newEntry: WeightEntry = { ...w, id: Date.now().toString() };
    const updated = [...weightHistory, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeightHistory(updated);
    await AsyncStorage.setItem("weightHistory", JSON.stringify(updated));
    addHealthPoints("weight", 5, "تحديث الوزن اليومي");
  };

  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 70;

  const getTodayPoints = (): DailyPoints => {
    const today = todayStr();
    const existing = pointsHistory.find(p => p.date === today);
    return existing || { date: today, meals: 0, exercise: 0, water: 0, sleep: 0, weight: 0, total: 0 };
  };

  const todayPoints = getTodayPoints();

  const CATEGORY_EMOJIS: Record<string, string> = {
    meals: "🍽️",
    exercise: "🏋️",
    water: "💧",
    sleep: "😴",
    weight: "⚖️",
  };

  const CATEGORY_MAX: Record<string, number> = {
    meals: 25,
    exercise: 25,
    water: 25,
    sleep: 25,
    weight: 5,
  };

  const addHealthPoints = async (category: "meals" | "exercise" | "water" | "sleep" | "weight", points: number, reason: string) => {
    const today = todayStr();
    const maxForCat = CATEGORY_MAX[category] || 25;
    const baseTotal = pointsHistory.reduce((s, p) => s + p.total, 0);
    const tier = getTierForPoints(baseTotal);

    setPointsHistory(prev => {
      const idx = prev.findIndex(p => p.date === today);
      let updated: DailyPoints[];
      let actualPointsAdded = 0;

      if (idx >= 0) {
        const existing = prev[idx];
        const currentCatVal = existing[category] || 0;
        const actualPoints = Math.min(points, maxForCat - currentCatVal);
        if (actualPoints <= 0) return prev;
        actualPointsAdded = actualPoints;

        const newEntry = {
          ...existing,
          [category]: currentCatVal + actualPoints,
          total: Math.min(100, existing.total + actualPoints),
        };
        updated = [...prev];
        updated[idx] = newEntry;
      } else {
        const actualPoints = Math.min(points, maxForCat);
        actualPointsAdded = actualPoints;
        const newEntry: DailyPoints = {
          date: today,
          meals: 0,
          exercise: 0,
          water: 0,
          sleep: 0,
          weight: 0,
          [category]: actualPoints,
          total: actualPoints,
        };
        updated = [...prev, newEntry];
      }

      AsyncStorage.setItem("pointsHistory", JSON.stringify(updated));

      // Apply tier multiplier as bonus to redeemable balance
      if (tier.multiplier > 1 && actualPointsAdded > 0) {
        const bonus = Math.floor(actualPointsAdded * (tier.multiplier - 1));
        if (bonus > 0) {
          setTierBonusPoints(prevBonus => {
            const next = prevBonus + bonus;
            AsyncStorage.setItem("tierBonusPoints", JSON.stringify(next));
            return next;
          });
        }
      }
      return updated;
    });

    setPointsHistory(prev => {
      const todayEntry = prev.find(p => p.date === today);
      const currentCatVal = todayEntry ? (todayEntry[category] || 0) : 0;
      const actualPts = Math.min(points, maxForCat - currentCatVal);
      if (actualPts > 0) {
        const notif: PointsNotification = {
          id: Date.now().toString(),
          category,
          points: actualPts,
          reason,
          emoji: CATEGORY_EMOJIS[category] || "⭐",
          visible: true,
        };
        setPointsNotification(notif);
      }
      return prev;
    });
  };

  const dismissPointsNotification = () => setPointsNotification(null);

  const totalMonthlyPoints = (() => {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    return pointsHistory
      .filter(p => p.date >= monthStart)
      .reduce((sum, p) => sum + p.total, 0);
  })();

  const totalAllTimePoints = pointsHistory.reduce((sum, p) => sum + p.total, 0);
  const availablePoints = totalAllTimePoints + tierBonusPoints - redeemedPoints;
  const mysteryBoxAvailable = lastMysteryBoxDate !== todayStr();

  const redeemPoints = async (amount: number) => {
    if (amount <= availablePoints) {
      const newRedeemed = redeemedPoints + amount;
      setRedeemedPoints(newRedeemed);
      await AsyncStorage.setItem("redeemedPoints", JSON.stringify(newRedeemed));
    }
  };

  const claimMysteryBox = async () => {
    const today = todayStr();
    if (lastMysteryBoxDate === today) return null;
    const tier = getTierForPoints(totalAllTimePoints);
    const range = tier.mysteryMax - tier.mysteryMin + 1;
    const reward = tier.mysteryMin + Math.floor(Math.random() * range);
    const newBonus = tierBonusPoints + reward;
    setTierBonusPoints(newBonus);
    setLastMysteryBoxDate(today);
    const result = { points: reward, tierIcon: tier.icon };
    setLastMysteryReward(result);
    await AsyncStorage.setItem("tierBonusPoints", JSON.stringify(newBonus));
    await AsyncStorage.setItem("lastMysteryBoxDate", JSON.stringify(today));
    return result;
  };

  const dismissMysteryReward = () => setLastMysteryReward(null);

  const setHomeEquipment = async (eq: HomeEquipment[]) => {
    setHomeEquipmentState(eq);
    await AsyncStorage.setItem("homeEquipment", JSON.stringify(eq));
  };

  const setIsHomeWorkout = async (v: boolean) => {
    setIsHomeWorkoutState(v);
    await AsyncStorage.setItem("isHomeWorkout", JSON.stringify(v));
  };

  const addFoodToMeal = async (mealType: MealType, food: FoodItem, quantity: number) => {
    const today = todayStr();
    const loggedFood: LoggedFood = { id: Date.now().toString(), foodItem: food, quantity };

    setMealLogs(prev => {
      const existing = prev.find(m => m.date === today && m.mealType === mealType);
      let updated: MealLog[];
      if (existing) {
        updated = prev.map(m =>
          m.date === today && m.mealType === mealType
            ? { ...m, items: [...m.items, loggedFood] }
            : m
        );
      } else {
        const newLog: MealLog = { id: Date.now().toString(), date: today, mealType, items: [loggedFood] };
        updated = [...prev, newLog];
      }
      AsyncStorage.setItem("mealLogs", JSON.stringify(updated));
      return updated;
    });

    const mealPoints = Math.ceil((food.calories * quantity) / 100);
    addHealthPoints("meals", Math.min(mealPoints, 8), `${food.name} × ${quantity}`);
  };

  const removeFoodFromMeal = async (mealType: MealType, loggedFoodId: string) => {
    const today = todayStr();
    setMealLogs(prev => {
      const updated = prev.map(m => {
        if (m.date === today && m.mealType === mealType) {
          return { ...m, items: m.items.filter(i => i.id !== loggedFoodId) };
        }
        return m;
      }).filter(m => m.items.length > 0);
      AsyncStorage.setItem("mealLogs", JSON.stringify(updated));
      return updated;
    });
  };

  const addShoppingItem = (name: string, category: string) => {
    setShoppingList(prev => {
      const updated = [...prev, { id: Date.now().toString(), name: name.trim(), category, checked: false, addedAt: todayStr() }];
      AsyncStorage.setItem("shoppingList", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      AsyncStorage.setItem("shoppingList", JSON.stringify(updated));
      return updated;
    });
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(prev => {
      const updated = prev.filter(item => item.id !== id);
      AsyncStorage.setItem("shoppingList", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCheckedItems = () => {
    setShoppingList(prev => {
      const updated = prev.filter(item => !item.checked);
      AsyncStorage.setItem("shoppingList", JSON.stringify(updated));
      return updated;
    });
  };

  const setPregnancyData = async (p: PregnancyData) => {
    setPregnancyDataState(p);
    await AsyncStorage.setItem("pregnancyData", JSON.stringify(p));
  };

  const addBeautyLog = (log: BeautyLog) => {
    setBeautyLogs(prev => {
      const updated = [...prev.filter(l => l.date !== log.date), log];
      AsyncStorage.setItem("beautyLogs", JSON.stringify(updated));
      return updated;
    });
  };

  const addHormoneEntry = (e: HormoneEntry) => {
    setHormoneEntries(prev => {
      const updated = [...prev.filter(x => x.date !== e.date), e];
      AsyncStorage.setItem("hormoneEntries", JSON.stringify(updated));
      return updated;
    });
  };

  const addHormoneTest = (t: Omit<HormoneTest, "id">) => {
    setHormoneTests(prev => {
      const newTest: HormoneTest = { ...t, id: Date.now().toString() };
      const updated = [...prev, newTest];
      AsyncStorage.setItem("hormoneTests", JSON.stringify(updated));
      return updated;
    });
  };

  const todayMeals: Record<MealType, LoggedFood[]> = (() => {
    const today = todayStr();
    const result: Record<MealType, LoggedFood[]> = { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] };
    mealLogs.filter(m => m.date === today).forEach(m => { result[m.mealType] = m.items; });
    return result;
  })();

  const todayNutrition: DailyNutrition = (() => {
    const allItems = Object.values(todayMeals).flat();
    return {
      calories: Math.round(allItems.reduce((s, i) => s + i.foodItem.calories * i.quantity, 0)),
      protein: Math.round(allItems.reduce((s, i) => s + i.foodItem.protein * i.quantity, 0)),
      carbs: Math.round(allItems.reduce((s, i) => s + i.foodItem.carbs * i.quantity, 0)),
      fat: Math.round(allItems.reduce((s, i) => s + i.foodItem.fat * i.quantity, 0)),
      fiber: Math.round(allItems.reduce((s, i) => s + (i.foodItem.fiber || 0) * i.quantity, 0)),
    };
  })();

  const nutritionGoal = { calories: 2200, protein: 120, carbs: 275, fat: 73, fiber: 30 };

  const setUserGoals = async (g: { water: number; caloriesBurn: number; sleep: number; steps: number; activeMinutes: number }) => {
    setUserGoalsState(g);
    await AsyncStorage.setItem("userGoals", JSON.stringify(g));
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        loaded,
        login,
        loginAsGuest,
        logout,
        profile,
        setProfile,
        onboarding,
        setOnboarding,
        cycleData,
        setCycleData,
        updateCycleData,
        waterIntake,
        addWaterGlass,
        workoutLogs,
        addWorkout,
        moodEntries,
        addMoodEntry,
        favorites,
        toggleFavorite,
        habits,
        addHabit,
        toggleHabitDay,
        bookings,
        addBooking,
        weightHistory,
        addWeightEntry,
        currentWeight,
        homeEquipment,
        setHomeEquipment,
        isHomeWorkout,
        setIsHomeWorkout,
        mealLogs,
        addFoodToMeal,
        removeFoodFromMeal,
        todayMeals,
        todayNutrition,
        nutritionGoal,
        userGoals,
        setUserGoals,
        steps: 6247,
        sleepHours: 7.2,
        caloriesConsumed: todayNutrition.calories || 0,
        pointsHistory,
        todayPoints,
        addHealthPoints,
        pointsNotification,
        dismissPointsNotification,
        totalMonthlyPoints,
        totalAllTimePoints,
        redeemedPoints,
        redeemPoints,
        tierBonusPoints,
        availablePoints,
        mysteryBoxAvailable,
        lastMysteryReward,
        claimMysteryBox,
        dismissMysteryReward,
        shoppingList,
        addShoppingItem,
        toggleShoppingItem,
        removeShoppingItem,
        clearCheckedItems,
        pregnancyData,
        setPregnancyData,
        updatePregnancyData,
        beautyLogs,
        addBeautyLog,
        hormoneEntries,
        addHormoneEntry,
        hormoneTests,
        addHormoneTest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
