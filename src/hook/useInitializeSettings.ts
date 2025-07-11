import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setSettings } from "@/redux/slices/settingsSlice";
import axios from "axios";
import i18next from "@/utils/i18n";

export const useInitializeSettings = () => {
  const dispatch = useDispatch();
  const { countryCode, currency, language } = useSelector((state: RootState) => state.settings);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      if (hasInitialized) {
        console.log("Settings already initialized:", { countryCode, currency, language });
        return;
      }

      console.log("Current settings:", { countryCode, currency, language });
      try {
        const response = await axios.get("https://api.ipapi.com/api/check", {
          params: { access_key: process.env.REACT_APP_IPAPI_KEY || "cb5d9768299e8e50169f3852db196ebc" },
        });
        console.log("ipapi.com response:", response.data);

        const { country_code, currency: apiCurrency, languages } = response.data;
        const newCountryCode = country_code?.toUpperCase() || "NG";
        const newCurrency = apiCurrency?.code || (newCountryCode === "NG" ? "NGN" : "USD");
        const newLanguage = languages?.split(",")[0]?.split("-")[0] || (newCountryCode === "NG" ? "ng" : "en");

        dispatch(setSettings({
          countryCode: newCountryCode,
          currency: newCurrency,
          language: newLanguage,
        }));
        await i18next.changeLanguage(newLanguage);
        console.log("Updated settings:", { countryCode: newCountryCode, currency: newCurrency, language: newLanguage });
        setHasInitialized(true);
      } catch (error) {
        console.error("Geolocation failed:", error);
        dispatch(setSettings({
          countryCode: "NG",
          currency: "NGN",
          language: "ng",
        }));
        await i18next.changeLanguage("ng");
        console.log("Applied default settings: NG/NGN/ng");
        setHasInitialized(true);
      }
    };

    initializeSettings();
  }, [dispatch, hasInitialized]);
};