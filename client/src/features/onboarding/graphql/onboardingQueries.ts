import { gql } from '@apollo/client';

export const MY_ONBOARDING_APPLICATION_QUERY = gql`
  query MyOnboardingApplication {
    myOnboardingApplication {
        owner
        status
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
        visaStartDate
        visaEndDate
        driversLicense
        reference {
        firstName
        lastName
        middleName
        phone
        email
        relationship
        }
        emergencyContact {
        firstName
        lastName
        middleName
        phone
        email
        relationship
        }
        feedback
    }
  }
`