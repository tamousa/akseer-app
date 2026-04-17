import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert, Animated, I18nManager, Image, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

I18nManager.forceRTL(true);
const isWeb = Platform.OS === "web";
const PREG_ART = require("@/assets/images/womens-pregnancy-art.png");

/* ─── Constants ──────────────────────────────────────────────── */
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const DAYS_AR   = ["أح","إث","ثل","أر","خم","جم","سب"];

function daysInMonth(y:number,m:number){return new Date(y,m+1,0).getDate();}
function firstDayOfMonth(y:number,m:number){return(new Date(y,m,1).getDay()+6)%7;}
function toDateStr(y:number,m:number,d:number){return`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function formatDateAr(iso:string){const d=new Date(iso);return`${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;}

const FRUIT_SIZES: Record<number,{name:string;emoji:string;size:string;weight:string}> = {
  4:{name:"حبة خشخاش",emoji:"🌱",size:"0.4 مم",weight:"أقل من 1 غ"},
  6:{name:"بازلاء",emoji:"🫛",size:"0.6 سم",weight:"1 غ"},
  8:{name:"توت",emoji:"🫐",size:"1.6 سم",weight:"1 غ"},
  10:{name:"تمرة",emoji:"🌰",size:"3.1 سم",weight:"4 غ"},
  12:{name:"ليمونة",emoji:"🍋",size:"5.4 سم",weight:"14 غ"},
  14:{name:"كيوي",emoji:"🥝",size:"8.7 سم",weight:"43 غ"},
  16:{name:"أفوكادو",emoji:"🥑",size:"11.6 سم",weight:"100 غ"},
  18:{name:"فلفل رومي",emoji:"🫑",size:"14.2 سم",weight:"190 غ"},
  20:{name:"موزة",emoji:"🍌",size:"25.6 سم",weight:"300 غ"},
  22:{name:"مانجو",emoji:"🥭",size:"27.8 سم",weight:"430 غ"},
  24:{name:"ذرة",emoji:"🌽",size:"30 سم",weight:"600 غ"},
  26:{name:"خيارة",emoji:"🥒",size:"35.6 سم",weight:"760 غ"},
  28:{name:"باذنجانة",emoji:"🍆",size:"37.6 سم",weight:"1 كغ"},
  30:{name:"ملفوف",emoji:"🥬",size:"39.9 سم",weight:"1.3 كغ"},
  32:{name:"جوزة الهند",emoji:"🥥",size:"42.4 سم",weight:"1.7 كغ"},
  34:{name:"قرع",emoji:"🎃",size:"45 سم",weight:"2.1 كغ"},
  36:{name:"رأس خس",emoji:"🥗",size:"47.4 سم",weight:"2.6 كغ"},
  38:{name:"كراث",emoji:"🌿",size:"49.8 سم",weight:"3.1 كغ"},
  40:{name:"بطيخة صغيرة",emoji:"🍉",size:"51.2 سم",weight:"3.5 كغ"},
};
function getFruit(week:number){
  const keys=Object.keys(FRUIT_SIZES).map(Number).sort((a,b)=>a-b);
  let best=keys[0];
  for(const k of keys){if(week>=k)best=k;else break;}
  return FRUIT_SIZES[best]??{name:"بذرة",emoji:"🌱",size:"صغير",weight:"—"};
}

/* Weight gain guidelines (kg) — WHO */
const WEIGHT_GUIDE:{[bmi:string]:{low:number;high:number;label:string;color:string}}={
  underweight:{low:12.5,high:18,label:"أقل من الطبيعي",color:"#3B82F6"},
  normal:{low:11.5,high:16,label:"وزن طبيعي",color:"#10B981"},
  overweight:{low:7,high:11.5,label:"زائد الوزن",color:"#F59E0B"},
  obese:{low:5,high:9,label:"بدانة",color:"#EF4444"},
};
function getBMICategory(bmi:number){
  if(bmi<18.5)return"underweight";
  if(bmi<25)return"normal";
  if(bmi<30)return"overweight";
  return"obese";
}

const WEEKLY_TIPS: Record<number,{baby:string;mom:string}> = {
  4:{baby:"تتشكل الخلايا الأولى للقلب والدماغ",mom:"قد تشعرين بإرهاق وغثيان خفيف"},
  8:{baby:"الجنين يحرك أطرافه للمرة الأولى!",mom:"الغثيان الصباحي في ذروته — تناولي بسكويت الزنجبيل"},
  12:{baby:"أصابع الجنين الكاملة تتكون وله بصمات!",mom:"خطر الإجهاض ينخفض بشكل كبير بعد الأسبوع 12"},
  16:{baby:"الجنين يسمع صوتك لأول مرة 🎵",mom:"قد تشعرين بأول حركة كفراشة"},
  20:{baby:"نصف الرحلة! الجنين يرمش ويبتلع السائل",mom:"فحص المورفولوجيا (الموجات) — لا تفوتيه!"},
  24:{baby:"الرئتان تتطوران سريعاً",mom:"فحص سكري الحمل في هذه الفترة"},
  28:{baby:"الجنين يفتح عينيه لأول مرة!",mom:"قد تشعرين بحركات ورفسات قوية"},
  32:{baby:"الجنين يمرن التنفس بالسائل الأمنيوسي",mom:"النوم على الجانب الأيسر يُحسّن الدورة الدموية"},
  36:{baby:"رأس الجنين يتجه للأسفل استعداداً للولادة",mom:"الزيارات الطبية كل أسبوع الآن"},
  40:{baby:"الجنين جاهز تماماً! موعد اللقاء قريب 🎉",mom:"الولادة قد تكون في أي لحظة — كوني مستعدة!"},
};
function getWeeklyTip(week:number){
  const keys=Object.keys(WEEKLY_TIPS).map(Number).sort((a,b)=>a-b);
  let best=keys[0];
  for(const k of keys){if(week>=k)best=k;else break;}
  return WEEKLY_TIPS[best]??{baby:"الجنين ينمو بشكل جيد",mom:"استمري في متابعة حملك"};
}

const TRIMESTER_NUTRIENTS = {
  1:["حمض الفوليك 🥦","حديد 🥩","فيتامين B6 🐔","فيتامين D ☀️","ماء 💧"],
  2:["كالسيوم 🥛","أوميغا3 🐟","بروتين 🥚","مغنيسيوم 🌰","حديد 🥩"],
  3:["فيتامين K 🥬","DHA 🐟","كالسيوم 🥛","حديد 🥩","زنك 🦪"],
};

const BAG_CATEGORIES = ["للأم","للطفل","للأب/المرافق"];
const BAG_ICONS: Record<string,string> = {"للأم":"👩","للطفل":"👶","للأب/المرافق":"💪"};

const BLOG_POSTS = [
  {title:"تغذية الأم في الثلث الأول",emoji:"🥗",tag:"تغذية",desc:"ما يجب تناوله وتجنبه في الأسابيع الأولى"},
  {title:"تمارين آمنة للحامل",emoji:"🧘",tag:"رياضة",desc:"يوغا الحمل والمشي — فوائد وتحذيرات"},
  {title:"متى تذهبين لغرفة الطوارئ؟",emoji:"🏥",tag:"أمان",desc:"علامات التحذير التي لا تتجاهليها"},
  {title:"الرضاعة الطبيعية — دليل شامل",emoji:"🍼",tag:"ما بعد الولادة",desc:"كيف تبدئين رضاعة صحية من أول يوم"},
  {title:"تحضير غرفة الطفل",emoji:"🛋️",tag:"تجهيزات",desc:"كل ما تحتاجينه قبل وصول المولود"},
];

/* ─── DatePicker Component ───────────────────────────────────── */
function DatePicker({value,onSelect,title,maxDate="today"}:{value:string;onSelect:(d:string)=>void;title:string;maxDate?:"today"|"future"|"any"}){
  const{isDark}=useTheme();
  const colors=isDark?Colors.dark:Colors.light;
  const[open,setOpen]=useState(false);
  const today=new Date();
  const initY=value?parseInt(value.split("-")[0]):today.getFullYear();
  const initM=value?parseInt(value.split("-")[1])-1:today.getMonth();
  const[pY,setPY]=useState(initY);
  const[pM,setPM]=useState(initM);
  const display=value?formatDateAr(value):"اختاري التاريخ";
  const totalDays=daysInMonth(pY,pM);
  const firstDay=firstDayOfMonth(pY,pM);
  const cells:(number|null)[]=[...Array(firstDay).fill(null),...Array.from({length:totalDays},(_,i)=>i+1)];
  const modalBg=isDark?colors.surface:"#FFFFFF";
  return(
    <>
      <View style={{gap:6}}>
        <Text style={{fontSize:12,fontFamily:"Tajawal_700Bold",color:colors.muted,textAlign:"right"}}>{title}</Text>
        <Pressable onPress={()=>setOpen(true)} style={{borderWidth:1,borderRadius:14,paddingHorizontal:14,paddingVertical:13,borderColor:value?"#A86DBF":colors.border,backgroundColor:isDark?colors.surfaceAlt:"#F8F0F5",flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between"}}>
          <Text style={{fontSize:13,fontFamily:"Tajawal_500Medium",color:value?colors.text:colors.muted}}>{display}</Text>
          <Feather name="calendar" size={16} color="#A86DBF"/>
        </Pressable>
      </View>
      <Modal visible={open} transparent animationType="fade" onRequestClose={()=>setOpen(false)}>
        <Pressable style={{flex:1,backgroundColor:"rgba(0,0,0,0.55)",justifyContent:"center",alignItems:"center"}} onPress={()=>setOpen(false)}>
          <Pressable onPress={e=>e.stopPropagation()} style={{backgroundColor:modalBg,borderRadius:24,padding:20,width:"88%",maxWidth:360,gap:12}}>
            <Text style={{fontSize:15,fontFamily:"Cairo_700Bold",color:colors.text,textAlign:"center"}}>{title}</Text>
            <View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center"}}>
              <Pressable onPress={()=>{if(pM===0){setPM(11);setPY(y=>y-1);}else setPM(m=>m-1);}}><Feather name="chevron-right" size={22} color={colors.text}/></Pressable>
              <Text style={{fontSize:14,fontFamily:"Cairo_700Bold",color:colors.text}}>{MONTHS_AR[pM]} {pY}</Text>
              <Pressable onPress={()=>{if(pM===11){setPM(0);setPY(y=>y+1);}else setPM(m=>m+1);}}><Feather name="chevron-left" size={22} color={colors.text}/></Pressable>
            </View>
            <View style={{flexDirection:"row-reverse"}}>
              {DAYS_AR.map(d=><Text key={d} style={{flex:1,textAlign:"center",fontSize:10,fontFamily:"Tajawal_500Medium",color:colors.muted}}>{d}</Text>)}
            </View>
            <View style={{flexDirection:"row-reverse",flexWrap:"wrap"}}>
              {cells.map((cell,idx)=>{
                if(!cell)return<View key={idx} style={{width:"14.28%",aspectRatio:1}}/>;
                const ds=toDateStr(pY,pM,cell);
                const isSel=ds===value;
                const isFut=maxDate==="today"&&new Date(pY,pM,cell)>today;
                return(
                  <Pressable key={idx} onPress={()=>{if(!isFut){onSelect(ds);setOpen(false);}}}
                    style={{width:"14.28%",aspectRatio:1,alignItems:"center",justifyContent:"center",backgroundColor:isSel?"#A86DBF":"transparent",borderRadius:10,opacity:isFut?0.3:1}}>
                    <Text style={{fontSize:13,fontFamily:isSel?"Cairo_700Bold":"Tajawal_400Regular",color:isSel?"#fff":colors.text}}>{cell}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={()=>setOpen(false)} style={{backgroundColor:"#A86DBF",borderRadius:14,padding:12,alignItems:"center"}}>
              <Text style={{color:"#fff",fontSize:13,fontFamily:"Tajawal_700Bold"}}>تأكيد</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* ─── Weight mini chart ──────────────────────────────────────── */
function WeightChart({logs,guide}:{logs:{date:string;weight:number}[];guide:{low:number;high:number};baseWeight:number}){
  const{isDark}=useTheme();
  const colors=isDark?Colors.dark:Colors.light;
  if(logs.length<2)return(
    <Text style={{fontSize:12,fontFamily:"Tajawal_400Regular",color:colors.muted,textAlign:"center",paddingVertical:12}}>
      سجّلي وزنك مرتين على الأقل لرؤية المنحنى
    </Text>
  );
  const weights=logs.map(l=>l.weight);
  const minW=Math.min(...weights)-2;
  const maxW=Math.max(...weights)+2;
  const range=maxW-minW||1;
  const CHART_H=100;
  const CHART_W=280;
  const step=CHART_W/(logs.length-1);
  const pts=logs.map((l,i)=>({x:i*step,y:CHART_H-(((l.weight-minW)/range)*CHART_H)}));
  return(
    <View style={{height:CHART_H+30,position:"relative",marginTop:8}}>
      <View style={{position:"absolute",top:0,left:0,width:CHART_W,height:CHART_H,borderWidth:1,borderColor:colors.border,borderRadius:8,overflow:"hidden"}}>
        {pts.map((p,i)=>{
          if(i===0)return null;
          const prev=pts[i-1];
          const dx=p.x-prev.x,dy=p.y-prev.y;
          const len=Math.sqrt(dx*dx+dy*dy);
          const ang=Math.atan2(dy,dx)*180/Math.PI;
          return(
            <View key={i} style={{position:"absolute",left:prev.x,top:prev.y,width:len,height:2,backgroundColor:"#A86DBF",transformOrigin:"left center",transform:[{rotate:`${ang}deg`}]}}/>
          );
        })}
        {pts.map((p,i)=>(
          <View key={i} style={{position:"absolute",left:p.x-4,top:p.y-4,width:8,height:8,borderRadius:4,backgroundColor:"#A86DBF",borderWidth:2,borderColor:"#fff"}}/>
        ))}
      </View>
      {logs.map((l,i)=>(
        <Text key={i} style={{position:"absolute",left:i*(CHART_W/(logs.length-1))-14,top:CHART_H+8,fontSize:9,fontFamily:"Tajawal_400Regular",color:colors.muted,textAlign:"center",width:28}}>
          {l.weight}
        </Text>
      ))}
    </View>
  );
}

/* ─── Main Screen ────────────────────────────────────────────── */
export default function PregnancyScreen(){
  const{isDark}=useTheme();
  const colors=isDark?Colors.dark:Colors.light;
  const insets=useSafeAreaInsets();
  const topPadding=isWeb?67:insets.top;
  const{pregnancyData,updatePregnancyData}=useApp();

  const modalBg=isDark?colors.surface:"#FFFFFF";
  const inputBg=isDark?colors.surfaceAlt:"#F8F0F5";
  const chipBorder=isDark?"#5A4570":"#D8C8E8";

  /* Setup form state */
  const[setupOpen,setSetupOpen]=useState(false);
  const[lmpInput,setLmpInput]=useState(pregnancyData.lastPeriodDate??"");
  const[genderSel,setGenderSel]=useState<"boy"|"girl"|"surprise">(pregnancyData.babyGender);
  const[babyNameInput,setBabyNameInput]=useState(pregnancyData.babyName);
  const[preWeightInput,setPreWeightInput]=useState(pregnancyData.prePregnancyWeight?String(pregnancyData.prePregnancyWeight):"");
  const[heightInput,setHeightInput]=useState(pregnancyData.height?String(pregnancyData.height):"");

  /* Kick counter */
  const[kickActive,setKickActive]=useState(false);
  const[kickCount,setKickCount]=useState(0);
  const[kickStart,setKickStart]=useState<Date|null>(null);
  const kickScale=useRef(new Animated.Value(1)).current;
  const pulseKick=()=>{
    Animated.sequence([
      Animated.timing(kickScale,{toValue:0.88,duration:80,useNativeDriver:true}),
      Animated.spring(kickScale,{toValue:1,friction:3,useNativeDriver:true}),
    ]).start();
  };
  const startKick=()=>{setKickActive(true);setKickCount(0);setKickStart(new Date());};
  const recordKick=()=>{pulseKick();setKickCount(c=>c+1);};
  const stopKick=()=>{
    if(!kickStart)return;
    const dur=Math.round((new Date().getTime()-kickStart.getTime())/60000);
    const sessions=[...(pregnancyData.kickSessions??[]),{date:new Date().toISOString(),kicks:kickCount,durationMin:dur}];
    updatePregnancyData({kickSessions:sessions});
    setKickActive(false);
    if(kickCount>=10)Alert.alert("ممتاز! 🎉",`${kickCount} رفسة في ${dur} دقيقة — طفلك نشيط وبصحة جيدة ✅`);
    else Alert.alert("تنبيه ⚠️",`${kickCount} حركات — إذا كان أقل من 10 في ساعتين، استشيري طبيبتك`);
  };

  /* Weight log */
  const[weightOpen,setWeightOpen]=useState(false);
  const[weightInput,setWeightInput]=useState("");
  const[weightDateInput,setWeightDateInput]=useState(new Date().toISOString().split("T")[0]);
  const saveWeight=()=>{
    const w=parseFloat(weightInput);
    if(isNaN(w)||w<30||w>200){Alert.alert("خطأ","أدخلي وزناً صحيحاً");return;}
    const logs=[...(pregnancyData.weightLogs??[]),{date:weightDateInput,weight:w}].sort((a,b)=>a.date.localeCompare(b.date));
    updatePregnancyData({weightLogs:logs});
    setWeightOpen(false);setWeightInput("");
  };

  /* Hospital bag */
  const[bagOpen,setBagOpen]=useState(false);
  const[newBagItem,setNewBagItem]=useState("");
  const[newBagCat,setNewBagCat]=useState("للأم");
  const toggleBagItem=(id:string)=>{
    const bag=(pregnancyData.hospitalBag??[]).map(item=>item.id===id?{...item,checked:!item.checked}:item);
    updatePregnancyData({hospitalBag:bag});
  };
  const addBagItem=()=>{
    if(!newBagItem.trim())return;
    const newItem={id:Date.now().toString(),category:newBagCat,name:newBagItem.trim(),checked:false,custom:true};
    updatePregnancyData({hospitalBag:[...(pregnancyData.hospitalBag??[]),newItem]});
    setNewBagItem("");
  };

  /* Symptoms */
  const[sympOpen,setSympOpen]=useState(false);
  const[selSymp,setSelSymp]=useState<string[]>([]);
  const SYMP=[
    {id:"nausea",emoji:"🤢",label:"غثيان"},{id:"fatigue",emoji:"😴",label:"تعب"},
    {id:"back",emoji:"🏃",label:"ألم ظهر"},{id:"heartburn",emoji:"🔥",label:"حرقة"},
    {id:"swelling",emoji:"🦶",label:"تورم"},{id:"insomnia",emoji:"🌙",label:"أرق"},
    {id:"headache",emoji:"🤕",label:"صداع"},{id:"mood",emoji:"😤",label:"مزاج"},
    {id:"appetite",emoji:"🍕",label:"اشتهاءات"},{id:"breathless",emoji:"😮‍💨",label:"ضيق تنفس"},
  ];
  const saveSymp=()=>{
    if(!selSymp.length){setSympOpen(false);return;}
    updatePregnancyData({symptoms:[...(pregnancyData.symptoms??[]),{date:new Date().toISOString(),symptoms:selSymp}]});
    setSympOpen(false);setSelSymp([]);
    Alert.alert("✅ تم","تم تسجيل أعراض اليوم");
  };

  /* Gestational calculations */
  const stats=useMemo(()=>{
    if(!pregnancyData.lastPeriodDate)return null;
    const lmp=new Date(pregnancyData.lastPeriodDate);
    const today=new Date();
    const diffDays=Math.floor((today.getTime()-lmp.getTime())/86400000);
    if(diffDays<0||diffDays>294)return null;
    const weeks=Math.floor(diffDays/7);
    const days=diffDays%7;
    const due=new Date(lmp.getTime()+280*86400000);
    const daysLeft=Math.ceil((due.getTime()-today.getTime())/86400000);
    const trimester=weeks<13?1:weeks<27?2:3;
    const progress=(diffDays/280)*100;
    const fruit=getFruit(weeks);
    const tip=getWeeklyTip(weeks);
    return{weeks,days,due,daysLeft:Math.max(0,daysLeft),trimester,progress,fruit,tip};
  },[pregnancyData.lastPeriodDate]);

  /* BMI + weight gain */
  const bmiInfo=useMemo(()=>{
    const h=pregnancyData.height,w=pregnancyData.prePregnancyWeight;
    if(!h||!w)return null;
    const bmi=w/((h/100)**2);
    const cat=getBMICategory(bmi);
    return{bmi:bmi.toFixed(1),guide:WEIGHT_GUIDE[cat]};
  },[pregnancyData.height,pregnancyData.prePregnancyWeight]);

  const currentWeight=pregnancyData.weightLogs?.length?pregnancyData.weightLogs[pregnancyData.weightLogs.length-1].weight:null;
  const weightGain=currentWeight&&pregnancyData.prePregnancyWeight?currentWeight-pregnancyData.prePregnancyWeight:null;

  const bagChecked=(pregnancyData.hospitalBag??[]).filter(i=>i.checked).length;
  const bagTotal=(pregnancyData.hospitalBag??[]).length;

  const gConfig={
    boy:{label:"🩵 ولد",color:"#3B82F6"},
    girl:{label:"🩷 بنت",color:"#EC4899"},
    surprise:{label:"🎁 مفاجأة",color:"#A86DBF"},
  };

  const saveSetup=()=>{
    if(!lmpInput){Alert.alert("تنبيه","اختاري تاريخ آخر دورة شهرية");return;}
    const pw=parseFloat(preWeightInput);
    const h=parseFloat(heightInput);
    updatePregnancyData({
      isPregnant:true,
      lastPeriodDate:lmpInput,
      babyGender:genderSel,
      babyName:babyNameInput,
      prePregnancyWeight:isNaN(pw)?null:pw,
      height:isNaN(h)?null:h,
    });
    setSetupOpen(false);
  };

  const trimColors={1:"#10B981",2:"#A86DBF",3:"#EF4444"};
  const trimNames={1:"الثلث الأول",2:"الثلث الثاني",3:"الثلث الثالث"};

  return(
    <ScrollView style={[S.container,{backgroundColor:colors.background}]}
      contentContainerStyle={{paddingBottom:isWeb?34:insets.bottom+40}}
      showsVerticalScrollIndicator={false}>

      {/* ── Hero ── */}
      <View style={[S.hero,{height:220+topPadding}]}>
        <Image source={PREG_ART} style={S.heroImg} resizeMode="cover"/>
        <LinearGradient colors={["rgba(168,109,191,0.45)","rgba(107,65,165,0.92)"]}
          style={[S.heroGrad,{paddingTop:topPadding}]}>
          <View style={S.heroRow}>
            <Pressable onPress={()=>router.back()} style={S.iconBtn}>
              <Feather name="chevron-right" size={22} color="#fff"/>
            </Pressable>
            <Pressable onPress={()=>{
              setLmpInput(pregnancyData.lastPeriodDate??"");
              setGenderSel(pregnancyData.babyGender);
              setBabyNameInput(pregnancyData.babyName);
              setPreWeightInput(pregnancyData.prePregnancyWeight?String(pregnancyData.prePregnancyWeight):"");
              setHeightInput(pregnancyData.height?String(pregnancyData.height):"");
              setSetupOpen(true);
            }} style={S.iconBtn}>
              <Feather name="edit-2" size={16} color="#fff"/>
            </Pressable>
          </View>
          <View style={{gap:4}}>
            <Text style={S.heroTitle}>🤰 متابعة الحمل</Text>
            <Text style={S.heroSub}>رحلة أمومتك أسبوعاً بأسبوع</Text>
          </View>
        </LinearGradient>
      </View>

      {/* ── No data ── */}
      {!stats&&(
        <Pressable onPress={()=>setSetupOpen(true)}
          style={[S.card,{backgroundColor:"#A86DBF12",borderColor:"#A86DBF44",alignItems:"center",gap:12}]}>
          <Text style={{fontSize:50}}>🤰</Text>
          <Text style={[S.cardTitle,{color:"#A86DBF"}]}>ابدئي رحلة الأمومة</Text>
          <Text style={[S.sub,{color:colors.muted,textAlign:"center"}]}>
            أدخلي تاريخ آخر دورة شهرية لحساب عمر الحمل وموعد الولادة تلقائياً
          </Text>
          <LinearGradient colors={["#A86DBF","#7C3AED"]} style={S.startBtn}>
            <Text style={S.startBtnTxt}>🚀 ابدئي الآن</Text>
          </LinearGradient>
        </Pressable>
      )}

      {/* ══════ DATA EXISTS ══════ */}
      {stats&&(
        <>
          {/* Gestational age + due date */}
          <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
            <View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"flex-start"}}>
              <View style={{flex:1,gap:6}}>
                <View style={{flexDirection:"row-reverse",alignItems:"center",gap:8}}>
                  <View style={[S.trimBadge,{backgroundColor:trimColors[stats.trimester]+"22"}]}>
                    <Text style={[S.trimBadgeTxt,{color:trimColors[stats.trimester]}]}>{trimNames[stats.trimester]}</Text>
                  </View>
                  <View style={[S.trimBadge,{backgroundColor:gConfig[genderSel].color+"22"}]}>
                    <Text style={[S.trimBadgeTxt,{color:gConfig[genderSel].color}]}>{gConfig[genderSel].label}</Text>
                  </View>
                </View>
                <Text style={[S.weekNum,{color:colors.text}]}>
                  الأسبوع {stats.weeks}
                  <Text style={[S.sub,{color:colors.muted}]}> +{stats.days} أيام</Text>
                </Text>
                {pregnancyData.babyName?(
                  <Text style={[S.sub,{color:"#A86DBF"}]}>👶 {pregnancyData.babyName}</Text>
                ):null}
              </View>
              <View style={{alignItems:"center",gap:4}}>
                <Text style={{fontSize:52}}>{stats.fruit.emoji}</Text>
                <Text style={[S.sub,{color:colors.muted,textAlign:"center",fontSize:10}]}>حجم {stats.fruit.name}</Text>
                <Text style={[S.sub,{color:"#A86DBF",fontSize:10}]}>{stats.fruit.size} • {stats.fruit.weight}</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={{gap:4}}>
              <View style={{flexDirection:"row-reverse",justifyContent:"space-between"}}>
                <Text style={[S.sub,{color:colors.muted}]}>الحمل من 40 أسبوع</Text>
                <Text style={[S.sub,{color:"#A86DBF"}]}>{Math.round(stats.progress)}%</Text>
              </View>
              <View style={[S.barTrack,{backgroundColor:colors.border,height:12}]}>
                <LinearGradient colors={["#EC4899","#A86DBF","#7C3AED"]}
                  style={[S.barFill,{width:`${Math.min(stats.progress,100)}%`,height:12}]}/>
              </View>
            </View>

            {/* Due date */}
            <View style={[S.dueBox,{backgroundColor:"#A86DBF12",borderColor:"#A86DBF33"}]}>
              <View style={{flex:1}}>
                <Text style={[S.sub,{color:colors.muted}]}>موعد الولادة المتوقع</Text>
                <Text style={[S.cardTitle,{color:"#A86DBF",fontSize:16}]}>{formatDateAr(stats.due.toISOString())}</Text>
              </View>
              <View style={{alignItems:"center",gap:2}}>
                <Text style={{fontSize:28,fontFamily:"Cairo_700Bold",color:"#A86DBF"}}>{stats.daysLeft}</Text>
                <Text style={[S.sub,{color:colors.muted}]}>يوم باقي</Text>
              </View>
            </View>
          </View>

          {/* Weekly tip */}
          <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:"#A86DBF44"}]}>
            <Text style={[S.cardTitle,{color:colors.text}]}>✨ أسبوعك {stats.weeks} — ماذا يحدث؟</Text>
            <View style={{gap:10}}>
              <View style={[S.tipRow,{backgroundColor:"#A86DBF12",borderColor:"#A86DBF33"}]}>
                <Text style={{fontSize:18}}>👶</Text>
                <Text style={[S.sub,{color:colors.text,flex:1,textAlign:"right",lineHeight:18}]}>{stats.tip.baby}</Text>
              </View>
              <View style={[S.tipRow,{backgroundColor:"#EC489912",borderColor:"#EC489933"}]}>
                <Text style={{fontSize:18}}>🫀</Text>
                <Text style={[S.sub,{color:colors.text,flex:1,textAlign:"right",lineHeight:18}]}>{stats.tip.mom}</Text>
              </View>
            </View>
          </View>

          {/* Trimester nutrition */}
          <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
            <Text style={[S.cardTitle,{color:colors.text}]}>🥗 تغذية الثلث {stats.trimester===1?"الأول":stats.trimester===2?"الثاني":"الثالث"}</Text>
            <View style={S.chipRow}>
              {TRIMESTER_NUTRIENTS[stats.trimester as 1|2|3].map((n,i)=>(
                <View key={i} style={[S.chip,{backgroundColor:trimColors[stats.trimester]+"18"}]}>
                  <Text style={[S.chipTxt,{color:trimColors[stats.trimester]}]}>{n}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* ── KICK COUNTER ── */}
      <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
        <View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center"}}>
          <Text style={[S.cardTitle,{color:colors.text}]}>👶 عداد رفسات الجنين</Text>
          {(pregnancyData.kickSessions?.length??0)>0&&(
            <Text style={[S.sub,{color:colors.muted}]}>آخر جلسة: {pregnancyData.kickSessions![pregnancyData.kickSessions!.length-1].kicks} رفسات</Text>
          )}
        </View>
        <Text style={[S.sub,{color:colors.muted}]}>الهدف: 10 رفسات في ساعتين. اضغطي على الطفل مع كل رفسة.</Text>
        <View style={{alignItems:"center",gap:16,paddingVertical:8}}>
          {!kickActive?(
            <Pressable onPress={startKick} style={S.kickStartBtn}>
              <LinearGradient colors={["#A86DBF","#7C3AED"]} style={S.kickGrad}>
                <Text style={{fontSize:48}}>👶</Text>
                <Text style={{color:"#fff",fontSize:13,fontFamily:"Tajawal_700Bold"}}>ابدئي العد</Text>
              </LinearGradient>
            </Pressable>
          ):(
            <View style={{alignItems:"center",gap:12}}>
              <Text style={[S.sub,{color:colors.muted}]}>اضغطي على الطفل مع كل حركة تشعرين بها</Text>
              <Animated.View style={{transform:[{scale:kickScale}]}}>
                <Pressable onPress={recordKick} style={S.kickActiveBtn}>
                  <Text style={{fontSize:52}}>👶</Text>
                  <Text style={S.kickCount}>{kickCount}</Text>
                  <Text style={S.kickLabel}>رفسات</Text>
                </Pressable>
              </Animated.View>
              <View style={{flexDirection:"row-reverse",gap:12}}>
                <Pressable onPress={stopKick} style={[S.kickEndBtn,{borderColor:"#EF4444",backgroundColor:"#EF444418"}]}>
                  <Text style={{color:"#EF4444",fontSize:13,fontFamily:"Tajawal_700Bold"}}>إنهاء الجلسة</Text>
                </Pressable>
                {kickCount>=10&&(
                  <View style={[S.kickEndBtn,{borderColor:"#10B981",backgroundColor:"#10B98118"}]}>
                    <Text style={{color:"#10B981",fontSize:13,fontFamily:"Tajawal_700Bold"}}>✅ وصلتِ 10!</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        {(pregnancyData.kickSessions?.length??0)>0&&(
          <View style={{gap:6}}>
            <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>آخر الجلسات:</Text>
            {pregnancyData.kickSessions!.slice(-3).reverse().map((s,i)=>(
              <View key={i} style={{flexDirection:"row-reverse",justifyContent:"space-between",backgroundColor:s.kicks>=10?"#10B98110":"#F59E0B10",borderRadius:10,padding:8}}>
                <Text style={[S.sub,{color:colors.muted}]}>{new Date(s.date).toLocaleDateString("ar-SA")}</Text>
                <Text style={[S.sub,{color:s.kicks>=10?"#10B981":"#F59E0B",fontFamily:"Tajawal_700Bold"}]}>{s.kicks} رفسات في {s.durationMin} د</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── WEIGHT TRACKING ── */}
      <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
        <View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center"}}>
          <Text style={[S.cardTitle,{color:colors.text}]}>⚖️ منحنى الوزن</Text>
          <Pressable onPress={()=>setWeightOpen(true)} style={[S.addBtn,{backgroundColor:"#A86DBF"}]}>
            <Text style={S.addBtnTxt}>+ سجّلي وزنك</Text>
          </Pressable>
        </View>

        {bmiInfo&&(
          <View style={{flexDirection:"row-reverse",gap:12}}>
            <View style={[S.metaBox,{backgroundColor:bmiInfo.guide.color+"18",borderColor:bmiInfo.guide.color+"44",flex:1}]}>
              <Text style={[S.sub,{color:bmiInfo.guide.color,fontFamily:"Tajawal_700Bold"}]}>BMI قبل الحمل</Text>
              <Text style={{fontSize:22,fontFamily:"Cairo_700Bold",color:bmiInfo.guide.color}}>{bmiInfo.bmi}</Text>
              <Text style={[S.sub,{color:colors.muted,fontSize:10}]}>{bmiInfo.guide.label}</Text>
            </View>
            <View style={[S.metaBox,{backgroundColor:"#A86DBF18",borderColor:"#A86DBF44",flex:1}]}>
              <Text style={[S.sub,{color:"#A86DBF",fontFamily:"Tajawal_700Bold"}]}>الزيادة الموصى بها</Text>
              <Text style={{fontSize:16,fontFamily:"Cairo_700Bold",color:"#A86DBF"}}>{bmiInfo.guide.low}–{bmiInfo.guide.high} كغ</Text>
            </View>
            {weightGain!==null&&(
              <View style={[S.metaBox,{backgroundColor: weightGain<bmiInfo.guide.high?"#10B98118":"#EF444418",borderColor: weightGain<bmiInfo.guide.high?"#10B98144":"#EF444444",flex:1}]}>
                <Text style={[S.sub,{color: weightGain<bmiInfo.guide.high?"#10B981":"#EF4444",fontFamily:"Tajawal_700Bold"}]}>الزيادة الفعلية</Text>
                <Text style={{fontSize:18,fontFamily:"Cairo_700Bold",color: weightGain<bmiInfo.guide.high?"#10B981":"#EF4444"}}>+{weightGain.toFixed(1)} كغ</Text>
              </View>
            )}
          </View>
        )}

        {(pregnancyData.weightLogs?.length??0)>=2?(
          <WeightChart logs={pregnancyData.weightLogs!} guide={bmiInfo?.guide??{low:11.5,high:16}} baseWeight={pregnancyData.prePregnancyWeight??60}/>
        ):(
          <View style={{alignItems:"center",paddingVertical:12,gap:8}}>
            <Text style={{fontSize:32}}>📊</Text>
            <Text style={[S.sub,{color:colors.muted,textAlign:"center"}]}>سجّلي وزنك أسبوعياً لرؤية منحنى الوزن</Text>
          </View>
        )}

        {(pregnancyData.weightLogs?.length??0)>0&&(
          <View style={{gap:6}}>
            {pregnancyData.weightLogs!.slice(-3).reverse().map((l,i)=>(
              <View key={i} style={{flexDirection:"row-reverse",justifyContent:"space-between",backgroundColor:inputBg,borderRadius:10,padding:8}}>
                <Text style={[S.sub,{color:colors.muted}]}>{formatDateAr(l.date)}</Text>
                <Text style={[S.sub,{color:"#A86DBF",fontFamily:"Tajawal_700Bold"}]}>{l.weight} كغ</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── HOSPITAL BAG ── */}
      <View style={[S.card,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
        <View style={{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center"}}>
          <Text style={[S.cardTitle,{color:colors.text}]}>🧳 حقيبة المستشفى</Text>
          <Pressable onPress={()=>setBagOpen(true)} style={[S.addBtn,{backgroundColor:"#F59E0B"}]}>
            <Text style={S.addBtnTxt}>+ إضافة</Text>
          </Pressable>
        </View>

        {/* Progress */}
        <View style={{gap:4}}>
          <View style={{flexDirection:"row-reverse",justifyContent:"space-between"}}>
            <Text style={[S.sub,{color:colors.muted}]}>مُجهّزة</Text>
            <Text style={[S.sub,{color:"#F59E0B",fontFamily:"Tajawal_700Bold"}]}>{bagChecked}/{bagTotal}</Text>
          </View>
          <View style={[S.barTrack,{backgroundColor:colors.border}]}>
            <View style={[S.barFill,{width:`${bagTotal>0?(bagChecked/bagTotal)*100:0}%`,backgroundColor:"#F59E0B"}]}/>
          </View>
        </View>

        {/* Items by category */}
        {BAG_CATEGORIES.map(cat=>{
          const items=(pregnancyData.hospitalBag??[]).filter(i=>i.category===cat);
          if(!items.length)return null;
          return(
            <View key={cat} style={{gap:6}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>{BAG_ICONS[cat]} {cat}</Text>
              {items.map(item=>(
                <Pressable key={item.id} onPress={()=>toggleBagItem(item.id)}
                  style={[S.bagItem,{backgroundColor:item.checked?"#10B98110":inputBg,borderColor:item.checked?"#10B98130":colors.border}]}>
                  <View style={[S.checkbox,{borderColor:item.checked?"#10B981":colors.border,backgroundColor:item.checked?"#10B981":"transparent"}]}>
                    {item.checked&&<Feather name="check" size={12} color="#fff"/>}
                  </View>
                  <Text style={[S.sub,{flex:1,textAlign:"right",color:colors.text,textDecorationLine:item.checked?"line-through":"none"}]}>{item.name}</Text>
                  {item.custom&&<Text style={{fontSize:10,color:colors.muted}}>مُضاف</Text>}
                </Pressable>
              ))}
            </View>
          );
        })}
      </View>

      {/* ── SYMPTOMS LOG ── */}
      <Pressable onPress={()=>setSympOpen(true)}
        style={[S.card,{backgroundColor:"#EC489912",borderColor:"#EC489933",flexDirection:"row-reverse",alignItems:"center",gap:12}]}>
        <Feather name="plus-circle" size={20} color="#EC4899"/>
        <Text style={[S.cardTitle,{color:"#EC4899",fontSize:13}]}>📝 سجّلي أعراض اليوم</Text>
      </Pressable>

      {/* ── BLOG / TIPS ── */}
      <View style={{paddingHorizontal:20,paddingTop:8,gap:10}}>
        <Text style={[S.cardTitle,{color:colors.text}]}>📖 نصائح حمل آمن</Text>
        {BLOG_POSTS.map((p,i)=>(
          <Pressable key={i} style={[S.blogCard,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
            <Text style={{fontSize:24}}>{p.emoji}</Text>
            <View style={{flex:1,gap:4}}>
              <Text style={[S.sub,{color:colors.text,fontFamily:"Tajawal_700Bold",textAlign:"right"}]}>{p.title}</Text>
              <Text style={[S.sub,{color:colors.muted,textAlign:"right"}]}>{p.desc}</Text>
            </View>
            <Feather name="chevron-left" size={16} color={colors.muted}/>
          </Pressable>
        ))}
      </View>

      {/* ── BABY SHOPPING BANNER ── */}
      <View style={{paddingHorizontal:20,paddingTop:16,gap:10}}>
        <Text style={[S.cardTitle,{color:colors.text}]}>🛒 تسوق لاستقبال المولود</Text>
        {[
          {name:"نون للتسوق",desc:"أغراض المواليد والأطفال",emoji:"🛍️",color:"#F59E0B"},
          {name:"متجر أطفالنا",emoji:"👶",desc:"ملابس وأدوات للأطفال",color:"#A86DBF"},
          {name:"دوق",emoji:"📦",desc:"توصيل سريع 24 ساعة",color:"#10B981"},
        ].map((s,i)=>(
          <Pressable key={i} style={[S.storeCard,{backgroundColor: isDark?colors.surface:"#fff",borderColor:colors.border}]}>
            <Text style={{fontSize:28}}>{s.emoji}</Text>
            <View style={{flex:1}}>
              <Text style={[S.sub,{color:colors.text,fontFamily:"Tajawal_700Bold"}]}>{s.name}</Text>
              <Text style={[S.sub,{color:colors.muted}]}>{s.desc}</Text>
            </View>
            <View style={[S.shopBtn,{backgroundColor:s.color}]}>
              <Text style={{color:"#fff",fontSize:12,fontFamily:"Tajawal_700Bold"}}>تسوق</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* ── Store banner ── */}
      <Pressable style={S.bannerWrap} onPress={()=>router.push("/(tabs)/store" as any)}>
        <LinearGradient colors={["#F59E0B","#EC4899"]} style={S.bookBanner}>
          <Text style={S.bookBannerTxt}>🛍️ منتجات الحمل والأمومة</Text>
          <View style={S.bookBtn}><Text style={S.bookBtnTxt}>تسوقي الآن</Text></View>
        </LinearGradient>
      </Pressable>

      {/* ── Book doctor ── */}
      <Pressable style={S.bannerWrap} onPress={()=>router.push("/section/clinics" as any)}>
        <LinearGradient colors={["#A86DBF","#7C3AED"]} style={S.bookBanner}>
          <Text style={S.bookBannerTxt}>🤱 احصلي على رعاية صحية تهتم بطفلك</Text>
          <View style={S.bookBtn}><Text style={S.bookBtnTxt}>احجزي الآن</Text></View>
        </LinearGradient>
      </Pressable>

      {/* ══════ SETUP MODAL ══════ */}
      <Modal visible={setupOpen} transparent animationType="slide" onRequestClose={()=>setSetupOpen(false)}>
        <View style={S.overlay}>
          <ScrollView style={[S.modalSheet,{backgroundColor:modalBg}]}
            contentContainerStyle={{padding:24,gap:16,paddingBottom:40}} showsVerticalScrollIndicator={false}>
            <Text style={[S.cardTitle,{color:colors.text,fontSize:17}]}>🤰 إعداد متابعة الحمل</Text>

            <DatePicker title="📅 تاريخ آخر دورة شهرية (LMP)" value={lmpInput} onSelect={setLmpInput}/>

            {lmpInput&&(
              <View style={[S.infoBox,{backgroundColor:"#10B98112",borderColor:"#10B98133"}]}>
                <Text style={[S.sub,{color:"#10B981",fontFamily:"Tajawal_700Bold"}]}>✅ النتائج المتوقعة:</Text>
                <Text style={[S.sub,{color:colors.muted}]}>
                  موعد الولادة: {formatDateAr(new Date(new Date(lmpInput).getTime()+280*86400000).toISOString())}
                </Text>
                <Text style={[S.sub,{color:colors.muted}]}>
                  الأسبوع الحالي: {Math.floor((new Date().getTime()-new Date(lmpInput).getTime())/604800000)}
                </Text>
              </View>
            )}

            <View style={{gap:8}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>👶 جنس الطفل</Text>
              <View style={{flexDirection:"row-reverse",gap:8}}>
                {(["boy","girl","surprise"] as const).map(g=>(
                  <Pressable key={g} onPress={()=>setGenderSel(g)}
                    style={[S.genderChip,{backgroundColor:genderSel===g?gConfig[g].color:inputBg,borderColor:genderSel===g?gConfig[g].color:chipBorder}]}>
                    <Text style={[S.chipTxt,{color:genderSel===g?"#fff":colors.text}]}>{gConfig[g].label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{gap:6}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>✏️ اسم الطفل (اختياري)</Text>
              <TextInput style={[S.fullInput,{color:colors.text,borderColor:colors.border,backgroundColor:inputBg}]}
                value={babyNameInput} onChangeText={setBabyNameInput} placeholder="اسم طفلك" placeholderTextColor={colors.muted} textAlign="right"/>
            </View>

            <View style={{flexDirection:"row-reverse",gap:12}}>
              <View style={{flex:1,gap:6}}>
                <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>⚖️ الوزن قبل الحمل (كغ)</Text>
                <TextInput style={[S.fullInput,{color:colors.text,borderColor:colors.border,backgroundColor:inputBg,textAlign:"center"}]}
                  value={preWeightInput} onChangeText={setPreWeightInput} keyboardType="numeric" placeholder="60" placeholderTextColor={colors.muted}/>
              </View>
              <View style={{flex:1,gap:6}}>
                <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>📏 الطول (سم)</Text>
                <TextInput style={[S.fullInput,{color:colors.text,borderColor:colors.border,backgroundColor:inputBg,textAlign:"center"}]}
                  value={heightInput} onChangeText={setHeightInput} keyboardType="numeric" placeholder="160" placeholderTextColor={colors.muted}/>
              </View>
            </View>

            <View style={S.modalBtns}>
              <Pressable onPress={()=>setSetupOpen(false)} style={[S.modalBtn,{backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt,{color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveSetup} style={[S.modalBtn,{backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt,{color:"#fff"}]}>💾 حفظ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ══════ WEIGHT MODAL ══════ */}
      <Modal visible={weightOpen} transparent animationType="slide" onRequestClose={()=>setWeightOpen(false)}>
        <View style={S.overlay}>
          <View style={[S.modalSheet,{backgroundColor:modalBg,padding:24,gap:16}]}>
            <Text style={[S.cardTitle,{color:colors.text,fontSize:17}]}>⚖️ تسجيل الوزن</Text>
            <DatePicker title="📅 تاريخ القياس" value={weightDateInput} onSelect={setWeightDateInput}/>
            <View style={{gap:6}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>الوزن الحالي (كغ)</Text>
              <TextInput style={[S.fullInput,{color:colors.text,borderColor:colors.border,backgroundColor:inputBg,textAlign:"center",fontSize:22,fontFamily:"Cairo_700Bold"}]}
                value={weightInput} onChangeText={setWeightInput} keyboardType="numeric" placeholder="65.5" placeholderTextColor={colors.muted}/>
            </View>
            <View style={S.modalBtns}>
              <Pressable onPress={()=>setWeightOpen(false)} style={[S.modalBtn,{backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt,{color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveWeight} style={[S.modalBtn,{backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt,{color:"#fff"}]}>حفظ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══════ BAG MODAL ══════ */}
      <Modal visible={bagOpen} transparent animationType="slide" onRequestClose={()=>setBagOpen(false)}>
        <View style={S.overlay}>
          <View style={[S.modalSheet,{backgroundColor:modalBg,padding:24,gap:14}]}>
            <Text style={[S.cardTitle,{color:colors.text,fontSize:17}]}>🧳 إضافة غرض للحقيبة</Text>
            <View style={{gap:8}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>الفئة</Text>
              <View style={{flexDirection:"row-reverse",gap:8}}>
                {BAG_CATEGORIES.map(cat=>(
                  <Pressable key={cat} onPress={()=>setNewBagCat(cat)}
                    style={[S.tab,{backgroundColor:newBagCat===cat?"#F59E0B":inputBg,flex:1}]}>
                    <Text style={[S.tabTxt,{color:newBagCat===cat?"#fff":colors.text,fontSize:10}]}>{BAG_ICONS[cat]} {cat}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={{gap:6}}>
              <Text style={[S.sub,{color:colors.muted,fontFamily:"Tajawal_700Bold"}]}>اسم الغرض</Text>
              <TextInput style={[S.fullInput,{color:colors.text,borderColor:colors.border,backgroundColor:inputBg}]}
                value={newBagItem} onChangeText={setNewBagItem} placeholder="مثال: جهاز مراقبة" placeholderTextColor={colors.muted} textAlign="right"/>
            </View>
            <View style={S.modalBtns}>
              <Pressable onPress={()=>setBagOpen(false)} style={[S.modalBtn,{backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt,{color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={()=>{addBagItem();setBagOpen(false);}} style={[S.modalBtn,{backgroundColor:"#F59E0B"}]}>
                <Text style={[S.tabTxt,{color:"#fff"}]}>+ إضافة</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══════ SYMPTOMS MODAL ══════ */}
      <Modal visible={sympOpen} transparent animationType="slide" onRequestClose={()=>setSympOpen(false)}>
        <View style={S.overlay}>
          <ScrollView style={[S.modalSheet,{backgroundColor:modalBg}]}
            contentContainerStyle={{padding:24,gap:14,paddingBottom:40}} showsVerticalScrollIndicator={false}>
            <Text style={[S.cardTitle,{color:colors.text,fontSize:17}]}>📝 أعراض الحمل اليوم</Text>
            <View style={S.sympGrid}>
              {SYMP.map(s=>(
                <Pressable key={s.id} onPress={()=>setSelSymp(prev=>prev.includes(s.id)?prev.filter(x=>x!==s.id):[...prev,s.id])}
                  style={[S.sympChip,{borderColor:selSymp.includes(s.id)?"#A86DBF":chipBorder,backgroundColor:selSymp.includes(s.id)?"#A86DBF":"transparent"}]}>
                  <Text style={{fontSize:14}}>{s.emoji}</Text>
                  <Text style={[S.chipTxt,{color:selSymp.includes(s.id)?"#fff":colors.text}]}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={S.modalBtns}>
              <Pressable onPress={()=>{setSympOpen(false);setSelSymp([]);}} style={[S.modalBtn,{backgroundColor:inputBg}]}>
                <Text style={[S.tabTxt,{color:colors.text}]}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={saveSymp} style={[S.modalBtn,{backgroundColor:"#A86DBF"}]}>
                <Text style={[S.tabTxt,{color:"#fff"}]}>حفظ</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const S=StyleSheet.create({
  container:{flex:1},
  hero:{position:"relative"},
  heroImg:{width:"100%",height:"100%",position:"absolute"},
  heroGrad:{flex:1,padding:16,justifyContent:"space-between"},
  heroRow:{flexDirection:"row-reverse",justifyContent:"space-between"},
  iconBtn:{width:36,height:36,backgroundColor:"rgba(0,0,0,0.22)",borderRadius:10,alignItems:"center",justifyContent:"center"},
  heroTitle:{color:"#fff",fontSize:22,fontFamily:"Cairo_700Bold",textAlign:"right",textShadowColor:"rgba(0,0,0,0.3)",textShadowOffset:{width:0,height:1},textShadowRadius:4},
  heroSub:{color:"rgba(255,255,255,0.9)",fontSize:12,fontFamily:"Tajawal_400Regular",textAlign:"right"},
  card:{marginHorizontal:20,marginTop:16,borderRadius:20,padding:16,borderWidth:1,gap:12},
  cardTitle:{fontSize:15,fontFamily:"Cairo_700Bold",textAlign:"right"},
  sub:{fontSize:12,fontFamily:"Tajawal_400Regular",textAlign:"right"},
  weekNum:{fontSize:28,fontFamily:"Cairo_700Bold",textAlign:"right"},
  trimBadge:{borderRadius:10,paddingHorizontal:10,paddingVertical:4},
  trimBadgeTxt:{fontSize:11,fontFamily:"Tajawal_700Bold"},
  barTrack:{height:10,borderRadius:6,overflow:"hidden"},
  barFill:{height:"100%",backgroundColor:"#A86DBF",borderRadius:6},
  dueBox:{flexDirection:"row-reverse",justifyContent:"space-between",alignItems:"center",borderRadius:16,padding:14,borderWidth:1},
  tipRow:{flexDirection:"row-reverse",alignItems:"flex-start",gap:8,borderRadius:14,padding:12,borderWidth:1},
  chipRow:{flexDirection:"row-reverse",flexWrap:"wrap",gap:8},
  chip:{borderRadius:10,paddingHorizontal:10,paddingVertical:5},
  chipTxt:{fontSize:12,fontFamily:"Tajawal_500Medium"},
  startBtn:{borderRadius:18,paddingHorizontal:28,paddingVertical:14,alignItems:"center"},
  startBtnTxt:{color:"#fff",fontSize:15,fontFamily:"Cairo_700Bold"},
  kickStartBtn:{alignItems:"center"},
  kickGrad:{width:140,height:140,borderRadius:70,alignItems:"center",justifyContent:"center",gap:4},
  kickActiveBtn:{width:150,height:150,borderRadius:75,backgroundColor:"#A86DBF",alignItems:"center",justifyContent:"center",gap:4,elevation:8,shadowColor:"#A86DBF",shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:8},
  kickCount:{color:"#fff",fontSize:44,fontFamily:"Cairo_700Bold",lineHeight:48},
  kickLabel:{color:"rgba(255,255,255,0.85)",fontSize:12,fontFamily:"Tajawal_400Regular"},
  kickEndBtn:{borderRadius:14,paddingHorizontal:18,paddingVertical:10,borderWidth:1},
  metaBox:{borderRadius:14,padding:12,borderWidth:1,gap:4,alignItems:"center"},
  addBtn:{borderRadius:12,paddingHorizontal:12,paddingVertical:7},
  addBtnTxt:{color:"#fff",fontSize:12,fontFamily:"Tajawal_700Bold"},
  bagItem:{flexDirection:"row-reverse",alignItems:"center",gap:10,borderRadius:12,padding:10,borderWidth:1},
  checkbox:{width:22,height:22,borderRadius:7,borderWidth:2,alignItems:"center",justifyContent:"center"},
  storeCard:{flexDirection:"row-reverse",alignItems:"center",gap:12,borderRadius:16,padding:14,borderWidth:1},
  shopBtn:{borderRadius:12,paddingHorizontal:14,paddingVertical:8},
  blogCard:{flexDirection:"row-reverse",alignItems:"flex-start",gap:12,borderRadius:16,padding:14,borderWidth:1},
  bannerWrap:{marginHorizontal:20,marginTop:20,borderRadius:22,overflow:"hidden",marginBottom:10},
  bookBanner:{padding:20,flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between"},
  bookBannerTxt:{color:"#fff",fontSize:14,fontFamily:"Cairo_700Bold"},
  bookBtn:{backgroundColor:"#fff",borderRadius:12,paddingHorizontal:16,paddingVertical:8},
  bookBtnTxt:{color:"#A86DBF",fontSize:13,fontFamily:"Tajawal_700Bold"},
  overlay:{flex:1,backgroundColor:"rgba(0,0,0,0.65)",justifyContent:"flex-end"},
  modalSheet:{borderTopLeftRadius:28,borderTopRightRadius:28,maxHeight:"90%"},
  fullInput:{borderWidth:1,borderRadius:14,paddingHorizontal:14,paddingVertical:12,fontSize:14,fontFamily:"Tajawal_400Regular"},
  genderChip:{flex:1,borderRadius:14,paddingVertical:10,alignItems:"center",borderWidth:1},
  infoBox:{borderRadius:14,padding:12,borderWidth:1,gap:6},
  modalBtns:{flexDirection:"row-reverse",gap:10,marginTop:4},
  modalBtn:{flex:1,borderRadius:14,padding:14,alignItems:"center"},
  tabTxt:{fontSize:12,fontFamily:"Tajawal_700Bold"},
  tab:{borderRadius:10,paddingVertical:7,alignItems:"center"},
  sympGrid:{flexDirection:"row-reverse",flexWrap:"wrap",gap:8},
  sympChip:{flexDirection:"row-reverse",alignItems:"center",gap:4,borderWidth:1.5,borderRadius:12,paddingHorizontal:10,paddingVertical:7},
});
