import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FOOD_DATABASE,
  BARCODE_PRODUCTS,
  MEAL_TYPE_INFO,
  type FoodItem,
  type MealType,
  type LoggedFood,
  type ShoppingItem,
} from "@/context/AppContext";

I18nManager.forceRTL(true);
const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const FOOD_CATEGORIES = [
  { id: "all", label: "الكل", emoji: "🔍" },
  { id: "protein", label: "بروتين", emoji: "🥩" },
  { id: "grains", label: "حبوب", emoji: "🌾" },
  { id: "dairy", label: "ألبان", emoji: "🥛" },
  { id: "fruits", label: "فواكه", emoji: "🍎" },
  { id: "vegetables", label: "خضار", emoji: "🥬" },
  { id: "fats", label: "دهون", emoji: "🥑" },
  { id: "meals", label: "وجبات", emoji: "🍽️" },
  { id: "snacks", label: "سناكات", emoji: "🍪" },
  { id: "drinks", label: "مشروبات", emoji: "☕" },
  { id: "supplements", label: "مكملات", emoji: "💊" },
];

const GOALS = [
  { id: "lose", label: "إنقاص الوزن", emoji: "⬇️", cal: 1800, p: 130, c: 200, f: 55, fiber: 25 },
  { id: "gain", label: "زيادة الوزن", emoji: "⬆️", cal: 2800, p: 140, c: 350, f: 85, fiber: 30 },
  { id: "cut", label: "تنشيف", emoji: "🔥", cal: 1600, p: 160, c: 150, f: 45, fiber: 25 },
  { id: "bulk", label: "تضخيم", emoji: "💪", cal: 3200, p: 180, c: 400, f: 95, fiber: 30 },
  { id: "postpartum", label: "ما بعد الحمل", emoji: "🤱", cal: 2200, p: 110, c: 275, f: 70, fiber: 28 },
  { id: "maintain", label: "المحافظة", emoji: "⚖️", cal: 2200, p: 120, c: 275, f: 73, fiber: 30 },
  { id: "keto", label: "كيتو", emoji: "🥑", cal: 2000, p: 120, c: 50, f: 150, fiber: 15 },
  { id: "balanced", label: "متوازن", emoji: "🥗", cal: 2200, p: 120, c: 275, f: 73, fiber: 30 },
];

const SHOPPING_CATEGORIES = [
  { id: "meat", label: "لحوم ودواجن", emoji: "🥩" },
  { id: "dairy", label: "ألبان وأجبان", emoji: "🥛" },
  { id: "grains", label: "أرز وحبوب", emoji: "🌾" },
  { id: "drinks", label: "مشروبات", emoji: "🧃" },
  { id: "produce", label: "فواكه وخضار", emoji: "🥬" },
  { id: "other", label: "أخرى", emoji: "📦" },
];

const NUTRITION_TIPS = [
  { emoji: "💧", title: "اشرب الماء قبل الأكل", body: "شرب كوب ماء قبل كل وجبة يساعد على تقليل الشهية وتحسين الهضم." },
  { emoji: "🥗", title: "قاعدة الطبق الصحي", body: "نصف الطبق خضار، ربع بروتين، وربع كربوهيدرات معقدة." },
  { emoji: "🕐", title: "توقيت الوجبات", body: "توزيع السعرات على 5 وجبات صغيرة يحافظ على مستوى الطاقة طوال اليوم." },
  { emoji: "🍳", title: "طرق الطهي الصحية", body: "الشوي والسلق والبخار أفضل من القلي في الحفاظ على قيمة الطعام الغذائية." },
];

const BLOG_POSTS = [
  {
    emoji: "🧬", title: "الأحماض الأمينية الأساسية", subtitle: "لماذا جسمك يحتاجها يومياً؟", time: "4 دقائق", color: "#F43F5E", tag: "بروتين",
    body: "الأحماض الأمينية هي اللبنات الأساسية للبروتينات في جسمك. هناك 9 أحماض أمينية أساسية لا يستطيع جسمك إنتاجها بنفسه، لذا يجب الحصول عليها من الغذاء.\n\n🥩 المصادر الحيوانية: اللحوم والدواجن والأسماك والبيض ومنتجات الألبان تحتوي على جميع الأحماض الأمينية الأساسية.\n\n🌱 المصادر النباتية: السويا والكينوا والحمص يمكن دمجها للحصول على بروتين كامل.\n\n✅ الفوائد: بناء العضلات، إصلاح الأنسجة، دعم جهاز المناعة، تحسين المزاج، وتعزيز التركيز.",
  },
  {
    emoji: "🌾", title: "الكربوهيدرات المعقدة", subtitle: "الفرق بين الجيد والسيء", time: "3 دقائق", color: "#F59E0B", tag: "طاقة",
    body: "ليست كل الكربوهيدرات متساوية — هناك فرق جوهري بين الكربوهيدرات البسيطة والمعقدة.\n\n⚡ الكربوهيدرات البسيطة: السكر الأبيض، المشروبات الغازية، الحلويات — ترفع السكر بسرعة ثم تهبط فجأة، مما يسبب الخمول والجوع المتكرر.\n\n🌾 الكربوهيدرات المعقدة: الشوفان، الأرز البني، البطاطا، الخبز الأسمر — تُهضم ببطء وتُمد الجسم بطاقة مستمرة.\n\n💡 النصيحة: اختر دائماً الكربوهيدرات عالية الألياف واستهدف أن تكون ربع طبقك فقط.",
  },
  {
    emoji: "🥑", title: "الدهون الصحية", subtitle: "أوميغا-3 وفوائده المذهلة", time: "5 دقائق", color: "#22C55E", tag: "دهون",
    body: "الدهون ليست عدوك — بل هي ضرورية لصحة الدماغ والقلب وامتصاص الفيتامينات الذائبة في الدهون.\n\n🐟 أوميغا-3: يوجد في السلمون والسردين وبذور الكتان. يقلل الالتهابات، يحسن الذاكرة، ويحمي القلب.\n\n🥑 الأفوكادو والمكسرات: مصادر ممتازة للدهون الأحادية غير المشبعة التي تدعم صحة القلب.\n\n❌ ابتعد عن: الدهون المتحولة الموجودة في الوجبات السريعة والمعالجة — فهي تضر بالقلب وترفع الكوليسترول الضار.",
  },
  {
    emoji: "🌿", title: "الفيتامينات والمعادن", subtitle: "نقص أي فيتامين يؤثر على صحتك؟", time: "6 دقائق", color: "#3B82F6", tag: "فيتامينات",
    body: "نقص الفيتامينات والمعادن شائع جداً في السعودية، خاصة فيتامين د والحديد والمغنيسيوم.\n\n☀️ فيتامين د: أكثر من 80% من السعوديين يعانون من نقصه رغم وفرة الشمس. يؤثر على المناعة والعظام والمزاج.\n\n🩸 الحديد: النساء والنباتيون أكثر عرضة للنقص. يسبب التعب والشحوب وضعف التركيز.\n\n🦴 الكالسيوم: ضروري للعظام والأسنان والوظائف العصبية. مصادره: الألبان والخضار الورقية والسمسم.\n\n💊 النصيحة: أجرِ فحصاً دورياً لتحديد نقص الفيتامينات بدقة قبل تناول المكملات.",
  },
];

