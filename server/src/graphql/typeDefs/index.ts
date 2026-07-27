export const typeDefs = `#graphql
  type TokenValidationResult {
    valid: Boolean!
    email: String
  }

  type Query {
    hello: String
    validateRegistrationToken(token: String!): TokenValidationResult
  }

  input InviteUserInput {
    invitedName: String!
    invitedEmail: String!
  }

  type RegistrationResult { 
    success: Boolean!, message: String 
  }


  type Mutation {
    generateRegistrationToken(input: InviteUserInput!): RegistrationResult
  }
`;

