/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterMutation
// ====================================================

export interface RegisterMutation_register {
    __typename: "Error";
    path: string;
    message: string | null;
}

export interface RegisterMutation {
    register: RegisterMutation_register[] | null;
}

export interface RegisterMutationVariables {
    email: string;
    password: string;
}
