declare module 'country-telephone-data' {
  export interface CountryData {
    name: string;
    dialCode: string;
    iso2: string;
  }

  export const allCountries: CountryData[];
}