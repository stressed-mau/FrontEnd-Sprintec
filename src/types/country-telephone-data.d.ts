declare module "country-telephone-data" {
  export type CountryTelephoneEntry = {
    name: string;
    iso2: string;
    dialCode: string;
  };

  export const allCountries: CountryTelephoneEntry[];
}
