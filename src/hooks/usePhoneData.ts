import { useState } from "react";
import { allCountries } from "country-telephone-data";

export const usePhoneData = () => {
  const [countryCode, setCountryCode] = useState("591");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [originalCountryCode, setOriginalCountryCode] = useState("591");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");

  const applyPhoneNumber = (phone: string) => {
    if (!phone) {
      setCountryCode("591");
      setPhoneNumber("");
      setOriginalCountryCode("591");
      setOriginalPhoneNumber("");
      return;
    }

    const foundCountry = allCountries.find(country =>
      phone.startsWith("+" + country.dialCode)
    );

    if (foundCountry) {
      const numberWithoutCode =
        phone.replace(
          "+" + foundCountry.dialCode,
          ""
        );

      setCountryCode(foundCountry.dialCode);
      setPhoneNumber(numberWithoutCode);

      setOriginalCountryCode(foundCountry.dialCode);
      setOriginalPhoneNumber(numberWithoutCode);
    } else {
      setPhoneNumber(phone);
      setOriginalPhoneNumber(phone);
    }
  };

  return {
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
    originalCountryCode,
    originalPhoneNumber,
    applyPhoneNumber,
  };
};