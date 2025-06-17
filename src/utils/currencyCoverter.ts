import axios from "axios";
import { Country, type ICountry } from "country-state-city";

let exchangeRates: Record<string, number> = { USD: 1 };
let lastFetched: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  NGN: "₦",
  GBP: "£",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
};

export const fetchExchangeRates = async (baseCurrency: string = "USD") => {
  if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return exchangeRates;
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    exchangeRates = response.data.rates;
    lastFetched = Date.now();
    return exchangeRates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return exchangeRates;
  }
};

export const convertPrice = (price: number, fromCurrency: string, toCurrency: string) => {
  if (fromCurrency === toCurrency) return price;
  const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency] || 1;
  return Number((price * rate).toFixed(2));
};

export const getCurrencySymbol = (currency: string): string => {
  return currencySymbols[currency] || currency;
};

const countryCurrencyMap: Record<string, string> = Country.getAllCountries().reduce(
  (map, country: ICountry) => {
    map[country.isoCode.toUpperCase()] = country.currency && country.currency !== "UNDEFINED" ? country.currency : "USD";
    return map;
  },
  {} as Record<string, string>
);

const countryLanguageMap: Record<string, string> = {
  US: "en",
  ES: "es",
  FR: "fr",
  NG: "ng",
  GB: "en",
  JP: "en",
  CA: "en",
  AU: "en",
  CH: "en",
  CN: "en",
  IN: "en",
};

export const getCurrencyByCountry = (countryCode: string): string =>
  countryCurrencyMap[countryCode.toUpperCase()] || "USD";

export const getLanguageByCountry = (countryCode: string): string =>
  countryLanguageMap[countryCode.toUpperCase()] || "en";

fetchExchangeRates();