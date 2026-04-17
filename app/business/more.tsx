import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function BusinessStoreMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="متجر الصحة النقية"
      businessTypeAr="متجر صحي وجمالي  ·  الرياض"
      businessEmoji="🏪"
      stats={[
        { labelAr: "المنتجات", value: "24" },
        { labelAr: "الطلبات",  value: "148" },
        { labelAr: "العملاء",  value: "128" },
      ]}
      sections={[
        {
          titleAr: "إدارة المتجر",
          items: [
            { labelAr: "الموظفون",               icon: "users",       route: "/business/staff" },
            { labelAr: "المخزون والمنتجات",       icon: "package",     route: "/business/inventory" },
            { labelAr: "العروض والباقات",          icon: "tag",         route: "/business/offers" },
            { labelAr: "الشحن والتوصيل",           icon: "truck",       route: "/business/shipping" },
            { labelAr: "نقطة البيع (POS)",         icon: "monitor",     route: "/business/pos" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",         icon: "bar-chart-2", route: "/business/reports" },
            { labelAr: "تقييمات المنتجات",          icon: "star",        route: "/business/reviews" },
            { labelAr: "معاينة المتجر للعملاء",    icon: "eye",         route: "/business/store-preview" },
          ],
        },
      ]}
    />
  );
}
