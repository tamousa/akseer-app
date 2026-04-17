import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function BeautyMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="صالون لمسة الجمال"
      businessTypeAr="صالون تجميل وعناية  ·  الرياض"
      businessEmoji="💅"
      stats={[
        { labelAr: "الحجوزات", value: "220" },
        { labelAr: "العميلات", value: "118" },
        { labelAr: "التقييم",  value: "4.8 ★" },
      ]}
      sections={[
        {
          titleAr: "إدارة الصالون",
          items: [
            { labelAr: "الموظفون والفنيون",         icon: "users",   route: "/business-beauty/staff" },
            { labelAr: "معرض الأعمال والصور",        icon: "image",   route: "/business-beauty/gallery" },
            { labelAr: "الخدمات والأسعار",           icon: "scissors", route: "/business-beauty/services" },
            { labelAr: "العروض والباقات",             icon: "tag",     route: "/business-beauty/offers" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",           icon: "bar-chart-2", route: null },
            { labelAr: "معاينة الصالون للعميلات",    icon: "eye",    route: "/business-beauty/beauty-preview" },
          ],
        },
      ]}
    />
  );
}
