import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import esTranslation from "../locales/es/translation.json";
import frTranslation from "../locales/fr/translation.json";
import ngTranslation from "../locales/ng/translation.json";

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      ng: { translation: ngTranslation },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  })
  .catch((error) => console.error("i18next init failed:", error));

export default i18next;
