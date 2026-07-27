export const typeDefs = `#graphql
  type Query {
    hello: String
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

