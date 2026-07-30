export const visaTypeDefs = `#graphql

  type VisaDocument {
    id: ID!
    type: String!
    filename: String!
    fileSize: Int!
    url: String!            
    status: String!
    feedback: String
    uploadedAt: String!
  }

  type VisaStep {
    type: String!
    status: String!         
    feedback: String
    document: VisaDocument
  }

  type MyVisaStatus {
    isOpt: Boolean!         
    steps: [VisaStep!]!
    nextStep: String!
    uploadableType: String
  }

  enum ReviewDecision {
    APPROVE
    REJECT
  }

  type ReviewResult {
    success: Boolean!
    message: String
    document: VisaDocument
  }

  type NotifyResult {
    success: Boolean!
    message: String
  }

  extend type Query {
    myVisaStatus: MyVisaStatus!
  }

  extend type Mutation {
    reviewDocument(documentId: ID!, decision: ReviewDecision!, feedback: String): ReviewResult!
    sendNotification(userId: ID!): NotifyResult!
  }
`;
