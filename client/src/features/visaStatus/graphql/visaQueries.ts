import { gql, type TypedDocumentNode } from "@apollo/client";

export interface VisaDoc {
  id: string;
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
