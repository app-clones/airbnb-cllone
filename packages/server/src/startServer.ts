import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import { GraphQLSchema } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";

import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { mergeSchemas } from "@graphql-tools/merge";

import { createTypeormConn } from "./utils/createTypeormConn";
import redis from "./utils/redis";
import { confirmEmail } from "./routes/confirmEmail";

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

    const server = new GraphQLServer({
        // @ts-ignore
        schema: mergeSchemas({ schemas }),
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host"),
            req: request
        })
    });

    const RedisStore = connectRedis(session);

    server.express.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: "qid",
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            }
        })
    );

    const cors = {
        credentials: true,
        origin: "http://localhost:3000"
    };

    server.express.get("/confirm/:id", confirmEmail);

    await createTypeormConn();
    const app = await server.start({ cors });
    console.log("Server is running on http://localhost:4000");

    return { app, redis };
};
