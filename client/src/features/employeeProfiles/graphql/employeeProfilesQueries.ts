import { gql, type TypedDocumentNode } from "@apollo/client";

export interface EmployeeRow {
  userId: string;
  fullName: string;
  preferredName: string | null;
  ssn: string;
  workAuth: string | null;
  phone: string;
  email: string;
}

export const EMPLOYEES: TypedDocumentNode<
  { employees: EmployeeRow[] },
  { search?: string }
> = gql`
  query Employees($search: String) {
    employees(search: $search) {
      userId
      fullName
      preferredName
      ssn
      workAuth
      phone
      email
    }
  }
`;

export interface EmployeeProfile {
  owner: string;
  status: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  onboardEmail: string;
  ssn: string;
  dob: string;
  gender: string;
  address: {
    apt: string | null;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cellPhone: string;
  workPhone: string | null;
  isPermanent: boolean;
  citizenshipType: string | null;
  workAuth: string | null;
  otherVisaTitle: string | null;
  visaStartDate: string | null;
  visaEndDate: string | null;
  profilePicture: string | null;
  driversLicense: string | null;
  workAuthDoc: string | null;
  reference: { firstName: string; lastName: string; relationship: string };
  emergencyContact: {
    firstName: string;
    lastName: string;
    phone: string | null;
    relationship: string;
  }[];
}

export const EMPLOYEE_PROFILE: TypedDocumentNode<
  { employee: EmployeeProfile | null },
  { userId: string }
> = gql`
  query EmployeeProfile($userId: ID!) {
    employee(userId: $userId) {
      owner
      status
      firstName
      lastName
      middleName
      preferredName
      onboardEmail
      ssn
      dob
      gender
      address {
        apt
        street
        city
        state
        zip
      }
      cellPhone
      workPhone
      isPermanent
      citizenshipType
      workAuth
      otherVisaTitle
      visaStartDate
      visaEndDate
      profilePicture
      driversLicense
      workAuthDoc
      reference {
        firstName
        lastName
        relationship
      }
      emergencyContact {
        firstName
        lastName
        phone
        relationship
      }
    }
  }
`;
