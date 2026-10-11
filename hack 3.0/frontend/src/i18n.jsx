import React, { createContext, useContext, useState } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
]

const T = {
  en: {
    brandName: 'FinD',
    brandSub: 'Financial Event & Market Impact Graph',
    goodMorning: 'Good Morning',

    dashboard: 'Dashboard',
    detective: 'Event Engine',
    aiHub: 'AI Hub',
    hotspots: 'Sectors',
    trends: 'Impact Trends',
    network: 'Network',
    audit: 'Impact Paths',

    role: 'Role',
    station: 'Department',
    lastLogin: 'Last Login',
    provider: 'Provider',
    changePassword: 'Change Password',
    logout: 'Logout',

    changePasswordTitle: 'Change Password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    submit: 'Submit',
    cancel: 'Cancel',
    updating: 'Updating...',

    officerLogin: 'Analyst Login',
    authorizedOnly: 'Authorized Analysts Only',
    officerId: 'Analyst ID',
    password: 'Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    signIn: 'Secure Sign In',
    signingIn: 'Authenticating...',
    invalidCreds: 'Invalid Analyst ID or Password. Please try again.',
    demoAccounts: 'Demo Accounts (Click to auto-fill)',
    trustedBy: 'Trusted by Financial Analysts',
    capsLock: 'Caps Lock is ON',

    feat1: 'AI Event Extraction',
    feat2: 'Sector Impact Analytics',
    feat3: 'Asset Dependency Graph',
    feat4: 'Time-Series Tracking',

    stat1: '2M+',
    stat1Label: 'Financial Events',
    stat2: '24,873',
    stat2Label: 'Tracked Assets',
    stat3: '1,996,412',
    stat3Label: 'Impact Chains',

    selectLang: 'Select Language',
    offlineNotice: '100% Offline Multi-Language Active'
  },

  hi: {
    brandName: 'अभेद्य-चक्र',
    brandSub: 'डकटॉडीबी साइबर फॉरेंसिक लेजर',
    goodMorning: 'सुप्रभात',

    dashboard: 'डैशबोर्ड',
    detective: 'जांच इंजन',
    aiHub: 'एआई हब',
    hotspots: 'हॉटस्पॉट',
    trends: 'अपराध रुझान',
    network: 'नेटवर्क',
    audit: 'ऑडिट श्रृंखला',

    role: 'भूमिका',
    station: 'थाना',
    lastLogin: 'अंतिम लॉगिन',
    provider: 'प्रदाता',
    changePassword: 'पासवर्ड बदलें',
    logout: 'लॉग आउट',

    changePasswordTitle: 'पासवर्ड बदलें',
    oldPassword: 'पुराना पासवर्ड',
    newPassword: 'नया पासवर्ड',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    updating: 'अपडेट हो रहा है...',

    officerLogin: 'अधिकारी लॉगिन',
    authorizedOnly: 'केवल अधिकृत कर्मी',
    officerId: 'अधिकारी आईडी',
    password: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'सुरक्षित साइन इन',
    signingIn: 'प्रमाणित हो रहा है...',
    invalidCreds: 'अमान्य अधिकारी आईडी या पासवर्ड।',
    demoAccounts: 'डेमो खाते (क्लिक करें)',
    trustedBy: 'कानून प्रवर्तन द्वारा विश्वसनीय',
    capsLock: 'कैप्स लॉक चालू है',

    feat1: 'एआई जांच सहायक',
    feat2: 'अपराध हॉटस्पॉट विश्लेषण',
    feat3: 'आपराधिक नेटवर्क मैपिंग',
    feat4: 'डिजिटल केस फाइलें',

    stat1: '20 लाख+',
    stat1Label: 'लेन-देन रिकॉर्ड',
    stat2: '24,873',
    stat2Label: 'बैंक खाते',
    stat3: '19,96,412',
    stat3Label: 'म्यूल ट्रांसफर',

    selectLang: 'भाषा चुनें',
    offlineNotice: '100% ऑफ़लाइन बहुभाषा सक्रिय'
  },

  mr: {
    brandName: 'अभेद्य-चक्र',
    brandSub: 'सायबर फॉरेन्सिक लेजर प्रणाली',
    goodMorning: 'शुभ प्रभात',

    dashboard: 'डॅशबोर्ड',
    detective: 'तपास इंजिन',
    aiHub: 'एआय हब',
    hotspots: 'हॉटस्पॉट',
    trends: 'गुन्हेगारी कल',
    network: 'नेटवर्क',
    audit: 'ऑडिट साखळी',

    role: 'भूमिका',
    station: 'पोलीस ठाणे',
    lastLogin: 'अंतिम लॉगिन',
    provider: 'प्रदाता',
    changePassword: 'पासवर्ड बदला',
    logout: 'लॉग आउट',

    changePasswordTitle: 'पासवर्ड बदला',
    oldPassword: 'जुना पासवर्ड',
    newPassword: 'नवीन पासवर्ड',
    submit: 'सादर करा',
    cancel: 'रद्द करा',
    updating: 'अपडेट होत आहे...',

    officerLogin: 'अधिकारी लॉगिन',
    authorizedOnly: 'केवळ अधिकृत कर्मचारी',
    officerId: 'अधिकारी आयडी',
    password: 'पासवर्ड',
    rememberMe: 'माझे लक्षात ठेवा',
    forgotPassword: 'पासवर्ड विसरलात?',
    signIn: 'सुरक्षित साइन इन',
    signingIn: 'प्रमाणित करत आहे...',
    invalidCreds: 'अवैध अधिकारी आयडी किंवा पासवर्ड.',
    demoAccounts: 'डेमो खाती (क्लिक करा)',
    trustedBy: 'पोलीस विभागाद्वारे विश्वासातील',
    capsLock: 'कॅप्स लॉक चालू आहे',

    feat1: 'एआय तपास सहाय्यक',
    feat2: 'गुन्हे हॉटस्पॉट विश्लेषण',
    feat3: 'गुन्हेगारी नेटवर्क मॅपिंग',
    feat4: 'डिजिटल केस फाइल्स',

    stat1: '२० लाख+',
    stat1Label: 'व्यवहार नोंदी',
    stat2: '२४,८७३',
    stat2Label: 'बँक खाती',
    stat3: '१९,९६,४१२',
    stat3Label: 'म्युल ट्रान्सफर',

    selectLang: 'भाषा निवडा',
    offlineNotice: '१००% ऑफलाईन बहुभाषा सक्रिय'
  },

  bn: {
    brandName: 'অভেদ্য-চক্র',
    brandSub: 'সাইবার ফরেনসিক লেজার সিস্টেম',
    goodMorning: 'সুপ্রভাত',

    dashboard: 'ড্যাশবোর্ড',
    detective: 'তদন্ত ইঞ্জিন',
    aiHub: 'এআই হাব',
    hotspots: 'হটস্পট',
    trends: 'অপরাধ প্রবণতা',
    network: 'নেটওয়ার্ক',
    audit: 'অডিট চেইন',

    role: 'ভূমিকা',
    station: 'পুলিশ স্টেশন',
    lastLogin: 'শেষ লগইন',
    provider: 'প্রদানকারী',
    changePassword: 'পাসওয়ার্ড পরিবর্তন',
    logout: 'লগ আউট',

    changePasswordTitle: 'পাসওয়ার্ড পরিবর্তন',
    oldPassword: 'পুরানো পাসওয়ার্ড',
    newPassword: 'নতুন পাসওয়ার্ড',
    submit: 'জমা দিন',
    cancel: 'বাতিল',
    updating: 'আপডেট হচ্ছে...',

    officerLogin: 'অফিসার লগইন',
    authorizedOnly: 'শুধুমাত্র অনুমোদিত কর্মীদের জন্য',
    officerId: 'অফিসার আইডি',
    password: 'পাসওয়ার্ড',
    rememberMe: 'আমাকে মনে রাখুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    signIn: 'সুরক্ষিত সাইন ইন',
    signingIn: 'যাচাই করা হচ্ছে...',
    invalidCreds: 'অবৈধ অফিসার আইডি বা পাসওয়ার্ড।',
    demoAccounts: 'ডেমো অ্যাকাউন্টস',
    trustedBy: 'আইন প্রয়োগকারী সংস্থাসমূহ',
    capsLock: 'ক্যাপস লক চালু আছে',

    feat1: 'এআই তদন্ত সহকারী',
    feat2: 'অপরাধ হটস্পট বিশ্লেষণ',
    feat3: 'অপরাধী নেটওয়ার্ক ম্যাপিং',
    feat4: 'ডিজিটাল কেস ফাইল',

    stat1: '২০ লক্ষ+',
    stat1Label: 'লেনদেন রেকর্ড',
    stat2: '২৪,৮৭৩',
    stat2Label: 'ব্যাংক অ্যাকাউন্ট',
    stat3: '১৯,৯৬,৪১২',
    stat3Label: 'মিউল স্থানান্তর',

    selectLang: 'ভাষা নির্বাচন করুন',
    offlineNotice: '১০০% অফলাইন বহুভাষা সক্রিয়'
  },

  ta: {
    brandName: 'அபேத்ய-சக்ரா',
    brandSub: 'சைபர் தடம் தடயவியல் கணக்கு',
    goodMorning: 'காலை வணக்கம்',

    dashboard: 'டேஷ்போர்டு',
    detective: 'விசாரணை இயந்திரம்',
    aiHub: 'AI மையம்',
    hotspots: 'ஹாட்ஸ்பாட்கள்',
    trends: 'குற்றப் போக்குகள்',
    network: 'நெட்வொர்க்',
    audit: 'தணிக்கை சங்கிலி',

    role: 'பங்கு',
    station: 'காவல் நிலையம்',
    lastLogin: 'கடைசி உள்நுழைவு',
    provider: 'வழங்குநர்',
    changePassword: 'கடவுச்சொல்லை மாற்றுக',
    logout: 'வெளியேறு',

    changePasswordTitle: 'கடவுச்சொல்லை மாற்றுக',
    oldPassword: 'பழைய கடவுச்சொல்',
    newPassword: 'புதிய கடவுச்சொல்',
    submit: 'சமர்ப்பிக்கவும்',
    cancel: 'ரத்துசெய்',
    updating: 'புதுப்பிக்கப்படுகிறது...',

    officerLogin: 'அதிகாரி உள்நுழைவு',
    authorizedOnly: 'அனுமதிக்கப்பட்ட பணியாளர்கள் மட்டும்',
    officerId: 'அதிகாரி ஐடி',
    password: 'கடவுச்சொல்',
    rememberMe: 'என்னை நினைவில் கொள்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    signIn: 'பாதுகாப்பான உள்நுழைவு',
    signingIn: 'சரிபார்க்கிறது...',
    invalidCreds: 'தவறான அதிகாரி ஐடி அல்லது கடவுச்சொல்.',
    demoAccounts: 'மாதிரி கணக்குகள்',
    trustedBy: 'காவல் துறை நம்பிக்கையானது',
    capsLock: 'கேப்ஸ் லாக் ஆன் செய்யப்பட்டுள்ளது',

    feat1: 'AI விசாரணை உதவியாளர்',
    feat2: 'குற்ற ஹாட்ஸ்பாட் பகுப்பாய்வு',
    feat3: 'குற்றவியல் நெட்வொர்க் வரைபடம்',
    feat4: 'டிஜிட்டல் வழக்கு கோப்புகள்',

    stat1: '20 லட்சம்+',
    stat1Label: 'பரிவர்த்தனை பதிவுகள்',
    stat2: '24,873',
    stat2Label: 'வங்கி கணக்குகள்',
    stat3: '19,96,412',
    stat3Label: 'பணப் பரிமாற்றங்கள்',

    selectLang: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    offlineNotice: '100% ஆஃப்லைன் பல மொழி செயலில் உள்ளது'
  },

  te: {
    brandName: 'అభేద్య-చక్ర',
    brandSub: 'సైబర్ ఫొరెన్సిక్ లెడ్జర్ సిస్టమ్',
    goodMorning: 'శుభోదయం',

    dashboard: 'డాష్‌బోర్డ్',
    detective: 'ఇన్వెస్టిగేషన్ ఇంజిన్',
    aiHub: 'AI హబ్',
    hotspots: 'హాట్‌స్పాట్‌లు',
    trends: 'నేర ట్రెండ్‌లు',
    network: 'నెట్‌వర్క్',
    audit: 'ఆడిట్ చైన్',

    role: 'పాత్ర',
    station: 'పోలీస్ స్టేషన్',
    lastLogin: 'చివరి లాగిన్',
    provider: 'ప్రొవైడర్',
    changePassword: 'పాస్‌వర్డ్ మార్చండి',
    logout: 'లాగ్ అవుట్',

    changePasswordTitle: 'పాస్‌వర్డ్ మార్చండి',
    oldPassword: 'పాత పాస్‌వర్డ్',
    newPassword: 'కొత్త పాస్‌వర్డ్',
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయండి',
    updating: 'నవీకరిస్తోంది...',

    officerLogin: 'అధికారి లాగిన్',
    authorizedOnly: 'అధికృత సిబ్బంది మాత్రమే',
    officerId: 'అధికారి ID',
    password: 'పాస్‌వర్డ్',
    rememberMe: 'నన్ను గుర్తుంచుకో',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    signIn: 'సురక్షిత సైన్ ఇన్',
    signingIn: 'ధృవీకరిస్తోంది...',
    invalidCreds: 'తప్పు అధికారి ID లేదా పాస్‌వర్డ్.',
    demoAccounts: 'డెమో ఖాతాలు (క్లిక్ చేయండి)',
    trustedBy: 'పోలీస్ శాఖ నమ్మకమైనది',
    capsLock: 'Caps Lock ఆన్ ఉంది',

    feat1: 'AI దర్యాప్తు సహాయకుడు',
    feat2: 'నేర హాట్‌స్పాట్ విశ్లేషణ',
    feat3: 'నేరస్థుల నెట్‌వర్క్ మ్యాపింగ్',
    feat4: 'డిజిటల్ కేసు ఫైళ్ళు',

    stat1: '20 లక్షలు+',
    stat1Label: 'లావాదేవీల రికార్డులు',
    stat2: '24,873',
    stat2Label: 'బ్యాంకు ఖాతాలు',
    stat3: '19,96,412',
    stat3Label: 'మ్యూల్ బదిలీలు',

    selectLang: 'భాషను ఎంచుకోండి',
    offlineNotice: '100% ఆఫ్‌లైన్ బహుభాషా సౌకర్యం ఉంది'
  },

  gu: {
    brandName: 'અભેદ્ય-ચક્ર',
    brandSub: 'સાયબર ફોરેન્સિક લેજર સિસ્ટમ',
    goodMorning: 'શુભ પ્રભાત',

    dashboard: 'ડેશબોર્ડ',
    detective: 'તપાસ એન્જિન',
    aiHub: 'એઆઈ હબ',
    hotspots: 'હોટસ્પોટ',
    trends: 'ગુના ટ્રેન્ડ્સ',
    network: 'નેટવર્ક',
    audit: 'ઓડિટ ચેઇન',

    role: 'ભૂમિકા',
    station: 'પોલીસ સ્ટેશન',
    lastLogin: 'છેલ્લું લોગિન',
    provider: 'પ્રદાતા',
    changePassword: 'પાસવર્ડ બદલો',
    logout: 'લોગ આઉટ',

    changePasswordTitle: 'પાસવર્ડ બદલો',
    oldPassword: 'જૂનો પાસવર્ડ',
    newPassword: 'નવો પાસવર્ડ',
    submit: 'સબમિટ કરો',
    cancel: 'રદ કરો',
    updating: 'અપડેટ થઈ રહ્યું છે...',

    officerLogin: 'અધિકારી લોગિન',
    authorizedOnly: 'માત્ર અધિકૃત કર્મચારીઓ',
    officerId: 'અધિકારી આઈડી',
    password: 'પાસવર્ડ',
    rememberMe: 'મને યાદ રાખો',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    signIn: 'સુરક્ષિત સાઇન ઇન',
    signingIn: 'પ્રમાણિત થઈ રહ્યું છે...',
    invalidCreds: 'અમાન્ય અધિકારી આઈડી અથવા પાસવર્ડ.',
    demoAccounts: 'ડેમો ખાતાઓ (ક્લિક કરો)',
    trustedBy: 'પોલીસ વિભાગ દ્વારા વિશ્વસનીય',
    capsLock: 'કેપ્સ લોક ચાલુ છે',

    feat1: 'એઆઈ તપાસ સહાયક',
    feat2: 'ગુના હોટસ્પોટ વિશ્લેષણ',
    feat3: 'ગુનાહિત નેટવર્ક મેપિંગ',
    feat4: 'ડિજિટલ કેસ ફાઇલો',

    stat1: '૨૦ લાખ+',
    stat1Label: 'ટ્રાન્ઝેક્શન રેકોર્ડ્સ',
    stat2: '૨૪,૮૭૩',
    stat2Label: 'બેંક ખાતાઓ',
    stat3: '૧૯,૯૬,૪૧૨',
    stat3Label: 'મ્યૂલ ટ્રાન્સફર',

    selectLang: 'ભાષા પસંદ કરો',
    offlineNotice: '૧૦૦% ઑફલાઇન મલ્ટિ-લેંગ્વેજ સક્રિય'
  },

  kn: {
    brandName: 'ಅಭೇದ್ಯ-ಚಕ್ರ',
    brandSub: 'ಸೈಬರ್ ಫೊರೆನ್ಸಿಕ್ ಲೆಡ್ಜರ್ ಸಿಸ್ಟಮ್',
    goodMorning: 'ಶುಭೋದಯ',

    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    detective: 'ತನಿಖಾ ಇಂಜಿನ್',
    aiHub: 'AI ಹಬ್',
    hotspots: 'ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
    trends: 'ಅಪರಾಧ ಪ್ರವೃತ್ತಿಗಳು',
    network: 'ನೆಟ್‌ವರ್ಕ್',
    audit: 'ಆಡಿಟ್ ಚೈನ್',

    role: 'ಪಾತ್ರ',
    station: 'ಪೊಲೀಸ್ ಠಾಣೆ',
    lastLogin: 'ಕೊನೆಯ ಲಾಗಿನ್',
    provider: 'ಪೂರೈಕೆದಾರ',
    changePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ',
    logout: 'ಲಾಗ್ ಔಟ್',

    changePasswordTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ',
    oldPassword: 'ಹಳೆಯ ಪಾಸ್‌ವರ್ಡ್',
    newPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
    submit: 'ಸಲ್ಲಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    updating: 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...',

    officerLogin: 'ಅಧಿಕಾರಿ ಲಾಗಿನ್',
    authorizedOnly: 'ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿ ಮಾತ್ರ',
    officerId: 'ಅಧಿಕಾರಿ ID',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    rememberMe: 'ನನ್ನನ್ನು ನೆನಪಿಸಿಕೊ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    signIn: 'ಸುರಕ್ಷಿತ ಸೈನ್ ಇನ್',
    signingIn: 'ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
    invalidCreds: 'ತಪ್ಪಾದ ಅಧಿಕಾರಿ ID ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.',
    demoAccounts: 'ಡೆಮೋ ಖಾತೆಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ)',
    trustedBy: 'ಪೊಲೀಸ್ ಇಲಾಖೆ ನಂಬಿಕೆ',
    capsLock: 'ಕ್ಯಾಪ್ಸ್ ಲಾಕ್ ಆನ್ ಆಗಿದೆ',

    feat1: 'AI ತನಿಖಾ ಸಹಾಯಕ',
    feat2: 'ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್ ವಿಶ್ಲೇಷಣೆ',
    feat3: 'ಕ್ರಿಮಿನಲ್ ನೆಟ್‌ವರ್ಕ್ ಮ್ಯಾಪಿಂಗ್',
    feat4: 'ಡಿಜಿಟಲ್ ಕೇಸ್ ಫೈಲ್‌ಗಳು',

    stat1: '20 ಲಕ್ಷ+',
    stat1Label: 'ವಹಿವಾಟು ದಾಖಲೆಗಳು',
    stat2: '24,873',
    stat2Label: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗಳು',
    stat3: '19,96,412',
    stat3Label: 'ಮ್ಯೂಲ್ ವರ್ಗಾವಣೆಗಳು',

    selectLang: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    offlineNotice: '100% ಆಫ್‌ಲೈನ್ ಬಹುಭಾಷೆ ಸಕ್ರಿಯವಾಗಿದೆ'
  },

  ml: {
    brandName: 'അഭേദ്യ-ചക്ര',
    brandSub: 'സൈബർ ഫോറൻസിക് ലെഡ്ജർ സിസ്റ്റം',
    goodMorning: 'സുപ്രഭാതം',

    dashboard: 'ഡാഷ്‌ബോർഡ്',
    detective: 'അന്വേഷണ എഞ്ചിൻ',
    aiHub: 'എഐ ഹബ്ബ്',
    hotspots: 'ഹോട്ട്സ്പോട്ടുകൾ',
    trends: 'കുറ്റകൃത്യ ട്രെൻഡുകൾ',
    network: 'നെറ്റ്‌വർക്ക്',
    audit: 'ഓഡിറ്റ് ചെയിൻ',

    role: 'പങ്ക്',
    station: 'പോലീസ് സ്റ്റേഷൻ',
    lastLogin: 'അവസാന ലോഗിൻ',
    provider: 'ദാതാവ്',
    changePassword: 'പാസ്‌വേഡ് മാറ്റുക',
    logout: 'ലോഗ് ഔട്ട്',

    changePasswordTitle: 'പാസ്‌വേഡ് മാറ്റുക',
    oldPassword: 'പഴയ പാസ്‌വേഡ്',
    newPassword: 'പുതിയ പാസ്‌വേഡ്',
    submit: 'സമർപ്പിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    updating: 'അപ്‌ഡേറ്റ് ചെയ്യുന്നു...',

    officerLogin: 'ഓഫീസർ ലോഗിൻ',
    authorizedOnly: 'അംഗീകൃത ജീവനക്കാർക്ക് മാത്രം',
    officerId: 'ഓഫീസർ ഐഡി',
    password: 'പാസ്‌വേഡ്',
    rememberMe: 'എന്നെ ഓർക്കുക',
    forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?',
    signIn: 'സുരക്ഷിത സൈൻ ഇൻ',
    signingIn: 'സ്ഥിരീകരിക്കുന്നു...',
    invalidCreds: 'തെറ്റായ ഓഫീസർ ഐഡി അല്ലെങ്കിൽ പാസ്‌വേഡ്.',
    demoAccounts: 'ഡെമോ അക്കൗണ്ടുകൾ',
    trustedBy: 'പോലീസ് വകുപ്പിന്റെ വിശ്വാസ്യതയിൽ',
    capsLock: 'ക്യാപ്സ് ലോക്ക് ഓൺ ആണ്',

    feat1: 'എഐ അന്വേഷണ സഹായി',
    feat2: 'കുറ്റകൃത്യ ഹോട്ട്സ്പോട്ട് വിശകലനം',
    feat3: 'ക്രിമിനൽ നെറ്റ്‌വർക്ക് മാപ്പിംഗ്',
    feat4: 'ഡിജിറ്റൽ കേസ് ഫയലുകൾ',

    stat1: '20 ലക്ഷം+',
    stat1Label: 'ഇടപാട് റെക്കോർഡുകൾ',
    stat2: '24,873',
    stat2Label: 'ബാങ്ക് അക്കൗണ്ടുകൾ',
    stat3: '19,96,412',
    stat3Label: 'മ്യൂൾ കൈമാറ്റങ്ങൾ',

    selectLang: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    offlineNotice: '100% ഓഫ്‌ലൈൻ ബഹുഭാഷാ സൗകര്യം'
  },

  pa: {
    brandName: 'ਅਭੇਦ-ਚੱਕਰ',
    brandSub: 'ਸਾਈਬਰ ਫੋਰੈਂਸਿਕ ਲੈਜਰ ਸਿਸਟਮ',
    goodMorning: 'ਸ਼ੁਭ ਸਵੇਰ',

    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    detective: 'ਜਾਂਚ ਇੰਜਣ',
    aiHub: 'ਏਆਈ ਹੱਬ',
    hotspots: 'ਹੌਟਸਪੌਟ',
    trends: 'ਅਪਰਾਧ ਰੁਝਾਨ',
    network: 'ਨੈੱਟਵਰਕ',
    audit: 'ਆਡਿਟ ਚੇਨ',

    role: 'ਭੂਮਿਕਾ',
    station: 'ਪੁਲਿਸ ਥਾਣਾ',
    lastLogin: 'ਆਖਰੀ ਲੌਗਇਨ',
    provider: 'ਪ੍ਰਦਾਤਾ',
    changePassword: 'ਪਾਸਵਰਡ ਬਦਲੋ',
    logout: 'ਲੌਗ ਆਊਟ',

    changePasswordTitle: 'ਪਾਸਵਰਡ ਬਦਲੋ',
    oldPassword: 'ਪੁਰਾਣਾ ਪਾਸਵਰਡ',
    newPassword: 'ਨਵਾਂ ਪਾਸਵਰਡ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    updating: 'ਅੱਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...',

    officerLogin: 'ਅਧਿਕਾਰੀ ਲੌਗਇਨ',
    authorizedOnly: 'ਸਿਰਫ਼ ਅਧਿਕਾਰਤ ਅਮਲਾ',
    officerId: 'ਅਧਿਕਾਰੀ ਆਈਡੀ',
    password: 'ਪਾਸਵਰਡ',
    rememberMe: 'ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    signIn: 'ਸੁਰੱਖਿਅਤ ਸਾਈਨ ਇਨ',
    signingIn: 'ਪ੍ਰਮਾਣਿਤ ਹੋ ਰਿਹਾ ਹੈ...',
    invalidCreds: 'ਗਲਤ ਅਧਿਕਾਰੀ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ।',
    demoAccounts: 'ਡੇਮੋ ਖਾਤੇ (ਕਲਿੱਕ ਕਰੋ)',
    trustedBy: 'ਪੁਲਿਸ ਵਿਭਾਗ ਦੁਆਰਾ ਭਰੋਸੇਯੋਗ',
    capsLock: 'ਕੈਪਸ ਲਾਕ ਚਾਲੂ ਹੈ',

    feat1: 'ਏਆਈ ਜਾਂਚ ਸਹਾਇਕ',
    feat2: 'ਅਪਰਾਧ ਹੌਟਸਪੌਟ ਵਿਸ਼ਲੇਸ਼ਣ',
    feat3: 'ਅਪਰਾਧਿਕ ਨੈੱਟਵਰਕ ਮੈਪਿੰਗ',
    feat4: 'ਡਿਜੀਟਲ ਕੇਸ ਫਾਈਲਾਂ',

    stat1: '20 ਲੱਖ+',
    stat1Label: 'ਲੈਣ-ਦੇਣ ਰਿਕਾਰਡ',
    stat2: '24,873',
    stat2Label: 'ਬੈਂਕ ਖਾਤੇ',
    stat3: '19,96,412',
    stat3Label: 'ਮਿਊਲ ਟ੍ਰਾਂਸਫਰ',

    selectLang: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    offlineNotice: '100% ਔਫਲਾਈਨ ਬਹੁ-ਭਾਸ਼ਾ ਸਰਗਰਮ'
  }
}

const LangContext = createContext({ lang: 'en', t: T.en, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('abhedya_lang') || 'en')

  const setLang = (code) => {
    localStorage.setItem('abhedya_lang', code)
    setLangState(code)
  }

  const currentT = T[lang] || T.en
  const t = new Proxy(currentT, {
    get: (target, prop) => target[prop] || T.en[prop] || prop
  })

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

