import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Platform } from "react-native";

const host = Platform.OS === "ios" ? "localhost" : "http://10.0.2.2";

export const client = new ApolloClient({
    uri: `${host}:4000`,
    cache: new InMemoryCache()
});
