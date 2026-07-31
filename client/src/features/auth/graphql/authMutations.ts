import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user {
        id
        userName
        role
      }
    }
  }
`;



export const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
        message
        success
        token
        user {
        email
        id
        userName
        }
    }
  }
`;


