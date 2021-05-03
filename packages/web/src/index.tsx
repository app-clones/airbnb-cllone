import "antd/dist/antd.css";
import ReactDOM from "react-dom";

import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { Routes } from "./routes";

ReactDOM.render(
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>,
    document.getElementById("root")
);
