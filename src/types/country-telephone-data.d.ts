declare module 'country-telephone-data' {
	export interface CountryTelephoneData {
		name: string;
		iso2: string;
		dialCode: string;
	}

	export const allCountries: CountryTelephoneData[];
}