import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function LabMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="مختبر الدقة الطبي"
      businessTypeAr="مختبر وفحوصات طبية  ·  الرياض"
      businessEmoji="🔬"
      stats={[
        { labelAr: "الفحوصات", value: "530" },
        { labelAr: "المرضى",   value: "210" },
        { labelAr: "التقييم",  value: "4.7 ★" },
      ]}
      sections={[
        {
          titleAr: "إدارة المختبر",
          items: [
            { labelAr: "موظفو المختبر",            icon: "users",     route: "/business-lab/lab-staff" },
            { labelAr: "كتالوج الفحوصات",          icon: "list",      route: "/business-lab/catalog" },
            { labelAr: "الزيارات المنزلية",         icon: "home",      route: "/business-lab/home-visits" },
            { labelAr: "العروض والباقات",            icon: "tag",      route: "/business-lab/offers" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",          icon: "bar-chart-2", route: "/business-lab/reports" },
            { labelAr: "التقييمات",                 icon: "message-square", route: "/business-lab/reviews" },
            { labelAr: "معاينة المختبر للمرضى",     icon: "eye",      route: "/business-lab/lab-preview" },
          ],
        },
      ]}
    />
  );
}
