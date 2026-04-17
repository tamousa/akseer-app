import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function SpaMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="سبا النقاء الملكي"
      businessTypeAr="سبا ومساج  ·  الرياض"
      businessEmoji="💆"
      stats={[
        { labelAr: "الحجوزات", value: "184" },
        { labelAr: "العملاء",  value: "97" },
        { labelAr: "التقييم",  value: "4.9 ★" },
      ]}
      sections={[
        {
          titleAr: "إدارة المركز",
          items: [
            { labelAr: "الموظفون والمعالجون",      icon: "users",    route: "/business-spa/staff" },
            { labelAr: "الغرف والطاقة الاستيعابية", icon: "home",    route: "/business-spa/rooms" },
            { labelAr: "الخدمات والأسعار",          icon: "list",    route: "/business-spa/services" },
            { labelAr: "العروض والباقات",            icon: "tag",    route: "/business-spa/offers" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",          icon: "bar-chart-2", route: null },
            { labelAr: "معاينة المركز للعملاء",     icon: "eye",    route: "/business-spa/spa-preview" },
          ],
        },
      ]}
    />
  );
}
