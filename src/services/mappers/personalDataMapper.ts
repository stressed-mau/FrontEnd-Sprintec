import type { UserInformation } from "@/services/personalDataService";
import type { PersonalDataForm } from "@/utils/personalDataValidationUtils";

export const userHasData = (user: UserInformation): boolean =>
  Boolean(
    user.fullname ||
    user.occupation ||
    user.biography ||
    user.nationality ||
    user.phone_number ||
    user.public_email ||
    user.image_url
  );

export const mapUserToForm = (
  user: UserInformation
): PersonalDataForm => ({
  fullName: user.fullname || "",
  occupation: user.occupation || "",
  bio: user.biography || "",
  location: user.nationality || "",
  email: user.public_email || "",
  image: user.image_url || "",
});
