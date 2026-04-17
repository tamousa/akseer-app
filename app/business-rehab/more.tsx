import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function RehabMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="مركز الأمل للعلاج الطبيعي"
      businessTypeAr="علاج طبيعي وتأهيل  ·  جدة"
      businessEmoji="🦾"
      stats={[
        { labelAr: "الجلسات",  value: "312" },
        { labelAr: "المرضى",   value: "89" },
        { labelAr: "التقييم",  value: "4.8 ★" },
      ]}
      sections={[
        {
          titleAr: "إدارة المركز",
          items: [
            { labelAr: "الفريق الطبي والمعالجون", icon: "users",       route: "/business-rehab/staff" },
            { labelAr: "خطط العلاج",              icon: "clipboard",   route: "/business-rehab/treatment-plans" },
            { labelAr: "العروض والباقات",          icon: "tag",         route: "/business-rehab/offers" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",         icon: "bar-chart-2", route: null },
            { labelAr: "مطالبات التأمين",          icon: "shield",      route: null },
            { labelAr: "معاينة المركز للمرضى",     icon: "eye",         route: "/business-rehab/rehab-preview" },
          ],
        },
      ]}
    />
  );
}
