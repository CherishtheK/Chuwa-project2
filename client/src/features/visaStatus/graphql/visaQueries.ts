import { gql, type TypedDocumentNode } from "@apollo/client";

export interface VisaDoc {
  id: string;
  type: string;
  filename: string;
  url: string;
  status: string;
  feedback: string | null;
  uploadedAt: string;
}

export interface VisaStep {
  type: string;
  status: string;
  feedback: string | null;
  document: VisaDoc | null;
}

export interface MyVisaStatusData {
  myVisaStatus: {
    isOpt: boolean;
    nextStep: string;
    uploadableType: string | null;
    steps: VisaStep[];
  };
}

export const MY_VISA_STATUS: TypedDocumentNode<MyVisaStatusData> = gql`
  query MyVisaStatus {
    myVisaStatus {
      isOpt
      nextStep
      uploadableType
      steps {
        type
        status
        feedback
        document {
          id
          filename
          url
          status
          feedback
          uploadedAt
        }
      }
    }
  }
`;

//hr visa status management page
export interface VisaEmployeeRow {
  userId: string;
  fullName: string;
  email: string;
  workAuth: string | null;
  visaStartDate: string | null;
  visaEndDate: string | null;
  daysRemaining: number | null;
  nextStep: string;
  pendingDocument: VisaDoc | null;
  documents: VisaDoc[];
}

export const VISA_EMPLOYEES: TypedDocumentNode<
  { visaEmployees: VisaEmployeeRow[] },
  { search?: string; inProgressOnly?: boolean }
> = gql`
  query VisaEmployees($search: String, $inProgressOnly: Boolean) {
    visaEmployees(search: $search, inProgressOnly: $inProgressOnly) {
      userId
      fullName
      email
      workAuth
      visaStartDate
      visaEndDate
      daysRemaining
      nextStep
      pendingDocument {
        id
        type
        filename
        url
        status
        feedback
        uploadedAt
      }
      documents {
        id
        type
        filename
        url
        status
        feedback
        uploadedAt
      }
    }
  }
`;

export const REVIEW_DOCUMENT: TypedDocumentNode<
  { reviewDocument: { success: boolean; message: string | null } },
  { documentId: string; decision: "APPROVE" | "REJECT"; feedback?: string }
> = gql`
  mutation ReviewDocument(
    $documentId: ID!
    $decision: ReviewDecision!
    $feedback: String
  ) {
    reviewDocument(
      documentId: $documentId
      decision: $decision
      feedback: $feedback
    ) {
      success
      message
    }
  }
`;

export const SEND_NOTIFICATION: TypedDocumentNode<
  { sendNotification: { success: boolean; message: string | null } },
  { userId: string }
> = gql`
  mutation SendNotification($userId: ID!) {
    sendNotification(userId: $userId) {
      success
      message
    }
  }
`;
