import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: process.env.REACT_APP_SERVER_URL,
    credentials: "include",
    cache: new InMemoryCache()
});
