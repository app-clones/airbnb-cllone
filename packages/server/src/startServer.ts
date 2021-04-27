import { GraphQLServer } from "graphql-yoga";
import * as fs from "fs";
import * as path from "path";
import { GraphQLSchema } from "graphql";

import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { mergeSchemas } from "@graphql-tools/merge";

import { createTypeormConn } from "./utils/createTypeormConn";

export const startServer = async () => {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname, "modules"));

    folders.forEach((folder) => {
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = loadSchemaSync(
            path.join(__dirname, `./modules/${folder}/schema.graphql`),
            {
                loaders: [new GraphQLFileLoader()]
            }
        );
        schemas.push(addResolversToSchema({ schema: typeDefs, resolvers }));
    });

    const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) });
    await createTypeormConn();
    const app = await server.start();
    console.log("Server is running on http://localhost:4000");

    return app;
};
