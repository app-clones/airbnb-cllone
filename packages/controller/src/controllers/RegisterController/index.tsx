import { PureComponent } from "react";

import { ChildMutateProps, graphql } from "@apollo/client/react/hoc";
import { gql } from "@apollo/client";
import {
    RegisterMutation,
    RegisterMutationVariables
} from "../../types/graphql/RegisterMutation";

interface Props {
    children: (data: {
        submit: (values: RegisterMutationVariables) => Promise<null>;
    }) => JSX.Element | null;
}

class C extends PureComponent<
    ChildMutateProps<Props, RegisterMutation, RegisterMutationVariables>
> {
    submit = async (values: RegisterMutationVariables) => {
        console.log(values);
        const response = await this.props.mutate({ variables: values });
        console.log(response);
        return null;
    };

    render() {
        return this.props.children({ submit: this.submit });
    }
}

const registerMutation = gql`
    mutation RegisterMutation($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            path
            message
        }
    }
`;

export const RegisterController = graphql<
    Props,
    RegisterMutation,
    RegisterMutationVariables
>(registerMutation)(C);
