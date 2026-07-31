export interface ContactPerson {
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string | null;
  email: string | null;
  relationship: string;
}

export interface Address {
  apt: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OnboardingApplicationData {
  owner: string;
  status: "NEVER_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  profilePicture: string | null;
  address: Address;
  cellPhone: string;
  workPhone: string | null;
  onboardEmail: string;
  ssn: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "NO_ANSWER";
  isPermanent: boolean;
  citizenshipType: "GREEN_CARD" | "CITIZEN" | null;
  workAuth: "H1B" | "L2" | "F1_CPT_OPT" | "H4" | "OTHER" | null;
  otherVisaTitle: string | null;
  workAuthDoc: string | null;
  visaStartDate: string | null;
  visaEndDate: string | null;
  driversLicense: string | null;
  reference: ContactPerson;
  emergencyContact: ContactPerson[];
  feedback: string | null;
}

export interface MyOnboardingApplicationResult {
  myOnboardingApplication: OnboardingApplicationData | null;
}