const PRO_FEATURES = [
  { emoji: "🧪", label: "تحليل شامل للفيتامينات والمعادن" },
  { emoji: "📊", label: "رسوم بيانية تفصيلية للمغذيات" },
  { emoji: "🎯", label: "مقارنة مع القيمة اليومية الموصى بها" },
  { emoji: "🤖", label: "توصيات غذائية مدعومة بالذكاء الاصطناعي" },
  { emoji: "📋", label: "خطط وجبات أسبوعية مخصصة" },
];

const SPECIALISTS_NUTRITION = [
  { id: "spec-1", name: "د. سارة الأحمدي", title: "أخصائية تغذية علاجية", rating: 4.9, price: 150, available: true },
  { id: "spec-6", name: "د. منى الشهري", title: "أخصائية تغذية رياضية", rating: 4.8, price: 180, available: true },
  { id: "spec-7", name: "د. فاطمة العنزي", title: "أخصائية تغذية أطفال", rating: 4.7, price: 130, available: true },
];

type AddFoodTab = "search" | "manual" | "barcode";

function ShoppingItemRow({
  item,
  isDark,
  colors,
  onToggle,
  onRemove,
}: {
  item: ShoppingItem;
  isDark: boolean;
  colors: any;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(item.checked ? 1 : 0)).current;
  const strikeAnim = useRef(new Animated.Value(item.checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: item.checked ? 1 : 0, useNativeDriver: true, tension: 80, friction: 7 }),
      Animated.timing(strikeAnim, { toValue: item.checked ? 1 : 0, duration: 200, useNativeDriver: false }),
    ]).start();
  }, [item.checked]);

  const catInfo = SHOPPING_CATEGORIES.find(c => c.id === item.category) || SHOPPING_CATEGORIES[5];

  return (
    <View style={[shopStyles.itemRow, { borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }]}>
      <Pressable style={shopStyles.checkArea} onPress={onToggle}>
        <View style={[shopStyles.checkbox, { borderColor: item.checked ? "#A86DBF" : colors.muted, backgroundColor: item.checked ? "#A86DBF" : "transparent" }]}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Feather name="check" size={14} color="#fff" />
          </Animated.View>
        </View>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Animated.Text
          style={[
            shopStyles.itemName,
            { color: colors.text },
            item.checked && { color: colors.muted, textDecorationLine: "line-through" },
          ]}
        >
          {item.name}
        </Animated.Text>
        <Text style={[shopStyles.itemCat, { color: colors.muted }]}>{catInfo.emoji} {catInfo.label}</Text>
      </View>
      <Pressable onPress={onRemove} style={shopStyles.removeItemBtn}>
        <Feather name="trash-2" size={15} color={colors.muted} />
      </Pressable>
    </View>
  );
}

