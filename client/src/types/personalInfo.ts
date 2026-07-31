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

export interface MyPersonalInfoData {
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
  emergencyContact: ContactPerson[];
}

export interface MyPersonalInfoResult {
  myPersonalInfo: MyPersonalInfoData | null;
}

export interface UpdatePersonalInfoResult {
  success: boolean;
  message: string | null;
  application: MyPersonalInfoData | null;
}

export interface UpdateNameResult {
  updateNameSection: UpdatePersonalInfoResult;
}
export interface UpdateNameVariables {
  input: {
    firstName: string;
    lastName: string;
    middleName?: string;
    preferredName?: string;
    profilePicture?: string;
  };
}

export interface UpdateAddressResult {
  updateAddressSection: UpdatePersonalInfoResult;
}
export interface UpdateAddressVariables {
  input: {
    apt?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface UpdateContactResult {
  updateContactSection: UpdatePersonalInfoResult;
}
export interface UpdateContactVariables {
  input: {
    cellPhone: string;
    workPhone?: string;
  };
}

export interface UpdateEmergencyContactResult {
  updateEmergencyContactSection: UpdatePersonalInfoResult;
}


export interface ContactPersonInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  email?: string;
  relationship: string;
}

export interface UpdateEmergencyContactVariables {
  input: ContactPersonInput[];
}