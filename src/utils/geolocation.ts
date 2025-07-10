import axios from "axios";
import { getCurrencyByCountry, getLanguageByCountry } from "./currencyCoverter";

const IPAPI_KEY = "cb5d9768299e8e50169f3852db196ebc";

export const getUserCountry = async () => {
  try {
    const response = await axios.get(`https://api.ipapi.com/api/check`, {
      params: { access_key: IPAPI_KEY },
    });
    console.log("ipapi.com response:", response.data); // Log for debugging
    const { country_code, currency, languages } = response.data;
    const countryCode = country_code?.toUpperCase() || "US";
    const currencyCode = currency?.code || getCurrencyByCountry(countryCode);
    const language =
      languages?.split(",")[0]?.split("-")[0] ||
      getLanguageByCountry(countryCode);
    console.log("Processed location:", {
      countryCode,
      currency: currencyCode,
      language,
    });
    return { countryCode, currency: currencyCode, language };
  } catch (error) {
    console.error("ipapi.com geolocation failed:", error);
    // Fallback to ipapi.co (free, no key required)
    try {
      const response = await axios.get("https://ipapi.co/json/");
      console.log("ipapi.co response:", response.data); 
      const { country_code, currency, languages } = response.data;
      const countryCode = country_code?.toUpperCase() || "US";
      const currencyCode = currency?.code || getCurrencyByCountry(countryCode);
      const language =
        languages?.split(",")[0]?.split("-")[0] ||
        getLanguageByCountry(countryCode);
      return { countryCode, currency: currencyCode, language };
    } catch (fallbackError) {
      console.error("ipapi.co fallback failed:", fallbackError);
      return null;
    }
  }
};
