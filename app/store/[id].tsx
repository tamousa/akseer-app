import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  I18nManager,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const STORE_DB: Record<string, any> = {
  "1": {
    id: "1", name: "متجر اللياقة الذهبي", emoji: "🏋️",
    bgColor: "#F59E0B", rating: 4.8, reviewCount: 1250,
    deliveryTime: "20-35", deliveryFee: 0, minOrder: 50,
    isOpen: true, openHours: "08:00 — 23:00",
    city: "الرياض، العليا",
    bio: "متجرك الأول للياقة البدنية وكمال الأجسام في المملكة. نوفر أجود الأجهزة الرياضية، الملابس العالمية، والإكسسوارات الاحترافية بأسعار تنافسية وتوصيل سريع.",
    stats: [{ label: "منتج", val: "+200" }, { label: "عميل", val: "+5000" }, { label: "سنوات", val: "7" }],
    photos: ["🏋️","🥊","🩳","👟","🏃"],
    tags: ["أجهزة رياضية","ملابس","إكسسوارات","مستلزمات كمال أجسام"],
    categories: ["الكل","أجهزة","ملابس","إكسسوارات","تغذية"],
    offers: [
      { id:"o1", name:"خصم 25% على الأحذية الرياضية", badge:"25%", emoji:"👟", code:"SHOE25", color:"#F59E0B", validTo:"30 أبريل" },
      { id:"o2", name:"باقة المبتدئين الاقتصادية", badge:"جديد", emoji:"💪", code:"START99", color:"#3B82F6", validTo:"15 مايو" },
      { id:"o3", name:"خصم 15% على الملابس الرياضية", badge:"15%", emoji:"🩳", code:"SPORT15", color:"#22C55E", validTo:"20 مايو" },
    ],
    products: [
      { id:"p1", name:"حبل مقاومة احترافي", price:89, original:120, emoji:"🪢", rating:4.8, reviews:124, badge:"الأكثر مبيعاً", cat:"إكسسوارات", desc:"حبل مقاومة لاتكس عالي الجودة بـ 5 مستويات مقاومة، مثالي للتمارين المنزلية وإعادة التأهيل." },
      { id:"p2", name:"حصيرة تمارين يوغا 6mm", price:149, original:0, emoji:"🧘", rating:4.7, reviews:89, badge:"", cat:"أجهزة", desc:"حصيرة مضادة للانزلاق بسطح مسامي لامتصاص العرق، مثالية لليوغا والبيلاتس والتمارين الأرضية." },
      { id:"p3", name:"شاكر بروتين ستانلس ستيل", price:65, original:85, emoji:"🥤", rating:4.9, reviews:210, badge:"مميز", cat:"إكسسوارات", desc:"شاكر 750ml من الستانلس ستيل المعزول حرارياً، يحافظ على برودة مشروبك 12 ساعة." },
      { id:"p4", name:"دمبل أوزان قابلة للتعديل 20kg", price:349, original:450, emoji:"🏋️", rating:4.6, reviews:56, badge:"", cat:"أجهزة", desc:"دمبل ثنائي قابل للتعديل من 2.5 كيلو إلى 20 كيلو، يغني عن 8 أوزان منفصلة." },
      { id:"p5", name:"تيشيرت رياضي جاف", price:79, original:0, emoji:"👕", rating:4.5, reviews:178, badge:"", cat:"ملابس", desc:"تيشيرت تقنية Dry-Fit خفيف الوزن يسرع تبخر العرق ويمنح راحة قصوى خلال التمارين." },
      { id:"p6", name:"بروتين واي أصلي 2kg", price:299, original:350, emoji:"🥛", rating:4.8, reviews:432, badge:"الأكثر مبيعاً", cat:"تغذية", desc:"بروتين واي معزول 100% بنسبة بروتين 80% لكل حصة، خالٍ من السكر، 5 نكهات." },
    ],
    reviews: [
      { name:"أحمد العتيبي", rating:5, comment:"منتجات ممتازة وتوصيل خلال ساعتين! الشاكر رائع جداً", time:"منذ يومين" },
      { name:"فهد المطيري", rating:4, comment:"جودة عالية وسعر مناسب، الحبل المقاوم وصلني في حالة ممتازة", time:"منذ أسبوع" },
      { name:"سارة الدوسري", rating:5, comment:"أفضل متجر رياضي جربته، التغليف احترافي والمنتجات أصلية 100%", time:"منذ أسبوعين" },
    ],
  },
  "2": {
    id: "2", name: "متجر العضوي الطبيعي", emoji: "🌿",
    bgColor: "#22C55E", rating: 4.9, reviewCount: 874,
    deliveryTime: "25-40", deliveryFee: 15, minOrder: 80,
    isOpen: true, openHours: "07:00 — 22:00",
    city: "الرياض، النرجس",
    bio: "متخصصون في المنتجات العضوية المعتمدة 100%. نوفر خضروات وفواكه طازجة، مشروبات صحية، وتوابل طبيعية من مصادر محلية وعالمية موثوقة.",
    stats: [{ label: "منتج", val: "+150" }, { label: "معتمد", val: "100%" }, { label: "سنوات", val: "5" }],
    photos: ["🥦","🍎","🌿","🥝","🫙"],
    tags: ["عضوي معتمد","خضروات طازجة","مشروبات صحية","توابل"],
    categories: ["الكل","خضروات","فواكه","مشروبات","توابل"],
    offers: [
      { id:"o1", name:"سلة خضروات عضوية أسبوعية", badge:"عرض", emoji:"🥦", code:"VEGBOX", color:"#22C55E", validTo:"30 أبريل" },
      { id:"o2", name:"خصم 20% على العصائر الطبيعية", badge:"20%", emoji:"🥤", code:"JUICE20", color:"#F59E0B", validTo:"15 مايو" },
    ],
    products: [
      { id:"p1", name:"سلة خضروات عضوية طازجة", price:89, original:110, emoji:"🥦", rating:4.9, reviews:234, badge:"الأكثر طلباً", cat:"خضروات", desc:"سلة خضروات عضوية معتمدة 3kg: طماطم، خيار، بصل، ثوم، جزر، بروكلي. تُقطف وتُشحن نفس اليوم." },
      { id:"p2", name:"عصير برتقال طازج 1L", price:35, original:0, emoji:"🍊", rating:4.8, reviews:156, badge:"", cat:"مشروبات", desc:"عصير برتقال طبيعي 100% بدون مواد حافظة أو سكر مضاف، يُعصر حسب الطلب." },
      { id:"p3", name:"زيت زيتون بكر إضافي 500ml", price:125, original:150, emoji:"🫙", rating:4.9, reviews:89, badge:"مميز", cat:"توابل", desc:"زيت زيتون فلسطيني بكر إضافي حصاد مبكر، حموضة أقل من 0.2%، ذهبي اللون." },
      { id:"p4", name:"تمر مجهول فاخر 1kg", price:85, original:0, emoji:"🌴", rating:5.0, reviews:312, badge:"الأكثر مبيعاً", cat:"فواكه", desc:"تمر مجهول مدني طازج درجة ممتاز، حجم كبير، لون بني غامق، طعم زبداني." },
    ],
    reviews: [
      { name:"نورة الشمري", rating:5, comment:"أفضل خضروات عضوية تذوقتها، طازجة جداً وسعر معقول", time:"منذ 3 أيام" },
      { name:"خالد الحربي", rating:5, comment:"التمر المجهول استثنائي، سأطلب منه دائماً", time:"منذ أسبوع" },
    ],
  },
  "3": {
    id: "3", name: "متجر المكملات الغذائية", emoji: "💊",
    bgColor: "#3B82F6", rating: 4.7, reviewCount: 3410,
    deliveryTime: "15-30", deliveryFee: 0, minOrder: 100,
    isOpen: true, openHours: "09:00 — 24:00",
    city: "الرياض، السليمانية",
    bio: "الوجهة الأولى للمكملات الغذائية الأصلية في المملكة. أكثر من 300 منتج من أفضل العلامات العالمية مع ضمان الأصالة وشهادات الجهات المعتمدة.",
    stats: [{ label: "منتج", val: "+300" }, { label: "علامة", val: "50+" }, { label: "سنوات", val: "10" }],
    photos: ["💊","🥛","🫧","⚗️","🧪"],
    tags: ["بروتين","فيتامينات","حرق دهون","كرياتين"],
    categories: ["الكل","بروتين","فيتامينات","حرق دهون","كرياتين","طاقة"],
    offers: [
      { id:"o1", name:"خصم 30% على البروتين", badge:"30%", emoji:"🥛", code:"PROT30", color:"#3B82F6", validTo:"30 أبريل" },
      { id:"o2", name:"اشتر 2 واحصل على 1 مجاناً على الفيتامينات", badge:"3×2", emoji:"💊", code:"VIT3X2", color:"#8B5CF6", validTo:"20 مايو" },
    ],
    products: [
      { id:"p1", name:"واي بروتين جولد ستاندرد 2.27kg", price:389, original:450, emoji:"🥛", rating:4.9, reviews:892, badge:"الأكثر مبيعاً", cat:"بروتين", desc:"الأشهر عالمياً من Optimum Nutrition. 24g بروتين لكل حصة، أحماض أمينية BCAA طبيعية، 18 نكهة." },
      { id:"p2", name:"فيتامين D3 + K2 5000 IU", price:79, original:0, emoji:"☀️", rating:4.8, reviews:445, badge:"مميز", cat:"فيتامينات", desc:"مزيج مثالي من D3 وK2 لتعزيز امتصاص الكالسيوم وصحة العظام والمناعة. 90 كبسولة." },
      { id:"p3", name:"كرياتين مونوهيدرات 500g", price:129, original:160, emoji:"⚡", rating:4.7, reviews:234, badge:"", cat:"كرياتين", desc:"كرياتين مونوهيدرات نقاوة 99.9% بدون إضافات. يعزز الطاقة والقوة خلال التمارين." },
      { id:"p4", name:"أوميغا 3 بتركيز عالٍ 90 كبسولة", price:95, original:120, emoji:"🐟", rating:4.8, reviews:167, badge:"", cat:"فيتامينات", desc:"زيت سمك مستخلص بعمليات متعددة للحصول على تركيز عالٍ من EPA وDHA." },
      { id:"p5", name:"حارق دهون ثرموجينيك", price:189, original:220, emoji:"🔥", rating:4.5, reviews:98, badge:"", cat:"حرق دهون", desc:"مكمل ثرموجينيك يرفع معدل الأيض ويزيد حرق الدهون مع الحفاظ على الكتلة العضلية." },
    ],
    reviews: [
      { name:"محمد الزهراني", rating:5, comment:"البروتين أصلي 100% والتوصيل في ساعة واحدة. ممتاز!", time:"منذ يوم" },
      { name:"عبدالله القحطاني", rating:4, comment:"منتجات أصلية وسعر منافس، الشحن مجاني وهذا رائع", time:"منذ 4 أيام" },
      { name:"ريم السالم", rating:5, comment:"فيتامين D3 رائع، لاحظت فرقاً خلال أسبوعين", time:"منذ أسبوعين" },
    ],
  },
  "4": {
    id: "4", name: "متجر العناية والجمال", emoji: "✨",
    bgColor: "#EC4899", rating: 4.8, reviewCount: 659,
    deliveryTime: "30-45", deliveryFee: 10, minOrder: 60,
    isOpen: true, openHours: "10:00 — 22:00",
    city: "الرياض، الروضة",
    bio: "عالم العناية الطبيعية بالبشرة والشعر. منتجاتنا خالية من المواد الكيميائية الضارة، مختبرة سريرياً، ومعتمدة للبشرة الحساسة.",
    stats: [{ label: "منتج", val: "+100" }, { label: "طبيعي", val: "100%" }, { label: "سنوات", val: "4" }],
    photos: ["✨","🌸","🧴","💆","🌺"],
    tags: ["عناية بالبشرة","شعر","طبيعي","خالٍ من الكيماويات"],
    categories: ["الكل","بشرة","شعر","جسم","وجه"],
    offers: [
      { id:"o1", name:"خصم 25% على منتجات الشعر", badge:"25%", emoji:"💆", code:"HAIR25", color:"#EC4899", validTo:"25 أبريل" },
      { id:"o2", name:"هدية عند شراء 3 منتجات", badge:"هدية", emoji:"🎁", code:"GIFT3", color:"#8B5CF6", validTo:"30 مايو" },
    ],
    products: [
      { id:"p1", name:"كريم ترطيب بالألوفيرا 150ml", price:65, original:85, emoji:"🌿", rating:4.9, reviews:187, badge:"الأكثر مبيعاً", cat:"بشرة", desc:"كريم ترطيب خفيف بتركيز 95% ألوفيرا طبيعي. يرطب البشرة 24 ساعة ويهدئ الاحمرار." },
      { id:"p2", name:"زيت أرجان المغربي 50ml", price:129, original:160, emoji:"🫙", rating:4.9, reviews:234, badge:"مميز", cat:"شعر", desc:"زيت أرجان بكر من المغرب العربي بارد المعصرة. يغذي الشعر ويمنحه لمعاناً استثنائياً." },
      { id:"p3", name:"غسول وجه للبشرة الحساسة 200ml", price:79, original:0, emoji:"🧴", rating:4.7, reviews:143, badge:"", cat:"وجه", desc:"غسول لطيف خالٍ من الصابون والكحول والعطور، مثالي للبشرة الحساسة والجافة." },
      { id:"p4", name:"كريم واقي الشمس SPF 50", price:95, original:115, emoji:"☀️", rating:4.8, reviews:98, badge:"", cat:"بشرة", desc:"واقي شمسي خفيف غير دهني SPF50 يوفر حماية 8 ساعات مع ترطيب خفيف." },
    ],
    reviews: [
      { name:"لجين العمري", rating:5, comment:"كريم الألوفيرا أنقذ بشرتي! ترطيب رهيب وامتصاص سريع", time:"منذ 3 أيام" },
      { name:"هيا الصالح", rating:5, comment:"زيت الأرجان طبيعي جداً، شعري تحسن بشكل واضح", time:"منذ أسبوع" },
    ],
  },
  "5": {
    id: "5", name: "متجر الأجهزة الطبية", emoji: "🩺",
    bgColor: "#8B5CF6", rating: 4.6, reviewCount: 421,
    deliveryTime: "35-60", deliveryFee: 0, minOrder: 200,
    isOpen: false, openHours: "09:00 — 21:00",
    city: "الرياض، الملقا",
    bio: "أجهزة طبية منزلية معتمدة من الهيئة السعودية للغذاء والدواء. نوفر حلول رعاية صحية منزلية لكل العائلة بضمان سنة وخدمة ما بعد البيع.",
    stats: [{ label: "جهاز", val: "+80" }, { label: "ضمان", val: "سنة" }, { label: "سنوات", val: "8" }],
    photos: ["🩺","💉","📊","🔬","🩻"],
    tags: ["أجهزة منزلية","قياس ضغط","أجهزة تنفس","مراقبة"],
    categories: ["الكل","قياس","تنفس","إسعاف","متابعة"],
    offers: [
      { id:"o1", name:"خصم 15% على أجهزة قياس الضغط", badge:"15%", emoji:"📊", code:"BP15", color:"#8B5CF6", validTo:"30 مايو" },
    ],
    products: [
      { id:"p1", name:"جهاز قياس ضغط الدم الأوتوماتيكي", price:349, original:420, emoji:"💓", rating:4.7, reviews:156, badge:"الأكثر مبيعاً", cat:"قياس", desc:"جهاز قياس ضغط للذراع رقمي معتمد طبياً، يسجل 60 قراءة، ويكشف عدم انتظام ضربات القلب." },
      { id:"p2", name:"مقياس الأكسجين في الدم", price:145, original:180, emoji:"🫁", rating:4.8, reviews:89, badge:"مميز", cat:"متابعة", desc:"جهاز قياس نسبة الأكسجين في الدم ونبضات القلب في ثوانٍ، شاشة OLED واضحة." },
      { id:"p3", name:"جهاز استنشاق بخار للأطفال والكبار", price:289, original:0, emoji:"💨", rating:4.6, reviews:67, badge:"", cat:"تنفس", desc:"جهاز نيبولايزر هادئ للأطفال والكبار، يحول الدواء السائل إلى بخار ناعم للاستنشاق." },
    ],
    reviews: [
      { name:"عمر الغامدي", rating:5, comment:"جهاز الضغط دقيق جداً وسهل الاستخدام، ممتاز لكبار السن", time:"منذ أسبوع" },
      { name:"أم سعد", rating:4, comment:"جهاز البخار رائع للأطفال، هادئ وفعال", time:"منذ أسبوعين" },
    ],
  },
  "6": {
    id: "6", name: "متجر الشاي والأعشاب", emoji: "🍵",
    bgColor: "#14B8A6", rating: 4.7, reviewCount: 290,
    deliveryTime: "20-35", deliveryFee: 0, minOrder: 40,
    isOpen: true, openHours: "08:00 — 22:00",
    city: "الرياض، الحمراء",
    bio: "عالم الأعشاب الطبيعية والشاي الصحي. نختار أجود الأعشاب من مصادرها الأصلية في الهند والصين والمغرب، مع خلطات طبية مجربة.",
    stats: [{ label: "نوع عشبة", val: "+200" }, { label: "خلطة", val: "+50" }, { label: "سنوات", val: "12" }],
    photos: ["🍵","🌿","🌺","🫖","🍃"],
    tags: ["أعشاب طبيعية","شاي صحي","خلطات","توابل"],
    categories: ["الكل","شاي أخضر","أعشاب","خلطات","توابل"],
    offers: [
      { id:"o1", name:"عرض اليوم — شاي ماتشا ياباني", badge:"عرض", emoji:"🍵", code:"MATCHA", color:"#14B8A6", validTo:"غداً فقط!" },
      { id:"o2", name:"خصم 20% على الخلطات الطبية", badge:"20%", emoji:"🌿", code:"HERB20", color:"#22C55E", validTo:"15 مايو" },
    ],
    products: [
      { id:"p1", name:"شاي ماتشا ياباني درجة ممتاز 100g", price:145, original:180, emoji:"🍵", rating:4.9, reviews:134, badge:"الأكثر مبيعاً", cat:"شاي أخضر", desc:"ماتشا عضوي من مقاطعة أوجي اليابانية، درجة سيريموني، لون أخضر زاهٍ وطعم ناعم." },
      { id:"p2", name:"خلطة النوم والاسترخاء 200g", price:89, original:110, emoji:"😴", rating:4.8, reviews:89, badge:"مميز", cat:"خلطات", desc:"خلطة طبيعية من البابونج، اللافندر، وليمون الأعشاب. تساعد على الاسترخاء والنوم العميق." },
      { id:"p3", name:"أعشاب الكركم والزنجبيل 150g", price:65, original:0, emoji:"🌶️", rating:4.7, reviews:67, badge:"", cat:"أعشاب", desc:"مزيج كركم وزنجبيل عضوي، مضاد للالتهابات، يعزز المناعة ويحسن الهضم." },
      { id:"p4", name:"بهارات السبع هوائي الكاملة", price:79, original:95, emoji:"🫙", rating:4.8, reviews:112, badge:"", cat:"توابل", desc:"مزيج 7 توابل أصيلة محضرة يدوياً من الهيل والقرفة والزنجبيل وغيرها." },
    ],
    reviews: [
      { name:"إيمان الأحمدي", rating:5, comment:"ماتشا أصلي ورائحة رائعة، أفضل ما جربت!", time:"منذ يومين" },
      { name:"بدر الحمدان", rating:5, comment:"خلطة النوم مذهلة، نمت بشكل ممتاز من أول ليلة", time:"منذ 5 أيام" },
    ],
  },
};

