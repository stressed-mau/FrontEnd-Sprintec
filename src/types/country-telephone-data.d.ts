declare module 'country-telephone-data' {
<<<<<<< HEAD
	export interface CountryTelephoneData {
		name: string;
		iso2: string;
		dialCode: string;
	}

	export const allCountries: CountryTelephoneData[];
=======
  export interface CountryData {
    name: string;
    dialCode: string;
    iso2: string;
  }

  export const allCountries: CountryData[];
>>>>>>> 58b0b5fbdc49fb2c3c4f9d6e0a6857da8e7f3f88
}