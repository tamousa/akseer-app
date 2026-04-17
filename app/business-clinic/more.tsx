import BusinessMoreScreen from "@/components/BusinessMoreScreen";
import { I18nManager } from "react-native";
I18nManager.forceRTL(true);

export default function ClinicMore() {
  return (
    <BusinessMoreScreen
      businessNameAr="عيادة الشفاء المتخصصة"
      businessTypeAr="عيادة طبية  ·  الرياض"
      businessEmoji="🏥"
      stats={[
        { labelAr: "المواعيد", value: "248" },
        { labelAr: "المرضى",  value: "132" },
        { labelAr: "التقييم", value: "4.9 ★" },
      ]}
      sections={[
        {
          titleAr: "الإدارة الطبية",
          items: [
            { labelAr: "الكادر الطبي والموظفون",      icon: "users",       route: "/business-clinic/medical-staff" },
            { labelAr: "الخدمة المنزلية",             icon: "home",        route: "/business-clinic/home-visits" },
            { labelAr: "مواعيد العمل والفروع",         icon: "clock",       route: "/business-clinic/schedule" },
            { labelAr: "الخدمات الطبية والأسعار",      icon: "list",        route: "/business-clinic/services" },
            { labelAr: "الباقات والعروض",              icon: "tag",         route: "/business-clinic/packages" },
          ],
        },
        {
          titleAr: "التقارير والمراجعات",
          items: [
            { labelAr: "التقارير المالية",             icon: "bar-chart-2", route: "/business-clinic/reports" },
            { labelAr: "الفواتير الطبية",              icon: "file-text",   route: "/business-clinic/invoices" },
            { labelAr: "التقييمات والأسئلة",           icon: "message-square", route: "/business-clinic/reviews" },
            { labelAr: "معاينة العيادة للمرضى",        icon: "eye",         route: "/business-clinic/clinic-preview" },
          ],
        },
      ]}
    />
  );
}
