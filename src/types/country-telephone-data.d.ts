declare module 'country-telephone-data' {
<<<<<<< HEAD
  export interface CountryData {
    name: string;
    dialCode: string;
    iso2: string;
  }

  export const allCountries: CountryData[];
}
=======
	export interface CountryTelephoneData {
		name: string;
		iso2: string;
		dialCode: string;
	}

	export const allCountries: CountryTelephoneData[];
}
>>>>>>> 46a10fa7d79558f1c407ddab3f9259abc432aae2
