import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function CuppingMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="مركز السنة للحجامة"
      businessTypeAr="حجامة وطب نبوي  ·  المدينة"
      businessEmoji="🩸"
      stats={[
        { labelAr: "الجلسات",  value: "156" },
        { labelAr: "المرضى",   value: "74" },
        { labelAr: "التقييم",  value: "5.0 ★" },
      ]}
      sections={[
        {
          titleAr: "إدارة المركز",
          items: [
            { labelAr: "الموظفون والمعالجون",   icon: "users",   route: "/business-cupping/staff" },
            { labelAr: "العروض والباقات",        icon: "tag",     route: "/business-cupping/offers" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",       icon: "bar-chart-2", route: null },
            { labelAr: "معاينة المركز للمرضى",   icon: "eye",    route: "/business-cupping/cupping-preview" },
          ],
        },
      ]}
    />
  );
}
