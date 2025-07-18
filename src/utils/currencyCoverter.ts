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

export const fetchExchangeRates = async (baseCurrency: string = "NGN") => {
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
    map[country.isoCode.toUpperCase()] = country.currency && country.currency !== "UNDEFINED" ? country.currency : "NGN";
    return map;
  },
  {} as Record<string, string>
);

const countryLanguageMap: Record<string, string> = {
  US: "en",
  GB: "en",
  NG: "en",
  ZA: "en",
  KE: "en",
  JP: "ja",
  FR: "fr",
  DE: "de",
  ES: "es",
  CN: "zh",
  HK: "zh",
  TW: "zh",
  IN: "hi",
  PK: "ur",
  BD: "bn",
  RU: "ru",
  IT: "it",
  NL: "nl",
  BE: "nl",
  CH: "de",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
  PL: "pl",
  PT: "pt",
  BR: "pt",
  MX: "es",
  AR: "es",
  CO: "es",
  VE: "es",
  CA: "en", // English majority
  AU: "en",
  NZ: "en",
  KR: "ko",
  TH: "th",
  TR: "tr",
  IR: "fa",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  MA: "ar",
  DZ: "ar",
  ET: "am",
  VN: "vi",
  MY: "ms",
  ID: "id",
  PH: "en",
};

export const formatPrice = (price: number): string => {
    if (isNaN(price) || price < 0) {
    console.warn("Invalid price for formatting:", price);
    return "0.00";
  }
  return price.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


export const getCurrencyByCountry = (countryCode: string): string =>
  countryCurrencyMap[countryCode.toUpperCase()] || "NGN";

export const getLanguageByCountry = (countryCode: string): string =>
  countryLanguageMap[countryCode.toUpperCase()] || "en";

fetchExchangeRates();