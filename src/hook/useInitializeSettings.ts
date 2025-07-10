import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setSettings } from "@/redux/slices/settingsSlice";
import { getUserCountry } from "@/utils/geolocation";
import i18next from "@/utils/i18n";
import { toast } from "react-toastify";
import { fetchExchangeRates } from "@/utils/currencyCoverter";

export const useInitializeSettings = () => {
  const dispatch = useDispatch();
  const { countryCode } = useSelector((state: RootState) => state.settings);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      // Only run on first load
      if (hasInitialized) {
        console.log("Settings already initialized, skipping geolocation");
        return;
      }

      console.log("Current settings:", { countryCode });
      const locationData = await getUserCountry();
      if (locationData) {
        const { countryCode, currency, language } = locationData;
        console.log("Updating settings:", { countryCode, currency, language });
        dispatch(setSettings({ countryCode, currency, language }));
        await i18next.changeLanguage(language);
        await fetchExchangeRates(currency);
        setHasInitialized(true);
      } else {
        console.log("Location detection failed, using defaults");
        toast.warn("Unable to detect location. Using default settings.");
        dispatch(setSettings({ countryCode: "US", currency: "USD", language: "en" }));
        setHasInitialized(true);
      }
    };

    initializeSettings();
  }, [dispatch, hasInitialized]);
};