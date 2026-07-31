import { gql } from "@apollo/client";

export const MY_PERSONAL_INFO_QUERY = gql`
  query MyPersonalInfo {
    myPersonalInfo {
      firstName
      lastName
      middleName
      preferredName
      profilePicture
      address {
        apt
        street
        city
        state
        zip
      }
      cellPhone
      workPhone
      onboardEmail
      ssn
      dob
      gender
      isPermanent
      citizenshipType
      workAuth
      otherVisaTitle
      workAuthDoc
      driversLicense
      visaStartDate
      visaEndDate
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
`;