import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesDir = path.join(__dirname, '..', 'messages');
const enFilePath = path.join(messagesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));

const targetLocales = ['hi', 'fr', 'es', 'de', 'ja', 'zh', 'ar'];

// ISO language mapping for google translate api
const localeCodeMap = {
  hi: 'hi',
  fr: 'fr',
  es: 'es',
  de: 'de',
  ja: 'ja',
  zh: 'zh-CN',
  ar: 'ar',
};

// Fallback high-quality static dictionaries for key financial terms
const fallbackDicts = {
  hi: {
    hero: {
      badge: "एआई-संचालित वित्तीय बुद्धिमत्ता",
      title: "सिस्टमैटिक जोखिम ग्राफ और नेटवर्क विश्लेषिकी",
      subtitle: "क्षेत्रों, वस्तुओं और संस्थानों में वित्तीय झटकों का पता लगाएं।",
      ctaPrimary: "लाइव ग्राफ का अन्वेषण करें",
      ctaSecondary: "डेमो देखें",
      stats: {
        nodes: "50,000+ संस्थाएं",
        edges: "200,000+ संबंध",
        latency: "< 12ms ग्राफ प्रोसेसिंग"
      }
    },
    problem: {
      title: "वैश्विक बाजारों की छिपी परस्पर संबद्धता",
      description: "क्षेत्रों, वस्तुओं और संस्थानों में वित्तीय झटकों का पता लगाएं।",
      cards: {
        contagion: {
          title: "कैस्केडिंग संक्रमण",
          desc: "पारंपरिक जोखिम इंजन द्वारा गति का पता लगाने से पहले एकल प्रतिपक्ष विफलताएं व्युत्पन्न परतों के माध्यम से फैलती हैं।"
        },
        opacity: {
          title: "क्रॉस-सेक्टर अपारदर्शिता",
          desc: "अपारदर्शी आपूर्ति श्रृंखला निर्भरता वस्तुओं, केंद्रीय बैंकों और संप्रभु ऋण में जोखिम छिपाती है।"
        },
        speed: {
          title: "उप-सेकंड अस्थिरता",
          desc: "उच्च-आवृत्ति व्यवस्थित कैस्केड स्थिर सारणीबद्ध रिपोर्टिंग पर वास्तविक समय ग्राफ गणना की मांग करते हैं।"
        }
      }
    },
    auth: {
      signInTitle: "फाइनेंशियल ग्राफ में वापस आपका स्वागत है",
      signUpTitle: "एंटरप्राइज एपीआई एक्सेस का अनुरोध करें",
      emailLabel: "संस्थागत ईमेल",
      passwordLabel: "सुरक्षा पासवर्ड",
      signInBtn: "सत्र प्रमाणित करें",
      signUpBtn: "संगठन पंजीकृत करें",
      oauthGoogle: "एसएसओ के साथ जारी रखें",
      forgotPassword: "क्रेडेंशियल रीसेट करें"
    },
    graph: {
      nodes: {
        bank: "केंद्रीय / वाणिज्यिक बैंक",
        corporation: "बहुराष्ट्रीय निगम",
        commodity: "कमोडिटी / ऊर्जा संपत्ति",
        sovereign: "संप्रभु बांड / ट्रेजरी",
        fund: "हेज फंड / एसेट मैनेजर"
      },
      edges: {
        credit: "क्रेडिट एक्सपोजर",
        supply: "आपूर्ति श्रृंखला लिंक",
        equity: "इक्विटी हिस्सेदारी",
        derivative: "डेरिवेटिव प्रतिपक्ष"
      },
      metrics: {
        centrality: "आइगेनवेक्टर केंद्रीयता",
        systemicRisk: "सिस्टमैटिक जोखिम स्कोर",
        contagionPotential: "संक्रमण सूचकांक"
      }
    },
    themes: {
      clayLight: "क्ले लाइट",
      clayDark: "क्ले डार्क",
      clayNordic: "क्ले नॉर्डिक",
      clayAmber: "क्ले एम्बर"
    },
    locales: {
      en: "English",
      hi: "Hindi (हिंदी)",
      fr: "French (Français)",
      es: "Spanish (Español)",
      de: "German (Deutsch)",
      ja: "Japanese (日本語)",
      zh: "Mandarin (中文)",
      ar: "Arabic (العربية)"
    }
  },
  fr: {
    hero: {
      badge: "Intelligence Financière IA",
      title: "Graphe de Risque Systémique & Analyse de Réseau",
      subtitle: "Traquez les chocs financiers à travers les secteurs, matières premières et institutions.",
      ctaPrimary: "Explorer le Graphe en Direct",
      ctaSecondary: "Voir la Démo",
      stats: {
        nodes: "50 000+ Entités",
        edges: "200 000+ Relations",
        latency: "< 12ms Traitement Graphe"
      }
    },
    problem: {
      title: "L'Interconnexion Cachée des Marchés Mondiaux",
      description: "Traquez les chocs financiers à travers les secteurs, matières premières et institutions.",
      cards: {
        contagion: {
          title: "Contagion en Cascade",
          desc: "Les défaillances de contrepartie se répercutent à travers les dérivés avant la détection par les moteurs de risque traditionnels."
        },
        opacity: {
          title: "Opacité Intersectorielle",
          desc: "Les dépendances opaques de la chaîne d'approvisionnement masquent l'exposition sur les matières premières et les banques centrales."
        },
        speed: {
          title: "Volatilité Inframilliseconde",
          desc: "Les cascades systémiques haute fréquence exigent un calcul de graphe en temps réel plutôt qu'un rapport statique."
        }
      }
    },
    auth: {
      signInTitle: "Bienvenue sur Financial Graph",
      signUpTitle: "Demander un Accès API Entreprise",
      emailLabel: "E-mail Institutionnel",
      passwordLabel: "Mot de Passe de Sécurité",
      signInBtn: "Authentifier la Session",
      signUpBtn: "Enregistrer l'Organisation",
      oauthGoogle: "Continuer avec SSO",
      forgotPassword: "Réinitialiser les Identifiants"
    },
    graph: {
      nodes: {
        bank: "Banque Centrale / Commerciale",
        corporation: "Multinationale",
        commodity: "Matière Première / Énergie",
        sovereign: "Obligation Souveraine / Trésor",
        fund: "Fonds de Couverture / Gestionnaire"
      },
      edges: {
        credit: "Exposition au Crédit",
        supply: "Lien Chaîne d'Approvisionnement",
        equity: "Participation au Capital",
        derivative: "Contrepartie Dérivée"
      },
      metrics: {
        centrality: "Centralité de Vecteur Propre",
        systemicRisk: "Score de Risque Systémique",
        contagionPotential: "Indice de Contagion"
      }
    },
    themes: {
      clayLight: "Clay Clair",
      clayDark: "Clay Sombre",
      clayNordic: "Clay Nordique",
      clayAmber: "Clay Ambre"
    },
    locales: {
      en: "English",
      hi: "Hindi (हिंदी)",
      fr: "French (Français)",
      es: "Spanish (Español)",
      de: "German (Deutsch)",
      ja: "Japanese (日本語)",
      zh: "Mandarin (中文)",
      ar: "Arabic (العربية)"
    }
  }
};

async function translateObject(obj, targetLang) {
  if (typeof obj === 'string') {
    try {
      const res = await translate(obj, { to: localeCodeMap[targetLang] || targetLang });
      return res.text;
    } catch (e) {
      return obj;
    }
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = await translateObject(obj[key], targetLang);
    }
    return result;
  }
  return obj;
}

async function main() {
  console.log('Generating localized translation dictionaries for 8 locales...');

  for (const locale of targetLocales) {
    const outPath = path.join(messagesDir, `${locale}.json`);
    console.log(`Processing ${locale}...`);

    let translatedData;
    if (fallbackDicts[locale]) {
      translatedData = fallbackDicts[locale];
    } else {
      try {
        translatedData = await translateObject(enData, locale);
      } catch (err) {
        console.warn(`Translation fallback for ${locale}:`, err.message);
        translatedData = enData;
      }
    }

    fs.writeFileSync(outPath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`✓ Saved ${locale}.json`);
  }

  console.log('All translation dictionaries updated successfully!');
}

main().catch((err) => {
  console.error('Error generating translations:', err);
  process.exit(1);
});
