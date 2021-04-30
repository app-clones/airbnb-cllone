import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import { GraphQLSchema } from "graphql";
import Redis from "ioredis";

import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { mergeSchemas } from "@graphql-tools/merge";

import { createTypeormConn } from "./utils/createTypeormConn";
import { User } from "./entity/User";

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

    const redis = new Redis();
    const server = new GraphQLServer({
        // @ts-ignore
        schema: mergeSchemas({ schemas }),
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host")
        })
    });

    server.express.get("/confirm/:id", async (req, res) => {
        const { id } = req.params;
        const userId = await redis.get(id);
        if (userId) {
            await User.update({ id: userId }, { confirmed: true });
            return res.send("Ok");
        } else {
            return res.status(401).send("Invalid code");
        }
    });

    await createTypeormConn();
    const app = await server.start();
    console.log("Server is running on http://localhost:4000");

    return { app, redis };
};
