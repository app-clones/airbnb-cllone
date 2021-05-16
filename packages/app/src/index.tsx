import React from "react";
import { ApolloProvider } from "@apollo/client/react";

import { client } from "./apollo";
import { Routes } from "./routes";

export default class App extends React.PureComponent {
    render() {
        return (
            <ApolloProvider client={client}>
                <Routes />
            </ApolloProvider>
        );
    }
}