export default function NutritionPlanScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    waterIntake, addWaterGlass,
    todayMeals, todayNutrition, nutritionGoal, addFoodToMeal, removeFoodFromMeal,
    shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem, clearCheckedItems,
  } = useApp();
  const topPadding = isWeb ? 67 : insets.top;

  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");
  const [expandedMeal, setExpandedMeal] = useState<MealType | null>("breakfast");
  const [addFoodTab, setAddFoodTab] = useState<AddFoodTab>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingQty, setServingQty] = useState("1");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeResult, setBarcodeResult] = useState<FoodItem | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualCal, setManualCal] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");
  const [manualServing, setManualServing] = useState("");
  const [manualUnit, setManualUnit] = useState("جم");

  const [shopCategoryFilter, setShopCategoryFilter] = useState("all");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("other");
  const [showAddShopItem, setShowAddShopItem] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  const goal = GOALS.find((g) => g.id === selectedGoal) || GOALS[5];
  const remaining = Math.max(0, goal.cal - todayNutrition.calories);
  const calPct = Math.min(100, (todayNutrition.calories / goal.cal) * 100);

  const filteredFoods = useMemo(() => {
    let foods = FOOD_DATABASE;
    if (searchCategory !== "all") foods = foods.filter(f => f.category === searchCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      foods = foods.filter(f => f.name.includes(q) || (f.nameEn && f.nameEn.toLowerCase().includes(q)));
    }
    return foods;
  }, [searchQuery, searchCategory]);

  const filteredShopItems = useMemo(() => {
    if (shopCategoryFilter === "all") return shoppingList;
    if (shopCategoryFilter === "checked") return shoppingList.filter(i => i.checked);
    return shoppingList.filter(i => i.category === shopCategoryFilter);
  }, [shoppingList, shopCategoryFilter]);

  const checkedCount = shoppingList.filter(i => i.checked).length;

  const openAddFood = (mealType: MealType) => {
    setActiveMealType(mealType);
    setShowAddFood(true);
    setAddFoodTab("search");
    setSearchQuery("");
    setSearchCategory("all");
    setSelectedFood(null);
    setServingQty("1");
    setBarcodeInput("");
    setBarcodeResult(null);
    resetManual();
  };

  const resetManual = () => {
    setManualName(""); setManualCal(""); setManualProtein(""); setManualCarbs(""); setManualFat(""); setManualServing(""); setManualUnit("جم");
  };

  const handleAddFood = (food: FoodItem, qty: number) => {
    addFoodToMeal(activeMealType, food, qty);
    setShowAddFood(false);
    setSelectedFood(null);
  };

  const handleManualAdd = () => {
    const cal = parseFloat(manualCal);
    if (!manualName.trim() || isNaN(cal) || cal <= 0) {
      Alert.alert("خطأ", "يرجى إدخال اسم الطعام والسعرات الحرارية");
      return;
    }
    const food: FoodItem = {
      id: `manual_${Date.now()}`,
      name: manualName.trim(),
      category: "meals",
      servingSize: parseFloat(manualServing) || 100,
      servingUnit: manualUnit,
      calories: cal,
      protein: parseFloat(manualProtein) || 0,
      carbs: parseFloat(manualCarbs) || 0,
      fat: parseFloat(manualFat) || 0,
    };
    handleAddFood(food, 1);
  };

  const handleBarcodeScan = () => {
    const code = barcodeInput.trim();
    if (!code) { Alert.alert("خطأ", "يرجى إدخال رمز الباركود"); return; }
    const found = BARCODE_PRODUCTS[code];
    if (found) setBarcodeResult(found);
    else Alert.alert("غير موجود", "لم يتم العثور على المنتج. جرّب الإضافة يدوياً.");
  };

  const handleAddShopItem = () => {
    if (!newItemName.trim()) { Alert.alert("خطأ", "أدخل اسم المنتج"); return; }
    addShoppingItem(newItemName, newItemCategory);
    setNewItemName("");
    setShowAddShopItem(false);
  };

  const mealSlots: MealType[] = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
  const getMealCalories = (items: LoggedFood[]) => Math.round(items.reduce((s, i) => s + i.foodItem.calories * i.quantity, 0));

  const TARGET_GLASSES = 8;

  const macros = [
    { label: "بروتين", val: todayNutrition.protein, max: goal.p, color: "#F43F5E", emoji: "🥩" },
    { label: "كربوهيدرات", val: todayNutrition.carbs, max: goal.c, color: "#F59E0B", emoji: "🌾" },
    { label: "دهون", val: todayNutrition.fat, max: goal.f, color: "#22C55E", emoji: "🥑" },
    { label: "ألياف", val: todayNutrition.fiber, max: goal.fiber, color: "#3B82F6", emoji: "🥬" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>التغذية</Text>
        <Pressable
          onPress={() => setShowGoalEditor(!showGoalEditor)}
          style={[styles.editGoalBtn, { backgroundColor: isDark ? colors.card : "#F3EBF8", borderColor: "#A86DBF40" }]}
        >
          <Feather name="sliders" size={14} color="#A86DBF" />
          <Text style={styles.editGoalText}>تعديل برنامجي</Text>
        </Pressable>
      </View>

      {showGoalEditor && (
        <View style={styles.goalEditorSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 10 }]}>🎯 اختر هدفك الغذائي</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}>
            {GOALS.map((g) => (
              <Pressable
                key={g.id}
                onPress={() => { setSelectedGoal(g.id); setShowGoalEditor(false); }}
                style={[styles.goalChip, { backgroundColor: selectedGoal === g.id ? "#A86DBF" : (isDark ? colors.card : "#fff"), borderColor: selectedGoal === g.id ? "#A86DBF" : colors.border }]}
              >
                <Text style={{ fontSize: 18 }}>{g.emoji}</Text>
                <Text style={[styles.goalChipText, { color: selectedGoal === g.id ? "#fff" : colors.text }]}>{g.label}</Text>
                <Text style={[styles.goalChipCal, { color: selectedGoal === g.id ? "rgba(255,255,255,0.75)" : colors.muted }]}>{g.cal} سعرة</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
        <View style={styles.waterHeader}>
          <Text style={{ fontSize: 18 }}>💧</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>الماء اليومي</Text>
          <Text style={[styles.waterCount, { color: "#3B82F6" }]}>{waterIntake.glasses}/{TARGET_GLASSES} أكواب</Text>
        </View>
        <View style={styles.glassesRow}>
          {Array.from({ length: TARGET_GLASSES }).map((_, i) => (
            <Pressable key={i} onPress={waterIntake.glasses <= i ? addWaterGlass : undefined} style={styles.glassBtn}>
              <View style={[styles.glass, { backgroundColor: i < waterIntake.glasses ? "#3B82F620" : (isDark ? "rgba(255,255,255,0.05)" : "#F0F4FF"), borderColor: i < waterIntake.glasses ? "#3B82F6" : colors.border }]}>
                <Text style={{ fontSize: i < waterIntake.glasses ? 20 : 18, opacity: i < waterIntake.glasses ? 1 : 0.3 }}>💧</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={[styles.waterBar, { backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#EFF6FF" }]}>
          <View style={[styles.waterBarFill, { width: `${Math.min(100, (waterIntake.glasses / TARGET_GLASSES) * 100)}%` }]} />
        </View>
        <Text style={[styles.waterMl, { color: colors.muted }]}>{waterIntake.glasses * 250} مل من {TARGET_GLASSES * 250} مل</Text>
        {waterIntake.glasses < TARGET_GLASSES && (
          <Pressable style={styles.addGlassBtn} onPress={addWaterGlass}>
            <Feather name="plus" size={14} color="#fff" />
            <Text style={styles.addGlassTxt}>أضف كوب</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.progressCard}>
        <Image
          source={require("@/assets/images/meal-prep.png")}
          style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(110,30,160,0.84)", "rgba(200,80,130,0.90)"]}
          style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <View style={styles.progressTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelEmoji}>🔥</Text>
              <Text style={styles.progressLabel}>السعرات المتبقية</Text>
            </View>
            <Text style={styles.progressBig}>{remaining}</Text>
            <Text style={styles.progressSub}>{todayNutrition.calories} من {goal.cal} سعرة • {goal.label}</Text>
          </View>
          <View style={styles.calCircle}>
            <Text style={styles.calCirclePct}>{Math.round(calPct)}%</Text>
            <Text style={styles.calCircleLabel}>مُحقق</Text>
          </View>
        </View>
        <View style={[styles.calBarBg, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <View style={[styles.calBarFill, { width: `${calPct}%` }]} />
        </View>
        <View style={styles.macroRowsWrap}>
          {macros.map((m, i) => {
            const pct = Math.min(100, (m.val / m.max) * 100);
            return (
              <View key={i} style={styles.macroRowItem}>
                <View style={styles.macroRowLeft}>
                  <Text style={{ fontSize: 14 }}>{m.emoji}</Text>
                  <Text style={styles.macroRowLabel}>{m.label}</Text>
                </View>
                <View style={styles.macroBarBg}>
                  <View style={[styles.macroBarFill, { width: `${pct}%`, backgroundColor: m.color }]} />
                </View>
                <Text style={[styles.macroRowVal, { color: m.color }]}>{m.val}/{m.max}ج</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.mealsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>وجبات اليوم 🍽️</Text>
        {mealSlots.map((mealType) => {
          const info = MEAL_TYPE_INFO[mealType];
          const items = todayMeals[mealType];
          const cal = getMealCalories(items);
          const isExpanded = expandedMeal === mealType;
          return (
            <View key={mealType} style={[styles.mealCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
              <Pressable onPress={() => setExpandedMeal(isExpanded ? null : mealType)} style={styles.mealHeader}>
                <View style={styles.mealHeaderLeft}>
                  <Text style={{ fontSize: 24 }}>{info.emoji}</Text>
                  <View>
                    <Text style={[styles.mealName, { color: colors.text }]}>{info.name}</Text>
                    <Text style={[styles.mealTime, { color: colors.muted }]}>{info.time} • {items.length} عنصر</Text>
                  </View>
                </View>
                <View style={styles.mealHeaderRight}>
                  <Text style={[styles.mealCal, { color: cal > 0 ? "#F59E0B" : colors.muted }]}>{cal} سعرة</Text>
                  <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.muted} />
                </View>
              </Pressable>

              {isExpanded && (
                <View style={styles.mealItemsWrap}>
                  {items.length > 0 ? items.map((item) => (
                    <View key={item.id} style={[styles.mealItem, { borderColor: colors.border }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.mealItemName, { color: colors.text }]}>
                          {item.foodItem.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                        </Text>
                        <Text style={[styles.mealItemServing, { color: colors.muted }]}>
                          {item.foodItem.servingSize * item.quantity}{item.foodItem.servingUnit}
                        </Text>
                      </View>
                      <View style={styles.mealItemMacros}>
                        <Text style={[styles.mealItemMacro, { color: "#F59E0B" }]}>{Math.round(item.foodItem.calories * item.quantity)}</Text>
                        <Text style={[styles.mealItemMacroLabel, { color: colors.muted }]}>سعرة</Text>
                      </View>
                      <View style={styles.mealItemMacrosSmall}>
                        <Text style={[styles.macroSmallTag, { backgroundColor: "#F43F5E15", color: "#F43F5E" }]}>ب{Math.round(item.foodItem.protein * item.quantity)}</Text>
                        <Text style={[styles.macroSmallTag, { backgroundColor: "#F59E0B15", color: "#F59E0B" }]}>ك{Math.round(item.foodItem.carbs * item.quantity)}</Text>
                        <Text style={[styles.macroSmallTag, { backgroundColor: "#22C55E15", color: "#22C55E" }]}>د{Math.round(item.foodItem.fat * item.quantity)}</Text>
                      </View>
                      <Pressable onPress={() => removeFoodFromMeal(mealType, item.id)} style={styles.removeBtn}>
                        <Feather name="x" size={14} color="#F43F5E" />
                      </Pressable>
                    </View>
                  )) : (
                    <Text style={[styles.emptyMeal, { color: colors.muted }]}>لم تضف أي طعام بعد</Text>
                  )}
                  <Pressable style={[styles.addItemBtn, { borderColor: "#A86DBF40" }]} onPress={() => openAddFood(mealType)}>
                    <Feather name="plus" size={16} color="#A86DBF" />
                    <Text style={styles.addItemBtnText}>إضافة طعام</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={[styles.proSection, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
        <LinearGradient
          colors={isDark ? ["#1C1330", "#140D22"] : ["#FDF5FF", "#FFF5F7"]}
          style={styles.proCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={styles.proHeader}>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
            <Text style={[styles.proTitle, { color: colors.text }]}>تحليل التغذية المتقدم</Text>
          </View>

          <View style={styles.proPreview}>
            {["فيتامين D", "الحديد", "أوميغا-3", "الكالسيوم"].map((v, i) => (
              <View key={i} style={[styles.proVitaminRow, { borderColor: colors.border }]}>
                <View style={[styles.proVitaminBar, { width: `${[72, 45, 30, 88][i]}%`, backgroundColor: ["#F59E0B", "#F43F5E", "#3B82F6", "#22C55E"][i] }]} />
                <Text style={[styles.proVitaminLabel, { color: colors.text }]}>{v}</Text>
              </View>
            ))}
          </View>

          <View style={styles.proBlur}>
            <LinearGradient
              colors={isDark ? ["rgba(14,8,24,0.7)", "rgba(14,8,24,0.97)"] : ["rgba(255,245,255,0.6)", "rgba(255,245,255,0.97)"]}
              style={styles.proBlurGradient}
            />
            <View style={styles.proBlurContent}>
              <Text style={{ fontSize: 32 }}>🔒</Text>
              <Text style={[styles.proBlurTitle, { color: colors.text }]}>تحليل التغذية الشامل</Text>
              <Text style={[styles.proBlurSub, { color: colors.muted }]}>لاستعراض تحليل التغذية الشامل، اشترك الآن</Text>
              <View style={styles.proFeaturesList}>
                {PRO_FEATURES.map((f, i) => (
                  <View key={i} style={styles.proFeatureRow}>
                    <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
                    <Text style={[styles.proFeatureLabel, { color: colors.text }]}>{f.label}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                style={styles.proSubscribeBtn}
                onPress={() => router.push("/subscription" as any)}
              >
                <Text style={styles.proSubscribeTxt}>اشترك الآن ✨</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={[styles.shopSection, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
        <View style={styles.shopHeader}>
          <Pressable style={[styles.shopAddBtn, { backgroundColor: "#A86DBF" }]} onPress={() => setShowAddShopItem(!showAddShopItem)}>
            <Feather name={showAddShopItem ? "x" : "plus"} size={16} color="#fff" />
          </Pressable>
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>لستة المقاضي 🛒</Text>
            <Text style={[styles.shopSubtitle, { color: colors.muted }]}>{shoppingList.length} منتج • {checkedCount} تم شراؤه</Text>
          </View>
        </View>

        {showAddShopItem && (
          <View style={[styles.addShopForm, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5", borderColor: colors.border }]}>
            <TextInput
              style={[styles.shopInput, { backgroundColor: isDark ? colors.card : "#fff", color: colors.text, borderColor: colors.border }]}
              placeholder="اسم المنتج..."
              placeholderTextColor={colors.muted}
              value={newItemName}
              onChangeText={setNewItemName}
              textAlign="right"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 6, paddingVertical: 8 }}>
              {SHOPPING_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, { backgroundColor: newItemCategory === cat.id ? "#A86DBF" : (isDark ? colors.card : "#fff"), borderColor: newItemCategory === cat.id ? "#A86DBF" : colors.border }]}
                  onPress={() => setNewItemCategory(cat.id)}
                >
                  <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
                  <Text style={[styles.catChipText, { color: newItemCategory === cat.id ? "#fff" : colors.muted }]}>{cat.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={[styles.shopConfirmBtn, { backgroundColor: "#A86DBF" }]} onPress={handleAddShopItem}>
              <Feather name="plus" size={14} color="#fff" />
              <Text style={styles.shopConfirmTxt}>إضافة للقائمة</Text>
            </Pressable>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 6, paddingVertical: 10 }}>
          {[{ id: "all", label: "الكل", emoji: "📋" }, { id: "checked", label: "تم شراؤه", emoji: "✅" }, ...SHOPPING_CATEGORIES].map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.shopFilterChip, { backgroundColor: shopCategoryFilter === cat.id ? "#A86DBF15" : "transparent", borderColor: shopCategoryFilter === cat.id ? "#A86DBF" : colors.border }]}
              onPress={() => setShopCategoryFilter(cat.id)}
            >
              <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
              <Text style={[styles.shopFilterText, { color: shopCategoryFilter === cat.id ? "#A86DBF" : colors.muted }]}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredShopItems.length === 0 ? (
          <View style={styles.shopEmpty}>
            <Text style={{ fontSize: 36 }}>🛒</Text>
            <Text style={[styles.shopEmptyText, { color: colors.muted }]}>القائمة فارغة</Text>
            <Text style={[styles.shopEmptyHint, { color: colors.muted }]}>اضغط + لإضافة منتجات</Text>
          </View>
        ) : (
          filteredShopItems.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              isDark={isDark}
              colors={colors}
              onToggle={() => toggleShoppingItem(item.id)}
              onRemove={() => removeShoppingItem(item.id)}
            />
          ))
        )}

        {checkedCount > 0 && (
          <Pressable style={[styles.clearCheckedBtn, { borderColor: "#F43F5E40" }]} onPress={clearCheckedItems}>
            <Feather name="trash-2" size={14} color="#F43F5E" />
            <Text style={styles.clearCheckedTxt}>مسح المشتراة ({checkedCount})</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.tipsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>نصائح غذائية يومية 💡</Text>
        {NUTRITION_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
            <Text style={{ fontSize: 28 }}>{tip.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
              <Text style={[styles.tipBody, { color: colors.muted }]}>{tip.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.blogSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>مدونة الغذاء الصحي 📚</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20, flexDirection: "row-reverse" }}
        >
          {BLOG_POSTS.map((post, i) => (
            <Pressable
              key={i}
              style={[styles.blogCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
              onPress={() => setSelectedBlogPost(post)}
            >
              <LinearGradient
                colors={[post.color + "CC", post.color + "88"]}
                style={styles.blogCardBanner}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={{ fontSize: 36 }}>{post.emoji}</Text>
                <View style={[styles.blogTagPill, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                  <Text style={styles.blogTagText}>{post.tag}</Text>
                </View>
              </LinearGradient>
              <View style={styles.blogCardBody}>
                <Text style={[styles.blogTitle, { color: colors.text }]} numberOfLines={2}>{post.title}</Text>
                <Text style={[styles.blogSub, { color: colors.muted }]} numberOfLines={1}>{post.subtitle}</Text>
                <View style={styles.blogTime}>
                  <Text style={[styles.blogTimeTxt, { color: post.color }]}>اقرأ المزيد ←</Text>
                  <View style={{ flex: 1 }} />
                  <Feather name="clock" size={11} color={colors.muted} />
                  <Text style={[styles.blogTimeTxt, { color: colors.muted }]}>{post.time}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {selectedBlogPost && (
        <Modal visible animationType="slide" transparent onRequestClose={() => setSelectedBlogPost(null)}>
          <Pressable style={styles.modalOverlay} onPress={() => setSelectedBlogPost(null)}>
            <Pressable onPress={() => {}} style={[styles.blogDetailSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
              <View style={styles.handle} />
              <LinearGradient
                colors={[selectedBlogPost.color + "CC", selectedBlogPost.color + "44"]}
                style={styles.blogDetailBanner}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Pressable style={styles.blogDetailClose} onPress={() => setSelectedBlogPost(null)}>
                  <Feather name="x" size={20} color="#fff" />
                </Pressable>
                <Text style={{ fontSize: 52, marginBottom: 8 }}>{selectedBlogPost.emoji}</Text>
                <View style={[styles.blogTagPill, { backgroundColor: "rgba(255,255,255,0.3)", alignSelf: "flex-end" }]}>
                  <Text style={styles.blogTagText}>{selectedBlogPost.tag}</Text>
                </View>
              </LinearGradient>
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 32 }}>
                <Text style={[styles.blogDetailTitle, { color: colors.text }]}>{selectedBlogPost.title}</Text>
                <Text style={[styles.blogDetailSubtitle, { color: colors.muted }]}>{selectedBlogPost.subtitle}</Text>
                <View style={styles.blogDetailMeta}>
                  <Feather name="clock" size={13} color={colors.muted} />
                  <Text style={[styles.blogDetailMetaText, { color: colors.muted }]}>{selectedBlogPost.time} قراءة</Text>
                  <View style={[styles.blogDetailTagSmall, { backgroundColor: selectedBlogPost.color + "20" }]}>
                    <Text style={[styles.blogDetailTagSmallText, { color: selectedBlogPost.color }]}>{selectedBlogPost.tag}</Text>
                  </View>
                </View>
                <View style={[styles.blogDetailDivider, { backgroundColor: colors.border }]} />
                <Text style={[styles.blogDetailBody, { color: colors.text }]}>{selectedBlogPost.body}</Text>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      <View style={styles.specSection}>
        <Pressable style={styles.specBanner}>
          <Image source={require("@/assets/images/nutrition-banner.png")} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]} style={StyleSheet.absoluteFill} />
          <View style={styles.specBannerContent}>
            <Text style={styles.specBannerTitle}>👨‍⚕️ احجز مع أخصائي تغذية</Text>
            <Text style={styles.specBannerSub}>احصل على خطة تغذية مخصصة من مختص معتمد</Text>
          </View>
        </Pressable>
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>مختصو التغذية 🥗</Text>
        {SPECIALISTS_NUTRITION.map((spec) => (
          <Pressable
            key={spec.id}
            style={[styles.specCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
            onPress={() => router.push(`/providers/detail/${spec.id}?type=specialists` as any)}
          >
            <View style={[styles.specAvatar, { backgroundColor: "#A86DBF15" }]}>
              <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.specNameRow}>
                <Text style={[styles.specName, { color: colors.text }]}>{spec.name}</Text>
                <View style={[styles.specBadge, { backgroundColor: spec.available ? "#22C55E15" : "#F43F5E15" }]}>
                  <View style={[styles.specDot, { backgroundColor: spec.available ? "#22C55E" : "#F43F5E" }]} />
                  <Text style={{ color: spec.available ? "#22C55E" : "#F43F5E", fontSize: 10, fontFamily: "Tajawal_700Bold" }}>
                    {spec.available ? "متاح" : "غير متاح"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.specTitle, { color: colors.muted }]}>{spec.title}</Text>
              <View style={styles.specFooter}>
                <Feather name="star" size={12} color="#F5D26A" />
                <Text style={[{ color: colors.muted, fontSize: 12, fontFamily: "Tajawal_500Medium" }]}>{spec.rating}</Text>
                <Text style={[styles.specPrice, { color: "#A86DBF" }]}>{spec.price} ر.س</Text>
                <Pressable style={styles.specBookBtn} onPress={() => router.push(`/providers/detail/${spec.id}?type=specialists` as any)}>
                  <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Tajawal_700Bold" }}>احجز</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <Modal visible={showAddFood} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                إضافة طعام — {MEAL_TYPE_INFO[activeMealType].name} {MEAL_TYPE_INFO[activeMealType].emoji}
              </Text>
              <Pressable onPress={() => setShowAddFood(false)}>
                <Feather name="x" size={22} color={colors.muted} />
              </Pressable>
            </View>

            <View style={styles.tabsRow}>
              {([
                { key: "search" as AddFoodTab, label: "🔍 بحث" },
                { key: "manual" as AddFoodTab, label: "✏️ يدوي" },
                { key: "barcode" as AddFoodTab, label: "📱 باركود" },
              ]).map((tab) => (
                <Pressable
                  key={tab.key}
                  style={[styles.tab, addFoodTab === tab.key && { backgroundColor: "#A86DBF" }]}
                  onPress={() => { setAddFoodTab(tab.key); setSelectedFood(null); setBarcodeResult(null); }}
                >
                  <Text style={[styles.tabText, { color: addFoodTab === tab.key ? "#fff" : colors.muted }]}>{tab.label}</Text>
                </Pressable>
              ))}
            </View>

            {selectedFood ? (
              <View style={styles.foodDetail}>
                <View style={[styles.foodDetailCard, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5", borderColor: colors.border }]}>
                  <Text style={[styles.foodDetailName, { color: colors.text }]}>{selectedFood.name}</Text>
                  {selectedFood.brand && <Text style={[styles.foodDetailBrand, { color: colors.muted }]}>{selectedFood.brand}</Text>}
                  <Text style={[styles.foodDetailServing, { color: colors.muted }]}>الحصة: {selectedFood.servingSize} {selectedFood.servingUnit}</Text>
                  <View style={styles.foodDetailMacros}>
                    {[
                      { val: selectedFood.calories, label: "سعرة", color: "#F59E0B" },
                      { val: selectedFood.protein, label: "بروتين", color: "#F43F5E" },
                      { val: selectedFood.carbs, label: "كارب", color: "#F59E0B" },
                      { val: selectedFood.fat, label: "دهون", color: "#22C55E" },
                    ].map((m, i) => (
                      <View key={i} style={[styles.foodDetailMacro, { backgroundColor: m.color + "15" }]}>
                        <Text style={[styles.foodDetailMacroVal, { color: m.color }]}>{Math.round(m.val * parseFloat(servingQty || "1"))}</Text>
                        <Text style={[styles.foodDetailMacroLabel, { color: colors.muted }]}>{m.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Text style={[styles.qtyLabel, { color: colors.text }]}>عدد الحصص</Text>
                <View style={styles.qtyRow}>
                  {["0.5", "1", "1.5", "2"].map((q) => (
                    <Pressable key={q} style={[styles.qtyBtn, servingQty === q && { backgroundColor: "#A86DBF" }]} onPress={() => setServingQty(q)}>
                      <Text style={[styles.qtyBtnText, { color: servingQty === q ? "#fff" : colors.text }]}>{q}</Text>
                    </Pressable>
                  ))}
                  <TextInput
                    style={[styles.qtyInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]}
                    placeholder="كمية" placeholderTextColor={colors.muted}
                    value={servingQty} onChangeText={setServingQty} keyboardType="decimal-pad" textAlign="center"
                  />
                </View>
                <View style={styles.modalBtns}>
                  <Pressable style={[styles.modalBtn, { backgroundColor: "#A86DBF" }]} onPress={() => handleAddFood(selectedFood, parseFloat(servingQty) || 1)}>
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", marginRight: 6 }}>إضافة</Text>
                  </Pressable>
                  <Pressable style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setSelectedFood(null)}>
                    <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>رجوع</Text>
                  </Pressable>
                </View>
              </View>
            ) : addFoodTab === "search" ? (
              <View style={styles.searchTab}>
                <View style={[styles.searchBar, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", borderColor: colors.border }]}>
                  <Feather name="search" size={18} color={colors.muted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="ابحث عن طعام..." placeholderTextColor={colors.muted}
                    value={searchQuery} onChangeText={setSearchQuery} textAlign="right"
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery("")}>
                      <Feather name="x-circle" size={16} color={colors.muted} />
                    </Pressable>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 6, paddingVertical: 8 }}>
                  {FOOD_CATEGORIES.map((cat) => (
                    <Pressable key={cat.id} style={[styles.catChip, searchCategory === cat.id && { backgroundColor: "#A86DBF" }]} onPress={() => setSearchCategory(cat.id)}>
                      <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
                      <Text style={[styles.catChipText, { color: searchCategory === cat.id ? "#fff" : colors.muted }]}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
                  {filteredFoods.map((food) => (
                    <Pressable key={food.id} style={[styles.foodRow, { borderColor: colors.border }]} onPress={() => { setSelectedFood(food); setServingQty("1"); }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.foodRowName, { color: colors.text }]}>{food.name}</Text>
                        <Text style={[styles.foodRowServing, { color: colors.muted }]}>{food.servingSize} {food.servingUnit}</Text>
                      </View>
                      <Text style={[styles.foodRowCal, { color: "#F59E0B" }]}>{food.calories} سعرة</Text>
                      <View style={styles.foodRowMicro}>
                        <Text style={{ color: "#F43F5E", fontSize: 10, fontFamily: "Tajawal_700Bold" }}>ب{food.protein}</Text>
                        <Text style={{ color: "#F59E0B", fontSize: 10, fontFamily: "Tajawal_700Bold" }}>ك{food.carbs}</Text>
                        <Text style={{ color: "#22C55E", fontSize: 10, fontFamily: "Tajawal_700Bold" }}>د{food.fat}</Text>
                      </View>
                      <Feather name="plus-circle" size={22} color="#A86DBF" />
                    </Pressable>
                  ))}
                  {filteredFoods.length === 0 && (
                    <View style={styles.noResults}>
                      <Text style={{ fontSize: 36 }}>🔍</Text>
                      <Text style={[styles.noResultsText, { color: colors.muted }]}>لا توجد نتائج</Text>
                      <Pressable style={styles.noResultsBtn} onPress={() => setAddFoodTab("manual")}>
                        <Text style={styles.noResultsBtnText}>أضف يدوياً</Text>
                      </Pressable>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : addFoodTab === "manual" ? (
              <ScrollView style={styles.manualTab} showsVerticalScrollIndicator={false}>
                <Text style={[styles.manualLabel, { color: colors.text }]}>اسم الطعام *</Text>
                <TextInput style={[styles.manualInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]} placeholder="مثال: سناك بروتين" placeholderTextColor={colors.muted} value={manualName} onChangeText={setManualName} textAlign="right" />
                <View style={styles.manualRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualLabel, { color: colors.text }]}>حجم الحصة</Text>
                    <TextInput style={[styles.manualInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]} placeholder="100" placeholderTextColor={colors.muted} value={manualServing} onChangeText={setManualServing} keyboardType="decimal-pad" textAlign="center" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualLabel, { color: colors.text }]}>الوحدة</Text>
                    <View style={styles.unitRow}>
                      {["جم", "مل", "حبة", "كوب"].map((u) => (
                        <Pressable key={u} style={[styles.unitBtn, manualUnit === u && { backgroundColor: "#A86DBF" }]} onPress={() => setManualUnit(u)}>
                          <Text style={[styles.unitBtnText, { color: manualUnit === u ? "#fff" : colors.muted }]}>{u}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={[styles.manualLabel, { color: colors.text, marginTop: 12 }]}>السعرات الحرارية *</Text>
                <TextInput style={[styles.manualInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]} placeholder="مثال: 250" placeholderTextColor={colors.muted} value={manualCal} onChangeText={setManualCal} keyboardType="decimal-pad" textAlign="center" />
                <View style={styles.manualRow}>
                  {[
                    { label: "🥩 بروتين", color: "#F43F5E", value: manualProtein, setter: setManualProtein },
                    { label: "🌾 كارب", color: "#F59E0B", value: manualCarbs, setter: setManualCarbs },
                    { label: "🥑 دهون", color: "#22C55E", value: manualFat, setter: setManualFat },
                  ].map((m) => (
                    <View key={m.label} style={{ flex: 1 }}>
                      <Text style={[styles.manualLabel, { color: m.color }]}>{m.label} (جم)</Text>
                      <TextInput style={[styles.manualInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", color: colors.text, borderColor: colors.border }]} placeholder="0" placeholderTextColor={colors.muted} value={m.value} onChangeText={m.setter} keyboardType="decimal-pad" textAlign="center" />
                    </View>
                  ))}
                </View>
                <View style={[styles.modalBtns, { marginTop: 16 }]}>
                  <Pressable style={[styles.modalBtn, { backgroundColor: "#A86DBF" }]} onPress={handleManualAdd}>
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", marginRight: 6 }}>إضافة</Text>
                  </Pressable>
                  <Pressable style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setShowAddFood(false)}>
                    <Text style={{ color: colors.text, fontFamily: "Tajawal_700Bold" }}>إلغاء</Text>
                  </Pressable>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.barcodeTab}>
                <View style={[styles.barcodeBox, { backgroundColor: isDark ? colors.surfaceAlt : "#F8F0F5" }]}>
                  <Text style={{ fontSize: 48 }}>📱</Text>
                  <Text style={[styles.barcodeTitle, { color: colors.text }]}>مسح الباركود</Text>
                  <Text style={[styles.barcodeSub, { color: colors.muted }]}>أدخل رمز الباركود أو امسحه بالكاميرا</Text>
                </View>
                <View style={[styles.searchBar, { backgroundColor: isDark ? colors.surfaceAlt : "#F5F5F5", borderColor: colors.border, marginTop: 16 }]}>
                  <MaterialCommunityIcons name="barcode-scan" size={20} color={colors.muted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="أدخل رمز الباركود..." placeholderTextColor={colors.muted}
                    value={barcodeInput} onChangeText={setBarcodeInput} keyboardType="number-pad" textAlign="center"
                  />
                </View>
                <Pressable style={[styles.scanBtn, { backgroundColor: "#A86DBF" }]} onPress={handleBarcodeScan}>
                  <Feather name="search" size={16} color="#fff" />
                  <Text style={styles.scanBtnText}>بحث</Text>
                </Pressable>
                <View style={[styles.barcodeHint, { backgroundColor: isDark ? colors.surfaceAlt : "#F0F0F0" }]}>
                  <Text style={[styles.barcodeHintTitle, { color: colors.text }]}>💡 باركودات للتجربة:</Text>
                  {Object.entries(BARCODE_PRODUCTS).slice(0, 3).map(([code, prod]) => (
                    <Pressable key={code} onPress={() => setBarcodeInput(code)} style={styles.barcodeHintRow}>
                      <Text style={[styles.barcodeHintCode, { color: "#A86DBF" }]}>{code}</Text>
                      <Text style={[styles.barcodeHintName, { color: colors.muted }]}>{prod.name}</Text>
                    </Pressable>
                  ))}
                </View>
                {barcodeResult && (
                  <View style={[styles.barcodeResultCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: "#A86DBF40" }]}>
                    <Text style={[styles.barcodeResultName, { color: colors.text }]}>{barcodeResult.name}</Text>
                    {barcodeResult.brand && <Text style={[styles.barcodeResultBrand, { color: colors.muted }]}>{barcodeResult.brand}</Text>}
                    <View style={styles.barcodeResultMacros}>
                      <Text style={{ color: "#F59E0B", fontSize: 14, fontFamily: "Tajawal_700Bold" }}>🔥 {barcodeResult.calories} سعرة</Text>
                      <Text style={{ color: "#F43F5E", fontSize: 12, fontFamily: "Tajawal_700Bold" }}>ب{barcodeResult.protein}</Text>
                      <Text style={{ color: "#F59E0B", fontSize: 12, fontFamily: "Tajawal_700Bold" }}>ك{barcodeResult.carbs}</Text>
                      <Text style={{ color: "#22C55E", fontSize: 12, fontFamily: "Tajawal_700Bold" }}>د{barcodeResult.fat}</Text>
                    </View>
                    <Pressable style={[styles.modalBtn, { backgroundColor: "#A86DBF", marginTop: 12 }]} onPress={() => handleAddFood(barcodeResult, 1)}>
                      <Feather name="plus" size={16} color="#fff" />
                      <Text style={{ color: "#fff", fontFamily: "Tajawal_700Bold", marginRight: 6 }}>إضافة</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const shopStyles = StyleSheet.create({
  itemRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  checkArea: { padding: 4 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  itemName: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  itemCat: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  removeItemBtn: { padding: 6 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: "Cairo_700Bold", flex: 1, textAlign: "center" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  editGoalBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  editGoalText: { fontSize: 12, fontFamily: "Tajawal_700Bold", color: "#A86DBF" },

  goalEditorSection: { paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", paddingHorizontal: 20, marginBottom: 12 },
  goalChip: { alignItems: "center", gap: 4, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1, minWidth: 90 },
  goalChipText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  goalChipCal: { fontSize: 10, fontFamily: "Tajawal_400Regular" },

  card: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 18, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", flex: 1 },
  waterHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 14 },
  waterCount: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  glassesRow: { flexDirection: "row-reverse", gap: 6, marginBottom: 12, flexWrap: "wrap" },
  glassBtn: { },
  glass: { width: 38, height: 38, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  waterBar: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  waterBarFill: { height: "100%", backgroundColor: "#3B82F6", borderRadius: 3 },
  waterMl: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  addGlassBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: "#3B82F6", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-end", marginTop: 10 },
  addGlassTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  progressCard: { marginHorizontal: 20, borderRadius: 24, padding: 20, marginBottom: 16, overflow: "hidden" },
  progressTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  progressLabelRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginBottom: 2 },
  progressLabelEmoji: { fontSize: 16 },
  progressLabel: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  progressBig: { color: "#fff", fontSize: 42, fontFamily: "Tajawal_700Bold" },
  progressSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  calCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  calCirclePct: { color: "#fff", fontSize: 18, fontFamily: "Tajawal_700Bold" },
  calCircleLabel: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontFamily: "Tajawal_400Regular" },
  calBarBg: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 16 },
  calBarFill: { height: "100%", backgroundColor: "#fff", borderRadius: 3 },
  macroRowsWrap: { gap: 8 },
  macroRowItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  macroRowLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 4, width: 100 },
  macroRowLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Tajawal_700Bold" },
  macroBarBg: { flex: 1, height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" },
  macroBarFill: { height: "100%", borderRadius: 3 },
  macroRowVal: { fontSize: 11, fontFamily: "Tajawal_700Bold", width: 55, textAlign: "left" },

  mealsSection: { marginBottom: 8 },
  mealCard: { marginHorizontal: 20, marginBottom: 10, borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  mealHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 16 },
  mealHeaderLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  mealHeaderRight: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  mealName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  mealTime: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  mealCal: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  mealItemsWrap: { paddingHorizontal: 16, paddingBottom: 12 },
  mealItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 1 },
  mealItemName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  mealItemServing: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  mealItemMacros: { alignItems: "center" },
  mealItemMacro: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  mealItemMacroLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  mealItemMacrosSmall: { flexDirection: "row-reverse", gap: 3 },
  macroSmallTag: { fontSize: 10, fontFamily: "Tajawal_700Bold", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  removeBtn: { padding: 6 },
  emptyMeal: { textAlign: "right", fontSize: 13, fontFamily: "Tajawal_400Regular", paddingVertical: 8 },
  addItemBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderStyle: "dashed", borderRadius: 12, paddingVertical: 10, marginTop: 8 },
  addItemBtnText: { color: "#A86DBF", fontSize: 13, fontFamily: "Tajawal_700Bold" },

  proSection: { marginHorizontal: 20, marginBottom: 16, borderRadius: 24, borderWidth: 1, overflow: "hidden" },
  proCard: { padding: 20 },
  proHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 16 },
  proBadge: { backgroundColor: "#A86DBF", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  proBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  proTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  proPreview: { gap: 10, marginBottom: 0 },
  proVitaminRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderBottomWidth: 1, paddingBottom: 8 },
  proVitaminBar: { height: 6, borderRadius: 3 },
  proVitaminLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },
  proBlur: { position: "relative", marginTop: -80 },
  proBlurGradient: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  proBlurContent: { zIndex: 2, alignItems: "center", paddingTop: 30, paddingBottom: 10, gap: 8 },
  proBlurTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "center" },
  proBlurSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "center", paddingHorizontal: 20 },
  proFeaturesList: { alignSelf: "stretch", gap: 8, paddingHorizontal: 16, marginTop: 4 },
  proFeatureRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  proFeatureLabel: { fontSize: 13, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  proSubscribeBtn: { backgroundColor: "#A86DBF", borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14, marginTop: 8 },
  proSubscribeTxt: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },

  shopSection: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, borderWidth: 1, padding: 18 },
  shopHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 4 },
  shopAddBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  shopSubtitle: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  addShopForm: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8, gap: 8 },
  shopInput: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  shopFilterChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  shopFilterText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  shopConfirmBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-end" },
  shopConfirmTxt: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  shopEmpty: { alignItems: "center", paddingVertical: 24, gap: 6 },
  shopEmptyText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  shopEmptyHint: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  clearCheckedBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-end", marginTop: 10 },
  clearCheckedTxt: { color: "#F43F5E", fontSize: 12, fontFamily: "Tajawal_700Bold" },

  tipsSection: { marginBottom: 8 },
  tipCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, marginHorizontal: 20, marginBottom: 10, borderRadius: 16, padding: 14, borderWidth: 1 },
  tipTitle: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  tipBody: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 18 },

  blogSection: { marginBottom: 16 },
  blogCard: { width: 210, borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  blogCardBanner: { height: 110, alignItems: "center", justifyContent: "center", position: "relative", paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  blogTagPill: { position: "absolute", bottom: 8, right: 10, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  blogTagText: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },
  blogCardBody: { padding: 12, gap: 6 },
  blogTitle: { fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "right" },
  blogSub: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  blogTime: { flexDirection: "row-reverse", alignItems: "center", gap: 4, marginTop: 2 },
  blogTimeTxt: { fontSize: 11, fontFamily: "Tajawal_500Medium" },

  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(120,120,120,0.3)", alignSelf: "center", marginBottom: 12 },
  blogDetailSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "90%", overflow: "hidden", marginTop: "auto" as any },
  blogDetailBanner: { height: 160, alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  blogDetailClose: { position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center" },
  blogDetailTitle: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 6 },
  blogDetailSubtitle: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 10 },
  blogDetailMeta: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 14 },
  blogDetailMetaText: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  blogDetailTagSmall: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  blogDetailTagSmallText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  blogDetailDivider: { height: 1, marginBottom: 16 },
  blogDetailBody: { fontSize: 15, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 26 },

  specSection: { paddingHorizontal: 20, marginBottom: 16 },
  specBanner: { borderRadius: 18, overflow: "hidden", height: 130, position: "relative", marginBottom: 8 },
  specBannerContent: { position: "absolute", bottom: 14, right: 16, left: 16 },
  specBannerTitle: { color: "#fff", fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right" },
  specBannerSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  specCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 12, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1 },
  specAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  specNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 2 },
  specName: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  specBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  specDot: { width: 6, height: 6, borderRadius: 3 },
  specTitle: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 6 },
  specFooter: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  specPrice: { fontFamily: "Tajawal_700Bold", fontSize: 13, marginRight: "auto" as any },
  specBookBtn: { backgroundColor: "#A86DBF", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: "90%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontFamily: "Cairo_700Bold", flex: 1, textAlign: "right" },
  tabsRow: { flexDirection: "row-reverse", gap: 6, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  tabText: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  foodDetail: { gap: 12 },
  foodDetailCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  foodDetailName: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  foodDetailBrand: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 4 },
  foodDetailServing: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 10 },
  foodDetailMacros: { flexDirection: "row-reverse", gap: 8 },
  foodDetailMacro: { flex: 1, alignItems: "center", padding: 8, borderRadius: 10 },
  foodDetailMacroVal: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  foodDetailMacroLabel: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  qtyLabel: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  qtyRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  qtyBtn: { width: 50, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(168,109,191,0.1)" },
  qtyBtnText: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  qtyInput: { width: 60, height: 40, borderRadius: 10, borderWidth: 1, textAlign: "center", fontSize: 14 },
  modalBtns: { flexDirection: "row-reverse", gap: 10 },
  modalBtn: { flex: 1, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, gap: 6 },
  searchTab: { flex: 1 },
  searchBar: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Tajawal_400Regular" },
  catChip: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(168,109,191,0.3)" },
  catChipText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  foodList: { maxHeight: 280 },
  foodRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 1 },
  foodRowName: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  foodRowServing: { fontSize: 11, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  foodRowCal: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  foodRowMicro: { flexDirection: "row-reverse", gap: 4 },
  noResults: { alignItems: "center", paddingVertical: 24, gap: 8 },
  noResultsText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  noResultsBtn: { backgroundColor: "#A86DBF", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  noResultsBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  manualTab: { maxHeight: 380 },
  manualLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 6 },
  manualInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, marginBottom: 8 },
  manualRow: { flexDirection: "row-reverse", gap: 8 },
  unitRow: { flexDirection: "row-reverse", gap: 4, flexWrap: "wrap" },
  unitBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: "rgba(168,109,191,0.1)" },
  unitBtnText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  barcodeTab: { gap: 10 },
  barcodeBox: { alignItems: "center", gap: 8, borderRadius: 16, padding: 24 },
  barcodeTitle: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  barcodeSub: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  scanBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 12 },
  scanBtnText: { color: "#fff", fontSize: 14, fontFamily: "Tajawal_700Bold" },
  barcodeHint: { borderRadius: 12, padding: 12, gap: 6 },
  barcodeHintTitle: { fontSize: 13, fontFamily: "Tajawal_700Bold", textAlign: "right", marginBottom: 4 },
  barcodeHintRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  barcodeHintCode: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  barcodeHintName: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  barcodeResultCard: { borderRadius: 14, padding: 14, borderWidth: 1 },
  barcodeResultName: { fontSize: 15, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 4 },
  barcodeResultBrand: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginBottom: 8 },
  barcodeResultMacros: { flexDirection: "row-reverse", gap: 10 },
});
