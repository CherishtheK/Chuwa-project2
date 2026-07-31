import { gql } from '@apollo/client';

export const VALIDATE_REGISTER_TOKEN_QUERY = gql `
    query ValidateRegistrationToken($token: String!) {
    validateRegistrationToken(token: $token) {
        valid
        email
    }
}
`