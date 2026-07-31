import { gql, type TypedDocumentNode } from "@apollo/client";
export interface AppDetail {
  owner: string;
  status: string;
  feedback: string | null;
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
  reference: { firstName: string; lastName: string; relationship: string };
  emergencyContact: {
    firstName: string;
    lastName: string;
    phone: string | null;
    relationship: string;
  }[];
}

export const EMPLOYEE_APPLICATION: TypedDocumentNode<
  { employee: AppDetail | null },
  { userId: string }
> = gql`
  query EmployeeApplication($userId: ID!) {
    employee(userId: $userId) {
      owner
      status
      feedback
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

export const REVIEW_APPLICATION: TypedDocumentNode<
  { reviewApplication: { success: boolean; message: string | null } },
  { userId: string; decision: "APPROVE" | "REJECT"; feedback?: string }
> = gql`
  mutation ReviewApplication(
    $userId: ID!
    $decision: ReviewDecision!
    $feedback: String
  ) {
    reviewApplication(
      userId: $userId
      decision: $decision
      feedback: $feedback
    ) {
      success
      message
    }
  }
`;
