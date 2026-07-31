import { gql } from "@apollo/client";

export const UPDATE_NAME_SECTION = gql`
  mutation UpdateNameSection($input: UpdateNameInput!) {
    updateNameSection(input: $input) {
      success
      message
      application {
        firstName
        lastName
        middleName
        preferredName
        profilePicture
      }
    }
  }
`;

export const UPDATE_ADDRESS_SECTION = gql`
  mutation UpdateAddressSection($input: AddressInput!) {
    updateAddressSection(input: $input) {
      success
      message
      application {
        address {
          apt
          street
          city
          state
          zip
        }
      }
    }
  }
`;

export const UPDATE_CONTACT_SECTION = gql`
  mutation UpdateContactSection($input: UpdateContactInput!) {
    updateContactSection(input: $input) {
      success
      message
      application {
        cellPhone
        workPhone
      }
    }
  }
`;

export const UPDATE_EMERGENCY_CONTACT_SECTION = gql`
  mutation UpdateEmergencyContactSection($input: [ContactPersonInput!]!) {
    updateEmergencyContactSection(input: $input) {
      success
      message
      application {
        emergencyContact {
          firstName
          lastName
          middleName
          phone
          email
          relationship
        }
      }
    }
  }
`;