import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import { resolvers } from "./resolvers";
import { createTypeormConn } from "./utils/createTypeormConn";

export const startServer = async () => {
    const typeDefs = importSchema("src/schema.graphql");

    const server = new GraphQLServer({ typeDefs, resolvers });
    await createTypeormConn();
    await server.start();
    console.log("Server is running on http://localhost:4000");
};

startServer();
