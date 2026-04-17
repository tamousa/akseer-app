import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";

I18nManager.forceRTL(true);

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

const DETAIL_IMAGES: Record<string, any[]> = {
  clinics: [require("@/assets/images/clinic-room.png"), require("@/assets/images/clinics-banner.png")],
  labs: [require("@/assets/images/clinics-banner.png"), require("@/assets/images/clinic-room.png")],
  beauty: [require("@/assets/images/spa-treatment.png"), require("@/assets/images/beauty-banner.png")],
  trainers: [require("@/assets/images/fitness-banner.png"), require("@/assets/images/fitness-equipment.png")],
  specialists: [require("@/assets/images/clinic-room.png"), require("@/assets/images/mental-banner.png")],
};

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  duration: number;
  category: string;
}

interface Branch {
  name: string;
  address: string;
  phone: string;
}

interface ProviderDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  phone: string;
  workingHours: { day: string; hours: string }[];
  branches: Branch[];
  services: Service[];
  departments: string[];
  doctors: Doctor[];
  type: string;
  supportsRemote: boolean;
  cancellationPolicy: string;
  cases?: string[];
}

const ALL_PROVIDERS: Record<string, ProviderDetail> = {
  "clinic-1": {
    id: "clinic-1", name: "عيادات النخبة الطبية", type: "clinics",
    description: "عيادات متخصصة في الجلدية والتجميل والأسنان",
    longDescription: "عيادات النخبة الطبية هي مجموعة من العيادات المتخصصة التي تقدم خدمات طبية عالية الجودة في مجالات الجلدية والتجميل والأسنان. يضم فريقنا نخبة من الأطباء والاستشاريين المعتمدين مع أحدث التقنيات والأجهزة الطبية.",
    rating: 4.9, reviewCount: 328, isOpen: true,
    address: "حي العليا، شارع العليا العام، الرياض", phone: "011-4567890",
    workingHours: [{ day: "السبت - الخميس", hours: "9:00 ص - 10:00 م" }, { day: "الجمعة", hours: "4:00 م - 10:00 م" }],
    branches: [
      { name: "فرع العليا (الرئيسي)", address: "حي العليا، شارع العليا العام", phone: "011-4567890" },
      { name: "فرع الملقا", address: "حي الملقا، طريق الملك فهد", phone: "011-4567891" },
    ],
    departments: ["الجلدية والتجميل", "طب الأسنان", "الليزر", "البوتوكس والفيلر", "العناية بالبشرة"],
    doctors: [
      { id: "d1", name: "د. أحمد الشمري", specialty: "جلدية وتجميل", rating: 4.9, available: true },
      { id: "d2", name: "د. نورا العبدالله", specialty: "طب أسنان", rating: 4.8, available: true },
      { id: "d3", name: "د. فاطمة الراشد", specialty: "ليزر وعناية", rating: 4.7, available: false },
      { id: "d4", name: "د. خالد المنصور", specialty: "تجميل", rating: 4.9, available: true },
    ],
    services: [
      { id: "s1", name: "استشارة جلدية", description: "فحص وتشخيص أمراض الجلد والشعر والأظافر", price: 200, duration: 30, category: "جلدية" },
      { id: "s2", name: "جلسة ليزر", description: "إزالة الشعر بالليزر - جلسة واحدة", price: 350, originalPrice: 500, discountPercent: 30, duration: 45, category: "تجميل" },
      { id: "s3", name: "تنظيف بشرة عميق", description: "تنظيف وتقشير البشرة مع قناع مغذي", price: 250, originalPrice: 400, discountPercent: 38, duration: 60, category: "عناية" },
      { id: "s4", name: "حشو أسنان", description: "حشو أسنان تجميلي بالمواد المتطورة", price: 450, duration: 40, category: "أسنان" },
      { id: "s5", name: "تبييض أسنان", description: "تبييض الأسنان بتقنية الزووم المتقدمة", price: 800, duration: 60, category: "أسنان" },
      { id: "s6", name: "بوتوكس", description: "حقن البوتوكس للتجاعيد - منطقة واحدة", price: 500, duration: 20, category: "تجميل" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة من الموعد. في حالة الإلغاء خلال أقل من 24 ساعة، يتم خصم 25% من قيمة الخدمة. عدم الحضور بدون إلغاء مسبق يتم خصم 50% من القيمة.",
  },
  "clinic-2": {
    id: "clinic-2", name: "مجمع الشفاء الطبي", type: "clinics",
    description: "مجمع طبي متكامل يضم أكثر من 15 تخصص",
    longDescription: "مجمع الشفاء الطبي يقدم خدمات طبية شاملة تحت سقف واحد مع فريق طبي مؤهل ومعدات حديثة لضمان أفضل رعاية صحية.",
    rating: 4.7, reviewCount: 215, isOpen: true,
    address: "حي الملقا، الرياض", phone: "011-2345678",
    workingHours: [{ day: "السبت - الخميس", hours: "8:00 ص - 11:00 م" }, { day: "الجمعة", hours: "4:00 م - 11:00 م" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي الملقا، طريق أنس بن مالك", phone: "011-2345678" }],
    departments: ["الباطنية", "العظام والمفاصل", "طب الأطفال", "الأشعة", "المختبر"],
    doctors: [
      { id: "d1", name: "د. سلطان الدوسري", specialty: "باطنية", rating: 4.8, available: true },
      { id: "d2", name: "د. هند القحطاني", specialty: "أطفال", rating: 4.9, available: true },
      { id: "d3", name: "د. عبدالله الغامدي", specialty: "عظام", rating: 4.7, available: true },
    ],
    services: [
      { id: "s1", name: "كشف باطنية", description: "فحص شامل مع طبيب باطنية متخصص", price: 150, duration: 30, category: "باطنية" },
      { id: "s2", name: "فحص عظام", description: "تشخيص وعلاج أمراض العظام والمفاصل", price: 200, duration: 30, category: "عظام" },
      { id: "s3", name: "كشف أطفال", description: "فحص ومتابعة صحة الأطفال", price: 150, duration: 25, category: "أطفال" },
      { id: "s4", name: "أشعة سينية", description: "تصوير بالأشعة السينية", price: 120, duration: 15, category: "أشعة" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 12 ساعة من الموعد. الإلغاء المتأخر يخضع لرسوم 20%.",
  },
  "clinic-3": {
    id: "clinic-3", name: "عيادة الدكتور سلطان", type: "clinics",
    description: "عيادة تخصصية في أمراض القلب",
    longDescription: "عيادة متخصصة في تشخيص وعلاج أمراض القلب والأوعية الدموية مع خبرة تزيد عن 20 عاماً.",
    rating: 4.8, reviewCount: 142, isOpen: false,
    address: "حي الورود، الرياض", phone: "011-3456789",
    workingHours: [{ day: "الأحد - الخميس", hours: "10:00 ص - 8:00 م" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي الورود، شارع العروبة", phone: "011-3456789" }],
    departments: ["أمراض القلب", "تخطيط القلب", "الإيكو", "قسطرة القلب"],
    doctors: [
      { id: "d1", name: "د. سلطان الحربي", specialty: "قلب وأوعية", rating: 4.9, available: true },
      { id: "d2", name: "د. رنا الخالدي", specialty: "قلب", rating: 4.8, available: true },
    ],
    services: [
      { id: "s1", name: "استشارة قلب", description: "فحص وتشخيص أمراض القلب", price: 200, originalPrice: 300, discountPercent: 33, duration: 45, category: "قلب" },
      { id: "s2", name: "تخطيط قلب", description: "فحص ECG لتخطيط كهربية القلب", price: 150, duration: 20, category: "قلب" },
      { id: "s3", name: "إيكو قلب", description: "فحص القلب بالموجات فوق الصوتية", price: 400, duration: 30, category: "قلب" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة من الموعد.",
  },
  "clinic-4": {
    id: "clinic-4", name: "مركز لمسة العناية", type: "clinics",
    description: "مركز متخصص في العلاج الطبيعي والتأهيل",
    longDescription: "مركز لمسة العناية يقدم خدمات العلاج الطبيعي والتأهيل مع أخصائيين معتمدين.",
    rating: 4.6, reviewCount: 89, isOpen: true,
    address: "حي النرجس، الرياض", phone: "011-4567123",
    workingHours: [{ day: "السبت - الخميس", hours: "9:00 ص - 9:00 م" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي النرجس", phone: "011-4567123" }],
    departments: ["العلاج الطبيعي", "التأهيل الرياضي", "التدليك العلاجي"],
    doctors: [
      { id: "d1", name: "أ. ريم السبيعي", specialty: "علاج طبيعي", rating: 4.7, available: true },
      { id: "d2", name: "أ. فيصل الرشيدي", specialty: "تأهيل رياضي", rating: 4.6, available: true },
    ],
    services: [
      { id: "s1", name: "جلسة علاج طبيعي", description: "جلسة تأهيل وعلاج طبيعي", price: 200, duration: 45, category: "علاج طبيعي" },
      { id: "s2", name: "تدليك علاجي", description: "تدليك متخصص للعضلات والمفاصل", price: 250, duration: 60, category: "تدليك" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 6 ساعات من الموعد.",
  },
  "lab-1": {
    id: "lab-1", name: "مختبرات البرج الطبية", type: "labs",
    description: "أكبر شبكة مختبرات في المملكة",
    longDescription: "مختبرات البرج الطبية تقدم أكثر من 2000 تحليل مختلف مع نتائج دقيقة وسريعة ومعتمدة دولياً.",
    rating: 4.8, reviewCount: 456, isOpen: true,
    address: "حي الروضة، الرياض", phone: "920012345",
    workingHours: [{ day: "يومياً", hours: "7:00 ص - 11:00 م" }],
    branches: [
      { name: "فرع الروضة", address: "حي الروضة، شارع الأمير سلطان", phone: "920012345" },
      { name: "فرع العليا", address: "حي العليا، شارع الأمير محمد", phone: "920012346" },
    ],
    departments: ["تحاليل الدم", "الهرمونات", "الفيتامينات", "الباقات الشاملة"],
    doctors: [
      { id: "d1", name: "د. عمر البكري", specialty: "مختبرات", rating: 4.8, available: true },
    ],
    services: [
      { id: "s1", name: "تحليل دم شامل CBC", description: "تحليل صورة دم كاملة مع صيغة", price: 80, duration: 15, category: "دم" },
      { id: "s2", name: "فحص فيتامين D", description: "قياس مستوى فيتامين D في الدم", price: 120, duration: 10, category: "فيتامينات" },
      { id: "s3", name: "فحص الغدة الدرقية", description: "تحليل هرمونات الغدة الدرقية TSH, T3, T4", price: 200, duration: 10, category: "هرمونات" },
      { id: "s4", name: "باقة الفحص الشامل", description: "أكثر من 30 تحليل شامل لجميع وظائف الجسم", price: 500, originalPrice: 800, discountPercent: 38, duration: 20, category: "باقات" },
      { id: "s5", name: "فحص سكر تراكمي HbA1c", description: "قياس متوسط مستوى السكر لآخر 3 أشهر", price: 90, duration: 10, category: "سكر" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 4 ساعات. خدمة السحب المنزلي غير قابلة للاسترداد بعد تأكيد الزيارة.",
  },
  "lab-2": {
    id: "lab-2", name: "مختبر النهضة", type: "labs",
    description: "مختبر معتمد من الهيئة السعودية",
    longDescription: "مختبر النهضة يقدم خدمات تحاليل طبية شاملة مع أحدث الأجهزة والتقنيات.",
    rating: 4.7, reviewCount: 312, isOpen: true,
    address: "حي السليمانية، الرياض", phone: "011-5678901",
    workingHours: [{ day: "السبت - الخميس", hours: "7:00 ص - 10:00 م" }, { day: "الجمعة", hours: "4:00 م - 10:00 م" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي السليمانية", phone: "011-5678901" }],
    departments: ["الباقات الشاملة", "الحساسية", "الفيتامينات"],
    doctors: [{ id: "d1", name: "د. لمياء العنزي", specialty: "مختبرات", rating: 4.7, available: true }],
    services: [
      { id: "s1", name: "تحليل شامل أساسي", description: "فحوصات أساسية شاملة", price: 350, duration: 20, category: "باقات" },
      { id: "s2", name: "تحليل حساسية طعام", description: "فحص حساسية لأكثر من 90 نوع طعام", price: 450, duration: 15, category: "حساسية" },
      { id: "s3", name: "فحص فيتامينات شامل", description: "قياس مستوى جميع الفيتامينات الأساسية", price: 380, duration: 15, category: "فيتامينات" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 6 ساعات من الموعد.",
  },
  "lab-3": {
    id: "lab-3", name: "مختبرات كير لاب", type: "labs",
    description: "خدمة سحب عينات منزلية",
    longDescription: "مختبرات كير لاب تقدم خدمة سحب العينات المنزلية على مدار الساعة مع نتائج سريعة.",
    rating: 4.9, reviewCount: 278, isOpen: true,
    address: "خدمة منزلية - الرياض", phone: "920067890",
    workingHours: [{ day: "يومياً", hours: "24 ساعة" }],
    branches: [{ name: "خدمة منزلية", address: "نغطي جميع أحياء الرياض", phone: "920067890" }],
    departments: ["سحب منزلي", "تحاليل عاجلة"],
    doctors: [{ id: "d1", name: "فريق السحب المنزلي", specialty: "سحب عينات", rating: 4.9, available: true }],
    services: [
      { id: "s1", name: "سحب عينة منزلي + تحليل شامل", description: "زيارة منزلية + فحص شامل أكثر من 25 تحليل", price: 500, duration: 30, category: "منزلي" },
      { id: "s2", name: "سحب عينة منزلي + COVID", description: "فحص كورونا PCR مع زيارة منزلية", price: 250, duration: 15, category: "منزلي" },
      { id: "s3", name: "سحب عينة منزلي + فيتامينات", description: "فحص فيتامينات شامل مع زيارة منزلية", price: 350, duration: 20, category: "منزلي" },
    ],
    supportsRemote: false,
    cancellationPolicy: "خدمة السحب المنزلي غير قابلة للاسترداد بعد تأكيد الزيارة.",
  },
  "beauty-1": {
    id: "beauty-1", name: "صالون لمسات الجمال", type: "beauty",
    description: "صالون نسائي متكامل للعناية",
    longDescription: "صالون لمسات الجمال يقدم أفضل خدمات العناية بالبشرة والشعر والمكياج مع خبيرات متخصصات.",
    rating: 4.9, reviewCount: 523, isOpen: true,
    address: "حي الياسمين، الرياض", phone: "011-6789012",
    workingHours: [{ day: "السبت - الخميس", hours: "10:00 ص - 10:00 م" }, { day: "الجمعة", hours: "2:00 م - 10:00 م" }],
    branches: [{ name: "فرع الياسمين", address: "حي الياسمين، شارع الأمير سعود", phone: "011-6789012" }],
    departments: ["الشعر والتسريحات", "العناية بالبشرة", "المكياج", "الأظافر"],
    doctors: [
      { id: "d1", name: "أ. سمر الحسيني", specialty: "تسريحات", rating: 4.9, available: true },
      { id: "d2", name: "أ. رنا المالكي", specialty: "عناية بشرة", rating: 4.8, available: true },
    ],
    services: [
      { id: "s1", name: "قص وتصفيف شعر", description: "قص وتصفيف مع غسل وبلسم", price: 150, duration: 45, category: "شعر" },
      { id: "s2", name: "صبغة شعر كاملة", description: "صبغة لون كامل مع علاج", price: 350, duration: 90, category: "شعر" },
      { id: "s3", name: "تنظيف بشرة", description: "تنظيف عميق للبشرة مع قناع", price: 200, duration: 60, category: "بشرة" },
      { id: "s4", name: "مكياج سهرة", description: "مكياج احترافي كامل للمناسبات", price: 300, duration: 60, category: "مكياج" },
      { id: "s5", name: "مانيكير وبديكير", description: "عناية كاملة بالأظافر", price: 120, duration: 45, category: "أظافر" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 12 ساعة من الموعد.",
  },
  "beauty-2": {
    id: "beauty-2", name: "سبا الهدوء", type: "beauty",
    description: "سبا فاخر للتدليك والعناية",
    longDescription: "سبا الهدوء يوفر تجربة استرخاء فاخرة مع أفضل خدمات التدليك والساونا والعناية بالجسم.",
    rating: 4.8, reviewCount: 412, isOpen: true,
    address: "حي الملقا، الرياض", phone: "011-7890123",
    workingHours: [{ day: "يومياً", hours: "10:00 ص - 12:00 ص" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي الملقا", phone: "011-7890123" }],
    departments: ["التدليك", "الساونا والبخار", "باقات العناية"],
    doctors: [{ id: "d1", name: "أ. سلمى العمري", specialty: "تدليك علاجي", rating: 4.8, available: true }],
    services: [
      { id: "s1", name: "تدليك سويدي", description: "تدليك استرخائي كامل للجسم", price: 300, duration: 60, category: "تدليك" },
      { id: "s2", name: "تدليك بالأحجار الساخنة", description: "علاج بالأحجار البركانية الساخنة", price: 400, duration: 75, category: "تدليك" },
      { id: "s3", name: "جلسة ساونا + بخار", description: "ساونا فنلندية مع غرفة بخار", price: 150, duration: 45, category: "ساونا" },
      { id: "s4", name: "باقة العروس", description: "باقة شاملة للعناية قبل الزفاف", price: 1200, duration: 180, category: "باقات" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة.",
  },
  "beauty-3": {
    id: "beauty-3", name: "باربر شوب الأنيق", type: "beauty",
    description: "صالون رجالي متخصص",
    longDescription: "باربر شوب الأنيق يقدم أفضل خدمات الحلاقة والعناية باللحية للرجال.",
    rating: 4.7, reviewCount: 287, isOpen: false,
    address: "حي العليا، الرياض", phone: "011-8901234",
    workingHours: [{ day: "السبت - الخميس", hours: "10:00 ص - 11:00 م" }],
    branches: [{ name: "الفرع الرئيسي", address: "حي العليا", phone: "011-8901234" }],
    departments: ["الحلاقة", "العناية باللحية", "التدليك"],
    doctors: [{ id: "d1", name: "أ. سعد الخيال", specialty: "حلاقة", rating: 4.7, available: true }],
    services: [
      { id: "s1", name: "حلاقة كلاسيكية", description: "حلاقة تقليدية مع موس وتدليك", price: 60, duration: 30, category: "حلاقة" },
      { id: "s2", name: "تشكيل لحية", description: "تشكيل وتهذيب اللحية", price: 40, duration: 20, category: "لحية" },
      { id: "s3", name: "باقة العريس", description: "حلاقة + لحية + تدليك وجه", price: 150, duration: 60, category: "باقات" },
    ],
    supportsRemote: false,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 6 ساعات.",
  },
  "trainer-1": {
    id: "trainer-1", name: "كابتن أحمد الفيصل", type: "trainers",
    description: "مدرب لياقة بدنية معتمد",
    longDescription: "كابتن أحمد مدرب معتمد من الاتحاد السعودي للياقة البدنية مع خبرة 8 سنوات في بناء الأجسام والتغذية الرياضية.",
    rating: 4.9, reviewCount: 234, isOpen: true,
    address: "جيم فتنس تايم، الرياض", phone: "0551234567",
    workingHours: [{ day: "السبت - الخميس", hours: "6:00 ص - 10:00 م" }],
    branches: [{ name: "جيم فتنس تايم", address: "حي الياسمين، الرياض", phone: "0551234567" }],
    departments: ["التدريب الشخصي", "بناء الأجسام", "التغذية الرياضية"],
    doctors: [{ id: "d1", name: "كابتن أحمد الفيصل", specialty: "لياقة بدنية", rating: 4.9, available: true }],
    services: [
      { id: "s1", name: "جلسة تدريب شخصي", description: "تدريب فردي مع متابعة الأداء", price: 200, duration: 60, category: "تدريب" },
      { id: "s2", name: "خطة تدريبية شهرية", description: "برنامج 4 أسابيع مع تغذية", price: 800, duration: 0, category: "برنامج" },
      { id: "s3", name: "تقييم لياقة بدنية", description: "فحص شامل للياقة والقياسات", price: 150, duration: 45, category: "تقييم" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 12 ساعة.",
  },
  "trainer-2": {
    id: "trainer-2", name: "كابتن نورة العتيبي", type: "trainers",
    description: "مدربة يوغا وبيلاتيس معتمدة",
    longDescription: "كابتن نورة مدربة معتمدة في اليوغا والبيلاتيس مع خبرة 5 سنوات في التدريب الشخصي والجماعي.",
    rating: 4.8, reviewCount: 187, isOpen: true,
    address: "استوديو زين، الرياض", phone: "0559876543",
    workingHours: [{ day: "الأحد - الخميس", hours: "7:00 ص - 9:00 م" }, { day: "السبت", hours: "8:00 ص - 2:00 م" }],
    branches: [{ name: "استوديو زين", address: "حي الياسمين", phone: "0559876543" }],
    departments: ["اليوغا", "البيلاتيس", "المرونة"],
    doctors: [{ id: "d1", name: "كابتن نورة العتيبي", specialty: "يوغا وبيلاتيس", rating: 4.8, available: true }],
    services: [
      { id: "s1", name: "جلسة يوغا خاصة", description: "تدريب يوغا فردي مخصص", price: 180, duration: 60, category: "يوغا" },
      { id: "s2", name: "جلسة بيلاتيس", description: "تمارين بيلاتيس لتقوية العضلات", price: 180, duration: 50, category: "بيلاتيس" },
      { id: "s3", name: "باقة 8 جلسات", description: "8 جلسات يوغا أو بيلاتيس", price: 1200, duration: 0, category: "باقات" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 6 ساعات.",
  },
  "trainer-3": {
    id: "trainer-3", name: "كابتن خالد المطيري", type: "trainers",
    description: "مدرب كروسفت وتمارين وظيفية",
    longDescription: "كابتن خالد مدرب كروسفت معتمد Level 2 مع خطط تدريبية مخصصة لجميع المستويات.",
    rating: 4.7, reviewCount: 156, isOpen: true,
    address: "جيم آيرون، الرياض", phone: "0556781234",
    workingHours: [{ day: "يومياً", hours: "5:00 ص - 11:00 م" }],
    branches: [{ name: "جيم آيرون", address: "حي الربيع، الرياض", phone: "0556781234" }],
    departments: ["الكروسفت", "التمارين الوظيفية"],
    doctors: [{ id: "d1", name: "كابتن خالد المطيري", specialty: "كروسفت", rating: 4.7, available: true }],
    services: [
      { id: "s1", name: "جلسة كروسفت", description: "تدريب كروسفت مكثف", price: 180, duration: 60, category: "كروسفت" },
      { id: "s2", name: "تدريب وظيفي", description: "تمارين وظيفية لتحسين الأداء", price: 200, duration: 60, category: "وظيفي" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 6 ساعات.",
  },
  "spec-1": {
    id: "spec-1", name: "د. سارة الأحمدي", type: "specialists",
    description: "أخصائية تغذية علاجية",
    longDescription: "د. سارة أخصائية تغذية علاجية حاصلة على ماجستير في علوم التغذية من جامعة الملك سعود مع خبرة 10 سنوات.",
    rating: 4.9, reviewCount: 345, isOpen: true,
    address: "حضوري / أونلاين", phone: "0501234567",
    workingHours: [{ day: "الأحد - الخميس", hours: "9:00 ص - 6:00 م" }],
    branches: [{ name: "العيادة", address: "حي الصحافة، الرياض", phone: "0501234567" }],
    departments: ["التغذية العلاجية", "الحميات", "التغذية الرياضية"],
    cases: ["السمنة المفرطة", "مرضى السكري", "سوء التغذية", "اضطرابات الأكل", "تغذية الحوامل", "تغذية الرياضيين", "حساسية الطعام"],
    doctors: [{ id: "d1", name: "د. سارة الأحمدي", specialty: "تغذية علاجية", rating: 4.9, available: true }],
    services: [
      { id: "s1", name: "استشارة تغذية أولى", description: "فحص شامل وخطة غذائية مخصصة", price: 199, originalPrice: 350, discountPercent: 43, duration: 45, category: "استشارة" },
      { id: "s2", name: "متابعة شهرية", description: "جلسة متابعة وتعديل الخطة", price: 150, duration: 30, category: "متابعة" },
      { id: "s3", name: "خطة تغذية رياضية", description: "برنامج غذائي مخصص للرياضيين", price: 300, duration: 45, category: "رياضي" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة. الإلغاء المتأخر يخضع لرسوم 30%.",
  },
  "spec-2": {
    id: "spec-2", name: "د. فهد الحربي", type: "specialists",
    description: "استشاري جلدية وتجميل",
    longDescription: "د. فهد استشاري أمراض جلدية وتجميل حاصل على الزمالة البريطانية مع خبرة واسعة.",
    rating: 4.8, reviewCount: 298, isOpen: true,
    address: "حي الصحافة، الرياض", phone: "0509876543",
    workingHours: [{ day: "الأحد - الخميس", hours: "10:00 ص - 8:00 م" }],
    branches: [{ name: "العيادة", address: "حي الصحافة، شارع التخصصي", phone: "0509876543" }],
    departments: ["الجلدية", "التجميل", "الليزر"],
    cases: ["حب الشباب", "الإكزيما والصدفية", "تصبغات البشرة", "تجاعيد وترهل الجلد", "تساقط الشعر", "الثآليل والشامات", "الحروق والندبات"],
    doctors: [{ id: "d1", name: "د. فهد الحربي", specialty: "جلدية وتجميل", rating: 4.8, available: true }],
    services: [
      { id: "s1", name: "استشارة جلدية", description: "فحص شامل للجلد والشعر", price: 300, duration: 30, category: "جلدية" },
      { id: "s2", name: "جلسة فيلر", description: "حقن فيلر تجميلي", price: 1500, duration: 30, category: "تجميل" },
      { id: "s3", name: "جلسة ليزر تجميلي", description: "علاج بالليزر للتصبغات والندبات", price: 800, duration: 45, category: "ليزر" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 48 ساعة. الإلغاء خلال 48 ساعة يخضع لرسوم 50%.",
  },
  "spec-3": {
    id: "spec-3", name: "أ. منال الشهري", type: "specialists",
    description: "أخصائية نفسية إكلينيكية",
    longDescription: "أ. منال أخصائية نفسية إكلينيكية متخصصة في علاج القلق والاكتئاب والعلاج المعرفي السلوكي.",
    rating: 4.9, reviewCount: 267, isOpen: false,
    address: "استشارة عن بعد", phone: "0507654321",
    workingHours: [{ day: "الأحد - الأربعاء", hours: "10:00 ص - 6:00 م" }],
    branches: [{ name: "أونلاين", address: "جلسات عن بعد عبر الفيديو", phone: "0507654321" }],
    departments: ["العلاج المعرفي السلوكي", "القلق والاكتئاب", "الإرشاد النفسي"],
    cases: ["القلق المزمن", "الاكتئاب", "نوبات الهلع", "اضطراب ما بعد الصدمة", "الوسواس القهري", "الأرق واضطرابات النوم", "ضغوط العمل"],
    doctors: [{ id: "d1", name: "أ. منال الشهري", specialty: "نفسية إكلينيكية", rating: 4.9, available: true }],
    services: [
      { id: "s1", name: "جلسة تقييم أولية", description: "تقييم نفسي شامل ووضع خطة علاجية", price: 300, duration: 60, category: "تقييم" },
      { id: "s2", name: "جلسة علاج نفسي", description: "جلسة علاج معرفي سلوكي CBT", price: 180, originalPrice: 300, discountPercent: 40, duration: 50, category: "علاج" },
      { id: "s3", name: "باقة 4 جلسات", description: "4 جلسات علاج نفسي متتالية", price: 800, duration: 0, category: "باقات" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة.",
  },
  "spec-4": {
    id: "spec-4", name: "د. محمد الزهراني", type: "specialists",
    description: "استشاري طب رياضي",
    longDescription: "د. محمد استشاري طب رياضي حاصل على البورد السعودي مع خبرة 12 سنة في علاج إصابات الملاعب وتأهيل الرياضيين.",
    rating: 4.8, reviewCount: 189, isOpen: true,
    address: "حي الملقا، الرياض", phone: "0508765432",
    workingHours: [{ day: "الأحد - الخميس", hours: "8:00 ص - 8:00 م" }, { day: "السبت", hours: "10:00 ص - 4:00 م" }],
    branches: [{ name: "العيادة", address: "حي الملقا، شارع التخصصي", phone: "0508765432" }],
    departments: ["الطب الرياضي", "إصابات الملاعب", "التأهيل الرياضي"],
    cases: ["إصابات الملاعب", "تمزق الأربطة", "إصابات الركبة والكتف", "آلام الظهر للرياضيين", "الإجهاد العضلي المزمن", "كسور الإجهاد", "إعادة التأهيل بعد الجراحة"],
    doctors: [{ id: "d1", name: "د. محمد الزهراني", specialty: "طب رياضي", rating: 4.8, available: true }],
    services: [
      { id: "s1", name: "استشارة طب رياضي", description: "تقييم شامل للإصابات الرياضية ووضع خطة علاجية", price: 200, duration: 45, category: "استشارة" },
      { id: "s2", name: "جلسة تأهيل رياضي", description: "تأهيل متخصص للعودة للنشاط الرياضي", price: 180, duration: 60, category: "تأهيل" },
      { id: "s3", name: "تقييم لياقة بدنية طبي", description: "فحص طبي شامل للياقة البدنية مع تقرير مفصل", price: 350, duration: 60, category: "تقييم" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 12 ساعة من الموعد.",
  },
  "spec-5": {
    id: "spec-5", name: "د. ليلى الحربي", type: "specialists",
    description: "أخصائية صحة نفسية",
    longDescription: "د. ليلى أخصائية صحة نفسية متخصصة في العلاج الأسري والعلاقات مع خبرة 7 سنوات في الإرشاد النفسي عن بعد.",
    rating: 4.9, reviewCount: 312, isOpen: true,
    address: "استشارة عن بعد", phone: "0504321567",
    workingHours: [{ day: "الأحد - الخميس", hours: "10:00 ص - 7:00 م" }],
    branches: [{ name: "أونلاين", address: "جلسات عن بعد عبر الفيديو", phone: "0504321567" }],
    departments: ["الصحة النفسية", "العلاج الأسري", "الإرشاد النفسي"],
    cases: ["المشاكل الأسرية والزوجية", "القلق والتوتر", "الاكتئاب الخفيف والمتوسط", "اضطرابات المراهقين", "ضغوط الحياة اليومية", "مشاكل الثقة بالنفس", "اضطرابات التكيف"],
    doctors: [{ id: "d1", name: "د. ليلى الحربي", specialty: "صحة نفسية", rating: 4.9, available: true }],
    services: [
      { id: "s1", name: "استشارة نفسية أولى", description: "جلسة تقييم شاملة ووضع خطة إرشادية", price: 200, duration: 50, category: "استشارة" },
      { id: "s2", name: "جلسة إرشاد نفسي", description: "جلسة إرشاد ودعم نفسي فردي", price: 180, duration: 45, category: "إرشاد" },
      { id: "s3", name: "جلسة علاج أسري", description: "جلسة علاج أسري مع الأزواج أو العائلة", price: 300, duration: 60, category: "أسري" },
    ],
    supportsRemote: true,
    cancellationPolicy: "يمكن إلغاء الحجز مجاناً قبل 24 ساعة.",
  },
};

const SAMPLE_REVIEWS: Record<string, { name: string; rating: number; comment: string; service: string; time: string; helpful: number }[]> = {
  "clinic-1": [
    { name: "ريم الشمري", rating: 5, comment: "د. أحمد ممتاز جداً، شرح الوضع بوضوح وكان حريصاً. العيادة نظيفة ومنظمة.", service: "استشارة جلدية", time: "منذ يومين", helpful: 12 },
    { name: "نورة العتيبي", rating: 4, comment: "تجربة جيدة. الموعد كان في الوقت المحدد تقريباً. سأزورهم مرة أخرى.", service: "تنظيف بشرة عميق", time: "منذ أسبوع", helpful: 7 },
    { name: "سلمى الحربي", rating: 5, comment: "نتيجة الليزر رائعة! الفريق محترف جداً والأسعار معقولة.", service: "جلسة ليزر", time: "منذ أسبوعين", helpful: 18 },
  ],
  "lab-1": [
    { name: "أحمد القحطاني", rating: 5, comment: "النتيجة وصلت على التطبيق خلال ساعتين فقط! الفريق سريع ودقيق.", service: "باقة الفحص الشامل", time: "اليوم", helpful: 9 },
    { name: "فاطمة الدوسري", rating: 4, comment: "خدمة منزلية ممتازة. الفني وصل في الوقت تماماً وكان محترفاً.", service: "فحص فيتامين D", time: "منذ 3 أيام", helpful: 5 },
  ],
  "beauty-1": [
    { name: "هند المطيري", rating: 5, comment: "الأستاذة سمر محترفة جداً، التسريحة طلعت رائعة لحفلة العرس.", service: "قص وتصفيف شعر", time: "منذ يوم", helpful: 14 },
    { name: "دانة الرشيد", rating: 5, comment: "مكياج السهرة كان خيالياً، الكل مدحه في الحفل. شكراً الأستاذة رنا.", service: "مكياج سهرة", time: "منذ أسبوع", helpful: 21 },
  ],
  "trainer-1": [
    { name: "عمر الفيصل", rating: 5, comment: "الكابتن أحمد غيّر حياتي! في 3 أشهر خسرت 12 كيلو مع خطة تغذية مخصصة.", service: "تدريب شخصي", time: "منذ أسبوعين", helpful: 32 },
    { name: "بدر السليمان", rating: 5, comment: "أفضل مدرب جربته. يشرح التمارين بشكل علمي ويهتم بالتفاصيل الدقيقة.", service: "تدريب شخصي", time: "منذ شهر", helpful: 17 },
  ],
  "spec-1": [
    { name: "مريم الزهراني", rating: 5, comment: "الدكتورة سارة أخصائية تغذية ممتازة. الخطة الغذائية شرحتها بالتفصيل.", service: "استشارة تغذية", time: "منذ 3 أيام", helpful: 10 },
    { name: "عبير النمري", rating: 4, comment: "جلسة مفيدة جداً، أجابت على جميع أسئلتي بصبر.", service: "متابعة شهرية", time: "منذ أسبوع", helpful: 6 },
  ],
};

function getSampleReviews(id: string) {
  return SAMPLE_REVIEWS[id] ?? SAMPLE_REVIEWS["clinic-1"];
}

const RATING_LABELS = ["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"];

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

const BOOKING_METHODS = [
  { key: "in-person" as const, label: "حضوري", icon: "map-pin" as const, desc: "في العيادة/المركز" },
  { key: "video" as const, label: "مكالمة فيديو", icon: "video" as const, desc: "عبر الفيديو" },
  { key: "phone" as const, label: "مكالمة هاتفية", icon: "phone" as const, desc: "عبر الهاتف" },
];

function getNext7Days() {
  const days: { label: string; date: string; dayName: string }[] = [];
  const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: d.getDate().toString(),
      date: d.toISOString().split("T")[0],
      dayName: i === 0 ? "اليوم" : i === 1 ? "غداً" : dayNames[d.getDay()],
    });
  }
  return days;
}

export default function ProviderDetailScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { addToCart, items: cartItems } = useCart();

  const topPadding = isWeb ? 67 : insets.top;
  const provider = ALL_PROVIDERS[id];
  const images = DETAIL_IMAGES[type || provider?.type || "clinics"] || DETAIL_IMAGES.clinics;

  const [activeTab, setActiveTab] = useState("services");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingMethod, setBookingMethod] = useState<"in-person" | "video" | "phone">("in-person");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewService, setReviewService] = useState(provider?.services?.[0]?.name ?? "");
  const [helpfulMarked, setHelpfulMarked] = useState<number[]>([]);
  const [userReviews, setUserReviews] = useState<{ name: string; rating: number; comment: string; service: string; time: string; helpful: number }[]>([]);

  if (!provider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>لم يتم العثور على المزود</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#C490D8", fontSize: 16 }}>رجوع</Text>
        </Pressable>
      </View>
    );
  }

  const days = getNext7Days();
  const availableDoctors = provider.doctors.filter((d) => d.available);
  const availableMethods = provider.supportsRemote ? BOOKING_METHODS : [BOOKING_METHODS[0]];

  const handleServicePress = (service: Service) => {
    if (selectedService?.id === service.id) {
      setSelectedService(null);
    } else {
      setSelectedService(service);
      setSelectedTime(null);
    }
  };

  const handleBookService = (service: Service) => {
    if (!selectedTime) {
      Alert.alert("اختر الوقت", "يرجى اختيار وقت الموعد أولاً");
      return;
    }
    if (!isSpecialist && !selectedDoctor && availableDoctors.length > 0) {
      Alert.alert("اختر المختص", "يرجى اختيار المختص/الطبيب أولاً");
      return;
    }

    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedService || !selectedTime) return;

    addToCart({
      providerId: provider.id,
      providerName: provider.name,
      providerType: type || provider.type,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      doctorName: isSpecialist ? provider.name : selectedDoctor?.name,
      bookingMethod: bookingMethod,
    });

    setShowBookingModal(false);

    Alert.alert("تمت الإضافة ✓", `تم إضافة "${selectedService.name}" إلى السلة`, [
      { text: "متابعة التصفح", style: "cancel" },
      { text: "عرض السلة", onPress: () => router.push("/cart" as any) },
    ]);
    setSelectedService(null);
    setSelectedTime(null);
  };

  const cartCount = cartItems.length;
  const isSpecialist = provider.type === "specialists";
  const allReviews = [...getSampleReviews(provider.id), ...userReviews];
  const avgRating = allReviews.length ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : provider.rating.toFixed(1);
  const ratingDist = [5,4,3,2,1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
    pct: allReviews.length ? Math.round((allReviews.filter((r) => r.rating === star).length / allReviews.length) * 100) : (star === 5 ? 70 : star === 4 ? 20 : 5),
  }));

  const DETAIL_TABS = [
    { key: "services", label: "الخدمات" },
    { key: "reviews", label: `التقييمات (${allReviews.length})` },
    { key: "departments", label: isSpecialist ? "الحالات" : "الأقسام" },
    { key: "hours", label: "المواعيد" },
    { key: "branches", label: isSpecialist ? "الموقع" : "الفروع" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={(e) => { setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width)); }}
            scrollEventThrottle={16}
          >
            {images.map((img: any, idx: number) => (
              <Image key={idx} source={img} style={{ width, height: 260 }} resizeMode="cover" />
            ))}
          </ScrollView>
          <View style={styles.imgOverlay} />
          <View style={[styles.topBar, { paddingTop: topPadding + 8 }]}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Feather name="chevron-right" size={22} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => router.push("/cart" as any)}>
              <Feather name="shopping-cart" size={20} color="#fff" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={[styles.statusBadgeTop, { backgroundColor: provider.isOpen ? "#22C55E" : "#EF4444" }]}>
            <View style={[styles.statusDotSmall, { backgroundColor: provider.isOpen ? "#86EFAC" : "#FCA5A5" }]} />
            <Text style={styles.statusText}>{provider.isOpen ? "مفتوح الآن" : "مغلق حالياً"}</Text>
          </View>
          <View style={styles.imageDots}>
            {images.map((_: any, idx: number) => (
              <View key={idx} style={[styles.dot, { backgroundColor: idx === activeImageIndex ? "#fff" : "rgba(255,255,255,0.5)" }]} />
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={[styles.providerName, { color: colors.text }]}>{provider.name}</Text>
            <View style={styles.ratingBadge}>
              <Text style={{ fontSize: 12 }}>⭐</Text>
              <Text style={styles.ratingNum}>{provider.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.muted }]}>({provider.reviewCount})</Text>
            </View>
          </View>
          <Text style={[styles.longDesc, { color: colors.textSecondary }]}>{provider.longDescription}</Text>

          <View style={styles.quickInfo}>
            <View style={[styles.quickItem, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
              <Feather name="map-pin" size={14} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.textSecondary }]}>{provider.address}</Text>
            </View>
            <Pressable style={[styles.quickItem, { backgroundColor: colors.primary + "15" }]} onPress={() => Alert.alert("الدردشة", `سيتم فتح المحادثة مع ${provider.name}`)}>
              <Feather name="message-circle" size={14} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.primary, fontFamily: "Tajawal_700Bold" }]}>دردشة مع المزود</Text>
              <Feather name="chevron-left" size={14} color={colors.primary} />
            </Pressable>
            <Pressable
              style={[styles.quickItem, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}
              onPress={() => setShowPolicyModal(true)}
            >
              <Feather name="shield" size={14} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.primary }]}>سياسة الإلغاء والاسترداد</Text>
              <Feather name="chevron-left" size={14} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsScrollContent}>
          {DETAIL_TABS.map((t) => (
            <Pressable key={t.key} style={[styles.tab, activeTab === t.key && { borderBottomColor: colors.primary }]} onPress={() => setActiveTab(t.key)}>
              <Text style={[styles.tabText, { color: activeTab === t.key ? colors.primary : colors.muted }]}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {activeTab === "services" && (
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>الخدمات المتاحة</Text>
            {provider.services.map((service) => (
              <View key={service.id}>
                <Pressable
                  style={[styles.serviceCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: selectedService?.id === service.id ? colors.primary : colors.border }]}
                  onPress={() => handleServicePress(service)}
                >
                  <View style={styles.serviceHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                      <Text style={[styles.serviceDesc, { color: colors.muted }]}>{service.description}</Text>
                    </View>
                    <View style={styles.servicePriceCol}>
                      {service.originalPrice ? (
                        <>
                          <View style={styles.discountRow}>
                            <Text style={[styles.serviceOldPrice, { color: colors.muted }]}>{service.originalPrice}</Text>
                            <View style={styles.discountPill}>
                              <Text style={styles.discountPillText}>-{service.discountPercent}%</Text>
                            </View>
                          </View>
                          <Text style={[styles.servicePrice, { color: "#22C55E" }]}>{service.price} ر.س</Text>
                        </>
                      ) : (
                        <Text style={[styles.servicePrice, { color: colors.primary }]}>{service.price} ر.س</Text>
                      )}
                      {service.duration > 0 && <Text style={[styles.serviceDuration, { color: colors.muted }]}>{service.duration} دقيقة</Text>}
                    </View>
                  </View>
                  <View style={styles.serviceFooter}>
                    <View style={[styles.categoryChip, { backgroundColor: colors.primary + "15" }]}>
                      <Text style={[styles.categoryText, { color: colors.primary }]}>{service.category}</Text>
                    </View>
                    <Feather name={selectedService?.id === service.id ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
                  </View>
                </Pressable>

                {selectedService?.id === service.id && (
                  <View style={[styles.serviceExpanded, { backgroundColor: isDark ? colors.surfaceAlt : "#F9F5FF", borderColor: colors.border }]}>
                    <View style={styles.datePickerSection}>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر التاريخ</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                        {days.map((day) => (
                          <Pressable
                            key={day.date}
                            style={[styles.dayChip, { backgroundColor: selectedDate === day.date ? colors.primary : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: selectedDate === day.date ? colors.primary : colors.border }]}
                            onPress={() => setSelectedDate(day.date)}
                          >
                            <Text style={[styles.dayNum, { color: selectedDate === day.date ? "#fff" : colors.text }]}>{day.label}</Text>
                            <Text style={[styles.dayName, { color: selectedDate === day.date ? "rgba(255,255,255,0.8)" : colors.muted }]}>{day.dayName}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>

                      <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر الوقت</Text>
                      <View style={styles.timeSlotsGrid}>
                        {TIME_SLOTS.map((time) => (
                          <Pressable
                            key={time}
                            style={[styles.timeSlot, { backgroundColor: selectedTime === time ? colors.primary : isDark ? colors.surfaceAlt : "#FDF6FA", borderColor: selectedTime === time ? colors.primary : colors.border }]}
                            onPress={() => setSelectedTime(time)}
                          >
                            <Text style={[styles.timeText, { color: selectedTime === time ? "#fff" : colors.text }]}>{time}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    {!isSpecialist && availableDoctors.length > 0 && (
                      <View style={{ marginTop: 14, marginBottom: 4 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>اختر المختص / الطبيب</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {availableDoctors.map((doc) => (
                            <Pressable
                              key={doc.id}
                              style={[
                                styles.doctorChip,
                                {
                                  backgroundColor: selectedDoctor?.id === doc.id ? colors.primary + "15" : isDark ? colors.surfaceAlt : "#FDF6FA",
                                  borderColor: selectedDoctor?.id === doc.id ? colors.primary : colors.border,
                                },
                              ]}
                              onPress={() => setSelectedDoctor(doc)}
                            >
                              <View style={[styles.docAvatar, { backgroundColor: colors.primary + "20" }]}>
                                <Text style={{ fontSize: 18 }}>👨‍⚕️</Text>
                              </View>
                              <Text style={[styles.docName, { color: selectedDoctor?.id === doc.id ? colors.primary : colors.text }]}>{doc.name}</Text>
                              <Text style={[styles.docSpec, { color: colors.muted }]}>{doc.specialty}</Text>
                              <View style={styles.docRating}>
                                <Text style={{ fontSize: 10 }}>⭐</Text>
                                <Text style={[styles.docRatingText, { color: "#F59E0B" }]}>{doc.rating}</Text>
                              </View>
                              {selectedDoctor?.id === doc.id && (
                                <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                                  <Feather name="check" size={10} color="#fff" />
                                </View>
                              )}
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {provider.supportsRemote && (
                      <View style={{ marginTop: 8, marginBottom: 4 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>طريقة الحجز</Text>
                        <View style={styles.methodsRow}>
                          {availableMethods.map((m) => (
                            <Pressable
                              key={m.key}
                              style={[
                                styles.methodCard,
                                {
                                  backgroundColor: bookingMethod === m.key ? colors.primary + "15" : isDark ? colors.surfaceAlt : "#FDF6FA",
                                  borderColor: bookingMethod === m.key ? colors.primary : colors.border,
                                  flex: 1,
                                },
                              ]}
                              onPress={() => setBookingMethod(m.key)}
                            >
                              <View style={[styles.methodIcon, { backgroundColor: bookingMethod === m.key ? colors.primary + "20" : colors.border + "50" }]}>
                                <Feather name={m.icon} size={18} color={bookingMethod === m.key ? colors.primary : colors.muted} />
                              </View>
                              <Text style={[styles.methodLabel, { color: bookingMethod === m.key ? colors.primary : colors.text }]}>{m.label}</Text>
                              <Text style={[styles.methodDesc, { color: colors.muted }]}>{m.desc}</Text>
                              {bookingMethod === m.key && (
                                <View style={[styles.checkCircle, { backgroundColor: colors.primary, position: "absolute", top: 8, left: 8 }]}>
                                  <Feather name="check" size={10} color="#fff" />
                                </View>
                              )}
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={[styles.expandedSummary, { borderTopColor: colors.border }]}>
                      <Text style={[styles.expandedTitle, { color: colors.text }]}>ملخص الحجز</Text>
                      <View style={styles.expandedMeta}>
                        <View style={styles.expandedRow}>
                          <Feather name="briefcase" size={14} color={colors.muted} />
                          <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>الخدمة: {service.name}</Text>
                        </View>
                        <View style={styles.expandedRow}>
                          <Feather name="calendar" size={14} color={colors.muted} />
                          <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>التاريخ: {selectedDate}</Text>
                        </View>
                        {selectedTime && (
                          <View style={styles.expandedRow}>
                            <Feather name="clock" size={14} color={colors.muted} />
                            <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>الوقت: {selectedTime}</Text>
                          </View>
                        )}
                        {(selectedDoctor || isSpecialist) && (
                          <View style={styles.expandedRow}>
                            <Feather name="user" size={14} color={colors.muted} />
                            <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>المختص: {isSpecialist ? provider.name : selectedDoctor?.name}</Text>
                          </View>
                        )}
                        <View style={styles.expandedRow}>
                          <Feather name={bookingMethod === "in-person" ? "map-pin" : bookingMethod === "video" ? "video" : "phone"} size={14} color={colors.muted} />
                          <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>
                            الطريقة: {BOOKING_METHODS.find((m) => m.key === bookingMethod)?.label}
                          </Text>
                        </View>
                        <View style={styles.expandedRow}>
                          <Feather name="dollar-sign" size={14} color={colors.muted} />
                          <Text style={[styles.expandedMetaText, { color: colors.textSecondary }]}>
                            السعر: {service.price} ر.س
                            {service.originalPrice ? ` (بدلاً من ${service.originalPrice} ر.س)` : ""}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Pressable style={[styles.addCartBtn, { backgroundColor: colors.primary }]} onPress={() => handleBookService(service)}>
                      <Feather name="shopping-cart" size={16} color="#fff" />
                      <Text style={styles.addCartBtnText}>إضافة إلى السلة</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === "reviews" && (
          <View style={styles.sectionPad}>
            {/* ملخص التقييم */}
            <View style={[styles.ratingOverviewCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
              <View style={styles.ratingOverviewLeft}>
                <Text style={[styles.ratingBigNum, { color: colors.text }]}>{avgRating}</Text>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map((s) => (
                    <Feather key={s} name="star" size={16} color={parseFloat(avgRating) >= s ? "#F59E0B" : (isDark ? colors.border : "#E5E7EB")} />
                  ))}
                </View>
                <Text style={[styles.ratingCountSm, { color: colors.muted }]}>{allReviews.length} تقييم</Text>
              </View>
              <View style={styles.ratingBarsCol}>
                {ratingDist.map(({ star, count, pct }) => (
                  <View key={star} style={styles.ratingBarRow}>
                    <Text style={[styles.ratingBarLabel, { color: colors.muted }]}>{star}</Text>
                    <Feather name="star" size={10} color="#F59E0B" />
                    <View style={[styles.ratingBarTrack, { backgroundColor: isDark ? colors.border : "#F3F4F6" }]}>
                      <View style={[styles.ratingBarFill, { width: `${pct}%` as any, backgroundColor: pct > 50 ? "#22C55E" : pct > 25 ? "#F59E0B" : "#EF4444" }]} />
                    </View>
                    <Text style={[styles.ratingBarCount, { color: colors.muted }]}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* زر إضافة تقييم */}
            <Pressable style={[styles.addReviewBtn, { backgroundColor: colors.primary }]} onPress={() => {
              setReviewService(provider.services[0]?.name ?? "الخدمة");
              setReviewRating(5);
              setReviewText("");
              setShowReviewModal(true);
            }}>
              <Feather name="edit-3" size={16} color="#fff" />
              <Text style={styles.addReviewBtnText}>أضف تقييمك</Text>
            </Pressable>

            {/* قائمة التقييمات */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>آراء المستخدمين</Text>
            {allReviews.map((rev, idx) => (
              <View key={idx} style={[styles.reviewItemCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <View style={styles.reviewItemHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.reviewItemTop}>
                      <Text style={[styles.reviewItemTime, { color: colors.muted }]}>{rev.time}</Text>
                      <Text style={[styles.reviewItemName, { color: colors.text }]}>{rev.name}</Text>
                      <View style={[styles.reviewItemAvatar, { backgroundColor: colors.primary + "20" }]}>
                        <Text style={[styles.reviewItemAvatarText, { color: colors.primary }]}>{rev.name.charAt(0)}</Text>
                      </View>
                    </View>
                    <View style={styles.reviewStarsRow}>
                      {[1,2,3,4,5].map((s) => (
                        <Feather key={s} name="star" size={13} color={s <= rev.rating ? "#F59E0B" : (isDark ? colors.border : "#E5E7EB")} />
                      ))}
                      <View style={[styles.reviewServiceTag, { backgroundColor: colors.primary + "15" }]}>
                        <Text style={[styles.reviewServiceTagText, { color: colors.primary }]}>{rev.service}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={[styles.reviewItemComment, { color: isDark ? colors.textSecondary : colors.text }]}>{rev.comment}</Text>
                <Pressable style={styles.helpfulBtn} onPress={() => {
                  if (!helpfulMarked.includes(idx)) setHelpfulMarked((prev) => [...prev, idx]);
                }}>
                  <Feather name="thumbs-up" size={13} color={helpfulMarked.includes(idx) ? colors.primary : colors.muted} />
                  <Text style={[styles.helpfulText, { color: helpfulMarked.includes(idx) ? colors.primary : colors.muted }]}>
                    مفيد ({rev.helpful + (helpfulMarked.includes(idx) ? 1 : 0)})
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {activeTab === "departments" && (
          <View style={styles.sectionPad}>
            {isSpecialist && provider.cases && provider.cases.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>الحالات التي أراها</Text>
                {provider.cases.map((caseName, idx) => (
                  <View key={idx} style={[styles.deptItem, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                    <View style={[styles.deptIcon, { backgroundColor: "#22C55E" + "15" }]}>
                      <Feather name="check-circle" size={16} color="#22C55E" />
                    </View>
                    <Text style={[styles.deptName, { color: colors.text }]}>{caseName}</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>الأقسام والتخصصات</Text>
                {provider.departments.map((dept, idx) => (
                  <View key={idx} style={[styles.deptItem, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                    <View style={[styles.deptIcon, { backgroundColor: colors.primary + "15" }]}>
                      <Feather name="grid" size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.deptName, { color: colors.text }]}>{dept}</Text>
                    <Feather name="chevron-left" size={16} color={colors.muted} />
                  </View>
                ))}

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>الفريق الطبي</Text>
                {provider.doctors.map((doc) => (
                  <View key={doc.id} style={[styles.doctorItem, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                    <View style={[styles.docAvatarLg, { backgroundColor: colors.primary + "15" }]}>
                      <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.docNameLg, { color: colors.text }]}>{doc.name}</Text>
                      <Text style={[styles.docSpecLg, { color: colors.textSecondary }]}>{doc.specialty}</Text>
                      <View style={styles.docMetaRow}>
                        <View style={styles.docRating}>
                          <Text style={{ fontSize: 11 }}>⭐</Text>
                          <Text style={[styles.docRatingText, { color: "#F59E0B" }]}>{doc.rating}</Text>
                        </View>
                        <View style={[styles.availPill, { backgroundColor: doc.available ? "#22C55E18" : "#EF444418" }]}>
                          <View style={[styles.statusDotSmall, { backgroundColor: doc.available ? "#22C55E" : "#EF4444" }]} />
                          <Text style={[styles.availPillText, { color: doc.available ? "#22C55E" : "#EF4444" }]}>
                            {doc.available ? "متاح" : "غير متاح"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {activeTab === "hours" && (
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>مواعيد العمل</Text>
            {provider.workingHours.map((wh, idx) => (
              <View key={idx} style={[styles.hoursRow, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <View style={styles.hoursLeft}>
                  <Feather name="clock" size={16} color={colors.primary} />
                  <Text style={[styles.hoursDay, { color: colors.text }]}>{wh.day}</Text>
                </View>
                <Text style={[styles.hoursTime, { color: colors.primary }]}>{wh.hours}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "branches" && (
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>الفروع</Text>
            {provider.branches.map((branch, idx) => (
              <View key={idx} style={[styles.branchCard, { backgroundColor: isDark ? colors.surface : "#fff", borderColor: colors.border }]}>
                <View style={[styles.branchIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Feather name="home" size={18} color={colors.primary} />
                </View>
                <Text style={[styles.branchName, { color: colors.text }]}>{branch.name}</Text>
                <View style={styles.branchDetail}>
                  <Feather name="map-pin" size={14} color={colors.muted} />
                  <Text style={[styles.branchText, { color: colors.textSecondary }]}>{branch.address}</Text>
                </View>
                <View style={styles.branchDetail}>
                  <Feather name="phone" size={14} color={colors.muted} />
                  <Text style={[styles.branchText, { color: colors.textSecondary }]}>{branch.phone}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <View style={[styles.floatingCartBar, { paddingBottom: isWeb ? 20 : insets.bottom + 10, backgroundColor: isDark ? colors.surface : "#fff", borderTopColor: colors.border }]}>
          <Pressable style={[styles.viewCartBtn, { backgroundColor: "#22C55E" }]} onPress={() => router.push("/cart" as any)}>
            <Feather name="shopping-cart" size={18} color="#fff" />
            <Text style={styles.viewCartBtnText}>عرض السلة ({cartCount} خدمة)</Text>
            <Text style={styles.cartTotal}>{cartItems.reduce((s, i) => s + i.price, 0)} ر.س</Text>
          </Pressable>
        </View>
      )}

      {/* ─── مودال التقييم ─── */}
      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowReviewModal(false)}>
                <Feather name="x" size={22} color={colors.muted} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>تقييمك يهمنا</Text>
            </View>
            <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* اختيار الخدمة */}
                <Text style={[styles.reviewFieldLabel, { color: colors.muted }]}>الخدمة التي حصلت عليها</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: "row-reverse", gap: 8 }}>
                    {provider.services.map((s) => (
                      <Pressable
                        key={s.id}
                        style={[styles.reviewServiceChip, {
                          backgroundColor: reviewService === s.name ? colors.primary : (isDark ? colors.surfaceAlt : "#F9F5FF"),
                          borderColor: reviewService === s.name ? colors.primary : colors.border
                        }]}
                        onPress={() => setReviewService(s.name)}
                      >
                        <Text style={[styles.reviewServiceChipText, { color: reviewService === s.name ? "#fff" : colors.text }]}>{s.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>

                {/* النجوم */}
                <Text style={[styles.reviewFieldLabel, { color: colors.muted }]}>تقييمك</Text>
                <View style={styles.starsPickerRow}>
                  {[1,2,3,4,5].map((star) => (
                    <Pressable key={star} onPress={() => setReviewRating(star)}>
                      <Feather name="star" size={38} color={star <= reviewRating ? "#F59E0B" : (isDark ? colors.border : "#E5E7EB")} />
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.ratingLabelText, { color: "#F59E0B" }]}>{RATING_LABELS[reviewRating]}</Text>

                {/* الملاحظات */}
                <Text style={[styles.reviewFieldLabel, { color: colors.muted, marginTop: 12 }]}>ملاحظاتك (اختياري)</Text>
                <TextInput
                  style={[styles.reviewTextInput, { backgroundColor: isDark ? colors.surfaceAlt : "#F9F5FF", borderColor: colors.border, color: colors.text }]}
                  multiline
                  numberOfLines={4}
                  placeholder="شارك تجربتك مع الآخرين..."
                  placeholderTextColor={colors.muted}
                  value={reviewText}
                  onChangeText={setReviewText}
                  textAlign="right"
                />

                <Pressable style={[styles.confirmBtn, { backgroundColor: colors.primary, marginTop: 8 }]} onPress={() => {
                  if (!reviewService) { Alert.alert("اختر الخدمة", "يرجى اختيار الخدمة التي حصلت عليها"); return; }
                  setUserReviews((prev) => [...prev, {
                    name: "أنت",
                    rating: reviewRating,
                    comment: reviewText.trim() || RATING_LABELS[reviewRating],
                    service: reviewService,
                    time: "الآن",
                    helpful: 0,
                  }]);
                  setShowReviewModal(false);
                  setReviewText("");
                  Alert.alert("شكراً ✓", "تم إرسال تقييمك بنجاح. رأيك يساعد الآخرين على اتخاذ القرار الصحيح.");
                }}>
                  <Feather name="check-circle" size={18} color="#fff" />
                  <Text style={styles.confirmBtnText}>إرسال التقييم</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>تأكيد الحجز</Text>
              <Pressable onPress={() => setShowBookingModal(false)}>
                <Feather name="x" size={22} color={colors.muted} />
              </Pressable>
            </View>

            {selectedService && (
              <View style={styles.modalBody}>
                <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>الخدمة</Text>
                  <Text style={[styles.confirmValue, { color: colors.text }]}>{selectedService.name}</Text>
                </View>
                <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>المزود</Text>
                  <Text style={[styles.confirmValue, { color: colors.text }]}>{provider.name}</Text>
                </View>
                <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>التاريخ</Text>
                  <Text style={[styles.confirmValue, { color: colors.text }]}>{selectedDate}</Text>
                </View>
                <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>الوقت</Text>
                  <Text style={[styles.confirmValue, { color: colors.text }]}>{selectedTime}</Text>
                </View>
                {(selectedDoctor || isSpecialist) && (
                  <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                    <Text style={[styles.confirmLabel, { color: colors.muted }]}>المختص</Text>
                    <Text style={[styles.confirmValue, { color: colors.text }]}>{isSpecialist ? provider.name : selectedDoctor?.name}</Text>
                  </View>
                )}
                <View style={[styles.confirmRow, { borderColor: colors.border }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>الطريقة</Text>
                  <Text style={[styles.confirmValue, { color: colors.text }]}>{BOOKING_METHODS.find((m) => m.key === bookingMethod)?.label}</Text>
                </View>
                <View style={[styles.confirmRow, { borderColor: colors.border, borderBottomWidth: 0 }]}>
                  <Text style={[styles.confirmLabel, { color: colors.muted }]}>السعر</Text>
                  <Text style={[styles.confirmValue, { color: "#22C55E", fontSize: 18 }]}>{selectedService.price} ر.س</Text>
                </View>

                <View style={[styles.policyNote, { backgroundColor: "#F59E0B15" }]}>
                  <Feather name="alert-circle" size={14} color="#F59E0B" />
                  <Text style={[styles.policyNoteText, { color: "#F59E0B" }]}>
                    يرجى مراجعة سياسة الإلغاء قبل التأكيد
                  </Text>
                </View>

                <Pressable style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={confirmBooking}>
                  <Feather name="check-circle" size={18} color="#fff" />
                  <Text style={styles.confirmBtnText}>تأكيد وإضافة للسلة</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showPolicyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.surface : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>سياسة الإلغاء والاسترداد</Text>
              <Pressable onPress={() => setShowPolicyModal(false)}>
                <Feather name="x" size={22} color={colors.muted} />
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={[styles.policyBox, { backgroundColor: isDark ? colors.surfaceAlt : "#FDF6FA" }]}>
                <Feather name="shield" size={24} color={colors.primary} />
                <Text style={[styles.policyText, { color: colors.textSecondary }]}>{provider.cancellationPolicy}</Text>
              </View>
              <Pressable style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={() => setShowPolicyModal(false)}>
                <Text style={styles.confirmBtnText}>فهمت</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { height: 260, position: "relative" },
  imgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)", zIndex: 1, pointerEvents: "none" },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row-reverse", justifyContent: "space-between", paddingHorizontal: 16, zIndex: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  cartBadge: { position: "absolute", top: -4, right: -4, backgroundColor: "#F43F5E", width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },
  statusBadgeTop: { position: "absolute", bottom: 16, left: 16, flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, zIndex: 10 },
  statusDotSmall: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: "#fff", fontSize: 13, fontFamily: "Tajawal_700Bold" },
  imageDots: { position: "absolute", bottom: 16, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6, zIndex: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  infoSection: { padding: 20, gap: 12 },
  nameRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "flex-start" },
  providerName: { fontSize: 22, fontFamily: "Cairo_700Bold", textAlign: "right", flex: 1 },
  ratingBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 4, backgroundColor: "#F59E0B15", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  ratingNum: { fontSize: 14, fontFamily: "Tajawal_700Bold", color: "#F59E0B" },
  reviewCount: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  longDesc: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "right", lineHeight: 22 },
  quickInfo: { gap: 8 },
  quickItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12 },
  quickText: { fontSize: 13, fontFamily: "Tajawal_400Regular", flex: 1, textAlign: "right" },
  tabsScroll: { marginBottom: 8 },
  tabsScrollContent: { paddingHorizontal: 20, flexDirection: "row-reverse" },
  tab: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabText: { fontSize: 15, fontFamily: "Tajawal_700Bold" },
  sectionPad: { paddingHorizontal: 20, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontFamily: "Cairo_700Bold", textAlign: "right", marginBottom: 12 },
  datePickerSection: { marginBottom: 8 },
  dayChip: { width: 64, alignItems: "center", paddingVertical: 10, borderRadius: 14, marginLeft: 8, borderWidth: 1 },
  dayNum: { fontSize: 18, fontFamily: "Tajawal_700Bold" },
  dayName: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  timeSlotsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  timeSlot: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  timeText: { fontSize: 13, fontFamily: "Tajawal_500Medium" },
  doctorChip: { width: 120, alignItems: "center", padding: 12, borderRadius: 16, marginLeft: 10, borderWidth: 1.5, gap: 4, position: "relative" },
  docAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  docName: { fontSize: 12, fontFamily: "Tajawal_700Bold", textAlign: "center" },
  docSpec: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  docRating: { flexDirection: "row-reverse", alignItems: "center", gap: 3 },
  docRatingText: { fontSize: 12, fontFamily: "Tajawal_700Bold" },
  checkCircle: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", position: "absolute", top: 6, left: 6 },
  methodsRow: { flexDirection: "row-reverse", gap: 10 },
  methodCard: { alignItems: "center", padding: 14, borderRadius: 16, borderWidth: 1.5, gap: 6, position: "relative" },
  methodIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  methodLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold" },
  methodDesc: { fontSize: 10, fontFamily: "Tajawal_400Regular", textAlign: "center" },
  serviceCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10, gap: 8 },
  serviceHeader: { flexDirection: "row-reverse", justifyContent: "space-between", gap: 12 },
  serviceName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  serviceDesc: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 3 },
  servicePriceCol: { alignItems: "flex-start" },
  discountRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  serviceOldPrice: { fontSize: 12, fontFamily: "Tajawal_400Regular", textDecorationLine: "line-through" },
  discountPill: { backgroundColor: "#F43F5E", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  discountPillText: { color: "#fff", fontSize: 10, fontFamily: "Tajawal_700Bold" },
  servicePrice: { fontSize: 16, fontFamily: "Tajawal_700Bold" },
  serviceDuration: { fontSize: 11, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  serviceFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  categoryChip: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  categoryText: { fontSize: 11, fontFamily: "Tajawal_500Medium" },
  serviceExpanded: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10, marginTop: -6, gap: 12, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  expandedSummary: { borderTopWidth: 1, paddingTop: 14, marginTop: 4, gap: 8 },
  expandedTitle: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  expandedMeta: { gap: 8 },
  expandedRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  expandedMetaText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  addCartBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  addCartBtnText: { color: "#fff", fontSize: 15, fontFamily: "Tajawal_700Bold" },
  deptItem: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  deptIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  deptName: { fontSize: 15, fontFamily: "Tajawal_700Bold", flex: 1, textAlign: "right" },
  doctorItem: { flexDirection: "row-reverse", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  docAvatarLg: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  docNameLg: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  docSpecLg: { fontSize: 12, fontFamily: "Tajawal_400Regular", textAlign: "right", marginTop: 2 },
  docMetaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginTop: 6 },
  availPill: { flexDirection: "row-reverse", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  availPillText: { fontSize: 11, fontFamily: "Tajawal_700Bold" },
  hoursRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  hoursLeft: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  hoursDay: { fontSize: 14, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  hoursTime: { fontSize: 14, fontFamily: "Tajawal_500Medium" },
  branchCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 10, gap: 10 },
  branchIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  branchName: { fontSize: 15, fontFamily: "Tajawal_700Bold", textAlign: "right" },
  branchDetail: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  branchText: { fontSize: 13, fontFamily: "Tajawal_400Regular", textAlign: "right" },
  floatingCartBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  viewCartBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16 },
  viewCartBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  cartTotal: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontFamily: "Tajawal_500Medium", marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "80%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
  modalTitle: { fontSize: 18, fontFamily: "Cairo_700Bold" },
  modalBody: { padding: 20, gap: 12 },
  confirmRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
  confirmLabel: { fontSize: 13, fontFamily: "Tajawal_400Regular" },
  confirmValue: { fontSize: 14, fontFamily: "Tajawal_700Bold" },
  policyNote: { flexDirection: "row-reverse", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, marginTop: 4 },
  policyNoteText: { fontSize: 12, fontFamily: "Tajawal_500Medium", flex: 1, textAlign: "right" },
  confirmBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, marginTop: 8 },
  confirmBtnText: { color: "#fff", fontSize: 16, fontFamily: "Tajawal_700Bold" },
  policyBox: { padding: 20, borderRadius: 16, alignItems: "center", gap: 12 },
  policyText: { fontSize: 14, fontFamily: "Tajawal_400Regular", textAlign: "center", lineHeight: 24 },
  ratingOverviewCard: { flexDirection: "row-reverse", gap: 16, borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 16, alignItems: "center" },
  ratingOverviewLeft: { alignItems: "center", gap: 4, minWidth: 80 },
  ratingBigNum: { fontSize: 44, fontFamily: "Cairo_700Bold", lineHeight: 50 },
  starsRow: { flexDirection: "row-reverse", gap: 3 },
  ratingCountSm: { fontSize: 12, fontFamily: "Tajawal_400Regular", marginTop: 2 },
  ratingBarsCol: { flex: 1, gap: 6 },
  ratingBarRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  ratingBarLabel: { fontSize: 12, fontFamily: "Tajawal_700Bold", width: 14, textAlign: "center" },
  ratingBarTrack: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  ratingBarFill: { height: "100%", borderRadius: 4 },
  ratingBarCount: { fontSize: 11, fontFamily: "Tajawal_400Regular", width: 18, textAlign: "left" },
  addReviewBtn: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 16, marginBottom: 4 },
  addReviewBtnText: { fontSize: 15, fontFamily: "Tajawal_700Bold", color: "#fff" },
  reviewItemCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 10, gap: 8 },
  reviewItemHeader: { flexDirection: "row-reverse", gap: 10 },
  reviewItemTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginBottom: 6 },
  reviewItemAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewItemAvatarText: { fontSize: 14, fontFamily: "Cairo_700Bold" },
  reviewItemName: { flex: 1, fontSize: 14, fontFamily: "Tajawal_700Bold" },
  reviewItemTime: { fontSize: 11, fontFamily: "Tajawal_400Regular" },
  reviewStarsRow: { flexDirection: "row-reverse", alignItems: "center", gap: 4, flexWrap: "wrap" },
  reviewServiceTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
  reviewServiceTagText: { fontSize: 10, fontFamily: "Tajawal_700Bold" },
  reviewItemComment: { fontSize: 13, fontFamily: "Tajawal_400Regular", lineHeight: 20, textAlign: "right" },
  helpfulBtn: { flexDirection: "row-reverse", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  helpfulText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  reviewFieldLabel: { fontSize: 13, fontFamily: "Tajawal_700Bold", marginBottom: 8, textAlign: "right" },
  reviewServiceChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  reviewServiceChipText: { fontSize: 12, fontFamily: "Tajawal_500Medium" },
  starsPickerRow: { flexDirection: "row-reverse", justifyContent: "center", gap: 10, marginBottom: 6 },
  ratingLabelText: { fontSize: 16, fontFamily: "Cairo_700Bold", textAlign: "center", marginBottom: 4 },
  reviewTextInput: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 14, fontFamily: "Tajawal_400Regular", minHeight: 100, textAlignVertical: "top" },
});
