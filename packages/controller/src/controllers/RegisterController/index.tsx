import { PureComponent } from "react";

import { ChildMutateProps, graphql } from "@apollo/client/react/hoc";
import { gql } from "@apollo/client";

interface Props {
    children: (data: {
        submit: (values: any) => Promise<null>;
    }) => JSX.Element | null;
}

class C extends PureComponent<ChildMutateProps<Props>> {
    submit = async (values: any) => {
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
    mutation($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            path
            message
        }
    }
`;

export const RegisterController = graphql(registerMutation)(C);
