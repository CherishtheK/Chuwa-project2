import { visaTypeDefs } from "./visa";
const authTypeDefs = `#graphql
  type TokenValidationResult {
    valid: Boolean!
    email: String
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

  input LoginInput {
    loginName: String!
    loginPassword: String!
  }
  enum Status {
    NEVER_SUBMITTED
    PENDING
    APPROVED
    REJECTED
  }

  enum Gender {
    MALE
    FEMALE
    NO_ANSWER
  }

  enum VisaType {
    H1B
    L2
    F1_CPT_OPT
    H4
    OTHER
  }

  enum CitizenshipType {
    GREEN_CARD
    CITIZEN
  }

  type ContactPerson {
    firstName: String!
    lastName: String!
    middleName: String
    phone: String
    email: String
    relationship: String!
  }

  type Address {
    apt: String
    street: String!
    city: String!
    state: String!
    zip: String!
  }

  type OnboardingApplication {
    owner: ID!
    status: Status!
    firstName: String!
    lastName: String!
    middleName: String
    preferredName: String
    profilePicture: ID
    address: Address!
    cellPhone: String!
    workPhone: String
    onboardEmail: String!
    ssn: String!
    dob: String!
    gender: Gender!
    isPermanent: Boolean!
    citizenshipType: CitizenshipType
    workAuth: VisaType
    otherVisaTitle: String
    workAuthDoc: ID
    visaStartDate: String
    visaEndDate: String
    driversLicense: ID
    reference: ContactPerson!
    emergencyContact: [ContactPerson!]!
    feedback: String
  }

  input ContactPersonInput {
    firstName: String!
    lastName: String!
    middleName: String
    phone: String
    email: String
    relationship: String!
  }

  input AddressInput {
    apt: String
    street: String!
    city: String!
    state: String!
    zip: String!
  }

  input SubmitOnboardingApplicationInput {
    firstName: String!
    lastName: String!
    middleName: String
    preferredName: String
    profilePicture: ID
    address: AddressInput!
    cellPhone: String!
    workPhone: String
    onboardEmail: String!
    ssn: String!
    dob: String!
    gender: Gender!
    isPermanent: Boolean!
    citizenshipType: CitizenshipType
    workAuth: VisaType
    otherVisaTitle: String
    workAuthDoc: ID
    visaStartDate: String
    visaEndDate: String
    driversLicense: ID
    reference: ContactPersonInput!
    emergencyContact: [ContactPersonInput!]!
  }

  type SubmitOnboardingApplicationResult {
    success: Boolean!
    message: String
    application: OnboardingApplication
  }

  type Query {
    hello: String
    validateRegistrationToken(token: String!): TokenValidationResult
    me: User
    myOnboardingApplication: OnboardingApplication
  }

  type Mutation {
    generateRegistrationToken(input: InviteUserInput!): RegistrationResult!
    register(input: CreateUserInput!): AuthResult!
    login(input: LoginInput!): AuthResult!
    submitOnboardingApplication(input: SubmitOnboardingApplicationInput!): SubmitOnboardingApplicationResult!
  }

  
`;
export const typeDefs = [authTypeDefs, visaTypeDefs];
