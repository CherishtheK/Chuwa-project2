// TODO: submitOnboardingApplication mutation
import { gql } from '@apollo/client';

export const SUBMIT_ONBOARDING_APPLICATION = gql`
  mutation SubmitOnboardingApplication($input: SubmitOnboardingApplicationInput!) {
    submitOnboardingApplication(input: $input) {
      success
      message
      application {
        status
      }
    }
  }
`;