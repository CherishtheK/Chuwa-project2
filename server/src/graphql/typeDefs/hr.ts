export const hrTypeDefs = `#graphql

  type EmployeeRow {
    userId: ID!
    fullName: String!
    preferredName: String
    ssn: String!
    workAuth: String
    phone: String!
    email: String!
  }

  type VisaEmployeeRow {
    userId: ID!
    fullName: String!
    email: String!
    workAuth: String
    visaStartDate: String
    visaEndDate: String
    daysRemaining: Int
    nextStep: String!
    pendingDocument: VisaDocument
  }

  type RegistrationTokenRow {
    id: ID!
    invitedName: String!
    invitedEmail: String!
    expireAt: String!
    used: Boolean!
    applicationSubmitted: Boolean!
    createdAt: String!
  }

  extend type Query {
    employees(search: String): [EmployeeRow!]!

    employee(userId: ID!): OnboardingApplication

    applicationsByStatus(status: Status!): [OnboardingApplication!]!

    visaEmployees(search: String, inProgressOnly: Boolean): [VisaEmployeeRow!]!

    registrationTokens: [RegistrationTokenRow!]!
  }

  extend type Mutation {
    reviewApplication(userId: ID!, decision: ReviewDecision!, feedback: String): ReviewResult!
  }
`;
