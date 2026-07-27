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

  type User {
    id: ID!
    userName: String!
    email: String!
    role: String!
  }

  input CreateUserInput {
    token: String!
    registerName: String!
    registerEmail: String!
    password: String!
  }

  type AuthResult {
    success: Boolean!
    message: String
    token: String
    user: User
  }

  type Mutation {
    generateRegistrationToken(input: InviteUserInput!): RegistrationResult!
    register(input: CreateUserInput!): AuthResult!
  }
`;