export default function StoreDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { addProductToCart, productItems } = useCart();

  const store = STORE_DB[id ?? "1"] ?? STORE_DB["1"];
  const topPadding = isWeb ? 67 : insets.top;

  const [activeCat, setActiveCat] = useState("الكل");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [copiedOfferCode, setCopiedOfferCode] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const copyOfferCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedOfferCode(code);
    setTimeout(() => setCopiedOfferCode(null), 2500);
  };

  const filteredProducts =
    activeCat === "الكل"
      ? store.products
      : store.products.filter((p: any) => p.cat === activeCat);

  const cartCount = productItems
    .filter((p) => p.storeId === store.id)
    .reduce((s: number, p) => s + p.qty, 0);

  const handleAddToCart = (product: any) => {
    addProductToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      originalPrice: product.original > 0 ? product.original : undefined,
      qty: 1,
      storeId: store.id,
      storeName: store.name,
      emoji: product.emoji,
    });
    setAddedFeedback(product.id);
    setTimeout(() => setAddedFeedback(null), 1500);
    setSelectedProduct(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ─── HERO ─── */}
      <LinearGradient
        colors={[store.bgColor + "EE", store.bgColor + "99"]}
        style={[styles.hero, { paddingTop: topPadding + 4 }]}
      >
        <View style={styles.heroTopRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Feather name="chevron-right" size={24} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.cartBtn}
            onPress={() => router.push("/store-checkout" as any)}
          >
            <Feather name="shopping-cart" size={20} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.heroContent}>
          <View style={styles.heroLogoBox}>
            <Text style={styles.heroEmoji}>{store.emoji}</Text>
          </View>
          <Text style={styles.heroName}>{store.name}</Text>
          <View style={styles.heroRatingRow}>
            <Text style={styles.heroRatingVal}>⭐ {store.rating}</Text>
            <Text style={styles.heroRatingCount}>({store.reviewCount.toLocaleString()} تقييم)</Text>
            <View
              style={[
                styles.openBadge,
                { backgroundColor: store.isOpen ? "#22C55E" : "#EF4444" },
              ]}
            >
              <Text style={styles.openBadgeText}>
                {store.isOpen ? "● مفتوح" : "● مغلق"}
              </Text>
            </View>
          </View>

          <View style={styles.heroInfoRow}>
            <View style={styles.heroInfoItem}>
              <Feather name="clock" size={11} color="#ffffffCC" />
              <Text style={styles.heroInfoText}>{store.openHours}</Text>
            </View>
            <View style={styles.heroInfoItem}>
              <Feather name="map-pin" size={11} color="#ffffffCC" />
              <Text style={styles.heroInfoText}>{store.city}</Text>
            </View>
            <View style={styles.heroInfoItem}>
              <Feather name="truck" size={11} color="#ffffffCC" />
              <Text style={styles.heroInfoText}>
                {store.deliveryFee === 0 ? "توصيل مجاني" : `${store.deliveryFee} ر.س`}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ─── CTA ROW ─── */}
      <View style={[styles.ctaRow, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
        <Pressable
          style={[styles.ctaMain, { backgroundColor: store.bgColor }]}
          onPress={() => router.push("/store-checkout" as any)}
        >
          <Feather name="shopping-bag" size={15} color="#fff" />
          <Text style={styles.ctaMainText}>السلة {cartCount > 0 ? `(${cartCount})` : ""}</Text>
        </Pressable>
        <Pressable
          style={[styles.ctaSecondary, { borderColor: store.bgColor + "40" }]}
        >
          <Feather name="message-circle" size={16} color={store.bgColor} />
          <Text style={[styles.ctaSecondaryText, { color: store.bgColor }]}>دردشة</Text>
        </Pressable>
        <Pressable
          style={[
            styles.ctaSecondary,
            {
              borderColor: saved ? store.bgColor : store.bgColor + "30",
              backgroundColor: saved ? store.bgColor + "15" : "transparent",
            },
          ]}
          onPress={() => setSaved(!saved)}
        >
          <Feather name="heart" size={16} color={saved ? store.bgColor : colors.muted} />
          <Text style={[styles.ctaSecondaryText, { color: saved ? store.bgColor : colors.muted }]}>
            {saved ? "متابَع ✓" : "متابعة"}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 90 }}>

        {/* ─── BIO ─── */}
        <View style={[styles.bioCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}>
          <View style={styles.bioHeader}>
            <Feather name="info" size={14} color={store.bgColor} />
            <Text style={[styles.bioTitle, { color: colors.text }]}>عن المتجر</Text>
          </View>
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>{store.bio}</Text>
          <View style={[styles.bioStatsRow, { borderTopColor: colors.border }]}>
            {store.stats.map((s: any, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: store.bgColor }]}>{s.val}</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ─── PHOTOS ROW ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📸 صور المتجر</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosRow}
        >
          {store.photos.map((emoji: string, i: number) => (
            <View
              key={i}
              style={[styles.photoBox, { backgroundColor: isDark ? colors.card : store.bgColor + "12" }]}
            >
              <Text style={styles.photoEmoji}>{emoji}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ─── OFFERS ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 العروض والخصومات</Text>
          <Text style={[styles.sectionCount, { color: store.bgColor }]}>
            {store.offers.length} عروض
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersScroll}
        >
          {store.offers.map((offer: any) => (
            <Pressable
              key={offer.id}
              onPress={() => { setCopiedOfferCode(null); setSelectedOffer(offer); }}
              style={[styles.offerCard, { backgroundColor: isDark ? colors.card : offer.color + "10", borderColor: offer.color + "30" }]}
            >
              <View style={[styles.offerBadge, { backgroundColor: offer.color }]}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>
              <Text style={styles.offerEmoji}>{offer.emoji}</Text>
              <Text style={[styles.offerName, { color: colors.text }]} numberOfLines={2}>{offer.name}</Text>
              <Text style={[styles.offerValidity, { color: colors.muted }]}>حتى {offer.validTo}</Text>
              <View style={[styles.offerCodeBox, { backgroundColor: offer.color + "20" }]}>
                <Feather name="copy" size={11} color={offer.color} />
                <Text style={[styles.offerCode, { color: offer.color }]}>{offer.code}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ─── PRODUCTS ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🛍️ المنتجات</Text>
          <Text style={[styles.sectionCount, { color: store.bgColor }]}>
            {store.products.length} منتج
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {store.categories.map((cat: string) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCat(cat)}
              style={[
                styles.catChip,
                {
                  backgroundColor: activeCat === cat ? store.bgColor : (isDark ? colors.card : "#F5F5F5"),
                  borderColor: activeCat === cat ? store.bgColor : colors.border,
                },
              ]}
            >
              <Text style={[styles.catChipText, { color: activeCat === cat ? "#fff" : colors.text }]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.productsGrid}>
          {filteredProducts.map((product: any) => {
            const inCart = productItems.find(
              (p) => p.productId === product.id && p.storeId === store.id
            );
            const justAdded = addedFeedback === product.id;
            return (
              <Pressable
                key={product.id}
                style={[styles.productCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
                onPress={() => setSelectedProduct(product)}
              >
                <View style={[styles.productImgBox, { backgroundColor: isDark ? colors.surface : store.bgColor + "10" }]}>
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                  {product.badge ? (
                    <View style={[styles.productBadge, { backgroundColor: store.bgColor }]}>
                      <Text style={styles.productBadgeText}>{product.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.productRatingRow}>
                    <Text style={[styles.productReviews, { color: colors.muted }]}>({product.reviews})</Text>
                    <Text style={{ fontSize: 10, color: "#F59E0B" }}>⭐</Text>
                    <Text style={[styles.productRatingVal, { color: colors.text }]}>{product.rating}</Text>
                  </View>
                  <View style={styles.productBottom}>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      style={[
                        styles.addBtn,
                        {
                          backgroundColor: justAdded
                            ? "#22C55E"
                            : inCart
                            ? store.bgColor
                            : store.bgColor + "20",
                        },
                      ]}
                    >
                      <Feather
                        name={justAdded ? "check" : inCart ? "shopping-cart" : "plus"}
                        size={14}
                        color={justAdded || inCart ? "#fff" : store.bgColor}
                      />
                    </Pressable>
                    <View style={{ alignItems: "flex-end" }}>
                      {product.original > 0 && (
                        <Text style={[styles.productOriginal, { color: colors.muted }]}>
                          {product.original} ر.س
                        </Text>
                      )}
                      <Text style={[styles.productPrice, { color: store.bgColor }]}>
                        {product.price} ر.س
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ─── REVIEWS ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⭐ التقييمات</Text>
          <View style={[styles.ratingBadge, { backgroundColor: store.bgColor + "20" }]}>
            <Text style={[styles.ratingBadgeText, { color: store.bgColor }]}>
              {store.rating} ⭐
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
          {store.reviews.map((review: any, i: number) => (
            <View
              key={i}
              style={[styles.reviewCard, { backgroundColor: isDark ? colors.card : "#fff", borderColor: colors.border }]}
            >
              <View style={styles.reviewTop}>
                <Text style={[styles.reviewTime, { color: colors.muted }]}>{review.time}</Text>
                <Text style={[styles.reviewName, { color: colors.text }]}>{review.name}</Text>
                <View style={[styles.reviewAvatar, { backgroundColor: store.bgColor + "20" }]}>
                  <Text style={[styles.reviewAvatarText, { color: store.bgColor }]}>
                    {review.name.charAt(0)}
                  </Text>
                </View>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Text key={s} style={{ fontSize: 12, color: s <= review.rating ? "#F59E0B" : "#ccc" }}>
                    ★
                  </Text>
                ))}
              </View>
              <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ─── OFFER DETAIL MODAL ─── */}
      <Modal visible={!!selectedOffer} transparent animationType="slide" onRequestClose={() => setSelectedOffer(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedOffer(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
              {selectedOffer && (
                <>
                  <View style={styles.modalHandle} />
                  <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={[styles.offerHeaderBadge, { backgroundColor: selectedOffer.color }]}>
                      <Text style={styles.modalBadgeText}>{selectedOffer.badge}</Text>
                    </View>
                    <Text style={[{ fontSize: 12, fontFamily: "Tajawal_400Regular" }, { color: colors.muted }]}>{store.name}</Text>
                  </View>

                  <View style={{ alignItems: "center", paddingVertical: 8 }}>
                    <Text style={{ fontSize: 52 }}>{selectedOffer.emoji}</Text>
                  </View>

                  <Text style={[styles.modalProductName, { color: colors.text }]}>{selectedOffer.name}</Text>

                  <View style={[{ flexDirection: "row-reverse", alignItems: "center", gap: 6, padding: 10, borderRadius: 12, borderWidth: 1 }, { backgroundColor: isDark ? colors.card : "#FFF8E1", borderColor: "#F59E0B40" }]}>
                    <Feather name="clock" size={13} color="#F59E0B" />
                    <Text style={[{ fontSize: 13, fontFamily: "Tajawal_500Medium" }, { color: "#F59E0B" }]}>
                      العرض ساري حتى: {selectedOffer.validTo}
                    </Text>
                  </View>

                  <View style={[styles.offerCodeModalBox, { backgroundColor: selectedOffer.color + "12", borderColor: selectedOffer.color + "40" }]}>
                    <View>
                      <Text style={[{ fontSize: 12, fontFamily: "Tajawal_400Regular" }, { color: colors.muted }]}>كود الخصم</Text>
                      <Text style={[styles.offerCodeModalVal, { color: selectedOffer.color }]}>{selectedOffer.code}</Text>
                    </View>
                    <Pressable
                      style={[styles.offerCopyBtn, { backgroundColor: copiedOfferCode === selectedOffer.code ? "#22C55E" : selectedOffer.color }]}
                      onPress={() => copyOfferCode(selectedOffer.code)}
                    >
                      <Feather name={copiedOfferCode === selectedOffer.code ? "check" : "copy"} size={15} color="#fff" />
                      <Text style={styles.offerCopyBtnText}>
                        {copiedOfferCode === selectedOffer.code ? "تم النسخ!" : "انسخ الكود"}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={[styles.offerInstrBox, { backgroundColor: isDark ? colors.card : "#F8F8F8", borderColor: colors.border }]}>
                    <Text style={[{ fontSize: 13, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 6 }, { color: colors.text }]}>
                      📋 كيفية استخدام الكود
                    </Text>
                    <Text style={[{ fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 20 }, { color: colors.textSecondary }]}>
                      ١. انسخ الكود بالضغط على "انسخ الكود" أعلاه{"\n"}
                      ٢. أضف المنتجات المطلوبة للسلة{"\n"}
                      ٣. في صفحة الدفع، الصق الكود في خانة "كود الخصم"{"\n"}
                      ٤. سيُطبَّق الخصم تلقائياً على الإجمالي
                    </Text>
                  </View>

                  <Pressable
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={() => setSelectedOffer(null)}
                  >
                    <Text style={[styles.cancelBtnText, { color: colors.muted }]}>إغلاق</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ─── PRODUCT DETAIL MODAL ─── */}
      <Modal visible={!!selectedProduct} transparent animationType="slide" onRequestClose={() => setSelectedProduct(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedProduct(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
              {selectedProduct && (
                <>
                  <View style={styles.modalHandle} />
                  <View style={[styles.modalImgBox, { backgroundColor: store.bgColor + "15" }]}>
                    <Text style={styles.modalEmoji}>{selectedProduct.emoji}</Text>
                    {selectedProduct.badge ? (
                      <View style={[styles.modalBadge, { backgroundColor: store.bgColor }]}>
                        <Text style={styles.modalBadgeText}>{selectedProduct.badge}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={[styles.modalProductName, { color: colors.text }]}>
                    {selectedProduct.name}
                  </Text>

                  <View style={styles.modalRatingRow}>
                    <Text style={[styles.modalReviews, { color: colors.muted }]}>
                      ({selectedProduct.reviews} تقييم)
                    </Text>
                    <Text style={{ color: "#F59E0B" }}>⭐ {selectedProduct.rating}</Text>
                  </View>

                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                    {selectedProduct.desc}
                  </Text>

                  <View style={styles.modalPriceRow}>
                    {selectedProduct.original > 0 && (
                      <Text style={[styles.modalOriginal, { color: colors.muted }]}>
                        {selectedProduct.original} ر.س
                      </Text>
                    )}
                    <Text style={[styles.modalPrice, { color: store.bgColor }]}>
                      {selectedProduct.price} ر.س
                    </Text>
                    {selectedProduct.original > 0 && (
                      <View style={[styles.discountTag, { backgroundColor: "#EF4444" }]}>
                        <Text style={styles.discountTagText}>
                          -{Math.round(((selectedProduct.original - selectedProduct.price) / selectedProduct.original) * 100)}%
                        </Text>
                      </View>
                    )}
                  </View>

                  <Pressable
                    style={[styles.addToCartBtn, { backgroundColor: store.bgColor }]}
                    onPress={() => handleAddToCart(selectedProduct)}
                  >
                    <Feather name="shopping-cart" size={18} color="#fff" />
                    <Text style={styles.addToCartBtnText}>أضف للسلة</Text>
                  </Pressable>

                  <Pressable onPress={() => setSelectedProduct(null)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.cancelBtnText, { color: colors.muted }]}>إغلاق</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 16, paddingBottom: 10 },
  heroTopRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ffffff30", alignItems: "center", justifyContent: "center" },
  cartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ffffff30", alignItems: "center", justifyContent: "center" },
  cartBadge: { position: "absolute", top: -2, left: -2, backgroundColor: "#EF4444", borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  cartBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Cairo_700Bold" },
  heroContent: { alignItems: "center", gap: 4 },
  heroLogoBox: { width: 60, height: 60, borderRadius: 18, backgroundColor: "#ffffff30", alignItems: "center", justifyContent: "center" },
  heroEmoji: { fontSize: 30 },
  heroName: { fontSize: 18, fontFamily: "Cairo_700Bold", color: "#fff", textAlign: "center" },
  heroRatingRow: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  heroRatingVal: { fontSize: 13, fontFamily: "Cairo_700Bold", color: "#fff" },
  heroRatingCount: { fontSize: 11, fontFamily: "Tajawal_400Regular", color: "#ffffffCC" },
  openBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  openBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Tajawal_700Bold" },
  heroInfoRow: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  heroInfoItem: { flexDirection: "row-reverse", gap: 3, alignItems: "center" },
  heroInfoText: { fontSize: 10, fontFamily: "Tajawal_400Regular", color: "#ffffffCC" },

  ctaRow: { flexDirection: "row-reverse", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)" },
  ctaMain: { flex: 2, flexDirection: "row-reverse", gap: 6, paddingVertical: 10, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  ctaMainText: { fontSize: 14, fontFamily: "Tajawal_700Bold", color: "#fff" },
  ctaSecondary: { flex: 1, flexDirection: "row-reverse", gap: 5, paddingVertical: 10, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  ctaSecondaryText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },

  bioCard: { margin: 16, borderRadius: 18, padding: 16, borderWidth: 1, gap: 10 },
  bioHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  bioTitle: { fontSize: 15, fontFamily: "Cairo_700Bold" },
  bioText: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  bioStatsRow: { flexDirection: "row-reverse", justifyContent: "space-around", paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
  statItem: { alignItems: "center", gap: 2 },
  statVal: { fontSize: 16, fontFamily: "Cairo_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  statDivider: { width: 1, height: "100%" },

  sectionHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 10, marginTop: 6 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold" },
  sectionCount: { fontSize: 12, fontFamily: "Tajawal_700Bold" },

  photosRow: { paddingHorizontal: 16, gap: 10, marginBottom: 16, flexDirection: "row-reverse" },
  photoBox: { width: 90, height: 90, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  photoEmoji: { fontSize: 36 },

  offersScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 16, flexDirection: "row-reverse" },
  offerCard: { width: 160, borderRadius: 18, padding: 14, borderWidth: 1, gap: 4 },
  offerBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 4 },
  offerBadgeText: { fontSize: 11, fontFamily: "Cairo_700Bold", color: "#fff" },
  offerEmoji: { fontSize: 28 },
  offerName: { fontSize: 13, fontFamily: "Tajawal_700Bold", lineHeight: 18 },
  offerValidity: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  offerCodeBox: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 4 },
  offerCode: { fontSize: 11, fontFamily: "Cairo_700Bold" },
  offerCodeModalBox: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", borderRadius: 16, padding: 14, borderWidth: 1 },
  offerCodeModalVal: { fontSize: 22, fontFamily: "Cairo_700Bold", marginTop: 2 },
  offerCopyBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  offerCopyBtnText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  offerInstrBox: { borderRadius: 14, padding: 14, borderWidth: 1 },
  offerHeaderBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },

  catScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 12, flexDirection: "row-reverse" },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  catChipText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },

  productsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  productCard: { width: "47%", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  productImgBox: { height: 100, alignItems: "center", justifyContent: "center", position: "relative" },
  productEmoji: { fontSize: 38 },
  productBadge: { position: "absolute", top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  productBadgeText: { fontSize: 10, fontFamily: "Tajawal_700Bold", color: "#fff" },
  productInfo: { padding: 10, gap: 4 },
  productName: { fontSize: 12, fontFamily: "Tajawal_700Bold", lineHeight: 17 },
  productRatingRow: { flexDirection: "row-reverse", gap: 3, alignItems: "center" },
  productRatingVal: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  productReviews: { fontSize: 10, fontFamily: "Tajawal_400Regular" },
  productBottom: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  productPrice: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  productOriginal: { fontSize: 10, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  addBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  ratingBadge: { flexDirection: "row-reverse", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  ratingBadgeText: { fontSize: 13, fontFamily: "Cairo_700Bold" },

  reviewCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 8 },
  reviewTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  reviewName: { flex: 1, fontSize: 13, fontFamily: "Tajawal_700Bold" },
  reviewTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  starsRow: { flexDirection: "row-reverse", gap: 2 },
  reviewComment: { fontSize: 12, fontFamily: "Tajawal_400Regular", lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36, gap: 12 },
  modalHandle: { width: 40, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  modalImgBox: { height: 120, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  modalEmoji: { fontSize: 52 },
  modalBadge: { position: "absolute", top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  modalBadgeText: { fontSize: 11, fontFamily: "Tajawal_700Bold", color: "#fff" },
  modalProductName: { fontSize: 20, fontFamily: "Cairo_700Bold", textAlign: "right" },
  modalRatingRow: { flexDirection: "row-reverse", gap: 6, alignItems: "center" },
  modalReviews: { fontSize: 12, fontFamily: "Tajawal_400Regular" },
  modalDesc: { fontSize: 14, fontFamily: "Tajawal_400Regular", lineHeight: 22, textAlign: "right" },
  modalPriceRow: { flexDirection: "row-reverse", gap: 8, alignItems: "center" },
  modalOriginal: { fontSize: 14, textDecorationLine: "line-through", fontFamily: "Tajawal_400Regular" },
  modalPrice: { fontSize: 22, fontFamily: "Cairo_700Bold" },
  discountTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  discountTagText: { color: "#fff", fontSize: 12, fontFamily: "Cairo_700Bold" },
  addToCartBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16 },
  addToCartBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  cancelBtn: { paddingVertical: 14, borderRadius: 16, borderWidth: 1, alignItems: "center" },
  cancelBtnText: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
});
