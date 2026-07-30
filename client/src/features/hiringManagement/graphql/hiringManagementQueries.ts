import { gql, type TypedDocumentNode } from "@apollo/client";

export interface TokenRow {
  id: string;
  invitedName: string;
  invitedEmail: string;
  link: string;
  expireAt: string;
  used: boolean;
  applicationSubmitted: boolean;
  createdAt: string;
}

export interface AppSummary {
  owner: string;
  firstName: string;
  lastName: string;
  onboardEmail: string;
  status: string;
}

export const REGISTRATION_TOKENS: TypedDocumentNode<{
  registrationTokens: TokenRow[];
}> = gql`
  query RegistrationTokens {
    registrationTokens {
      id
      invitedName
      invitedEmail
      link
      expireAt
      used
      applicationSubmitted
      createdAt
    }
  }
`;

export const APPLICATIONS_BY_STATUS: TypedDocumentNode<
  { applicationsByStatus: AppSummary[] },
  { status: string }
> = gql`
  query ApplicationsByStatus($status: Status!) {
    applicationsByStatus(status: $status) {
      owner
      firstName
      lastName
      onboardEmail
      status
    }
  }
`;

export const GENERATE_TOKEN: TypedDocumentNode<
  { generateRegistrationToken: { success: boolean; message: string | null } },
  { input: { invitedName: string; invitedEmail: string } }
> = gql`
  mutation GenerateToken($input: InviteUserInput!) {
    generateRegistrationToken(input: $input) {
      success
      message
    }
  }
`;
